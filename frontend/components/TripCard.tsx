import Link from "next/link";
import { Trip } from "@/services/tripService";

interface TripCardProps {
  trip: Trip;
}

const categoryStyles: Record<string, string> = {
  Standard: "bg-blue-100 text-blue-600",
  Backpacker: "bg-orange-100 text-orange-500",
  Luxury: "bg-green-100 text-green-600",
};

export default function TripCard({ trip }: TripCardProps) {
  const badgeStyle =
    categoryStyles[trip.category] ?? "bg-gray-100 text-gray-600";

  return (
    <div className="flex items-center justify-between bg-white rounded-2xl px-5 py-4 shadow-sm border border-gray-100">
      {/* Left: icon + info */}
      <div className="flex items-center gap-4">
        {/* Airplane icon */}
        <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-2xl flex-shrink-0">
          ✈️
        </div>

        {/* Text info */}
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <span className="font-bold text-gray-900 text-base">
              {trip.destination}
            </span>
            <span
              className={`text-xs font-medium px-3 py-0.5 rounded-full ${badgeStyle}`}
            >
              {trip.category}
            </span>
          </div>
          <span className="text-sm text-gray-500">
            {trip.days} days &middot; USD {trip.budget.toLocaleString()} &middot;{" "}
            {trip.travel_style ?? "-"}
          </span>
        </div>
      </div>

      {/* Right: button */}
      <Link
        href={`/trips/${trip.id}`}
        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors whitespace-nowrap"
      >
        View Details
        <span aria-hidden="true">→</span>
      </Link>
    </div>
  );
}
