"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LogOut, Plus, Gamepad2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuthStore, useIsAuthenticated } from "@/stores/auth-store";
import { cn, displayName } from "@/lib/utils";

const links = [
  { href: "/", label: "Games" },
  { href: "/posts/new", label: "New post", auth: true },
];

export function SiteHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const clearAuth = useAuthStore((state) => state.clearAuth);
  const { isAuthenticated, hydrated } = useIsAuthenticated();

  return (
    <header className="sticky top-0 z-40 border-b border-[var(--color-ink-border)]/80 bg-[color-mix(in_srgb,var(--color-ink)_88%,transparent)] backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link href="/" className="group flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-md border border-[var(--color-signal)]/30 bg-[color-mix(in_srgb,var(--color-signal)_12%,transparent)] text-[var(--color-signal)] transition group-hover:shadow-[0_0_20px_rgba(62,224,162,0.25)]">
            <Gamepad2 className="h-4.5 w-4.5" size={18} />
          </span>
          <span className="font-display text-lg font-bold tracking-tight text-[var(--color-snow)] sm:text-xl">
            Gamers<span className="text-[var(--color-signal)]">Assemble</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 sm:flex">
          {links.map((link) => {
            if (link.auth && !isAuthenticated) return null;
            const active =
              link.href === "/"
                ? pathname === "/" || pathname.startsWith("/games/")
                : pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "rounded-md px-3 py-2 text-sm transition",
                  active
                    ? "text-[var(--color-snow)]"
                    : "text-[var(--color-mist)] hover:text-[var(--color-snow)]",
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          {hydrated && isAuthenticated ? (
            <>
              <Button
                size="sm"
                onClick={() => router.push("/posts/new")}
                className="hidden sm:inline-flex"
              >
                <Plus size={16} />
                Post
              </Button>
              <div className="hidden text-right sm:block">
                <p className="text-sm font-medium text-[var(--color-snow)]">
                  {user ? displayName(user) : "Player"}
                </p>
                <p className="text-xs text-[var(--color-mist)]">
                  @{user?.username}
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                aria-label="Log out"
                onClick={() => {
                  clearAuth();
                  router.push("/");
                }}
              >
                <LogOut size={16} />
              </Button>
            </>
          ) : hydrated ? (
            <>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push("/login")}
              >
                Log in
              </Button>
              <Button size="sm" onClick={() => router.push("/register")}>
                Join
              </Button>
            </>
          ) : (
            <div className="h-9 w-24 animate-pulse rounded-md bg-white/5" />
          )}
        </div>
      </div>
    </header>
  );
}
