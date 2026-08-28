const trustProxyHops = Number.parseInt(process.env.TRUST_PROXY_HOPS ?? "0", 10);

export const ENV = {
  appId: process.env.VITE_APP_ID ?? "",
  appBaseUrl: process.env.APP_BASE_URL ?? "",
  cookieSecret: process.env.JWT_SECRET ?? "",
  databaseUrl: process.env.DATABASE_URL ?? "",
  oAuthPortalUrl: process.env.OAUTH_PORTAL_URL ?? process.env.VITE_OAUTH_PORTAL_URL ?? "",
  oAuthServerUrl: process.env.OAUTH_SERVER_URL ?? "",
  ownerOpenId: process.env.OWNER_OPEN_ID ?? "",
  isProduction: process.env.NODE_ENV === "production",
  trustProxyHops: Number.isFinite(trustProxyHops) && trustProxyHops > 0 ? trustProxyHops : 0,
  forgeApiUrl: process.env.BUILT_IN_FORGE_API_URL ?? "",
  forgeApiKey: process.env.BUILT_IN_FORGE_API_KEY ?? "",
};
