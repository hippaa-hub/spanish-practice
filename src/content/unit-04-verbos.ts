import type { Unit } from './types';

/**
 * Unit 4 — the six verbs from her teacher's grammar poster, one node each.
 * The "yo" forms she already met in Unit 2 are reused, not taught twice.
 */
export const unit4: Unit = {
  id: 'u4',
  number: 4,
  title: 'Los verbos',
  subtitle: 'SER · LLAMARSE · HABLAR · VIVIR · TENER · DEDICARSE',
  colour: '#8b5cf6',
  tips: {
    title: 'How the endings work',
    lines: [
      'HABLAR is the regular -ar pattern: hablo, hablas, habla, hablamos, habláis, hablan. Every -ar verb does this.',
      'VIVIR is the regular -ir pattern: vivo, vives, vive, vivimos, vivís, viven.',
      'SER and TENER are irregular — they have to be learned by heart.',
      'LLAMARSE and DEDICARSE are reflexive: the little word changes too (me, te, se, nos, os, se).',
      'SER is for permanent things: who you are, where you are from, your job, your character. Soy estudiante. Ella es simpática.',
    ],
    table: {
      head: ['', 'SER', 'LLAMARSE', 'HABLAR', 'VIVIR', 'TENER'],
      rows: [
        ['yo', 'soy', 'me llamo', 'hablo', 'vivo', 'tengo'],
        ['tú', 'eres', 'te llamas', 'hablas', 'vives', 'tienes'],
        ['él / ella / usted', 'es', 'se llama', 'habla', 'vive', 'tiene'],
        ['nosotros/as', 'somos', 'nos llamamos', 'hablamos', 'vivimos', 'tenemos'],
        ['vosotros/as', 'sois', 'os llamáis', 'habláis', 'vivís', 'tenéis'],
        ['ellos / ellas / ustedes', 'son', 'se llaman', 'hablan', 'viven', 'tienen'],
      ],
    },
  },
  items: [
    // SER (soy and eres are taught in Unit 2)
    { id: 'v.es', es: 'es', en: 'he / she is, you are (polite) — ser', kind: 'verbform' },
    { id: 'v.somos', es: 'somos', en: 'we are — ser', kind: 'verbform' },
    { id: 'v.sois', es: 'sois', en: 'you all are — ser', kind: 'verbform' },
    { id: 'v.son', es: 'son', en: 'they are — ser', kind: 'verbform' },
    // LLAMARSE (me llamo is taught in Unit 2)
    { id: 'v.tellamas', es: 'te llamas', en: 'you are called — llamarse', kind: 'verbform' },
    { id: 'v.sellama', es: 'se llama', en: 'he / she is called — llamarse', kind: 'verbform' },
    { id: 'v.nosllamamos', es: 'nos llamamos', en: 'we are called — llamarse', kind: 'verbform' },
    { id: 'v.osllamais', es: 'os llamáis', en: 'you all are called — llamarse', kind: 'verbform' },
    { id: 'v.sellaman', es: 'se llaman', en: 'they are called — llamarse', kind: 'verbform' },
    // HABLAR
    { id: 'v.hablo', es: 'hablo', en: 'I speak — hablar', kind: 'verbform' },
    { id: 'v.hablas', es: 'hablas', en: 'you speak — hablar', kind: 'verbform' },
    { id: 'v.habla', es: 'habla', en: 'he / she speaks — hablar', kind: 'verbform' },
    { id: 'v.hablamos', es: 'hablamos', en: 'we speak — hablar', kind: 'verbform' },
    { id: 'v.hablais', es: 'habláis', en: 'you all speak — hablar', kind: 'verbform' },
    { id: 'v.hablan', es: 'hablan', en: 'they speak — hablar', kind: 'verbform' },
    // VIVIR (vivo and vives are taught in Unit 2)
    { id: 'v.vive', es: 'vive', en: 'he / she lives — vivir', kind: 'verbform' },
    { id: 'v.vivimos', es: 'vivimos', en: 'we live — vivir', kind: 'verbform' },
    { id: 'v.vivis', es: 'vivís', en: 'you all live — vivir', kind: 'verbform' },
    { id: 'v.viven', es: 'viven', en: 'they live — vivir', kind: 'verbform' },
    // TENER (tengo is taught in Unit 2)
    { id: 'v.tienes', es: 'tienes', en: 'you have — tener', kind: 'verbform' },
    { id: 'v.tiene', es: 'tiene', en: 'he / she has — tener', kind: 'verbform' },
    { id: 'v.tenemos', es: 'tenemos', en: 'we have — tener', kind: 'verbform' },
    { id: 'v.teneis', es: 'tenéis', en: 'you all have — tener', kind: 'verbform' },
    { id: 'v.tienen', es: 'tienen', en: 'they have — tener', kind: 'verbform' },
    // DEDICARSE
    { id: 'v.adquetededicas', es: '¿a qué te dedicas?', en: 'what do you do for a living?', kind: 'phrase', icon: 'question' },
    { id: 'v.mededico', es: 'me dedico a', en: 'I work in / I do — dedicarse', kind: 'verbform' },
    { id: 'v.tededicas', es: 'te dedicas a', en: 'you do — dedicarse', kind: 'verbform' },
    { id: 'v.sededica', es: 'se dedica a', en: 'he / she does — dedicarse', kind: 'verbform' },
  ],
  sentences: [
    // SER
    { id: 'u4.ser1', es: 'Nosotros ___ estudiantes.', en: 'We are students.', items: ['v.somos'], gap: { answer: 'somos', options: ['soy', 'somos', 'son'], hint: 'ser' } },
    { id: 'u4.ser2', es: 'Ellos ___ de Argentina.', en: 'They are from Argentina.', items: ['v.son'], gap: { answer: 'son', options: ['es', 'sois', 'son'], hint: 'ser' } },
    { id: 'u4.ser3', es: 'Mateo ___ mi compañero.', en: 'Mateo is my classmate.', items: ['v.es'], gap: { answer: 'es', options: ['es', 'eres', 'soy'], hint: 'ser' } },
    { id: 'u4.ser4', es: 'Vosotras ___ muy simpáticas.', en: 'You all are very nice.', items: ['v.sois'], gap: { answer: 'sois', options: ['sois', 'somos', 'son'], hint: 'ser' } },
    // LLAMARSE
    { id: 'u4.lla1', es: '¿Cómo ___ tú?', en: 'What is your name?', items: ['v.tellamas'], gap: { answer: 'te llamas', options: ['me llamo', 'te llamas', 'se llama'], hint: 'llamarse' } },
    { id: 'u4.lla2', es: 'Mi profesora ___ Ana.', en: 'My teacher is called Ana.', items: ['v.sellama'], gap: { answer: 'se llama', options: ['se llama', 'te llamas', 'nos llamamos'], hint: 'llamarse' } },
    { id: 'u4.lla3', es: 'Ellos ___ Carlos y Elena.', en: 'They are called Carlos and Elena.', items: ['v.sellaman'], gap: { answer: 'se llaman', options: ['se llaman', 'se llama', 'os llamáis'], hint: 'llamarse' } },
    // HABLAR
    { id: 'u4.hab1', es: 'Yo ___ georgiano, inglés y un poco de español.', en: 'I speak Georgian, English and a little Spanish.', items: ['v.hablo'], gap: { answer: 'hablo', options: ['hablo', 'hablas', 'habla'], hint: 'hablar' } },
    { id: 'u4.hab2', es: '¿Tú ___ español?', en: 'Do you speak Spanish?', items: ['v.hablas'], gap: { answer: 'hablas', options: ['hablas', 'habláis', 'hablan'], hint: 'hablar' } },
    { id: 'u4.hab3', es: 'Nosotros ___ en clase.', en: 'We speak in class.', items: ['v.hablamos'], gap: { answer: 'hablamos', options: ['hablamos', 'habláis', 'hablan'], hint: 'hablar' } },
    { id: 'u4.hab4', es: 'Ellas ___ francés.', en: 'They speak French.', items: ['v.hablan'], gap: { answer: 'hablan', options: ['hablan', 'habla', 'hablamos'], hint: 'hablar' } },
    // VIVIR
    { id: 'u4.viv1', es: 'Nosotros ___ en Tiflis.', en: 'We live in Tbilisi.', items: ['v.vivimos'], gap: { answer: 'vivimos', options: ['vivo', 'vivimos', 'viven'], hint: 'vivir' } },
    { id: 'u4.viv2', es: 'Mateo ___ en Alicante.', en: 'Mateo lives in Alicante.', items: ['v.vive'], gap: { answer: 'vive', options: ['vive', 'vives', 'vivo'], hint: 'vivir' } },
    { id: 'u4.viv3', es: 'Mis amigos ___ en España.', en: 'My friends live in Spain.', items: ['v.viven'], gap: { answer: 'viven', options: ['viven', 'vivís', 'vivimos'], hint: 'vivir' } },
    // TENER
    { id: 'u4.ten1', es: '¿Cuántos años ___ tú?', en: 'How old are you?', items: ['v.tienes'], gap: { answer: 'tienes', options: ['tengo', 'tienes', 'tiene'], hint: 'tener' } },
    { id: 'u4.ten2', es: 'Lucía ___ un gato.', en: 'Lucía has a cat.', items: ['v.tiene'], gap: { answer: 'tiene', options: ['tiene', 'tienes', 'tenemos'], hint: 'tener' } },
    { id: 'u4.ten3', es: 'Nosotras ___ examen mañana.', en: 'We have a test tomorrow.', items: ['v.tenemos'], gap: { answer: 'tenemos', options: ['tenemos', 'tenéis', 'tienen'], hint: 'tener' } },
    { id: 'u4.ten4', es: 'Ellos ___ dos hermanos.', en: 'They have two brothers.', items: ['v.tienen'], gap: { answer: 'tienen', options: ['tienen', 'tiene', 'tenéis'], hint: 'tener' } },
    // DEDICARSE
    { id: 'u4.ded1', es: '¿A qué ___ tú?', en: 'What do you do for a living?', items: ['v.tededicas'], gap: { answer: 'te dedicas', options: ['te dedicas', 'me dedico', 'se dedica'], hint: 'dedicarse' } },
    { id: 'u4.ded2', es: 'Yo ___ a estudiar.', en: 'I am a student.', items: ['v.mededico'], gap: { answer: 'me dedico', options: ['me dedico', 'te dedicas', 'nos dedicamos'], hint: 'dedicarse' } },

    // choose the right verb — her teacher's "Me llamo / Soy" format
    { id: 'u4.c1', es: 'Ellos ___ inglés.', en: 'They speak English.', items: ['v.hablan', 'v.son'], gap: { answer: 'hablan', options: ['hablan', 'son'] } },
    { id: 'u4.c2', es: 'Ella ___ profesora.', en: 'She is a teacher.', items: ['v.es'], gap: { answer: 'es', options: ['es', 'tiene'] } },
    { id: 'u4.c3', es: 'Nosotros ___ en Georgia.', en: 'We live in Georgia.', items: ['v.vivimos'], gap: { answer: 'vivimos', options: ['vivimos', 'somos'] } },
    { id: 'u4.c4', es: 'Mi hermano ___ diez años.', en: 'My brother is ten years old.', items: ['v.tiene'], gap: { answer: 'tiene', options: ['tiene', 'es'] } },

    // plain sentences for tiles and dictation
    { id: 'u4.p1', es: 'Mi profesora se llama Ana.', en: 'My teacher is called Ana.', items: ['v.sellama'] },
    { id: 'u4.p2', es: 'Hablamos español en clase.', en: 'We speak Spanish in class.', items: ['v.hablamos'] },
    { id: 'u4.p3', es: 'Ellos viven en España.', en: 'They live in Spain.', items: ['v.viven'] },
    { id: 'u4.p4', es: 'Tenemos un examen mañana.', en: 'We have a test tomorrow.', items: ['v.tenemos'] },
  ],
  gapTexts: [
    {
      id: 'u4.daniel',
      title: 'Complete Daniel’s self-introduction',
      en: 'Hello! My name is Daniel. I am from Mexico and I live in Madrid. I am a student and I speak Spanish and English.',
      items: ['v.mellamo', 'v.soy', 'v.vivo', 'v.hablo'],
      parts: [
        '¡Hola! ',
        { answer: 'Me llamo', options: ['Me llamo', 'Te llamas', 'Se llama'], hint: 'llamarse' },
        ' Daniel. ',
        { answer: 'Soy', options: ['Soy', 'Eres', 'Es'], hint: 'ser' },
        ' de México y ',
        { answer: 'vivo', options: ['vivo', 'vives', 'vive'], hint: 'vivir' },
        ' en Madrid. Soy estudiante y ',
        { answer: 'hablo', options: ['hablo', 'hablas', 'habla'], hint: 'hablar' },
        ' español e inglés.',
      ],
    },
    {
      id: 'u4.lucia',
      title: 'Complete Lucía’s profile',
      en: 'She is called Lucía. She is Spanish, she lives in Alicante and she has two brothers.',
      items: ['v.sellama', 'v.es', 'v.vive', 'v.tiene'],
      parts: [
        '',
        { answer: 'Se llama', options: ['Se llama', 'Me llamo', 'Nos llamamos'], hint: 'llamarse' },
        ' Lucía. ',
        { answer: 'Es', options: ['Es', 'Soy', 'Son'], hint: 'ser' },
        ' española, ',
        { answer: 'vive', options: ['vive', 'vivo', 'viven'], hint: 'vivir' },
        ' en Alicante y ',
        { answer: 'tiene', options: ['tiene', 'tengo', 'tienen'], hint: 'tener' },
        ' dos hermanos.',
      ],
    },
  ],
  questions: [
    { id: 'u4.q1', es: '¿De dónde eres?', en: 'Where are you from?', starts: ['soy de', 'soy'], example: 'Soy de Georgia.', items: ['v.soy'] },
    { id: 'u4.q2', es: '¿Dónde vives?', en: 'Where do you live?', starts: ['vivo en', 'vivo'], example: 'Vivo en Tiflis.', items: ['v.vivo'] },
    { id: 'u4.q3', es: '¿Qué lenguas hablas?', en: 'What languages do you speak?', starts: ['hablo'], example: 'Hablo georgiano, inglés y un poco de español.', items: ['v.hablo'] },
    { id: 'u4.q4', es: '¿A qué te dedicas?', en: 'What do you do?', starts: ['soy', 'me dedico'], example: 'Soy estudiante.', items: ['v.mededico'] },
  ],
  nodes: [
    { id: 'u4.n1', title: 'SER', kind: 'verbs', teaches: ['v.es', 'v.somos', 'v.sois', 'v.son'], sentences: ['u4.ser1', 'u4.ser2', 'u4.ser3', 'u4.ser4', 'u4.c2'] },
    { id: 'u4.n2', title: 'LLAMARSE', kind: 'verbs', teaches: ['v.tellamas', 'v.sellama', 'v.nosllamamos', 'v.osllamais', 'v.sellaman'], sentences: ['u4.lla1', 'u4.lla2', 'u4.lla3', 'u4.p1'] },
    { id: 'u4.n3', title: 'HABLAR (-ar)', kind: 'verbs', teaches: ['v.hablo', 'v.hablas', 'v.habla', 'v.hablamos', 'v.hablais', 'v.hablan'], sentences: ['u4.hab1', 'u4.hab2', 'u4.hab3', 'u4.hab4', 'u4.p2'] },
    { id: 'u4.n4', title: 'VIVIR (-ir)', kind: 'verbs', teaches: ['v.vive', 'v.vivimos', 'v.vivis', 'v.viven'], sentences: ['u4.viv1', 'u4.viv2', 'u4.viv3', 'u4.p3'] },
    { id: 'u4.n5', title: 'TENER', kind: 'verbs', teaches: ['v.tienes', 'v.tiene', 'v.tenemos', 'v.teneis', 'v.tienen'], sentences: ['u4.ten1', 'u4.ten2', 'u4.ten3', 'u4.ten4', 'u4.p4'] },
    { id: 'u4.n6', title: 'DEDICARSE', kind: 'verbs', teaches: ['v.adquetededicas', 'v.mededico', 'v.tededicas', 'v.sededica'], sentences: ['u4.ded1', 'u4.ded2'], questions: ['u4.q4'] },
    { id: 'u4.n7', title: 'Todos mezclados', kind: 'verbs', teaches: ['v.es', 'v.tiene', 'v.hablan', 'v.vivimos', 'v.son'], sentences: ['u4.c1', 'u4.c2', 'u4.c3', 'u4.c4'], gapTexts: ['u4.lucia'] },
    {
      id: 'u4.check', title: 'Unit Check', kind: 'check', teaches: [],
      about: 'Complete Daniel’s self-introduction, then the six verbs mixed — like your teacher’s test.',
      gapTexts: ['u4.daniel', 'u4.lucia'],
      questions: ['u4.q1', 'u4.q2', 'u4.q3'],
    },
  ],
};
