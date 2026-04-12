"use client";

import {
  useDeferredValue,
  useEffect,
  useState,
  useSyncExternalStore,
  useTransition,
  type ReactNode,
} from "react";

import dynamic from "next/dynamic";
import Image from "next/image";
import {
  AnimatePresence,
  LayoutGroup,
  motion,
  useScroll,
  useSpring,
} from "framer-motion";
import { useTheme } from "next-themes";
import {
  ArrowRight,
  BadgeCheck,
  BrainCircuit,
  BriefcaseBusiness,
  Coffee,
  ChevronLeft,
  ChevronRight,
  Download,
  ExternalLink,
  GitBranch,
  Heart,
  Home,
  Mail,
  Menu,
  MessageCircle,
  Moon,
  PanelsTopLeft,
  Rocket,
  Sparkles,
  Sun,
  Trophy,
  UserRound,
  WandSparkles,
  X,
  Camera,
  Zap,
} from "lucide-react";

import {
  careerTimeline,
  expertise,
  filterOptions,
  funFacts,
  heroBadgeList,
  heroHighlights,
  likes,
  instagramMoments,
  personalDetails,
  photoMoments,
  projects,
  rotatingRoles,
  socialLinks,
  techStack,
  dislikes,
  type Project,
} from "@/lib/portfolio-data";
import { cn } from "@/lib/utils";

// ─── Lazy analytics ──────────────────────────────────────────────────────────

const AnalyticsSection = dynamic(
  () => import("@/components/analytics-section"),
  {
    ssr: false,
    loading: () => (
      <section className="section-shell" aria-hidden="true">
        <div className="glass-panel skeleton-shimmer h-[min(520px,70vh)] w-full" />
      </section>
    ),
  },
);

// ─── Accent palette ───────────────────────────────────────────────────────────
// Six punchy colours cycled across cards/buttons/chips
const ACCENTS = [
  { hex: "#6366f1", rgb: "99,102,241",  name: "indigo"  },
  { hex: "#ec4899", rgb: "236,72,153",  name: "magenta" },
  { hex: "#10b981", rgb: "16,185,129",  name: "emerald" },
  { hex: "#f59e0b", rgb: "245,158,11",  name: "amber"   },
  { hex: "#a855f7", rgb: "168,85,247",  name: "violet"  },
  { hex: "#06b6d4", rgb: "6,182,212",   name: "cyan"    },
] as const;

const acc = (i: number) => ACCENTS[i % ACCENTS.length];

// ─── Nav links ────────────────────────────────────────────────────────────────
const navLinks = [
  { id: "home",      label: "Home",      icon: Home          },
  { id: "about",     label: "About",     icon: UserRound     },
  { id: "projects",  label: "Projects",  icon: PanelsTopLeft },
  { id: "analytics", label: "Analytics", icon: BrainCircuit  },
  { id: "vibes",     label: "Vibes",     icon: Heart         },
  { id: "contact",   label: "Contact",   icon: Mail          },
];

const specializationVisuals = [
  { title: "AI Systems",       subtitle: "Inference, agents, and evaluation",            icon: BrainCircuit, accentIdx: 0, nodes: ["Model","Prompt","Eval"]     },
  { title: "RAG Pipelines",    subtitle: "Retrieve, rank, ground, answer",               icon: GitBranch,    accentIdx: 1, nodes: ["Chunks","Search","Context"]  },
  { title: "Data Intelligence",subtitle: "Signals, trends, and explainable dashboards",  icon: Sparkles,     accentIdx: 2, nodes: ["Heatmaps","KPIs","Forecasts"] },
];

type ToastState = { title: string; body: string; tone?: "success" | "secret" };

// ─────────────────────────────────────────────────────────────────────────────
export function PortfolioShowcase() {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme !== "light";

  const [loading,      setLoading     ] = useState(true);
  const [progress,     setProgress    ] = useState(0);
  const [activeFilter, setActiveFilter] = useState<(typeof filterOptions)[number]>("All");
  const deferredFilter = useDeferredValue(activeFilter);
  const [activeProject, setActiveProject] = useState<Project | null>(null);
  const [activeSection, setActiveSection] = useState("home");
  const [menuOpen,      setMenuOpen    ] = useState(false);
  const [toast,         setToast       ] = useState<ToastState | null>(null);
  const [secretMode,    setSecretMode  ] = useState(false);
  const [funFactIndex,  setFunFactIndex] = useState(0);
  const [momentIndex,   setMomentIndex ] = useState(0);
  const [, startFilterTransition]        = useTransition();
  const [isSubmitting,  setIsSubmitting] = useState(false);
  const [burst,         setBurst       ] = useState(false);
  const [scrolling,     setScrolling   ] = useState(false);

  const { scrollYProgress } = useScroll();
  const progressScale = useSpring(scrollYProgress, { stiffness: 110, damping: 26, restDelta: 0.001 });

  const projectOrder = ["oyeee-chat","energy-twin","customer-churn-prediction","job-tracker"] as const;
  const visibleProjects  = deferredFilter === "All" ? projects : projects.filter((p) => p.category === deferredFilter);
  const orderedProjects  = [...visibleProjects].sort(
    (a, b) =>
      projectOrder.indexOf(a.id as (typeof projectOrder)[number]) -
      projectOrder.indexOf(b.id as (typeof projectOrder)[number]),
  );

  // effects identical to previous version — loading, tickers, scroll, section spy, konami, escape
  useEffect(() => {
    const steps = [18,32,46,59,72,84,94,100]; let idx = 0;
    const t = window.setInterval(() => {
      setProgress(steps[idx] ?? 100); idx++;
      if (idx >= steps.length) { window.clearInterval(t); window.setTimeout(() => setLoading(false), 260); }
    }, 150);
    return () => window.clearInterval(t);
  }, []);

  useEffect(() => {
    const t = window.setInterval(() => setFunFactIndex((c) => (c + 1) % funFacts.length), 5000);
    return () => window.clearInterval(t);
  }, []);

  useEffect(() => {
    const t = window.setInterval(() => setMomentIndex((c) => (c + 1) % instagramMoments.length), 4200);
    return () => window.clearInterval(t);
  }, []);

  useEffect(() => {
    if (!toast) return;
    const t = window.setTimeout(() => setToast(null), 3200);
    return () => window.clearTimeout(t);
  }, [toast]);

  useEffect(() => {
    const fn = () => setScrolling(window.scrollY > 20);
    fn(); window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  useEffect(() => {
    const sections = Array.from(document.querySelectorAll("section[id]"));
    const obs = new IntersectionObserver(
      (entries) => {
        const v = entries.filter((e) => e.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (v) setActiveSection(v.target.id);
      },
      { threshold: [0.2,0.45,0.7], rootMargin: "-20% 0px -20% 0px" },
    );
    sections.forEach((s) => obs.observe(s));
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    const seq = ["ArrowUp","ArrowUp","ArrowDown","ArrowDown","ArrowLeft","ArrowRight","ArrowLeft","ArrowRight","b","a"];
    let idx = 0;
    const fn = (e: KeyboardEvent) => {
      const k = e.key.length === 1 ? e.key.toLowerCase() : e.key;
      if (k === seq[idx]) { idx++; } else { idx = k === seq[0] ? 1 : 0; }
      if (idx === seq.length) {
        setSecretMode((c) => !c);
        setToast({ title: "Konami code accepted", body: "Cyber mode toggled.", tone: "secret" });
        idx = 0;
      }
    };
    window.addEventListener("keydown", fn);
    return () => window.removeEventListener("keydown", fn);
  }, []);

  useEffect(() => {
    if (!activeProject) return;
    const fn = (e: KeyboardEvent) => { if (e.key === "Escape") setActiveProject(null); };
    window.addEventListener("keydown", fn);
    return () => window.removeEventListener("keydown", fn);
  }, [activeProject]);

  const handleContactSubmit = (fd: FormData) => {
    const name    = String(fd.get("name")    ?? "").trim();
    const email   = String(fd.get("email")   ?? "").trim();
    const message = String(fd.get("message") ?? "").trim();
    if (!name || !email || !message) { setToast({ title: "A few fields are still empty", body: "Fill in name, email, and message." }); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setToast({ title: "That email looks off", body: "Please double-check the format." }); return; }
    setIsSubmitting(true); setBurst(true);
    const subject = encodeURIComponent(`Portfolio enquiry from ${name}`);
    const body    = encodeURIComponent(`${message}\n\nFrom: ${name}\nEmail: ${email}`);
    window.setTimeout(() => {
      setIsSubmitting(false);
      setToast({ title: "Message routed", body: "Mail client should open now.", tone: "success" });
      window.location.href = `mailto:${personalDetails.email}?subject=${subject}&body=${body}`;
    }, 820);
    window.setTimeout(() => setBurst(false), 900);
  };

  // ── theme-aware colours used throughout ──────────────────────────────────
  const bodyTxt  = isDark ? "#fff"                    : "#0f0a28";
  const mutedTxt = isDark ? "rgba(255,255,255,0.45)"  : "rgba(15,10,40,0.55)";
  const cardBg   = isDark ? "rgba(10,8,30,0.72)"      : "rgba(255,255,255,0.88)";
  const cardBdr  = isDark ? "rgba(255,255,255,0.10)"  : "rgba(15,10,40,0.12)";

  return (
    <div
      className="noise-overlay relative min-h-screen overflow-x-hidden"
      style={{ background: isDark ? "#060412" : "#f5f4ff" }}
    >
      <AnimatePresence>{loading ? <LoadingScreen progress={progress} isDark={isDark} /> : null}</AnimatePresence>
      <AnimatePresence>{toast  ? <ToastBanner   toast={toast}   isDark={isDark} /> : null}</AnimatePresence>

      {/* Secret mode rain */}
      {secretMode && (
        <div className="pointer-events-none fixed inset-0 z-10 opacity-40 mix-blend-screen">
          {Array.from({ length: 14 }).map((_, i) => (
            <div key={i} className="absolute top-0 h-full font-[family:var(--font-mono)] text-[10px] tracking-[0.3em]"
              style={{ left: `${i * 7.2}%`, color: acc(i).hex, animation: `float ${4 + (i % 3)}s ease-in-out infinite` }}>
              {`01010110\nRAG\nPPO\nFASTAPI\nREACT\nDATA\nVECTOR\n${i}`}
            </div>
          ))}
        </div>
      )}

      {/* Progress bar */}
      <motion.div
        className="fixed inset-x-0 top-0 z-[70] h-[3px] origin-left"
        style={{ scaleX: progressScale, background: "linear-gradient(90deg,#6366f1,#ec4899,#f59e0b)" }}
      />

      {/* ── HEADER — fixed, pointer-events-none outer ───────────────────── */}
      <header className={cn("fixed top-0 left-0 right-0 z-50 pointer-events-none transition-all duration-300", scrolling ? "pt-3" : "pt-5")}>
        <div
          className={cn(
            "page-shell pointer-events-auto flex w-full items-center justify-between rounded-full border px-3 py-3 transition-all duration-300",
            scrolling
              ? isDark ? "border-white/10 bg-black/70 backdrop-blur-3xl shadow-2xl shadow-black/70" : "border-slate-200/60 bg-white/80 backdrop-blur-3xl shadow-2xl shadow-slate-300/40"
              : "border-transparent bg-transparent",
          )}
        >
          <a href="#home" className="inline-flex items-center gap-3 rounded-full px-3 py-2" aria-label="Home">
            <span
              className="grid h-10 w-10 place-items-center rounded-full text-sm font-bold text-white"
              style={{ background: "linear-gradient(135deg,#6366f1,#ec4899)", boxShadow: "3px 3px 0 #6366f1" }}
            >
              SK
            </span>
            <span className="hidden sm:block">
              <span className="block font-[family:var(--font-display)] text-sm font-bold" style={{ color: bodyTxt }}>
                {personalDetails.firstName}
              </span>
              <span className="block text-xs font-semibold" style={{ color: "#6366f1" }}>AI × Full Stack</span>
            </span>
          </a>

          <LayoutGroup id="site-nav">
            <nav
              className="relative hidden items-center gap-0.5 rounded-full border p-1.5 backdrop-blur-3xl lg:flex"
              style={{ borderColor: isDark ? "rgba(99,102,241,0.25)" : "rgba(99,102,241,0.20)", background: isDark ? "rgba(10,8,30,0.60)" : "rgba(255,255,255,0.80)" }}
              aria-label="Primary"
            >
              {navLinks.map((item) => {
                const Icon   = item.icon;
                const active = activeSection === item.id;
                return (
                  <a
                    key={item.id}
                    href={`#${item.id}`}
                    className="relative inline-flex items-center rounded-full px-4 py-2 text-sm font-semibold transition-colors duration-300"
                    style={{ color: active ? "#fff" : isDark ? "rgba(255,255,255,0.5)" : "rgba(15,10,40,0.55)" }}
                  >
                    {active && (
                      <motion.span
                        layoutId="nav-pill"
                        className="absolute inset-0 rounded-full"
                        style={{ background: "linear-gradient(135deg,#6366f1,#ec4899)" }}
                        transition={{ type: "spring", stiffness: 420, damping: 32 }}
                        aria-hidden
                      />
                    )}
                    <span className="relative z-10 inline-flex items-center gap-2">
                      <Icon className="h-4 w-4" />{item.label}
                    </span>
                  </a>
                );
              })}
            </nav>
          </LayoutGroup>

          <div className="flex items-center gap-2">
            <ThemeToggle isDark={isDark} />
            <button
              type="button"
              className="grid h-12 w-12 place-items-center rounded-full border lg:hidden"
              style={{ borderColor: "rgba(99,102,241,0.30)", background: isDark ? "rgba(99,102,241,0.12)" : "rgba(99,102,241,0.08)", color: "#6366f1" }}
              aria-label={menuOpen ? "Close navigation" : "Open navigation"}
              onClick={() => setMenuOpen((c) => !c)}
            >
              <motion.span animate={{ rotate: menuOpen ? 90 : 0 }} transition={{ duration: 0.3 }}>
                {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </motion.span>
            </button>
          </div>
        </div>

        <AnimatePresence>
          {menuOpen && (
            <motion.div
              className="page-shell pointer-events-auto mt-3 w-full rounded-[28px] border p-3 backdrop-blur-2xl lg:hidden"
              style={{ borderColor: "rgba(99,102,241,0.25)", background: isDark ? "rgba(10,8,30,0.92)" : "rgba(255,255,255,0.94)" }}
              initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}
            >
              <div className="grid gap-2">
                {navLinks.map((item) => (
                  <a key={item.id} href={`#${item.id}`}
                    className="rounded-2xl px-4 py-3 text-sm font-semibold transition"
                    style={{ color: isDark ? "rgba(255,255,255,0.60)" : "rgba(15,10,40,0.65)" }}
                    onClick={() => setMenuOpen(false)}
                  >
                    {item.label}
                  </a>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* ── MAIN ─────────────────────────────────────────────────────────── */}
      <main className="relative z-20 pb-0 pt-28">

        {/* ════ HERO ══════════════════════════════════════════════════════ */}
        <section id="home" className="section-shell section-divider" aria-labelledby="hero-title">
          <div className="grid w-full grid-cols-1 items-start gap-8 lg:grid-cols-12 lg:gap-12 xl:min-h-[min(82svh,920px)]">
            <div className="flex min-w-0 flex-col gap-5 lg:col-span-7 lg:gap-6">
              <div
                className="inline-flex w-fit items-center gap-2 rounded-full px-4 py-2 text-xs font-bold uppercase tracking-[0.28em]"
                style={{ background: "rgba(99,102,241,0.14)", border: "1.5px solid rgba(99,102,241,0.45)", color: "#6366f1" }}
              >
                <Zap className="h-3.5 w-3.5" />
                {personalDetails.title}
              </div>

              <h1 id="hero-title" className="reveal-item w-full font-[family:var(--font-display)] font-bold tracking-tight">
                <span className="block text-4xl sm:text-5xl xl:text-6xl" style={{ color: mutedTxt }}>Designing systems</span>
                <span className="block text-4xl sm:text-5xl xl:text-6xl" style={{ color: mutedTxt }}>that feel</span>
                <span
                  className="block pb-2 text-5xl sm:text-6xl xl:text-7xl"
                  style={{
                    background: "linear-gradient(135deg,#6366f1 0%,#ec4899 50%,#f59e0b 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  {personalDetails.firstName}
                </span>
              </h1>

              <div className="reveal-item w-full min-w-0">
                <TypewriterText words={rotatingRoles} isDark={isDark} />
              </div>

              <p className="reveal-item max-w-2xl text-base leading-8 sm:text-lg" style={{ color: mutedTxt }}>
                {personalDetails.summary}
              </p>

              <div className="reveal-item flex flex-wrap items-center gap-3">
                <FunkyButton href="#projects" icon={Rocket} accentIdx={0}>Explore projects</FunkyButton>
                <FunkyButton href={personalDetails.resumeUrl} icon={Download} accentIdx={1} variant="outline" external>
                  Download resume
                </FunkyButton>
              </div>

              <div className="reveal-item grid gap-3 sm:grid-cols-3">
                {heroHighlights.map((h, i) => (
                  <motion.div key={h}
                    className="rounded-2xl border p-4 font-semibold text-sm leading-6"
                    style={{ borderColor: `${acc(i).hex}50`, background: isDark ? `rgba(${acc(i).rgb},0.10)` : `rgba(${acc(i).rgb},0.08)`, color: bodyTxt, boxShadow: `3px 3px 0 ${acc(i).hex}60` }}
                    initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.45 + i * 0.1, duration: 0.45 }}
                    whileHover={{ y: -4, scale: 1.02 }}
                  >
                    {h}
                  </motion.div>
                ))}
              </div>

              <div className="reveal-item flex flex-wrap gap-2">
                {heroBadgeList.map((badge, i) => (
                  <motion.span key={badge}
                    className="inline-flex items-center rounded-full border px-3 py-1.5 text-xs font-bold uppercase tracking-[0.22em]"
                    style={{ borderColor: acc(i).hex, background: isDark ? `rgba(${acc(i).rgb},0.12)` : `rgba(${acc(i).rgb},0.08)`, color: acc(i).hex }}
                    whileHover={{ scale: 1.06, y: -2 }}
                  >
                    {badge}
                  </motion.span>
                ))}
              </div>
            </div>

            {/* Hero card */}
            <motion.div
              className="reveal-item w-full min-w-0 max-lg:mt-4 lg:col-span-5 lg:mt-2 flex flex-col items-start"
              initial={{ opacity: 0, y: 26 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.75, delay: 0.2 }}
            >
              <div
                className="relative h-full w-full overflow-hidden rounded-[28px] border p-4 sm:p-5 group cursor-pointer transition-all duration-300 hover:-translate-y-2 hover:scale-[1.01]"
                style={{ borderColor: "rgba(99,102,241,0.35)", background: cardBg, boxShadow: `6px 6px 0 rgba(99,102,241,0.45)`, backdropFilter: "blur(20px)" }}
              >
                <div className="grid gap-4">
                  <div className="relative aspect-[4/5] min-h-[260px] max-h-[min(440px,48vh)] overflow-hidden rounded-[22px] border border-white/10 bg-black/20 sm:aspect-[3/4]">
                    <Image src="/images/hero-card-portrait.jpg" alt="Subhasish — hero portrait" fill sizes="(max-width: 1024px) 100vw, 40vw" className="object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
                    <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
                      <p className="text-xs font-bold uppercase tracking-[0.32em]" style={{ color: acc(0).hex }}>Quick read</p>
                      <h2 className="mt-3 font-[family:var(--font-display)] text-2xl font-bold text-white sm:text-3xl">Subhasish Kumar Sahu</h2>
                      <p className="mt-3 max-w-xl text-sm leading-7 text-white/70">
                        Always shipping: coursework, DS labs, and production-minded side projects in parallel.
                      </p>
                    </div>
                  </div>

                  <div className="rounded-[22px] border p-5" style={{ borderColor: "rgba(99,102,241,0.22)", background: isDark ? "rgba(10,8,30,0.60)" : "rgba(99,102,241,0.05)" }}>
                    <p className="text-[11px] font-bold uppercase tracking-[0.28em]" style={{ color: acc(0).hex }}>Quick stats</p>
                    <dl className="mt-4 grid gap-4">
                      {[
                        { dt: "Degree · term",           dd: "B.Tech CSE · 6th semester · C.V. Raman Global University"           },
                        { dt: "Active training",         dd: "Data Science · Masai + IIT Guwahati + NSDC — 600+ structured hours" },
                        { dt: "Engineering focus",       dd: "RAG systems, evaluation loops, FastAPI services, and React surfaces" },
                      ].map((item) => (
                        <div key={item.dt}>
                          <dt className="text-[11px] font-bold uppercase tracking-[0.2em]" style={{ color: mutedTxt }}>{item.dt}</dt>
                          <dd className="mt-1 text-sm leading-6 font-semibold" style={{ color: bodyTxt }}>{item.dd}</dd>
                        </div>
                      ))}
                    </dl>
                    <p className="mt-6 text-[11px] font-bold uppercase tracking-[0.28em]" style={{ color: acc(1).hex }}>Optimizing for</p>
                    <div className="mt-4 grid gap-3">
                      {[
                        "Summer 2026 internships with strong technical mentorship",
                        "Full-stack AI products that need thoughtful UX",
                        "Teams that value continuous building, not slide decks",
                      ].map((item, i) => (
                        <div key={item} className="rounded-[16px] border px-4 py-3 text-sm font-semibold"
                          style={{ borderColor: `${acc(i).hex}40`, background: isDark ? `rgba(${acc(i).rgb},0.08)` : `rgba(${acc(i).rgb},0.06)`, color: bodyTxt }}>
                          {item}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ════ PROJECTS ══════════════════════════════════════════════════ */}
        <section id="projects" className="section-shell reveal-item section-divider" aria-labelledby="projects-title">
          <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <Eyebrow text="Selective Best Work" accentIdx={0} isDark={isDark} />
              <h2 id="projects-title" className="mt-4 font-[family:var(--font-display)] text-3xl font-bold tracking-tight sm:text-4xl" style={{ color: bodyTxt }}>
                High-signal projects built for speed, clarity, and leverage.
              </h2>
              <p className="mt-4 text-base leading-8" style={{ color: mutedTxt }}>
                These are the builds that best represent how I think: intelligent systems, realtime experiences, and data-first workflows.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {filterOptions.map((option, i) => (
                <button key={option} type="button"
                  className="rounded-full border px-4 py-2 text-sm font-bold transition duration-300 hover:scale-105"
                  style={activeFilter === option
                    ? { borderColor: acc(i).hex, background: isDark ? `rgba(${acc(i).rgb},0.18)` : `rgba(${acc(i).rgb},0.12)`, color: acc(i).hex, boxShadow: `3px 3px 0 ${acc(i).hex}` }
                    : { borderColor: isDark ? "rgba(255,255,255,0.12)" : "rgba(15,10,40,0.15)", background: "transparent", color: mutedTxt }
                  }
                  onClick={() => startFilterTransition(() => setActiveFilter(option))}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>

          {/* Strict 2-col grid */}
          <AnimatePresence mode="popLayout">
            <motion.div key={deferredFilter} className="grid grid-cols-1 gap-6 lg:grid-cols-2"
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }}
            >
              {orderedProjects.map((project, i) => (
                <ProjectCard key={project.id} project={project} accentIdx={i} isDark={isDark} cardBg={cardBg} onOpen={() => setActiveProject(project)} />
              ))}
            </motion.div>
          </AnimatePresence>

          <div className="mt-5 flex items-center gap-4 text-sm font-semibold" style={{ color: mutedTxt }}>
            <span>{visibleProjects.length} focused case {visibleProjects.length === 1 ? "study" : "studies"}</span>
          </div>
        </section>

        {/* ════ ABOUT ═════════════════════════════════════════════════════ */}
        <section id="about" className="section-shell reveal-item section-divider" aria-labelledby="about-title">
          {/* strict 50/50 side-by-side, flex-1 items-stretch */}
          <div className="flex w-full flex-col gap-6 lg:flex-row lg:items-stretch">

            {/* Left */}
            <div className="flex w-full flex-1 flex-col overflow-hidden rounded-[28px] border p-6 sm:p-8 lg:w-1/2"
              style={{ borderColor: "rgba(99,102,241,0.30)", background: cardBg, boxShadow: `6px 6px 0 rgba(99,102,241,0.30)`, backdropFilter: "blur(20px)" }}
            >
              <div className="rounded-[24px] border p-6"
                style={{ borderColor: isDark ? "rgba(255,255,255,0.08)" : "rgba(15,10,40,0.10)", background: isDark ? "rgba(10,8,30,0.50)" : "rgba(99,102,241,0.04)" }}
              >
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <Eyebrow text="About me" accentIdx={0} isDark={isDark} />
                    <h2 id="about-title" className="mt-3 font-[family:var(--font-display)] text-2xl font-bold" style={{ color: bodyTxt }}>
                      Engineer, analyst, and product-minded maker.
                    </h2>
                  </div>
                  <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-[20px] border" style={{ borderColor: "rgba(99,102,241,0.30)" }}>
                    <Image src={photoMoments[0].src} alt={photoMoments[0].alt} fill sizes="80px" className="object-cover" />
                  </div>
                </div>
                <p className="mt-5 text-sm leading-7 font-medium" style={{ color: mutedTxt }}>{personalDetails.shortBio}</p>

                {/* Photo grid */}
                <div className="mt-6 grid grid-cols-[1.15fr_0.85fr] gap-3">
                  <div className="relative min-h-[240px] overflow-hidden rounded-[20px] border" style={{ borderColor: isDark ? "rgba(255,255,255,0.08)" : "rgba(15,10,40,0.10)" }}>
                    <Image src={photoMoments[0].src} alt={photoMoments[0].alt} fill sizes="(max-width: 768px) 100vw, 24vw" className="object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <p className="text-xs font-bold uppercase tracking-[0.28em] text-white">{photoMoments[0].label}</p>
                    </div>
                  </div>
                  <div className="grid gap-3">
                    {photoMoments.slice(1, 3).map((photo) => (
                      <div key={photo.src} className="relative min-h-[114px] overflow-hidden rounded-[18px] border" style={{ borderColor: isDark ? "rgba(255,255,255,0.08)" : "rgba(15,10,40,0.10)" }}>
                        <Image src={photo.src} alt={photo.alt} fill sizes="(max-width: 768px) 100vw, 16vw" className="object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />
                        <div className="absolute bottom-0 left-0 right-0 p-3">
                          <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-white">{photo.label}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  {[
                    { label: "Location",            value: personalDetails.location },
                    { label: "Currently learning",  value: "Advanced DS/ML systems design" },
                    { label: "Best with",           value: "Python, FastAPI, React, MongoDB" },
                    { label: "Work rhythm",         value: "Async-friendly, research-driven, high ownership" },
                  ].map((item, i) => (
                    <div key={item.label} className="rounded-[18px] border p-4"
                      style={{ borderColor: `${acc(i).hex}40`, background: isDark ? `rgba(${acc(i).rgb},0.08)` : `rgba(${acc(i).rgb},0.06)` }}
                    >
                      <p className="text-xs font-bold uppercase tracking-[0.25em]" style={{ color: acc(i).hex }}>{item.label}</p>
                      <p className="mt-2 text-sm leading-6 font-semibold" style={{ color: bodyTxt }}>{item.value}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Specializations */}
              <div className="mt-5 rounded-[24px] border p-5"
                style={{ borderColor: isDark ? "rgba(255,255,255,0.08)" : "rgba(15,10,40,0.10)", background: isDark ? "rgba(10,8,30,0.40)" : "rgba(245,244,255,0.70)" }}
              >
                <Eyebrow text="Specializations" accentIdx={2} isDark={isDark} />
                <div className="mt-4 flex flex-wrap gap-2">
                  {personalDetails.specializations.map((item, i) => (
                    <span key={item} className="inline-flex rounded-full border px-3 py-1.5 text-xs font-bold"
                      style={{ borderColor: acc(i).hex, color: acc(i).hex, background: isDark ? `rgba(${acc(i).rgb},0.10)` : `rgba(${acc(i).rgb},0.08)` }}
                    >
                      {item}
                    </span>
                  ))}
                </div>
                <div className="mt-5 grid gap-3">
                  {specializationVisuals.map((item) => {
                    const Icon = item.icon;
                    const a = acc(item.accentIdx);
                    return (
                      <div key={item.title} className="group relative overflow-hidden rounded-[18px] border p-4 transition hover:scale-[1.02]"
                        style={{ borderColor: `${a.hex}50`, background: isDark ? `rgba(${a.rgb},0.10)` : `rgba(${a.rgb},0.07)`, boxShadow: `3px 3px 0 ${a.hex}60` }}
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <p className="text-sm font-bold" style={{ color: bodyTxt }}>{item.title}</p>
                            <p className="mt-1 text-xs leading-5 font-medium" style={{ color: mutedTxt }}>{item.subtitle}</p>
                          </div>
                          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl border"
                            style={{ borderColor: a.hex, background: `rgba(${a.rgb},0.14)`, color: a.hex }}>
                            <Icon className="h-4 w-4" />
                          </div>
                        </div>
                        <div className="mt-4 flex items-center gap-2">
                          {item.nodes.map((node, ni) => (
                            <div key={node} className="flex items-center gap-2">
                              <span className="rounded-full border px-3 py-1 text-[10px] font-bold uppercase tracking-[0.24em]"
                                style={{ borderColor: `${a.hex}60`, color: a.hex, background: isDark ? `rgba(${a.rgb},0.12)` : `rgba(${a.rgb},0.08)` }}>
                                {node}
                              </span>
                              {ni < item.nodes.length - 1 && <span className="h-px w-5" style={{ background: a.hex }} />}
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Right — Capabilities + Journey, flex-1 items-stretch */}
            <div className="flex w-full flex-1 flex-col gap-6 lg:w-1/2">
              {/* Capabilities */}
              <div className="flex-1 rounded-[28px] border p-6 sm:p-8"
                style={{ borderColor: "rgba(236,72,153,0.30)", background: cardBg, boxShadow: "6px 6px 0 rgba(236,72,153,0.30)", backdropFilter: "blur(20px)" }}
              >
                <Eyebrow text="Capabilities" accentIdx={1} isDark={isDark} />
                <p className="mt-4 text-base leading-8 font-medium" style={{ color: mutedTxt }}>
                  I enjoy the whole stack, but especially the handoff zones: where model behavior becomes product decisions.
                </p>
                <div className="mt-6 grid gap-5">
                  {expertise.map((item, i) => (
                    <div key={item.label}>
                      <div className="flex items-center justify-between gap-3 text-sm">
                        <span className="font-bold" style={{ color: bodyTxt }}>{item.label}</span>
                        <span className="font-['DM_Mono',_monospace] font-bold text-xs" style={{ color: acc(i).hex }}>{item.value}%</span>
                      </div>
                      <div className="mt-2 h-2.5 overflow-hidden rounded-full" style={{ background: isDark ? "rgba(255,255,255,0.08)" : "rgba(15,10,40,0.08)" }}>
                        <motion.div
                          className="h-full rounded-full"
                          style={{ background: `linear-gradient(90deg,${acc(i).hex},${acc((i+1)%6).hex})` }}
                          initial={{ width: 0 }}
                          whileInView={{ width: `${item.value}%` }}
                          viewport={{ once: true, amount: 0.6 }}
                          transition={{ duration: 1, ease: "easeOut" }}
                        />
                      </div>
                      <p className="mt-2 text-sm font-medium" style={{ color: mutedTxt }}>{item.note}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-8">
                  <Eyebrow text="Stack in motion" accentIdx={2} isDark={isDark} />
                  <div className="mt-4 flex flex-wrap gap-2">
                    {techStack.map((item, i) => (
                      <motion.span key={item}
                        className="inline-flex items-center rounded-full border px-4 py-2 text-sm font-bold cursor-default"
                        style={{ borderColor: acc(i).hex, color: acc(i).hex, background: isDark ? `rgba(${acc(i).rgb},0.10)` : `rgba(${acc(i).rgb},0.07)` }}
                        whileHover={{ y: -4, scale: 1.05 }}
                      >
                        {item}
                      </motion.span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Journey */}
              <div className="flex-1 rounded-[28px] border p-6 sm:p-8"
                style={{ borderColor: "rgba(16,185,129,0.30)", background: cardBg, boxShadow: "6px 6px 0 rgba(16,185,129,0.30)", backdropFilter: "blur(20px)" }}
              >
                <div className="relative pl-8">
                  <span className="timeline-line" />
                  <Eyebrow text="Journey" accentIdx={2} isDark={isDark} />
                  <div className="mt-6 grid gap-6">
                    {careerTimeline.map((item, i) => (
                      <motion.div key={`${item.year}-${item.title}`} className="relative"
                        initial={{ opacity: 0, x: 24 }} whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, amount: 0.35 }}
                        transition={{ duration: 0.5, delay: i * 0.06 }}
                      >
                        <span
                          className="timeline-dot absolute -left-[2.1rem] top-1.5"
                          style={{ background: acc(i).hex, boxShadow: `0 0 0 3px ${acc(i).hex}40` }}
                        />
                        <p className="text-xs font-bold uppercase tracking-[0.28em]" style={{ color: acc(i).hex }}>{item.year}</p>
                        <h3 className="mt-2 text-lg font-bold" style={{ color: bodyTxt }}>{item.title}</h3>
                        <p className="mt-1 text-sm font-bold" style={{ color: acc((i+1)%6).hex }}>{item.org}</p>
                        <p className="mt-3 text-sm leading-7 font-medium" style={{ color: mutedTxt }}>{item.body}</p>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ════ ANALYTICS (dynamic import) ════════════════════════════════ */}
        <AnalyticsSection />

        {/* ════ VIBES ══════════════════════════════════════════════════════ */}
        <section id="vibes" className="section-shell reveal-item section-divider" aria-labelledby="vibes-title">
          <div className="grid grid-cols-1 items-stretch gap-6 md:grid-cols-2 xl:grid-cols-3">
            {/* Fun Facts */}
            <div className="flex flex-col overflow-hidden rounded-[28px] border p-6 sm:p-8"
              style={{ borderColor: "rgba(99,102,241,0.30)", background: cardBg, boxShadow: "6px 6px 0 rgba(99,102,241,0.35)", backdropFilter: "blur(20px)" }}
            >
              <Eyebrow text="Fun Facts" accentIdx={0} isDark={isDark} />
              <h2 id="vibes-title" className="mt-4 font-[family:var(--font-display)] text-2xl font-bold tracking-tight" style={{ color: bodyTxt }}>
                Personality, not just process.
              </h2>
              <p className="mt-3 text-base leading-8 font-medium" style={{ color: mutedTxt }}>
                I care a lot about craft, but the human side matters too.
              </p>
              <div className="mt-8 flex flex-1 flex-col rounded-[22px] border p-6"
                style={{ borderColor: isDark ? "rgba(99,102,241,0.20)" : "rgba(99,102,241,0.15)", background: isDark ? "rgba(99,102,241,0.06)" : "rgba(99,102,241,0.04)" }}
              >
                <AnimatePresence mode="wait">
                  <motion.div key={funFacts[funFactIndex].title} className="flex-1"
                    initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -18 }}
                    transition={{ duration: 0.45 }}
                  >
                    <p className="font-['DM_Mono',_monospace] text-xs font-bold uppercase tracking-[0.3em]" style={{ color: "#6366f1" }}>
                      {String(funFactIndex + 1).padStart(2, "0")}
                    </p>
                    <h3 className="mt-4 text-2xl font-bold" style={{ color: bodyTxt }}>{funFacts[funFactIndex].title}</h3>
                    <p className="mt-4 text-sm leading-8 font-medium" style={{ color: mutedTxt }}>{funFacts[funFactIndex].body}</p>
                  </motion.div>
                </AnimatePresence>
                <div className="mt-6 flex items-center justify-between">
                  <div className="flex gap-2">
                    {funFacts.map((fact, i) => (
                      <button key={fact.title} type="button"
                        className="h-2.5 rounded-full transition-all duration-300"
                        style={{ width: i === funFactIndex ? 40 : 10, background: i === funFactIndex ? "#6366f1" : isDark ? "rgba(255,255,255,0.15)" : "rgba(15,10,40,0.15)" }}
                        onClick={() => setFunFactIndex(i)} aria-label={`Fact ${i + 1}`}
                      />
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <RoundIconButton label="Prev" onClick={() => setFunFactIndex((c) => (c - 1 + funFacts.length) % funFacts.length)} accentIdx={0} isDark={isDark}>
                      <ChevronLeft className="h-4 w-4" />
                    </RoundIconButton>
                    <RoundIconButton label="Next" onClick={() => setFunFactIndex((c) => (c + 1) % funFacts.length)} accentIdx={0} isDark={isDark}>
                      <ChevronRight className="h-4 w-4" />
                    </RoundIconButton>
                  </div>
                </div>
              </div>
            </div>

            {/* Middle column */}
            <div className="flex flex-col gap-6">
              <PreferenceCard title="Likes"    items={likes}    tint="likes"    icon={<Heart className="h-5 w-5" />}        isDark={isDark} cardBg={cardBg} accentIdx={0} />
              <PreferenceCard title="Dislikes" items={dislikes} tint="dislikes" icon={<WandSparkles className="h-5 w-5" />} isDark={isDark} cardBg={cardBg} accentIdx={1} />
              <div className="flex flex-1 flex-col rounded-[28px] border p-6 sm:p-8"
                style={{ borderColor: "rgba(245,158,11,0.30)", background: cardBg, boxShadow: "6px 6px 0 rgba(245,158,11,0.30)", backdropFilter: "blur(20px)" }}
              >
                <Eyebrow text="Current energy" accentIdx={3} isDark={isDark} />
                <h3 className="mt-4 text-xl font-bold" style={{ color: bodyTxt }}>Building technical depth with product sensitivity.</h3>
                <div className="mt-3 inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-bold"
                  style={{ borderColor: "rgba(245,158,11,0.40)", background: isDark ? "rgba(245,158,11,0.10)" : "rgba(245,158,11,0.07)", color: "#f59e0b" }}
                >
                  <BriefcaseBusiness className="h-4 w-4" />
                  Open to internships, freelance, and research-driven teams
                </div>
                <div className="mt-5 grid flex-1 items-stretch gap-4 md:grid-cols-3">
                  {[
                    { t: "What excites me",     b: "Shipping interfaces that make complex AI work feel calm and trustworthy." },
                    { t: "What I optimize for", b: "Readable systems, useful metrics, thoughtful UX, and delivery velocity."  },
                    { t: "What I bring",        b: "Analytical thinking, product intuition, and ownership of the messy middle." },
                  ].map((card, i) => (
                    <motion.div key={card.t}
                      className="flex flex-col rounded-[20px] border p-5"
                      style={{ borderColor: `${acc(i+3).hex}40`, background: isDark ? `rgba(${acc(i+3).rgb},0.08)` : `rgba(${acc(i+3).rgb},0.06)` }}
                      whileHover={{ y: -5, scale: 1.02 }}
                    >
                      <p className="text-xs font-bold uppercase tracking-[0.28em]" style={{ color: acc(i+3).hex }}>{card.t}</p>
                      <p className="mt-4 text-sm leading-7 font-medium" style={{ color: mutedTxt }}>{card.b}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right column — photo + coffee */}
            <div className="flex flex-col gap-6">
              {/* Photo carousel */}
              <div className="flex flex-1 flex-col justify-between rounded-[22px] border p-3 sm:p-4"
                style={{ borderColor: isDark ? "rgba(255,255,255,0.08)" : "rgba(15,10,40,0.10)", background: cardBg, backdropFilter: "blur(16px)" }}
              >
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.26em]" style={{ color: mutedTxt }}>Photo snapshot</p>
                    <h3 className="mt-1 text-base font-bold" style={{ color: bodyTxt }}>Personal frame</h3>
                  </div>
                  <div className="flex gap-2">
                    <RoundIconButton label="Prev" onClick={() => setMomentIndex((c) => (c - 1 + instagramMoments.length) % instagramMoments.length)} accentIdx={4} isDark={isDark}>
                      <ChevronLeft className="h-4 w-4" />
                    </RoundIconButton>
                    <RoundIconButton label="Next" onClick={() => setMomentIndex((c) => (c + 1) % instagramMoments.length)} accentIdx={4} isDark={isDark}>
                      <ChevronRight className="h-4 w-4" />
                    </RoundIconButton>
                  </div>
                </div>
                <div className="mt-3 grid flex-1 gap-3 md:grid-cols-[minmax(0,0.55fr)_minmax(0,1fr)]">
                  <div className="flex flex-1 flex-col overflow-hidden rounded-[16px] border" style={{ borderColor: isDark ? "rgba(255,255,255,0.07)" : "rgba(15,10,40,0.08)" }}>
                    <AnimatePresence mode="wait">
                      <motion.div key={instagramMoments[momentIndex].src} className="relative min-h-[160px] flex-1"
                        initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.35 }}
                      >
                        <Image src={instagramMoments[momentIndex].src} alt={instagramMoments[momentIndex].alt} fill sizes="(max-width: 1280px) 45vw, 200px" className="object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                        <div className="absolute left-3 top-3 rounded-full border px-3 py-1 text-[10px] font-bold uppercase tracking-[0.22em] text-white backdrop-blur"
                          style={{ borderColor: "rgba(255,255,255,0.20)", background: "rgba(0,0,0,0.40)" }}>
                          {instagramMoments[momentIndex].stamp}
                        </div>
                      </motion.div>
                    </AnimatePresence>
                  </div>
                  <div className="flex flex-col justify-between rounded-[16px] border p-4"
                    style={{ borderColor: isDark ? "rgba(255,255,255,0.07)" : "rgba(15,10,40,0.08)", background: isDark ? "rgba(255,255,255,0.03)" : "rgba(15,10,40,0.03)" }}
                  >
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-[0.22em]" style={{ color: mutedTxt }}>Caption</p>
                      <p className="mt-2 text-sm leading-7 font-medium" style={{ color: bodyTxt }}>{instagramMoments[momentIndex].caption}</p>
                    </div>
                    <div className="mt-4 flex items-center justify-between gap-2">
                      <div className="flex gap-2">
                        {instagramMoments.map((item, i) => (
                          <button key={item.src} type="button"
                            className="h-2.5 rounded-full transition-all duration-300"
                            style={{ width: i === momentIndex ? 36 : 10, background: i === momentIndex ? "#a855f7" : isDark ? "rgba(255,255,255,0.15)" : "rgba(15,10,40,0.15)" }}
                            onClick={() => setMomentIndex(i)} aria-label={`Photo ${i + 1}`}
                          />
                        ))}
                      </div>
                      <a href={personalDetails.instagramUrl} target="_blank" rel="noreferrer"
                        className="inline-flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-bold transition hover:scale-105"
                        style={{ borderColor: "rgba(168,85,247,0.40)", color: "#a855f7", background: isDark ? "rgba(168,85,247,0.10)" : "rgba(168,85,247,0.07)" }}
                      >
                        <Camera className="h-3.5 w-3.5" />Instagram
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              {/* Coffee */}
              <div className="flex flex-col gap-4">
                <div className="relative min-h-[190px] flex-1 overflow-hidden rounded-[24px] border"
                  style={{ borderColor: "rgba(245,158,11,0.30)" }}>
                  <Image src="/images/coffee-feature.jpg" alt="Coffee" fill sizes="(max-width: 1024px) 100vw, 20vw" className="object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <p className="text-xs font-bold uppercase tracking-[0.28em]" style={{ color: "#f59e0b" }}>Coffee person</p>
                    <p className="mt-2 text-sm font-semibold text-white">Equal parts espresso, systems thinking, and late-night polishing.</p>
                  </div>
                </div>
                <div className="flex flex-col justify-center rounded-[24px] border p-5"
                  style={{ borderColor: "rgba(245,158,11,0.30)", background: cardBg, boxShadow: "4px 4px 0 rgba(245,158,11,0.40)", backdropFilter: "blur(16px)" }}
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <Eyebrow text="Coffee fund" accentIdx={3} isDark={isDark} />
                      <h4 className="mt-3 text-xl font-bold" style={{ color: bodyTxt }}>Fuel the next build if you enjoyed the work.</h4>
                    </div>
                    <div className="rounded-2xl border p-3" style={{ borderColor: "#f59e0b", background: "rgba(245,158,11,0.12)", color: "#f59e0b" }}>
                      <Coffee className="h-5 w-5" />
                    </div>
                  </div>
                  <p className="mt-4 text-sm leading-7 font-medium" style={{ color: mutedTxt }}>
                    I&apos;m definitely a coffee person, so I turned that into a tiny support button instead of pretending I wouldn&apos;t appreciate it.
                  </p>
                  <div className="mt-5 flex flex-wrap gap-3">
                    <FunkyButton href={personalDetails.kofiUrl} icon={Coffee} accentIdx={3} external>Buy me a coffee</FunkyButton>
                    <a href={personalDetails.kofiUrl} target="_blank" rel="noreferrer"
                      className="inline-flex items-center rounded-full border px-5 py-2.5 text-sm font-bold transition hover:scale-105"
                      style={{ borderColor: "rgba(245,158,11,0.40)", color: "#f59e0b", background: isDark ? "rgba(245,158,11,0.08)" : "rgba(245,158,11,0.06)" }}
                    >
                      ko-fi.com/subhasish_33
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ════ CONTACT ════════════════════════════════════════════════════ */}
        <section id="contact" className="section-shell reveal-item" aria-labelledby="contact-title">
          <div className="grid gap-6 lg:grid-cols-[0.94fr_1.06fr]">
            {/* Left */}
            <div className="rounded-[28px] border p-6 sm:p-8"
              style={{ borderColor: "rgba(6,182,212,0.30)", background: cardBg, boxShadow: "6px 6px 0 rgba(6,182,212,0.30)", backdropFilter: "blur(20px)" }}
            >
              <Eyebrow text="Contact" accentIdx={5} isDark={isDark} />
              <h2 id="contact-title" className="mt-4 font-[family:var(--font-display)] text-3xl font-bold tracking-tight" style={{ color: bodyTxt }}>
                Let&apos;s build something that actually stands out.
              </h2>
              <p className="mt-4 text-base leading-8 font-medium" style={{ color: mutedTxt }}>
                If you&apos;re building a product, AI workflow, or internship team that values both technical depth and presentation quality — let&apos;s talk.
              </p>
              <div className="mt-8 grid gap-4">
                <div className="relative min-h-[210px] overflow-hidden rounded-[22px] border" style={{ borderColor: isDark ? "rgba(255,255,255,0.08)" : "rgba(15,10,40,0.10)" }}>
                  <Image src="/images/contact-feature.jpg" alt="Subhasish in a cafe" fill sizes="(max-width: 1024px) 100vw, 25vw" className="object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <p className="text-xs font-bold uppercase tracking-[0.28em]" style={{ color: "#06b6d4" }}>Offline vibe</p>
                    <p className="mt-2 text-sm font-semibold text-white">Calm energy, high ownership, strong bias toward effortless-feeling work.</p>
                  </div>
                </div>
                {socialLinks.map((item, i) => (
                  <a key={item.label} href={item.href}
                    target={item.href.startsWith("http") || item.href.endsWith(".pdf") ? "_blank" : undefined}
                    rel={item.href.startsWith("http") || item.href.endsWith(".pdf") ? "noreferrer" : undefined}
                    className="group rounded-[20px] border p-4 transition hover:-translate-y-1 hover:scale-[1.02]"
                    style={{ borderColor: `${acc(i).hex}40`, background: isDark ? `rgba(${acc(i).rgb},0.07)` : `rgba(${acc(i).rgb},0.05)`, boxShadow: "none" }}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="text-xs font-bold uppercase tracking-[0.25em]" style={{ color: acc(i).hex }}>{item.label}</p>
                        <p className="mt-2 text-sm font-semibold" style={{ color: bodyTxt }}>{item.handle}</p>
                      </div>
                      <span className="grid h-11 w-11 place-items-center rounded-xl border transition group-hover:scale-110"
                        style={{ borderColor: acc(i).hex, background: `rgba(${acc(i).rgb},0.12)`, color: acc(i).hex }}>
                        {item.label === "GitHub"    ? <GitBranch  className="h-4 w-4" /> :
                         item.label === "LinkedIn"  ? <BadgeCheck className="h-4 w-4" /> :
                         item.label === "WhatsApp"  ? <MessageCircle className="h-4 w-4" /> :
                         item.label === "X"         ? <Sparkles   className="h-4 w-4" /> :
                         item.label === "LeetCode"  ? <Trophy     className="h-4 w-4" /> :
                         item.label === "Instagram" ? <Camera     className="h-4 w-4" /> :
                         item.label === "Email"     ? <Mail       className="h-4 w-4" /> :
                         <Download className="h-4 w-4" />}
                      </span>
                    </div>
                  </a>
                ))}
              </div>
            </div>

            {/* Right — form */}
            <div className="relative overflow-hidden rounded-[28px] border p-6 sm:p-8"
              style={{ borderColor: "rgba(99,102,241,0.30)", background: cardBg, boxShadow: "6px 6px 0 rgba(99,102,241,0.30)", backdropFilter: "blur(20px)" }}
            >
              {burst && (
                <div className="pointer-events-none absolute inset-0 z-10">
                  {Array.from({ length: 20 }).map((_, i) => (
                    <motion.span key={i}
                      className="absolute left-1/2 top-1/2 h-2.5 w-2.5 rounded-full"
                      style={{ background: acc(i).hex }}
                      initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
                      animate={{ x: Math.cos((i / 20) * Math.PI * 2) * 180, y: Math.sin((i / 20) * Math.PI * 2) * 180, opacity: 0, scale: 0.1 }}
                      transition={{ duration: 0.8, ease: "easeOut" }}
                    />
                  ))}
                </div>
              )}

              {/* Collab info grid */}
              <div className="grid gap-5">
                <div className="grid gap-4 md:grid-cols-[1.08fr_0.92fr]">
                  <div className="rounded-[22px] border p-5"
                    style={{ borderColor: "rgba(99,102,241,0.20)", background: isDark ? "rgba(99,102,241,0.08)" : "rgba(99,102,241,0.05)" }}>
                    <Eyebrow text="Message" accentIdx={0} isDark={isDark} />
                    <p className="mt-4 text-base leading-8 font-medium" style={{ color: mutedTxt }}>
                      Share a brief, an opportunity, or the kind of product you want to build next.
                    </p>
                  </div>
                  <div className="grid gap-4">
                    <div className="rounded-[20px] border p-4" style={{ borderColor: isDark ? "rgba(255,255,255,0.08)" : "rgba(15,10,40,0.10)", background: isDark ? "rgba(10,8,30,0.40)" : "rgba(255,255,255,0.70)" }}>
                      <p className="text-xs font-bold uppercase tracking-[0.25em]" style={{ color: "#6366f1" }}>Primary</p>
                      <p className="mt-2 text-sm font-semibold" style={{ color: bodyTxt }}>{personalDetails.email}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      {[{ l: "Preferred", v: "Email first" }, { l: "Fast follow-up", v: "WhatsApp" }].map((item, i) => (
                        <div key={item.l} className="rounded-[18px] border p-3"
                          style={{ borderColor: isDark ? "rgba(255,255,255,0.08)" : "rgba(15,10,40,0.10)", background: isDark ? "rgba(10,8,30,0.40)" : "rgba(255,255,255,0.70)" }}>
                          <p className="text-[10px] font-bold uppercase tracking-[0.22em]" style={{ color: acc(i+1).hex }}>{item.l}</p>
                          <p className="mt-2 text-sm font-semibold" style={{ color: bodyTxt }}>{item.v}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="rounded-[22px] border p-5" style={{ borderColor: isDark ? "rgba(255,255,255,0.08)" : "rgba(15,10,40,0.10)", background: isDark ? "rgba(10,8,30,0.35)" : "rgba(255,255,255,0.65)" }}>
                  <div className="grid gap-4 md:grid-cols-3">
                    {[
                      { l: "Best fit",      v: "AI products, dashboards, and full-stack builds"      },
                      { l: "Collab style",  v: "Async-friendly, high ownership, polished delivery"   },
                      { l: "Availability",  v: "Internships, freelance work, and ambitious side projects" },
                    ].map((item, i) => (
                      <div key={item.l} className="rounded-[18px] border p-4"
                        style={{ borderColor: `${acc(i).hex}40`, background: isDark ? `rgba(${acc(i).rgb},0.08)` : `rgba(${acc(i).rgb},0.05)` }}>
                        <p className="text-xs font-bold uppercase tracking-[0.25em]" style={{ color: acc(i).hex }}>{item.l}</p>
                        <p className="mt-3 text-sm leading-6 font-semibold" style={{ color: bodyTxt }}>{item.v}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Form */}
              <form className="mt-5 grid gap-4" action={async (fd) => handleContactSubmit(fd)}>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="input-shell"><input id="name"  name="name"  placeholder=" " aria-label="Your name"  /><label htmlFor="name">Your name</label></div>
                  <div className="input-shell"><input id="email" name="email" type="email" placeholder=" " aria-label="Your email" /><label htmlFor="email">Email address</label></div>
                </div>
                <div className="input-shell"><input id="subject" name="subject" placeholder=" " aria-label="Topic" /><label htmlFor="subject">What is this about?</label></div>
                <div className="input-shell"><textarea id="message" name="message" rows={6} placeholder=" " aria-label="Your message" /><label htmlFor="message">Tell me about the opportunity</label></div>

                <div className="rounded-[20px] border p-4"
                  style={{ borderColor: isDark ? "rgba(255,255,255,0.08)" : "rgba(15,10,40,0.10)", background: isDark ? "rgba(10,8,30,0.35)" : "rgba(255,255,255,0.70)" }}>
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <p className="max-w-2xl text-sm leading-7 font-medium" style={{ color: mutedTxt }}>
                      Prefer direct email?{" "}
                      <a href={`mailto:${personalDetails.email}`} className="font-bold underline underline-offset-4" style={{ color: "#6366f1" }}>
                        {personalDetails.email}
                      </a>
                    </p>
                    <div className="flex flex-wrap gap-3">
                      <FunkyButton type="submit" icon={Sparkles} accentIdx={0} disabled={isSubmitting}>
                        {isSubmitting ? "Sending…" : "Launch email"}
                      </FunkyButton>
                      <FunkyButton href={personalDetails.whatsappUrl} icon={MessageCircle} accentIdx={2} variant="outline" external>
                        WhatsApp
                      </FunkyButton>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </section>
      </main>

      {/* ── FOOTER — zero margin/padding below, page ends here ──────────── */}
      <footer className="section-shell" style={{ paddingBottom: 0, marginBottom: 0 }}>
        <div className="flex flex-col gap-4 rounded-[24px] border px-6 py-6 text-sm sm:flex-row sm:items-center sm:justify-between"
          style={{ borderColor: "rgba(99,102,241,0.22)", background: isDark ? "rgba(10,8,30,0.72)" : "rgba(255,255,255,0.88)", backdropFilter: "blur(20px)", boxShadow: `4px 4px 0 rgba(99,102,241,0.30)` }}
        >
          <div>
            <p className="font-bold" style={{ color: bodyTxt }}>© {new Date().getFullYear()} {personalDetails.name}</p>
            <p className="mt-1 font-medium" style={{ color: mutedTxt }}>
              Built with Next.js, TypeScript, Tailwind CSS, Framer Motion, and a lot of care.
            </p>
          </div>
          <FunkyButton href="#home" icon={ArrowRight} accentIdx={0} variant="outline">Back to top</FunkyButton>
        </div>
      </footer>

      {/* ── PROJECT MODAL ────────────────────────────────────────────────── */}
      <AnimatePresence>
        {activeProject && (
          <ProjectModal key={activeProject.id} project={activeProject} isDark={isDark} cardBg={cardBg} onClose={() => setActiveProject(null)} />
        )}
      </AnimatePresence>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Reusable sub-components
// ─────────────────────────────────────────────────────────────────────────────

function Eyebrow({ text, accentIdx, isDark }: { text: string; accentIdx: number; isDark: boolean }) {
  const a = acc(accentIdx);
  return (
    <div
      className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.28em]"
      style={{ background: isDark ? `rgba(${a.rgb},0.14)` : `rgba(${a.rgb},0.10)`, border: `1.5px solid ${a.hex}60`, color: a.hex }}
    >
      {text}
    </div>
  );
}

function ThemeToggle({ isDark }: { isDark: boolean }) {
  const { setTheme } = useTheme();
  return (
    <button type="button"
      className="grid h-12 w-12 place-items-center rounded-full border transition hover:scale-105"
      style={{ borderColor: "rgba(99,102,241,0.30)", background: isDark ? "rgba(99,102,241,0.12)" : "rgba(99,102,241,0.08)" }}
      aria-label="Toggle theme"
      onClick={() => setTheme(isDark ? "light" : "dark")}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span key={isDark ? "dark" : "light"}
          initial={{ rotate: -16, opacity: 0, scale: 0.8 }}
          animate={{ rotate: 0, opacity: 1, scale: 1 }}
          exit={{ rotate: 16, opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.18 }}
        >
          {isDark
            ? <Sun className="h-5 w-5" style={{ color: "#f59e0b" }} />
            : <Moon className="h-5 w-5" style={{ color: "#6366f1" }} />
          }
        </motion.span>
      </AnimatePresence>
    </button>
  );
}

function TypewriterText({ words, isDark }: { words: string[]; isDark: boolean }) {
  const [wordIndex, setWordIndex] = useState(0);
  const [typed,     setTyped    ] = useState("");
  const [deleting,  setDeleting ] = useState(false);

  useEffect(() => {
    const current = words[wordIndex] ?? "";
    const t = window.setTimeout(() => {
      if (!deleting) {
        const next = current.slice(0, typed.length + 1);
        setTyped(next);
        if (next === current) window.setTimeout(() => setDeleting(true), 900);
      } else {
        const next = current.slice(0, Math.max(typed.length - 1, 0));
        setTyped(next);
        if (!next) { setDeleting(false); setWordIndex((c) => (c + 1) % words.length); }
      }
    }, deleting ? 42 : 70);
    return () => window.clearTimeout(t);
  }, [deleting, typed, wordIndex, words]);

  return (
    <span className="block min-h-[3rem] w-full font-['DM_Mono',_monospace] text-lg font-bold" style={{ color: isDark ? "rgba(255,255,255,0.55)" : "rgba(15,10,40,0.60)" }}>
      {typed}
      <motion.span
        className="ml-1 inline-block h-[1.1em] w-[3px] rounded-sm align-middle"
        style={{ background: "#6366f1" }}
        animate={{ opacity: [1, 0, 1] }}
        transition={{ duration: 0.9, repeat: Infinity }}
      />
    </span>
  );
}

type FunkyButtonProps = {
  children: ReactNode;
  href?: string;
  onClick?: () => void;
  icon?: typeof ArrowRight;
  variant?: "solid" | "outline";
  accentIdx?: number;
  external?: boolean;
  type?: "button" | "submit";
  disabled?: boolean;
  stopPropagation?: boolean;
};

function FunkyButton({
  children, href, onClick, icon: Icon,
  variant = "solid", accentIdx = 0, external = false,
  type = "button", disabled = false, stopPropagation = false,
}: FunkyButtonProps) {
  const a = acc(accentIdx);
  const solidStyle = { background: `linear-gradient(135deg,${a.hex},${acc(accentIdx+1).hex})`, color: "#fff", border: `2px solid ${a.hex}`, boxShadow: `4px 4px 0 ${a.hex}` };
  const outlineStyle = { background: "transparent", color: a.hex, border: `2px solid ${a.hex}`, boxShadow: `3px 3px 0 ${a.hex}` };
  const style = variant === "solid" ? solidStyle : outlineStyle;

  const classes = "relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-full px-6 py-3 text-sm font-bold transition-all duration-200 focus:outline-none disabled:cursor-not-allowed disabled:opacity-60 hover:scale-105 hover:-translate-y-0.5 active:scale-[0.98]";

  const handleClick = (e: React.MouseEvent<HTMLElement>) => {
    if (stopPropagation) e.stopPropagation();
    if (disabled) { e.preventDefault(); return; }
    onClick?.();
  };

  const inner = <><span>{children}</span>{Icon && <Icon className="h-4 w-4" />}</>;

  if (href) {
    return (
      <motion.a href={href} target={external || href.startsWith("http") ? "_blank" : undefined}
        rel={external || href.startsWith("http") ? "noreferrer" : undefined}
        className={classes} style={style} onClick={handleClick} whileTap={{ scale: 0.97 }}>
        {inner}
      </motion.a>
    );
  }
  return (
    <motion.button type={type} className={classes} style={style} onClick={handleClick} disabled={disabled} whileTap={{ scale: 0.97 }}>
      {inner}
    </motion.button>
  );
}

function RoundIconButton({
  children, label, onClick, accentIdx, isDark,
}: {
  children: ReactNode; label: string; onClick: () => void; accentIdx: number; isDark: boolean;
}) {
  const a = acc(accentIdx);
  return (
    <button type="button"
      className="grid h-11 w-11 place-items-center rounded-full border font-bold transition hover:scale-110 hover:-translate-y-0.5"
      style={{ borderColor: a.hex, background: isDark ? `rgba(${a.rgb},0.12)` : `rgba(${a.rgb},0.08)`, color: a.hex }}
      aria-label={label} onClick={onClick}
    >
      {children}
    </button>
  );
}

function ProjectCard({
  project, accentIdx, isDark, cardBg, onOpen,
}: {
  project: Project; accentIdx: number; isDark: boolean; cardBg: string; onOpen: () => void;
}) {
  const [ready, setReady] = useState(false);
  const a = acc(accentIdx);

  useEffect(() => {
    const t = window.setTimeout(() => setReady(true), 420);
    return () => window.clearTimeout(t);
  }, []);

  return (
    <motion.article
      layout
      className="group relative min-h-[420px] cursor-pointer overflow-hidden rounded-[28px] border p-5 transition-[transform,box-shadow] duration-300 sm:p-6"
      style={{
        borderColor: a.hex,
        background: cardBg,
        boxShadow: `6px 6px 0 ${a.hex}`,
        backdropFilter: "blur(20px)",
      }}
      whileHover={{ y: -8, scale: 1.02, boxShadow: `8px 8px 0 ${a.hex}` }}
      transition={{ type: "tween", duration: 0.25, ease: "easeOut" }}
      onClick={onOpen}
      onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onOpen(); } }}
      tabIndex={0} role="button"
      aria-label={`Open case study for ${project.title}`}
    >
      {/* top glint */}
      <div className="absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-white/60 to-transparent opacity-0 transition duration-300 group-hover:opacity-100" aria-hidden />

      <div className="relative z-10 flex h-full flex-col">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="font-['DM_Mono',_monospace] text-xs font-bold uppercase tracking-[0.32em]" style={{ color: a.hex }}>
              {project.eyebrow}
            </p>
            <h3 className="mt-3 text-2xl font-bold" style={{ color: isDark ? "#fff" : "#0f0a28" }}>{project.title}</h3>
          </div>
          <span className="rounded-full border px-3 py-1 text-xs font-bold uppercase tracking-[0.26em]"
            style={{ borderColor: a.hex, color: a.hex, background: isDark ? `rgba(${a.rgb},0.12)` : `rgba(${a.rgb},0.08)` }}>
            {project.category}
          </span>
        </div>

        <div className="relative mt-6 h-[205px] overflow-hidden rounded-[20px] border" style={{ borderColor: isDark ? "rgba(255,255,255,0.08)" : "rgba(15,10,40,0.10)" }}>
          {!ready && <div className="skeleton-shimmer absolute inset-0" />}
          <Image src={buildProjectPreview(project, 0)} alt={`${project.title} preview`} fill unoptimized
            sizes="(max-width: 1024px) 100vw, 60vw"
            className={cn("object-cover transition duration-500", ready ? "opacity-100 group-hover:scale-105" : "opacity-0")}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <p className="text-sm font-semibold text-white/90">{project.longDescription}</p>
          </div>
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          {project.metrics.map((metric, i) => (
            <div key={metric.label} className="rounded-[18px] border px-4 py-3"
              style={{ borderColor: `${acc(i).hex}50`, background: isDark ? `rgba(${acc(i).rgb},0.08)` : `rgba(${acc(i).rgb},0.06)` }}>
              <p className="text-xs font-bold uppercase tracking-[0.24em]" style={{ color: acc(i).hex }}>{metric.label}</p>
              <p className="mt-2 text-sm font-bold" style={{ color: isDark ? "#fff" : "#0f0a28" }}>{metric.value}</p>
            </div>
          ))}
        </div>

        <p className="mt-5 text-sm leading-7 font-medium" style={{ color: isDark ? "rgba(255,255,255,0.50)" : "rgba(15,10,40,0.55)" }}>{project.description}</p>

        <div className="mt-5 flex flex-wrap gap-2">
          {project.tech.map((item, i) => (
            <span key={item} className="rounded-full border px-3 py-1.5 text-xs font-bold"
              style={{ borderColor: `${acc(i).hex}50`, color: acc(i).hex, background: isDark ? `rgba(${acc(i).rgb},0.08)` : `rgba(${acc(i).rgb},0.06)` }}>
              {item}
            </span>
          ))}
        </div>

        <div className="mt-auto flex flex-wrap gap-3 pt-6">
          <FunkyButton href={project.primaryCta.href} icon={ExternalLink} accentIdx={accentIdx} external={project.primaryCta.href.startsWith("http")} stopPropagation>
            {project.primaryCta.label}
          </FunkyButton>
          <FunkyButton href={project.secondaryCta.href} icon={ArrowRight} accentIdx={(accentIdx+1)%6} variant="outline" external={project.secondaryCta.href.startsWith("http")} stopPropagation>
            {project.secondaryCta.label}
          </FunkyButton>
        </div>
      </div>
    </motion.article>
  );
}

function ProjectModal({ project, isDark, cardBg, onClose }: { project: Project; isDark: boolean; cardBg: string; onClose: () => void }) {
  const [slideIndex, setSlideIndex] = useState(0);
  const slide = project.gallery[slideIndex];
  const a = acc(0);
  const bodyTxt = isDark ? "#fff" : "#0f0a28";
  const mutedTxt = isDark ? "rgba(255,255,255,0.45)" : "rgba(15,10,40,0.55)";

  return (
    <motion.div
      className="fixed inset-0 z-[90] flex items-center justify-center bg-black/75 px-4 py-8 backdrop-blur-xl"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      onClick={onClose} aria-modal="true" role="dialog" aria-label={`${project.title} case study`}
    >
      <motion.div
        className="relative max-h-[90vh] w-full max-w-6xl overflow-auto rounded-[32px] border p-6 sm:p-8"
        style={{ borderColor: a.hex, background: cardBg, boxShadow: `8px 8px 0 ${a.hex}`, backdropFilter: "blur(24px)" }}
        initial={{ opacity: 0, y: 24, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 24, scale: 0.96 }}
        onClick={(e) => e.stopPropagation()}
      >
        <button type="button"
          className="absolute right-4 top-4 grid h-11 w-11 place-items-center rounded-full border font-bold transition hover:scale-110"
          style={{ borderColor: a.hex, background: isDark ? "rgba(99,102,241,0.12)" : "rgba(99,102,241,0.08)", color: a.hex }}
          onClick={onClose} aria-label="Close">
          <X className="h-4 w-4" />
        </button>

        <div className="grid gap-8 xl:grid-cols-[1.06fr_0.94fr]">
          <div>
            <p className="font-['DM_Mono',_monospace] text-xs font-bold uppercase tracking-[0.32em]" style={{ color: a.hex }}>{project.eyebrow}</p>
            <h3 className="mt-3 font-[family:var(--font-display)] text-4xl font-bold" style={{ color: bodyTxt }}>{project.title}</h3>
            <p className="mt-5 max-w-2xl text-base leading-8 font-medium" style={{ color: mutedTxt }}>{project.longDescription}</p>

            <div className="relative mt-8 overflow-hidden rounded-[24px] border" style={{ borderColor: isDark ? "rgba(255,255,255,0.08)" : "rgba(15,10,40,0.10)" }}>
              <div className="relative h-[340px] sm:h-[420px]">
                <Image src={buildProjectPreview(project, slideIndex)} alt={`${project.title} slide ${slideIndex + 1}`} fill unoptimized
                  sizes="(max-width: 1280px) 100vw, 50vw" className="object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <p className="text-xs font-bold uppercase tracking-[0.32em]" style={{ color: a.hex }}>{slide?.subtitle}</p>
                  <h4 className="mt-2 text-2xl font-bold text-white">{slide?.title}</h4>
                  <p className="mt-3 max-w-xl text-sm leading-7 text-white/80">{slide?.detail}</p>
                </div>
              </div>
              <div className="flex items-center justify-between gap-4 border-t px-4 py-4" style={{ borderColor: isDark ? "rgba(255,255,255,0.07)" : "rgba(15,10,40,0.08)" }}>
                <div className="flex gap-2">
                  {project.gallery.map((entry, i) => (
                    <button key={entry.title} type="button"
                      className="h-2.5 rounded-full transition-all duration-300"
                      style={{ width: i === slideIndex ? 40 : 10, background: i === slideIndex ? a.hex : isDark ? "rgba(255,255,255,0.15)" : "rgba(15,10,40,0.15)" }}
                      onClick={() => setSlideIndex(i)} aria-label={`Slide ${i + 1}`}
                    />
                  ))}
                </div>
                <div className="flex gap-2">
                  <RoundIconButton label="Prev" onClick={() => setSlideIndex((c) => (c - 1 + project.gallery.length) % project.gallery.length)} accentIdx={0} isDark={isDark}>
                    <ChevronLeft className="h-4 w-4" />
                  </RoundIconButton>
                  <RoundIconButton label="Next" onClick={() => setSlideIndex((c) => (c + 1) % project.gallery.length)} accentIdx={0} isDark={isDark}>
                    <ChevronRight className="h-4 w-4" />
                  </RoundIconButton>
                </div>
              </div>
            </div>
          </div>

          <div className="grid gap-6">
            <div className="rounded-[22px] border p-6" style={{ borderColor: `${acc(1).hex}40`, background: isDark ? `rgba(${acc(1).rgb},0.08)` : `rgba(${acc(1).rgb},0.05)` }}>
              <p className="text-xs font-bold uppercase tracking-[0.28em]" style={{ color: acc(1).hex }}>Impact</p>
              <div className="mt-4 grid gap-3">
                {project.impact.map((item, i) => (
                  <div key={item} className="rounded-[18px] border p-4 text-sm leading-7 font-medium"
                    style={{ borderColor: `${acc(i).hex}40`, color: bodyTxt, background: isDark ? `rgba(${acc(i).rgb},0.07)` : `rgba(${acc(i).rgb},0.05)` }}>
                    {item}
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-[22px] border p-6" style={{ borderColor: `${acc(2).hex}40`, background: isDark ? `rgba(${acc(2).rgb},0.07)` : `rgba(${acc(2).rgb},0.04)` }}>
              <p className="text-xs font-bold uppercase tracking-[0.28em]" style={{ color: acc(2).hex }}>Tech stack</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {project.tech.map((item, i) => (
                  <span key={item} className="rounded-full border px-3 py-2 text-xs font-bold"
                    style={{ borderColor: `${acc(i).hex}50`, color: acc(i).hex, background: isDark ? `rgba(${acc(i).rgb},0.10)` : `rgba(${acc(i).rgb},0.07)` }}>
                    {item}
                  </span>
                ))}
              </div>
            </div>
            <div className="rounded-[22px] border p-6" style={{ borderColor: isDark ? "rgba(255,255,255,0.08)" : "rgba(15,10,40,0.10)", background: isDark ? "rgba(10,8,30,0.40)" : "rgba(255,255,255,0.70)" }}>
              <div className="flex flex-wrap gap-3">
                <FunkyButton href={project.primaryCta.href} icon={GitBranch} accentIdx={0} variant="outline" external={project.primaryCta.href.startsWith("http")}>
                  {project.primaryCta.label}
                </FunkyButton>
                <FunkyButton href={project.secondaryCta.href} icon={Mail} accentIdx={1} variant="outline" external={project.secondaryCta.href.startsWith("http")}>
                  {project.secondaryCta.label}
                </FunkyButton>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

function PreferenceCard({
  title, items, tint, icon, isDark, cardBg, accentIdx,
}: {
  title: string; items: string[]; tint: "likes" | "dislikes"; icon: ReactNode;
  isDark: boolean; cardBg: string; accentIdx: number;
}) {
  const a = acc(accentIdx);
  const bodyTxt = isDark ? "#fff" : "#0f0a28";
  const mutedTxt = isDark ? "rgba(255,255,255,0.45)" : "rgba(15,10,40,0.55)";
  return (
    <div className="rounded-[28px] border p-6"
      style={{ borderColor: a.hex, background: cardBg, boxShadow: `5px 5px 0 ${a.hex}`, backdropFilter: "blur(20px)" }}>
      <div className="flex items-center gap-3">
        <span className="grid h-11 w-11 place-items-center rounded-xl border" style={{ borderColor: a.hex, background: `rgba(${a.rgb},0.14)`, color: a.hex }}>
          {icon}
        </span>
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.26em]" style={{ color: a.hex }}>{title}</p>
          <h3 className="mt-1 text-xl font-bold" style={{ color: bodyTxt }}>
            {title === "Likes" ? "Things I naturally lean toward" : "Things I push back against"}
          </h3>
        </div>
      </div>
      <div className="mt-6 grid gap-3">
        {items.map((item, i) => (
          <motion.div key={item} className="rounded-[18px] border px-4 py-3 text-sm leading-7 font-semibold"
            style={{ borderColor: `${acc(i).hex}40`, color: bodyTxt, background: isDark ? `rgba(${acc(i).rgb},0.08)` : `rgba(${acc(i).rgb},0.05)` }}
            initial={{ opacity: 0, x: tint === "likes" ? -16 : 16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.38, delay: i * 0.05 }}
          >
            {item}
          </motion.div>
        ))}
      </div>
      <p className="sr-only" style={{ color: mutedTxt }} />
    </div>
  );
}

function LoadingScreen({ progress, isDark }: { progress: number; isDark: boolean }) {
  return (
    <motion.div className="fixed inset-0 z-[100] flex items-center justify-center px-4"
      style={{ background: isDark ? "#060412" : "#f5f4ff" }}
      initial={{ opacity: 1 }} exit={{ opacity: 0, transition: { duration: 0.45 } }}
    >
      <div className="max-w-lg text-center">
        <p className="font-['DM_Mono',_monospace] text-xs font-bold uppercase tracking-[0.44em]" style={{ color: "#6366f1" }}>
          Booting portfolio experience
        </p>
        <h2 className="mt-6 font-[family:var(--font-display)] text-4xl font-bold sm:text-5xl"
          style={{ background: "linear-gradient(135deg,#6366f1,#ec4899,#f59e0b)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}
        >
          {personalDetails.firstName}.exe
        </h2>
        <div className="mt-8 h-3 overflow-hidden rounded-full border" style={{ borderColor: "rgba(99,102,241,0.30)", background: isDark ? "rgba(99,102,241,0.10)" : "rgba(99,102,241,0.08)" }}>
          <motion.div className="h-full rounded-full" style={{ background: "linear-gradient(90deg,#6366f1,#ec4899,#f59e0b)" }} animate={{ width: `${progress}%` }} />
        </div>
        <div className="mt-4 flex items-center justify-between text-sm font-semibold" style={{ color: isDark ? "rgba(255,255,255,0.40)" : "rgba(15,10,40,0.45)" }}>
          <span>Loading sections, motion, and content layers</span>
          <span className="font-['DM_Mono',_monospace]" style={{ color: "#6366f1" }}>{progress}%</span>
        </div>
      </div>
    </motion.div>
  );
}

function ToastBanner({ toast, isDark }: { toast: ToastState; isDark: boolean }) {
  const accentHex = toast.tone === "secret" ? "#a855f7" : toast.tone === "success" ? "#10b981" : "#6366f1";
  return (
    <motion.div className="fixed right-4 top-20 z-[95] w-[min(92vw,360px)]"
      initial={{ opacity: 0, x: 28, y: -8 }} animate={{ opacity: 1, x: 0, y: 0 }} exit={{ opacity: 0, x: 28, y: -8 }}
    >
      <div className="rounded-[22px] border px-5 py-4 backdrop-blur-2xl"
        style={{ borderColor: accentHex, background: isDark ? "rgba(10,8,30,0.94)" : "rgba(255,255,255,0.96)", boxShadow: `4px 4px 0 ${accentHex}` }}>
        <p className="font-bold" style={{ color: accentHex }}>{toast.title}</p>
        <p className="mt-2 text-sm leading-6 font-medium" style={{ color: isDark ? "rgba(255,255,255,0.55)" : "rgba(15,10,40,0.60)" }}>{toast.body}</p>
      </div>
    </motion.div>
  );
}

function buildProjectPreview(project: Project, slideIndex: number) {
  const slide = project.gallery[slideIndex] ?? project.gallery[0];
  if (slide?.imageSrc) return slide.imageSrc;

  // Punchy gradient background using project palette or accent fallback
  const c1 = project.palette?.[0] ?? "#6366f1";
  const c2 = project.palette?.[1] ?? "#ec4899";

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="1000" viewBox="0 0 1600 1000">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${c1}" stop-opacity="0.18"/>
      <stop offset="100%" stop-color="${c2}" stop-opacity="0.14"/>
    </linearGradient>
  </defs>
  <rect width="1600" height="1000" fill="#060412"/>
  <rect width="1600" height="1000" fill="url(#bg)"/>
  <circle cx="300" cy="280" r="260" fill="${c1}" opacity="0.18"/>
  <circle cx="1280" cy="760" r="260" fill="${c2}" opacity="0.16"/>
  <rect x="96" y="92" width="1408" height="816" rx="40" fill="rgba(10,8,30,0.72)" stroke="${c1}" stroke-width="2" stroke-opacity="0.35"/>
  <rect x="144" y="146" width="900" height="486" rx="28" fill="rgba(255,255,255,0.025)" stroke="rgba(255,255,255,0.07)" stroke-width="1"/>
  <rect x="1090" y="146" width="362" height="180" rx="22" fill="rgba(255,255,255,0.03)" stroke="${c1}" stroke-width="1" stroke-opacity="0.25"/>
  <rect x="1090" y="352" width="362" height="256" rx="22" fill="rgba(255,255,255,0.025)"/>
  <rect x="1090" y="634" width="362" height="168" rx="22" fill="rgba(255,255,255,0.03)"/>
  <text x="160" y="748" fill="${c1}" font-family="Helvetica,Arial,sans-serif" font-size="22" letter-spacing="9" font-weight="700">CASE STUDY</text>
  <text x="160" y="818" fill="white" font-family="Helvetica,Arial,sans-serif" font-size="66" font-weight="800">${project.title}</text>
  <text x="160" y="872" fill="rgba(255,255,255,0.60)" font-family="Helvetica,Arial,sans-serif" font-size="30">${slide?.title ?? ""}</text>
  <text x="1120" y="208" fill="${c1}" font-family="Helvetica,Arial,sans-serif" font-size="20" letter-spacing="5" font-weight="700">MODULE</text>
  <text x="1120" y="265" fill="white" font-family="Helvetica,Arial,sans-serif" font-size="36" font-weight="800">${slide?.subtitle ?? ""}</text>
  <text x="1120" y="422" fill="rgba(255,255,255,0.50)" font-family="Helvetica,Arial,sans-serif" font-size="24">${project.metrics[0]?.label ?? ""}</text>
  <text x="1120" y="475" fill="white" font-family="Helvetica,Arial,sans-serif" font-size="46" font-weight="800">${project.metrics[0]?.value ?? ""}</text>
  <text x="1120" y="715" fill="rgba(255,255,255,0.45)" font-family="Helvetica,Arial,sans-serif" font-size="24">${project.tech.slice(0, 3).join(" · ")}</text>
</svg>`;

  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}