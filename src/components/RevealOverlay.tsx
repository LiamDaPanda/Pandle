import { useEffect, useState } from 'react';
import { PALETTE, Puzzle, EMPTY } from '../game/types';
import { formatTime, buildShareText, copyToClipboard, ShareResult } from '../game/share';

interface RevealOverlayProps {
  puzzle: Puzzle;
  timeMs: number;
  stars?: number;
  bambooEarned?: number;
  streak?: number;
  puzzleNumber?: number;
  mode: ShareResult['mode'];
  nextLabel?: string;
  onNext?: () => void;
  onHome: () => void;
}

/** Renders the finished art in color as an SVG-ish grid of divs. */
function ArtGrid({ puzzle }: { puzzle: Puzzle }) {
  return (
    <div
      className="art-grid"
      style={{
        gridTemplateColumns: `repeat(${puzzle.width}, 1fr)`,
        gridTemplateRows: `repeat(${puzzle.height}, 1fr)`,
      }}
    >
      {puzzle.grid.flatMap((row, y) =>
        Array.from({ length: puzzle.width }, (_, x) => {
          const ch = row[x] ?? EMPTY;
          const filled = ch !== EMPTY;
          return (
            <div
              key={`${x}-${y}`}
              className="art-cell"
              style={{
                background: filled ? PALETTE[ch] ?? '#2b2b2b' : 'transparent',
                animationDelay: `${(x + y) * 18}ms`,
              }}
            />
          );
        }),
      )}
    </div>
  );
}

export function RevealOverlay(props: RevealOverlayProps) {
  const { puzzle, timeMs, stars, bambooEarned, streak, puzzleNumber, mode } = props;
  const [copied, setCopied] = useState(false);

  // Announce for screen readers.
  useEffect(() => {
    const el = document.getElementById('reveal-title');
    el?.focus();
  }, []);

  const share = async () => {
    const text = buildShareText({ puzzle, puzzleNumber, timeMs, streak, mode });
    const ok = await copyToClipboard(text);
    setCopied(ok);
    if (!ok && typeof navigator !== 'undefined' && 'share' in navigator) {
      try {
        await (navigator as Navigator).share({ text });
      } catch {
        /* cancelled */
      }
    }
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="overlay" role="dialog" aria-modal="true">
      <div className="reveal-card">
        <div className="reveal-burst">🎉</div>
        <ArtGrid puzzle={puzzle} />
        <h2 id="reveal-title" tabIndex={-1} className="reveal-name">
          {puzzle.emoji} {puzzle.name}
        </h2>
        {stars != null && (
          <div className="stars" aria-label={`${stars} of 3 stars`}>
            {[1, 2, 3].map((s) => (
              <span key={s} className={s <= stars ? 'star on' : 'star'}>
                ★
              </span>
            ))}
          </div>
        )}
        <p className="reveal-time">⏱️ {formatTime(timeMs)}</p>
        {bambooEarned != null && bambooEarned > 0 && (
          <p className="reveal-reward">🎋 +{bambooEarned} bamboo</p>
        )}
        {streak != null && streak > 0 && <p className="reveal-streak">🔥 Streak {streak}</p>}

        <div className="reveal-actions">
          <button className="btn btn-primary" onClick={share}>
            {copied ? 'Copied! ✓' : 'Share 📋'}
          </button>
          {props.onNext && (
            <button className="btn" onClick={props.onNext}>
              {props.nextLabel ?? 'Next'}
            </button>
          )}
          <button className="btn btn-ghost" onClick={props.onHome}>
            Home
          </button>
        </div>
      </div>
    </div>
  );
}
