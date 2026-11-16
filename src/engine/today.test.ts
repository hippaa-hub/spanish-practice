import { describe, expect, it } from 'vitest';
import { currentClass, units } from '../content';
import { completeTask, dayDone, ensureToday, nextTask, planDay } from './today';
import { emptyProgress, type Progress } from './types';

const DAY = '2026-11-16';
const classUnit = units.find((u) => u.id === currentClass.unitId)!;

describe("today's tasks", () => {
  it('gives three tasks: the next lesson, her class, then her own choice', () => {
    const plan = planDay(emptyProgress(), DAY);
    expect(plan.tasks.map((t) => t.kind)).toEqual(['lesson', 'class', 'choice']);
    expect(plan.tasks[0].title).toBe(`Lección: ${units[0].nodes[0].title}`);
    expect(plan.tasks[1].title).toBe(`Tu clase: ${classUnit.nodes[0].title}`);
  });

  it('lets her pick task 3: teaching Coco, a story, speaking or writing all count', () => {
    for (const choice of ['teach', 'story', 'speak', 'write'] as const) {
      const p = completeTask(ensureToday(emptyProgress(), DAY), { choice }, DAY);
      const t3 = p.today!.tasks[2];
      expect(t3.done, choice).toBe(true);
      expect(t3.kind === 'choice' && t3.picked).toBe(choice);
    }
  });

  it('lets her do the tasks in any order', () => {
    let p = ensureToday(emptyProgress(), DAY);
    p = completeTask(p, { choice: 'teach' }, DAY);
    expect(p.today!.tasks.map((t) => t.done)).toEqual([false, false, true]);
    expect(nextTask(p.today)?.id).toBe('t1');
  });

  it('keeps the same tasks all day, and makes new ones the next morning', () => {
    const p = ensureToday(emptyProgress(), DAY);
    const again = ensureToday({ ...p, nodes: { [units[0].nodes[0].id]: { level: 1 } } }, DAY);
    expect(again.today).toEqual(p.today);
    const tomorrow = ensureToday(again, '2026-11-17');
    expect(tomorrow.today?.day).toBe('2026-11-17');
    expect(tomorrow.today?.tasks[0].title).toBe(`Lección: ${units[0].nodes[1].title}`);
  });

  it('ticks a task off when she finishes it, and says when the day is done', () => {
    let p = ensureToday(emptyProgress(), DAY);
    const [t1, t2] = p.today!.tasks;
    expect(nextTask(p.today)?.id).toBe('t1');
    p = completeTask(p, { node: (t1 as { nodeId: string }).nodeId }, DAY);
    expect(nextTask(p.today)?.id).toBe('t2');
    p = completeTask(p, { node: (t2 as { nodeId: string }).nodeId }, DAY);
    expect(dayDone(p.today)).toBe(false);
    p = completeTask(p, { choice: 'story' }, DAY);
    expect(dayDone(p.today)).toBe(true);
  });

  it('ignores work that is not on the list, and yesterday’s list', () => {
    const p = ensureToday(emptyProgress(), DAY);
    expect(completeTask(p, { node: 'u5.n1' }, DAY)).toBe(p);
    expect(completeTask(p, { node: (p.today!.tasks[0] as { nodeId: string }).nodeId }, '2026-11-17')).toBe(p);
  });

  it('never gives the same lesson twice in one day', () => {
    const nodes: Progress['nodes'] = {};
    // she has walked the whole path up to her class unit
    for (const u of units) {
      if (u.id === classUnit.id) break;
      for (const n of u.nodes) nodes[n.id] = { level: 1 };
    }
    const plan = planDay({ ...emptyProgress(), nodes, stories: Object.fromEntries(units.flatMap((u) => u.nodes).filter((n) => n.story).map((n) => [n.story!, 1])) }, DAY);
    const ids = plan.tasks.map((t) => ('nodeId' in t ? t.nodeId : t.id));
    expect(new Set(ids).size).toBe(ids.length);
  });
});
