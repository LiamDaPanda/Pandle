/**
 * Tiny Web Audio sound effects — synthesized, no asset files, offline-safe.
 * The AudioContext is created lazily on the first user gesture (so browsers
 * don't block it), and every call is a no-op while muted.
 */
let ctx: AudioContext | null = null;
let muted = false;

export function setMuted(value: boolean): void {
  muted = value;
}

function audio(): AudioContext | null {
  if (muted || typeof window === 'undefined') return null;
  if (!ctx) {
    const Ctor = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!Ctor) return null;
    ctx = new Ctor();
  }
  if (ctx.state === 'suspended') void ctx.resume();
  return ctx;
}

function blip(freq: number, duration = 0.08, type: OscillatorType = 'sine', gain = 0.06, when = 0) {
  const ac = audio();
  if (!ac) return;
  const t = ac.currentTime + when;
  const osc = ac.createOscillator();
  const env = ac.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, t);
  env.gain.setValueAtTime(0.0001, t);
  env.gain.exponentialRampToValueAtTime(gain, t + 0.008);
  env.gain.exponentialRampToValueAtTime(0.0001, t + duration);
  osc.connect(env).connect(ac.destination);
  osc.start(t);
  osc.stop(t + duration + 0.02);
}

export function playFill() {
  blip(520, 0.07, 'sine', 0.05);
}
export function playCross() {
  blip(300, 0.06, 'triangle', 0.04);
}
export function playClear() {
  blip(220, 0.05, 'sine', 0.03);
}
export function playHint() {
  blip(880, 0.09, 'sine', 0.05);
  blip(1174, 0.12, 'sine', 0.045, 0.06);
}
export function playWin() {
  // A cheerful little arpeggio.
  const notes = [523.25, 659.25, 783.99, 1046.5];
  notes.forEach((n, i) => blip(n, 0.22, 'triangle', 0.06, i * 0.1));
}

export function tick(action: 'fill' | 'cross' | 'clear') {
  if (action === 'fill') playFill();
  else if (action === 'cross') playCross();
  else playClear();
}
