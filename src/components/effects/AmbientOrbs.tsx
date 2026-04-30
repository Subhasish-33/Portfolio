import { useEffect, useRef } from "react";

/**
 * Two massive, blurred radial gradient orbs that lazily follow the cursor and
 * orbit each other behind a noise overlay. Pure CSS — cheap and gorgeous.
 */
export function AmbientOrbs() {
  const cyanRef = useRef<HTMLDivElement>(null);
  const violetRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let raf = 0;
    let mx = 0.5;
    let my = 0.5;
    let cx = 0.5;
    let cy = 0.5;

    const onMove = (e: MouseEvent) => {
      mx = e.clientX / window.innerWidth;
      my = e.clientY / window.innerHeight;
    };

    const tick = () => {
      cx += (mx - cx) * 0.04;
      cy += (my - cy) * 0.04;
      const t = performance.now() / 6000;
      const ox = Math.cos(t) * 0.12;
      const oy = Math.sin(t) * 0.12;
      if (cyanRef.current) {
        cyanRef.current.style.transform = `translate3d(${(cx + ox) * 100 - 50}vw, ${(cy + oy) * 100 - 50}vh, 0)`;
      }
      if (violetRef.current) {
        violetRef.current.style.transform = `translate3d(${(1 - cx - ox) * 100 - 50}vw, ${(1 - cy - oy) * 100 - 50}vh, 0)`;
      }
      raf = requestAnimationFrame(tick);
    };

    window.addEventListener("mousemove", onMove);
    raf = requestAnimationFrame(tick);
    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div
        ref={cyanRef}
        className="absolute left-1/2 top-1/2 h-[80vh] w-[80vh] rounded-full opacity-60 blur-[120px]"
        style={{
          background:
            "radial-gradient(circle, oklch(0.88 0.18 200 / 0.55), transparent 70%)",
        }}
      />
      <div
        ref={violetRef}
        className="absolute left-1/2 top-1/2 h-[90vh] w-[90vh] rounded-full opacity-50 blur-[140px]"
        style={{
          background:
            "radial-gradient(circle, oklch(0.55 0.27 295 / 0.55), transparent 70%)",
        }}
      />
      {/* Noise overlay */}
      <div
        className="absolute inset-0 opacity-[0.04] mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>\")",
        }}
      />
      {/* Vignette */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 40%, oklch(0.06 0.005 270 / 0.85) 100%)",
        }}
      />
    </div>
  );
}
