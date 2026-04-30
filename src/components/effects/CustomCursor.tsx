import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring, AnimatePresence } from "framer-motion";

type CursorMode = "default" | "hover" | "view";

export function CustomCursor() {
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const sx = useSpring(x, { stiffness: 400, damping: 35, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 400, damping: 35, mass: 0.4 });
  const hx = useSpring(x, { stiffness: 180, damping: 22, mass: 0.6 });
  const hy = useSpring(y, { stiffness: 180, damping: 22, mass: 0.6 });
  const [mode, setMode] = useState<CursorMode>("default");
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(pointer: coarse)").matches) return;
    setEnabled(true);

    const move = (e: MouseEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      const t = e.target as HTMLElement | null;
      const isView = !!t?.closest("[data-cursor-view], [data-cursor-photo]");
      const isHover = !!t?.closest("a, button, input, textarea, [data-cursor-hover]");
      setMode(isView ? "view" : isHover ? "hover" : "default");
    };
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, [x, y]);

  if (!enabled) return null;

  return (
    <>
      {/* Dot */}
      <motion.div
        aria-hidden
        style={{ translateX: sx, translateY: sy }}
        animate={{ scale: mode === "view" ? 0 : 1, opacity: mode === "view" ? 0 : 1 }}
        transition={{ duration: 0.2 }}
        className="pointer-events-none fixed left-0 top-0 z-[200] -ml-1 -mt-1 h-2 w-2 rounded-full bg-[oklch(0.88_0.18_200)] mix-blend-screen"
      />

      {/* Halo ring */}
      <motion.div
        aria-hidden
        style={{ translateX: hx, translateY: hy }}
        animate={{
          scale: mode === "view" ? 1 : mode === "hover" ? 1.6 : 1,
          opacity: mode === "default" ? 0.5 : 1,
        }}
        transition={{ type: "spring", stiffness: 250, damping: 20 }}
        className={`pointer-events-none fixed left-0 top-0 z-[199] -ml-5 -mt-5 rounded-full border mix-blend-difference transition-all duration-200 ${
          mode === "view"
            ? "h-[80px] w-[80px] -ml-10 -mt-10 border-[oklch(0.88_0.18_200/0.9)] bg-[oklch(0.88_0.18_200/0.15)]"
            : "h-10 w-10 border-[oklch(0.88_0.18_200/0.7)]"
        }`}
      />

      {/* "View ↗" label */}
      <AnimatePresence>
        {mode === "view" && (
          <motion.div
            aria-hidden
            style={{ translateX: hx, translateY: hy }}
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.6 }}
            transition={{ duration: 0.15 }}
            className="pointer-events-none fixed left-0 top-0 z-[201] -translate-x-1/2 -translate-y-1/2 select-none font-display text-[9px] font-bold uppercase tracking-[0.22em] text-[oklch(0.06_0.005_270)]"
          >
            View&nbsp;↗
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
