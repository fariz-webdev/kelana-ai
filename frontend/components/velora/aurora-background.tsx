import { cn } from "@/lib/utils";

interface AuroraBackgroundProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Overall opacity of the aurora blobs */
  intensity?: "subtle" | "medium" | "vivid";
}

const intensityClass = {
  subtle: "opacity-20",
  medium: "opacity-35",
  vivid:  "opacity-55",
};

/**
 * Velora Aurora Background — three animated blobs using the brand ramp.
 * Place inside a `relative overflow-hidden` container.
 */
export function AuroraBackground({
  className,
  intensity = "medium",
  ...props
}: AuroraBackgroundProps) {
  return (
    <div
      aria-hidden
      data-slot="aurora-background"
      className={cn(
        "pointer-events-none absolute inset-0 overflow-hidden",
        intensityClass[intensity],
        className
      )}
      {...props}
    >
      {/* blob 1 — brand-from (deep violet) */}
      <div
        className="absolute -top-1/4 left-[10%] size-[44rem] rounded-full blur-[120px] will-change-transform"
        style={{
          background: "var(--brand-from)",
          animation: "aurora-1 14s ease-in-out infinite alternate",
        }}
      />
      {/* blob 2 — brand-via (indigo-violet) */}
      <div
        className="absolute top-[5%] right-[5%] size-[38rem] rounded-full blur-[130px] will-change-transform"
        style={{
          background: "var(--brand-via)",
          animation: "aurora-2 18s ease-in-out infinite alternate",
        }}
      />
      {/* blob 3 — brand-to (blue-violet) */}
      <div
        className="absolute -bottom-1/4 left-[35%] size-[40rem] rounded-full blur-[140px] will-change-transform"
        style={{
          background: "var(--brand-to)",
          animation: "aurora-3 22s ease-in-out infinite alternate",
        }}
      />
    </div>
  );
}
