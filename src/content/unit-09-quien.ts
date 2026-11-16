import type { Unit } from './types';

/**
 * Unit 9 — ¿Quién eres? (her class's Unit 2, "Who are you?", from 10 Nov).
 *
 * PROVISIONAL WORDS: SPANISH_STUDIED.md only says the next likely vocabulary is
 * physical description, personality adjectives, family, hobbies and likes.
 * The words below are the most basic ones for those topics. When her real
 * worksheets arrive, replace them with her teacher's words.
 */
export const unit9: Unit = {
  id: 'u9',
  number: 9,
  title: '¿Quién eres?',
  subtitle: 'Identity — what people see, and what they do not',
  colour: '#25ab9f',
  tips: {
    title: 'Is a person more than how they look?',
    lines: [
      'That is the question of this unit. Think of an iceberg: a small part is above the water, most of it is hidden below.',
      'Above the water — what people can SEE: Soy alta. Tengo el pelo largo. Llevo gafas.',
      'Below the water — what they CANNOT see: Soy una persona tímida. Me gusta dibujar. Hablo tres lenguas.',
      'Describing words change for a girl: Soy alto (boy) → Soy alta (girl). Soy simpático → Soy simpática.',
      'Words ending in -e or a consonant stay the same: inteligente, amable, joven.',
      '"Tengo" for things you have (el pelo, los ojos, dos hermanos); "soy" for what you are (alta, simpática).',
    ],
    table: {
      head: ['Boy', 'Girl', 'English'],
      rows: [
        ['alto', 'alta', 'tall'],
        ['bajo', 'baja', 'short'],
        ['simpático', 'simpática', 'nice, friendly'],
        ['tímido', 'tímida', 'shy'],
        ['creativo', 'creativa', 'creative'],
        ['inteligente', 'inteligente', 'clever'],
      ],
    },
  },
  items: [
    { id: 'q.quieneres', es: '¿quién eres?', en: 'who are you?', kind: 'phrase', icon: 'question' },
    { id: 'q.quienes', es: '¿quién es?', en: 'who is it? / who is he / she?', kind: 'phrase', icon: 'question' },
    { id: 'q.quees', es: '¿qué es?', en: 'what is it?', kind: 'phrase', icon: 'question' },
    { id: 'q.persona', es: 'soy una persona…', en: 'I am a … person', kind: 'phrase', icon: 'girl' },
    { id: 'q.identidad', es: 'la identidad', en: 'identity', kind: 'word', icon: 'brain' },

    // what people can see
    { id: 'q.alto', es: 'alto / alta', en: 'tall', kind: 'word', alt: ['alto', 'alta'] },
    { id: 'q.bajo', es: 'bajo / baja', en: 'short (not tall)', kind: 'word', alt: ['bajo', 'baja'] },
    { id: 'q.pelolargo', es: 'el pelo largo', en: 'long hair', kind: 'phrase' },
    { id: 'q.pelocorto', es: 'el pelo corto', en: 'short hair', kind: 'phrase' },
    { id: 'q.ojos', es: 'los ojos', en: 'the eyes', kind: 'word' },
    { id: 'q.gafas', es: 'llevo gafas', en: 'I wear glasses', kind: 'phrase' },

    // what people cannot see
    { id: 'q.simpatico', es: 'simpático / simpática', en: 'nice, friendly', kind: 'word', icon: 'heart', alt: ['simpático', 'simpática'] },
    { id: 'q.timido', es: 'tímido / tímida', en: 'shy', kind: 'word', icon: 'confused', alt: ['tímido', 'tímida'] },
    { id: 'q.inteligente', es: 'inteligente', en: 'clever', kind: 'word', icon: 'lightbulb' },
    { id: 'q.creativo', es: 'creativo / creativa', en: 'creative', kind: 'word', icon: 'palette', alt: ['creativo', 'creativa'] },
    { id: 'q.amable', es: 'amable', en: 'kind', kind: 'word', icon: 'handshake' },
    { id: 'q.trabajador', es: 'trabajador / trabajadora', en: 'hard-working', kind: 'word', icon: 'study', alt: ['trabajador', 'trabajadora'] },

    // family
    { id: 'q.familia', es: 'la familia', en: 'the family', kind: 'word', icon: 'family' },
    { id: 'q.madre', es: 'mi madre', en: 'my mother', kind: 'phrase' },
    { id: 'q.padre', es: 'mi padre', en: 'my father', kind: 'phrase' },
    { id: 'q.abuelos', es: 'mis abuelos', en: 'my grandparents', kind: 'phrase' },

    // hobbies
    { id: 'q.dibujar', es: 'dibujar', en: 'to draw', kind: 'word', icon: 'write' },
    { id: 'q.bailar', es: 'bailar', en: 'to dance', kind: 'word', icon: 'music' },
    { id: 'q.nadar', es: 'nadar', en: 'to swim', kind: 'word' },
    { id: 'q.futbol', es: 'jugar al fútbol', en: 'to play football', kind: 'phrase', icon: 'ball' },
  ],
  sentences: [
    { id: 'u9.s1', es: '¿Quién eres? Soy Adele.', en: 'Who are you? I am Adele.', items: ['q.quieneres'] },
    { id: 'u9.s2', es: '¿Quién es? Es mi compañera.', en: 'Who is it? It is my classmate.', items: ['q.quienes'] },
    { id: 'u9.s3', es: '¿Qué es? Es mi mochila.', en: 'What is it? It is my backpack.', items: ['q.quees'] },
    { id: 'u9.s4', es: 'Soy alta y tengo el pelo largo.', en: 'I am tall and I have long hair.', items: ['q.alto', 'q.pelolargo'] },
    { id: 'u9.s5', es: 'Soy baja y llevo gafas.', en: 'I am short and I wear glasses.', items: ['q.bajo', 'q.gafas'] },
    { id: 'u9.s6', es: 'Soy una persona tímida pero simpática.', en: 'I am a shy but friendly person.', items: ['q.persona', 'q.timido', 'q.simpatico'] },
    { id: 'u9.s7', es: 'Mi madre es muy creativa.', en: 'My mother is very creative.', items: ['q.madre', 'q.creativo'] },
    { id: 'u9.s8', es: 'Me gusta dibujar y bailar.', en: 'I like drawing and dancing.', items: ['q.dibujar', 'q.bailar'] },
    { id: 'u9.s9', es: 'Mis abuelos viven en Tiflis.', en: 'My grandparents live in Tbilisi.', items: ['q.abuelos'] },
    { id: 'u9.s10', es: 'Mi padre es inteligente y amable.', en: 'My father is clever and kind.', items: ['q.padre', 'q.inteligente', 'q.amable'] },

    { id: 'u9.g1', es: 'Adele es ___.', en: 'Adele is tall.', items: ['q.alto'], gap: { answer: 'alta', options: ['alto', 'alta', 'altos'] } },
    { id: 'u9.g2', es: 'Mateo es ___.', en: 'Mateo is shy.', items: ['q.timido'], gap: { answer: 'tímido', options: ['tímido', 'tímida', 'tímidas'] } },
    { id: 'u9.g3', es: '___ el pelo corto.', en: 'I have short hair.', items: ['q.pelocorto'], gap: { answer: 'Tengo', options: ['Tengo', 'Soy', 'Llevo'] } },
    { id: 'u9.g4', es: '___ una persona amable.', en: 'I am a kind person.', items: ['q.persona'], gap: { answer: 'Soy', options: ['Soy', 'Tengo', 'Me llamo'] } },
    { id: 'u9.g5', es: '¿___ es? Es mi hermano.', en: 'Who is it? It is my brother.', items: ['q.quienes'], gap: { answer: 'Quién', options: ['Quién', 'Qué', 'Cómo'] } },
    { id: 'u9.t1', es: 'Me gusta ___ en el mar.', en: 'I like swimming in the sea.', items: ['q.nadar'], gap: { answer: 'nadar' } },
  ],
  oddOneOut: [
    { id: 'u9.o1', options: ['alta', 'baja', 'el pelo largo', 'tímida'], answer: 'tímida', why: 'The others are things people can SEE. Tímida is below the water.' },
    { id: 'u9.o2', options: ['mi madre', 'mi padre', 'mis abuelos', 'mis gafas'], answer: 'mis gafas', why: 'The others are family.' },
    { id: 'u9.o3', options: ['dibujar', 'bailar', 'nadar', 'inteligente'], answer: 'inteligente', why: 'The others are hobbies — things you do.' },
  ],
  questions: [
    { id: 'u9.q1', es: '¿Quién eres?', en: 'Who are you?', starts: ['soy', 'me llamo'], example: 'Soy Adele. Soy una persona simpática.', items: ['q.quieneres'] },
    { id: 'u9.q2', es: '¿Cómo eres?', en: 'What are you like?', starts: ['soy'], example: 'Soy alta y un poco tímida.', items: ['q.persona'] },
    { id: 'u9.q3', es: '¿Qué te gusta hacer?', en: 'What do you like doing?', starts: ['me gusta'], example: 'Me gusta dibujar y nadar.', items: ['q.dibujar'] },
    { id: 'u9.q4', es: '¿Cómo es tu familia?', en: 'What is your family like?', starts: ['mi familia es', 'mi madre', 'mi padre', 'tengo'], example: 'Mi familia es pequeña. Tengo un hermano.', items: ['q.familia'] },
  ],
  nodes: [
    { id: 'u9.n1', title: '¿Quién eres?', teaches: ['q.quieneres', 'q.quienes', 'q.quees', 'q.persona'], sentences: ['u9.s1', 'u9.s2', 'u9.s3', 'u9.g5', 'u9.g4'], questions: ['u9.q1'] },
    { id: 'u9.n2', title: 'Lo que se ve', teaches: ['q.alto', 'q.bajo', 'q.pelolargo', 'q.pelocorto', 'q.ojos', 'q.gafas'], sentences: ['u9.s4', 'u9.s5', 'u9.g1', 'u9.g3'], oddOneOut: ['u9.o1'] },
    { id: 'u9.n3', title: 'Lo que no se ve', teaches: ['q.simpatico', 'q.timido', 'q.inteligente', 'q.creativo', 'q.amable', 'q.trabajador'], sentences: ['u9.s6', 'u9.s10', 'u9.g2'], questions: ['u9.q2'] },
    { id: 'u9.n4', title: 'Mi familia', teaches: ['q.familia', 'q.madre', 'q.padre', 'q.abuelos'], sentences: ['u9.s7', 'u9.s9', 'u9.s10'], oddOneOut: ['u9.o2'], questions: ['u9.q4'] },
    { id: 'u9.n5', title: 'Mis aficiones', teaches: ['q.dibujar', 'q.bailar', 'q.nadar', 'q.futbol'], sentences: ['u9.s8', 'u9.t1'], oddOneOut: ['u9.o3'], questions: ['u9.q3'] },
    { id: 'u9.story', title: 'Historia: Petra y Jean', kind: 'story', story: 'st.petra', teaches: [] },
    {
      id: 'u9.check', title: 'Unit Check: Mi iceberg', kind: 'check', write: 'w.iceberg', teaches: [],
      about: 'Your Identity Iceberg in Spanish — in your own words, like your homework.',
      questions: ['u9.q1', 'u9.q2', 'u9.q3', 'u9.q4'],
      oddOneOut: ['u9.o1', 'u9.o2', 'u9.o3'],
    },
  ],
};
