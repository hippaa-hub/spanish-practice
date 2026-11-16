import type { Story } from '../types';
import { biblioteca } from './biblioteca';
import { conocenos } from './conocenos';
import { jiwon } from './jiwon';
import { mateo } from './mateo';
import { petra } from './petra';
import { tiflis } from './tiflis';

/** Every story, in the order of the units whose words they use. */
export const stories: Story[] = [conocenos, mateo, tiflis, biblioteca, jiwon, petra];

export const getStory = (id: string): Story | undefined => stories.find((s) => s.id === id);
