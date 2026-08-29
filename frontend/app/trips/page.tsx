import Link from "next/link";
import { getTrips } from "@/services/tripService";
import TripsClient from "@/components/TripsClient";

export default async function TripsPage() {
  let trips: Awaited<ReturnType<typeof getTrips>> = [];
  let error: string | null = null;

  try {
    trips = await getTrips();
  } catch (err) {
    console.error(err);
    error = err instanceof Error ? err.message : "Failed to load trips";
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
            {/* Plane icon */}
            <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center text-blue-500 mb-4">
              <svg
                className="w-6 h-6"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
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
