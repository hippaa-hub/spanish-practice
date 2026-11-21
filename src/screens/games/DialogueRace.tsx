import { useEffect, useRef, useState } from 'react';
import { Coco } from '../../art/Coco';
import { Sparkles } from '../../art/Effects';
import { sfxRight, sfxTap, sfxWrong } from '../../audio/sfx';
import { speak, speakAlong, stopSpeaking } from '../../audio/speech';
import { dayKey } from '../../engine/dates';
import { RACE_DIALOGUES, raceDialoguesFor, realItems, XP_GAME, type Race } from '../../engine/games';
import type { Progress } from '../../engine/types';
import { GameFinish, GameHead } from './GameFinish';

const clock = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;

/**
 * Coco's dialogue race: the lines of a short dialogue are mixed up. She moves
 * them into order (drag, or the up/down arrows) while a gentle clock runs —
 * the clock is only her score, it never stops the game. When the order is
 * right the dialogue plays back line by line.
 */
export const DialogueRace = ({
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
  const [races, setRaces] = useState<Race[]>(() => raceDialoguesFor(progress.memory, dayKey()));
  const [at, setAt] = useState(0);
  const [order, setOrder] = useState<number[]>(races[0]?.shuffled ?? []);
  const [checked, setChecked] = useState(0);
  const [solved, setSolved] = useState(false);
  const [playing, setPlaying] = useState<number | null>(null);
  const [seconds, setSeconds] = useState(0);
  const [total, setTotal] = useState(0);
  const [done, setDone] = useState(false);
  const [dragging, setDragging] = useState<number | null>(null);
  const stopPlay = useRef<(() => void) | null>(null);
  const race = races[at];

  // The clock: only a score, never a cut-off.
  useEffect(() => {
    if (solved || done) return;
    const t = window.setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => window.clearInterval(t);
  }, [solved, done, at]);

  useEffect(() => () => stopPlay.current?.(), []);

  /** A fresh deal of three dialogues. */
  const again = () => {
    const fresh = raceDialoguesFor(progress.memory, dayKey());
    setRun(run + 1);
    setRaces(fresh);
    setAt(0);
    setOrder(fresh[0]?.shuffled ?? []);
    setChecked(0);
    setSolved(false);
    setSeconds(0);
    setTotal(0);
    setDone(false);
  };

  const move = (from: number, to: number) => {
    if (solved || to < 0 || to >= order.length || from === to) return;
    sfxTap();
    const next = [...order];
    const [line] = next.splice(from, 1);
    next.splice(to, 0, line);
    setOrder(next);
  };

  const playBack = (i: number) => {
    if (!race || i >= race.lines.length) {
      setPlaying(null);
      return;
    }
    setPlaying(i);
    stopPlay.current = speakAlong(race.lines[i].es, { onWord: () => undefined, onEnd: () => playBack(i + 1) });
  };

  const check = () => {
    if (!race) return;
    const right = order.every((x, i) => x === i);
    if (checked === 0) onAnswer(realItems(race.items), right);
    setChecked(checked + 1);
    if (right) {
      sfxRight();
      setSolved(true);
      setTotal(total + seconds);
      playBack(0);
    } else sfxWrong();
  };

  const next = () => {
    stopPlay.current?.();
    stopSpeaking();
    setPlaying(null);
    if (at + 1 >= races.length) {
      setDone(true);
      onFinish(XP_GAME);
    } else {
      setAt(at + 1);
      setOrder(races[at + 1].shuffled);
      setChecked(0);
      setSolved(false);
      setSeconds(0);
    }
  };

  if (done) {
    return (
      <GameFinish
        title="¡Meta!"
        line={`All ${RACE_DIALOGUES} dialogues in order in ${clock(total)}. Coco ran beside you the whole way!`}
        score={{ label: 'Time', value: clock(total) }}
        onAgain={again}
        onQuit={onQuit}
      />
    );
  }
  if (!race) return null;
  const inPlace = order.filter((x, i) => x === i).length;

  return (
    <div className="lesson game">
      <GameHead done={at} total={races.length} onQuit={() => { stopPlay.current?.(); stopSpeaking(); onQuit(); }} />
      <div className="lesson-body" key={`${at}-${run}`}>
        <div className="race-top">
          <h2 className="instruction" style={{ margin: 0 }}>Put the dialogue in order</h2>
          <span className="race-clock" aria-label="Time">⏱ {clock(seconds)}</span>
        </div>
        <div style={{ fontSize: 15, color: 'var(--ink-soft)', margin: '6px 0 12px' }}>{race.title}</div>
        <div className="dialogue race">
          {order.map((lineIndex, pos) => {
            const line = race.lines[lineIndex];
            const state = solved ? (playing === pos ? 'now' : 'right') : checked > 0 && lineIndex === pos ? 'right' : '';
            return (
              <div
                key={lineIndex}
                className={`line ${state} ${dragging === pos ? 'dragging' : ''}`}
                draggable={!solved}
                onDragStart={() => setDragging(pos)}
                onDragOver={(e) => e.preventDefault()}
                onDrop={() => {
                  if (dragging !== null) move(dragging, pos);
                  setDragging(null);
                }}
                onDragEnd={() => setDragging(null)}
              >
                <span className="num">{pos + 1}</span>
                <button className="race-text" onClick={() => speak(line.es)}>{line.es}</button>
                {!solved && (
                  <span className="race-arrows">
                    <button onClick={() => move(pos, pos - 1)} disabled={pos === 0} aria-label={`Move line ${pos + 1} up`}>▲</button>
                    <button onClick={() => move(pos, pos + 1)} disabled={pos === order.length - 1} aria-label={`Move line ${pos + 1} down`}>▼</button>
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>
      <div className={`footer ${solved ? 'right' : checked > 0 ? 'wrong' : ''}`}>
        {solved && <Sparkles />}
        <div className={`feedback ${solved ? 'right' : checked > 0 ? 'wrong' : ''}`}>
          <Coco mood={solved ? 'cheer' : checked > 0 ? 'think' : 'happy'} size={54} />
          <div>
            <h4 style={solved || checked > 0 ? undefined : { color: 'var(--ink-soft)' }}>
              {solved ? '¡Perfecto!' : checked > 0 ? 'Not yet' : `Dialogue ${at + 1} of ${races.length}`}
            </h4>
            <p>
              {solved
                ? playing !== null ? 'Listen to the whole dialogue…' : `In order in ${clock(seconds)}.`
                : checked > 0
                  ? `${inPlace} of ${order.length} lines are in the right place (green). Move the others.`
                  : 'Drag the lines, or use the arrows. Tap a line to hear it.'}
            </p>
          </div>
        </div>
        {solved ? (
          <button className="btn" onClick={next}>{at + 1 >= races.length ? 'Finish' : 'Next dialogue'}</button>
        ) : (
          <button className={`btn ${checked > 0 ? 'warm' : ''}`} onClick={check}>Check</button>
        )}
      </div>
    </div>
  );
};
