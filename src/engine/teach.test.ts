import { describe, expect, it } from 'vitest';
import { units } from '../content';
import { COCO_MISTAKES } from '../content/cocoMistakes';
import { fixedSentence, pickMistakes, reasonChoices, TEACH_LENGTH } from './teach';
import { emptyProgress } from './types';

describe("Coco's mistakes", () => {
  it('are well formed: the wrong piece exists, and the fix and the other choice differ from it', () => {
    const ids = new Set<string>();
    for (const m of COCO_MISTAKES) {
      expect(ids.has(m.id), m.id).toBe(false);
      ids.add(m.id);
      expect(m.parts[m.wrong], m.id).toBeDefined();
      expect(m.right, m.id).not.toBe(m.parts[m.wrong]);
      expect(m.other, m.id).not.toBe(m.right);
      expect(units.some((u) => u.number === m.unit), m.id).toBe(true);
    }
  });

  it('come from every unit she has had in class (1 to 9)', () => {
    const covered = new Set(COCO_MISTAKES.map((m) => m.unit));
    for (let u = 1; u <= 9; u += 1) expect(covered.has(u), `unit ${u}`).toBe(true);
  });

  it('gives five at a time, from units she has reached first', () => {
    const picked = pickMistakes(emptyProgress(), 3);
    expect(picked.length).toBe(TEACH_LENGTH);
    // at the very start she has reached only her class unit (9), so both of its mistakes come first
    expect(picked.slice(0, 2).every((m) => m.unit === 9)).toBe(true);
  });

  it('offers the right reason among three different ones', () => {
    const m = COCO_MISTAKES[0];
    const reasons = reasonChoices(m, 1);
    expect(reasons).toContain(m.why);
    expect(new Set(reasons).size).toBe(3);
  });

  it('can show the corrected sentence', () => {
    expect(fixedSentence(COCO_MISTAKES.find((m) => m.id === 'm4')!)).toBe('Yo tengo doce años.');
  });
});
