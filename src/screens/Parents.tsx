import { useState } from 'react';
import { getItem, nextTest, units } from '../content';
import { stories } from '../content/stories';
import { exportName, exportText, importText } from '../engine/backup';
import { bestStreak, unitFinished, verbFormCount, verbsMastered, weekReport, wordsLearned } from '../engine/badges';
import { addDays, dayKey } from '../engine/dates';
import { strength } from '../engine/memory';
import type { Progress } from '../engine/types';
import { ICEBERG, ME_PRESENTO, type WritingTask } from '../engine/writing';

/** Where she is in learning to read Spanish (PLAN section 6). */
export const readingLevel = (p: Progress): string => {
  const level = (id: string) => p.nodes[id]?.level ?? 0;
  if (Object.values(p.stories).some((n) => n > 0)) return 'Short texts — she has read a whole story';
  const laterLessons = Object.entries(p.nodes).some(([id, n]) => !id.startsWith('u0') && n.level >= 2);
  if (level('u0.n7') >= 1 || laterLessons) return 'Sentences';
  if (level('u0.n2') >= 1 && level('u0.n3') >= 1) return 'Words';
  if (level('u0.n1') >= 1) return 'Syllables';
  return 'Sounds — just starting';
};

const weakest = (p: Progress, verbs: boolean) =>
  Object.values(p.memory)
    // Only what she actually struggles with: got it wrong, or it is fading.
    .filter((m) => m.wrong > 0 || strength(m, dayKey()) < 0.5)
    .map((m) => ({ m, item: getItem(m.id) }))
    .filter((x) => x.item && (verbs ? x.item.kind === 'verbform' : x.item.kind !== 'verbform' && x.item.kind !== 'sound' && x.item.kind !== 'syllable'))
    .sort((a, b) => strength(a.m, dayKey()) - strength(b.m, dayKey()))
    .slice(0, 5);

const textOf = (p: Progress, task: WritingTask) =>
  task.parts.map((part) => p.writing[task.id]?.parts[part.id] ?? '').join(' ').trim();

export const Parents = ({
  progress,
  onImport,
  onBack,
}: {
  progress: Progress;
  onImport: (p: Progress) => void;
  onBack: () => void;
}) => {
  const p = progress;
  const [message, setMessage] = useState<string | null>(null);
  const thisWeek = weekReport(p);
  const lastWeek = weekReport(p, addDays(thisWeek.from, -1));
  const intro = textOf(p, ME_PRESENTO);
  const iceberg = textOf(p, ICEBERG);

  const download = () => {
    const blob = new Blob([exportText(p)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = exportName(dayKey());
    a.click();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    setMessage('Saved. Keep the file somewhere safe (Files, iCloud, email to yourself).');
  };

  const upload = async (file: File) => {
    const result = importText(await file.text());
    if (!result.ok) {
      setMessage(result.reason);
      return;
    }
    if (window.confirm(`Replace the progress on this phone with the file's (${result.summary})? This cannot be undone.`)) {
      onImport(result.progress);
      setMessage(`Progress loaded: ${result.summary}.`);
    }
  };

  return (
    <main className="screen">
      <button className="link-btn" onClick={onBack} style={{ paddingLeft: 0 }}>← Perfil</button>
      <h1>For parents</h1>
      <p className="lead">This page is for you, not Adele. Everything here is stored only on this phone.</p>

      <div className="card">
        <h3>Practice</h3>
        <div className="stat-row"><span>This week</span><b>{thisWeek.daysPractised}/7 days · {thisWeek.minutes} min · {thisWeek.xp} XP</b></div>
        <div className="stat-row"><span>Last week</span><b>{lastWeek.daysPractised}/7 days · {lastWeek.minutes} min · {lastWeek.xp} XP</b></div>
        <div className="stat-row"><span>Streak now / best</span><b>{p.streak} / {bestStreak(p)} days</b></div>
        <div className="stat-row"><span>Daily goal</span><b>{p.dailyGoal} XP</b></div>
        <div className="stat-row"><span>Total</span><b>{p.xpTotal} XP</b></div>
      </div>

      <div className="card">
        <h3>Learning</h3>
        <div className="stat-row"><span>Reading level</span><b>{readingLevel(p)}</b></div>
        <div className="stat-row"><span>Words learned (right twice)</span><b>{wordsLearned(p)}</b></div>
        <div className="stat-row"><span>Verb forms mastered</span><b>{verbsMastered(p)} / {verbFormCount}</b></div>
        <div className="stat-row">
          <span>Next school test</span>
          <b>{nextTest && nextTest.date >= dayKey() ? `${nextTest.date} — Test prep is on` : 'none set (see GUIDE.md)'}</b>
        </div>
        <div className="stat-row"><span>Stories read</span><b>{stories.filter((s) => (p.stories[s.id] ?? 0) > 0).length} / {stories.length}</b></div>
      </div>

      <div className="card">
        <h3>Units</h3>
        {units.map((u) => {
          const done = u.nodes.filter((n) => (p.nodes[n.id]?.level ?? 0) >= 4 || (n.story && (p.stories[n.story] ?? 0) > 0)).length;
          const started = u.nodes.filter((n) => (p.nodes[n.id]?.level ?? 0) > 0).length;
          return (
            <div key={u.id} className="unit-bar">
              <span className="name">{u.number}. {u.title}{unitFinished(p, u.id) ? ' ✓' : ''}</span>
              <span className="strength"><i style={{ width: `${Math.max(started ? 6 : 0, (done / u.nodes.length) * 100)}%`, background: u.colour }} /></span>
              <span>{done}/{u.nodes.length}</span>
            </div>
          );
        })}
        <p className="lead" style={{ margin: '8px 0 0', fontSize: 12 }}>A stop counts as done at 4/4 (gold).</p>
      </div>

      <div className="card">
        <h3>Needs work</h3>
        {weakest(p, false).length === 0 && weakest(p, true).length === 0 && <p className="lead" style={{ margin: 0 }}>Nothing yet.</p>}
        {weakest(p, false).map(({ m, item }) => (
          <div key={m.id} className="stat-row"><span>{item!.es}</span><b>{item!.en} · wrong {m.wrong}×</b></div>
        ))}
        {weakest(p, true).map(({ m, item }) => (
          <div key={m.id} className="stat-row"><span>{item!.es}</span><b>{item!.en.split(' — ')[0]} · wrong {m.wrong}×</b></div>
        ))}
      </div>

      <div className="card">
        <h3>Her writing</h3>
        {intro ? (
          <>
            <p className="lead" style={{ margin: '0 0 6px' }}>
              ¡Me presento! — {p.writing[ME_PRESENTO.id]?.finished ? `finished ${p.writing[ME_PRESENTO.id]?.finished}` : `draft, ${p.writing[ME_PRESENTO.id]?.updated}`}
            </p>
            <div className="writing-sample">{intro}</div>
          </>
        ) : (
          <p className="lead" style={{ margin: 0 }}>No ¡Me presento! yet.</p>
        )}
        {iceberg && (
          <>
            <p className="lead" style={{ margin: '12px 0 6px' }}>Identity Iceberg — {p.writing[ICEBERG.id]?.updated}</p>
            <div className="writing-sample">{iceberg}</div>
          </>
        )}
      </div>

      <div className="card">
        <h3>Keep a copy / move to a new phone</h3>
        <p className="lead" style={{ marginTop: 0, fontSize: 13 }}>
          Progress lives only on this phone. Export saves it to a file; Import loads a file back (on this phone or a new one).
        </p>
        <div style={{ display: 'grid', gap: 8 }}>
          <button className="btn warm" onClick={download}>Export progress</button>
          <label className="btn ghost file-btn">
            Import progress
            <input type="file" accept="application/json,.json" onChange={(e) => e.target.files?.[0] && upload(e.target.files[0])} />
          </label>
        </div>
        {message && <p className="lead" style={{ margin: '10px 0 0' }}>{message}</p>}
      </div>

      <div className="card">
        <h3>Put it on her phone</h3>
        <p className="lead" style={{ margin: 0, fontSize: 13 }}>
          iPhone: open the app’s address in Safari → Share button → “Add to Home Screen”. It then opens like an app and
          works without internet. Android: Chrome menu → “Install app”.
        </p>
      </div>
    </main>
  );
};
