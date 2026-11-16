/**
 * Coco — our own mascot: a grey Canadian Sphynx kitten, drawn in Canva
 * (watercolour anime style, pictures in public/coco/).
 * The pictures are cached with the app, so Coco works offline too.
 */
export type CocoMood = 'happy' | 'cheer' | 'think' | 'oops' | 'wave' | 'read' | 'sleep' | 'dance';

export const COCO_MOODS: CocoMood[] = ['happy', 'cheer', 'think', 'oops', 'wave', 'read', 'sleep', 'dance'];

/** Poses drawn so far; the other moods borrow the closest one until theirs is made. */
const POSE: Record<CocoMood, 'happy' | 'wave'> = {
  happy: 'happy', wave: 'wave', cheer: 'wave', dance: 'wave',
  think: 'happy', oops: 'happy', read: 'happy', sleep: 'happy',
};

export const Coco = ({ mood = 'happy', size = 110 }: { mood?: CocoMood; size?: number }) => (
  <img
    src={`${import.meta.env.BASE_URL}coco/${POSE[mood]}.png`}
    width={size}
    height={size}
    alt="Coco"
    draggable={false}
    className={`coco coco-${mood}`}
    style={{ objectFit: 'contain' }}
  />
);
