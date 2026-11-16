import { describe, expect, it } from 'vitest';
import { currentClass, units } from '../content';
import { blockedBy, frontier, isOpen } from './path';
import { emptyProgress, type Progress } from './types';

const first = units[0].nodes[0];
const second = units[0].nodes[1];
const third = units[0].nodes[2];

describe('the locked path', () => {
  it('opens only the first lesson at the start', () => {
    const p = emptyProgress();
    expect(isOpen(p, first.id)).toBe(true);
    expect(isOpen(p, second.id)).toBe(false);
    expect(isOpen(p, units[1].nodes[0].id)).toBe(false);
  });

  it('opens the next lesson after one round of the one before', () => {
    const p: Progress = { ...emptyProgress(), nodes: { [first.id]: { level: 1 } } };
    expect(isOpen(p, second.id)).toBe(true);
    expect(isOpen(p, third.id)).toBe(false);
  });

  it('keeps the unit her class is on now open, still in order inside it', () => {
    const cls = units.find((u) => u.id === currentClass.unitId)!;
    const p = emptyProgress();
    expect(isOpen(p, cls.nodes[0].id)).toBe(true);
    expect(isOpen(p, cls.nodes[1].id)).toBe(false);
    const after = { ...p, nodes: { [cls.nodes[0].id]: { level: 1 } } };
    expect(isOpen(after, cls.nodes[1].id)).toBe(true);
  });

  it('keeps anything she already started open', () => {
    const later = units[4].nodes[2];
    expect(isOpen({ ...emptyProgress(), nodes: { [later.id]: { level: 2 } } }, later.id)).toBe(true);
  });

  it('counts a story as finished once it has been read', () => {
    const u5 = units.find((u) => u.id === 'u5')!;
    const i = u5.nodes.findIndex((n) => n.kind === 'story');
    const story = u5.nodes[i];
    const nodes: Progress['nodes'] = {};
    for (const n of u5.nodes.slice(0, i)) nodes[n.id] = { level: 1 };
    const before = units.flatMap((u) => u.nodes);
    for (const n of before.slice(0, before.indexOf(u5.nodes[0]))) nodes[n.id] = { level: 1 };
    const p: Progress = { ...emptyProgress(), nodes };
    expect(isOpen(p, u5.nodes[i + 1].id)).toBe(false);
    expect(isOpen({ ...p, stories: { [story.story!]: 1 } }, u5.nodes[i + 1].id)).toBe(true);
  });

  it('says which lesson to finish first, and where Coco waits', () => {
    const p = emptyProgress();
    expect(blockedBy(p, third.id)?.id).toBe(first.id);
    expect(blockedBy(p, first.id)).toBeNull();
    expect(frontier(p)).toBe(first.id);
    expect(frontier({ ...p, nodes: { [first.id]: { level: 1 } } })).toBe(second.id);
  });
});
