"use client";

import { useState, useMemo } from "react";
import TripCard from "@/components/TripCard";
import { Trip } from "@/services/tripService";
import { Search, ArrowUpDown } from "lucide-react";
import { cn } from "@/lib/utils";

type SortOption = "latest" | "oldest" | "highest_budget";

const PAGE_SIZE = 10;

interface TripsClientProps {
  trips: Trip[];
}

export default function TripsClient({ trips }: TripsClientProps) {
  const [search, setSearch] = useState("");
  const [sort,   setSort]   = useState<SortOption>("latest");
  const [page,   setPage]   = useState(1);

  const filtered = useMemo(() => {
    let result = [...trips];
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      result = result.filter(
        (t) =>
          t.destination.toLowerCase().includes(q) ||
          (t.travel_style ?? "").toLowerCase().includes(q)
      );
    }
    switch (sort) {
      case "latest":         result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()); break;
      case "oldest":         result.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()); break;
      case "highest_budget": result.sort((a, b) => b.budget - a.budget); break;
    }
    return result;
  }, [trips, search, sort]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated  = useMemo(
    () => filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE),
    [filtered, page]
  );

  function handleSearch(value: string) { setSearch(value); setPage(1); }
  function handleSort(value: SortOption) { setSort(value); setPage(1); }

  return (
    <>
      {/* Search + Sort */}
      <div className="flex items-center gap-3 mb-5">
        {/* Search input */}
        <div className="flex-1 flex items-center gap-2 bg-[var(--surface-1)] border border-[var(--border)] rounded-xl px-3.5 py-2.5 focus-within:border-[var(--brand-via)]/60 transition-all">
          <Search className="w-4 h-4 text-[var(--muted-foreground)] flex-shrink-0" />
          <input
            type="text"
            placeholder="Search destination or style…"
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            className="bg-transparent text-sm text-[var(--foreground)] placeholder-[var(--muted-foreground)] outline-none w-full"
          />
        </div>

        {/* Sort */}
        <div className="relative flex items-center gap-1.5 bg-[var(--surface-1)] border border-[var(--border)] rounded-xl px-3.5 py-2.5">
          <ArrowUpDown className="w-3.5 h-3.5 text-[var(--muted-foreground)]" />
          <select
            value={sort}
            onChange={(e) => handleSort(e.target.value as SortOption)}
            className="bg-transparent text-sm text-[var(--foreground)] outline-none cursor-pointer appearance-none"
            style={{ minWidth: "110px" }}
          >
            <option value="latest">Latest</option>
            <option value="oldest">Oldest</option>
            <option value="highest_budget">Highest Budget</option>
          </select>
        </div>
      </div>

      {/* Trip list */}
      <div className="flex flex-col gap-3">
        {paginated.length === 0 ? (
          <p className="text-[var(--muted-foreground)] text-center py-12 text-sm">
            {search ? `No trips found for "${search}".` : "No trips saved yet."}
          </p>
        ) : (
          paginated.map((trip, i) => (
            <div
              key={trip.id}
              style={{
                animationDelay: `${i * 0.05}s`,
                animationFillMode: "both",
              }}
              className="animate-[fadeSlideIn_0.3s_ease_both]"
            >
              <TripCard trip={trip} />
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-7">
          <p className="text-xs text-[var(--muted-foreground)]">
            Page {page} of {totalPages}
          </p>
          <div className="flex items-center gap-1">
            <PageBtn
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              label="Previous"
            >
              ‹
            </PageBtn>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <PageBtn
                key={p}
                onClick={() => setPage(p)}
                active={p === page}
                label={`Page ${p}`}
              >
                {p}
              </PageBtn>
            ))}
            <PageBtn
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              label="Next"
            >
              ›
            </PageBtn>
          </div>
        </div>
      )}
    </>
  );
}

function PageBtn({
  children,
  onClick,
  disabled,
  active,
  label,
}: {
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
  active?: boolean;
  label?: string;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      className={cn(
        "w-8 h-8 flex items-center justify-center rounded-lg text-sm font-medium transition-all duration-150",
        active
          ? "brand-gradient text-white shadow-md"
          : "text-[var(--muted-foreground)] hover:bg-[var(--surface-2)] hover:text-[var(--foreground)]",
        disabled && "opacity-30 cursor-not-allowed"
      )}
    >
      {children}
    </button>
  );
}
