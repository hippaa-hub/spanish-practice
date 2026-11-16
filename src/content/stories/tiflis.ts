import type { Story } from '../types';
import { castOf } from './cast';

/** A first day at a school in Tbilisi — Adele's own city, and Adele is in it. */
export const tiflis: Story = {
  id: 'st.tiflis',
  title: 'El primer día en Tiflis',
  en: 'The first day in Tbilisi',
  type: 'dialogue',
  unit: 7,
  scene: 'city',
  cast: castOf('Ana', 'Sofía', 'Adele'),
  lines: [
    { speaker: 'Ana', es: '¡Hola! Bienvenida a la escuela. ¿Cómo te llamas?', en: 'Hello! Welcome to the school. What is your name?' },
    { speaker: 'Sofía', es: 'Me llamo Sofía. Soy española, pero ahora vivo en Tiflis.', en: 'My name is Sofía. I am Spanish, but now I live in Tbilisi.' },
    { speaker: 'Ana', es: 'Muy bien. Yo soy la profesora de español. Me llamo Ana.', en: 'Very good. I am the Spanish teacher. My name is Ana.' },
    { speaker: 'Sofía', es: 'Mucho gusto. ¿Puede repetir, por favor?', en: 'Nice to meet you. Can you repeat that, please?' },
    { speaker: 'Ana', es: 'Claro. Me llamo Ana. ¿Hablas georgiano?', en: 'Of course. My name is Ana. Do you speak Georgian?' },
    { speaker: 'Sofía', es: 'Solo un poco. Hablo español e inglés.', en: 'Only a little. I speak Spanish and English.' },
    { speaker: 'Adele', es: '¡Hola, Sofía! Me llamo Adele. Soy tu compañera.', en: 'Hello, Sofía! My name is Adele. I am your classmate.' },
    { speaker: 'Sofía', es: '¡Hola, Adele! ¿Qué clase tenemos ahora?', en: 'Hello, Adele! What lesson do we have now?' },
    { speaker: 'Adele', es: 'Los lunes tenemos matemáticas y después español.', en: 'On Mondays we have maths and then Spanish.' },
    { speaker: 'Sofía', es: '¡Me gusta el español! Para mí es fácil.', en: 'I like Spanish! For me it is easy.' },
    { speaker: 'Adele', es: 'Para mí es difícil. ¿Me ayudas?', en: 'For me it is difficult. Will you help me?' },
    { speaker: 'Sofía', es: '¡Claro que sí!', en: 'Of course!' },
  ],
  glossary: {
    bienvenida: 'welcome (to a girl)',
    escuela: 'school',
    pero: 'but',
    ahora: 'now',
    claro: 'of course',
    solo: 'only',
    e: 'and (before a word starting with i)',
    tu: 'your',
    después: 'after / then',
    para: 'for',
    mí: 'me',
    ayudas: 'you help',
  },
  questions: [
    { id: 'q1', kind: 'choice', criterion: 'Bi', q: '¿Dónde vive Sofía ahora?', en: 'Where does Sofía live now?', options: ['En Tiflis', 'En España', 'En Alicante'], answer: 'En Tiflis' },
    { id: 'q2', kind: 'choice', criterion: 'Bi', q: '¿Cómo se llama la profesora?', en: 'What is the teacher called?', options: ['Ana', 'Sofía', 'Lucía'], answer: 'Ana' },
    { id: 'q3', kind: 'truefalse', criterion: 'Bi', statement: 'Sofía habla georgiano muy bien.', en: 'Sofía speaks Georgian very well.', answer: false, evidence: 5 },
    { id: 'q4', kind: 'truefalse', criterion: 'Bi', statement: 'Los lunes tienen matemáticas.', en: 'On Mondays they have maths.', answer: true, evidence: 8 },
    { id: 'q5', kind: 'choice', criterion: 'Bii', q: 'When does this conversation happen?', options: ["On Sofía's first day at a new school", 'On the last day of the school year', 'During a holiday in Spain'], answer: "On Sofía's first day at a new school", why: 'The teacher says "Bienvenida a la escuela" — welcome to the school.' },
    { id: 'q6', kind: 'you', criterion: 'Biii', q: '¿Y tú? ¿Qué tienes los lunes?', en: 'And you? What do you have on Mondays?', starts: ['los lunes tengo', 'tengo'], example: 'Los lunes tengo español y matemáticas.' },
  ],
};
