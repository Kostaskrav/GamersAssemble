import { RegisterForm } from "@/components/auth/register-form";

export default function RegisterPage() {
  return (
    <div className="mx-auto max-w-md space-y-6">
      <div className="text-center">
        <h1 className="font-display text-3xl font-extrabold tracking-tight">
          Join the forum
        </h1>
        <p className="mt-2 text-sm text-[var(--color-mist)]">
          Browse freely — create an account when you want to post.
        </p>
      </div>
      <RegisterForm />
    </div>
  );
}
