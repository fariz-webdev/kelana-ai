"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface SpotlightCardProps extends React.HTMLAttributes<HTMLDivElement> {
  spotlightColor?: string;
}

/**
 * Velora Spotlight Card — radial glow that follows the cursor.
 */
export function SpotlightCard({
  className,
  children,
  spotlightColor = "rgba(139,92,246,0.15)",
  ...props
}: SpotlightCardProps) {
  const cardRef = React.useRef<HTMLDivElement>(null);

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    cardRef.current?.style.setProperty("--x", `${x}px`);
    cardRef.current?.style.setProperty("--y", `${y}px`);
  }

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      className={cn(
        "group relative overflow-hidden rounded-2xl border border-[var(--border)]",
        "bg-[var(--card)] transition-all duration-300",
        "hover:border-[color-mix(in_oklch,var(--brand-from)_40%,var(--border))]",
        className
      )}
      style={
        {
          "--x": "50%",
          "--y": "50%",
          "--spotlight-color": spotlightColor,
        } as React.CSSProperties
      }
      {...props}
    >
      {/* spotlight overlay */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"
        style={{
          background: `radial-gradient(300px circle at var(--x) var(--y), var(--spotlight-color), transparent 70%)`,
        }}
      />
      {children}
    </div>
  );
}
