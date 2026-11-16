import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isProtectedRoute = createRouteMatcher(['/dashboard(.*)']);

const ADMIN_PATHS = ['/admin', '/dashboard/admin', '/dashboard/god-mode', '/api/admin', '/api/dispatch-letter'];
const isAdminPath = createRouteMatcher(ADMIN_PATHS);

const isDevelopment = process.env.NODE_ENV !== 'production';

export default clerkMiddleware(async (auth, req) => {
  const { userId, sessionId } = await auth();

  // FIX: Gate all admin routes in production unless ADMIN_ENABLED=true
  if (isAdminPath(req) && process.env.NODE_ENV === 'production' && process.env.ADMIN_ENABLED !== 'true') {
    return new NextResponse(null, { status: 404 });
  }

  // Require authentication for admin routes
  if (isAdminPath(req) && !userId) {
    return NextResponse.redirect(new URL('/sign-in', req.url));
  }

  // Role-based access check for admin routes
  if (isAdminPath(req) && userId) {
    const ADMIN_USER_ID = process.env.ADMIN_USER_ID;
    if (ADMIN_USER_ID && userId !== ADMIN_USER_ID) {
      return new NextResponse(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  }

  if (!isProtectedRoute(req)) return NextResponse.next();

  if (!userId) {
    return NextResponse.redirect(new URL('/sign-in', req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
