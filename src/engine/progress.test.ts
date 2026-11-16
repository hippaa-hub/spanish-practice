import { describe, expect, it } from 'vitest';
import { addMinutes, addXp, finishStory, finishWriting, lessonXp, remember, saveDraft, setGoal, startDay, XP_STORY } from './progress';
import { emptyProgress, type Progress } from './types';

const base = () => ({ ...emptyProgress(), dailyGoal: 20 });

describe('XP, daily goal and streak', () => {
  it('gives 10 XP for a lesson and 5 more for no mistakes', () => {
    expect(lessonXp(2)).toBe(10);
    expect(lessonXp(0)).toBe(15);
  });

  it('raises the streak once the daily goal is met, and only once a day', () => {
    let p = base();
    p = addXp(p, 15, '2026-11-16');
    expect(p.streak).toBe(0);
    p = addXp(p, 10, '2026-11-16');
    expect(p.streak).toBe(1);
    p = addXp(p, 10, '2026-11-16');
    expect(p.streak).toBe(1);
  });

  it('earns a streak freeze every seven days', () => {
    let p = base();
    let day = new Date(2026, 10, 1);
    for (let i = 0; i < 7; i += 1) {
      const key = `2026-11-${String(day.getDate()).padStart(2, '0')}`;
      p = addXp(p, 20, key);
      day = new Date(day.getTime() + 86400000);
    }
    expect(p.streak).toBe(7);
    expect(p.freezes).toBe(1);
  });

  it('uses a freeze for one missed day instead of losing the streak', () => {
    let p: Progress = { ...base(), streak: 7, freezes: 1, lastGoalDay: '2026-11-14', lastActiveDay: '2026-11-14' };
    p = startDay(p, '2026-11-16');
    expect(p.streak).toBe(7);
    expect(p.freezes).toBe(0);
  });

  it('loses the streak after a missed day with no freeze', () => {
    let p: Progress = { ...base(), streak: 7, freezes: 0, lastGoalDay: '2026-11-14', lastActiveDay: '2026-11-14' };
    p = startDay(p, '2026-11-16');
    expect(p.streak).toBe(0);
  });

  it('clears today XP on a new day', () => {
    const p = startDay({ ...base(), xpToday: 20, lastActiveDay: '2026-11-15', lastGoalDay: '2026-11-15' }, '2026-11-16');
    expect(p.xpToday).toBe(0);
  });

  it('remembers every item an answer practised', () => {
    const p = remember(base(), ['w.hola', 'w.adios'], true, '2026-11-16');
    expect(p.memory['w.hola'].right).toBe(1);
    expect(p.memory['w.adios'].halfLife).toBe(2);
  });
});

describe('stories', () => {
  it('counts how many times she has read a story, and gives 15 XP', () => {
    let p = base();
    p = finishStory(addXp(p, XP_STORY, '2026-11-16'), 'st.jiwon');
    p = finishStory(p, 'st.jiwon');
    expect(p.stories['st.jiwon']).toBe(2);
    expect(p.xpToday).toBe(15);
  });
});

describe('writing', () => {
  it('keeps her draft part by part', () => {
    let p = saveDraft(base(), 'w.mepresento', 'yo', 'Me llamo Adele.', '2026-11-16');
    p = saveDraft(p, 'w.mepresento', 'material', 'Tengo un lápiz.', '2026-11-16');
    expect(p.writing['w.mepresento'].parts).toEqual({ yo: 'Me llamo Adele.', material: 'Tengo un lápiz.' });
  });

  it('gives 15 XP for finishing, once a day', () => {
    const first = finishWriting(base(), 'w.mepresento', '2026-11-16');
    expect(first.xp).toBe(15);
    expect(first.progress.xpToday).toBe(15);
    const again = finishWriting(first.progress, 'w.mepresento', '2026-11-16');
    expect(again.xp).toBe(0);
    expect(finishWriting(again.progress, 'w.mepresento', '2026-11-17').xp).toBe(15);
  });
});

describe('minutes and daily goal', () => {
  it('adds minutes, rounding, and caps one sitting at 30', () => {
    let p = addMinutes(base(), 7.4 * 60000, '2026-11-16');
    p = addMinutes(p, 3 * 60 * 60000, '2026-11-16');
    expect(p.minutes['2026-11-16']).toBe(37);
    expect(addMinutes(base(), 10000, '2026-11-16').minutes).toEqual({});
  });

  it('only accepts the three goal options', () => {
    expect(setGoal(base(), 30).dailyGoal).toBe(30);
    expect(setGoal(base(), 50).dailyGoal).toBe(20);
  });
});
