import { NextResponse } from 'next/server';

export function middleware(req) {
  const host = req.headers.get("host");
  const url = req.nextUrl.clone();

  // Ignore accesses to assets
  if (
    url.pathname.startsWith('/_next') ||
    url.pathname.startsWith('/favicon.ico') ||
    url.pathname.startsWith('/public')
  ) {
    return NextResponse.next();
  }

  // Map subdomains to its corresponding paths
  const subdomains = {
    'www': '/www',
    'agora': '/agora',
    'admin': '/admin',
    'api': '/api',
  };

  // Separate the host string into parts by dot (.) and also remove port (if exists)
  const hostParts = host.split(':')[0].split('.');

  if (hostParts.length >= 2) {
    const sub = hostParts[0];
    if (subdomains.hasOwnProperty(sub)) {
      const basePath = subdomains[sub];
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
  if (host && Object.values(subdomains).some((path) => url.pathname.startsWith(path))) {
    url.pathname += '-not-found';
    return NextResponse.rewrite(url);
  }

  // Default to www
  url.pathname = `/www${url.pathname}`;
  return NextResponse.rewrite(url);
}
