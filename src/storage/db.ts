import { get, set } from 'idb-keyval';
import { emptyProgress, type Progress } from '../engine/types';

const KEY = 'adele-spanish-progress';

export const loadProgress = async (): Promise<Progress> => {
  try {
    const saved = await get<Progress>(KEY);
    if (saved && saved.version === 1) return { ...emptyProgress(), ...saved };
  } catch {
    // First run, or storage blocked: start fresh.
  }
  return emptyProgress();
};

export const saveProgress = async (p: Progress): Promise<void> => {
  try {
    await set(KEY, p);
  } catch {
    // Nothing we can do; progress stays in memory for this session.
  }
};
