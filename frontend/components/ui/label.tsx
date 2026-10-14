import { cn } from "@/lib/utils";

type LabelProps = React.LabelHTMLAttributes<HTMLLabelElement>;

export function Label({ className, ...props }: LabelProps) {
  return (
    <label
      className={cn(
        "mb-1.5 block text-xs font-medium uppercase tracking-[0.08em] text-[var(--color-mist)]",
        className,
      )}
      {...props}
    />
  );
}
