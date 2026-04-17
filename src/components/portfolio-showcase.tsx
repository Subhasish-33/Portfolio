"use client";

import {
  useDeferredValue,
  useEffect,
  useRef,
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

// ─── Lazy analytics ───────────────────────────────────────────────────────────
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

// ─── Nav config ────────────────────────────────────────────────────────────────
const navLinks = [
  { id: "home",      label: "Home",      icon: Home          },
  { id: "about",     label: "About",     icon: UserRound     },
  { id: "projects",  label: "Projects",  icon: PanelsTopLeft },
  { id: "analytics", label: "Analytics", icon: BrainCircuit  },
  { id: "contact",   label: "Contact",   icon: Mail          },
];

const specializationVisuals = [
  {
    title: "AI Systems",
    subtitle: "Inference, agents, and evaluation",
    icon: BrainCircuit,
    accent: "from-cyan-400/30 via-sky-400/18 to-transparent",
    nodes: ["Model", "Prompt", "Eval"],
  },
  {
    title: "RAG Pipelines",
    subtitle: "Retrieve, rank, ground, answer",
    icon: GitBranch,
    accent: "from-fuchsia-400/26 via-violet-400/18 to-transparent",
    nodes: ["Chunks", "Search", "Context"],
  },
  {
    title: "Data Intelligence",
    subtitle: "Signals, trends, and explainable dashboards",
    icon: Sparkles,
    accent: "from-emerald-400/24 via-teal-400/16 to-transparent",
    nodes: ["Heatmaps", "KPIs", "Forecasts"],
  },
];

type ToastState = {
  title: string;
  body: string;
  tone?: "success" | "error";
};

// ─── Main component ────────────────────────────────────────────────────────────
export function PortfolioShowcase() {
  const [activeFilter, setActiveFilter] =
    useState<(typeof filterOptions)[number]>("All");
  const deferredFilter = useDeferredValue(activeFilter);
  const [activeProject,  setActiveProject ] = useState<Project | null>(null);
  const [activeSection,  setActiveSection ] = useState("home");
  const [menuOpen,       setMenuOpen      ] = useState(false);
  const [toast,          setToast         ] = useState<ToastState | null>(null);
  const [secretMode,     setSecretMode    ] = useState(false);
  const [funFactIndex,   setFunFactIndex  ] = useState(0);
  const [momentIndex,    setMomentIndex   ] = useState(0);
  const [, startFilterTransition]           = useTransition();
  const [isSubmitting,   setIsSubmitting  ] = useState(false);
  const [burst,          setBurst         ] = useState(false);
  const [scrolling,      setScrolling     ] = useState(false);

  const { scrollYProgress } = useScroll();
  const progressScale = useSpring(scrollYProgress, {
    stiffness: 110,
    damping: 26,
    restDelta: 0.001,
  });

  const visibleProjects =
    deferredFilter === "All"
      ? projects
      : projects.filter((p) => p.category === deferredFilter);

  // ── Fun fact ticker ──────────────────────────────────────────────────────────
  useEffect(() => {
    const t = window.setInterval(
      () => setFunFactIndex((c) => (c + 1) % funFacts.length),
      5000,
    );
    return () => window.clearInterval(t);
  }, []);

  // ── Moment ticker ────────────────────────────────────────────────────────────
  useEffect(() => {
    const t = window.setInterval(
      () => setMomentIndex((c) => (c + 1) % instagramMoments.length),
      4200,
    );
    return () => window.clearInterval(t);
  }, []);

  // ── Toast auto-dismiss ───────────────────────────────────────────────────────
  useEffect(() => {
    if (!toast) return;
    const t = window.setTimeout(() => setToast(null), 3500);
    return () => window.clearTimeout(t);
  }, [toast]);

  // ── Scroll header ────────────────────────────────────────────────────────────
  useEffect(() => {
    const fn = () => setScrolling(window.scrollY > 20);
    fn();
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  // ── Section spy ──────────────────────────────────────────────────────────────
  useEffect(() => {
    const sections = Array.from(document.querySelectorAll("section[id]"));
    const obs = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActiveSection(visible.target.id);
      },
      { threshold: [0.2, 0.45, 0.7], rootMargin: "-20% 0px -20% 0px" },
    );
    sections.forEach((s) => obs.observe(s));
    return () => obs.disconnect();
  }, []);

  // ── Konami code ───────────────────────────────────────────────────────────────
  useEffect(() => {
    const seq = ["ArrowUp","ArrowUp","ArrowDown","ArrowDown","ArrowLeft","ArrowRight","ArrowLeft","ArrowRight","b","a"];
    let idx = 0;
    const fn = (e: KeyboardEvent) => {
      const k = e.key.length === 1 ? e.key.toLowerCase() : e.key;
      idx = k === seq[idx] ? idx + 1 : k === seq[0] ? 1 : 0;
      if (idx === seq.length) {
        setSecretMode((c) => !c);
        setToast({ title: "Konami code accepted", body: "Secret mode toggled." });
        idx = 0;
      }
    };
    window.addEventListener("keydown", fn);
    return () => window.removeEventListener("keydown", fn);
  }, []);

  // ── Escape to close modal ────────────────────────────────────────────────────
  useEffect(() => {
    if (!activeProject) return;
    const fn = (e: KeyboardEvent) => { if (e.key === "Escape") setActiveProject(null); };
    window.addEventListener("keydown", fn);
    return () => window.removeEventListener("keydown", fn);
  }, [activeProject]);

  // ── Contact submit — honest mailto, no fake delay ────────────────────────────
  const handleContactSubmit = (formData: FormData) => {
    const name    = String(formData.get("name")    ?? "").trim();
    const email   = String(formData.get("email")   ?? "").trim();
    const subject = String(formData.get("subject") ?? "").trim();
    const message = String(formData.get("message") ?? "").trim();

    if (!name || !email || !message) {
      setToast({ title: "A few fields are empty", body: "Name, email, and message are required.", tone: "error" });
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setToast({ title: "That email looks off", body: "Please double-check the format.", tone: "error" });
      return;
    }

    setIsSubmitting(true);
    setBurst(true);

    const mailSubject = encodeURIComponent(subject || `Portfolio enquiry from ${name}`);
    const mailBody    = encodeURIComponent(`${message}\n\nFrom: ${name}\nEmail: ${email}`);

    // Open mailto immediately — no artificial delay
    window.location.href = `mailto:${personalDetails.email}?subject=${mailSubject}&body=${mailBody}`;

    setIsSubmitting(false);
    setBurst(false);
    setToast({
      title: "Mail client opened",
      body: "Your message is pre-filled — just hit send.",
      tone: "success",
    });
  };

  return (
    <div className="noise-overlay relative min-h-screen">
      {/* Toast */}
      <AnimatePresence>
        {toast ? <ToastBanner toast={toast} /> : null}
      </AnimatePresence>

      {/* Secret mode rain */}
      {secretMode ? (
        <div className="pointer-events-none fixed inset-0 z-10 opacity-45 mix-blend-screen" aria-hidden="true">
          {Array.from({ length: 14 }).map((_, i) => (
            <div
              key={i}
              className="absolute top-0 h-full font-[family:var(--font-mono)] text-[10px] tracking-[0.3em] text-emerald-300/60"
              style={{ left: `${i * 7.2}%`, animation: `float ${4 + (i % 3)}s ease-in-out infinite` }}
            >
              {`01010110\nRAG\nPPO\nFASTAPI\nREACT\nDATA\nVECTOR\n${i}`}
            </div>
          ))}
        </div>
      ) : null}

      {/* Scroll progress */}
      <motion.div
        className="fixed inset-x-0 top-0 z-[70] h-[2px] origin-left bg-gradient-to-r from-cyan-400 via-fuchsia-400 to-emerald-300"
        style={{ scaleX: progressScale }}
        aria-hidden="true"
      />

      {/* ── HEADER — sticky (not fixed, to avoid stacking-context mobile bugs) ── */}
      <header
        className={cn(
          "sticky top-0 left-0 right-0 z-50 transition-all duration-300",
          scrolling ? "pt-3" : "pt-5",
        )}
      >
        <div
          className={cn(
            "page-shell flex w-full items-center justify-between gap-2 rounded-full border px-3 py-2 transition-all duration-300",
            scrolling
              ? "border-[rgba(114,52,128,0.14)] bg-[rgba(255,255,243,0.90)] shadow-[0_8px_30px_rgba(114,52,128,0.10)] backdrop-blur-xl dark:border-white/10 dark:bg-[rgba(7,12,25,0.78)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.25)]"
              : "border-transparent bg-transparent",
          )}
        >
          {/* Logo */}
          <a
            href="#home"
            className="inline-flex shrink-0 items-center gap-2 rounded-full px-2 py-1.5 sm:gap-3 sm:px-3 sm:py-2"
            aria-label="Scroll to home"
          >
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-gradient-to-br from-cyan-300/30 to-fuchsia-400/25 text-sm font-semibold text-white sm:h-10 sm:w-10">
              SK
            </span>
            <span className="hidden sm:block">
              <span className="block font-[family:var(--font-display)] text-sm font-semibold">
                {personalDetails.firstName}
              </span>
              <span className="block text-xs text-[var(--muted)]">AI × Full Stack</span>
            </span>
          </a>

          {/* Desktop nav */}
          <LayoutGroup id="site-nav">
            <nav
              className="relative hidden items-center gap-0.5 rounded-full border border-[rgba(114,52,128,0.14)] bg-[rgba(255,255,243,0.72)] p-1.5 backdrop-blur-lg dark:border-white/8 dark:bg-white/5 lg:flex"
              aria-label="Primary navigation"
            >
              {navLinks.map((item) => {
                const Icon   = item.icon;
                const active = activeSection === item.id;
                return (
                  <a
                    key={item.id}
                    href={`#${item.id}`}
                    className={cn(
                      "relative inline-flex items-center rounded-full px-4 py-2 text-sm transition-colors duration-300",
                      active
                        ? "text-slate-950"
                        : "text-[var(--muted-strong)] hover:text-[var(--foreground)] dark:text-[var(--muted)] dark:hover:text-white",
                    )}
                    aria-current={active ? "page" : undefined}
                  >
                    {active ? (
                      <motion.span
                        layoutId="nav-active-pill"
                        className="absolute inset-0 rounded-full bg-white shadow-[0_8px_22px_rgba(114,52,128,0.14)] dark:bg-white"
                        transition={{ type: "spring", stiffness: 420, damping: 32 }}
                        aria-hidden
                      />
                    ) : null}
                    <span className="relative z-10 inline-flex items-center gap-2">
                      <Icon className="h-4 w-4" aria-hidden="true" />
                      {item.label}
                    </span>
                  </a>
                );
              })}
            </nav>
          </LayoutGroup>

          {/* Right: theme + mobile hamburger */}
          <div className="flex shrink-0 items-center gap-2">
            <ThemeToggle />
            <button
              type="button"
              className="glass-panel grid h-10 w-10 place-items-center lg:hidden"
              aria-label={menuOpen ? "Close navigation" : "Open navigation"}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              onClick={() => setMenuOpen((c) => !c)}
            >
              <motion.span
                animate={{ rotate: menuOpen ? 90 : 0 }}
                transition={{ duration: 0.3 }}
                aria-hidden="true"
              >
                {menuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
              </motion.span>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {menuOpen ? (
            <motion.div
              id="mobile-menu"
              role="navigation"
              aria-label="Mobile navigation"
              className="page-shell mt-3 w-full rounded-[28px] border border-[rgba(114,52,128,0.14)] bg-[rgba(255,255,243,0.96)] p-3 backdrop-blur-2xl dark:border-white/10 dark:bg-[rgba(7,12,25,0.92)] lg:hidden"
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
            >
              <div className="grid gap-1">
                {navLinks.map((item) => (
                  <a
                    key={item.id}
                    href={`#${item.id}`}
                    className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm text-[var(--muted-strong)] transition hover:bg-[rgba(114,52,128,0.08)] hover:text-[var(--foreground)] dark:text-[var(--muted)] dark:hover:bg-white/6 dark:hover:text-white"
                    onClick={() => setMenuOpen(false)}
                  >
                    <item.icon className="h-4 w-4" aria-hidden="true" />
                    {item.label}
                  </a>
                ))}
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </header>

      {/* ── MAIN ──────────────────────────────────────────────────────────────── */}
      <main className="relative z-20 pb-4">

        {/* ════ HERO ══════════════════════════════════════════════════════════ */}
        <section id="home" className="section-shell section-divider pt-10" aria-labelledby="hero-title">
          <div className="grid w-full grid-cols-1 items-center gap-8 lg:grid-cols-12 lg:gap-12">
            <div className="flex min-w-0 flex-col gap-5 lg:col-span-7 lg:gap-6">

              {/* Concrete value-prop eyebrow — not vague uppercase */}
              <p className="text-sm font-semibold text-[var(--muted)]">
                AI Engineer &amp; Full-Stack Developer — building intelligent products with Python,
                FastAPI, and React
              </p>

              {/* Hero headline — concrete first */}
              <h1
                id="hero-title"
                className="w-full min-w-0 font-[family:var(--font-display)] font-semibold tracking-tight"
              >
                <span className="hero-title-lead block text-[var(--muted-strong)]">
                  RAG pipelines, RL systems,
                </span>
                <span className="hero-title-lead block text-[var(--muted-strong)]">
                  full-stack products —
                </span>
                <span
                  className="hero-name-display glitch text-gradient block pb-1"
                  data-text="shipped."
                >
                  shipped.
                </span>
              </h1>

              <div className="w-full min-w-0 text-[var(--muted)]">
                <TypewriterText words={rotatingRoles} />
              </div>

              <p className="max-w-2xl text-base leading-8 text-[var(--muted)] sm:text-lg">
                {personalDetails.summary}
              </p>

              <div className="flex flex-wrap items-center gap-3">
                <MagneticButton href="#projects" icon={Rocket} variant="primary">
                  See my projects
                </MagneticButton>
                <MagneticButton
                  href={personalDetails.resumeUrl}
                  icon={Download}
                  variant="secondary"
                  external
                >
                  Download resume
                </MagneticButton>
              </div>

              {/* Highlight stats — with honest context */}
              <div className="grid gap-3 sm:grid-cols-3">
                {heroHighlights.map((h, i) => (
                  <motion.div
                    key={h}
                    className="glass-panel px-4 py-4"
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + i * 0.1, duration: 0.45 }}
                  >
                    <p className="text-sm leading-6 text-[var(--muted)]">{h}</p>
                  </motion.div>
                ))}
              </div>

              <div className="flex flex-wrap gap-2">
                {heroBadgeList.map((badge) => (
                  <span
                    key={badge}
                    className="chip-glow inline-flex items-center rounded-full border border-[var(--border)] bg-white/40 px-3 py-1.5 text-xs font-medium uppercase tracking-[0.2em] text-[var(--muted)] dark:border-white/8 dark:bg-white/6"
                  >
                    {badge}
                  </span>
                ))}
              </div>
            </div>

            {/* Hero card */}
            <motion.div
              className="w-full min-w-0 max-lg:mt-4 lg:col-span-5"
              initial={{ opacity: 0, y: 26 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.75, delay: 0.15 }}
            >
              <div className="glass-panel theme-surface relative overflow-hidden p-4 sm:p-5">
                <div className="grid-pattern absolute inset-0 opacity-35" aria-hidden="true" />
                <div className="relative z-10 grid gap-4">
                  <div className="relative aspect-[4/5] min-h-[240px] max-h-[min(440px,52vh)] overflow-hidden rounded-[28px] border border-white/10 bg-black/20 sm:aspect-[3/4]">
                    <Image
                      src="/images/hero-card-portrait.jpg"
                      alt="Subhasish Kumar Sahu — AI Engineer and Full-Stack Developer"
                      fill
                      sizes="(max-width: 1024px) 95vw, 40vw"
                      className="object-cover"
                      priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/72 via-black/14 to-transparent" />
                    <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
                      <p className="text-xs uppercase tracking-[0.32em] text-cyan-300">Quick read</p>
                      <h2 className="mt-3 font-[family:var(--font-display)] text-2xl font-semibold sm:text-3xl">
                        Subhasish Kumar Sahu
                      </h2>
                      <p className="mt-3 text-sm leading-7 text-white/78">
                        B.Tech CSE · IIT Guwahati DS/ML program · building RAG, RL, and realtime
                        products in parallel.
                      </p>
                    </div>
                  </div>

                  <div className="rounded-[24px] border border-white/10 bg-black/20 p-5">
                    <p className="text-xs uppercase tracking-[0.28em] text-[var(--muted)]">
                      Currently
                    </p>
                    <dl className="mt-3 grid gap-3">
                      {[
                        { dt: "Degree", dd: "B.Tech CSE · 6th semester · CVR University · 8.7 CGPA" },
                        { dt: "Training", dd: "IIT Guwahati + Masai School + NSDC — 600+ hrs, live builds" },
                        { dt: "Open to",  dd: "Summer 2026 internships, research teams, and freelance AI builds" },
                      ].map((item) => (
                        <div key={item.dt}>
                          <dt className="text-[11px] uppercase tracking-[0.2em] text-[var(--muted)]">{item.dt}</dt>
                          <dd className="mt-1 text-sm font-semibold leading-snug text-[var(--foreground)]">{item.dd}</dd>
                        </div>
                      ))}
                    </dl>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ════ PROJECTS ══════════════════════════════════════════════════════ */}
        <section id="projects" className="section-shell section-divider" aria-labelledby="projects-title">
          <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div className="min-w-0 max-w-2xl">
              <span className="eyebrow">Selected Work</span>
              <h2 id="projects-title" className="mt-4 font-[family:var(--font-display)] text-3xl font-semibold tracking-tight sm:text-4xl">
                Four builds, four different problem spaces.
              </h2>
              <p className="mt-4 text-base leading-8 text-[var(--muted)]">
                Each project links to its GitHub repo. Metrics are from the repo README or
                measured during development.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {filterOptions.map((option) => (
                <button
                  key={option}
                  type="button"
                  className={cn(
                    "rounded-full border px-4 py-2 text-sm transition duration-200",
                    activeFilter === option
                      ? "border-[rgba(114,52,128,0.35)] bg-[rgba(114,52,128,0.12)] text-[var(--foreground)] dark:border-cyan-300/35 dark:bg-cyan-300/14 dark:text-white"
                      : "border-[var(--border)] bg-transparent text-[var(--muted)] hover:border-[rgba(114,52,128,0.25)] hover:text-[var(--foreground)] dark:border-white/8 dark:hover:border-white/18 dark:hover:text-white",
                  )}
                  onClick={() => startFilterTransition(() => setActiveFilter(option))}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>

          {/* Strict 2-col grid */}
          <AnimatePresence mode="popLayout">
            <motion.div
              key={deferredFilter}
              className="grid grid-cols-1 gap-6 lg:grid-cols-2"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
            >
              {visibleProjects.map((project) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  onOpen={() => setActiveProject(project)}
                />
              ))}
            </motion.div>
          </AnimatePresence>

          <p className="mt-5 text-sm text-[var(--muted)]">
            {visibleProjects.length} project{visibleProjects.length !== 1 ? "s" : ""}
          </p>
        </section>

        {/* ════ ABOUT ═════════════════════════════════════════════════════════ */}
        <section id="about" className="section-shell section-divider" aria-labelledby="about-title">
          <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">

            {/* Left: who + specializations */}
            <div className="glass-panel theme-surface relative p-6 sm:p-8">
              <div className="relative z-10 flex flex-col gap-6">
                <div className="rounded-[28px] border border-white/10 bg-black/20 p-5 dark:bg-white/[0.03]">
                  <div className="flex min-w-0 items-start justify-between gap-4">
                    <div className="min-w-0">
                      <p className="text-xs uppercase tracking-[0.3em] text-[var(--muted)]">About me</p>
                      <h2 id="about-title" className="mt-3 font-[family:var(--font-display)] text-2xl font-semibold sm:text-3xl">
                        Engineer, analyst, and product-minded maker.
                      </h2>
                    </div>
                    <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-[20px] border border-white/10 sm:h-20 sm:w-20 sm:rounded-[26px]">
                      <Image src={photoMoments[0].src} alt={photoMoments[0].alt} fill sizes="80px" className="object-cover" />
                    </div>
                  </div>
                  <p className="mt-5 text-sm leading-7 text-[var(--muted)]">{personalDetails.shortBio}</p>

                  <div className="mt-5 grid grid-cols-[1.1fr_0.9fr] gap-3">
                    <div className="relative min-h-[220px] overflow-hidden rounded-[24px] border border-white/10 bg-black/20">
                      <Image src={photoMoments[0].src} alt={photoMoments[0].alt} fill sizes="(max-width: 768px) 50vw, 20vw" className="object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                    </div>
                    <div className="grid gap-3">
                      {photoMoments.slice(1, 3).map((photo) => (
                        <div key={photo.src} className="relative min-h-[102px] overflow-hidden rounded-[20px] border border-white/10 bg-black/20">
                          <Image src={photo.src} alt={photo.alt} fill sizes="(max-width: 768px) 40vw, 14vw" className="object-cover" />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-5 grid gap-3 sm:grid-cols-2">
                    {[
                      { label: "Location",  value: personalDetails.location },
                      { label: "CGPA",      value: "8.7 · B.Tech CSE · CVR University" },
                      { label: "Best with", value: "Python, FastAPI, React, MongoDB" },
                      { label: "Timezone",  value: "IST — comfortable async with US windows" },
                    ].map((item) => (
                      <div key={item.label} className="rounded-[18px] border border-[var(--border)] bg-white/30 p-4 dark:border-white/10 dark:bg-white/5">
                        <p className="text-xs uppercase tracking-[0.25em] text-[var(--muted)]">{item.label}</p>
                        <p className="mt-2 text-sm leading-6 text-[var(--muted-strong)]">{item.value}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Specializations */}
                <div className="rounded-[24px] border border-[var(--border)] bg-white/30 p-5 dark:border-white/10 dark:bg-black/25">
                  <p className="text-xs uppercase tracking-[0.3em] text-[var(--muted)]">Specializations</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {personalDetails.specializations.map((item) => (
                      <span key={item} className="inline-flex rounded-full border border-[rgba(114,52,128,0.2)] bg-[rgba(114,52,128,0.06)] px-3 py-1.5 text-xs text-[var(--muted-strong)] dark:border-cyan-300/14 dark:bg-cyan-300/8">
                        {item}
                      </span>
                    ))}
                  </div>
                  <div className="mt-4 grid gap-3">
                    {specializationVisuals.map((item) => {
                      const Icon = item.icon;
                      return (
                        <div key={item.title} className="group relative overflow-hidden rounded-[20px] border border-white/10 bg-[linear-gradient(145deg,rgba(10,16,32,0.92),rgba(9,13,27,0.7))] p-4">
                          <div className={cn("absolute inset-0 bg-gradient-to-br opacity-90", item.accent)} aria-hidden="true" />
                          <div className="relative flex items-start justify-between gap-4">
                            <div className="min-w-0">
                              <p className="text-sm font-semibold text-white">{item.title}</p>
                              <p className="mt-1 text-xs leading-5 text-white/60">{item.subtitle}</p>
                            </div>
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/12 bg-white/8 text-cyan-200">
                              <Icon className="h-4 w-4" aria-hidden="true" />
                            </div>
                          </div>
                          <div className="relative mt-3 flex flex-wrap items-center gap-2">
                            {item.nodes.map((node, ni) => (
                              <div key={node} className="flex items-center gap-2">
                                <span className="rounded-full border border-white/10 bg-white/8 px-2.5 py-0.5 text-[10px] uppercase tracking-[0.2em] text-white/78">
                                  {node}
                                </span>
                                {ni < item.nodes.length - 1 ? (
                                  <span className="h-px w-4 bg-gradient-to-r from-cyan-300/70 to-fuchsia-300/40" aria-hidden="true" />
                                ) : null}
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* Right: capabilities + journey */}
            <div className="grid gap-6 content-start">
              <div className="glass-panel p-6 sm:p-8">
                <span className="eyebrow">Capabilities</span>
                <p className="mt-4 text-base leading-8 text-[var(--muted)]">
                  I work across the full stack but spend most of my time at the model–API–UI
                  boundary: where behaviour becomes product.
                </p>
                <div className="mt-6 grid gap-5">
                  {expertise.map((item) => (
                    <div key={item.label}>
                      <div className="flex items-center justify-between gap-3 text-sm">
                        <span className="font-medium">{item.label}</span>
                        <span className="font-[family:var(--font-mono)] text-[var(--muted)]">
                          {item.value}%
                        </span>
                      </div>
                      <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-[rgba(114,52,128,0.08)] dark:bg-white/6">
                        <motion.div
                          className="h-full rounded-full bg-gradient-to-r from-[#808034] to-[#723480] dark:from-cyan-300 dark:via-sky-400 dark:to-fuchsia-400"
                          initial={{ width: 0 }}
                          whileInView={{ width: `${item.value}%` }}
                          viewport={{ once: true, amount: 0.6 }}
                          transition={{ duration: 1, ease: "easeOut" }}
                        />
                      </div>
                      <p className="mt-2 text-sm leading-6 text-[var(--muted)]">{item.note}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-8">
                  <p className="text-xs uppercase tracking-[0.3em] text-[var(--muted)]">Stack</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {techStack.map((item) => (
                      <span
                        key={item}
                        className="chip-glow inline-flex items-center rounded-full border border-[var(--border)] bg-white/40 px-4 py-1.5 text-sm text-[var(--muted-strong)] dark:border-white/10 dark:bg-white/6"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="glass-panel relative p-6 sm:p-8">
                <span className="timeline-line" aria-hidden="true" />
                <div className="pl-8">
                  <span className="eyebrow">Journey</span>
                  <div className="mt-6 grid gap-6">
                    {careerTimeline.map((item, i) => (
                      <motion.div
                        key={`${item.year}-${item.title}`}
                        className="relative"
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, amount: 0.35 }}
                        transition={{ duration: 0.45, delay: i * 0.06 }}
                      >
                        <span className="timeline-dot absolute -left-[2.1rem] top-1.5" aria-hidden="true" />
                        <p className="text-xs uppercase tracking-[0.28em] text-[var(--accent-secondary)] dark:text-cyan-300">
                          {item.year}
                        </p>
                        <h3 className="mt-2 text-base font-semibold sm:text-lg">{item.title}</h3>
                        <p className="mt-1 text-sm text-[var(--accent-primary)] dark:text-fuchsia-200/80">{item.org}</p>
                        <p className="mt-2 text-sm leading-7 text-[var(--muted)]">{item.body}</p>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ════ ANALYTICS ═════════════════════════════════════════════════════ */}
        <AnalyticsSection />

        {/* ════ CONTACT ═══════════════════════════════════════════════════════ */}
        <section id="contact" className="section-shell" aria-labelledby="contact-title">
          <div className="grid gap-6 lg:grid-cols-[0.94fr_1.06fr]">

            {/* Left: social links */}
            <div className="glass-panel theme-surface p-6 sm:p-8">
              <span className="eyebrow">Contact</span>
              <h2 id="contact-title" className="mt-4 font-[family:var(--font-display)] text-3xl font-semibold tracking-tight">
                Let&apos;s build something that actually stands out.
              </h2>
              <p className="mt-4 text-base leading-8 text-[var(--muted)]">
                Internships, freelance AI builds, research collaborations — I&apos;m open.
                Drop me a line on any of these channels.
              </p>

              <div className="mt-8 grid gap-3">
                <div className="relative min-h-[180px] overflow-hidden rounded-[24px] border border-white/10 bg-black/20">
                  <Image
                    src="/images/contact-feature.jpg"
                    alt="Subhasish in a cafe setting"
                    fill
                    sizes="(max-width: 1024px) 95vw, 25vw"
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <p className="text-sm font-medium text-white/85">
                      Calm energy, high ownership — happy to jump on a call.
                    </p>
                  </div>
                </div>

                {socialLinks.map((item) => (
                  <a
                    key={item.label}
                    href={item.href}
                    target={item.href.startsWith("http") || item.href.endsWith(".pdf") ? "_blank" : undefined}
                    rel={item.href.startsWith("http") || item.href.endsWith(".pdf") ? "noreferrer" : undefined}
                    className="group rounded-[20px] border border-[var(--border)] bg-white/30 p-4 transition hover:-translate-y-0.5 hover:border-[rgba(114,52,128,0.25)] hover:bg-white/50 dark:border-white/10 dark:bg-black/20 dark:hover:border-cyan-300/25 dark:hover:bg-black/28"
                  >
                    <div className="flex min-w-0 items-center justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-xs uppercase tracking-[0.25em] text-[var(--muted)]">{item.label}</p>
                        <p className="mt-1 truncate text-sm text-[var(--muted-strong)]">{item.handle}</p>
                      </div>
                      <SocialIcon label={item.label} />
                    </div>
                  </a>
                ))}
              </div>
            </div>

            {/* Right: contact form */}
            <div className="glass-panel relative overflow-hidden p-6 sm:p-8">
              {burst ? (
                <div className="pointer-events-none absolute inset-0 z-10" aria-hidden="true">
                  {Array.from({ length: 16 }).map((_, i) => (
                    <motion.span
                      key={i}
                      className="absolute left-1/2 top-1/2 h-2 w-2 rounded-full bg-[#723480] dark:bg-cyan-300"
                      initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
                      animate={{
                        x: Math.cos((i / 16) * Math.PI * 2) * 160,
                        y: Math.sin((i / 16) * Math.PI * 2) * 160,
                        opacity: 0, scale: 0.1,
                      }}
                      transition={{ duration: 0.8, ease: "easeOut" }}
                    />
                  ))}
                </div>
              ) : null}

              <div className="mb-6">
                <span className="eyebrow">Send a message</span>
                <p className="mt-4 text-base leading-8 text-[var(--muted)]">
                  Fills in your mail client — no server, no spam. Just a direct line.
                </p>
              </div>

              <form
                className="grid gap-4"
                onSubmit={(e) => {
                  e.preventDefault();
                  handleContactSubmit(new FormData(e.currentTarget));
                }}
                noValidate
              >
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="input-shell">
                    <input id="name" name="name" placeholder=" " aria-label="Your name" autoComplete="name" required />
                    <label htmlFor="name">Your name</label>
                  </div>
                  <div className="input-shell">
                    <input id="email" name="email" type="email" placeholder=" " aria-label="Your email" autoComplete="email" required />
                    <label htmlFor="email">Email address</label>
                  </div>
                </div>

                <div className="input-shell">
                  <input id="subject" name="subject" placeholder=" " aria-label="Subject" />
                  <label htmlFor="subject">Subject (optional)</label>
                </div>

                <div className="input-shell">
                  <textarea id="message" name="message" rows={5} placeholder=" " aria-label="Your message" required />
                  <label htmlFor="message">Tell me about the opportunity</label>
                </div>

                <p className="text-xs text-[var(--muted)]">
                  Hitting &ldquo;Send&rdquo; opens your email client with this pre-filled.
                  You control when it actually sends.
                </p>

                <div className="flex flex-wrap gap-3">
                  <MagneticButton type="submit" icon={Sparkles} variant="primary" disabled={isSubmitting}>
                    {isSubmitting ? "Opening mail client…" : "Send message"}
                  </MagneticButton>
                  <MagneticButton href={personalDetails.whatsappUrl} icon={MessageCircle} variant="secondary" external>
                    WhatsApp
                  </MagneticButton>
                </div>
              </form>

              {/* Quick-access collab info */}
              <dl className="mt-8 grid gap-3 sm:grid-cols-3">
                {[
                  { dt: "Best fit",     dd: "AI products, dashboards, and full-stack builds"        },
                  { dt: "Collab style", dd: "Async-friendly, high ownership, polished delivery"      },
                  { dt: "Availability", dd: "Internships, freelance work, and research-driven teams" },
                ].map((item) => (
                  <div key={item.dt} className="rounded-[18px] border border-[var(--border)] bg-white/30 p-4 dark:border-white/10 dark:bg-white/5">
                    <dt className="text-xs uppercase tracking-[0.22em] text-[var(--muted)]">{item.dt}</dt>
                    <dd className="mt-2 text-sm leading-6 text-[var(--muted-strong)]">{item.dd}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </section>
      </main>

      {/* ── FOOTER ─────────────────────────────────────────────────────────── */}
      <footer className="section-shell pb-6 pt-0">
        <div className="glass-panel flex flex-col gap-4 px-6 py-6 text-sm text-[var(--muted)] sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-semibold text-[var(--muted-strong)]">
              © {new Date().getFullYear()} {personalDetails.name}
            </p>
            <p className="mt-1">
              Built with Next.js 16, TypeScript, Tailwind CSS v4, and Framer Motion.
            </p>
          </div>
          <MagneticButton href="#home" icon={ArrowRight} variant="ghost">
            Back to top
          </MagneticButton>
        </div>
      </footer>

      {/* ── PROJECT MODAL ───────────────────────────────────────────────────── */}
      <AnimatePresence>
        {activeProject ? (
          <ProjectModal
            key={activeProject.id}
            project={activeProject}
            onClose={() => setActiveProject(null)}
          />
        ) : null}
      </AnimatePresence>
    </div>
  );
}

// ─── Sub-components ────────────────────────────────────────────────────────────

function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const isClient = useSyncExternalStore(
    () => () => undefined,
    () => true,
    () => false,
  );
  const isDark = isClient ? resolvedTheme !== "light" : true;

  return (
    <button
      type="button"
      className="glass-panel grid h-10 w-10 place-items-center"
      aria-label="Toggle colour theme"
      onClick={() => setTheme(isDark ? "light" : "dark")}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={isDark ? "dark" : "light"}
          initial={{ rotate: -16, opacity: 0, scale: 0.8 }}
          animate={{ rotate: 0, opacity: 1, scale: 1 }}
          exit={{ rotate: 16, opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.18 }}
          aria-hidden="true"
        >
          {isDark
            ? <Sun className="h-4 w-4 text-amber-300" />
            : <Moon className="h-4 w-4 text-[var(--accent-primary)]" />
          }
        </motion.span>
      </AnimatePresence>
    </button>
  );
}

function TypewriterText({ words }: { words: string[] }) {
  const [wordIndex, setWordIndex] = useState(0);
  const [typed,     setTyped    ] = useState("");
  const [deleting,  setDeleting ] = useState(false);

  useEffect(() => {
    const current = words[wordIndex] ?? "";
    const t = window.setTimeout(
      () => {
        if (!deleting) {
          const next = current.slice(0, typed.length + 1);
          setTyped(next);
          if (next === current) window.setTimeout(() => setDeleting(true), 900);
        } else {
          const next = current.slice(0, Math.max(typed.length - 1, 0));
          setTyped(next);
          if (!next) { setDeleting(false); setWordIndex((c) => (c + 1) % words.length); }
        }
      },
      deleting ? 42 : 70,
    );
    return () => window.clearTimeout(t);
  }, [deleting, typed, wordIndex, words]);

  return (
    <span className="hero-typewriter-line block w-full font-[family:var(--font-mono)]" aria-live="polite" aria-atomic="true">
      {typed}
      <motion.span
        className="ml-1 inline-block h-[1.1em] w-[2px] bg-[var(--accent-primary)] align-middle"
        animate={{ opacity: [1, 0, 1] }}
        transition={{ duration: 0.9, repeat: Infinity }}
        aria-hidden="true"
      />
    </span>
  );
}

type MagneticButtonProps = {
  children: ReactNode;
  href?: string;
  onClick?: () => void;
  icon?: typeof ArrowRight;
  variant?: "primary" | "secondary" | "ghost";
  external?: boolean;
  type?: "button" | "submit";
  disabled?: boolean;
  stopPropagation?: boolean;
};

function MagneticButton({
  children, href, onClick, icon: Icon,
  variant = "primary", external = false, type = "button", disabled = false, stopPropagation = false,
}: MagneticButtonProps) {
  const classes = cn(
    "button-sheen relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-full px-5 py-2.5 text-sm font-medium transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-60",
    variant === "primary"   && "bg-gradient-to-r from-[#808034] to-[#723480] text-white shadow-[0_8px_24px_rgba(114,52,128,0.28)] hover:brightness-110 dark:from-cyan-300 dark:via-sky-400 dark:to-fuchsia-400 dark:text-slate-950",
    variant === "secondary" && "border border-[rgba(114,52,128,0.22)] bg-white/60 text-[var(--foreground)] hover:bg-white/80 dark:border-white/12 dark:bg-white/6 dark:text-white dark:hover:bg-white/10 dark:hover:border-white/18",
    variant === "ghost"     && "border border-[var(--border)] bg-transparent text-[var(--muted-strong)] hover:bg-white/40 dark:border-white/10 dark:bg-transparent dark:text-[var(--muted-strong)] dark:hover:bg-white/8",
  );

  const handleClick = (e: React.MouseEvent<HTMLElement>) => {
    if (stopPropagation) e.stopPropagation();
    if (disabled) { e.preventDefault(); return; }
    onClick?.();
  };

  const inner = (
    <span className="relative z-10 inline-flex items-center gap-2">
      <span>{children}</span>
      {Icon ? <Icon className="h-4 w-4" aria-hidden="true" /> : null}
    </span>
  );

  if (href) {
    return (
      <motion.a
        href={href}
        target={external || href.startsWith("http") ? "_blank" : undefined}
        rel={external || href.startsWith("http") ? "noreferrer" : undefined}
        className={classes}
        onClick={handleClick}
        whileTap={{ scale: 0.97 }}
      >
        {inner}
      </motion.a>
    );
  }

  return (
    <motion.button
      type={type}
      className={classes}
      onClick={handleClick}
      disabled={disabled}
      whileTap={{ scale: 0.97 }}
    >
      {inner}
    </motion.button>
  );
}

function RoundIconButton({ children, label, onClick }: { children: ReactNode; label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      className="grid h-10 w-10 place-items-center rounded-full border border-[var(--border)] bg-white/40 text-[var(--muted-strong)] transition hover:-translate-y-0.5 hover:border-[rgba(114,52,128,0.25)] dark:border-white/10 dark:bg-white/6 dark:hover:border-cyan-300/25 dark:hover:text-white"
      aria-label={label}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

function SocialIcon({ label }: { label: string }) {
  const icons: Record<string, ReactNode> = {
    GitHub:    <GitBranch    className="h-4 w-4" />,
    LinkedIn:  <BadgeCheck   className="h-4 w-4" />,
    WhatsApp:  <MessageCircle className="h-4 w-4" />,
    X:         <Sparkles     className="h-4 w-4" />,
    LeetCode:  <Trophy       className="h-4 w-4" />,
    Instagram: <Camera       className="h-4 w-4" />,
    Email:     <Mail         className="h-4 w-4" />,
    Resume:    <Download     className="h-4 w-4" />,
  };
  return (
    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-[var(--border)] bg-white/50 text-[var(--muted-strong)] transition group-hover:scale-105 dark:border-white/10 dark:bg-white/6 dark:text-cyan-300" aria-hidden="true">
      {icons[label] ?? <Sparkles className="h-4 w-4" />}
    </span>
  );
}

function ProjectCard({ project, onOpen }: { project: Project; onOpen: () => void }) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const t = window.setTimeout(() => setReady(true), 300);
    return () => window.clearTimeout(t);
  }, []);

  return (
    <motion.article
      layout
      className="glass-panel group relative min-h-[400px] overflow-hidden border border-[var(--border)] p-5 transition-[transform,border-color,box-shadow] duration-300 hover:shadow-[0_20px_50px_rgba(114,52,128,0.12)] dark:border-white/10 sm:p-6 dark:hover:border-white/16 dark:hover:shadow-[0_24px_60px_rgba(8,15,30,0.42)]"
      whileHover={{ y: -5 }}
      transition={{ type: "tween", duration: 0.25, ease: "easeOut" }}
      onClick={onOpen}
      onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onOpen(); } }}
      tabIndex={0}
      role="button"
      aria-label={`Open case study for ${project.title}`}
    >
      {/* Colour accents */}
      <div
        className="absolute inset-0 opacity-40 transition duration-300 group-hover:scale-[1.03]"
        style={{ background: `radial-gradient(circle at top left, ${project.palette[0]}28, transparent 36%), radial-gradient(circle at bottom right, ${project.palette[1]}30, transparent 28%)` }}
        aria-hidden="true"
      />

      <div className="relative z-10 flex h-full flex-col">
        {/* Header */}
        <div className="flex min-w-0 items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="font-[family:var(--font-mono)] text-xs uppercase tracking-[0.3em] text-[var(--muted)]">
              {project.eyebrow}
            </p>
            <h3 className="mt-2 text-xl font-semibold sm:text-2xl">{project.title}</h3>
          </div>
          <span className="shrink-0 rounded-full border border-[var(--border)] bg-white/50 px-3 py-1 text-xs uppercase tracking-[0.2em] text-[var(--muted)] dark:border-white/10 dark:bg-white/8">
            {project.category}
          </span>
        </div>

        {/* Preview image */}
        <div className="project-mask relative mt-5 h-[190px] overflow-hidden rounded-[22px] border border-[var(--border)] bg-black/20 dark:border-white/10">
          {!ready ? <div className="skeleton-shimmer absolute inset-0" /> : null}
          <Image
            src={buildProjectPreview(project, 0)}
            alt={`${project.title} screenshot`}
            fill
            unoptimized
            sizes="(max-width: 1024px) 95vw, 50vw"
            className={cn("object-cover transition duration-500", ready ? "opacity-100 group-hover:scale-105" : "opacity-0")}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/8 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <p className="text-sm text-white/90">{project.longDescription}</p>
          </div>
        </div>

        {/* Metrics */}
        <div className="mt-4 grid gap-2 sm:grid-cols-3">
          {project.metrics.map((m) => (
            <div key={m.label} className="rounded-[18px] border border-[var(--border)] bg-white/40 px-3 py-2.5 dark:border-white/10 dark:bg-white/6">
              <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted)]">{m.label}</p>
              <p className="mt-1 text-sm font-semibold text-[var(--muted-strong)]">{m.value}</p>
            </div>
          ))}
        </div>

        <p className="mt-4 text-sm leading-7 text-[var(--muted)]">{project.description}</p>

        <div className="mt-4 flex flex-wrap gap-1.5">
          {project.tech.map((t) => (
            <span key={t} className="rounded-full border border-[var(--border)] bg-transparent px-2.5 py-1 text-xs text-[var(--muted)] dark:border-white/10 dark:bg-black/22">
              {t}
            </span>
          ))}
        </div>

        <div className="mt-auto flex flex-wrap gap-3 pt-5">
          <MagneticButton
            href={project.primaryCta.href}
            variant="primary"
            icon={ExternalLink}
            external={project.primaryCta.href.startsWith("http")}
            stopPropagation
          >
            {project.primaryCta.label}
          </MagneticButton>
          <MagneticButton
            href={project.secondaryCta.href}
            variant="ghost"
            icon={ArrowRight}
            external={project.secondaryCta.href.startsWith("http")}
            stopPropagation
          >
            {project.secondaryCta.label}
          </MagneticButton>
        </div>
      </div>
    </motion.article>
  );
}

function ProjectModal({ project, onClose }: { project: Project; onClose: () => void }) {
  const [slideIndex, setSlideIndex] = useState(0);
  const closeRef = useRef<HTMLButtonElement>(null);
  const slide = project.gallery[slideIndex];

  // Focus trap: move focus to close button when modal opens
  useEffect(() => {
    closeRef.current?.focus();
    // Lock body scroll
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, []);

  return (
    <motion.div
      className="fixed inset-0 z-[90] flex items-center justify-center bg-black/70 px-4 py-8 backdrop-blur-xl"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      aria-modal="true"
      role="dialog"
      aria-label={`${project.title} case study`}
    >
      <motion.div
        className="glass-panel relative max-h-[90vh] w-full max-w-5xl overflow-auto p-6 sm:p-8"
        initial={{ opacity: 0, y: 24, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 24, scale: 0.96 }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          ref={closeRef}
          type="button"
          className="glass-panel absolute right-4 top-4 grid h-10 w-10 place-items-center"
          onClick={onClose}
          aria-label="Close project details"
        >
          <X className="h-4 w-4" aria-hidden="true" />
        </button>

        <div className="grid gap-8 xl:grid-cols-[1.1fr_0.9fr]">
          {/* Left: description + gallery */}
          <div>
            <p className="font-[family:var(--font-mono)] text-xs uppercase tracking-[0.32em] text-[var(--muted)]">
              {project.eyebrow}
            </p>
            <h3 className="mt-3 font-[family:var(--font-display)] text-3xl font-semibold sm:text-4xl">
              {project.title}
            </h3>
            <p className="mt-4 text-base leading-8 text-[var(--muted)]">{project.longDescription}</p>

            <div className="relative mt-6 overflow-hidden rounded-[24px] border border-[var(--border)] bg-black/20 dark:border-white/10">
              <div className="relative h-[280px] sm:h-[360px]">
                <Image
                  src={buildProjectPreview(project, slideIndex)}
                  alt={`${project.title} slide ${slideIndex + 1}`}
                  fill
                  unoptimized
                  sizes="(max-width: 1280px) 95vw, 50vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/76 via-black/12 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <p className="text-xs uppercase tracking-[0.3em] text-cyan-300">{slide?.subtitle}</p>
                  <h4 className="mt-2 text-xl font-semibold text-white">{slide?.title}</h4>
                  <p className="mt-2 text-sm leading-7 text-white/80">{slide?.detail}</p>
                </div>
              </div>
              {/* Slide controls */}
              <div className="flex items-center justify-between gap-4 border-t border-white/8 px-4 py-3">
                <div className="flex gap-2">
                  {project.gallery.map((g, i) => (
                    <button
                      key={g.title}
                      type="button"
                      className={cn("h-2 rounded-full transition-all duration-300", i === slideIndex ? "w-8 bg-cyan-300" : "w-2 bg-white/18")}
                      onClick={() => setSlideIndex(i)}
                      aria-label={`View slide ${i + 1}`}
                    />
                  ))}
                </div>
                <div className="flex gap-2">
                  <RoundIconButton label="Previous" onClick={() => setSlideIndex((c) => (c - 1 + project.gallery.length) % project.gallery.length)}>
                    <ChevronLeft className="h-4 w-4" />
                  </RoundIconButton>
                  <RoundIconButton label="Next" onClick={() => setSlideIndex((c) => (c + 1) % project.gallery.length)}>
                    <ChevronRight className="h-4 w-4" />
                  </RoundIconButton>
                </div>
              </div>
            </div>
          </div>

          {/* Right: impact + tech + CTAs */}
          <div className="grid gap-5 content-start">
            <div className="glass-panel p-5">
              <p className="text-xs uppercase tracking-[0.28em] text-[var(--muted)]">Impact</p>
              <div className="mt-3 grid gap-2">
                {project.impact.map((item) => (
                  <div key={item} className="rounded-[18px] border border-[var(--border)] bg-white/40 p-4 text-sm leading-7 text-[var(--muted-strong)] dark:border-white/10 dark:bg-white/6">
                    {item}
                  </div>
                ))}
              </div>
            </div>
            <div className="glass-panel p-5">
              <p className="text-xs uppercase tracking-[0.28em] text-[var(--muted)]">Tech stack</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {project.tech.map((t) => (
                  <span key={t} className="rounded-full border border-[var(--border)] bg-transparent px-3 py-1.5 text-xs text-[var(--muted)] dark:border-white/10 dark:bg-black/22 dark:text-[var(--muted-strong)]">
                    {t}
                  </span>
                ))}
              </div>
            </div>
            <div className="flex flex-wrap gap-3">
              <MagneticButton href={project.primaryCta.href} variant="secondary" icon={GitBranch} external={project.primaryCta.href.startsWith("http")}>
                {project.primaryCta.label}
              </MagneticButton>
              <MagneticButton href={project.secondaryCta.href} variant="ghost" icon={Mail} external={project.secondaryCta.href.startsWith("http")}>
                {project.secondaryCta.label}
              </MagneticButton>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

function ToastBanner({ toast }: { toast: ToastState }) {
  const accentClass = toast.tone === "success"
    ? "from-emerald-300/20 to-teal-300/15"
    : toast.tone === "error"
    ? "from-rose-300/20 to-pink-300/15"
    : "from-cyan-300/20 to-fuchsia-400/20";

  return (
    <motion.div
      role="status"
      aria-live="polite"
      className="fixed right-4 top-20 z-[95] w-[min(92vw,360px)]"
      initial={{ opacity: 0, x: 28, y: -8 }}
      animate={{ opacity: 1, x: 0, y: 0 }}
      exit={{ opacity: 0, x: 28, y: -8 }}
    >
      <div className={`glass-panel bg-gradient-to-br ${accentClass} px-5 py-4`}>
        <p className="font-semibold">{toast.title}</p>
        <p className="mt-1.5 text-sm leading-6 text-[var(--muted)]">{toast.body}</p>
      </div>
    </motion.div>
  );
}

function buildProjectPreview(project: Project, slideIndex: number) {
  const slide = project.gallery[slideIndex] ?? project.gallery[0];
  if (slide?.imageSrc) return slide.imageSrc;

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="750" viewBox="0 0 1200 750">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${project.palette[0]}" stop-opacity="0.9"/>
      <stop offset="100%" stop-color="${project.palette[1]}" stop-opacity="0.85"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="750" fill="#040712"/>
  <rect width="1200" height="750" fill="url(#bg)" opacity="0.18"/>
  <circle cx="200" cy="200" r="160" fill="${project.palette[0]}" opacity="0.20"/>
  <circle cx="960" cy="580" r="180" fill="${project.palette[1]}" opacity="0.18"/>
  <rect x="72" y="70" width="1056" height="610" rx="28" fill="rgba(8,15,30,0.78)" stroke="rgba(255,255,255,0.10)"/>
  <rect x="108" y="108" width="680" height="364" rx="20" fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.07)"/>
  <rect x="818" y="108" width="270" height="134" rx="16" fill="rgba(255,255,255,0.05)"/>
  <rect x="818" y="262" width="270" height="192" rx="16" fill="rgba(255,255,255,0.03)"/>
  <rect x="818" y="474" width="270" height="126" rx="16" fill="rgba(255,255,255,0.05)"/>
  <text x="120" y="558" fill="white" font-family="Helvetica,Arial,sans-serif" font-size="52" font-weight="700">${project.title}</text>
  <text x="120" y="606" fill="rgba(255,255,255,0.65)" font-family="Helvetica,Arial,sans-serif" font-size="26">${slide?.title ?? ""}</text>
  <text x="830" y="164" fill="${project.palette[0]}" font-family="Helvetica,Arial,sans-serif" font-size="18" letter-spacing="4" font-weight="700">MODULE</text>
  <text x="830" y="208" fill="white" font-family="Helvetica,Arial,sans-serif" font-size="28" font-weight="700">${slide?.subtitle ?? ""}</text>
  <text x="830" y="316" fill="rgba(255,255,255,0.55)" font-family="Helvetica,Arial,sans-serif" font-size="20">${project.metrics[0]?.label ?? ""}</text>
  <text x="830" y="356" fill="white" font-family="Helvetica,Arial,sans-serif" font-size="38" font-weight="700">${project.metrics[0]?.value ?? ""}</text>
  <text x="830" y="536" fill="rgba(255,255,255,0.45)" font-family="Helvetica,Arial,sans-serif" font-size="20">${project.tech.slice(0, 3).join(" · ")}</text>
</svg>`;

  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}