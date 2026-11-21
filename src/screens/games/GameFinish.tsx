import { Coco } from '../../art/Coco';
import { Confetti } from '../../art/Confetti';
import { Fireworks } from '../../art/Effects';
import { XP_GAME } from '../../engine/games';

/** The end of a game: Coco celebrates, the score, Play again or back to Práctica. */
export const GameFinish = ({
  title,
  line,
  score,
  onAgain,
  onQuit,
}: {
  title: string;
  line: string;
  score: { label: string; value: string };
  onAgain: () => void;
  onQuit: () => void;
}) => (
  <div className="finish">
    <Confetti />
    <Fireworks />
    <Coco mood="dance" size={140} />
    <h1>{title}</h1>
    <p className="lead" style={{ margin: 0, maxWidth: 320 }}>{line}</p>
    <div className="scoreboard">
      <div className="score" style={{ background: 'var(--sun)' }}>
        <div>
          <div className="label">XP</div>
          <div className="value" style={{ color: '#d9a51f' }}>+{XP_GAME}</div>
        </div>
      </div>
      <div className="score" style={{ background: 'var(--teal)' }}>
        <div>
          <div className="label">{score.label}</div>
          <div className="value" style={{ color: 'var(--teal-dark)' }}>{score.value}</div>
        </div>
      </div>
    </div>
    <button className="btn" onClick={onAgain}>Play again</button>
    <button className="btn ghost" onClick={onQuit}>Back to Práctica</button>
  </div>
);

/** The header every game shares: close, and how far along she is. */
export const GameHead = ({ done, total, onQuit }: { done: number; total: number; onQuit: () => void }) => (
  <div className="lesson-head">
    <button className="quit" onClick={onQuit} aria-label="Close game">✕</button>
    <div className="bar"><i style={{ width: `${(done / total) * 100}%` }} /></div>
  </div>
);

/** Does she prefer less motion? Then bubbles appear instead of drifting. */
export const reducedMotion = (): boolean =>
  typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches;
