import { currentClass, getNode, nextTest, units } from '../content';
import { stories } from '../content/stories';
import { daysBetween, dayKey } from './dates';
import { doneOnce, frontier, isOpen } from './path';
import { practiceItems } from './practice';
import type { Progress } from './types';

/**
 * Today's three tasks (~15 minutes), the same idea as her Exam Prep app:
 *  1. the next lesson on the map,
 *  2. a lesson from the unit her class is on now (Test prep in the week before a test),
 *  3. Fix my mistakes, or Words to review — or a story when there is nothing to fix.
 * They are chosen once in the morning and stay the same all day, and they open in order.
 */
export type DayTask =
  | { id: string; kind: 'lesson' | 'class'; nodeId: string; title: string; done: boolean }
  | { id: string; kind: 'testprep'; title: string; done: boolean }
  | { id: string; kind: 'fix' | 'review'; title: string; done: boolean }
  | { id: string; kind: 'story'; storyId: string; title: string; done: boolean };

export type DayPlan = { day: string; tasks: DayTask[] };

export type TaskEvent = { node: string } | { practice: 'fix' | 'review' | 'testprep' } | { story: string };

const ORDER = units.flatMap((u) => u.nodes.map((node) => ({ node, unitId: u.id })));
const level = (p: Progress, id: string) => p.nodes[id]?.level ?? 0;

/** A stop to practise again when everything is done once: the open one with the fewest rounds. */
const leastPractised = (p: Progress, ids: string[], not?: string) =>
  ids
    .filter((id) => id !== not && isOpen(p, id) && level(p, id) < 4)
    .sort((a, b) => level(p, a) - level(p, b))[0];

export const planDay = (p: Progress, today = dayKey()): DayPlan => {
  const tasks: DayTask[] = [];

  // 1. The next lesson on the map.
  const pathId = frontier(p) ?? leastPractised(p, ORDER.map((x) => x.node.id));
  if (pathId) {
    tasks.push({ id: 't1', kind: 'lesson', nodeId: pathId, title: `Lección: ${getNode(pathId)?.node.title ?? ''}`, done: false });
  }

  // 2. Her class: Test prep in the week before a test, otherwise the next lesson of her class unit.
  const test = nextTest && nextTest.date >= today && daysBetween(today, nextTest.date) <= 7 ? nextTest : null;
  if (test) {
    tasks.push({ id: 't2', kind: 'testprep', title: `Test prep: ${test.title}`, done: false });
  } else {
    const classUnit = units.find((u) => u.id === (currentClass.unitId ?? currentClass.practiseUnitId));
    const ids = (classUnit?.nodes ?? []).filter((n) => !n.write).map((n) => n.id);
    const fresh = ids.find((id) => id !== pathId && isOpen(p, id) && !doneOnce(p, getNode(id)!.node));
    const classId = fresh ?? leastPractised(p, ids, pathId);
    if (classId) {
      tasks.push({ id: 't2', kind: 'class', nodeId: classId, title: `Tu clase: ${getNode(classId)?.node.title ?? ''}`, done: false });
    }
  }

  // 3. Mistakes first, then fading words, else a story.
  if (practiceItems(p, 'fix', today).length >= 3) {
    tasks.push({ id: 't3', kind: 'fix', title: 'Fix my mistakes', done: false });
  } else if (practiceItems(p, 'review', today).length >= 3) {
    tasks.push({ id: 't3', kind: 'review', title: 'Words to review', done: false });
  } else {
    const story = stories.find((s) => !(p.stories[s.id] > 0)) ?? [...stories].sort((a, b) => (p.stories[a.id] ?? 0) - (p.stories[b.id] ?? 0))[0];
    tasks.push({ id: 't3', kind: 'story', storyId: story.id, title: `Historia: ${story.title}`, done: false });
  }

  return { day: today, tasks };
};

/** Make sure there is a plan for today (a new one each morning). */
export const ensureToday = (p: Progress, today = dayKey()): Progress =>
  p.today?.day === today ? p : { ...p, today: planDay(p, today) };

const matches = (task: DayTask, e: TaskEvent): boolean => {
  if ('node' in e) {
    if (task.kind !== 'lesson' && task.kind !== 'class') return false;
    return task.nodeId === e.node;
  }
  if ('practice' in e) return task.kind === e.practice;
  // a story: its own task, or a lesson task whose stop on the map is this story
  if (task.kind === 'story') return task.storyId === e.story;
  if (task.kind === 'lesson' || task.kind === 'class') return getNode(task.nodeId)?.node.story === e.story;
  return false;
};

/** She finished something: tick off the task it belongs to. */
export const completeTask = (p: Progress, e: TaskEvent, today = dayKey()): Progress => {
  const plan = p.today;
  if (!plan || plan.day !== today) return p;
  let ticked = false;
  const tasks = plan.tasks.map((t) => {
    if (ticked || t.done || !matches(t, e)) return t;
    ticked = true;
    return { ...t, done: true };
  });
  return ticked ? { ...p, today: { ...plan, tasks } } : p;
};

export const nextTask = (plan?: DayPlan): DayTask | undefined => plan?.tasks.find((t) => !t.done);
export const dayDone = (plan?: DayPlan): boolean => !!plan && plan.tasks.length > 0 && plan.tasks.every((t) => t.done);
