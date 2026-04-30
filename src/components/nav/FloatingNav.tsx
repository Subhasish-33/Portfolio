import { Link, useLocation } from "@tanstack/react-router";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { useEffect, useRef, useState } from "react";

const LINKS = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/projects", label: "Projects" },
  { to: "/analytics", label: "Analytics" },
  { to: "/contact", label: "Contact" },
] as const;

export function FloatingNav() {
  const { pathname } = useLocation();
  const [hovered, setHovered] = useState<string | null>(null);
  const wrapRef = useRef<HTMLDivElement>(null);

  // Magnetic pull
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 200, damping: 20, mass: 0.6 });
  const sy = useSpring(my, { stiffness: 200, damping: 20, mass: 0.6 });

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const onMove = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const dist = Math.hypot(dx, dy);
      const radius = 220;
      if (dist < radius) {
        const f = (1 - dist / radius) * 12;
        mx.set((dx / dist) * f);
        my.set((dy / dist) * f);
      } else {
        mx.set(0);
        my.set(0);
      }
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, [mx, my]);

  const active = LINKS.find((l) =>
    l.to === "/" ? pathname === "/" : pathname.startsWith(l.to),
  )?.to;

  return (
    <motion.div
      ref={wrapRef}
      style={{ x: sx, y: sy }}
      className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2"
    >
      <nav
        onMouseLeave={() => setHovered(null)}
        className="glass-strong relative flex items-center gap-1 rounded-full px-2 py-2"
      >
        {/* ⌘K hint */}
        <span className="mr-1 hidden items-center gap-1 pl-2 md:flex">
          <kbd className="rounded border border-white/10 bg-white/5 px-1 py-0.5 font-mono text-[8px] text-foreground/30">
            ⌘K
          </kbd>
        </span>

        {LINKS.map((l) => {
          const isActive = active === l.to;
          const isHover = hovered === l.to;
          return (
            <Link
              key={l.to}
              to={l.to}
              onMouseEnter={() => setHovered(l.to)}
              className="relative isolate rounded-full px-3 py-2 text-[11px] font-medium uppercase tracking-[0.16em] text-foreground/70 transition-colors hover:text-foreground md:px-4 md:text-xs md:tracking-[0.18em]"
            >
              {(isHover || (!hovered && isActive)) && (
                <motion.span
                  layoutId="nav-pill"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  className="absolute inset-0 -z-10 rounded-full bg-gradient-to-r from-[oklch(0.88_0.18_200/0.22)] to-[oklch(0.55_0.27_295/0.22)] shadow-[0_0_30px_-5px_oklch(0.88_0.18_200/0.5)]"
                />
              )}
              <span className="relative">{l.label}</span>
            </Link>
          );
        })}
      </nav>
    </motion.div>
  );
}
