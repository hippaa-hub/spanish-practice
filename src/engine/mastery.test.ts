import { describe, expect, it } from 'vitest';
import { units } from '../content';
import { isMastered, LEVEL_AT, levelsReached, logMastery, masteredCount, unitMastery, weekGain, weeklyCounts } from './mastery';
import { emptyProgress, type Progress } from './types';

const strong = (id: string, day = '2026-11-16') => ({ id, lastSeen: day, right: 4, wrong: 0, halfLife: 16 });

describe('words mastered', () => {
  it('needs several right answers in a row, not just one', () => {
    expect(isMastered({ id: 'x', lastSeen: '2026-11-16', right: 1, wrong: 0, halfLife: 2 }, '2026-11-16')).toBe(false);
    expect(isMastered(strong('x'), '2026-11-16')).toBe(true);
  });

  it('fades out if she stops practising — the number is honest', () => {
    expect(isMastered(strong('x', '2026-10-01'), '2026-11-16')).toBe(false);
  });

  it('counts words, phrases and verbs — not letter sounds after Unit 0', () => {
    const memory: Progress['memory'] = { 'w.hola': strong('w.hola'), 'v.soy': strong('v.soy'), 's.a': strong('s.a') };
    expect(masteredCount({ ...emptyProgress(), memory }, '2026-11-16')).toBe(3); // s.a counts: Unit 0 is the reading track
  });

  it('reaches a level when most of that unit is mastered', () => {
    const u7 = units.find((u) => u.id === 'u7')!;
    const memory: Progress['memory'] = {};
    for (const i of u7.items.slice(0, Math.ceil(u7.items.length * LEVEL_AT))) memory[i.id] = strong(i.id);
    const p = { ...emptyProgress(), memory };
    expect(unitMastery(p, 'u7', '2026-11-16')).toBeGreaterThanOrEqual(LEVEL_AT);
    expect(levelsReached(p, '2026-11-16')).toBe(1);
  });

  it('shows growth: words mastered this week and week by week', () => {
    let p: Progress = { ...emptyProgress(), memory: { 'w.hola': strong('w.hola', '2026-11-12') } };
    p = logMastery(p, '2026-11-12'); // last week: 1
    p = { ...p, memory: { ...p.memory, 'w.adios': strong('w.adios'), 'w.gracias': strong('w.gracias') } };
    expect(weekGain(p, '2026-11-16')).toBe(2);
    const weeks = weeklyCounts(p, 2, '2026-11-16');
    expect(weeks.map((w) => w.count)).toEqual([1, 3]);
  });
});
