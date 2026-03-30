import { ClerkProvider } from '@clerk/nextjs'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'
import { hasValidClerkPublishableKey } from '@/lib/clerk-utils'

const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY ?? ''
const isClerkConfigured = hasValidClerkPublishableKey(publishableKey)

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const content = isClerkConfigured ? <ClerkProvider>{children}</ClerkProvider> : children

  return (
    <html lang="en">
      <body>
        {content}
        <Analytics />
      </body>
    </html>
  )
}