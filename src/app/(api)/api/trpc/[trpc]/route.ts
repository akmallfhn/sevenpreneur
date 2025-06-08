import { createTRPCContext } from '@/trpc/init';
import { appRouter } from '@/trpc/routers/_app';
import { fetchRequestHandler } from '@trpc/server/adapters/fetch';
import { NextRequest, NextResponse } from 'next/server';

const isOriginAllowed = (origin: string | null) => {
  if (!origin) {
    return false;
  }

  const domainMode = process.env.DOMAIN_MODE;
  let scheme = 'https';
  let baseURL = 'sevenpreneur.com';
  if (domainMode === 'local') {
    if (process.env.BASE_URL) {
      scheme = 'http';
      baseURL = process.env.BASE_URL;
    }
  } else if (domainMode === 'staging') {
    baseURL = 'staging.sevenpreneur.com';
  }

  const allowedOrigins = [
    `${scheme}://admin.${baseURL}`,
    `${scheme}://agora.${baseURL}`,
    `${scheme}://api.${baseURL}`,
    `${scheme}://www.${baseURL}`,
    `${scheme}://${baseURL}`,
  ];
  if (allowedOrigins.includes(origin)) {
    return origin;
  }
  return false;
};

// Separate function for OPTIONS method (first connect from client)
export async function OPTIONS(req: NextRequest) {
  const isAllowed = isOriginAllowed(req.headers.get('origin'));
  if (!isAllowed) {
    return new NextResponse(null, {
      status: 404, // Not Found
    });
  }

  return new NextResponse(null, {
    status: 204, // No Content
    headers: {
      'Access-Control-Allow-Origin': isAllowed,
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Allow-Credentials': 'true',
    },
  });
}

const handler = (req: Request) => {
  const isAllowed = isOriginAllowed(req.headers.get('origin'));
  if (!isAllowed) {
    return new NextResponse(null, {
      status: 404, // Not Found
    });
  }

  return fetchRequestHandler({
    endpoint: '/trpc',
    req,
    router: appRouter,
    createContext: createTRPCContext,
    responseMeta({ }) {
      return {
        headers: {
          'Access-Control-Allow-Origin': isAllowed,
        },
      };
    },
  });
};

export { handler as GET, handler as POST };
