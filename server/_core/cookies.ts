import type { CookieOptions, Request } from "express";
import { ENV } from "./env";

export function getSessionCookieOptions(
  req: Request
): Pick<CookieOptions, "domain" | "httpOnly" | "path" | "sameSite" | "secure"> {
  const secure = ENV.isProduction || req.secure === true || req.protocol === "https";

  return {
    httpOnly: true,
    path: "/",
    sameSite: "lax",
    secure,
  };
}
