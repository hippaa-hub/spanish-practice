import { describe, expect, it } from 'vitest';
import { getItem, units } from '../content';
import { bareWord, raceDialogues } from '../content/games';
import { stories } from '../content/stories';
import {
  BUILDER_WORDS,
  builderWords,
  CATCHER_ROUNDS,
  catcherRounds,
  catcherSpeed,
  RACE_DIALOGUES,
  raceDialoguesFor,
} from './games';
import { newMemory } from './memory';
import type { ItemMemory } from './types';

const TODAY = '2026-11-22';
const allEs = new Set(units.flatMap((u) => u.items.map((i) => i.es)));
const allWords = new Set([
  ...units.flatMap((u) => u.items.map((i) => bareWord(i.es).toLowerCase())),
  ...units.flatMap((u) => (u.readWords ?? []).map((w) => w.es.toLowerCase())),
]);

/** A strong memory for an item: seen today with a long half-life. */
const strong = (id: string): ItemMemory => ({ ...newMemory(id, TODAY), halfLife: 60, right: 5 });

describe('Sound Catcher rounds', () => {
  it('deals ten rounds, each with 4 to 6 bubbles, the answer among them, no bubble twice', () => {
    const rounds = catcherRounds({}, TODAY, 5);
    expect(rounds.length).toBe(CATCHER_ROUNDS);
    for (const r of rounds) {
      expect(r.bubbles.length).toBeGreaterThanOrEqual(4);
      expect(r.bubbles.length).toBeLessThanOrEqual(6);
      expect(r.bubbles).toContain(r.answer);
      expect(new Set(r.bubbles.map((b) => b.toLowerCase())).size).toBe(r.bubbles.length);
      expect(getItem(r.itemId)?.es).toBe(r.answer);
    }
  });

  it('only uses sounds, syllables and words from the content, and never the same item twice', () => {
    const rounds = catcherRounds({}, TODAY, 9);
    for (const r of rounds) for (const b of r.bubbles) expect(allEs.has(b), `${b} is not in the content`).toBe(true);
    expect(new Set(rounds.map((r) => r.itemId)).size).toBe(rounds.length);
  });

  it('starts with sounds and syllables and ends with whole words', () => {
    const rounds = catcherRounds({}, TODAY, 2);
    expect(getItem(rounds[0].itemId)?.kind).toBe('sound');
    expect(getItem(rounds[rounds.length - 1].itemId)?.kind).toBe('word');
  });

  it('asks the weakest sounds first', () => {
    const memory: Record<string, ItemMemory> = {};
    for (const id of ['s.a', 's.e', 's.i', 's.o', 's.u', 's.m', 's.l', 's.s', 's.p', 's.t', 's.h', 's.j', 's.z', 's.ll', 's.y', 's.rr']) memory[id] = strong(id);
    delete memory['s.enye'];
    const rounds = catcherRounds(memory, TODAY, 3);
    // ñ and v are the only sounds never met, so they come before the strong ones
    const sounds = rounds.filter((r) => getItem(r.itemId)?.kind === 'sound').map((r) => r.itemId);
    expect(sounds.slice(0, 2).sort()).toEqual(['s.enye', 's.v']);
  });

  it('gets gently quicker and never faster than five seconds', () => {
    expect(catcherSpeed(0)).toBe(9);
    expect(catcherSpeed(2)).toBe(9);
    expect(catcherSpeed(3)).toBeCloseTo(8.2);
    expect(catcherSpeed(30)).toBe(5);
    expect(catcherSpeed(100)).toBe(5);
  });
});

describe('Syllable builder words', () => {
  it('deals eight different words from the content, each with one or two extra tiles', () => {
    const words = builderWords({}, TODAY, 4);
    expect(words.length).toBe(BUILDER_WORDS);
    expect(new Set(words.map((w) => w.word.toLowerCase())).size).toBe(words.length);
    for (const w of words) {
      expect(allWords.has(w.word.toLowerCase()), `${w.word} is not in the content`).toBe(true);
      expect(w.syllables.join('')).toBe(w.word);
      expect(w.tiles.length - w.syllables.length).toBeGreaterThanOrEqual(1);
      expect(w.tiles.length - w.syllables.length).toBeLessThanOrEqual(2);
      for (const s of w.syllables) expect(w.tiles).toContain(s);
      if (w.itemId) expect(getItem(w.itemId)).toBeDefined();
    }
  });

  it('puts the words she knows least first', () => {
    const memory: Record<string, ItemMemory> = {};
    for (const u of units) for (const i of u.items) memory[i.id] = strong(i.id);
    // lápiz is the one word she has never met
    delete memory['c.lapiz'];
    const words = builderWords(memory, TODAY, 1);
    const unknown = words.filter((w) => w.itemId && !memory[w.itemId]);
    expect(unknown.length).toBeGreaterThan(0);
    // unmet words (and Unit 0 reading words with no item) all come before any strong one
    const firstStrong = words.findIndex((w) => w.itemId && memory[w.itemId]);
    const lastWeak = words.map((w) => !w.itemId || !memory[w.itemId]).lastIndexOf(true);
    if (firstStrong !== -1) expect(lastWeak).toBeLessThan(firstStrong);
  });
});

describe("Coco's dialogue race", () => {
  it('builds its dialogues only from the units and the stories', () => {
    const lines = new Set([
      ...units.flatMap((u) => (u.dialogues ?? []).flatMap((d) => d.lines.map((l) => l.es))),
      ...stories.flatMap((s) => s.lines.map((l) => `${l.speaker}: ${l.es}`)),
    ]);
    const all = raceDialogues();
    expect(all.length).toBeGreaterThanOrEqual(8);
    for (const d of all) {
      expect(d.lines.length).toBeGreaterThanOrEqual(3);
      expect(d.lines.length).toBeLessThanOrEqual(6);
      for (const l of d.lines) expect(lines.has(l.es), `${l.es} is not in the content`).toBe(true);
      for (const id of d.items) expect(getItem(id), `${d.id} uses unknown ${id}`).toBeDefined();
    }
  });

  it('deals three different dialogues, scrambled but never already in order', () => {
    const races = raceDialoguesFor({}, TODAY, 8);
    expect(races.length).toBe(RACE_DIALOGUES);
    expect(new Set(races.map((r) => r.id)).size).toBe(races.length);
    for (const r of races) {
      expect([...r.shuffled].sort((a, b) => a - b)).toEqual([...r.lines.keys()]);
      expect(r.shuffled.some((x, i) => x !== i)).toBe(true);
    }
  });

  it('puts the dialogue whose words she knows least first', () => {
    const memory: Record<string, ItemMemory> = {};
    for (const u of units) for (const i of u.items) memory[i.id] = strong(i.id);
    const weakest = raceDialogues()[0];
    for (const id of weakest.items) delete memory[id];
    const races = raceDialoguesFor(memory, TODAY, 8);
    expect(races[0].id).toBe(weakest.id);
  });
});
