import Link from "next/link";
import { UserButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import { BriefcaseBusiness, Target, Users } from "lucide-react";

const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY ?? "";
const hasValidClerkPublishableKey = Boolean(publishableKey && !/x{8,}/i.test(publishableKey));

type DashboardRole = "admin" | "closer" | "setter";

type NavItem = {
  href: string;
  label: string;
  icon: typeof Users;
  requiresRole?: DashboardRole;
  requiresPaid?: boolean;
};

const navItems: NavItem[] = [
  {
    href: "/dashboard/admin",
    label: "Admin Command",
    icon: BriefcaseBusiness,
    requiresRole: "admin",
  },
  {
    href: "/dashboard/closer",
    label: "Closer Pipeline",
    icon: Target,
    requiresRole: "closer",
  },
  {
    href: "/dashboard/setter",
    label: "Setter Queue",
    icon: Users,
    requiresRole: "setter",
  },
  {
    href: "/dashboard/client",
    label: "Client Portal",
    icon: Users,
    requiresPaid: true,
  },
];

function getRole(sessionClaims: unknown): DashboardRole | null {
  if (!sessionClaims || typeof sessionClaims !== "object") return null;

  const claims = sessionClaims as {
    metadata?: { role?: string };
    publicMetadata?: { role?: string };
  };

  const role = claims.metadata?.role ?? claims.publicMetadata?.role;
  if (role === "admin" || role === "closer" || role === "setter") return role;
  return null;
}

function hasPaidMembership(sessionClaims: unknown): boolean {
  if (!sessionClaims || typeof sessionClaims !== "object") return false;

  const claims = sessionClaims as {
    metadata?: { plan?: string; paid?: boolean };
    publicMetadata?: { plan?: string; paid?: boolean };
  };

  const plan = (claims.metadata?.plan ?? claims.publicMetadata?.plan ?? "").toLowerCase();
  const paidFlag = claims.metadata?.paid ?? claims.publicMetadata?.paid;

  if (paidFlag === true) return true;
  return ["paid", "pro", "premium", "member"].includes(plan);
}

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { sessionClaims } = hasValidClerkPublishableKey ? await auth() : { sessionClaims: null };
  const role = getRole(sessionClaims);
  const paidMember = hasPaidMembership(sessionClaims);

  const visibleNavItems = navItems.filter((item) => {
    if (item.requiresRole && role !== item.requiresRole) return false;
    if (item.requiresPaid && !paidMember) return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <div className="mx-auto flex min-h-screen w-full max-w-400">
        <aside className="flex w-72 shrink-0 flex-col border-r border-zinc-800/80 bg-zinc-900/70 p-5 backdrop-blur-sm">
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">Capital Architect</p>
            <h2 className="mt-2 text-lg font-semibold text-white">Dashboard Control</h2>
          </div>

          <nav className="mt-8 space-y-2">
            {visibleNavItems.map((item) => {
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-3 rounded-xl border border-zinc-800 bg-zinc-900 px-3 py-3 text-sm font-medium text-zinc-300 transition hover:border-zinc-700 hover:bg-zinc-800/80 hover:text-white"
                >
                  <Icon className="h-4 w-4 text-cyan-300" />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="mt-auto flex items-center justify-between rounded-xl border border-zinc-800 bg-zinc-900/80 px-3 py-3">
            <p className="text-sm text-zinc-400">Account</p>
            {hasValidClerkPublishableKey ? (
              <UserButton
                appearance={{
                  elements: {
                    avatarBox: "h-9 w-9",
                  },
                }}
              />
            ) : (
              <span className="rounded-md border border-zinc-700 px-2 py-1 text-xs text-zinc-400">Clerk not configured</span>
            )}
          </div>
        </aside>

        <section className="min-w-0 flex-1">{children}</section>
      </div>
    </div>
  );
}
