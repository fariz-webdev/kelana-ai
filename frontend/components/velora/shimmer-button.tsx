import * as React from "react";
import { cn } from "@/lib/utils";

interface ShimmerButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  shimmerColor?: string;
  shimmerSize?: string;
  borderRadius?: string;
  background?: string;
  children: React.ReactNode;
}

/**
 * Velora Shimmer Button — CTA button with a continuous light sweep
 * using the Aurora Violet brand ramp.
 */
export function ShimmerButton({
  className,
  children,
  shimmerColor = "rgba(255,255,255,0.12)",
  shimmerSize = "0.1em",
  borderRadius = "0.75rem",
  background,
  disabled,
  ...props
}: ShimmerButtonProps) {
  return (
    <button
      disabled={disabled}
      className={cn(
        "group relative inline-flex items-center justify-center gap-2 overflow-hidden",
        "px-6 py-3 font-semibold text-white transition-all duration-300",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)]",
        "disabled:cursor-not-allowed disabled:opacity-50",
        "hover:scale-[1.02] active:scale-[0.98]",
        className
      )}
      style={{
        borderRadius,
        background: background ?? "linear-gradient(135deg, var(--brand-from), var(--brand-via), var(--brand-to))",
        boxShadow: disabled ? "none" : "0 0 24px color-mix(in oklch, var(--brand-from) 40%, transparent)",
        ...props.style,
      }}
      {...props}
    >
      {/* shimmer sweep */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background: `linear-gradient(105deg, transparent 40%, ${shimmerColor} 50%, transparent 60%)`,
          backgroundSize: "200% 100%",
          animation: "shimmer 1.6s linear infinite",
        }}
      />
      <span className="relative z-10 flex items-center gap-2">{children}</span>
    </button>
  );
}
