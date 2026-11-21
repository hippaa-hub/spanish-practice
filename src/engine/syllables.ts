/**
 * A small rule-based Spanish syllabifier, for the Syllable builder game.
 * Spanish syllables are regular: a consonant between two vowels starts the
 * next syllable (me-sa), two consonants split unless they are a cluster that
 * stays together (li-bro, es-cri-bir), and i/u glue to a neighbouring vowel
 * (cua-der-no) unless they carry the accent (ge-o-gra-fí-a).
 * Words the rules get wrong have an override in src/content/games.ts.
 */

const VOWELS = 'aeiouáéíóúü';
const STRONG = 'aeoáéóíú'; // an accented i/u also breaks a diphthong, so it counts as strong
const DIGRAPHS = ['ch', 'll', 'rr', 'qu', 'gu'];
const CLUSTERS = ['pr', 'br', 'tr', 'dr', 'cr', 'gr', 'fr', 'pl', 'bl', 'cl', 'gl', 'fl'];

type Piece = { text: string; vowel: boolean };

const isVowel = (ch: string) => VOWELS.includes(ch);

/** y is a vowel at the end of a word or before a consonant (soy, muy), a consonant before a vowel (yo). */
const vowelAt = (word: string, i: number): boolean => {
  const ch = word[i];
  if (isVowel(ch)) return true;
  return ch === 'y' && (i === word.length - 1 || !isVowel(word[i + 1] ?? ''));
};

/** Split into vowel groups and consonant units (a digraph is one unit). */
const pieces = (word: string): Piece[] => {
  const out: Piece[] = [];
  let i = 0;
  while (i < word.length) {
    const two = word.slice(i, i + 2);
    // qu/gu before e or i: the u is silent, so it belongs with the consonant.
    if ((two === 'qu' || two === 'gu') && 'eié'.includes(word[i + 2] ?? '') ) {
      out.push({ text: two, vowel: false });
      i += 2;
      continue;
    }
    if (DIGRAPHS.includes(two) && two !== 'qu' && two !== 'gu') {
      out.push({ text: two, vowel: false });
      i += 2;
      continue;
    }
    const ch = word[i];
    if (vowelAt(word, i)) {
      let group = ch;
      let j = i + 1;
      // Keep vowels together while they make a diphthong: at least one weak (i, u, y, unaccented) vowel.
      while (j < word.length && vowelAt(word, j)) {
        const prev = group[group.length - 1];
        const next = word[j];
        const weak = (c: string) => !STRONG.includes(c);
        if (weak(prev) || weak(next)) {
          group += next;
          j += 1;
        } else break;
      }
      out.push({ text: group, vowel: true });
      i = j;
    } else {
      out.push({ text: ch, vowel: false });
      i += 1;
    }
  }
  return out;
};

/** The syllables of a lower-case word (letters only). */
const splitLower = (word: string): string[] => {
  const ps = pieces(word);
  const syllables: string[] = [];
  let current = '';
  let i = 0;
  while (i < ps.length) {
    const p = ps[i];
    if (!p.vowel) {
      current += p.text;
      i += 1;
      continue;
    }
    current += p.text;
    // Consonants between this vowel group and the next decide where the syllable ends.
    const cons: string[] = [];
    let j = i + 1;
    while (j < ps.length && !ps[j].vowel) {
      cons.push(ps[j].text);
      j += 1;
    }
    const nextVowel = j < ps.length;
    if (!nextVowel) {
      current += cons.join('');
      syllables.push(current);
      current = '';
      i = j;
      continue;
    }
    let keep = 0; // how many of the consonants stay with this syllable
    if (cons.length === 2) keep = CLUSTERS.includes(cons.join('')) ? 0 : 1;
    else if (cons.length === 3) keep = CLUSTERS.includes(cons.slice(1).join('')) ? 1 : 2;
    else if (cons.length >= 4) keep = 2;
    current += cons.slice(0, keep).join('');
    syllables.push(current);
    current = cons.slice(keep).join('');
    i = j;
  }
  if (current) {
    if (syllables.length) syllables[syllables.length - 1] += current;
    else syllables.push(current);
  }
  return syllables;
};

/**
 * Syllables of a word, keeping its own capital letters.
 * Only the letters are split; a word with a space or a hyphen is not supported.
 */
export const syllabify = (word: string): string[] => {
  const lower = word.toLowerCase();
  const parts = splitLower(lower);
  const out: string[] = [];
  let at = 0;
  for (const part of parts) {
    out.push(word.slice(at, at + part.length));
    at += part.length;
  }
  return out;
};
