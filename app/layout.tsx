import { ClerkProvider } from '@clerk/nextjs'
import './globals.css'

const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY ?? ''
const hasValidClerkPublishableKey = Boolean(publishableKey && !/x{8,}/i.test(publishableKey))

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const content = hasValidClerkPublishableKey ? <ClerkProvider>{children}</ClerkProvider> : children

  return (
    <html lang="en">
      <body>
        {content}
      </body>
    </html>
  )
}