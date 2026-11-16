// Notifications for a parent's phone — the same kind as in her Exam Prep app: one when she starts
// practising, and a report when she reaches the daily goal or leaves the app. They are off until a
// parent turns them on in the parent view. When on, a short text (never a name) goes to a private
// channel on the free ntfy service; the parent's phone listens to that channel.
import { dayKey } from './dates';
import type { Progress } from './types';

export interface Note {
  title: string;
  message: string;
  tags: string[];
}

/** Letters and digits that are easy to read and type (no l, i, o, 0 or 1). */
const ALPHABET = 'abcdefghjkmnpqrstuvwxyz23456789';
/** The same prefix and shape as the Exam Prep app, so one channel can serve both apps. */
export const TOPIC_PREFIX = 'prep';
const GROUPS = 3;
const GROUP_SIZE = 4;
export const TOPIC_BYTES = GROUPS * GROUP_SIZE;

/** A private channel name such as 'prep-k7m2-x9qd-4hwz'. It works like a password. */
export function topicFrom(bytes: ArrayLike<number>): string {
  const groups: string[] = [];
  for (let g = 0; g < GROUPS; g++) {
    let part = '';
    for (let i = 0; i < GROUP_SIZE; i++) part += ALPHABET[(bytes[g * GROUP_SIZE + i] ?? 0) % ALPHABET.length];
    groups.push(part);
  }
  return [TOPIC_PREFIX, ...groups].join('-');
}

export function isTopic(s: unknown): s is string {
  return typeof s === 'string' && new RegExp(`^${TOPIC_PREFIX}(-[${ALPHABET}]{${GROUP_SIZE}}){${GROUPS}}$`).test(s);
}

const pad = (n: number) => String(n).padStart(2, '0');
export const clockTime = (when: Date) => `${pad(when.getHours())}:${pad(when.getMinutes())}`;

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
export const formatShort = (day: string) => {
  const [y, m, d] = day.split('-').map(Number);
  const date = new Date(y, m - 1, d);
  return `${DAYS[date.getDay()]} ${d} ${MONTHS[m - 1]}`;
};

/** What she did today, counted as she goes (for the report). */
export type DayActivity = {
  lessons: number;
  stories: number;
  speaking: number;
  writing: number;
  asked: number;
  right: number;
};

export const emptyActivity = (): DayActivity => ({ lessons: 0, stories: 0, speaking: 0, writing: 0, asked: 0, right: 0 });

const plural = (n: number, word: string) => `${n} ${word}${n === 1 ? '' : 's'}`;

/** The day's report, in a few short lines with numbers only. */
export function reportMessage(p: Progress, today = dayKey(), extraMinutes = 0): string {
  const a = p.activity?.[today] ?? emptyActivity();
  const xp = p.days[today] ?? 0;
  const minutes = (p.minutes[today] ?? 0) + extraMinutes;
  const parts = [
    a.lessons && plural(a.lessons, 'lesson'),
    a.stories && plural(a.stories, 'story').replace('storys', 'stories'),
    a.speaking && `${a.speaking} speaking`,
    a.writing && `${a.writing} writing`,
  ].filter(Boolean);
  const lines = [
    `Today: ${xp} XP of ${p.dailyGoal}${xp >= p.dailyGoal ? ' ✓ goal met' : ''} · ${minutes} min`,
    parts.length ? `Did: ${parts.join(', ')}` : 'Did: nothing finished yet',
  ];
  if (a.asked) lines.push(`Right first time: ${Math.round((a.right / a.asked) * 100)}% (${a.right}/${a.asked})`);
  lines.push(`Streak: ${p.streak} day${p.streak === 1 ? '' : 's'}`);
  return lines.join('\n');
}

export function startNote(when: Date, today: string, what?: string): Note {
  return {
    title: 'Spanish started',
    message: `${formatShort(today)}, ${clockTime(when)}${what ? ` · ${what}` : ''}`,
    tags: ['flag-es', 'books'],
  };
}

export function stopNote(kind: 'goal' | 'stopped', when: Date, today: string, sittingMinutes: number, report: string): Note {
  return {
    title: kind === 'goal' ? 'Spanish: daily goal reached' : 'Spanish stopped',
    message: `${formatShort(today)}, ${clockTime(when)} · this sitting: ${Math.max(0, Math.round(sittingMinutes))} min\n${report}`,
    tags: [kind === 'goal' ? 'white_check_mark' : 'pause_button'],
  };
}

/** Sent once a day, when she ticks off the last of today's tasks. */
export function tasksNote(when: Date, today: string, report: string): Note {
  return {
    title: "Spanish: today's tasks finished",
    message: `${formatShort(today)}, ${clockTime(when)}\n${report}`,
    tags: ['white_check_mark', 'tada'],
  };
}

export function testNote(when: Date): Note {
  return { title: 'Test from the Spanish app', message: `It works. Sent at ${clockTime(when)}.`, tags: ['bell'] };
}

/** Coming back to the app within this time continues the same sitting, with no new "started" note. */
export const RESUME_MS = 3 * 60 * 1000;
