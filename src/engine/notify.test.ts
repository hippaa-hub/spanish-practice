import { describe, expect, it } from 'vitest';
import { isTopic, reportMessage, startNote, stopNote, topicFrom } from './notify';
import { pinMatches, scramblePin } from './pin';
import { addXp, recordActivity } from './progress';
import { emptyProgress } from './types';

describe('parent code', () => {
  it('keeps only a scrambled code and checks it', () => {
    const saved = scramblePin('2580');
    expect(saved).not.toContain('2580');
    expect(pinMatches('2580', saved)).toBe(true);
    expect(pinMatches('2581', saved)).toBe(false);
    expect(pinMatches('258', saved)).toBe(false);
    expect(pinMatches('2580', undefined)).toBe(false);
  });
});

describe('notification channel', () => {
  it('makes a private channel name in the Exam Prep format, so one channel can serve both apps', () => {
    const t = topicFrom(Uint8Array.from({ length: 12 }, (_, i) => i * 7));
    expect(isTopic(t)).toBe(true);
    expect(t).toMatch(/^prep-[a-z2-9]{4}-[a-z2-9]{4}-[a-z2-9]{4}$/);
    expect(isTopic('prep-k7m2-x9qd-4hwz')).toBe(true);
    expect(isTopic('hello')).toBe(false);
    expect(isTopic('prep-k7m2-x9qd')).toBe(false);
  });
});

describe('the report to a parent', () => {
  it('says what she did today in numbers, never her name', () => {
    let p = addXp(emptyProgress(), 25, '2026-11-16');
    p = recordActivity(p, 'lessons', 12, 10, '2026-11-16');
    p = recordActivity(p, 'stories', 6, 5, '2026-11-16');
    p = { ...p, minutes: { '2026-11-16': 14 } };
    const text = reportMessage(p, '2026-11-16', 3);
    expect(text).toContain('25 XP of 20 ✓ goal met');
    expect(text).toContain('17 min');
    expect(text).toContain('1 lesson, 1 story');
    expect(text).toContain('83% (15/18)');
    expect(text.toLowerCase()).not.toContain('adele');
  });

  it('builds the start and stop notes', () => {
    const when = new Date(2026, 10, 16, 17, 5);
    expect(startNote(when, '2026-11-16', 'Saludos').message).toBe('Mon 16 Nov, 17:05 · Saludos');
    const stop = stopNote('goal', when, '2026-11-16', 12, 'Today: …');
    expect(stop.title).toContain('goal');
    expect(stop.message).toContain('this sitting: 12 min');
  });
});
