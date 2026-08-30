"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { getTrip } from "@/services/tripService";
import { type Trip } from "@/services/tripService";
import TripRecommendation from "@/components/TripRecommendation";

const categoryStyles: Record<string, string> = {
  Standard: "bg-blue-100 text-blue-600",
  Backpacker: "bg-orange-100 text-orange-500",
  Luxury: "bg-green-100 text-green-600",
};

export default function TripDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [trip, setTrip] = useState<Trip | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      router.replace("/login");
      return;
    }

    getTrip(Number(id), token)
      .then(setTrip)
      .catch((err) =>
        setError(err instanceof Error ? err.message : "Failed to load trip.")
      )
      .finally(() => setLoading(false));
  }, [id, router]);

  if (loading) {
    return (
      <main className="flex-1 flex items-center justify-center min-h-screen bg-gray-50">
        <div className="w-8 h-8 rounded-full border-4 border-blue-100 border-t-blue-500 animate-spin" />
      </main>
    );
  }

  if (error || !trip) {
    return (
      <main className="min-h-screen bg-gray-50 flex flex-col items-center justify-center gap-4 px-4">
        <p className="text-red-500 text-sm">{error ?? "Trip not found."}</p>
        <Link href="/trips" className="text-sm text-blue-500 hover:underline">
          ← Back to Trip History
        </Link>
      </main>
    );
  }

  const badgeStyle = categoryStyles[trip.category] ?? "bg-gray-100 text-gray-600";

  return (
    <main className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        
        {/* Title */}
        <h1 className="text-2xl font-bold text-gray-900 mb-6">
          {trip.destination}
        </h1>

        {/* Info grid */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="bg-gray-100 rounded-xl px-4 py-3">
            <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-1">
              Destination
            </p>
            <p className="text-gray-900 font-medium">{trip.destination}</p>
          </div>

          <div className="bg-gray-100 rounded-xl px-4 py-3">
            <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-1">
              Budget
            </p>
            <p className="text-gray-900 font-medium">
              USD {trip.budget.toLocaleString()}
            </p>
          </div>

          <div className="bg-gray-100 rounded-xl px-4 py-3">
            <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-1">
              Category
            </p>
            <div className="flex items-center gap-2 mt-0.5">
              <p className="text-gray-900 font-medium">{trip.category}</p>
              <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${badgeStyle}`}>
                {trip.category}
              </span>
            </div>
          </div>

          <div className="bg-gray-100 rounded-xl px-4 py-3">
            <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-1">
              Days
            </p>
            <p className="text-gray-900 font-medium">{trip.days} days</p>
          </div>
        </div>

        {/* AI Recommendation */}
        {trip.ai_recommendation && (
          <section>
            <p className="text-xs font-semibold uppercase tracking-widest text-blue-500 mb-3">
              AI Recommendation
            </p>
            <TripRecommendation content={trip.ai_recommendation} />
          </section>
        )}

        {/* Back button */}
        <Link
          href="/trips"
          className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 mb-5 transition-colors"
        >
          <span aria-hidden="true">←</span>
          Back to Trip History
        </Link>
      </div>
    </main>
  );
}
