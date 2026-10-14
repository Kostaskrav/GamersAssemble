import { cn } from "@/lib/utils";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
};

const variants = {
  primary:
    "bg-[var(--color-signal)] text-[var(--color-ink)] hover:brightness-110 shadow-[0_0_24px_rgba(62,224,162,0.2)]",
  secondary:
    "surface text-[var(--color-snow)] hover:border-[var(--color-signal)]/40",
  ghost: "bg-transparent text-[var(--color-mist)] hover:text-[var(--color-snow)] hover:bg-white/5",
  danger:
    "bg-[color-mix(in_srgb,var(--color-bug)_18%,transparent)] text-[var(--color-bug)] border border-[color-mix(in_srgb,var(--color-bug)_35%,transparent)] hover:bg-[color-mix(in_srgb,var(--color-bug)_28%,transparent)]",
};

const sizes = {
  sm: "h-9 px-3 text-sm",
  md: "h-11 px-4 text-sm",
  lg: "h-12 px-5 text-base",
};

export function Button({
  className,
  variant = "primary",
  size = "md",
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-md font-medium transition duration-200 disabled:pointer-events-none disabled:opacity-50",
        variants[variant],
        sizes[size],
        className,
      )}
      {...props}
    />
  );
}
