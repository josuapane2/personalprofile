"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import {
  LayoutDashboard,
  User,
  Briefcase,
  FolderKanban,
  Sparkles,
  Mail,
  LogOut,
  ExternalLink,
  Menu,
  X,
} from "lucide-react";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";

const links = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/profile", label: "Profile", icon: User },
  { href: "/admin/experience", label: "Experience", icon: Briefcase },
  { href: "/admin/projects", label: "Projects", icon: FolderKanban },
  { href: "/admin/skills", label: "Skills", icon: Sparkles },
  { href: "/admin/messages", label: "Messages", icon: Mail },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  async function handleLogout() {
    setOpen(false);
    if (isSupabaseConfigured()) {
      const supabase = createClient();
      await supabase.auth.signOut();
    }
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <>
      {/* Mobile top bar */}
      <header className="fixed inset-x-0 top-0 z-30 flex h-14 items-center gap-3 border-b border-card-border bg-card px-4 lg:hidden">
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Open menu"
          className="text-foreground"
        >
          <Menu size={22} />
        </button>
        <Link href="/admin" className="text-base font-bold gradient-text">
          Admin Panel
        </Link>
        <button
          type="button"
          onClick={handleLogout}
          aria-label="Logout"
          title="Logout"
          className="ml-auto flex h-9 w-9 items-center justify-center rounded-lg text-red-400 transition-colors hover:bg-red-500/10"
        >
          <LogOut size={18} />
        </button>
      </header>

      {/* Backdrop (mobile only, when drawer open) */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setOpen(false)}
          aria-hidden
        />
      )}

      <aside
        className={`fixed left-0 top-0 z-50 flex h-screen w-64 flex-col border-r border-card-border bg-card transition-transform duration-300 lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-card-border p-6">
          <div>
            <Link href="/admin" className="font-display text-lg font-bold text-foreground">
              Portfolio Admin
            </Link>
            <p className="mt-1 text-xs text-muted">Content management</p>
          </div>
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Close menu"
            className="text-muted hover:text-foreground lg:hidden"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto p-4">
          {links.map((link) => {
            const active =
              link.href === "/admin"
                ? pathname === "/admin"
                : pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className={`flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium transition-colors ${
                  active
                    ? "bg-accent/10 text-accent"
                    : "text-muted hover:bg-card-border/30 hover:text-foreground"
                }`}
              >
                <link.icon size={18} />
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="shrink-0 space-y-1 border-t border-card-border p-4">
          <Link
            href="/"
            target="_blank"
            onClick={() => setOpen(false)}
            className="flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm text-muted transition-colors hover:text-foreground"
          >
            <ExternalLink size={18} />
            View Site
          </Link>
          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-sm text-red-400 transition-colors hover:bg-red-500/10"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}
