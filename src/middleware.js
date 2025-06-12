import { NextResponse } from "next/server";

export function middleware(req) {
  const url = req.nextUrl.clone();
  const host = req.headers.get("host");
  const hostname = host.split(":")[0]; // strip port

  // --- Map subdomains to its corresponding paths
  const subdomainList = {
    www: "/www",
    agora: "/agora",
    admin: "/admin",
    api: "/api",
  };

  const localDomain = "example.com:3000";
  const productionDomain = "sevenpreneur.com";

  const isLocal = process.env.DOMAIN_MODE === "local";
  const isProduction = hostname.endsWith(productionDomain) && !isStaging;

  // --- Extract subdomain
  let endPos = 0;
  if (isLocal) {
    endPos = host.indexOf(localDomain) - 1;
  } else if (isProduction) {
    endPos = host.indexOf(productionDomain) - 1;
  }
  const subdomain = host.substring(0, endPos);
  const sessionToken = req.cookies.get("session_token")?.value;
  const pathname = req.nextUrl.pathname;
  const loginRoute = ["/auth"];

  // --- Redirect if accessing admin subdomain without session token
  if (subdomain === "admin" && !sessionToken) {
    return NextResponse.redirect(
      new URL(`https://www.${localDomain}/auth/login`, req.url)
    );
  }

  // --- Redirect if accessing agora subdomain without session token
  if (subdomain === "agora" && !sessionToken) {
    return NextResponse.redirect(
      new URL(`https://www.${localDomain}/auth/login`, req.url)
    );
  }

  // --- Redirect if accessing /auth on www subdomain with active session
  if (subdomain === "www" && sessionToken) {
    if (loginRoute.some((route) => pathname.startsWith(route))) {
      return NextResponse.redirect(
        new URL(`https://www.${localDomain}`, req.url)
      );
    }
  }

  // --- Block unknown subdomains
  if (subdomain && !subdomainList[subdomain]) {
    url.pathname += "-not-found";
    return NextResponse.rewrite(url);
  }

  // --- Ignore accesses to assets
  if (
    url.pathname.startsWith("/_next") ||
    url.pathname.startsWith("/favicon.ico") ||
    url.pathname.startsWith("/public")
  ) {
    return NextResponse.next();
  }

  // --- Rewrite based on valid subdomain
  if (subdomain && subdomainList[subdomain]) {
    const basePath = subdomainList[subdomain];
    // --- Disallow double paths, e.g. agora.sevenpreneur.com/agora
    if (url.pathname.startsWith(basePath)) {
      url.pathname += "-not-found";
    } else {
      url.pathname = `${basePath}${url.pathname}`;
    }
    return NextResponse.rewrite(url);
  }

  // --- Prevent direct access to the main paths, e.g. sevenpreneur.com/agora
  if (
    Object.values(subdomainList).some((path) => url.pathname.startsWith(path))
  ) {
    url.pathname += "-not-found";
    return NextResponse.rewrite(url);
  }

  // --- Default to www
  url.pathname = `/www${url.pathname}`;
  return NextResponse.rewrite(url);
}
