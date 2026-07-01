import { CHAPTERS } from '../data/levels';
import { Progress, isLevelUnlocked } from '../state/progress';
import { puzzleById } from '../data/puzzles';

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
          ← Home
        </button>
        <h2>Adventure 🗺️</h2>
        <span className="chip">🎋 {progress.bamboo}</span>
      </header>

      <div className="chapters">
        {CHAPTERS.map((chapter) => (
          <section key={chapter.id} className="chapter">
            <h3 className="chapter-title">
              {chapter.emoji} {chapter.name}
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
                    <span className="level-emoji">{unlocked ? puzzle?.emoji ?? '❓' : '🔒'}</span>
                    <span className="level-num">{i + 1}</span>
                    <span className="level-stars">
                      {[1, 2, 3].map((s) => (
                        <span key={s} className={s <= stars ? 'star on' : 'star'}>
                          ★
                        </span>
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
