import { describe, expect, it } from 'vitest';
import { pathNodes, units } from '../content';
import { buildLesson, buildPractice, buildTestPrep, CHECK_LENGTH, LESSON_LENGTH, verbItemIds } from './lesson';
import { newMemory } from './memory';
import type { ItemMemory } from './types';

const ids = new Set(units.flatMap((u) => u.items.map((i) => i.id)));

describe('building a lesson', () => {
  it('builds a full lesson for every node on the path', () => {
    for (const unit of units) {
      for (const node of unit.nodes) {
        if (node.kind === 'story') continue;
        const lesson = buildLesson({ nodeId: node.id, level: 1, memory: {}, today: '2026-11-16', seed: 7 });
        const want = node.kind === 'check' ? CHECK_LENGTH : LESSON_LENGTH;
        expect(lesson.length, `${node.id} is short`).toBe(want);
        for (const e of lesson) {
          for (const id of e.itemIds) expect(ids.has(id), `${id} is not a real item`).toBe(true);
        }
      }
    }
  });

  it('shows teach cards on level 1 for items she has never met, and not later', () => {
    const first = buildLesson({ nodeId: 'u1.n1', level: 1, memory: {}, today: '2026-11-16', seed: 3 });
    expect(first.filter((e) => e.kind === 'teach').length).toBeGreaterThan(0);
    const later = buildLesson({ nodeId: 'u1.n1', level: 2, memory: {}, today: '2026-11-16', seed: 3 });
    expect(later.filter((e) => e.kind === 'teach').length).toBe(0);
  });

  it('mixes in older items that are due for review', () => {
    const memory: Record<string, ItemMemory> = {};
    for (const id of ['w.hola', 'w.adios', 'w.gracias', 'w.quetal']) {
      memory[id] = { ...newMemory(id, '2026-11-01'), halfLife: 1 };
    }
    const lesson = buildLesson({ nodeId: 'u2.n1', level: 1, memory, today: '2026-11-16', seed: 11 });
    const practised = new Set(lesson.flatMap((e) => e.itemIds));
    expect([...practised].some((id) => id.startsWith('w.hola') || id === 'w.adios' || id === 'w.gracias')).toBe(true);
  });

  it('is the same lesson for the same seed', () => {
    const a = buildLesson({ nodeId: 'u0.n1', level: 1, memory: {}, today: '2026-11-16', seed: 42 });
    const b = buildLesson({ nodeId: 'u0.n1', level: 1, memory: {}, today: '2026-11-16', seed: 42 });
    expect(a.map((e) => e.key)).toEqual(b.map((e) => e.key));
  });
});

describe('the reading track', () => {
  it('never offers a second word with the same sound', () => {
    for (let seed = 1; seed < 40; seed += 1) {
      const lesson = buildLesson({ nodeId: 'u0.n5', level: 1, memory: {}, today: '2026-11-16', seed });
      for (const e of lesson) {
        if (e.kind !== 'sound-word') continue;
        const item = units[0].items.find((i) => i.id === e.itemId);
        const marks = (item?.es ?? '').split(/[\s/]+/).filter(Boolean).map((m) => m.toLowerCase());
        const wrong = e.options.filter((w) => w !== e.answer && marks.some((m) => w.toLowerCase().includes(m)));
        expect(wrong, `${e.key} has another right answer: ${wrong.join(', ')}`).toEqual([]);
      }
    }
  });
});

describe('picture exercises', () => {
  it('only asks for a picture when the item has one of its own, and never shows it twice', () => {
    for (const unit of units) {
      for (const node of unit.nodes) {
        if (node.kind === 'story') continue;
        for (let seed = 1; seed < 12; seed += 1) {
          const lesson = buildLesson({ nodeId: node.id, level: 1, memory: {}, today: '2026-11-16', seed });
          for (const e of lesson) {
            if (e.kind !== 'pick-image') continue;
            const icons = e.options.map((id) => units.flatMap((u) => u.items).find((i) => i.id === id)?.icon);
            expect(icons.every(Boolean), `${e.key} has an option with no picture`).toBe(true);
            expect(icons.includes('question'), `${e.key} uses the generic ? picture`).toBe(false);
            expect(new Set(icons).size, `${e.key} shows the same picture twice`).toBe(icons.length);
            const kinds = e.options.map((id) => units.flatMap((u) => u.items).find((i) => i.id === id)?.kind);
            expect(kinds.includes('verbform'), `${e.key} asks for a picture of a verb form`).toBe(false);
          }
        }
      }
    }
  });
});

describe('levels and Unit Checks', () => {
  it('builds a full lesson at every level, for every node', () => {
    for (const { node } of pathNodes()) {
      if (node.kind === 'story') continue;
      for (const level of [1, 2, 3, 4]) {
        const lesson = buildLesson({ nodeId: node.id, level, memory: {}, today: '2026-11-16', seed: 5 + level });
        const want = node.kind === 'check' ? CHECK_LENGTH : LESSON_LENGTH;
        expect(lesson.length, `${node.id} level ${level}`).toBe(want);
      }
    }
  });

  it('keeps typing and open questions out of the easy levels', () => {
    for (const { node } of pathNodes()) {
      if (node.kind === 'check') continue;
      for (const level of [1, 2]) {
        const lesson = buildLesson({ nodeId: node.id, level, memory: {}, today: '2026-11-16', seed: 9 });
        expect(lesson.some((e) => e.kind === 'answer-question'), `${node.id} level ${level}`).toBe(false);
      }
    }
  });

  it('uses dictation and typing from level 3', () => {
    const level3 = buildLesson({ nodeId: 'u4.n3', level: 3, memory: {}, today: '2026-11-16', seed: 4 });
    expect(level3.some((e) => e.kind === 'type-heard' || e.kind === 'type-translate')).toBe(true);
  });

  it('never teaches anything new in a Unit Check', () => {
    for (const { node } of pathNodes()) {
      if (node.kind !== 'check') continue;
      const check = buildLesson({ nodeId: node.id, level: 4, memory: {}, today: '2026-11-16', seed: 2 });
      expect(check.some((e) => e.kind === 'teach'), `${node.id}`).toBe(false);
    }
  });

  it("puts the teacher's own formats in the Unit Checks that have them", () => {
    const kinds = (id: string) =>
      new Set(buildLesson({ nodeId: id, level: 4, memory: {}, today: '2026-11-16', seed: 3 }).map((e) => e.kind));
    expect(kinds('u3.check').has('tu-usted')).toBe(true);
    expect(kinds('u4.check').has('complete-text')).toBe(true);
    expect(kinds('u6.check').has('order-dialogue')).toBe(true);
    expect(kinds('u7.check').has('odd-one-out')).toBe(true);
    expect(kinds('u2.check').has('complete-text')).toBe(true);
  });
});

describe('practice sessions', () => {
  it('only practises the words it was given', () => {
    const itemIds = ['w.hola', 'w.adios', 'w.gracias', 'c.mochila', 'c.lapiz'];
    const session = buildPractice({ itemIds, memory: {}, today: '2026-11-16', seed: 6 });
    expect(session.length).toBeGreaterThan(4);
    const practised = new Set(session.flatMap((e) => e.itemIds));
    for (const id of practised) {
      const sentenceWord = session.some((e) => (e.kind === 'tiles' || e.kind === 'gap') && e.itemIds.includes(id));
      expect(itemIds.includes(id) || sentenceWord, `${id} is not one of the chosen words`).toBe(true);
    }
  });

  it('lists verb forms weakest first', () => {
    const memory = {
      'v.hablo': { id: 'v.hablo', lastSeen: '2026-11-16', right: 5, wrong: 0, halfLife: 32 },
      'v.hablas': { id: 'v.hablas', lastSeen: '2026-11-01', right: 1, wrong: 3, halfLife: 1 },
    };
    const order = verbItemIds(memory, '2026-11-16').filter((id) => id in memory);
    expect(order[0]).toBe('v.hablas');
  });
});

describe('Unit Check variety', () => {
  it('never puts the same exercise type three times in a row', () => {
    for (const { node } of pathNodes()) {
      if (node.kind !== 'check') continue;
      for (let seed = 1; seed < 8; seed += 1) {
        const kinds = buildLesson({ nodeId: node.id, level: 4, memory: {}, today: '2026-11-16', seed }).map((e) => e.kind);
        for (let i = 2; i < kinds.length; i += 1) {
          const run = kinds[i] === kinds[i - 1] && kinds[i] === kinds[i - 2];
          expect(run, `${node.id} seed ${seed}: three ${kinds[i]} in a row`).toBe(false);
        }
      }
    }
  });
});

describe('speaking in lessons', () => {
  it('asks her to say a sentence at level 4, never before', () => {
    const l4 = buildLesson({ nodeId: 'u2.n6', level: 4, memory: {}, today: '2026-11-16', seed: 3 });
    expect(l4.some((e) => e.kind === 'speak')).toBe(true);
    for (const level of [1, 2, 3]) {
      const l = buildLesson({ nodeId: 'u2.n6', level, memory: {}, today: '2026-11-16', seed: 3 });
      expect(l.some((e) => e.kind === 'speak'), `level ${level}`).toBe(false);
    }
  });
});

describe('test prep', () => {
  it('builds a mixed lesson only from the units her teacher listed', () => {
    const allowed = new Set(units.filter((u) => ['u3', 'u7'].includes(u.id)).flatMap((u) => [...u.items.map((i) => i.id), ...u.sentences.map((s) => s.id)]));
    const lesson = buildTestPrep({ unitIds: ['u3', 'u7'], memory: {}, today: '2026-11-16', seed: 4 });
    expect(lesson.length).toBeGreaterThanOrEqual(10);
    for (const e of lesson) {
      if (e.kind === 'gap') expect(allowed.has(e.sentenceId), e.key).toBe(true);
      if (e.kind === 'pick-image' || e.kind === 'listen-pick') expect(allowed.has(e.itemId), e.key).toBe(true);
    }
  });
});
