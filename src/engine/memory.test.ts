import { describe, expect, it } from 'vitest';
import { dueItems, isDue, newMemory, recordAnswer, strength } from './memory';

describe('memory strength', () => {
  it('starts with a half-life of one day', () => {
    expect(newMemory('w.hola', '2026-11-16').halfLife).toBe(1);
  });

  it('doubles the half-life when she is right and halves it when she is wrong', () => {
    let m = newMemory('w.hola', '2026-11-16');
    m = recordAnswer(m, true, '2026-11-16');
    expect(m.halfLife).toBe(2);
    m = recordAnswer(m, true, '2026-11-16');
    expect(m.halfLife).toBe(4);
    m = recordAnswer(m, false, '2026-11-16');
    expect(m.halfLife).toBe(2);
  });

  it('never goes below one day', () => {
    let m = newMemory('w.hola', '2026-11-16');
    for (let i = 0; i < 5; i += 1) m = recordAnswer(m, false, '2026-11-16');
    expect(m.halfLife).toBe(1);
  });

  it('is 1 on the day she saw it and 0.5 one half-life later', () => {
    const m = { ...newMemory('w.hola', '2026-11-16'), halfLife: 4 };
    expect(strength(m, '2026-11-16')).toBe(1);
    expect(strength(m, '2026-11-20')).toBeCloseTo(0.5);
    expect(isDue(m, '2026-11-20')).toBe(false);
    expect(isDue(m, '2026-11-21')).toBe(true);
  });

  it('lists the weakest items first', () => {
    const memory = {
      a: { ...newMemory('a', '2026-11-10'), halfLife: 1 },
      b: { ...newMemory('b', '2026-11-14'), halfLife: 1 },
      c: { ...newMemory('c', '2026-11-16'), halfLife: 8 },
    };
    expect(dueItems(memory, '2026-11-16')).toEqual(['a', 'b']);
  });
});
