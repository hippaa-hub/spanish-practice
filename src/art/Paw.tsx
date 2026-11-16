/** A cat's paw print, for the cat look: the road, buttons, stamps and confetti. */
export const PAW_PATH =
  'M20 37c-6.5 0-11-3.6-11-8.2 0-4.6 4.9-9.8 11-9.8s11 5.2 11 9.8c0 4.6-4.5 8.2-11 8.2z' +
  'M8.5 21.5c-2.6 0-4.5-2.6-4.5-5.6s1.9-5.4 4.5-5.4 4.5 2.5 4.5 5.4-1.9 5.6-4.5 5.6z' +
  'M15.5 13.5c-2.6 0-4.5-2.7-4.5-6s1.9-6 4.5-6 4.5 2.7 4.5 6-1.9 6-4.5 6z' +
  'M24.5 13.5c-2.6 0-4.5-2.7-4.5-6s1.9-6 4.5-6 4.5 2.7 4.5 6-1.9 6-4.5 6z' +
  'M31.5 21.5c-2.6 0-4.5-2.6-4.5-5.6s1.9-5.4 4.5-5.4 4.5 2.5 4.5 5.4-1.9 5.6-4.5 5.6z';

export const Paw = ({ size = 20, colour = '#ff9fb4', rotate = 0, className }: { size?: number; colour?: string; rotate?: number; className?: string }) => (
  <svg viewBox="0 0 40 40" width={size} height={size} aria-hidden="true" className={className} style={rotate ? { transform: `rotate(${rotate}deg)` } : undefined}>
    <path d={PAW_PATH} fill={colour} />
  </svg>
);

/** The same paw as an SVG string, for drawing inside other SVGs (the road). */
export const pawGroup = (x: number, y: number, size: number, rotate: number, colour: string) =>
  `<g transform="translate(${x - size / 2} ${y - size / 2}) rotate(${rotate} ${size / 2} ${size / 2}) scale(${size / 40})"><path d="${PAW_PATH}" fill="${colour}"/></g>`;
