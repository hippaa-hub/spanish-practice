// The code for the parent view (same as in her Exam Prep app). It is a light lock to keep the
// tracker out of a child's way, not real security: the code never leaves the phone, and only a
// scrambled form of it is saved.
export const PIN_LENGTH = 4;

export function isValidPin(pin: string): boolean {
  return new RegExp(`^\\d{${PIN_LENGTH}}$`).test(pin);
}

/** A scrambled form of the code, so it is not sitting in the saved data as plain digits. */
export function scramblePin(pin: string): string {
  let h = 0x811c9dc5;
  for (const ch of `adele-spanish:${pin}`) {
    h ^= ch.charCodeAt(0);
    h = Math.imul(h, 0x01000193) >>> 0;
  }
  return h.toString(16).padStart(8, '0');
}

export function pinMatches(pin: string, saved: string | undefined): boolean {
  return saved !== undefined && isValidPin(pin) && scramblePin(pin) === saved;
}
