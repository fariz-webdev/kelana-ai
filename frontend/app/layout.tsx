import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

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
    <footer className="w-full border-t border-gray-100 bg-white mt-auto">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-gray-400">
        <span>© {new Date().getFullYear()} KelanaAI. All rights reserved.</span>
        <nav className="flex items-center gap-5">
          <a
            href="#"
            className="hover:text-blue-500 transition-colors"
          >
            About
          </a>
          <a
            href="#"
            className="hover:text-blue-500 transition-colors"
          >
            Privacy
          </a>
          <a
            href="#"
            className="hover:text-blue-500 transition-colors"
          >
            Terms
          </a>
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-blue-500 transition-colors"
          >
            GitHub
          </a>
        </nav>
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
      <body className="min-h-screen flex flex-col bg-white">
        <div className="flex-1">{children}</div>
        <Footer />
      </body>
    </html>
  );
}
