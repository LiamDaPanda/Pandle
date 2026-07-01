import { Icon, IconName } from './Icon';

interface ControlsProps {
  mode: 'fill' | 'cross';
  onMode: (m: 'fill' | 'cross') => void;
  onUndo: () => void;
  onReset: () => void;
  onHint: () => void;
  hintCost: number;
  canHint: boolean;
  canUndo: boolean;
  fillToken: IconName;
}

export function Controls({
  mode,
  onMode,
  onUndo,
  onReset,
  onHint,
  hintCost,
  canHint,
  canUndo,
  fillToken,
}: ControlsProps) {
  return (
    <div className="controls">
      <div className="mode-toggle" role="group" aria-label="Paint mode">
        <button
          className={`mode-btn ${mode === 'fill' ? 'active' : ''}`}
          onClick={() => onMode('fill')}
          aria-pressed={mode === 'fill'}
        >
          <Icon name={fillToken} className="mode-swatch" size="1.4em" /> Fill
        </button>
        <button
          className={`mode-btn ${mode === 'cross' ? 'active' : ''}`}
          onClick={() => onMode('cross')}
          aria-pressed={mode === 'cross'}
        >
          <Icon name="bamboo-token" className="mode-swatch" size="1.4em" /> Cross
        </button>
      </div>
      <div className="control-actions">
        <button className="btn btn-small" onClick={onUndo} disabled={!canUndo}>
          <Icon name="undo" /> Undo
        </button>
        <button className="btn btn-small btn-primary" onClick={onHint} disabled={!canHint}>
          <Icon name="bulb" /> Hint · <Icon name="bamboo" />
          {hintCost}
        </button>
        <button className="btn btn-small btn-ghost" onClick={onReset}>
          Reset
        </button>
      </div>
    </div>
  );
}
