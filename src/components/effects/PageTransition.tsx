import { useEffect, useRef } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { useLocation } from "@tanstack/react-router";

export function PageTransition() {
  const { pathname } = useLocation();
  const prefersReduced = useReducedMotion();

  if (prefersReduced) return null;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pathname}
        initial={{ scaleX: 0, opacity: 1 }}
        animate={{ scaleX: 1, opacity: 1 }}
        exit={{ scaleX: 1, opacity: 0 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        style={{ originX: 0 }}
        className="pointer-events-none fixed left-0 right-0 top-0 z-[500] h-[2px] bg-gradient-to-r from-[oklch(0.88_0.18_200)] via-[oklch(0.7_0.25_250)] to-[oklch(0.55_0.27_295)] shadow-[0_0_12px_oklch(0.88_0.18_200/0.8)]"
      />
    </AnimatePresence>
  );
}
