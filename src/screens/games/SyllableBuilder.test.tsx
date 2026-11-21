import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { getItem } from '../../content';
import { BUILDER_WORDS } from '../../engine/games';
import { emptyProgress } from '../../engine/types';
import { SyllableBuilder } from './SyllableBuilder';
import { click, mount, text, tick } from './testing';

describe('Syllable builder', () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it('builds eight words tile by tile: a wrong tile shakes and stays, the right ones fill the slots', () => {
    const answers: [string[], boolean][] = [];
    const finished: number[] = [];
    const { box } = mount(
      <SyllableBuilder progress={emptyProgress()} onAnswer={(ids, ok) => answers.push([ids, ok])} onFinish={(xp) => finished.push(xp)} onQuit={() => undefined} />,
    );

    let words = 0;
    while (!box.querySelector('.finish') && words < 20) {
      words += 1;
      const slots = box.querySelectorAll('.tile.slot').length;
      expect(slots).toBeGreaterThanOrEqual(2);
      let slipped = false;
      for (let k = 0; k < slots; k += 1) {
        // Try the tiles in the bank until one is accepted: the others shake and go back.
        for (const tile of box.querySelectorAll<HTMLButtonElement>('.tile-bank .tile:not(:disabled)')) {
          click(tile);
          if (box.querySelectorAll('.tile.slot.filled').length === k + 1) break;
          slipped = true;
          expect(tile.className).toContain('shake');
          expect(tile.disabled).toBe(false);
          tick(500);
          expect(tile.className).not.toContain('shake');
        }
        expect(box.querySelectorAll('.tile.slot.filled').length).toBe(k + 1);
      }
      const word = text(box, '.tile.slot.filled').join('');
      expect(box.textContent).toContain('¡Muy bien!');
      expect(text(box, '.builder-hint strong')[0]).toBe(word);
      const [ids, ok] = answers[answers.length - 1];
      expect(ok).toBe(!slipped);
      for (const id of ids) expect(getItem(id)).toBeDefined();
      click(box.querySelector('.footer .btn'));
    }
    expect(words).toBe(BUILDER_WORDS);
    expect(answers.length).toBe(BUILDER_WORDS);
    expect(finished).toEqual([10]);
    expect(text(box, '.finish h1')[0]).toBe('¡Palabras construidas!');
    expect(box.textContent).toContain('Play again');
  });
});
