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
    <ClerkProvider
      appearance={{
        variables: {
          colorPrimary: '#C8A84B',
          colorText: '#F0EDE6',
          colorTextSecondary: '#8E9AAD',
          colorBackground: '#0C1220',
          colorInputBackground: '#111827',
          colorInputText: '#F0EDE6',
          borderRadius: '8px',
        },
        elements: {
          /* ── Card shell ── */
          card: 'bg-[#0C1220] border border-[rgba(255,255,255,0.07)] shadow-[0_4px_24px_rgba(0,0,0,0.3)]',
          /* ── Header text ── */
          headerTitle: 'text-[#C8A84B] font-semibold',
          headerSubtitle: 'text-[#8E9AAD]',
          /* ── Email identifier on verification screen ── */
          identityPreviewText: 'text-[#C8A84B]',
          identityPreviewEditButton: 'text-[#C8A84B] hover:text-[#E2C97E]',
          /* ── OTP code input squares ── */
          otpCodeFieldInput:
            'border-[rgba(200,168,75,0.25)] text-[#C8A84B] bg-[#111827] focus:border-[#C8A84B] focus:ring-[rgba(200,168,75,0.12)]',
          /* ── General form inputs ── */
          formFieldInput:
            'border-[rgba(255,255,255,0.07)] bg-[#111827] text-[#F0EDE6] focus:border-[rgba(200,168,75,0.25)]',
          formFieldLabel: 'text-[#B0BAC9]',
          /* ── Primary button ── */
          formButtonPrimary:
            'bg-[#C8A84B] hover:bg-[#E2C97E] text-[#060A14] font-semibold',
          /* ── Footer links ── */
          footerActionLink: 'text-[#C8A84B] hover:text-[#E2C97E]',
          footerActionText: 'text-[#8E9AAD]',
          /* ── Social / OAuth buttons ── */
          socialButtonsBlockButton:
            'border-[rgba(255,255,255,0.07)] bg-[#111827] text-[#F0EDE6] hover:bg-[rgba(200,168,75,0.08)]',
          /* ── Divider ── */
          dividerLine: 'bg-[rgba(255,255,255,0.07)]',
          dividerText: 'text-[#8E9AAD]',
        },
      }}
    >
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
