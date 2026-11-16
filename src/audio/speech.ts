/** Spanish audio with the browser's own voice (Web Speech API, es-ES). */

let voices: SpeechSynthesisVoice[] = [];

const loadVoices = () => {
  if (typeof speechSynthesis === 'undefined') return;
  voices = speechSynthesis.getVoices();
};

if (typeof speechSynthesis !== 'undefined') {
  loadVoices();
  speechSynthesis.addEventListener?.('voiceschanged', loadVoices);
}

/** Prefer a Spain Spanish voice, like her teacher. */
const spanishVoice = (): SpeechSynthesisVoice | undefined => {
  if (!voices.length) loadVoices();
  return (
    voices.find((v) => v.lang === 'es-ES' && /mónica|monica|google/i.test(v.name)) ??
    voices.find((v) => v.lang === 'es-ES') ??
    voices.find((v) => v.lang?.startsWith('es'))
  );
};

const spanishVoiceForReading = () => spanishVoice();

export const canSpeak = (): boolean => typeof speechSynthesis !== 'undefined';

export const speak = (text: string, { slow = false }: { slow?: boolean } = {}): void => {
  if (!canSpeak() || !text) return;
  try {
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text.replace(/[¿¡]/g, ''));
    const voice = spanishVoice();
    if (voice) u.voice = voice;
    u.lang = voice?.lang ?? 'es-ES';
    u.rate = slow ? 0.6 : 0.92;
    u.pitch = 1;
    speechSynthesis.speak(u);
  } catch {
    // No voice on this device: the app still works, just silently.
  }
};

export const stopSpeaking = (): void => {
  if (canSpeak()) speechSynthesis.cancel();
};

/** Where each word starts in a line, so the reader can light it up. */
export const wordStarts = (text: string): number[] => {
  const starts: number[] = [];
  const re = /\S+/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text))) starts.push(m.index);
  return starts;
};

/** Which word a character position falls in. */
export const wordAt = (starts: number[], charIndex: number): number => {
  let found = 0;
  for (let i = 0; i < starts.length; i += 1) if (starts[i] <= charIndex) found = i;
  return found;
};

/**
 * Read a line aloud and say which word is being spoken, so the story can
 * light each word up (reading while listening).
 * Some voices report each word (Safari, iPhone); others do not (Google voices in
 * Chrome), so the words are also timed by length as a fallback.
 * Returns a function that stops it.
 */
export const speakAlong = (
  text: string,
  { slow = false, onWord, onEnd }: { slow?: boolean; onWord: (i: number) => void; onEnd: () => void },
): (() => void) => {
  const starts = wordStarts(text);
  const timers: number[] = [];
  let finished = false;
  const finish = () => {
    if (finished) return;
    finished = true;
    timers.forEach((t) => window.clearTimeout(t));
    onEnd();
  };

  // Fallback timing: about 75 ms a letter at normal speed, slower when slow.
  const perChar = slow ? 115 : 72;
  const schedule = () => {
    starts.forEach((start, i) => timers.push(window.setTimeout(() => !finished && onWord(i), 250 + start * perChar)));
    timers.push(window.setTimeout(finish, 600 + text.length * perChar + 800));
  };

  if (!canSpeak()) {
    schedule();
    return finish;
  }
  try {
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    const voice = spanishVoiceForReading();
    if (voice) u.voice = voice;
    u.lang = voice?.lang ?? 'es-ES';
    u.rate = slow ? 0.62 : 0.9;
    let gotBoundary = false;
    u.onboundary = (e) => {
      if (e.name && e.name !== 'word') return;
      if (!gotBoundary) {
        gotBoundary = true;
        timers.forEach((t) => window.clearTimeout(t));
        timers.length = 0;
      }
      onWord(wordAt(starts, e.charIndex));
    };
    u.onend = finish;
    u.onerror = finish;
    schedule();
    speechSynthesis.speak(u);
  } catch {
    schedule();
  }
  return () => {
    speechSynthesis?.cancel();
    finish();
  };
};
