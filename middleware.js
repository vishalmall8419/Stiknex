import { rewrite } from '@vercel/edge';

export const config = {
  matcher: [
    '/((?!api|_vercel|.*\\\\..*).*)',
    '/'
  ]
};

export default function middleware(request) {
  const url = new URL(request.url);
  url.pathname = '/api/serve-html';
  return rewrite(url);
}
