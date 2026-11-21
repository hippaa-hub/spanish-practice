import { units } from './index';
import { stories } from './stories';
import type { Item } from './types';

/**
 * What the three games in Práctica play with. Nothing here is new
 * vocabulary: every word, syllable and line is taken from the unit files and
 * the stories. This file only says how they are cut up.
 */

/**
 * Syllables the rule-based splitter (src/engine/syllables.ts) gets wrong,
 * spelt out by hand. Compounds like dieciocho keep their two halves apart.
 */
export const SYLLABLE_OVERRIDES: Record<string, string[]> = {
  dieciocho: ['die', 'ci', 'o', 'cho'],
};

const ARTICLE = /^(el|la|los|las|un|una)\s+/i;

/** A word as it is spelt in a unit, without its article (el lápiz → lápiz). */
export const bareWord = (es: string): string => es.replace(ARTICLE, '').trim();

/**
 * Items whose Spanish is one plain word once the article is dropped: the
 * pool for the Syllable builder and for the whole-word rounds of Sound Catcher.
 * Numbers, pronouns, verbs forms, phrases with several words are left out.
 */
export const gameWords = (): { item: Item; word: string }[] =>
  units
    .filter((u) => u.number > 0)
    .flatMap((u) => u.items)
    .filter((i) => i.kind === 'word')
    .map((item) => ({ item, word: bareWord(item.es) }))
    .filter(({ word }) => /^[a-záéíóúñü]+$/i.test(word));

/** A short dialogue to put in order: from a unit's "order the dialogue" data or a slice of a story. */
export type RaceDialogue = {
  id: string;
  title: string;
  lines: { es: string; en: string }[];
  /** Item ids the lines practise, for the memory engine. */
  items: string[];
};

const strip = (s: string) => s.toLowerCase().replace(/[¿?¡!.,—"]/g, ' ');

/** Items (words and phrases) that appear in these lines, so a story slice can count as practice too. */
const itemsIn = (lines: { es: string }[]): string[] => {
  const text = ` ${lines.map((l) => strip(l.es)).join(' ')} `;
  return units
    .flatMap((u) => u.items)
    .filter((i) => (i.kind === 'word' || i.kind === 'phrase') && text.includes(` ${strip(bareWord(i.es)).trim()} `))
    .map((i) => i.id);
};

/**
 * Every dialogue the race can use: the units' own dialogues whole, and each
 * dialogue story cut into runs of 4 to 6 consecutive lines.
 */
export const raceDialogues = (): RaceDialogue[] => {
  const out: RaceDialogue[] = [];
  for (const unit of units) {
    for (const d of unit.dialogues ?? []) out.push({ id: d.id, title: d.title, lines: d.lines, items: d.items });
  }
  for (const story of stories) {
    if (story.type !== 'dialogue') continue;
    const size = story.lines.length > 8 ? Math.ceil(story.lines.length / 2) : story.lines.length;
    for (let start = 0, n = 1; start < story.lines.length; start += size, n += 1) {
      const slice = story.lines.slice(start, start + size);
      if (slice.length < 3) break;
      const lines = slice.map((l) => ({ es: `${l.speaker}: ${l.es}`, en: l.en }));
      out.push({ id: `${story.id}.${n}`, title: story.title, lines, items: itemsIn(slice) });
    }
  }
  return out;
};
