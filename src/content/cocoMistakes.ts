/**
 * "Teach Coco" — Coco's homework, full of the mistakes beginners make in her
 * class (the ones her tests check). Adele is the teacher: she finds the
 * mistake, picks the right word, and explains why. Teaching someone else is
 * one of the strongest ways to learn (the protégé effect).
 *
 * Every sentence uses words from her units. `parts` are the pieces she can
 * tap; `wrong` is the index of Coco's mistake.
 */
export type CocoMistake = {
  id: string;
  unit: number;
  parts: string[];
  wrong: number;
  /** The right word or words for that piece. */
  right: string;
  /** One more tempting (but wrong) choice for "what should it be?". */
  other: string;
  why: string;
};

export const COCO_MISTAKES: CocoMistake[] = [
  // Unit 1 — greetings
  { id: 'm1', unit: 1, parts: ['¡Buena', 'días,', 'profesora!'], wrong: 0, right: 'Buenos', other: 'Buenas', why: 'Días is a boy word (el día), so it is buenos días.' },
  { id: 'm2', unit: 1, parts: ['Buenos', 'tardes,', 'Lucía.'], wrong: 0, right: 'Buenas', other: 'Buena', why: 'Tardes is a girl word (la tarde), so it is buenas tardes.' },
  { id: 'm3', unit: 1, parts: ['Hola,', '¿que', 'tal?'], wrong: 1, right: '¿qué', other: '¿quién', why: 'In a question, qué has an accent.' },

  // Unit 2 — me presento
  { id: 'm4', unit: 2, parts: ['Yo', 'tiene', 'doce', 'años.'], wrong: 1, right: 'tengo', other: 'tienes', why: 'With yo, TENER is tengo.' },
  { id: 'm5', unit: 2, parts: ['Soy', 'doce', 'años.'], wrong: 0, right: 'Tengo', other: 'Es', why: 'Age uses TENER in Spanish: Tengo doce años.' },
  { id: 'm6', unit: 2, parts: ['Me', 'llama', 'Coco.'], wrong: 1, right: 'llamo', other: 'llamas', why: 'With me, LLAMARSE is me llamo.' },
  { id: 'm7', unit: 2, parts: ['Yo', 'vive', 'en', 'Tiflis.'], wrong: 1, right: 'vivo', other: 'vives', why: 'With yo, VIVIR is vivo.' },
  { id: 'm8', unit: 2, parts: ['¿Como', 'te', 'llamas?'], wrong: 0, right: '¿Cómo', other: '¿Qué', why: 'Question words have an accent: ¿Cómo…?' },
  { id: 'm9', unit: 2, parts: ['Yo', 'es', 'de', 'Georgia.'], wrong: 1, right: 'soy', other: 'eres', why: 'With yo, SER is soy.' },

  // Unit 3 — pronouns, tú / usted
  { id: 'm10', unit: 3, parts: ['Lucía', 'y', 'yo', 'somos', 'amigas.', 'Nosotros', 'vivimos', 'en', 'Alicante.'], wrong: 5, right: 'Nosotras', other: 'Vosotras', why: 'A group of only girls is nosotras.' },
  { id: 'm11', unit: 3, parts: ['Lucía', 'y', 'Elena', '—', 'ellos', 'son', 'españolas.'], wrong: 4, right: 'ellas', other: 'nosotras', why: 'Lucía and Elena are both girls: ellas.' },
  { id: 'm12', unit: 3, parts: ['Buenos', 'días,', 'doctor.', '¿Cómo', 'te llamas?'], wrong: 4, right: 'se llama', other: 'me llamo', why: 'A doctor is usted, so it is ¿Cómo se llama?' },

  // Unit 4 — the six verbs
  { id: 'm13', unit: 4, parts: ['Nosotros', 'vivemos', 'en', 'Tiflis.'], wrong: 1, right: 'vivimos', other: 'viven', why: 'VIVIR is an -ir verb: nosotros vivimos.' },
  { id: 'm14', unit: 4, parts: ['Ellos', 'habla', 'inglés.'], wrong: 1, right: 'hablan', other: 'hablas', why: 'With ellos, the verb ends in -n: hablan.' },
  { id: 'm15', unit: 4, parts: ['Mi', 'profesora', 'se llamas', 'Ana.'], wrong: 2, right: 'se llama', other: 'me llamo', why: 'Talking about someone else: se llama.' },
  { id: 'm16', unit: 4, parts: ['¿Tú', 'tiene', 'un', 'gato?'], wrong: 1, right: 'tienes', other: 'tengo', why: 'With tú, the verb ends in -s: tienes.' },
  { id: 'm17', unit: 4, parts: ['Mateo', 'es', 'doce', 'años.'], wrong: 1, right: 'tiene', other: 'tengo', why: 'Age uses TENER: Mateo tiene doce años.' },
  { id: 'm18', unit: 4, parts: ['Vosotros', 'hablan', 'español.'], wrong: 1, right: 'habláis', other: 'hablamos', why: 'With vosotros, HABLAR is habláis.' },

  // Unit 5 — nationalities and languages
  { id: 'm19', unit: 5, parts: ['Lucía', 'es', 'español.'], wrong: 2, right: 'española', other: 'españolas', why: 'Lucía is a girl: española.' },
  { id: 'm20', unit: 5, parts: ['Hablo', 'Georgiano', 'y', 'inglés.'], wrong: 1, right: 'georgiano', other: 'georgiana', why: 'Languages are written with a small letter in Spanish.' },
  { id: 'm21', unit: 5, parts: ['Ella', 'es', 'inglés.'], wrong: 2, right: 'inglesa', other: 'ingleses', why: 'A girl is inglesa — and the accent goes away.' },
  { id: 'm22', unit: 5, parts: ['Nosotras', 'somos', 'francés.'], wrong: 2, right: 'francesas', other: 'francesa', why: 'All girls, more than one: francesas.' },

  // Unit 6 — getting to know someone
  { id: 'm23', unit: 6, parts: ['Mi', 'cumpleaños', 'es', 'el', 'cinco', 'de', 'Mayo.'], wrong: 6, right: 'mayo.', other: 'Mayos.', why: 'Months are written with a small letter in Spanish.' },
  { id: 'm24', unit: 6, parts: ['¿Tienes', 'hermanos?', '—No,', 'tengo', 'hermanos.'], wrong: 3, right: 'no tengo', other: 'tienes', why: 'Spanish says no twice: No, no tengo.' },
  { id: 'm25', unit: 6, parts: ['¿Cuando', 'es', 'tu', 'cumpleaños?'], wrong: 0, right: '¿Cuándo', other: '¿Dónde', why: 'Question words have an accent: ¿Cuándo…?' },

  // Unit 7 — the classroom
  { id: 'm26', unit: 7, parts: ['La', 'lápiz', 'está', 'en', 'el', 'estuche.'], wrong: 0, right: 'El', other: 'Los', why: 'Lápiz is a boy word: el lápiz.' },
  { id: 'm27', unit: 7, parts: ['El', 'mochila', 'es', 'azul.'], wrong: 0, right: 'La', other: 'Las', why: 'Mochila is a girl word: la mochila.' },
  { id: 'm28', unit: 7, parts: ['La', 'mapa', 'está', 'en', 'la', 'pared.'], wrong: 0, right: 'El', other: 'Las', why: 'El mapa is a boy word, even though it ends in -a.' },
  { id: 'm29', unit: 7, parts: ['Tengo', 'dos', 'lápizes.'], wrong: 2, right: 'lápices.', other: 'lápiz.', why: 'In the plural, z becomes c: lápices.' },
  { id: 'm30', unit: 7, parts: ['Necesito', 'un', 'goma', 'de', 'borrar.'], wrong: 1, right: 'una', other: 'unos', why: 'Goma is a girl word: una goma.' },

  // Unit 8 — my timetable
  { id: 'm31', unit: 8, parts: ['Me', 'gusta', 'las', 'matemáticas.'], wrong: 1, right: 'gustan', other: 'gustas', why: 'For more than one thing: me gustan.' },
  { id: 'm32', unit: 8, parts: ['Me', 'gusta', 'el', 'arte', 'por que', 'es', 'divertido.'], wrong: 4, right: 'porque', other: '¿por qué?', why: 'Because = porque, one word. ¿Por qué? is the question "why?".' },
  { id: 'm33', unit: 8, parts: ['Los', 'Lunes', 'tengo', 'español.'], wrong: 1, right: 'lunes', other: 'lunas', why: 'Days are written with a small letter in Spanish.' },

  // Unit 9 — ¿Quién eres?
  { id: 'm34', unit: 9, parts: ['¿Quién', 'es?', '—Es', 'mi', 'mochila.'], wrong: 0, right: '¿Qué', other: '¿Cómo', why: '¿Quién? is for people, ¿Qué? is for things.' },
  { id: 'm35', unit: 9, parts: ['¿Qué', 'eres?', '—Soy', 'Adele.'], wrong: 0, right: '¿Quién', other: '¿Dónde', why: '¿Quién eres? asks who someone is.' },
];
