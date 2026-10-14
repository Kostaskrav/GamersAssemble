"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useIsAuthenticated } from "@/stores/auth-store";

export function RequireAuth({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, hydrated } = useIsAuthenticated();

  useEffect(() => {
    if (hydrated && !isAuthenticated) {
      router.replace(`/login?next=${encodeURIComponent(pathname)}`);
    }
  }, [hydrated, isAuthenticated, pathname, router]);

  if (!hydrated) {
    return <div className="h-64 animate-pulse rounded-lg bg-white/5" />;
  }

  if (!isAuthenticated) {
    return (
      <div className="surface rounded-lg p-8 text-center text-sm text-[var(--color-mist)]">
        Redirecting to login...
      </div>
    );
  }

  return <>{children}</>;
}
