import { useState } from 'react';
import { getItem, nextTest, units } from '../content';
import { stories } from '../content/stories';
import { exportName, exportText, importText } from '../engine/backup';
import { isTopic, TOPIC_BYTES, topicFrom } from '../engine/notify';
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

/** Turning on notifications for a parent's own phone, and the steps to receive them. */
const Notifications = ({
  topic,
  onTopic,
  onTest,
}: {
  topic?: string;
  onTopic: (topic: string | undefined) => void;
  onTest: (topic: string) => Promise<boolean>;
}) => {
  const [test, setTest] = useState<'sending' | 'sent' | 'failed' | null>(null);
  const [paste, setPaste] = useState('');
  const [copied, setCopied] = useState(false);
  const turnOn = () => onTopic(topicFrom(crypto.getRandomValues(new Uint8Array(TOPIC_BYTES))));
  const sendTest = async () => {
    if (!topic) return;
    setTest('sending');
    setTest((await onTest(topic)) ? 'sent' : 'failed');
  };
  const share = async () => {
    if (!topic) return;
    const text = `ntfy channel: ${topic}\nhttps://ntfy.sh/${topic}`;
    try {
      if (navigator.share) await navigator.share({ text });
      else {
        await navigator.clipboard.writeText(text);
        setCopied(true);
      }
    } catch {
      // she cancelled the share sheet: nothing to do
    }
  };
  const pasted = paste.trim().toLowerCase();

  return (
    <div className="card">
      <h3>Notifications on my phone</h3>
      {topic ? (
        <>
          <p style={{ marginTop: 0, fontSize: 14 }}>
            <strong className="good">✓ On.</strong> You get a notification when she starts practising Spanish, and a report when she
            reaches her daily goal or leaves the app.
          </p>
          <ol className="notify-steps">
            <li>On <strong>your own</strong> phone, install the free app <strong>ntfy</strong> (App Store or Google Play).</li>
            <li>
              Open ntfy, tap <strong>+</strong> and type this channel name exactly:
              <code className="channel">{topic}</code>
            </li>
            <li>Come back here and tap “Send a test”. Your phone should show it within a few seconds.</li>
          </ol>
          <p className="lead" style={{ fontSize: 12 }}>
            Keep the channel name private: anyone who knows it can see the notifications. They hold minutes, XP and
            scores — never a name.
          </p>
          <div style={{ display: 'grid', gap: 8 }}>
            <button className="btn warm" onClick={sendTest} disabled={test === 'sending'}>Send a test</button>
            {test === 'sent' && <p className="good" style={{ textAlign: 'center', margin: 0 }}>✓ Sent. Check your phone.</p>}
            {test === 'failed' && <p className="lead" style={{ textAlign: 'center', margin: 0 }}>Could not send it. Is the internet on?</p>}
            <button className="btn ghost" onClick={share}>Send the channel name to my phone</button>
            {copied && <p className="lead" style={{ textAlign: 'center', margin: 0 }}>Copied. Paste it into a message to yourself.</p>}
            <button className="link-btn" onClick={() => { setTest(null); onTopic(undefined); }}>Turn notifications off</button>
          </div>
        </>
      ) : (
        <>
          <p className="lead" style={{ marginTop: 0, fontSize: 14 }}>
            Get a notification on your own phone when she starts practising, and a report when she reaches her daily
            goal or leaves the app. She does not have to do anything.
          </p>
          <p className="lead" style={{ fontSize: 12 }}>
            This uses the free ntfy service. While it is on, her minutes, XP and scores (never her name) are sent over the
            internet to a private channel only your phone knows. While it is off, nothing leaves this phone.
          </p>
          <div style={{ display: 'grid', gap: 8 }}>
            <button className="btn warm" onClick={turnOn}>Turn notifications on (new channel)</button>
            <p className="lead" style={{ fontSize: 13, margin: '6px 0 0' }}>
              Already get notifications from her Exam Prep app? Paste that channel name to get both in one place:
            </p>
            <input
              className="typed"
              style={{ fontSize: 16 }}
              placeholder="prep-xxxx-xxxx-xxxx"
              value={paste}
              autoCapitalize="off"
              autoCorrect="off"
              spellCheck={false}
              onChange={(e) => setPaste(e.target.value)}
            />
            <button className="btn ghost" disabled={!isTopic(pasted)} onClick={() => onTopic(pasted)}>
              {paste && !isTopic(pasted) ? 'That is not a channel name' : 'Use this channel'}
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export const Parents = ({
  progress,
  onImport,
  onBack,
  onTopic,
  onTest,
  onChangeCode,
}: {
  progress: Progress;
  onImport: (p: Progress) => void;
  onBack: () => void;
  onTopic: (topic: string | undefined) => void;
  onTest: (topic: string) => Promise<boolean>;
  onChangeCode: () => void;
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

      <Notifications topic={isTopic(p.notifyTopic) ? p.notifyTopic : undefined} onTopic={onTopic} onTest={onTest} />

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
        <h3>Parent code</h3>
        <p className="lead" style={{ margin: '0 0 8px', fontSize: 13 }}>This page asks for your 4-digit code every time.</p>
        <button className="btn ghost" onClick={onChangeCode}>Change the code</button>
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
