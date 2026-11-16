import { daysBetween } from './dates';
import type { ItemMemory } from './types';

export const MIN_HALF_LIFE = 1;
export const MAX_HALF_LIFE = 180;

export const newMemory = (id: string, today: string): ItemMemory => ({
  id,
  lastSeen: today,
  right: 0,
  wrong: 0,
  halfLife: 1,
});

/**
 * Simplified version of Duolingo's half-life regression:
 * right doubles the half-life, wrong halves it (never below one day).
 */
export const recordAnswer = (mem: ItemMemory, correct: boolean, today: string): ItemMemory => {
  const halfLife = correct
    ? Math.min(MAX_HALF_LIFE, mem.halfLife * 2)
    : Math.max(MIN_HALF_LIFE, mem.halfLife / 2);
  return {
    ...mem,
    lastSeen: today,
    right: mem.right + (correct ? 1 : 0),
    wrong: mem.wrong + (correct ? 0 : 1),
    halfLife,
  };
};

/** 1 = just seen, 0.5 = one half-life ago (due for review), towards 0 = forgotten. */
export const strength = (mem: ItemMemory, today: string): number => {
  const days = Math.max(0, daysBetween(mem.lastSeen, today));
  return 2 ** (-days / mem.halfLife);
};

export const isDue = (mem: ItemMemory, today: string): boolean => strength(mem, today) < 0.5;

/** Items she has met, weakest first — what "Fix my mistakes" and lesson review use. */
export const dueItems = (
  memory: Record<string, ItemMemory>,
  today: string,
  only?: (id: string) => boolean,
): string[] =>
  Object.values(memory)
    .filter((m) => (only ? only(m.id) : true))
    .filter((m) => isDue(m, today))
    .sort((a, b) => strength(a, today) - strength(b, today))
    .map((m) => m.id);
