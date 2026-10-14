import { Suspense } from "react";
import { LoginForm } from "@/components/auth/login-form";

export default function LoginPage() {
  return (
    <div className="mx-auto max-w-md space-y-6">
      <div className="text-center">
        <h1 className="font-display text-3xl font-extrabold tracking-tight">
          Welcome back
        </h1>
        <p className="mt-2 text-sm text-[var(--color-mist)]">
          Log in to post feedback and join discussions.
        </p>
      </div>
      <Suspense fallback={<div className="h-64 animate-pulse rounded-lg bg-white/5" />}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
