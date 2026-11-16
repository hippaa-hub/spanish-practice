/** Small sounds made with Web Audio — no files to download. */
let ctx: AudioContext | null = null;
let muted = false;

export const setMuted = (value: boolean) => {
  muted = value;
};

const tone = (freq: number, start: number, length: number, gain = 0.09) => {
  if (muted) return;
  try {
    ctx ??= new (window.AudioContext ??
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    const osc = ctx.createOscillator();
    const vol = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.value = freq;
    vol.gain.setValueAtTime(0, ctx.currentTime + start);
    vol.gain.linearRampToValueAtTime(gain, ctx.currentTime + start + 0.02);
    vol.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + start + length);
    osc.connect(vol).connect(ctx.destination);
    osc.start(ctx.currentTime + start);
    osc.stop(ctx.currentTime + start + length + 0.05);
  } catch {
    // Audio blocked until she taps: nothing to do.
  }
};

export const sfxRight = () => {
  tone(660, 0, 0.14);
  tone(880, 0.1, 0.22);
};

export const sfxWrong = () => {
  tone(240, 0, 0.18, 0.07);
  tone(190, 0.12, 0.26, 0.07);
};

export const sfxFinish = () => {
  [523, 659, 784, 1047].forEach((f, i) => tone(f, i * 0.11, 0.3));
};

export const sfxTap = () => tone(520, 0, 0.06, 0.04);
