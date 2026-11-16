import type { Story } from '../types';
import { castOf } from './cast';

export const conocenos: Story = {
  id: 'st.conocenos',
  title: 'Conócenos',
  en: 'Get to know us — four student posters',
  type: 'poster',
  unit: 5,
  scene: 'board',
  cast: castOf('Carlos', 'Sofía', 'Mateo', 'Elena'),
  lines: [
    { speaker: 'Carlos', es: '¡Hola! Me llamo Carlos. Soy mexicano y vivo en Monterrey.', en: 'Hello! My name is Carlos. I am Mexican and I live in Monterrey.' },
    { speaker: 'Carlos', es: 'Tengo catorce años. Tengo un perro.', en: 'I am fourteen. I have a dog.' },
    { speaker: 'Sofía', es: 'Me llamo Sofía. Soy española, de Madrid. Tengo trece años.', en: 'My name is Sofía. I am Spanish, from Madrid. I am thirteen.' },
    { speaker: 'Sofía', es: 'No tengo mascotas, pero tengo dos hermanos.', en: 'I do not have any pets, but I have two brothers.' },
    { speaker: 'Mateo', es: 'Soy Mateo. Soy argentino, pero vivo en Alicante.', en: 'I am Mateo. I am Argentinian, but I live in Alicante.' },
    { speaker: 'Mateo', es: 'Tengo doce años y tengo un gato.', en: 'I am twelve and I have a cat.' },
    { speaker: 'Elena', es: 'Me llamo Elena y soy colombiana. Vivo en Bogotá.', en: 'My name is Elena and I am Colombian. I live in Bogotá.' },
    { speaker: 'Elena', es: 'Tengo quince años. Me gusta la música.', en: 'I am fifteen. I like music.' },
  ],
  glossary: { conócenos: 'get to know us', pero: 'but', colombiana: 'Colombian (a girl)', mascotas: 'pets' },
  questions: [
    { id: 'q1', kind: 'choice', criterion: 'Bi', q: '¿Quién tiene un perro?', en: 'Who has a dog?', options: ['Carlos', 'Sofía', 'Elena'], answer: 'Carlos' },
    { id: 'q2', kind: 'choice', criterion: 'Bi', q: '¿Cuántos años tiene Elena?', en: 'How old is Elena?', options: ['Quince años', 'Trece años', 'Doce años'], answer: 'Quince años' },
    { id: 'q3', kind: 'truefalse', criterion: 'Bi', statement: 'Sofía tiene mascotas.', en: 'Sofía has pets.', answer: false, evidence: 3 },
    { id: 'q4', kind: 'truefalse', criterion: 'Bi', statement: 'Mateo es argentino.', en: 'Mateo is Argentinian.', answer: true, evidence: 4 },
    { id: 'q5', kind: 'choice', criterion: 'Bii', q: 'What are these texts for?', options: ['To introduce four students to the class', 'To sell school things', 'To tell a story about a holiday'], answer: 'To introduce four students to the class', why: '"Conócenos" means "get to know us": each poster says who the student is.' },
    { id: 'q6', kind: 'you', criterion: 'Biii', q: '¿Y tú? ¿Tienes mascotas?', en: 'And you? Do you have pets?', starts: ['sí', 'si', 'no', 'tengo'], example: 'Sí, tengo un gato. / No, no tengo mascotas.' },
  ],
};
