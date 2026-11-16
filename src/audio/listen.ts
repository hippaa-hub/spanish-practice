import { normalise, stripAccents } from '../engine/answers';

/**
 * Speech recognition (the browser's own, es-ES), used only where the browser
 * has it. It is a gentle helper, never a judge: she can always say
 * "I said it well" herself.
 */

type Recogniser = {
  lang: string;
  interimResults: boolean;
  maxAlternatives: number;
  continuous: boolean;
  start: () => void;
  stop: () => void;
  abort: () => void;
  onresult: ((e: { results: ArrayLike<ArrayLike<{ transcript: string }>> }) => void) | null;
  onerror: ((e: unknown) => void) | null;
  onend: (() => void) | null;
};

const Ctor = (): (new () => Recogniser) | undefined => {
  if (typeof window === 'undefined') return undefined;
  const w = window as unknown as { SpeechRecognition?: new () => Recogniser; webkitSpeechRecognition?: new () => Recogniser };
  return w.SpeechRecognition ?? w.webkitSpeechRecognition;
};

export const canRecognise = (): boolean => Boolean(Ctor());

export type Listening = { stop: () => Promise<string[]> };

/** Starts listening. `stop()` resolves to what the browser heard (several guesses), or [] . */
export const startListening = (): Listening | null => {
  const C = Ctor();
  if (!C) return null;
  let rec: Recogniser;
  try {
    rec = new C();
  } catch {
    return null;
  }
  rec.lang = 'es-ES';
  rec.interimResults = false;
  rec.maxAlternatives = 3;
  rec.continuous = true;
  const heard: string[] = [];
  let ended = false;
  let resolveEnd: (() => void) | null = null;
  rec.onresult = (e) => {
    for (let i = 0; i < e.results.length; i += 1) {
      const r = e.results[i];
      for (let j = 0; j < r.length; j += 1) heard.push(r[j].transcript);
    }
  };
  rec.onerror = () => {};
  rec.onend = () => {
    ended = true;
    resolveEnd?.();
  };
  try {
    rec.start();
  } catch {
    return null;
  }
  return {
    stop: () =>
      new Promise((resolve) => {
        if (ended) return resolve([...new Set(heard)]);
        resolveEnd = () => resolve([...new Set(heard)]);
        try {
          rec.stop();
        } catch {
          resolve([...new Set(heard)]);
        }
        // Some browsers never fire "end": do not leave her waiting.
        window.setTimeout(() => resolve([...new Set(heard)]), 2500);
      }),
  };
};

const words = (s: string) => stripAccents(normalise(s)).replace(/[.,;:!?"]/g, ' ').split(/\s+/).filter(Boolean);

/**
 * How much of the sentence was heard: the share of its words that turn up in
 * the best guess, in any order. 1 = every word.
 */
export const matchScore = (target: string, guesses: string[]): number => {
  const want = words(target);
  if (!want.length || !guesses.length) return 0;
  let best = 0;
  for (const g of guesses) {
    const got = new Set(words(g));
    const hit = want.filter((w) => got.has(w)).length / want.length;
    best = Math.max(best, hit);
  }
  return best;
};

export type SpeechVerdict = 'great' | 'close' | 'again';

/** Gentle wording: no score below "try again", and "close" still counts as a good try. */
export const verdictFor = (score: number): SpeechVerdict => (score >= 0.8 ? 'great' : score >= 0.5 ? 'close' : 'again');
