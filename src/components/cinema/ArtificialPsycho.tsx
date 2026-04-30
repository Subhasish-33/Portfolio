import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { CinemaScene } from "./CinemaScene";
import { useCinemaAudio } from "./useCinemaAudio";
import { COLD_CUT_MS, MODULE_BEATS, TERMINAL_LOGS, VO_LINES } from "./script";
import { useTimelineStore } from "./useTimelineStore";

const TITLE_IN    = COLD_CUT_MS + 700;
const TITLE_SWAP  = TITLE_IN + 1_600;
const WHITE_FLASH = TITLE_SWAP + 2_100;
const END_TIME    = WHITE_FLASH + 250;

export function ArtificialPsycho({ onComplete }: { onComplete: () => void }) {
  const audio    = useCinemaAudio();
  const audioRef = useRef(audio);
  audioRef.current = audio;
  const setTime  = useTimelineStore(s => s.setTime);
  const reset    = useTimelineStore(s => s.reset);
  const startRef = useRef<number | null>(null);
  const rafRef   = useRef<number | null>(null);
  const fired    = useRef<Set<string>>(new Set());
  const [tick, setTick]       = useState(0);
  const [skipped, setSkip]    = useState(false);
  const [started, setStarted] = useState(false);

  const fire = (k: string, fn: () => void) => {
    if (fired.current.has(k)) return;
    fired.current.add(k); fn();
  };

  // Start only after a user gesture so speechSynthesis is unblocked
  const handleStart = useCallback(() => {
    if (started) return;
    setStarted(true);
    audioRef.current.startRain();
    audioRef.current.startDrone();
  }, [started]);

  useEffect(() => {
    if (!started) return;
    reset();

    const loop = (now: number) => {
      if (startRef.current === null) startRef.current = now;
      const e = now - startRef.current;
      setTime(e);
      setTick(x => (x + 1) % 9_999_999);

      VO_LINES.forEach((c, i) => { if (e >= c.at) fire(`vo-${i}`, () => audioRef.current.speak(c.text)); });
      if (e >= 60_000)  fire("bass1",   () => audioRef.current.bassDrop());
      if (e >= 60_400)  fire("dist1",   () => audioRef.current.distortRain(1));
      if (e >= 120_000) fire("restore", () => audioRef.current.distortRain(0));
      if (e >= COLD_CUT_MS) fire("cut", () => { audioRef.current.killAll(); audioRef.current.snap(); });
      if (e >= END_TIME) { audioRef.current.killAll(); onComplete(); return; }
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      audioRef.current.killAll();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [started]);

  const ct = useTimelineStore.getState().currentTime;

  const timecode = useMemo(() => {
    const e = Math.min(ct, 180_000);
    const m = String(Math.floor(e/60_000)).padStart(2,"0");
    const s = String(Math.floor((e%60_000)/1000)).padStart(2,"0");
    return `${m}:${s} / 03:00`;
  }, [ct]);

  const activeVo = useMemo(() =>
    [...VO_LINES].reverse().find(c => ct >= c.at && ct < c.at + 7_000),
  [ct]);

  const activeMod = MODULE_BEATS.find(m => ct >= m.at && ct < m.at + 5_200);

  const showTerminal = ct >= 94_000 && ct < 118_000;
  const showHud      = ct >= 122_000 && ct < COLD_CUT_MS;
  const showCards    = ct >= 124_000 && ct < COLD_CUT_MS;
  const blackOut     = ct >= COLD_CUT_MS;
  const showTitle1   = ct >= TITLE_IN  && ct < TITLE_SWAP;
  const showTitle2   = ct >= TITLE_SWAP && ct < WHITE_FLASH;
  const whiteFlash   = ct >= WHITE_FLASH && ct < WHITE_FLASH + 180;

  const redAmt  = ct >= 60_000 && ct < 120_000 ? Math.min(1,(ct-60_000)/1_800) : 0;
  const ozAmt   = ct >= 120_000 && ct < COLD_CUT_MS ? Math.min(1,(ct-120_000)/3_500) : 0;

  const inFlash = ct >= 85_000 && ct < 90_000;
  const act     = ct < 60_000 ? "I" : ct < 120_000 ? "II" : ct < 168_000 ? "III" : "IV";

  return (
    <motion.div
      className="fixed inset-0 z-[60] overflow-hidden bg-black"
      initial={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }}
    >
      {/* 3D scene */}
      {!blackOut && <div className="absolute inset-0"><CinemaScene /></div>}

      {/* ACT I scanning line — white hot light bar panning */}
      {ct < 60_000 && (
        <motion.div
          aria-hidden
          className="pointer-events-none absolute left-0 right-0 h-[1px]"
          animate={{ top: ["8%","92%","8%"] }}
          transition={{ duration: 14, repeat: Infinity, ease: "linear" }}
          style={{ background: "linear-gradient(90deg,transparent,rgba(255,255,255,0.35),transparent)" }}
        />
      )}

      {/* Red chaos wash */}
      {redAmt > 0 && !blackOut && (
        <div aria-hidden className="pointer-events-none absolute inset-0 mix-blend-multiply"
          style={{ background: `radial-gradient(ellipse at center, rgba(140,8,14,${redAmt*0.6}), rgba(40,2,4,${redAmt*0.88}))` }} />
      )}

      {/* Ozark cold wash */}
      {ozAmt > 0 && !blackOut && (
        <div aria-hidden className="pointer-events-none absolute inset-0 mix-blend-screen"
          style={{ background: `radial-gradient(ellipse at center, rgba(16,48,100,${ozAmt*0.4}), rgba(4,10,26,${ozAmt*0.65}))` }} />
      )}

      {/* Film grain — heavier during Act II */}
      {!blackOut && (
        <div aria-hidden className="pointer-events-none absolute inset-0 mix-blend-overlay"
          style={{ opacity: 0.12 + redAmt*0.14,
            backgroundImage: "radial-gradient(rgba(255,255,255,0.7) 0.5px,transparent 0.5px)",
            backgroundSize: "3px 3px" }} />
      )}

      {/* Vignette */}
      {!blackOut && (
        <div aria-hidden className="pointer-events-none absolute inset-0"
          style={{ background: "radial-gradient(ellipse at center, transparent 32%, rgba(0,0,0,0.88) 100%)" }} />
      )}

      {/* Rain streaks */}
      {!blackOut && (
        <div aria-hidden className="pointer-events-none absolute inset-0"
          style={{
            opacity: 0.22 + redAmt * 0.12,
            backgroundImage: "repeating-linear-gradient(104deg, transparent 0 2px, rgba(190,220,255,0.16) 2px 3px, transparent 3px 10px)",
            filter: redAmt > 0 ? `blur(${redAmt*1.8}px)` : undefined,
            transform: redAmt > 0 ? `skewX(${Math.sin(ct/45)*redAmt*5}deg)` : undefined,
            transition: "transform 0.05s linear",
          }} />
      )}

      {/* Module beats — ACT I floating tech labels */}
      <AnimatePresence>
        {activeMod && (
          <motion.div key={activeMod.text}
            initial={{ opacity:0, y:10, letterSpacing:"0.7em" }}
            animate={{ opacity:1, y:0,  letterSpacing:"0.4em" }}
            exit={{ opacity:0, y:-8 }}
            transition={{ duration:0.8, ease:[0.16,1,0.3,1] }}
            className="pointer-events-none absolute left-1/2 top-[26%] -translate-x-1/2 font-mono text-[11px] uppercase"
            style={{ color:"rgba(220,245,255,0.9)", textShadow:"0 0 20px rgba(125,249,255,0.7)" }}
          >
            &gt; {activeMod.text}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sambalpur red-soil flashback — ACT II */}
      <AnimatePresence>
        {inFlash && (
          <motion.div
            initial={{ opacity:0 }} animate={{ opacity:0.65 }} exit={{ opacity:0 }}
            transition={{ duration:0.4 }}
            className="pointer-events-none absolute inset-0"
          >
            <div className="absolute inset-0"
              style={{
                background: "conic-gradient(from 0deg at 50% 50%, #4a1a08, #8a3010, #3a0e06, #7a2a0e, #4a1a08)",
                filter: "saturate(0.35) blur(1.5px) contrast(1.5)",
                mixBlendMode: "screen",
                animation: "kaleido 1.8s linear infinite",
              }} />
            <style>{`@keyframes kaleido{from{transform:rotate(0deg) scale(1.1)}to{transform:rotate(360deg) scale(1.25)}}`}</style>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Terminal logs — ACT II finale */}
      {showTerminal && (
        <div aria-hidden
          className="pointer-events-none absolute inset-0 flex items-end justify-end overflow-hidden p-8"
          style={{ mixBlendMode:"screen" }}
        >
          <div className="h-[78vh] w-[min(580px,75vw)] overflow-hidden font-mono text-[9.5px] leading-[1.7] tracking-wider"
            style={{ color:"rgba(255,110,110,0.85)", textShadow:"0 0 7px rgba(255,60,60,0.6)" }}
          >
            <div style={{ animation:"scrollLogs 13s linear infinite" }}>
              {[...TERMINAL_LOGS,...TERMINAL_LOGS,...TERMINAL_LOGS].map((l,i) => (
                <div key={i} className={l.includes("FAILED")||l.includes("ERR")||l.includes("fatal")||l.includes("Error") ? "text-red-300" : ""}>{l}</div>
              ))}
            </div>
          </div>
          <style>{`@keyframes scrollLogs{from{transform:translateY(0)}to{transform:translateY(-33.33%)}}`}</style>
        </div>
      )}

      {/* HUD — ACT III */}
      {showHud && (
        <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ duration:0.9 }}
          className="pointer-events-none absolute inset-0" aria-hidden
        >
          {/* Metrics top-left */}
          <div className="absolute left-8 top-8 flex flex-col gap-2 font-mono text-[10px] uppercase tracking-[0.3em]"
            style={{ color:"rgba(125,249,255,0.9)", textShadow:"0 0 8px rgba(125,249,255,0.55)" }}
          >
            {[
              ["PEAK DEPLOY HOUR","01:18"],
              ["LATE NIGHT COMMITS","62%"],
              ["SYSTEM STATUS","ACTIVE"],
            ].map(([k,v]) => (
              <div key={k} className="flex items-center gap-3">
                <span style={{ color:"rgba(125,249,255,0.5)" }}>▮</span>
                <span style={{ color:"rgba(255,255,255,0.5)" }}>{k}</span>
                <span>{v}</span>
              </div>
            ))}
          </div>
          {/* Corner brackets */}
          {[{t:16,l:16,r:0},  {t:16,r:16,l:0}, {b:16,r:16,l:0}, {b:16,l:16,r:0}].map((c,i) => (
            <span key={i} className="absolute h-8 w-8"
              style={{
                top:c.t, left:c.l||undefined, right:c.r||undefined, bottom:c.b,
                transform:`rotate(${i*90}deg)`,
                borderTop:"0.5px solid #7df9ff", borderLeft:"0.5px solid #7df9ff",
                opacity:0.75, filter:"drop-shadow(0 0 6px #7df9ff)",
              }} />
          ))}
          {/* Project labels orbit */}
          {showCards && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative h-[500px] w-[500px] max-h-[80vw] max-w-[80vw]">
                {["SMART CAMPUS / ENERGY TWIN","AMIGO","FACIAL MOOD DETECTION"].map((p,i) => {
                  const a = (i/3)*Math.PI*2 - Math.PI/2;
                  const r = 210;
                  return (
                    <motion.div key={p}
                      initial={{ opacity:0, scale:0.85 }} animate={{ opacity:1, scale:1 }}
                      transition={{ delay:i*0.18, duration:0.65, type:"spring", stiffness:400 }}
                      className="absolute left-1/2 top-1/2 font-mono text-[10px] uppercase tracking-[0.3em]"
                      style={{
                        transform:`translate(calc(${Math.cos(a)*r}px - 50%), calc(${Math.sin(a)*r*0.52}px - 50%))`,
                        color:"rgba(125,249,255,0.92)", textShadow:"0 0 12px rgba(125,249,255,0.7)",
                      }}
                    >{p}</motion.div>
                  );
                })}
              </div>
            </div>
          )}
        </motion.div>
      )}

      {/* VO captions — centered, italic serif */}
      <div className="pointer-events-none absolute inset-x-0 bottom-[13%] z-[70] flex justify-center px-8">
        <AnimatePresence mode="wait">
          {!blackOut && activeVo && (
            <motion.p key={activeVo.text}
              initial={{ opacity:0, y:12, filter:"blur(7px)" }}
              animate={{ opacity:1, y:0, filter:"blur(0px)" }}
              exit={{ opacity:0, y:-8, filter:"blur(7px)" }}
              transition={{ duration:0.55, ease:[0.16,1,0.3,1] }}
              className="max-w-3xl text-center font-serif italic"
              style={{
                fontSize:"clamp(1rem,2vw,1.55rem)",
                color:"rgba(248,250,255,0.94)",
                textShadow:"0 2px 28px rgba(0,0,0,0.95), 0 0 60px rgba(0,0,0,0.7)",
                letterSpacing:"-0.01em",
              }}
            >{activeVo.text}</motion.p>
          )}
        </AnimatePresence>
      </div>

      {/* Timecode + act */}
      {!blackOut && (
        <div className="pointer-events-none absolute inset-x-0 bottom-4 flex items-center justify-between px-7 font-mono text-[9px] uppercase tracking-[0.4em] text-white/35">
          <span>▮ {timecode}</span>
          <span>ACT_{act}</span>
        </div>
      )}

      {/* COLD CUT */}
      {blackOut && (
        <div className="absolute inset-0 bg-black">
          <AnimatePresence>
            {showTitle1 && (
              <motion.div key="t1" initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
                transition={{ duration:0.7, ease:"easeOut" }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <h1 className="font-serif font-light text-white"
                  style={{ fontSize:"clamp(1.8rem,5vw,4.2rem)", letterSpacing:"0.28em" }}>
                  ARTIFICIAL PSYCHO.
                </h1>
              </motion.div>
            )}
            {showTitle2 && (
              <motion.div key="t2" initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
                transition={{ duration:0.18 }}
                className="absolute inset-0 flex flex-col items-center justify-center gap-5"
              >
                <h2 className="font-serif font-light text-white"
                  style={{ fontSize:"clamp(1.5rem,3.8vw,3.2rem)", letterSpacing:"0.32em" }}>
                  A B S T R A C T I O N
                </h2>
                <p className="font-mono text-white/55"
                  style={{ fontSize:"clamp(0.65rem,0.9vw,0.82rem)", letterSpacing:"0.42em" }}>
                  DIRECTED BY SUBHASISH KUMAR SAHU
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* White flash */}
      {whiteFlash && (
        <div aria-hidden className="pointer-events-none absolute inset-0 z-[90] bg-white" />
      )}

      {/* Click-to-begin overlay — required for speechSynthesis user gesture gate */}
      <AnimatePresence>
        {!started && (
          <motion.div
            key="gate"
            className="absolute inset-0 z-[100] flex cursor-pointer flex-col items-center justify-center bg-black"
            initial={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.6 }}
            onClick={handleStart}
          >
            <motion.div
              animate={{ opacity: [0.4, 1, 0.4] }} transition={{ duration: 2.4, repeat: Infinity }}
              className="font-mono text-[11px] uppercase tracking-[0.5em] text-white/60"
            >
              click to begin
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Controls */}
      <div className="absolute right-6 top-6 z-[80] flex items-center gap-3">
        <button onClick={audio.toggleMute}
          className="rounded-full border border-white/15 bg-black/40 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.3em] text-white/70 backdrop-blur-md transition-colors hover:text-white">
          {audio.muted ? "🔇 Audio" : "🔊 Audio"}
        </button>
        <motion.button onClick={() => { if (!skipped) { setSkip(true); audio.killAll(); onComplete(); }}}
          initial={{ opacity:0 }} animate={{ opacity: ct > 2_500 ? 1 : 0 }} transition={{ duration:0.4 }}
          className="rounded-full border border-white/20 bg-black/50 px-4 py-1.5 font-mono text-[10px] uppercase tracking-[0.3em] text-white backdrop-blur-md hover:bg-black/70">
          Skip ↗
        </motion.button>
      </div>
    </motion.div>
  );
}
