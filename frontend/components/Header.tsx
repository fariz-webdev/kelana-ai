"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Header() {
  const pathname = usePathname();
  const isHome = pathname === "/";

  return (
    <header className="w-full bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-3xl mx-auto px-4 h-14 flex items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          className="text-blue-500 font-bold text-lg tracking-tight hover:text-blue-600 transition-colors"
        >
          KelanaAI
        </Link>

        {/* Nav */}
        <nav className="flex items-center gap-4">
          <Link
            href="/"
            className={`text-sm font-semibold transition-colors ${
              isHome
                ? "px-4 py-1.5 rounded-full bg-blue-500 hover:bg-blue-600 text-white"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Plan a Trip
          </Link>
          <Link
            href="/trips"
            className={`text-sm font-semibold transition-colors ${
              !isHome
                ? "px-4 py-1.5 rounded-full bg-blue-500 hover:bg-blue-600 text-white"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            My Trips
          </Link>
        </nav>
      </div>
    </header>
  );
}
