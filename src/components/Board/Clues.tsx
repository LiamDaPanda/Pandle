interface ColCluesProps {
  cols: number[][];
  done: boolean[];
}

export function ColClues({ cols, done }: ColCluesProps) {
  return (
    <div className="col-clues" style={{ gridTemplateColumns: `repeat(${cols.length}, 1fr)` }}>
      {cols.map((clue, x) => (
        <div key={x} className={`col-clue ${done[x] ? 'clue-done' : ''}`}>
          {clue.map((n, i) => (
            <span key={i} className="clue-num">
              {n}
            </span>
          ))}
        </div>
      ))}
    </div>
  );
}

interface RowCluesProps {
  rows: number[][];
  done: boolean[];
}

export function RowClues({ rows, done }: RowCluesProps) {
  return (
    <div className="row-clues" style={{ gridTemplateRows: `repeat(${rows.length}, 1fr)` }}>
      {rows.map((clue, y) => (
        <div key={y} className={`row-clue ${done[y] ? 'clue-done' : ''}`}>
          {clue.map((n, i) => (
            <span key={i} className="clue-num">
              {n}
            </span>
          ))}
        </div>
      ))}
    </div>
  );
}
