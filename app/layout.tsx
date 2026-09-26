import type { Metadata } from "next";
import { DM_Serif_Display, DM_Sans } from "next/font/google";
import "./globals.css";

const dmSerif = DM_Serif_Display({
  variable: "--font-dm-serif",
  weight: "400",
  subsets: ["latin"],
  style: ["normal", "italic"],
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  weight: ["300", "400", "500", "600"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Capital Architect — Institutional-Grade Funding Strategy",
  description:
    "Automated fundability scoring. Expert credit architecture. Capital secured at terms that actually work for your business — not just the lender.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://capital-architect.vercel.app";

  return (
    <html lang="en" suppressHydrationWarning className={`${dmSerif.variable} ${dmSans.variable}`}>
      <head>
        <script
          id="website-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "Capital Architect",
              url: siteUrl,
              potentialAction: {
                "@type": "SearchAction",
                target: `${siteUrl}/search?query={search_term_string}`,
                "query-input": "required name=search_term_string",
              },
            }),
          }}
        />
        <script
          id="software-application-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              name: "Capital Architect Funding Roadmap",
              applicationCategory: "BusinessApplication",
              offers: {
                "@type": "Offer",
                price: "350",
                priceCurrency: "USD",
                availability: "https://schema.org/InStock",
              },
            }),
          }}
        />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}

