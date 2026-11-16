import { currentClass, units } from '../content';
import type { PathNode } from '../content/types';
import type { Progress } from './types';

/**
 * The path is walked in order: a lesson opens once the one before it has been
 * finished once (1/4). Two exceptions:
 *  - the unit her class is on this week is always open, so she can practise
 *    for class and tests straight away (its lessons still go in order);
 *  - anything she has already started stays open.
 */

const ORDER = units.flatMap((u) => u.nodes.map((node) => ({ node, unitId: u.id })));

/** Finished at least once: one round of a lesson, a story read, a Unit Check done. */
export const doneOnce = (p: Progress, node: PathNode): boolean =>
  (p.nodes[node.id]?.level ?? 0) >= 1 || (node.kind === 'story' && !!node.story && (p.stories[node.story] ?? 0) > 0);

const classUnitId = () => currentClass.unitId;

export const isOpen = (p: Progress, nodeId: string): boolean => {
  const i = ORDER.findIndex((x) => x.node.id === nodeId);
  if (i < 0) return false;
  const { node, unitId } = ORDER[i];
  if (i === 0 || doneOnce(p, node)) return true;
  const prev = ORDER[i - 1];
  // The first lesson of her class's current unit is always open.
  if (unitId === classUnitId() && prev.unitId !== unitId) return true;
  return doneOnce(p, prev.node);
};

/** The lesson to finish before this one opens. */
export const blockedBy = (p: Progress, nodeId: string): PathNode | null => {
  if (isOpen(p, nodeId)) return null;
  const i = ORDER.findIndex((x) => x.node.id === nodeId);
  // walk back to the nearest open lesson that is not done yet
  for (let j = i - 1; j >= 0; j -= 1) {
    if (isOpen(p, ORDER[j].node.id) && !doneOnce(p, ORDER[j].node)) return ORDER[j].node;
  }
  return null;
};

/** Where Coco waits: the first open lesson she has not finished yet, in path order. */
export const frontier = (p: Progress): string | null => {
  for (const { node } of ORDER) {
    if (isOpen(p, node.id) && !doneOnce(p, node)) return node.id;
  }
  return null;
};
