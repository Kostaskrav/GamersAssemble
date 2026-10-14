"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { loginSchema, type LoginFormValues } from "@/schemas/auth";
import { login } from "@/lib/api/auth";
import { ApiError } from "@/lib/api/client";
import { useAuthStore } from "@/stores/auth-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const setAuth = useAuthStore((state) => state.setAuth);
  const next = searchParams.get("next") || "/";

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const mutation = useMutation({
    mutationFn: login,
    onSuccess: (data) => {
      setAuth(data.accessToken, data.user);
      router.push(next);
    },
  });

  const errorMessage =
    mutation.error instanceof ApiError
      ? mutation.error.message
      : mutation.error
        ? "Login failed"
        : null;

  return (
    <form
      onSubmit={handleSubmit((values) => mutation.mutate(values))}
      className="surface space-y-4 rounded-lg p-6"
    >
      <div>
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          {...register("email")}
        />
        {errors.email && (
          <p className="mt-1 text-xs text-[var(--color-bug)]">{errors.email.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          autoComplete="current-password"
          {...register("password")}
        />
        {errors.password && (
          <p className="mt-1 text-xs text-[var(--color-bug)]">
            {errors.password.message}
          </p>
        )}
      </div>

      {errorMessage && (
        <p className="rounded-md border border-[color-mix(in_srgb,var(--color-bug)_35%,transparent)] bg-[color-mix(in_srgb,var(--color-bug)_12%,transparent)] px-3 py-2 text-sm text-[var(--color-bug)]">
          {errorMessage}
        </p>
      )}

      <Button type="submit" className="w-full" disabled={mutation.isPending}>
        {mutation.isPending ? "Signing in..." : "Log in"}
      </Button>

      <p className="text-center text-sm text-[var(--color-mist)]">
        No account?{" "}
        <Link
          href="/register"
          className="text-[var(--color-signal)] underline-offset-2 hover:underline"
        >
          Join the forum
        </Link>
      </p>
    </form>
  );
}
