import { Coco } from '../art/Coco';
import { Paw } from '../art/Paw';
import { units } from '../content';
import { LEVEL_AT, LEVELS, levelsReached, masteredCount, totalWords, unitMastery, weekGain, weeklyCounts } from '../engine/mastery';
import type { Progress } from '../engine/types';

const shortDate = (day: string) => {
  const [, m, d] = day.split('-').map(Number);
  return `${d}/${m}`;
};

/** "Mi progreso": what she knows now, and how it grows. No points here — just learning. */
export const MyProgress = ({ progress, onBack }: { progress: Progress; onBack: () => void }) => {
  const mastered = masteredCount(progress);
  const gain = weekGain(progress);
  const reached = levelsReached(progress);
  const weeks = weeklyCounts(progress, 6);
  const top = Math.max(10, ...weeks.map((w) => w.count));
  // the level she is working on: the first not reached yet
  const working = LEVELS.findIndex((l) => unitMastery(progress, l.unitId) < LEVEL_AT);

  return (
    <main className="screen">
      <button className="link-btn" onClick={onBack} style={{ paddingLeft: 0 }}>← Camino</button>
      <div className="screen-hero">
        <Coco mood={gain > 0 ? 'cheer' : 'happy'} size={76} />
        <h1>Mi progreso</h1>
      </div>

      <div className="mastery-hero">
        <div className="big-number">{mastered}</div>
        <div>
          <b>words mastered</b>
          <span>
            of {totalWords()} in your units ·{' '}
            {gain > 0 ? <strong className="good">+{gain} this week</strong> : 'practise to add more this week'}
          </span>
        </div>
      </div>
      <p className="lead" style={{ fontSize: 13, marginTop: 6 }}>
        A word is mastered when you have got it right several times and still know it today. Words you stop practising
        fade out — so this number is real.
      </p>

      <div className="card">
        <h3>Week by week</h3>
        <div className="week-bars" role="img" aria-label="Words mastered at the end of each week">
          {weeks.map((w, i) => (
            <div key={w.week} className="week-bar">
              <span className="n">{w.count}</span>
              <i style={{ height: `${Math.max(4, (w.count / top) * 100)}%` }} className={i === weeks.length - 1 ? 'now' : ''} />
              <small>{i === weeks.length - 1 ? 'now' : shortDate(w.week)}</small>
            </div>
          ))}
        </div>
      </div>

      <h2 className="section-title">
        Mi nivel · {reached} of {LEVELS.length}
      </h2>
      <div className="level-map">
        {LEVELS.map((l, i) => {
          const value = unitMastery(progress, l.unitId);
          const done = value >= LEVEL_AT;
          const unit = units.find((u) => u.id === l.unitId);
          const isWorking = i === working;
          return (
            <div key={l.unitId} className={`level ${done ? 'done' : ''} ${isWorking ? 'working' : ''}`}>
              <div className="level-badge" style={{ background: done ? 'var(--gold)' : unit?.colour }}>
                {done ? <Paw size={22} colour="#fff" /> : <span>{i}</span>}
              </div>
              <div className="level-text">
                <b>{l.can}</b>
                <small>
                  Level {i} · {l.title} · {Math.round(value * 100)}% mastered
                </small>
                <span className="level-bar">
                  <i style={{ width: `${Math.max(3, Math.round(value * 100))}%`, background: done ? 'var(--gold)' : unit?.colour }} />
                  {/* the mark where the level opens */}
                  <em style={{ left: `${LEVEL_AT * 100}%` }} title={`${Math.round(LEVEL_AT * 100)}% opens the level`} />
                </span>
              </div>
              {isWorking && <Coco mood="wave" size={44} />}
            </div>
          );
        })}
      </div>
      <p className="lead" style={{ fontSize: 12 }}>
        A level is yours when you have mastered {Math.round(LEVEL_AT * 100)}% of that unit’s words. You can reach them in
        any order.
      </p>
    </main>
  );
};
