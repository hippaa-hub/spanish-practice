import { useEffect, useRef, useState } from 'react';
import { Avatar } from '../art/Avatar';
import { Coco } from '../art/Coco';
import { Paw, PAW_PATH } from '../art/Paw';
import { LEVELS, levelsReached, masteredCount, weekGain } from '../engine/mastery';
import { Picture } from '../art/Picture';
import { WORLDS } from '../art/Scenery';
import { DRAWN_BANNERS } from '../art/artList';
import { CocoCoach } from '../components/CocoCoach';
import { TodayCard } from '../components/TodayCard';
import type { ChoiceKind, DayTask } from '../engine/today';
import { currentClass, units } from '../content';
import { getStory } from '../content/stories';
import type { PathNode, Unit } from '../content/types';
import { readiness } from '../engine/badges';
import { nodeLevel } from '../engine/progress';
import { blockedBy, frontier, isOpen } from '../engine/path';
import type { Progress } from '../engine/types';

const CROWNS = 4;
const ROW = 112;
/** The road swings left and right like Duolingo's path. */
const SWING = [0, 0.55, 0.9, 0.55, 0, -0.55, -0.9, -0.55];

/** A story stop is done once she has read that story, from the path or from Historias. */
const isDone = (p: Progress, node: PathNode): boolean =>
  nodeLevel(p, node.id) >= CROWNS || (node.kind === 'story' && !!node.story && (p.stories[node.story] ?? 0) > 0);

/** The bouncing one: the first open lesson she has not finished yet. */
export const nextNodeId = (p: Progress): string | null => frontier(p);

const useWidth = () => {
  const ref = useRef<HTMLDivElement | null>(null);
  const [width, setWidth] = useState(343);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const update = () => setWidth(el.clientWidth || 343);
    update();
    const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(update) : null;
    ro?.observe(el);
    return () => ro?.disconnect();
  }, []);
  return { ref, width };
};

/** How ready she is for a test on this unit, as a little ring. */
const ReadyRing = ({ value }: { value: number }) => {
  const r = 15;
  const c = 2 * Math.PI * r;
  const pct = Math.round(value * 100);
  return (
    <div className="ready" title="How ready you are for a test on this unit">
      <svg viewBox="0 0 40 40" width="40" height="40">
        <circle cx="20" cy="20" r={r} fill="rgba(255,255,255,0.25)" stroke="rgba(255,255,255,0.35)" strokeWidth="5" />
        <circle
          cx="20" cy="20" r={r} fill="none" stroke="#fff" strokeWidth="5" strokeLinecap="round"
          strokeDasharray={`${(c * pct) / 100} ${c}`} transform="rotate(-90 20 20)"
        />
        <text x="20" y="24" textAnchor="middle" fontSize="11" fontWeight="900" fill="#fff">{pct}%</text>
      </svg>
      <span>listo</span>
    </div>
  );
};

const UnitMap = ({
  unit,
  progress,
  next,
  onStart,
  onLocked,
}: {
  unit: Unit;
  progress: Progress;
  next: string | null;
  onStart: (node: PathNode, unit: Unit) => void;
  onLocked: (node: PathNode) => void;
}) => {
  const { ref, width } = useWidth();
  const reach = Math.min(100, width * 0.27);
  // Every other unit swings the other way first, so the road snakes down the page.
  const phase = (unit.number % 2) * 4;
  const spots = unit.nodes.map((node, i) => {
    const swing = SWING[(i + phase) % SWING.length];
    return { node, offset: swing * reach, x: width / 2 + swing * reach, y: i * ROW + 54 };
  });
  const height = unit.nodes.length * ROW + 16;
  const road = spots
    .map((s, i) => {
      if (i === 0) return `M ${s.x} ${s.y - 54}  L ${s.x} ${s.y}`;
      const prev = spots[i - 1];
      return `C ${prev.x} ${prev.y + ROW / 2}, ${s.x} ${s.y - ROW / 2}, ${s.x} ${s.y}`;
    })
    .join(' ');
  const world = WORLDS[unit.id];

  // Paw prints walking down the road between the stops, left-right-left like a real cat.
  const bez = (a: number, b: number, c: number, d: number, t: number) =>
    (1 - t) ** 3 * a + 3 * (1 - t) ** 2 * t * b + 3 * (1 - t) * t ** 2 * c + t ** 3 * d;
  const paws = spots.slice(1).flatMap((s, i) => {
    const prev = spots[i];
    const pts = [0.3, 0.5, 0.7].map((t, n) => {
      const x = bez(prev.x, prev.x, s.x, s.x, t);
      const y = bez(prev.y, prev.y + ROW / 2, s.y - ROW / 2, s.y, t);
      const dx = bez(prev.x, prev.x, s.x, s.x, t + 0.01) - x;
      const dy = bez(prev.y, prev.y + ROW / 2, s.y - ROW / 2, s.y, t + 0.01) - y;
      const angle = (Math.atan2(dy, dx) * 180) / Math.PI + 90;
      const side = n % 2 === 0 ? -1 : 1;
      const len = Math.hypot(dx, dy) || 1;
      return { x: x + (side * 5 * -dy) / len, y: y + (side * 5 * dx) / len, angle };
    });
    return pts;
  });

  return (
    <div className="map" ref={ref} style={{ height }}>
      <svg className="road" width={width} height={height} aria-hidden="true">
        <path d={road} stroke="#e8dcc4" strokeWidth="30" fill="none" strokeLinecap="round" />
        <path d={road} stroke="#fffaf0" strokeWidth="22" fill="none" strokeLinecap="round" />
        {paws.map((p, n) => (
          <g key={n} transform={`translate(${p.x - 7.5} ${p.y - 7.5}) rotate(${p.angle} 7.5 7.5) scale(0.375)`}>
            <path d={PAW_PATH} fill="#d6b88f" />
          </g>
        ))}
      </svg>

      {spots.map(({ node, offset, x, y }, i) => {
        const level = nodeLevel(progress, node.id);
        const done = isDone(progress, node);
        const open = isOpen(progress, node.id);
        const isNext = node.id === next;
        // her class's unit is open early: point at its first lesson too
        const classStart = !isNext && open && level === 0 && !done && unit.id === currentClass.unitId && i === 0;
        const labelLeft = offset > 0;
        const propLeft = offset >= 0;
        const story = node.story ? getStory(node.story) : undefined;
        const icon = done ? '👑' : !open ? '🔒' : node.kind === 'check' ? '🏆' : node.kind === 'story' ? '📖' : node.kind === 'sounds' ? '🔤' : '⭐';
        const prop = world?.props[i % world.props.length];
        return (
          <div key={node.id}>
            {/* beside the road: Coco at the stop she is on, scenery everywhere else */}
            <div className={`prop ${propLeft ? 'left' : 'right'} ${isNext ? 'coco-spot' : ''}`} style={{ top: y - 30 }}>
              {isNext ? <Coco mood="wave" size={62} /> : prop ? <Picture name={prop} size={52} /> : null}
            </div>

            <button
              className={`node ${node.kind ?? ''} ${done ? 'done' : ''} ${isNext ? 'next' : ''} ${!open ? 'locked' : ''}`}
              style={{
                left: x - 43,
                top: y - 43,
                ['--unit' as string]: unit.colour,
              }}
              onClick={() => (open ? onStart(node, unit) : onLocked(node))}
              aria-label={open ? node.title : `${node.title} (locked)`}
            >
              {isNext && <span className="start-bubble">EMPIEZA</span>}
              {classStart && <span className="start-bubble class">TU CLASE</span>}
              <img
                className="node-paw"
                src={`${import.meta.env.BASE_URL}paws/${done ? 'paw-done' : !open ? 'paw-locked' : 'paw'}.webp`}
                alt=""
                aria-hidden="true"
                draggable={false}
              />
              {open && !done && <span className="node-icon">{icon}</span>}
              {node.kind !== 'story' && <span className="node-crowns">{level}/{CROWNS}</span>}
            </button>

            <div
              className={`node-label ${labelLeft ? 'left' : 'right'}`}
              style={labelLeft ? { top: y - 18, right: width - x + 50 } : { top: y - 18, left: x + 50 }}
            >
              {node.title}
              {node.kind === 'check' && node.about && <span className="about">{node.about}</span>}
              {story && (
                <span className="cast">
                  {Object.values(story.cast).map((look, n) => (
                    <Avatar key={n} look={look} size={24} />
                  ))}
                </span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export const Path = ({
  progress,
  onStart,
  onTips,
  onTask,
  onChoice,
  onProgress,
}: {
  progress: Progress;
  onStart: (node: PathNode, unit: Unit) => void;
  onTips: (unit: Unit) => void;
  onTask: (task: DayTask) => void;
  onChoice: (choice: ChoiceKind, task: DayTask) => void;
  onProgress: () => void;
}) => {
  const next = nextNodeId(progress);
  const built = units.find((u) => u.id === (currentClass.unitId ?? currentClass.practiseUnitId));
  const [toast, setToast] = useState<string | null>(null);
  const timer = useRef<number | null>(null);
  const locked = (node: PathNode) => {
    const first = blockedBy(progress, node.id);
    setToast(first ? `🔒 Finish “${first.title}” first — then this one opens.` : '🔒 Finish the lesson before this one first.');
    if (timer.current) window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setToast(null), 2600);
  };

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

      <CocoCoach progress={progress} />
      <button className="progress-strip" onClick={onProgress}>
        <Paw size={26} colour="#ff9fb4" rotate={-12} />
        <span className="num">{masteredCount(progress)}</span>
        <span>
          <b>words mastered</b>
          {weekGain(progress) > 0 ? ` · +${weekGain(progress)} this week` : ''}
          <br />
          Nivel {levelsReached(progress)} of {LEVELS.length} · see your level map
        </span>
        <span className="go">›</span>
      </button>

      <TodayCard plan={progress.today} onTask={onTask} onChoice={onChoice} />

      {units.map((unit) => (
        <section
          key={unit.id}
          className="land"
          style={{ background: `linear-gradient(180deg, ${WORLDS[unit.id]?.ground ?? '#fff'} 0%, ${WORLDS[unit.id]?.ground ?? '#fff'}00 100%)` }}
        >
          <div
            className={`unit-banner${DRAWN_BANNERS.has(unit.id) ? ' has-art' : ''}`}
            style={
              DRAWN_BANNERS.has(unit.id)
                ? {
                    background: `linear-gradient(90deg, ${unit.colour} 38%, ${unit.colour}cc 55%, ${unit.colour}00 85%), url(${import.meta.env.BASE_URL}banners/${unit.id}.webp) right center / cover no-repeat, ${unit.colour}`,
                  }
                : { background: unit.colour }
            }
          >
            <div>
              <div className="eyebrow">Unit {unit.number}</div>
              <h2>{unit.title}</h2>
              <p>{unit.subtitle}</p>
            </div>
            <div className="banner-side">
              <ReadyRing value={readiness(progress, unit.id)} />
              {unit.tips && (
                <button className="tips-btn" onClick={() => onTips(unit)}>
                  💡 Tips
                </button>
              )}
            </div>
          </div>
          <UnitMap unit={unit} progress={progress} next={next} onStart={onStart} onLocked={locked} />
        </section>
      ))}

      {toast && (
        <div className="path-toast" role="status" onClick={() => setToast(null)}>
          <Coco mood="think" size={44} />
          <span>{toast}</span>
        </div>
      )}

      <div className="coco-hello">
        <Coco mood="read" size={90} />
        <div className="speech-bubble">
          More units come as your class moves on. ¡Hasta pronto!
        </div>
      </div>
    </main>
  );
};
