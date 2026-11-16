import { describe, expect, it } from 'vitest';
import { matchScore, verdictFor } from './listen';

describe('speech match', () => {
  it('scores a perfect read as 1, ignoring capitals, accents and punctuation', () => {
    expect(matchScore('¡Hola! Me llamo Adele.', ['hola me llamo adele'])).toBe(1);
    expect(matchScore('Hablo inglés.', ['hablo ingles'])).toBe(1);
  });

  it('takes the best of several guesses', () => {
    expect(matchScore('Tengo doce años', ['tengo dos años', 'tengo doce años'])).toBe(1);
  });

  it('gives part marks for part of the sentence', () => {
    expect(matchScore('Vivo en Tiflis con mi familia', ['vivo en tiflis'])).toBeCloseTo(0.5);
  });

  it('is gentle: half right is "close", not wrong', () => {
    expect(verdictFor(1)).toBe('great');
    expect(verdictFor(0.6)).toBe('close');
    expect(verdictFor(0.2)).toBe('again');
  });

  it('scores nothing heard as 0', () => {
    expect(matchScore('Hola', [])).toBe(0);
  });
});
