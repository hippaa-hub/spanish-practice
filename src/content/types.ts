// What the app teaches. One file per unit; nothing else needs changing to add one.

export type ItemKind = 'word' | 'phrase' | 'verbform' | 'sound' | 'syllable';

/** An item is the thing the memory engine tracks: a word, phrase, verb form or sound. */
export type Item = {
  id: string;
  es: string;
  en: string;
  kind: ItemKind;
  /** Name of an SVG picture drawn in code (see src/art/Picture.tsx). */
  icon?: string;
  /** Other answers that are also right. */
  alt?: string[];
  /** A short note shown after an answer (e.g. "h is always silent"). */
  note?: string;
  /** For sounds: words that start with (or contain) this sound. */
  examples?: string[];
  /** Say it with this text instead of `es` (e.g. a letter name vs its sound). */
  say?: string;
};

/** A sentence is reused by several exercise types. */
export type Sentence = {
  id: string;
  es: string;
  en: string;
  /** Item ids this sentence practises. */
  items: string[];
  /**
   * Fill-the-gap / choose-the-verb data. `es` must contain "___" where the gap is.
   * `options` are shown as buttons; `hint` is the infinitive (vivir), shown in brackets.
   */
  gap?: { answer: string; options?: string[]; hint?: string };
  /** Mark questions so the app can ask her to answer them. */
  question?: boolean;
};

export type NodeKind = 'normal' | 'sounds' | 'verbs' | 'check' | 'story';

/** A "getting to know you" question she answers in her own words. */
export type OpenQuestion = {
  id: string;
  es: string;
  en: string;
  /** An answer is right if it starts with one of these and then says something. */
  starts: string[];
  /** What a good answer looks like, shown afterwards. */
  example: string;
  items: string[];
};

/** Tú or usted? A situation, and which form it takes. */
export type Situation = {
  id: string;
  en: string;
  answer: 'tú' | 'usted';
  why: string;
};

/** A short dialogue she puts back in order (her teacher's format). */
export type Dialogue = {
  id: string;
  title: string;
  /** In the right order; the app shuffles them. */
  lines: { es: string; en: string }[];
  items: string[];
};

/**
 * A short text with several gaps, filled one at a time — her teacher's
 * "complete the self-introduction" exercise.
 */
export type GapText = {
  id: string;
  title: string;
  en: string;
  /** Plain strings and gaps, in order. */
  parts: (string | { answer: string; options: string[]; hint?: string })[];
  items: string[];
};

/** Find the odd one out (her teacher's format). */
export type OddOneOut = {
  id: string;
  options: string[];
  answer: string;
  why: string;
};

/** One round button on the path. */
export type PathNode = {
  id: string;
  title: string;
  kind?: NodeKind;
  /** Items this lesson teaches (3 to 6). A Unit Check teaches nothing new. */
  teaches: string[];
  /** Sentence ids this lesson can use. */
  sentences?: string[];
  /** Open questions she answers in her own words (level 4 and Unit Checks). */
  questions?: string[];
  /** Tú or usted situations. */
  situations?: string[];
  /** Dialogues to put in order. */
  dialogues?: string[];
  /** Odd one out groups. */
  oddOneOut?: string[];
  /** Short texts with several gaps. */
  gapTexts?: string[];
  /** For a Unit Check: a line telling her what the test covers. */
  about?: string;
  /** For a story stop on the path: which story it opens. */
  story?: string;
  /** For a writing stop (the Identity Iceberg): which writing task it opens. */
  write?: string;
};

// ---------------------------------------------------------------- stories

/** How a character is drawn (src/art/Avatar.tsx). */
export type Look = {
  skin: string;
  hair: string;
  shirt: string;
  /** A drawn portrait in public/cast/ (Canva). Without one, the face is drawn in code. */
  pic?: string;
  long?: boolean;
  glasses?: boolean;
  grownUp?: boolean;
};

export type StoryLine = { speaker: string; es: string; en: string };

/**
 * Questions in her teacher's Criterion B style:
 * Bi facts (choice, or true/false + justify by tapping the line that proves it),
 * Bii what kind of text it is and what it is for,
 * Biii a personal answer: "¿Y tú?".
 */
export type StoryQuestion =
  | { id: string; kind: 'choice'; criterion: 'Bi' | 'Bii'; q: string; en?: string; options: string[]; answer: string; why?: string }
  | { id: string; kind: 'truefalse'; criterion: 'Bi'; statement: string; en: string; answer: boolean; evidence: number }
  | { id: string; kind: 'you'; criterion: 'Biii'; q: string; en: string; starts: string[]; example: string };

export type Story = {
  id: string;
  title: string;
  en: string;
  /** What kind of text it is — her teacher asks about this (Bii). */
  type: 'dialogue' | 'blog' | 'poster';
  /** The unit whose words it uses. */
  unit: number;
  /** A picture for the scene (src/art/Picture.tsx). */
  scene: string;
  cast: Record<string, Look>;
  lines: StoryLine[];
  /** New words that are not in her units, shown with their meaning when tapped. */
  glossary: Record<string, string>;
  questions: StoryQuestion[];
};

export type Tips = { title: string; lines: string[]; table?: { head: string[]; rows: string[][] } };

/** A word for the reading track: she builds it from syllable tiles. */
export type ReadWord = { es: string; en: string; syllables: string[] };

export type Unit = {
  id: string;
  number: number;
  title: string;
  subtitle: string;
  colour: string;
  tips?: Tips;
  items: Item[];
  sentences: Sentence[];
  readWords?: ReadWord[];
  questions?: OpenQuestion[];
  situations?: Situation[];
  dialogues?: Dialogue[];
  oddOneOut?: OddOneOut[];
  gapTexts?: GapText[];
  nodes: PathNode[];
};
