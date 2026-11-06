/**
 * Color utility functions for contrast calculation and text-color management.
 */

export function parseHexColor(hex: string): { r: number; g: number; b: number } | null {
  if (!hex) return null;
  let clean = hex.trim().replace(/^#/, "");
  if (clean.length === 3) {
    clean = clean.split("").map((c) => c + c).join("");
  }
  if (clean.length !== 6) return null;
  const num = parseInt(clean, 16);
  if (isNaN(num)) return null;
  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255,
  };
}

export function getLuminance(hex: string): number {
  const rgb = parseHexColor(hex);
  if (!rgb) return 255;
  // Perceived luminance standard formula
  return 0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b;
}

export function isDarkColor(hex: string): boolean {
  return getLuminance(hex) < 140;
}

export function getOptimalContrastTextColor(bgHex: string): string {
  return isDarkColor(bgHex) ? "#ffffff" : "#0f172a";
}

export function getSecondaryTextColor(textHex: string): string {
  return isDarkColor(textHex) ? "#64748b" : "#cbd5e1";
}

/**
 * Parses a stored composite string format: "bgColor|textColor" or simple "bgColor"
 */
export function parseColorWithText(raw?: string | null, fallbackBg = "#ffffff", fallbackText?: string): {
  bg: string;
  text: string;
} {
  if (!raw) {
    const bg = fallbackBg;
    const text = fallbackText || getOptimalContrastTextColor(bg);
    return { bg, text };
  }
  const parts = raw.split("|");
  const bg = parts[0] || fallbackBg;
  const text = parts[1] || fallbackText || getOptimalContrastTextColor(bg);
  return { bg, text };
}

/**
 * Encodes bg and optional text into composite string
 */
export function encodeColorWithText(bg: string, text?: string): string {
  if (text) {
    return `${bg}|${text}`;
  }
  return bg;
}

