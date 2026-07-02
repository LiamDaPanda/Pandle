/**
 * Gentle looping background music, synthesized with Web Audio — no asset files,
 * offline-safe. A slow four-chord pad progression with a soft twinkle on top.
 * Kept very quiet and mellow so it sits under the game rather than over it.
 */
let ctx: AudioContext | null = null;
let master: GainNode | null = null;
let enabled = false;
let playing = false;
let timer: ReturnType<typeof setTimeout> | null = null;
let step = 0;

// Am - F - C - G, voiced low and warm (frequencies in Hz).
const PROGRESSION: number[][] = [
  [220.0, 261.63, 329.63], // Am
  [174.61, 220.0, 261.63], // F
  [196.0, 246.94, 329.63], // C/G-ish
  [196.0, 246.94, 293.66], // G
];
// Pentatonic twinkle notes.
const TWINKLE = [523.25, 587.33, 659.25, 783.99, 880.0];

const BAR_MS = 3400;

function ensure(): boolean {
  if (typeof window === 'undefined') return false;
  if (!ctx) {
    const Ctor =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!Ctor) return false;
    ctx = new Ctor();
    master = ctx.createGain();
    master.gain.value = 0.045;
    master.connect(ctx.destination);
  }
  if (ctx.state === 'suspended') void ctx.resume();
  return ctx.state === 'running';
}

function pad(freq: number, when: number, dur: number, gain: number) {
  if (!ctx || !master) return;
  const osc = ctx.createOscillator();
  const env = ctx.createGain();
  osc.type = 'sine';
  osc.frequency.value = freq;
  env.gain.setValueAtTime(0.0001, when);
  env.gain.exponentialRampToValueAtTime(gain, when + 0.6);
  env.gain.setValueAtTime(gain, when + dur - 0.8);
  env.gain.exponentialRampToValueAtTime(0.0001, when + dur);
  osc.connect(env).connect(master);
  osc.start(when);
  osc.stop(when + dur + 0.05);
}

function twinkle(freq: number, when: number) {
  if (!ctx || !master) return;
  const osc = ctx.createOscillator();
  const env = ctx.createGain();
  osc.type = 'triangle';
  osc.frequency.value = freq;
  env.gain.setValueAtTime(0.0001, when);
  env.gain.exponentialRampToValueAtTime(0.03, when + 0.05);
  env.gain.exponentialRampToValueAtTime(0.0001, when + 1.1);
  osc.connect(env).connect(master);
  osc.start(when);
  osc.stop(when + 1.2);
}

function bar() {
  if (!playing || !ctx) return;
  const now = ctx.currentTime;
  const chord = PROGRESSION[step % PROGRESSION.length];
  chord.forEach((f, i) => pad(f, now + 0.02, BAR_MS / 1000, i === 0 ? 0.05 : 0.035));
  // Sprinkle one or two twinkles per bar.
  if (step % 2 === 0) twinkle(TWINKLE[step % TWINKLE.length], now + 0.4);
  if (step % 3 === 1) twinkle(TWINKLE[(step + 2) % TWINKLE.length], now + 1.8);
  step++;
  timer = setTimeout(bar, BAR_MS);
}

export function startMusic(): void {
  if (!enabled || playing) return;
  if (!ensure()) return; // needs a user gesture first
  playing = true;
  bar();
}

export function stopMusic(): void {
  playing = false;
  if (timer) clearTimeout(timer);
  timer = null;
}

export function setMusicEnabled(on: boolean): void {
  enabled = on;
  if (on) startMusic();
  else stopMusic();
}

/** Call on the first user gesture so the audio context is allowed to start. */
export function primeMusic(): void {
  if (enabled) startMusic();
}
