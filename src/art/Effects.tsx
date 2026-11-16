import { useMemo } from 'react';

const SPARKS = ['✨', '🐾', '⭐', '🐾', '💫', '🌟'];

/** A little burst of stars over the footer when an answer is right. */
export const Sparkles = ({ count = 10 }: { count?: number }) => {
  const bits = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        id: i,
        left: 10 + Math.random() * 80,
        dx: `${(Math.random() - 0.5) * 120}px`,
        dy: `${-30 - Math.random() * 90}px`,
        delay: Math.random() * 0.15,
        icon: SPARKS[i % SPARKS.length],
      })),
    [count],
  );
  return (
    <div className="sparkles" aria-hidden="true">
      {bits.map((b) => (
        <span
          key={b.id}
          style={{ left: `${b.left}%`, animationDelay: `${b.delay}s`, ['--dx' as string]: b.dx, ['--dy' as string]: b.dy }}
        >
          {b.icon}
        </span>
      ))}
    </div>
  );
};

const COLOURS = ['#ff6b35', '#ffc93c', '#2ec4b6', '#8b5cf6', '#58cc02', '#f6a5c0', '#4b9fe1'];

/** Fireworks for finishing a lesson, a story or a piece of writing. */
export const Fireworks = ({ bursts = 5 }: { bursts?: number }) => {
  const shots = useMemo(
    () =>
      Array.from({ length: bursts }, (_, b) => ({
        id: b,
        x: 12 + Math.random() * 76,
        y: 10 + Math.random() * 40,
        delay: b * 0.35 + Math.random() * 0.2,
        colour: COLOURS[b % COLOURS.length],
        sparks: Array.from({ length: 14 }, (_, i) => {
          const angle = (i / 14) * Math.PI * 2;
          const r = 55 + Math.random() * 30;
          return { dx: `${Math.cos(angle) * r}px`, dy: `${Math.sin(angle) * r}px` };
        }),
      })),
    [bursts],
  );
  return (
    <div className="fireworks" aria-hidden="true">
      {shots.map((s) => (
        <div key={s.id} className="burst" style={{ left: `${s.x}%`, top: `${s.y}%` }}>
          {s.sparks.map((p, i) => (
            <i
              key={i}
              style={{
                background: i % 3 === 0 ? '#fff6c2' : s.colour,
                animationDelay: `${s.delay}s`,
                ['--dx' as string]: p.dx,
                ['--dy' as string]: p.dy,
              }}
            />
          ))}
        </div>
      ))}
    </div>
  );
};
