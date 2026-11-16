import { useEffect, useRef, useState } from 'react';
import { setMuted } from './audio/sfx';
import { stopSpeaking } from './audio/speech';
import { TopBar } from './components/TopBar';
import type { PathNode, Unit } from './content/types';
import { dayKey } from './engine/dates';
import { addMinutes, addXp, finishNode, finishStory, finishWriting, nodeLevel, recordActivity, remember, saveDraft, setGoal, startDay } from './engine/progress';
import { ParentGate } from './components/ParentGate';
import { isTopic, reportMessage, RESUME_MS, startNote, stopNote, tasksNote, testNote } from './engine/notify';
import { ntfyPublish } from './storage/notify';
import { completeTask, dayDone, ensureToday, type ChoiceKind, type DayTask } from './engine/today';
import { pickMistakes } from './engine/teach';
import type { CocoMistake } from './content/cocoMistakes';
import { TeachCoco } from './screens/TeachCoco';
import { MyProgress } from './screens/MyProgress';
import { logMastery, masteredCount } from './engine/mastery';
import { ME_PRESENTO } from './engine/writing';
import { Coco } from './art/Coco';
import { Confetti } from './art/Confetti';
import { emptyProgress, type Progress } from './engine/types';
import { buildPractice, buildTestPrep } from './engine/lesson';
import { currentClass, getNode, nextTest, units } from './content';
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
import { answerSet, repeatSet, SpeakHome, SpeakSession, type SpeakSet } from './screens/Speak';
import { WriteCoach, WriteHome } from './screens/Write';
import { getTask, type WritingTask } from './engine/writing';

type Tab = 'path' | 'stories' | 'speak' | 'write' | 'practice' | 'words' | 'profile' | 'parents' | 'progress';

type View =
  | { screen: 'tab'; tab: Tab }
  | { screen: 'lesson'; node: PathNode; unit: Unit; level: number }
  | { screen: 'practice-session'; title: string; exercises: Exercise[]; kind?: PracticeKind | 'testprep'; from?: Tab }
  | { screen: 'story'; story: Story; nodeId?: string; from: Tab }
  | { screen: 'speak'; set: SpeakSet; from?: Tab }
  | { screen: 'teach'; mistakes: CocoMistake[]; from: Tab }
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
  /** Opening the parent page again always asks for the code again. */
  const [gateKey, setGateKey] = useState(0);

  useEffect(() => {
    loadProgress().then((p) => {
      let rolled = ensureToday(startDay(p));
      // Opening the app with ?parent-reset at the end of the address forgets the parent code (nothing else).
      if (new URLSearchParams(window.location.search).has('parent-reset')) {
        const { parentPin: _forgotten, ...rest } = rolled;
        rolled = rest as Progress;
        window.history.replaceState(null, '', window.location.pathname);
      }
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

  // ---- Notifications for a parent's phone (off unless a channel is set in the parent view) ----
  const studying = view.screen !== 'tab';
  const what =
    view.screen === 'lesson' ? `Lesson: ${view.node.title}`
      : view.screen === 'practice-session' ? view.title
        : view.screen === 'story' ? `Story: ${view.story.title}`
          : view.screen === 'speak' ? `Speaking: ${view.set.title}`
            : view.screen === 'write' ? `Writing: ${view.task.title}` : undefined;
  /** One stretch of practice: from opening something until she reaches her goal or leaves the app. */
  const sitting = useRef<{ startedAt: number; hiddenAt?: number } | null>(null);
  const live = useRef({ progress, studying, what });
  live.current = { progress, studying, what };

  const sittingMinutes = () => (sitting.current ? (Date.now() - sitting.current.startedAt) / 60000 : 0);
  const unsavedMinutes = () => (sessionStart.current ? Math.round((Date.now() - sessionStart.current) / 60000) : 0);

  const beginSitting = () => {
    const { progress: p, what: doing } = live.current;
    if (!isTopic(p.notifyTopic) || sitting.current) return;
    sitting.current = { startedAt: Date.now() };
    void ntfyPublish(p.notifyTopic, startNote(new Date(), dayKey(), doing));
  };
  const reportSitting = (kind: 'goal' | 'stopped') => {
    const p = live.current.progress;
    if (!isTopic(p.notifyTopic) || !sitting.current) return;
    void ntfyPublish(p.notifyTopic, stopNote(kind, new Date(), dayKey(), sittingMinutes(), reportMessage(p, dayKey(), unsavedMinutes())));
  };

  // She opened a lesson, story, speaking or writing.
  useEffect(() => {
    if (loaded && studying) beginSitting();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loaded, studying, progress.notifyTopic]);

  // She reached today's goal: send the report straight away.
  const goalMet = progress.xpToday >= progress.dailyGoal;
  const wasMet = useRef<boolean | null>(null);
  useEffect(() => {
    if (!loaded) return;
    if (wasMet.current === false && goalMet && sitting.current) {
      reportSitting('goal');
      sitting.current = null;
    }
    wasMet.current = goalMet;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loaded, goalMet]);

  // She left the app (closed it, switched away, or the screen locked): send the report.
  // Coming back within a few minutes carries on the same sitting quietly.
  useEffect(() => {
    const onHide = () => {
      const s = sitting.current;
      if (!s || s.hiddenAt !== undefined) return;
      reportSitting('stopped');
      s.hiddenAt = Date.now();
    };
    const onShow = () => {
      const s = sitting.current;
      if (!s || s.hiddenAt === undefined) return;
      if (Date.now() - s.hiddenAt < RESUME_MS) {
        s.hiddenAt = undefined;
        return;
      }
      sitting.current = null;
      if (live.current.studying) beginSitting();
    };
    const onVisibility = () => (document.visibilityState === 'hidden' ? onHide() : onShow());
    document.addEventListener('visibilitychange', onVisibility);
    window.addEventListener('pagehide', onHide);
    window.addEventListener('pageshow', onShow);
    return () => {
      document.removeEventListener('visibilitychange', onVisibility);
      window.removeEventListener('pagehide', onHide);
      window.removeEventListener('pageshow', onShow);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Keep a daily record of words mastered, so she can see it grow week by week.
  useEffect(() => {
    if (loaded && view.screen === 'tab') setProgress((p) => logMastery(p));
  }, [loaded, view.screen, progress.memory]);

  // A new day while the app stayed open: make today's tasks.
  useEffect(() => {
    if (loaded && view.screen === 'tab' && progress.today?.day !== dayKey()) {
      setProgress((p) => ensureToday(startDay(p)));
    }
  }, [loaded, view.screen, progress.today?.day]);

  // The last of today's tasks: celebrate on the map, and tell a parent's phone.
  const finishedToday = progress.today?.day === dayKey() && dayDone(progress.today);
  const wasFinished = useRef<boolean | null>(null);
  const [todayParty, setTodayParty] = useState(false);
  useEffect(() => {
    if (!loaded) return;
    if (wasFinished.current === false && finishedToday) {
      setTodayParty(true);
      const p = live.current.progress;
      if (isTopic(p.notifyTopic)) void ntfyPublish(p.notifyTopic, tasksNote(new Date(), dayKey(), reportMessage(p, dayKey(), unsavedMinutes())));
    }
    wasFinished.current = finishedToday;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loaded, finishedToday]);

  if (!loaded) return <div className="app" />;

  if (view.screen === 'story') {
    return (
      <div className="app">
        <StoryPlayer
          story={view.story}
          onFinish={(xp) =>
            setProgress((p) => {
              const read = completeTask(
                completeTask(recordActivity(finishStory(addXp(p, xp, dayKey()), view.story.id), 'stories'), {
                  story: view.story.id,
                }),
                { choice: 'story' },
              );
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

  if (view.screen === 'teach') {
    return (
      <div className="app">
        <TeachCoco
          mistakes={view.mistakes}
          onFinish={(xp) => setProgress((p) => completeTask(recordActivity(addXp(p, xp, dayKey()), 'lessons'), { choice: 'teach' }))}
          onQuit={() => setView({ screen: 'tab', tab: view.from })}
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
          onFinish={(xp) => setProgress((p) => completeTask(recordActivity(addXp(p, xp, dayKey()), 'speaking'), { choice: 'speak' }))}
          onQuit={() => {
            stopSpeaking();
            setView({ screen: 'tab', tab: view.from ?? 'speak' });
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
            const done = finishWriting(progress, view.task.id);
            const next = recordActivity(done.progress, 'writing');
            const xp = done.xp;
            const withChoice = completeTask(next, { choice: 'write' });
            setProgress(view.nodeId ? completeTask(finishNode(withChoice, view.nodeId, 4), { node: view.nodeId }) : withChoice);
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
          mastered={masteredCount(progress)}
          onAnswer={(itemIds, correct) => setProgress((p) => remember(p, itemIds, correct))}
          onFinish={({ xp, mistakes, asked }) =>
            setProgress((p) => {
              const withXp = recordActivity(addXp(p, xp, dayKey()), 'lessons', asked, Math.max(0, asked - mistakes));
              if (view.screen === 'lesson') return completeTask(finishNode(withXp, view.node.id, view.level), { node: view.node.id });
              const k = view.kind;
              return k === 'fix' || k === 'review' || k === 'testprep' ? completeTask(withXp, { practice: k }) : withXp;
            })
          }
          onQuit={() => {
            stopSpeaking();
            setView({ screen: 'tab', tab: view.screen === 'lesson' ? 'path' : (view.from ?? 'practice') });
          }}
        />
      </div>
    );
  }

  const startPractice = (kind: PracticeKind, from: Tab = 'practice') => {
    const itemIds = practiceItems(progress, kind);
    const exercises = buildPractice({ itemIds, memory: progress.memory, today: dayKey() });
    if (exercises.length) {
      setView({ screen: 'practice-session', title: PRACTICE_TITLES[kind], exercises, kind, from });
    }
  };

  const startTestPrep = (from: Tab) => {
    if (!nextTest) return;
    const exercises = buildTestPrep({ unitIds: nextTest.units, memory: progress.memory, today: dayKey() });
    setView({ screen: 'practice-session', title: `Test prep · ${nextTest.title}`, exercises, kind: 'testprep', from });
  };

  /** A stop on the map: a lesson, a story, or a writing task. */
  const openNode = (node: PathNode, unit: Unit) => {
    const story = node.story ? getStory(node.story) : undefined;
    const task = node.write ? getTask(node.write) : undefined;
    if (story) setView({ screen: 'story', story, nodeId: node.id, from: 'path' });
    else if (task) setView({ screen: 'write', task, nodeId: node.id, from: 'path' });
    else setView({ screen: 'lesson', node, unit, level: Math.min(4, nodeLevel(progress, node.id) + 1) });
  };

  /** Task 3: her choice. */
  const startChoice = (choice: ChoiceKind, t: DayTask) => {
    const classUnit = units.find((u) => u.id === (currentClass.unitId ?? currentClass.practiseUnitId));
    if (choice === 'teach') setView({ screen: 'teach', mistakes: pickMistakes(progress), from: 'path' });
    else if (choice === 'story' && t.kind === 'choice') {
      const story = getStory(t.storyId);
      if (story) setView({ screen: 'story', story, from: 'path' });
    } else if (choice === 'speak' && classUnit) {
      const set = (classUnit.questions ?? []).length ? answerSet(classUnit) : repeatSet(classUnit);
      setView({ screen: 'speak', set, from: 'path' });
    } else if (choice === 'write') {
      const node = classUnit?.nodes.find((n) => n.write);
      const task = (node?.write && getTask(node.write)) || ME_PRESENTO;
      setView({ screen: 'write', task, from: 'path' });
    }
  };

  /** One of today's tasks. */
  const startTask = (t: DayTask) => {
    if (t.kind === 'lesson' || t.kind === 'class') {
      const found = getNode(t.nodeId);
      if (found) openNode(found.node, found.unit);
    } else if (t.kind === 'fix' || t.kind === 'review') {
      startPractice(t.kind, 'path');
      // nothing left to fix (she fixed it all elsewhere): the task is done
      if (!practiceItems(progress, t.kind).length) setProgress((p) => completeTask(p, { practice: t.kind as 'fix' | 'review' }));
    } else if (t.kind === 'testprep') startTestPrep('path');
    else if (t.kind === 'story') {
      const story = getStory(t.storyId);
      if (story) setView({ screen: 'story', story, from: 'path' });
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
          onStart={openNode}
          onTips={setTips}
          onTask={startTask}
          onChoice={startChoice}
          onProgress={() => setView({ screen: 'tab', tab: 'progress' })}
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
          onStart={(kind) => startPractice(kind)}
          onWords={() => setView({ screen: 'tab', tab: 'words' })}
          onTeach={() => setView({ screen: 'teach', mistakes: pickMistakes(progress), from: 'practice' })}
          onTestPrep={() => startTestPrep('practice')}
        />
      )}
      {tab === 'words' && <Words progress={progress} onBack={() => setView({ screen: 'tab', tab: 'practice' })} />}
      {tab === 'progress' && <MyProgress progress={progress} onBack={() => setView({ screen: 'tab', tab: 'path' })} />}
      {tab === 'profile' && (
        <Profile
          progress={progress}
          onGoal={(g) => setProgress((p) => setGoal(p, g))}
          onParents={() => {
            setGateKey((k) => k + 1);
            setView({ screen: 'tab', tab: 'parents' });
          }}
          onBack={() => setView({ screen: 'tab', tab: 'path' })}
          onProgress={() => setView({ screen: 'tab', tab: 'progress' })}
        />
      )}
      {tab === 'parents' && (
        <ParentGate
          key={gateKey}
          savedPin={progress.parentPin}
          onSetPin={(parentPin) => setProgress((p) => ({ ...p, parentPin }))}
          onClose={() => setView({ screen: 'tab', tab: 'profile' })}
        >
          {(changeCode) => (
            <Parents
              progress={progress}
              // An imported file keeps this phone's code and notification channel.
              onImport={(p) => setProgress((cur) => startDay({ ...p, parentPin: cur.parentPin, notifyTopic: cur.notifyTopic }))}
              onBack={() => setView({ screen: 'tab', tab: 'profile' })}
              onTopic={(notifyTopic) =>
                setProgress((p) => {
                  const { notifyTopic: _old, ...rest } = p;
                  return notifyTopic ? { ...rest, notifyTopic } : (rest as Progress);
                })
              }
              onTest={(t) => ntfyPublish(t, testNote(new Date()))}
              onChangeCode={changeCode}
            />
          )}
        </ParentGate>
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
      {todayParty && view.screen === 'tab' && !celebrate.length && (
        <div className="sheet-backdrop center" onClick={() => setTodayParty(false)}>
          <Confetti />
          <div className="sheet pop" onClick={(e) => e.stopPropagation()}>
            <Coco mood="dance" size={120} />
            <h2>¡Hoy terminado!</h2>
            <p className="lead" style={{ margin: 0 }}>
              All three of today’s tasks are done. ¡Fantástico! Tomorrow Coco has three new ones for you.
            </p>
            <p className="lead" style={{ margin: 0, fontSize: 13 }}>Want more? Any open lesson on the map is a bonus.</p>
            <button className="btn" onClick={() => setTodayParty(false)}>¡Gracias, Coco!</button>
          </div>
        </div>
      )}
      {celebrate.length > 0 && <BadgeCelebration ids={celebrate} onClose={() => setCelebrate([])} />}
      {report && !celebrate.length && (
        <ReportCard report={report} title="Tu semana pasada" onClose={() => setReport(null)} />
      )}
    </div>
  );
};
