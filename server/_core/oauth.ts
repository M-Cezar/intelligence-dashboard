import { randomBytes, timingSafeEqual } from "node:crypto";
import { parse as parseCookieHeader } from "cookie";
import { COOKIE_NAME, SESSION_TTL_MS } from "@shared/const";
import type { Express, Request, Response } from "express";
import * as db from "../db";
import { getSessionCookieOptions } from "./cookies";
import { ENV } from "./env";
import { sdk } from "./sdk";

const OAUTH_STATE_COOKIE_NAME = "oauth_state";
const OAUTH_STATE_TTL_MS = 10 * 60 * 1000;

function getQueryParam(req: Request, key: string): string | undefined {
  const value = req.query[key];
  return typeof value === "string" ? value : undefined;
}

function getAppBaseUrl(req: Request): string {
  if (ENV.appBaseUrl) {
    const configured = new URL(ENV.appBaseUrl);
    if (ENV.isProduction && configured.protocol !== "https:") {
      throw new Error("APP_BASE_URL must use HTTPS in production");
    }
    return configured.origin;
  }

  if (ENV.isProduction) {
    throw new Error("APP_BASE_URL is required in production");
  }

  const host = req.get("host");
  if (!host) throw new Error("Host header is required in development");
  return `${req.protocol}://${host}`;
}

function getOAuthRedirectUri(req: Request): string {
  return `${getAppBaseUrl(req)}/api/oauth/callback`;
}

function stateCookieOptions(req: Request) {
  return {
    ...getSessionCookieOptions(req),
    path: "/api/oauth/callback",
    maxAge: OAUTH_STATE_TTL_MS,
  } as const;
}

function safeStateEqual(received: string, expected: string): boolean {
  const a = Buffer.from(received, "utf8");
  const b = Buffer.from(expected, "utf8");
  return a.length === b.length && timingSafeEqual(a, b);
}

export function registerOAuthRoutes(app: Express) {
  app.get("/api/oauth/start", (req: Request, res: Response) => {
    try {
      if (!ENV.appId) throw new Error("VITE_APP_ID is required for OAuth");
      if (!ENV.oAuthPortalUrl) throw new Error("OAUTH_PORTAL_URL is required for OAuth");

      const redirectUri = getOAuthRedirectUri(req);
      const state = randomBytes(32).toString("base64url");
      const loginUrl = new URL("/app-auth", ENV.oAuthPortalUrl);
      loginUrl.searchParams.set("appId", ENV.appId);
      loginUrl.searchParams.set("redirectUri", redirectUri);
      loginUrl.searchParams.set("state", state);
      loginUrl.searchParams.set("type", "signIn");

      res.cookie(OAUTH_STATE_COOKIE_NAME, state, stateCookieOptions(req));
      res.redirect(302, loginUrl.toString());
    } catch (error) {
      console.error("[OAuth] Start failed", error);
      res.status(500).json({ error: "OAuth is not configured securely" });
    }
  });

  app.get("/api/oauth/callback", async (req: Request, res: Response) => {
    const code = getQueryParam(req, "code");
    const state = getQueryParam(req, "state");
    const cookies = parseCookieHeader(req.headers.cookie ?? "");
    const expectedState = cookies[OAUTH_STATE_COOKIE_NAME];

    if (!code || !state || !expectedState || !safeStateEqual(state, expectedState)) {
      res.status(400).json({ error: "Invalid OAuth state" });
      return;
    }

    res.clearCookie(OAUTH_STATE_COOKIE_NAME, stateCookieOptions(req));

    try {
      const redirectUri = getOAuthRedirectUri(req);
      const tokenResponse = await sdk.exchangeCodeForToken(code, redirectUri);
      const userInfo = await sdk.getUserInfo(tokenResponse.accessToken);

      if (!userInfo.openId) {
        res.status(400).json({ error: "openId missing from user info" });
        return;
      }

      await db.upsertUser({
        openId: userInfo.openId,
        name: userInfo.name || null,
        email: userInfo.email ?? null,
        loginMethod: userInfo.loginMethod ?? userInfo.platform ?? null,
        lastSignedIn: new Date(),
      });

      const sessionToken = await sdk.createSessionToken(userInfo.openId, {
        name: userInfo.name || "",
        expiresInMs: SESSION_TTL_MS,
      });

      const cookieOptions = getSessionCookieOptions(req);
      res.cookie(COOKIE_NAME, sessionToken, { ...cookieOptions, maxAge: SESSION_TTL_MS });
      res.redirect(302, "/");
    } catch (error) {
      console.error("[OAuth] Callback failed", error);
      res.status(500).json({ error: "OAuth callback failed" });
    }
  });
}
