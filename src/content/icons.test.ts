import { describe, expect, it } from 'vitest';
import { hasPicture } from '../art/Picture';
import { units } from './index';

describe('pictures', () => {
  it('gives every word and phrase a picture (letters and verb forms are shown as text)', () => {
    const missing = units
      .flatMap((u) => u.items)
      .filter((i) => i.kind === 'word' || i.kind === 'phrase')
      .filter((i) => !i.icon || !hasPicture(i.icon))
      .map((i) => `${i.id} (${i.icon ?? 'none'})`);
    expect(missing).toEqual([]);
  });
});
