import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';
import { NextRequest, NextResponse } from 'next/server';

// Protected routes
const protectedRoutes = ['/en/submit', '/fr/submit'];
const dashboardRoutes = ['/en/dashboard', '/fr/dashboard'];

export async function middleware(req: NextRequest) {
  // 1. Check if the current route is protected
  const path = req.nextUrl.pathname;
  const isProtectedRoute = protectedRoutes.includes(path);
  const isDashboardRoute = dashboardRoutes.includes(path);

  // 2. Check for the authentication cookie
  const cookie = req.cookies.get('passKey')?.value;

  // 3. Check for the access token 
  const accessToken = req.cookies.get('accessToken')?.value;

  // 4. Redirect to '/' if the user is not authenticated and trying to access a protected route
  if (isProtectedRoute && !cookie) {
    return NextResponse.redirect(new URL('/', req.url));
  }

  // 5. Redirect to '/' if the user is trying to access dashboard routes without an access token
  if (isDashboardRoute && !accessToken) {
    return NextResponse.redirect(new URL(`login`, req.url));
  }

  // 6. Execute the i18n middleware logic
  const intlMiddleware = createMiddleware(routing);
  const intlResponse = intlMiddleware(req);

  // If i18n middleware handles the response (e.g., redirects), return it
  if (intlResponse) {
    return intlResponse;
  }

  // 7. Allow the request to proceed
  return NextResponse.next();
}

export const config = {
  matcher: ['/', '/(fr|en)/:path*'],
};
