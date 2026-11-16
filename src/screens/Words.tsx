import { useState } from 'react';
import { Picture } from '../art/Picture';
import { speak } from '../audio/speech';
import { getItem, unitOf } from '../content';
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
      <h1>Mis palabras</h1>
      <p className="lead">
        {Object.keys(progress.memory).length} words met so far. Tap one to hear it. The bar shows how well you
        still know it — it fades as the days pass and fills up again when you get it right.
      </p>

      <div className="word-filter">
        {(['all', 'weak', 'strong'] as Filter[]).map((f) => (
          <button key={f} className={filter === f ? 'on' : ''} onClick={() => setFilter(f)}>
            {f === 'all' ? 'All' : f === 'weak' ? 'Needs work' : 'Strong'}
          </button>
        ))}
      </div>

      {rows.length === 0 && <p className="lead">Nothing here yet. Do a lesson and your words will appear.</p>}

      {rows.map(({ item, s }) => (
        <div className="word-row" key={item.id} onClick={() => speak(item.say ?? item.es, { slow: true })}>
          {item.icon ? <Picture name={item.icon} size={38} /> : <span style={{ width: 38, textAlign: 'center', fontSize: 20, color: 'var(--purple)' }}>{item.es.slice(0, 2)}</span>}
          <span>
            <div className="es">{item.es}</div>
            <div className="en">{item.en} · Unit {unitOf(item.id)?.number ?? '?'}</div>
          </span>
          <span className="bar-wrap">
            <span className="strength">
              <i style={{ width: `${Math.max(8, Math.round(s * 100))}%`, background: colourFor(s) }} />
            </span>
          </span>
        </div>
      ))}
    </main>
  );
};
