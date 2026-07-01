import { CellMark } from '../../game/types';

interface CellProps {
  x: number;
  y: number;
  mark: CellMark;
  thickRight: boolean;
  thickBottom: boolean;
}

/**
 * A single board cell. Filled and crossed are distinguished by *shape* (solid
 * block vs. an ✕) as well as color, for colorblind friendliness.
 */
export function Cell({ x, y, mark, thickRight, thickBottom }: CellProps) {
  const cls = [
    'cell',
    `cell-${mark}`,
    thickRight ? 'thick-right' : '',
    thickBottom ? 'thick-bottom' : '',
  ]
    .filter(Boolean)
    .join(' ');
  return (
    <div className={cls} data-cell data-x={x} data-y={y} aria-label={`cell ${x + 1}, ${y + 1}`}>
      {mark === 'crossed' && <span className="cross-mark">✕</span>}
    </div>
  );
}
