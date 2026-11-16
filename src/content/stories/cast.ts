import type { Look } from '../types';

/** The characters from her teacher's texts, drawn the same way in every story. */
export const CAST: Record<string, Look> = {
  Mateo: { skin: '#e9b48a', hair: '#3b2a20', shirt: '#4b9fe1' },
  Lucía: { skin: '#f6cba4', hair: '#7a4a2a', shirt: '#f08aab', long: true, pic: 'lucia' },
  Carlos: { skin: '#d9a07a', hair: '#1f1a17', shirt: '#58cc02' },
  Elena: { skin: '#c98c64', hair: '#1f1a17', shirt: '#8b5cf6', long: true },
  Sofía: { skin: '#f9d3b4', hair: '#e0b04a', shirt: '#ff9f1c', long: true },
  Petra: { skin: '#f9d9c2', hair: '#c4552c', shirt: '#2ec4b6', long: true },
  Jean: { skin: '#f3c8a8', hair: '#d9b25a', shirt: '#2b4c7e' },
  Jiwon: { skin: '#f3d0b0', hair: '#141414', shirt: '#ffc93c' },
  Ana: { skin: '#eebd96', hair: '#5b3a29', shirt: '#e4572e', long: true, glasses: true, grownUp: true },
  Adele: { skin: '#f6cba4', hair: '#b3202a', shirt: '#26262e', long: true, pic: 'adele' },
};

export const castOf = (...names: string[]): Record<string, Look> =>
  Object.fromEntries(names.map((n) => [n, CAST[n]]));
