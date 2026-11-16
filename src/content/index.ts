import type { Dialogue, GapText, Item, OddOneOut, OpenQuestion, PathNode, Sentence, Situation, Unit } from './types';
import { unit0 } from './unit-00-leer';
import { unit1 } from './unit-01-hola';
import { unit2 } from './unit-02-presento';
import { unit3 } from './unit-03-pronombres';
import { unit4 } from './unit-04-verbos';
import { unit5 } from './unit-05-paises';
import { unit6 } from './unit-06-conocer';
import { unit7 } from './unit-07-clase';
import { unit8 } from './unit-08-horario';
import { unit9 } from './unit-09-quien';

/** To add a unit when her class moves on: write one content file and add it here. */
export const units: Unit[] = [unit0, unit1, unit2, unit3, unit4, unit5, unit6, unit7, unit8, unit9];

/**
 * What her class is doing right now, for the "Esta semana en clase" card.
 * `unitId` is the unit on the path that covers it. When her class moves on,
 * add the new unit and point this at it.
 */
export const currentClass = {
  topic: '¿Quién eres? — identity',
  /** null while her class is ahead of what the app has. */
  unitId: 'u9' as string | null,
  /** What to practise until the new unit is in the app. */
  practiseUnitId: 'u8',
};

export const currentUnitId = currentClass.unitId ?? currentClass.practiseUnitId;

/** A school test, and the units that cover what her teacher listed for it. */
export type SchoolTest = { date: string; title: string; units: string[]; topics: string };

/**
 * Her next Spanish test. When it is set and the date has not passed, a
 * "Test prep" card appears in Práctica. Set it to null when there is none.
 */
export const nextTest: SchoolTest | null = null;

/** Tests she has already had — an example of the format, and a record. */
export const pastTests: SchoolTest[] = [
  {
    date: '2026-11-03',
    title: 'Reading test (Criterion B)',
    units: ['u1', 'u3', 'u4', 'u7', 'u8'],
    topics: 'school supplies, subjects, tener / ser / hablar / vivir, pronouns, basic phrases',
  },
];

const itemIndex = new Map<string, Item>();
const sentenceIndex = new Map<string, Sentence>();
const nodeIndex = new Map<string, { node: PathNode; unit: Unit }>();
const questionIndex = new Map<string, OpenQuestion>();
const situationIndex = new Map<string, Situation>();
const dialogueIndex = new Map<string, Dialogue>();
const oddIndex = new Map<string, OddOneOut>();
const gapTextIndex = new Map<string, GapText>();

for (const unit of units) {
  for (const item of unit.items) itemIndex.set(item.id, item);
  for (const sentence of unit.sentences) sentenceIndex.set(sentence.id, sentence);
  for (const node of unit.nodes) nodeIndex.set(node.id, { node, unit });
  for (const q of unit.questions ?? []) questionIndex.set(q.id, q);
  for (const s of unit.situations ?? []) situationIndex.set(s.id, s);
  for (const d of unit.dialogues ?? []) dialogueIndex.set(d.id, d);
  for (const o of unit.oddOneOut ?? []) oddIndex.set(o.id, o);
  for (const t of unit.gapTexts ?? []) gapTextIndex.set(t.id, t);
}

export const getItem = (id: string): Item | undefined => itemIndex.get(id);
export const getQuestion = (id: string) => questionIndex.get(id);
export const getSituation = (id: string) => situationIndex.get(id);
export const getDialogue = (id: string) => dialogueIndex.get(id);
export const getOddOneOut = (id: string) => oddIndex.get(id);
export const getGapText = (id: string) => gapTextIndex.get(id);
export const getSentence = (id: string): Sentence | undefined => sentenceIndex.get(id);
export const getNode = (id: string) => nodeIndex.get(id);
export const allItems = (): Item[] => [...itemIndex.values()];

/** Every path node in order, with its unit. */
export const pathNodes = (): { node: PathNode; unit: Unit }[] =>
  units.flatMap((unit) => unit.nodes.map((node) => ({ node, unit })));

/** The unit an item belongs to (for distractors in a mixed practice session). */
export const unitOf = (itemId: string): Unit | undefined =>
  units.find((u) => u.items.some((i) => i.id === itemId));

export type { Item, Sentence, PathNode, Unit };
