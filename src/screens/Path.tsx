import { Coco } from '../art/Coco';
import { currentClass, units } from '../content';
import type { PathNode, Unit } from '../content/types';
import { nodeLevel } from '../engine/progress';
import type { Progress } from '../engine/types';

const CROWNS = 4;

/** A story stop is done once she has read that story, from the path or from Historias. */
const isDone = (p: Progress, node: PathNode): boolean =>
  nodeLevel(p, node.id) >= CROWNS || (node.kind === 'story' && !!node.story && (p.stories[node.story] ?? 0) > 0);

/** The first node she has not finished — the bouncing one. */
export const nextNodeId = (p: Progress): string | null => {
  for (const unit of units) {
    for (const node of unit.nodes) {
      if (!isDone(p, node)) return node.id;
    }
  }
  return null;
};

const offsets = [0, 46, 70, 46, 0, -46, -70, -46];

export const Path = ({
  progress,
  onStart,
  onTips,
}: {
  progress: Progress;
  onStart: (node: PathNode, unit: Unit) => void;
  onTips: (unit: Unit) => void;
}) => {
  const next = nextNodeId(progress);
  const built = units.find((u) => u.id === (currentClass.unitId ?? currentClass.practiseUnitId));

  return (
    <main className="path">
      <div className="week-card">
        <span style={{ fontSize: 28 }}>📌</span>
        <div>
          <h3>Esta semana en clase</h3>
          <p>
            {currentClass.topic}
            {currentClass.unitId
              ? ` — Unit ${built?.number}: ${built?.title}`
              : `. Not in the app yet — keep going with Unit ${built?.number}: ${built?.title}.`}
          </p>
        </div>
      </div>

      {units.map((unit) => (
        <section key={unit.id}>
          <div className="unit-banner" style={{ background: unit.colour }}>
            <div>
              <div className="eyebrow">Unit {unit.number}</div>
              <h2>{unit.title}</h2>
              <p>{unit.subtitle}</p>
            </div>
            {unit.tips && (
              <button className="tips-btn" onClick={() => onTips(unit)}>
                💡 Tips
              </button>
            )}
          </div>

          <div className="nodes">
            {unit.nodes.map((node, i) => {
              const level = nodeLevel(progress, node.id);
              const done = isDone(progress, node);
              const isNext = node.id === next;
              return (
                <div className="node-row" key={node.id} style={{ transform: `translateX(${offsets[i % offsets.length]}px)` }}>
                  <button
                    className={`node ${done ? 'done' : ''} ${isNext ? 'next' : ''} ${!done && !isNext && level === 0 ? 'locked' : ''}`}
                    style={done || isNext || level > 0 ? { background: done ? undefined : unit.colour, boxShadow: done ? undefined : `0 6px 0 rgba(0,0,0,0.18)` } : undefined}
                    onClick={() => onStart(node, unit)}
                    aria-label={node.title}
                  >
                    {isNext && <span className="start-bubble">EMPIEZA</span>}
                    {done ? '👑' : node.kind === 'check' ? '🏆' : node.kind === 'story' ? '📖' : node.kind === 'sounds' ? '🔤' : '⭐'}
                    {node.kind !== 'story' && <span className="node-crowns">{level}/{CROWNS}</span>}
                  </button>
                  <span className="node-label">
                    {node.title}
                    {node.kind === 'check' && node.about && (
                      <span style={{ display: 'block', fontSize: 11, opacity: 0.8 }}>{node.about}</span>
                    )}
                  </span>
                </div>
              );
            })}
          </div>
        </section>
      ))}

      <div className="coco-hello">
        <Coco mood="happy" size={90} />
        <div className="speech-bubble">
          ¡Hola! I am Coco. Tap any Spanish word anywhere in the app and I will say it slowly.
        </div>
      </div>
    </main>
  );
};
