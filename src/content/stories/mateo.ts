import type { Story } from '../types';
import { castOf } from './cast';

export const mateo: Story = {
  id: 'st.mateo',
  title: 'Mateo, el estudiante nuevo',
  en: 'Mateo, the new student',
  type: 'dialogue',
  unit: 6,
  scene: 'classmate',
  cast: castOf('Lucía', 'Mateo'),
  lines: [
    { speaker: 'Lucía', es: '¡Hola! ¿Eres nuevo?', en: 'Hello! Are you new?' },
    { speaker: 'Mateo', es: 'Sí. Hola, me llamo Mateo.', en: 'Yes. Hello, my name is Mateo.' },
    { speaker: 'Lucía', es: 'Yo me llamo Lucía. ¿De dónde eres, Mateo?', en: 'My name is Lucía. Where are you from, Mateo?' },
    { speaker: 'Mateo', es: 'Soy de Argentina, pero ahora vivo en Alicante.', en: 'I am from Argentina, but now I live in Alicante.' },
    { speaker: 'Lucía', es: '¡Qué bien! ¿Cuántos años tienes?', en: 'How nice! How old are you?' },
    { speaker: 'Mateo', es: 'Tengo doce años. ¿Y tú?', en: 'I am twelve. And you?' },
    { speaker: 'Lucía', es: 'Yo tengo trece años. ¿Qué lenguas hablas?', en: 'I am thirteen. What languages do you speak?' },
    { speaker: 'Mateo', es: 'Hablo español y un poco de inglés.', en: 'I speak Spanish and a little English.' },
    { speaker: 'Lucía', es: 'Yo hablo español, inglés y francés.', en: 'I speak Spanish, English and French.' },
    { speaker: 'Mateo', es: '¡Mucho gusto, Lucía!', en: 'Nice to meet you, Lucía!' },
    { speaker: 'Lucía', es: 'Encantada. ¡Hasta luego!', en: 'Pleased to meet you. See you later!' },
  ],
  glossary: { nuevo: 'new', pero: 'but', ahora: 'now', qué: 'how (in ¡Qué bien!)', bien: 'well / nice' },
  questions: [
    { id: 'q1', kind: 'choice', criterion: 'Bi', q: '¿De dónde es Mateo?', en: 'Where is Mateo from?', options: ['De Argentina', 'De España', 'De México'], answer: 'De Argentina' },
    { id: 'q2', kind: 'choice', criterion: 'Bi', q: '¿Dónde vive Mateo ahora?', en: 'Where does Mateo live now?', options: ['En Alicante', 'En Argentina', 'En Tiflis'], answer: 'En Alicante' },
    { id: 'q3', kind: 'truefalse', criterion: 'Bi', statement: 'Mateo tiene trece años.', en: 'Mateo is thirteen.', answer: false, evidence: 5 },
    { id: 'q4', kind: 'truefalse', criterion: 'Bi', statement: 'Lucía habla francés.', en: 'Lucía speaks French.', answer: true, evidence: 8 },
    { id: 'q5', kind: 'choice', criterion: 'Bii', q: 'What kind of text is this?', options: ['A dialogue between two students', 'A blog post', 'A poster'], answer: 'A dialogue between two students', why: 'Two people take turns to speak — each line starts with a dash.' },
    { id: 'q6', kind: 'you', criterion: 'Biii', q: '¿Y tú? ¿Qué lenguas hablas?', en: 'And you? What languages do you speak?', starts: ['hablo'], example: 'Hablo georgiano, inglés y un poco de español.' },
  ],
};
