import {
  ClerkProvider,
  Show,
  SignInButton,
  SignUpButton,
  UserButton,
} from '@clerk/nextjs'
import './globals.css'
import { hasValidClerkPublishableKey } from '@/lib/clerk-utils'
import { Analytics } from '@vercel/analytics/next'

const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY ?? ''
const isClerkConfigured = hasValidClerkPublishableKey(publishableKey)

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const content = isClerkConfigured ? (
    <ClerkProvider>
      <header className="sticky top-0 z-40 border-b border-zinc-800/80 bg-zinc-950/90 backdrop-blur-sm">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-end gap-3 px-4 py-3 lg:px-8">
          <Show when="signed-out">
            <SignInButton mode="redirect" fallbackRedirectUrl="/">
              <button className="rounded-md border border-zinc-700 px-3 py-1.5 text-sm text-zinc-200 transition hover:border-zinc-500 hover:text-white">
                Sign in
              </button>
            </SignInButton>
            <SignUpButton mode="redirect" fallbackRedirectUrl="/">
              <button className="rounded-md bg-[#C8A84B] px-3 py-1.5 text-sm font-medium text-[#060A14] transition hover:brightness-110">
                Sign up
              </button>
            </SignUpButton>
          </Show>
          <Show when="signed-in">
            <UserButton />
          </Show>
        </div>
      </header>
      {children}
    </ClerkProvider>
  ) : (
    children
  )

  return (
    <html lang="en">
      <body>
        {content}
        <Analytics />
      </body>
    </html>
  )
}