"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getMe, type MeResponse } from "@/services/authService";
import { AuroraBackground } from "@/components/velora/aurora-background";
import { BlurFade } from "@/components/velora/blur-fade";
import { SpotlightCard } from "@/components/velora/spotlight-card";
import { AnimatedGradientText } from "@/components/velora/animated-gradient-text";
import { Loader2, Mail, PlaneTakeoff, CalendarDays } from "lucide-react";

function formatMemberSince(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", { month: "long", year: "numeric" });
}

export default function ProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState<MeResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) { router.replace("/login"); return; }
    getMe(token)
      .then(setProfile)
      .catch((err) => setError(err instanceof Error ? err.message : "Failed to load profile."))
      .finally(() => setLoading(false));
  }, [router]);

  if (loading) {
    return (
      <main className="flex-1 flex items-center justify-center min-h-screen bg-[var(--background)]">
        <Loader2 className="w-8 h-8 animate-spin text-[var(--primary)]" />
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen bg-[var(--background)] flex items-center justify-center px-4">
        <p className="text-red-400 text-sm">{error}</p>
      </main>
    );
  }

  if (!profile) return null;

  const initial = profile.name.charAt(0).toUpperCase();

  return (
    <main className="relative min-h-screen bg-[var(--background)] px-4 py-16 overflow-hidden">
      <AuroraBackground intensity="subtle" />

      <div className="relative z-10 max-w-md mx-auto flex flex-col gap-6">

        {/* Avatar + name */}
        <BlurFade delay={0.05}>
          <div className="flex flex-col items-center gap-3 text-center">
            {/* gradient avatar */}
            <div className="relative w-20 h-20">
              <div className="w-20 h-20 rounded-full brand-gradient flex items-center justify-center text-white text-3xl font-black shadow-xl shadow-[var(--brand-from)]/40">
                {initial}
              </div>
              {/* glow ring */}
              <div
                aria-hidden
                className="absolute inset-0 rounded-full opacity-30"
                style={{ boxShadow: "0 0 32px 8px var(--brand-from)" }}
              />
            </div>

            <div>
              <h1 className="text-2xl font-black tracking-tight">
                <AnimatedGradientText>{profile.name}</AnimatedGradientText>
              </h1>
              <p className="text-sm text-[var(--muted-foreground)] mt-0.5">
                Member since {formatMemberSince(profile.created_at)}
              </p>
            </div>
          </div>
        </BlurFade>

        {/* Stats row */}
        <BlurFade delay={0.1}>
          <div className="grid grid-cols-2 gap-3">
            <SpotlightCard>
              <div className="px-5 py-4 flex flex-col items-center gap-1">
                <div className="w-9 h-9 rounded-xl brand-gradient flex items-center justify-center text-white mb-1">
                  <PlaneTakeoff className="w-4 h-4" />
                </div>
                <span className="text-2xl font-black text-[var(--foreground)]">{profile.total_trips}</span>
                <span className="text-xs text-[var(--muted-foreground)] font-medium">Trips Generated</span>
              </div>
            </SpotlightCard>

            <SpotlightCard>
              <div className="px-5 py-4 flex flex-col items-center gap-1">
                <div className="w-9 h-9 rounded-xl brand-gradient flex items-center justify-center text-white mb-1">
                  <CalendarDays className="w-4 h-4" />
                </div>
                <span className="text-2xl font-black text-[var(--foreground)]">
                  {new Date().getFullYear() - new Date(profile.created_at).getFullYear() === 0
                    ? "< 1"
                    : new Date().getFullYear() - new Date(profile.created_at).getFullYear()}
                </span>
                <span className="text-xs text-[var(--muted-foreground)] font-medium">Years Active</span>
              </div>
            </SpotlightCard>
          </div>
        </BlurFade>

        {/* Info card */}
        <BlurFade delay={0.15}>
          <SpotlightCard>
            <div className="divide-y divide-[var(--border)]">
              <div className="flex items-center gap-3 px-5 py-4">
                <Mail className="w-4 h-4 text-[var(--brand-via)] flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[var(--muted-foreground)]">Email</p>
                  <p className="text-sm text-[var(--foreground)] truncate mt-0.5">{profile.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 px-5 py-4">
                <PlaneTakeoff className="w-4 h-4 text-[var(--brand-via)] flex-shrink-0" />
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[var(--muted-foreground)]">Trips Generated</p>
                  <p className="text-sm text-[var(--foreground)] mt-0.5">{profile.total_trips}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 px-5 py-4">
                <CalendarDays className="w-4 h-4 text-[var(--brand-via)] flex-shrink-0" />
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[var(--muted-foreground)]">Member Since</p>
                  <p className="text-sm text-[var(--foreground)] mt-0.5">{formatMemberSince(profile.created_at)}</p>
                </div>
              </div>
            </div>
          </SpotlightCard>
        </BlurFade>
      </div>
    </main>
  );
}
