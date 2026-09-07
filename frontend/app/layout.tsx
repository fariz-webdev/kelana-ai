import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "KelanaAI — Plan your next adventure",
  description: "AI-powered travel itinerary planner",
};

function Footer() {
  return (
    <footer className="w-full mt-auto relative z-10">
      {/* solid opaque strip so aurora blobs behind don't bleed through */}
      <div className="border-t border-white/10 bg-[oklch(0.07_0.02_270)] backdrop-blur-sm">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <span className="text-sm text-white/60">
            © {new Date().getFullYear()} KelanaAI. All rights reserved.
          </span>
          <nav className="flex items-center gap-5">
            {["About", "Privacy", "Terms"].map((label) => (
              <a
                key={label}
                href={label === "About" ? "/about" : "#"}
                className="text-sm text-white/60 hover:text-white transition-colors"
              >
                {label}
              </a>
            ))}
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-white/60 hover:text-white transition-colors"
            >
              GitHub
            </a>
          </nav>
        </div>
      </div>
    </footer>
  );
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-screen flex flex-col bg-[var(--background)] text-[var(--foreground)]">
        <Header />
        <div className="flex-1">{children}</div>
        <Footer />
      </body>
    </html>
  );
}
