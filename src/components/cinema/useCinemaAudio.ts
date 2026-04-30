import { useCallback, useEffect, useRef, useState } from "react";

export function useCinemaAudio() {
  const ctxRef = useRef<AudioContext | null>(null);
  const rainGainRef = useRef<GainNode | null>(null);
  const rainSrcRef = useRef<AudioBufferSourceNode | null>(null);
  const rainFilterRef = useRef<BiquadFilterNode | null>(null);
  const droneGainRef = useRef<GainNode | null>(null);
  const voicesRef = useRef<SpeechSynthesisVoice[]>([]);
  const [muted, setMuted] = useState(false);
  const mutedRef = useRef(false);

  const ctx = useCallback((): AudioContext | null => {
    if (typeof window === "undefined") return null;
    if (!ctxRef.current) {
      const AC = window.AudioContext || (window as any).webkitAudioContext;
      if (!AC) return null;
      ctxRef.current = new AC();
    }
    if (ctxRef.current.state === "suspended") void ctxRef.current.resume();
    return ctxRef.current;
  }, []);

  const startRain = useCallback(() => {
    const c = ctx(); if (!c || rainSrcRef.current) return;
    const buf = c.createBuffer(2, c.sampleRate * 6, c.sampleRate);
    for (let ch = 0; ch < 2; ch++) {
      const d = buf.getChannelData(ch);
      for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    }
    const src = c.createBufferSource(); src.buffer = buf; src.loop = true;
    const hpf = c.createBiquadFilter(); hpf.type = "highpass"; hpf.frequency.value = 900;
    const lpf = c.createBiquadFilter(); lpf.type = "lowpass"; lpf.frequency.value = 4200;
    lpf.Q.value = 0.5;
    const gain = c.createGain(); gain.gain.value = 0;
    src.connect(hpf); hpf.connect(lpf); lpf.connect(gain); gain.connect(c.destination);
    src.start();
    gain.gain.linearRampToValueAtTime(mutedRef.current ? 0 : 0.07, c.currentTime + 2.5);
    rainSrcRef.current = src; rainGainRef.current = gain; rainFilterRef.current = lpf;
  }, [ctx]);

  const distortRain = useCallback((amount: number) => {
    const c = ctxRef.current; const f = rainFilterRef.current; const g = rainGainRef.current;
    if (!c || !f || !g) return;
    f.frequency.linearRampToValueAtTime(4200 - amount * 3600, c.currentTime + 0.5);
    g.gain.linearRampToValueAtTime(mutedRef.current ? 0 : 0.07 + amount * 0.06, c.currentTime + 0.4);
  }, []);

  const startDrone = useCallback(() => {
    const c = ctx(); if (!c || droneGainRef.current) return;
    const gain = c.createGain(); gain.gain.value = 0;
    gain.connect(c.destination);
    const freqs = [36, 54, 72, 108];
    freqs.forEach((f, i) => {
      const o = c.createOscillator();
      o.type = i % 2 === 0 ? "sine" : "triangle";
      o.frequency.value = f + (Math.random() - 0.5) * 0.4;
      const og = c.createGain(); og.gain.value = [0.22, 0.12, 0.08, 0.04][i];
      o.connect(og); og.connect(gain); o.start();
    });
    gain.gain.linearRampToValueAtTime(mutedRef.current ? 0 : 0.18, c.currentTime + 1.8);
    droneGainRef.current = gain;
  }, [ctx]);

  const stopDrone = useCallback(() => {
    const c = ctxRef.current; const g = droneGainRef.current;
    if (!c || !g) return;
    g.gain.cancelScheduledValues(c.currentTime);
    g.gain.linearRampToValueAtTime(0, c.currentTime + 0.08);
    setTimeout(() => { try { g.disconnect(); } catch {} }, 100);
    droneGainRef.current = null;
  }, []);

  const bassDrop = useCallback(() => {
    const c = ctx(); if (!c || mutedRef.current) return;
    const t = c.currentTime;
    const o = c.createOscillator(); o.type = "sine";
    o.frequency.setValueAtTime(200, t);
    o.frequency.exponentialRampToValueAtTime(22, t + 1.8);
    const g = c.createGain();
    g.gain.setValueAtTime(0.001, t);
    g.gain.exponentialRampToValueAtTime(0.7, t + 0.04);
    g.gain.exponentialRampToValueAtTime(0.001, t + 2.0);
    const dist = c.createWaveShaper();
    const curve = new Float32Array(256);
    for (let i = 0; i < 256; i++) {
      const x = (i * 2) / 256 - 1;
      curve[i] = (Math.PI + 180) * x / (Math.PI + 180 * Math.abs(x));
    }
    dist.curve = curve;
    o.connect(dist); dist.connect(g); g.connect(c.destination);
    o.start(t); o.stop(t + 2.1);
  }, [ctx]);

  const snap = useCallback(() => {
    const c = ctx(); if (!c) return;
    const t = c.currentTime;
    const buf = c.createBuffer(1, Math.floor(c.sampleRate * 0.15), c.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < d.length; i++)
      d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / d.length, 3.5);
    const src = c.createBufferSource(); src.buffer = buf;
    const hp = c.createBiquadFilter(); hp.type = "highpass"; hp.frequency.value = 2800;
    const g = c.createGain(); g.gain.value = mutedRef.current ? 0 : 1.1;
    src.connect(hp); hp.connect(g); g.connect(c.destination); src.start(t);
  }, [ctx]);

  const speak = useCallback((text: string) => {
    if (typeof window === "undefined" || mutedRef.current) return;
    const synth = window.speechSynthesis; if (!synth) return;
    // Use cached voices — avoids the empty-array race on first call
    const voices = voicesRef.current.length ? voicesRef.current : synth.getVoices();
    const u = new SpeechSynthesisUtterance(text);
    u.rate = 0.82; u.pitch = 1.05; u.volume = 1.0;
    // Priority: Samantha (macOS Siri), Karen (AU), Moira (IE), Zira (Windows), US English female
    const voice =
      voices.find(v => /samantha/i.test(v.name)) ||
      voices.find(v => /karen/i.test(v.name)) ||
      voices.find(v => /moira/i.test(v.name)) ||
      voices.find(v => /zira/i.test(v.name)) ||
      voices.find(v => /en-US/i.test(v.lang) && !/male/i.test(v.name)) ||
      voices.find(v => /en-US/i.test(v.lang)) ||
      voices[0];
    if (voice) u.voice = voice;
    synth.speak(u);
  }, []);

  const stopSpeech = useCallback(() => {
    if (typeof window !== "undefined") window.speechSynthesis?.cancel();
  }, []);

  const killAll = useCallback(() => {
    const c = ctxRef.current;
    if (rainGainRef.current && c) {
      rainGainRef.current.gain.cancelScheduledValues(c.currentTime);
      rainGainRef.current.gain.linearRampToValueAtTime(0, c.currentTime + 0.06);
    }
    setTimeout(() => {
      try { rainSrcRef.current?.stop(); } catch {}
      rainSrcRef.current = null; rainGainRef.current = null; rainFilterRef.current = null;
    }, 80);
    stopDrone(); stopSpeech();
  }, [stopDrone, stopSpeech]);

  const toggleMute = useCallback(() => {
    setMuted(m => {
      const next = !m; mutedRef.current = next;
      const c = ctxRef.current;
      if (c) {
        if (rainGainRef.current) rainGainRef.current.gain.linearRampToValueAtTime(next ? 0 : 0.07, c.currentTime + 0.3);
        if (droneGainRef.current) droneGainRef.current.gain.linearRampToValueAtTime(next ? 0 : 0.18, c.currentTime + 0.3);
      }
      if (next) stopSpeech();
      return next;
    });
  }, [stopSpeech]);

  // Pre-load voices as soon as they're available — fixes the empty-array race condition
  useEffect(() => {
    const load = () => { voicesRef.current = window.speechSynthesis?.getVoices() ?? []; };
    load();
    window.speechSynthesis?.addEventListener("voiceschanged", load);
    return () => window.speechSynthesis?.removeEventListener("voiceschanged", load);
  }, []);

  useEffect(() => {
    const wake = () => ctx();
    window.addEventListener("pointerdown", wake, { once: true });
    window.addEventListener("keydown", wake, { once: true });
    return () => {
      window.removeEventListener("pointerdown", wake);
      window.removeEventListener("keydown", wake);
      killAll();
      try { ctxRef.current?.close(); } catch {}
      ctxRef.current = null;
    };
  }, [ctx, killAll]);

  return { muted, toggleMute, startRain, distortRain, startDrone, stopDrone, bassDrop, snap, speak, stopSpeech, killAll };
}
