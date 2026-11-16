import type { Unit } from './types';

/** Unit 5 — Nationalities (with gender) and languages. */
export const unit5: Unit = {
  id: 'u5',
  number: 5,
  title: 'Países e idiomas',
  subtitle: 'Where you are from and what you speak',
  colour: '#e4572e',
  tips: {
    title: 'Boy words and girl words',
    lines: [
      'A nationality changes for a girl or a boy: Mateo es argentino, Lucía es argentina.',
      'If it ends in -o, the girl form ends in -a. If it ends in a consonant, add -a: inglés → inglesa, francés → francesa (and the accent disappears).',
      'Some never change: canadiense, marroquí, estadounidense.',
      'A group of only girls is plural -as: Nosotras somos francesas.',
      'Languages are always boy words and lower case: hablo español, inglés y georgiano.',
      'Nationalities and languages are NOT written with a capital letter in Spanish.',
    ],
    table: {
      head: ['Boy', 'Girl', 'Language'],
      rows: [
        ['georgiano', 'georgiana', 'georgiano'],
        ['español', 'española', 'español'],
        ['inglés', 'inglesa', 'inglés'],
        ['francés', 'francesa', 'francés'],
        ['italiano', 'italiana', 'italiano'],
        ['ruso', 'rusa', 'ruso'],
      ],
    },
  },
  items: [
    { id: 'na.georgiano', es: 'georgiano / georgiana', en: 'Georgian', kind: 'word', icon: 'flag:ge', alt: ['georgiano', 'georgiana'] },
    { id: 'na.espanol', es: 'español / española', en: 'Spanish', kind: 'word', icon: 'flag:es', alt: ['español', 'española'] },
    { id: 'na.ingles', es: 'inglés / inglesa', en: 'English', kind: 'word', icon: 'flag:gb', alt: ['inglés', 'inglesa'] },
    { id: 'na.frances', es: 'francés / francesa', en: 'French', kind: 'word', icon: 'flag:fr', alt: ['francés', 'francesa'] },
    { id: 'na.italiano', es: 'italiano / italiana', en: 'Italian', kind: 'word', icon: 'flag:it', alt: ['italiano', 'italiana'] },
    { id: 'na.canadiense', es: 'canadiense', en: 'Canadian (boy or girl)', kind: 'word', icon: 'flag:ca' },
    { id: 'na.mexicano', es: 'mexicano / mexicana', en: 'Mexican', kind: 'word', icon: 'flag:mx', alt: ['mexicano', 'mexicana'] },
    { id: 'na.argentino', es: 'argentino / argentina', en: 'Argentinian', kind: 'word', icon: 'flag:ar', alt: ['argentino', 'argentina'] },
    { id: 'na.nigeriano', es: 'nigeriano / nigeriana', en: 'Nigerian', kind: 'word', icon: 'flag:ng', alt: ['nigeriano', 'nigeriana'] },
    { id: 'na.marroqui', es: 'marroquí', en: 'Moroccan (boy or girl)', kind: 'word', icon: 'flag:ma' },
    { id: 'na.coreano', es: 'coreano / coreana', en: 'Korean', kind: 'word', icon: 'flag:kr', alt: ['coreano', 'coreana'] },
    { id: 'na.ruso', es: 'ruso / rusa', en: 'Russian', kind: 'word', icon: 'flag:ru', alt: ['ruso', 'rusa'] },

    { id: 'l.georgiano', es: 'el georgiano', en: 'Georgian (the language)', kind: 'word', icon: 'lang:ge' },
    { id: 'l.ingles', es: 'el inglés', en: 'English (the language)', kind: 'word', icon: 'lang:gb' },
    { id: 'l.espanol', es: 'el español', en: 'Spanish (the language)', kind: 'word', icon: 'lang:es' },
    { id: 'l.frances', es: 'el francés', en: 'French (the language)', kind: 'word', icon: 'lang:fr' },
    { id: 'l.italiano', es: 'el italiano', en: 'Italian (the language)', kind: 'word', icon: 'lang:it' },
    { id: 'l.ruso', es: 'el ruso', en: 'Russian (the language)', kind: 'word', icon: 'lang:ru' },
    { id: 'w.unpoco', es: 'un poco de', en: 'a little', kind: 'phrase', icon: 'little' },
    { id: 'w.quelenguas', es: '¿qué lenguas hablas?', en: 'what languages do you speak?', kind: 'phrase', icon: 'question' },
  ],
  sentences: [
    { id: 'u5.s1', es: 'Hablo georgiano, inglés y un poco de español.', en: 'I speak Georgian, English and a little Spanish.', items: ['l.georgiano', 'w.unpoco'] },
    { id: 'u5.s2', es: 'Soy georgiana.', en: 'I am Georgian.', items: ['na.georgiano'] },
    { id: 'u5.s3', es: 'Mateo es argentino.', en: 'Mateo is Argentinian.', items: ['na.argentino'] },
    { id: 'u5.s4', es: 'Nosotras somos francesas.', en: 'We are French.', items: ['na.frances'] },
    { id: 'u5.s5', es: 'Jiwon es coreana y habla coreano.', en: 'Jiwon is Korean and speaks Korean.', items: ['na.coreano'] },

    { id: 'u5.g1', es: 'Lucía es ___.', en: 'Lucía is Spanish.', items: ['na.espanol'], gap: { answer: 'española', options: ['español', 'española', 'españolas'] } },
    { id: 'u5.g2', es: 'Carlos es ___.', en: 'Carlos is Mexican.', items: ['na.mexicano'], gap: { answer: 'mexicano', options: ['mexicano', 'mexicana', 'mexicanos'] } },
    { id: 'u5.g3', es: 'Nosotras somos ___.', en: 'We are Italian.', items: ['na.italiano'], gap: { answer: 'italianas', options: ['italiano', 'italiana', 'italianas'] } },
    { id: 'u5.g4', es: 'Ella es ___ y habla inglés.', en: 'She is English and speaks English.', items: ['na.ingles'], gap: { answer: 'inglesa', options: ['inglés', 'inglesa', 'ingleses'] } },
    { id: 'u5.g5', es: 'Yo hablo ___ en casa.', en: 'I speak Georgian at home.', items: ['l.georgiano'], gap: { answer: 'georgiano', options: ['georgiano', 'georgiana', 'el georgiano'] } },
  ],
  questions: [
    { id: 'u5.q1', es: '¿Qué lenguas hablas?', en: 'What languages do you speak?', starts: ['hablo'], example: 'Hablo georgiano, inglés y un poco de español.', items: ['w.quelenguas'] },
    { id: 'u5.q2', es: '¿De dónde eres?', en: 'Where are you from?', starts: ['soy de', 'soy'], example: 'Soy de Georgia. Soy georgiana.', items: ['na.georgiano'] },
  ],
  nodes: [
    { id: 'u5.n1', title: 'Nacionalidades 1', teaches: ['na.georgiano', 'na.espanol', 'na.ingles', 'na.frances'], sentences: ['u5.s2', 'u5.g1', 'u5.g4'] },
    { id: 'u5.n2', title: 'Nacionalidades 2', teaches: ['na.italiano', 'na.mexicano', 'na.argentino', 'na.canadiense'], sentences: ['u5.s3', 'u5.g2', 'u5.g3'] },
    { id: 'u5.n3', title: 'Más países', teaches: ['na.nigeriano', 'na.marroqui', 'na.coreano', 'na.ruso'], sentences: ['u5.s5'] },
    { id: 'u5.n4', title: 'Los idiomas', teaches: ['l.georgiano', 'l.ingles', 'l.espanol', 'l.frances', 'w.unpoco', 'w.quelenguas'], sentences: ['u5.s1', 'u5.g5'], questions: ['u5.q1'] },
    { id: 'u5.story', title: 'Historia: Conócenos', kind: 'story', story: 'st.conocenos', teaches: [] },
    {
      id: 'u5.check', title: 'Unit Check', kind: 'check', teaches: [],
      about: 'Nationalities with the right ending, and the languages you speak. Read the Conócenos posters first.',
      questions: ['u5.q1', 'u5.q2'],
    },
  ],
};
