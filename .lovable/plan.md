

# The Neural Link — 30s Cinematic Vibes Intro

A full rebuild of `/vibes` as a 4-act cinematic story powered by React Three Fiber + Framer Motion, ending in the existing interactive Character Map (kept, not removed).

## Storyboard → Build mapping

```text
0–5s    ACT I  — Awakening      silhouette + grain + serif type fade-in
5–15s   ACT II — Assembly       3D shards fly in, lock to silhouette
15–22s  ACT III— Night Shift    camera pan, Ozark blue, HUD telemetry
22–28s  ACT IV — Prestige       pull-back, Character Map ignites
28–30s+ ACTIVE — Interactive    HUD fades to 10% border, map is live
```

## What I'll build

**1. New `IntroSequence` component (`src/components/vibes/IntroSequence.tsx`)**
- A fixed-position fullscreen overlay that runs the 30s film, then dispatches `onComplete` and unmounts (fades to the live page).
- Uses one `framer-motion` master timeline (`useAnimationControls` + sequenced `await`s) so every act is frame-locked.
- Top-right "Skip intro ↗" button (Netflix-style, appears at 2s).
- Bottom HUD chrome: timecode (`00:00 / 00:30`), act label (`ACT_II · ASSEMBLY`), thin scanlines.

**2. New 3D scene `NeuralLinkInner.tsx` (`src/components/three/`)**
- R3F `<Canvas>` with one persistent camera that does the choreographed moves (dolly-in on silhouette → 90° pan → fast pull-back).
- **Silhouette**: a plane with the new uploaded portrait as a texture, processed with a custom shader (high-contrast threshold + grain + pulsing blue rim-light). Uses the new portrait the user just uploaded.
- **6 Logic Shards** as `motion.group` (drei `<Float>` for idle wobble): RAG, AI Systems, Backend, Data, Frontend, RL. Each shard = thin extruded glass plate with edge-glow + label texture (`[MODULE_LOADED: …]`).
- Shards spawn off-screen, fly in on staggered easing curves (`[0.16,1,0.3,1]`), and "lock" into a hex-arrangement around the silhouette with a cyan flash + screen pulse.
- **Environment morph**: `<color>` background + a large blurred sphere lerps from black-void → Ozark deep-blue between 15–18s.
- **Final pull-back**: camera dollies from `z=4` to `z=14`, FOV widens 50→70, the 9 character-map nodes ignite as instanced points with cyan emissive.

**3. Audio (Web Audio, synthesized — no assets)**
- `useNeuralAudio()` hook: sine+noise burst envelope for shard "thud" (220Hz → 60Hz, 180ms decay), soft 40Hz drone for ambience, cyan "ignite" chime at finale.
- Muted by default, auto-enables on first user interaction (browser autoplay policy). Mute toggle in HUD.

**4. Text choreography (Framer Motion)**
- Serif-italic title cards stagger in/out per act, exact copy from the brief:
  - `"Subhasish v3.3 — System Diagnostics Initializing."`
  - `[MODULE_LOADED: RETRIEVAL_AUGMENTED_GEN]` etc. per shard
  - `"Synchronizing with US Timezones. Peak performance detected."`
  - `"Where others see darkness, I see production-ready code."`
  - Final flash: `CHARACTER MAP` in oversized display type.

**5. HUD overlay (10% opacity persistent border after intro)**
- Corner brackets, scanline, and a faint timecode that stays as ambient chrome on the live map — ties the "story → site" transition together (no page reload).

**6. Replay + skip behavior** (per your answer)
- Skip button always visible from t=2s.
- After completion, a small `↻ Replay intro` button appears next to the Timeline toggle.
- No sessionStorage gating — fully on-demand.

**7. Existing Character Map — kept and upgraded**
- The existing `NODES`, `NodeDot`, active card, Night Shift panel all stay.
- Two upgrades: (a) the map now renders inside a subtle persistent HUD frame, (b) initial mount fades in from the intro's final frame for seamless handoff.

## Files

| Status | File | Purpose |
|---|---|---|
| new | `src/components/vibes/IntroSequence.tsx` | 30s timeline orchestrator + skip/replay |
| new | `src/components/three/NeuralLink.tsx` | Suspense lazy wrapper |
| new | `src/components/three/NeuralLinkInner.tsx` | R3F scene: silhouette, shards, camera, env |
| new | `src/components/vibes/HudFrame.tsx` | Persistent corner brackets + scanlines |
| new | `src/components/vibes/useNeuralAudio.ts` | Web Audio synth hook |
| new | `src/assets/silhouette-source.jpg` | The portrait you just uploaded |
| edit | `src/routes/vibes.tsx` | Mount IntroSequence → on complete reveal map; add Replay button |

No deps added — `three`, `@react-three/fiber`, `@react-three/drei`, and `framer-motion` are already in the stack.

## Performance guardrails
- Single `<Canvas>` for the whole intro (no remounts between acts).
- `dpr={[1, 1.75]}`, `frameloop="always"` only during intro then `"demand"` for the post-intro static HUD.
- Shards = low-poly extrudes (≤200 tris each), instanced where possible.
- `prefers-reduced-motion` → skip intro entirely, jump straight to interactive map.
- Mobile (<768px) → shorter 18s version: Acts I + II + IV only (Act III HUD telemetry is a static panel instead of a camera pan).

## Open question I'm resolving as I build
The portrait you just uploaded will be saved as `src/assets/silhouette-source.jpg` and processed through the silhouette shader. If after seeing it live you'd rather use a different shot, swapping is one file replacement.

