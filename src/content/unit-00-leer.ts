import type { Unit } from './types';

/**
 * Unit 0 — Aprende a leer.
 * Spanish spelling is regular, so once she knows the sounds she can read any word.
 * Every example word below is a word she meets in units 1 to 9.
 */
export const unit0: Unit = {
  id: 'u0',
  number: 0,
  title: 'Aprende a leer',
  subtitle: 'The sounds of Spanish',
  colour: '#8b5cf6',
  tips: {
    title: 'Spanish always sounds the same',
    lines: [
      'In English, "a" sounds different in cat, car and cake. In Spanish a letter nearly always makes the SAME sound.',
      'So once you learn the sounds, you can read any Spanish word out loud — even one you have never seen.',
      'The five vowels are the key: a (ah), e (eh), i (ee), o (oh), u (oo). Short and clean, never sliding.',
    ],
  },
  items: [
    // --- vowels ---
    { id: 's.a', es: 'a', en: 'sounds like "ah" in father', kind: 'sound', say: 'a', examples: ['adiós', 'arte', 'mapa'] },
    { id: 's.e', es: 'e', en: 'sounds like "eh" in bed', kind: 'sound', say: 'e', examples: ['español', 'examen', 'mesa'] },
    { id: 's.i', es: 'i', en: 'sounds like "ee" in see', kind: 'sound', say: 'i', examples: ['inglés', 'libro', 'ciudad'] },
    { id: 's.o', es: 'o', en: 'sounds like "oh" in got', kind: 'sound', say: 'o', examples: ['hola', 'ordenador', 'goma'] },
    { id: 's.u', es: 'u', en: 'sounds like "oo" in moon', kind: 'sound', say: 'u', examples: ['usted', 'un', 'alumno'] },

    // --- first consonants + syllables ---
    { id: 's.m', es: 'm', en: 'like English m', kind: 'sound', say: 'eme', examples: ['mochila', 'mapa', 'mesa'] },
    { id: 's.l', es: 'l', en: 'like English l', kind: 'sound', say: 'ele', examples: ['lápiz', 'libro', 'hola'] },
    { id: 's.s', es: 's', en: 'like English s', kind: 'sound', say: 'ese', examples: ['soy', 'mesa', 'adiós'] },
    { id: 's.p', es: 'p', en: 'like English p', kind: 'sound', say: 'pe', examples: ['pizarra', 'papel', 'mapa'] },
    { id: 's.t', es: 't', en: 'like English t', kind: 'sound', say: 'te', examples: ['tengo', 'tiza', 'tardes'] },
    { id: 'y.ma', es: 'ma', en: 'm + a', kind: 'syllable' },
    { id: 'y.me', es: 'me', en: 'm + e', kind: 'syllable' },
    { id: 'y.mi', es: 'mi', en: 'm + i', kind: 'syllable' },
    { id: 'y.mo', es: 'mo', en: 'm + o', kind: 'syllable' },
    { id: 'y.mu', es: 'mu', en: 'm + u', kind: 'syllable' },
    { id: 'y.la', es: 'la', en: 'l + a', kind: 'syllable' },
    { id: 'y.sa', es: 'sa', en: 's + a', kind: 'syllable' },
    { id: 'y.pa', es: 'pa', en: 'p + a', kind: 'syllable' },
    { id: 'y.ta', es: 'ta', en: 't + a', kind: 'syllable' },
    { id: 'y.to', es: 'to', en: 't + o', kind: 'syllable' },

    // --- h, j, g ---
    { id: 's.h', es: 'h', en: 'always silent — say nothing!', kind: 'sound', say: 'hache', note: 'h is never pronounced in Spanish: hola sounds like "ola".', examples: ['hola', 'hermanos', 'hasta', 'historia'] },
    { id: 's.j', es: 'j', en: 'a strong h, from the throat', kind: 'sound', say: 'jota', examples: ['jueves', 'ejercicio', 'trabajo'] },
    { id: 's.ge', es: 'ge / gi', en: 'also a strong h', kind: 'sound', say: 'ge, gi', note: 'ge and gi sound like j. But ga, go, gu are a hard g.', examples: ['geografía', 'gimnasio', 'Jorge'] },
    { id: 's.ga', es: 'ga / go / gu', en: 'a hard g, like "go"', kind: 'sound', say: 'ga, go, gu', examples: ['goma', 'gato', 'gusta'] },

    // --- c, qu, z ---
    { id: 's.ca', es: 'ca / co / cu', en: 'a k sound', kind: 'sound', say: 'ca, co, cu', examples: ['casa', 'cuaderno', 'compañero'] },
    { id: 's.que', es: 'que / qui', en: 'also k — the u is silent', kind: 'sound', say: 'que, qui', note: 'qué sounds like "keh". The u is never heard.', examples: ['qué', 'quince', 'química'] },
    { id: 's.ce', es: 'ce / ci', en: 'in Spain, like "th" in think', kind: 'sound', say: 'ce, ci', note: 'In Latin America ce and ci sound like s. Your teacher uses Spain Spanish, so it is "th".', examples: ['ciencias', 'cero', 'gracias'] },
    { id: 's.z', es: 'z', en: 'the same "th" sound', kind: 'sound', say: 'zeta', examples: ['pizarra', 'lápiz', 'diez'] },

    // --- ll, y, ñ, rr ---
    { id: 's.ll', es: 'll', en: 'like y in yes', kind: 'sound', say: 'elle', examples: ['me llamo', 'ella', 'silla'] },
    { id: 's.y', es: 'y', en: 'like y in yes (and "and")', kind: 'sound', say: 'ye', examples: ['yo', 'y', 'mayo'] },
    { id: 's.enye', es: 'ñ', en: 'like ny in canyon', kind: 'sound', say: 'eñe', examples: ['español', 'años', 'mañana'] },
    { id: 's.rr', es: 'rr', en: 'a rolled rrrr', kind: 'sound', say: 'erre', examples: ['pizarra', 'borrador', 'perro'] },
    { id: 's.v', es: 'v', en: 'sounds the same as b', kind: 'sound', say: 've', examples: ['vivo', 'ventana', 'nueve'] },

    // --- stress and accents ---
    { id: 's.acento', es: 'á é í ó ú', en: 'the accent shows the loud part', kind: 'sound', say: 'a con acento', note: 'The accent never changes the sound — it tells you which syllable to say louder.', examples: ['inglés', 'música', 'lápiz'] },
    { id: 's.signos', es: '¿ ¡', en: 'upside-down marks open a question or a shout', kind: 'sound', say: 'signos de interrogación', note: 'Spanish opens a question with ¿ and closes it with ?', examples: ['¿Qué tal?', '¡Hola!', '¿Cómo te llamas?'] },
  ],
  sentences: [
    { id: 'u0.s1', es: 'Me llamo Adele.', en: 'My name is Adele.', items: ['s.ll', 's.m'] },
    { id: 'u0.s2', es: 'Hola, ¿qué tal?', en: 'Hello, how are you?', items: ['s.h', 's.que', 's.signos'] },
    { id: 'u0.s3', es: 'Soy de Georgia.', en: 'I am from Georgia.', items: ['s.s', 's.ge'] },
    { id: 'u0.s4', es: 'Hablo un poco de español.', en: 'I speak a little Spanish.', items: ['s.h', 's.enye'] },
    { id: 'u0.s5', es: 'En mi mochila tengo un lápiz.', en: 'In my backpack I have a pencil.', items: ['s.m', 's.z'] },
  ],
  readWords: [
    { es: 'mesa', en: 'table', syllables: ['me', 'sa'] },
    { es: 'mapa', en: 'map', syllables: ['ma', 'pa'] },
    { es: 'hola', en: 'hello', syllables: ['ho', 'la'] },
    { es: 'goma', en: 'rubber', syllables: ['go', 'ma'] },
    { es: 'casa', en: 'house', syllables: ['ca', 'sa'] },
    { es: 'tiza', en: 'chalk', syllables: ['ti', 'za'] },
    { es: 'libro', en: 'book', syllables: ['li', 'bro'] },
    { es: 'lápiz', en: 'pencil', syllables: ['lá', 'piz'] },
    { es: 'mochila', en: 'backpack', syllables: ['mo', 'chi', 'la'] },
    { es: 'pizarra', en: 'board', syllables: ['pi', 'za', 'rra'] },
    { es: 'español', en: 'Spanish', syllables: ['es', 'pa', 'ñol'] },
    { es: 'cuaderno', en: 'notebook', syllables: ['cua', 'der', 'no'] },
  ],
  nodes: [
    { id: 'u0.n1', title: 'Las vocales', kind: 'sounds', teaches: ['s.a', 's.e', 's.i', 's.o', 's.u'] },
    { id: 'u0.n2', title: 'Sílabas: m, l, s', kind: 'sounds', teaches: ['s.m', 's.l', 's.s', 'y.ma', 'y.me', 'y.la'] },
    { id: 'u0.n3', title: 'Sílabas: p, t', kind: 'sounds', teaches: ['s.p', 's.t', 'y.pa', 'y.ta', 'y.to', 'y.sa'] },
    { id: 'u0.n4', title: 'La h y la j', kind: 'sounds', teaches: ['s.h', 's.j', 's.ge', 's.ga'], sentences: ['u0.s2', 'u0.s4'] },
    { id: 'u0.n5', title: 'C, Q y Z', kind: 'sounds', teaches: ['s.ca', 's.que', 's.ce', 's.z'], sentences: ['u0.s5'] },
    { id: 'u0.n6', title: 'LL, Y, Ñ, RR', kind: 'sounds', teaches: ['s.ll', 's.y', 's.enye', 's.rr', 's.v'], sentences: ['u0.s1', 'u0.s3'] },
    { id: 'u0.n7', title: 'Acentos y signos', kind: 'sounds', teaches: ['s.acento', 's.signos'], sentences: ['u0.s2', 'u0.s1'] },
  ],
};
