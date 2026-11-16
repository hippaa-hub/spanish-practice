import { DRAWN_COCO } from './artList';

/**
 * Coco — our own mascot: a grey Canadian Sphynx kitten, drawn in Canva
 * (watercolour anime style, pictures in public/coco/).
 * The pictures are cached with the app, so Coco works offline too.
 */
export type CocoMood = 'happy' | 'cheer' | 'think' | 'oops' | 'wave' | 'read' | 'sleep' | 'dance';

export const COCO_MOODS: CocoMood[] = ['happy', 'cheer', 'think', 'oops', 'wave', 'read', 'sleep', 'dance'];

export const Coco = ({ mood = 'happy', size = 110 }: { mood?: CocoMood; size?: number }) => (
  <img
    src={`${import.meta.env.BASE_URL}coco/${DRAWN_COCO.has(mood) ? mood : 'happy'}.webp`}
    width={size}
    height={size}
    alt="Coco"
    draggable={false}
    className={`coco coco-${mood}`}
    style={{ objectFit: 'contain' }}
  />
);
