import Link from "next/link";
import { Trip } from "@/services/tripService";
import { SpotlightCard } from "@/components/velora/spotlight-card";
import { PlaneTakeoff, CalendarDays, Wallet, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface TripCardProps {
  trip: Trip;
}

const categoryConfig: Record<string, { label: string; cls: string }> = {
  Standard:    { label: "Standard",    cls: "bg-violet-500/15 text-violet-300 border-violet-500/25" },
  Backpacker:  { label: "Backpacker",  cls: "bg-orange-500/15 text-orange-300 border-orange-500/25" },
  Luxury:      { label: "Luxury",      cls: "bg-emerald-500/15 text-emerald-300 border-emerald-500/25" },
};

export default function TripCard({ trip }: TripCardProps) {
  const { label: catLabel, cls: catCls } =
    categoryConfig[trip.category] ?? { label: trip.category, cls: "bg-[var(--surface-2)] text-[var(--muted-foreground)] border-[var(--border)]" };

  return (
    <SpotlightCard className="transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/30">
      <div className="flex items-center justify-between px-5 py-4 gap-4">

        {/* Icon */}
        <div className="w-11 h-11 rounded-xl brand-gradient flex items-center justify-center text-white flex-shrink-0 shadow-md shadow-[var(--brand-from)]/30">
          <PlaneTakeoff className="w-5 h-5" />
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0 flex flex-col gap-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-bold text-[var(--foreground)] text-base truncate">
              {trip.destination}
            </span>
            <span className={cn("text-xs font-semibold px-2.5 py-0.5 rounded-full border", catCls)}>
              {catLabel}
            </span>
          </div>
          <div className="flex items-center gap-3 text-xs text-[var(--muted-foreground)]">
            <span className="flex items-center gap-1">
              <CalendarDays className="w-3 h-3" />
              {trip.days}d
            </span>
            <span className="flex items-center gap-1">
              <Wallet className="w-3 h-3" />
              USD {trip.budget.toLocaleString()}
            </span>
            {trip.travel_style && (
              <span className="hidden sm:block truncate">{trip.travel_style}</span>
            )}
          </div>
        </div>

        {/* CTA */}
        <Link
          href={`/trips/${trip.id}`}
          className={cn(
            "flex items-center gap-1.5 text-sm font-semibold whitespace-nowrap px-4 py-2 rounded-xl",
            "brand-gradient text-white transition-all duration-200",
            "hover:scale-[1.03] hover:shadow-md hover:shadow-[var(--brand-from)]/30",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]"
          )}
        >
          View
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </SpotlightCard>
  );
}
