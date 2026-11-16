import { getItem, getNode, getSentence, unitOf, units } from '../content';
import type { Item, Sentence, Unit } from '../content/types';
import { dueItems, strength } from './memory';
import { makeRng, type Rng } from './rng';
import type { Exercise, ItemMemory } from './types';

export const LESSON_LENGTH = 12;
export const CHECK_LENGTH = 14;

const sentencesFor = (unit: Unit, ids: string[] | undefined): Sentence[] => {
  const picked = (ids ?? []).map(getSentence).filter((s): s is Sentence => Boolean(s));
  return picked.length ? picked : unit.sentences;
};

const words = (s: string) => s.split(/\s+/).filter(Boolean);
const family = (icon: string) => (icon.startsWith('num:') ? 'num' : icon);

/** See it: picture (or letter), Spanish, English, audio. */
const teach = (item: Item): Exercise => ({ kind: 'teach', key: `teach-${item.id}`, itemIds: [item.id], itemId: item.id });

/**
 * Tap the picture for the word. Only for items with a picture of their own:
 * a verb form, or a phrase whose icon is the generic "?", is asked by ear
 * instead, and the three wrong pictures must all look different.
 */
const pickImage = (item: Item, unit: Unit, rng: Rng): Exercise | null => {
  if (!item.icon || item.icon === 'question' || item.kind === 'verbform') return null;
  const usable = unit.items.filter(
    (i) => i.id !== item.id && i.icon && i.icon !== 'question' && i.icon !== item.icon && i.kind !== 'verbform',
  );
  const sameFamily = usable.filter((i) => family(i.icon!) === family(item.icon!));
  const sameKind = usable.filter((i) => i.kind === item.kind);
  const pool = sameFamily.length >= 3 ? sameFamily : sameKind.length >= 3 ? sameKind : usable;

  const chosen: Item[] = [];
  const seenIcons = new Set([item.icon]);
  for (const other of rng.shuffle(pool)) {
    if (seenIcons.has(other.icon!)) continue;
    seenIcons.add(other.icon!);
    chosen.push(other);
    if (chosen.length === 3) break;
  }
  if (chosen.length < 3) return null;
  return {
    kind: 'pick-image',
    key: `pic-${item.id}`,
    itemIds: [item.id],
    itemId: item.id,
    options: rng.shuffle([item.id, ...chosen.map((o) => o.id)]),
  };
};

const listenPick = (item: Item, unit: Unit, rng: Rng): Exercise | null => {
  const others = unit.items.filter((i) => i.id !== item.id && i.kind === item.kind);
  const picked = rng.shuffle(others).slice(0, 3);
  if (picked.length < 2) return null;
  return {
    kind: 'listen-pick',
    key: `listen-${item.id}`,
    itemIds: [item.id],
    itemId: item.id,
    options: rng.shuffle([item.id, ...picked.map((o) => o.id)]),
  };
};

/** Reading track: hear a sound, tap the word that has it. */
const soundWord = (item: Item, unit: Unit, rng: Rng): Exercise | null => {
  if (!item.examples?.length) return null;
  const answer = rng.pick(item.examples);
  // A distractor must NOT contain the sound she is listening for, or there would be two right answers.
  const marks = item.es.split(/[\s/]+/).filter(Boolean).map((m) => m.toLowerCase());
  const hasSound = (w: string) => marks.some((m) => w.toLowerCase().includes(m));
  const others = unit.items
    .filter((i) => i.id !== item.id && i.examples?.length)
    .flatMap((i) => i.examples ?? []);
  const distractors = rng
    .shuffle([...new Set(others)])
    .filter((w) => w !== answer && !hasSound(w))
    .slice(0, 3);
  if (distractors.length < 3) return null;
  return {
    kind: 'sound-word',
    key: `sound-${item.id}-${answer}`,
    itemIds: [item.id],
    itemId: item.id,
    answer,
    options: rng.shuffle([answer, ...distractors]),
  };
};

const buildWord = (unit: Unit, rng: Rng, used: Set<string>): Exercise | null => {
  const pool = (unit.readWords ?? []).filter((w) => !used.has(w.es));
  if (!pool.length) return null;
  const word = rng.pick(pool);
  used.add(word.es);
  const extras = rng
    .shuffle((unit.readWords ?? []).flatMap((w) => w.syllables).filter((s) => !word.syllables.includes(s)))
    .slice(0, 3);
  return {
    kind: 'build-word',
    key: `build-${word.es}`,
    itemIds: [],
    target: word.es,
    hint: word.en,
    tiles: rng.shuffle([...word.syllables, ...extras]),
  };
};

const tiles = (sentence: Sentence, direction: 'es-en' | 'en-es', unit: Unit, rng: Rng): Exercise => {
  const answer = direction === 'en-es' ? sentence.es : sentence.en;
  const prompt = direction === 'en-es' ? sentence.en : sentence.es;
  const extras = rng
    .shuffle(
      unit.sentences
        .filter((s) => s.id !== sentence.id && !s.gap)
        .flatMap((s) => words(direction === 'en-es' ? s.es : s.en)),
    )
    .filter((w) => !words(answer).includes(w))
    .slice(0, 3);
  return {
    kind: 'tiles',
    key: `tiles-${sentence.id}-${direction}`,
    itemIds: sentence.items,
    sentenceId: sentence.id,
    direction,
    answer,
    prompt,
    tiles: rng.shuffle([...words(answer), ...extras]),
  };
};

const gap = (sentence: Sentence): Exercise => ({
  kind: 'gap',
  key: `gap-${sentence.id}`,
  itemIds: sentence.items,
  sentenceId: sentence.id,
});

const match = (ids: string[], rng: Rng): Exercise | null => {
  const usable = rng.shuffle(ids.filter((id) => getItem(id)));
  if (usable.length < 4) return null;
  return { kind: 'match', key: `match-${usable[0]}`, itemIds: usable.slice(0, 5) };
};

/** Type what you hear (dictation) — level 3 and up. */
const typeHeard = (sentence: Sentence): Exercise => ({
  kind: 'type-heard',
  key: `heard-${sentence.id}`,
  itemIds: sentence.items,
  answer: sentence.es,
  en: sentence.en,
});

/** Type the translation, with the accent buttons — level 3 and up. */
const typeTranslate = (sentence: Sentence): Exercise => ({
  kind: 'type-translate',
  key: `typed-${sentence.id}`,
  itemIds: sentence.items,
  prompt: sentence.en,
  answer: sentence.es,
});

const answerQuestion = (id: string, items: string[]): Exercise => ({
  kind: 'answer-question',
  key: `ask-${id}`,
  itemIds: items,
  questionId: id,
});

const tuUsted = (id: string): Exercise => ({ kind: 'tu-usted', key: `tu-${id}`, itemIds: [], situationId: id });
const orderDialogue = (id: string, items: string[]): Exercise => ({ kind: 'order-dialogue', key: `dlg-${id}`, itemIds: items, dialogueId: id });
const oddOneOut = (id: string): Exercise => ({ kind: 'odd-one-out', key: `odd-${id}`, itemIds: [], groupId: id });
const completeText = (id: string, items: string[]): Exercise => ({ kind: 'complete-text', key: `text-${id}`, itemIds: items, textId: id });

export type BuildOptions = {
  nodeId: string;
  /** 1 to 4; higher levels use the harder exercise types. */
  level: number;
  memory: Record<string, ItemMemory>;
  today: string;
  seed?: number;
};

type NodeExtras = { questions?: string[]; situations?: string[]; dialogues?: string[]; oddOneOut?: string[]; gapTexts?: string[] };

/**
 * The extras a node (or Unit Check) brings with it, in her teacher's formats.
 * `caps` keeps a check from turning into five odd-one-outs in a row.
 */
const extras = (
  unit: Unit,
  node: NodeExtras,
  rng: Rng,
  caps: { gapTexts: number; dialogues: number; oddOneOut: number; situations: number; questions: number } = {
    gapTexts: 9, dialogues: 9, oddOneOut: 9, situations: 9, questions: 9,
  },
): Exercise[] => {
  const out: Exercise[] = [];
  for (const id of rng.shuffle(node.gapTexts ?? []).slice(0, caps.gapTexts)) {
    const text = unit.gapTexts?.find((t) => t.id === id);
    if (text) out.push(completeText(id, text.items));
  }
  for (const id of rng.shuffle(node.dialogues ?? []).slice(0, caps.dialogues)) {
    const d = unit.dialogues?.find((x) => x.id === id);
    if (d) out.push(orderDialogue(id, d.items));
  }
  for (const id of rng.shuffle(node.oddOneOut ?? []).slice(0, caps.oddOneOut)) out.push(oddOneOut(id));
  for (const id of rng.shuffle(node.situations ?? []).slice(0, caps.situations)) out.push(tuUsted(id));
  for (const id of rng.shuffle(node.questions ?? []).slice(0, caps.questions)) {
    const q = unit.questions?.find((x) => x.id === id);
    if (q) out.push(answerQuestion(id, q.items));
  }
  return out;
};

/**
 * Builds one lesson: about 60% new items, 40% review of items that are due,
 * ordered see it → recognise it → produce it (PLAN section 5).
 * Level 1 is easiest; level 3 adds dictation and typing; level 4 adds
 * answering a question in her own words.
 */
export const buildLesson = ({ nodeId, level, memory, today, seed }: BuildOptions): Exercise[] => {
  const found = getNode(nodeId);
  if (!found) return [];
  const { node, unit } = found;
  const rng = makeRng(seed);
  const isSounds = node.kind === 'sounds';
  if (node.kind === 'check') return buildCheck(unit, node, memory, today, rng);
  // A story stop opens the story player, not a lesson.
  if (node.kind === 'story') return [];

  const newItems = node.teaches.map(getItem).filter((i): i is Item => Boolean(i));
  const knownIds = new Set(Object.keys(memory));
  const review = dueItems(memory, today, (id) => !node.teaches.includes(id))
    .map(getItem)
    .filter((i): i is Item => Boolean(i))
    .slice(0, 4);

  const teachCards: Exercise[] = [];
  const recognise: Exercise[] = [];
  const produce: Exercise[] = [];
  const reviewPart: Exercise[] = [];
  const seen = new Set<string>();
  const into = (list: Exercise[]) => (e: Exercise | null) => {
    if (e && !seen.has(e.key)) {
      seen.add(e.key);
      list.push(e);
    }
  };
  const addTeach = into(teachCards);
  const addRecognise = into(recognise);
  const addProduce = into(produce);
  const addReview = into(reviewPart);

  // 1. See it — only on level 1, and only for items she has never met.
  if (level === 1) {
    for (const item of newItems) {
      if (!knownIds.has(item.id)) addTeach(teach(item));
    }
  }

  // 2. Recognise it.
  for (const item of newItems) {
    if (isSounds) addRecognise(soundWord(item, unit, rng));
    else addRecognise(pickImage(item, unit, rng) ?? listenPick(item, unit, rng));
  }
  if (level >= 2) {
    for (const item of rng.shuffle(newItems).slice(0, 2)) addRecognise(listenPick(item, unit, rng));
  }

  // 3. Produce it.
  const used = new Set<string>();
  if (isSounds) {
    for (let i = 0; i < (level >= 2 ? 3 : 2); i += 1) addProduce(buildWord(unit, rng, used));
  }
  const nodeSentences = sentencesFor(unit, node.sentences);
  const gaps = nodeSentences.filter((s) => s.gap);
  const plain = nodeSentences.filter((s) => !s.gap);

  // Level 4: say one sentence out loud.
  if (level >= 4 && !isSounds) {
    const sentence = rng.shuffle(plain)[0];
    if (sentence) addProduce({ kind: 'speak', key: `speak-${sentence.id}`, itemIds: sentence.items, sentenceId: sentence.id });
  }
  for (const sentence of gaps) addProduce(gap(sentence));
  for (const sentence of plain.slice(0, 3)) {
    addProduce(tiles(sentence, level >= 2 ? 'en-es' : 'es-en', unit, rng));
  }
  if (level >= 3) {
    for (const sentence of rng.shuffle(plain).slice(0, 2)) addProduce(typeHeard(sentence));
    for (const sentence of rng.shuffle(plain).slice(0, 1)) addProduce(typeTranslate(sentence));
  }

  // Her teacher's own formats that belong to this node.
  const nodeExtras = extras(unit, node, rng);
  for (const e of nodeExtras) {
    // Answering a question in her own words is saved for level 4.
    if (e.kind === 'answer-question' && level < 4) continue;
    addProduce(e);
  }

  // 4. Review of older items that are due.
  const matchable = review.filter((i) => i.kind !== 'sound' && i.kind !== 'syllable');
  if (matchable.length >= 4) addReview(match(matchable.map((i) => i.id), rng));
  for (const item of review) {
    const itemUnit = unitOf(item.id) ?? unit;
    addReview(pickImage(item, itemUnit, rng) ?? listenPick(item, itemUnit, rng));
  }

  const reviewSlots = Math.min(reviewPart.length, Math.round(LESSON_LENGTH * 0.4));
  const chosenReview = reviewPart.slice(0, reviewSlots);
  const newSlots = LESSON_LENGTH - chosenReview.length;
  const newPart = [...teachCards, ...recognise, ...produce].slice(0, newSlots);

  // Mix: see it first, then recognise, review in the middle, produce at the end.
  const out: Exercise[] = [
    ...newPart.filter((e) => e.kind === 'teach'),
    ...newPart.filter((e) => e.kind !== 'teach' && recognise.includes(e)),
    ...chosenReview,
    ...newPart.filter((e) => produce.includes(e)),
  ];

  // 5. Top up, so a lesson is always a full 12 even when a node is small:
  // first more of this node's own sentences, then the rest of the unit.
  const topUp = into(out);
  const fill = (list: (() => Exercise | null)[]) => {
    for (const make of list) {
      if (out.length >= LESSON_LENGTH) return;
      topUp(make());
    }
  };

  if (isSounds) {
    fill(rng.shuffle(newItems).map((item) => () => soundWord(item, unit, rng)));
    fill(Array.from({ length: 6 }, () => () => buildWord(unit, rng, used)));
  }
  fill(plain.map((s) => () => tiles(s, 'en-es', unit, rng)));
  fill(plain.map((s) => () => tiles(s, 'es-en', unit, rng)));
  fill(plain.map((s) => () => typeHeard(s)));
  fill(gaps.map((s) => () => gap(s)));
  fill(rng.shuffle(newItems).map((item) => () => listenPick(item, unit, rng)));
  fill(plain.map((s) => () => typeTranslate(s)));
  // Still short? Borrow from the rest of the unit.
  fill(rng.shuffle(unit.sentences).map((s) => () => (s.gap ? gap(s) : tiles(s, 'en-es', unit, rng))));
  fill(rng.shuffle(unit.items).map((item) => () => pickImage(item, unit, rng) ?? listenPick(item, unit, rng)));
  fill(rng.shuffle(unit.sentences.filter((s) => !s.gap)).map((s) => () => typeHeard(s)));

  return out.slice(0, LESSON_LENGTH);
};

/**
 * A Unit Check: no new words, nothing easy. Her teacher's own formats first
 * (complete the text, put the dialogue in order, odd one out, tú or usted,
 * answer the question), then the hardest exercises over the whole unit.
 */
const buildCheck = (
  unit: Unit,
  node: NodeExtras,
  memory: Record<string, ItemMemory>,
  today: string,
  rng: Rng,
): Exercise[] => {
  const seen = new Set<string>();
  const collect = (list: Exercise[]) => (e: Exercise | null) => {
    if (e && !seen.has(e.key)) {
      seen.add(e.key);
      list.push(e);
    }
  };

  // Her teacher's own formats, but no more than a few of each in one test.
  const teacherFormats: Exercise[] = [];
  const addFormat = collect(teacherFormats);
  for (const e of extras(unit, node, rng, { gapTexts: 2, dialogues: 1, oddOneOut: 3, situations: 4, questions: 3 })) {
    addFormat(e);
  }

  // The weakest words of the unit come first among what is left.
  const unitItems = [...unit.items].sort(
    (a, b) => (memory[a.id] ? strength(memory[a.id], today) : 0) - (memory[b.id] ? strength(memory[b.id], today) : 0),
  );
  const gaps = rng.shuffle(unit.sentences.filter((s) => s.gap));
  const plain = rng.shuffle(unit.sentences.filter((s) => !s.gap));

  const rest: Exercise[] = [];
  const addRest = collect(rest);
  for (const sentence of gaps.slice(0, 3)) addRest(gap(sentence));
  for (const sentence of plain.slice(0, 2)) addRest(typeHeard(sentence));
  for (const sentence of plain.slice(2, 4)) addRest(typeTranslate(sentence));
  addRest(match(unitItems.filter((i) => i.kind !== 'sound' && i.kind !== 'syllable').slice(0, 5).map((i) => i.id), rng));
  for (const item of unitItems) addRest(listenPick(item, unit, rng) ?? pickImage(item, unit, rng));
  for (const sentence of plain) addRest(tiles(sentence, 'en-es', unit, rng));

  // Take the rest one type at a time (gap, dictation, typing, listening, tiles…),
  // then interleave with the teacher's formats, so the test keeps changing.
  const mixed = roundRobin(rest);
  const out: Exercise[] = [];
  for (let i = 0; out.length < CHECK_LENGTH && (i < teacherFormats.length || i < mixed.length); i += 1) {
    if (teacherFormats[i]) out.push(teacherFormats[i]);
    if (out.length < CHECK_LENGTH && mixed[i]) out.push(mixed[i]);
  }
  return spreadOut(out.slice(0, CHECK_LENGTH));
};

/** One of each type in turn: [gap, gap, tiles, listen] → [gap, tiles, listen, gap]. */
const roundRobin = (list: Exercise[]): Exercise[] => {
  const groups = new Map<string, Exercise[]>();
  for (const e of list) groups.set(e.kind, [...(groups.get(e.kind) ?? []), e]);
  const out: Exercise[] = [];
  while (out.length < list.length) {
    for (const g of groups.values()) {
      const next = g.shift();
      if (next) out.push(next);
    }
  }
  return out;
};

/** Reorders a list so no exercise type comes three times in a row (when another type is left to swap in). */
export const spreadOut = (list: Exercise[]): Exercise[] => {
  const out = [...list];
  for (let i = 2; i < out.length; i += 1) {
    if (out[i].kind !== out[i - 1].kind || out[i].kind !== out[i - 2].kind) continue;
    const swap = out.findIndex((e, j) => j > i && e.kind !== out[i].kind);
    if (swap === -1) break;
    [out[i], out[swap]] = [out[swap], out[i]];
  }
  return out;
};

/** "Fix my mistakes" and "Words to review": a session built from her weakest items. */
export const buildPractice = ({
  itemIds,
  memory,
  today,
  seed,
  length = LESSON_LENGTH,
}: {
  itemIds: string[];
  memory: Record<string, ItemMemory>;
  today: string;
  seed?: number;
  length?: number;
}): Exercise[] => {
  const rng = makeRng(seed);
  const out: Exercise[] = [];
  const seen = new Set<string>();
  const add = (e: Exercise | null) => {
    if (e && !seen.has(e.key) && out.length < length) {
      seen.add(e.key);
      out.push(e);
    }
  };

  const items = itemIds.map(getItem).filter((i): i is Item => Boolean(i));
  const matchable = items.filter((i) => i.kind !== 'sound' && i.kind !== 'syllable');
  if (matchable.length >= 4) add(match(matchable.slice(0, 5).map((i) => i.id), rng));

  for (const item of items) {
    const unit = unitOf(item.id);
    if (!unit) continue;
    if (item.kind === 'sound' || item.kind === 'syllable') add(soundWord(item, unit, rng));
    else add(pickImage(item, unit, rng) ?? listenPick(item, unit, rng));
  }

  // Then sentences that practise those items.
  const wanted = new Set(itemIds);
  const sentences = rng.shuffle(units.flatMap((u) => u.sentences.map((s) => ({ s, u }))).filter(({ s }) => s.items.some((i) => wanted.has(i))));
  for (const { s, u } of sentences) {
    if (out.length >= length) break;
    if (s.gap) add(gap(s));
    else add(tiles(s, 'en-es', u, rng));
  }
  void memory;
  void today;
  return out;
};

/** The conjugation drill: every verb form she has met, weakest first. */
export const verbItemIds = (memory: Record<string, ItemMemory>, today: string): string[] => {
  const forms = units.flatMap((u) => u.items).filter((i) => i.kind === 'verbform');
  return forms
    .map((i) => ({ id: i.id, s: memory[i.id] ? strength(memory[i.id], today) : -1 }))
    .sort((a, b) => a.s - b.s)
    .map((x) => x.id);
};

/**
 * "Test prep": a mixed lesson over the units her teacher listed for a test,
 * weakest words first, with gap sentences in her teacher's format.
 */
export const buildTestPrep = ({
  unitIds,
  memory,
  today,
  seed,
}: {
  unitIds: string[];
  memory: Record<string, ItemMemory>;
  today: string;
  seed?: number;
}): Exercise[] => {
  const rng = makeRng(seed);
  const chosen = units.filter((u) => unitIds.includes(u.id));
  const items = chosen
    .flatMap((u) => u.items)
    .filter((i) => i.kind !== 'sound' && i.kind !== 'syllable')
    .map((i) => ({ id: i.id, s: memory[i.id] ? strength(memory[i.id], today) : 0, r: rng.next() }))
    .sort((a, b) => a.s - b.s || a.r - b.r)
    .slice(0, 10)
    .map((x) => x.id);
  const practice = buildPractice({ itemIds: items, memory, today, seed, length: 10 });
  const gaps = rng.shuffle(chosen.flatMap((u) => u.sentences.filter((s) => s.gap).map((s) => gap(s)))).slice(0, 5);
  return spreadOut(rng.shuffle([...practice, ...gaps]).slice(0, 15));
};
