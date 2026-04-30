import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useSpring } from "framer-motion";

const SECTIONS = ["Hero", "About", "Projects", "Analytics", "Contact"];

export function ScrollRail() {
  const { scrollYProgress } = useScroll();
  const scaleY = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.5 });
  const [activeDot, setActiveDot] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const unsub = scrollYProgress.on("change", (v) => {
      setVisible(v > 0.01);
      setActiveDot(Math.min(Math.floor(v * SECTIONS.length), SECTIONS.length - 1));
    });
    return unsub;
  }, [scrollYProgress]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: visible ? 1 : 0 }}
      transition={{ duration: 0.4 }}
      className="pointer-events-none fixed left-4 top-1/2 z-40 -translate-y-1/2 hidden flex-col items-center gap-0 md:flex"
    >
      {/* Track */}
      <div className="relative h-40 w-px overflow-hidden rounded-full bg-white/10">
        <motion.div
          style={{ scaleY, originY: 0 }}
          className="absolute inset-0 rounded-full bg-gradient-to-b from-[oklch(0.88_0.18_200)] to-[oklch(0.55_0.27_295)]"
        />
        {/* Glow on the track */}
        <motion.div
          style={{ scaleY, originY: 0 }}
          className="absolute inset-0 rounded-full bg-gradient-to-b from-[oklch(0.88_0.18_200/0.4)] to-[oklch(0.55_0.27_295/0.4)] blur-[2px]"
        />
      </div>

      {/* Section dots */}
      <div className="absolute left-1/2 top-0 h-40 -translate-x-1/2 flex flex-col justify-between py-0.5">
        {SECTIONS.map((s, i) => (
          <div key={s} className="group relative flex items-center">
            <motion.div
              animate={{
                scale: activeDot === i ? 1.4 : 1,
                backgroundColor:
                  activeDot >= i
                    ? "oklch(0.88 0.18 200)"
                    : "oklch(1 0 0 / 0.2)",
              }}
              transition={{ duration: 0.3 }}
              className="h-1.5 w-1.5 rounded-full"
            />
            {/* Label on hover */}
            <span className="pointer-events-none absolute left-4 whitespace-nowrap font-display text-[9px] uppercase tracking-[0.3em] text-foreground/0 group-hover:text-foreground/60 transition-colors duration-200">
              {s}
            </span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
