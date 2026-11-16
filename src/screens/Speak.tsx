import { useState } from 'react';
import { Coco } from '../art/Coco';
import { Confetti } from '../art/Confetti';
import { sfxFinish } from '../audio/sfx';
import { stopSpeaking } from '../audio/speech';
import { SpeakCard, type SpeakTarget } from '../components/SpeakCard';
import { units } from '../content';
import type { Unit } from '../content/types';
import { XP_LESSON } from '../engine/progress';
import type { Progress } from '../engine/types';
import { ME_PRESENTO, sentences } from '../engine/writing';

export type SpeakItem = { target: SpeakTarget; itemIds: string[] };
export type SpeakSet = { title: string; items: SpeakItem[] };

/** Listen and repeat: up to six whole sentences from a unit. */
export const repeatSet = (unit: Unit): SpeakSet => ({
  title: `Repite · ${unit.title}`,
  items: unit.sentences
    .filter((s) => !s.gap)
    .slice(0, 6)
    .map((s) => ({ target: { mode: 'repeat', es: s.es, en: s.en }, itemIds: s.items })),
});

/** Answer the class questions out loud, about herself. */
export const answerSet = (unit: Unit): SpeakSet => ({
  title: `Responde · ${unit.title}`,
  items: (unit.questions ?? []).map((q) => ({
    target: { mode: 'answer', question: q.es, en: q.en, starts: q.starts, example: q.example },
    itemIds: q.items,
  })),
});

/** Her own ¡Me presento! text, sentence by sentence — practice for a spoken presentation. */
export const presentationSet = (p: Progress): SpeakSet | null => {
  const draft = p.writing[ME_PRESENTO.id];
  if (!draft) return null;
  const text = ME_PRESENTO.parts.map((part) => draft.parts[part.id] ?? '').join(' ');
  const lines = sentences(text);
  if (lines.length < 2) return null;
  return {
    title: 'Mi presentación',
    items: lines.map((l) => ({ target: { mode: 'repeat', es: `${l}.`, en: 'Your own sentence' }, itemIds: [] })),
  };
};

export const SpeakHome = ({ progress, onStart }: { progress: Progress; onStart: (set: SpeakSet) => void }) => {
  const presentation = presentationSet(progress);
  const withSentences = units.filter((u) => u.number > 0 && u.sentences.some((s) => !s.gap));
  return (
    <main className="screen">
      <h1>Hablar</h1>
      <p className="lead">
        Speaking is what Duolingo skips and your teacher tests (Criterion C). Listen to Coco, then say it yourself.
        Your recordings stay on this phone and disappear when you close the screen.
      </p>

      {presentation && (
        <button className="practice-card" onClick={() => onStart(presentation)}>
          <span className="ico">🎤</span>
          <span>
            <h3>Mi presentación</h3>
            <p>Say your own ¡Me presento! text out loud, sentence by sentence.</p>
          </span>
        </button>
      )}

      <h2 className="section-title">Responde — answer about yourself</h2>
      {units
        .filter((u) => (u.questions ?? []).length > 0)
        .map((u) => (
          <button key={`a-${u.id}`} className="practice-card compact" onClick={() => onStart(answerSet(u))}>
            <span className="ico">💬</span>
            <span>
              <h3>Unit {u.number}: {u.title}</h3>
              <p>{(u.questions ?? []).length} questions</p>
            </span>
          </button>
        ))}

      <h2 className="section-title">Repite — listen and repeat</h2>
      {withSentences.map((u) => (
        <button key={`r-${u.id}`} className="practice-card compact" onClick={() => onStart(repeatSet(u))}>
          <span className="ico">🔁</span>
          <span>
            <h3>Unit {u.number}: {u.title}</h3>
            <p>{Math.min(6, u.sentences.filter((s) => !s.gap).length)} sentences</p>
          </span>
        </button>
      ))}
    </main>
  );
};

export const SpeakSession = ({
  set,
  onAnswer,
  onFinish,
  onQuit,
}: {
  set: SpeakSet;
  onAnswer: (itemIds: string[], correct: boolean) => void;
  onFinish: (xp: number) => void;
  onQuit: () => void;
}) => {
  const [at, setAt] = useState(0);
  const [good, setGood] = useState(0);
  const [done, setDone] = useState(false);

  if (done) {
    return (
      <div className="finish">
        <Confetti />
        <Coco mood="cheer" size={130} />
        <h1>¡Qué bien hablas!</h1>
        <p style={{ color: 'var(--ink-soft)', margin: 0 }}>{set.title}</p>
        <div className="scoreboard">
          <div className="score" style={{ background: 'var(--sun)' }}>
            <div><div className="label">XP</div><div className="value" style={{ color: '#d9a51f' }}>+{XP_LESSON}</div></div>
          </div>
          <div className="score" style={{ background: 'var(--teal)' }}>
            <div><div className="label">Said well</div><div className="value" style={{ color: 'var(--teal-dark)' }}>{good}/{set.items.length}</div></div>
          </div>
        </div>
        <button className="btn" onClick={onQuit}>Continue</button>
      </div>
    );
  }

  const item = set.items[at];
  return (
    <div className="lesson">
      <div className="lesson-head">
        <button className="quit" onClick={() => { stopSpeaking(); onQuit(); }} aria-label="Close">✕</button>
        <div className="bar"><i style={{ width: `${(at / set.items.length) * 100}%` }} /></div>
      </div>
      <div className="lesson-body" key={at}>
        <h2 className="instruction">{item.target.mode === 'repeat' ? 'Listen, then say it' : 'Answer out loud'}</h2>
        <SpeakCard
          target={item.target}
          onDone={(correct) => {
            if (correct) {
              setGood(good + 1);
              if (item.itemIds.length) onAnswer(item.itemIds, true);
            }
            if (at + 1 >= set.items.length) {
              sfxFinish();
              onFinish(XP_LESSON);
              setDone(true);
            } else setAt(at + 1);
          }}
        />
      </div>
    </div>
  );
};
