import { describe, expect, it } from 'vitest';
import { exportText, importText } from './backup';
import { addXp, remember } from './progress';
import { emptyProgress } from './types';

describe('export and import', () => {
  it('brings back exactly what was exported', () => {
    const p = remember(addXp(emptyProgress(), 25, '2026-11-16'), ['w.hola'], true, '2026-11-16');
    const back = importText(exportText(p));
    expect(back.ok).toBe(true);
    if (back.ok) {
      expect(back.progress).toEqual(p);
      expect(back.summary).toContain('25 XP');
    }
  });

  it('fills in anything an older file does not have', () => {
    const old = JSON.stringify({ app: 'adele-spanish', progress: { version: 1, xpTotal: 40, memory: {} } });
    const back = importText(old);
    expect(back.ok && back.progress.writing).toEqual({});
    expect(back.ok && back.progress.xpTotal).toBe(40);
  });

  it('refuses files that are not ours', () => {
    expect(importText('hello').ok).toBe(false);
    expect(importText(JSON.stringify({ app: 'adele-maths', progress: {} })).ok).toBe(false);
    expect(importText(JSON.stringify({ app: 'adele-spanish', progress: { version: 2 } })).ok).toBe(false);
  });
});
