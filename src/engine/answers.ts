export type Judgement = 'right' | 'accent' | 'almost' | 'wrong';

export type Check = {
  judgement: Judgement;
  /** Right for the memory engine? ('accent' is counted right, 'almost' is not.) */
  correct: boolean;
  /** The spelling to show her. */
  correction: string;
  message?: string;
};

const ACCENTS: Record<string, string> = { á: 'a', é: 'e', í: 'i', ó: 'o', ú: 'u', ü: 'u', ñ: 'n' };

/** Lower case, no ¿ ¡, no final punctuation, single spaces. */
export const normalise = (s: string): string =>
  s
    .toLowerCase()
    .replace(/[¿¡]/g, '')
    .replace(/[.!?,;:]+$/g, '')
    .replace(/\s+/g, ' ')
    .trim();

export const stripAccents = (s: string): string => s.replace(/[áéíóúüñ]/g, (c) => ACCENTS[c] ?? c);

const distance = (a: string, b: string): number => {
  const prev = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i += 1) {
    let left = prev[0];
    prev[0] = i;
    for (let j = 1; j <= b.length; j += 1) {
      const up = prev[j];
      prev[j] = Math.min(prev[j] + 1, prev[j - 1] + 1, left + (a[i - 1] === b[j - 1] ? 0 : 1));
      left = up;
    }
  }
  return prev[b.length];
};

/**
 * Checking rules (PLAN section 5):
 * ignore case and final punctuation, accept answers without ¿ and ¡,
 * a missing accent is correct but flagged, one wrong letter is "Almost!".
 */
export const checkAnswer = (given: string, expected: string, alternatives: string[] = []): Check => {
  const g = normalise(given);
  const all = [expected, ...alternatives];

  for (const option of all) {
    if (g === normalise(option)) return { judgement: 'right', correct: true, correction: option };
  }
  for (const option of all) {
    if (stripAccents(g) === stripAccents(normalise(option))) {
      return {
        judgement: 'accent',
        correct: true,
        correction: option,
        message: 'Watch the accent',
      };
    }
  }
  for (const option of all) {
    if (distance(stripAccents(g), stripAccents(normalise(option))) <= 1 && g.length > 2) {
      return { judgement: 'almost', correct: false, correction: option, message: 'Almost!' };
    }
  }
  return { judgement: 'wrong', correct: false, correction: expected };
};

const SHORT_ANSWERS = ['si', 'no'];

/**
 * An open answer ("¿Cómo te llamas?" → "Me llamo Adele") is right when it
 * starts the way Spanish needs and she then says something of her own.
 * The app never writes the answer for her; it only checks the shape.
 */
export const checkOpenAnswer = (given: string, starts: string[]): Check => {
  const g = stripAccents(normalise(given));
  for (const start of starts) {
    const s = stripAccents(normalise(start));
    if (!g.startsWith(s)) continue;
    const rest = g.slice(s.length).replace(/^[\s,.:;]+/, '');
    if (rest.length > 0 || SHORT_ANSWERS.includes(s)) {
      return { judgement: 'right', correct: true, correction: given.trim() };
    }
    return {
      judgement: 'wrong',
      correct: false,
      correction: given.trim(),
      message: 'Good start — now finish the sentence',
    };
  }
  return {
    judgement: 'wrong',
    correct: false,
    correction: given.trim(),
    message: `Start your answer with "${starts[0]}"`,
  };
};
