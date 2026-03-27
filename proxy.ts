import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

const hasValidClerkKeys = (() => {
  const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY ?? '';
  const secretKey = process.env.CLERK_SECRET_KEY ?? '';

  const invalidToken = /x{8,}/i;
  return Boolean(publishableKey && secretKey && !invalidToken.test(publishableKey) && !invalidToken.test(secretKey));
})();

const isProtectedRoute = createRouteMatcher(['/dashboard(.*)']);
const isAdminRoute = createRouteMatcher(['/dashboard/admin(.*)']);
const isCloserRoute = createRouteMatcher(['/dashboard/closer(.*)']);
const isSetterRoute = createRouteMatcher(['/dashboard/setter(.*)']);
const isClientRoute = createRouteMatcher(['/dashboard/client(.*)']);

type DashboardRole = 'admin' | 'closer' | 'setter';

const roleHome: Record<DashboardRole, string> = {
  admin: '/dashboard/admin',
  closer: '/dashboard/closer',
  setter: '/dashboard/setter',
};

const getSessionRole = (sessionClaims: unknown): DashboardRole | null => {
  if (!sessionClaims || typeof sessionClaims !== 'object') return null;

  const claims = sessionClaims as {
    metadata?: { role?: string };
    publicMetadata?: { role?: string };
  };

  const role = claims.metadata?.role ?? claims.publicMetadata?.role;
  if (role === 'admin' || role === 'closer' || role === 'setter') return role;
  return null;
};

const hasPaidMembership = (sessionClaims: unknown): boolean => {
  if (!sessionClaims || typeof sessionClaims !== 'object') return false;

  const claims = sessionClaims as {
    metadata?: { plan?: string; paid?: boolean };
    publicMetadata?: { plan?: string; paid?: boolean };
  };

  const plan = (claims.metadata?.plan ?? claims.publicMetadata?.plan ?? '').toLowerCase();
  const paidFlag = claims.metadata?.paid ?? claims.publicMetadata?.paid;

  if (paidFlag === true) return true;
  return ['paid', 'pro', 'premium', 'member'].includes(plan);
};

const passthroughProxy = () => NextResponse.next();

const clerkProxy = clerkMiddleware(async (auth, req) => {
  if (!isProtectedRoute(req)) return;

  await auth.protect();

  let requiredRole: DashboardRole | null = null;
  if (isAdminRoute(req)) requiredRole = 'admin';
  if (isCloserRoute(req)) requiredRole = 'closer';
  if (isSetterRoute(req)) requiredRole = 'setter';

  if (!requiredRole) return;

  const { sessionClaims } = await auth();
  if (isClientRoute(req) && !hasPaidMembership(sessionClaims)) {
    return NextResponse.redirect(new URL('/intake', req.url));
  }

  const role = getSessionRole(sessionClaims);

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
