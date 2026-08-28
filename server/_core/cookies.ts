import type { CookieOptions, Request } from "express";

export function getSessionCookieOptions(
  req: Request
): Pick<CookieOptions, "domain" | "httpOnly" | "path" | "sameSite" | "secure"> {
  const secure = req.secure === true || req.protocol === "https";

  return {
    httpOnly: true,
    path: "/",
    sameSite: "lax",
    secure,
  };
}
