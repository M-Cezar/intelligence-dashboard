import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.mcezar.intelligencedashboard",
  appName: "Intelligence Dashboard",
  webDir: "dist/public",
  server: {
    androidScheme: "https"
  }
};

export default config;
