import { useRef, useState } from 'react';
import { Coco } from '../art/Coco';
import { Confetti } from '../art/Confetti';
import { Fireworks } from '../art/Effects';
import { speak, stopSpeaking } from '../audio/speech';
import { sfxFinish } from '../audio/sfx';
import { AccentBar } from '../components/AccentBar';
import type { Progress } from '../engine/types';
import {
  partDone,
  ruleMet,
  sentences,
  verbHints,
  WRITING_TASKS,
  type WritingPart,
  type WritingTask,
} from '../engine/writing';

const textOf = (p: Progress, task: WritingTask) =>
  task.parts.map((part) => (p.writing[task.id]?.parts[part.id] ?? '').trim()).filter(Boolean).join(' ');

/** The Escribir tab: her two writing tasks and how far she has got. */
export const WriteHome = ({ progress, onOpen }: { progress: Progress; onOpen: (task: WritingTask) => void }) => (
  <main className="screen">
    <h1>Escribir</h1>
    <p className="lead">
      Write your own texts, one part at a time. Coco ticks off each part and points at verbs to check — but every
      sentence is yours. Finishing one gives 15 XP.
    </p>
    {WRITING_TASKS.map((task) => {
      const draft = progress.writing[task.id];
      const done = task.parts.filter((part) => partDone(draft?.parts[part.id] ?? '', part)).length;
      return (
        <button key={task.id} className="practice-card" onClick={() => onOpen(task)}>
          <span className="ico">{task.id === 'w.iceberg' ? '🧊' : '✍️'}</span>
          <span>
            <h3>{task.title}</h3>
            <p>{task.en}</p>
            <p>
              {done}/{task.parts.length} parts ready
              {draft?.finished ? ` · finished ${draft.finished}` : draft ? ' · draft saved' : ''}
            </p>
          </span>
        </button>
      );
    })}
  </main>
);

const Checklist = ({ text, part }: { text: string; part: WritingPart }) => (
  <ul className="checklist">
    {part.rules.map((r) => {
      const ok = ruleMet(text, r);
      return (
        <li key={r.label} className={ok ? 'ok' : ''}>
          <span className="mark">{ok ? '✓' : '○'}</span>
          {r.label}
        </li>
      );
    })}
  </ul>
);

const Hints = ({ text }: { text: string }) => {
  const hints = verbHints(text);
  if (!hints.length) return null;
  return (
    <div className="hints">
      <strong>Check your verbs</strong>
      {hints.map((h) => (
        <div key={h.found}>
          You wrote <em>“{h.found}”</em> — try <em>{h.tryInstead}</em>. {h.why}
        </div>
      ))}
    </div>
  );
};

/** The finished text on an iceberg: what people see above the water, the rest below. */
const IcebergPicture = ({ task, progress }: { task: WritingTask; progress: Progress }) => {
  const zone = (z: 'above' | 'below') =>
    task.parts
      .filter((p) => p.zone === z)
      .flatMap((p) => sentences(progress.writing[task.id]?.parts[p.id] ?? ''));
  return (
    <div className="iceberg">
      <svg viewBox="0 0 320 300" className="iceberg-art" aria-hidden="true">
        <rect x="0" y="0" width="320" height="96" fill="#dff3ff" />
        <rect x="0" y="96" width="320" height="204" fill="#2b6cb0" />
        <path d="M120 96 L150 40 L172 58 L196 30 L214 96z" fill="#ffffff" stroke="#9fd8f5" strokeWidth="3" />
        <path d="M70 96 L250 96 L284 190 L230 280 L100 290 L40 200z" fill="#bfe6fb" opacity="0.92" />
        <path d="M0 96 h320" stroke="#ffffff" strokeWidth="3" strokeDasharray="10 8" />
      </svg>
      <div className="ice-above">
        {zone('above').map((s) => <span key={s}>{s}.</span>)}
      </div>
      <div className="ice-below">
        {zone('below').map((s) => <span key={s}>{s}.</span>)}
      </div>
    </div>
  );
};

export const WriteCoach = ({
  task,
  progress,
  onSave,
  onFinish,
  onQuit,
}: {
  task: WritingTask;
  progress: Progress;
  onSave: (partId: string, text: string) => void;
  onFinish: () => number;
  onQuit: () => void;
}) => {
  const [at, setAt] = useState(0);
  const [done, setDone] = useState<number | null>(null);
  const area = useRef<HTMLTextAreaElement | null>(null);
  const reviewing = at === task.parts.length;
  const part = task.parts[at];
  const text = part ? (progress.writing[task.id]?.parts[part.id] ?? '') : '';
  const whole = textOf(progress, task);
  const total = sentences(whole).length;

  /** Puts a starter (or accent) where the cursor is — her text around it is untouched. */
  const insert = (piece: string, starter = false) => {
    const el = area.current;
    const start = el?.selectionStart ?? text.length;
    const end = el?.selectionEnd ?? text.length;
    const before = text.slice(0, start);
    const lead = starter && before && !/\s$/.test(before) ? ' ' : '';
    const tail = starter ? ' ' : '';
    const next = before + lead + piece + tail + text.slice(end);
    onSave(part.id, next);
    requestAnimationFrame(() => {
      const pos = (before + lead + piece + tail).length;
      el?.focus();
      el?.setSelectionRange(pos, pos);
    });
  };

  if (done !== null) {
    return (
      <div className="finish">
        <Confetti />
        <Fireworks />
        <Coco mood="cheer" size={130} />
        <h1>¡Muy bien escrito!</h1>
        <p style={{ color: 'var(--ink-soft)', margin: 0 }}>{task.title} · {total} sentences</p>
        <div className="scoreboard">
          <div className="score" style={{ background: 'var(--sun)' }}>
            <div>
              <div className="label">XP</div>
              <div className="value" style={{ color: '#d9a51f' }}>+{done}</div>
            </div>
          </div>
        </div>
        {done === 0 && <p className="lead">Saved again. XP for this text comes once a day.</p>}
        <p className="lead">Your text is saved on this phone. You can open it and improve it any time.</p>
        <button className="btn" onClick={onQuit}>Continue</button>
      </div>
    );
  }

  return (
    <div className="lesson write">
      <div className="lesson-head">
        <button className="quit" onClick={() => { stopSpeaking(); onQuit(); }} aria-label="Close">✕</button>
        <div className="bar"><i style={{ width: `${(at / task.parts.length) * 100}%` }} /></div>
      </div>

      <div className="story-head">
        <span style={{ fontSize: 34 }}>{task.id === 'w.iceberg' ? '🧊' : '✍️'}</span>
        <div>
          <h2>{task.title}</h2>
          <div className="steps">
            {task.parts.map((p, n) => {
              const ok = partDone(progress.writing[task.id]?.parts[p.id] ?? '', p);
              return (
                <button key={p.id} className={`step ${n === at ? 'on' : ok ? 'past' : ''}`} onClick={() => setAt(n)}>
                  {ok ? '✓ ' : ''}{p.title}
                </button>
              );
            })}
            <button className={`step ${reviewing ? 'on' : ''}`} onClick={() => setAt(task.parts.length)}>Tu texto</button>
          </div>
        </div>
      </div>

      {!reviewing && part && (
        <div className="lesson-body" key={part.id}>
          {at === 0 && <p className="step-hint" style={{ margin: '0 0 12px' }}>{task.intro}</p>}
          <h2 className="instruction" style={{ marginBottom: 6 }}>{part.title}</h2>
          <p className="gap-en" style={{ marginBottom: 12 }}>{part.prompt}</p>
          <div className="starters">
            <span className="starters-label">Start a sentence:</span>
            {part.starters.map((s) => (
              <button key={s} className="chip" onClick={() => insert(s, true)}>{s}…</button>
            ))}
          </div>
          <textarea
            ref={area}
            className="typed write-area"
            value={text}
            rows={6}
            autoCapitalize="sentences"
            autoCorrect="off"
            spellCheck={false}
            placeholder="Write in Spanish here…"
            onChange={(e) => onSave(part.id, e.target.value)}
          />
          <AccentBar onInsert={(ch) => insert(ch)} />
          <Checklist text={text} part={part} />
          <Hints text={text} />
        </div>
      )}

      {reviewing && (
        <div className="lesson-body">
          <h2 className="instruction" style={{ marginBottom: 6 }}>Tu texto</h2>
          <p className={`gap-en ${total >= task.totalSentences.min ? 'ok-text' : ''}`}>
            {total} sentences — aim for {task.totalSentences.min} to {task.totalSentences.max}.
          </p>
          {task.id === 'w.iceberg' ? (
            <IcebergPicture task={task} progress={progress} />
          ) : (
            <div className="my-text">{whole || 'Nothing written yet.'}</div>
          )}
          <button className="chip" style={{ marginTop: 12 }} onClick={() => speak(whole)} disabled={!whole}>
            🔊 Listen to your text
          </button>
          {task.parts.map((p) => (
            <div key={p.id} className="review-part">
              <h4>{partDone(progress.writing[task.id]?.parts[p.id] ?? '', p) ? '✓' : '○'} {p.title}</h4>
              <Checklist text={progress.writing[task.id]?.parts[p.id] ?? ''} part={p} />
            </div>
          ))}
          <Hints text={whole} />
        </div>
      )}

      <div className="footer write-footer">
        {at > 0 && (
          <button className="btn ghost" onClick={() => setAt(at - 1)}>◀</button>
        )}
        {reviewing ? (
          <button
            className="btn"
            disabled={total === 0}
            onClick={() => {
              sfxFinish();
              setDone(onFinish());
            }}
          >
            Terminado
          </button>
        ) : (
          <button className="btn" onClick={() => setAt(at + 1)}>
            {partDone(text, part) ? 'Next part' : 'Next part (come back later)'}
          </button>
        )}
      </div>
    </div>
  );
};
