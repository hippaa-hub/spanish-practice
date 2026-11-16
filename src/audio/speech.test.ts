import { describe, expect, it } from 'vitest';
import { wordAt, wordStarts } from './speech';

describe('lighting up words as they are read', () => {
  it('finds where each word starts', () => {
    expect(wordStarts('¡Hola! Me llamo Mateo.')).toEqual([0, 7, 10, 16]);
  });

  it('knows which word a character belongs to', () => {
    const starts = wordStarts('¡Hola! Me llamo Mateo.');
    expect(wordAt(starts, 0)).toBe(0);
    expect(wordAt(starts, 12)).toBe(2);
    expect(wordAt(starts, 21)).toBe(3);
  });
});
