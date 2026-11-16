import { units } from '../content';
import { addDays, dayKey } from './dates';
import { weekStart } from './badges';
import { strength } from './memory';
import type { ItemMemory, Progress } from './types';

/**
 * Progress she can see, measured in what she knows — not in points.
 *
 * A word is MASTERED when she has got it right several times in a row
 * (its memory half-life has grown to 8 days or more) and she still knows it
 * today. If she stops practising it, it fades out of the count — so the
 * number is honest.
 */
export const MASTERY_HALF_LIFE = 8;

export const isMastered = (m: ItemMemory | undefined, today = dayKey()): boolean =>
  !!m && m.halfLife >= MASTERY_HALF_LIFE && strength(m, today) >= 0.5;

/** Words, phrases and verb forms (sounds only count in Unit 0, the reading track). */
const countable = (unitId: string) =>
  units.find((u) => u.id === unitId)?.items.filter((i) => unitId === 'u0' || (i.kind !== 'sound' && i.kind !== 'syllable')) ?? [];

export const masteredCount = (p: Progress, today = dayKey()): number =>
  units.flatMap((u) => countable(u.id)).filter((i) => isMastered(p.memory[i.id], today)).length;

export const totalWords = (): number => units.flatMap((u) => countable(u.id)).length;

/** Share of one unit's words she has mastered, 0 to 1. */
export const unitMastery = (p: Progress, unitId: string, today = dayKey()): number => {
  const items = countable(unitId);
  if (!items.length) return 0;
  return items.filter((i) => isMastered(p.memory[i.id], today)).length / items.length;
};

/** A level is reached when most of its unit is mastered. */
export const LEVEL_AT = 0.6;

/** The level map: one "I can…" per unit, from her class. */
export const LEVELS: { unitId: string; title: string; can: string }[] = [
  { unitId: 'u0', title: 'Leo en español', can: 'I can read Spanish words out loud' },
  { unitId: 'u1', title: '¡Hola!', can: 'I can greet people and ask for help in class' },
  { unitId: 'u2', title: 'Me presento', can: 'I can say my name, my age and where I live' },
  { unitId: 'u3', title: 'Pronombres', can: 'I know yo, tú, usted… and when to be polite' },
  { unitId: 'u4', title: 'Los verbos', can: 'I can use ser, llamarse, hablar, vivir, tener' },
  { unitId: 'u5', title: 'Países e idiomas', can: 'I can say where people are from and what they speak' },
  { unitId: 'u6', title: 'Conocer a alguien', can: 'I can ask and answer questions about someone' },
  { unitId: 'u7', title: 'En la clase', can: 'I can talk about my school things' },
  { unitId: 'u8', title: 'Mi horario', can: 'I can talk about my subjects and say why I like them' },
  { unitId: 'u9', title: '¿Quién eres?', can: 'I can say who I am' },
];

export const levelsReached = (p: Progress, today = dayKey()): number =>
  LEVELS.filter((l) => unitMastery(p, l.unitId, today) >= LEVEL_AT).length;

/** Remember today's count, so she can see how it grows week by week. */
export const logMastery = (p: Progress, today = dayKey()): Progress => {
  const n = masteredCount(p, today);
  if (p.masteryLog?.[today] === n) return p;
  return { ...p, masteryLog: { ...p.masteryLog, [today]: n } };
};

/** The count at the end of a given day (the last one logged on or before it). */
const countOn = (p: Progress, day: string): number => {
  const days = Object.keys(p.masteryLog ?? {}).filter((d) => d <= day).sort();
  return days.length ? p.masteryLog![days[days.length - 1]] : 0;
};

/** Words mastered this week (since Monday). */
export const weekGain = (p: Progress, today = dayKey()): number =>
  masteredCount(p, today) - countOn(p, addDays(weekStart(today), -1));

/** The last few weeks, for a small chart: the count at the end of each week. */
export const weeklyCounts = (p: Progress, weeks = 6, today = dayKey()): { week: string; count: number }[] => {
  const thisWeek = weekStart(today);
  return Array.from({ length: weeks }, (_, i) => {
    const start = addDays(thisWeek, -7 * (weeks - 1 - i));
    const end = i === weeks - 1 ? today : addDays(start, 6);
    return { week: start, count: i === weeks - 1 ? masteredCount(p, today) : countOn(p, end) };
  });
};
