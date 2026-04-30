import { createFileRoute } from "@tanstack/react-router";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Github, ArrowUpRight } from "lucide-react";
import { useRef } from "react";
import { PageFooterStamp } from "@/components/effects/PageFooterStamp";
import projectAmigo from "@/assets/project-amigo.jpg";
import projectMood from "@/assets/project-mood-detection.jpg";

export const Route = createFileRoute("/projects")({
  head: () => ({
    meta: [
      { title: "Projects — Subhasish Kumar Sahu" },
      {
        name: "description",
        content:
          "Selected work by Subhasish Kumar Sahu: Bhubaneswar Energy Twin, oyeee.chat, Customer Churn Prediction, Job Application Tracker.",
      },
      { property: "og:title", content: "Projects — Subhasish Kumar Sahu" },
      {
        property: "og:description",
        content: "Spatial gallery of intelligent systems I've shipped.",
      },
    ],
  }),
  component: ProjectsPage,
});

interface Project {
  id: string;
  index: string;
  title: string;
  tagline: string;
  stack: string[];
  category: string;
  accent: "cyan" | "violet" | "white";
  href: string;
  preview?: string;
  metrics: { label: string; value: string }[];
}

const PROJECTS: Project[] = [
  {
    id: "energy-twin",
    index: "01",
    title: "Bhubaneswar Energy Twin",
    tagline:
      "A digital twin for energy forecasting that blends NASA Power data, PPO reinforcement learning, and a low-latency FastAPI backend — turning weather + grid signals into decision-ready forecasts.",
    stack: ["Python", "FastAPI", "PPO", "MongoDB", "NASA Power"],
    category: "AI Systems · Predictive Intelligence",
    accent: "cyan",
    href: "https://github.com/Subhasish-33/Bhubaneswar-Energy-Twin",
    preview: "/projects/energy-twin/correlation-heatmap.png",
    metrics: [
      { label: "Accuracy", value: "92%" },
      { label: "Latency", value: "<200ms" },
      { label: "Concurrent", value: "500+" },
    ],
  },
  {
    id: "oyeee-chat",
    index: "02",
    title: "oyeee.chat",
    tagline:
      "An anonymous messaging platform with websocket-first performance, gamified Aura Points engagement, and Redis-backed session security — battle-tested at hackathon scale.",
    stack: ["React", "Node.js", "Socket.io", "MongoDB", "Redis"],
    category: "Full Stack · Realtime Social",
    accent: "violet",
    href: "https://github.com/Anshu0105/Oyeee_Project",
    preview: "/projects/oyeee/live-rooms.png",
    metrics: [
      { label: "Latency", value: "<100ms" },
      { label: "Concurrent", value: "1,000+" },
      { label: "Engagement", value: "+40%" },
    ],
  },
  {
    id: "customer-churn",
    index: "03",
    title: "Customer Churn Prediction",
    tagline:
      "A predictive analytics workflow that turns historical customer behavior into retention-ready insight — feature engineering, supervised modeling, and interpretable outputs that read as business signal.",
    stack: ["Python", "Pandas", "Scikit-learn", "Matplotlib"],
    category: "AI Systems · Retention Intelligence",
    accent: "cyan",
    href: "https://github.com/Subhasish-33/Customer-Churn-Prediction",
    preview: "/projects/customer-churn-preview.png",
    metrics: [
      { label: "Focus", value: "Churn Risk" },
      { label: "Use Case", value: "Retention" },
      { label: "Output", value: "Interpretable" },
    ],
  },
  {
    id: "job-tracker",
    index: "04",
    title: "Job Application Tracker",
    tagline:
      "A MERN-stack command center for the job hunt — MongoDB aggregation pipelines power multidimensional filtering, status automation, and follow-up triggers across hundreds of applications.",
    stack: ["MongoDB", "Express", "React", "Node.js"],
    category: "Data Engineering · Workflow Visibility",
    accent: "violet",
    href: "https://github.com/Subhasish-33/Job-Application-Tracker",
    preview: "/projects/job-tracker-preview.png",
    metrics: [
      { label: "Tracked", value: "500+" },
      { label: "Manual Work", value: "−50%" },
      { label: "Views", value: "Multi-D" },
    ],
  },
  {
    id: "amigo",
    index: "05",
    title: "Amigo",
    tagline:
      "A specialized platform streamlining access to government schemes — featuring a Document Intelligence System with AI-driven OCR for automated identity validation and eligibility mapping at citizen scale.",
    stack: ["Next.js", "FastAPI", "Tesseract", "MongoDB", "PaddleOCR"],
    category: "Gov-Tech · Document Intelligence",
    accent: "cyan",
    href: "https://github.com/Subhasish-33/Amigo_Government-schemes-access-platform",
    preview: projectAmigo,
    metrics: [
      { label: "Extraction", value: "98%" },
      { label: "Processing", value: "<1.5s" },
      { label: "Schemes", value: "50+" },
    ],
  },
  {
    id: "mood-detection",
    index: "06",
    title: "Mood Detection",
    tagline:
      "A real-time facial expression recognition engine — a custom CNN architecture analyzes facial landmarks and classifies emotional states with high temporal consistency across the camera feed.",
    stack: ["Python", "TensorFlow", "OpenCV", "Keras", "CNN", "NumPy"],
    category: "Computer Vision · Human-Centric AI",
    accent: "violet",
    href: "https://github.com/Subhasish-33/Facial-Mood-Detection",
    preview: projectMood,
    metrics: [
      { label: "Accuracy", value: "94%" },
      { label: "Inference", value: "30+ FPS" },
      { label: "Classes", value: "7" },
    ],
  },
];

function ProjectsPage() {
  return (
    <section className="relative min-h-screen px-6 pb-32 pt-32 md:px-12">
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
        >
          <span className="font-display text-[10px] uppercase tracking-[0.4em] text-[oklch(0.88_0.18_200)]">
            Chapter 02
          </span>
          <h1 className="mt-4 font-display text-6xl font-bold leading-[0.9] tracking-tighter md:text-8xl">
            Selected
            <br />
            <span className="font-serif-display italic text-foreground/70">work</span>
            <span className="text-gradient-rim">.</span>
          </h1>
          <p className="mt-6 max-w-xl text-sm text-foreground/60">
            Four flagship builds across AI systems, realtime products, and
            data tooling — each card a window into the architecture, the
            trade-offs, and the why.
          </p>
        </motion.div>

        <div className="mt-20 grid grid-cols-1 gap-8 md:grid-cols-2">
          {PROJECTS.map((p, i) => (
            <ProjectCard key={p.id} project={p} delay={i * 0.1} />
          ))}
        </div>

        <PageFooterStamp readingMinutes={3} updatedDate="18.04.2026" />
      </div>
    </section>
  );
}

function ProjectCard({ project, delay }: { project: Project; delay: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rotateX = useSpring(useTransform(my, [-0.5, 0.5], [8, -8]), {
    stiffness: 200,
    damping: 20,
  });
  const rotateY = useSpring(useTransform(mx, [-0.5, 0.5], [-10, 10]), {
    stiffness: 200,
    damping: 20,
  });

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width - 0.5);
    my.set((e.clientY - r.top) / r.height - 0.5);
  };

  const onLeave = () => {
    mx.set(0);
    my.set(0);
  };

  const accentRing =
    project.accent === "cyan"
      ? "from-[oklch(0.88_0.18_200/0.6)] to-transparent"
      : project.accent === "violet"
        ? "from-[oklch(0.55_0.27_295/0.6)] to-transparent"
        : "from-white/40 to-transparent";

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.9, delay, ease: [0.16, 1, 0.3, 1] }}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{ rotateX, rotateY, transformPerspective: 1000 }}
      className="group relative block"
    >
      <div
        className={`absolute -inset-px rounded-3xl bg-gradient-to-br ${accentRing} opacity-0 transition-opacity duration-500 group-hover:opacity-100`}
      />
      <div className="glass-strong noise relative h-full overflow-hidden rounded-3xl p-8 md:p-10">
        <div className="flex items-start justify-between">
          <span className="font-display text-[10px] uppercase tracking-[0.4em] text-foreground/40">
            {project.category}
          </span>
          <span className="font-serif-display text-5xl italic text-foreground/20">
            {project.index}
          </span>
        </div>

        {/* Visual preview */}
        <div
          data-cursor-photo
          className="relative mt-6 h-44 overflow-hidden rounded-2xl border border-white/10"
          style={{
            background:
              project.accent === "cyan"
                ? "linear-gradient(135deg, oklch(0.1 0.02 270), oklch(0.06 0.005 270))"
                : "linear-gradient(135deg, oklch(0.1 0.02 270), oklch(0.06 0.005 270))",
          }}
        >
          {project.preview && (
            <img
              src={project.preview}
              alt={`${project.title} preview`}
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover opacity-70 mix-blend-luminosity transition-all duration-700 group-hover:opacity-90 group-hover:mix-blend-normal"
            />
          )}
          <div
            className="absolute inset-0 opacity-30 mix-blend-overlay"
            style={{
              backgroundImage:
                "linear-gradient(oklch(1 0 0 / 0.06) 1px, transparent 1px), linear-gradient(90deg, oklch(1 0 0 / 0.06) 1px, transparent 1px)",
              backgroundSize: "32px 32px",
            }}
          />
          <a
            href={project.href}
            target="_blank"
            rel="noopener noreferrer"
            data-cursor-hover
            className="absolute bottom-3 right-3 inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-black/50 px-3 py-1.5 font-mono text-[10px] uppercase tracking-widest text-foreground/80 backdrop-blur-md transition-all hover:border-[oklch(0.88_0.18_200/0.5)] hover:bg-black/70 hover:text-[oklch(0.88_0.18_200)]"
          >
            <Github className="h-3 w-3" />
            view repo
            <ArrowUpRight className="h-3 w-3" />
          </a>
        </div>

        <h3 className="mt-6 font-display text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
          {project.title}
        </h3>
        <p className="mt-3 text-sm leading-relaxed text-foreground/60">
          {project.tagline}
        </p>

        {/* Metrics */}
        <div className="mt-6 grid grid-cols-3 gap-3 border-y border-white/10 py-4">
          {project.metrics.map((m) => (
            <div key={m.label}>
              <div className="font-display text-base font-semibold text-foreground">
                {m.value}
              </div>
              <div className="font-mono text-[9px] uppercase tracking-widest text-foreground/40">
                {m.label}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          {project.stack.map((s) => (
            <span
              key={s}
              className="rounded-full border border-white/10 bg-white/5 px-3 py-1 font-mono text-[10px] uppercase tracking-widest text-foreground/70"
            >
              {s}
            </span>
          ))}
        </div>

        {/* Footer GitHub action */}
        <a
          href={project.href}
          target="_blank"
          rel="noopener noreferrer"
          data-cursor-hover
          className="mt-6 inline-flex w-full items-center justify-between rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-foreground/85 transition-all hover:border-[oklch(0.88_0.18_200/0.5)] hover:bg-white/[0.06]"
        >
          <span className="flex items-center gap-2.5">
            <Github className="h-4 w-4" />
            <span className="font-mono text-[11px] uppercase tracking-widest">
              github.com/{project.href.split("github.com/")[1]}
            </span>
          </span>
          <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </a>
      </div>
    </motion.div>
  );
}
