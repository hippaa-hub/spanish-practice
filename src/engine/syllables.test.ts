import { describe, expect, it } from 'vitest';
import { units } from '../content';
import { bareWord, SYLLABLE_OVERRIDES } from '../content/games';
import { builderPool, syllablesOf } from './games';
import { syllabify } from './syllables';

/** Words from her units, split by hand, to check the rules against. */
const KNOWN: [string, string[]][] = [
  ['mesa', ['me', 'sa']],
  ['mapa', ['ma', 'pa']],
  ['hola', ['ho', 'la']],
  ['goma', ['go', 'ma']],
  ['casa', ['ca', 'sa']],
  ['tiza', ['ti', 'za']],
  ['libro', ['li', 'bro']],
  ['lápiz', ['lá', 'piz']],
  ['mochila', ['mo', 'chi', 'la']],
  ['pizarra', ['pi', 'za', 'rra']],
  ['español', ['es', 'pa', 'ñol']],
  ['cuaderno', ['cua', 'der', 'no']],
  ['gracias', ['gra', 'cias']],
  ['adiós', ['a', 'diós']],
  ['estudiante', ['es', 'tu', 'dian', 'te']],
  ['bolígrafo', ['bo', 'lí', 'gra', 'fo']],
  ['sacapuntas', ['sa', 'ca', 'pun', 'tas']],
  ['diccionario', ['dic', 'cio', 'na', 'rio']],
  ['tijeras', ['ti', 'je', 'ras']],
  ['estuche', ['es', 'tu', 'che']],
  ['ordenador', ['or', 'de', 'na', 'dor']],
  ['calculadora', ['cal', 'cu', 'la', 'do', 'ra']],
  ['carpeta', ['car', 'pe', 'ta']],
  ['matemáticas', ['ma', 'te', 'má', 'ti', 'cas']],
  ['ciencias', ['cien', 'cias']],
  ['historia', ['his', 'to', 'ria']],
  ['geografía', ['ge', 'o', 'gra', 'fí', 'a']],
  ['música', ['mú', 'si', 'ca']],
  ['arte', ['ar', 'te']],
  ['lunes', ['lu', 'nes']],
  ['miércoles', ['miér', 'co', 'les']],
  ['jueves', ['jue', 'ves']],
  ['viernes', ['vier', 'nes']],
  ['domingo', ['do', 'min', 'go']],
  ['inteligente', ['in', 'te', 'li', 'gen', 'te']],
  ['trabajadora', ['tra', 'ba', 'ja', 'do', 'ra']],
  ['difícil', ['di', 'fí', 'cil']],
  ['cuatro', ['cua', 'tro']],
  ['siete', ['sie', 'te']],
  ['nueve', ['nue', 've']],
  ['diez', ['diez']],
  ['dieciséis', ['die', 'ci', 'séis']],
  ['veinte', ['vein', 'te']],
  ['encantada', ['en', 'can', 'ta', 'da']],
  ['hermano', ['her', 'ma', 'no']],
  ['perro', ['pe', 'rro']],
  ['apellido', ['a', 'pe', 'lli', 'do']],
  ['regla', ['re', 'gla']],
  ['borrador', ['bo', 'rra', 'dor']],
  ['canadiense', ['ca', 'na', 'dien', 'se']],
  ['marroquí', ['ma', 'rro', 'quí']],
  ['nosotros', ['no', 'so', 'tros']],
  ['ellos', ['e', 'llos']],
  ['usted', ['us', 'ted']],
  ['aburrido', ['a', 'bu', 'rri', 'do']],
  ['escribir', ['es', 'cri', 'bir']],
  ['comprender', ['com', 'pren', 'der']],
  ['leer', ['le', 'er']],
  ['soy', ['soy']],
  ['yo', ['yo']],
  ['quince', ['quin', 'ce']],
  ['lengua', ['len', 'gua']],
  ['Tiflis', ['Ti', 'flis']],
  ['educación', ['e', 'du', 'ca', 'ción']],
  ['independiente', ['in', 'de', 'pen', 'dien', 'te']],
];

describe('the Spanish syllabifier', () => {
  it('splits more than 30 words from her units the way a Spanish dictionary does', () => {
    expect(KNOWN.length).toBeGreaterThanOrEqual(30);
    for (const [word, want] of KNOWN) expect(syllabify(word), word).toEqual(want);
  });

  it('agrees with the hand-split reading words in Unit 0', () => {
    for (const u of units) for (const w of u.readWords ?? []) expect(syllablesOf(w.es), w.es).toEqual(w.syllables);
  });

  it('never loses or adds a letter', () => {
    for (const u of units) {
      for (const i of u.items) {
        if (i.kind === 'sound' || i.kind === 'syllable') continue;
        const w = bareWord(i.es);
        if (!/^[a-záéíóúñü]+$/i.test(w)) continue;
        expect(syllablesOf(w).join(''), w).toBe(w);
        for (const s of syllablesOf(w)) expect(/[aeiouáéíóúüy]/i.test(s), `${w}: ${s} has no vowel`).toBe(true);
      }
    }
  });

  it('uses the overrides where the rules fail', () => {
    expect(syllabify('dieciocho')).not.toEqual(SYLLABLE_OVERRIDES.dieciocho);
    expect(syllablesOf('dieciocho')).toEqual(['die', 'ci', 'o', 'cho']);
  });

  it('gives the builder only words from her units with two syllables or more', () => {
    const pool = builderPool();
    const content = new Set([
      ...units.flatMap((u) => u.items.map((i) => bareWord(i.es).toLowerCase())),
      ...units.flatMap((u) => (u.readWords ?? []).map((w) => w.es.toLowerCase())),
    ]);
    expect(pool.length).toBeGreaterThan(30);
    for (const w of pool) {
      expect(content.has(w.word.toLowerCase()), `${w.word} is not in the content`).toBe(true);
      expect(w.syllables.length, w.word).toBeGreaterThanOrEqual(2);
    }
  });
});
