import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

// Define public routes, including your landing page
const isPublicRoute = createRouteMatcher(['/']);

export default clerkMiddleware(async (auth, request) => {
  if (!isPublicRoute(request)) {
    const { isAuthenticated, redirectToSignIn } = await auth();

    if (!isAuthenticated) {
      return redirectToSignIn();
    }
  }
});

export const config = {
  matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],
};