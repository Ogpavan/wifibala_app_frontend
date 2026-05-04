const DEFAULT_SETTINGS = {
  primary_number: "",
  secondary_number: "",
  whatsapp_number: "",
  email_id: "",
  company_name: "",
  theme_color: "blue",
};

function normalizeSettingRow(row) {
  if (!row || typeof row !== "object") return { ...DEFAULT_SETTINGS };

  return {
    ...DEFAULT_SETTINGS,
    ...row,
  };
}

export function normalizePhoneNumber(value) {
  if (typeof value !== "string") return "";
  return value.trim();
}

export function getTelHref(value) {
  const phone = normalizePhoneNumber(value);
  if (!phone) return "";
  return `tel:${phone.replace(/\s+/g, "")}`;
}

export function getWhatsAppHref(value) {
  const phone = normalizePhoneNumber(value);
  if (!phone) return "";
  const digits = phone.replace(/\D/g, "");
  if (!digits) return "";
  return `https://wa.me/${digits}`;
}

export async function fetchAppSettings(baseUrl) {
  if (!baseUrl) return { ...DEFAULT_SETTINGS };

  const response = await fetch(`${baseUrl}/api/settings`);
  if (!response.ok) {
    throw new Error("Failed to load settings");
  }

  const data = await response.json();
  const firstRow = Array.isArray(data) ? data[0] : null;
  return normalizeSettingRow(firstRow);
}
