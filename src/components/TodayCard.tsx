import { Paw } from '../art/Paw';
import { dayDone, nextTask, type DayPlan, type DayTask } from '../engine/today';

const ICON: Record<DayTask['kind'], string> = {
  lesson: '⭐',
  class: '🎒',
  testprep: '📝',
  fix: '🔧',
  review: '🧠',
  story: '📖',
};

const WHY: Record<DayTask['kind'], string> = {
  lesson: 'the next step on your map',
  class: 'what your class is doing now',
  testprep: 'your next test',
  fix: 'words you got wrong',
  review: 'words that are fading',
  story: 'reading, like your tests',
};

/** Today's three tasks, in order: only the next one can be started. */
export const TodayCard = ({ plan, onTask }: { plan?: DayPlan; onTask: (task: DayTask) => void }) => {
  if (!plan?.tasks.length) return null;
  const next = nextTask(plan);
  const done = plan.tasks.filter((t) => t.done).length;
  const finished = dayDone(plan);
  return (
    <section className={`today ${finished ? 'finished' : ''}`} aria-label="Today's tasks">
      <div className="today-head">
        <h3>
          <Paw size={18} colour="#ff6b35" rotate={-15} /> Hoy
        </h3>
        <span>
          {done}/{plan.tasks.length} · ~15 min
        </span>
      </div>
      <ol>
        {plan.tasks.map((t, i) => {
          const state = t.done ? 'done' : t.id === next?.id ? 'next' : 'locked';
          return (
            <li key={t.id}>
              <button className={`task ${state}`} disabled={state !== 'next'} onClick={() => onTask(t)}>
                <span className="task-mark">{state === 'done' ? '✓' : state === 'next' ? '▶' : '🔒'}</span>
                <span className="task-text">
                  <b>
                    {i + 1}. {ICON[t.kind]} {t.title}
                  </b>
                  <small>{WHY[t.kind]}</small>
                </span>
              </button>
            </li>
          );
        })}
      </ol>
      {finished && (
        <p className="today-done">
          ¡Hoy terminado! Today’s Spanish is done 🎉 — anything more is a bonus.
        </p>
      )}
    </section>
  );
};
