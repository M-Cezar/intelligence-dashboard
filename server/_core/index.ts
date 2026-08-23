import "dotenv/config";
import express, { type NextFunction, type Request, type Response } from "express";
import { createServer } from "http";
import net from "net";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { registerOAuthRoutes } from "./oauth";
import { appRouter } from "../routers";
import { createContext } from "./context";
import { serveStatic, setupVite } from "./vite";

const API_BODY_LIMIT = "1mb";
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX_REQUESTS = 120;
const AUTH_RATE_LIMIT_MAX_REQUESTS = 30;

type RateBucket = { count: number; resetAt: number };
const rateBuckets = new Map<string, RateBucket>();

function getClientKey(req: Request): string {
  const forwarded = req.headers["x-forwarded-for"];
  const forwardedValue = Array.isArray(forwarded) ? forwarded[0] : forwarded;
  const ip = forwardedValue?.split(",")[0]?.trim() || req.socket.remoteAddress || "unknown";
  return `${ip}:${req.path.startsWith("/api/oauth") ? "auth" : "api"}`;
}

function apiRateLimit(req: Request, res: Response, next: NextFunction) {
  if (!req.path.startsWith("/api/")) return next();

  const now = Date.now();
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

function securityHeaders(_req: Request, res: Response, next: NextFunction) {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  res.setHeader("Permissions-Policy", "camera=(), microphone=(), geolocation=(self)");
  res.setHeader("Cross-Origin-Opener-Policy", "same-origin");
  res.setHeader("Cross-Origin-Resource-Policy", "same-site");
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
      "connect-src 'self' https:",
    ].join("; ")
  );
  if (process.env.NODE_ENV === "production") {
    res.setHeader("Strict-Transport-Security", "max-age=31536000; includeSubDomains");
  }
  next();
}

function isPortAvailable(port: number): Promise<boolean> {
  return new Promise(resolve => {
    const server = net.createServer();
    server.listen(port, () => {
      server.close(() => resolve(true));
    });
    server.on("error", () => resolve(false));
  });
}

async function findAvailablePort(startPort: number = 3000): Promise<number> {
  for (let port = startPort; port < startPort + 20; port++) {
    if (await isPortAvailable(port)) {
      return port;
    }
  }
  throw new Error(`No available port found starting from ${startPort}`);
}

async function startServer() {
  const app = express();
  const server = createServer(app);

  app.disable("x-powered-by");
  app.use(securityHeaders);
  app.use(apiRateLimit);
  app.use(express.json({ limit: API_BODY_LIMIT }));
  app.use(express.urlencoded({ limit: API_BODY_LIMIT, extended: true }));

  registerOAuthRoutes(app);

  app.use(
    "/api/trpc",
    createExpressMiddleware({
      router: appRouter,
      createContext,
    })
  );

  if (process.env.NODE_ENV === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  const preferredPort = parseInt(process.env.PORT || "3000");
  const port = await findAvailablePort(preferredPort);

  if (port !== preferredPort) {
    console.log(`Port ${preferredPort} is busy, using port ${port} instead`);
  }

  server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}/`);
  });
}

startServer().catch(console.error);
