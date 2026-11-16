import { describe, expect, it } from 'vitest';
import { checkAnswer, checkOpenAnswer, normalise } from './answers';

describe('checking answers', () => {
  it('ignores capitals and final punctuation', () => {
    expect(checkAnswer('me llamo adele', 'Me llamo Adele.').judgement).toBe('right');
    expect(normalise('¿Cómo te llamas?')).toBe('cómo te llamas');
  });

  it('accepts a question without the opening ¿', () => {
    expect(checkAnswer('Cómo te llamas?', '¿Cómo te llamas?').correct).toBe(true);
  });

  it('counts a missing accent as right but says to watch it', () => {
    const check = checkAnswer('ingles', 'inglés');
    expect(check.judgement).toBe('accent');
    expect(check.correct).toBe(true);
    expect(check.correction).toBe('inglés');
  });

  it('calls one wrong letter "Almost!" and counts it wrong', () => {
    const check = checkAnswer('mochilla', 'mochila');
    expect(check.judgement).toBe('almost');
    expect(check.correct).toBe(false);
  });

  it('accepts any listed alternative', () => {
    expect(checkAnswer('Soy Adele', 'Me llamo Adele', ['Soy Adele']).correct).toBe(true);
  });

  it('rejects a different word', () => {
    expect(checkAnswer('adiós', 'hola').judgement).toBe('wrong');
  });
});

describe('answering a question in her own words', () => {
  it('accepts an answer that starts the right way and says something', () => {
    expect(checkOpenAnswer('Me llamo Adele', ['me llamo', 'soy']).correct).toBe(true);
    expect(checkOpenAnswer('Soy Adele.', ['me llamo', 'soy']).correct).toBe(true);
    expect(checkOpenAnswer('vivo en Tiflis', ['vivo en', 'vivo']).correct).toBe(true);
  });

  it('nudges her when she starts right but stops there', () => {
    const check = checkOpenAnswer('Me llamo', ['me llamo']);
    expect(check.correct).toBe(false);
    expect(check.message).toMatch(/finish/i);
  });

  it('tells her how to start when the shape is wrong', () => {
    const check = checkOpenAnswer('Adele', ['me llamo', 'soy']);
    expect(check.correct).toBe(false);
    expect(check.message).toContain('me llamo');
  });

  it('accepts a bare sí or no', () => {
    expect(checkOpenAnswer('No', ['sí', 'si', 'no']).correct).toBe(true);
    expect(checkOpenAnswer('Sí, tengo un gato', ['sí', 'si', 'no']).correct).toBe(true);
  });

  it('ignores accents in the opening words', () => {
    expect(checkOpenAnswer('Mi cumpleanos es el cinco de mayo', ['mi cumpleaños es']).correct).toBe(true);
  });
});
