import Link from "next/link";
import { UserButton } from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

function TriangleLogo() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12,3 22,21 2,21" fill="none" stroke="var(--gold)" strokeWidth="1.5" />
      <line x1="12" y1="9" x2="12" y2="17" stroke="var(--gold)" strokeWidth="1.5" />
    </svg>
  );
}

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Server-side auth check — replaces middleware
  const user = await currentUser();
  if (!user) {
    redirect("/sign-in");
  }

  const firstName = user.firstName || "Client";

  return (
    <>
      <nav className="nav">
        <Link href="/dashboard" className="nav-logo">
          <div className="nav-logo-mark"><TriangleLogo /></div>
          <span className="nav-brand">Capital Architect</span>
        </Link>
        <div className="dash-nav-right">
          <span className="dash-greeting">Welcome, {firstName}</span>
          <Link href="/dashboard" className="dash-nav-link active">Dashboard</Link>
          <Link href="/contact" className="dash-nav-link">Support</Link>
          <UserButton
            appearance={{
              elements: {
                avatarBox: { width: 32, height: 32 },
              },
            }}
          />
        </div>
      </nav>
      <main className="dash-main">{children}</main>
    </>
  );
}
