import withAuth from "./middlewares/withAuth";

export function middleware(req) {
  return withAuth(req);
}
