export const VO_LINES: { at: number; text: string }[] = [
  // ─ ACT I: The Routine — measured, almost meditative (Bateman's morning monologue pace)
  { at: 3_500,  text: "I live in an optimized environment in Bhubaneswar." },   // 4.5s breath
  { at: 8_000,  text: "I believe in taking care of myself." },                   // 3.5s breath
  { at: 11_500, text: "In balanced commits and a rigorous pipeline." },          // 4.5s breath
  { at: 16_000, text: "If my endpoint latency is high —" },                      // 3.5s breath
  { at: 19_500, text: "I'll initiate a profiling session while doing model quantization." }, // 6s breath
  { at: 25_500, text: "In development, I can do a thousand asynchronous requests now." },    // 6s breath
  { at: 31_500, text: "In the cloud, I use a generic FastAPI." },                // 4.5s breath
  { at: 36_000, text: "But on the codebase — an optimized middleware wrapper." }, // 5s breath
  { at: 41_000, text: "Then a LangSmith trace-based pruning." },                 // 4.5s breath
  { at: 45_500, text: "Then an advanced Pydantic validation model." },           // 4.5s breath
  // ─ silent beat 45.5s → 62s — the pause before the bass drop ─

  // ─ ACT II: The Unraveling — shorter, more unsettling, each line lands like a cut
  { at: 62_000, text: "There is an idea of a Subhasish." },   // 5s breath
  { at: 67_000, text: "Some kind of abstraction." },           // 4s breath
  { at: 71_000, text: "But there is no real me." },            // 4.5s breath
  { at: 75_500, text: "Only an entity." },                     // 4s breath
  { at: 79_500, text: "I simply am not there." },              // 4s breath
  // ─ chaos field peaks, terminal logs scroll ─

  // ─ ACT III: The Cold Truth — deliberate, each line a confession
  { at: 121_000, text: "While I may be an AI engineer —" },                                          // 5s breath
  { at: 126_000, text: "and while my evolution from Sambalpur through the grind has built my technical craft —" }, // 8s breath
  { at: 134_000, text: "I have all the characteristics of a Human." },           // 5.5s breath
  { at: 139_500, text: "Code. Commits. The monsoon rain." },                     // 5s breath
  { at: 144_500, text: "But not one single, identifiable emotion." },            // 5.5s breath
  { at: 150_000, text: "Except for greed." },                                    // 5s breath
  { at: 155_000, text: "My only emotion is to" },                                // held open — cuts to title
];

export const MODULE_BEATS: { at: number; text: string }[] = [
  { at: 20_000, text: "FASTAPI [MIDDLEWARE OPTIMIZED]" },
  { at: 31_000, text: "LANGSMITH [TRACE-BASED PRUNING]" },
  { at: 41_000, text: "PYDANTIC [STRICT VALIDATION]" },
];

export const TERMINAL_LOGS: string[] = [
  "$ pnpm run train --epochs 50 --lr 3e-5",
  "Epoch 47/50: loss 1.18  val_loss 1.31",
  "Epoch 48/50: loss 1.22  val_loss 1.29",
  "Epoch 49/50: loss 1.27  val_loss 1.30  ⚠ divergence",
  "Epoch 50/50: loss 1.29  val_loss 1.34  ✗ FAILED",
  "npm ERR! code ELIFECYCLE",
  "npm ERR! errno 1",
  "fatal: pre-receive hook declined",
  "[langsmith] trace 9f1a-bbc7 TRUNCATED",
  "Starting Job Tracker  DUE: 01:00 AM",
  "[masai] transformation protocol initiated",
  "ECONNRESET  retrieval-svc.local:8001",
  "AssertionError: tensor [1024,512] vs [1024,256]",
  "kubectl rollout undo deployment/inference",
  "psycopg2.errors.DeadlockDetected",
  "WARNING: GPU 0 falling back to CPU",
  "[redis] CLUSTERDOWN: hash slot not served",
  "[ray] worker 7  OOM-killed",
  "RuntimeError: CUDA error device-side assert",
  "[masai] cohort-23 → grad",
  "[grind] commit streak: 412 days",
  "[grind] last sleep: 03:42 IST",
];

export const COLD_CUT_MS = 168_000;

export type Caption = { at: number; text: string };
