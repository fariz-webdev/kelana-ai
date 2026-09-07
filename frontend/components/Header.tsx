"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { href: "/",          label: "Plan" },
  { href: "/assistant", label: "Ask" },
  { href: "/chat",      label: "Chat" },
  { href: "/trips",     label: "My Trips" },
  { href: "/about",     label: "About" },
];

export default function Header() {
  const pathname  = usePathname();
  const router    = useRouter();

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [menuOpen,   setMenuOpen]   = useState(false);
  const [scrolled,   setScrolled]   = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  /* ── auth ──────────────────────────────────────────────────── */
  useEffect(() => {
    setIsLoggedIn(!!localStorage.getItem("access_token"));
  }, [pathname]);

  /* ── scroll shadow ─────────────────────────────────────────── */
  useEffect(() => {
    function onScroll() { setScrolled(window.scrollY > 8); }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* ── close on outside click ────────────────────────────────── */
  useEffect(() => {
    function handle(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, []);

  function handleLogout() {
    localStorage.removeItem("access_token");
    setIsLoggedIn(false);
    setMenuOpen(false);
    router.push("/login");
  }

  return (
    <header
      className={cn(
        "w-full sticky top-0 z-50 transition-all duration-300",
        scrolled
          ? "bg-[var(--background)]/90 backdrop-blur-md border-b border-[var(--border)] shadow-[0_1px_24px_rgba(139,92,246,0.08)]"
          : "bg-[var(--background)]/70 backdrop-blur-sm border-b border-transparent"
      )}
    >
      <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">

        {/* ── Logo ─────────────────────────────────────────── */}
        <Link
          href="/"
          className="flex items-center gap-2.5 hover:opacity-80 transition-opacity"
        >
          <Image
            src="/icon.png"
            alt="KelanaAI logo"
            width={28}
            height={28}
            className="rounded-md"
          />
          <span className="font-bold text-lg tracking-tight brand-gradient-text">
            KelanaAI
          </span>
        </Link>

        {/* ── Nav ──────────────────────────────────────────── */}
        <nav className="flex items-center gap-1">
          {NAV_LINKS.map(({ href, label }) => {
            const active =
              href === "/"
                ? pathname === "/"
                : pathname.startsWith(href);

            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "relative px-3.5 py-1.5 rounded-full text-sm font-medium transition-all duration-200",
                  active
                    ? "text-white"
                    : "text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
                )}
              >
                {/* active pill background */}
                {active && (
                  <span
                    aria-hidden
                    className="absolute inset-0 rounded-full brand-gradient opacity-90"
                  />
                )}
                <span className="relative z-10">{label}</span>
              </Link>
            );
          })}

          {/* ── Avatar / Login ───────────────────────────── */}
          {isLoggedIn ? (
            <div className="relative ml-1" ref={menuRef}>
              <button
                onClick={() => setMenuOpen((p) => !p)}
                aria-label="Account menu"
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center",
                  "brand-gradient text-white transition-all duration-200",
                  "hover:scale-105 hover:shadow-[0_0_12px_color-mix(in_oklch,var(--brand-from)_50%,transparent)]",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]"
                )}
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
                  <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
                </svg>
              </button>

              {menuOpen && (
                <div className="absolute right-0 mt-2 w-44 rounded-2xl border border-[var(--border)] bg-[var(--card)] shadow-xl shadow-black/30 py-1 overflow-hidden">
                  <Link
                    href="/profile"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-[var(--foreground)] hover:bg-[var(--surface-2)] transition-colors"
                  >
                    <svg className="w-4 h-4 text-[var(--muted-foreground)]" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
                      <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
                    </svg>
                    Profile
                  </Link>
                  <div className="mx-3 border-t border-[var(--border)]" />
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/10 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h6a2 2 0 012 2v1" />
                    </svg>
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              href="/login"
              className={cn(
                "ml-1 px-4 py-1.5 rounded-full text-sm font-semibold text-white",
                "brand-gradient transition-all duration-200",
                "hover:scale-[1.03] hover:shadow-[0_0_16px_color-mix(in_oklch,var(--brand-from)_40%,transparent)]"
              )}
            >
              Sign In
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
