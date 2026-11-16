import { verbItemIds } from './lesson';
import { strength } from './memory';
import { dayKey } from './dates';
import type { Progress } from './types';

export type PracticeKind = 'fix' | 'review' | 'verbs';

/** The items each practice session uses, weakest first. */
export const practiceItems = (p: Progress, kind: PracticeKind, today = dayKey()): string[] => {
  const met = Object.values(p.memory);
  const weakestFirst = [...met].sort((a, b) => strength(a, today) - strength(b, today));
  switch (kind) {
    case 'fix':
      return weakestFirst.filter((m) => m.wrong > 0).slice(0, 8).map((m) => m.id);
    case 'review':
      return weakestFirst.filter((m) => strength(m, today) < 0.5).slice(0, 8).map((m) => m.id);
    case 'verbs':
      return verbItemIds(p.memory, today).filter((id) => p.memory[id]).slice(0, 8);
  }
};

