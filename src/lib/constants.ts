export const DEFAULT_WHATSAPP =
  process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "+243969131138";

export const DEFAULT_PHONE =
  process.env.NEXT_PUBLIC_CONTACT_PHONE || "+243 969 131 138";

const OLD_DUMMY_NUMBERS = [
  "243810000000",
  "243893926051",
  "243990000000",
  "243990123456",
  "243890000111",
];

export function sanitizeWhatsApp(wa?: string | null): string {
  if (!wa || typeof wa !== "string" || !wa.trim()) return DEFAULT_WHATSAPP;
  const digits = wa.replace(/[^0-9]/g, "");
  if (!digits || OLD_DUMMY_NUMBERS.includes(digits)) {
    return DEFAULT_WHATSAPP;
  }
  return wa.trim();
}

export function sanitizePhone(phone?: string | null): string {
  if (!phone || typeof phone !== "string" || !phone.trim()) return DEFAULT_PHONE;
  const digits = phone.replace(/[^0-9]/g, "");
  if (!digits || OLD_DUMMY_NUMBERS.includes(digits)) {
    return DEFAULT_PHONE;
  }
  return phone.trim();
}

export function formatWhatsAppUrl(wa?: string | null, message?: string): string {
  const number = sanitizeWhatsApp(wa).replace(/[^0-9]/g, "");
  const textParam = message ? `?text=${encodeURIComponent(message)}` : "";
  return `https://wa.me/${number}${textParam}`;
}
