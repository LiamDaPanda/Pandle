interface HowToPlayProps {
  onClose: () => void;
}

export function HowToPlay({ onClose }: HowToPlayProps) {
  return (
    <div className="sheet">
      <div className="sheet-header">
        <h2>How to play</h2>
        <button className="btn btn-ghost btn-small" onClick={onClose}>
          Close
        </button>
      </div>
      <div className="sheet-body">
        <ol className="rules">
          <li>
            <strong>Read the clues.</strong> The numbers on each row and column list the lengths of
            the <em>filled</em> blocks, in order.
          </li>
          <li>
            <strong>Gaps between blocks.</strong> There is at least one empty cell between two
            numbered blocks.
          </li>
          <li>
            <strong>Fill or cross.</strong> Tap to fill a cell. Switch to <em>Cross</em> mode to mark
            cells you know are empty. Drag to paint a whole line.
          </li>
          <li>
            <strong>No guessing, ever.</strong> Every Pandle puzzle can be solved by pure logic —
            if you’re stuck, there’s always a deducible move.
          </li>
          <li>
            <strong>Reveal the panda.</strong> Satisfy every row and column and the hidden picture
            comes to life!
          </li>
        </ol>
        <div className="rule-example">
          <p className="example-caption">A clue of “2 1” means a block of 2, a gap, then a block of 1:</p>
          <div className="example-row">
            <span className="ex fill" />
            <span className="ex fill" />
            <span className="ex empty" />
            <span className="ex fill" />
            <span className="ex empty" />
          </div>
        </div>
      </div>
      <button className="btn btn-primary sheet-cta" onClick={onClose}>
        Let’s play!
      </button>
    </div>
  );
}
