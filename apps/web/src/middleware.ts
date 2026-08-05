import { NextResponse, type NextRequest } from 'next/server'

/**
 * Next.js Middleware — Protected route guarding
 * Private routes: /dashboard, /audits, /leads, /settings, /billing
 * Public auth routes: /login, /signup, /forgot-password
 */

const PROTECTED_ROUTES = ['/dashboard', '/audits', '/leads', '/settings', '/billing']
const AUTH_ROUTES = ['/login', '/signup', '/forgot-password']

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Check for auth session cookie (sb-access-token or custom auth token)
  const hasAuthToken =
    request.cookies.has('sb-access-token') ||
    request.cookies.has('supabase-auth-token') ||
    Boolean(request.headers.get('authorization'))

  const isProtectedRoute = PROTECTED_ROUTES.some((route) => pathname.startsWith(route))
  const isAuthRoute = AUTH_ROUTES.some((route) => pathname.startsWith(route))

  // Redirect unauthenticated user attempting to access private route to /login
  if (isProtectedRoute && !hasAuthToken) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('redirectTo', pathname)
    return NextResponse.redirect(loginUrl)
  }

  // Redirect authenticated user attempting to access /login or /signup to /dashboard
  if (isAuthRoute && hasAuthToken) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (images, svgs)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
