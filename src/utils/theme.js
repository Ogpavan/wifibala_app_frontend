const PRESET_COLORS = {
  blue: "#4169e1",
  green: "#10b981",
  orange: "#f97316",
  rose: "#f43f5e",
  slate: "#64748b",
};

function normalizeHexColor(value) {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  const match = /^#?([0-9a-fA-F]{6})$/.exec(trimmed);
  return match ? `#${match[1].toLowerCase()}` : null;
}

function hexToRgb(hex) {
  const normalized = normalizeHexColor(hex);
  if (!normalized) return null;
  const value = normalized.slice(1);
  return {
    r: Number.parseInt(value.slice(0, 2), 16),
    g: Number.parseInt(value.slice(2, 4), 16),
    b: Number.parseInt(value.slice(4, 6), 16),
  };
}

function rgbToHex(r, g, b) {
  return [r, g, b]
    .map((channel) => Math.max(0, Math.min(255, Math.round(channel))).toString(16).padStart(2, "0"))
    .join("");
}

function mixColors(hexA, hexB, amount) {
  const colorA = hexToRgb(hexA);
  const colorB = hexToRgb(hexB);
  if (!colorA || !colorB) return normalizeHexColor(hexA) || PRESET_COLORS.blue;

  const weight = Math.max(0, Math.min(1, amount));
  const mixed = {
    r: colorA.r + (colorB.r - colorA.r) * weight,
    g: colorA.g + (colorB.g - colorA.g) * weight,
    b: colorA.b + (colorB.b - colorA.b) * weight,
  };

  return `#${rgbToHex(mixed.r, mixed.g, mixed.b)}`;
}

function buildPalette(baseHex) {
  const base = normalizeHexColor(baseHex) || PRESET_COLORS.blue;

  return {
    primary: base,
    primaryStrong: mixColors(base, "#000000", 0.22),
    primarySoft: mixColors(base, "#ffffff", 0.88),
    accent: mixColors(base, "#ffffff", 0.18),
  };
}

export function resolveThemeColor(themeColor) {
  if (typeof themeColor !== "string" || !themeColor.trim()) {
    return PRESET_COLORS.blue;
  }

  const trimmed = themeColor.trim().toLowerCase();
  return PRESET_COLORS[trimmed] || normalizeHexColor(trimmed) || PRESET_COLORS.blue;
}

export function applyThemeColor(themeColor) {
  if (typeof document === "undefined") return;

  const palette = buildPalette(resolveThemeColor(themeColor));
  const root = document.documentElement;

  root.style.setProperty("--color-primary", palette.primary);
  root.style.setProperty("--color-primary-strong", palette.primaryStrong);
  root.style.setProperty("--color-primary-soft", palette.primarySoft);
  root.style.setProperty("--color-accent", palette.accent);
}
