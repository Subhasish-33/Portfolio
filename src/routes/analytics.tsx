import { createFileRoute } from "@tanstack/react-router";
import { motion, useInView } from "framer-motion";
import { Fragment, useEffect, useMemo, useRef, useState } from "react";
import { PageFooterStamp } from "@/components/effects/PageFooterStamp";

export const Route = createFileRoute("/analytics")({
  head: () => ({
    meta: [
      { title: "Analytics — Subhasish Kumar Sahu" },
      {
        name: "description",
        content:
          "Live data command center — monthly build output, codebase language split, self-rated skill depth, and an 18-week activity heatmap.",
      },
      { property: "og:title", content: "Analytics — Subhasish Kumar Sahu" },
      {
        property: "og:description",
        content: "Proof, not promises — a data-science showcase.",
      },
    ],
  }),
  component: AnalyticsPage,
});

const CAPABILITIES = [
  {
    name: "AI Systems",
    pct: 92,
    desc: "LLMs, RAG, NLP, RL and model evaluation pipelines.",
  },
  {
    name: "Backend Architecture",
    pct: 88,
    desc: "FastAPI services, database design, caching, and API ergonomics.",
  },
  {
    name: "Data Intelligence",
    pct: 90,
    desc: "Pandas, NumPy, semantic search, vector workflows, and analytics.",
  },
  {
    name: "Frontend Experience",
    pct: 82,
    desc: "React interfaces with motion, dashboards, and purposeful interactions.",
  },
];

function CapabilityBar({
  name,
  pct,
  desc,
  delay,
}: {
  name: string;
  pct: number;
  desc: string;
  delay: number;
}) {
  return (
    <div>
      <div className="flex items-baseline justify-between">
        <span className="text-sm font-medium text-foreground/90">{name}</span>
        <span className="font-mono text-xs text-foreground/60">{pct}%</span>
      </div>
      <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-white/5">
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: `${pct}%` }}
          viewport={{ once: true }}
          transition={{ duration: 1.4, delay, ease: [0.16, 1, 0.3, 1] }}
          className="h-full rounded-full"
          style={{
            background:
              "linear-gradient(90deg, oklch(0.88 0.18 200), oklch(0.7 0.22 295))",
            boxShadow: "0 0 12px oklch(0.88 0.18 200 / 0.5)",
          }}
        />
      </div>
      <p className="mt-2 text-xs leading-relaxed text-foreground/55">{desc}</p>
    </div>
  );
}

function AnalyticsPage() {
  return (
    <section className="relative min-h-screen px-6 pb-32 pt-32 md:px-12">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
        >
          <span className="font-display text-[10px] uppercase tracking-[0.4em] text-[oklch(0.88_0.18_200)]">
            Chapter 03
          </span>
          <h1 className="mt-4 font-display text-6xl font-bold leading-[0.9] tracking-tighter md:text-8xl">
            Data
            <br />
            <span className="text-gradient-rim">_command</span>
          </h1>
          <p className="mt-6 max-w-xl text-sm text-foreground/60">
            The numbers behind two years of building. Real training hours,
            real records analyzed, real systems shipped at real scale.
          </p>
        </motion.div>

        {/* Top counter strip */}
        <div className="mt-16 grid grid-cols-2 gap-px overflow-hidden rounded-3xl bg-white/5 lg:grid-cols-4">
          <Counter label="Flagship builds" target={4} suffix="+" />
          <Counter label="Training hours" target={600} suffix="+" />
          <Counter label="Records analyzed" target={10000} suffix="+" accent="violet" />
          <Counter label="Peak concurrent users" target={1000} suffix="+" accent="violet" />
        </div>

        {/* Capabilities — moved from About */}
        <div className="mt-8">
          <Panel
            kicker="Capabilities"
            title="Where I work — model · API · UI boundary"
            kpi={{ label: "depth", value: "T-shaped" }}
          >
            <div className="grid grid-cols-1 gap-x-10 gap-y-6 md:grid-cols-2">
              {CAPABILITIES.map((c, i) => (
                <CapabilityBar key={c.name} {...c} delay={i * 0.08} />
              ))}
            </div>
          </Panel>
        </div>

        {/* Row 1: Monthly Activity + Language Donut */}
        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[1.55fr_1fr]">
          <Panel
            kicker="Monthly activity"
            title="Build output over 6 months"
            kpi={{ label: "trend", value: "+184%" }}
          >
            <MonthlyArea />
          </Panel>
          <Panel
            kicker="Codebase split"
            title="Language distribution"
            kpi={{ label: "primary", value: "Python" }}
          >
            <LanguageDonut />
          </Panel>
        </div>

        {/* Row 2: Radar + Heatmap */}
        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[1fr_1.55fr]">
          <Panel
            kicker="Skill depth"
            title="Self-rated — relative to portfolio work"
            kpi={{ label: "peak", value: "AI 92" }}
          >
            <SkillRadar />
          </Panel>
          <Panel
            kicker="18-week window"
            title="Coded activity grid"
            kpi={{ label: "streak", value: "11d" }}
          >
            <WeeklyHeatmap />
          </Panel>
        </div>

        {/* Row 3: Model iterations chart */}
        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[1.2fr_1fr]">
          <Panel
            kicker="Energy Twin · model iterations"
            title="F1 climb across 7 versions"
            kpi={{ label: "best", value: "94" }}
          >
            <DrawChart />
          </Panel>
          <TerminalLog />
        </div>

        <PageFooterStamp readingMinutes={5} updatedDate="18.04.2026" />
      </div>
    </section>
  );
}

/* ---------------- Shared Panel shell ---------------- */

function Panel({
  kicker,
  title,
  kpi,
  children,
}: {
  kicker: string;
  title: string;
  kpi?: { label: string; value: string };
  children: React.ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.8 }}
      className="glass-strong noise relative overflow-hidden rounded-3xl p-7 md:p-8"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <span className="font-display text-[10px] uppercase tracking-[0.4em] text-foreground/50">
            {kicker}
          </span>
          <h2 className="mt-2 font-display text-xl font-semibold tracking-tight md:text-2xl">
            {title}
          </h2>
        </div>
        {kpi && (
          <div className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-right">
            <div className="font-mono text-[9px] uppercase tracking-widest text-foreground/40">
              {kpi.label}
            </div>
            <div className="font-display text-base font-semibold text-[oklch(0.88_0.18_200)]">
              {kpi.value}
            </div>
          </div>
        )}
      </div>
      <div className="mt-6">{children}</div>
    </motion.div>
  );
}

/* ---------------- Counter ---------------- */

function Counter({
  label,
  target,
  suffix,
  accent,
}: {
  label: string;
  target: number;
  suffix?: string;
  accent?: "cyan" | "violet";
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [val, setVal] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const start = performance.now();
    const dur = 1800;
    let raf = 0;
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / dur);
      const eased = 1 - Math.pow(1 - p, 3);
      setVal(Math.floor(target * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, target]);

  const accentClass =
    accent === "violet"
      ? "text-[oklch(0.7_0.22_295)]"
      : "text-[oklch(0.88_0.18_200)]";

  return (
    <div ref={ref} className="bg-background/80 p-6 backdrop-blur md:p-8">
      <span className="font-display text-[10px] uppercase tracking-[0.4em] text-foreground/50">
        {label}
      </span>
      <div className="mt-3 flex items-baseline gap-1">
        <span
          className={`font-display text-4xl font-bold tracking-tighter md:text-5xl ${accentClass}`}
        >
          {val.toLocaleString()}
        </span>
        {suffix && <span className="text-sm text-foreground/50">{suffix}</span>}
      </div>
      <div className="mt-3 flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-foreground/50">
        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[oklch(0.88_0.18_200)]" />
        live · streaming
      </div>
    </div>
  );
}

/* ---------------- Monthly Area Chart (dual line) ---------------- */

function MonthlyArea() {
  const ref = useRef<SVGSVGElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
  // Two series: commits (cyan) and deploys (violet)
  const commits = [22, 38, 52, 64, 70, 62];
  const deploys = [12, 24, 34, 48, 56, 58];
  const W = 720;
  const H = 280;
  const padX = 36;
  const padY = 30;
  const max = 80;

  const sx = (i: number) => padX + (i / (months.length - 1)) * (W - padX * 2);
  const sy = (v: number) => H - padY - (v / max) * (H - padY * 2);

  // Smooth catmull-rom-ish path
  const smooth = (pts: number[]) => {
    const points = pts.map((v, i) => [sx(i), sy(v)] as const);
    let d = `M ${points[0][0]} ${points[0][1]}`;
    for (let i = 0; i < points.length - 1; i++) {
      const p0 = points[i - 1] ?? points[i];
      const p1 = points[i];
      const p2 = points[i + 1];
      const p3 = points[i + 2] ?? p2;
      const c1x = p1[0] + (p2[0] - p0[0]) / 6;
      const c1y = p1[1] + (p2[1] - p0[1]) / 6;
      const c2x = p2[0] - (p3[0] - p1[0]) / 6;
      const c2y = p2[1] - (p3[1] - p1[1]) / 6;
      d += ` C ${c1x} ${c1y}, ${c2x} ${c2y}, ${p2[0]} ${p2[1]}`;
    }
    return d;
  };

  const cyanPath = smooth(commits);
  const violetPath = smooth(deploys);
  const cyanArea = `${cyanPath} L ${sx(months.length - 1)} ${H - padY} L ${sx(0)} ${H - padY} Z`;
  const violetArea = `${violetPath} L ${sx(months.length - 1)} ${H - padY} L ${sx(0)} ${H - padY} Z`;

  return (
    <div>
      <svg
        ref={ref}
        viewBox={`0 0 ${W} ${H}`}
        className="w-full"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="cyanFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="oklch(0.88 0.18 200 / 0.45)" />
            <stop offset="100%" stopColor="oklch(0.88 0.18 200 / 0)" />
          </linearGradient>
          <linearGradient id="violetFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="oklch(0.7 0.22 295 / 0.35)" />
            <stop offset="100%" stopColor="oklch(0.7 0.22 295 / 0)" />
          </linearGradient>
        </defs>

        {/* Y grid lines */}
        {[0, 20, 40, 60, 80].map((v) => (
          <g key={v}>
            <line
              x1={padX}
              x2={W - padX}
              y1={sy(v)}
              y2={sy(v)}
              stroke="oklch(1 0 0 / 0.06)"
              strokeDasharray="2 4"
            />
            <text
              x={padX - 8}
              y={sy(v) + 4}
              textAnchor="end"
              className="fill-foreground/40"
              style={{ fontSize: 10, fontFamily: "monospace" }}
            >
              {v}
            </text>
          </g>
        ))}

        {/* Areas */}
        <motion.path
          d={violetArea}
          fill="url(#violetFill)"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 1.4, duration: 0.8 }}
        />
        <motion.path
          d={cyanArea}
          fill="url(#cyanFill)"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 1.6, duration: 0.8 }}
        />

        {/* Lines */}
        <motion.path
          d={violetPath}
          fill="none"
          stroke="oklch(0.7 0.22 295)"
          strokeWidth={2.5}
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={inView ? { pathLength: 1 } : {}}
          transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1] }}
          style={{ filter: "drop-shadow(0 0 6px oklch(0.7 0.22 295 / 0.5))" }}
        />
        <motion.path
          d={cyanPath}
          fill="none"
          stroke="oklch(0.88 0.18 200)"
          strokeWidth={2.5}
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={inView ? { pathLength: 1 } : {}}
          transition={{ duration: 1.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          style={{ filter: "drop-shadow(0 0 6px oklch(0.88 0.18 200 / 0.6))" }}
        />

        {/* Month labels */}
        {months.map((m, i) => (
          <text
            key={m}
            x={sx(i)}
            y={H - 8}
            textAnchor="middle"
            className="fill-foreground/50"
            style={{ fontSize: 10, fontFamily: "monospace" }}
          >
            {m}
          </text>
        ))}
      </svg>

      {/* Legend */}
      <div className="mt-4 flex flex-wrap items-center gap-5 font-mono text-[10px] uppercase tracking-widest text-foreground/60">
        <span className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-[oklch(0.88_0.18_200)] shadow-[0_0_8px_oklch(0.88_0.18_200)]" />
          commits
        </span>
        <span className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-[oklch(0.7_0.22_295)] shadow-[0_0_8px_oklch(0.7_0.22_295)]" />
          deploys
        </span>
      </div>
    </div>
  );
}

/* ---------------- Language Donut ---------------- */

function LanguageDonut() {
  const ref = useRef<SVGSVGElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  const data = [
    { lang: "Python", val: 38, color: "oklch(0.7 0.22 250)" },
    { lang: "TypeScript", val: 24, color: "oklch(0.88 0.18 200)" },
    { lang: "JavaScript", val: 18, color: "oklch(0.65 0.22 295)" },
    { lang: "SQL", val: 12, color: "oklch(0.78 0.18 160)" },
    { lang: "CSS", val: 8, color: "oklch(0.7 0.22 350)" },
  ];
  const total = data.reduce((s, d) => s + d.val, 0);

  // Build donut segments
  const R = 80;
  const r = 52;
  const C = 110;
  let acc = 0;
  const segs = data.map((d) => {
    const start = (acc / total) * Math.PI * 2 - Math.PI / 2;
    acc += d.val;
    const end = (acc / total) * Math.PI * 2 - Math.PI / 2;
    const large = end - start > Math.PI ? 1 : 0;
    const x1 = C + R * Math.cos(start);
    const y1 = C + R * Math.sin(start);
    const x2 = C + R * Math.cos(end);
    const y2 = C + R * Math.sin(end);
    const xi1 = C + r * Math.cos(end);
    const yi1 = C + r * Math.sin(end);
    const xi2 = C + r * Math.cos(start);
    const yi2 = C + r * Math.sin(start);
    const path = `M ${x1} ${y1} A ${R} ${R} 0 ${large} 1 ${x2} ${y2} L ${xi1} ${yi1} A ${r} ${r} 0 ${large} 0 ${xi2} ${yi2} Z`;
    return { ...d, path };
  });

  return (
    <div className="grid grid-cols-1 items-center gap-6 sm:grid-cols-[180px_1fr]">
      <svg ref={ref} viewBox="0 0 220 220" className="mx-auto h-44 w-44">
        {segs.map((s, i) => (
          <motion.path
            key={s.lang}
            d={s.path}
            fill={s.color}
            initial={{ opacity: 0, scale: 0.6 }}
            animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ delay: 0.3 + i * 0.1, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            style={{
              transformOrigin: `${C}px ${C}px`,
              filter: `drop-shadow(0 0 12px ${s.color.replace(")", " / 0.4)")})`,
            }}
          />
        ))}
        <circle cx={C} cy={C} r={r - 2} fill="oklch(0.06 0.005 270)" />
        <text
          x={C}
          y={C - 4}
          textAnchor="middle"
          className="fill-foreground"
          style={{ fontSize: 22, fontWeight: 700, fontFamily: "monospace" }}
        >
          5
        </text>
        <text
          x={C}
          y={C + 14}
          textAnchor="middle"
          className="fill-foreground/50"
          style={{ fontSize: 9, letterSpacing: 2, fontFamily: "monospace" }}
        >
          LANGS
        </text>
      </svg>

      <div className="space-y-3">
        {data.map((d) => (
          <div key={d.lang} className="flex items-center gap-3">
            <span
              className="h-2.5 w-2.5 rounded-full"
              style={{
                background: d.color,
                boxShadow: `0 0 8px ${d.color.replace(")", " / 0.6)")}`,
              }}
            />
            <span className="text-sm text-foreground/80">{d.lang}</span>
            <span className="ml-auto font-mono text-xs text-foreground/50">
              {d.val}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------------- Skill Radar ---------------- */

function SkillRadar() {
  const ref = useRef<SVGSVGElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  const skills = [
    { label: "AI", value: 92 },
    { label: "Backend", value: 88 },
    { label: "Data", value: 90 },
    { label: "Systems", value: 78 },
    { label: "Frontend", value: 82 },
    { label: "Product", value: 80 },
  ];

  const C = 140;
  const R = 100;
  const N = skills.length;

  const point = (i: number, v: number) => {
    const angle = (i / N) * Math.PI * 2 - Math.PI / 2;
    const dist = (v / 100) * R;
    return [C + dist * Math.cos(angle), C + dist * Math.sin(angle)] as const;
  };

  const polygon = skills
    .map((s, i) => point(i, s.value).join(","))
    .join(" ");

  return (
    <svg ref={ref} viewBox="0 0 280 280" className="mx-auto w-full max-w-[300px]">
      {/* Concentric polygons */}
      {[0.25, 0.5, 0.75, 1].map((t) => {
        const pts = skills
          .map((_, i) => {
            const a = (i / N) * Math.PI * 2 - Math.PI / 2;
            return [C + R * t * Math.cos(a), C + R * t * Math.sin(a)].join(",");
          })
          .join(" ");
        return (
          <polygon
            key={t}
            points={pts}
            fill="none"
            stroke="oklch(1 0 0 / 0.08)"
          />
        );
      })}

      {/* Spokes */}
      {skills.map((_, i) => {
        const a = (i / N) * Math.PI * 2 - Math.PI / 2;
        return (
          <line
            key={i}
            x1={C}
            y1={C}
            x2={C + R * Math.cos(a)}
            y2={C + R * Math.sin(a)}
            stroke="oklch(1 0 0 / 0.08)"
          />
        );
      })}

      {/* Filled skill polygon */}
      <motion.polygon
        points={polygon}
        fill="oklch(0.88 0.18 200 / 0.18)"
        stroke="oklch(0.88 0.18 200)"
        strokeWidth={2}
        initial={{ opacity: 0, scale: 0.7 }}
        animate={inView ? { opacity: 1, scale: 1 } : {}}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        style={{
          transformOrigin: `${C}px ${C}px`,
          filter: "drop-shadow(0 0 10px oklch(0.88 0.18 200 / 0.6))",
        }}
      />

      {/* Vertices */}
      {skills.map((s, i) => {
        const [x, y] = point(i, s.value);
        return (
          <motion.circle
            key={s.label}
            cx={x}
            cy={y}
            r={3}
            fill="oklch(0.06 0.005 270)"
            stroke="oklch(0.88 0.18 200)"
            strokeWidth={2}
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ delay: 0.6 + i * 0.06 }}
          />
        );
      })}

      {/* Labels */}
      {skills.map((s, i) => {
        const a = (i / N) * Math.PI * 2 - Math.PI / 2;
        const lx = C + (R + 22) * Math.cos(a);
        const ly = C + (R + 22) * Math.sin(a);
        return (
          <text
            key={s.label}
            x={lx}
            y={ly}
            textAnchor="middle"
            dominantBaseline="middle"
            className="fill-foreground/70"
            style={{ fontSize: 11, fontFamily: "monospace", letterSpacing: 1 }}
          >
            {s.label}
          </text>
        );
      })}
    </svg>
  );
}

/* ---------------- Weekly Heatmap (18 weeks × 7 days) ---------------- */

function WeeklyHeatmap() {
  const data = useMemo(
    () => Array.from({ length: 18 * 7 }, () => Math.random() * Math.random()),
    [],
  );
  const days = ["M", "T", "W", "T", "F", "S", "S"];

  return (
    <div>
      <div className="overflow-x-auto scrollbar-none">
        <div className="inline-grid w-max gap-1.5" style={{ gridTemplateColumns: `auto repeat(18, minmax(0, 1fr))` }}>
          {/* Top week labels */}
          <div />
          {Array.from({ length: 18 }, (_, w) => (
            <div
              key={`wlabel-${w}`}
              className="font-mono text-[9px] uppercase tracking-widest text-foreground/30"
            >
              {w % 4 === 0 ? `W${w + 1}` : ""}
            </div>
          ))}

          {/* Day rows */}
          {days.map((d, di) => (
            <Fragment key={`row-${di}`}>
              <div className="pr-2 text-right font-mono text-[9px] uppercase tracking-widest text-foreground/40">
                {d}
              </div>
              {Array.from({ length: 18 }, (_, w) => {
                const v = data[w * 7 + di];
                const intensity = Math.min(1, v * 1.8);
                return (
                  <motion.div
                    key={`cell-${w}-${di}`}
                    initial={{ opacity: 0, scale: 0.4 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: (w * 7 + di) * 0.004 }}
                    className="aspect-square rounded-[4px]"
                    style={{
                      background:
                        intensity < 0.05
                          ? "oklch(0.16 0.02 270)"
                          : `oklch(${0.4 + intensity * 0.5} ${0.15 + intensity * 0.1} ${200 - intensity * 30})`,
                      boxShadow:
                        intensity > 0.45
                          ? `0 0 ${intensity * 10}px oklch(0.88 0.18 200 / ${intensity * 0.5})`
                          : "none",
                      minWidth: 18,
                      minHeight: 18,
                    }}
                  />
                );
              })}
            </Fragment>
          ))}
        </div>
      </div>

      <div className="mt-5 flex items-center gap-3 font-mono text-[10px] uppercase tracking-widest text-foreground/40">
        <span>less</span>
        {[0.1, 0.3, 0.55, 0.8, 1].map((i) => (
          <span
            key={i}
            className="h-2.5 w-2.5 rounded-[2px]"
            style={{
              background: `oklch(${0.4 + i * 0.5} ${0.15 + i * 0.1} ${200 - i * 30})`,
            }}
          />
        ))}
        <span>more</span>
      </div>
    </div>
  );
}

/* ---------------- F1 Iteration Chart ---------------- */

function DrawChart() {
  const ref = useRef<SVGSVGElement>(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });
  const points = [
    { x: 0, y: 78 },
    { x: 1, y: 82 },
    { x: 2, y: 81 },
    { x: 3, y: 86 },
    { x: 4, y: 89 },
    { x: 5, y: 91 },
    { x: 6, y: 94 },
  ];
  const W = 520;
  const H = 240;
  const sx = (i: number) => 30 + (i / 6) * (W - 60);
  const sy = (v: number) => H - 30 - ((v - 70) / 30) * (H - 60);
  const path = points
    .map((p, i) => `${i === 0 ? "M" : "L"} ${sx(p.x)} ${sy(p.y)}`)
    .join(" ");
  const area = `${path} L ${sx(6)} ${H - 30} L ${sx(0)} ${H - 30} Z`;

  return (
    <svg ref={ref} viewBox={`0 0 ${W} ${H}`} className="w-full">
      <defs>
        <linearGradient id="strokeG2" x1="0" x2="1">
          <stop offset="0%" stopColor="oklch(0.88 0.18 200)" />
          <stop offset="100%" stopColor="oklch(0.55 0.27 295)" />
        </linearGradient>
        <linearGradient id="fillG2" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="oklch(0.88 0.18 200 / 0.35)" />
          <stop offset="100%" stopColor="oklch(0.88 0.18 200 / 0)" />
        </linearGradient>
      </defs>
      {[0, 1, 2, 3].map((i) => (
        <line
          key={i}
          x1={30}
          x2={W - 30}
          y1={30 + (i * (H - 60)) / 3}
          y2={30 + (i * (H - 60)) / 3}
          stroke="oklch(1 0 0 / 0.06)"
          strokeDasharray="2 4"
        />
      ))}
      <motion.path
        d={area}
        fill="url(#fillG2)"
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={{ delay: 1.2, duration: 0.8 }}
      />
      <motion.path
        d={path}
        fill="none"
        stroke="url(#strokeG2)"
        strokeWidth={2.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0 }}
        animate={inView ? { pathLength: 1 } : {}}
        transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1] }}
        style={{ filter: "drop-shadow(0 0 6px oklch(0.88 0.18 200 / 0.6))" }}
      />
      {points.map((p, i) => (
        <g key={i}>
          <motion.circle
            cx={sx(p.x)}
            cy={sy(p.y)}
            r={4}
            fill="oklch(0.06 0.005 270)"
            stroke="oklch(0.88 0.18 200)"
            strokeWidth={2}
            initial={{ opacity: 0, scale: 0 }}
            animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ delay: 1 + i * 0.08, duration: 0.4 }}
          />
          <text
            x={sx(p.x)}
            y={sy(p.y) - 12}
            textAnchor="middle"
            className="fill-foreground/60"
            style={{ fontSize: 10, fontFamily: "monospace" }}
          >
            {p.y}
          </text>
        </g>
      ))}
    </svg>
  );
}

/* ---------------- Terminal Log ---------------- */

function TerminalLog() {
  const lines = [
    "[ok] energy-twin/ppo-agent — 0.92 acc · −18% surcharge",
    "[ok] energy-twin/fastapi — p99 187ms · 500 conc.",
    "[ok] oyeee.chat/socket-layer — p95 84ms · 1k+",
    "[ok] oyeee.chat/aura-points — session +40%",
    "[ok] customer-churn/feature-eng — drivers surfaced",
    "[ok] job-tracker/aggregations — manual −50%",
    "[info] iitg × masai × nsdc — 600+ hrs",
    "[ok] cgpa monitor — 8.7 / 10",
  ];
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.8 }}
      className="glass-strong noise overflow-hidden rounded-3xl p-7 md:p-8"
    >
      <div className="flex items-center justify-between">
        <span className="font-display text-[10px] uppercase tracking-[0.4em] text-foreground/50">
          /var/log/build · streaming
        </span>
        <span className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-foreground/50">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[oklch(0.88_0.18_200)]" />
          tail -f
        </span>
      </div>
      <div className="mt-5 space-y-1.5 font-mono text-[11.5px] leading-6 text-foreground/70">
        {lines.map((l, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -10 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08, duration: 0.4 }}
          >
            <span className="text-foreground/30">{`${String(i + 1).padStart(2, "0")}  `}</span>
            <span
              className={
                l.startsWith("[ok]")
                  ? "text-[oklch(0.88_0.18_200)]"
                  : "text-foreground/70"
              }
            >
              {l}
            </span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
