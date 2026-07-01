import { describe, it, expect, vi } from 'vitest';
import { act, renderHook } from '@testing-library/react';
import { useGameState } from '../hooks/useGameState';
import { toBoolGrid } from '../game/clues';
import { Puzzle } from '../game/types';

const puzzle: Puzzle = {
  id: 'ring', name: 'Ring', emoji: '🐼', difficulty: 'easy',
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
});
