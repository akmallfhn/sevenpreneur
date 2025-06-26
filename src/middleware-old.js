import withAuth from "./middlewares-old/withAuth";

export function middleware(req) {
  return withAuth(req);
}
