import { describe, expect, it } from 'vitest';
import { units } from '../content';
import { BADGES, bestStreak, earnedBadges, newBadges, readiness, unitFinished, verbFormCount, weekReport, weekStart } from './badges';
import { emptyProgress, type Progress } from './types';

const base = (): Progress => emptyProgress();

describe('badges', () => {
  it('has every badge from the plan', () => {
    const ids = BADGES.map((b) => b.id);
    for (const id of ['first-lesson', 'streak-7', 'streak-30', 'words-100', 'verbs', 'first-story', 'me-presento', 'unit-1']) {
      expect(ids).toContain(id);
    }
  });

  it('gives "first lesson" after one finished lesson', () => {
    expect(earnedBadges(base())).toEqual([]);
    expect(earnedBadges({ ...base(), nodes: { 'u1.n1': { level: 1 } } })).toContain('first-lesson');
  });

  it('counts a 7-day streak from her day-by-day XP', () => {
    const days: Record<string, number> = {};
    for (let d = 1; d <= 7; d += 1) days[`2026-11-0${d}`] = 25;
    const p = { ...base(), days };
    expect(bestStreak(p)).toBe(7);
    expect(earnedBadges(p)).toContain('streak-7');
  });

  it('does not count days below the daily goal', () => {
    const p = { ...base(), days: { '2026-11-01': 25, '2026-11-02': 5, '2026-11-03': 25 } };
    expect(bestStreak(p)).toBe(1);
  });

  it('gives "100 words" when 100 words have been right twice', () => {
    const memory: Progress['memory'] = {};
    for (let i = 0; i < 100; i += 1) memory[`x${i}`] = { id: `x${i}`, lastSeen: '2026-11-16', right: 2, wrong: 0, halfLife: 4 };
    expect(earnedBadges({ ...base(), memory })).toContain('words-100');
  });

  it('gives "verbs" only when every verb form is mastered', () => {
    const forms = units.flatMap((u) => u.items).filter((i) => i.kind === 'verbform');
    expect(forms.length).toBe(verbFormCount);
    const memory: Progress['memory'] = {};
    for (const f of forms) memory[f.id] = { id: f.id, lastSeen: '2026-11-16', right: 3, wrong: 0, halfLife: 8 };
    expect(earnedBadges({ ...base(), memory })).toContain('verbs');
    delete memory[forms[0].id];
    expect(earnedBadges({ ...base(), memory })).not.toContain('verbs');
  });

  it('finishes a unit only when every stop is gold, stories included', () => {
    const unit = units.find((u) => u.id === 'u6')!;
    const nodes: Progress['nodes'] = {};
    for (const n of unit.nodes) if (n.kind !== 'story') nodes[n.id] = { level: 4 };
    expect(unitFinished({ ...base(), nodes }, 'u6')).toBe(false);
    expect(unitFinished({ ...base(), nodes, stories: { 'st.mateo': 1 } }, 'u6')).toBe(true);
  });

  it('only celebrates badges she has not seen yet', () => {
    const p = { ...base(), nodes: { 'u1.n1': { level: 1 } }, stories: { 'st.jiwon': 1 }, badges: ['first-lesson'] };
    expect(newBadges(p)).toEqual(['first-story']);
  });
});

describe('weekly report card', () => {
  it('starts weeks on Monday', () => {
    expect(weekStart('2026-11-16')).toBe('2026-11-16'); // a Monday
    expect(weekStart('2026-11-22')).toBe('2026-11-16'); // Sunday
  });

  it('adds up the week', () => {
    const p = {
      ...base(),
      dailyGoal: 20,
      days: { '2026-11-16': 25, '2026-11-17': 10, '2026-11-19': 30, '2026-11-12': 99 },
      minutes: { '2026-11-16': 8, '2026-11-19': 12 },
    };
    const r = weekReport(p, '2026-11-20');
    expect(r).toMatchObject({ from: '2026-11-16', to: '2026-11-22', daysPractised: 3, goalDays: 2, xp: 65, minutes: 20, bestDay: '2026-11-19' });
  });
});

describe('exam readiness', () => {
  it('is 0 before she starts and grows as she learns the unit', () => {

    expect(readiness(emptyProgress(), 'u7', '2026-11-16')).toBe(0);
    const u7 = units.find((u) => u.id === 'u7')!;
    const memory: Progress['memory'] = {};
    for (const i of u7.items) memory[i.id] = { id: i.id, lastSeen: '2026-11-16', right: 2, wrong: 0, halfLife: 4 };
    expect(readiness({ ...emptyProgress(), memory }, 'u7', '2026-11-16')).toBeCloseTo(1);
    expect(readiness({ ...emptyProgress(), memory }, 'u7', '2026-11-20')).toBeCloseTo(0.5);
  });
});
