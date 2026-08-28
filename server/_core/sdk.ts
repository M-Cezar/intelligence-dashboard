import { ForbiddenError } from "@shared/_core/errors";
import { AXIOS_TIMEOUT_MS, COOKIE_NAME, SESSION_TTL_MS } from "@shared/const";
import axios, { type AxiosInstance } from "axios";
import { parse as parseCookieHeader } from "cookie";
import type { Request } from "express";
import { jwtVerify, SignJWT } from "jose";
import type { User } from "../../drizzle/schema";
import * as db from "../db";
import { ENV } from "./env";
import type {
  ExchangeTokenRequest,
  ExchangeTokenResponse,
  GetUserInfoResponse,
  GetUserInfoWithJwtRequest,
  GetUserInfoWithJwtResponse,
} from "./types/authTypes";

const isNonEmptyString = (value: unknown): value is string =>
  typeof value === "string" && value.length > 0;

const LAST_SIGNED_IN_WRITE_INTERVAL_MS = 15 * 60 * 1000;
const SESSION_ISSUER = "intelligence-dashboard";

export type SessionPayload = {
  openId: string;
  appId: string;
  name: string;
};

const EXCHANGE_TOKEN_PATH = "/webdev.v1.WebDevAuthPublicService/ExchangeToken";
const GET_USER_INFO_PATH = "/webdev.v1.WebDevAuthPublicService/GetUserInfo";
const GET_USER_INFO_WITH_JWT_PATH = "/webdev.v1.WebDevAuthPublicService/GetUserInfoWithJwt";

class OAuthService {
  constructor(private client: ReturnType<typeof axios.create>) {
    if (!ENV.oAuthServerUrl) {
      console.warn("[OAuth] OAUTH_SERVER_URL is not configured");
    }
  }

  async getTokenByCode(code: string, redirectUri: string): Promise<ExchangeTokenResponse> {
    if (!ENV.appId) throw new Error("VITE_APP_ID is required for OAuth");
    if (!ENV.oAuthServerUrl) throw new Error("OAUTH_SERVER_URL is required for OAuth");

    const payload: ExchangeTokenRequest = {
      clientId: ENV.appId,
      grantType: "authorization_code",
      code,
      redirectUri,
    };

    const { data } = await this.client.post<ExchangeTokenResponse>(EXCHANGE_TOKEN_PATH, payload);
    return data;
  }

  async getUserInfoByToken(token: ExchangeTokenResponse): Promise<GetUserInfoResponse> {
    const { data } = await this.client.post<GetUserInfoResponse>(GET_USER_INFO_PATH, {
      accessToken: token.accessToken,
    });
    return data;
  }
}

const createOAuthHttpClient = (): AxiosInstance => axios.create({
  baseURL: ENV.oAuthServerUrl || undefined,
  timeout: AXIOS_TIMEOUT_MS,
});

class SDKServer {
  private readonly client: AxiosInstance;
  private readonly oauthService: OAuthService;

  constructor(client: AxiosInstance = createOAuthHttpClient()) {
    this.client = client;
    this.oauthService = new OAuthService(this.client);
  }

  private deriveLoginMethod(platforms: unknown, fallback: string | null | undefined): string | null {
    if (fallback && fallback.length > 0) return fallback;
    if (!Array.isArray(platforms) || platforms.length === 0) return null;
    const set = new Set<string>(platforms.filter((platform): platform is string => typeof platform === "string"));
    if (set.has("REGISTERED_PLATFORM_EMAIL")) return "email";
    if (set.has("REGISTERED_PLATFORM_GOOGLE")) return "google";
    if (set.has("REGISTERED_PLATFORM_APPLE")) return "apple";
    if (set.has("REGISTERED_PLATFORM_MICROSOFT") || set.has("REGISTERED_PLATFORM_AZURE")) return "microsoft";
    if (set.has("REGISTERED_PLATFORM_GITHUB")) return "github";
    const first = Array.from(set)[0];
    return first ? first.toLowerCase() : null;
  }

  async exchangeCodeForToken(code: string, redirectUri: string): Promise<ExchangeTokenResponse> {
    if (!isNonEmptyString(code) || !isNonEmptyString(redirectUri)) {
      throw new Error("OAuth code and redirectUri are required");
    }
    return this.oauthService.getTokenByCode(code, redirectUri);
  }

  async getUserInfo(accessToken: string): Promise<GetUserInfoResponse> {
    const data = await this.oauthService.getUserInfoByToken({ accessToken } as ExchangeTokenResponse);
    const loginMethod = this.deriveLoginMethod((data as any)?.platforms, (data as any)?.platform ?? data.platform ?? null);
    return { ...(data as any), platform: loginMethod, loginMethod } as GetUserInfoResponse;
  }

  private parseCookies(cookieHeader: string | undefined) {
    if (!cookieHeader) return new Map<string, string>();
    return new Map(Object.entries(parseCookieHeader(cookieHeader)));
  }

  private getSessionSecret() {
    const secret = ENV.cookieSecret;
    if (!secret || secret.length < 32) throw new Error("JWT_SECRET must be configured with at least 32 characters");
    return new TextEncoder().encode(secret);
  }

  async createSessionToken(openId: string, options: { expiresInMs?: number; name?: string } = {}): Promise<string> {
    if (!isNonEmptyString(openId)) throw new Error("openId is required to create a session");
    if (!isNonEmptyString(ENV.appId)) throw new Error("VITE_APP_ID is required to create a session");
    return this.signSession({ openId, appId: ENV.appId, name: options.name ?? "" }, options);
  }

  async signSession(payload: SessionPayload, options: { expiresInMs?: number } = {}): Promise<string> {
    if (!isNonEmptyString(payload.openId) || !isNonEmptyString(payload.appId)) {
      throw new Error("Session requires a valid openId and appId");
    }

    const issuedAt = Date.now();
    const expiresInMs = options.expiresInMs ?? SESSION_TTL_MS;
    if (!Number.isFinite(expiresInMs) || expiresInMs <= 0 || expiresInMs > SESSION_TTL_MS) {
      throw new Error("Session expiration is outside the allowed security policy");
    }

    const expirationSeconds = Math.floor((issuedAt + expiresInMs) / 1000);
    const secretKey = this.getSessionSecret();
    return new SignJWT({ openId: payload.openId, appId: payload.appId, name: payload.name ?? "" })
      .setProtectedHeader({ alg: "HS256", typ: "JWT" })
      .setIssuer(SESSION_ISSUER)
      .setAudience(payload.appId)
      .setIssuedAt(Math.floor(issuedAt / 1000))
      .setExpirationTime(expirationSeconds)
      .sign(secretKey);
  }

  async verifySession(cookieValue: string | undefined | null): Promise<{ openId: string; appId: string; name: string } | null> {
    if (!cookieValue || !ENV.appId) return null;
    try {
      const secretKey = this.getSessionSecret();
      const { payload } = await jwtVerify(cookieValue, secretKey, {
        algorithms: ["HS256"],
        issuer: SESSION_ISSUER,
        audience: ENV.appId,
      });
      const { openId, appId, name } = payload as Record<string, unknown>;
      if (!isNonEmptyString(openId) || !isNonEmptyString(appId) || typeof name !== "string" || appId !== ENV.appId) {
        console.warn("[Auth] Invalid session payload");
        return null;
      }
      return { openId, appId, name };
    } catch {
      console.warn("[Auth] Session verification failed");
      return null;
    }
  }

  async getUserInfoWithJwt(jwtToken: string): Promise<GetUserInfoWithJwtResponse> {
    const payload: GetUserInfoWithJwtRequest = { jwtToken, projectId: ENV.appId };
    const { data } = await this.client.post<GetUserInfoWithJwtResponse>(GET_USER_INFO_WITH_JWT_PATH, payload);
    const loginMethod = this.deriveLoginMethod((data as any)?.platforms, (data as any)?.platform ?? data.platform ?? null);
    return { ...(data as any), platform: loginMethod, loginMethod } as GetUserInfoWithJwtResponse;
  }

  async authenticateRequest(req: Request): Promise<User> {
    const cookies = this.parseCookies(req.headers.cookie);
    const sessionCookie = cookies.get(COOKIE_NAME);
    const session = await this.verifySession(sessionCookie);
    if (!session) throw ForbiddenError("Invalid session cookie");

    const signedInAt = new Date();
    let user = await db.getUserByOpenId(session.openId);
    if (!user) {
      try {
        const userInfo = await this.getUserInfoWithJwt(sessionCookie ?? "");
        if (userInfo.openId !== session.openId) throw new Error("OAuth identity does not match session identity");
        await db.upsertUser({
          openId: userInfo.openId,
          name: userInfo.name || null,
          email: userInfo.email ?? null,
          loginMethod: userInfo.loginMethod ?? userInfo.platform ?? null,
          lastSignedIn: signedInAt,
        });
        user = await db.getUserByOpenId(userInfo.openId);
      } catch (error) {
        console.error("[Auth] Failed to sync user from OAuth:", error instanceof Error ? error.message : "unknown error");
        throw ForbiddenError("Failed to sync user info");
      }
    }

    if (!user) throw ForbiddenError("User not found");

    const lastSignedIn = user.lastSignedIn instanceof Date ? user.lastSignedIn.getTime() : new Date(user.lastSignedIn).getTime();
    if (!Number.isFinite(lastSignedIn) || Date.now() - lastSignedIn >= LAST_SIGNED_IN_WRITE_INTERVAL_MS) {
      await db.upsertUser({ openId: user.openId, lastSignedIn: signedInAt });
    }

    return user;
  }
}

export const sdk = new SDKServer();
