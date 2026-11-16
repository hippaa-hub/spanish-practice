import { currentClass, getNode, nextTest, units } from '../content';
import { stories } from '../content/stories';
import { daysBetween, dayKey } from './dates';
import { doneOnce, frontier, isOpen } from './path';
import type { Progress } from './types';

/**
 * Today's three tasks (~15 minutes):
 *  1. the next lesson on the map,
 *  2. a lesson from the unit her class is on now (Test prep in the week before a test),
 *  3. HER CHOICE: teach Coco, read a story, speak, or write.
 * They are chosen once in the morning and stay the same all day. She can do them
 * in any order — Coco only suggests one. (Choice matters for motivation at 12:
 * see the research summary behind this feature.)
 */
export type ChoiceKind = 'teach' | 'story' | 'speak' | 'write';
export const CHOICES: ChoiceKind[] = ['teach', 'story', 'speak', 'write'];
export type DayTask =
  | { id: string; kind: 'lesson' | 'class'; nodeId: string; title: string; done: boolean }
  | { id: string; kind: 'testprep'; title: string; done: boolean }
  | { id: string; kind: 'fix' | 'review'; title: string; done: boolean }
  | { id: string; kind: 'story'; storyId: string; title: string; done: boolean }
  | { id: string; kind: 'choice'; storyId: string; title: string; done: boolean; picked?: ChoiceKind };

export type DayPlan = { day: string; tasks: DayTask[] };

export type TaskEvent =
  | { node: string }
  | { practice: 'fix' | 'review' | 'testprep' }
  | { story: string }
  | { choice: ChoiceKind };

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

  // 3. Her choice. The story on offer is one she has not read yet.
  const story = stories.find((s) => !(p.stories[s.id] > 0)) ?? [...stories].sort((a, b) => (p.stories[a.id] ?? 0) - (p.stories[b.id] ?? 0))[0];
  tasks.push({ id: 't3', kind: 'choice', storyId: story.id, title: 'Tú eliges — you choose', done: false });

  return { day: today, tasks };
};

/** Make sure there is a plan for today (a new one each morning). */
export const ensureToday = (p: Progress, today = dayKey()): Progress =>
  p.today?.day === today ? p : { ...p, today: planDay(p, today) };

const matches = (task: DayTask, e: TaskEvent): boolean => {
  if ('choice' in e) return task.kind === 'choice';
  if ('node' in e) {
    if (task.kind !== 'lesson' && task.kind !== 'class') return false;
    return task.nodeId === e.node;
  }
  if ('practice' in e) return task.kind === e.practice;
  // a story: its own task, or a lesson task whose stop on the map is this story
  if (task.kind === 'story') return task.storyId === e.story;
  if (task.kind === 'choice') return false; // a story counts for the choice through its own { choice: 'story' } event
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
    return 'choice' in e && t.kind === 'choice' ? { ...t, done: true, picked: e.choice } : { ...t, done: true };
  });
  return ticked ? { ...p, today: { ...plan, tasks } } : p;
};

/** Coco's suggestion: the first task not done yet. She may do any of them first. */
export const nextTask = (plan?: DayPlan): DayTask | undefined => plan?.tasks.find((t) => !t.done);
export const dayDone = (plan?: DayPlan): boolean => !!plan && plan.tasks.length > 0 && plan.tasks.every((t) => t.done);
