import { useRef } from 'react';
import { GameState, PaintAction } from '../../hooks/useGameState';
import { tick } from '../../effects/sound';
import { IconName } from '../Icon';
import { Cell } from './Cell';
import { ColClues, RowClues } from './Clues';

interface BoardProps {
  game: GameState;
  mode: 'fill' | 'cross';
  width: number;
  height: number;
  fillToken: IconName;
}

/**
 * Renders clues + grid and handles tap / drag painting for both mouse and
 * touch. On pointer-down we lock in an action (fill / cross / clear) and drag
 * applies that same action to every cell the finger passes over.
 */
export function Board({ game, mode, width, height, fillToken }: BoardProps) {
  const dragAction = useRef<PaintAction | null>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  const cellAt = (clientX: number, clientY: number): { x: number; y: number } | null => {
    const el = document.elementFromPoint(clientX, clientY) as HTMLElement | null;
    const cell = el?.closest('[data-cell]') as HTMLElement | null;
    if (!cell) return null;
    const x = Number(cell.dataset.x);
    const y = Number(cell.dataset.y);
    if (Number.isNaN(x) || Number.isNaN(y)) return null;
    return { x, y };
  };

  const onPointerDown = (e: React.PointerEvent) => {
    const pos = cellAt(e.clientX, e.clientY);
    if (!pos) return;
    (e.target as HTMLElement).releasePointerCapture?.(e.pointerId);
    const action = game.actionFor(pos.x, pos.y, mode);
    dragAction.current = action;
    tick(action);
    game.paint(pos.x, pos.y, action);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (dragAction.current == null) return;
    const pos = cellAt(e.clientX, e.clientY);
    if (!pos) return;
    game.paint(pos.x, pos.y, dragAction.current);
  };

  const endDrag = () => {
    dragAction.current = null;
  };

  return (
    <div
      className={`board ${game.solved ? 'board-solved' : ''}`}
      style={{ '--cols': width, '--rows': height } as React.CSSProperties}
    >
      <div className="board-corner" />
      <ColClues cols={game.clues.cols} done={game.colDone} />
      <RowClues rows={game.clues.rows} done={game.rowDone} />
      <div
        ref={gridRef}
        className="grid"
        style={{
          gridTemplateColumns: `repeat(${width}, 1fr)`,
          gridTemplateRows: `repeat(${height}, 1fr)`,
        }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerLeave={endDrag}
        onPointerCancel={endDrag}
      >
        {game.marks.map((row, y) =>
          row.map((mark, x) => (
            <Cell
              key={`${x}-${y}`}
              x={x}
              y={y}
              mark={mark}
              fillToken={fillToken}
              thickRight={(x + 1) % 5 === 0 && x + 1 < width}
              thickBottom={(y + 1) % 5 === 0 && y + 1 < height}
            />
          )),
        )}
      </div>
    </div>
  );
}
