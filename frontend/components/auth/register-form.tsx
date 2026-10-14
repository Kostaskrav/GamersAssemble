"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { registerSchema, type RegisterFormValues } from "@/schemas/auth";
import { login, register as registerUser } from "@/lib/api/auth";
import { ApiError } from "@/lib/api/client";
import { useAuthStore } from "@/stores/auth-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function RegisterForm() {
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: "",
      username: "",
      password: "",
      displayName: "",
    },
  });

  const mutation = useMutation({
    mutationFn: async (values: RegisterFormValues) => {
      await registerUser({
        email: values.email,
        username: values.username,
        password: values.password,
        displayName: values.displayName || undefined,
      });
      return login({ email: values.email, password: values.password });
    },
    onSuccess: (data) => {
      setAuth(data.accessToken, data.user);
      router.push("/");
    },
  });

  const errorMessage =
    mutation.error instanceof ApiError
      ? mutation.error.message
      : mutation.error
        ? "Registration failed"
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
          {...register("email")}
        />
        {errors.email && (
          <p className="mt-1 text-xs text-[var(--color-bug)]">{errors.email.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="username">Username</Label>
        <Input
          id="username"
          autoComplete="username"
          {...register("username")}
        />
        {errors.username && (
          <p className="mt-1 text-xs text-[var(--color-bug)]">
            {errors.username.message}
          </p>
        )}
      </div>

      <div>
        <Label htmlFor="displayName">Display name (optional)</Label>
        <Input id="displayName" {...register("displayName")} />
        {errors.displayName && (
          <p className="mt-1 text-xs text-[var(--color-bug)]">
            {errors.displayName.message}
          </p>
        )}
      </div>

      <div>
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          autoComplete="new-password"
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
        {mutation.isPending ? "Creating account..." : "Create account"}
      </Button>

      <p className="text-center text-sm text-[var(--color-mist)]">
        Already here?{" "}
        <Link
          href="/login"
          className="text-[var(--color-signal)] underline-offset-2 hover:underline"
        >
          Log in
        </Link>
      </p>
    </form>
  );
}
