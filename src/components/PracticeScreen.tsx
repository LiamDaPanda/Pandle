import { Difficulty } from '../game/types';
import { puzzlesByDifficulty } from '../data/puzzles';
import { Icon, IconName } from './Icon';

interface PracticeScreenProps {
  onPick: (difficulty: Difficulty) => void;
  onHome: () => void;
}

const TIERS: { d: Difficulty; label: string; icon: IconName }[] = [
  { d: 'easy', label: 'Easy', icon: 'leaf' },
  { d: 'medium', label: 'Medium', icon: 'bamboo' },
  { d: 'hard', label: 'Hard', icon: 'panda' },
  { d: 'expert', label: 'Expert', icon: 'crown' },
];

export function PracticeScreen({ onPick, onHome }: PracticeScreenProps) {
  return (
    <div className="screen">
      <header className="screen-header">
        <button className="btn btn-ghost btn-small" onClick={onHome}>
          <Icon name="back" /> Home
        </button>
        <h2>Practice</h2>
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
              <span className="tier-emoji"><Icon name={t.icon} size="2.2rem" /></span>
              <span className="tier-label">{t.label}</span>
              <span className="tier-count">{count} puzzles</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
