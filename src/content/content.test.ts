import { describe, expect, it } from 'vitest';
import { getItem, pathNodes, units } from './index';
import { getStory, stories } from './stories';

const ids = new Set(units.flatMap((u) => u.items.map((i) => i.id)));

describe('the curriculum', () => {
  it('has no two items with the same id', () => {
    const seen = new Set<string>();
    for (const unit of units) {
      for (const item of unit.items) {
        expect(seen.has(item.id), `${item.id} is defined twice`).toBe(false);
        seen.add(item.id);
      }
    }
  });

  it('only ever points at items that exist', () => {
    for (const unit of units) {
      for (const sentence of unit.sentences) {
        for (const id of sentence.items) expect(ids.has(id), `${sentence.id} uses unknown ${id}`).toBe(true);
      }
      for (const node of unit.nodes) {
        for (const id of node.teaches) expect(ids.has(id), `${node.id} teaches unknown ${id}`).toBe(true);
        for (const id of node.sentences ?? []) {
          expect(unit.sentences.some((s) => s.id === id), `${node.id} uses unknown sentence ${id}`).toBe(true);
        }
        for (const id of node.questions ?? []) {
          expect((unit.questions ?? []).some((q) => q.id === id), `${node.id} uses unknown question ${id}`).toBe(true);
        }
        for (const id of node.situations ?? []) {
          expect((unit.situations ?? []).some((s) => s.id === id), `${node.id} uses unknown situation ${id}`).toBe(true);
        }
        for (const id of node.dialogues ?? []) {
          expect((unit.dialogues ?? []).some((d) => d.id === id), `${node.id} uses unknown dialogue ${id}`).toBe(true);
        }
        for (const id of node.oddOneOut ?? []) {
          expect((unit.oddOneOut ?? []).some((o) => o.id === id), `${node.id} uses unknown group ${id}`).toBe(true);
        }
        for (const id of node.gapTexts ?? []) {
          expect((unit.gapTexts ?? []).some((t) => t.id === id), `${node.id} uses unknown text ${id}`).toBe(true);
        }
      }
    }
  });

  it('teaches between 2 and 6 new things per lesson', () => {
    for (const { node } of pathNodes()) {
      if (node.kind === 'check' || node.kind === 'story') {
        expect(node.teaches.length, `${node.id} should teach nothing new`).toBe(0);
        continue;
      }
      expect(node.teaches.length, `${node.id} teaches ${node.teaches.length}`).toBeGreaterThanOrEqual(2);
      expect(node.teaches.length, `${node.id} teaches ${node.teaches.length}`).toBeLessThanOrEqual(6);
    }
  });

  it('gives every gap sentence an answer that is one of its options', () => {
    for (const unit of units) {
      for (const s of unit.sentences) {
        if (!s.gap) continue;
        expect(s.es.includes('___'), `${s.id} has no gap marker`).toBe(true);
        if (s.gap.options) {
          expect(s.gap.options, `${s.id}: the answer is not an option`).toContain(s.gap.answer);
        }
      }
    }
  });

  it('gives every odd one out and gap text a real answer', () => {
    for (const unit of units) {
      for (const group of unit.oddOneOut ?? []) {
        expect(group.options, `${group.id}: the answer is not an option`).toContain(group.answer);
        expect(group.options.length).toBeGreaterThanOrEqual(3);
      }
      for (const text of unit.gapTexts ?? []) {
        const gaps = text.parts.filter((p) => typeof p !== 'string') as { answer: string; options: string[] }[];
        expect(gaps.length, `${text.id} has no gaps`).toBeGreaterThan(1);
        for (const g of gaps) expect(g.options, `${text.id}: ${g.answer} is not an option`).toContain(g.answer);
      }
      for (const d of unit.dialogues ?? []) {
        expect(d.lines.length, `${d.id} is too short to order`).toBeGreaterThanOrEqual(3);
      }
      for (const q of unit.questions ?? []) {
        expect(q.starts.length, `${q.id} has no opening words`).toBeGreaterThan(0);
        for (const id of q.items) expect(ids.has(id), `${q.id} uses unknown ${id}`).toBe(true);
      }
    }
  });

  it('keeps every unit ending with a Unit Check', () => {
    for (const unit of units) {
      if (unit.number === 0) continue;
      const last = unit.nodes[unit.nodes.length - 1];
      expect(last.kind, `Unit ${unit.number} does not end with a check`).toBe('check');
    }
  });

  it('gives every item English and Spanish', () => {
    for (const unit of units) {
      for (const item of unit.items) {
        expect(item.es.trim().length, `${item.id} has no Spanish`).toBeGreaterThan(0);
        expect(item.en.trim().length, `${item.id} has no English`).toBeGreaterThan(0);
        expect(getItem(item.id)).toBeDefined();
      }
    }
  });
});

describe('the stories', () => {
  it('has the five stories from the plan, plus Conócenos for Unit 5', () => {
    expect(stories.map((s) => s.id).sort()).toEqual(
      ['st.biblioteca', 'st.conocenos', 'st.jiwon', 'st.mateo', 'st.petra', 'st.tiflis'].sort(),
    );
  });

  it('keeps every story short enough to read three times (6 to 12 lines)', () => {
    for (const s of stories) {
      expect(s.lines.length, s.id).toBeGreaterThanOrEqual(6);
      expect(s.lines.length, s.id).toBeLessThanOrEqual(12);
    }
  });

  it('draws every speaker', () => {
    for (const s of stories) {
      for (const line of s.lines) expect(s.cast[line.speaker], `${s.id}: no look for ${line.speaker}`).toBeDefined();
    }
  });

  it("asks all three of her teacher's Criterion B question types", () => {
    for (const s of stories) {
      const kinds = new Set(s.questions.map((q) => q.criterion));
      expect([...kinds].sort(), s.id).toEqual(['Bi', 'Bii', 'Biii']);
      expect(s.questions.some((q) => q.kind === 'truefalse'), `${s.id} has no true/false + justify`).toBe(true);
    }
  });

  it('gives every question a real answer and real evidence', () => {
    for (const s of stories) {
      for (const q of s.questions) {
        if (q.kind === 'choice') expect(q.options, `${s.id} ${q.id}`).toContain(q.answer);
        if (q.kind === 'truefalse') {
          expect(s.lines[q.evidence], `${s.id} ${q.id}: no line ${q.evidence}`).toBeDefined();
        }
        if (q.kind === 'you') expect(q.starts.length).toBeGreaterThan(0);
      }
    }
  });

  it('only puts real stories on the path', () => {
    for (const { node } of pathNodes()) {
      if (node.kind !== 'story') continue;
      expect(node.story && getStory(node.story), `${node.id} points at a missing story`).toBeTruthy();
    }
  });
});

describe('Unit 9 and writing stops', () => {
  it('points "Esta semana en clase" at a unit that exists', async () => {
    const { currentClass } = await import('./index');
    expect(units.some((u) => u.id === currentClass.unitId)).toBe(true);
  });

  it('makes the Unit 9 check the Identity Iceberg', async () => {
    const { getTask } = await import('../engine/writing');
    const check = units.find((u) => u.id === 'u9')!.nodes.find((n) => n.kind === 'check')!;
    expect(check.write && getTask(check.write)?.title).toBe('Mi iceberg de identidad');
  });
});
