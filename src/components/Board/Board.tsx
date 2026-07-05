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

interface Stroke {
  action: PaintAction;
  last: { x: number; y: number };
  start: { x: number; y: number };
  axis: 'row' | 'col' | null;
}

/**
 * Renders clues + grid and handles tap / slide painting for mouse and touch.
 * On pointer-down we lock in an action (fill / cross / clear); sliding paints
 * that same action along the way. The stroke is axis-locked to the row or
 * column you start moving along (like classic picross apps), the pointer is
 * captured by the grid so the slide never drops, and cells between samples
 * are interpolated so fast swipes don't skip squares.
 */
export function Board({ game, mode, width, height, fillToken }: BoardProps) {
  const stroke = useRef<Stroke | null>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  const cellAt = (clientX: number, clientY: number): { x: number; y: number } | null => {
    const rect = gridRef.current?.getBoundingClientRect();
    if (!rect || rect.width === 0) return null;
    const x = Math.floor(((clientX - rect.left) / rect.width) * width);
    const y = Math.floor(((clientY - rect.top) / rect.height) * height);
    if (x < 0 || y < 0 || x >= width || y >= height) return null;
    return { x, y };
  };

  const onPointerDown = (e: React.PointerEvent) => {
    const pos = cellAt(e.clientX, e.clientY);
    if (!pos) return;
    gridRef.current?.setPointerCapture(e.pointerId);
    const action = game.actionFor(pos.x, pos.y, mode);
    stroke.current = { action, last: pos, start: pos, axis: null };
    tick(action);
    game.paint(pos.x, pos.y, action);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    const s = stroke.current;
    if (!s) return;
    const pos = cellAt(e.clientX, e.clientY);
    if (!pos || (pos.x === s.last.x && pos.y === s.last.y)) return;

    // Lock the stroke to a row or column on the first real movement.
    if (!s.axis) {
      const dx = Math.abs(pos.x - s.start.x);
      const dy = Math.abs(pos.y - s.start.y);
      s.axis = dx >= dy ? 'row' : 'col';
    }
    const target =
      s.axis === 'row' ? { x: pos.x, y: s.start.y } : { x: s.start.x, y: pos.y };

    // Paint every cell between the last painted cell and the target so a fast
    // swipe never leaves gaps.
    if (s.axis === 'row') {
      const step = target.x > s.last.x ? 1 : -1;
      for (let x = s.last.x + step; step > 0 ? x <= target.x : x >= target.x; x += step) {
        game.paint(x, target.y, s.action);
      }
    } else {
      const step = target.y > s.last.y ? 1 : -1;
      for (let y = s.last.y + step; step > 0 ? y <= target.y : y >= target.y; y += step) {
        game.paint(target.x, y, s.action);
      }
    }
    s.last = target;
  };

  const endStroke = () => {
    stroke.current = null;
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
        onPointerUp={endStroke}
        onPointerCancel={endStroke}
        onLostPointerCapture={endStroke}
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
