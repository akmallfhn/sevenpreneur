export function isValidRedirectUrl(url: string): boolean {
  try {
    if (url.startsWith("/")) {
      return !url.startsWith("//");
    }
    const redirect = new URL(url);
    const localMode = process.env.DOMAIN_MODE === "local";
    const allowedDomains = localMode
      ? [
          "www.example.com:3000",
          "admin.example.com:3000",
          "agora.example.com:3000",
        ]
      : [
          "www.sevenpreneur.com",
          "admin.sevenpreneur.com",
          "agora.sevenpreneur.com",
        ];

    return allowedDomains.includes(redirect.host);
  } catch {
    return false;
  }
}
