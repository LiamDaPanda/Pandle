import { useEffect, useMemo, useState } from 'react';
import { puzzlesByDifficulty } from '../data/puzzles';
import { useGameState } from '../hooks/useGameState';
import { Settings } from '../state/settings';
import { celebrate } from '../effects/celebrate';
import { playWin, playLose, playMistake } from '../effects/sound';
import { Board } from './Board/Board';
import { Icon, IconName } from './Icon';

export const LIGHTNING_MS = 90000;

interface LightningGameProps {
  settings: Settings;
  fillToken: IconName;
  /** Called once on win; returns bamboo awarded. */
  onWin: (puzzleId: string) => number;
  onBack: () => void;
}

/** Beat one small puzzle before the clock runs out. */
export function LightningGame({ settings, fillToken, onWin, onBack }: LightningGameProps) {
  const [round, setRound] = useState(0);
  const puzzle = useMemo(() => {
    const pool = puzzlesByDifficulty('easy');
    return pool[Math.floor(Math.random() * pool.length)];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [round]);
  const [won, setWon] = useState<number | null>(null);
  const [mode, setMode] = useState<'fill' | 'cross'>(settings.defaultPaintMode);

  const game = useGameState(
    puzzle,
    undefined,
    (timeMs) => {
      if (timeMs >= LIGHTNING_MS) return; // solved after the buzzer — no dice
      const reward = onWin(puzzle.id);
      setWon(reward);
      playWin();
      celebrate(['#ffd66b', '#8ecae6', '#ffb7c5'], 'star', settings.reducedMotion);
    },
    {
      autoCross: settings.autoCross,
      mistakeAlerts: settings.mistakeAlerts,
      onMistake: () => playMistake(),
    },
  );

  const leftMs = Math.max(0, LIGHTNING_MS - game.elapsedMs);
  const lost = leftMs <= 0 && !game.solved;
  const frac = leftMs / LIGHTNING_MS;

  const retry = () => {
    setWon(null);
    setRound((r) => r + 1);
  };

  return (
    <div className="screen lightning">
      <header className="screen-header">
        <button className="btn btn-ghost btn-small" onClick={onBack}>
          <Icon name="back" /> Arcade
        </button>
        <h2>Lightning Round</h2>
        <span className={`chip ${frac < 0.25 ? 'chip-danger' : ''}`}>
          {Math.ceil(leftMs / 1000)}s
        </span>
      </header>
      <div className="lightning-bar" aria-hidden="true">
        <span className={frac < 0.25 ? 'danger' : ''} style={{ width: `${frac * 100}%` }} />
      </div>

      <div className="board-wrap">
        <Board game={game} mode={mode} width={puzzle.width} height={puzzle.height} fillToken={fillToken} />
      </div>

      <div className="mode-toggle">
        <button className={`btn ${mode === 'fill' ? 'btn-primary' : ''}`} onClick={() => setMode('fill')}>
          <Icon name={fillToken} /> Fill
        </button>
        <button className={`btn ${mode === 'cross' ? 'btn-primary' : ''}`} onClick={() => setMode('cross')}>
          <Icon name="bamboo-token" /> Cross
        </button>
      </div>

      {(won != null || lost) && (
        <LightningEnd won={won} onRetry={retry} onBack={onBack} />
      )}
    </div>
  );
}

function LightningEnd({ won, onRetry, onBack }: { won: number | null; onRetry: () => void; onBack: () => void }) {
  // Play the lose jingle once when the overlay appears for a loss.
  useEffect(() => {
    if (won == null) playLose();
  }, [won]);
  return (
    <div className="arcade-win" role="status">
      {won != null ? (
        <>
          <p className="arcade-win-title">Beat the clock!</p>
          <p className="arcade-win-reward">
            <Icon name="bamboo" /> +{won} bamboo
          </p>
        </>
      ) : (
        <>
          <p className="arcade-win-title">Time&apos;s up!</p>
          <p className="arcade-win-note">So close — another quick one?</p>
        </>
      )}
      <div className="reveal-actions">
        <button className="btn btn-primary" onClick={onRetry}>
          {won != null ? 'Another!' : 'Try again'}
        </button>
        <button className="btn btn-ghost" onClick={onBack}>
          Arcade
        </button>
      </div>
    </div>
  );
}
