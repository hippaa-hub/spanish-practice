/** Scenery for the adventure map — drawn in code, one little world per unit. */

const S: Record<string, JSX.Element> = {
  tree: (
    <>
      <rect x="45" y="58" width="10" height="30" rx="3" fill="#8b6b4a" />
      <circle cx="50" cy="44" r="24" fill="#58cc02" />
      <circle cx="36" cy="52" r="14" fill="#4caf00" />
      <circle cx="64" cy="52" r="14" fill="#4caf00" />
      <circle cx="44" cy="38" r="5" fill="#a3e635" />
    </>
  ),
  flower: (
    <>
      <path d="M50 60 v28" stroke="#4caf00" strokeWidth="4" />
      <path d="M50 76 q-12 -4 -14 -14 q12 2 14 14z" fill="#58cc02" />
      {[0, 72, 144, 216, 288].map((a) => (
        <ellipse key={a} cx="50" cy="38" rx="8" ry="14" fill="#f08aab" transform={`rotate(${a} 50 52)`} />
      ))}
      <circle cx="50" cy="52" r="8" fill="#ffc93c" />
    </>
  ),
  abc: (
    <>
      {[
        ['A', 18, 56, '#ff6b35'],
        ['B', 50, 56, '#2ec4b6'],
        ['C', 34, 26, '#8b5cf6'],
      ].map(([l, x, y, c]) => (
        <g key={l as string}>
          <rect x={x as number} y={y as number} width="30" height="30" rx="5" fill={c as string} />
          <text x={(x as number) + 15} y={(y as number) + 23} textAnchor="middle" fontSize="22" fontWeight="900" fill="#fff">{l}</text>
        </g>
      ))}
    </>
  ),
  palm: (
    <>
      <path d="M50 92 q-6 -30 2 -56" stroke="#a0703a" strokeWidth="7" fill="none" strokeLinecap="round" />
      {[-60, -20, 20, 60, 100].map((a) => (
        <path key={a} d="M52 36 q22 -6 34 8 q-18 -2 -34 -8z" fill="#2fa84f" transform={`rotate(${a} 52 36)`} />
      ))}
      <circle cx="48" cy="40" r="4" fill="#7a4a2a" />
      <circle cx="56" cy="41" r="4" fill="#7a4a2a" />
    </>
  ),
  umbrella: (
    <>
      <path d="M50 30 v58" stroke="#8b6b4a" strokeWidth="3" />
      <path d="M14 46 a36 30 0 0 1 72 0z" fill="#ff6b35" />
      <path d="M26 46 a24 30 0 0 1 24 -30 a24 30 0 0 1 24 30" fill="#ffc93c" />
      <path d="M38 46 a12 30 0 0 1 12 -30 a12 30 0 0 1 12 30" fill="#ff6b35" />
      <ellipse cx="50" cy="90" rx="30" ry="5" fill="#f3d9a4" />
    </>
  ),
  shell: (
    <>
      <path d="M50 30 l-28 40 q28 16 56 0z" fill="#f6a5c0" />
      {[-18, -9, 0, 9, 18].map((d) => (
        <path key={d} d={`M50 30 L${50 + d * 1.5} 78`} stroke="#e07a9a" strokeWidth="2.5" />
      ))}
    </>
  ),
  boat: (
    <>
      <path d="M50 18 v52" stroke="#8b6b4a" strokeWidth="3" />
      <path d="M52 20 l26 44 h-26z" fill="#fff" stroke="#4b9fe1" strokeWidth="2" />
      <path d="M48 28 l-20 36 h20z" fill="#ffc93c" />
      <path d="M18 70 h64 l-10 14 h-44z" fill="#e4572e" />
      <path d="M8 90 q10 -6 20 0 t20 0 t20 0 t20 0" stroke="#4b9fe1" strokeWidth="3" fill="none" />
    </>
  ),
  fountain: (
    <>
      <ellipse cx="50" cy="80" rx="36" ry="10" fill="#9fd8f5" stroke="#8a8a9a" strokeWidth="3" />
      <rect x="44" y="44" width="12" height="34" fill="#c9c3b9" />
      <ellipse cx="50" cy="46" rx="18" ry="6" fill="#9fd8f5" stroke="#8a8a9a" strokeWidth="3" />
      <path d="M50 40 q-14 -22 -22 2 M50 40 q14 -22 22 2 M50 40 v-22" stroke="#4b9fe1" strokeWidth="3" fill="none" strokeLinecap="round" />
    </>
  ),
  bench: (
    <>
      <rect x="14" y="44" width="72" height="8" rx="3" fill="#c08a4a" />
      <rect x="14" y="58" width="72" height="8" rx="3" fill="#a3703a" />
      <path d="M22 66 v20 M78 66 v20" stroke="#3b3a4a" strokeWidth="5" />
    </>
  ),
  kite: (
    <>
      <path d="M50 10 l20 26 l-20 30 l-20 -30z" fill="#8b5cf6" />
      <path d="M50 10 v56 M30 36 h40" stroke="#fff" strokeWidth="2" />
      <path d="M50 66 q-8 8 0 14 q8 6 0 14" stroke="#3b3a4a" strokeWidth="2" fill="none" />
      <path d="M46 76 l8 -2 M46 86 l8 -2" stroke="#ff6b35" strokeWidth="4" strokeLinecap="round" />
    </>
  ),
  balloon: (
    <>
      <ellipse cx="40" cy="36" rx="16" ry="20" fill="#e4572e" />
      <ellipse cx="62" cy="42" rx="14" ry="18" fill="#ffc93c" />
      <path d="M40 56 q4 16 8 32 M62 60 q-6 14 -14 28" stroke="#3b3a4a" strokeWidth="1.5" fill="none" />
    </>
  ),
  mountain: (
    <>
      <path d="M4 88 L36 30 L58 64 L70 46 L96 88z" fill="#8b8fb5" />
      <path d="M36 30 l-10 18 l10 -4 l8 6z" fill="#fff" />
      <path d="M70 46 l-6 10 l6 -2 l6 4z" fill="#fff" />
    </>
  ),
  lightning: (
    <>
      <path d="M22 40 a16 14 0 0 1 28 -10 a14 12 0 0 1 26 8 a10 10 0 0 1 -4 20 h-46 a10 10 0 0 1 -4 -18z" fill="#c9cfe0" />
      <path d="M52 56 l-10 18 h10 l-6 18 l18 -26 h-10 l6 -10z" fill="#ffc93c" stroke="#ff9f1c" strokeWidth="1.5" />
    </>
  ),
  cloud: <path d="M18 64 a16 14 0 0 1 22 -20 a18 16 0 0 1 32 2 a14 12 0 0 1 10 24 h-58 a10 10 0 0 1 -6 -6z" fill="#fff" stroke="#dfe8f2" strokeWidth="3" />,
  plane: (
    <>
      <path d="M12 54 l60 -10 a8 6 0 0 1 10 6 a8 6 0 0 1 -8 6 l-60 4z" fill="#fff" stroke="#4b9fe1" strokeWidth="3" />
      <path d="M44 48 l-14 -22 h10 l22 20z M44 58 l-10 18 h10 l16 -18z" fill="#4b9fe1" />
      <path d="M14 54 l-6 -12 h8 l8 10z" fill="#e4572e" />
      <path d="M6 76 h20 M12 84 h22" stroke="#c9cfe0" strokeWidth="3" strokeLinecap="round" />
    </>
  ),
  cafe: (
    <>
      <path d="M18 34 h64 l-6 -14 h-52z" fill="#e4572e" />
      <path d="M18 34 h64" stroke="#fff" strokeWidth="2" strokeDasharray="8 8" />
      <rect x="40" y="56" width="20" height="4" rx="2" fill="#8b6b4a" />
      <path d="M50 60 v24 M40 84 h20" stroke="#8b6b4a" strokeWidth="3" />
      <path d="M44 48 h10 v8 h-10z" fill="#fff" stroke="#8b6b4a" strokeWidth="2" />
      <path d="M47 44 q2 -4 0 -6 M51 44 q2 -4 0 -6" stroke="#c9c3b9" strokeWidth="1.5" fill="none" />
    </>
  ),
  school: (
    <>
      <rect x="16" y="40" width="68" height="46" rx="3" fill="#ffc93c" />
      <path d="M10 42 L50 16 L90 42z" fill="#e4572e" />
      <rect x="42" y="60" width="16" height="26" rx="2" fill="#8b6b4a" />
      <rect x="22" y="50" width="14" height="12" fill="#9fd8f5" />
      <rect x="64" y="50" width="14" height="12" fill="#9fd8f5" />
      <circle cx="50" cy="32" r="6" fill="#fff" />
      <path d="M50 32 v-3 M50 32 h3" stroke="#3b3a4a" strokeWidth="1.5" />
    </>
  ),
  bell: (
    <>
      <path d="M50 18 a20 22 0 0 1 20 22 v18 l8 10 h-56 l8 -10 v-18 a20 22 0 0 1 20 -22z" fill="#ffc93c" stroke="#d9a51f" strokeWidth="3" />
      <circle cx="50" cy="74" r="6" fill="#d9a51f" />
      <path d="M22 30 q-6 8 0 16 M78 30 q6 8 0 16" stroke="#ff6b35" strokeWidth="3" fill="none" strokeLinecap="round" />
    </>
  ),
  fish: (
    <>
      <path d="M20 50 q24 -26 50 0 q-26 26 -50 0z" fill="#ff9f1c" />
      <path d="M70 50 l16 -12 v24z" fill="#ff6b35" />
      <circle cx="32" cy="46" r="3" fill="#3b3a4a" />
      <circle cx="12" cy="30" r="3" fill="none" stroke="#9fd8f5" strokeWidth="2" />
      <circle cx="18" cy="20" r="2" fill="none" stroke="#9fd8f5" strokeWidth="2" />
    </>
  ),
  sea: (
    <>
      <path d="M4 50 q12 -10 24 0 t24 0 t24 0 t24 0" stroke="#4b9fe1" strokeWidth="5" fill="none" strokeLinecap="round" />
      <path d="M4 68 q12 -10 24 0 t24 0 t24 0 t24 0" stroke="#9fd8f5" strokeWidth="5" fill="none" strokeLinecap="round" />
    </>
  ),
};

export const scenery = (name: string): JSX.Element | undefined => S[name];

/** Each unit's little world: a soft ground colour and the things growing beside the road. */
export const WORLDS: Record<string, { ground: string; props: string[] }> = {
  u0: { ground: '#f3ecff', props: ['abc', 'flower', 'tree', 'flower', 'abc'] },
  u1: { ground: '#fff2dc', props: ['palm', 'umbrella', 'shell', 'boat', 'palm'] },
  u2: { ground: '#e9f8f3', props: ['house', 'tree', 'fountain', 'city', 'tree'] },
  u3: { ground: '#eaf4ff', props: ['tree', 'bench', 'kite', 'balloon', 'tree'] },
  u4: { ground: '#f1efff', props: ['mountain', 'lightning', 'cloud', 'mountain', 'lightning'] },
  u5: { ground: '#fff0ec', props: ['plane', 'globe', 'flag:es', 'cloud', 'flag:mx', 'flag:ar'] },
  u6: { ground: '#e9f8f3', props: ['cafe', 'fountain', 'cat', 'dog', 'cafe'] },
  u7: { ground: '#fff6e5', props: ['school', 'board', 'backpack', 'pencil', 'book'] },
  u8: { ground: '#eefbe5', props: ['bell', 'day:L', 'ball', 'music', 'palette'] },
  u9: { ground: '#e6f6fb', props: ['iceberg', 'fish', 'sea', 'fish', 'sea'] },
};
