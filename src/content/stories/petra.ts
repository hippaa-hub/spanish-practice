import type { Story } from '../types';
import { castOf } from './cast';

/** Like the textbook's Lección 1 "¿Quién eres? ¿Cómo te llamas?" — her current unit. */
export const petra: Story = {
  id: 'st.petra',
  title: 'Petra y Jean: ¿Quién eres?',
  en: 'Petra and Jean: Who are you?',
  type: 'dialogue',
  unit: 9,
  scene: 'family',
  cast: castOf('Petra', 'Jean'),
  lines: [
    { speaker: 'Petra', es: 'Hola, ¿quién eres?', en: 'Hello, who are you?' },
    { speaker: 'Jean', es: 'Soy Jean. Soy francés. ¿Y tú? ¿Cómo te llamas?', en: 'I am Jean. I am French. And you? What is your name?' },
    { speaker: 'Petra', es: 'Me llamo Petra. Soy de Alemania, pero vivo en España.', en: 'My name is Petra. I am from Germany, but I live in Spain.' },
    { speaker: 'Jean', es: '¿Qué es eso?', en: 'What is that?' },
    { speaker: 'Petra', es: 'Es mi mochila. Y esto es mi diccionario de español.', en: 'It is my backpack. And this is my Spanish dictionary.' },
    { speaker: 'Jean', es: '¿Quién es ella?', en: 'Who is she?' },
    { speaker: 'Petra', es: 'Es Lucía, mi compañera de clase. Es española y es muy simpática.', en: 'It is Lucía, my classmate. She is Spanish and she is very nice.' },
    { speaker: 'Jean', es: '¿Y quién es él?', en: 'And who is he?' },
    { speaker: 'Petra', es: 'Es Carlos. Es mexicano. Le gusta la música.', en: 'It is Carlos. He is Mexican. He likes music.' },
    { speaker: 'Jean', es: '¡Qué interesante! Encantado, Petra.', en: 'How interesting! Pleased to meet you, Petra.' },
  ],
  glossary: {
    quién: 'who',
    Alemania: 'Germany',
    pero: 'but',
    eso: 'that',
    esto: 'this',
    simpática: 'nice, friendly',
    le: 'him / her (Le gusta = he likes)',
  },
  questions: [
    { id: 'q1', kind: 'choice', criterion: 'Bi', q: '¿De dónde es Jean?', en: 'Where is Jean from?', options: ['Es francés', 'Es español', 'Es alemán'], answer: 'Es francés' },
    { id: 'q2', kind: 'choice', criterion: 'Bi', q: '¿Quién es Lucía?', en: 'Who is Lucía?', options: ['La compañera de clase de Petra', 'La profesora', 'La hermana de Jean'], answer: 'La compañera de clase de Petra' },
    { id: 'q3', kind: 'truefalse', criterion: 'Bi', statement: 'Petra vive en Alemania.', en: 'Petra lives in Germany.', answer: false, evidence: 2 },
    { id: 'q4', kind: 'truefalse', criterion: 'Bi', statement: 'A Carlos le gusta la música.', en: 'Carlos likes music.', answer: true, evidence: 8 },
    { id: 'q5', kind: 'choice', criterion: 'Bii', q: 'What are Petra and Jean doing?', options: ['Meeting and saying who people are', 'Buying a backpack', 'Doing a history test'], answer: 'Meeting and saying who people are', why: 'They ask ¿Quién eres? and ¿Quién es? — who people are. That is the question of your unit.' },
    { id: 'q6', kind: 'you', criterion: 'Biii', q: '¿Y tú? ¿Quién eres?', en: 'And you? Who are you?', starts: ['soy', 'me llamo'], example: 'Soy Adele. Soy de Georgia y tengo doce años.' },
  ],
};
