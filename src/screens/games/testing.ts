/** Tiny helpers for the game screen tests: render with React itself, click, read text. */
import { act } from 'react';
import { vi } from 'vitest';
import { createRoot, type Root } from 'react-dom/client';
import type { ReactElement } from 'react';

(globalThis as unknown as { IS_REACT_ACT_ENVIRONMENT: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

export const mount = (el: ReactElement): { root: Root; box: HTMLElement } => {
  const box = document.createElement('div');
  document.body.appendChild(box);
  const root = createRoot(box);
  act(() => root.render(el));
  return { root, box };
};

export const click = (el: Element | null | undefined) => {
  if (!el) throw new Error('nothing to click');
  act(() => {
    el.dispatchEvent(new MouseEvent('click', { bubbles: true }));
  });
};

export const tick = (ms: number) => act(() => vi.advanceTimersByTime(ms));

export const text = (box: HTMLElement, selector: string): string[] =>
  [...box.querySelectorAll(selector)].map((e) => e.textContent ?? '');
