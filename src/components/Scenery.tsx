/**
 * Ambient bamboo-grove scenery pinned to the bottom of the viewport, behind
 * every screen. Drawn entirely with the current theme's accent color at low
 * opacity so it adapts to whichever theme is equipped.
 */
export function Scenery() {
  return (
    <div className="scenery" aria-hidden="true">
      <svg viewBox="0 0 390 150" preserveAspectRatio="xMidYMax slice" xmlns="http://www.w3.org/2000/svg">
        {/* rolling hills */}
        <path
          d="M0 96C60 64 140 88 210 76s130-22 180-4v78H0z"
          fill="var(--accent)"
          opacity="0.08"
        />
        <path
          d="M0 120c80-28 160-6 240-16s110 8 150 0v46H0z"
          fill="var(--accent)"
          opacity="0.13"
        />

        {/* left bamboo cluster */}
        <g fill="var(--accent)" opacity="0.26">
          <rect x="24" y="14" width="8" height="136" rx="4" />
          <rect x="22" y="50" width="12" height="4" rx="2" />
          <rect x="22" y="92" width="12" height="4" rx="2" />
          <path d="M32 34q18-3 24-16-16-3-24 16z" />
          <path d="M24 72q-16 0-22-12 14-4 22 12z" />
        </g>
        <g fill="var(--accent)" opacity="0.17">
          <rect x="48" y="60" width="5.5" height="90" rx="2.75" />
          <rect x="46.5" y="88" width="8.5" height="3" rx="1.5" />
          <path d="M53 74q13-2 17-12-12-2-17 12z" />
        </g>

        {/* right bamboo cluster */}
        <g fill="var(--accent)" opacity="0.26">
          <rect x="356" y="26" width="8" height="124" rx="4" />
          <rect x="354" y="60" width="12" height="4" rx="2" />
          <rect x="354" y="100" width="12" height="4" rx="2" />
          <path d="M356 44q-18-3-24-16 16-3 24 16z" />
          <path d="M364 80q16 0 22-12-14-4-22 12z" />
        </g>
        <g fill="var(--accent)" opacity="0.17">
          <rect x="336" y="72" width="5.5" height="78" rx="2.75" />
          <rect x="334.5" y="98" width="8.5" height="3" rx="1.5" />
          <path d="M337 84q-13-2-17-12 12-2 17 12z" />
        </g>

        {/* drifting leaves + fireflies */}
        <g fill="var(--accent)">
          <circle cx="120" cy="70" r="2" opacity="0.14" />
          <circle cx="200" cy="46" r="1.6" opacity="0.12" />
          <circle cx="286" cy="64" r="2.2" opacity="0.14" />
          <path d="M150 96q9-1 12-8-8-2-12 8z" opacity="0.14" />
          <path d="M252 90q-9-1-12-8 8-2 12 8z" opacity="0.14" />
        </g>
      </svg>
    </div>
  );
}
