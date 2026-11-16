import { describe, expect, it } from 'vitest';
import { currentClass, units } from '../content';
import { completeTask, dayDone, ensureToday, nextTask, planDay } from './today';
import { emptyProgress, type Progress } from './types';

const DAY = '2026-11-16';
const classUnit = units.find((u) => u.id === currentClass.unitId)!;

describe("today's tasks", () => {
  it('gives three tasks: the next lesson, her class, then mistakes / review / a story', () => {
    const plan = planDay(emptyProgress(), DAY);
    expect(plan.tasks.map((t) => t.kind)).toEqual(['lesson', 'class', 'story']);
    expect(plan.tasks[0].title).toBe(`Lección: ${units[0].nodes[0].title}`);
    expect(plan.tasks[1].title).toBe(`Tu clase: ${classUnit.nodes[0].title}`);
  });

  it('puts Fix my mistakes third when she has mistakes to fix', () => {
    const memory: Progress['memory'] = {};
    for (const id of ['w.hola', 'w.adios', 'w.gracias']) memory[id] = { id, lastSeen: DAY, right: 0, wrong: 2, halfLife: 1 };
    expect(planDay({ ...emptyProgress(), memory }, DAY).tasks[2].kind).toBe('fix');
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
    const [t1, t2, t3] = p.today!.tasks;
    expect(nextTask(p.today)?.id).toBe('t1');
    p = completeTask(p, { node: (t1 as { nodeId: string }).nodeId }, DAY);
    expect(nextTask(p.today)?.id).toBe('t2');
    p = completeTask(p, { node: (t2 as { nodeId: string }).nodeId }, DAY);
    expect(dayDone(p.today)).toBe(false);
    p = completeTask(p, { story: (t3 as { storyId: string }).storyId }, DAY);
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
