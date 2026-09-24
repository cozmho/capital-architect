import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

// Define public routes, including your landing page
const isPublicRoute = createRouteMatcher(['/']);

export default clerkMiddleware((auth, request) => {
  if (!isPublicRoute(request)) {
    auth().protect();
  }
});

export const config = {
  matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],
};