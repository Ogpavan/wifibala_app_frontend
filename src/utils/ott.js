export function resolveMediaUrl(value) {
  const raw = typeof value === "string" ? value.trim() : "";
  if (!raw) return "";

  if (raw.startsWith("http://") || raw.startsWith("https://")) {
    return raw;
  }

  const baseUrl = (import.meta.env.VITE_API_BASE_URL || "").trim().replace(/\/+$/, "");
  if (!baseUrl) {
    return raw;
  }

  return `${baseUrl}/${raw.replace(/^\/+/, "")}`;
}

export function resolveOttLogo(ott) {
  if (!ott || typeof ott !== "object") return "";

  return resolveMediaUrl(ott.logo_url);
}
