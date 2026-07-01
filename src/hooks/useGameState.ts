import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { CellMark, Clues, Puzzle } from '../game/types';
import { deriveClues } from '../game/clues';
import { emptyBoard, isSolved, isLineSatisfied } from '../game/solve';
import { computeHint } from '../game/hint';

export type PaintAction = 'fill' | 'cross' | 'clear';

export interface GameState {
  clues: Clues;
  marks: CellMark[][];
  solved: boolean;
  elapsedMs: number;
  rowDone: boolean[];
  colDone: boolean[];
  paint: (x: number, y: number, action: PaintAction) => void;
  actionFor: (x: number, y: number, mode: 'fill' | 'cross') => PaintAction;
  undo: () => void;
  reset: () => void;
  hint: () => boolean;
  canUndo: boolean;
}

/** Deep-ish clone of a marks grid (rows copied). */
function cloneMarks(marks: CellMark[][]): CellMark[][] {
  return marks.map((row) => row.slice());
}

export function useGameState(
  puzzle: Puzzle,
  initialMarks?: CellMark[][],
  onSolved?: (elapsedMs: number) => void,
): GameState {
  const clues = useMemo(() => deriveClues(puzzle), [puzzle]);
  const [marks, setMarks] = useState<CellMark[][]>(
    () => initialMarks ?? emptyBoard(puzzle.width, puzzle.height),
  );
  const [history, setHistory] = useState<CellMark[][][]>([]);
  const [solved, setSolved] = useState(false);
  const [elapsedMs, setElapsedMs] = useState(0);
  const startRef = useRef<number>(Date.now());
  const solvedRef = useRef(false);

  // Reset everything when the puzzle changes.
  useEffect(() => {
    setMarks(initialMarks ?? emptyBoard(puzzle.width, puzzle.height));
    setHistory([]);
    setSolved(false);
    solvedRef.current = false;
    startRef.current = Date.now();
    setElapsedMs(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [puzzle.id]);

  // Tick the timer until solved.
  useEffect(() => {
    if (solved) return;
    const t = setInterval(() => setElapsedMs(Date.now() - startRef.current), 250);
    return () => clearInterval(t);
  }, [solved]);

  const actionFor = useCallback(
    (x: number, y: number, mode: 'fill' | 'cross'): PaintAction => {
      const current = marks[y][x];
      if (mode === 'fill') return current === 'filled' ? 'clear' : 'fill';
      return current === 'crossed' ? 'clear' : 'cross';
    },
    [marks],
  );

  const paint = useCallback(
    (x: number, y: number, action: PaintAction) => {
      if (solvedRef.current) return;
      setMarks((prev) => {
        const target: CellMark =
          action === 'fill' ? 'filled' : action === 'cross' ? 'crossed' : 'empty';
        if (prev[y][x] === target) return prev;
        setHistory((h) => [...h.slice(-99), cloneMarks(prev)]);
        const next = cloneMarks(prev);
        next[y][x] = target;
        return next;
      });
    },
    [],
  );

  const undo = useCallback(() => {
    setHistory((h) => {
      if (h.length === 0) return h;
      const prev = h[h.length - 1];
      setMarks(prev);
      return h.slice(0, -1);
    });
  }, []);

  const reset = useCallback(() => {
    setMarks((prev) => {
      setHistory((h) => [...h.slice(-99), cloneMarks(prev)]);
      return emptyBoard(puzzle.width, puzzle.height);
    });
  }, [puzzle.width, puzzle.height]);

  const hint = useCallback((): boolean => {
    if (solvedRef.current) return false;
    const h = computeHint(marks, clues);
    if (!h) return false;
    paint(h.x, h.y, h.mark === 'filled' ? 'fill' : 'cross');
    return true;
  }, [marks, clues, paint]);

  // Win detection.
  useEffect(() => {
    if (solvedRef.current) return;
    if (isSolved(marks, clues)) {
      solvedRef.current = true;
      const finalMs = Date.now() - startRef.current;
      setElapsedMs(finalMs);
      setSolved(true);
      onSolved?.(finalMs);
    }
  }, [marks, clues, onSolved]);

  const rowDone = useMemo(
    () => marks.map((row, y) => isLineSatisfied(row, clues.rows[y])),
    [marks, clues],
  );
  const colDone = useMemo(
    () =>
      clues.cols.map((clue, x) => isLineSatisfied(marks.map((row) => row[x]), clue)),
    [marks, clues],
  );

  return {
    clues,
    marks,
    solved,
    elapsedMs,
    rowDone,
    colDone,
    paint,
    actionFor,
    undo,
    reset,
    hint,
    canUndo: history.length > 0,
  };
}
