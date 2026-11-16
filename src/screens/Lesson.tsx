import { useMemo, useState } from 'react';
import { Coco } from '../art/Coco';
import { SpeakCard } from '../components/SpeakCard';
import { Confetti } from '../art/Confetti';
import { Fireworks, Sparkles } from '../art/Effects';
import { sfxFinish, sfxRight, sfxWrong } from '../audio/sfx';
import { speak, stopSpeaking } from '../audio/speech';
import { getDialogue, getItem, getOddOneOut, getQuestion, getSentence, getSituation } from '../content';
import type { PathNode, Unit } from '../content/types';
import { checkAnswer, checkOpenAnswer, type Check } from '../engine/answers';
import { buildLesson } from '../engine/lesson';
import { dayKey } from '../engine/dates';
import { lessonXp } from '../engine/progress';
import type { Exercise, Progress } from '../engine/types';
import {
  AnswerQuestion,
  BuildWord,
  CompleteText,
  Gap,
  ListenPick,
  Match,
  OddOneOut,
  OrderDialogue,
  PickImage,
  SoundWord,
  Teach,
  Tiles,
  TuUsted,
  TypeHeard,
  TypeTranslate,
  type Answer,
} from './exercises';

const BLANK: Answer = { value: '', ready: false };

const instructionFor = (e: Exercise): string => {
  switch (e.kind) {
    case 'teach': return 'New word';
    case 'pick-image': return 'Which picture is this?';
    case 'listen-pick': return 'Listen and pick what you hear';
    case 'sound-word': return 'Which word has this sound?';
    case 'build-word': return 'Build the word from the syllables';
    case 'tiles': return e.direction === 'en-es' ? 'Say it in Spanish' : 'What does this mean?';
    case 'match': return 'Match the pairs';
    case 'gap': return getSentence(e.sentenceId)?.gap?.options ? 'Choose the right word' : 'Fill in the missing word';
    case 'type-heard': return 'Type what you hear';
    case 'type-translate': return 'Write this in Spanish';
    case 'answer-question': return 'Answer the question';
    case 'tu-usted': return 'Tú or usted?';
    case 'order-dialogue': return 'Put the dialogue in order';
    case 'odd-one-out': return 'Which one does not belong?';
    case 'complete-text': return 'Complete the text';
    case 'speak': return 'Say it out loud';
  }
};

type Verdict = { correct: boolean; title: string; detail?: string; say?: string };

/**
 * A missing accent is counted right, but she is still told which spelling to use
 * ("Watch the accent"), and one wrong letter is "Almost!" (PLAN section 5).
 */
const wording = (c: Check, praise: string, correctForm: string): { title: string; detail?: string } => {
  if (c.message) return { title: c.message, detail: correctForm };
  return c.correct ? { title: praise } : { title: 'Not quite', detail: correctForm };
};

export const Lesson = ({
  node,
  unit,
  level,
  progress,
  exercises,
  title,
  onAnswer,
  onFinish,
  onQuit,
}: {
  node?: PathNode;
  unit?: Unit;
  level: number;
  progress: Progress;
  /** A ready-made session (Fix my mistakes, Words, Verbs) instead of a path node. */
  exercises?: Exercise[];
  title?: string;
  onAnswer: (itemIds: string[], correct: boolean) => void;
  onFinish: (result: { xp: number; mistakes: number; asked: number }) => void;
  onQuit: () => void;
}) => {
  const first = useMemo(
    () =>
      exercises ??
      (node
        ? buildLesson({ nodeId: node.id, level, memory: progress.memory, today: dayKey() })
        : []),
    // Built once when the lesson opens; it must not rebuild as she answers.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [node?.id, level, exercises],
  );
  const [queue, setQueue] = useState<Exercise[]>(first);
  const [pos, setPos] = useState(0);
  const [answer, setAnswer] = useState<Answer>(BLANK);
  const [verdict, setVerdict] = useState<Verdict | null>(null);
  const [mistakes, setMistakes] = useState(0);
  const [asked, setAsked] = useState(0);
  const [done, setDone] = useState<{ xp: number } | null>(null);
  const [retried, setRetried] = useState<string[]>([]);

  const e = queue[pos];

  const finish = (m: number, a: number) => {
    const xp = lessonXp(m);
    sfxFinish();
    setDone({ xp });
    onFinish({ xp, mistakes: m, asked: a });
  };

  const land = (correct: boolean, title: string, detail?: string, say?: string) => {
    onAnswer(e.itemIds, correct);
    setAsked(asked + 1);
    if (correct) {
      sfxRight();
    } else {
      sfxWrong();
      setMistakes(mistakes + 1);
      // A wrong item comes back ONCE more before the lesson ends — not again
      // after that, or a hard question could keep her in the lesson for ever.
      if (!e.key.endsWith('-again') && !retried.includes(e.key)) {
        setRetried([...retried, e.key]);
        setQueue([...queue, { ...e, key: `${e.key}-again` }]);
      }
    }
    if (say) speak(say);
    setVerdict({ correct, title, detail, say });
  };

  const check = () => {
    switch (e.kind) {
      case 'teach': {
        next();
        return;
      }
      case 'pick-image':
      case 'listen-pick': {
        const right = answer.value === e.itemId;
        const item = getItem(e.itemId);
        land(right, right ? '¡Muy bien!' : 'Not quite', right ? undefined : `${item?.es} — ${item?.en}`, item?.es);
        return;
      }
      case 'sound-word': {
        const right = answer.value === e.answer;
        land(right, right ? '¡Perfecto!' : 'Not quite', right ? undefined : `The answer is ${e.answer}`, e.answer);
        return;
      }
      case 'build-word': {
        const c = checkAnswer(answer.value, e.target);
        const { title, detail } = wording(c, '¡Muy bien!', e.target);
        land(c.correct, title, detail, e.target);
        return;
      }
      case 'tiles': {
        const c = checkAnswer(answer.value, e.answer);
        const { title, detail } = wording(c, '¡Excelente!', e.answer);
        land(c.correct, title, detail, e.direction === 'en-es' ? e.answer : undefined);
        return;
      }
      case 'gap': {
        const sentence = getSentence(e.sentenceId);
        const expected = sentence?.gap?.answer ?? '';
        const c = checkAnswer(answer.value, expected);
        const full = sentence?.es.replace('___', expected) ?? expected;
        const { title, detail } = wording(c, '¡Muy bien!', full);
        land(c.correct, title, detail, full);
        return;
      }
      case 'type-heard': {
        const c = checkAnswer(answer.value, e.answer);
        const { title, detail } = wording(c, '¡Perfecto!', e.answer);
        land(c.correct, title, detail, e.answer);
        return;
      }
      case 'type-translate': {
        const c = checkAnswer(answer.value, e.answer);
        const { title, detail } = wording(c, '¡Excelente!', e.answer);
        land(c.correct, title, detail, e.answer);
        return;
      }
      case 'answer-question': {
        const q = getQuestion(e.questionId);
        const c = checkOpenAnswer(answer.value, q?.starts ?? []);
        land(c.correct, c.correct ? '¡Muy bien!' : (c.message ?? 'Not quite'), c.correct ? undefined : q?.example, answer.value);
        return;
      }
      case 'tu-usted': {
        const s = getSituation(e.situationId);
        const right = answer.value === s?.answer;
        land(right, right ? '¡Muy bien!' : 'Not quite', right ? undefined : `It is ${s?.answer} here.`);
        return;
      }
      case 'odd-one-out': {
        const group = getOddOneOut(e.groupId);
        const right = answer.value === group?.answer;
        land(right, right ? '¡Muy bien!' : 'Not quite', right ? undefined : `The odd one out is ${group?.answer}.`);
        return;
      }
      case 'order-dialogue': {
        const dialogue = getDialogue(e.dialogueId);
        const right = answer.value === [...(dialogue?.lines ?? []).keys()].join(',');
        land(right, right ? '¡Perfecto!' : 'Not quite', right ? undefined : 'Look at the right order below.');
        return;
      }
      case 'match':
      case 'complete-text':
      case 'speak':
        return;
    }
  };

  const next = () => {
    stopSpeaking();
    setVerdict(null);
    setAnswer(BLANK);
    if (pos + 1 >= queue.length) finish(mistakes, asked);
    else setPos(pos + 1);
  };

  if (done) {
    const accuracy = asked ? Math.round(((asked - mistakes) / asked) * 100) : 100;
    return (
      <div className="finish">
        <Confetti />
        <Fireworks />
        <Coco mood="cheer" size={140} />
        <h1>¡Lección completa!</h1>
        <p style={{ color: 'var(--ink-soft)', margin: 0 }}>{title ?? `${unit?.title} · ${node?.title}`}</p>
        <div className="scoreboard">
          <div className="score" style={{ background: 'var(--sun)' }}>
            <div>
              <div className="label">XP</div>
              <div className="value" style={{ color: '#d9a51f' }}>+{done.xp}</div>
            </div>
          </div>
          <div className="score" style={{ background: 'var(--teal)' }}>
            <div>
              <div className="label">Accuracy</div>
              <div className="value" style={{ color: 'var(--teal-dark)' }}>{accuracy}%</div>
            </div>
          </div>
          <div className="score" style={{ background: 'var(--warm)' }}>
            <div>
              <div className="label">Mistakes</div>
              <div className="value" style={{ color: 'var(--warm-dark)' }}>{mistakes}</div>
            </div>
          </div>
        </div>
        <button className="btn" onClick={onQuit}>Continue</button>
      </div>
    );
  }

  if (!e) return null;
  const progressPct = (pos / queue.length) * 100;

  return (
    <div className="lesson">
      <div className="lesson-head">
        <button className="quit" onClick={onQuit} aria-label="Close lesson">✕</button>
        <div className="bar"><i style={{ width: `${progressPct}%` }} /></div>
      </div>

      {/* The key remounts the body for each exercise, so one exercise never
          inherits the tiles, lines or gaps of the one before it. */}
      <div className="lesson-body" key={e.key}>
        <h2 className="instruction">{instructionFor(e)}</h2>
        {e.kind === 'teach' && <Teach e={e} />}
        {e.kind === 'pick-image' && <PickImage e={e} answer={answer} setAnswer={setAnswer} showing={!!verdict} />}
        {e.kind === 'listen-pick' && <ListenPick e={e} answer={answer} setAnswer={setAnswer} showing={!!verdict} />}
        {e.kind === 'sound-word' && <SoundWord e={e} answer={answer} setAnswer={setAnswer} showing={!!verdict} />}
        {e.kind === 'build-word' && <BuildWord e={e} setAnswer={setAnswer} showing={!!verdict} />}
        {e.kind === 'tiles' && <Tiles e={e} setAnswer={setAnswer} showing={!!verdict} />}
        {e.kind === 'gap' && <Gap e={e} answer={answer} setAnswer={setAnswer} showing={!!verdict} />}
        {e.kind === 'type-heard' && <TypeHeard e={e} answer={answer} setAnswer={setAnswer} showing={!!verdict} />}
        {e.kind === 'type-translate' && <TypeTranslate e={e} answer={answer} setAnswer={setAnswer} showing={!!verdict} />}
        {e.kind === 'answer-question' && <AnswerQuestion e={e} answer={answer} setAnswer={setAnswer} showing={!!verdict} />}
        {e.kind === 'tu-usted' && <TuUsted e={e} answer={answer} setAnswer={setAnswer} showing={!!verdict} />}
        {e.kind === 'odd-one-out' && <OddOneOut e={e} answer={answer} setAnswer={setAnswer} showing={!!verdict} />}
        {e.kind === 'order-dialogue' && <OrderDialogue e={e} setAnswer={setAnswer} showing={!!verdict} />}
        {e.kind === 'speak' && (() => {
          const sentence = getSentence(e.sentenceId);
          if (!sentence) return null;
          return (
            <SpeakCard
              target={{ mode: 'repeat', es: sentence.es, en: sentence.en }}
              onDone={(correct) => {
                // Speaking never counts as a mistake: a missed word may be the microphone.
                if (correct) onAnswer(e.itemIds, true);
                setAsked(asked + 1);
                next();
              }}
            />
          );
        })()}
        {e.kind === 'complete-text' && (
          <CompleteText
            e={e}
            showing={!!verdict}
            onDone={(correct) => {
              onAnswer(e.itemIds, correct);
              setAsked(asked + 1);
              if (correct) sfxRight();
              else {
                sfxWrong();
                setMistakes(mistakes + 1);
              }
              setVerdict({ correct, title: correct ? '¡Muy bien!' : 'Some were wrong' });
            }}
          />
        )}
        {e.kind === 'match' && (
          <Match
            e={e}
            onDone={(correct) => {
              onAnswer(e.itemIds, correct);
              setAsked(asked + 1);
              if (correct) sfxRight();
              else {
                sfxWrong();
                setMistakes(mistakes + 1);
              }
              setVerdict({ correct, title: correct ? '¡Muy bien!' : 'Keep going' });
            }}
          />
        )}
      </div>

      {/* Speaking has its own buttons inside the card. */}
      {e.kind !== 'speak' && (
      <div className={`footer ${verdict ? (verdict.correct ? 'right' : 'wrong') : ''}`}>
        {verdict?.correct && <Sparkles />}
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
        ) : e.kind === 'teach' ? (
          <button className="btn" onClick={next}>Continue</button>
        ) : e.kind === 'match' ? (
          <button className="btn ghost" disabled>{`Match all ${e.itemIds.length} pairs`}</button>
        ) : e.kind === 'complete-text' ? (
          <button className="btn ghost" disabled>Fill in every gap</button>
        ) : (
          <button className="btn" disabled={!answer.ready} onClick={check}>Check</button>
        )}
      </div>
      )}
    </div>
  );
};
