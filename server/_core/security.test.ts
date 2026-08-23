import { describe, expect, it } from "vitest";
import fs from "node:fs";
import path from "node:path";

const source = fs.readFileSync(path.resolve("server/_core/index.ts"), "utf8");

describe("basic API hardening", () => {
  it("limits request bodies to 1mb", () => {
    expect(source).toContain('const API_BODY_LIMIT = "1mb"');
    expect(source).toContain('express.json({ limit: API_BODY_LIMIT })');
    expect(source).toContain('express.urlencoded({ limit: API_BODY_LIMIT, extended: true })');
  });

  it("enables rate limiting for API routes", () => {
    expect(source).toContain("function apiRateLimit");
    expect(source).toContain('res.status(429).json({ error: "Too many requests" })');
    expect(source).toContain("app.use(apiRateLimit)");
  });

  it("sets key security headers", () => {
    expect(source).toContain('X-Content-Type-Options');
    expect(source).toContain('Content-Security-Policy');
    expect(source).toContain('Strict-Transport-Security');
    expect(source).toContain('app.disable("x-powered-by")');
  });
});
