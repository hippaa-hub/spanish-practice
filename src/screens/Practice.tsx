import { Coco } from '../art/Coco';
import { nextTest } from '../content';
import { dayKey } from '../engine/dates';
import { strength } from '../engine/memory';
import type { Progress } from '../engine/types';
import { verbItemIds } from '../engine/lesson';

export type PracticeKind = 'fix' | 'review' | 'verbs';

/** The items each practice session uses, weakest first. */
export const practiceItems = (p: Progress, kind: PracticeKind, today = dayKey()): string[] => {
  const met = Object.values(p.memory);
  const weakestFirst = [...met].sort((a, b) => strength(a, today) - strength(b, today));
  switch (kind) {
    case 'fix':
      return weakestFirst.filter((m) => m.wrong > 0).slice(0, 8).map((m) => m.id);
    case 'review':
      return weakestFirst.filter((m) => strength(m, today) < 0.5).slice(0, 8).map((m) => m.id);
    case 'verbs':
      return verbItemIds(p.memory, today).filter((id) => p.memory[id]).slice(0, 8);
  }
};

export const Practice = ({
  progress,
  onStart,
  onWords,
  onTestPrep,
}: {
  progress: Progress;
  onStart: (kind: PracticeKind) => void;
  onWords: () => void;
  onTestPrep: () => void;
}) => {
  const test = nextTest && nextTest.date >= dayKey() ? nextTest : null;
  const fix = practiceItems(progress, 'fix');
  const review = practiceItems(progress, 'review');
  const verbs = practiceItems(progress, 'verbs');
  const nothingYet = Object.keys(progress.memory).length === 0;

  return (
    <main className="screen">
      <h1>Práctica</h1>
      <p className="lead">Extra practice. It gives XP like a lesson, and it is the fastest way to make a word stick.</p>

      {test && (
        <button className="practice-card" style={{ borderColor: 'var(--warm)' }} onClick={onTestPrep}>
          <span className="ico">📝</span>
          <span>
            <h3>Test prep · {test.title}</h3>
            <p>{test.date} — {test.topics}</p>
          </span>
        </button>
      )}

      <button className="practice-card" onClick={() => onStart('fix')} disabled={fix.length < 3}>
        <span className="ico">🔧</span>
        <span>
          <h3>Fix my mistakes</h3>
          <p>{fix.length >= 3 ? `${fix.length} words you have got wrong` : 'Nothing to fix yet — nice!'}</p>
        </span>
      </button>

      <button className="practice-card" onClick={() => onStart('review')} disabled={review.length < 3}>
        <span className="ico">🧠</span>
        <span>
          <h3>Words to review</h3>
          <p>{review.length >= 3 ? `${review.length} words are fading` : 'Nothing is due today'}</p>
        </span>
      </button>

      <button className="practice-card" onClick={() => onStart('verbs')} disabled={verbs.length < 3}>
        <span className="ico">⚡</span>
        <span>
          <h3>Verbos</h3>
          <p>{verbs.length >= 3 ? 'ser · llamarse · hablar · vivir · tener' : 'Do Unit 4 first'}</p>
        </span>
      </button>

      <button className="practice-card" onClick={onWords}>
        <span className="ico">📖</span>
        <span>
          <h3>Mis palabras</h3>
          <p>{Object.keys(progress.memory).length} words met — see which ones are fading</p>
        </span>
      </button>

      {nothingYet && (
        <div className="coco-hello" style={{ marginTop: 24 }}>
          <Coco mood="think" size={80} />
          <div className="speech-bubble">Do a lesson first — then I will know what needs practising.</div>
        </div>
      )}
    </main>
  );
};
