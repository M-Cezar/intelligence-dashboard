import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const manifestPath = path.join(root, "android/app/src/main/AndroidManifest.xml");
const appGradlePath = path.join(root, "android/app/build.gradle");
const xmlDir = path.join(root, "android/app/src/main/res/xml");
const mainActivityPath = path.join(
  root,
  "android/app/src/main/java/com/mcezar/intelligencedashboard/MainActivity.java"
);

if (!fs.existsSync(manifestPath)) {
  throw new Error(`AndroidManifest.xml not found: ${manifestPath}`);
}
if (!fs.existsSync(appGradlePath)) {
  throw new Error(`Android app build.gradle not found: ${appGradlePath}`);
}

let manifest = fs.readFileSync(manifestPath, "utf8");

const requiredApplicationAttributes = {
  "android:allowBackup": "false",
  "android:fullBackupContent": "false",
  "android:dataExtractionRules": "@xml/data_extraction_rules",
  "android:usesCleartextTraffic": "false",
  "android:networkSecurityConfig": "@xml/network_security_config",
};

manifest = manifest.replace(/<application\b([^>]*)>/, (match, attrs) => {
  let next = attrs;
  for (const [name, value] of Object.entries(requiredApplicationAttributes)) {
    const pattern = new RegExp(`\\s${name.replace(":", "\\:")}="[^"]*"`, "g");
    if (pattern.test(next)) {
      next = next.replace(pattern, ` ${name}="${value}"`);
    } else {
      next += `\n        ${name}="${value}"`;
    }
  }
  return `<application${next}>`;
});

fs.writeFileSync(manifestPath, manifest);
fs.mkdirSync(xmlDir, { recursive: true });

fs.writeFileSync(
  path.join(xmlDir, "network_security_config.xml"),
  `<?xml version="1.0" encoding="utf-8"?>\n<network-security-config>\n    <base-config cleartextTrafficPermitted="false">\n        <trust-anchors>\n            <certificates src="system" />\n        </trust-anchors>\n    </base-config>\n</network-security-config>\n`
);

const backupDomains = [
  "root",
  "file",
  "database",
  "sharedpref",
  "external",
  "device_root",
  "device_file",
  "device_database",
  "device_sharedpref",
];
const exclusions = backupDomains
  .map(domain => `        <exclude domain="${domain}" path="." />`)
  .join("\n");

fs.writeFileSync(
  path.join(xmlDir, "data_extraction_rules.xml"),
  `<?xml version="1.0" encoding="utf-8"?>\n<data-extraction-rules>\n    <cloud-backup disableIfNoEncryptionCapabilities="true">\n${exclusions}\n    </cloud-backup>\n    <device-transfer>\n${exclusions}\n    </device-transfer>\n</data-extraction-rules>\n`
);

fs.mkdirSync(path.dirname(mainActivityPath), { recursive: true });
fs.writeFileSync(
  mainActivityPath,
  `package com.mcezar.intelligencedashboard;\n\nimport android.os.Bundle;\nimport android.webkit.WebSettings;\nimport android.webkit.WebView;\n\nimport com.getcapacitor.BridgeActivity;\n\npublic class MainActivity extends BridgeActivity {\n    @Override\n    protected void onCreate(Bundle savedInstanceState) {\n        super.onCreate(savedInstanceState);\n\n        WebView.setWebContentsDebuggingEnabled(false);\n\n        WebView webView = getBridge().getWebView();\n        WebSettings settings = webView.getSettings();\n        settings.setAllowFileAccess(false);\n        settings.setAllowContentAccess(false);\n        settings.setAllowFileAccessFromFileURLs(false);\n        settings.setAllowUniversalAccessFromFileURLs(false);\n        settings.setMixedContentMode(WebSettings.MIXED_CONTENT_NEVER_ALLOW);\n    }\n}\n`
);

let appGradle = fs.readFileSync(appGradlePath, "utf8");
if (!/buildTypes\s*\{[\s\S]*?debug\s*\{[\s\S]*?debuggable\s+false/.test(appGradle)) {
  appGradle = appGradle.replace(
    /buildTypes\s*\{/,
    `buildTypes {\n        debug {\n            debuggable false\n        }`
  );
}
fs.writeFileSync(appGradlePath, appGradle);

console.log(
  "Android hardening applied: backups disabled, HTTPS-only networking, WebView debug/file access disabled, and debug build marked non-debuggable."
);
