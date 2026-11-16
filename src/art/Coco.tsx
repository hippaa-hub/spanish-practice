/** Coco — our own mascot. A small Spanish-speaking parrot, drawn in code. */
export type CocoMood = 'happy' | 'cheer' | 'think' | 'oops';

export const Coco = ({ mood = 'happy', size = 110 }: { mood?: CocoMood; size?: number }) => {
  const wing = mood === 'cheer' ? 'rotate(-28 34 58)' : mood === 'oops' ? 'rotate(10 34 58)' : 'rotate(-6 34 58)';
  const tilt = mood === 'think' ? 'rotate(-8 50 55)' : undefined;
  return (
    <svg viewBox="0 0 100 100" width={size} height={size} role="img" aria-label="Coco">
      <g transform={tilt}>
        <ellipse cx="50" cy="60" rx="27" ry="30" fill="#2ec4b6" />
        <ellipse cx="50" cy="66" rx="18" ry="21" fill="#ffe8a3" />
        <circle cx="50" cy="36" r="22" fill="#2ec4b6" />
        <path d="M30 26 q14 -16 32 -6 q-10 -2 -18 4 q-8 2 -14 2z" fill="#ff6b35" />
        <circle cx="42" cy="34" r="6.5" fill="#fff" />
        <circle cx="58" cy="34" r="6.5" fill="#fff" />
        <circle cx={mood === 'think' ? 40 : 43} cy={mood === 'oops' ? 36 : 35} r="3.4" fill="#3b3a4a" />
        <circle cx={mood === 'think' ? 56 : 59} cy={mood === 'oops' ? 36 : 35} r="3.4" fill="#3b3a4a" />
        <path d="M44 42 q6 10 12 0 q-6 14 -12 0z" fill="#ff9f1c" />
        <path d="M43 42 h14 l-7 12z" fill="#ffb703" />
        <ellipse cx="34" cy="62" rx="9" ry="17" fill="#25ab9f" transform={wing} />
        <ellipse cx="66" cy="62" rx="9" ry="17" fill="#25ab9f" />
        <path d="M44 88 h5 v6 h-7z M55 88 h5 l2 6 h-7z" fill="#ff9f1c" />
        {mood === 'cheer' && (
          <>
            <circle cx="18" cy="24" r="3" fill="#ffc93c" />
            <circle cx="84" cy="30" r="4" fill="#ff6b35" />
            <circle cx="80" cy="14" r="2.5" fill="#8b5cf6" />
          </>
        )}
      </g>
    </svg>
  );
};
