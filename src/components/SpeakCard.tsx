import { useEffect, useRef, useState } from 'react';
import { canRecognise, matchScore, startListening, verdictFor, type Listening } from '../audio/listen';
import { canRecord, playUrl, startRecording, type Recording } from '../audio/recorder';
import { speak, stopSpeaking } from '../audio/speech';
import { checkOpenAnswer } from '../engine/answers';
import { SpanishSentence } from './SpanishWord';

export type SpeakTarget =
  | { mode: 'repeat'; es: string; en: string }
  | { mode: 'answer'; question: string; en: string; starts: string[]; example: string };

type Result = { url: string | null; heard: string[] };

/**
 * One thing to say out loud: listen to Coco, record yourself, play both back.
 * Where the browser can understand speech, it says how much it caught — gently.
 * She can always rate herself ("I said it well"), so a bad microphone or a
 * noisy room never marks her down.
 */
export const SpeakCard = ({ target, onDone }: { target: SpeakTarget; onDone: (correct: boolean) => void }) => {
  const [busy, setBusy] = useState<{ rec: Recording | null; ear: Listening | null } | null>(null);
  const [result, setResult] = useState<Result | null>(null);
  const [problem, setProblem] = useState(!canRecord() && !canRecognise());
  const urls = useRef<string[]>([]);
  const model = target.mode === 'repeat' ? target.es : target.question;

  useEffect(() => {
    speak(model);
    return () => {
      stopSpeaking();
      urls.current.forEach((u) => URL.revokeObjectURL(u));
    };
  }, [model]);

  const start = async () => {
    stopSpeaking();
    setResult(null);
    const ear = startListening();
    const rec = await startRecording();
    if (!ear && !rec) {
      setProblem(true);
      return;
    }
    setBusy({ rec, ear });
  };

  const stop = async () => {
    if (!busy) return;
    const [url, heard] = await Promise.all([busy.rec?.stop() ?? null, busy.ear?.stop() ?? Promise.resolve([])]);
    if (url) urls.current.push(url);
    setBusy(null);
    setResult({ url, heard });
  };

  // What the app made of it, if it could listen.
  let message: { tone: 'great' | 'close' | 'again'; text: string } | null = null;
  if (result && result.heard.length) {
    if (target.mode === 'repeat') {
      const v = verdictFor(matchScore(target.es, result.heard));
      message = {
        tone: v,
        text: v === 'great' ? '¡Muy bien! I understood every word.' : v === 'close' ? 'Almost — I caught most of it.' : 'I could not catch it all. Try again — or tell me you said it well.',
      };
    } else {
      const ok = result.heard.some((h) => checkOpenAnswer(h, target.starts).correct);
      message = ok
        ? { tone: 'great', text: '¡Muy bien! That is a real answer.' }
        : { tone: 'again', text: `Start your answer with “${target.starts[0]}…” — or tell me you said it well.` };
    }
  }

  return (
    <div className="speak-card">
      {target.mode === 'repeat' ? (
        <div className="prompt-card" style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
          <div style={{ fontSize: 22, fontWeight: 900 }}><SpanishSentence text={target.es} /></div>
          <div className="gap-en" style={{ margin: 0 }}>{target.en}</div>
        </div>
      ) : (
        <div className="prompt-card" style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
          <div style={{ fontSize: 22, fontWeight: 900 }}><SpanishSentence text={target.question} /></div>
          <div className="gap-en" style={{ margin: 0 }}>{target.en} — answer about yourself, starting “{target.starts[0]}…”.</div>
        </div>
      )}

      <div className="rec-row" style={{ justifyContent: 'center', marginBottom: 16 }}>
        <button className="chip" onClick={() => speak(model)}>🔊 Coco</button>
        <button className="chip" onClick={() => speak(model, { slow: true })}>🐢 Slowly</button>
      </div>

      {problem ? (
        <p className="lead" style={{ textAlign: 'center' }}>
          The microphone is not available here. Say it out loud anyway, then tell me how it went.
        </p>
      ) : busy ? (
        <button className="mic on" onClick={stop}>
          <span>⏹</span>
          Listening… tap when you finish
        </button>
      ) : (
        <button className="mic" onClick={start}>
          <span>🎙</span>
          {result ? 'Say it again' : 'Tap and speak'}
        </button>
      )}

      {result && (
        <div className="speak-result">
          {message && <div className={`speak-msg ${message.tone}`}>{message.text}</div>}
          {result.heard.length > 0 && <div className="heard">I heard: “{result.heard[0]}”</div>}
          <div className="rec-row" style={{ justifyContent: 'center' }}>
            {result.url && <button className="chip" onClick={() => playUrl(result.url!)}>▶ Me</button>}
            <button className="chip" onClick={() => speak(target.mode === 'repeat' ? target.es : target.example)}>
              ▶ {target.mode === 'repeat' ? 'Coco' : 'Example'}
            </button>
          </div>
          {target.mode === 'answer' && <div className="heard">For example: {target.example}</div>}
        </div>
      )}

      {(result || problem) && (
        <div className="self-rate">
          <button className="btn" onClick={() => onDone(true)}>
            {message?.tone === 'great' ? 'Continue' : 'I said it well ✓'}
          </button>
          {message?.tone !== 'great' && (
            <button className="btn ghost" onClick={() => onDone(false)}>Not yet — move on</button>
          )}
        </div>
      )}
    </div>
  );
};
