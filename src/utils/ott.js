export function resolveOttLogo(ott) {
  if (!ott || typeof ott !== "object") return "";

  const raw = typeof ott.logo_url === "string" ? ott.logo_url.trim() : "";
  if (!raw) return "";

  if (raw.startsWith("http://") || raw.startsWith("https://")) {
    return raw;
  }

  const baseUrl = import.meta.env.VITE_API_BASE_URL || "";
  if (!baseUrl) {
    return raw;
  }

  return `${baseUrl}${raw.startsWith("/") ? raw : `/${raw}`}`;
}
