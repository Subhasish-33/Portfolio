import { createFileRoute } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { z } from "zod";
import { EventSphere } from "@/components/three/EventSphere";
import { supabase } from "@/integrations/supabase/client";
import coffeeFeature from "@/assets/coffee-feature.jpg";
import { PageFooterStamp } from "@/components/effects/PageFooterStamp";
import { ChessBoard } from "@/components/effects/ChessBoard";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — Subhasish Kumar Sahu" },
      {
        name: "description",
        content:
          "Send a signal to Subhasish Kumar Sahu — AI Engineer based in Bhubaneswar, India. Open to roles, collaborations, and RAG-over-coffee conversations.",
      },
      { property: "og:title", content: "Contact — Subhasish Kumar Sahu" },
      {
        property: "og:description",
        content: "The event horizon of this site — drop a message.",
      },
    ],
  }),
  component: ContactPage,
});

const schema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100),
  email: z.string().trim().email("Invalid email").max(255),
  message: z.string().trim().min(1, "Message is required").max(2000),
});

type FormState = "idle" | "submitting" | "success" | "error";
type FocusedField = "name" | "email" | "message" | null;

/* Which chess square to pulse for each field */
const FIELD_PULSE: Record<NonNullable<FocusedField>, string> = {
  name: "h5",    // White Queen
  email: "f5",   // White Knight
  message: "g8", // Black King
};

function ContactPage() {
  const [state, setState] = useState<FormState>("idle");
  const [errors, setErrors] = useState<Partial<Record<"name" | "email" | "message", string>>>({});
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [focused, setFocused] = useState<FocusedField>(null);
  const [systemOverload, setSystemOverload] = useState(false);

  const triggerOverload = () => {
    setSystemOverload(true);
    // Auto-clear pulse after a few seconds so it doesn't loop forever
    setTimeout(() => setSystemOverload(false), 6000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setErrorMsg(null);

    const parsed = schema.safeParse(form);
    if (!parsed.success) {
      const fieldErrors: typeof errors = {};
      for (const issue of parsed.error.issues) {
        const k = issue.path[0] as "name" | "email" | "message";
        fieldErrors[k] = issue.message;
      }
      setErrors(fieldErrors);
      return;
    }

    setState("submitting");
    const { error } = await supabase.from("contact_submissions").insert(parsed.data);
    if (error) {
      setState("error");
      setErrorMsg("Transmission failed. Please try again.");
      return;
    }
    setState("success");
  };

  const pulseSquare = focused ? FIELD_PULSE[focused] : null;

  return (
    <section className="relative min-h-screen overflow-hidden px-6 pb-32 pt-32 md:px-12">
      {/* ── System Overload border pulse (triggered on chess checkmate) ── */}
      <AnimatePresence>
        {systemOverload && (
          <motion.div
            key="overload"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="pointer-events-none fixed inset-0 z-[120]"
          >
            <motion.div
              className="absolute inset-0"
              animate={{
                boxShadow: [
                  "inset 0 0 0 0px oklch(0.88 0.18 200 / 0)",
                  "inset 0 0 80px 4px oklch(0.88 0.18 200 / 0.85)",
                  "inset 0 0 40px 2px oklch(0.55 0.27 295 / 0.6)",
                  "inset 0 0 80px 4px oklch(0.88 0.18 200 / 0.85)",
                  "inset 0 0 0 0px oklch(0.88 0.18 200 / 0)",
                ],
              }}
              transition={{ duration: 2.4, repeat: 1, ease: "easeInOut" }}
            />
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ delay: 0.2, duration: 0.4 }}
              className="absolute left-1/2 top-6 -translate-x-1/2 rounded-full border border-[oklch(0.88_0.18_200/0.5)] bg-black/60 px-4 py-2 backdrop-blur-md"
            >
              <span className="font-mono text-[10px] uppercase tracking-[0.4em] text-[oklch(0.88_0.18_200)]">
                ⚡ system overload · checkmate
              </span>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 3D sphere anchored at bottom */}
      <div className="pointer-events-none absolute inset-x-0 bottom-[-30vh] top-1/3 -z-0">
        <EventSphere />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl">

        {/* ── Two-column: Form + Chess ── */}
        <div className="grid grid-cols-1 gap-10 xl:grid-cols-[1fr_auto] xl:items-start">

          {/* LEFT: Heading + Contact form */}
          <div className="min-w-0">
            {/* Page header (now inside left column) */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1 }}
              className="mb-12"
            >
              <span className="font-display text-[10px] uppercase tracking-[0.4em] text-[oklch(0.88_0.18_200)]">
                Chapter 04
              </span>
              <h1 className="mt-4 font-display text-6xl font-bold leading-[0.9] tracking-tighter md:text-8xl">
                Send a
                <br />
                <span className="font-serif-display italic text-foreground/80">signal</span>
                <span className="text-gradient-rim">.</span>
              </h1>
              <p className="mt-6 max-w-md text-sm text-foreground/60">
                Got a project, a wild idea, or just want to talk RAG over coffee?
                Drop a line and I'll get back within 48 hours. Based in
                Bhubaneswar — open to opportunities globally.
              </p>
            </motion.div>

            <AnimatePresence mode="wait">
              {state !== "success" ? (
                <motion.form
                  key="form"
                  onSubmit={handleSubmit}
                  initial={{ opacity: 1 }}
                  exit={{ opacity: 0, scale: 0.95, filter: "blur(20px)" }}
                  transition={{ duration: 0.6 }}
                  className="space-y-10"
                >
                  <ContactField
                    label="Name"
                    value={form.name}
                    onChange={(v) => setForm((f) => ({ ...f, name: v }))}
                    error={errors.name}
                    onFocus={() => setFocused("name")}
                    onBlur={() => setFocused(null)}
                    hint="White Queen glows ♕"
                  />
                  <ContactField
                    label="Email"
                    type="email"
                    value={form.email}
                    onChange={(v) => setForm((f) => ({ ...f, email: v }))}
                    error={errors.email}
                    onFocus={() => setFocused("email")}
                    onBlur={() => setFocused(null)}
                    hint="White Knight stirs ♘"
                  />
                  <ContactField
                    label="Message"
                    multiline
                    value={form.message}
                    onChange={(v) => setForm((f) => ({ ...f, message: v }))}
                    error={errors.message}
                    onFocus={() => setFocused("message")}
                    onBlur={() => setFocused(null)}
                    hint="Black King trembles ♚"
                  />

                  {errorMsg && (
                    <p className="text-xs uppercase tracking-widest text-destructive">
                      {errorMsg}
                    </p>
                  )}

                  <motion.button
                    type="submit"
                    disabled={state === "submitting"}
                    data-cursor-hover
                    initial={false}
                    animate={systemOverload ? { y: [40, -6, 0], opacity: [0.6, 1, 1] } : { y: 0, opacity: 1 }}
                    transition={systemOverload ? { duration: 0.7, ease: [0.16, 1, 0.3, 1] } : { duration: 0.3 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    style={systemOverload ? {
                      boxShadow: "0 0 60px -5px oklch(0.88 0.18 200 / 0.95), 0 0 120px -10px oklch(0.55 0.27 295 / 0.7)",
                    } : undefined}
                    className="group relative inline-flex items-center gap-3 overflow-hidden rounded-full border border-[oklch(0.88_0.18_200/0.4)] bg-gradient-to-r from-[oklch(0.88_0.18_200/0.15)] to-[oklch(0.55_0.27_295/0.15)] px-8 py-4 font-display text-xs font-semibold uppercase tracking-[0.3em] text-foreground shadow-[0_0_40px_-5px_oklch(0.88_0.18_200/0.5)] transition-all hover:shadow-[0_0_60px_-5px_oklch(0.88_0.18_200/0.7)] disabled:opacity-50"
                  >
                    <span className="relative z-10">
                      {state === "submitting" ? "Transmitting…" : systemOverload ? "Send data — boosted" : "Send data"}
                    </span>
                    <span className="relative z-10 inline-block transition-transform group-hover:translate-x-1">
                      →
                    </span>
                    <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
                  </motion.button>
                </motion.form>
              ) : (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.9, filter: "blur(20px)" }}
                  animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                  transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                  className="glass-strong noise rounded-3xl p-12 text-center"
                >
                  <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full border border-[oklch(0.88_0.18_200/0.4)] bg-[oklch(0.88_0.18_200/0.1)] text-2xl">
                    ✓
                  </div>
                  <h2 className="font-display text-3xl font-bold tracking-tight">
                    Signal received.
                  </h2>
                  <p className="mt-3 text-sm text-foreground/60">
                    Your message has dissolved into the system. I'll respond
                    within 48 hours.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* RIGHT: Chess board */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, delay: 0.2 }}
            className="glass-strong noise hidden xl:block rounded-3xl p-6 self-start xl:sticky xl:top-8"
          >
            {/* Chess header */}
            <div className="mb-4">
              <div className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-[oklch(0.55_0.27_295)] shadow-[0_0_8px_oklch(0.55_0.27_295)]" />
                <span className="font-display text-[10px] uppercase tracking-[0.4em] text-foreground/50">
                  Grandmaster Mode
                </span>
              </div>
              <p className="mt-2 font-display text-lg font-semibold tracking-tight text-foreground">
                Mate in 2 — White to move
              </p>
              <p className="mt-1 text-xs text-foreground/45">
                Solve the puzzle while you fill out the form.
              </p>
            </div>

            {/* Field-to-piece legend */}
            <div className="mb-4 space-y-1.5">
              {([
                { field: "Name", piece: "♕ Qh5", sq: "h5", active: focused === "name" },
                { field: "Email", piece: "♘ Nf5", sq: "f5", active: focused === "email" },
                { field: "Message", piece: "♚ Kg8", sq: "g8", active: focused === "message" },
              ] as const).map((row) => (
                <motion.div
                  key={row.field}
                  animate={{ opacity: row.active ? 1 : 0.4 }}
                  className="flex items-center gap-2 rounded-lg border border-white/5 bg-white/[0.02] px-3 py-1.5"
                >
                  <span className="font-mono text-[10px] text-foreground/40 w-14">{row.field}</span>
                  <span className="h-px flex-1 bg-white/10" />
                  <motion.span
                    animate={row.active ? {
                      textShadow: ["0 0 6px oklch(0.88 0.18 200 / 0.4)", "0 0 16px oklch(0.88 0.18 200 / 1)", "0 0 6px oklch(0.88 0.18 200 / 0.4)"],
                    } : {}}
                    transition={{ duration: 1.4, repeat: Infinity }}
                    className="font-mono text-[11px] text-[oklch(0.88_0.18_200)]"
                  >
                    {row.piece}
                  </motion.span>
                </motion.div>
              ))}
            </div>

            <ChessBoard pulseSquare={pulseSquare} />
          </motion.div>
        </div>

        {/* Mobile chess board (visible below form on small screens) */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9 }}
          className="mt-12 xl:hidden glass-strong noise rounded-3xl p-5"
        >
          <div className="mb-4 flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-[oklch(0.55_0.27_295)] shadow-[0_0_8px_oklch(0.55_0.27_295)]" />
            <span className="font-display text-[10px] uppercase tracking-[0.4em] text-foreground/50">
              Mate in 2 · White to move
            </span>
          </div>
          <div className="overflow-x-auto">
            <ChessBoard pulseSquare={pulseSquare} />
          </div>
        </motion.div>

        {/* Ko-fi card */}
        <motion.a
          href="https://ko-fi.com/subhasish_33"
          target="_blank"
          rel="noopener noreferrer"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          whileHover={{ y: -3 }}
          data-cursor-hover
          className="group glass-strong noise relative mt-16 grid grid-cols-1 overflow-hidden rounded-3xl border border-white/10 transition-colors hover:border-[oklch(0.88_0.18_200/0.4)] sm:grid-cols-[180px_1fr] md:grid-cols-[220px_1fr]"
        >
          <div className="relative aspect-[4/3] overflow-hidden sm:aspect-auto">
            <img
              src={coffeeFeature}
              alt="Subhasish with a cup of coffee"
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-transparent to-background/60 sm:bg-gradient-to-r sm:from-transparent sm:to-background/40" />
          </div>
          <div className="relative flex flex-col justify-between gap-5 p-6 md:p-8">
            <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
              style={{ background: "radial-gradient(circle at 100% 0%, oklch(0.88 0.18 200 / 0.18) 0%, transparent 60%)" }}
            />
            <div className="relative">
              <div className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-[oklch(0.88_0.18_200)] shadow-[0_0_8px_oklch(0.88_0.18_200)]" />
                <span className="font-display text-[10px] uppercase tracking-[0.4em] text-foreground/60">Caffeine layer · optional</span>
              </div>
              <h3 className="mt-3 font-display text-2xl font-semibold leading-tight tracking-tight md:text-3xl">
                I run on coffee
                <span className="font-serif-display italic text-foreground/70"> and </span>
                curiosity.
              </h3>
              <p className="mt-2 max-w-md text-sm leading-relaxed text-foreground/65">
                If anything I've built sparked an idea — fuel the next late-night experiment.
              </p>
            </div>
            <div className="relative flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-widest text-foreground/40">
                <span>ko-fi.com/subhasish_33</span>
              </div>
              <span className="inline-flex items-center gap-2 rounded-full border border-[oklch(0.88_0.18_200/0.4)] bg-gradient-to-r from-[oklch(0.88_0.18_200/0.18)] to-[oklch(0.55_0.27_295/0.18)] px-5 py-2.5 font-display text-[11px] font-semibold uppercase tracking-[0.3em] text-foreground shadow-[0_0_30px_-6px_oklch(0.88_0.18_200/0.55)] transition-shadow group-hover:shadow-[0_0_45px_-4px_oklch(0.88_0.18_200/0.8)]">
                <span aria-hidden>☕</span>
                Buy me a coffee
                <span className="inline-block transition-transform group-hover:translate-x-1">→</span>
              </span>
            </div>
          </div>
        </motion.a>

        {/* Direct contact strip */}
        <div className="mt-20 flex flex-wrap items-center gap-x-8 gap-y-3 border-t border-white/10 pt-8 font-mono text-[11px] uppercase tracking-widest text-foreground/50">
          <span>direct →</span>
          <a href="mailto:sahusubhasish6@gmail.com" className="hover:text-foreground" data-cursor-hover>sahusubhasish6@gmail.com</a>
          <a href="https://wa.me/919348802996" target="_blank" rel="noopener noreferrer" className="hover:text-foreground" data-cursor-hover>whatsapp</a>
          <a href="https://github.com/Subhasish-33" target="_blank" rel="noopener noreferrer" className="hover:text-foreground" data-cursor-hover>github</a>
          <a href="https://www.linkedin.com/in/subhasish-kumar-sahu-847545310/" target="_blank" rel="noopener noreferrer" className="hover:text-foreground" data-cursor-hover>linkedin</a>
          <a href="https://x.com/Sic_Subhasish" target="_blank" rel="noopener noreferrer" className="hover:text-foreground" data-cursor-hover>x / twitter</a>
          <a href="https://leetcode.com/u/Schrodingers_cat33/" target="_blank" rel="noopener noreferrer" className="hover:text-foreground" data-cursor-hover>leetcode</a>
          <a href="/Subhasish_Kumar_Sahu_Resume.pdf" target="_blank" rel="noopener noreferrer" className="hover:text-foreground" data-cursor-hover>résumé ↓</a>
        </div>

        <PageFooterStamp readingMinutes={2} updatedDate="18.04.2026" />
      </div>
    </section>
  );
}

/* ──────────────────────────────────────────────────────────
   ContactField — wraps Field with focus/blur callbacks
────────────────────────────────────────────────────────── */
function ContactField({
  label,
  value,
  onChange,
  type = "text",
  multiline,
  error,
  onFocus,
  onBlur,
  hint,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  multiline?: boolean;
  error?: string;
  onFocus?: () => void;
  onBlur?: () => void;
  hint?: string;
}) {
  const [isFocused, setIsFocused] = useState(false);
  const Element = multiline ? "textarea" : "input";

  return (
    <div className="relative">
      <div className="flex items-center justify-between">
        <label className="font-display text-[10px] uppercase tracking-[0.4em] text-foreground/50">
          {label}
        </label>
        {hint && isFocused && (
          <motion.span
            initial={{ opacity: 0, x: 8 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0 }}
            className="font-mono text-[9px] text-[oklch(0.88_0.18_200/0.6)]"
          >
            {hint}
          </motion.span>
        )}
      </div>
      <Element
        type={multiline ? undefined : (type as never)}
        rows={multiline ? 4 : undefined}
        value={value}
        onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
          onChange(e.target.value)
        }
        onFocus={() => { setIsFocused(true); onFocus?.(); }}
        onBlur={() => { setIsFocused(false); onBlur?.(); }}
        className="mt-3 w-full resize-none border-0 border-b border-white/15 bg-transparent pb-3 pt-1 text-lg text-foreground outline-none transition-colors placeholder:text-foreground/30 focus:border-transparent"
        data-cursor-hover
      />
      <motion.span
        initial={false}
        animate={{ scaleX: isFocused ? 1 : 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="absolute -bottom-px left-0 right-0 h-px origin-left bg-gradient-to-r from-[oklch(0.88_0.18_200)] to-[oklch(0.55_0.27_295)] shadow-[0_0_10px_oklch(0.88_0.18_200)]"
      />
      {error && (
        <p className="mt-2 font-mono text-[10px] uppercase tracking-widest text-destructive">
          ! {error}
        </p>
      )}
    </div>
  );
}
