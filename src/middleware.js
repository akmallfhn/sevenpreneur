import { NextResponse } from 'next/server';

export function middleware(req) {
  const url = req.nextUrl.clone();
  const host = req.headers.get("host");
  const hostname = host.split(':')[0];

  // Ignore accesses to assets
  if (
    url.pathname.startsWith('/_next') ||
    url.pathname.startsWith('/favicon.ico') ||
    url.pathname.startsWith('/public')
  ) {
    return NextResponse.next();
  }

  // Map subdomains to its corresponding paths
  const subdomainList = {
    'www': '/www',
    'agora': '/agora',
    'admin': '/admin',
    'api': '/api',
  };

  var subdomain = "";
  // Local development environment
  if (hostname.endsWith("localhost")) {
    subdomain = hostname.substring(0, hostname.length - 10);
  }
  // Production environment
  if (hostname.endsWith("sevenpreneur.com")) {
    subdomain = hostname.substring(0, hostname.length - 17);
  }
  // Staging environment
  if (hostname.endsWith("staging.sevenpreneur.com")) {
    subdomain = hostname.substring(0, hostname.length - 25);
  }

  if (subdomain.length > 0) {
    if (subdomainList.hasOwnProperty(subdomain)) {
      const basePath = subdomainList[subdomain];
      // Disallow 'agora.sevenpreneur.com/agora'
      if (url.pathname.startsWith(basePath)) {
        url.pathname += '-not-found';
      } else {
        url.pathname = `${basePath}${url.pathname}`;
      }
    } else {
      url.pathname += '-not-found';
    }
    return NextResponse.rewrite(url);
  }

  // Prevent direct access to the main paths, e.g. sevenpreneur.com/agora
  if (host && Object.values(subdomainList).some((path) => url.pathname.startsWith(path))) {
    url.pathname += '-not-found';
    return NextResponse.rewrite(url);
  }

  // Default to www
  url.pathname = `/www${url.pathname}`;
  return NextResponse.rewrite(url);
}
