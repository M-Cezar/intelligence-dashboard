import express from "express";
import { createServer, type Server } from "node:http";
import { SignJWT } from "jose";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { SESSION_TTL_MS } from "@shared/const";
import { normalizeKey } from "../storage";
import { getSessionCookieOptions } from "./cookies";
import { ENV } from "./env";
import { registerOAuthRoutes } from "./oauth";
import { apiRateLimit, API_BODY_LIMIT, apiSameOriginProtection, resetRateLimitsForTests, securityHeaders } from "./security";
import { sdk } from "./sdk";
import { adminProcedure, protectedProcedure, router } from "./trpc";

const originalEnv = { ...ENV };

async function listen(app: express.Express): Promise<{ server: Server; baseUrl: string }> {
  const server = createServer(app);
  await new Promise<void>((resolve, reject) => {
    server.once("error", reject);
    server.listen(0, "127.0.0.1", () => resolve());
  });
  const address = server.address();
  if (!address || typeof address === "string") throw new Error("Failed to bind test server");
  return { server, baseUrl: `http://127.0.0.1:${address.port}` };
}

async function close(server: Server) {
  await new Promise<void>(resolve => server.close(() => resolve()));
}

beforeEach(() => {
  resetRateLimitsForTests();
  Object.assign(ENV, originalEnv);
});

afterEach(() => {
  Object.assign(ENV, originalEnv);
});

describe("adversarial HTTP tests", () => {
  it("blocks a basic request flood with HTTP 429", async () => {
    const app = express();
    app.use(apiRateLimit);
    app.get("/api/ping", (_req, res) => res.json({ ok: true }));
    const { server, baseUrl } = await listen(app);
    try {
      for (let i = 0; i < 120; i += 1) {
        const response = await fetch(`${baseUrl}/api/ping`);
        expect(response.status).toBe(200);
      }
      const blocked = await fetch(`${baseUrl}/api/ping`);
      expect(blocked.status).toBe(429);
      expect(blocked.headers.get("retry-after")).toBeTruthy();
    } finally {
      await close(server);
    }
  });

  it("does not let spoofed X-Forwarded-For bypass rate limiting by default", async () => {
    const app = express();
    app.use(apiRateLimit);
    app.get("/api/ping", (_req, res) => res.json({ ok: true }));
    const { server, baseUrl } = await listen(app);
    try {
      let finalStatus = 0;
      for (let i = 0; i < 121; i += 1) {
        const response = await fetch(`${baseUrl}/api/ping`, {
          headers: { "x-forwarded-for": `203.0.113.${i % 250}` },
        });
        finalStatus = response.status;
      }
      expect(finalStatus).toBe(429);
    } finally {
      await close(server);
    }
  });

  it("rejects oversized JSON payloads", async () => {
    const app = express();
    app.use(express.json({ limit: API_BODY_LIMIT }));
    app.post("/api/input", (_req, res) => res.json({ ok: true }));
    const { server, baseUrl } = await listen(app);
    try {
      const payload = JSON.stringify({ data: "A".repeat(1_100_000) });
      const response = await fetch(`${baseUrl}/api/input`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: payload,
      });
      expect(response.status).toBe(413);
    } finally {
      await close(server);
    }
  });

  it("emits the hardened browser/API headers", async () => {
    const app = express();
    app.use(securityHeaders);
    app.get("/api/ping", (_req, res) => res.json({ ok: true }));
    const { server, baseUrl } = await listen(app);
    try {
      const response = await fetch(`${baseUrl}/api/ping`);
      expect(response.headers.get("x-content-type-options")).toBe("nosniff");
      expect(response.headers.get("x-frame-options")).toBe("DENY");
      expect(response.headers.get("referrer-policy")).toBe("no-referrer");
      expect(response.headers.get("cache-control")).toBe("no-store");
      expect(response.headers.get("content-security-policy")).toContain("frame-ancestors 'none'");
    } finally {
      await close(server);
    }
  });

  it("blocks cross-site unsafe API requests using Fetch Metadata", async () => {
    const app = express();
    app.use(apiSameOriginProtection);
    app.post("/api/change", (_req, res) => res.json({ ok: true }));
    const { server, baseUrl } = await listen(app);
    try {
      const response = await fetch(`${baseUrl}/api/change`, {
        method: "POST",
        headers: { "sec-fetch-site": "cross-site" },
      });
      expect(response.status).toBe(403);
    } finally {
      await close(server);
    }
  });

  it("blocks a forged Origin on unsafe API requests", async () => {
    const app = express();
    app.use(apiSameOriginProtection);
    app.post("/api/change", (_req, res) => res.json({ ok: true }));
    const { server, baseUrl } = await listen(app);
    try {
      const response = await fetch(`${baseUrl}/api/change`, {
        method: "POST",
        headers: { origin: "https://attacker.example" },
      });
      expect(response.status).toBe(403);
    } finally {
      await close(server);
    }
  });

  it("allows a same-origin unsafe API request", async () => {
    const app = express();
    app.use(apiSameOriginProtection);
    app.post("/api/change", (_req, res) => res.json({ ok: true }));
    const { server, baseUrl } = await listen(app);
    try {
      const response = await fetch(`${baseUrl}/api/change`, {
        method: "POST",
        headers: { origin: baseUrl },
      });
      expect(response.status).toBe(200);
    } finally {
      await close(server);
    }
  });

  it("forces Secure cookies in production even when proxy metadata is missing", () => {
    ENV.isProduction = true;
    const options = getSessionCookieOptions({ secure: false, protocol: "http" } as any);
    expect(options).toMatchObject({ httpOnly: true, sameSite: "lax", secure: true, path: "/" });
  });
});

describe("authorization bypass attempts", () => {
  const attackRouter = router({
    protectedProbe: protectedProcedure.query(() => "protected"),
    adminProbe: adminProcedure.query(() => "admin"),
  });

  const baseContext = {
    req: {} as any,
    res: {} as any,
  };

  it("rejects protected procedures without a user", async () => {
    const caller = attackRouter.createCaller({ ...baseContext, user: null });
    await expect(caller.protectedProbe()).rejects.toMatchObject({ code: "UNAUTHORIZED" });
  });

  it("rejects a normal user attempting an admin procedure", async () => {
    const caller = attackRouter.createCaller({
      ...baseContext,
      user: { role: "user" } as any,
    });
    await expect(caller.adminProbe()).rejects.toMatchObject({ code: "FORBIDDEN" });
  });

  it("allows the admin procedure only for an admin context", async () => {
    const caller = attackRouter.createCaller({
      ...baseContext,
      user: { role: "admin" } as any,
    });
    await expect(caller.adminProbe()).resolves.toBe("admin");
  });
});

describe("session forgery and replay-style attempts", () => {
  beforeEach(() => {
    ENV.appId = "security-test-app";
    ENV.cookieSecret = "0123456789abcdef0123456789abcdef0123456789abcdef";
  });

  it("rejects a JWT signed with an attacker-controlled secret", async () => {
    const forged = await new SignJWT({ openId: "victim", appId: ENV.appId, name: "Victim" })
      .setProtectedHeader({ alg: "HS256", typ: "JWT" })
      .setIssuer("intelligence-dashboard")
      .setAudience(ENV.appId)
      .setIssuedAt()
      .setExpirationTime("5m")
      .sign(new TextEncoder().encode("attacker-secret-attacker-secret-123456"));

    await expect(sdk.verifySession(forged)).resolves.toBeNull();
  });

  it("rejects expired session tokens", async () => {
    const now = Math.floor(Date.now() / 1000);
    const expired = await new SignJWT({ openId: "victim", appId: ENV.appId, name: "Victim" })
      .setProtectedHeader({ alg: "HS256", typ: "JWT" })
      .setIssuer("intelligence-dashboard")
      .setAudience(ENV.appId)
      .setIssuedAt(now - 120)
      .setExpirationTime(now - 60)
      .sign(new TextEncoder().encode(ENV.cookieSecret));

    await expect(sdk.verifySession(expired)).resolves.toBeNull();
  });

  it("rejects a token issued for another application", async () => {
    const token = await sdk.signSession({ openId: "victim", appId: ENV.appId, name: "Victim" });
    ENV.appId = "different-app";
    await expect(sdk.verifySession(token)).resolves.toBeNull();
  });

  it("refuses sessions longer than the security policy", async () => {
    await expect(
      sdk.signSession(
        { openId: "victim", appId: ENV.appId, name: "Victim" },
        { expiresInMs: SESSION_TTL_MS + 1 },
      ),
    ).rejects.toThrow("outside the allowed security policy");
  });
});

describe("OAuth CSRF/state attacks", () => {
  it("rejects callback requests without the server-issued state cookie", async () => {
    const app = express();
    registerOAuthRoutes(app);
    const { server, baseUrl } = await listen(app);
    try {
      const response = await fetch(`${baseUrl}/api/oauth/callback?code=fake&state=attacker`);
      expect(response.status).toBe(400);
      await expect(response.json()).resolves.toEqual({ error: "Invalid OAuth state" });
    } finally {
      await close(server);
    }
  });

  it("rejects a mismatched OAuth state cookie", async () => {
    const app = express();
    registerOAuthRoutes(app);
    const { server, baseUrl } = await listen(app);
    try {
      const response = await fetch(`${baseUrl}/api/oauth/callback?code=fake&state=attacker`, {
        headers: { cookie: "oauth_state=server-generated-different-state" },
      });
      expect(response.status).toBe(400);
    } finally {
      await close(server);
    }
  });
});

describe("storage traversal attacks", () => {
  it.each([
    "../secret.txt",
    "folder/../secret.txt",
    "./secret.txt",
    "folder//secret.txt",
    "folder\\secret.txt",
    "%2e%2e/secret.txt",
    "%252e%252e/secret.txt",
    "..%2fsecret.txt",
    "%2e%2e%2fsecret.txt",
    "folder/%2e%2e/secret.txt",
    "folder\u0000/secret.txt",
  ])("rejects traversal/malformed key %s", key => {
    expect(() => normalizeKey(key)).toThrow();
  });

  it("still permits a normal nested storage key", () => {
    expect(normalizeKey("reports/2026/summary.pdf")).toBe("reports/2026/summary.pdf");
  });
});
