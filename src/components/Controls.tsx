interface ControlsProps {
  mode: 'fill' | 'cross';
  onMode: (m: 'fill' | 'cross') => void;
  onUndo: () => void;
  onReset: () => void;
  canUndo: boolean;
}

export function Controls({ mode, onMode, onUndo, onReset, canUndo }: ControlsProps) {
  return (
    <div className="controls">
      <div className="mode-toggle" role="group" aria-label="Paint mode">
        <button
          className={`mode-btn ${mode === 'fill' ? 'active' : ''}`}
          onClick={() => onMode('fill')}
          aria-pressed={mode === 'fill'}
        >
          <span className="mode-swatch fill" /> Fill
        </button>
        <button
          className={`mode-btn ${mode === 'cross' ? 'active' : ''}`}
          onClick={() => onMode('cross')}
          aria-pressed={mode === 'cross'}
        >
          <span className="mode-swatch cross">✕</span> Cross
        </button>
      </div>
      <div className="control-actions">
        <button className="btn btn-small" onClick={onUndo} disabled={!canUndo}>
          ↩︎ Undo
        </button>
        <button className="btn btn-small btn-ghost" onClick={onReset}>
          Reset
        </button>
      </div>
    </div>
  );
}
