"use client";

import { useEffect, useState } from "react";
import {
  AreaChart,
  Area,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import { motion } from "framer-motion";
import { GitBranch, Star, Users, Zap } from "lucide-react";
import { useTheme } from "next-themes";
import {
  activitySeries,
  contributionHeatmapWeeks,
  dashboardMetrics,
  heatmapDayLabels,
  languageUsage,
  personalDetails,
  radarFocus,
} from "@/lib/portfolio-data";

// ─── GitHub stats ──────────────────────────────────────────────────────────────
type GHStats = { repos: number; stars: number; followers: number };
const FALLBACK: GHStats = { repos: 24, stars: 47, followers: 38 };

// ─── Heatmap level → CSS class (light + dark via Tailwind dark:) ───────────────
const HEAT_CLASSES = [
  "bg-slate-200 dark:bg-white/[0.06]",
  "bg-[#b3c6d0] dark:bg-cyan-900/60",
  "bg-[#67a3bd] dark:bg-cyan-700/70",
  "bg-[#2d7fa8] dark:bg-cyan-500",
  "bg-[#0d5e8a] dark:bg-cyan-300",
];

// ─── Custom tooltip — theme-aware ─────────────────────────────────────────────
function ChartTooltip({ active, payload, label }: {
  active?: boolean;
  payload?: { name: string; value: number; color?: string }[];
  label?: string;
}) {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme !== "light";
  if (!active || !payload?.length) return null;
  return (
    <div
      className="rounded-2xl px-4 py-3 text-sm shadow-2xl backdrop-blur-xl"
      style={{
        background: isDark ? "rgba(8,13,26,0.94)" : "rgba(255,255,255,0.97)",
        border: isDark ? "1px solid rgba(255,255,255,0.10)" : "1px solid rgba(114,52,128,0.16)",
        color: isDark ? "#eef6ff" : "#26211f",
      }}
    >
      {label && (
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.25em] text-[var(--muted)]">{label}</p>
      )}
      {payload.map((p) => (
        <div key={p.name} className="flex items-center gap-2">
          <span className="inline-block h-2 w-2 rounded-full" style={{ background: p.color ?? "currentColor" }} />
          <span className="text-[var(--muted)]">{p.name}:</span>
          <span className="font-semibold">{p.value}</span>
        </div>
      ))}
    </div>
  );
}

export default function AnalyticsSection() {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme !== "light";

  const [ghStats,  setGhStats ] = useState<GHStats>(FALLBACK);
  const [ghLoading, setGhLoading] = useState(true);

  // Live GitHub stats
  useEffect(() => {
    const go = async () => {
      try {
        const res  = await fetch(
          `https://api.github.com/users/${personalDetails.githubUsername}`,
          { headers: { Accept: "application/vnd.github.v3+json" } },
        );
        if (!res.ok) throw new Error();
        const data = await res.json();

        const reposRes = await fetch(data.repos_url + "?per_page=100");
        const repos    = reposRes.ok ? (await reposRes.json() as { stargazers_count: number }[]) : [];
        const stars    = repos.reduce((acc, r) => acc + (r.stargazers_count ?? 0), 0);

        setGhStats({
          repos:     data.public_repos ?? FALLBACK.repos,
          stars:     stars             || FALLBACK.stars,
          followers: data.followers    ?? FALLBACK.followers,
        });
      } catch { /* use fallback */ } finally {
        setGhLoading(false);
      }
    };
    void go();
  }, []);

  // Recharts dynamic colours
  const axisTickColor = isDark ? "rgba(226,232,240,0.55)" : "rgba(38,33,31,0.55)";
  const gridColor     = isDark ? "rgba(255,255,255,0.06)" : "rgba(38,33,31,0.07)";

  return (
    <section
      id="analytics"
      className="section-shell section-divider"
      aria-labelledby="analytics-title"
    >
      {/* Header */}
      <div className="mb-8">
        <span className="eyebrow">Activity &amp; Output</span>
        <h2
          id="analytics-title"
          className="mt-4 font-[family:var(--font-display)] text-3xl font-semibold tracking-tight sm:text-4xl"
        >
          The signal behind the builds.
        </h2>
        <p className="mt-4 max-w-2xl text-base leading-8 text-[var(--muted)]">
          Live GitHub stats, self-measured skill depth, and six months of coded activity.
          Charts are real data — sourced from the GitHub API or project READMEs.
        </p>
      </div>

      {/* ── Dashboard metric tiles ─────────────────────────────────────────── */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {/* GitHub live */}
        {[
          { icon: GitBranch, label: "Public repos",  value: ghLoading ? "…" : String(ghStats.repos)     },
          { icon: Star,      label: "GitHub stars",  value: ghLoading ? "…" : String(ghStats.stars)     },
          { icon: Users,     label: "Followers",     value: ghLoading ? "…" : String(ghStats.followers)  },
          { icon: Zap,       label: "Training hours", value: "600+"                                       },
        ].map((tile, i) => (
          <motion.div
            key={tile.label}
            className="glass-panel px-5 py-5"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ delay: i * 0.07, duration: 0.4 }}
          >
            <div className="flex items-center justify-between gap-3">
              <p className="text-xs uppercase tracking-[0.26em] text-[var(--muted)]">{tile.label}</p>
              <tile.icon className="h-4 w-4 text-[var(--muted)]" aria-hidden="true" />
            </div>
            <p className="mt-3 font-[family:var(--font-mono)] text-3xl font-semibold">
              {tile.value}
            </p>
          </motion.div>
        ))}
      </div>

      {/* ── Charts row 1: Area + Pie ────────────────────────────────────────── */}
      <div className="mt-6 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        {/* Activity area chart */}
        <motion.div
          className="glass-panel chart-panel p-6"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.45 }}
        >
          <p className="mb-1 text-xs uppercase tracking-[0.28em] text-[var(--muted)]">Monthly activity</p>
          <h3 className="mb-5 text-xl font-semibold">Build output over 6 months</h3>
          <div className="chart-panel__plot chart-panel__plot--arc">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={activitySeries} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
                <defs>
                  <linearGradient id="gFocus" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor={isDark ? "#67e8f9" : "#723480"} stopOpacity={0.35} />
                    <stop offset="95%" stopColor={isDark ? "#67e8f9" : "#723480"} stopOpacity={0}    />
                  </linearGradient>
                  <linearGradient id="gShip" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor={isDark ? "#c084fc" : "#808034"} stopOpacity={0.30} />
                    <stop offset="95%" stopColor={isDark ? "#c084fc" : "#808034"} stopOpacity={0}    />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                <XAxis
                  dataKey="month"
                  tick={{ fill: axisTickColor, fontSize: 11 }}
                  axisLine={{ stroke: gridColor }}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: axisTickColor, fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip content={<ChartTooltip />} />
                <Area type="monotone" dataKey="focus"    name="Focus"    stroke={isDark ? "#67e8f9" : "#723480"} strokeWidth={2} fill="url(#gFocus)" dot={false} />
                <Area type="monotone" dataKey="shipping" name="Shipping" stroke={isDark ? "#c084fc" : "#808034"} strokeWidth={2} fill="url(#gShip)"  dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Language pie */}
        <motion.div
          className="glass-panel chart-panel p-6"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.45, delay: 0.1 }}
        >
          <p className="mb-1 text-xs uppercase tracking-[0.28em] text-[var(--muted)]">Codebase split</p>
          <h3 className="mb-5 text-xl font-semibold">Language distribution</h3>
          <div className="chart-panel__plot chart-panel__plot--arc">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={languageUsage}
                  cx="50%"
                  cy="50%"
                  innerRadius="42%"
                  outerRadius="68%"
                  paddingAngle={3}
                  dataKey="value"
                  strokeWidth={0}
                >
                  {languageUsage.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  content={({ active, payload }) => {
                    if (!active || !payload?.length) return null;
                    const d = payload[0];
                    return (
                      <div
                        className="rounded-xl px-4 py-2 text-sm backdrop-blur-xl"
                        style={{
                          background: isDark ? "rgba(8,13,26,0.94)" : "rgba(255,255,255,0.97)",
                          border: isDark ? "1px solid rgba(255,255,255,0.10)" : "1px solid rgba(114,52,128,0.16)",
                          color: isDark ? "#eef6ff" : "#26211f",
                        }}
                      >
                        <span className="font-semibold">{String(d.name)}</span>
                        <span className="ml-2 text-[var(--muted)]">{String(d.value)}%</span>
                      </div>
                    );
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-2 flex flex-wrap justify-center gap-3">
            {languageUsage.map((d) => (
              <div key={d.name} className="flex items-center gap-1.5 text-xs text-[var(--muted)]">
                <span className="inline-block h-2 w-2 rounded-full" style={{ background: d.color }} />
                {d.name}
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* ── Charts row 2: Radar + Heatmap ────────────────────────────────────── */}
      <div className="mt-6 grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
        {/* Skill radar */}
        <motion.div
          className="glass-panel chart-panel p-6"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.45, delay: 0.08 }}
        >
          <p className="mb-1 text-xs uppercase tracking-[0.28em] text-[var(--muted)]">Skill depth</p>
          <h3 className="mb-5 text-xl font-semibold">Self-rated — relative to portfolio work</h3>
          <div className="chart-panel__plot chart-panel__plot--radar">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarFocus} cx="50%" cy="50%">
                <PolarGrid stroke={gridColor} />
                <PolarAngleAxis
                  dataKey="skill"
                  tick={{ fill: axisTickColor, fontSize: 11 }}
                />
                <Radar
                  name="Score"
                  dataKey="score"
                  stroke={isDark ? "#67e8f9" : "#723480"}
                  fill={isDark ? "rgba(103,232,249,0.18)" : "rgba(114,52,128,0.12)"}
                  strokeWidth={2}
                  dot={{ fill: isDark ? "#67e8f9" : "#723480", r: 3 }}
                />
                <Tooltip content={<ChartTooltip />} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Contribution heatmap */}
        <motion.div
          className="glass-panel p-6"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.45, delay: 0.16 }}
        >
          <p className="mb-1 text-xs uppercase tracking-[0.28em] text-[var(--muted)]">18-week window</p>
          <h3 className="mb-5 text-xl font-semibold">Coded activity grid</h3>

          {/* Day labels */}
          <div className="mb-1 ml-12 grid grid-cols-7 gap-1.5">
            {heatmapDayLabels.map((d) => (
              <span key={d} className="text-center text-[10px] font-semibold uppercase tracking-[0.15em] text-[var(--muted)]">
                {d.slice(0, 1)}
              </span>
            ))}
          </div>

          {/* Rows = weeks */}
          <div className="grid gap-1.5">
            {contributionHeatmapWeeks.map((week, wi) => (
              <div key={wi} className="grid grid-cols-[3rem_1fr]">
                <span className="self-center text-right pr-3 text-[10px] text-[var(--muted)]">
                  W{wi + 1}
                </span>
                <div className="grid grid-cols-7 gap-1.5">
                  {week.map((cell) => (
                    <motion.div
                      key={cell.id}
                      className={`aspect-square rounded-sm transition-transform hover:scale-125 ${HEAT_CLASSES[cell.level]}`}
                      title={cell.label}
                      initial={{ opacity: 0, scale: 0.5 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true, amount: 0 }}
                      transition={{ delay: (wi * 7) * 0.0015, duration: 0.2 }}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Legend */}
          <div className="mt-4 flex items-center gap-2">
            <span className="text-[10px] uppercase tracking-[0.2em] text-[var(--muted)]">Less</span>
            {HEAT_CLASSES.map((cls, i) => (
              <div key={i} className={`h-3.5 w-3.5 rounded-sm ${cls}`} />
            ))}
            <span className="text-[10px] uppercase tracking-[0.2em] text-[var(--muted)]">More</span>
          </div>
        </motion.div>
      </div>

      {/* ── Dashboard summary tiles ────────────────────────────────────────── */}
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {dashboardMetrics.map((m, i) => (
          <motion.div
            key={m.label}
            className="glass-panel px-5 py-5"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ delay: i * 0.07, duration: 0.4 }}
          >
            <p className="text-xs uppercase tracking-[0.26em] text-[var(--muted)]">{m.label}</p>
            <p className="mt-2 font-[family:var(--font-mono)] text-3xl font-semibold">
              {m.value}{m.suffix}
            </p>
            <p className="mt-2 text-sm leading-6 text-[var(--muted)]">{m.note}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}