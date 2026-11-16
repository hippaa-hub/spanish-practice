import { addDays, dayKey, daysBetween } from './dates';
import { newMemory, recordAnswer } from './memory';
import type { ItemMemory, Progress } from './types';

export const XP_LESSON = 10;
export const XP_PERFECT = 5;
export const XP_STORY = 15;
export const GOAL_OPTIONS = [10, 20, 30];

/** Roll the day over: reset today's XP, and use a streak freeze for a missed day. */
export const startDay = (p: Progress, today = dayKey()): Progress => {
  if (p.lastActiveDay === today) return p;
  let { streak, freezes, lastGoalDay } = p;

  if (lastGoalDay) {
    const missed = daysBetween(lastGoalDay, today) - 1;
    if (missed === 1 && freezes > 0) {
      freezes -= 1;
      lastGoalDay = addDays(lastGoalDay, 1);
    } else if (missed >= 1) {
      streak = 0;
    }
  }
  return { ...p, xpToday: 0, streak, freezes, lastGoalDay, lastActiveDay: today };
};

export const goalMet = (p: Progress): boolean => p.xpToday >= p.dailyGoal;

/** Add XP and keep the streak, the day calendar and streak freezes up to date. */
export const addXp = (p: Progress, xp: number, today = dayKey()): Progress => {
  const base = startDay(p, today);
  const wasMet = base.lastGoalDay === today;
  const next: Progress = {
    ...base,
    xpToday: base.xpToday + xp,
    xpTotal: base.xpTotal + xp,
    days: { ...base.days, [today]: (base.days[today] ?? 0) + xp },
    lastActiveDay: today,
  };
  if (!wasMet && next.xpToday >= next.dailyGoal) {
    next.streak = base.streak + 1;
    next.lastGoalDay = today;
    if (next.streak % 7 === 0 && next.freezes < 2) next.freezes += 1;
  }
  return next;
};

export const lessonXp = (mistakes: number): number => XP_LESSON + (mistakes === 0 ? XP_PERFECT : 0);

/** Save what one answer told us about each item it practised. */
export const remember = (
  p: Progress,
  itemIds: string[],
  correct: boolean,
  today = dayKey(),
): Progress => {
  const memory: Record<string, ItemMemory> = { ...p.memory };
  for (const id of itemIds) {
    memory[id] = recordAnswer(memory[id] ?? newMemory(id, today), correct, today);
  }
  return { ...p, memory };
};

export const nodeLevel = (p: Progress, nodeId: string): number => p.nodes[nodeId]?.level ?? 0;

export const finishNode = (p: Progress, nodeId: string, level: number): Progress => ({
  ...p,
  nodes: { ...p.nodes, [nodeId]: { level: Math.max(nodeLevel(p, nodeId), level) } },
});

export const finishStory = (p: Progress, storyId: string): Progress => ({
  ...p,
  stories: { ...p.stories, [storyId]: (p.stories[storyId] ?? 0) + 1 },
});

export const XP_WRITE = 15;

export const saveDraft = (p: Progress, taskId: string, partId: string, text: string, today = dayKey()): Progress => {
  const draft = p.writing[taskId] ?? { parts: {}, updated: today };
  return {
    ...p,
    writing: { ...p.writing, [taskId]: { ...draft, parts: { ...draft.parts, [partId]: text }, updated: today } },
  };
};

/** Finishing a piece of writing gives XP once a day per task, so re-saving is not a way to farm XP. */
export const finishWriting = (p: Progress, taskId: string, today = dayKey()): { progress: Progress; xp: number } => {
  const draft = p.writing[taskId] ?? { parts: {}, updated: today };
  const xp = draft.finished === today ? 0 : XP_WRITE;
  const next = { ...p, writing: { ...p.writing, [taskId]: { ...draft, finished: today } } };
  return { progress: xp ? addXp(next, xp, today) : next, xp };
};

/** Time spent practising, so the parent view can show minutes. One sitting counts at most 30 minutes. */
export const addMinutes = (p: Progress, ms: number, today = dayKey()): Progress => {
  const minutes = Math.min(30, Math.max(0, Math.round(ms / 60000)));
  if (!minutes) return p;
  return { ...p, minutes: { ...p.minutes, [today]: (p.minutes[today] ?? 0) + minutes } };
};

export const setGoal = (p: Progress, goal: number): Progress =>
  GOAL_OPTIONS.includes(goal) ? { ...p, dailyGoal: goal } : p;
