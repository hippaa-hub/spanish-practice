import { DRAWN_ART } from './artList';
import { paramShape, PEOPLE } from './morePictures';
import { scenery } from './Scenery';
/** Simple pictures drawn in code — no downloaded images (PLAN section 7). */

const C = {
  skin: '#f9c9a0',
  hair: '#5b3a29',
  warm: '#ff6b35',
  sun: '#ffc93c',
  teal: '#2ec4b6',
  blue: '#4b9fe1',
  dark: '#3b3a4a',
  paper: '#fffdf8',
  green: '#58cc02',
  red: '#e4572e',
  purple: '#8b5cf6',
  line: '#ece6dd',
  warmDark: '#d9542a',
  inkSoft: '#7a7790',
};

const Face = ({ smile = true }: { smile?: boolean }) => (
  <>
    <circle cx="42" cy="46" r="3.5" fill={C.dark} />
    <circle cx="58" cy="46" r="3.5" fill={C.dark} />
    {smile ? (
      <path d="M41 57 q9 8 18 0" stroke={C.dark} strokeWidth="3" fill="none" strokeLinecap="round" />
    ) : (
      <path d="M41 60 q9 -6 18 0" stroke={C.dark} strokeWidth="3" fill="none" strokeLinecap="round" />
    )}
  </>
);

const shapes: Record<string, JSX.Element> = {
  wave: (
    <>
      <circle cx="50" cy="52" r="26" fill={C.sun} />
      <Face />
      <path d="M72 30 q10 -8 12 2 q2 10 -8 12" stroke={C.warm} strokeWidth="6" fill="none" strokeLinecap="round" />
    </>
  ),
  sun: (
    <>
      <circle cx="50" cy="50" r="20" fill={C.sun} />
      {[0, 45, 90, 135, 180, 225, 270, 315].map((a) => (
        <rect key={a} x="48" y="12" width="4" height="12" rx="2" fill={C.sun} transform={`rotate(${a} 50 50)`} />
      ))}
    </>
  ),
  sunset: (
    <>
      <path d="M22 62 a28 28 0 0 1 56 0z" fill={C.warm} />
      <rect x="14" y="62" width="72" height="5" rx="2.5" fill={C.dark} />
      <rect x="20" y="74" width="60" height="5" rx="2.5" fill={C.blue} opacity="0.6" />
    </>
  ),
  moon: (
    <>
      <path d="M62 20 a32 32 0 1 0 18 46 a26 26 0 0 1 -18 -46z" fill={C.sun} />
      <circle cx="30" cy="26" r="3" fill={C.sun} />
      <circle cx="22" cy="44" r="2" fill={C.sun} />
    </>
  ),
  byehand: (
    <>
      <rect x="40" y="36" width="22" height="42" rx="11" fill={C.skin} />
      <rect x="30" y="44" width="12" height="30" rx="6" fill={C.skin} />
      <path d="M72 30 q8 6 0 12" stroke={C.warm} strokeWidth="5" fill="none" strokeLinecap="round" />
      <path d="M78 24 q12 10 0 24" stroke={C.warm} strokeWidth="5" fill="none" strokeLinecap="round" opacity="0.6" />
    </>
  ),
  clock: (
    <>
      <circle cx="50" cy="50" r="28" fill={C.paper} stroke={C.dark} strokeWidth="5" />
      <path d="M50 32 v20 l14 8" stroke={C.dark} strokeWidth="5" fill="none" strokeLinecap="round" />
    </>
  ),
  question: (
    <>
      <circle cx="50" cy="50" r="28" fill={C.teal} />
      <text x="50" y="66" textAnchor="middle" fontSize="42" fontWeight="900" fill={C.paper}>?</text>
    </>
  ),
  thumbsup: (
    <>
      <rect x="26" y="48" width="14" height="30" rx="4" fill={C.teal} />
      <path d="M44 48 l10 -22 a6 6 0 0 1 10 5 l-4 17 h14 a6 6 0 0 1 6 7 l-4 18 a7 7 0 0 1 -7 5 H44z" fill={C.green} />
    </>
  ),
  pointing: (
    <>
      <circle cx="50" cy="50" r="28" fill={C.purple} />
      <path d="M38 52 h18 m-6 -7 l7 7 l-7 7" stroke={C.paper} strokeWidth="5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </>
  ),
  heart: <path d="M50 78 C20 58 18 36 32 28 C42 22 50 30 50 36 C50 30 58 22 68 28 C82 36 80 58 50 78z" fill={C.red} />,
  handshake: (
    <>
      <path d="M12 54 l18 -10 l20 10 l-18 12z" fill={C.skin} stroke={C.hair} strokeWidth="2" />
      <path d="M88 54 l-18 -10 l-20 10 l18 12z" fill={C.skin} stroke={C.hair} strokeWidth="2" />
      <rect x="38" y="46" width="24" height="18" rx="8" fill="#f2b388" stroke={C.hair} strokeWidth="2" />
      <path d="M24 42 l10 -8 M76 42 l-10 -8" stroke={C.warm} strokeWidth="5" strokeLinecap="round" />
    </>
  ),
  tick: (
    <>
      <circle cx="50" cy="50" r="28" fill={C.green} />
      <path d="M36 51 l10 11 l19 -22" stroke="#fff" strokeWidth="7" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </>
  ),
  cross: (
    <>
      <circle cx="50" cy="50" r="28" fill={C.red} />
      <path d="M39 39 l22 22 M61 39 l-22 22" stroke="#fff" strokeWidth="7" strokeLinecap="round" />
    </>
  ),
  speech: (
    <>
      <rect x="14" y="24" width="72" height="44" rx="14" fill={C.blue} />
      <path d="M34 66 l-4 16 l18 -14z" fill={C.blue} />
      <circle cx="38" cy="46" r="4" fill="#fff" />
      <circle cx="50" cy="46" r="4" fill="#fff" />
      <circle cx="62" cy="46" r="4" fill="#fff" />
    </>
  ),
  repeat: (
    <>
      <path d="M26 50 a24 24 0 0 1 24 -24 a24 24 0 0 1 24 24 a24 24 0 0 1 -24 24" stroke={C.purple} strokeWidth="7" fill="none" strokeLinecap="round" />
      <path d="M50 86 l-12 -10 l12 -10z" fill={C.purple} />
    </>
  ),
  confused: (
    <>
      <circle cx="50" cy="52" r="26" fill={C.sun} />
      <Face smile={false} />
      <text x="78" y="30" fontSize="26" fontWeight="900" fill={C.warm}>?</text>
    </>
  ),
  door: (
    <>
      <rect x="28" y="16" width="44" height="68" rx="6" fill={C.hair} />
      <rect x="34" y="22" width="32" height="56" rx="4" fill={C.warm} opacity="0.4" />
      <circle cx="62" cy="52" r="4" fill={C.sun} />
    </>
  ),
  eraser: (
    <>
      <rect x="20" y="42" width="60" height="26" rx="6" fill="#f6a5c0" transform="rotate(-12 50 55)" />
      <rect x="20" y="42" width="24" height="26" rx="6" fill={C.blue} transform="rotate(-12 50 55)" />
    </>
  ),
  namebadge: (
    <>
      <rect x="18" y="28" width="64" height="44" rx="8" fill={C.paper} stroke={C.warm} strokeWidth="5" />
      <rect x="26" y="38" width="48" height="6" rx="3" fill={C.warm} />
      <rect x="26" y="52" width="32" height="5" rx="2.5" fill={C.dark} opacity="0.4" />
    </>
  ),
  girl: (
    <>
      <circle cx="50" cy="44" r="20" fill={C.skin} />
      <path d="M30 42 a20 20 0 0 1 40 0 q-8 -10 -20 -6 q-12 4 -20 6z" fill={C.hair} />
      <circle cx="43" cy="44" r="2.5" fill={C.dark} />
      <circle cx="57" cy="44" r="2.5" fill={C.dark} />
      <path d="M44 52 q6 5 12 0" stroke={C.dark} strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <path d="M26 86 a24 22 0 0 1 48 0z" fill={C.teal} />
    </>
  ),
  student: (
    <>
      <circle cx="50" cy="46" r="18" fill={C.skin} />
      <path d="M24 40 l26 -14 l26 14 l-26 10z" fill={C.dark} />
      <path d="M28 86 a22 20 0 0 1 44 0z" fill={C.warm} />
    </>
  ),
  cake: (
    <>
      <rect x="22" y="48" width="56" height="30" rx="6" fill={C.warm} />
      <rect x="22" y="48" width="56" height="10" rx="5" fill="#f6a5c0" />
      <rect x="47" y="30" width="6" height="16" rx="3" fill={C.paper} />
      <circle cx="50" cy="27" r="5" fill={C.sun} />
    </>
  ),
  hand: (
    <>
      <path d="M34 78 V46 a5 5 0 0 1 10 0 V30 a5 5 0 0 1 10 0 v16 a5 5 0 0 1 10 0 v4 a5 5 0 0 1 9 3 l-3 18 a9 9 0 0 1 -9 7 H44z" fill={C.skin} stroke={C.hair} strokeWidth="2" />
    </>
  ),
  globe: (
    <>
      <circle cx="50" cy="50" r="28" fill={C.blue} />
      <path d="M50 22 a28 40 0 0 0 0 56 a28 40 0 0 0 0 -56z" fill="none" stroke="#fff" strokeWidth="3" />
      <path d="M22 50 h56 M27 36 h46 M27 64 h46" stroke="#fff" strokeWidth="3" />
    </>
  ),
  flagge: (
    <>
      <rect x="20" y="26" width="60" height="44" rx="4" fill={C.paper} stroke={C.dark} strokeWidth="2" />
      <rect x="44" y="26" width="12" height="44" fill={C.red} />
      <rect x="20" y="42" width="60" height="12" fill={C.red} />
      <rect x="24" y="76" width="4" height="12" rx="2" fill={C.dark} />
    </>
  ),
  house: (
    <>
      <path d="M50 18 L84 48 H16z" fill={C.red} />
      <rect x="26" y="46" width="48" height="36" rx="4" fill={C.paper} stroke={C.dark} strokeWidth="3" />
      <rect x="44" y="60" width="14" height="22" rx="2" fill={C.hair} />
    </>
  ),
  city: (
    <>
      <rect x="18" y="46" width="20" height="36" rx="3" fill={C.teal} />
      <rect x="42" y="30" width="18" height="52" rx="3" fill={C.warm} />
      <rect x="64" y="52" width="18" height="30" rx="3" fill={C.purple} />
      <rect x="46" y="38" width="4" height="4" fill="#fff" />
      <rect x="54" y="38" width="4" height="4" fill="#fff" />
      <rect x="46" y="50" width="4" height="4" fill="#fff" />
    </>
  ),
  backpack: (
    <>
      <rect x="26" y="34" width="48" height="50" rx="12" fill={C.warm} />
      <path d="M38 36 a12 12 0 0 1 24 0" stroke={C.warm} strokeWidth="6" fill="none" />
      <rect x="34" y="56" width="32" height="18" rx="6" fill={C.paper} />
    </>
  ),
  pencil: (
    <>
      <rect x="44" y="16" width="14" height="48" fill={C.sun} transform="rotate(12 50 50)" />
      <path d="M46 68 l10 2 l-2 12z" fill={C.dark} transform="rotate(12 50 50)" />
      <rect x="44" y="12" width="14" height="8" fill="#f6a5c0" transform="rotate(12 50 50)" />
    </>
  ),

  // ---- Unit 6: people and contact ----
  cat: (
    <>
      <ellipse cx="50" cy="62" rx="22" ry="20" fill="#9b8579" />
      <path d="M32 48 l-3 -16 l14 8z M68 48 l3 -16 l-14 8z" fill="#9b8579" />
      <circle cx="43" cy="58" r="3" fill={C.dark} />
      <circle cx="57" cy="58" r="3" fill={C.dark} />
      <path d="M46 66 q4 4 8 0" stroke={C.dark} strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <path d="M72 70 q14 4 10 16" stroke="#9b8579" strokeWidth="6" fill="none" strokeLinecap="round" />
    </>
  ),
  dog: (
    <>
      <ellipse cx="50" cy="62" rx="22" ry="20" fill="#c08a4a" />
      <ellipse cx="29" cy="54" rx="7" ry="13" fill="#a3703a" />
      <ellipse cx="71" cy="54" rx="7" ry="13" fill="#a3703a" />
      <circle cx="43" cy="58" r="3" fill={C.dark} />
      <circle cx="57" cy="58" r="3" fill={C.dark} />
      <ellipse cx="50" cy="68" rx="6" ry="4" fill={C.dark} />
    </>
  ),
  family: (
    <>
      <circle cx="33" cy="38" r="11" fill={C.skin} />
      <path d="M18 76 a15 14 0 0 1 30 0z" fill={C.teal} />
      <circle cx="67" cy="38" r="11" fill={C.skin} />
      <path d="M52 76 a15 14 0 0 1 30 0z" fill={C.warm} />
      <circle cx="50" cy="56" r="8" fill={C.skin} />
      <path d="M39 80 a11 10 0 0 1 22 0z" fill={C.purple} />
    </>
  ),
  boy: (
    <>
      <circle cx="50" cy="44" r="20" fill={C.skin} />
      <path d="M29 40 a21 21 0 0 1 42 0 q-6 -12 -21 -10 q-15 2 -21 10z" fill={C.dark} />
      <circle cx="43" cy="44" r="2.5" fill={C.dark} />
      <circle cx="57" cy="44" r="2.5" fill={C.dark} />
      <path d="M44 52 q6 5 12 0" stroke={C.dark} strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <path d="M26 86 a24 22 0 0 1 48 0z" fill={C.blue} />
    </>
  ),
  food: (
    <>
      <circle cx="50" cy="56" r="26" fill={C.paper} stroke={C.line} strokeWidth="3" />
      <circle cx="50" cy="56" r="17" fill="#ffd9a0" />
      <circle cx="44" cy="52" r="3.5" fill={C.red} />
      <circle cx="56" cy="60" r="3.5" fill={C.red} />
      <circle cx="56" cy="50" r="3" fill={C.green} />
    </>
  ),
  palette: (
    <>
      <path d="M50 20 a30 28 0 1 0 6 56 a7 7 0 0 1 2 -12 h10 a14 14 0 0 0 12 -20 A30 30 0 0 0 50 20z" fill="#fff0d6" stroke={C.dark} strokeWidth="3" />
      <circle cx="38" cy="38" r="5" fill={C.red} />
      <circle cx="31" cy="54" r="5" fill={C.blue} />
      <circle cx="42" cy="68" r="5" fill={C.sun} />
      <circle cx="58" cy="34" r="5" fill={C.green} />
    </>
  ),
  mail: (
    <>
      <rect x="16" y="30" width="68" height="44" rx="7" fill={C.paper} stroke={C.teal} strokeWidth="4" />
      <path d="M18 34 L50 56 L82 34" stroke={C.teal} strokeWidth="4" fill="none" />
    </>
  ),
  phone: (
    <>
      <rect x="32" y="14" width="36" height="72" rx="9" fill={C.dark} />
      <rect x="37" y="24" width="26" height="48" rx="3" fill={C.paper} />
      <circle cx="50" cy="79" r="3.5" fill={C.paper} />
    </>
  ),

  // ---- Unit 7: the classroom ----
  board: (
    <>
      <rect x="12" y="22" width="76" height="48" rx="5" fill="#2f6f4e" stroke={C.hair} strokeWidth="5" />
      <path d="M24 38 h30 M24 50 h40" stroke="#fff" strokeWidth="3" strokeLinecap="round" opacity="0.8" />
      <rect x="34" y="78" width="32" height="5" rx="2" fill={C.hair} />
    </>
  ),
  chalk: (
    <>
      <rect x="26" y="44" width="48" height="14" rx="7" fill={C.paper} stroke={C.dark} strokeWidth="3" transform="rotate(-18 50 50)" />
      <circle cx="74" cy="38" r="3" fill="#fff" />
    </>
  ),
  boardrubber: (
    <>
      <rect x="20" y="40" width="60" height="24" rx="5" fill={C.hair} />
      <rect x="20" y="52" width="60" height="12" rx="4" fill="#d8cfc3" />
    </>
  ),
  map: (
    <>
      <path d="M16 26 l22 -8 l24 8 l22 -8 v56 l-22 8 l-24 -8 l-22 8z" fill="#cfe8c9" stroke={C.dark} strokeWidth="3" strokeLinejoin="round" />
      <path d="M38 18 v56 M62 26 v56" stroke={C.dark} strokeWidth="2.5" opacity="0.5" />
      <circle cx="52" cy="46" r="5" fill={C.red} />
    </>
  ),
  book: (
    <>
      <path d="M18 24 h26 a6 6 0 0 1 6 6 v48 a6 6 0 0 0 -6 -6 H18z" fill={C.warm} />
      <path d="M82 24 H56 a6 6 0 0 0 -6 6 v48 a6 6 0 0 1 6 -6 h26z" fill="#ff8c5f" />
      <rect x="47" y="24" width="6" height="54" fill={C.warmDark} />
    </>
  ),
  pen: (
    <>
      <rect x="44" y="16" width="13" height="46" rx="2" fill={C.blue} transform="rotate(14 50 50)" />
      <path d="M45 62 l12 3 l-4 14z" fill={C.dark} transform="rotate(14 50 50)" />
      <rect x="44" y="12" width="13" height="7" fill={C.dark} transform="rotate(14 50 50)" />
    </>
  ),
  sharpener: (
    <>
      <rect x="24" y="38" width="52" height="26" rx="6" fill={C.purple} />
      <path d="M44 38 l12 0 l-6 26z" fill="#d8cfc3" />
      <circle cx="68" cy="51" r="4" fill="#fff" opacity="0.7" />
    </>
  ),
  notebook: (
    <>
      <rect x="24" y="16" width="52" height="68" rx="6" fill={C.paper} stroke={C.dark} strokeWidth="3" />
      <rect x="24" y="16" width="12" height="68" rx="6" fill={C.teal} />
      <path d="M44 34 h24 M44 48 h24 M44 62 h16" stroke={C.inkSoft} strokeWidth="3" strokeLinecap="round" />
    </>
  ),
  dictionary: (
    <>
      <rect x="20" y="18" width="60" height="64" rx="6" fill={C.red} />
      <rect x="28" y="24" width="48" height="52" rx="3" fill={C.paper} />
      <text x="52" y="58" textAnchor="middle" fontSize="30" fontWeight="900" fill={C.red}>A</text>
    </>
  ),
  ruler: (
    <>
      <rect x="14" y="40" width="72" height="22" rx="4" fill={C.sun} stroke={C.dark} strokeWidth="3" />
      <path d="M26 40 v9 M38 40 v13 M50 40 v9 M62 40 v13 M74 40 v9" stroke={C.dark} strokeWidth="3" />
    </>
  ),
  scissors: (
    <>
      <path d="M30 20 L62 60 M70 20 L38 60" stroke={C.dark} strokeWidth="6" strokeLinecap="round" />
      <circle cx="34" cy="72" r="10" fill="none" stroke={C.red} strokeWidth="6" />
      <circle cx="66" cy="72" r="10" fill="none" stroke={C.red} strokeWidth="6" />
    </>
  ),
  pencilcase: (
    <>
      <rect x="14" y="40" width="72" height="30" rx="14" fill={C.purple} />
      <path d="M14 52 h72" stroke="#fff" strokeWidth="4" opacity="0.6" />
      <circle cx="74" cy="52" r="5" fill={C.sun} />
    </>
  ),
  laptop: (
    <>
      <rect x="22" y="24" width="56" height="38" rx="4" fill={C.dark} />
      <rect x="27" y="29" width="46" height="28" rx="2" fill="#9fd8f5" />
      <path d="M14 70 h72 l-6 -8 H20z" fill="#b9b3a8" />
    </>
  ),
  calculator: (
    <>
      <rect x="26" y="14" width="48" height="72" rx="7" fill={C.teal} />
      <rect x="32" y="22" width="36" height="16" rx="3" fill={C.paper} />
      {[0, 1, 2].map((r) => [0, 1, 2].map((c) => (
        <circle key={`${r}-${c}`} cx={38 + c * 12} cy={50 + r * 12} r="4" fill="#fff" opacity="0.85" />
      )))}
    </>
  ),
  folder: (
    <>
      <path d="M14 30 h26 l7 9 h39 a5 5 0 0 1 5 5 v32 a5 5 0 0 1 -5 5 H19 a5 5 0 0 1 -5 -5z" fill={C.sun} />
      <path d="M14 44 h72 v32 a5 5 0 0 1 -5 5 H19 a5 5 0 0 1 -5 -5z" fill="#ffd96b" />
    </>
  ),
  classmate: (
    <>
      <circle cx="36" cy="40" r="13" fill={C.skin} />
      <path d="M19 80 a17 16 0 0 1 34 0z" fill={C.warm} />
      <circle cx="66" cy="44" r="12" fill={C.skin} />
      <path d="M51 80 a15 14 0 0 1 30 0z" fill={C.teal} />
    </>
  ),
  write: (
    <>
      <path d="M18 76 h64" stroke={C.dark} strokeWidth="5" strokeLinecap="round" />
      <rect x="52" y="16" width="13" height="48" rx="2" fill={C.sun} transform="rotate(26 58 40)" />
      <path d="M50 60 l12 4 l-6 12z" fill={C.dark} transform="rotate(26 58 40)" />
    </>
  ),
  ear: (
    <>
      <path d="M38 80 q-4 -14 -10 -22 a22 22 0 1 1 40 -13 q0 12 -12 16 q-8 3 -8 11 a7 7 0 0 1 -10 8z" fill={C.skin} stroke={C.hair} strokeWidth="3" />
    </>
  ),
  study: (
    <>
      <circle cx="50" cy="34" r="14" fill={C.skin} />
      <path d="M28 30 l22 -12 l22 12 l-22 9z" fill={C.dark} />
      <rect x="24" y="56" width="52" height="8" rx="3" fill={C.warm} />
      <path d="M28 64 h44 v10 a3 3 0 0 1 -3 3 H31 a3 3 0 0 1 -3 -3z" fill="#ff8c5f" />
    </>
  ),
  brain: (
    <>
      <path d="M38 24 a14 14 0 0 0 -12 20 a12 12 0 0 0 4 20 a14 14 0 0 0 20 8 V26 a12 12 0 0 0 -12 -2z" fill="#f6a5c0" />
      <path d="M62 24 a14 14 0 0 1 12 20 a12 12 0 0 1 -4 20 a14 14 0 0 1 -20 8 V26 a12 12 0 0 1 12 -2z" fill="#f08aab" />
    </>
  ),
  lightbulb: (
    <>
      <path d="M50 16 a22 22 0 0 1 14 39 v7 H36 v-7 A22 22 0 0 1 50 16z" fill={C.sun} />
      <rect x="38" y="66" width="24" height="7" rx="3" fill={C.dark} />
      <rect x="41" y="76" width="18" height="6" rx="3" fill={C.dark} />
    </>
  ),

  // ---- Unit 8: subjects ----
  maths: (
    <>
      <circle cx="50" cy="50" r="30" fill="#e8f0ff" />
      <path d="M26 38 h16 M34 30 v16" stroke={C.blue} strokeWidth="5" strokeLinecap="round" />
      <path d="M58 34 h16" stroke={C.blue} strokeWidth="5" strokeLinecap="round" />
      <path d="M26 64 h16" stroke={C.red} strokeWidth="5" strokeLinecap="round" />
      <path d="M58 58 l14 14 M72 58 l-14 14" stroke={C.red} strokeWidth="5" strokeLinecap="round" />
    </>
  ),
  science: (
    <>
      <path d="M42 16 h16 v24 l16 32 a7 7 0 0 1 -6 11 H32 a7 7 0 0 1 -6 -11 l16 -32z" fill="#cdeef5" stroke={C.dark} strokeWidth="3" strokeLinejoin="round" />
      <path d="M33 58 h34 l7 14 a7 7 0 0 1 -6 11 H32 a7 7 0 0 1 -6 -11z" fill={C.green} opacity="0.8" />
      <circle cx="44" cy="70" r="3" fill="#fff" />
      <circle cx="58" cy="76" r="2.5" fill="#fff" />
    </>
  ),
  history: (
    <>
      <path d="M22 24 h50 a8 8 0 0 1 8 8 v44 a8 8 0 0 1 -8 8 H22z" fill="#f3e3c3" stroke={C.hair} strokeWidth="3" />
      <path d="M34 40 h30 M34 52 h30 M34 64 h18" stroke={C.hair} strokeWidth="3" strokeLinecap="round" />
      <circle cx="22" cy="50" r="8" fill={C.hair} />
    </>
  ),
  ball: (
    <>
      <circle cx="50" cy="50" r="28" fill="#fff" stroke={C.dark} strokeWidth="3" />
      <path d="M50 32 l13 9 l-5 15 h-16 l-5 -15z" fill={C.dark} />
      <path d="M50 22 v10 M28 44 l12 -3 M72 44 l-12 -3 M38 74 l5 -18 M62 74 l-5 -18" stroke={C.dark} strokeWidth="3" />
    </>
  ),
  music: (
    <>
      <path d="M44 72 V26 l26 -6 v40" stroke={C.purple} strokeWidth="5" fill="none" strokeLinejoin="round" />
      <circle cx="36" cy="72" r="9" fill={C.purple} />
      <circle cx="62" cy="64" r="9" fill={C.purple} />
    </>
  ),
};

const numberShape = (n: string) => (
  <>
    <circle cx="50" cy="50" r="30" fill="#fff3e6" stroke={C.warm} strokeWidth="4" />
    <text x="50" y="50" textAnchor="middle" dominantBaseline="central" fontSize={n.length > 1 ? 32 : 40} fontWeight="900" fill={C.warm}>
      {n}
    </text>
  </>
);

const resolve = (name: string): JSX.Element | undefined => {
  if (name.startsWith('num:')) return numberShape(name.slice(4));
  if (name.includes(':')) return paramShape(name);
  return shapes[name] ?? PEOPLE[name] ?? scenery(name);
};

/** Is there a real drawing for this name (not the "?" fallback)? */
export const hasPicture = (name: string): boolean => Boolean(resolve(name));

/**
 * Pictures drawn in Canva (cartoon sticker style, same as Coco), in public/art/.
 * Where a Canva picture exists it is used; otherwise the code drawing below is.
 * Flags, numbers and day letters always use the code drawings, which are exact.
 */

export const Picture = ({ name, size = 72 }: { name?: string; size?: number }) => {
  if (name && DRAWN_ART.has(name)) {
    return (
      <img
        src={`${import.meta.env.BASE_URL}art/${name}.webp`}
        width={size}
        height={size}
        alt=""
        aria-hidden="true"
        draggable={false}
        className="canva-art"
      />
    );
  }
  let body: JSX.Element | undefined = name ? resolve(name) : undefined;
  if (!body) body = shapes.question;
  return (
    <svg viewBox="0 0 100 100" width={size} height={size} role="img" aria-hidden="true">
      {body}
    </svg>
  );
};
