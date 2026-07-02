import { load, save } from './storage';

export interface Settings {
  reducedMotion: boolean;
  colorblind: boolean;
  muted: boolean;
  music: boolean;
  defaultPaintMode: 'fill' | 'cross';
}

export const DEFAULT_SETTINGS: Settings = {
  reducedMotion: false,
  colorblind: false,
  muted: false,
  music: true,
  defaultPaintMode: 'fill',
};

export function loadSettings(): Settings {
  return load<Settings>('settings', DEFAULT_SETTINGS);
}

export function saveSettings(s: Settings): void {
  save('settings', s);
}

/** Respect the OS "reduce motion" preference as the initial default. */
export function prefersReducedMotion(): boolean {
  return (
    typeof window !== 'undefined' &&
    window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
  );
}
