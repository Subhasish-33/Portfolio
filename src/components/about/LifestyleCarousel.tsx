import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Play } from "lucide-react";
import insta01 from "@/assets/insta-01.jpg";
import insta02 from "@/assets/insta-02.jpg";
import insta03 from "@/assets/insta-03.jpg";
import insta04 from "@/assets/insta-04.jpg";
import insta05 from "@/assets/insta-05.jpg";
import insta06 from "@/assets/insta-06.jpg";
import insta07 from "@/assets/insta-07.jpg";

/* ──────────────────────────────────────────────────────────
   Cinematic Frames — Netflix-style billboard reel.
   - Infinite loop (modular index)
   - Active poster scaled & sharp; neighbours desaturated + blurred
   - Per-frame "atmosphere" cross-fade (CSS-generated environments,
     no extra image assets required)
   - Scrubber + arrows + Play overlay → reveals "behind the scenes"
────────────────────────────────────────────────────────── */

type Frame = {
  src: string;
  title: string;
  caption: string;
  place: string;
  date: string;
  bts: string;        // behind-the-scenes
  glow: string;       // accent oklch
  /** CSS background string — blurred environment vibe */
  atmosphere: string;
};

const FRAMES: Frame[] = [
  {
    src: insta01,
    title: "STREET CHAPTER",
    caption: "Off-day uniform.",
    place: "Bhubaneswar · IN",
    date: "2025",
    bts: "Shot in a hotel corridor between two demos. Curtain backdrop = accidental studio.",
    glow: "oklch(0.7 0.22 25)",
    atmosphere:
      "radial-gradient(ellipse at 30% 40%, oklch(0.18 0.05 30) 0%, oklch(0.06 0.01 270) 70%), linear-gradient(180deg, oklch(0.10 0.04 30) 0%, oklch(0.04 0.005 270) 100%)",
  },
  {
    src: insta02,
    title: "ROOTS",
    caption: "Village light, slow afternoons.",
    place: "Odisha · IN",
    date: "2025",
    bts: "My grandmother's courtyard. Morning sun off the white wall doing all the work.",
    glow: "oklch(0.85 0.15 90)",
    atmosphere:
      "radial-gradient(ellipse at 50% 30%, oklch(0.32 0.10 90) 0%, oklch(0.07 0.02 90) 70%), linear-gradient(180deg, oklch(0.18 0.06 80) 0%, oklch(0.04 0.005 270) 100%)",
  },
  {
    src: insta05,
    title: "RESET CASCADE",
    caption: "Waterfalls clear the cache.",
    place: "Daringbadi · IN",
    date: "2025",
    bts: "An eight-hour drive for forty seconds of mist. Worth every kilometre.",
    glow: "oklch(0.78 0.16 200)",
    atmosphere:
      "radial-gradient(ellipse at 50% 60%, oklch(0.22 0.10 180) 0%, oklch(0.06 0.02 200) 70%), linear-gradient(180deg, oklch(0.16 0.08 170) 0%, oklch(0.04 0.005 270) 100%)",
  },
  {
    src: insta06,
    title: "SHORE PROTOCOL",
    caption: "Sunrise debug session.",
    place: "Puri Beach · IN",
    date: "2025",
    bts: "5:42 AM. The only stand-up I've ever genuinely enjoyed attending.",
    glow: "oklch(0.82 0.18 60)",
    atmosphere:
      "linear-gradient(180deg, oklch(0.36 0.18 50) 0%, oklch(0.18 0.10 30) 45%, oklch(0.04 0.02 270) 100%)",
  },
  {
    src: insta04,
    title: "NEON DREAMS",
    caption: "Festival lights, neon dreams.",
    place: "Cuttack · IN",
    date: "2025",
    bts: "Bali Yatra. Long exposure was tempting — but the chaos already was the photo.",
    glow: "oklch(0.7 0.27 320)",
    atmosphere:
      "radial-gradient(ellipse at 30% 70%, oklch(0.32 0.20 320) 0%, transparent 60%), radial-gradient(ellipse at 70% 30%, oklch(0.28 0.18 200) 0%, transparent 60%), linear-gradient(180deg, oklch(0.06 0.02 280) 0%, oklch(0.04 0.005 270) 100%)",
  },
  {
    src: insta07,
    title: "GREEN SHIFT",
    caption: "Plants > push notifications.",
    place: "Bhubaneswar · IN",
    date: "2025",
    bts: "Sunday repotting ritual. The monstera is winning.",
    glow: "oklch(0.78 0.18 145)",
    atmosphere:
      "radial-gradient(ellipse at 50% 40%, oklch(0.22 0.12 145) 0%, oklch(0.06 0.03 150) 70%), linear-gradient(180deg, oklch(0.14 0.08 140) 0%, oklch(0.04 0.005 270) 100%)",
  },
  {
    src: insta03,
    title: "MIRROR FRAME",
    caption: "Fitting room, unfiltered.",
    place: "Pop-up · IN",
    date: "2025",
    bts: "Industrial cafe lighting. The mirror was the real cinematographer.",
    glow: "oklch(0.78 0.12 50)",
    atmosphere:
      "radial-gradient(ellipse at 50% 50%, oklch(0.20 0.08 60) 0%, oklch(0.06 0.02 50) 70%), linear-gradient(180deg, oklch(0.14 0.06 50) 0%, oklch(0.04 0.005 270) 100%)",
  },
];

const N = FRAMES.length;
const mod = (i: number) => ((i % N) + N) % N;

export function LifestyleCarousel() {
  const [active, setActive] = useState(0);
  const [showBts, setShowBts] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  const next = useCallback(() => {
    setShowBts(false);
    setActive((i) => mod(i + 1));
  }, []);
  const prev = useCallback(() => {
    setShowBts(false);
    setActive((i) => mod(i - 1));
  }, []);
  const goto = useCallback((i: number) => {
    setShowBts(false);
    setActive(mod(i));
  }, []);

  // Keyboard nav when carousel is in view
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!wrapRef.current) return;
      const r = wrapRef.current.getBoundingClientRect();
      const inView = r.top < window.innerHeight * 0.7 && r.bottom > 0;
      if (!inView) return;
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [next, prev]);

  // Render 5 visible posters: -2, -1, 0, 1, 2 around active
  const visible = useMemo(
    () => [-2, -1, 0, 1, 2].map((o) => ({ offset: o, idx: mod(active + o) })),
    [active],
  );

  const current = FRAMES[active];

  return (
    <div
      ref={wrapRef}
      className="relative overflow-hidden rounded-3xl border-[0.5px] border-white/15"
      style={{ minHeight: 620 }}
    >
      {/* ── Atmosphere layer (cross-fades per frame) ── */}
      <AnimatePresence mode="sync">
        <motion.div
          key={`atm-${active}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="pointer-events-none absolute inset-0"
          style={{
            background: current.atmosphere,
            filter: "blur(40px) saturate(1.15)",
            transform: "scale(1.3)",
          }}
        />
      </AnimatePresence>

      {/* Vignette */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 40%, oklch(0.04 0.005 270 / 0.85) 100%)",
        }}
      />
      {/* Film grain */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-20 mix-blend-overlay"
        style={{
          backgroundImage:
            "radial-gradient(rgba(255,255,255,0.6) 0.5px, transparent 0.5px)",
          backgroundSize: "3px 3px",
        }}
      />

      <div className="relative z-10 flex h-full flex-col p-5 md:p-7">
        {/* Header */}
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <span className="font-display text-[10px] uppercase tracking-[0.4em] text-foreground/55">
              Off-grid · Reel
            </span>
            <h3 className="mt-2 font-display text-2xl font-semibold tracking-tight md:text-3xl">
              Frames between
              <span className="font-serif-display italic text-foreground/70"> commits</span>
              <span className="text-gradient-rim">.</span>
            </h3>
          </div>
          <div className="flex items-center gap-3">
            <span className="font-mono text-[10px] uppercase tracking-widest text-foreground/40">
              {String(active + 1).padStart(2, "0")} / {String(N).padStart(2, "0")}
            </span>
            <button
              onClick={prev}
              data-cursor-hover
              aria-label="Previous"
              className="flex h-9 w-9 items-center justify-center rounded-full border-[0.5px] border-white/15 bg-white/5 text-foreground/70 backdrop-blur-md transition-colors hover:border-white/35 hover:text-foreground"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={next}
              data-cursor-hover
              aria-label="Next"
              className="flex h-9 w-9 items-center justify-center rounded-full border-[0.5px] border-white/15 bg-white/5 text-foreground/70 backdrop-blur-md transition-colors hover:border-white/35 hover:text-foreground"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Stage */}
        <div
          className="relative mt-6 flex flex-1 items-center justify-center"
          style={{ minHeight: 440, perspective: 1600 }}
        >
          {visible.map(({ offset, idx }) => (
            <Poster
              key={`${idx}-${offset}`}
              frame={FRAMES[idx]}
              offset={offset}
              isActive={offset === 0}
              showBts={showBts && offset === 0}
              onClick={() => (offset === 0 ? setShowBts((s) => !s) : goto(active + offset))}
            />
          ))}
        </div>

        {/* Scrubber */}
        <div className="mt-5 flex items-center gap-3">
          <span className="font-mono text-[10px] tabular-nums text-foreground/40">
            {String(active + 1).padStart(2, "0")}
          </span>
          <div className="relative h-1 flex-1 overflow-hidden rounded-full bg-white/10">
            <motion.div
              className="absolute inset-y-0 left-0 rounded-full"
              animate={{ width: `${((active + 1) / N) * 100}%` }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              style={{
                background: `linear-gradient(90deg, ${current.glow}, oklch(0.55 0.27 295))`,
                boxShadow: `0 0 12px ${current.glow}`,
              }}
            />
            {/* Scrubber dots */}
            <div className="absolute inset-0 flex items-center justify-between px-1">
              {FRAMES.map((_, i) => (
                <button
                  key={i}
                  onClick={() => goto(i)}
                  className="block h-1 w-1 rounded-full transition-all"
                  style={{
                    background: i <= active ? "oklch(1 0 0 / 0.9)" : "oklch(1 0 0 / 0.25)",
                    transform: i === active ? "scale(2)" : "scale(1)",
                  }}
                  aria-label={`Frame ${i + 1}`}
                />
              ))}
            </div>
          </div>
          <span className="font-mono text-[10px] tabular-nums text-foreground/40">
            {String(N).padStart(2, "0")}
          </span>
        </div>
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────
   Poster — handles 3D position, scale, color grade, BTS flip
────────────────────────────────────────────────────────── */
function Poster({
  frame,
  offset,
  isActive,
  showBts,
  onClick,
}: {
  frame: Frame;
  offset: number;
  isActive: boolean;
  showBts: boolean;
  onClick: () => void;
}) {
  const [hover, setHover] = useState(false);

  // Layout maths — like a coverflow / Netflix billboard
  const abs = Math.abs(offset);
  const x = offset * 220;            // px translation
  const z = -abs * 180;              // depth
  const rotY = offset * -16;         // tilt
  const scale = isActive ? 1.1 : abs === 1 ? 0.78 : 0.62;
  const opacity = abs >= 2 ? 0.18 : abs === 1 ? 0.55 : 1;
  const blur = isActive ? 0 : abs === 1 ? 4 : 8;
  const grayscale = isActive ? 0 : 0.4;
  const zIndex = 10 - abs;

  return (
    <motion.button
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      data-cursor-photo
      animate={{ x, z, rotateY: rotY, scale, opacity }}
      transition={{ type: "spring", stiffness: 220, damping: 28, mass: 0.8 }}
      className="absolute h-[420px] w-[300px] overflow-hidden rounded-2xl"
      style={{
        zIndex,
        transformStyle: "preserve-3d",
        boxShadow: isActive
          ? `0 30px 80px oklch(0 0 0 / 0.7), 0 0 60px ${frame.glow.replace(")", " / 0.45)")}`
          : "0 16px 40px oklch(0 0 0 / 0.5)",
        border: `0.5px solid ${isActive ? frame.glow.replace(")", " / 0.5)") : "oklch(1 0 0 / 0.12)"}`,
        cursor: "pointer",
      }}
    >
      {/* Image with cinematic grade */}
      <div className="relative h-full w-full">
        <img
          src={frame.src}
          alt={frame.caption}
          loading="lazy"
          draggable={false}
          className="h-full w-full object-cover"
          style={{
            filter: `blur(${blur}px) grayscale(${grayscale}) contrast(1.1) brightness(0.95) saturate(${isActive ? 1.05 : 0.85})`,
            transition: "filter 0.6s ease",
          }}
        />
        {/* Color-grade overlay */}
        <div
          className="pointer-events-none absolute inset-0 mix-blend-soft-light"
          style={{
            background: `linear-gradient(135deg, ${frame.glow.replace(")", " / 0.18)")}, transparent 60%)`,
          }}
        />
        {/* Film grain on active */}
        {isActive && (
          <div
            className="pointer-events-none absolute inset-0 opacity-25 mix-blend-overlay"
            style={{
              backgroundImage:
                "radial-gradient(rgba(255,255,255,0.5) 0.5px, transparent 0.5px)",
              backgroundSize: "2.5px 2.5px",
            }}
          />
        )}
        {/* Bottom gradient */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

        {/* Title block — only on active */}
        {isActive && !showBts && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="absolute inset-x-4 bottom-4"
          >
            <h4 className="font-display text-2xl font-bold uppercase leading-none tracking-tight text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
              {frame.title}
            </h4>
            <p className="mt-1.5 font-serif-display text-sm italic text-white/80">
              {frame.caption}
            </p>
            <div className="mt-2 flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.3em] text-white/60">
              <span>{frame.place}</span>
              <span className="h-px w-3 bg-white/30" />
              <span>{frame.date}</span>
            </div>
          </motion.div>
        )}

        {/* Behind-the-scenes panel */}
        <AnimatePresence>
          {showBts && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0 flex flex-col justify-center bg-black/75 p-6 backdrop-blur-md"
            >
              <span className="font-mono text-[9px] uppercase tracking-[0.3em] text-white/50">
                Behind the scenes
              </span>
              <p className="mt-3 font-serif-display text-base italic leading-relaxed text-white/90">
                "{frame.bts}"
              </p>
              <span className="mt-4 font-mono text-[9px] uppercase tracking-[0.3em] text-white/40">
                tap to close
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Play overlay on hover (active only) */}
        {isActive && hover && !showBts && (
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="pointer-events-none absolute inset-0 flex items-center justify-center"
          >
            <span
              className="flex h-16 w-16 items-center justify-center rounded-full border-[0.5px] backdrop-blur-md"
              style={{
                borderColor: frame.glow.replace(")", " / 0.7)"),
                background: `${frame.glow.replace(")", " / 0.18)")}`,
                boxShadow: `0 0 30px ${frame.glow.replace(")", " / 0.6)")}`,
              }}
            >
              <Play className="h-5 w-5 fill-white text-white" />
            </span>
          </motion.div>
        )}
      </div>
    </motion.button>
  );
}
