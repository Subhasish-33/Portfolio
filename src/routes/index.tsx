import { createFileRoute } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { NeuralField } from "@/components/three/NeuralField";
import { JigsawPuzzle } from "@/components/effects/JigsawPuzzle";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Subhasish — Full-Stack AI Engineer" },
      {
        name: "description",
        content:
          "Subhasish Kumar Sahu — AI Engineer, Full-Stack Developer & Data Systems Builder. Shipping RAG pipelines, RL agents, FastAPI backends and React product interfaces.",
      },
      { property: "og:title", content: "Subhasish Kumar Sahu — AI Engineer" },
      {
        property: "og:description",
        content: "Intelligent systems where messy data becomes an experience people trust.",
      },
    ],
  }),
  component: HeroPage,
});

function HeroPage() {
  const [jigsawOpen, setJigsawOpen] = useState(false);

  return (
    <section className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden">
      {/* WebGL neural particle field */}
      <NeuralField />

      {/* Soft dark vignette over canvas */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 30%, oklch(0.06 0.005 270 / 0.7) 80%)",
        }}
      />

      {/* Top-left brand mark */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.2 }}
        className="absolute left-6 top-6 z-10 flex items-center gap-3 md:left-10 md:top-10"
      >
        <span className="h-2 w-2 animate-pulse rounded-full bg-[oklch(0.88_0.18_200)] shadow-[0_0_12px_oklch(0.88_0.18_200)]" />
        <span className="font-display text-[10px] uppercase tracking-[0.4em] text-foreground/60">
          PORTFOLIO / V1
        </span>
      </motion.div>

      {/* Top-right meta */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.3 }}
        className="absolute right-6 top-6 z-10 hidden items-center gap-2 md:right-10 md:top-10 md:flex"
      >
        <span className="font-display text-[10px] uppercase tracking-[0.4em] text-foreground/60">
          ◢ Operating in dark mode
        </span>
      </motion.div>

      {/* Hero text block */}
      <div className="relative z-10 flex flex-col items-center px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.4 }}
          className="mb-8"
        >
          <span className="glass inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-[10px] font-medium uppercase tracking-[0.3em] text-foreground/70">
            <span className="h-1.5 w-1.5 rounded-full bg-[oklch(0.88_0.18_200)]" />
            Available for select engagements
          </span>
        </motion.div>

        {/* ── Clickable name ── */}
        <motion.h1
          initial={{ opacity: 0, y: 30, filter: "blur(20px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 1.4, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="group relative cursor-pointer font-display text-[18vw] font-bold leading-[0.9] tracking-tighter md:text-[14vw] lg:text-[200px]"
          onClick={() => setJigsawOpen(true)}
          title="Click me ✦"
        >
          <span className="text-mask-gradient transition-all duration-300 group-hover:brightness-125">
            Subhasish
          </span>
          <span className="text-mask-gradient transition-all duration-300 group-hover:brightness-125">
            .
          </span>
          {/* Hover hint — uses group-hover on the h1 */}
          <span className="pointer-events-none absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap font-mono text-[9px] uppercase tracking-[0.3em] text-[oklch(0.88_0.18_200/0.6)] opacity-0 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0 translate-y-1">
            ✦ click me
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1 }}
          className="mt-6 max-w-2xl text-balance text-base text-foreground/70 md:text-lg"
        >
          <span className="font-serif-display italic text-foreground/90">
            AI Engineer · Full Stack · Data Systems Builder.
          </span>{" "}
          Designing systems where raw, messy data becomes an experience people trust —{" "}
          <span className="text-foreground">RAG · RL · FastAPI · React</span>.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1.2 }}
          className="mt-10 flex flex-wrap items-center justify-center gap-3"
        >
          <a
            href="/projects"
            className="group relative overflow-hidden rounded-full bg-gradient-to-r from-[oklch(0.88_0.18_200)] to-[oklch(0.55_0.27_295)] px-7 py-3 text-xs font-semibold uppercase tracking-[0.25em] text-[oklch(0.06_0.005_270)] shadow-[0_0_40px_-5px_oklch(0.88_0.18_200/0.6)] transition-transform hover:scale-[1.03]"
          >
            View work
          </a>
          <a
            href="/contact"
            className="rounded-full border border-white/15 bg-white/5 px-7 py-3 text-xs font-semibold uppercase tracking-[0.25em] text-foreground/80 backdrop-blur-xl transition-colors hover:bg-white/10"
          >
            Get in touch
          </a>
        </motion.div>
      </div>

      {/* Bottom indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6, duration: 1 }}
        className="absolute bottom-28 left-1/2 z-10 -translate-x-1/2 flex items-center gap-6 text-[10px] uppercase tracking-[0.4em] text-foreground/40"
      >
        <span>↓ scroll · explore the system</span>
        <span className="hidden items-center gap-1.5 md:flex">
          <kbd className="rounded border border-white/10 bg-white/5 px-1.5 py-0.5 font-mono text-[9px] normal-case tracking-normal text-foreground/30">
            ⌘K
          </kbd>
          <span>command palette</span>
        </span>
      </motion.div>

      {/* ── Jigsaw Modal ── */}
      <AnimatePresence>
        {jigsawOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              key="jigsaw-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setJigsawOpen(false)}
              className="fixed inset-0 z-[250] bg-black/70 backdrop-blur-md"
            />
            {/* Modal */}
            <motion.div
              key="jigsaw-modal"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[251] flex items-center justify-center p-4"
              onClick={(e) => e.stopPropagation()}
            >
              <JigsawPuzzle onClose={() => setJigsawOpen(false)} />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </section>
  );
}
