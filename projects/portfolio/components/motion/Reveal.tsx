"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

// Restrained scroll reveal (brain pattern: motion-scroll-reveal-restrained).
// Reduced motion → content renders static.
// Never wrap content that can sit in the first viewport (any breakpoint): it starts at
// opacity 0 until hydration, which delays LCP. Use it for below-the-fold sections only.
export function Reveal({ children, delay = 0 }: { children: ReactNode; delay?: number }) {
  const reduce = useReducedMotion();
  if (reduce) return <div>{children}</div>;
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10% 0px" }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay }}
    >
      {children}
    </motion.div>
  );
}
