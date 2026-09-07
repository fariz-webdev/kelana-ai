"use client";

import * as React from "react";
import { motion, useInView, type Variants } from "motion/react";
import { cn } from "@/lib/utils";

interface BlurFadeProps {
  children: React.ReactNode;
  className?: string;
  /** Delay in seconds */
  delay?: number;
  /** Vertical drift distance (px) */
  yOffset?: number;
  /** Duration in seconds */
  duration?: number;
  /** Trigger once or every time element enters view */
  once?: boolean;
  inView?: boolean;
}

/**
 * Velora Blur Fade — blur + fade + drift entrance animation.
 * Respects prefers-reduced-motion.
 */
export function BlurFade({
  children,
  className,
  delay = 0,
  yOffset = 8,
  duration = 0.4,
  once = true,
  inView: triggerInView = false,
}: BlurFadeProps) {
  const ref = React.useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once, amount: 0.2 });
  const shouldAnimate = triggerInView ? isInView : true;

  const variants: Variants = {
    hidden: { opacity: 0, y: yOffset, filter: "blur(6px)" },
    visible: { opacity: 1, y: 0, filter: "blur(0px)" },
  };

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={shouldAnimate ? "visible" : "hidden"}
      variants={variants}
      transition={{
        duration,
        delay,
        ease: [0.21, 0.47, 0.32, 0.98],
      }}
      className={cn(className)}
    >
      {children}
    </motion.div>
  );
}
