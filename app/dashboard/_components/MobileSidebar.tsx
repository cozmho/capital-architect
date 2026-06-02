"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";

export function MobileMenuButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="fixed right-4 top-4 z-50 flex h-10 w-10 items-center justify-center rounded-xl border border-zinc-700 bg-zinc-900/90 text-zinc-300 backdrop-blur-sm transition hover:border-zinc-600 hover:text-white md:hidden"
      aria-label="Open navigation menu"
    >
      <Menu className="h-5 w-5" />
    </button>
  );
}

export function MobileSidebar({
  children,
  isOpen,
  onClose,
}: {
  children: React.ReactNode;
  isOpen: boolean;
  onClose: () => void;
}) {
  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sliding sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-zinc-800/80 bg-zinc-900/95 p-5 backdrop-blur-md transition-transform duration-300 ease-in-out md:static md:translate-x-0 md:bg-zinc-900/70 md:backdrop-blur-sm ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Close button — mobile only */}
        <button
          onClick={onClose}
          className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-lg text-zinc-400 transition hover:bg-zinc-800 hover:text-white md:hidden"
          aria-label="Close navigation menu"
        >
          <X className="h-4 w-4" />
        </button>

        {children}
      </aside>
    </>
  );
}

export function SidebarWrapper({ sidebarContent, children }: {
  sidebarContent: React.ReactNode;
  children: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <MobileMenuButton onClick={() => setIsOpen(true)} />
      <div className="mx-auto flex min-h-screen w-full max-w-400">
        <MobileSidebar isOpen={isOpen} onClose={() => setIsOpen(false)}>
          <div onClick={() => setIsOpen(false)}>
            {sidebarContent}
          </div>
        </MobileSidebar>
        <section className="min-w-0 flex-1">{children}</section>
      </div>
    </div>
  );
}
