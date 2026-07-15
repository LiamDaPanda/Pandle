import { useState } from 'react';
import { celebrate } from '../effects/celebrate';
import { playFill, playWin, playLineClear } from '../effects/sound';
import { Icon, IconName } from './Icon';

interface PairsGameProps {
  /** Called once on win with the number of misses; returns bamboo awarded. */
  onWin: (misses: number) => number;
  reducedMotion: boolean;
  onBack: () => void;
}

const POOL: IconName[] = [
  'panda', 'red-panda', 'koala', 'polar-bear', 'bunny', 'tiger',
  'strawberry', 'mushroom', 'duck', 'ghost', 'fish', 'sailboat',
  'icecream', 'balloon', 'sun', 'sakura',
];

interface Card {
  icon: IconName;
  matched: boolean;
}

function deal(): Card[] {
  const icons = [...POOL].sort(() => Math.random() - 0.5).slice(0, 8);
  return [...icons, ...icons]
    .sort(() => Math.random() - 0.5)
    .map((icon) => ({ icon, matched: false }));
}

/** Flip-two memory game with the game's own character art. */
export function PairsGame({ onWin, reducedMotion, onBack }: PairsGameProps) {
  const [cards, setCards] = useState<Card[]>(() => deal());
  const [open, setOpen] = useState<number[]>([]);
  const [misses, setMisses] = useState(0);
  const [locked, setLocked] = useState(false);
  const [won, setWon] = useState<number | null>(null); // bamboo awarded

  const flip = (i: number) => {
    if (locked || won != null || cards[i].matched || open.includes(i)) return;
    playFill();
    const next = [...open, i];
    setOpen(next);
    if (next.length < 2) return;

    const [a, b] = next;
    if (cards[a].icon === cards[b].icon) {
      playLineClear();
      const merged = cards.map((c, j) => (j === a || j === b ? { ...c, matched: true } : c));
      setCards(merged);
      setOpen([]);
      if (merged.every((c) => c.matched)) {
        const reward = onWin(misses);
        setWon(reward);
        playWin();
        celebrate(['#ffd66b', '#ffb7c5', '#7bc47f'], 'confetti', reducedMotion);
      }
    } else {
      setMisses((m) => m + 1);
      setLocked(true);
      setTimeout(() => {
        setOpen([]);
        setLocked(false);
      }, 750);
    }
  };

  const again = () => {
    setCards(deal());
    setOpen([]);
    setMisses(0);
    setWon(null);
  };

  return (
    <div className="screen">
      <header className="screen-header">
        <button className="btn btn-ghost btn-small" onClick={onBack}>
          <Icon name="back" /> Arcade
        </button>
        <h2>Panda Pairs</h2>
        <span className="chip">Misses: {misses}</span>
      </header>
      <p className="screen-intro">Find all eight pairs. Fewer misses, more bamboo.</p>

      <div className="pairs-grid">
        {cards.map((card, i) => {
          const faceUp = card.matched || open.includes(i);
          return (
            <button
              key={i}
              className={`pair-card ${faceUp ? 'up' : ''} ${card.matched ? 'matched' : ''}`}
              onClick={() => flip(i)}
              aria-label={faceUp ? card.icon : 'hidden card'}
            >
              <span className="pair-face pair-back">
                <Icon name="bamboo" size="1.6rem" />
              </span>
              <span className="pair-face pair-front">
                <Icon name={card.icon} size="2.2rem" />
              </span>
            </button>
          );
        })}
      </div>

      {won != null && (
        <div className="arcade-win" role="status">
          <p className="arcade-win-title">All pairs found!</p>
          <p className="arcade-win-reward">
            <Icon name="bamboo" /> +{won} bamboo
          </p>
          <div className="reveal-actions">
            <button className="btn btn-primary" onClick={again}>
              Play again
            </button>
            <button className="btn btn-ghost" onClick={onBack}>
              Arcade
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
