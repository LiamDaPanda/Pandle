import { CellMark } from '../../game/types';
import { Icon, IconName } from '../Icon';

interface CellProps {
  x: number;
  y: number;
  mark: CellMark;
  fillToken: IconName;
  thickRight: boolean;
  thickBottom: boolean;
}

/**
 * A single board cell. Filled shows a panda token, crossed shows a bamboo token
 * — distinct shapes (not just color) for colorblind friendliness.
 */
export function Cell({ x, y, mark, fillToken, thickRight, thickBottom }: CellProps) {
  const cls = [
    'cell',
    `cell-${mark}`,
    thickRight ? 'thick-right' : '',
    thickBottom ? 'thick-bottom' : '',
  ]
    .filter(Boolean)
    .join(' ');
  const label = `cell ${x + 1}, ${y + 1}${mark === 'empty' ? '' : `, ${mark}`}`;
  return (
    <div className={cls} data-cell data-x={x} data-y={y} aria-label={label}>
      {mark === 'filled' && <Icon name={fillToken} className="token" size="100%" />}
      {mark === 'crossed' && <Icon name="bamboo-token" className="token" size="86%" />}
    </div>
  );
}
