import { useState } from 'react';
import { Coco } from '../../art/Coco';
import { Picture } from '../../art/Picture';
import { Sparkles } from '../../art/Effects';
import { sfxRight, sfxTap, sfxWrong } from '../../audio/sfx';
import { speak, stopSpeaking } from '../../audio/speech';
import { dayKey } from '../../engine/dates';
import { BUILDER_WORDS, builderWords, realItems, XP_GAME, type BuilderWord } from '../../engine/games';
import type { Progress } from '../../engine/types';
import { GameFinish, GameHead } from './GameFinish';

/**
 * Syllable builder: me + sa = mesa. Tap the syllable tiles in order; a wrong
 * tile shakes and stays in the bank. When the word is whole it is said aloud
 * and its meaning appears. Eight words, the ones she knows least first.
 */
export const SyllableBuilder = ({
  progress,
  onAnswer,
  onFinish,
  onQuit,
}: {
  progress: Progress;
  onAnswer: (itemIds: string[], correct: boolean) => void;
  onFinish: (xp: number) => void;
  onQuit: () => void;
}) => {
  const [run, setRun] = useState(0);
  const [words, setWords] = useState<BuilderWord[]>(() => builderWords(progress.memory, dayKey()));
  const [at, setAt] = useState(0);
  const [built, setBuilt] = useState<number[]>([]);
  const [shake, setShake] = useState<number | null>(null);
  const [slips, setSlips] = useState(0);
  const [perfect, setPerfect] = useState(0);
  const [done, setDone] = useState(false);
  const w = words[at];
  const complete = !!w && built.length === w.syllables.length;

  /** A fresh deal, weakest words first again. */
  const again = () => {
    setRun(run + 1);
    setWords(builderWords(progress.memory, dayKey()));
    setAt(0);
    setBuilt([]);
    setSlips(0);
    setPerfect(0);
    setDone(false);
  };

  const tapTile = (i: number) => {
    if (!w || complete || built.includes(i)) return;
    const want = w.syllables[built.length];
    if (w.tiles[i].toLowerCase() === want.toLowerCase()) {
      sfxTap();
      speak(w.tiles[i], { slow: true });
      const next = [...built, i];
      setBuilt(next);
      if (next.length === w.syllables.length) {
        sfxRight();
        onAnswer(realItems(w.itemId ? [w.itemId] : []), slips === 0);
        if (slips === 0) setPerfect(perfect + 1);
        window.setTimeout(() => speak(w.word), 350);
      }
    } else {
      sfxWrong();
      setSlips(slips + 1);
      setShake(i);
      window.setTimeout(() => setShake(null), 450);
    }
  };

  const next = () => {
    stopSpeaking();
    setBuilt([]);
    setSlips(0);
    if (at + 1 >= words.length) {
      setDone(true);
      onFinish(XP_GAME);
    } else setAt(at + 1);
  };

  if (done) {
    return (
      <GameFinish
        title="¡Palabras construidas!"
        line={`You built all ${BUILDER_WORDS} words. ${perfect} came out right first time, syllable by syllable.`}
        score={{ label: 'First time', value: `${perfect}/${BUILDER_WORDS}` }}
        onAgain={again}
        onQuit={onQuit}
      />
    );
  }
  if (!w) return null;

  return (
    <div className="lesson game">
      <GameHead done={at} total={words.length} onQuit={() => { stopSpeaking(); onQuit(); }} />
      <div className="lesson-body" key={`${at}-${run}`}>
        <h2 className="instruction">Build the word from its syllables</h2>
        <div className="builder-card">
          {w.icon ? <Picture name={w.icon} size={96} /> : <div className="sound-letter" style={{ fontSize: 40 }}>{w.syllables.length}</div>}
          <div className="builder-hint">
            {complete ? <strong className="word" onClick={() => speak(w.word, { slow: true })}>{w.word}</strong> : `${w.syllables.length} syllables`}
            <div style={{ color: 'var(--ink-soft)', fontSize: 15 }}>{w.en}</div>
          </div>
        </div>
        <div className="answer-line builder-line">
          {w.syllables.map((_, i) => (
            <span key={i} className={`tile slot ${built[i] !== undefined ? 'filled' : ''}`}>
              {built[i] !== undefined ? w.tiles[built[i]] : '·'}
            </span>
          ))}
        </div>
        <div className="tile-bank">
          {w.tiles.map((t, i) => (
            <button
              key={`${t}-${i}`}
              className={`tile big ${built.includes(i) ? 'used' : ''} ${shake === i ? 'shake' : ''}`}
              disabled={built.includes(i) || complete}
              onClick={() => tapTile(i)}
            >
              {t}
            </button>
          ))}
        </div>
      </div>
      <div className={`footer ${complete ? 'right' : ''}`}>
        {complete && <Sparkles />}
        <div className={`feedback ${complete ? 'right' : ''}`}>
          <Coco mood={complete ? 'cheer' : shake !== null ? 'oops' : 'think'} size={54} />
          <div>
            <h4 style={complete ? undefined : { color: 'var(--ink-soft)' }}>
              {complete ? '¡Muy bien!' : shake !== null ? 'Not that one — try another' : `Word ${at + 1} of ${words.length}`}
            </h4>
            {complete && <p>{w.word} = {w.en}</p>}
          </div>
        </div>
        <button className="btn" disabled={!complete} onClick={next}>
          {complete ? (at + 1 >= words.length ? 'Finish' : 'Next word') : 'Tap the syllables in order'}
        </button>
      </div>
    </div>
  );
};
