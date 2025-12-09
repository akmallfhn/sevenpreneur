export function getDevice(userAgent?: string | null) {
  if (!userAgent) return "desktop";

  const isMobile = /mobile|android|iphone|ipad|ipod/i.test(userAgent);
  return isMobile ? "mobile" : "desktop";
}
