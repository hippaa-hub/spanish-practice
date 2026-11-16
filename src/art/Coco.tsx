/** Coco — our own mascot. A small Spanish-speaking parrot, drawn in code. */
export type CocoMood = 'happy' | 'cheer' | 'think' | 'oops' | 'wave' | 'read' | 'sleep' | 'dance';

export const Coco = ({ mood = 'happy', size = 110 }: { mood?: CocoMood; size?: number }) => {
  const wingL =
    mood === 'cheer' || mood === 'dance' ? 'rotate(-48 34 52)' : mood === 'oops' ? 'rotate(10 34 58)' : mood === 'read' ? 'rotate(30 34 58)' : 'rotate(-6 34 58)';
  const wingR =
    mood === 'wave' || mood === 'cheer' || mood === 'dance' ? 'rotate(48 66 52)' : mood === 'read' ? 'rotate(-30 66 58)' : undefined;
  const tilt = mood === 'think' || mood === 'oops' ? 'rotate(-8 50 55)' : undefined;
  const closed = mood === 'sleep';
  const eyeDX = mood === 'think' ? -3 : mood === 'read' ? 0 : 0;
  const eyeDY = mood === 'oops' ? 1 : mood === 'read' ? 2 : 0;
  return (
    <svg viewBox="-6 -10 112 112" width={size} height={size} role="img" aria-label="Coco" className={`coco coco-${mood}`}>
      <g transform={tilt}>
        <ellipse cx="50" cy="60" rx="27" ry="30" fill="#2ec4b6" />
        <ellipse cx="50" cy="66" rx="18" ry="21" fill="#ffe8a3" />
        <circle cx="50" cy="36" r="22" fill="#2ec4b6" />
        <path d="M30 26 q14 -16 32 -6 q-10 -2 -18 4 q-8 2 -14 2z" fill="#ff6b35" />
        {closed ? (
          <>
            <path d="M37 35 q5 4 10 0 M53 35 q5 4 10 0" stroke="#3b3a4a" strokeWidth="2.6" fill="none" strokeLinecap="round" />
          </>
        ) : (
          <>
            <circle cx="42" cy="34" r="6.5" fill="#fff" />
            <circle cx="58" cy="34" r="6.5" fill="#fff" />
            <circle cx={43 + eyeDX} cy={35 + eyeDY} r="3.4" fill="#3b3a4a" />
            <circle cx={59 + eyeDX} cy={35 + eyeDY} r="3.4" fill="#3b3a4a" />
            <circle cx={44 + eyeDX} cy={33.5 + eyeDY} r="1.1" fill="#fff" />
            <circle cx={60 + eyeDX} cy={33.5 + eyeDY} r="1.1" fill="#fff" />
          </>
        )}
        <path d="M43 42 h14 l-7 12z" fill="#ffb703" />
        {(mood === 'cheer' || mood === 'dance' || mood === 'happy' || mood === 'wave') && (
          <>
            <circle cx="35" cy="44" r="3.5" fill="#ff9fb4" opacity="0.7" />
            <circle cx="65" cy="44" r="3.5" fill="#ff9fb4" opacity="0.7" />
          </>
        )}
        <ellipse cx="34" cy="62" rx="9" ry="17" fill="#25ab9f" transform={wingL} />
        <ellipse cx="66" cy="62" rx="9" ry="17" fill="#25ab9f" transform={wingR} />
        <path d="M44 88 h5 v6 h-7z M55 88 h5 l2 6 h-7z" fill="#ff9f1c" />

        {mood === 'read' && (
          <g>
            <path d="M30 66 l20 6 l20 -6 v18 l-20 6 l-20 -6z" fill="#fff" stroke="#e4572e" strokeWidth="2.5" strokeLinejoin="round" />
            <path d="M50 72 v18" stroke="#e4572e" strokeWidth="2" />
          </g>
        )}
        {mood === 'wave' && <path d="M86 26 q6 6 0 12 M92 22 q9 10 0 20" stroke="#ff6b35" strokeWidth="2.5" fill="none" strokeLinecap="round" />}
        {mood === 'think' && (
          <>
            <circle cx="80" cy="18" r="3" fill="#c9c3b9" />
            <circle cx="88" cy="8" r="5" fill="#c9c3b9" />
          </>
        )}
        {mood === 'dance' && (
          <>
            <text x="2" y="20" fontSize="16" fill="#8b5cf6">♪</text>
            <text x="86" y="14" fontSize="14" fill="#ff6b35">♫</text>
          </>
        )}
        {mood === 'cheer' && (
          <>
            <circle cx="10" cy="20" r="3" fill="#ffc93c" />
            <circle cx="92" cy="26" r="4" fill="#ff6b35" />
            <circle cx="86" cy="6" r="2.5" fill="#8b5cf6" />
          </>
        )}
      </g>
      {mood === 'sleep' && (
        <g className="zzz" fill="#8b5cf6" fontWeight="900">
          <text x="74" y="22" fontSize="14">z</text>
          <text x="84" y="10" fontSize="11">z</text>
          <text x="92" y="0" fontSize="8">z</text>
        </g>
      )}
    </svg>
  );
};
