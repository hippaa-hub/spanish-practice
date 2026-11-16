export type ExerciseLevel = 1 | 2 | 3 | 4;

/** One screen inside a lesson. `itemIds` are what the answer tells us about. */
export type Exercise =
  | { kind: 'teach'; key: string; itemIds: string[]; itemId: string }
  | { kind: 'pick-image'; key: string; itemIds: string[]; itemId: string; options: string[] }
  | { kind: 'listen-pick'; key: string; itemIds: string[]; itemId: string; options: string[] }
  | { kind: 'sound-word'; key: string; itemIds: string[]; itemId: string; options: string[]; answer: string }
  | { kind: 'build-word'; key: string; itemIds: string[]; target: string; tiles: string[]; hint: string }
  | { kind: 'tiles'; key: string; itemIds: string[]; sentenceId: string; direction: 'es-en' | 'en-es'; tiles: string[]; answer: string; prompt: string }
  | { kind: 'match'; key: string; itemIds: string[] }
  | { kind: 'gap'; key: string; itemIds: string[]; sentenceId: string }
  // Phase 2: the harder types her teacher also uses
  | { kind: 'type-heard'; key: string; itemIds: string[]; answer: string; en: string }
  | { kind: 'type-translate'; key: string; itemIds: string[]; prompt: string; answer: string }
  | { kind: 'answer-question'; key: string; itemIds: string[]; questionId: string }
  | { kind: 'tu-usted'; key: string; itemIds: string[]; situationId: string }
  | { kind: 'order-dialogue'; key: string; itemIds: string[]; dialogueId: string }
  | { kind: 'odd-one-out'; key: string; itemIds: string[]; groupId: string }
  | { kind: 'complete-text'; key: string; itemIds: string[]; textId: string }
  // Phase 4: say the sentence; the app records it
  | { kind: 'speak'; key: string; itemIds: string[]; sentenceId: string };

export type ExerciseKind = Exercise['kind'];

/** What the engine remembers about one item (one word, phrase, verb form or sound). */
export type ItemMemory = {
  id: string;
  /** Local date, YYYY-MM-DD. */
  lastSeen: string;
  right: number;
  wrong: number;
  /** Days until she is about 50% likely to still know it. */
  halfLife: number;
};

export type NodeProgress = {
  /** 0 = not started, 1 to 4 = levels finished (4 = gold). */
  level: number;
};

export type Progress = {
  version: 1;
  /** Local date of the last day the daily goal was met. */
  lastGoalDay: string | null;
  /** Local date of the last day she practised at all. */
  lastActiveDay: string | null;
  streak: number;
  freezes: number;
  dailyGoal: number;
  xpToday: number;
  xpTotal: number;
  /** YYYY-MM-DD -> xp earned that day, for the streak calendar. */
  days: Record<string, number>;
  nodes: Record<string, NodeProgress>;
  memory: Record<string, ItemMemory>;
  badges: string[];
  muted: boolean;
  /** Story id -> how many times she has read it to the end. */
  stories: Record<string, number>;
  /** Her own writing, saved as she types. Never sent anywhere. */
  writing: Record<string, WritingDraft>;
  /** YYYY-MM-DD -> minutes spent in lessons, stories, speaking and writing. */
  minutes: Record<string, number>;
  /** Monday of the last week whose report card she has seen. */
  lastReportWeek: string | null;
  /** YYYY-MM-DD -> what she did that day, for the report sent to a parent's phone. */
  activity: Record<string, import('./notify').DayActivity>;
  /** The parent code, scrambled. Unset until a parent chooses one. */
  parentPin?: string;
  /** Private ntfy channel for notifications to a parent's phone. Unset means off. */
  notifyTopic?: string;
};

export type WritingDraft = {
  parts: Record<string, string>;
  /** Local date of the last change. */
  updated: string;
  /** Local date she last pressed "Terminado". */
  finished?: string;
};

export const emptyProgress = (): Progress => ({
  version: 1,
  lastGoalDay: null,
  lastActiveDay: null,
  streak: 0,
  freezes: 0,
  dailyGoal: 20,
  xpToday: 0,
  xpTotal: 0,
  days: {},
  nodes: {},
  memory: {},
  badges: [],
  muted: false,
  stories: {},
  writing: {},
  minutes: {},
  lastReportWeek: null,
  activity: {},
});
