import type { Unit } from './types';

/** Unit 3 — Personal pronouns, and when to say tú and when to say usted. */
export const unit3: Unit = {
  id: 'u3',
  number: 3,
  title: 'Pronombres y tú/usted',
  subtitle: 'Who is doing it, and how polite to be',
  colour: '#4b9fe1',
  tips: {
    title: 'The six people',
    lines: [
      'Spanish has a different verb ending for each person, so the pronoun is often left out: "Soy Adele" already means "I am Adele".',
      'tú is informal: friends, family, children, someone your own age.',
      'usted is formal: a stranger, an older person, a doctor, a police officer, a shop assistant. Your teacher is usted.',
      'vosotros/vosotras is "you all" in Spain (what your teacher uses). ustedes is "you all" in Latin America, and the formal "you all" in Spain.',
      'nosotras, vosotras and ellas are for a group of only girls.',
    ],
    table: {
      head: ['One person', 'More than one'],
      rows: [
        ['yo — I', 'nosotros / nosotras — we'],
        ['tú — you (friend)', 'vosotros / vosotras — you all (Spain)'],
        ['usted — you (polite)', 'ustedes — you all (polite / Latin America)'],
        ['él / ella — he / she', 'ellos / ellas — they'],
      ],
    },
  },
  items: [
    { id: 'p.yo', es: 'yo', en: 'I', kind: 'word', icon: 'p-yo' },
    { id: 'p.tu', es: 'tú', en: 'you (a friend)', kind: 'word', icon: 'p-tu' },
    { id: 'p.el', es: 'él', en: 'he', kind: 'word', icon: 'p-el' },
    { id: 'p.ella', es: 'ella', en: 'she', kind: 'word', icon: 'p-ella' },
    { id: 'p.usted', es: 'usted', en: 'you (polite)', kind: 'word', icon: 'p-usted', note: 'usted takes the same verb form as él and ella: usted es, usted vive.' },
    { id: 'p.nosotros', es: 'nosotros', en: 'we', kind: 'word', icon: 'p-nosotros', alt: ['nosotras'] },
    { id: 'p.nosotras', es: 'nosotras', en: 'we (all girls)', kind: 'word', icon: 'p-nosotras' },
    { id: 'p.vosotros', es: 'vosotros', en: 'you all (Spain)', kind: 'word', icon: 'p-vosotros', alt: ['vosotras'] },
    { id: 'p.vosotras', es: 'vosotras', en: 'you all (all girls, Spain)', kind: 'word', icon: 'p-vosotras' },
    { id: 'p.ellos', es: 'ellos', en: 'they', kind: 'word', icon: 'p-ellos' },
    { id: 'p.ellas', es: 'ellas', en: 'they (all girls)', kind: 'word', icon: 'p-ellas' },
    { id: 'p.ustedes', es: 'ustedes', en: 'you all (polite)', kind: 'word', icon: 'p-ustedes' },
  ],
  sentences: [
    { id: 'u3.s1', es: 'Yo soy Adele y él es Mateo.', en: 'I am Adele and he is Mateo.', items: ['p.yo', 'p.el'] },
    { id: 'u3.s2', es: 'Ella es española.', en: 'She is Spanish.', items: ['p.ella'] },
    { id: 'u3.s3', es: 'Nosotras somos estudiantes.', en: 'We are students.', items: ['p.nosotras'] },
    { id: 'u3.s4', es: 'Ellos viven en Tiflis.', en: 'They live in Tbilisi.', items: ['p.ellos'] },
    { id: 'u3.s5', es: '¿Vosotros habláis español?', en: 'Do you all speak Spanish?', items: ['p.vosotros'], question: true },
    { id: 'u3.s6', es: '¿Cómo se llama usted?', en: 'What is your name? (polite)', items: ['p.usted'], question: true },

    { id: 'u3.g1', es: '___ soy georgiana.', en: 'I am Georgian.', items: ['p.yo'], gap: { answer: 'Yo', options: ['Yo', 'Tú', 'Él'] } },
    { id: 'u3.g2', es: '___ eres mi compañera.', en: 'You are my classmate.', items: ['p.tu'], gap: { answer: 'Tú', options: ['Yo', 'Tú', 'Ella'] } },
    { id: 'u3.g3', es: '___ somos amigas.', en: 'We are friends.', items: ['p.nosotras'], gap: { answer: 'Nosotras', options: ['Nosotras', 'Vosotras', 'Ellas'] } },
    { id: 'u3.g4', es: '___ son de México.', en: 'They are from Mexico.', items: ['p.ellos'], gap: { answer: 'Ellos', options: ['Ellos', 'Nosotros', 'Vosotros'] } },
    { id: 'u3.g5', es: '¿De dónde es ___, señora?', en: 'Where are you from, madam?', items: ['p.usted'], gap: { answer: 'usted', options: ['usted', 'tú', 'vosotros'] } },
  ],
  situations: [
    { id: 'u3.sit1', en: 'You meet a classmate in the corridor.', answer: 'tú', why: 'Someone your own age: tú.' },
    { id: 'u3.sit2', en: 'You go to the doctor.', answer: 'usted', why: 'A doctor you do not know: usted.' },
    { id: 'u3.sit3', en: 'A police officer stops you in the street.', answer: 'usted', why: 'A police officer: usted, always.' },
    { id: 'u3.sit4', en: 'You talk to your little brother.', answer: 'tú', why: 'Family, and a child: tú.' },
    { id: 'u3.sit5', en: 'You ask the shop assistant for the price.', answer: 'usted', why: 'A stranger serving you in a shop: usted.' },
    { id: 'u3.sit6', en: 'You speak to your Spanish teacher.', answer: 'usted', why: 'A teacher: usted, to be polite.' },
    { id: 'u3.sit7', en: 'You chat with a friend at the market.', answer: 'tú', why: 'A friend: tú, wherever you are.' },
    { id: 'u3.sit8', en: 'You meet your friend’s grandmother for the first time.', answer: 'usted', why: 'An older person you have just met: usted.' },
    { id: 'u3.sit9', en: 'You write to a new pen friend who is twelve.', answer: 'tú', why: 'Someone your own age: tú.' },
  ],
  questions: [
    { id: 'u3.q1', es: '¿Cómo te llamas?', en: 'What is your name?', starts: ['me llamo', 'soy'], example: 'Me llamo Adele.', items: ['p.yo'] },
    { id: 'u3.q2', es: '¿Cómo se llama usted?', en: 'What is your name? (polite)', starts: ['me llamo', 'soy'], example: 'Me llamo Adele.', items: ['p.usted'] },
  ],
  nodes: [
    { id: 'u3.n1', title: 'yo, tú, él, ella', teaches: ['p.yo', 'p.tu', 'p.el', 'p.ella'], sentences: ['u3.s1', 'u3.s2', 'u3.g1', 'u3.g2'] },
    { id: 'u3.n2', title: 'nosotros y vosotros', teaches: ['p.nosotros', 'p.nosotras', 'p.vosotros', 'p.vosotras'], sentences: ['u3.s3', 'u3.s5', 'u3.g3'] },
    { id: 'u3.n3', title: 'ellos, ellas, ustedes', teaches: ['p.ellos', 'p.ellas', 'p.ustedes'], sentences: ['u3.s4', 'u3.g4'] },
    { id: 'u3.n4', title: 'Tú o usted', teaches: ['p.usted', 'p.tu'], sentences: ['u3.s6', 'u3.g5'], situations: ['u3.sit1', 'u3.sit2', 'u3.sit3', 'u3.sit4', 'u3.sit5', 'u3.sit6'], questions: ['u3.q2'] },
    {
      id: 'u3.check', title: 'Unit Check', kind: 'check', teaches: [],
      about: 'Tú or usted, and the six people. Like your teacher’s dialogue exercise.',
      situations: ['u3.sit1', 'u3.sit2', 'u3.sit3', 'u3.sit4', 'u3.sit5', 'u3.sit6', 'u3.sit7', 'u3.sit8', 'u3.sit9'],
      questions: ['u3.q1', 'u3.q2'],
    },
  ],
};
