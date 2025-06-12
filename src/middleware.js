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

  const localDomain = process.env.BASE_URL;
  const stagingDomain = "staging.sevenpreneur.com";
  const productionDomain = "sevenpreneur.com";

  const isLocal = process.env.DOMAIN_MODE === "local";
  const isStaging = hostname.endsWith(stagingDomain);
  const isProduction = hostname.endsWith(productionDomain) && !isStaging;

  // --- Extract subdomain
  let endPos = 0;
  if (isLocal) {
    endPos = host.indexOf(localDomain) - 1;
  } else if (isStaging) {
    endPos = host.indexOf(stagingDomain) - 1;
  } else if (isProduction) {
    endPos = host.indexOf(productionDomain) - 1;
  }
  const subdomain = host.substring(0, endPos);

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
