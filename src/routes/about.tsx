import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  Brain,
  Database,
  Sparkles,
  GitBranch,
  Layers,
  Cpu,
  Download,
} from "lucide-react";
import { PageFooterStamp } from "@/components/effects/PageFooterStamp";
import aboutPrimary from "@/assets/about-primary.jpg";
import profileCafe from "@/assets/profile-cafe.jpg";
import profileRed from "@/assets/profile-red.jpg";
import profileLantern from "@/assets/profile-lantern.jpg";
import profileSunset from "@/assets/profile-sunset.jpg";
import { Typewriter } from "@/components/about/Typewriter";
import { LifestyleCarousel } from "@/components/about/LifestyleCarousel";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — Subhasish Kumar Sahu" },
      {
        name: "description",
        content:
          "Subhasish Kumar Sahu — B.Tech CSE student, AI Engineer, and Data Science trainee (IIT Guwahati × Masai × NSDC). RAG, RL, FastAPI, React.",
      },
      { property: "og:title", content: "About — Subhasish Kumar Sahu" },
      {
        property: "og:description",
        content: "Engineer, analyst, and product-minded maker.",
      },
    ],
  }),
  component: AboutPage,
});

const STACK = [
  "PyTorch",
  "LangChain",
  "FastAPI",
  "React",
  "Node.js",
  "Express",
  "MongoDB",
  "PostgreSQL",
  "ChromaDB",
  "Docker",
  "AWS",
  "Scikit-learn",
];

const SPECIALIZATIONS = [
  {
    title: "RAG Pipelines",
    sub: "Retrieve, rank, ground, answer",
    chips: ["CHUNKS", "SEARCH", "CONTEXT"],
    icon: GitBranch,
    accent: "violet",
  },
  {
    title: "AI Systems",
    sub: "Inference, agents, and evaluation",
    chips: ["MODEL", "PROMPT", "EVAL"],
    icon: Cpu,
    accent: "cyan",
  },
  {
    title: "Data Intelligence",
    sub: "Signals, trends, and explainable dashboards",
    chips: ["HEATMAPS", "KPIS", "FORECASTS"],
    icon: Sparkles,
    accent: "cyan",
  },
  {
    title: "Backend Systems",
    sub: "FastAPI services, queues, and Postgres",
    chips: ["API", "QUEUE", "CACHE"],
    icon: Database,
    accent: "violet",
  },
  {
    title: "Reinforcement Learning",
    sub: "PPO agents and reward shaping",
    chips: ["POLICY", "REWARD", "ENV"],
    icon: Brain,
    accent: "cyan",
  },
  {
    title: "Frontend Craft",
    sub: "React, motion, and design systems",
    chips: ["REACT", "MOTION", "TOKENS"],
    icon: Layers,
    accent: "violet",
  },
] as const;

const TIMELINE = [
  {
    date: "Sept 2023 — Present",
    title: "B.Tech in Computer Science & Engineering",
    org: "C.V. Raman Global University",
    body: "Maintaining an 8.7 CGPA while building a strong base in AI engineering, predictive analytics, and production-grade software development.",
  },
  {
    date: "Jan 2025 — Present",
    title: "Data Science Trainee",
    org: "IIT Guwahati × Masai School × NSDC",
    body: "600+ hours of advanced AI training, 10,000+ records analyzed, and dashboards that accelerated model deployment timelines by 25%.",
  },
  {
    date: "Aug 2025",
    title: "Customer Churn Prediction",
    org: "Predictive Analytics",
    body: "Engineered features, trained interpretable models, and surfaced retention drivers as business-ready signal.",
  },
  {
    date: "Nov 2025",
    title: "Mood Detection Engine",
    org: "Computer Vision · Human-centric AI",
    body: "Real-time facial expression recognition with a custom CNN — 94% test accuracy across 7 emotion classes at 30+ FPS.",
  },
  {
    date: "Jan 2026",
    title: "Amigo — Government Schemes Platform",
    org: "Gov-Tech · Document Intelligence",
    body: "Document Intelligence with AI-driven OCR for identity validation and eligibility mapping. 98% extraction accuracy across 50+ schemes.",
  },
  {
    date: "Feb 2026",
    title: "Bhubaneswar Energy Twin",
    org: "Applied AI Project",
    body: "Combined NASA Power data, PPO reinforcement learning, and FastAPI into a digital twin for real-time energy intelligence.",
  },
  {
    date: "Apr 2026",
    title: "oyeee.chat",
    org: "Realtime Product Build",
    body: "Shipped an anonymous messaging experience with WebSockets, Redis-backed sessions, and gamified engagement loops.",
  },
];

const RESUME_URL = "/Subhasish_Kumar_Sahu_Resume.pdf";

function AboutPage() {
  return (
    <section className="relative min-h-screen px-6 pb-32 pt-32 md:px-12">
      <div className="mx-auto max-w-7xl">
        {/* Page header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
        >
          <span className="font-display text-[10px] uppercase tracking-[0.4em] text-[oklch(0.88_0.18_200)]">
            Chapter 01
          </span>
          <h1 className="mt-4 font-display text-6xl font-bold leading-[0.9] tracking-tighter md:text-7xl lg:text-[7rem]">
            SYSTEM
            <br />
            <span className="text-gradient-rim">_PROMPT</span>
          </h1>
        </motion.div>

        {/* Two-column hero */}
        <div className="mt-16 grid grid-cols-1 gap-6 lg:grid-cols-[1fr_1.1fr]">
          {/* Left: bio + photo collage + resume CTA */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9 }}
            className="glass-strong noise relative overflow-hidden rounded-3xl p-7 md:p-9"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <span className="font-display text-[10px] uppercase tracking-[0.4em] text-foreground/50">
                  About me
                </span>
                <h2 className="mt-3 font-display text-3xl font-semibold leading-tight tracking-tight md:text-4xl">
                  Engineer, analyst,{" "}
                  <span className="font-serif-display italic text-foreground/70">
                    and
                  </span>{" "}
                  product-minded maker.
                </h2>
              </div>
              <img
                src={aboutPrimary}
                alt="Subhasish Kumar Sahu"
                className="h-20 w-20 rounded-full border border-white/15 object-cover shadow-[0_0_24px_oklch(0.88_0.18_200/0.25)]"
              />
            </div>

            <p className="mt-5 text-sm leading-relaxed text-foreground/70">
              I love designing systems where raw, messy data becomes an
              experience people can actually trust. My work usually lives at
              the intersection of machine learning, backend architecture,
              and front-end polish.
            </p>

            {/* Resume CTA — download only */}
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <a
                href={RESUME_URL}
                download
                data-cursor-hover
                className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full border border-[oklch(0.88_0.18_200/0.4)] bg-[oklch(0.88_0.18_200/0.08)] px-5 py-2.5 text-xs font-medium uppercase tracking-[0.18em] text-foreground transition-all hover:bg-[oklch(0.88_0.18_200/0.18)] hover:shadow-[0_0_24px_oklch(0.88_0.18_200/0.4)]"
                aria-label="Download résumé PDF"
              >
                <Download className="h-3.5 w-3.5 text-[oklch(0.88_0.18_200)]" />
                <span>Download résumé</span>
                <span className="ml-1 font-mono text-[9px] text-foreground/50">
                  PDF · 2025
                </span>
              </a>
            </div>

            {/* Lifestyle photo collage — asymmetric, intentional */}
            <div className="mt-7 grid grid-cols-6 grid-rows-2 gap-2.5" style={{ height: 360 }}>
              <PhotoTile
                src={profileSunset}
                alt="Sunset over Bhubaneswar"
                caption="GOLDEN_HOUR"
                className="col-span-4 row-span-1"
              />
              <PhotoTile
                src={profileLantern}
                alt="Subhasish portrait — kurta"
                caption="ROOTS"
                className="col-span-2 row-span-2"
              />
              <PhotoTile
                src={profileCafe}
                alt="Subhasish at a cafe"
                caption="THINK_TIME"
                className="col-span-2 row-span-1"
              />
              <PhotoTile
                src={profileRed}
                alt="Subhasish in red shirt"
                caption="OFF_DUTY"
                className="col-span-2 row-span-1"
              />
            </div>

            {/* Mini info cards */}
            <div className="mt-5 grid grid-cols-2 gap-3">
              <MiniCard label="Location" value="Bhubaneswar, Odisha · India" />
              <MiniCard label="CGPA" value="8.7 · B.Tech CSE · CVR University" />
              <MiniCard label="Best with" value="Python · FastAPI · React · MongoDB" />
              <MiniCard label="Timezone" value="IST — async with US windows" />
            </div>
          </motion.div>

          {/* Right: Specializations + Stack (capabilities moved to Analytics) */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, delay: 0.1 }}
            className="glass-strong noise relative overflow-hidden rounded-3xl p-7 md:p-9"
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1">
              <span className="h-1.5 w-1.5 rounded-full bg-[oklch(0.88_0.18_200)] shadow-[0_0_8px_oklch(0.88_0.18_200)]" />
              <span className="font-display text-[10px] uppercase tracking-[0.4em] text-foreground/70">
                Specializations
              </span>
            </div>
            <p className="mt-5 text-sm leading-relaxed text-foreground/70">
              I work across the full stack but spend most of my time at the
              model–API–UI boundary: where behaviour becomes product.
            </p>

            <div className="mt-6 space-y-3">
              {SPECIALIZATIONS.map((s, i) => (
                <SpecCard key={s.title} {...s} delay={i * 0.06} />
              ))}
            </div>

            <div className="mt-7">
              <span className="font-display text-[10px] uppercase tracking-[0.4em] text-foreground/50">
                Stack
              </span>
              <div className="mt-3 flex flex-wrap gap-2">
                {STACK.map((s) => (
                  <span
                    key={s}
                    className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-foreground/80 transition-colors hover:border-[oklch(0.88_0.18_200/0.4)] hover:text-[oklch(0.88_0.18_200)]"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Journey timeline — full width */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9 }}
          className="glass-strong noise relative mt-6 overflow-hidden rounded-3xl p-7 md:p-9"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1">
            <span className="h-1.5 w-1.5 rounded-full bg-[oklch(0.7_0.22_295)] shadow-[0_0_8px_oklch(0.7_0.22_295)]" />
            <span className="font-display text-[10px] uppercase tracking-[0.4em] text-foreground/70">
              Journey
            </span>
          </div>

          <div className="relative mt-7">
            <div className="absolute bottom-2 left-[7px] top-2 w-px bg-gradient-to-b from-[oklch(0.88_0.18_200/0.6)] via-white/15 to-transparent" />
            <div className="space-y-9">
              {TIMELINE.map((t, i) => (
                <TimelineItem key={t.title} {...t} delay={i * 0.08} />
              ))}
            </div>
          </div>
        </motion.div>

        {/* Terminal /etc/whoami — Mac-terminal panel */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9 }}
          className="glass-strong noise relative mt-6 overflow-hidden rounded-3xl"
        >
          <div className="flex items-center justify-between border-b border-white/10 bg-white/[0.02] px-4 py-2.5">
            <div className="flex items-center gap-1.5">
              <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
              <span className="h-3 w-3 rounded-full bg-[#febc2e]" />
              <span className="h-3 w-3 rounded-full bg-[#28c840]" />
            </div>
            <span className="font-mono text-[10px] uppercase tracking-widest text-foreground/40">
              subhasish@portfolio · ~/whoami
            </span>
            <span className="font-mono text-[10px] text-foreground/30">zsh</span>
          </div>
          <div className="p-6 md:p-8">
            <Typewriter />
          </div>
        </motion.div>

        {/* Lifestyle carousel — modern reel */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, delay: 0.1 }}
          className="mt-6"
        >
          <LifestyleCarousel />
        </motion.div>

        <PageFooterStamp readingMinutes={4} updatedDate="18.04.2026" />
      </div>
    </section>
  );
}

/* ---------------- Sub-components ---------------- */

function MiniCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
      <div className="font-display text-[10px] uppercase tracking-[0.3em] text-foreground/50">
        {label}
      </div>
      <div className="mt-1.5 text-sm leading-snug text-foreground/90">
        {value}
      </div>
    </div>
  );
}

function PhotoTile({
  src,
  alt,
  caption,
  className = "",
}: {
  src: string;
  alt: string;
  caption?: string;
  className?: string;
}) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 220, damping: 22 }}
      className={`group relative overflow-hidden rounded-2xl border border-white/10 ${className}`}
      data-cursor-photo
    >
      <img
        src={src}
        alt={alt}
        loading="lazy"
        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
      {caption && (
        <div className="absolute bottom-2 left-2 flex items-center gap-1.5 rounded-full border border-white/15 bg-black/40 px-2 py-1 backdrop-blur-md">
          <span className="h-1 w-1 rounded-full bg-[oklch(0.88_0.18_200)] shadow-[0_0_5px_oklch(0.88_0.18_200)]" />
          <span className="font-mono text-[8.5px] uppercase tracking-widest text-foreground/85">
            {caption}
          </span>
        </div>
      )}
    </motion.div>
  );
}

function SpecCard({
  title,
  sub,
  chips,
  icon: Icon,
  accent,
  delay,
}: {
  title: string;
  sub: string;
  chips: readonly string[];
  icon: typeof Brain;
  accent: "cyan" | "violet";
  delay: number;
}) {
  const accentColor =
    accent === "cyan" ? "oklch(0.88 0.18 200)" : "oklch(0.7 0.22 295)";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay }}
      whileHover={{ y: -2 }}
      className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.025] p-5 transition-colors hover:border-white/20"
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background: `radial-gradient(circle at 0% 0%, ${accentColor.replace(")", " / 0.15)")} 0%, transparent 60%)`,
        }}
      />
      <div className="relative flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h3 className="font-display text-lg font-semibold tracking-tight text-foreground">
            {title}
          </h3>
          <p className="mt-1 text-xs text-foreground/55">{sub}</p>
          <div className="mt-3 flex flex-wrap items-center gap-1.5">
            {chips.map((c, i) => (
              <span key={c} className="flex items-center gap-1.5">
                <span
                  className="rounded-md border border-white/10 bg-black/30 px-2 py-1 font-mono text-[9px] uppercase tracking-widest"
                  style={{ color: accentColor }}
                >
                  {c}
                </span>
                {i < chips.length - 1 && (
                  <span className="text-foreground/20">—</span>
                )}
              </span>
            ))}
          </div>
        </div>
        <div
          className="flex h-10 w-10 flex-none items-center justify-center rounded-xl border border-white/10"
          style={{
            background: `linear-gradient(135deg, ${accentColor.replace(")", " / 0.18)")}, transparent)`,
            boxShadow: `0 0 18px ${accentColor.replace(")", " / 0.25)")}`,
          }}
        >
          <Icon className="h-4 w-4" style={{ color: accentColor }} />
        </div>
      </div>
    </motion.div>
  );
}

function TimelineItem({
  date,
  title,
  org,
  body,
  delay,
}: {
  date: string;
  title: string;
  org: string;
  body: string;
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay }}
      className="relative pl-8"
    >
      <span className="absolute left-0 top-1.5 h-3.5 w-3.5 rounded-full border-2 border-[oklch(0.88_0.18_200)] bg-background shadow-[0_0_12px_oklch(0.88_0.18_200/0.7)]" />
      <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-foreground/50">
        {date}
      </div>
      <h3 className="mt-2 font-display text-lg font-semibold tracking-tight text-foreground">
        {title}
      </h3>
      <div className="mt-1 text-xs text-[oklch(0.88_0.18_200)]">{org}</div>
      <p className="mt-2 text-sm leading-relaxed text-foreground/65">{body}</p>
    </motion.div>
  );
}
