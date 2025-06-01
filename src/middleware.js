import { NextResponse } from 'next/server';

export function middleware(req) {
  const url = req.nextUrl.clone();
  const host = req.headers.get("host");
  const hostname = host.split(':')[0]; // strip port
  const hostParts = hostname.split('.');

  // --- Map subdomains to its corresponding paths
  const subdomainList = {
    'www': '/www',
    'agora': '/agora',
    'admin': '/admin',
    'api': '/api',
  };

  const prodDomain = "sevenpreneur.com";
  const stagingDomain = "staging.sevenpreneur.com"
  const isLocal = hostname.endsWith('localhost');
  const isStaging = hostname.endsWith(stagingDomain);
  const isProd = hostname.endsWith(prodDomain) && !isStaging;

  let subdomain = "";
  
  // --- Extract subdomain
  if (isLocal && hostParts.length === 2) {
    subdomain = hostParts[0];
  } else if (isStaging){
    if (hostParts.length === 3) {
      subdomain = "www";
    } else if (hostParts.length >= 4) {      
      subdomain = hostParts[0];
    }
  } else if (isProd && hostParts.length >= 3){
    subdomain = hostParts[0];
  }

  // --- Block unknown subdomains
  if (subdomain && !subdomainList[subdomain]) {
    url.pathname += '-not-found';
    return NextResponse.rewrite(url);
  }

  // --- Basic Auth for staging env
  // if (isStaging) {
  //   const basicAuth = req.headers.get("authorization");
  //   const expectedAuth = 'Basic ' + Buffer.from("admin:captainMarvel1995").toString('base64');

  //   if (basicAuth !== expectedAuth) {
  //     return new Response('Authentication Required', {
  //       status: 401,
  //       headers: {
  //         'WWW-Authenticate': 'Basic realm="Secure Area"',
  //       },
  //     });
  //   }
  // }

  // --- Ignore accesses to assets
  if (
    url.pathname.startsWith('/_next') ||
    url.pathname.startsWith('/favicon.ico') ||
    url.pathname.startsWith('/public')
  ) {
    return NextResponse.next();
  }

  // --- Rewrite based on valid subdomain
  if (subdomain && subdomainList[subdomain]) {
    const basePath = subdomainList[subdomain];
    // --- Disallow double paths like "agora.sevenpreneur.com/agora"
    if (url.pathname.startsWith(basePath)) {
      url.pathname += '-not-found';
    } else {
      url.pathname = `${basePath}${url.pathname}`;
    }
    return NextResponse.rewrite(url);
  }

  // --- Prevent direct access to the main paths, e.g. sevenpreneur.com/agora
  if (Object.values(subdomainList).some((path) => url.pathname.startsWith(path))) {
    url.pathname += '-not-found';
    return NextResponse.rewrite(url);
  }

  // --- Default to www
  url.pathname = `/www${url.pathname}`;
  return NextResponse.rewrite(url);
}
