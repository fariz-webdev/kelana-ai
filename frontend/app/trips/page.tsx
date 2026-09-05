"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { type Trip } from "@/services/tripService";
import TripsClient from "@/components/TripsClient";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function TripsPage() {
  const router = useRouter();
  const [trips, setTrips] = useState<Trip[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      router.replace("/login");
      return;
    }

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
      .catch((err) =>
        setError(err instanceof Error ? err.message : "Failed to load trips.")
      )
      .finally(() => setLoading(false));
  }, [router]);

  if (loading) {
    return (
      <main className="flex-1 flex items-center justify-center min-h-screen bg-gray-50">
        <div className="w-8 h-8 rounded-full border-4 border-blue-100 border-t-blue-500 animate-spin" />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-10">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Trip History</h1>
          <p className="text-sm text-gray-500 mt-1">
            {trips.length} saved itinerar{trips.length === 1 ? "y" : "ies"}
          </p>
        </div>

        {error ? (
          <p className="text-red-500 text-sm">{error}</p>
        ) : trips.length === 0 ? (
          <div className="bg-gray-100 rounded-2xl flex flex-col items-center justify-center py-16 px-6 text-center">
            <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center text-blue-500 mb-4">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M21 16v-2l-8-5V3.5A1.5 1.5 0 0 0 11.5 2 1.5 1.5 0 0 0 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" />
              </svg>
            </div>
            <p className="text-gray-900 font-semibold text-base mb-1">No trips yet</p>
            <p className="text-gray-400 text-sm mb-6">
              Generate your first trip on the home page.
            </p>
            <Link
              href="/"
              className="bg-blue-500 hover:bg-blue-600 text-white text-sm font-semibold px-6 py-2.5 rounded-full transition-colors"
            >
              Plan a trip
            </Link>
          </div>
        ) : (
          <TripsClient trips={trips} />
        )}
      </div>
    </main>
  );
}
