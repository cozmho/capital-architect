import { APIKeys } from "@clerk/nextjs";

export const dynamic = "force-dynamic";

export default function GodModeApiKeysPage() {
  return (
    <main className="min-h-screen bg-linear-to-br from-zinc-950 via-zinc-900 to-black px-6 py-10 text-zinc-100 lg:px-10">
      <section className="mx-auto w-full max-w-5xl rounded-2xl border border-zinc-800/80 bg-zinc-900/60 p-6 backdrop-blur-sm">
        <header className="mb-6">
          <p className="text-xs uppercase tracking-[0.18em] text-zinc-400">Capital Architect</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-white">API Keys</h1>
          <p className="mt-2 text-sm text-zinc-400">
            Manage Clerk API keys for the currently selected user or active organization.
          </p>
        </header>

        <div className="rounded-xl border border-zinc-800 bg-zinc-950/70 p-4">
          <APIKeys showDescription perPage={10} />
        </div>
      </section>
    </main>
  );
}
