import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { getItem } from '../../content';
import { raceDialogues } from '../../content/games';
import { RACE_DIALOGUES } from '../../engine/games';
import { emptyProgress } from '../../engine/types';
import { DialogueRace } from './DialogueRace';
import { click, mount, text, tick } from './testing';

describe("Coco's dialogue race", () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it('lets her move lines with the arrows, says kindly what is right so far, and plays the dialogue when it is in order', () => {
    const answers: [string[], boolean][] = [];
    const finished: number[] = [];
    const { box } = mount(
      <DialogueRace progress={emptyProgress()} onAnswer={(ids, ok) => answers.push([ids, ok])} onFinish={(xp) => finished.push(xp)} onQuit={() => undefined} />,
    );

    let dialogues = 0;
    while (!box.querySelector('.finish') && dialogues < 10) {
      dialogues += 1;
      const shown = text(box, '.race-text');
      const source = raceDialogues().find((d) => d.lines.length === shown.length && d.lines.every((l) => shown.includes(l.es)));
      expect(source, 'every line comes from the content').toBeDefined();
      const want = source!.lines.map((l) => l.es);
      expect(shown).not.toEqual(want); // scrambled

      // The clock runs, but checking too early only says "Not yet".
      tick(3000);
      expect(box.textContent).toContain('0:03');
      click(box.querySelector('.footer .btn'));
      expect(box.textContent).toContain('Not yet');
      expect(answers[answers.length - 1][1]).toBe(false);

      // Put each line in its place with the ▲ arrow.
      for (let i = 0; i < want.length; i += 1) {
        let at = text(box, '.race-text').indexOf(want[i]);
        while (at > i) {
          click(box.querySelector(`[aria-label="Move line ${at + 1} up"]`));
          at -= 1;
        }
      }
      expect(text(box, '.race-text')).toEqual(want);
      click(box.querySelector('.footer .btn'));
      expect(box.textContent).toContain('¡Perfecto!');
      expect(box.querySelector('.line.now'), 'plays back line by line').not.toBeNull();
      // One memory record per dialogue, from the first check.
      expect(answers.length).toBe(dialogues);
      for (const id of answers[answers.length - 1][0]) expect(getItem(id)).toBeDefined();
      click(box.querySelector('.footer .btn'));
    }
    expect(dialogues).toBe(RACE_DIALOGUES);
    expect(finished).toEqual([10]);
    expect(text(box, '.finish h1')[0]).toBe('¡Meta!');
    expect(box.textContent).toContain('Play again');
  });
});
