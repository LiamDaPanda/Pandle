import { Difficulty } from '../game/types';
import { puzzlesByDifficulty } from '../data/puzzles';

interface PracticeScreenProps {
  onPick: (difficulty: Difficulty) => void;
  onHome: () => void;
}

const TIERS: { d: Difficulty; label: string; emoji: string }[] = [
  { d: 'easy', label: 'Easy', emoji: '🌱' },
  { d: 'medium', label: 'Medium', emoji: '🎋' },
  { d: 'hard', label: 'Hard', emoji: '🐼' },
  { d: 'expert', label: 'Expert', emoji: '🏆' },
];

export function PracticeScreen({ onPick, onHome }: PracticeScreenProps) {
  return (
    <div className="screen">
      <header className="screen-header">
        <button className="btn btn-ghost btn-small" onClick={onHome}>
          ← Home
        </button>
        <h2>Practice ♾️</h2>
        <span />
      </header>
      <p className="screen-intro">Pick a size — you’ll get a random panda to solve. Play as many as you like!</p>
      <div className="tier-grid">
        {TIERS.map((t) => {
          const count = puzzlesByDifficulty(t.d).length;
          return (
            <button
              key={t.d}
              className="tier-btn"
              disabled={count === 0}
              onClick={() => onPick(t.d)}
            >
              <span className="tier-emoji">{t.emoji}</span>
              <span className="tier-label">{t.label}</span>
              <span className="tier-count">{count} puzzles</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
