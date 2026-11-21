import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { allItems, getItem } from '../../content';
import { CATCHER_ROUNDS } from '../../engine/games';
import { emptyProgress } from '../../engine/types';
import { SoundCatcher } from './SoundCatcher';
import { click, mount, text, tick } from './testing';

const said: string[] = [];
vi.mock('../../audio/speech', () => ({
  speak: (t: string) => said.push(t),
  stopSpeaking: () => undefined,
  canSpeak: () => false,
}));

/** What is written in the bubble for what was said (eme → m). */
const bubbleFor = new Map(allItems().map((i) => [i.say ?? i.es, i.es]));

describe('Sound Catcher', () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it('plays ten rounds through: right taps are caught, a wrong tap shows the answer and comes back, then Coco celebrates', () => {
    const answers: [string[], boolean][] = [];
    const finished: number[] = [];
    const { box } = mount(
      <SoundCatcher progress={emptyProgress()} onAnswer={(ids, ok) => answers.push([ids, ok])} onFinish={(xp) => finished.push(xp)} onQuit={() => undefined} />,
    );
    expect(said.length).toBe(1); // the first sound is said as the round starts

    let rounds = 0;
    let missedOnPurpose = false;
    while (!box.querySelector('.finish') && rounds < 30) {
      rounds += 1;
      const answer = bubbleFor.get(said[said.length - 1]);
      const bubbles = [...box.querySelectorAll<HTMLButtonElement>('.bubble')];
      expect(bubbles.length).toBeGreaterThanOrEqual(4);
      expect(bubbles.map((b) => b.textContent)).toContain(answer);
      if (!missedOnPurpose) {
        // Once, tap a wrong bubble: the right one lights up, the sound is said again, and nothing is lost.
        missedOnPurpose = true;
        click(bubbles.find((b) => b.textContent !== answer));
        expect(box.querySelector('.bubble.right')?.textContent).toBe(answer);
        expect(box.textContent).toContain('It floated away');
        tick(600);
        expect(said[said.length - 1]).toBe(said[said.length - 2]);
      } else {
        click(bubbles.find((b) => b.textContent === answer));
        expect(box.textContent).toContain('¡Atrapado!');
      }
      click(box.querySelector('.footer .btn'));
    }
    // Ten rounds plus the one that came back.
    expect(rounds).toBe(CATCHER_ROUNDS + 1);
    expect(answers.length).toBe(CATCHER_ROUNDS + 1);
    expect(answers.filter(([, ok]) => !ok).length).toBe(1);
    for (const [ids] of answers) expect(ids.length === 1 && getItem(ids[0])).toBeTruthy();
    expect(finished).toEqual([10]);
    expect(text(box, '.finish h1')[0]).toBe('¡Sonidos atrapados!');
    expect(box.textContent).toContain(`${CATCHER_ROUNDS - 1}/${CATCHER_ROUNDS}`);
    expect(box.textContent).toContain('Play again');
  });

  it('counts a bubble that floats away as a gentle miss and replays the sound', () => {
    const answers: boolean[] = [];
    const { box } = mount(
      <SoundCatcher progress={emptyProgress()} onAnswer={(_, ok) => answers.push(ok)} onFinish={() => undefined} onQuit={() => undefined} />,
    );
    tick(9000);
    expect(answers).toEqual([]); // the last bubble is still drifting
    tick(1300);
    expect(answers).toEqual([false]);
    expect(box.querySelector('.bubble.right')).not.toBeNull();
    expect(box.querySelector('.bubble.wrong')).toBeNull();
  });
});
