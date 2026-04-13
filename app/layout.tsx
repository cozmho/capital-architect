import { ClerkProvider } from '@clerk/nextjs'
import './globals.css'
import { hasValidClerkPublishableKey } from '@/lib/clerk-utils'
import { Analytics } from '@vercel/analytics/next'
import { syncUser } from '@/app/actions/user'
import Nav from './components/Nav'
import Footer from './components/Footer'

const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY ?? ''
const isClerkConfigured = hasValidClerkPublishableKey(publishableKey)

/**
 * ClerkSync is a small server component that ensures the user is mirrored in Prisma.
 */
async function ClerkSync() {
  if (!isClerkConfigured) return null
  await syncUser()
  return null
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const content = isClerkConfigured ? (
    <ClerkProvider>
      <ClerkSync />
      <Nav />
      {children}
      <Footer />
    </ClerkProvider>
  ) : (
    <>
      <Nav />
      {children}
      <Footer />
    </>
  )

  return (
    <html lang="en">
      <head>
        <title>Capital Architect | Business Funding That Fits Your Reality</title>
        <meta name="description" content="Automated fundability scoring. Expert credit architecture. Capital secured at terms that actually work for your business — not just the lender." />
      </head>
      <body>
        {content}
        <Analytics />
      </body>
    </html>
  )
}
