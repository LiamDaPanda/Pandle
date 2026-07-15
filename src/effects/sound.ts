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

/** Gentle "oops" buzz for a rejected fill in guided mode. */
export function playMistake() {
  blip(180, 0.09, 'square', 0.03);
  blip(150, 0.12, 'square', 0.03, 0.08);
}

/** Soft two-note chime when a row/column's clues are satisfied. */
export function playLineClear() {
  blip(784, 0.09, 'sine', 0.045);
  blip(1046.5, 0.14, 'sine', 0.04, 0.07);
}

/** Rattly capsule-machine crank. */
export function playGachaCrank() {
  [340, 300, 360, 320, 380].forEach((f, i) => blip(f, 0.05, 'triangle', 0.035, i * 0.09));
}

/** Capsule pops open. */
export function playGachaPop() {
  blip(660, 0.08, 'triangle', 0.06);
  blip(990, 0.16, 'sine', 0.055, 0.07);
}

/** Big win — rising fanfare. */
export function playJackpot() {
  const notes = [523.25, 659.25, 783.99, 1046.5, 1318.5, 1568];
  notes.forEach((n, i) => blip(n, 0.2, 'triangle', 0.06, i * 0.08));
}

/** Sparkly rising gliss for a shiny drop. */
export function playShiny() {
  [880, 1108, 1318, 1760, 2217].forEach((f, i) => blip(f, 0.14, 'sine', 0.05, i * 0.06));
}

/** Soft descending "time's up". */
export function playLose() {
  [392, 330, 262].forEach((f, i) => blip(f, 0.18, 'triangle', 0.045, i * 0.12));
}

export function tick(action: 'fill' | 'cross' | 'clear') {
  if (action === 'fill') playFill();
  else if (action === 'cross') playCross();
  else playClear();
}
