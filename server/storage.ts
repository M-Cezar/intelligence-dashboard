// Storage helpers for the Intelligence Dashboard.
// Uses the configured storage proxy (Authorization: Bearer <token>).

import { ENV } from './_core/env';

type StorageConfig = { baseUrl: string; apiKey: string };

function getStorageConfig(): StorageConfig {
  const baseUrl = ENV.forgeApiUrl;
  const apiKey = ENV.forgeApiKey;

  if (!baseUrl || !apiKey) {
    throw new Error(
      "Storage proxy credentials missing: set BUILT_IN_FORGE_API_URL and BUILT_IN_FORGE_API_KEY"
    );
  }

  const parsed = new URL(baseUrl);
  if (ENV.isProduction && parsed.protocol !== "https:") {
    throw new Error("Storage proxy must use HTTPS in production");
  }

  return { baseUrl: baseUrl.replace(/\/+$/, ""), apiKey };
}

function buildUploadUrl(baseUrl: string, relKey: string): URL {
  const url = new URL("v1/storage/upload", ensureTrailingSlash(baseUrl));
  url.searchParams.set("path", normalizeKey(relKey));
  return url;
}

async function buildDownloadUrl(baseUrl: string, relKey: string, apiKey: string): Promise<string> {
  const downloadApiUrl = new URL("v1/storage/downloadUrl", ensureTrailingSlash(baseUrl));
  downloadApiUrl.searchParams.set("path", normalizeKey(relKey));
  const response = await fetch(downloadApiUrl, { method: "GET", headers: buildAuthHeaders(apiKey) });
  if (!response.ok) {
    throw new Error(`Storage download URL request failed (${response.status})`);
  }
  const payload = await response.json() as { url?: unknown };
  if (typeof payload.url !== "string" || payload.url.length === 0) {
    throw new Error("Storage service returned an invalid download URL");
  }
  return payload.url;
}

function ensureTrailingSlash(value: string): string {
  return value.endsWith("/") ? value : `${value}/`;
}

export function normalizeKey(relKey: string): string {
  if (typeof relKey !== "string") throw new Error("Storage key must be a string");
  const trimmed = relKey.trim().replace(/^\/+/, "");
  if (!trimmed || trimmed.length > 512) throw new Error("Storage key is empty or too long");
  if (trimmed.includes("\\") || trimmed.includes("\0")) throw new Error("Storage key contains invalid characters");

  const segments = trimmed.split("/");
  if (segments.some(segment => !segment || segment === "." || segment === "..")) {
    throw new Error("Storage key contains unsafe path segments");
  }

  return segments.join("/");
}

function toFormData(data: Buffer | Uint8Array | string, contentType: string, fileName: string): FormData {
  const blob = typeof data === "string" ? new Blob([data], { type: contentType }) : new Blob([data as any], { type: contentType });
  const form = new FormData();
  form.append("file", blob, fileName || "file");
  return form;
}

function buildAuthHeaders(apiKey: string): HeadersInit {
  return { Authorization: `Bearer ${apiKey}` };
}

export async function storagePut(relKey: string, data: Buffer | Uint8Array | string, contentType = "application/octet-stream"): Promise<{ key: string; url: string }> {
  const { baseUrl, apiKey } = getStorageConfig();
  const key = normalizeKey(relKey);
  const uploadUrl = buildUploadUrl(baseUrl, key);
  const formData = toFormData(data, contentType, key.split("/").pop() ?? key);
  const response = await fetch(uploadUrl, { method: "POST", headers: buildAuthHeaders(apiKey), body: formData });
  if (!response.ok) {
    throw new Error(`Storage upload failed (${response.status})`);
  }
  const payload = await response.json() as { url?: unknown };
  if (typeof payload.url !== "string" || payload.url.length === 0) {
    throw new Error("Storage service returned an invalid upload URL");
  }
  return { key, url: payload.url };
}

export async function storageGet(relKey: string): Promise<{ key: string; url: string }> {
  const { baseUrl, apiKey } = getStorageConfig();
  const key = normalizeKey(relKey);
  return { key, url: await buildDownloadUrl(baseUrl, key, apiKey) };
}
