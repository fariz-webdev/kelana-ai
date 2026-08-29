"use client";

import { useState, useMemo } from "react";
import TripCard from "@/components/TripCard";
import { Trip } from "@/services/tripService";

type SortOption = "latest" | "oldest" | "highest_budget";

const PAGE_SIZE = 10;

interface TripsClientProps {
  trips: Trip[];
}

export default function TripsClient({ trips }: TripsClientProps) {
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<SortOption>("latest");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    let result = [...trips];

    // Filter by destination or travel style
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      result = result.filter(
        (t) =>
          t.destination.toLowerCase().includes(q) ||
          (t.travel_style ?? "").toLowerCase().includes(q)
      );
    }

    // Sort
    switch (sort) {
      case "latest":
        result.sort(
          (a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
        break;
      case "oldest":
        result.sort(
          (a, b) =>
            new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        );
        break;
      case "highest_budget":
        result.sort((a, b) => b.budget - a.budget);
        break;
    }

    return result;
  }, [trips, search, sort]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);

  const paginated = useMemo(
    () => filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE),
    [filtered, page]
  );

  // Reset to page 1 when search or sort changes
  function handleSearch(value: string) {
    setSearch(value);
    setPage(1);
  }

  function handleSort(value: SortOption) {
    setSort(value);
    setPage(1);
  }

  return (
    <>
      {/* Search + Sort */}
      <div className="flex items-center gap-3 mb-6">
        {/* Search */}
        <div className="flex-1 flex items-center gap-2 bg-gray-100 rounded-xl px-3 py-2.5">
          <svg
            className="w-4 h-4 text-gray-400 flex-shrink-0"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
          </svg>
          <input
            type="text"
            placeholder="Search by destination or travel style..."
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            className="bg-transparent text-sm text-gray-700 placeholder-gray-400 outline-none w-full"
          />
        </div>

        {/* Sort dropdown */}
        <select
          value={sort}
          onChange={(e) => handleSort(e.target.value as SortOption)}
          className="bg-gray-100 text-sm text-gray-700 rounded-xl px-3 py-2.5 outline-none cursor-pointer appearance-none pr-8 bg-no-repeat"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%239ca3af' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`,
            backgroundPosition: "right 10px center",
          }}
        >
          <option value="latest">Latest</option>
          <option value="oldest">Oldest</option>
          <option value="highest_budget">Highest Budget</option>
        </select>
      </div>

      {/* Trip list */}
      <div className="flex flex-col gap-3">
        {paginated.length === 0 ? (
          <p className="text-gray-400 text-center py-12">
            {search ? `No trips found for "${search}".` : "No trips saved yet."}
          </p>
        ) : (
          paginated.map((trip) => <TripCard key={trip.id} trip={trip} />)
        )}
      </div>

      {/* Pagination — only shown when more than PAGE_SIZE results */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-6">
          <p className="text-sm text-gray-400">
            Page {page} of {totalPages}
          </p>
          <div className="flex items-center gap-1">
            {/* Prev */}
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="w-8 h-8 flex items-center justify-center rounded-lg text-sm text-gray-500
                         hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              ‹
            </button>

            {/* Page numbers */}
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={`w-8 h-8 flex items-center justify-center rounded-lg text-sm font-medium transition-colors ${
                  p === page
                    ? "bg-blue-500 text-white"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                {p}
              </button>
            ))}

            {/* Next */}
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="w-8 h-8 flex items-center justify-center rounded-lg text-sm text-gray-500
                         hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              ›
            </button>
          </div>
        </div>
      )}
    </>
  );
}
