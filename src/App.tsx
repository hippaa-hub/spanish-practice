import { useEffect, useRef, useState } from 'react';
import { setMuted } from './audio/sfx';
import { stopSpeaking } from './audio/speech';
import { TopBar } from './components/TopBar';
import type { PathNode, Unit } from './content/types';
import { dayKey } from './engine/dates';
import { addMinutes, addXp, finishNode, finishStory, finishWriting, nodeLevel, remember, saveDraft, setGoal, startDay } from './engine/progress';
import { emptyProgress, type Progress } from './engine/types';
import { buildPractice, buildTestPrep } from './engine/lesson';
import { nextTest } from './content';
import type { Exercise } from './engine/types';
import { Lesson } from './screens/Lesson';
import { Path } from './screens/Path';
import { Practice, practiceItems, type PracticeKind } from './screens/Practice';
import { TipsSheet } from './screens/TipsSheet';
import { Stories } from './screens/Stories';
import { StoryPlayer } from './screens/StoryPlayer';
import { Words } from './screens/Words';
import { getStory } from './content/stories';
import type { Story } from './content/types';
import { loadProgress, saveProgress } from './storage/db';
import { BadgeCelebration, ReportCard } from './components/Celebrations';
import { newBadges, weekReport, weekStart } from './engine/badges';
import { Parents } from './screens/Parents';
import { Profile } from './screens/Profile';
import { addDays } from './engine/dates';
import { SpeakHome, SpeakSession, type SpeakSet } from './screens/Speak';
import { WriteCoach, WriteHome } from './screens/Write';
import { getTask, type WritingTask } from './engine/writing';

type Tab = 'path' | 'stories' | 'speak' | 'write' | 'practice' | 'words' | 'profile' | 'parents';

type View =
  | { screen: 'tab'; tab: Tab }
  | { screen: 'lesson'; node: PathNode; unit: Unit; level: number }
  | { screen: 'practice-session'; title: string; exercises: Exercise[] }
  | { screen: 'story'; story: Story; nodeId?: string; from: Tab }
  | { screen: 'speak'; set: SpeakSet }
  | { screen: 'write'; task: WritingTask; nodeId?: string; from: Tab };

const PRACTICE_TITLES: Record<PracticeKind, string> = {
  fix: 'Fix my mistakes',
  review: 'Words to review',
  verbs: 'Verbos',
};

export const App = () => {
  const [progress, setProgress] = useState<Progress>(emptyProgress());
  const [loaded, setLoaded] = useState(false);
  const [view, setView] = useState<View>({ screen: 'tab', tab: 'path' });
  const [tips, setTips] = useState<Unit | null>(null);
  const [celebrate, setCelebrate] = useState<string[]>([]);
  const [report, setReport] = useState<ReturnType<typeof weekReport> | null>(null);
  const sessionStart = useRef<number | null>(null);

  useEffect(() => {
    loadProgress().then((p) => {
      let rolled = startDay(p);
      // Once a week, on the first visit, show last week's report card (if she practised).
      const thisWeek = weekStart(dayKey());
      if (rolled.lastReportWeek !== thisWeek) {
        const last = weekReport(rolled, addDays(thisWeek, -1));
        if (rolled.lastReportWeek && last.daysPractised > 0) setReport(last);
        rolled = { ...rolled, lastReportWeek: thisWeek };
      }
      setProgress(rolled);
      setMuted(rolled.muted);
      setLoaded(true);
    });
  }, []);

  useEffect(() => {
    if (loaded) void saveProgress(progress);
  }, [progress, loaded]);

  // Time spent in a lesson, story, speaking or writing, for the parent view.
  useEffect(() => {
    if (view.screen !== 'tab') {
      sessionStart.current ??= Date.now();
    } else if (sessionStart.current !== null) {
      const ms = Date.now() - sessionStart.current;
      sessionStart.current = null;
      setProgress((p) => addMinutes(p, ms));
    }
  }, [view.screen]);

  // New badges are celebrated on the main screens — never in the middle of a lesson.
  useEffect(() => {
    if (!loaded || view.screen !== 'tab') return;
    const fresh = newBadges(progress);
    if (fresh.length) {
      setProgress((p) => ({ ...p, badges: [...p.badges, ...fresh] }));
      setCelebrate((c) => [...c, ...fresh]);
    }
  }, [progress, loaded, view.screen]);

  if (!loaded) return <div className="app" />;

  if (view.screen === 'story') {
    return (
      <div className="app">
        <StoryPlayer
          story={view.story}
          onFinish={(xp) =>
            setProgress((p) => {
              const read = finishStory(addXp(p, xp, dayKey()), view.story.id);
              return view.nodeId ? finishNode(read, view.nodeId, 4) : read;
            })
          }
          onQuit={() => {
            stopSpeaking();
            setView({ screen: 'tab', tab: view.from });
          }}
        />
      </div>
    );
  }

  if (view.screen === 'speak') {
    return (
      <div className="app">
        <SpeakSession
          set={view.set}
          onAnswer={(itemIds, correct) => setProgress((p) => remember(p, itemIds, correct))}
          onFinish={(xp) => setProgress((p) => addXp(p, xp, dayKey()))}
          onQuit={() => {
            stopSpeaking();
            setView({ screen: 'tab', tab: 'speak' });
          }}
        />
      </div>
    );
  }

  if (view.screen === 'write') {
    return (
      <div className="app">
        <WriteCoach
          task={view.task}
          progress={progress}
          onSave={(partId, text) => setProgress((p) => saveDraft(p, view.task.id, partId, text))}
          onFinish={() => {
            const { progress: next, xp } = finishWriting(progress, view.task.id);
            setProgress(view.nodeId ? finishNode(next, view.nodeId, 4) : next);
            return xp;
          }}
          onQuit={() => setView({ screen: 'tab', tab: view.from })}
        />
      </div>
    );
  }

  if (view.screen === 'lesson' || view.screen === 'practice-session') {
    const lesson =
      view.screen === 'lesson'
        ? { node: view.node, unit: view.unit, level: view.level, exercises: undefined, title: undefined }
        : { node: undefined, unit: undefined, level: 4, exercises: view.exercises, title: view.title };
    return (
      <div className="app">
        <Lesson
          node={lesson.node}
          unit={lesson.unit}
          level={lesson.level}
          exercises={lesson.exercises}
          title={lesson.title}
          progress={progress}
          onAnswer={(itemIds, correct) => setProgress((p) => remember(p, itemIds, correct))}
          onFinish={({ xp }) =>
            setProgress((p) => {
              const withXp = addXp(p, xp, dayKey());
              return view.screen === 'lesson' ? finishNode(withXp, view.node.id, view.level) : withXp;
            })
          }
          onQuit={() => {
            stopSpeaking();
            setView({ screen: 'tab', tab: view.screen === 'lesson' ? 'path' : 'practice' });
          }}
        />
      </div>
    );
  }

  const startPractice = (kind: PracticeKind) => {
    const itemIds = practiceItems(progress, kind);
    const exercises = buildPractice({ itemIds, memory: progress.memory, today: dayKey() });
    if (exercises.length) {
      setView({ screen: 'practice-session', title: PRACTICE_TITLES[kind], exercises });
    }
  };

  const tab = view.tab;

  return (
    <div className="app">
      <TopBar
        p={progress}
        onProfile={() => setView({ screen: 'tab', tab: 'profile' })}
        onToggleMute={() =>
          setProgress((p) => {
            setMuted(!p.muted);
            return { ...p, muted: !p.muted };
          })
        }
      />

      {tab === 'path' && (
        <Path
          progress={progress}
          onStart={(node, unit) => {
            const story = node.story ? getStory(node.story) : undefined;
            const task = node.write ? getTask(node.write) : undefined;
            if (story) setView({ screen: 'story', story, nodeId: node.id, from: 'path' });
            else if (task) setView({ screen: 'write', task, nodeId: node.id, from: 'path' });
            else setView({ screen: 'lesson', node, unit, level: Math.min(4, nodeLevel(progress, node.id) + 1) });
          }}
          onTips={setTips}
        />
      )}
      {tab === 'stories' && (
        <Stories progress={progress} onOpen={(story) => setView({ screen: 'story', story, from: 'stories' })} />
      )}
      {tab === 'speak' && <SpeakHome progress={progress} onStart={(set) => setView({ screen: 'speak', set })} />}
      {tab === 'write' && (
        <WriteHome progress={progress} onOpen={(task) => setView({ screen: 'write', task, from: 'write' })} />
      )}
      {tab === 'practice' && (
        <Practice
          progress={progress}
          onStart={startPractice}
          onWords={() => setView({ screen: 'tab', tab: 'words' })}
          onTestPrep={() => {
            if (!nextTest) return;
            const exercises = buildTestPrep({ unitIds: nextTest.units, memory: progress.memory, today: dayKey() });
            setView({ screen: 'practice-session', title: `Test prep · ${nextTest.title}`, exercises });
          }}
        />
      )}
      {tab === 'words' && <Words progress={progress} onBack={() => setView({ screen: 'tab', tab: 'practice' })} />}
      {tab === 'profile' && (
        <Profile
          progress={progress}
          onGoal={(g) => setProgress((p) => setGoal(p, g))}
          onParents={() => setView({ screen: 'tab', tab: 'parents' })}
          onBack={() => setView({ screen: 'tab', tab: 'path' })}
        />
      )}
      {tab === 'parents' && (
        <Parents
          progress={progress}
          onImport={(p) => setProgress(startDay(p))}
          onBack={() => setView({ screen: 'tab', tab: 'profile' })}
        />
      )}

      <nav className="tabbar">
        {([
          ['path', '🗺️', 'Camino'],
          ['stories', '📚', 'Historias'],
          ['speak', '🎤', 'Hablar'],
          ['write', '✍️', 'Escribir'],
          ['practice', '💪', 'Práctica'],
        ] as const).map(([id, icon, label]) => (
          <button
            key={id}
            className={tab === id || (id === 'practice' && tab === 'words') ? 'on' : ''}
            onClick={() => setView({ screen: 'tab', tab: id })}
          >
            <span className="ico">{icon}</span>
            {label}
          </button>
        ))}
      </nav>

      {tips && <TipsSheet unit={tips} onClose={() => setTips(null)} />}
      {celebrate.length > 0 && <BadgeCelebration ids={celebrate} onClose={() => setCelebrate([])} />}
      {report && !celebrate.length && (
        <ReportCard report={report} title="Tu semana pasada" onClose={() => setReport(null)} />
      )}
    </div>
  );
};
