import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import {
  hasValidClerkPublishableKey,
  hasValidClerkSecretKey,
  getUserRole,
  parseGodModeUserIds,
  hasPaidMembership as checkPaidMembership,
} from '@/lib/clerk-utils';

const hasValidClerkKeys = (() => {
  const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY ?? '';
  const secretKey = process.env.CLERK_SECRET_KEY ?? '';

  return hasValidClerkPublishableKey(publishableKey) && hasValidClerkSecretKey(secretKey);
})();

const isProtectedRoute = createRouteMatcher(['/dashboard(.*)']);
const isGodModeRoute = createRouteMatcher(['/dashboard/god-mode(.*)']);
const isCloserRoute = createRouteMatcher(['/dashboard/closer(.*)']);
const isSetterRoute = createRouteMatcher(['/dashboard/setter(.*)']);
const isClientRoute = createRouteMatcher(['/dashboard/client(.*)']);

const godModeUserIds = parseGodModeUserIds();

type DashboardRole = 'admin' | 'closer' | 'setter';

const roleHome: Record<DashboardRole, string> = {
  admin: '/dashboard/god-mode',
  closer: '/dashboard/closer',
  setter: '/dashboard/setter',
};

const hasGodModeOverride = (userId: string | null | undefined): boolean => {
  if (!userId) return false;
  return godModeUserIds.has(userId);
};

const getSessionRole = (sessionClaims: unknown): DashboardRole | null => {
  const role = getUserRole(sessionClaims as Record<string, unknown> | null);
  if (role === 'admin' || role === 'closer' || role === 'setter') return role;
  return null;
};

const passthroughProxy = () => NextResponse.next();

const clerkProxy = clerkMiddleware(async (auth, req) => {
  if (!isProtectedRoute(req)) return;

  await auth.protect();

  const { sessionClaims, userId } = await auth();

  if (isClientRoute(req)) {
    if (checkPaidMembership(sessionClaims as Record<string, unknown> | null)) return;
    return NextResponse.redirect(new URL('/membership', req.url));
  }

  let requiredRole: DashboardRole | null = null;
  if (isGodModeRoute(req)) requiredRole = 'admin';
  if (isCloserRoute(req)) requiredRole = 'closer';
  if (isSetterRoute(req)) requiredRole = 'setter';

  if (!requiredRole) return;

  const role = getSessionRole(sessionClaims);

  if (requiredRole === 'admin' && hasGodModeOverride(userId)) return;

  if (role === requiredRole) return;

  if (role && roleHome[role]) {
    return NextResponse.redirect(new URL(roleHome[role], req.url));
  }

  return NextResponse.redirect(new URL('/', req.url));
});

export default hasValidClerkKeys ? clerkProxy : passthroughProxy;

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};
