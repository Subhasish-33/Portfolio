import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Line {
  type: "cmd" | "output" | "blank";
  text: string;
}

const COMMANDS: Record<string, string[]> = {
  help: [
    "  Available commands:",
    "  ─────────────────────────────────────────",
    "  cat about       → who is this person?",
    "  ls projects     → list all projects",
    "  open resume     → open PDF in new tab",
    "  skills          → print tech stack",
    "  contact         → show contact info",
    "  clear           → clear terminal",
    "  exit            → close terminal",
  ],
  "cat about": [
    "  Name:       Subhasish Kumar Sahu",
    "  Role:       Full-Stack AI Engineer",
    "  Location:   Bhubaneswar, Odisha, India",
    "  Education:  B.Tech CSE · CVR University · 8.7 CGPA",
    "  Training:   Data Science — IIT Guwahati × Masai × NSDC",
    "  Timezone:   IST — async friendly with US windows",
    "  Status:     ● available for select engagements",
    "",
    "  I design systems where raw data becomes",
    "  an experience people can actually trust.",
  ],
  "ls projects": [
    "  drwxr-xr-x  bhubaneswar-energy-twin/   [AI · PPO · FastAPI]",
    "  drwxr-xr-x  oyeee.chat/                [Realtime · Socket.io · Redis]",
    "  drwxr-xr-x  customer-churn/            [ML · Scikit-learn · Pandas]",
    "  drwxr-xr-x  job-tracker/               [React · Supabase · Auth]",
    "",
    "  → visit /projects for full write-ups",
  ],
  "open resume": [
    "  Opening Subhasish_Kumar_Sahu_Resume.pdf …",
    "  ✓ Launched in new tab.",
  ],
  skills: [
    "  Languages:   Python · TypeScript · JavaScript · SQL",
    "  AI/ML:       PyTorch · LangChain · Scikit-learn · Hugging Face",
    "  Backend:     FastAPI · Node.js · Express · PostgreSQL · MongoDB",
    "  Frontend:    React · Next.js · Tailwind · Framer Motion",
    "  Infra:       Docker · AWS · Redis · ChromaDB",
    "  Concepts:    RAG · RL (PPO) · REST · WebSockets · JWT",
  ],
  contact: [
    "  Email:     sahusubhasish6@gmail.com",
    "  GitHub:    github.com/Subhasish-33",
    "  LinkedIn:  linkedin.com/in/subhasish-kumar-sahu-847545310",
    "  Twitter/X: x.com/Sic_Subhasish",
    "  WhatsApp:  +91 93488 02996",
  ],
  clear: [],
  exit: [],
};

export function EasterEggTerminal() {
  const [open, setOpen] = useState(false);
  const [lines, setLines] = useState<Line[]>([
    { type: "output", text: "  ether-weave · zsh 5.9 — type help to begin" },
    { type: "blank", text: "" },
  ]);
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [histIdx, setHistIdx] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const openListener = () => setOpen(true);
    window.addEventListener("open-terminal", openListener);

    // Global "type anywhere to open" — detect "help" typed anywhere
    let buffer = "";
    const keyListener = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.key === "Escape") { setOpen(false); buffer = ""; return; }
      if (e.key.length === 1) {
        buffer += e.key.toLowerCase();
        if (buffer.endsWith("help")) {
          setOpen(true);
          buffer = "";
        }
        if (buffer.length > 20) buffer = buffer.slice(-10);
      }
    };
    window.addEventListener("keydown", keyListener);
    return () => {
      window.removeEventListener("open-terminal", openListener);
      window.removeEventListener("keydown", keyListener);
    };
  }, []);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 100);
  }, [open]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [lines]);

  const run = (cmd: string) => {
    const trimmed = cmd.trim().toLowerCase();
    const newLines: Line[] = [...lines, { type: "cmd", text: `subhasish@portfolio:~$ ${cmd}` }];

    if (trimmed === "exit") {
      setOpen(false);
      setLines([{ type: "output", text: "  ether-weave · zsh 5.9 — type help to begin" }, { type: "blank", text: "" }]);
      return;
    }

    if (trimmed === "clear") {
      setLines([{ type: "output", text: "  ether-weave · zsh 5.9 — type help to begin" }, { type: "blank", text: "" }]);
      setInput("");
      return;
    }

    if (trimmed === "open resume") {
      window.open("/Subhasish_Kumar_Sahu_Resume.pdf", "_blank");
    }

    const result = COMMANDS[trimmed];
    if (result !== undefined) {
      result.forEach((l) => newLines.push({ type: "output", text: l }));
    } else {
      newLines.push({ type: "output", text: `  zsh: command not found: ${cmd}` });
      newLines.push({ type: "output", text: `  Type 'help' for available commands.` });
    }
    newLines.push({ type: "blank", text: "" });
    setLines(newLines);
    setHistory((h) => [cmd, ...h.filter((x) => x !== cmd)]);
    setHistIdx(-1);
    setInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") { run(input); }
    else if (e.key === "ArrowUp") {
      e.preventDefault();
      const idx = Math.min(histIdx + 1, history.length - 1);
      setHistIdx(idx);
      setInput(history[idx] ?? "");
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      const idx = Math.max(histIdx - 1, -1);
      setHistIdx(idx);
      setInput(idx === -1 ? "" : history[idx]);
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-[400] bg-black/80 backdrop-blur-md"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 20 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="fixed inset-4 z-[401] flex flex-col overflow-hidden rounded-2xl border border-white/15 bg-[oklch(0.05_0.003_270)] shadow-[0_40px_100px_rgba(0,0,0,0.9)] md:inset-16"
          >
            {/* Title bar */}
            <div className="flex items-center justify-between border-b border-white/10 bg-white/[0.02] px-4 py-2.5">
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setOpen(false)}
                  className="h-3 w-3 rounded-full bg-[#ff5f57] transition-opacity hover:opacity-80"
                />
                <span className="h-3 w-3 rounded-full bg-[#febc2e]" />
                <span className="h-3 w-3 rounded-full bg-[#28c840]" />
              </div>
              <span className="font-mono text-[10px] uppercase tracking-widest text-foreground/40">
                subhasish@portfolio · ~/interactive
              </span>
              <span className="font-mono text-[10px] text-foreground/30">zsh</span>
            </div>

            {/* Output */}
            <div
              className="flex-1 overflow-y-auto p-6 font-mono text-xs leading-6 text-[oklch(0.88_0.18_200/0.85)]"
              onClick={() => inputRef.current?.focus()}
            >
              {lines.map((l, i) => (
                <div
                  key={i}
                  className={
                    l.type === "cmd"
                      ? "text-[oklch(0.88_0.18_200)]"
                      : l.type === "blank"
                      ? "h-2"
                      : "text-foreground/70"
                  }
                >
                  {l.text}
                </div>
              ))}

              {/* Prompt */}
              <div className="flex items-center gap-2">
                <span className="text-[oklch(0.88_0.18_200)]">subhasish@portfolio:~$</span>
                <input
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  spellCheck={false}
                  className="flex-1 bg-transparent text-[oklch(0.88_0.18_200)] outline-none caret-[oklch(0.88_0.18_200)]"
                  autoComplete="off"
                />
              </div>
              <div ref={bottomRef} />
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
