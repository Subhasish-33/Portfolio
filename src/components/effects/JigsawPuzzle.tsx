import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import { motion, AnimatePresence, type PanInfo } from "framer-motion";
import heroPortrait from "@/assets/hero-card-portrait.jpg";

/* ──────────────────────────────────────────────────────────
   Config
────────────────────────────────────────────────────────── */
const GRID = 3;
const BOARD_PX = 420;                          // square puzzle board
const PIECE = BOARD_PX / GRID;                 // 140px per piece
const TAB = PIECE * 0.22;                      // tab depth
const SNAP_R = 24;                             // snap radius (px)

/* ──────────────────────────────────────────────────────────
   Edge system — interlocking jigsaw pieces.
   0 = flat border, 1 = tab outward, -1 = blank (cut in).
   Adjacent pieces are MIRRORED (tab ↔ blank). Combined with the
   symmetric `hEdge` curve below, both pieces trace IDENTICAL
   absolute geometry on the shared seam → zero gap on lock.
────────────────────────────────────────────────────────── */
type Edge = 0 | 1 | -1;
interface PieceEdges { top: Edge; right: Edge; bottom: Edge; left: Edge }

function buildEdges(): PieceEdges[][] {
  const grid: PieceEdges[][] = Array.from({ length: GRID }, () =>
    Array.from({ length: GRID }, () => ({ top: 0, right: 0, bottom: 0, left: 0 }))
  );
  const hSeam: Edge[] = [1, -1, 1, -1, 1, -1];
  const vSeam: Edge[] = [-1, 1, -1, 1, -1, 1];
  let hi = 0;
  for (let r = 0; r < GRID - 1; r++) {
    for (let c = 0; c < GRID; c++) {
      const e = hSeam[hi++ % hSeam.length];
      grid[r][c].bottom = e;
      grid[r + 1][c].top = (-e) as Edge;
    }
  }
  let vi = 0;
  for (let r = 0; r < GRID; r++) {
    for (let c = 0; c < GRID - 1; c++) {
      const e = vSeam[vi++ % vSeam.length];
      grid[r][c].right = e;
      grid[r][c + 1].left = (-e) as Edge;
    }
  }
  return grid;
}

/* ──────────────────────────────────────────────────────────
   Canonical horizontal edge curve, drawn LEFT→RIGHT along y=0.
   `dir`: 1 = tab pushes UP (negative y), -1 = blank cuts UP.
   Returns sequence of segments to append after a starting M/L at (0,0).
   Mirrored/rotated for the other 3 sides so seams trace identical curves.
────────────────────────────────────────────────────────── */
function hEdge(dir: Edge): string {
  const s = PIECE;
  const t = TAB;
  if (dir === 0) return ` l ${s} 0`;
  // Tab points "up" (negative y) when dir = 1
  const ty = -dir * t;
  // Symmetric control points — neck at 35%, bulb at 50%
  const neck = s * 0.35;
  const shoulder = s * 0.50;
  const bulb = s * 0.65;
  return [
    ` l ${neck} 0`,
    ` c ${(shoulder - neck) * 0.4} 0, ${-(bulb - shoulder) * 0.4} ${ty}, ${shoulder - neck} ${ty}`,
    ` c ${(bulb - shoulder) * 1.4} 0, ${-(bulb - shoulder) * 0.4 + (bulb - shoulder)} ${-ty}, ${bulb - neck} 0`,
    ` l ${s - bulb} 0`,
  ].join("");
}

/* Build full piece path. Travels TL→TR→BR→BL→TL.
   On opposite sides we negate `dir` so the curve drawn on the
   shared seam from the neighbour's perspective is identical. */
function buildPiecePath(edges: PieceEdges): string {
  const top = hEdge(edges.top);                       // L→R, tab up
  const right = rotateEdge(hEdge(edges.right), 90);   // T→B, tab right
  const bottom = rotateEdge(hEdge(edges.bottom), 180); // R→L, tab down
  const left = rotateEdge(hEdge(edges.left), 270);    // B→T, tab left
  return `M 0 0${top}${right}${bottom}${left} Z`;
}

/* Rotate a relative-coordinate sub-path by 0/90/180/270 degrees.
   Operates on `l` and `c` commands with relative deltas only.
   This guarantees opposite sides trace the SAME curve when shared. */
function rotateEdge(path: string, deg: number): string {
  if (deg === 0) return path;
  const tokens = path.trim().split(/[\s,]+/).filter(Boolean);
  const out: string[] = [];
  let i = 0;
  const rotPt = (x: number, y: number): [number, number] => {
    if (deg === 90) return [-y, x];
    if (deg === 180) return [-x, -y];
    if (deg === 270) return [y, -x];
    return [x, y];
  };
  while (i < tokens.length) {
    const cmd = tokens[i++];
    if (cmd === "l") {
      const [x, y] = rotPt(parseFloat(tokens[i]), parseFloat(tokens[i + 1]));
      i += 2;
      out.push(`l ${x} ${y}`);
    } else if (cmd === "c") {
      const [x1, y1] = rotPt(parseFloat(tokens[i]), parseFloat(tokens[i + 1]));
      const [x2, y2] = rotPt(parseFloat(tokens[i + 2]), parseFloat(tokens[i + 3]));
      const [x3, y3] = rotPt(parseFloat(tokens[i + 4]), parseFloat(tokens[i + 5]));
      i += 6;
      out.push(`c ${x1} ${y1}, ${x2} ${y2}, ${x3} ${y3}`);
    } else {
      out.push(cmd);
    }
  }
  return " " + out.join(" ");
}

/* Padding so tabs aren't clipped */
const VB_PAD = TAB + 4;
const VB_SIZE = PIECE + VB_PAD * 2;

/* ──────────────────────────────────────────────────────────
   Confetti on completion
────────────────────────────────────────────────────────── */
function NeonConfetti() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const c = ref.current; if (!c) return;
    const ctx = c.getContext("2d")!;
    c.width = c.offsetWidth; c.height = c.offsetHeight;
    const cols = ["#00f0ff", "#a855f7", "#e879f9", "#fff", "#7dd3fc"];
    const ps = Array.from({ length: 140 }, () => ({
      x: Math.random() * c.width,
      y: -10 - Math.random() * 60,
      vx: (Math.random() - 0.5) * 5,
      vy: Math.random() * 3 + 1,
      col: cols[Math.floor(Math.random() * cols.length)],
      r: Math.random() * 5 + 2,
      life: 1,
    }));
    let raf: number;
    const tick = () => {
      ctx.clearRect(0, 0, c.width, c.height);
      for (const p of ps) {
        p.x += p.vx; p.y += p.vy; p.vy += 0.1; p.life -= 0.009;
        if (p.life <= 0) continue;
        ctx.globalAlpha = p.life; ctx.fillStyle = p.col;
        ctx.shadowBlur = 10; ctx.shadowColor = p.col;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.fill();
      }
      ctx.globalAlpha = 1; ctx.shadowBlur = 0;
      if (ps.some((p) => p.life > 0)) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);
  return <canvas ref={ref} className="pointer-events-none absolute inset-0 z-30 h-full w-full" />;
}

/* ──────────────────────────────────────────────────────────
   Piece state
────────────────────────────────────────────────────────── */
interface PieceState {
  id: number;
  row: number;
  col: number;
  homeX: number;
  homeY: number;
  x: number;
  y: number;
  rot: number;
  locked: boolean;
  zIndex: number;
}

/* ──────────────────────────────────────────────────────────
   Main puzzle
────────────────────────────────────────────────────────── */
export function JigsawPuzzle({ onClose }: { onClose: () => void }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [pieces, setPieces] = useState<PieceState[]>([]);
  const [draggingId, setDraggingId] = useState<number | null>(null);
  const [won, setWon] = useState(false);
  const [showThanks, setShowThanks] = useState(false);
  const zCounterRef = useRef(10);

  const edgeGrid = useMemo(buildEdges, []);
  const piecePaths = useMemo(
    () => edgeGrid.map((row) => row.map(buildPiecePath)),
    [edgeGrid],
  );

  const SCATTER_PAD = 130;
  const CONT_W = BOARD_PX + SCATTER_PAD * 2;
  const CONT_H = BOARD_PX + SCATTER_PAD * 2;
  const BOARD_OFFSET = SCATTER_PAD;

  /* Initialize / shuffle pieces */
  const initPieces = useCallback(() => {
    const arr: PieceState[] = [];
    let id = 0;
    for (let r = 0; r < GRID; r++) {
      for (let c = 0; c < GRID; c++) {
        const homeX = BOARD_OFFSET + c * PIECE - VB_PAD;
        const homeY = BOARD_OFFSET + r * PIECE - VB_PAD;
        const side = Math.floor(Math.random() * 4);
        let sx = 0, sy = 0;
        if (side === 0) {
          sx = Math.random() * (CONT_W - VB_SIZE);
          sy = Math.random() * (BOARD_OFFSET - VB_SIZE * 0.3);
        } else if (side === 1) {
          sx = BOARD_OFFSET + BOARD_PX + Math.random() * Math.max(1, SCATTER_PAD - VB_SIZE * 0.6);
          sy = Math.random() * (CONT_H - VB_SIZE);
        } else if (side === 2) {
          sx = Math.random() * (CONT_W - VB_SIZE);
          sy = BOARD_OFFSET + BOARD_PX + Math.random() * Math.max(1, SCATTER_PAD - VB_SIZE * 0.6);
        } else {
          sx = Math.random() * (BOARD_OFFSET - VB_SIZE * 0.3);
          sy = Math.random() * (CONT_H - VB_SIZE);
        }
        arr.push({
          id: id++, row: r, col: c,
          homeX, homeY, x: sx, y: sy,
          rot: (Math.random() - 0.5) * 30,
          locked: false, zIndex: 1,
        });
      }
    }
    setPieces(arr);
    setWon(false);
    setShowThanks(false);
    setDraggingId(null);
    zCounterRef.current = 10;
  }, [BOARD_OFFSET, CONT_W, CONT_H, SCATTER_PAD]);

  useEffect(() => { initPieces(); }, [initPieces]);

  /* Win detection */
  useEffect(() => {
    if (pieces.length && pieces.every((p) => p.locked) && !won) {
      setWon(true);
      const t1 = setTimeout(() => setShowThanks(true), 800);
      const t2 = setTimeout(() => onClose(), 4400);
      return () => { clearTimeout(t1); clearTimeout(t2); };
    }
  }, [pieces, won, onClose]);

  const handleDragStart = (id: number) => {
    setDraggingId(id);
    zCounterRef.current += 1;
    const z = zCounterRef.current;
    setPieces((ps) => ps.map((p) => p.id === id ? { ...p, zIndex: z } : p));
  };

  const handleDragEnd = (id: number, info: PanInfo) => {
    setPieces((ps) =>
      ps.map((p) => {
        if (p.id !== id) return p;
        const newX = p.x + info.offset.x;
        const newY = p.y + info.offset.y;
        const dist = Math.hypot(newX - p.homeX, newY - p.homeY);
        if (dist < SNAP_R) {
          return { ...p, x: p.homeX, y: p.homeY, rot: 0, locked: true };
        }
        return { ...p, x: newX, y: newY };
      })
    );
    setDraggingId(null);
  };

  const solved = pieces.filter((p) => p.locked).length;
  const progress = pieces.length ? (solved / pieces.length) * 100 : 0;

  // Responsive max-width — use a CSS max-width rather than window check
  const containerScale = `min(1, calc((100vw - 48px) / ${CONT_W + 48}px))`;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.93, y: 24 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, y: 16 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      className="glass-strong noise relative flex flex-col overflow-hidden rounded-3xl border border-white/15"
      style={{ width: CONT_W + 48, maxWidth: "96vw" }}
    >
      {/* ─── Header ─── */}
      <div className="flex w-full items-center justify-between border-b border-white/5 px-6 pt-5 pb-4">
        <div className="flex items-center gap-2.5">
          <span className="h-1.5 w-1.5 rounded-full bg-[oklch(0.88_0.18_200)] shadow-[0_0_8px_oklch(0.88_0.18_200)]" />
          <span className="font-display text-[10px] uppercase tracking-[0.4em] text-foreground/60">
            Jigsaw — assemble the operator
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="font-mono text-[10px] tabular-nums text-foreground/40">
            {solved.toString().padStart(2, "0")}/{(GRID * GRID).toString().padStart(2, "0")}
          </span>
          <button
            onClick={initPieces}
            className="font-mono text-[10px] uppercase tracking-widest text-foreground/40 transition-colors hover:text-foreground"
            data-cursor-hover
          >
            shuffle
          </button>
          <button
            onClick={onClose}
            className="flex h-6 w-6 items-center justify-center rounded-full border border-white/10 bg-white/5 font-mono text-[10px] text-foreground/40 transition-colors hover:border-white/30 hover:text-foreground"
            data-cursor-hover
          >
            ✕
          </button>
        </div>
      </div>

      {/* ─── Progress rail ─── */}
      <div className="relative h-px w-full bg-white/[0.04]">
        <motion.div
          className="absolute inset-y-0 left-0 bg-gradient-to-r from-[oklch(0.88_0.18_200)] to-[oklch(0.55_0.27_295)] shadow-[0_0_10px_oklch(0.88_0.18_200/0.6)]"
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        />
      </div>

      {/* ─── Puzzle stage (scaled down on small screens) ─── */}
      <div className="relative flex items-center justify-center overflow-hidden p-4 sm:p-6">
        <div
          style={{
            width: CONT_W,
            height: CONT_H,
            transform: `scale(${containerScale})`,
            transformOrigin: "center center",
          }}
        >
          <div
            ref={containerRef}
            className="relative select-none"
            style={{ width: CONT_W, height: CONT_H, touchAction: "none" }}
          >
            {/* Board zone — ghost hint */}
            <div
              className="absolute overflow-hidden rounded-xl border border-dashed border-white/10"
              style={{
                left: BOARD_OFFSET, top: BOARD_OFFSET,
                width: BOARD_PX, height: BOARD_PX,
                background: "oklch(1 0 0 / 0.015)",
              }}
            >
              <img
                src={heroPortrait}
                alt=""
                aria-hidden
                draggable={false}
                className="pointer-events-none h-full w-full object-cover opacity-[0.08]"
                style={{ filter: "grayscale(0.4) blur(1px)" }}
              />
              <svg
                viewBox={`0 0 ${BOARD_PX} ${BOARD_PX}`}
                className="pointer-events-none absolute inset-0 h-full w-full"
                aria-hidden
              >
                {Array.from({ length: GRID + 1 }).map((_, i) => (
                  <g key={i} stroke="oklch(1 0 0 / 0.05)" strokeWidth="0.5">
                    <line x1={i * PIECE} y1={0} x2={i * PIECE} y2={BOARD_PX} />
                    <line x1={0} y1={i * PIECE} x2={BOARD_PX} y2={i * PIECE} />
                  </g>
                ))}
              </svg>
            </div>

            {/* Pieces */}
            {pieces.map((p) => {
              const path = piecePaths[p.row][p.col];
              const clipId = `pclip-${p.id}`;
              const imgX = -p.col * PIECE + VB_PAD;
              const imgY = -p.row * PIECE + VB_PAD;

              return (
                <motion.div
                  key={p.id}
                  drag={!p.locked && !won}
                  dragMomentum={false}
                  dragElastic={0}
                  onDragStart={() => handleDragStart(p.id)}
                  onDragEnd={(_, info) => handleDragEnd(p.id, info)}
                  initial={false}
                  animate={{
                    x: p.x,
                    y: p.y,
                    rotate: p.rot,
                    scale: draggingId === p.id ? 1.06 : 1,
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 320,
                    damping: 28,
                    mass: 0.6,
                  }}
                  style={{
                    position: "absolute",
                    width: VB_SIZE,
                    height: VB_SIZE,
                    zIndex: p.locked ? 5 : draggingId === p.id ? 100 : p.zIndex,
                    cursor: p.locked ? "default" : draggingId === p.id ? "grabbing" : "grab",
                    transformOrigin: "center",
                    filter: p.locked
                      ? "drop-shadow(0 0 10px oklch(0.88 0.18 200 / 0.85))"
                      : draggingId === p.id
                        ? "drop-shadow(0 16px 30px rgba(0,0,0,0.65))"
                        : "drop-shadow(0 4px 10px rgba(0,0,0,0.45))",
                    transition: "filter 0.25s ease",
                  }}
                >
                  <svg
                    viewBox={`0 0 ${VB_SIZE} ${VB_SIZE}`}
                    width={VB_SIZE}
                    height={VB_SIZE}
                    className="block overflow-visible"
                  >
                    <defs>
                      <clipPath id={clipId}>
                        <path d={path} transform={`translate(${VB_PAD} ${VB_PAD})`} />
                      </clipPath>
                    </defs>

                    {/* Image rendered through clip */}
                    <g clipPath={`url(#${clipId})`}>
                      <image
                        href={heroPortrait}
                        x={imgX}
                        y={imgY}
                        width={BOARD_PX}
                        height={BOARD_PX}
                        preserveAspectRatio="xMidYMid slice"
                      />
                    </g>

                    {/* Outline stroke */}
                    <path
                      d={path}
                      transform={`translate(${VB_PAD} ${VB_PAD})`}
                      fill="none"
                      stroke={p.locked ? "oklch(0.88 0.18 200 / 0.95)" : "oklch(1 0 0 / 0.4)"}
                      strokeWidth={p.locked ? 1.5 : 1}
                      style={{
                        transition: "stroke 0.25s ease, stroke-width 0.25s ease",
                      }}
                    />
                  </svg>
                </motion.div>
              );
            })}

            {/* Confetti when complete */}
            {won && <NeonConfetti />}
          </div>
        </div>
      </div>

      {/* ─── Footer ─── */}
      <div className="flex items-center justify-between gap-3 border-t border-white/5 px-6 py-3">
        <p className="font-mono text-[9px] uppercase tracking-[0.25em] text-foreground/30">
          drag → snap within {SNAP_R}px
        </p>
        <p className="font-mono text-[9px] uppercase tracking-[0.25em] text-foreground/30">
          {won ? "system online" : "assembling…"}
        </p>
      </div>

      {/* ─── Win overlay ─── */}
      <AnimatePresence>
        {showThanks && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-40 flex flex-col items-center justify-center backdrop-blur-md"
            style={{ background: "oklch(0.06 0.005 270 / 0.7)" }}
          >
            <motion.div
              initial={{ scale: 0.7, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 280, damping: 20 }}
              className="text-center"
            >
              <motion.p
                animate={{
                  textShadow: [
                    "0 0 18px oklch(0.88 0.18 200 / 0.6)",
                    "0 0 36px oklch(0.55 0.27 295 / 1)",
                    "0 0 18px oklch(0.88 0.18 200 / 0.6)",
                  ],
                }}
                transition={{ duration: 1.6, repeat: Infinity }}
                className="font-display text-3xl font-bold text-foreground"
              >
                ✦ system online
              </motion.p>
              <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.3em] text-[oklch(0.88_0.18_200)]">
                operator assembled
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
