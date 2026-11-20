import type { Unit } from './types';

/**
 * Unit 9 — ¿Quién eres? (her class's Unit 2, "Who are you?", from 10 Nov).
 *
 * FOLLOWS HER CLASS: so far the class has done lesson 1 — the idea of
 * identity (what people see and what they cannot), the textbook's
 * "¿Quién eres? ¿Cómo te llamas?" with ¿Qué es? / ¿Quién es?, and the
 * Identity Iceberg homework (set in English). No new describing words have
 * been taught yet, so this unit talks about identity with words she already
 * knows. When her teacher gives new vocabulary, add it here as new lessons.
 *
 * 20 Nov homework ("describe yourself", from Adele's own submitted page on
 * ManageBac): the describing words she used — inteligente, amable, simpática,
 * divertida, positiva, negativa — are the two "¿Cómo eres?" lessons below.
 * The teacher's word list was not posted, so only her own words are here.
 */
export const unit9: Unit = {
  id: 'u9',
  number: 9,
  title: '¿Quién eres?',
  subtitle: 'Identity — who you are, with the Spanish you know',
  colour: '#25ab9f',
  tips: {
    title: 'Can you know someone just by looking at them?',
    lines: [
      'That is your teacher’s question for this unit. Think of an iceberg: a small part is above the water, most of it is hidden below.',
      '¿Quién eres? = Who are you? → Soy Adele.',
      '¿Quién es? = Who is it / who is he / she? → Es mi compañera.',
      '¿Qué es? = What is it? → Es mi mochila. (¿Quién? is for people, ¿Qué? is for things.)',
      'You can already say a lot about who you are: Soy de Georgia. Vivo en Tiflis. Hablo georgiano. Tengo un hermano. Me gusta el arte porque es divertido.',
    ],
  },
  items: [
    { id: 'q.quieneres', es: '¿quién eres?', en: 'who are you?', kind: 'phrase', icon: 'question' },
    { id: 'q.quienes', es: '¿quién es?', en: 'who is it? / who is he / she?', kind: 'phrase', icon: 'p-ella' },
    { id: 'q.quees', es: '¿qué es?', en: 'what is it?', kind: 'phrase', icon: 'backpack' },
    { id: 'q.identidad', es: 'la identidad', en: 'identity', kind: 'word', icon: 'iceberg' },

    // describing yourself (her 20 Nov homework)
    { id: 'q.inteligente', es: 'inteligente', en: 'intelligent', kind: 'word', icon: 'brain' },
    { id: 'q.amable', es: 'amable', en: 'kind', kind: 'word', icon: 'heart' },
    { id: 'q.simpatica', es: 'simpática', en: 'nice, friendly (for a girl)', kind: 'word', icon: 'handshake', alt: ['simpático'], note: 'A boy is simpático, a girl is simpática.' },
    { id: 'q.divertida', es: 'divertida', en: 'fun, funny (for a girl)', kind: 'word', icon: 'thumbsup', alt: ['divertido'], note: 'A boy is divertido, a girl is divertida.' },
    { id: 'q.positiva', es: 'positiva', en: 'positive (for a girl)', kind: 'word', icon: 'tick', alt: ['positivo'] },
    { id: 'q.negativa', es: 'negativa', en: 'negative (for a girl)', kind: 'word', icon: 'cross', alt: ['negativo'] },
    { id: 'q.asisoy', es: '¡así soy yo!', en: 'that is me!', kind: 'phrase', icon: 'girl' },
  ],
  sentences: [
    { id: 'u9.s1', es: '¿Quién eres? Soy Adele.', en: 'Who are you? I am Adele.', items: ['q.quieneres'] },
    { id: 'u9.s2', es: '¿Quién es? Es mi compañera.', en: 'Who is it? It is my classmate.', items: ['q.quienes'] },
    { id: 'u9.s3', es: '¿Qué es? Es mi mochila.', en: 'What is it? It is my backpack.', items: ['q.quees'] },
    { id: 'u9.s4', es: '¿Quién es él? Es Carlos.', en: 'Who is he? It is Carlos.', items: ['q.quienes'] },
    { id: 'u9.s5', es: '¿Qué es? Es un diccionario.', en: 'What is it? It is a dictionary.', items: ['q.quees'] },

    // who she is, with words from Units 2, 5, 6 and 8
    { id: 'u9.i1', es: 'Soy de Georgia y vivo en Tiflis.', en: 'I am from Georgia and I live in Tbilisi.', items: ['w.soyde', 'v.vivo'] },
    { id: 'u9.i2', es: 'Hablo georgiano, inglés y un poco de español.', en: 'I speak Georgian, English and a little Spanish.', items: ['v.hablo', 'w.unpoco'] },
    { id: 'u9.i3', es: 'Tengo un hermano y un gato.', en: 'I have a brother and a cat.', items: ['w.hermano', 'w.gato'] },
    { id: 'u9.i4', es: 'Me gusta el arte porque es divertido.', en: 'I like art because it is fun.', items: ['g.megusta', 'g.divertido'] },
    { id: 'u9.i5', es: 'Soy estudiante y tengo doce años.', en: 'I am a student and I am twelve.', items: ['w.estudiante', 'v.tengo'] },

    // describing yourself — the sentences from her own homework
    { id: 'u9.p1', es: 'Soy una persona inteligente y amable.', en: 'I am an intelligent and kind person.', items: ['q.inteligente', 'q.amable'] },
    { id: 'u9.p2', es: 'También soy simpática y divertida.', en: 'I am also nice and fun.', items: ['q.simpatica', 'q.divertida'] },
    { id: 'u9.p3', es: 'Me gusta hacer reír a mis amigos.', en: 'I like making my friends laugh.', items: ['g.megusta'] },
    { id: 'u9.p4', es: 'A veces soy un poco negativa, pero intento ser positiva.', en: 'Sometimes I am a little negative, but I try to be positive.', items: ['q.negativa', 'q.positiva'] },
    { id: 'u9.p5', es: 'Soy inteligente y positiva. ¡Así soy yo!', en: 'I am intelligent and positive. That is me!', items: ['q.asisoy', 'q.positiva'] },
    { id: 'u9.pg1', es: 'Soy una persona ___ y amable.', en: 'I am an intelligent and kind person.', items: ['q.inteligente'], gap: { answer: 'inteligente', options: ['inteligente', 'identidad', 'mochila'] } },
    { id: 'u9.pg2', es: 'También ___ simpática y divertida.', en: 'I am also nice and fun.', items: ['q.simpatica'], gap: { answer: 'soy', options: ['soy', 'eres', 'es'], hint: 'ser' } },
    { id: 'u9.pg3', es: 'A veces soy un poco negativa, pero intento ser ___.', en: 'Sometimes I am a little negative, but I try to be positive.', items: ['q.positiva'], gap: { answer: 'positiva', options: ['positiva', 'negativa', 'amable'] } },

    { id: 'u9.g1', es: '¿___ eres? Soy Adele.', en: 'Who are you? I am Adele.', items: ['q.quieneres'], gap: { answer: 'Quién', options: ['Quién', 'Qué', 'Cómo'] } },
    { id: 'u9.g2', es: '¿___ es? Es mi mochila.', en: 'What is it? It is my backpack.', items: ['q.quees'], gap: { answer: 'Qué', options: ['Qué', 'Quién', 'Dónde'] } },
    { id: 'u9.g3', es: '¿___ es ella? Es Lucía.', en: 'Who is she? It is Lucía.', items: ['q.quienes'], gap: { answer: 'Quién', options: ['Quién', 'Qué', 'Cuándo'] } },
    { id: 'u9.g4', es: '¿Quién ___ tú?', en: 'Who are you?', items: ['q.quieneres'], gap: { answer: 'eres', options: ['eres', 'es', 'soy'], hint: 'ser' } },
  ],
  oddOneOut: [
    { id: 'u9.o1', options: ['¿Quién eres?', '¿Quién es?', '¿Qué es?', 'la mochila'], answer: 'la mochila', why: 'The others are the questions from your textbook’s Lección 1.' },
  ],
  questions: [
    { id: 'u9.q1', es: '¿Quién eres?', en: 'Who are you?', starts: ['soy', 'me llamo'], example: 'Soy Adele. Soy de Georgia.', items: ['q.quieneres'] },
    { id: 'u9.q2', es: '¿Qué lenguas hablas?', en: 'What languages do you speak?', starts: ['hablo'], example: 'Hablo georgiano, inglés y un poco de español.', items: ['v.hablo'] },
    { id: 'u9.q4', es: '¿Cómo eres?', en: 'What are you like?', starts: ['soy'], example: 'Soy inteligente y amable. También soy divertida.', items: ['q.inteligente'] },
    { id: 'u9.q3', es: '¿Tienes hermanos?', en: 'Do you have brothers or sisters?', starts: ['sí', 'si', 'no', 'tengo'], example: 'Sí, tengo un hermano.', items: ['w.hermano'] },
  ],
  nodes: [
    { id: 'u9.n1', title: '¿Quién? ¿Qué?', teaches: ['q.quieneres', 'q.quienes', 'q.quees', 'q.identidad'], sentences: ['u9.s1', 'u9.s2', 'u9.s3', 'u9.s4', 'u9.s5', 'u9.g1', 'u9.g2', 'u9.g3', 'u9.g4'], oddOneOut: ['u9.o1'], questions: ['u9.q1'] },
    { id: 'u9.n2', title: 'Todo sobre mí', teaches: ['w.soyde', 'v.hablo', 'w.hermano', 'g.megusta'], sentences: ['u9.i1', 'u9.i2', 'u9.i3', 'u9.i4', 'u9.i5'], questions: ['u9.q1', 'u9.q2', 'u9.q3'] },
    { id: 'u9.n3', title: '¿Cómo eres?', teaches: ['q.inteligente', 'q.amable', 'q.simpatica', 'q.divertida'], sentences: ['u9.p1', 'u9.p2', 'u9.p3', 'u9.pg1', 'u9.pg2'], questions: ['u9.q4'] },
    { id: 'u9.n4', title: '¡Así soy yo!', teaches: ['q.positiva', 'q.negativa', 'q.asisoy'], sentences: ['u9.p4', 'u9.p5', 'u9.pg3', 'u9.p1', 'u9.p2'], questions: ['u9.q4'] },
    { id: 'u9.story', title: 'Historia: Petra y Jean', kind: 'story', story: 'st.petra', teaches: [] },
    {
      id: 'u9.check', title: 'Unit Check: Mi iceberg', kind: 'check', write: 'w.iceberg', teaches: [],
      about: 'Your Identity Iceberg — the same steps as your teacher’s homework.',
      questions: ['u9.q1', 'u9.q2', 'u9.q3'],
      oddOneOut: ['u9.o1'],
    },
  ],
};
