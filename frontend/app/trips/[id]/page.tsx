"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { getTrip, type Trip } from "@/services/tripService";
import TripRecommendation from "@/components/TripRecommendation";
import { BlurFade } from "@/components/velora/blur-fade";
import { SpotlightCard } from "@/components/velora/spotlight-card";
import {
  Loader2,
  ArrowLeft,
  MapPin,
  Wallet,
  CalendarDays,
  Tag,
  Compass,
} from "lucide-react";
import { cn } from "@/lib/utils";

const categoryConfig: Record<string, { cls: string }> = {
  Standard:   { cls: "bg-violet-500/15 text-violet-300 border-violet-500/25" },
  Backpacker: { cls: "bg-orange-500/15 text-orange-300 border-orange-500/25" },
  Luxury:     { cls: "bg-emerald-500/15 text-emerald-300 border-emerald-500/25" },
};

interface InfoTileProps {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
}

function InfoTile({ icon, label, value }: InfoTileProps) {
  return (
    <div className="flex flex-col gap-1.5 rounded-2xl bg-[var(--surface-1)] border border-[var(--border)] px-4 py-3">
      <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.12em] text-[var(--muted-foreground)]">
        <span className="text-[var(--brand-via)]">{icon}</span>
        {label}
      </span>
      <span className="text-sm font-semibold text-[var(--foreground)]">{value}</span>
    </div>
  );
}

export default function TripDetailPage() {
  const { id }  = useParams<{ id: string }>();
  const router  = useRouter();
  const [trip,    setTrip]    = useState<Trip | null>(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) { router.replace("/login"); return; }
    getTrip(Number(id), token)
      .then(setTrip)
      .catch((err) => setError(err instanceof Error ? err.message : "Failed to load trip."))
      .finally(() => setLoading(false));
  }, [id, router]);

  if (loading) {
    return (
      <main className="flex-1 flex items-center justify-center min-h-screen bg-[var(--background)]">
        <Loader2 className="w-8 h-8 animate-spin text-[var(--primary)]" />
      </main>
    );
  }

  if (error || !trip) {
    return (
      <main className="min-h-screen bg-[var(--background)] flex flex-col items-center justify-center gap-4 px-4">
        <p className="text-red-400 text-sm">{error ?? "Trip not found."}</p>
        <Link href="/trips" className="text-sm text-[var(--primary)] hover:underline flex items-center gap-1">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Trip History
        </Link>
      </main>
    );
  }

  const { cls: catCls } = categoryConfig[trip.category] ?? { cls: "bg-[var(--surface-2)] text-[var(--muted-foreground)] border-[var(--border)]" };

  return (
    <main className="min-h-screen bg-[var(--background)] py-10 px-4">
      <div className="max-w-2xl mx-auto flex flex-col gap-6">

        {/* Back link */}
        <BlurFade delay={0}>
          <Link
            href="/trips"
            className="inline-flex items-center gap-1.5 text-sm text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Trip History
          </Link>
        </BlurFade>

        {/* Title + badge */}
        <BlurFade delay={0.05}>
          <div className="flex items-start gap-3">
            <div className="w-12 h-12 rounded-2xl brand-gradient flex items-center justify-center text-white flex-shrink-0 shadow-lg shadow-[var(--brand-from)]/30">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-3xl font-black tracking-tight text-[var(--foreground)]">
                {trip.destination}
              </h1>
              <span className={cn("inline-block mt-1 text-xs font-semibold px-2.5 py-0.5 rounded-full border", catCls)}>
                {trip.category}
              </span>
            </div>
          </div>
        </BlurFade>

        {/* Info grid */}
        <BlurFade delay={0.1}>
          <div className="grid grid-cols-2 gap-3">
            <InfoTile icon={<MapPin    className="w-3.5 h-3.5" />} label="Destination" value={trip.destination} />
            <InfoTile icon={<Wallet    className="w-3.5 h-3.5" />} label="Budget"      value={`USD ${trip.budget.toLocaleString()}`} />
            <InfoTile icon={<CalendarDays className="w-3.5 h-3.5" />} label="Days"    value={`${trip.days} days`} />
            <InfoTile icon={<Compass   className="w-3.5 h-3.5" />} label="Style"       value={trip.travel_style ?? "—"} />
          </div>
        </BlurFade>

        {/* AI Recommendation */}
        {trip.ai_recommendation && (
          <BlurFade delay={0.15}>
            <SpotlightCard className="overflow-visible">
              <div className="px-5 py-4">
                <p className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.12em] text-[var(--brand-via)] mb-4">
                  <Tag className="w-3.5 h-3.5" />
                  AI Recommendation
                </p>
                <TripRecommendation content={trip.ai_recommendation} />
              </div>
            </SpotlightCard>
          </BlurFade>
        )}
      </div>
    </main>
  );
}
