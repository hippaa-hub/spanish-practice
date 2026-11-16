import { normalise, stripAccents } from './answers';

/**
 * The writing coach (¡Me presento! and the Identity Iceberg).
 * It checks the SHAPE of what she wrote — required parts, verb forms — and
 * points at problems. It never writes or rewrites a sentence for her.
 */

export type Rule =
  /** At least `min` sentences in this part. */
  | { kind: 'sentences'; min: number; label: string }
  /** One of these words or phrases appears. */
  | { kind: 'any'; words: string[]; label: string }
  /** At least `min` DIFFERENT words from this list appear (e.g. 3 school things). */
  | { kind: 'count'; words: string[]; min: number; label: string };

export type WritingPart = {
  id: string;
  title: string;
  /** What to write, in English. */
  prompt: string;
  /** Sentence beginnings she can tap to start a sentence — never whole sentences. */
  starters: string[];
  rules: Rule[];
  /** Where it goes on the Identity Iceberg picture. */
  zone?: 'above' | 'below';
};

export type WritingTask = {
  id: string;
  title: string;
  en: string;
  intro: string;
  parts: WritingPart[];
  /** For the whole piece. */
  totalSentences: { min: number; max: number };
};

const flat = (s: string) => ` ${stripAccents(normalise(s)).replace(/[.,;:!?¿¡()"]/g, ' ').replace(/\s+/g, ' ')} `;

export const sentences = (text: string): string[] =>
  text
    .split(/[.!?]+/)
    .map((s) => s.replace(/[¿¡]/g, '').trim())
    .filter((s) => s.split(/\s+/).filter(Boolean).length >= 2);

const has = (text: string, word: string) => flat(text).includes(` ${stripAccents(normalise(word))} `);

export const ruleMet = (text: string, rule: Rule): boolean => {
  switch (rule.kind) {
    case 'sentences':
      return sentences(text).length >= rule.min;
    case 'any':
      return rule.words.some((w) => has(text, w));
    case 'count':
      return new Set(rule.words.filter((w) => has(text, w))).size >= rule.min;
  }
};

export const partDone = (text: string, part: WritingPart): boolean => part.rules.every((r) => ruleMet(text, r));

/** A verb-form problem she should look at — with the reason, not a rewritten sentence. */
export type Hint = { found: string; tryInstead: string; why: string };

/**
 * The mistakes her teacher's tests show beginners make most:
 * the wrong person after "yo", "soy … años" (English "I am 12"), me gusta + plural.
 */
const PATTERNS: { re: RegExp; tryInstead: string; why: string }[] = [
  { re: /\byo (es|eres|son)\b/, tryInstead: 'yo soy', why: 'With yo, SER is soy.' },
  { re: /\byo (tiene|tienes|tienen)\b/, tryInstead: 'yo tengo', why: 'With yo, TENER is tengo.' },
  { re: /\byo (vive|vives|viven)\b/, tryInstead: 'yo vivo', why: 'With yo, VIVIR is vivo.' },
  { re: /\byo (habla|hablas|hablan)\b/, tryInstead: 'yo hablo', why: 'With yo, HABLAR is hablo.' },
  { re: /\bme (llama|llamas|llaman)\b/, tryInstead: 'me llamo', why: 'With me, LLAMARSE is me llamo.' },
  { re: /\bte (llamo|llama)\b/, tryInstead: 'te llamas', why: 'With te, LLAMARSE is te llamas.' },
  { re: /\b(soy|es|eres) (\w+ )?anos\b/, tryInstead: 'tengo … años', why: 'Age uses TENER in Spanish: Tengo doce años.' },
  { re: /\btengo (alta|alto|baja|bajo|timida|timido|simpatica|simpatico)\b/, tryInstead: 'soy …', why: 'What you ARE uses SER: Soy alta.' },
  { re: /\bme gusta (las|los) \w+s\b/, tryInstead: 'me gustan las / los …', why: 'For more than one thing: me gustaN.' },
  { re: /\bmi profesora (es llama|llama)\b/, tryInstead: 'mi profesora se llama', why: 'He / she is called = se llama.' },
  { re: /\b(mi|tu) (companero|companera|profesora|profesor|madre|padre|hermano|hermana) (tengo|soy|vivo|hablo)\b/, tryInstead: 'tiene / es / vive / habla', why: 'Talking about someone else: use the él / ella form.' },
  { re: /\bpor que\b(?! [a-z]+\?)/, tryInstead: 'porque', why: 'Because = porque, one word. (¿Por qué? with a space is the question "why?")' },
];

export const verbHints = (text: string): Hint[] => {
  const t = flat(text);
  const out: Hint[] = [];
  for (const p of PATTERNS) {
    const m = t.match(p.re);
    if (m) out.push({ found: m[0].trim(), tryInstead: p.tryInstead, why: p.why });
  }
  return out;
};

/** Writing tasks, matching her 6 Nov summative and the Identity Iceberg homework. */
export const SUPPLIES = [
  'lapiz', 'boligrafo', 'cuaderno', 'libro', 'goma', 'regla', 'tijeras', 'estuche', 'mochila',
  'diccionario', 'calculadora', 'carpeta', 'sacapuntas', 'ordenador', 'mapa', 'tiza', 'pizarra',
];
export const SUBJECTS = [
  'espanol', 'ingles', 'matematicas', 'ciencias', 'historia', 'geografia', 'educacion fisica',
  'musica', 'arte', 'lengua', 'literatura', 'individuos', 'diseno',
];

export const ME_PRESENTO: WritingTask = {
  id: 'w.mepresento',
  title: '¡Me presento!',
  en: 'Introduce yourself — like your 6 November test',
  intro:
    'Write about yourself, your teacher, a classmate, your school things and your subjects. Build it one part at a time. Coco checks that every part is there and looks at your verbs — the sentences are yours.',
  totalSentences: { min: 6, max: 14 },
  parts: [
    {
      id: 'yo',
      title: 'Yo',
      prompt: 'Introduce yourself: your name, your age and the languages you speak. Use SER at least once.',
      starters: ['¡Hola! Me llamo', 'Tengo', 'Soy de', 'Vivo en', 'Hablo'],
      rules: [
        { kind: 'any', words: ['me llamo', 'soy'], label: 'Your name' },
        { kind: 'any', words: ['anos'], label: 'Your age (tengo … años)' },
        { kind: 'any', words: ['hablo'], label: 'Your languages (hablo …)' },
        { kind: 'any', words: ['soy', 'es', 'somos'], label: 'SER at least once' },
      ],
    },
    {
      id: 'profesora',
      title: 'Mi profesor/a',
      prompt: 'Your teacher: their name and something about them.',
      starters: ['Mi profesora se llama', 'Mi profesor se llama', 'Es', 'Es muy'],
      rules: [
        { kind: 'any', words: ['profesora', 'profesor'], label: 'Says who: mi profesor/a' },
        { kind: 'any', words: ['se llama'], label: 'Their name (se llama …)' },
        { kind: 'sentences', min: 2, label: 'Something more about them (2 sentences)' },
      ],
    },
    {
      id: 'companero',
      title: 'Mi compañero/a',
      prompt: 'A classmate: their name and one or two facts.',
      starters: ['Mi compañera se llama', 'Mi compañero se llama', 'Tiene', 'Es de', 'Habla'],
      rules: [
        { kind: 'any', words: ['companera', 'companero', 'amiga', 'amigo'], label: 'Says who: mi compañero/a' },
        { kind: 'any', words: ['se llama', 'es'], label: 'Their name' },
        { kind: 'any', words: ['tiene', 'vive', 'habla', 'es'], label: 'A fact about them (tiene / vive / habla / es)' },
      ],
    },
    {
      id: 'material',
      title: 'Mis cosas de clase',
      prompt: 'At least three school things you use or carry.',
      starters: ['En mi mochila tengo', 'En clase uso', 'Para la clase de español necesito', 'un', 'una'],
      rules: [{ kind: 'count', words: SUPPLIES, min: 3, label: 'At least 3 school things' }],
    },
    {
      id: 'asignaturas',
      title: 'Mis asignaturas',
      prompt: 'One subject you like and one you do not, each with "porque".',
      starters: ['Me gusta', 'Mi asignatura favorita es', 'No me gusta', 'porque es'],
      rules: [
        { kind: 'any', words: ['me gusta', 'me gustan', 'mi asignatura favorita'], label: 'A subject you like' },
        { kind: 'any', words: ['no me gusta', 'no me gustan'], label: 'A subject you do not like' },
        { kind: 'count', words: SUBJECTS, min: 2, label: 'Two school subjects named' },
        { kind: 'any', words: ['porque'], label: 'Says why: porque …' },
      ],
    },
  ],
};

export const ICEBERG: WritingTask = {
  id: 'w.iceberg',
  title: 'Mi iceberg de identidad',
  en: 'My Identity Iceberg — your Unit 2 homework',
  intro:
    'Is a person more than how they look? Above the water: things people can see. Below the water: things they cannot. Then explain and reflect — in full sentences, in your own words.',
  totalSentences: { min: 11, max: 24 },
  parts: [
    {
      id: 'arriba',
      title: 'Encima del agua',
      prompt: 'At least 3 things people can SEE about you.',
      starters: ['Soy', 'Tengo el pelo', 'Tengo los ojos', 'Llevo gafas', 'Tengo … años'],
      zone: 'above',
      rules: [{ kind: 'sentences', min: 3, label: 'At least 3 sentences' }],
    },
    {
      id: 'abajo',
      title: 'Debajo del agua',
      prompt: 'At least 6 things people CANNOT see: personality, family, languages, what you like.',
      starters: ['Soy una persona', 'Me gusta', 'No me gusta', 'Hablo', 'Mi familia es', 'Soy muy'],
      zone: 'below',
      rules: [{ kind: 'sentences', min: 6, label: 'At least 6 sentences' }],
    },
    {
      id: 'explica',
      title: 'Explica',
      prompt: 'Explain three of them: say why, with porque.',
      starters: ['Soy', 'Me gusta', 'porque'],
      rules: [
        { kind: 'sentences', min: 3, label: 'Explain 3 things' },
        { kind: 'count', words: ['porque'], min: 1, label: 'Uses porque' },
      ],
    },
    {
      id: 'reflexion',
      title: 'Reflexión',
      prompt: 'Is a person more than how they look? Answer in full sentences.',
      starters: ['Una persona es más que', 'Por fuera', 'pero por dentro', 'Creo que'],
      rules: [{ kind: 'sentences', min: 2, label: 'At least 2 full sentences' }],
    },
  ],
};

export const WRITING_TASKS: WritingTask[] = [ME_PRESENTO, ICEBERG];
export const getTask = (id: string) => WRITING_TASKS.find((t) => t.id === id);
