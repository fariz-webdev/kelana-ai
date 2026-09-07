"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";
import { AuroraBackground } from "@/components/velora/aurora-background";
import { BlurFade } from "@/components/velora/blur-fade";
import { ShimmerButton } from "@/components/velora/shimmer-button";

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    // Log to error reporting in production
    console.error(error);
  }, [error]);

  return (
    <main className="relative min-h-screen bg-[var(--background)] flex items-center justify-center px-4 overflow-hidden">
      <AuroraBackground intensity="medium" />

      {/* noise overlay */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />

      <BlurFade delay={0.05} className="relative z-10 flex flex-col items-center text-center gap-6 max-w-md">
        {/* Logo */}
        <Image
          src="/KelanaKemana-3-2.png"
          alt="KelanaAI logo"
          width={160}
          height={160}
          className="object-contain drop-shadow-2xl"
          priority
        />

        {/* Error code */}
        <div>
          <p className="text-[120px] font-black leading-none brand-gradient-text select-none">
            500
          </p>
          <h1 className="text-2xl font-bold text-[var(--foreground)] -mt-2">
            Something Went Wrong
          </h1>
          <p className="text-[var(--muted-foreground)] text-sm mt-2 leading-relaxed">
            Our AI hit some turbulence. The crew is on it.
            <br />
            Try again or head back to safety.
          </p>

          {/* Error detail (dev only) */}
          {error?.message && (
            <p className="mt-3 text-xs text-red-400/70 font-mono bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2 max-w-xs mx-auto break-words">
              {error.message}
            </p>
          )}
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full justify-center">
          <ShimmerButton
            onClick={reset}
            className="px-6 py-2.5 rounded-xl text-sm"
          >
            Try Again
          </ShimmerButton>
          <Link
            href="/"
            className="px-6 py-2.5 rounded-xl text-sm font-semibold text-[var(--muted-foreground)] border border-[var(--border)] hover:border-[var(--brand-via)]/50 hover:text-[var(--foreground)] transition-all"
          >
            Back to Home
          </Link>
        </div>
      </BlurFade>
    </main>
  );
}
