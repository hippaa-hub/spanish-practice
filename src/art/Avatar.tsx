import type { Look } from '../content/types';

/** A friendly round face for a story character, drawn from a few colours. */
export const Avatar = ({ look, size = 44, talking = false }: { look: Look; size?: number; talking?: boolean }) => (
  <svg viewBox="0 0 100 100" width={size} height={size} role="img" aria-hidden="true">
    <circle cx="50" cy="50" r="48" fill={talking ? '#fff3e6' : '#f4efe8'} />
    {look.long && <path d="M22 52 Q20 86 34 92 H66 Q80 86 78 52z" fill={look.hair} />}
    <path d="M24 100 a26 24 0 0 1 52 0z" fill={look.shirt} />
    <circle cx="50" cy="48" r={look.grownUp ? 21 : 20} fill={look.skin} />
    <path
      d={look.long ? 'M28 48 a22 24 0 0 1 44 0 q-8 -14 -22 -12 q-14 2 -22 12z' : 'M29 44 a21 21 0 0 1 42 0 q-6 -12 -21 -10 q-15 2 -21 10z'}
      fill={look.hair}
    />
    <circle cx="42" cy="49" r="2.6" fill="#3b3a4a" />
    <circle cx="58" cy="49" r="2.6" fill="#3b3a4a" />
    {look.glasses && (
      <g stroke="#3b3a4a" strokeWidth="2" fill="none">
        <circle cx="42" cy="49" r="6" />
        <circle cx="58" cy="49" r="6" />
        <path d="M48 49 h4" />
      </g>
    )}
    {talking ? (
      <ellipse cx="50" cy="59" rx="5" ry="4" fill="#9b3b3b" />
    ) : (
      <path d="M44 57 q6 5 12 0" stroke="#3b3a4a" strokeWidth="2.5" fill="none" strokeLinecap="round" />
    )}
  </svg>
);
