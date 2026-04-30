import { useEffect, useState } from "react";

interface TerminalLine {
  prompt?: string;
  text: string;
  color?: string;
}

const LINES: TerminalLine[] = [
  { prompt: "> whoami", text: "subhasish kumar sahu — ai engineer · full stack · data systems", color: "cyan" },
  { prompt: "> location", text: "bhubaneswar, odisha · india" },
  { prompt: "> education", text: "B.Tech CSE @ C.V. Raman Global University · 8.7 CGPA" },
  { prompt: "> training", text: "Data Science (IIT Guwahati × Masai × NSDC) · 600+ hrs" },
  { prompt: "> stack.ai", text: "PyTorch · LangChain · RAG · PPO/RL · ChromaDB · Scikit-learn" },
  { prompt: "> stack.backend", text: "FastAPI · Node · Express · MongoDB · PostgreSQL · Redis · Docker" },
  { prompt: "> stack.frontend", text: "React · TypeScript · Tailwind · Framer Motion" },
  { prompt: "> focus", text: "RAG, RL, realtime systems, dashboards that explain the signal", color: "violet" },
  { prompt: "> status", text: "OPEN_TO_OPPORTUNITIES", color: "cyan" },
];

export function Typewriter() {
  const [index, setIndex] = useState(0);
  const [chars, setChars] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (index >= LINES.length) {
      setDone(true);
      return;
    }
    const line = LINES[index];
    const total = (line.prompt?.length ?? 0) + line.text.length + 1;
    if (chars < total) {
      const t = setTimeout(() => setChars((c) => c + 1), 22);
      return () => clearTimeout(t);
    } else {
      const t = setTimeout(() => {
        setIndex((i) => i + 1);
        setChars(0);
      }, 380);
      return () => clearTimeout(t);
    }
  }, [chars, index]);

  return (
    <div className="font-mono text-[13px] leading-7 text-foreground/85">
      {LINES.slice(0, index).map((l, i) => (
        <RenderedLine key={i} line={l} />
      ))}
      {index < LINES.length && (
        <PartialLine line={LINES[index]} chars={chars} />
      )}
      {done && (
        <div className="mt-2 flex items-center gap-2 text-[oklch(0.88_0.18_200)]">
          <span>$</span>
          <span className="inline-block h-4 w-2 animate-pulse bg-[oklch(0.88_0.18_200)]" />
        </div>
      )}
    </div>
  );
}

function RenderedLine({ line }: { line: TerminalLine }) {
  return (
    <div>
      {line.prompt && <span className="text-[oklch(0.55_0.27_295)]">{line.prompt} </span>}
      <span className={colorClass(line.color)}>{line.text}</span>
    </div>
  );
}

function PartialLine({ line, chars }: { line: TerminalLine; chars: number }) {
  const promptLen = line.prompt?.length ?? 0;
  const promptShown = line.prompt?.slice(0, Math.min(chars, promptLen)) ?? "";
  const space = chars > promptLen ? " " : "";
  const textShown = line.text.slice(0, Math.max(0, chars - promptLen - 1));
  return (
    <div>
      <span className="text-[oklch(0.55_0.27_295)]">{promptShown}</span>
      <span>{space}</span>
      <span className={colorClass(line.color)}>{textShown}</span>
      <span className="ml-0.5 inline-block h-4 w-2 animate-pulse bg-[oklch(0.88_0.18_200)] align-middle" />
    </div>
  );
}

function colorClass(color?: string) {
  if (color === "cyan") return "text-[oklch(0.88_0.18_200)]";
  if (color === "violet") return "text-[oklch(0.7_0.22_295)]";
  return "text-foreground/85";
}
