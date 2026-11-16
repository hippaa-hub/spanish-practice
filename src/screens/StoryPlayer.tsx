import { useEffect, useRef, useState } from 'react';
import { Avatar } from '../art/Avatar';
import { Coco } from '../art/Coco';
import { Confetti } from '../art/Confetti';
import { Picture } from '../art/Picture';
import { canRecord, playUrl, startRecording, type Recording } from '../audio/recorder';
import { sfxFinish, sfxRight, sfxWrong } from '../audio/sfx';
import { speak, speakAlong, stopSpeaking } from '../audio/speech';
import { AccentBar } from '../components/AccentBar';
import type { Story, StoryQuestion } from '../content/types';
import { checkOpenAnswer } from '../engine/answers';
import { XP_STORY } from '../engine/progress';

type Step = 'listen' | 'along' | 'alone' | 'questions' | 'done';

const STEPS: { id: Step; label: string; hint: string }[] = [
  { id: 'listen', label: '1 · Escucha', hint: 'Listen and follow the words as they light up.' },
  { id: 'along', label: '2 · Lee conmigo', hint: 'Read each line aloud WITH the voice. It goes slowly.' },
  { id: 'alone', label: '3 · Lee tú', hint: 'Now read each line on your own. Record it, then compare with the voice.' },
  { id: 'questions', label: '4 · Preguntas', hint: 'Questions like your teacher’s reading test.' },
];

const CRITERION: Record<string, string> = {
  Bi: 'Criterion B · facts',
  Bii: 'Criterion B · the text',
  Biii: 'Criterion B · and you?',
};

const clean = (w: string) => w.replace(/[¿?¡!.,;:"«»—()]/g, '');

/** Meaning of a tapped word, if the story explains it (new words not in her units). */
const meaningOf = (story: Story, word: string, line: string): string | undefined => {
  const w = clean(word).toLowerCase();
  for (const [key, meaning] of Object.entries(story.glossary)) {
    const k = key.toLowerCase();
    if (k === w) return `${key} = ${meaning}`;
    if (k.includes(' ') && k.split(' ').includes(w) && line.toLowerCase().includes(k)) return `${key} = ${meaning}`;
  }
  return undefined;
};

/** The story as chat bubbles; every word can be tapped, the word being read is lit up. */
const StoryText = ({
  story,
  current,
  word,
  showEnglish,
  hideFrom,
  onLineTap,
  pickable,
  picked,
  marks,
}: {
  story: Story;
  current: number;
  word: number;
  showEnglish: boolean;
  /** Lines after this one are hidden (read-alone step reveals as she goes). */
  hideFrom?: number;
  onLineTap?: (i: number) => void;
  pickable?: boolean;
  picked?: number | null;
  marks?: Record<number, 'right' | 'wrong'>;
}) => {
  const [gloss, setGloss] = useState<{ line: number; text: string } | null>(null);
  const currentRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    currentRef.current?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  }, [current]);

  const first = story.lines[0]?.speaker;
  return (
    <div className={`story-text ${story.type}`}>
      {story.lines.map((line, i) => {
        if (hideFrom !== undefined && i > hideFrom) return null;
        const left = story.type === 'dialogue' ? line.speaker === first : true;
        const isNow = i === current;
        // 'proof-ok' / 'proof-bad' — not 'right', which already means "bubble on the right".
        const mark = marks?.[i];
        const state = mark ? `proof-${mark === 'right' ? 'ok' : 'bad'}` : pickable && picked === i ? 'picked' : '';
        return (
          <div
            key={i}
            ref={isNow ? currentRef : undefined}
            className={`story-line ${left ? 'left' : 'right'} ${isNow ? 'now' : ''} ${state}`}
            onClick={() => onLineTap?.(i)}
          >
            {/* In a blog or poster the same writer goes on for several lines: one face is enough. */}
            {i > 0 && story.lines[i - 1].speaker === line.speaker && story.type !== 'dialogue' ? (
              <span className="face-spacer" />
            ) : (
              <Avatar look={story.cast[line.speaker]} talking={isNow && word >= 0} size={50} />
            )}
            <div className="bubble">
              {!(i > 0 && story.lines[i - 1].speaker === line.speaker && story.type !== 'dialogue') && (
                <div className="who">{line.speaker}</div>
              )}
              <div className="es">
                {line.es.split(/\s+/).map((w, j) => {
                  const meaning = meaningOf(story, w, line.es);
                  return (
                    <span key={j}>
                      {j > 0 && ' '}
                      <span
                        className={`w ${isNow && j === word ? 'on' : ''} ${meaning ? 'gloss' : ''}`}
                        onClick={(e) => {
                          if (pickable) return;
                          e.stopPropagation();
                          speak(clean(w), { slow: true });
                          setGloss(meaning ? { line: i, text: meaning } : null);
                        }}
                      >
                        {w}
                      </span>
                    </span>
                  );
                })}
              </div>
              {gloss?.line === i && <div className="gloss-pop">{gloss.text}</div>}
              {showEnglish && <div className="en">{line.en}</div>}
            </div>
          </div>
        );
      })}
    </div>
  );
};

/** Steps 1 and 2: the voice reads; step 2 goes line by line, slowly. */
const ReadAloud = ({ story, slow, onDone }: { story: Story; slow: boolean; onDone: () => void }) => {
  const [current, setCurrent] = useState(-1);
  const [word, setWord] = useState(-1);
  const [playing, setPlaying] = useState(false);
  const [heard, setHeard] = useState<Set<number>>(new Set());
  const [english, setEnglish] = useState(false);
  const stop = useRef<() => void>(() => {});

  useEffect(() => () => stop.current(), []);

  const playLine = (i: number, thenNext: boolean) => {
    stop.current();
    setCurrent(i);
    setWord(0);
    setPlaying(true);
    stop.current = speakAlong(story.lines[i].es, {
      slow,
      onWord: setWord,
      onEnd: () => {
        setWord(-1);
        setHeard((h) => new Set(h).add(i));
        if (thenNext && i + 1 < story.lines.length) {
          window.setTimeout(() => playLine(i + 1, true), 450);
        } else {
          setPlaying(false);
        }
      },
    });
  };

  const allHeard = heard.size >= story.lines.length;

  return (
    <>
      <div className="story-tools">
        {slow ? (
          <button
            className="btn warm small"
            onClick={() => playLine(current < 0 ? 0 : current, false)}
            disabled={playing}
          >
            {current < 0 ? '▶ Start' : '▶ This line again'}
          </button>
        ) : (
          <button className="btn warm small" onClick={() => playLine(0, true)} disabled={playing}>
            {heard.size ? '▶ Again' : '▶ Listen'}
          </button>
        )}
        {slow && current >= 0 && current + 1 < story.lines.length && (
          <button className="btn small" onClick={() => playLine(current + 1, false)} disabled={playing}>
            Next line ▸
          </button>
        )}
        <button className={`chip ${english ? 'on' : ''}`} onClick={() => setEnglish(!english)}>
          English
        </button>
      </div>
      <StoryText story={story} current={current} word={word} showEnglish={english} />
      <div className="footer">
        <button className="btn" disabled={!allHeard} onClick={onDone}>
          {allHeard ? 'Continue' : slow ? 'Read every line with the voice' : 'Listen to the whole story'}
        </button>
        <button className="link-btn" onClick={onDone}>Skip this step</button>
      </div>
    </>
  );
};

/** Step 3: she reads alone, records herself, and compares with the voice. */
const ReadAlone = ({ story, onDone }: { story: Story; onDone: () => void }) => {
  const [current, setCurrent] = useState(0);
  const [recording, setRecording] = useState<Recording | null>(null);
  const [takes, setTakes] = useState<Record<number, string>>({});
  const [micProblem, setMicProblem] = useState(!canRecord());
  const [word, setWord] = useState(-1);
  const stop = useRef<() => void>(() => {});

  useEffect(
    () => () => {
      stop.current();
      Object.values(takes).forEach((u) => URL.revokeObjectURL(u));
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  const record = async () => {
    stopSpeaking();
    const r = await startRecording();
    if (!r) {
      setMicProblem(true);
      return;
    }
    setRecording(r);
  };

  const finishRecording = async () => {
    const url = await recording?.stop();
    setRecording(null);
    if (url) setTakes((t) => ({ ...t, [current]: url }));
  };

  const model = () => {
    stop.current();
    stop.current = speakAlong(story.lines[current].es, { onWord: setWord, onEnd: () => setWord(-1) });
  };

  const last = current === story.lines.length - 1;
  return (
    <>
      <StoryText story={story} current={current} word={word} showEnglish={false} hideFrom={current} />
      <div className="rec-panel">
        {micProblem ? (
          <p className="lead" style={{ margin: 0 }}>
            The microphone is not available here, so just read the line out loud, then listen to the voice.
          </p>
        ) : recording ? (
          <button className="rec-btn on" onClick={finishRecording}>⏹ Stop</button>
        ) : (
          <button className="rec-btn" onClick={record}>🎙 {takes[current] ? 'Record again' : 'Record me'}</button>
        )}
        <div className="rec-row">
          {takes[current] && (
            <button className="chip" onClick={() => playUrl(takes[current])}>▶ Me</button>
          )}
          <button className="chip" onClick={model}>▶ Coco’s voice</button>
        </div>
      </div>
      <div className="footer">
        <button
          className="btn"
          disabled={!!recording}
          onClick={() => {
            stop.current();
            if (last) onDone();
            else setCurrent(current + 1);
          }}
        >
          {last ? 'Continue' : 'Next line'}
        </button>
      </div>
    </>
  );
};

type Verdict = { correct: boolean; title: string; detail?: string };

/** Step 4: her teacher's Criterion B questions. */
const Questions = ({ story, onDone }: { story: Story; onDone: (right: number) => void }) => {
  const [i, setI] = useState(0);
  const [choice, setChoice] = useState<string | null>(null);
  const [tf, setTf] = useState<boolean | null>(null);
  const [line, setLine] = useState<number | null>(null);
  const [typed, setTyped] = useState('');
  const [verdict, setVerdict] = useState<Verdict | null>(null);
  const [right, setRight] = useState(0);
  const [showText, setShowText] = useState(false);
  const q: StoryQuestion = story.questions[i];

  const ready =
    q.kind === 'choice' ? choice !== null : q.kind === 'truefalse' ? tf !== null && line !== null : typed.trim().length > 0;

  const land = (v: Verdict) => {
    if (v.correct) {
      sfxRight();
      setRight(right + 1);
    } else sfxWrong();
    setVerdict(v);
  };

  const check = () => {
    if (q.kind === 'choice') {
      const ok = choice === q.answer;
      land({ correct: ok, title: ok ? '¡Muy bien!' : 'Not quite', detail: ok ? q.why : `${q.answer}. ${q.why ?? ''}` });
    } else if (q.kind === 'truefalse') {
      const tfOk = tf === q.answer;
      const lineOk = line === q.evidence;
      const proof = story.lines[q.evidence].es;
      if (tfOk && lineOk) land({ correct: true, title: '¡Perfecto!', detail: `The proof: “${proof}”` });
      else if (tfOk) land({ correct: false, title: 'Right answer — wrong proof', detail: `The line that proves it: “${proof}”` });
      else land({ correct: false, title: 'Not quite', detail: `It is ${q.answer ? 'true' : 'false'}: “${proof}”` });
    } else {
      const c = checkOpenAnswer(typed, q.starts);
      land({ correct: c.correct, title: c.correct ? '¡Muy bien!' : (c.message ?? 'Not quite'), detail: `For example: ${q.example}` });
    }
  };

  const next = () => {
    setVerdict(null);
    setChoice(null);
    setTf(null);
    setLine(null);
    setTyped('');
    if (i + 1 >= story.questions.length) onDone(right);
    else setI(i + 1);
  };

  const evidenceMarks: Record<number, 'right' | 'wrong'> | undefined =
    verdict && q.kind === 'truefalse'
      ? { [q.evidence]: 'right', ...(line !== null && line !== q.evidence ? { [line]: 'wrong' as const } : {}) }
      : undefined;

  return (
    <>
      <div className="lesson-body" key={q.id}>
        <div className="crit">{CRITERION[q.criterion]} · {i + 1} of {story.questions.length}</div>

        {q.kind === 'choice' && (
          <>
            <h2 className="instruction" style={{ marginBottom: 4 }}>{q.q}</h2>
            {q.en && <div className="gap-en">{q.en}</div>}
            <div className="choices list">
              {q.options.map((o) => {
                const state = verdict ? (o === q.answer ? 'right' : o === choice ? 'wrong' : '') : o === choice ? 'picked' : '';
                return (
                  <button key={o} className={`choice text ${state}`} onClick={() => !verdict && setChoice(o)}>
                    {o}
                  </button>
                );
              })}
            </div>
          </>
        )}

        {q.kind === 'truefalse' && (
          <>
            <h2 className="instruction" style={{ marginBottom: 4 }}>¿Verdadero o falso?</h2>
            <div className="gap-sentence" style={{ fontSize: 20 }}>{q.statement}</div>
            <div className="gap-en">{q.en}</div>
            <div className="choices">
              {[true, false].map((v) => {
                const state = verdict ? (v === q.answer ? 'right' : v === tf ? 'wrong' : '') : v === tf ? 'picked' : '';
                return (
                  <button key={String(v)} className={`choice ${state}`} onClick={() => !verdict && setTf(v)}>
                    {v ? 'Verdadero' : 'Falso'}
                  </button>
                );
              })}
            </div>
            {tf !== null && (
              <>
                <div className="gap-hint" style={{ marginTop: 16 }}>
                  Now prove it: tap the line in the text that shows it.
                </div>
                <StoryText
                  story={story}
                  current={-1}
                  word={-1}
                  showEnglish={false}
                  pickable
                  picked={line}
                  marks={evidenceMarks}
                  onLineTap={(n) => !verdict && setLine(n)}
                />
              </>
            )}
          </>
        )}

        {q.kind === 'you' && (
          <>
            <h2 className="instruction" style={{ marginBottom: 4 }}>{q.q}</h2>
            <div className="gap-en">{q.en}</div>
            <div className="gap-hint">Answer about yourself. Start with “{q.starts[0]}…”.</div>
            <input
              className="typed"
              value={typed}
              disabled={!!verdict}
              autoCapitalize="off"
              autoCorrect="off"
              spellCheck={false}
              placeholder="Your answer in Spanish"
              onChange={(e) => setTyped(e.target.value)}
            />
            <AccentBar onInsert={(ch) => setTyped(typed + ch)} />
          </>
        )}

        {q.kind !== 'truefalse' && (
          <>
            <button className="link-btn" style={{ marginTop: 18 }} onClick={() => setShowText(!showText)}>
              {showText ? 'Hide the text' : '📖 Read the text again'}
            </button>
            {showText && <StoryText story={story} current={-1} word={-1} showEnglish={false} />}
          </>
        )}
      </div>

      <div className={`footer ${verdict ? (verdict.correct ? 'right' : 'wrong') : ''}`}>
        {verdict && (
          <div className={`feedback ${verdict.correct ? 'right' : 'wrong'}`}>
            <Coco mood={verdict.correct ? 'cheer' : 'oops'} size={54} />
            <div>
              <h4>{verdict.title}</h4>
              {verdict.detail && <p>{verdict.detail}</p>}
            </div>
          </div>
        )}
        {verdict ? (
          <button className={`btn ${verdict.correct ? '' : 'red'}`} onClick={next}>Continue</button>
        ) : (
          <button className="btn" disabled={!ready} onClick={check}>Check</button>
        )}
      </div>
    </>
  );
};

export const StoryPlayer = ({
  story,
  onFinish,
  onQuit,
}: {
  story: Story;
  onFinish: (xp: number) => void;
  onQuit: () => void;
}) => {
  const [step, setStep] = useState<Step>('listen');
  const [score, setScore] = useState(0);
  const at = STEPS.findIndex((s) => s.id === step);

  useEffect(() => () => stopSpeaking(), []);

  if (step === 'done') {
    return (
      <div className="finish">
        <Confetti />
        <Coco mood="cheer" size={140} />
        <h1>¡Historia completa!</h1>
        <p style={{ color: 'var(--ink-soft)', margin: 0 }}>{story.title}</p>
        <div className="scoreboard">
          <div className="score" style={{ background: 'var(--sun)' }}>
            <div>
              <div className="label">XP</div>
              <div className="value" style={{ color: '#d9a51f' }}>+{XP_STORY}</div>
            </div>
          </div>
          <div className="score" style={{ background: 'var(--teal)' }}>
            <div>
              <div className="label">Questions</div>
              <div className="value" style={{ color: 'var(--teal-dark)' }}>{score}/{story.questions.length}</div>
            </div>
          </div>
        </div>
        <button className="btn" onClick={onQuit}>Continue</button>
      </div>
    );
  }

  return (
    <div className="lesson story">
      <div className="lesson-head">
        <button className="quit" onClick={() => { stopSpeaking(); onQuit(); }} aria-label="Close story">✕</button>
        <div className="bar"><i style={{ width: `${(at / STEPS.length) * 100}%` }} /></div>
      </div>
      <div className="story-head">
        <Picture name={story.scene} size={52} />
        <div>
          <h2>{story.title}</h2>
          <div className="steps">
            {STEPS.map((s, n) => (
              <span key={s.id} className={`step ${n === at ? 'on' : n < at ? 'past' : ''}`}>{s.label}</span>
            ))}
          </div>
        </div>
      </div>
      <p className="step-hint">{STEPS[at].hint}</p>

      {step === 'listen' && <ReadAloud key="listen" story={story} slow={false} onDone={() => setStep('along')} />}
      {step === 'along' && <ReadAloud key="along" story={story} slow onDone={() => setStep('alone')} />}
      {step === 'alone' && <ReadAlone story={story} onDone={() => setStep('questions')} />}
      {step === 'questions' && (
        <Questions
          story={story}
          onDone={(right) => {
            setScore(right);
            sfxFinish();
            onFinish(XP_STORY);
            setStep('done');
          }}
        />
      )}
    </div>
  );
};
