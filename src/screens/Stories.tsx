import { Avatar } from '../art/Avatar';
import { Picture } from '../art/Picture';
import { currentClass } from '../content';
import { stories } from '../content/stories';
import type { Story } from '../content/types';
import type { Progress } from '../engine/types';

const TYPE: Record<Story['type'], string> = { dialogue: 'Diálogo', blog: 'Blog', poster: 'Pósters' };

export const Stories = ({ progress, onOpen }: { progress: Progress; onOpen: (story: Story) => void }) => (
  <main className="screen">
    <h1>Historias</h1>
    <p className="lead">
      Short texts like the ones in your reading tests. Listen, read along, read alone — then answer questions
      like your teacher’s (Criterion B). Each one gives 15 XP.
    </p>
    {stories.map((s) => {
      const times = progress.stories[s.id] ?? 0;
      const isClass = s.unit === 9;
      return (
        <button key={s.id} className="story-card" onClick={() => onOpen(s)}>
          <Picture name={s.scene} size={52} />
          <span>
            <h3>{s.title}</h3>
            <p>
              <span className="tag">{TYPE[s.type]}</span>
              {isClass ? `In class now: ${currentClass.topic}` : `Words from Unit ${s.unit}`}
            </p>
            <span className="cast">
              {Object.values(s.cast).map((look, i) => (
                <Avatar key={i} look={look} size={26} />
              ))}
            </span>
          </span>
          <span className="tick">{times > 0 ? '✅' : '📖'}</span>
        </button>
      );
    })}
  </main>
);
