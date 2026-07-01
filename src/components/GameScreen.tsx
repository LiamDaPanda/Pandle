import { useCallback, useEffect, useRef, useState } from 'react';
import { CellMark, Puzzle } from '../game/types';
import { useGameState } from '../hooks/useGameState';
import { Settings } from '../state/settings';
import { celebrate } from '../effects/celebrate';
import { playWin, playHint } from '../effects/sound';
import { Board } from './Board/Board';
import { Controls } from './Controls';
import { RevealOverlay } from './RevealOverlay';
import { formatTime, ShareResult } from '../game/share';

export interface RevealInfo {
  stars?: number;
  bambooEarned?: number;
  streak?: number;
  puzzleNumber?: number;
}

interface GameScreenProps {
  puzzle: Puzzle;
  mode: ShareResult['mode'];
  settings: Settings;
  effectColors: string[];
  initialMarks?: CellMark[][];
  /** Called on every board change (used to persist an in-progress daily). */
  onPersist?: (marks: CellMark[][], solved: boolean) => void;
  /** Called once when solved; returns reveal details (stars, rewards, streak). */
  onSolved?: (timeMs: number) => RevealInfo;
  onHome: () => void;
  onNext?: () => void;
  nextLabel?: string;
  subtitle?: string;
  /** Bamboo available to spend on hints. */
  bamboo?: number;
  onSpendBamboo?: (n: number) => void;
}

const HINT_COST = 3;

export function GameScreen(props: GameScreenProps) {
  const { puzzle, settings, effectColors } = props;
  const [mode, setMode] = useState<'fill' | 'cross'>(settings.defaultPaintMode);
  const [reveal, setReveal] = useState<RevealInfo | null>(null);
  const persistRef = useRef(props.onPersist);
  persistRef.current = props.onPersist;

  const handleSolved = useCallback(
    (timeMs: number) => {
      const info = props.onSolved?.(timeMs) ?? {};
      setReveal(info);
      celebrate(effectColors, settings.reducedMotion);
      playWin();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [effectColors, settings.reducedMotion],
  );

  const game = useGameState(puzzle, props.initialMarks, handleSolved);

  const bamboo = props.bamboo ?? 0;
  const canHint = !game.solved && bamboo >= HINT_COST;
  const useHint = () => {
    if (!canHint) return;
    if (game.hint()) {
      props.onSpendBamboo?.(HINT_COST);
      playHint();
    }
  };

  // Persist board on change (throttled by React batching).
  useEffect(() => {
    persistRef.current?.(game.marks, game.solved);
  }, [game.marks, game.solved]);

  return (
    <div className="game-screen">
      <header className="game-header">
        <button className="btn btn-ghost btn-small" onClick={props.onHome}>
          ← Back
        </button>
        <div className="game-title">
          <span className="game-name">
            {puzzle.emoji} {puzzle.name}
          </span>
          {props.subtitle && <span className="game-sub">{props.subtitle}</span>}
        </div>
        <span className="timer" aria-live="off">
          {formatTime(game.elapsedMs)}
        </span>
      </header>

      <div className="board-wrap">
        <Board game={game} mode={mode} width={puzzle.width} height={puzzle.height} />
      </div>

      <Controls
        mode={mode}
        onMode={setMode}
        onUndo={game.undo}
        onReset={game.reset}
        onHint={useHint}
        hintCost={HINT_COST}
        canHint={canHint}
        canUndo={game.canUndo}
      />

      {reveal && (
        <RevealOverlay
          puzzle={puzzle}
          timeMs={game.elapsedMs}
          stars={reveal.stars}
          bambooEarned={reveal.bambooEarned}
          streak={reveal.streak}
          puzzleNumber={reveal.puzzleNumber}
          mode={props.mode}
          onNext={props.onNext}
          nextLabel={props.nextLabel}
          onHome={props.onHome}
        />
      )}
    </div>
  );
}
