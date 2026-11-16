import { useState } from 'react';
import { Picture } from '../art/Picture';
import { speak } from '../audio/speech';
import { getItem } from '../content';
import { dayKey } from '../engine/dates';
import { strength } from '../engine/memory';
import type { Progress } from '../engine/types';

type Filter = 'all' | 'weak' | 'strong';

const colourFor = (s: number) => (s >= 0.8 ? 'var(--green)' : s >= 0.5 ? 'var(--sun)' : 'var(--red)');

export const Words = ({ progress, onBack }: { progress: Progress; onBack: () => void }) => {
  const [filter, setFilter] = useState<Filter>('all');
  const today = dayKey();

  const rows = Object.values(progress.memory)
    .map((m) => ({ m, item: getItem(m.id), s: strength(m, today) }))
    .filter((r): r is { m: typeof r.m; item: NonNullable<typeof r.item>; s: number } => Boolean(r.item))
    .filter((r) => (filter === 'weak' ? r.s < 0.5 : filter === 'strong' ? r.s >= 0.8 : true))
    .sort((a, b) => a.s - b.s);

  return (
    <main className="screen">
      <button className="link-btn" onClick={onBack} style={{ paddingLeft: 0 }}>← Práctica</button>
      <h1>Mis palabras 📒</h1>
      <p className="lead">
        Your sticker book: {Object.keys(progress.memory).length} words collected. Tap a sticker to hear it. Faded
        stickers are words you are forgetting — practise them in “Words to review” and they shine again.
      </p>

      <div className="word-filter">
        {(['all', 'weak', 'strong'] as Filter[]).map((f) => (
          <button key={f} className={filter === f ? 'on' : ''} onClick={() => setFilter(f)}>
            {f === 'all' ? 'All' : f === 'weak' ? 'Needs work' : 'Strong'}
          </button>
        ))}
      </div>

      {rows.length === 0 && <p className="lead">Nothing here yet. Do a lesson and your first stickers will appear.</p>}

      <div className="stickers">
        {rows.map(({ item, s }) => (
          <button
            key={item.id}
            className={`sticker ${s >= 0.8 ? 'strong' : s >= 0.5 ? 'ok' : 'weak'}`}
            onClick={() => speak(item.say ?? item.es, { slow: true })}
            title={item.en}
          >
            <span className="sticker-art">
              {item.icon ? <Picture name={item.icon} size={54} /> : <span className="sticker-text">{item.es}</span>}
            </span>
            <span className="sticker-es">{item.es}</span>
            <span className="sticker-en">{item.en}</span>
            <span className="strength">
              <i style={{ width: `${Math.max(8, Math.round(s * 100))}%`, background: colourFor(s) }} />
            </span>
          </button>
        ))}
      </div>
    </main>
  );
};
