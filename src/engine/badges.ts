import { units } from '../content';
import { addDays, dayKey, daysBetween } from './dates';
import type { Progress } from './types';

/** The badges from PLAN section 5. */
export type Badge = { id: string; title: string; en: string; icon: string };

const unitBadge = (number: number, title: string): Badge => ({
  id: `unit-${number}`,
  title: `Unidad ${number}`,
  en: `Finished Unit ${number}: ${title}`,
  icon: '🏅',
});

export const BADGES: Badge[] = [
  { id: 'first-lesson', title: '¡Primera lección!', en: 'Finished your first lesson', icon: '🌱' },
  { id: 'streak-7', title: 'Racha de 7 días', en: '7 days in a row', icon: '🔥' },
  { id: 'streak-30', title: 'Racha de 30 días', en: '30 days in a row', icon: '🌋' },
  { id: 'words-100', title: '100 palabras', en: '100 words learned', icon: '📚' },
  { id: 'verbs', title: 'Maestra de verbos', en: 'All six verbs mastered', icon: '⚡' },
  { id: 'first-story', title: 'Primera historia', en: 'Read your first story', icon: '📖' },
  { id: 'me-presento', title: '¡Me presento!', en: 'Wrote your first self-introduction', icon: '✍️' },
  ...units.filter((u) => u.number > 0).map((u) => unitBadge(u.number, u.title)),
];

export const getBadge = (id: string) => BADGES.find((b) => b.id === id);

/** A word counts as learned once she has got it right twice. */
export const wordsLearned = (p: Progress): number =>
  Object.values(p.memory).filter((m) => m.right >= 2).length;

/** A verb form is mastered when its half-life has grown to four days or more. */
const VERB_FORMS = units.flatMap((u) => u.items).filter((i) => i.kind === 'verbform').map((i) => i.id);
export const verbsMastered = (p: Progress): number => VERB_FORMS.filter((id) => (p.memory[id]?.halfLife ?? 0) >= 4).length;
export const verbFormCount = VERB_FORMS.length;

const nodeDone = (p: Progress, node: { id: string; kind?: string; story?: string }) =>
  (p.nodes[node.id]?.level ?? 0) >= 4 || (node.kind === 'story' && !!node.story && (p.stories[node.story] ?? 0) > 0);

export const unitFinished = (p: Progress, unitId: string): boolean => {
  const unit = units.find((u) => u.id === unitId);
  return !!unit && unit.nodes.every((n) => nodeDone(p, n));
};

/** The longest run of days with the daily goal met (from the day-by-day XP record). */
export const bestStreak = (p: Progress): number => {
  const days = Object.keys(p.days).filter((d) => p.days[d] >= p.dailyGoal).sort();
  let best = 0;
  let run = 0;
  let prev: string | null = null;
  for (const d of days) {
    run = prev && daysBetween(prev, d) === 1 ? run + 1 : 1;
    best = Math.max(best, run);
    prev = d;
  }
  return Math.max(best, p.streak);
};

/** Every badge she has earned, given her progress now. */
export const earnedBadges = (p: Progress): string[] => {
  const out: string[] = [];
  const anyLesson = Object.values(p.nodes).some((n) => n.level >= 1);
  if (anyLesson) out.push('first-lesson');
  const streak = bestStreak(p);
  if (streak >= 7) out.push('streak-7');
  if (streak >= 30) out.push('streak-30');
  if (wordsLearned(p) >= 100) out.push('words-100');
  if (verbFormCount > 0 && verbsMastered(p) === verbFormCount) out.push('verbs');
  if (Object.values(p.stories).some((n) => n > 0)) out.push('first-story');
  if (p.writing['w.mepresento']?.finished) out.push('me-presento');
  for (const u of units) if (u.number > 0 && unitFinished(p, u.id)) out.push(`unit-${u.number}`);
  return out;
};

/** Badges earned now that were not in her list yet — these get a celebration. */
export const newBadges = (p: Progress): string[] => earnedBadges(p).filter((id) => !p.badges.includes(id));

// ------------------------------------------------------------------ weekly report

/** Monday of the week a day falls in. */
export const weekStart = (day: string): string => {
  const [y, m, d] = day.split('-').map(Number);
  const weekday = (new Date(y, m - 1, d).getDay() + 6) % 7; // Monday = 0
  return addDays(day, -weekday);
};

export type WeekReport = {
  from: string;
  to: string;
  daysPractised: number;
  goalDays: number;
  xp: number;
  minutes: number;
  bestDay: string | null;
};

export const weekReport = (p: Progress, anyDay = dayKey()): WeekReport => {
  const from = weekStart(anyDay);
  const days = Array.from({ length: 7 }, (_, i) => addDays(from, i));
  const xpOf = (d: string) => p.days[d] ?? 0;
  const practised = days.filter((d) => xpOf(d) > 0);
  const best = practised.sort((a, b) => xpOf(b) - xpOf(a))[0] ?? null;
  return {
    from,
    to: days[6],
    daysPractised: days.filter((d) => xpOf(d) > 0).length,
    goalDays: days.filter((d) => xpOf(d) >= p.dailyGoal).length,
    xp: days.reduce((sum, d) => sum + xpOf(d), 0),
    minutes: days.reduce((sum, d) => sum + (p.minutes[d] ?? 0), 0),
    bestDay: best,
  };
};

/**
 * How ready she is for a test on this unit, 0 to 1: the average memory
 * strength of the unit's words today (a word she has never met counts 0).
 * It fades as days pass and grows as she practises — like real memory.
 */
export const readiness = (p: Progress, unitId: string, today = dayKey()): number => {
  const unit = units.find((u) => u.id === unitId);
  if (!unit) return 0;
  const items = unit.items.filter((i) => unitId === 'u0' || (i.kind !== 'sound' && i.kind !== 'syllable'));
  if (!items.length) return 0;
  const total = items.reduce((sum, i) => {
    const m = p.memory[i.id];
    if (!m) return sum;
    const days = Math.max(0, daysBetween(m.lastSeen, today));
    return sum + 2 ** (-days / m.halfLife);
  }, 0);
  return total / items.length;
};
