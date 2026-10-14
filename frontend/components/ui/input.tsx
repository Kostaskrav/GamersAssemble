import { cn } from "@/lib/utils";

type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

export function Input({ className, ...props }: InputProps) {
  return (
    <input
      className={cn(
        "w-full rounded-md border border-[var(--color-ink-border)] bg-[var(--color-ink)] px-3 py-2.5 text-sm text-[var(--color-snow)] outline-none transition placeholder:text-[var(--color-mist)]/60 focus:border-[var(--color-signal)]/60 focus:ring-2 focus:ring-[var(--color-signal)]/20",
        className,
      )}
      {...props}
    />
  );
}
