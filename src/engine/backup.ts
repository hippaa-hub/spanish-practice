import { emptyProgress, type Progress } from './types';

/** Export and import of progress, for moving to a new phone or keeping a copy. */

const TAG = 'adele-spanish';

export const exportText = (p: Progress, now = new Date()): string =>
  JSON.stringify({ app: TAG, exported: now.toISOString(), progress: p }, null, 1);

export const exportName = (day: string) => `adele-spanish-progress-${day}.json`;

export type ImportResult = { ok: true; progress: Progress; summary: string } | { ok: false; reason: string };

export const importText = (text: string): ImportResult => {
  let data: unknown;
  try {
    data = JSON.parse(text);
  } catch {
    return { ok: false, reason: 'This file is not a progress file (it could not be read).' };
  }
  const d = data as { app?: string; progress?: Partial<Progress> & { version?: number } };
  if (d?.app !== TAG || !d.progress) return { ok: false, reason: 'This file is not from Adele’s Spanish app.' };
  if (d.progress.version !== 1) return { ok: false, reason: 'This file is from a different version of the app.' };
  const progress = { ...emptyProgress(), ...d.progress } as Progress;
  const words = Object.keys(progress.memory ?? {}).length;
  return {
    ok: true,
    progress,
    summary: `${progress.xpTotal} XP, ${words} words, streak ${progress.streak}`,
  };
};
