import { CHAPTERS } from '../data/levels';
import { Progress, isLevelUnlocked } from '../state/progress';
import { puzzleById } from '../data/puzzles';
import { Icon } from './Icon';

interface LevelMapProps {
  progress: Progress;
  onPlayLevel: (levelId: string) => void;
  onHome: () => void;
}

export function LevelMap({ progress, onPlayLevel, onHome }: LevelMapProps) {
  return (
    <div className="screen">
      <header className="screen-header">
        <button className="btn btn-ghost btn-small" onClick={onHome}>
          <Icon name="back" /> Home
        </button>
        <h2>Adventure</h2>
        <span className="chip">
          <Icon name="bamboo" /> {progress.bamboo}
        </span>
      </header>
      <p className="screen-intro">
        A new little picture hides in every level. No rush — they’ll wait for you.
      </p>

      <div className="chapters">
        {CHAPTERS.map((chapter) => (
          <section key={chapter.id} className="chapter">
            <h3 className="chapter-title">
              <Icon name={chapter.icon} /> {chapter.name}
            </h3>
            <div className="level-grid">
              {chapter.levels.map((level, i) => {
                const unlocked = isLevelUnlocked(progress, level.id);
                const stars = progress.stars[level.id] ?? 0;
                const puzzle = puzzleById(level.puzzleId);
                return (
                  <button
                    key={level.id}
                    className={`level-node ${unlocked ? '' : 'locked'} ${stars > 0 ? 'cleared' : ''}`}
                    disabled={!unlocked}
                    onClick={() => onPlayLevel(level.id)}
                  >
                    <span className="level-emoji">
                      <Icon name={unlocked ? puzzle?.icon ?? 'question' : 'lock'} size="1.8rem" />
                    </span>
                    <span className="level-num">{i + 1}</span>
                    <span className="level-stars">
                      {[1, 2, 3].map((s) => (
                        <Icon key={s} name={s <= stars ? 'star' : 'star-outline'} size="0.8rem" />
                      ))}
                    </span>
                  </button>
                );
              })}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
