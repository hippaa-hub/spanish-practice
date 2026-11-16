import type { Story } from '../types';
import { castOf } from './cast';

/** In the style of the text in her 3 Nov reading test — written fresh, same kind of questions. */
export const jiwon: Story = {
  id: 'st.jiwon',
  title: 'El blog de Jiwon',
  en: "Jiwon's school blog",
  type: 'blog',
  unit: 8,
  scene: 'laptop',
  cast: castOf('Jiwon'),
  lines: [
    { speaker: 'Jiwon', es: '¡Hola a todos! Me llamo Jiwon.', en: 'Hello everyone! My name is Jiwon.' },
    { speaker: 'Jiwon', es: 'Tengo quince años y soy coreana. Vivo en Corea del Sur.', en: 'I am fifteen and I am Korean. I live in South Korea.' },
    { speaker: 'Jiwon', es: 'Estudio en el colegio Chadwick International.', en: 'I study at Chadwick International school.' },
    { speaker: 'Jiwon', es: 'Mis asignaturas favoritas son el arte y el español.', en: 'My favourite subjects are art and Spanish.' },
    { speaker: 'Jiwon', es: 'Me gusta el español porque es interesante y mi profesora es muy simpática.', en: 'I like Spanish because it is interesting and my teacher is very nice.' },
    { speaker: 'Jiwon', es: 'No me gusta la historia porque es aburrida.', en: 'I do not like history because it is boring.' },
    { speaker: 'Jiwon', es: 'Para la clase de español necesito un cuaderno, un bolígrafo y un diccionario.', en: 'For Spanish class I need a notebook, a pen and a dictionary.' },
    { speaker: 'Jiwon', es: 'Los lunes tengo matemáticas, ciencias y educación física.', en: 'On Mondays I have maths, science and PE.' },
    { speaker: 'Jiwon', es: '¿Y vosotros? ¿Cuál es vuestra asignatura favorita? ¡Escribid un comentario!', en: 'And you? What is your favourite subject? Write a comment!' },
  ],
  glossary: {
    todos: 'everyone',
    'Corea del Sur': 'South Korea',
    estudio: 'I study',
    colegio: 'school',
    simpática: 'nice, friendly',
    aburrida: 'boring (girl word, for la historia)',
    vuestra: 'your (you all)',
    escribid: 'write! (you all)',
    comentario: 'comment',
  },
  questions: [
    { id: 'q1', kind: 'choice', criterion: 'Bi', q: 'Which school things does Jiwon need for Spanish?', options: ['Un cuaderno, un bolígrafo y un diccionario', 'Una regla y unas tijeras', 'Un ordenador y una calculadora'], answer: 'Un cuaderno, un bolígrafo y un diccionario' },
    { id: 'q2', kind: 'truefalse', criterion: 'Bi', statement: 'Jiwon es de Japón.', en: 'Jiwon is from Japan.', answer: false, evidence: 1 },
    { id: 'q3', kind: 'truefalse', criterion: 'Bi', statement: 'A Jiwon no le gusta la historia.', en: 'Jiwon does not like history.', answer: true, evidence: 5 },
    { id: 'q4', kind: 'choice', criterion: 'Bi', q: '¿Por qué le gusta el español a Jiwon?', en: 'Why does Jiwon like Spanish?', options: ['Porque es interesante y su profesora es simpática', 'Porque es fácil', 'Porque tiene clase los lunes'], answer: 'Porque es interesante y su profesora es simpática' },
    { id: 'q5', kind: 'choice', criterion: 'Bii', q: 'How can you tell this is a blog?', options: ['She greets her readers and asks them to write a comment', 'It has a list of prices', 'Two people take turns to speak'], answer: 'She greets her readers and asks them to write a comment', why: 'A blog talks to its readers: "¡Hola a todos!" at the start and "¡Escribid un comentario!" at the end.' },
    { id: 'q6', kind: 'you', criterion: 'Biii', q: '¿Y tú? ¿Cuál es tu asignatura favorita? ¿Por qué?', en: 'And you? What is your favourite subject? Why?', starts: ['mi asignatura favorita es', 'me gusta'], example: 'Mi asignatura favorita es el arte porque es divertido.' },
  ],
};
