import { currentClass, units } from '../content';
import { COCO_MISTAKES, type CocoMistake } from '../content/cocoMistakes';
import { doneOnce, isOpen } from './path';
import { makeRng } from './rng';
import type { Progress } from './types';

export const TEACH_LENGTH = 5;

/** Units she has reached on the map (or that her class is on). */
export const reachedUnits = (p: Progress): number[] => {
  const classUnit = units.find((u) => u.id === currentClass.unitId)?.number;
  return units
    .filter((u) => u.number === classUnit || u.nodes.some((n) => doneOnce(p, n) || (isOpen(p, n.id) && u.number > 0)))
    .map((u) => u.number);
};

/**
 * Five of Coco's mistakes: from units she has reached first (all of them were
 * taught in her class anyway), then from the earliest units to fill up.
 */
export const pickMistakes = (p: Progress, seed?: number): CocoMistake[] => {
  const rng = makeRng(seed);
  const reached = new Set(reachedUnits(p));
  const near = rng.shuffle(COCO_MISTAKES.filter((m) => reached.has(m.unit)));
  const rest = COCO_MISTAKES.filter((m) => !reached.has(m.unit)).sort((a, b) => a.unit - b.unit);
  return [...near, ...rest].slice(0, TEACH_LENGTH);
};

/** Three reasons to choose from: the right one and two from other mistakes. */
export const reasonChoices = (m: CocoMistake, seed?: number): string[] => {
  const rng = makeRng(seed);
  const others = rng.shuffle(COCO_MISTAKES.filter((x) => x.why !== m.why)).slice(0, 2).map((x) => x.why);
  return rng.shuffle([m.why, ...others]);
};

/** The sentence once it is corrected. */
export const fixedSentence = (m: CocoMistake): string =>
  m.parts.map((part, i) => (i === m.wrong ? m.right : part)).join(' ');
