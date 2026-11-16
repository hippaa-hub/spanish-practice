import { useEffect, useState } from 'react';
import { Picture } from '../art/Picture';
import { speak } from '../audio/speech';
import { sfxTap } from '../audio/sfx';
import { AccentBar } from '../components/AccentBar';
import { Spanish, SpanishSentence } from '../components/SpanishWord';
import { getDialogue, getGapText, getItem, getOddOneOut, getQuestion, getSentence, getSituation } from '../content';
import type { Exercise } from '../engine/types';

export type Answer = { value: string; ready: boolean };

const Speaker = ({ text, small = false }: { text: string; small?: boolean }) => (
  <button className={`speaker ${small ? 'small' : ''}`} onClick={() => speak(text)} aria-label="Play">
    🔊
  </button>
);

/** 0. See it: picture, Spanish, English, audio. */
export const Teach = ({ e }: { e: Extract<Exercise, { kind: 'teach' }> }) => {
  const item = getItem(e.itemId);
  useEffect(() => {
    if (item) speak(item.say ?? item.es);
  }, [item]);
  if (!item) return null;
  const isSound = item.kind === 'sound' || item.kind === 'syllable';
  return (
    <div className="teach">
      {isSound ? <div className="sound-letter">{item.es}</div> : <Picture name={item.icon} size={110} />}
      {!isSound && (
        <div className="es">
          <Spanish text={item.es} />
        </div>
      )}
      <div className="en">{item.en}</div>
      <div style={{ marginTop: 14 }}>
        <Speaker text={item.say ?? item.es} />
      </div>
      {item.examples && (
        <div style={{ marginTop: 16, fontSize: 18 }}>
          {item.examples.map((w) => (
            <span key={w} style={{ margin: '0 8px' }}>
              <Spanish text={w} />
            </span>
          ))}
        </div>
      )}
      {item.note && <div className="note">{item.note}</div>}
    </div>
  );
};

/** 1. Tap the picture for the word. */
export const PickImage = ({
  e,
  answer,
  setAnswer,
  showing,
}: {
  e: Extract<Exercise, { kind: 'pick-image' }>;
  answer: Answer;
  setAnswer: (a: Answer) => void;
  showing: boolean;
}) => {
  const item = getItem(e.itemId);
  useEffect(() => {
    if (item) speak(item.es);
  }, [item]);
  if (!item) return null;
  return (
    <>
      <div className="prompt-card">
        <Speaker text={item.es} />
        <div className="big">
          <Spanish text={item.es} />
        </div>
      </div>
      <div className="choices">
        {e.options.map((id) => {
          const option = getItem(id);
          const picked = answer.value === id;
          const state = showing ? (id === e.itemId ? 'right' : picked ? 'wrong' : '') : picked ? 'picked' : '';
          return (
            <button
              key={id}
              className={`choice ${state}`}
              onClick={() => {
                if (showing) return;
                sfxTap();
                setAnswer({ value: id, ready: true });
              }}
            >
              <Picture name={option?.icon} size={64} />
              {showing && <span style={{ fontSize: 14 }}>{option?.es}</span>}
            </button>
          );
        })}
      </div>
    </>
  );
};

/** 2. Listen and pick the right word. */
export const ListenPick = ({
  e,
  answer,
  setAnswer,
  showing,
}: {
  e: Extract<Exercise, { kind: 'listen-pick' }>;
  answer: Answer;
  setAnswer: (a: Answer) => void;
  showing: boolean;
}) => {
  const item = getItem(e.itemId);
  useEffect(() => {
    if (item) speak(item.say ?? item.es);
  }, [item]);
  if (!item) return null;
  return (
    <>
      <div className="prompt-card">
        <Speaker text={item.say ?? item.es} />
        <div style={{ fontSize: 15, color: 'var(--ink-soft)' }}>Tap to hear it again</div>
      </div>
      <div className="choices list">
        {e.options.map((id) => {
          const option = getItem(id);
          const picked = answer.value === id;
          const state = showing ? (id === e.itemId ? 'right' : picked ? 'wrong' : '') : picked ? 'picked' : '';
          return (
            <button
              key={id}
              className={`choice text ${state}`}
              onClick={() => {
                if (showing) return;
                sfxTap();
                setAnswer({ value: id, ready: true });
              }}
            >
              <span>{option?.es}</span>
              {showing && <span style={{ marginLeft: 'auto', fontSize: 13, color: 'var(--ink-soft)' }}>{option?.en}</span>}
            </button>
          );
        })}
      </div>
    </>
  );
};

/** 3. Reading track: which word has this sound? */
export const SoundWord = ({
  e,
  answer,
  setAnswer,
  showing,
}: {
  e: Extract<Exercise, { kind: 'sound-word' }>;
  answer: Answer;
  setAnswer: (a: Answer) => void;
  showing: boolean;
}) => {
  const item = getItem(e.itemId);
  useEffect(() => {
    if (item) speak(item.say ?? item.es, { slow: true });
  }, [item]);
  if (!item) return null;
  return (
    <>
      <div style={{ textAlign: 'center', marginBottom: 18 }}>
        <div className="sound-letter">{item.es}</div>
        <Speaker text={item.say ?? item.es} />
        <div style={{ fontSize: 15, color: 'var(--ink-soft)', marginTop: 8 }}>{item.en}</div>
      </div>
      <div className="choices">
        {e.options.map((w) => {
          const picked = answer.value === w;
          const state = showing ? (w === e.answer ? 'right' : picked ? 'wrong' : '') : picked ? 'picked' : '';
          return (
            <button
              key={w}
              className={`choice text ${state}`}
              onClick={() => {
                if (showing) return;
                speak(w, { slow: true });
                setAnswer({ value: w, ready: true });
              }}
            >
              {w}
            </button>
          );
        })}
      </div>
    </>
  );
};

const TileAnswer = ({
  chosen,
  bank,
  onPick,
  onUnpick,
  showing,
}: {
  chosen: string[];
  bank: string[];
  onPick: (i: number) => void;
  onUnpick: (i: number) => void;
  showing: boolean;
}) => (
  <>
    <div className="answer-line">
      {chosen.map((t, i) => (
        <button key={`${t}-${i}`} className="tile" onClick={() => !showing && onUnpick(i)}>
          {t}
        </button>
      ))}
    </div>
    <div className="tile-bank">
      {bank.map((t, i) => (
        <button key={`${t}-${i}`} className="tile" onClick={() => !showing && onPick(i)} disabled={showing}>
          {t}
        </button>
      ))}
    </div>
  </>
);

/** 4. Build the word from syllable tiles (reading track). */
export const BuildWord = ({
  e,
  setAnswer,
  showing,
}: {
  e: Extract<Exercise, { kind: 'build-word' }>;
  setAnswer: (a: Answer) => void;
  showing: boolean;
}) => {
  const [chosen, setChosen] = useState<string[]>([]);
  const [bank, setBank] = useState(e.tiles);
  const update = (c: string[]) => {
    setChosen(c);
    setAnswer({ value: c.join(''), ready: c.length > 0 });
  };
  return (
    <>
      <div style={{ marginBottom: 14, fontSize: 17, color: 'var(--ink-soft)' }}>
        Build the word for <strong style={{ color: 'var(--ink)' }}>{e.hint}</strong>
      </div>
      <TileAnswer
        chosen={chosen}
        bank={bank}
        showing={showing}
        onPick={(i) => {
          speak(bank[i], { slow: true });
          update([...chosen, bank[i]]);
          setBank(bank.filter((_, j) => j !== i));
        }}
        onUnpick={(i) => {
          setBank([...bank, chosen[i]]);
          update(chosen.filter((_, j) => j !== i));
        }}
      />
    </>
  );
};

/** 5. Translate by tapping word tiles. */
export const Tiles = ({
  e,
  setAnswer,
  showing,
}: {
  e: Extract<Exercise, { kind: 'tiles' }>;
  setAnswer: (a: Answer) => void;
  showing: boolean;
}) => {
  const [chosen, setChosen] = useState<string[]>([]);
  const [bank, setBank] = useState(e.tiles);
  const update = (c: string[]) => {
    setChosen(c);
    setAnswer({ value: c.join(' '), ready: c.length > 0 });
  };
  return (
    <>
      <div className="prompt-card">
        {e.direction === 'es-en' ? <Speaker text={e.prompt} /> : <Picture name="speech" size={48} />}
        <div style={{ fontSize: 20 }}>
          {e.direction === 'es-en' ? <SpanishSentence text={e.prompt} /> : e.prompt}
        </div>
      </div>
      <TileAnswer
        chosen={chosen}
        bank={bank}
        showing={showing}
        onPick={(i) => {
          if (e.direction === 'en-es') speak(bank[i], { slow: true });
          update([...chosen, bank[i]]);
          setBank(bank.filter((_, j) => j !== i));
        }}
        onUnpick={(i) => {
          setBank([...bank, chosen[i]]);
          update(chosen.filter((_, j) => j !== i));
        }}
      />
    </>
  );
};

/** 6. Match five pairs. */
export const Match = ({
  e,
  onDone,
}: {
  e: Extract<Exercise, { kind: 'match' }>;
  onDone: (correct: boolean) => void;
}) => {
  const items = e.itemIds.map(getItem).filter(Boolean) as NonNullable<ReturnType<typeof getItem>>[];
  const [left] = useState(() => [...items].sort(() => Math.random() - 0.5));
  const [right] = useState(() => [...items].sort(() => Math.random() - 0.5));
  const [picked, setPicked] = useState<string | null>(null);
  const [gone, setGone] = useState<string[]>([]);
  const [wrong, setWrong] = useState(0);
  const [flash, setFlash] = useState<string | null>(null);

  const tapEn = (id: string) => {
    if (!picked) return;
    if (picked === id) {
      const next = [...gone, id];
      setGone(next);
      setPicked(null);
      if (next.length === items.length) setTimeout(() => onDone(wrong === 0), 350);
    } else {
      setWrong(wrong + 1);
      setFlash(id);
      setTimeout(() => setFlash(null), 400);
      setPicked(null);
    }
  };

  return (
    <div className="match">
      <div style={{ display: 'grid', gap: 10 }}>
        {left.map((i) => (
          <button
            key={i.id}
            className={`choice text ${gone.includes(i.id) ? 'gone' : picked === i.id ? 'picked' : ''}`}
            onClick={() => {
              speak(i.es);
              setPicked(i.id);
            }}
          >
            {i.es}
          </button>
        ))}
      </div>
      <div style={{ display: 'grid', gap: 10 }}>
        {right.map((i) => (
          <button
            key={i.id}
            className={`choice text ${gone.includes(i.id) ? 'gone' : flash === i.id ? 'wrong' : ''}`}
            onClick={() => tapEn(i.id)}
          >
            {i.en}
          </button>
        ))}
      </div>
    </div>
  );
};

/** 7. Fill the gap / choose the right verb. */
export const Gap = ({
  e,
  answer,
  setAnswer,
  showing,
}: {
  e: Extract<Exercise, { kind: 'gap' }>;
  answer: Answer;
  setAnswer: (a: Answer) => void;
  showing: boolean;
}) => {
  const sentence = getSentence(e.sentenceId);
  if (!sentence?.gap) return null;
  const [before, after] = sentence.es.split('___');
  const typed = !sentence.gap.options;
  return (
    <>
      <div className="gap-sentence">
        <SpanishSentence text={before} />
        <span className="gap-slot">{showing || !typed ? answer.value || '?' : answer.value || '?'}</span>
        <SpanishSentence text={after ?? ''} />
      </div>
      {sentence.gap.hint && <div className="gap-hint">({sentence.gap.hint})</div>}
      <div className="gap-en">{sentence.en}</div>
      {typed ? (
        <>
          <input
            className="typed"
            value={answer.value}
            autoCapitalize="off"
            autoCorrect="off"
            spellCheck={false}
            disabled={showing}
            placeholder="Type the missing word"
            onChange={(ev) => setAnswer({ value: ev.target.value, ready: ev.target.value.trim().length > 0 })}
          />
          <AccentBar onInsert={(ch) => setAnswer({ value: answer.value + ch, ready: true })} />
        </>
      ) : (
        <div className="choices list">
          {sentence.gap.options?.map((o) => {
            const picked = answer.value === o;
            const state = showing ? (o === sentence.gap?.answer ? 'right' : picked ? 'wrong' : '') : picked ? 'picked' : '';
            return (
              <button
                key={o}
                className={`choice text ${state}`}
                onClick={() => {
                  if (showing) return;
                  speak(o, { slow: true });
                  setAnswer({ value: o, ready: true });
                }}
              >
                {o}
              </button>
            );
          })}
        </div>
      )}
    </>
  );
};

/** An input with the accent buttons under it — used by every typing exercise. */
export const TypedAnswer = ({
  answer,
  setAnswer,
  showing,
  placeholder,
}: {
  answer: Answer;
  setAnswer: (a: Answer) => void;
  showing: boolean;
  placeholder: string;
}) => (
  <>
    <input
      className="typed"
      value={answer.value}
      autoCapitalize="off"
      autoCorrect="off"
      spellCheck={false}
      disabled={showing}
      placeholder={placeholder}
      onChange={(e) => setAnswer({ value: e.target.value, ready: e.target.value.trim().length > 0 })}
    />
    <AccentBar onInsert={(ch) => setAnswer({ value: answer.value + ch, ready: true })} />
  </>
);

/** 8. Type what you hear (dictation). */
export const TypeHeard = ({
  e,
  answer,
  setAnswer,
  showing,
}: {
  e: Extract<Exercise, { kind: 'type-heard' }>;
  answer: Answer;
  setAnswer: (a: Answer) => void;
  showing: boolean;
}) => {
  useEffect(() => {
    speak(e.answer);
  }, [e.answer]);
  return (
    <>
      <div className="prompt-card">
        <Speaker text={e.answer} />
        <div style={{ fontSize: 15, color: 'var(--ink-soft)' }}>
          Tap to hear it again, then write it.
        </div>
      </div>
      <button className="speaker small" style={{ marginBottom: 14 }} onClick={() => speak(e.answer, { slow: true })} aria-label="Play slowly">
        🐢
      </button>
      <TypedAnswer answer={answer} setAnswer={setAnswer} showing={showing} placeholder="Write what you hear" />
      {showing && <div className="gap-en" style={{ marginTop: 14 }}>{e.en}</div>}
    </>
  );
};

/** 9. Type the translation. */
export const TypeTranslate = ({
  e,
  answer,
  setAnswer,
  showing,
}: {
  e: Extract<Exercise, { kind: 'type-translate' }>;
  answer: Answer;
  setAnswer: (a: Answer) => void;
  showing: boolean;
}) => (
  <>
    <div className="prompt-card">
      <Picture name="speech" size={48} />
      <div style={{ fontSize: 20 }}>{e.prompt}</div>
    </div>
    <TypedAnswer answer={answer} setAnswer={setAnswer} showing={showing} placeholder="Write it in Spanish" />
  </>
);

/** 10. Answer the question in your own words. */
export const AnswerQuestion = ({
  e,
  answer,
  setAnswer,
  showing,
}: {
  e: Extract<Exercise, { kind: 'answer-question' }>;
  answer: Answer;
  setAnswer: (a: Answer) => void;
  showing: boolean;
}) => {
  const q = getQuestion(e.questionId);
  useEffect(() => {
    if (q) speak(q.es);
  }, [q]);
  if (!q) return null;
  return (
    <>
      <div className="prompt-card">
        <Speaker text={q.es} />
        <div>
          <div style={{ fontSize: 20 }}>
            <SpanishSentence text={q.es} />
          </div>
          <div style={{ fontSize: 14, color: 'var(--ink-soft)' }}>{q.en}</div>
        </div>
      </div>
      <div className="gap-hint">Answer about yourself. Start with “{q.starts[0]}…”.</div>
      <TypedAnswer answer={answer} setAnswer={setAnswer} showing={showing} placeholder="Your answer in Spanish" />
      {showing && (
        <div className="note-card">
          <strong>For example:</strong> <SpanishSentence text={q.example} />
        </div>
      )}
    </>
  );
};

/** 11. Tú or usted? */
export const TuUsted = ({
  e,
  answer,
  setAnswer,
  showing,
}: {
  e: Extract<Exercise, { kind: 'tu-usted' }>;
  answer: Answer;
  setAnswer: (a: Answer) => void;
  showing: boolean;
}) => {
  const s = getSituation(e.situationId);
  if (!s) return null;
  return (
    <>
      <div className="prompt-card">
        <Picture name="speech" size={48} />
        <div style={{ fontSize: 18 }}>{s.en}</div>
      </div>
      <div className="choices">
        {(['tú', 'usted'] as const).map((option) => {
          const picked = answer.value === option;
          const state = showing ? (option === s.answer ? 'right' : picked ? 'wrong' : '') : picked ? 'picked' : '';
          return (
            <button
              key={option}
              className={`choice ${state}`}
              style={{ fontSize: 24, minHeight: 90 }}
              onClick={() => {
                if (showing) return;
                speak(option);
                setAnswer({ value: option, ready: true });
              }}
            >
              {option}
            </button>
          );
        })}
      </div>
      {showing && <div className="note-card">{s.why}</div>}
    </>
  );
};

/** 12. Odd one out. */
export const OddOneOut = ({
  e,
  answer,
  setAnswer,
  showing,
}: {
  e: Extract<Exercise, { kind: 'odd-one-out' }>;
  answer: Answer;
  setAnswer: (a: Answer) => void;
  showing: boolean;
}) => {
  const group = getOddOneOut(e.groupId);
  if (!group) return null;
  return (
    <>
      <div className="choices list">
        {group.options.map((option) => {
          const picked = answer.value === option;
          const state = showing ? (option === group.answer ? 'right' : picked ? 'wrong' : '') : picked ? 'picked' : '';
          return (
            <button
              key={option}
              className={`choice text ${state}`}
              onClick={() => {
                if (showing) return;
                speak(option, { slow: true });
                setAnswer({ value: option, ready: true });
              }}
            >
              {option}
            </button>
          );
        })}
      </div>
      {showing && <div className="note-card">{group.why}</div>}
    </>
  );
};

/** 13. Put the dialogue in order. */
export const OrderDialogue = ({
  e,
  setAnswer,
  showing,
}: {
  e: Extract<Exercise, { kind: 'order-dialogue' }>;
  setAnswer: (a: Answer) => void;
  showing: boolean;
}) => {
  const dialogue = getDialogue(e.dialogueId);
  const [bank, setBank] = useState<number[]>(() =>
    dialogue ? [...dialogue.lines.keys()].sort(() => Math.random() - 0.5) : [],
  );
  const [chosen, setChosen] = useState<number[]>([]);
  if (!dialogue) return null;
  const lineAt = (i: number) => dialogue.lines[i];
  if (chosen.some((i) => !lineAt(i)) || bank.some((i) => !lineAt(i))) return null;
  const update = (next: number[]) => {
    setChosen(next);
    setAnswer({ value: next.join(','), ready: next.length === dialogue.lines.length });
  };
  const right = chosen.join(',') === [...dialogue.lines.keys()].join(',');
  return (
    <>
      <div style={{ fontSize: 15, color: 'var(--ink-soft)', marginBottom: 10 }}>{dialogue.title}</div>
      <div className="dialogue">
        {chosen.map((i, pos) => (
          <button
            key={i}
            className={`line ${showing ? (dialogue.lines[i] === dialogue.lines[pos] ? 'right' : 'wrong') : ''}`}
            onClick={() => {
              if (showing) return;
              speak(dialogue.lines[i].es);
              setBank([...bank, i]);
              update(chosen.filter((x) => x !== i));
            }}
          >
            <span className="num">{pos + 1}</span>
            {dialogue.lines[i].es}
          </button>
        ))}
      </div>
      <div className="dialogue bank">
        {bank.map((i) => (
          <button
            key={i}
            className="line"
            disabled={showing}
            onClick={() => {
              speak(dialogue.lines[i].es);
              update([...chosen, i]);
              setBank(bank.filter((x) => x !== i));
            }}
          >
            {dialogue.lines[i].es}
          </button>
        ))}
      </div>
      {showing && !right && (
        <div className="note-card">
          <strong>The right order:</strong>
          {dialogue.lines.map((l) => (
            <div key={l.es}>{l.es}</div>
          ))}
        </div>
      )}
    </>
  );
};

/** 14. Complete the text (her teacher's self-introduction exercise). */
export const CompleteText = ({
  e,
  onDone,
  showing,
}: {
  e: Extract<Exercise, { kind: 'complete-text' }>;
  onDone: (correct: boolean) => void;
  showing: boolean;
}) => {
  const text = getGapText(e.textId);
  const gaps = (text?.parts ?? []).filter((p) => typeof p !== 'string') as { answer: string; options: string[]; hint?: string }[];
  const [filled, setFilled] = useState<string[]>([]);
  if (!text) return null;
  const current = filled.length;
  const allRight = filled.every((f, i) => f === gaps[i]?.answer);

  const choose = (value: string) => {
    const next = [...filled, value];
    setFilled(next);
    if (next.length === gaps.length) {
      onDone(next.every((f, i) => f === gaps[i].answer));
    }
  };

  let gapNo = -1;
  return (
    <>
      <div style={{ fontSize: 15, color: 'var(--ink-soft)', marginBottom: 10 }}>{text.title}</div>
      <p className="gap-sentence" style={{ fontSize: 19 }}>
        {text.parts.map((part, i) => {
          if (typeof part === 'string') return <span key={i}>{part}</span>;
          gapNo += 1;
          const n = gapNo;
          const value = filled[n];
          const state = value === undefined ? (n === current ? 'now' : '') : value === part.answer ? 'ok' : 'bad';
          return (
            <span key={i} className={`inline-gap ${state}`}>
              {value ?? '______'}
            </span>
          );
        })}
      </p>
      <div className="gap-en">{text.en}</div>
      {current < gaps.length && !showing && (
        <>
          {gaps[current].hint && <div className="gap-hint">({gaps[current].hint})</div>}
          <div className="choices list">
            {gaps[current].options.map((option) => (
              <button
                key={option}
                className="choice text"
                onClick={() => {
                  speak(option, { slow: true });
                  choose(option);
                }}
              >
                {option}
              </button>
            ))}
          </div>
        </>
      )}
      {showing && !allRight && (
        <div className="note-card">
          <strong>The right words:</strong> {gaps.map((g) => g.answer).join(' · ')}
        </div>
      )}
    </>
  );
};
