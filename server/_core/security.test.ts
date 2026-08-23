import { describe, expect, it } from "vitest";
import fs from "node:fs";
import path from "node:path";

const indexSource = fs.readFileSync(path.resolve("server/_core/index.ts"), "utf8");
const securitySource = fs.readFileSync(path.resolve("server/_core/security.ts"), "utf8");

describe("basic API hardening", () => {
  it("limits request bodies to 1mb", () => {
    expect(securitySource).toContain('export const API_BODY_LIMIT = "1mb"');
    expect(indexSource).toContain('express.json({ limit: API_BODY_LIMIT })');
    expect(indexSource).toContain('express.urlencoded({ limit: API_BODY_LIMIT, extended: true })');
  });

  it("enables rate limiting for API routes", () => {
    expect(securitySource).toContain("export function apiRateLimit");
    expect(securitySource).toContain('res.status(429).json({ error: "Too many requests" })');
    expect(indexSource).toContain("app.use(apiRateLimit)");
  });

  it("sets key security headers", () => {
    expect(securitySource).toContain('X-Content-Type-Options');
    expect(securitySource).toContain('Content-Security-Policy');
    expect(securitySource).toContain('Strict-Transport-Security');
    expect(indexSource).toContain('app.disable("x-powered-by")');
  });
});
