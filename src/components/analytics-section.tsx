"use client";

import { useEffect, useState } from "react";
import {
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { motion } from "framer-motion";
import { GitBranch, Star, Users, Activity, TrendingUp, Code2, Zap } from "lucide-react";
import { useTheme } from "next-themes";

// ─── Static data ──────────────────────────────────────────────────────────────

const COMMIT_ACTIVITY = [
  { month: "Jul", commits: 14, prs: 3 },
  { month: "Aug", commits: 22, prs: 5 },
  { month: "Sep", commits: 18, prs: 4 },
  { month: "Oct", commits: 31, prs: 7 },
  { month: "Nov", commits: 27, prs: 6 },
  { month: "Dec", commits: 19, prs: 4 },
  { month: "Jan", commits: 35, prs: 8 },
  { month: "Feb", commits: 42, prs: 9 },
  { month: "Mar", commits: 38, prs: 7 },
  { month: "Apr", commits: 29, prs: 5 },
];

const LANG_DISTRIBUTION = [
  { name: "Python",     value: 38, color: "#6366f1" },
  { name: "TypeScript", value: 28, color: "#ec4899" },
  { name: "JavaScript", value: 18, color: "#f59e0b" },
  { name: "CSS",        value: 10, color: "#10b981" },
  { name: "Other",      value:  6, color: "#a78bfa" },
];

const SKILL_RADAR = [
  { subject: "ML / AI",       value: 84 },
  { subject: "Backend",       value: 80 },
  { subject: "Frontend",      value: 76 },
  { subject: "Data Viz",      value: 82 },
  { subject: "DevOps",        value: 62 },
  { subject: "System Design", value: 72 },
];

// ─── Heatmap — 5 intensity levels ────────────────────────────────────────────
// Dark: deep indigo void → electric magenta
// Light: pale lavender → vivid magenta (always high contrast on white)
const HEAT_DARK  = ["#1e1b4b", "#4338ca", "#6366f1", "#a855f7", "#ec4899"];
const HEAT_LIGHT = ["#e0e7ff", "#a5b4fc", "#818cf8", "#a855f7", "#db2777"];

const HEATMAP = Array.from({ length: 52 }, (_, w) =>
  Array.from({ length: 7 }, (_, d) => {
    const s = (w * 7 + d) % 17;
    if (s < 4) return 0;
    if (s < 8) return 1;
    if (s < 12) return 2;
    if (s < 15) return 3;
    return 4;
  }),
);

// ─── GitHub stats ─────────────────────────────────────────────────────────────
type GitHubStats = { repos: number; stars: number; followers: number; following: number };
const FALLBACK: GitHubStats = { repos: 24, stars: 47, followers: 38, following: 52 };

// ─── Shared tooltip ───────────────────────────────────────────────────────────
function FunkyTooltip({
  active,
  payload,
  label,
  isDark,
}: {
  active?: boolean;
  payload?: { name: string; value: number; color?: string; payload?: Record<string, string> }[];
  label?: string;
  isDark: boolean;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div
      style={{
        background: isDark ? "rgba(15,10,40,0.94)" : "rgba(255,255,255,0.97)",
        border: "2px solid #6366f1",
        borderRadius: 16,
        padding: "12px 16px",
        boxShadow: "3px 3px 0 #6366f1",
        backdropFilter: "blur(16px)",
        color: isDark ? "#fff" : "#0f0a28",
        fontSize: 13,
      }}
    >
      {label && (
        <p style={{ marginBottom: 6, fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.28em", color: "#6366f1" }}>
          {label}
        </p>
      )}
      {payload.map((p) => (
        <div key={p.name} style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ display: "inline-block", width: 10, height: 10, borderRadius: "50%", background: p.color ?? "#6366f1" }} />
          <span style={{ color: isDark ? "rgba(255,255,255,0.45)" : "rgba(0,0,0,0.45)" }}>{p.name}:</span>
          <span style={{ fontWeight: 700 }}>{p.value}</span>
        </div>
      ))}
    </div>
  );
}

// ─── Stat pill ────────────────────────────────────────────────────────────────
const PILL_ACCENTS = [
  { ring: "#6366f1", glow: "rgba(99,102,241,0.28)",  bg: "rgba(99,102,241,0.14)" },
  { ring: "#ec4899", glow: "rgba(236,72,153,0.28)",  bg: "rgba(236,72,153,0.14)" },
  { ring: "#10b981", glow: "rgba(16,185,129,0.28)",  bg: "rgba(16,185,129,0.14)" },
  { ring: "#f59e0b", glow: "rgba(245,158,11,0.28)",  bg: "rgba(245,158,11,0.14)" },
];

function StatPill({
  icon: Icon, label, value, index, isDark,
}: {
  icon: typeof GitBranch;
  label: string;
  value: number | string;
  index: number;
  isDark: boolean;
}) {
  const a = PILL_ACCENTS[index % PILL_ACCENTS.length];
  return (
    <motion.div
      style={{
        position: "relative",
        overflow: "hidden",
        borderRadius: 20,
        padding: "20px",
        background: isDark ? "rgba(10,8,30,0.72)" : "rgba(255,255,255,0.90)",
        border: `2px solid ${a.ring}`,
        boxShadow: `4px 4px 0 ${a.ring}`,
        backdropFilter: "blur(16px)",
      }}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ delay: index * 0.08, duration: 0.45 }}
      whileHover={{ y: -5, scale: 1.04 }}
    >
      <div
        style={{
          position: "absolute", top: -16, right: -16,
          width: 80, height: 80, borderRadius: "50%",
          background: a.glow, filter: "blur(24px)",
          pointerEvents: "none",
        }}
      />
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
        <p style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.28em", color: a.ring }}>
          {label}
        </p>
        <span style={{ display: "grid", placeItems: "center", width: 36, height: 36, borderRadius: 12, background: a.bg, color: a.ring, border: `1.5px solid ${a.ring}` }}>
          <Icon size={14} />
        </span>
      </div>
      <p style={{ marginTop: 12, fontFamily: "'DM Mono', monospace", fontSize: 30, fontWeight: 700, color: isDark ? "#fff" : "#0f0a28" }}>
        {value}
      </p>
    </motion.div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function AnalyticsSection() {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme !== "light";

  const [stats, setStats]     = useState<GitHubStats>(FALLBACK);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const go = async () => {
      try {
        const r  = await fetch("https://api.github.com/users/subhasish-sahu", { headers: { Accept: "application/vnd.github.v3+json" } });
        if (!r.ok) throw new Error();
        const d  = await r.json();
        const rr = await fetch(d.repos_url + "?per_page=100");
        const repos = rr.ok ? await rr.json() : [];
        const stars = Array.isArray(repos) ? repos.reduce((a: number, r: { stargazers_count: number }) => a + (r.stargazers_count ?? 0), 0) : 0;
        setStats({ repos: d.public_repos ?? FALLBACK.repos, stars: stars || FALLBACK.stars, followers: d.followers ?? FALLBACK.followers, following: d.following ?? FALLBACK.following });
      } catch { /* use fallback */ } finally { setLoading(false); }
    };
    void go();
  }, []);

  // ── Dynamic theme values
  const axisC  = isDark ? "rgba(255,255,255,0.38)" : "rgba(15,10,40,0.55)";
  const gridC  = isDark ? "rgba(255,255,255,0.07)" : "rgba(15,10,40,0.08)";
  const panelBg = isDark ? "rgba(10,8,30,0.72)" : "rgba(255,255,255,0.90)";
  const bodyTxt = isDark ? "#fff" : "#0f0a28";
  const mutedTxt = isDark ? "rgba(255,255,255,0.42)" : "rgba(15,10,40,0.52)";
  const heat = isDark ? HEAT_DARK : HEAT_LIGHT;

  const panelStyle = (accentRgb: string) => ({
    borderRadius: 20,
    padding: 24,
    background: panelBg,
    border: `2px solid rgba(${accentRgb},0.40)`,
    boxShadow: `4px 4px 0 rgba(${accentRgb},0.45)`,
    backdropFilter: "blur(20px)",
    width: "100%",
  });

  const statPills = [
    { icon: GitBranch, label: "Public repos", value: loading ? "—" : stats.repos    },
    { icon: Star,      label: "Total stars",  value: loading ? "—" : stats.stars    },
    { icon: Users,     label: "Followers",    value: loading ? "—" : stats.followers },
    { icon: Activity,  label: "Following",    value: loading ? "—" : stats.following },
  ];

  return (
    // ⚠️  section-shell only — zero extra max-w, margin-right, or padding constraints
    <section
      id="analytics"
      className="section-shell reveal-item section-divider"
      style={{ width: "100%" }}
      aria-labelledby="analytics-title"
    >
      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div className="mb-8 w-full">
        <div
          className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-bold uppercase tracking-[0.28em]"
          style={{ background: isDark ? "rgba(99,102,241,0.15)" : "rgba(99,102,241,0.12)", border: "1.5px solid rgba(99,102,241,0.55)", color: "#6366f1" }}
        >
          <Zap className="h-3.5 w-3.5" />
          Activity &amp; Metrics
        </div>

        <h2
          id="analytics-title"
          className="mt-4 font-[family:var(--font-display)] text-3xl font-bold tracking-tight sm:text-4xl"
          style={{ color: bodyTxt }}
        >
          The signal behind the builds.
        </h2>
        <p className="mt-3 max-w-2xl text-base leading-8" style={{ color: mutedTxt }}>
          Live GitHub stats augmented with skill depth mapping and commit rhythm — a pulse
          check on where focus actually lives.
        </p>

        {/* 186-day streak badge — always high-contrast in both modes */}
        <div
          className="mt-4 inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-bold"
          style={{
            background: isDark
              ? "linear-gradient(135deg,rgba(236,72,153,0.22),rgba(99,102,241,0.22))"
              : "linear-gradient(135deg,rgba(236,72,153,0.14),rgba(99,102,241,0.14))",
            border: "2px solid #ec4899",
            boxShadow: "3px 3px 0 #ec4899",
            color: isDark ? "#fff" : "#0f0a28",
          }}
        >
          <span style={{ color: "#ec4899" }}>🔥</span>
          186-day creative streak mindset
        </div>
      </div>

      {/* ── Stat pills ──────────────────────────────────────────────────────── */}
      <div className="w-full grid grid-cols-2 gap-4 sm:grid-cols-4">
        {statPills.map((p, i) => (
          <StatPill key={p.label} {...p} index={i} isDark={isDark} />
        ))}
      </div>

      {/* ── Row 1: Area + Pie ─────────────────────────────────────────────── */}
      <div className="mt-6 w-full grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        {/* Area */}
        <motion.div
          style={panelStyle("99,102,241")}
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5 }}
        >
          <div className="mb-5 flex items-center justify-between gap-4">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.3em]" style={{ color: "#6366f1" }}>Commit rhythm</p>
              <h3 className="mt-2 text-xl font-bold" style={{ color: bodyTxt }}>Monthly output</h3>
            </div>
            <TrendingUp size={20} color="#6366f1" />
          </div>
          {/* CRITICAL wrapper */}
          <div className="flex-1 min-h-[300px] w-full">
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={COMMIT_ACTIVITY} margin={{ top: 4, right: 8, bottom: 4, left: -16 }}>
                <defs>
                  <linearGradient id="areaCommit" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#6366f1" stopOpacity={0.45} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}    />
                  </linearGradient>
                  <linearGradient id="areaPR" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#ec4899" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#ec4899" stopOpacity={0}    />
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" tick={{ fill: axisC, fontSize: 11, fontWeight: 600 }} axisLine={{ stroke: gridC }} tickLine={false} />
                <YAxis tick={{ fill: axisC, fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip content={(props) => <FunkyTooltip {...props} isDark={isDark} />} />
                <Area type="monotone" dataKey="commits" name="Commits" stroke="#6366f1" strokeWidth={2.5} fill="url(#areaCommit)" dot={false} />
                <Area type="monotone" dataKey="prs"     name="PRs"     stroke="#ec4899" strokeWidth={2}   fill="url(#areaPR)"     dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Pie */}
        <motion.div
          style={panelStyle("236,72,153")}
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5, delay: 0.12 }}
        >
          <div className="mb-5 flex items-center justify-between gap-4">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.3em]" style={{ color: "#ec4899" }}>Codebase composition</p>
              <h3 className="mt-2 text-xl font-bold" style={{ color: bodyTxt }}>Language split</h3>
            </div>
            <Code2 size={20} color="#ec4899" />
          </div>
          <div className="flex-1 min-h-[300px] w-full">
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie data={LANG_DISTRIBUTION} cx="50%" cy="50%" innerRadius={66} outerRadius={106} paddingAngle={4} dataKey="value" strokeWidth={0}>
                  {LANG_DISTRIBUTION.map((e) => <Cell key={e.name} fill={e.color} />)}
                </Pie>
                <Tooltip
                  content={({ active, payload }) => {
                    if (!active || !payload?.length) return null;
                    const d = payload[0];
                    return (
                      <div style={{ background: isDark ? "rgba(15,10,40,0.94)" : "rgba(255,255,255,0.97)", border: `2px solid ${String(d.payload?.color ?? "#6366f1")}`, borderRadius: 14, padding: "10px 14px", color: isDark ? "#fff" : "#0f0a28", fontSize: 13 }}>
                        <span style={{ fontWeight: 700 }}>{String(d.name)}</span>
                        <span style={{ marginLeft: 8, color: mutedTxt }}>{String(d.value)}%</span>
                      </div>
                    );
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-1 flex flex-wrap justify-center gap-3">
              {LANG_DISTRIBUTION.map((d) => (
                <div key={d.name} className="flex items-center gap-1.5 text-xs font-semibold" style={{ color: mutedTxt }}>
                  <span style={{ display: "inline-block", width: 10, height: 10, borderRadius: "50%", background: d.color }} />
                  {d.name}
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* ── Row 2: Radar + Heatmap ────────────────────────────────────────── */}
      <div className="mt-6 w-full grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        {/* Radar */}
        <motion.div
          style={panelStyle("168,85,247")}
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5, delay: 0.08 }}
        >
          <div className="mb-5">
            <p className="text-[11px] font-bold uppercase tracking-[0.3em]" style={{ color: "#a855f7" }}>Skill topology</p>
            <h3 className="mt-2 text-xl font-bold" style={{ color: bodyTxt }}>Depth map</h3>
          </div>
          <div className="flex-1 min-h-[300px] w-full">
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart data={SKILL_RADAR} cx="50%" cy="50%">
                <PolarGrid stroke={gridC} />
                <PolarAngleAxis dataKey="subject" tick={{ fill: isDark ? "rgba(255,255,255,0.72)" : "rgba(15,10,40,0.78)", fontSize: 11, fontWeight: 700 }} />
                <Radar name="Proficiency" dataKey="value" stroke="#a855f7" fill="rgba(168,85,247,0.22)" strokeWidth={2.5} dot={{ fill: "#a855f7", r: 4, stroke: isDark ? "#1e1b4b" : "#fff", strokeWidth: 2 }} />
                <Tooltip content={(props) => <FunkyTooltip {...props} isDark={isDark} />} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Vibrant heatmap */}
        <motion.div
          style={panelStyle("16,185,129")}
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5, delay: 0.18 }}
        >
          <div className="mb-5 flex items-center justify-between gap-4">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.3em]" style={{ color: "#10b981" }}>52-week window</p>
              <h3 className="mt-2 text-xl font-bold" style={{ color: bodyTxt }}>Contribution heatmap</h3>
            </div>
            <Activity size={20} color="#10b981" />
          </div>

          {/* Day labels */}
          <div style={{ display: "flex", gap: 3, marginBottom: 4 }}>
            {["S","M","T","W","T","F","S"].map((d, i) => (
              <span key={i} style={{ width: 13, textAlign: "center", fontSize: 9, fontWeight: 700, textTransform: "uppercase", color: mutedTxt, flexShrink: 0 }}>
                {d}
              </span>
            ))}
          </div>

          {/* 52 cols × 7 rows */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(52, minmax(0, 1fr))", gap: 3, width: "100%" }}>
            {HEATMAP.map((week, wIdx) =>
              week.map((intensity, dIdx) => (
                <motion.div
                  key={`${wIdx}-${dIdx}`}
                  style={{
                    height: 13,
                    borderRadius: 5,
                    background: heat[intensity],
                    boxShadow: intensity >= 3 ? `0 0 7px ${heat[intensity]}99` : "none",
                    flexShrink: 0,
                  }}
                  initial={{ opacity: 0, scale: 0.4 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true, amount: 0 }}
                  transition={{ delay: (wIdx * 7 + dIdx) * 0.0007, duration: 0.18 }}
                  whileHover={{ scale: 1.7, zIndex: 10 }}
                  title={`W${wIdx + 1} D${dIdx + 1} — intensity ${intensity}`}
                />
              )),
            )}
          </div>

          {/* Legend */}
          <div style={{ marginTop: 16, display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.22em", color: mutedTxt }}>Less</span>
            {heat.map((color, i) => (
              <div key={i} style={{ width: 13, height: 13, borderRadius: 5, background: color, boxShadow: i >= 3 ? `0 0 5px ${color}88` : "none", flexShrink: 0 }} />
            ))}
            <span style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.22em", color: mutedTxt }}>More</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}