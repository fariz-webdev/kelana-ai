import Image from "next/image";
import Link from "next/link";
import { AuroraBackground } from "@/components/velora/aurora-background";
import { BlurFade } from "@/components/velora/blur-fade";
import { ShimmerButton } from "@/components/velora/shimmer-button";

export default function NotFound() {
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
            404
          </p>
          <h1 className="text-2xl font-bold text-[var(--foreground)] -mt-2">
            Page Not Found
          </h1>
          <p className="text-[var(--muted-foreground)] text-sm mt-2 leading-relaxed">
            Looks like this destination doesn&apos;t exist on our map.
            <br />
            Let&apos;s get you back on track.
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full justify-center">
          <Link href="/">
            <ShimmerButton className="px-6 py-2.5 rounded-xl text-sm">
              Back to Home
            </ShimmerButton>
          </Link>
          <Link
            href="/trips"
            className="px-6 py-2.5 rounded-xl text-sm font-semibold text-[var(--muted-foreground)] border border-[var(--border)] hover:border-[var(--brand-via)]/50 hover:text-[var(--foreground)] transition-all"
          >
            My Trips
          </Link>
        </div>
      </BlurFade>
    </main>
  );
}
