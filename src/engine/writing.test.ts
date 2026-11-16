import { describe, expect, it } from 'vitest';
import { ICEBERG, ME_PRESENTO, partDone, ruleMet, sentences, verbHints, WRITING_TASKS } from './writing';

const part = (id: string) => ME_PRESENTO.parts.find((p) => p.id === id)!;

describe('the writing checklist', () => {
  it('counts sentences, ignoring ¿ ¡ and one-word scraps', () => {
    expect(sentences('¡Hola! Me llamo Adele. Tengo doce años. Sí.')).toEqual(['Me llamo Adele', 'Tengo doce años']);
  });

  it('ticks off the "yo" part when name, age, languages and ser are there', () => {
    expect(partDone('¡Hola! Me llamo Adele. Tengo doce años. Soy de Georgia. Hablo georgiano e inglés.', part('yo'))).toBe(true);
    expect(partDone('Me llamo Adele.', part('yo'))).toBe(false);
  });

  it('finds three different school things, with or without accents', () => {
    const rule = part('material').rules[0];
    expect(ruleMet('En mi mochila tengo un lapiz, un cuaderno y una regla.', rule)).toBe(true);
    expect(ruleMet('Tengo un lápiz y un lápiz y un lápiz.', rule)).toBe(false);
  });

  it('wants a like, a dislike, two subjects and porque', () => {
    const text = 'Me gusta el arte porque es divertido. No me gusta la historia porque es difícil.';
    expect(partDone(text, part('asignaturas'))).toBe(true);
    expect(partDone('Me gusta el arte.', part('asignaturas'))).toBe(false);
  });

  it("follows the teacher's iceberg steps: 3 above, 6 below, explain 3, three questions", () => {
    expect(ICEBERG.parts.map((p) => p.id)).toEqual(['arriba', 'abajo', 'explica', 'reflexion']);
    const explain = ICEBERG.parts.find((p) => p.id === 'explica')!;
    expect(partDone('My family is important because they teach me. Me gusta el arte porque es divertido. Hablo tres lenguas because I live in Tbilisi.', explain)).toBe(true);
  });

  it('builds the Identity Iceberg from 3 + 6 + explain + reflect', () => {
    const above = ICEBERG.parts.find((p) => p.id === 'arriba')!;
    expect(partDone('Soy alta. Tengo el pelo largo. Llevo gafas.', above)).toBe(true);
    expect(partDone('Soy alta. Llevo gafas.', above)).toBe(false);
  });
});

describe('verb hints', () => {
  it('spots the wrong person after yo', () => {
    expect(verbHints('Yo es Adele.')[0].tryInstead).toBe('yo soy');
    expect(verbHints('Yo tiene doce años.')[0].tryInstead).toBe('yo tengo');
    expect(verbHints('Yo vive en Tiflis.')[0].tryInstead).toBe('yo vivo');
  });

  it('spots "soy doce años" — age uses tener', () => {
    expect(verbHints('Soy doce años.').some((h) => h.why.includes('TENER'))).toBe(true);
  });

  it('spots "me llama" and "me gusta las …s"', () => {
    expect(verbHints('Me llama Adele.')[0].tryInstead).toBe('me llamo');
    expect(verbHints('Me gusta las matemáticas.')[0].tryInstead).toContain('gustan');
  });

  it('stays quiet on correct Spanish', () => {
    expect(verbHints('¡Hola! Me llamo Adele. Tengo doce años. Soy de Georgia y vivo en Tiflis. Hablo georgiano. Mi profesora se llama Ana. Me gustan las ciencias porque son interesantes.')).toEqual([]);
  });
});

describe('the coach never writes for her', () => {
  it('only offers sentence beginnings, never whole sentences', () => {
    for (const task of WRITING_TASKS) {
      for (const p of task.parts) {
        for (const starter of p.starters) {
          expect(/[.!?]$/.test(starter), `${task.id}/${p.id}: "${starter}" is a whole sentence`).toBe(false);
          expect(starter.split(/\s+/).length, `${task.id}/${p.id}: "${starter}" is too long`).toBeLessThanOrEqual(6);
        }
      }
    }
  });
});
