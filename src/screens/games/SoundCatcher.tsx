import { useEffect, useRef, useState } from 'react';
import { Coco } from '../../art/Coco';
import { sfxRight, sfxWrong } from '../../audio/sfx';
import { speak, stopSpeaking } from '../../audio/speech';
import { dayKey } from '../../engine/dates';
import { CATCHER_ROUNDS, catcherRounds, catcherSpeed, XP_GAME, type CatcherRound } from '../../engine/games';
import type { Progress } from '../../engine/types';
import { GameFinish, GameHead, reducedMotion } from './GameFinish';

type Phase = 'play' | 'hit' | 'miss';

/**
 * Sound Catcher: hear a sound, a syllable or a word, and tap its bubble before
 * it floats away. A miss just shows the right bubble and plays the sound
 * again; the round comes back later. Gets gently quicker as she gets them right.
 */
export const SoundCatcher = ({
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
  const [queue, setQueue] = useState<CatcherRound[]>(() => catcherRounds(progress.memory, dayKey()));
  const [pos, setPos] = useState(0);
  const [phase, setPhase] = useState<Phase>('play');
  const [picked, setPicked] = useState<string | null>(null);
  const [right, setRight] = useState(0);
  const [firstTry, setFirstTry] = useState(0);
  const [retried, setRetried] = useState<string[]>([]);
  const [done, setDone] = useState(false);
  const still = useRef(reducedMotion());
  const round = queue[pos];
  const seconds = catcherSpeed(right);

  /** A fresh deal, weakest sounds first again. */
  const again = () => {
    setRun(run + 1);
    setQueue(catcherRounds(progress.memory, dayKey()));
    setPos(0);
    setPhase('play');
    setPicked(null);
    setRight(0);
    setFirstTry(0);
    setRetried([]);
    setDone(false);
  };

  // Say it when the round starts.
  useEffect(() => {
    if (round && !done) speak(round.say);
  }, [round, done]);

  // The bubbles float off (the last one starts a little later): that counts as a miss
  // — unless motion is reduced, then they wait for her.
  useEffect(() => {
    if (!round || phase !== 'play' || still.current) return;
    const t = window.setTimeout(() => miss(null), (seconds + 1.2) * 1000);
    return () => window.clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [round, phase, seconds]);

  const next = () => {
    stopSpeaking();
    setPicked(null);
    setPhase('play');
    if (pos + 1 >= queue.length) {
      setDone(true);
      onFinish(XP_GAME);
    } else setPos(pos + 1);
  };

  const miss = (bubble: string | null) => {
    sfxWrong();
    onAnswer([round.itemId], false);
    setPicked(bubble);
    setPhase('miss');
    // It comes back once more, later in the game.
    if (!retried.includes(round.itemId)) {
      setRetried([...retried, round.itemId]);
      setQueue([...queue, round]);
    }
    window.setTimeout(() => speak(round.say), 500);
  };

  const tap = (bubble: string) => {
    if (phase !== 'play') return;
    if (bubble === round.answer) {
      sfxRight();
      onAnswer([round.itemId], true);
      setRight(right + 1);
      if (!retried.includes(round.itemId)) setFirstTry(firstTry + 1);
      setPicked(bubble);
      setPhase('hit');
    } else miss(bubble);
  };

  if (done) {
    return (
      <GameFinish
        title="¡Sonidos atrapados!"
        line={`You caught ${firstTry} of ${CATCHER_ROUNDS} sounds first time. Coco's ears are impressed!`}
        score={{ label: 'Caught', value: `${firstTry}/${CATCHER_ROUNDS}` }}
        onAgain={again}
        onQuit={onQuit}
      />
    );
  }
  if (!round) return null;

  return (
    <div className="lesson game">
      <GameHead done={pos} total={queue.length} onQuit={() => { stopSpeaking(); onQuit(); }} />
      <div className="lesson-body">
        <h2 className="instruction">Tap the bubble you hear</h2>
        <div className="catcher-tools">
          <button className="speaker" onClick={() => speak(round.say)} aria-label="Play">🔊</button>
          <button className="speaker small" onClick={() => speak(round.say, { slow: true })} aria-label="Play slowly">🐢</button>
        </div>
        <div className={`bubbles ${still.current ? 'still' : ''} ${phase !== 'play' ? 'paused' : ''}`} key={`${pos}-${run}`}>
          {round.bubbles.map((b, i) => {
            const state =
              phase === 'play' ? '' : b === round.answer ? 'right' : b === picked ? 'wrong' : 'faded';
            return (
              <button
                key={b}
                className={`bubble ${state}`}
                style={{
                  left: `${((i + 0.5) / round.bubbles.length) * 100}%`,
                  width: `calc(min(82px, ${100 / round.bubbles.length}% - 8px))`,
                  animationDuration: `${seconds}s`,
                  // neighbours start at different moments, so they never sit side by side
                  animationDelay: `${(i % 2) * 0.8 + (i % 3) * 0.15}s`,
                }}
                onClick={() => tap(b)}
              >
                {b}
              </button>
            );
          })}
        </div>
      </div>
      <div className={`footer ${phase === 'hit' ? 'right' : phase === 'miss' ? 'wrong' : ''}`}>
        {phase === 'play' ? (
          <div className="feedback">
            <Coco mood="think" size={54} />
            <div><h4 style={{ color: 'var(--ink-soft)' }}>Round {pos + 1} of {queue.length}</h4></div>
          </div>
        ) : (
          <div className={`feedback ${phase === 'hit' ? 'right' : 'wrong'}`}>
            <Coco mood={phase === 'hit' ? 'cheer' : 'oops'} size={54} />
            <div>
              <h4>{phase === 'hit' ? '¡Atrapado!' : 'It floated away'}</h4>
              <p>{phase === 'hit' ? `${round.answer} — yes!` : `It was ${round.answer}. Listen again — it comes back later.`}</p>
            </div>
          </div>
        )}
        <button className={`btn ${phase === 'miss' ? 'red' : ''}`} disabled={phase === 'play'} onClick={next}>
          {phase === 'play' ? 'Listen and tap' : pos + 1 >= queue.length ? 'Finish' : 'Next'}
        </button>
      </div>
    </div>
  );
};
