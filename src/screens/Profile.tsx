import { Coco } from '../art/Coco';
import { ReportCard } from '../components/Celebrations';
import { addDays, dayKey } from '../engine/dates';
import { BADGES, bestStreak, weekReport, weekStart } from '../engine/badges';
import { LEVELS, levelsReached, masteredCount } from '../engine/mastery';
import { GOAL_OPTIONS } from '../engine/progress';
import type { Progress } from '../engine/types';

const GOAL_NAMES: Record<number, string> = { 10: 'Relajado', 20: 'Normal', 30: 'Serio' };

/** Five weeks of days, Monday first; orange when the goal was met. */
const StreakCalendar = ({ p }: { p: Progress }) => {
  const today = dayKey();
  const start = addDays(weekStart(today), -28);
  const days = Array.from({ length: 35 }, (_, i) => addDays(start, i));
  return (
    <div className="calendar">
      {['L', 'M', 'X', 'J', 'V', 'S', 'D'].map((d) => <span key={d} className="dow">{d}</span>)}
      {days.map((d) => {
        const xp = p.days[d] ?? 0;
        const cls = d > today ? 'future' : xp >= p.dailyGoal ? 'goal' : xp > 0 ? 'some' : '';
        return (
          <span key={d} className={`day ${cls} ${d === today ? 'today' : ''}`} title={`${d}: ${xp} XP`}>
            {Number(d.slice(8))}
          </span>
        );
      })}
    </div>
  );
};

export const Profile = ({
  progress,
  onGoal,
  onParents,
  onBack,
  onProgress,
}: {
  progress: Progress;
  onGoal: (goal: number) => void;
  onParents: () => void;
  onBack: () => void;
  onProgress: () => void;
}) => {
  const p = progress;
  return (
    <main className="screen">
      <button className="link-btn" onClick={onBack} style={{ paddingLeft: 0 }}>← Camino</button>
      <div className="coco-hello" style={{ justifyContent: 'flex-start', margin: '4px 0 16px' }}>
        <Coco mood="happy" size={72} />
        <div>
          <h1 style={{ margin: 0 }}>Mi perfil</h1>
          <p className="lead" style={{ margin: 0 }}>
            🐾 {masteredCount(p)} words mastered · Nivel {levelsReached(p)} of {LEVELS.length}
          </p>
          <button className="link-btn" style={{ paddingLeft: 0 }} onClick={onProgress}>See my level map ›</button>
        </div>
      </div>

      <div className="card">
        <h3>Mi meta diaria</h3>
        <div className="goal-pick">
          {GOAL_OPTIONS.map((g) => (
            <button key={g} className={p.dailyGoal === g ? 'on' : ''} onClick={() => onGoal(g)}>
              {GOAL_NAMES[g]}
              <small>{g} XP a day</small>
            </button>
          ))}
        </div>
        <p className="lead" style={{ margin: '10px 0 0', fontSize: 13 }}>
          A lesson is 10 XP (15 with no mistakes). Every 7 days in a row earns a 🧊 streak freeze (up to 2), which
          saves your streak on a day you miss. You have {p.freezes}.
        </p>
      </div>

      <div className="card">
        <h3>Racha · best {bestStreak(p)} days</h3>
        <StreakCalendar p={p} />
      </div>

      <ReportCard report={weekReport(p)} title="Esta semana" />

      <h2 className="section-title">Medallas</h2>
      <div className="badges">
        {BADGES.map((b) => {
          const got = p.badges.includes(b.id);
          return (
            <div key={b.id} className={`badge ${got ? 'got' : 'locked'}`}>
              <span className="i">{b.icon}</span>
              <strong>{b.title}</strong>
              <div>{b.en}</div>
            </div>
          );
        })}
      </div>

      <button className="link-btn parent-link" onClick={onParents}>For parents</button>
    </main>
  );
};
