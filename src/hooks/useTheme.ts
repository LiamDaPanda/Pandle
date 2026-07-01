import { useEffect } from 'react';
import { THEMES } from '../data/cosmetics';

/** Apply an equipped theme's CSS custom properties to the document root. */
export function useTheme(themeId: string): void {
  useEffect(() => {
    const theme = THEMES.find((t) => t.id === themeId)?.theme;
    if (!theme) return;
    const root = document.documentElement;
    for (const [key, value] of Object.entries(theme)) {
      root.style.setProperty(key, value);
    }
    // Keep the browser/PWA chrome color in sync with the theme accent.
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', theme['--accent']);
  }, [themeId]);
}
