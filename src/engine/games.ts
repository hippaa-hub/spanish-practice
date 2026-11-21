import { getItem, units } from '../content';
import { gameWords, raceDialogues, SYLLABLE_OVERRIDES, type RaceDialogue } from '../content/games';
import type { Item } from '../content/types';
import { strength } from './memory';
import { makeRng, type Rng } from './rng';
import { syllabify } from './syllables';
import type { ItemMemory } from './types';

/** The three games in Práctica. */
export type GameKind = 'catcher' | 'builder' | 'race';

export const GAMES: { kind: GameKind; icon: string; title: string; en: string }[] = [
  { kind: 'catcher', icon: '🫧', title: 'Sound Catcher', en: 'Hear a sound, tap its bubble before it floats away' },
  { kind: 'builder', icon: '🧩', title: 'Syllable builder', en: 'Build a word from its syllables' },
  { kind: 'race', icon: '🏁', title: "Coco's dialogue race", en: 'Put the dialogue in order against the clock' },
];

export const CATCHER_ROUNDS = 10;
export const BUILDER_WORDS = 8;
export const RACE_DIALOGUES = 3;
export const XP_GAME = 10;

type Memory = Record<string, ItemMemory>;

/** How well she knows an item now: 0 for one she has never met, so new things come first too. */
const known = (memory: Memory, id: string, today: string) => (memory[id] ? strength(memory[id], today) : 0);

/** Weakest first; ties broken at random so the same game is not dealt twice. */
const weakestFirst = <T>(xs: T[], id: (x: T) => string, memory: Memory, today: string, rng: Rng): T[] =>
  xs
    .map((x) => ({ x, s: known(memory, id(x), today), r: rng.next() }))
    .sort((a, b) => a.s - b.s || a.r - b.r)
    .map(({ x }) => x);

// ------------------------------------------------------------ Sound Catcher

export type CatcherRound = {
  /** The item to hear: a sound, a syllable or a word. */
  itemId: string;
  /** What is said aloud. */
  say: string;
  /** What is written in the right bubble. */
  answer: string;
  /** Bubbles in the order shown (4 to 6), the answer among them. */
  bubbles: string[];
};

/** A letter, syllable or word that fits in one bubble: no spaces, no slashes. */
const bubbleable = (i: Item) => /^[a-záéíóúñü]+$/i.test(i.es);

/**
 * Ten rounds: sounds and syllables from Unit 0 first, then whole words from
 * the units she has started. Weakest first, each item once.
 */
export const catcherRounds = (memory: Memory, today: string, seed?: number): CatcherRound[] => {
  const rng = makeRng(seed);
  const unit0 = units.find((u) => u.number === 0);
  const sounds = (unit0?.items ?? []).filter((i) => i.kind === 'sound' && bubbleable(i));
  const syllables = (unit0?.items ?? []).filter((i) => i.kind === 'syllable' && bubbleable(i));
  const words = gameWords().filter(({ item, word }) => word === item.es && word.length <= 9);
  const wordItems = [...new Map(words.map((w) => [w.word.toLowerCase(), w.item])).values()];

  const picked: Item[] = [
    ...weakestFirst(sounds, (i) => i.id, memory, today, rng).slice(0, 3),
    ...weakestFirst(syllables, (i) => i.id, memory, today, rng).slice(0, 4),
    ...weakestFirst(wordItems, (i) => i.id, memory, today, rng).slice(0, 3),
  ].slice(0, CATCHER_ROUNDS);

  const poolFor = (item: Item) =>
    item.kind === 'sound' ? sounds : item.kind === 'syllable' ? syllables : wordItems;

  return picked.map((item) => {
    const count = 4 + rng.int(3); // 4 to 6 bubbles
    const others = rng
      .shuffle(poolFor(item).filter((o) => o.id !== item.id && o.es.toLowerCase() !== item.es.toLowerCase()))
      .slice(0, count - 1)
      .map((o) => o.es);
    return {
      itemId: item.id,
      say: item.say ?? item.es,
      answer: item.es,
      bubbles: rng.shuffle([item.es, ...others]),
    };
  });
};

/** Seconds a bubble takes to float off: gently quicker every three right answers, never under 5 s. */
export const catcherSpeed = (right: number): number => Math.max(5, 9 - Math.floor(right / 3) * 0.8);

// ------------------------------------------------------------ Syllable builder

export type BuilderWord = {
  /** Item id for the memory engine (none for a Unit 0 reading word that is not an item). */
  itemId?: string;
  word: string;
  en: string;
  icon?: string;
  syllables: string[];
  /** The syllables plus 1 or 2 extra ones, shuffled. */
  tiles: string[];
};

/** The syllables of a word: the hand-written override if there is one, else the rules. */
export const syllablesOf = (word: string): string[] =>
  SYLLABLE_OVERRIDES[word.toLowerCase()] ?? syllabify(word);

/** Every word the builder can use, with its syllables: items of two syllables or more, plus Unit 0's reading words. */
export const builderPool = (): Omit<BuilderWord, 'tiles'>[] => {
  const seen = new Set<string>();
  const out: Omit<BuilderWord, 'tiles'>[] = [];
  for (const { item, word } of gameWords()) {
    const key = word.toLowerCase();
    if (seen.has(key)) continue;
    const syllables = syllablesOf(word);
    if (syllables.length < 2) continue;
    seen.add(key);
    out.push({ itemId: item.id, word, en: item.en, icon: item.icon, syllables });
  }
  for (const u of units) {
    for (const w of u.readWords ?? []) {
      const key = w.es.toLowerCase();
      if (seen.has(key) || w.syllables.length < 2) continue;
      seen.add(key);
      const match = out.find((o) => o.word.toLowerCase() === key);
      out.push({ itemId: match?.itemId, word: w.es, en: w.en, syllables: w.syllables });
    }
  }
  return out;
};

/** Eight words, weakest first, each with one or two distractor syllables. */
export const builderWords = (memory: Memory, today: string, seed?: number): BuilderWord[] => {
  const rng = makeRng(seed);
  const pool = builderPool();
  const chosen = weakestFirst(pool, (w) => w.itemId ?? w.word, memory, today, rng).slice(0, BUILDER_WORDS);
  const allSyllables = [...new Set(pool.flatMap((w) => w.syllables.map((s) => s.toLowerCase())))];
  return chosen.map((w) => {
    const mine = new Set(w.syllables.map((s) => s.toLowerCase()));
    const extras = rng.shuffle(allSyllables.filter((s) => !mine.has(s))).slice(0, 1 + rng.int(2));
    return { ...w, tiles: rng.shuffle([...w.syllables, ...extras]) };
  });
};

// ------------------------------------------------------------ Coco's dialogue race

export type Race = RaceDialogue & {
  /** The order the lines are first shown in (indexes into `lines`), never the right one. */
  shuffled: number[];
};

const dialogueStrength = (d: RaceDialogue, memory: Memory, today: string) =>
  d.items.length ? d.items.reduce((sum, id) => sum + known(memory, id, today), 0) / d.items.length : 0;

/** A scrambled order that is not the right one. */
const scramble = (n: number, rng: Rng): number[] => {
  const right = [...Array(n).keys()];
  for (let tries = 0; tries < 20; tries += 1) {
    const s = rng.shuffle(right);
    if (s.some((x, i) => x !== i)) return s;
  }
  return [...right.slice(1), right[0]];
};

/** Three dialogues, weakest words first, each scrambled. */
export const raceDialoguesFor = (memory: Memory, today: string, seed?: number): Race[] => {
  const rng = makeRng(seed);
  const all = raceDialogues().filter((d) => d.lines.length >= 3 && d.lines.length <= 6);
  const chosen = all
    .map((d) => ({ d, s: dialogueStrength(d, memory, today), r: rng.next() }))
    .sort((a, b) => a.s - b.s || a.r - b.r)
    .slice(0, RACE_DIALOGUES)
    .map(({ d }) => d);
  return chosen.map((d) => ({ ...d, shuffled: scramble(d.lines.length, rng) }));
};

/** Only real items go to the memory engine. */
export const realItems = (ids: string[]): string[] => ids.filter((id) => getItem(id));
