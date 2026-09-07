"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { type Trip } from "@/services/tripService";
import TripsClient from "@/components/TripsClient";
import { BlurFade } from "@/components/velora/blur-fade";
import { ShimmerButton } from "@/components/velora/shimmer-button";
import { Loader2, PlaneTakeoff } from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function TripsPage() {
  const router = useRouter();
  const [trips,   setTrips]   = useState<Trip[]>([]);
  const [error,   setError]   = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) { router.replace("/login"); return; }

    fetch(`${API_URL}api/v1/trips`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(async (res) => {
        if (!res.ok) {
          const body = await res.json().catch(() => ({}));
          throw new Error(body.detail ?? `Failed to fetch trips (${res.status})`);
        }
        return res.json() as Promise<Trip[]>;
      })
      .then(setTrips)
      .catch((err) => setError(err instanceof Error ? err.message : "Failed to load trips."))
      .finally(() => setLoading(false));
  }, [router]);

  if (loading) {
    return (
      <main className="flex-1 flex items-center justify-center min-h-screen bg-[var(--background)]">
        <Loader2 className="w-8 h-8 animate-spin text-[var(--primary)]" />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[var(--background)] px-4 py-10">
      <div className="max-w-3xl mx-auto">

        {/* Header */}
        <BlurFade delay={0.05}>
          <div className="mb-8 flex items-end justify-between">
            <div>
              <h1 className="text-3xl font-black tracking-tight text-[var(--foreground)]">
                Trip History
              </h1>
              <p className="text-sm text-[var(--muted-foreground)] mt-1">
                {trips.length} saved itinerar{trips.length === 1 ? "y" : "ies"}
              </p>
            </div>
            <Link href="/">
              <ShimmerButton className="px-4 py-2 text-sm rounded-xl">
                + New Trip
              </ShimmerButton>
            </Link>
          </div>
        </BlurFade>

        {error ? (
          <p className="text-red-400 text-sm">{error}</p>
        ) : trips.length === 0 ? (
          <BlurFade delay={0.1}>
            <div className="rounded-3xl border border-[var(--border)] bg-[var(--card)] flex flex-col items-center justify-center py-20 px-6 text-center">
              <div className="w-14 h-14 rounded-2xl brand-gradient flex items-center justify-center text-white mb-5 shadow-lg shadow-[var(--brand-from)]/30">
                <PlaneTakeoff className="w-6 h-6" />
              </div>
              <p className="text-[var(--foreground)] font-bold text-lg mb-1">No trips yet</p>
              <p className="text-[var(--muted-foreground)] text-sm mb-7 max-w-xs">
                Generate your first AI-powered itinerary and it will appear here.
              </p>
              <Link href="/">
                <ShimmerButton className="px-6 py-2.5 text-sm rounded-full">
                  Plan a trip
                </ShimmerButton>
              </Link>
            </div>
          </BlurFade>
        ) : (
          <BlurFade delay={0.1}>
            <TripsClient trips={trips} />
          </BlurFade>
        )}
      </div>
    </main>
  );
}
