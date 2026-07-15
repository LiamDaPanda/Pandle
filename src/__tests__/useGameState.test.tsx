import { describe, it, expect, vi } from 'vitest';
import { act, renderHook } from '@testing-library/react';
import { useGameState } from '../hooks/useGameState';
import { toBoolGrid } from '../game/clues';
import { Puzzle } from '../game/types';

const puzzle: Puzzle = {
  id: 'ring', name: 'Ring', icon: 'panda', difficulty: 'easy',
  width: 3, height: 3, grid: ['KKK', 'K.K', 'KKK'],
};

describe('useGameState', () => {
  it('detects a solve and fires onSolved once', () => {
    const onSolved = vi.fn();
    const { result } = renderHook(() => useGameState(puzzle, undefined, onSolved));

    const solution = toBoolGrid(puzzle);
    act(() => {
      for (let y = 0; y < puzzle.height; y++) {
        for (let x = 0; x < puzzle.width; x++) {
          if (solution[y][x]) result.current.paint(x, y, 'fill');
        }
      }
    });

    expect(result.current.solved).toBe(true);
    expect(onSolved).toHaveBeenCalledTimes(1);
  });

  it('supports undo', () => {
    const { result } = renderHook(() => useGameState(puzzle));
    act(() => result.current.paint(0, 0, 'fill'));
    expect(result.current.marks[0][0]).toBe('filled');
    act(() => result.current.undo());
    expect(result.current.marks[0][0]).toBe('empty');
  });

  it('marks completed rows as done', () => {
    const { result } = renderHook(() => useGameState(puzzle));
    act(() => {
      result.current.paint(0, 0, 'fill');
      result.current.paint(1, 0, 'fill');
      result.current.paint(2, 0, 'fill');
    });
    expect(result.current.rowDone[0]).toBe(true);
  });

  it('auto-crosses the rest of a satisfied line', () => {
    // Middle row clue is "1 1" (K.K): filling both ends completes the row,
    // so the centre cell should be auto-crossed.
    const { result } = renderHook(() =>
      useGameState(puzzle, undefined, undefined, { autoCross: true }),
    );
    act(() => {
      result.current.paint(0, 1, 'fill');
      result.current.paint(2, 1, 'fill');
    });
    expect(result.current.marks[1][1]).toBe('crossed');
    // One undo unwinds the fill and its auto-cross together.
    act(() => result.current.undo());
    expect(result.current.marks[1][1]).toBe('empty');
    expect(result.current.marks[2][1]).toBe('empty');
  });

  it('does not auto-cross when disabled', () => {
    const { result } = renderHook(() => useGameState(puzzle));
    act(() => {
      result.current.paint(0, 1, 'fill');
      result.current.paint(2, 1, 'fill');
    });
    expect(result.current.marks[1][1]).toBe('empty');
  });

  it('guided mode rejects a wrong fill and reports it', () => {
    const onMistake = vi.fn();
    const { result } = renderHook(() =>
      useGameState(puzzle, undefined, undefined, { mistakeAlerts: true, onMistake }),
    );
    act(() => result.current.paint(1, 1, 'fill')); // centre is empty in the solution
    expect(result.current.marks[1][1]).toBe('empty');
    expect(result.current.mistake).toMatchObject({ x: 1, y: 1 });
    expect(onMistake).toHaveBeenCalledWith(1, 1);
    // A rejected fill leaves nothing on the undo stack.
    expect(result.current.canUndo).toBe(false);
    // Correct fills still work.
    act(() => result.current.paint(0, 0, 'fill'));
    expect(result.current.marks[0][0]).toBe('filled');
  });
});
