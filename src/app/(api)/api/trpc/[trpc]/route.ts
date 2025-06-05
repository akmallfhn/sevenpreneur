import { fetchRequestHandler } from '@trpc/server/adapters/fetch';
import { NextRequest, NextResponse } from 'next/server';
import { createTRPCContext } from '../../../../../trpc/init';
import { appRouter } from '../../../../../trpc/routers/_app';

// Separate function for OPTIONS method (first connect from client)
export async function OPTIONS(req: NextRequest) {
  return new NextResponse(null, {
    status: 204, // No Content
    headers: {
      // TODO: Change to frontend domains automatically
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'OPTIONS, GET, POST',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}

const handler = (req: Request) => {
  return fetchRequestHandler({
    endpoint: '/trpc',
    req,
    router: appRouter,
    createContext: createTRPCContext,
    responseMeta({ }) {
      return {
        headers: {
          // TODO: Change to frontend domains automatically
          'Access-Control-Allow-Origin': '*',
        },
      };
    },
  });
};

export { handler as GET, handler as POST };
