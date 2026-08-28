import type { NextFunction, Request, Response } from "express";
import { ENV } from "./env";

export const API_BODY_LIMIT = "1mb";
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX_REQUESTS = 120;
const AUTH_RATE_LIMIT_MAX_REQUESTS = 30;
const RATE_BUCKET_MAX_ENTRIES = 10_000;
const SAFE_METHODS = new Set(["GET", "HEAD", "OPTIONS"]);

type RateBucket = { count: number; resetAt: number };
const rateBuckets = new Map<string, RateBucket>();

function getClientKey(req: Request): string {
  const ip = req.ip || req.socket.remoteAddress || "unknown";
  return `${ip}:${req.path.startsWith("/api/oauth") ? "auth" : "api"}`;
}

function pruneExpiredBuckets(now: number) {
  if (rateBuckets.size < RATE_BUCKET_MAX_ENTRIES) return;

  rateBuckets.forEach((bucket, key) => {
    if (bucket.resetAt <= now) rateBuckets.delete(key);
  });

  while (rateBuckets.size >= RATE_BUCKET_MAX_ENTRIES) {
    const oldestKey = rateBuckets.keys().next().value as string | undefined;
    if (!oldestKey) break;
    rateBuckets.delete(oldestKey);
  }
}

function expectedOrigin(req: Request): string | null {
  try {
    if (ENV.appBaseUrl) return new URL(ENV.appBaseUrl).origin;
    const host = req.get("host");
    if (!host) return null;
    return `${req.protocol}://${host}`;
  } catch {
    return null;
  }
}

export function apiSameOriginProtection(req: Request, res: Response, next: NextFunction) {
  if (!req.path.startsWith("/api/") || SAFE_METHODS.has(req.method.toUpperCase())) return next();

  const fetchSite = req.get("sec-fetch-site")?.toLowerCase();
  if (fetchSite === "cross-site") {
    res.status(403).json({ error: "Cross-site API request blocked" });
    return;
  }

  const originHeader = req.get("origin");
  if (!originHeader) return next();

  const allowedOrigin = expectedOrigin(req);
  try {
    const origin = new URL(originHeader).origin;
    if (!allowedOrigin || origin !== allowedOrigin) {
      res.status(403).json({ error: "Cross-origin API request blocked" });
      return;
    }
  } catch {
    res.status(403).json({ error: "Invalid Origin header" });
    return;
  }

  next();
}

export function apiRateLimit(req: Request, res: Response, next: NextFunction) {
  if (!req.path.startsWith("/api/")) return next();

  const now = Date.now();
  pruneExpiredBuckets(now);

  const key = getClientKey(req);
  const maxRequests = req.path.startsWith("/api/oauth")
    ? AUTH_RATE_LIMIT_MAX_REQUESTS
    : RATE_LIMIT_MAX_REQUESTS;

  const current = rateBuckets.get(key);
  const bucket = !current || current.resetAt <= now
    ? { count: 0, resetAt: now + RATE_LIMIT_WINDOW_MS }
    : current;

  bucket.count += 1;
  rateBuckets.set(key, bucket);

  res.setHeader("RateLimit-Limit", maxRequests);
  res.setHeader("RateLimit-Remaining", Math.max(0, maxRequests - bucket.count));
  res.setHeader("RateLimit-Reset", Math.ceil(bucket.resetAt / 1000));

  if (bucket.count > maxRequests) {
    res.setHeader("Retry-After", Math.max(1, Math.ceil((bucket.resetAt - now) / 1000)));
    res.status(429).json({ error: "Too many requests" });
    return;
  }

  next();
}

export function securityHeaders(req: Request, res: Response, next: NextFunction) {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("X-DNS-Prefetch-Control", "off");
  res.setHeader("Referrer-Policy", "no-referrer");
  res.setHeader("Permissions-Policy", "camera=(), microphone=(), geolocation=(self)");
  res.setHeader("Cross-Origin-Opener-Policy", "same-origin");
  res.setHeader("Cross-Origin-Resource-Policy", "same-site");
  res.setHeader("Origin-Agent-Cluster", "?1");
  res.setHeader(
    "Content-Security-Policy",
    [
      "default-src 'self'",
      "base-uri 'self'",
      "frame-ancestors 'none'",
      "object-src 'none'",
      "form-action 'self'",
      "img-src 'self' data: https:",
      "font-src 'self' https://fonts.gstatic.com data:",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "script-src 'self' https://maps.googleapis.com https://maps.gstatic.com",
      "connect-src 'self' https://maps.googleapis.com https://maps.gstatic.com",
      "upgrade-insecure-requests",
    ].join("; ")
  );

  if (req.path.startsWith("/api/")) {
    res.setHeader("Cache-Control", "no-store");
    res.setHeader("Pragma", "no-cache");
  }

  if (process.env.NODE_ENV === "production") {
    res.setHeader("Strict-Transport-Security", "max-age=31536000; includeSubDomains; preload");
  }
  next();
}

export function resetRateLimitsForTests() {
  rateBuckets.clear();
}
