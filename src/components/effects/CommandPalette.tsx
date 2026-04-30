import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "@tanstack/react-router";

interface Command {
  id: string;
  label: string;
  sub?: string;
  shortcut?: string;
  icon: string;
  action: () => void;
  group: string;
}

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const COMMANDS: Command[] = [
    {
      id: "home", label: "Go to Home", sub: "Neural field hero", icon: "⌂", group: "Navigate",
      action: () => { navigate({ to: "/" }); setOpen(false); },
    },
    {
      id: "about", label: "Go to About", sub: "System prompt / bio", icon: "◈", group: "Navigate",
      action: () => { navigate({ to: "/about" }); setOpen(false); },
    },
    {
      id: "projects", label: "Go to Projects", sub: "Selected work gallery", icon: "◇", group: "Navigate",
      action: () => { navigate({ to: "/projects" }); setOpen(false); },
    },
    {
      id: "analytics", label: "Go to Analytics", sub: "Skill telemetry dashboard", icon: "◎", group: "Navigate",
      action: () => { navigate({ to: "/analytics" }); setOpen(false); },
    },
    {
      id: "vibes", label: "Go to Vibes", sub: "Character map · Dark/Succession", icon: "✦", group: "Navigate",
      action: () => { navigate({ to: "/vibes" }); setOpen(false); },
    },
    {
      id: "contact", label: "Go to Contact", sub: "Send a message", icon: "◉", group: "Navigate",
      action: () => { navigate({ to: "/contact" }); setOpen(false); },
    },
    {
      id: "resume", label: "Open Résumé", sub: "PDF · 2025", icon: "↗", group: "Actions",
      action: () => { window.open("/Subhasish_Kumar_Sahu_Resume.pdf", "_blank"); setOpen(false); },
    },
    {
      id: "download-resume", label: "Download Résumé", sub: "Save PDF locally", icon: "↓", group: "Actions",
      action: () => {
        const a = document.createElement("a");
        a.href = "/Subhasish_Kumar_Sahu_Resume.pdf";
        a.download = "Subhasish_Kumar_Sahu_Resume.pdf";
        a.click();
        setOpen(false);
      },
    },
    {
      id: "copy-email", label: "Copy Email", sub: "sahusubhasish6@gmail.com", icon: "@", group: "Actions",
      action: () => {
        navigator.clipboard.writeText("sahusubhasish6@gmail.com");
        setOpen(false);
      },
    },
    {
      id: "github", label: "Open GitHub", sub: "github.com/Subhasish-33", icon: "⌥", group: "Actions",
      action: () => { window.open("https://github.com/Subhasish-33", "_blank"); setOpen(false); },
    },
    {
      id: "linkedin", label: "Open LinkedIn", sub: "linkedin.com/in/...", icon: "⌀", group: "Actions",
      action: () => { window.open("https://www.linkedin.com/in/subhasish-kumar-sahu-847545310/", "_blank"); setOpen(false); },
    },
    {
      id: "terminal", label: "Open Terminal", sub: "Easter-egg zsh — type help", icon: "❯", group: "Easter Egg",
      shortcut: "help",
      action: () => { window.dispatchEvent(new CustomEvent("open-terminal")); setOpen(false); },
    },
  ];

  const filtered = COMMANDS.filter((c) =>
    !query || c.label.toLowerCase().includes(query.toLowerCase()) || (c.sub && c.sub.toLowerCase().includes(query.toLowerCase()))
  );

  const groups = [...new Set(filtered.map((c) => c.group))];

  useEffect(() => {
    setSelected(0);
  }, [query]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen((prev) => !prev);
        setQuery("");
      }
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 50);
  }, [open]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelected((s) => Math.min(s + 1, filtered.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelected((s) => Math.max(s - 1, 0));
    } else if (e.key === "Enter") {
      filtered[selected]?.action();
    }
  };

  let itemIndex = -1;

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-[300] bg-black/60 backdrop-blur-sm"
          />

          {/* Palette */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
            className="fixed left-1/2 top-[20vh] z-[301] w-full max-w-lg -translate-x-1/2 overflow-hidden rounded-2xl border border-white/15 bg-[oklch(0.09_0.01_270)] shadow-[0_32px_80px_oklch(0_0_0/0.8)]"
          >
            {/* Header */}
            <div className="flex items-center gap-3 border-b border-white/10 px-4 py-3">
              <span className="font-mono text-sm text-foreground/40">⌘</span>
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type a command or search..."
                className="flex-1 bg-transparent font-display text-sm text-foreground outline-none placeholder:text-foreground/30"
              />
              <kbd className="rounded border border-white/10 bg-white/5 px-1.5 py-0.5 font-mono text-[10px] text-foreground/40">
                ESC
              </kbd>
            </div>

            {/* Results */}
            <div className="max-h-80 overflow-y-auto p-2">
              {filtered.length === 0 && (
                <div className="px-4 py-8 text-center font-display text-xs text-foreground/40">
                  No commands match "{query}"
                </div>
              )}
              {groups.map((group) => (
                <div key={group}>
                  <div className="px-3 py-1.5 font-display text-[9px] uppercase tracking-[0.4em] text-foreground/30">
                    {group}
                  </div>
                  {filtered
                    .filter((c) => c.group === group)
                    .map((cmd) => {
                      itemIndex++;
                      const idx = itemIndex;
                      return (
                        <motion.button
                          key={cmd.id}
                          onClick={cmd.action}
                          onMouseEnter={() => setSelected(idx)}
                          animate={{
                            backgroundColor:
                              selected === idx
                                ? "oklch(0.88 0.18 200 / 0.10)"
                                : "transparent",
                          }}
                          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors"
                        >
                          <span
                            className="flex h-8 w-8 flex-none items-center justify-center rounded-lg border border-white/10 bg-white/5 font-mono text-sm"
                            style={{ color: selected === idx ? "oklch(0.88 0.18 200)" : undefined }}
                          >
                            {cmd.icon}
                          </span>
                          <div className="min-w-0 flex-1">
                            <div className="font-display text-sm text-foreground">
                              {cmd.label}
                            </div>
                            {cmd.sub && (
                              <div className="mt-0.5 truncate font-mono text-[10px] text-foreground/40">
                                {cmd.sub}
                              </div>
                            )}
                          </div>
                          {selected === idx && (
                            <kbd className="font-mono text-[10px] text-[oklch(0.88_0.18_200/0.7)]">
                              ↵
                            </kbd>
                          )}
                        </motion.button>
                      );
                    })}
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between border-t border-white/10 px-4 py-2 text-[10px] text-foreground/30">
              <span className="font-mono">↑↓ navigate · ↵ select</span>
              <span className="font-display uppercase tracking-widest">
                ⌘K to close
              </span>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
