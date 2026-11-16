import { useMemo, useState } from 'react';
import { Coco } from '../art/Coco';
import { Confetti } from '../art/Confetti';
import { Fireworks, Sparkles } from '../art/Effects';
import { sfxFinish, sfxRight, sfxWrong } from '../audio/sfx';
import { speak, stopSpeaking } from '../audio/speech';
import type { CocoMistake } from '../content/cocoMistakes';
import { XP_LESSON } from '../engine/progress';
import { fixedSentence, reasonChoices } from '../engine/teach';

type Step = 'find' | 'fix' | 'why' | 'thanks';

/**
 * Profesora Adele: Coco hands in his homework. For each sentence she finds his
 * mistake, chooses the right word, and explains why — then Coco says thank you.
 */
export const TeachCoco = ({
  mistakes,
  onFinish,
  onQuit,
}: {
  mistakes: CocoMistake[];
  onFinish: (xp: number) => void;
  onQuit: () => void;
}) => {
  const [at, setAt] = useState(0);
  const [step, setStep] = useState<Step>('find');
  const [miss, setMiss] = useState<number | null>(null);
  const [slips, setSlips] = useState(0);
  const [perfect, setPerfect] = useState(0);
  const [note, setNote] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const m = mistakes[at];
  const fixChoices = useMemo(
    () => (m ? [m.right, m.parts[m.wrong], m.other].sort(() => Math.random() - 0.5) : []),
    [m],
  );
  const reasons = useMemo(() => (m ? reasonChoices(m) : []), [m]);

  if (done) {
    return (
      <div className="finish">
        <Confetti />
        <Fireworks />
        <Coco mood="dance" size={140} />
        <h1>¡Gracias, profesora!</h1>
        <p className="lead" style={{ margin: 0, maxWidth: 320 }}>
          You corrected all of Coco’s homework. {perfect} of {mistakes.length} you spotted and explained without a slip.
          Coco learned {mistakes.length} things from you today!
        </p>
        <div className="scoreboard">
          <div className="score" style={{ background: 'var(--sun)' }}>
            <div>
              <div className="label">XP</div>
              <div className="value" style={{ color: '#d9a51f' }}>+{XP_LESSON}</div>
            </div>
          </div>
        </div>
        <button className="btn" onClick={onQuit}>Continue</button>
      </div>
    );
  }
  if (!m) return null;

  const next = () => {
    stopSpeaking();
    setNote(null);
    setMiss(null);
    if (slips === 0) setPerfect(perfect + 1);
    setSlips(0);
    if (at + 1 >= mistakes.length) {
      sfxFinish();
      onFinish(XP_LESSON);
      setDone(true);
    } else {
      setAt(at + 1);
      setStep('find');
    }
  };

  const tapPart = (i: number) => {
    if (step !== 'find') return;
    if (i === m.wrong) {
      sfxRight();
      setNote(null);
      setMiss(null);
      setStep('fix');
    } else {
      sfxWrong();
      setSlips(slips + 1);
      setMiss(i);
      setNote('That part is fine — look again.');
    }
  };

  const pickFix = (choice: string) => {
    if (choice === m.right) {
      sfxRight();
      setNote(null);
      setStep('why');
    } else {
      sfxWrong();
      setSlips(slips + 1);
      setNote(choice === m.parts[m.wrong] ? 'That is what Coco wrote — it needs changing.' : 'Not that one — try another.');
    }
  };

  const pickWhy = (reason: string) => {
    if (reason === m.why) {
      sfxRight();
      setNote(null);
      setStep('thanks');
      speak(fixedSentence(m));
    } else {
      sfxWrong();
      setSlips(slips + 1);
      setNote('Hmm, that rule is true, but it is not why this one is wrong.');
    }
  };

  const instruction =
    step === 'find' ? 'Find Coco’s mistake' : step === 'fix' ? 'What should it be?' : step === 'why' ? 'Explain it to Coco: why?' : '¡Gracias, profe!';

  return (
    <div className="lesson teach">
      <div className="lesson-head">
        <button className="quit" onClick={() => { stopSpeaking(); onQuit(); }} aria-label="Close">✕</button>
        <div className="bar"><i style={{ width: `${(at / mistakes.length) * 100}%` }} /></div>
      </div>
      <div className="lesson-body" key={`${m.id}-${step}`}>
        <div className="teach-head">
          <Coco mood={step === 'thanks' ? 'cheer' : step === 'find' ? 'oops' : 'think'} size={70} />
          <div className="speech-bubble">
            {step === 'thanks'
              ? '¡Ahora entiendo! Now I get it. ¡Gracias, profesora Adele!'
              : step === 'find'
                ? 'Here is my homework, profesora. I think I made a mistake…'
                : step === 'fix'
                  ? 'Oh no! What should I write instead?'
                  : 'But why? Explain it to me, please.'}
          </div>
        </div>
        <h2 className="instruction">{instruction}</h2>

        <div className="notebook">
          {m.parts.map((part, i) => {
            const isWrong = i === m.wrong;
            const show = step === 'thanks' && isWrong ? m.right : part;
            const cls =
              step === 'find' ? (miss === i ? 'miss' : '') : isWrong ? (step === 'thanks' ? 'fixed' : 'marked') : '';
            return (
              <button key={i} className={`nb-part ${cls}`} onClick={() => tapPart(i)} disabled={step !== 'find'}>
                {show}
              </button>
            );
          })}
        </div>

        {step === 'fix' && (
          <div className="choices list">
            {fixChoices.map((c) => (
              <button key={c} className="choice text" onClick={() => pickFix(c)}>{c}</button>
            ))}
          </div>
        )}
        {step === 'why' && (
          <div className="choices list">
            {reasons.map((r) => (
              <button key={r} className="choice text reason" onClick={() => pickWhy(r)}>{r}</button>
            ))}
          </div>
        )}
        {step === 'thanks' && <div className="note-card"><strong>The rule:</strong> {m.why}</div>}
        {note && <p className="teach-note">{note}</p>}
      </div>
      {step === 'thanks' && (
        <div className="footer right">
          <Sparkles />
          <button className="btn" onClick={next}>{at + 1 >= mistakes.length ? 'Finish' : 'Next sentence'}</button>
        </div>
      )}
    </div>
  );
};
