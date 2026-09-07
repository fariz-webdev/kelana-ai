"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AuroraBackground } from "@/components/velora/aurora-background";
import { ShimmerButton } from "@/components/velora/shimmer-button";
import { BlurFade } from "@/components/velora/blur-fade";
import { AnimatedGradientText } from "@/components/velora/animated-gradient-text";
import { Loader2, MapPin, Wallet, CalendarDays, Compass } from "lucide-react";
import { cn } from "@/lib/utils";

const TRAVEL_STYLES = ["Solo", "Couple", "Family", "Business", "Cultural", "Luxury"];

interface FieldConfig {
  id: string;
  label: string;
  icon: React.ReactNode;
  type?: string;
  placeholder: string;
  isSelect?: boolean;
}

export default function Home() {
  const router = useRouter();
  const [destination, setDestination] = useState("");
  const [budget, setBudget]           = useState("");
  const [days, setDays]               = useState("");
  const [travelStyle, setTravelStyle] = useState("");
  const [loading, setLoading]         = useState(false);
  const [error, setError]             = useState<string | null>(null);
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      router.replace("/login");
    } else {
      setAuthChecked(true);
    }
  }, [router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("access_token");
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}api/v1/trips`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          destination,
          budget: Number(budget),
          days: Number(days),
          travel_style: travelStyle,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.detail ?? "Something went wrong");
      }

      await res.json();
      router.push("/trips");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to connect to the server");
    } finally {
      setLoading(false);
    }
  }

  /* ── loading state ────────────────────────────────────────── */
  if (!authChecked) {
    return (
      <main className="flex-1 flex items-center justify-center min-h-screen bg-[var(--background)]">
        <Loader2 className="w-8 h-8 animate-spin text-[var(--primary)]" />
      </main>
    );
  }

  return (
    <main className="relative min-h-screen bg-[var(--background)] overflow-hidden flex flex-col">

      {/* ── Aurora hero ─────────────────────────────────────── */}
      <div className="relative w-full flex-shrink-0 pt-20 pb-14 px-4 overflow-hidden flex flex-col items-center text-center">
        <AuroraBackground intensity="vivid" />

        {/* noise texture overlay */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          }}
        />

        <BlurFade delay={0.05} className="relative z-10 flex flex-col items-center gap-4">
          {/* pill badge */}
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border border-[var(--brand-from)]/40 bg-[var(--brand-from)]/10 text-[var(--brand-to)] uppercase tracking-widest">
            ✦ AI-Powered Travel Planner
          </span>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-[1.05]">
            <AnimatedGradientText>Kelana</AnimatedGradientText>
            <span className="text-[var(--foreground)]">AI</span>
          </h1>

          <p className="text-[var(--muted-foreground)] text-base sm:text-lg max-w-md leading-relaxed">
            Tell us where you want to go — we&apos;ll build your perfect itinerary in seconds.
          </p>
        </BlurFade>
      </div>

      {/* ── Form card ───────────────────────────────────────── */}
      <div className="relative z-10 flex justify-center px-4 pb-16 -mt-4">
        <BlurFade delay={0.15} className="w-full max-w-2xl">
          <div className="rounded-3xl border border-[var(--border)] bg-[var(--card)]/80 backdrop-blur-xl shadow-2xl shadow-black/40 p-6 sm:p-8">

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">

              {/* ── 2-column grid ─────────────────────────── */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">

                {/* Destination */}
                <FormField
                  icon={<MapPin className="w-4 h-4" />}
                  label="Destination"
                  placeholder="e.g. Japan, Bali, Paris"
                >
                  <input
                    type="text"
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    placeholder="e.g. Japan, Bali, Paris"
                    required
                    className="field-input"
                  />
                </FormField>

                {/* Budget */}
                <FormField
                  icon={<Wallet className="w-4 h-4" />}
                  label="Budget (USD)"
                  placeholder=""
                >
                  <input
                    type="number"
                    min={0}
                    value={budget}
                    onChange={(e) => setBudget(e.target.value)}
                    placeholder="e.g. 2000"
                    required
                    className="field-input"
                  />
                </FormField>

                {/* Days */}
                <FormField
                  icon={<CalendarDays className="w-4 h-4" />}
                  label="Days"
                  placeholder=""
                >
                  <input
                    type="number"
                    min={1}
                    value={days}
                    onChange={(e) => setDays(e.target.value)}
                    placeholder="e.g. 5"
                    required
                    className="field-input"
                  />
                </FormField>

                {/* Travel Style */}
                <FormField
                  icon={<Compass className="w-4 h-4" />}
                  label="Travel Style"
                  placeholder=""
                >
                  <select
                    value={travelStyle}
                    onChange={(e) => setTravelStyle(e.target.value)}
                    required
                    className="field-input cursor-pointer"
                  >
                    <option value="" disabled>Select a style</option>
                    {TRAVEL_STYLES.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </FormField>
              </div>

              {/* Error */}
              {error && (
                <div className="rounded-xl bg-red-500/10 border border-red-500/30 px-4 py-3 text-sm text-red-400">
                  {error}
                </div>
              )}

              {/* Submit */}
              <ShimmerButton
                type="submit"
                disabled={loading}
                className="w-full py-4 text-base rounded-2xl"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Generating your trip…
                  </>
                ) : (
                  <>
                    <span>Generate AI Trip</span>
                    <span aria-hidden className="text-white/70">✦</span>
                  </>
                )}
              </ShimmerButton>
            </form>
          </div>
        </BlurFade>
      </div>

      {/* ── subtle bottom gradient ───────────────────────────── */}
      <div
        aria-hidden
        className="pointer-events-none fixed bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-[var(--background)] to-transparent"
      />
    </main>
  );
}

/* ── FormField wrapper ──────────────────────────────────────── */
function FormField({
  icon,
  label,
  placeholder: _placeholder,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  placeholder: string;
  children: React.ReactNode;
}) {
  return (
    <div className="group flex flex-col gap-1.5 rounded-2xl bg-[var(--surface-1)] border border-[var(--border)] px-4 py-3 transition-all duration-200 focus-within:border-[var(--brand-via)]/60 focus-within:bg-[var(--surface-2)]">
      <label className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.12em] text-[var(--brand-via)]">
        <span className="text-[var(--brand-via)]">{icon}</span>
        {label}
      </label>
      <style jsx>{`
        .field-input {
          width: 100%;
          background: transparent;
          color: var(--foreground);
          font-size: 0.9rem;
          outline: none;
          border: none;
        }
        .field-input::placeholder {
          color: var(--muted-foreground);
        }
        .field-input option {
          background: var(--card);
          color: var(--foreground);
        }
      `}</style>
      {children}
    </div>
  );
}
