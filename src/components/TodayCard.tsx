import { Paw } from '../art/Paw';
import { getStory } from '../content/stories';
import { CHOICES, dayDone, nextTask, type ChoiceKind, type DayPlan, type DayTask } from '../engine/today';

const ICON: Record<DayTask['kind'], string> = {
  lesson: '⭐',
  class: '🎒',
  testprep: '📝',
  fix: '🔧',
  review: '🧠',
  story: '📖',
  choice: '🎲',
};

const WHY: Record<DayTask['kind'], string> = {
  lesson: 'the next step on your map',
  class: 'what your class is doing now',
  testprep: 'your next test',
  fix: 'words you got wrong',
  review: 'words that are fading',
  story: 'reading, like your tests',
  choice: 'pick the one you feel like today',
};

const CHOICE_LABEL: Record<ChoiceKind, { icon: string; label: string }> = {
  teach: { icon: '🐱', label: 'Teach Coco' },
  story: { icon: '📖', label: 'A story' },
  speak: { icon: '🎤', label: 'Speak' },
  write: { icon: '✍️', label: 'Write' },
};

/** Today's three tasks. Any order: Coco suggests one, she decides. */
export const TodayCard = ({
  plan,
  onTask,
  onChoice,
}: {
  plan?: DayPlan;
  onTask: (task: DayTask) => void;
  onChoice: (choice: ChoiceKind, task: DayTask) => void;
}) => {
  if (!plan?.tasks.length) return null;
  const suggested = nextTask(plan);
  const done = plan.tasks.filter((t) => t.done).length;
  const finished = dayDone(plan);
  return (
    <section className={`today ${finished ? 'finished' : ''}`} aria-label="Today's tasks">
      <div className="today-head">
        <h3>
          <Paw size={18} colour="#ff6b35" rotate={-15} /> Hoy
        </h3>
        <span>
          {done}/{plan.tasks.length} · ~15 min · any order
        </span>
      </div>
      <ol>
        {plan.tasks.map((t, i) => {
          const state = t.done ? 'done' : t.id === suggested?.id ? 'next' : 'open';
          if (t.kind === 'choice') {
            const picked = t.picked ? CHOICE_LABEL[t.picked] : null;
            const story = getStory(t.storyId);
            return (
              <li key={t.id}>
                <div className={`task choice-task ${state}`}>
                  <span className="task-mark">{t.done ? '✓' : '🎲'}</span>
                  <span className="task-text">
                    <b>
                      {i + 1}. {t.done && picked ? `${picked.icon} ${picked.label}` : t.title}
                    </b>
                    <small>{t.done ? 'your choice — done' : WHY.choice}</small>
                  </span>
                </div>
                {!t.done && (
                  <div className="choice-row">
                    {CHOICES.map((c) => (
                      <button key={c} className="choice-pick" onClick={() => onChoice(c, t)}>
                        <span>{CHOICE_LABEL[c].icon}</span>
                        {CHOICE_LABEL[c].label}
                        {c === 'story' && story && <small>{story.title}</small>}
                      </button>
                    ))}
                  </div>
                )}
              </li>
            );
          }
          return (
            <li key={t.id}>
              <button className={`task ${state}`} disabled={t.done} onClick={() => onTask(t)}>
                <span className="task-mark">{t.done ? '✓' : '▶'}</span>
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
      {finished && <p className="today-done">¡Hoy terminado! Today’s Spanish is done 🎉 — anything more is a bonus.</p>}
    </section>
  );
};
