import { useMemo } from 'react';

const COLOURS = ['#ff6b35', '#ffc93c', '#2ec4b6', '#8b5cf6', '#58cc02', '#f6a5c0'];

export const Confetti = ({ pieces = 60 }: { pieces?: number }) => {
  const bits = useMemo(
    () =>
      Array.from({ length: pieces }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 0.8,
        duration: 1.8 + Math.random() * 1.4,
        colour: COLOURS[i % COLOURS.length],
        size: 6 + Math.random() * 8,
        spin: Math.random() * 720 - 360,
      })),
    [pieces],
  );
  return (
    <div className="confetti" aria-hidden="true">
      {bits.map((b) => (
        <span
          key={b.id}
          style={{
            left: `${b.left}%`,
            background: b.colour,
            width: b.size,
            height: b.size * 0.6,
            animationDelay: `${b.delay}s`,
            animationDuration: `${b.duration}s`,
            ['--spin' as string]: `${b.spin}deg`,
          }}
        />
      ))}
    </div>
  );
};
