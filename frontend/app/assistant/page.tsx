"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { askAssistant, type AskResponse } from "@/services/assistantService";
import { AuroraBackground } from "@/components/velora/aurora-background";
import { BlurFade } from "@/components/velora/blur-fade";
import { ShimmerButton } from "@/components/velora/shimmer-button";
import { SpotlightCard } from "@/components/velora/spotlight-card";
import { AnimatedGradientText } from "@/components/velora/animated-gradient-text";
import { Loader2, Search, FileText, HelpCircle } from "lucide-react";

export default function AssistantPage() {
  const router   = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  const [question,    setQuestion]    = useState("");
  const [result,      setResult]      = useState<AskResponse | null>(null);
  const [loading,     setLoading]     = useState(false);
  const [error,       setError]       = useState<string | null>(null);
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) router.replace("/login");
    else setAuthChecked(true);
  }, [router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!question.trim()) return;
    const token = localStorage.getItem("access_token");
    if (!token) { router.replace("/login"); return; }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const data = await askAssistant(question.trim(), token);
      setResult(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to connect to the server.");
    } finally {
      setLoading(false);
    }
  }

  if (!authChecked) {
    return (
      <main className="flex-1 flex items-center justify-center min-h-screen bg-[var(--background)]">
        <Loader2 className="w-8 h-8 animate-spin text-[var(--primary)]" />
      </main>
    );
  }

  return (
    <main className="relative min-h-screen bg-[var(--background)] px-4 py-10 overflow-hidden">
      <AuroraBackground intensity="subtle" />

      <div className="relative z-10 max-w-2xl mx-auto flex flex-col gap-6">

        {/* Heading */}
        <BlurFade delay={0.05}>
          <div>
            <h1 className="text-3xl font-black tracking-tight">
              Ask{" "}
              <AnimatedGradientText>KelanaAI</AnimatedGradientText>
            </h1>
            <p className="text-sm text-[var(--muted-foreground)] mt-1">
              Powered by your trusted travel documents
            </p>
          </div>
        </BlurFade>

        {/* Search bar */}
        <BlurFade delay={0.1}>
          <form onSubmit={handleSubmit} className="flex gap-2">
            <div className="flex-1 flex items-center gap-2 bg-[var(--surface-1)] border border-[var(--border)] rounded-2xl px-4 py-3 focus-within:border-[var(--brand-via)]/60 transition-all">
              <Search className="w-4 h-4 text-[var(--muted-foreground)] flex-shrink-0" />
              <input
                ref={inputRef}
                type="text"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="Ask anything about your trip plan…"
                disabled={loading}
                className="flex-1 bg-transparent text-sm text-[var(--foreground)] placeholder-[var(--muted-foreground)] outline-none disabled:opacity-60"
              />
            </div>
            <ShimmerButton
              type="submit"
              disabled={loading || !question.trim()}
              className="px-5 py-3 rounded-2xl text-sm"
            >
              {loading
                ? <Loader2 className="w-4 h-4 animate-spin" />
                : "Ask"}
            </ShimmerButton>
          </form>
        </BlurFade>

        {/* Error */}
        {error && (
          <div className="rounded-2xl bg-red-500/10 border border-red-500/30 px-4 py-3 text-sm text-red-400">
            {error}
          </div>
        )}

        {/* Answer card */}
        {result && (
          <BlurFade delay={0}>
            <SpotlightCard>
              {/* Answer */}
              <div className="px-6 pt-6 pb-5">
                <p className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.12em] text-[var(--brand-via)] mb-3">
                  <HelpCircle className="w-3.5 h-3.5" />
                  AI Answer
                </p>
                <p className="text-[var(--foreground)] text-sm leading-relaxed whitespace-pre-wrap">
                  {result.answer}
                </p>
              </div>

              {/* Sources */}
              {result.sources.length > 0 && (
                <>
                  <div className="mx-6 border-t border-[var(--border)]" />
                  <div className="px-6 py-4">
                    <p className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.12em] text-[var(--brand-via)] mb-3">
                      <FileText className="w-3.5 h-3.5" />
                      Sources
                    </p>
                    <ul className="flex flex-col gap-1.5">
                      {result.sources.map((s, i) => (
                        <li key={i} className="flex items-center gap-2">
                          <FileText className="w-3.5 h-3.5 text-[var(--muted-foreground)] flex-shrink-0" />
                          {s.source ? (
                            <a
                              href={s.source}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm text-[var(--primary)] hover:underline truncate"
                            >
                              {s.filename}
                            </a>
                          ) : (
                            <span className="text-sm text-[var(--muted-foreground)]">{s.filename}</span>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                </>
              )}
            </SpotlightCard>
          </BlurFade>
        )}

        {/* Empty state */}
        {!result && !error && !loading && (
          <BlurFade delay={0.15}>
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="w-14 h-14 rounded-2xl brand-gradient flex items-center justify-center text-white mb-4 shadow-lg shadow-[var(--brand-from)]/30">
                <HelpCircle className="w-6 h-6" />
              </div>
              <p className="text-[var(--foreground)] font-bold text-base mb-1">
                Ask anything about travel
              </p>
              <p className="text-[var(--muted-foreground)] text-sm max-w-xs">
                KelanaAI answers using your trusted travel documents as the source.
              </p>
            </div>
          </BlurFade>
        )}
      </div>
    </main>
  );
}
