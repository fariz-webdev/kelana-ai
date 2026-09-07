import Image from "next/image";
import Link from "next/link";
import { AuroraBackground } from "@/components/velora/aurora-background";
import { BlurFade } from "@/components/velora/blur-fade";
import { SpotlightCard } from "@/components/velora/spotlight-card";
import { AnimatedGradientText } from "@/components/velora/animated-gradient-text";
import { ShimmerButton } from "@/components/velora/shimmer-button";

/* ── Data ──────────────────────────────────────────────────────────────────── */

const FEATURES = [
  {
    icon: "✈️",
    title: "AI Itinerary Generator",
    desc: "Describe your destination, budget, and travel style — KelanaAI builds a day-by-day itinerary in seconds powered by Amazon Nova Lite.",
  },
  {
    icon: "💬",
    title: "Travel Chat Assistant",
    desc: "Conversational AI that remembers your history. Ask about routes, costs, local food, or anything travel-related.",
  },
  {
    icon: "📚",
    title: "Knowledge Base Q&A",
    desc: "Ask anything backed by curated travel documents. Answers come with source citations so you know where the info comes from.",
  },
  {
    icon: "🗂️",
    title: "Trip History",
    desc: "All your generated itineraries saved in one place. Search, sort, and revisit any trip at any time.",
  },
  {
    icon: "🔐",
    title: "Secure Auth",
    desc: "JWT-based authentication keeps your trips private. Register once, access from anywhere.",
  },
  {
    icon: "🌙",
    title: "Aurora Violet Dark UI",
    desc: "Built with Velora UI components, Tailwind CSS 4, and animated aurora backgrounds for a premium Gen-Z aesthetic.",
  },
];

const TECH_STACK = [
  {
    category: "Frontend",
    color: "from-violet-500/20 to-indigo-500/10 border-violet-500/25",
    labelColor: "text-violet-300",
    items: [
      { name: "Next.js 16", desc: "App Router, SSR, file-based routing" },
      { name: "React 19",   desc: "Server & Client Components" },
      { name: "TypeScript", desc: "Full type safety across the app" },
      { name: "Tailwind CSS 4", desc: "Utility-first styling with CSS variables" },
      { name: "Velora UI",  desc: "Animated component library (Aurora Violet)" },
      { name: "motion/react", desc: "Smooth entrance animations" },
      { name: "lucide-react", desc: "Consistent icon set" },
    ],
  },
  {
    category: "Backend",
    color: "from-fuchsia-500/20 to-purple-500/10 border-fuchsia-500/25",
    labelColor: "text-fuchsia-300",
    items: [
      { name: "FastAPI",     desc: "High-performance Python REST API" },
      { name: "SQLAlchemy",  desc: "ORM with declarative models" },
      { name: "PostgreSQL",  desc: "Relational database (local or Neon)" },
      { name: "PyJWT + bcrypt", desc: "Secure JWT auth & password hashing" },
      { name: "Uvicorn",     desc: "ASGI production server" },
      { name: "psycopg2",    desc: "Native PostgreSQL adapter" },
    ],
  },
  {
    category: "AI / Cloud",
    color: "from-blue-500/20 to-cyan-500/10 border-blue-500/25",
    labelColor: "text-blue-300",
    items: [
      { name: "Amazon Bedrock", desc: "Managed AI API by AWS" },
      { name: "Amazon Nova Lite", desc: "Fast & cost-efficient foundation model" },
      { name: "AWS Knowledge Base", desc: "Retrieval-augmented Q&A (RAG)" },
      { name: "boto3",        desc: "AWS SDK for Python" },
    ],
  },
];

/* ── Page ──────────────────────────────────────────────────────────────────── */

export default function AboutPage() {
  return (
    <main className="relative bg-[var(--background)] overflow-hidden">
      <AuroraBackground intensity="medium" />

      {/* noise overlay */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 opacity-[0.025] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />

      <div className="relative z-10 max-w-4xl mx-auto px-4 py-16 flex flex-col gap-20">

        {/* ── Hero ───────────────────────────────────────────────── */}
        <BlurFade delay={0.05}>
          <section className="flex flex-col items-center text-center gap-6">
            <Image
              src="/KelanaKemana-3-2.png"
              alt="KelanaAI logo"
              width={120}
              height={120}
              className="object-contain drop-shadow-2xl"
              priority
            />

            <div className="flex flex-col gap-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border border-[var(--brand-from)]/40 bg-[var(--brand-from)]/10 text-[var(--brand-to)] uppercase tracking-widest mx-auto">
                ✦ About KelanaAI
              </span>

              <h1 className="text-4xl sm:text-5xl font-black tracking-tight">
                Travel smarter with{" "}
                <AnimatedGradientText>KelanaAI</AnimatedGradientText>
              </h1>

              <p className="text-[var(--muted-foreground)] text-base sm:text-lg max-w-2xl leading-relaxed mx-auto">
                KelanaAI is an AI-powered travel planning platform that turns your destination,
                budget, and travel style into a complete personalized itinerary — in seconds.
                Built as a Phase 2 capstone project exploring real-world integration of
                large language models with modern web architecture.
              </p>
            </div>

            <Link href="/">
              <ShimmerButton className="px-7 py-3 rounded-xl text-sm">
                Start Planning ✦
              </ShimmerButton>
            </Link>
          </section>
        </BlurFade>

        {/* ── What it does ───────────────────────────────────────── */}
        <BlurFade delay={0.1} inView>
          <section>
            <div className="mb-8 text-center">
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-[var(--foreground)]">
                What KelanaAI can do
              </h2>
              <p className="text-sm text-[var(--muted-foreground)] mt-1.5">
                Everything you need to plan a trip, in one place.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {FEATURES.map((f, i) => (
                <BlurFade key={f.title} delay={0.05 * i} inView>
                  <SpotlightCard className="h-full">
                    <div className="px-5 py-5 flex flex-col gap-3 h-full">
                      <span className="text-3xl leading-none">{f.icon}</span>
                      <div>
                        <h3 className="font-bold text-[var(--foreground)] text-sm">{f.title}</h3>
                        <p className="text-xs text-[var(--muted-foreground)] mt-1 leading-relaxed">{f.desc}</p>
                      </div>
                    </div>
                  </SpotlightCard>
                </BlurFade>
              ))}
            </div>
          </section>
        </BlurFade>

        {/* ── Tech stack ─────────────────────────────────────────── */}
        <BlurFade delay={0.1} inView>
          <section>
            <div className="mb-8 text-center">
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-[var(--foreground)]">
                Tech Stack
              </h2>
              <p className="text-sm text-[var(--muted-foreground)] mt-1.5">
                Built with modern, production-grade tools.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {TECH_STACK.map((stack) => (
                <div
                  key={stack.category}
                  className={`rounded-2xl border bg-gradient-to-b ${stack.color} p-5 flex flex-col gap-4`}
                >
                  <h3 className={`text-xs font-black uppercase tracking-[0.14em] ${stack.labelColor}`}>
                    {stack.category}
                  </h3>
                  <ul className="flex flex-col gap-3">
                    {stack.items.map((item) => (
                      <li key={item.name} className="flex flex-col gap-0.5">
                        <span className="text-sm font-bold text-[var(--foreground)]">{item.name}</span>
                        <span className="text-xs text-[var(--muted-foreground)] leading-snug">{item.desc}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>
        </BlurFade>

        {/* ── Architecture note ──────────────────────────────────── */}
        <BlurFade delay={0.1} inView>
          <section>
            <SpotlightCard>
              <div className="px-6 py-6">
                <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--brand-via)] mb-4">
                  ✦ Architecture Overview
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-sm">
                  <div className="flex flex-col gap-1.5">
                    <span className="font-bold text-[var(--foreground)]">Client</span>
                    <p className="text-xs text-[var(--muted-foreground)] leading-relaxed">
                      Next.js App Router renders pages server- or client-side as needed.
                      Services layer handles all API calls with Bearer token auth.
                    </p>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <span className="font-bold text-[var(--foreground)]">API</span>
                    <p className="text-xs text-[var(--muted-foreground)] leading-relaxed">
                      FastAPI exposes a RESTful API with JWT authentication, SQLAlchemy ORM,
                      and a custom SQL migration runner.
                    </p>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <span className="font-bold text-[var(--foreground)]">AI Layer</span>
                    <p className="text-xs text-[var(--muted-foreground)] leading-relaxed">
                      Amazon Bedrock (Nova Lite) powers itinerary generation and chat.
                      AWS Knowledge Base adds RAG for grounded document Q&A.
                    </p>
                  </div>
                </div>
              </div>
            </SpotlightCard>
          </section>
        </BlurFade>

        {/* ── CTA ────────────────────────────────────────────────── */}
        <BlurFade delay={0.1} inView>
          <section className="flex flex-col items-center text-center gap-4">
            <h2 className="text-2xl font-black text-[var(--foreground)]">
              Ready to plan your next adventure?
            </h2>
            <p className="text-sm text-[var(--muted-foreground)] max-w-sm">
              Sign in and let KelanaAI handle the planning while you focus on the experience.
            </p>
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <Link href="/">
                <ShimmerButton className="px-7 py-3 rounded-xl text-sm">
                  Plan a Trip
                </ShimmerButton>
              </Link>
              <Link
                href="/chat"
                className="px-7 py-3 rounded-xl text-sm font-semibold text-[var(--muted-foreground)] border border-[var(--border)] hover:border-[var(--brand-via)]/50 hover:text-[var(--foreground)] transition-all"
              >
                Open Chat
              </Link>
            </div>
          </section>
        </BlurFade>

      </div>
    </main>
  );
}
