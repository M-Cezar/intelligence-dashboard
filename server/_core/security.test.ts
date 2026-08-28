import { describe, expect, it } from "vitest";
import fs from "node:fs";
import path from "node:path";
import { normalizeKey } from "../storage";

const indexSource = fs.readFileSync(path.resolve("server/_core/index.ts"), "utf8");
const securitySource = fs.readFileSync(path.resolve("server/_core/security.ts"), "utf8");
const oauthSource = fs.readFileSync(path.resolve("server/_core/oauth.ts"), "utf8");
const sdkSource = fs.readFileSync(path.resolve("server/_core/sdk.ts"), "utf8");
const cookieSource = fs.readFileSync(path.resolve("server/_core/cookies.ts"), "utf8");
const clientConstSource = fs.readFileSync(path.resolve("client/src/const.ts"), "utf8");
const homeSource = fs.readFileSync(path.resolve("client/src/pages/Home.tsx"), "utf8");

describe("API hardening", () => {
  it("limits request bodies to 1mb", () => {
    expect(securitySource).toContain('export const API_BODY_LIMIT = "1mb"');
    expect(indexSource).toContain('express.json({ limit: API_BODY_LIMIT })');
    expect(indexSource).toContain('express.urlencoded({ limit: API_BODY_LIMIT, extended: true })');
  });

  it("enables rate limiting using Express trusted client identity", () => {
    expect(securitySource).toContain("export function apiRateLimit");
    expect(securitySource).toContain("req.ip || req.socket.remoteAddress");
    expect(securitySource).toContain('res.status(429).json({ error: "Too many requests" })');
    expect(indexSource).toContain("app.use(apiRateLimit)");
    expect(indexSource).toContain('app.set("trust proxy", ENV.trustProxyHops)');
  });

  it("sets key security headers and no-store API caching", () => {
    expect(securitySource).toContain('X-Content-Type-Options');
    expect(securitySource).toContain('Content-Security-Policy');
    expect(securitySource).toContain('Strict-Transport-Security');
    expect(securitySource).toContain('Cache-Control", "no-store');
    expect(indexSource).toContain('app.disable("x-powered-by")');
  });
});

describe("OAuth and session hardening", () => {
  it("starts OAuth on the server with a random one-time state", () => {
    expect(clientConstSource).toContain('getLoginUrl = () => "/api/oauth/start"');
    expect(oauthSource).toContain('randomBytes(32).toString("base64url")');
    expect(oauthSource).toContain("timingSafeEqual");
    expect(oauthSource).toContain("Invalid OAuth state");
    expect(oauthSource).toContain("APP_BASE_URL is required in production");
  });

  it("uses short bounded sessions with issuer and audience validation", () => {
    expect(sdkSource).toContain("SESSION_TTL_MS");
    expect(sdkSource).toContain(".setIssuer(SESSION_ISSUER)");
    expect(sdkSource).toContain(".setAudience(payload.appId)");
    expect(sdkSource).toContain("issuer: SESSION_ISSUER");
    expect(sdkSource).toContain("audience: ENV.appId");
    expect(cookieSource).toContain('sameSite: "lax"');
  });

  it("throttles lastSignedIn database writes", () => {
    expect(sdkSource).toContain("LAST_SIGNED_IN_WRITE_INTERVAL_MS");
    expect(sdkSource).toContain("Date.now() - lastSignedIn >= LAST_SIGNED_IN_WRITE_INTERVAL_MS");
  });
});

describe("storage path hardening", () => {
  it("accepts normal object keys", () => {
    expect(normalizeKey("reports/2026/file.pdf")).toBe("reports/2026/file.pdf");
    expect(normalizeKey("/reports/file.pdf")).toBe("reports/file.pdf");
  });

  it("rejects traversal and malformed object keys", () => {
    expect(() => normalizeKey("../secret.txt")).toThrow();
    expect(() => normalizeKey("safe/../secret.txt")).toThrow();
    expect(() => normalizeKey("safe\\secret.txt")).toThrow();
    expect(() => normalizeKey("safe//secret.txt")).toThrow();
    expect(() => normalizeKey(" ")).toThrow();
  });
});

describe("routing regressions", () => {
  it("uses the registered action detail route", () => {
    expect(homeSource).toContain('path="acao"');
    expect(homeSource).not.toContain('path="ativo"');
  });
});
