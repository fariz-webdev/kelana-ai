import { cn } from "@/lib/utils";

interface AnimatedGradientTextProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * Velora Animated Gradient Text — brand gradient sweeping continuously through text.
 */
export function AnimatedGradientText({
  children,
  className,
}: AnimatedGradientTextProps) {
  return (
    <span
      className={cn("inline-block", className)}
      style={{
        background:
          "linear-gradient(90deg, var(--brand-from), var(--brand-via), var(--brand-to), var(--brand-from))",
        backgroundSize: "200% auto",
        WebkitBackgroundClip: "text",
        backgroundClip: "text",
        WebkitTextFillColor: "transparent",
        animation: "shimmer 3s linear infinite",
      }}
    >
      {children}
    </span>
  );
}
