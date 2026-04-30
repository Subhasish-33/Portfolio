import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

/* ──────────────────────────────────────────────────────────
   Types
────────────────────────────────────────────────────────── */
type Color = "w" | "b";
type PieceType = "K" | "Q" | "R" | "B" | "N" | "P";

interface Piece {
  type: PieceType;
  color: Color;
}

type Board = (Piece | null)[][];

/* ──────────────────────────────────────────────────────────
   Initial position  — "Mate in 2" puzzle
   White: Qh5 Nf5 Bd4 Rf2 Kh2 Pa2 Pd3 Pg4 Ph3
   Black: Kg8 Qc6 Rf8 Re6 Ne7 Nh7 Pa7 Pf7 Ph6 Pb5
────────────────────────────────────────────────────────── */
const sq = (file: string, rank: number) => ({ file, rank }); // helper type

function buildInitialBoard(): Board {
  const b: Board = Array.from({ length: 8 }, () => Array(8).fill(null));

  const place = (piece: Piece, file: string, rank: number) => {
    const col = file.charCodeAt(0) - "a".charCodeAt(0);
    const row = 8 - rank;
    b[row][col] = piece;
  };

  // White pieces
  place({ type: "Q", color: "w" }, "h", 5);
  place({ type: "N", color: "w" }, "f", 5);
  place({ type: "B", color: "w" }, "d", 4);
  place({ type: "R", color: "w" }, "f", 2);
  place({ type: "K", color: "w" }, "h", 2);
  place({ type: "P", color: "w" }, "a", 2);
  place({ type: "P", color: "w" }, "d", 3);
  place({ type: "P", color: "w" }, "g", 4);
  place({ type: "P", color: "w" }, "h", 3);

  // Black pieces
  place({ type: "K", color: "b" }, "g", 8);
  place({ type: "Q", color: "b" }, "c", 6);
  place({ type: "R", color: "b" }, "f", 8);
  place({ type: "R", color: "b" }, "e", 6);
  place({ type: "N", color: "b" }, "e", 7);
  place({ type: "N", color: "b" }, "h", 7);
  place({ type: "P", color: "b" }, "a", 7);
  place({ type: "P", color: "b" }, "f", 7);
  place({ type: "P", color: "b" }, "h", 6);
  place({ type: "P", color: "b" }, "b", 5);

  return b;
}

/* ──────────────────────────────────────────────────────────
   Piece Unicode glyphs
────────────────────────────────────────────────────────── */
const GLYPHS: Record<Color, Record<PieceType, string>> = {
  w: { K: "♔", Q: "♕", R: "♖", B: "♗", N: "♘", P: "♙" },
  b: { K: "♚", Q: "♛", R: "♜", B: "♝", N: "♞", P: "♟" },
};

/* ──────────────────────────────────────────────────────────
   Simple legal-move generator (enough for this puzzle)
   We only need: Queen, Knight, Bishop, Rook, Pawn, King basics
────────────────────────────────────────────────────────── */
function inBounds(r: number, c: number) {
  return r >= 0 && r < 8 && c >= 0 && c < 8;
}

function slidingMoves(board: Board, r: number, c: number, dirs: number[][], color: Color): [number, number][] {
  const moves: [number, number][] = [];
  for (const [dr, dc] of dirs) {
    let nr = r + dr, nc = c + dc;
    while (inBounds(nr, nc)) {
      const target = board[nr][nc];
      if (!target) {
        moves.push([nr, nc]);
      } else {
        if (target.color !== color) moves.push([nr, nc]);
        break;
      }
      nr += dr; nc += dc;
    }
  }
  return moves;
}

function getLegalMoves(board: Board, r: number, c: number): [number, number][] {
  const piece = board[r][c];
  if (!piece) return [];
  const { type, color } = piece;
  const moves: [number, number][] = [];
  const opp = color === "w" ? "b" : "w";

  if (type === "Q") {
    return slidingMoves(board, r, c, [[-1,0],[1,0],[0,-1],[0,1],[-1,-1],[-1,1],[1,-1],[1,1]], color);
  }
  if (type === "R") {
    return slidingMoves(board, r, c, [[-1,0],[1,0],[0,-1],[0,1]], color);
  }
  if (type === "B") {
    return slidingMoves(board, r, c, [[-1,-1],[-1,1],[1,-1],[1,1]], color);
  }
  if (type === "N") {
    for (const [dr, dc] of [[-2,-1],[-2,1],[-1,-2],[-1,2],[1,-2],[1,2],[2,-1],[2,1]]) {
      const nr = r+dr, nc = c+dc;
      if (inBounds(nr,nc) && board[nr][nc]?.color !== color) moves.push([nr,nc]);
    }
    return moves;
  }
  if (type === "K") {
    for (const [dr, dc] of [[-1,-1],[-1,0],[-1,1],[0,-1],[0,1],[1,-1],[1,0],[1,1]]) {
      const nr = r+dr, nc = c+dc;
      if (inBounds(nr,nc) && board[nr][nc]?.color !== color) moves.push([nr,nc]);
    }
    return moves;
  }
  if (type === "P") {
    const dir = color === "w" ? -1 : 1;
    const start = color === "w" ? 6 : 1;
    // Forward
    if (inBounds(r+dir,c) && !board[r+dir][c]) {
      moves.push([r+dir,c]);
      if (r === start && !board[r+2*dir][c]) moves.push([r+2*dir,c]);
    }
    // Captures
    for (const dc of [-1,1]) {
      const nr = r+dir, nc = c+dc;
      if (inBounds(nr,nc) && board[nr][nc]?.color === opp) moves.push([nr,nc]);
    }
    return moves;
  }
  return moves;
}

/* Check detection */
function isInCheck(board: Board, color: Color): boolean {
  let kr = -1, kc = -1;
  for (let r = 0; r < 8; r++) for (let c = 0; c < 8; c++) {
    if (board[r][c]?.type === "K" && board[r][c]?.color === color) { kr = r; kc = c; }
  }
  const opp = color === "w" ? "b" : "w";
  for (let r = 0; r < 8; r++) for (let c = 0; c < 8; c++) {
    if (board[r][c]?.color === opp) {
      const moves = getLegalMoves(board, r, c);
      if (moves.some(([mr,mc]) => mr === kr && mc === kc)) return true;
    }
  }
  return false;
}

function isCheckmate(board: Board, color: Color): boolean {
  if (!isInCheck(board, color)) return false;
  for (let r = 0; r < 8; r++) for (let c = 0; c < 8; c++) {
    if (board[r][c]?.color === color) {
      const moves = getLegalMoves(board, r, c);
      for (const [tr, tc] of moves) {
        const next = board.map(row => [...row]);
        next[tr][tc] = next[r][c];
        next[r][c] = null;
        if (!isInCheck(next, color)) return false;
      }
    }
  }
  return true;
}

/* ──────────────────────────────────────────────────────────
   Props
────────────────────────────────────────────────────────── */
interface ChessBoardProps {
  pulseSquare?: string | null; // e.g. "h5", "f5", "g8"
  onCheckmate?: () => void;     // fired when checkmate detected
}

export function ChessBoard({ pulseSquare = null, onCheckmate }: ChessBoardProps) {
  const [board, setBoard] = useState<Board>(buildInitialBoard);
  const [selected, setSelected] = useState<[number,number] | null>(null);
  const [legalMoves, setLegalMoves] = useState<[number,number][]>([]);
  const [turn, setTurn] = useState<Color>("w");
  const [checkmate, setCheckmate] = useState(false);
  const [inCheck, setInCheck] = useState(false);
  const [lastMove, setLastMove] = useState<{from:[number,number],to:[number,number]} | null>(null);
  const confRef = useRef<HTMLCanvasElement>(null);

  /* Confetti on checkmate */
  useEffect(() => {
    if (!checkmate) return;
    const canvas = confRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    const colors = ["#00f0ff","#a855f7","#e879f9","#fff","#7dd3fc"];
    const particles = Array.from({length:100}, () => ({
      x: Math.random() * canvas.width,
      y: -10 - Math.random() * 40,
      vx: (Math.random()-0.5)*4,
      vy: Math.random()*3+2,
      color: colors[Math.floor(Math.random()*colors.length)],
      size: Math.random()*5+2,
      life: 1,
    }));
    let raf: number;
    const loop = () => {
      ctx.clearRect(0,0,canvas.width,canvas.height);
      for (const p of particles) {
        p.x+=p.vx; p.y+=p.vy; p.vy+=0.08; p.life-=0.008;
        if (p.life < 0) continue;
        ctx.globalAlpha = p.life;
        ctx.fillStyle = p.color;
        ctx.shadowBlur = 8; ctx.shadowColor = p.color;
        ctx.beginPath(); ctx.arc(p.x,p.y,p.size,0,Math.PI*2); ctx.fill();
      }
      ctx.globalAlpha=1; ctx.shadowBlur=0;
      if (particles.some(p=>p.life>0)) raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [checkmate]);

  /* Convert square notation to row/col */
  const sqToRC = (sq: string): [number,number] | null => {
    if (!sq || sq.length < 2) return null;
    const c = sq.charCodeAt(0) - "a".charCodeAt(0);
    const r = 8 - parseInt(sq[1]);
    if (!inBounds(r,c)) return null;
    return [r,c];
  };

  const pulseRC = pulseSquare ? sqToRC(pulseSquare) : null;

  const handleSquareClick = (r: number, c: number) => {
    if (checkmate) return;

    if (selected) {
      const [sr, sc] = selected;
      const isLegal = legalMoves.some(([lr,lc]) => lr===r && lc===c);

      if (isLegal) {
        // Execute move
        const next = board.map(row => [...row]);
        next[r][c] = next[sr][sc];
        next[sr][sc] = null;
        const nextTurn: Color = turn === "w" ? "b" : "w";
        setBoard(next);
        setLastMove({ from:[sr,sc], to:[r,c] });
        setSelected(null);
        setLegalMoves([]);

        // Check conditions
        const oppInCheck = isInCheck(next, nextTurn);
        const oppMated = isCheckmate(next, nextTurn);
        setInCheck(oppInCheck);
        if (oppMated) {
          setCheckmate(true);
          onCheckmate?.();
        } else {
          setTurn(nextTurn);
        }
        return;
      }

      // Deselect if same color piece
      if (board[r][c]?.color === turn) {
        const moves = getLegalMoves(board, r, c);
        setSelected([r,c]);
        setLegalMoves(moves);
        return;
      }

      setSelected(null);
      setLegalMoves([]);
      return;
    }

    // New selection
    if (board[r][c]?.color === turn) {
      const moves = getLegalMoves(board, r, c);
      setSelected([r,c]);
      setLegalMoves(moves);
    }
  };

  const CELL = 52; // px

  return (
    <div
      className="relative select-none rounded-2xl p-3 backdrop-blur-md"
      style={{
        background: "oklch(0.08 0.01 270 / 0.45)",
        border: "1px solid oklch(1 0 0 / 0.06)",
      }}
    >
      {/* Status bar */}
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className={`h-2 w-2 rounded-full ${turn === "w" ? "bg-white shadow-[0_0_8px_white]" : "bg-foreground/30"}`} />
          <span className="font-display text-[10px] uppercase tracking-[0.3em] text-foreground/50">
            {checkmate ? "Checkmate!" : inCheck ? `${turn === "w" ? "White" : "Black"} in check` : `${turn === "w" ? "White" : "Black"} to move`}
          </span>
        </div>
        <div className="font-mono text-[9px] text-foreground/30">Mate in 2 ·  White to move</div>
      </div>

      {/* Board */}
      <div
        className="relative overflow-hidden rounded-xl border border-white/10"
        style={{ width: CELL*8, height: CELL*8 }}
      >
        <canvas ref={confRef} className="pointer-events-none absolute inset-0 z-20 h-full w-full" />

        {/* Checkmate overlay */}
        <AnimatePresence>
          {checkmate && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute inset-0 z-10 flex flex-col items-center justify-center rounded-xl"
              style={{ background: "oklch(0.06 0.005 270 / 0.88)", backdropFilter: "blur(6px)" }}
            >
              <motion.div
                initial={{ scale: 0.7, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 18 }}
                className="text-center"
              >
                <motion.p
                  animate={{ textShadow: ["0 0 20px #00f0ff","0 0 40px #a855f7","0 0 20px #00f0ff"] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="font-display text-3xl font-bold text-foreground"
                >
                  ♚ Checkmate!
                </motion.p>
                <p className="mt-2 font-mono text-[10px] uppercase tracking-widest text-[oklch(0.88_0.18_200)]">
                  Qxh6+ · gxh6 · Nh6#
                </p>
                <p className="mt-3 text-xs text-foreground/50">Grandmaster move. Well played.</p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {Array.from({length:8}, (_,r) =>
          Array.from({length:8}, (_,c) => {
            const isLight = (r+c)%2===0;
            const piece = board[r][c];
            const isSelected = selected?.[0]===r && selected?.[1]===c;
            const isLegal = legalMoves.some(([lr,lc])=>lr===r&&lc===c);
            const isLastFrom = lastMove?.from[0]===r && lastMove?.from[1]===c;
            const isLastTo = lastMove?.to[0]===r && lastMove?.to[1]===c;
            const isPulse = pulseRC && pulseRC[0]===r && pulseRC[1]===c;
            const isCheck = inCheck && piece?.type==="K" && piece?.color===turn;
            const fileLabel = r===7 ? String.fromCharCode("a".charCodeAt(0)+c) : null;
            const rankLabel = c===0 ? String(8-r) : null;

            return (
              <div
                key={`${r}-${c}`}
                onClick={() => handleSquareClick(r,c)}
                className="absolute flex cursor-pointer items-center justify-center"
                style={{
                  left: c*CELL, top: r*CELL, width: CELL, height: CELL,
                  transition: "background-color 0.2s ease-in-out",
                  background: isCheck
                    ? "oklch(0.55 0.25 25 / 0.7)"
                    : isSelected
                    ? "oklch(0.88 0.18 200 / 0.35)"
                    : isLastFrom||isLastTo
                    ? "oklch(0.55 0.27 295 / 0.22)"
                    : isLight
                    ? "oklch(0.85 0.01 240 / 0.12)"
                    : "oklch(0.3 0.02 270 / 0.35)",
                }}
              >
                {/* Pulse ring on active square */}
                {isPulse && !isSelected && (
                  <motion.div
                    className="pointer-events-none absolute inset-0"
                    animate={{ boxShadow: ["inset 0 0 0 2px oklch(0.88 0.18 200 / 0.3)", "inset 0 0 0 2px oklch(0.88 0.18 200 / 0.9)", "inset 0 0 0 2px oklch(0.88 0.18 200 / 0.3)"] }}
                    transition={{ duration: 1.4, repeat: Infinity }}
                  />
                )}

                {/* Legal move dot */}
                {isLegal && (
                  <div
                    className="pointer-events-none absolute rounded-full"
                    style={{
                      width: piece ? CELL-4 : CELL*0.3,
                      height: piece ? CELL-4 : CELL*0.3,
                      background: piece ? "transparent" : "oklch(0.88 0.18 200 / 0.55)",
                      border: piece ? "3px solid oklch(0.88 0.18 200 / 0.7)" : "none",
                      boxShadow: "0 0 8px oklch(0.88 0.18 200 / 0.4)",
                    }}
                  />
                )}

                {/* Piece */}
                {piece && (
                  <motion.span
                    key={`${r}-${c}-${piece.color}-${piece.type}`}
                    initial={{ scale: 0.6, opacity: 0 }}
                    animate={isPulse ? {
                      scale: 1,
                      opacity: 1,
                      filter: ["drop-shadow(0 0 4px oklch(0.88 0.18 200 / 0.4))", "drop-shadow(0 0 14px oklch(0.88 0.18 200 / 1))", "drop-shadow(0 0 4px oklch(0.88 0.18 200 / 0.4))"],
                    } : { scale: 1, opacity: 1, filter: "none" }}
                    transition={
                      isPulse
                        ? { duration: 1.4, repeat: Infinity }
                        : { duration: 0.2, ease: [0.4, 0, 0.2, 1] }
                    }
                    style={{
                      fontSize: CELL * 0.62,
                      lineHeight: 1,
                      color: piece.color === "w" ? "#f5f5f5" : "#111827",
                      textShadow: piece.color === "w"
                        ? "0 1px 4px rgba(0,0,0,0.9), 0 0 10px rgba(255,255,255,0.25)"
                        : "0 0 0 2px #f5f5f5, 0 1px 4px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.8)",
                      WebkitTextStroke: piece.color === "b" ? "0.5px #e2e8f0" : "none",
                      userSelect: "none",
                      position: "relative",
                      zIndex: 2,
                    }}
                  >
                    {GLYPHS[piece.color][piece.type]}
                  </motion.span>
                )}

                {/* Coordinate labels */}
                {fileLabel && <span className="pointer-events-none absolute bottom-0.5 right-1 font-mono text-[8px] text-foreground/25">{fileLabel}</span>}
                {rankLabel && <span className="pointer-events-none absolute left-0.5 top-0.5 font-mono text-[8px] text-foreground/25">{rankLabel}</span>}
              </div>
            );
          })
        )}
      </div>

      {/* Hint */}
      {!checkmate && (
        <p className="mt-2 font-mono text-[9px] text-foreground/25">
          Click to select · click to move
        </p>
      )}
    </div>
  );
}
