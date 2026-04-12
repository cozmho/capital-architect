import type { Metadata } from "next";
import { DM_Serif_Display, DM_Sans } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
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
  return (
    <ClerkProvider
      appearance={{
        variables: {
          colorPrimary: "#C8A84B",
          colorBackground: "#0C1220",
          colorInputBackground: "#111827",
          colorInputText: "#F0EDE6",
          borderRadius: "8px",
          fontFamily: "var(--font-dm-sans), system-ui, sans-serif",
        },
      }}
    >
      <html lang="en" className={`${dmSerif.variable} ${dmSans.variable}`}>
        <body>{children}</body>
      </html>
    </ClerkProvider>
  );
}
