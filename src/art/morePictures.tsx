/** More pictures drawn in code: flags, people for the pronouns, days, family, describing words. */

const SKIN = ['#f6cba4', '#d9a07a', '#eebd96', '#c98c64'];
const HALO = '#ffe08a';

type P = { x: number; y?: number; s?: number; shirt: string; hair?: string; skin?: string; long?: boolean; tie?: boolean; glasses?: boolean; grey?: boolean };

/** A little person: head, hair, body. (x, y) is the centre of the head. */
export const Person = ({ x, y = 40, s = 1, shirt, hair = '#5b3a29', skin = SKIN[0], long, tie, glasses, grey }: P) => {
  const h = grey ? '#cfcfcf' : hair;
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      {long && <path d="M-13 0 Q-15 26 -8 30 H8 Q15 26 13 0z" fill={h} />}
      <path d="M-16 50 a16 16 0 0 1 32 0z" fill={shirt} transform="translate(0 -6)" />
      {tie && <path d="M0 30 l-3 4 3 12 3 -12z" fill="#2b4c7e" />}
      <circle r="12" fill={skin} />
      <path d={long ? 'M-13 1 a13 14 0 0 1 26 0 q-5 -9 -13 -7 q-8 1 -13 7z' : 'M-12 -2 a12 12 0 0 1 24 0 q-4 -8 -12 -6 q-8 1 -12 6z'} fill={h} />
      <circle cx="-4" cy="1" r="1.6" fill="#3b3a4a" />
      <circle cx="4" cy="1" r="1.6" fill="#3b3a4a" />
      {glasses && (
        <g stroke="#3b3a4a" strokeWidth="1.3" fill="none">
          <circle cx="-4" cy="1" r="3.4" />
          <circle cx="4" cy="1" r="3.4" />
        </g>
      )}
      <path d="M-3 6 q3 3 6 0" stroke="#3b3a4a" strokeWidth="1.5" fill="none" strokeLinecap="round" />
    </g>
  );
};

const Halo = ({ x, y = 54, r = 22 }: { x: number; y?: number; r?: number }) => <ellipse cx={x} cy={y} rx={r} ry={r + 8} fill={HALO} />;
const Ring = ({ x, w }: { x: number; w: number }) => (
  <rect x={x} y="18" width={w} height="72" rx="30" fill={HALO} opacity="0.85" />
);
const Arrow = ({ from, to, y = 20 }: { from: number; to: number; y?: number }) => (
  <g stroke="#ff6b35" strokeWidth="4" fill="none" strokeLinecap="round" strokeLinejoin="round">
    <path d={`M${from} ${y} Q${(from + to) / 2} ${y - 12} ${to} ${y}`} />
    <path d={`M${to - 6 * Math.sign(to - from)} ${y - 6} L${to} ${y} L${to - 7 * Math.sign(to - from)} ${y + 3}`} />
  </g>
);

const ME = { shirt: '#ff6b35', hair: '#6b4428', long: true };

export const PEOPLE: Record<string, JSX.Element> = {
  'p-yo': (
    <>
      <Halo x={50} />
      <Person x={50} y={44} s={1.4} {...ME} />
      <path d="M50 8 v14 m-6 -6 l6 6 6 -6" stroke="#ff6b35" strokeWidth="4" fill="none" strokeLinecap="round" />
    </>
  ),
  'p-tu': (
    <>
      <Halo x={70} />
      <Person x={28} y={48} {...ME} />
      <Person x={70} y={48} s={1.2} shirt="#2ec4b6" skin={SKIN[1]} />
      <Arrow from={34} to={58} y={22} />
    </>
  ),
  'p-el': (
    <>
      <Halo x={50} />
      <Person x={50} y={44} s={1.4} shirt="#4b9fe1" hair="#1f1a17" skin={SKIN[2]} />
    </>
  ),
  'p-ella': (
    <>
      <Halo x={50} />
      <Person x={50} y={44} s={1.4} shirt="#8b5cf6" hair="#1f1a17" skin={SKIN[3]} long />
    </>
  ),
  'p-usted': (
    <>
      <Halo x={62} />
      <Person x={24} y={50} s={0.9} {...ME} />
      <Person x={62} y={42} s={1.35} shirt="#3b3a4a" hair="#9b9b9b" tie glasses skin={SKIN[2]} />
      <path d="M30 26 q12 -10 18 -2" stroke="#ff6b35" strokeWidth="3" fill="none" strokeLinecap="round" />
    </>
  ),
  'p-nosotros': (
    <>
      <Ring x={6} w={88} />
      <Person x={22} y={44} shirt="#4b9fe1" hair="#1f1a17" skin={SKIN[1]} />
      <Person x={50} y={40} {...ME} />
      <Person x={78} y={44} shirt="#58cc02" hair="#d9b25a" />
    </>
  ),
  'p-nosotras': (
    <>
      <Ring x={6} w={88} />
      <Person x={22} y={44} shirt="#f08aab" hair="#1f1a17" skin={SKIN[3]} long />
      <Person x={50} y={40} {...ME} />
      <Person x={78} y={44} shirt="#ffc93c" hair="#c4552c" long />
    </>
  ),
  'p-vosotros': (
    <>
      <Ring x={42} w={54} />
      <Person x={16} y={48} s={0.85} {...ME} />
      <Person x={58} y={44} shirt="#4b9fe1" hair="#1f1a17" skin={SKIN[1]} />
      <Person x={82} y={44} shirt="#58cc02" hair="#d9b25a" />
      <Arrow from={22} to={44} y={22} />
    </>
  ),
  'p-vosotras': (
    <>
      <Ring x={42} w={54} />
      <Person x={16} y={48} s={0.85} {...ME} />
      <Person x={58} y={44} shirt="#f08aab" hair="#1f1a17" skin={SKIN[3]} long />
      <Person x={82} y={44} shirt="#ffc93c" hair="#c4552c" long />
      <Arrow from={22} to={44} y={22} />
    </>
  ),
  'p-ellos': (
    <>
      <Ring x={20} w={60} />
      <Person x={36} y={44} shirt="#4b9fe1" hair="#1f1a17" skin={SKIN[1]} />
      <Person x={64} y={44} shirt="#58cc02" hair="#d9b25a" />
    </>
  ),
  'p-ellas': (
    <>
      <Ring x={20} w={60} />
      <Person x={36} y={44} shirt="#f08aab" hair="#1f1a17" skin={SKIN[3]} long />
      <Person x={64} y={44} shirt="#ffc93c" hair="#c4552c" long />
    </>
  ),
  'p-ustedes': (
    <>
      <Ring x={20} w={66} />
      <Person x={38} y={42} s={1.05} shirt="#3b3a4a" hair="#9b9b9b" tie />
      <Person x={68} y={42} s={1.05} shirt="#7a3b5b" hair="#5b3a29" long glasses />
    </>
  ),

  // ---- describing people (Unit 9)
  tall: (
    <>
      <path d="M14 92 h72" stroke="#c9c3b9" strokeWidth="3" />
      <Person x={36} y={22} s={1.5} {...ME} />
      <rect x="30" y="60" width="12" height="32" rx="5" fill="#2b4c7e" />
      <Person x={70} y={56} s={0.85} shirt="#2ec4b6" />
      <path d="M84 14 v74 m-5 -68 l5 -6 5 6 m-10 62 l5 6 5 -6" stroke="#ff6b35" strokeWidth="3" fill="none" strokeLinecap="round" />
    </>
  ),
  short: (
    <>
      <path d="M14 92 h72" stroke="#c9c3b9" strokeWidth="3" />
      <Person x={34} y={22} s={1.5} shirt="#2ec4b6" hair="#1f1a17" />
      <rect x="28" y="60" width="12" height="32" rx="5" fill="#2b4c7e" />
      <Person x={70} y={58} s={0.85} {...ME} />
      <ellipse cx="70" cy="58" rx="16" ry="20" fill="none" stroke="#ff6b35" strokeWidth="3" />
    </>
  ),
  longhair: (
    <>
      <path d="M26 46 Q20 96 40 98 H60 Q80 96 74 46z" fill="#6b4428" />
      <circle cx="50" cy="44" r="22" fill={SKIN[0]} />
      <path d="M27 46 a23 25 0 0 1 46 0 q-9 -14 -23 -12 q-14 2 -23 12z" fill="#6b4428" />
      <circle cx="42" cy="46" r="2.5" fill="#3b3a4a" />
      <circle cx="58" cy="46" r="2.5" fill="#3b3a4a" />
      <path d="M44 55 q6 5 12 0" stroke="#3b3a4a" strokeWidth="2.5" fill="none" strokeLinecap="round" />
    </>
  ),
  shorthair: (
    <>
      <circle cx="50" cy="50" r="24" fill={SKIN[2]} />
      <path d="M26 46 a24 24 0 0 1 48 0 q-8 -8 -24 -8 q-16 0 -24 8z" fill="#1f1a17" />
      <circle cx="42" cy="52" r="2.5" fill="#3b3a4a" />
      <circle cx="58" cy="52" r="2.5" fill="#3b3a4a" />
      <path d="M44 61 q6 5 12 0" stroke="#3b3a4a" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <path d="M78 22 l6 -6 m0 14 l8 0 m-14 -14 l0 -8" stroke="#ff6b35" strokeWidth="3" strokeLinecap="round" />
    </>
  ),
  eyes: (
    <>
      {[30, 70].map((x) => (
        <g key={x}>
          <ellipse cx={x} cy="50" rx="17" ry="12" fill="#fff" stroke="#3b3a4a" strokeWidth="3" />
          <circle cx={x} cy="50" r="7" fill="#6b8f3a" />
          <circle cx={x} cy="50" r="3" fill="#1f1a17" />
          <circle cx={x + 2} cy="48" r="1.4" fill="#fff" />
          <path d={`M${x - 16} 36 q16 -9 32 0`} stroke="#3b3a4a" strokeWidth="3" fill="none" strokeLinecap="round" />
        </g>
      ))}
    </>
  ),
  glasses: (
    <>
      <circle cx="30" cy="52" r="15" fill="#e8f6ff" stroke="#3b3a4a" strokeWidth="5" />
      <circle cx="70" cy="52" r="15" fill="#e8f6ff" stroke="#3b3a4a" strokeWidth="5" />
      <path d="M45 50 q5 -5 10 0 M15 50 L6 42 M85 50 L94 42" stroke="#3b3a4a" strokeWidth="5" fill="none" strokeLinecap="round" />
      <path d="M22 46 l6 -4" stroke="#fff" strokeWidth="3" strokeLinecap="round" />
    </>
  ),
  mother: (
    <>
      <Halo x={52} />
      <Person x={52} y={38} s={1.5} shirt="#e4572e" hair="#5b3a29" long />
      <path d="M80 20 c-4 -6 -12 -2 -8 4 l8 8 8 -8 c4 -6 -4 -10 -8 -4z" fill="#e4572e" />
    </>
  ),
  father: (
    <>
      <Halo x={50} />
      <Person x={50} y={38} s={1.5} shirt="#2b4c7e" hair="#3b2a20" />
      <path d="M37 42 q13 10 26 0 q-3 10 -13 10 q-10 0 -13 -10z" fill="#3b2a20" />
    </>
  ),
  grandparents: (
    <>
      <Person x={32} y={42} s={1.2} shirt="#8b5cf6" grey long glasses />
      <Person x={68} y={42} s={1.2} shirt="#2b4c7e" grey />
      <path d="M78 66 v26" stroke="#8b6b4a" strokeWidth="4" strokeLinecap="round" />
      <path d="M78 66 q6 -6 10 0" stroke="#8b6b4a" strokeWidth="4" fill="none" strokeLinecap="round" />
    </>
  ),
  swim: (
    <>
      <rect x="0" y="58" width="100" height="42" fill="#4b9fe1" />
      <path d="M0 60 q10 -6 20 0 t20 0 t20 0 t20 0 t20 0" stroke="#bfe6fb" strokeWidth="4" fill="none" />
      <circle cx="46" cy="52" r="10" fill={SKIN[0]} />
      <path d="M36 50 a10 10 0 0 1 20 0z" fill="#ff6b35" />
      <path d="M58 54 q14 -14 26 -4" stroke={SKIN[0]} strokeWidth="6" fill="none" strokeLinecap="round" />
      <path d="M10 80 q8 -5 16 0 M64 86 q8 -5 16 0" stroke="#bfe6fb" strokeWidth="3" fill="none" />
    </>
  ),
  little: (
    <>
      <rect x="14" y="62" width="14" height="24" rx="4" fill="#ffc93c" />
      <rect x="34" y="42" width="14" height="44" rx="4" fill="#e3ded6" />
      <rect x="54" y="28" width="14" height="58" rx="4" fill="#e3ded6" />
      <rect x="74" y="14" width="14" height="72" rx="4" fill="#e3ded6" />
      <path d="M21 52 v-10 m-5 5 l5 -5 5 5" stroke="#ff6b35" strokeWidth="3" fill="none" strokeLinecap="round" />
    </>
  ),
  because: (
    <>
      <circle cx="26" cy="50" r="18" fill="#2ec4b6" />
      <text x="26" y="62" textAnchor="middle" fontSize="32" fontWeight="900" fill="#fff">?</text>
      <path d="M48 50 h14 m-6 -7 l7 7 -7 7" stroke="#3b3a4a" strokeWidth="4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="80" cy="50" r="16" fill="#ffc93c" />
      <path d="M80 40 v12 m0 6 v1" stroke="#fff" strokeWidth="5" strokeLinecap="round" />
    </>
  ),
};

// ---- flags
const stripesH = (colours: string[]) =>
  colours.map((c, i) => <rect key={i} x="10" y={26 + (i * 48) / colours.length} width="80" height={48 / colours.length + 0.5} fill={c} />);
const stripesV = (colours: string[]) =>
  colours.map((c, i) => <rect key={i} x={10 + (i * 80) / colours.length} y="26" width={80 / colours.length + 0.5} height="48" fill={c} />);

const FLAGS: Record<string, JSX.Element> = {
  ge: (
    <>
      <rect x="10" y="26" width="80" height="48" fill="#fff" />
      <rect x="45" y="26" width="10" height="48" fill="#e4002b" />
      <rect x="10" y="45" width="80" height="10" fill="#e4002b" />
      {/* the four small crosses that make it Georgia's flag, not England's */}
      {[
        [27, 35.5],
        [73, 35.5],
        [27, 64.5],
        [73, 64.5],
      ].map(([x, y]) => (
        <path key={`${x}-${y}`} d={`M${x - 1.6} ${y - 5} h3.2 v3.4 h3.4 v3.2 h-3.4 v3.4 h-3.2 v-3.4 h-3.4 v-3.2 h3.4z`} fill="#e4002b" />
      ))}
    </>
  ),
  es: (
    <>
      <rect x="10" y="26" width="80" height="12" fill="#c60b1e" />
      <rect x="10" y="38" width="80" height="24" fill="#ffc400" />
      <rect x="10" y="62" width="80" height="12" fill="#c60b1e" />
      <rect x="24" y="43" width="8" height="12" rx="2" fill="#c60b1e" opacity="0.7" />
    </>
  ),
  mx: (
    <>
      {stripesV(['#006847', '#fff', '#ce1126'])}
      <circle cx="50" cy="50" r="6" fill="#8b6b4a" />
    </>
  ),
  ar: (
    <>
      {stripesH(['#74acdf', '#fff', '#74acdf'])}
      <circle cx="50" cy="50" r="5" fill="#f6b40e" />
    </>
  ),
  fr: <>{stripesV(['#0055a4', '#fff', '#ef4135'])}</>,
  it: <>{stripesV(['#009246', '#fff', '#ce2b37'])}</>,
  gb: (
    <>
      <rect x="10" y="26" width="80" height="48" fill="#012169" />
      <path d="M10 26 L90 74 M90 26 L10 74" stroke="#fff" strokeWidth="9" />
      <path d="M10 26 L90 74 M90 26 L10 74" stroke="#c8102e" strokeWidth="3" />
      <path d="M50 26 V74 M10 50 H90" stroke="#fff" strokeWidth="14" />
      <path d="M50 26 V74 M10 50 H90" stroke="#c8102e" strokeWidth="8" />
    </>
  ),
  ca: (
    <>
      {stripesV(['#d52b1e', '#fff', '#fff', '#d52b1e'])}
      <path d="M50 36 l3 7 5 -2 -2 8 5 1 -11 8 -11 -8 5 -1 -2 -8 5 2z M50 58 v8" fill="#d52b1e" stroke="#d52b1e" strokeWidth="1.5" />
    </>
  ),
  ng: <>{stripesV(['#008751', '#fff', '#008751'])}</>,
  ma: (
    <>
      <rect x="10" y="26" width="80" height="48" fill="#c1272d" />
      <path d="M50 38 l3.5 10.5 h11 l-9 6.5 3.5 10.5 -9 -6.5 -9 6.5 3.5 -10.5 -9 -6.5 h11z" fill="none" stroke="#006233" strokeWidth="2.5" />
    </>
  ),
  kr: (
    <>
      <rect x="10" y="26" width="80" height="48" fill="#fff" stroke="#e3ded6" strokeWidth="1" />
      <path d="M38 50 a12 12 0 0 1 24 0z" fill="#cd2e3a" />
      <path d="M38 50 a12 12 0 0 0 24 0z" fill="#0047a0" />
      <path d="M18 32 l8 6 M74 62 l8 6 M74 38 l8 -6 M18 68 l8 -6" stroke="#1f1a17" strokeWidth="3" />
    </>
  ),
  ru: <>{stripesH(['#fff', '#0039a6', '#d52b1e'])}</>,
};

const flagShape = (code: string) =>
  FLAGS[code] && (
    <>
      <rect x="8" y="24" width="84" height="52" rx="6" fill="#3b3a4a" opacity="0.15" />
      {FLAGS[code]}
      <rect x="10" y="26" width="80" height="48" rx="4" fill="none" stroke="#3b3a4a" strokeWidth="2" opacity="0.4" />
    </>
  );

/** A language: its flag inside a speech bubble. */
const langShape = (code: string) =>
  FLAGS[code] && (
    <>
      <path d="M8 14 h84 a6 6 0 0 1 6 6 v52 a6 6 0 0 1 -6 6 H40 l-16 14 4 -14 H8 a6 6 0 0 1 -6 -6 V20 a6 6 0 0 1 6 -6z" fill="#fff" stroke="#3b3a4a" strokeWidth="3" />
      <g transform="translate(6 -4) scale(0.88)">{FLAGS[code]}</g>
    </>
  );

/** A day of the week: a calendar page with the letter Spanish calendars use. */
const DAY_LETTERS = 'LMXJVSD';
const dayShape = (letter: string) =>
  DAY_LETTERS.includes(letter) && (
    <>
      <rect x="18" y="18" width="64" height="66" rx="8" fill="#fff" stroke="#3b3a4a" strokeWidth="3" />
      <rect x="18" y="18" width="64" height="18" rx="8" fill={letter === 'S' || letter === 'D' ? '#e4572e' : '#2ec4b6'} />
      <rect x="18" y="28" width="64" height="8" fill={letter === 'S' || letter === 'D' ? '#e4572e' : '#2ec4b6'} />
      <circle cx="34" cy="14" r="4" fill="#3b3a4a" />
      <circle cx="66" cy="14" r="4" fill="#3b3a4a" />
      <text x="50" y="74" textAnchor="middle" fontSize="34" fontWeight="900" fill={letter === 'S' || letter === 'D' ? '#e4572e' : '#3b3a4a'}>{letter}</text>
    </>
  );

/** Pictures named with a parameter: flag:es, lang:fr, day:L. */
export const paramShape = (name: string): JSX.Element | undefined => {
  const [kind, value] = name.split(':');
  if (kind === 'flag') return flagShape(value) || undefined;
  if (kind === 'lang') return langShape(value) || undefined;
  if (kind === 'day') return dayShape(value) || undefined;
  return undefined;
};

/** The Identity Iceberg: a little tip above the water, most of it below. */
PEOPLE.iceberg = (
  <>
    <rect x="0" y="0" width="100" height="42" fill="#dff3ff" />
    <rect x="0" y="42" width="100" height="58" fill="#2b6cb0" />
    <path d="M38 42 L48 20 L56 28 L64 16 L70 42z" fill="#fff" stroke="#9fd8f5" strokeWidth="2" />
    <path d="M26 42 H76 L88 70 L70 96 L32 98 L14 72z" fill="#bfe6fb" opacity="0.92" />
    <path d="M0 42 h100" stroke="#fff" strokeWidth="2" strokeDasharray="5 4" />
  </>
);
