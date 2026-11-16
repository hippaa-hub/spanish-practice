import type { Story } from '../types';
import { castOf } from './cast';

export const biblioteca: Story = {
  id: 'st.biblioteca',
  title: 'Carlos y Elena en la biblioteca',
  en: 'Carlos and Elena in the library',
  type: 'dialogue',
  unit: 8,
  scene: 'book',
  cast: castOf('Carlos', 'Elena'),
  lines: [
    { speaker: 'Carlos', es: 'Buenos días, Elena. ¿Qué tal?', en: 'Good morning, Elena. How are you?' },
    { speaker: 'Elena', es: 'Muy bien, gracias. ¿Y tú?', en: 'Very well, thank you. And you?' },
    { speaker: 'Carlos', es: 'Bien. Mañana tengo un examen de historia.', en: 'Fine. Tomorrow I have a history test.' },
    { speaker: 'Elena', es: '¡Yo también! Necesito estudiar.', en: 'Me too! I need to study.' },
    { speaker: 'Carlos', es: '¿Tienes una goma de borrar, por favor?', en: 'Do you have a rubber, please?' },
    { speaker: 'Elena', es: 'Sí, y tengo un lápiz y un cuaderno.', en: 'Yes, and I have a pencil and a notebook.' },
    { speaker: 'Carlos', es: 'Gracias. Yo tengo mi libro y mi diccionario.', en: 'Thank you. I have my book and my dictionary.' },
    { speaker: 'Elena', es: '¿Te gusta la historia?', en: 'Do you like history?' },
    { speaker: 'Carlos', es: 'No me gusta mucho, porque es difícil.', en: 'I do not like it much, because it is difficult.' },
    { speaker: 'Elena', es: 'A mí me gusta, porque es interesante.', en: 'I like it, because it is interesting.' },
  ],
  glossary: { biblioteca: 'library', también: 'too / also', mañana: 'tomorrow', mucho: 'a lot', 'mí': 'me (in "A mí me gusta")', necesito: 'I need' },
  questions: [
    { id: 'q1', kind: 'choice', criterion: 'Bi', q: '¿Qué tiene Carlos mañana?', en: 'What does Carlos have tomorrow?', options: ['Un examen de historia', 'Un examen de español', 'Clase de música'], answer: 'Un examen de historia' },
    { id: 'q2', kind: 'choice', criterion: 'Bi', q: '¿Qué necesita Carlos?', en: 'What does Carlos need?', options: ['Una goma de borrar', 'Un diccionario', 'Una calculadora'], answer: 'Una goma de borrar' },
    { id: 'q3', kind: 'truefalse', criterion: 'Bi', statement: 'A Carlos le gusta mucho la historia.', en: 'Carlos likes history a lot.', answer: false, evidence: 8 },
    { id: 'q4', kind: 'truefalse', criterion: 'Bi', statement: 'Elena tiene un cuaderno.', en: 'Elena has a notebook.', answer: true, evidence: 5 },
    { id: 'q5', kind: 'choice', criterion: 'Bii', q: 'Where does this conversation happen?', options: ['In the library', 'At home', 'In a shop'], answer: 'In the library', why: 'The title says "en la biblioteca", and they are studying with books.' },
    { id: 'q6', kind: 'you', criterion: 'Biii', q: '¿Y tú? ¿Te gusta la historia? ¿Por qué?', en: 'And you? Do you like history? Why?', starts: ['sí', 'si', 'no', 'me gusta', 'no me gusta'], example: 'Sí, me gusta la historia porque es interesante.' },
  ],
};
