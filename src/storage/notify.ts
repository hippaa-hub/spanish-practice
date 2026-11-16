// Sends a notification to the parent's private channel on the free ntfy service.
// Only used when a parent has turned notifications on; nothing else in the app talks to the internet.
import type { Note } from '../engine/notify';

/** Resolves to true if the notification was accepted. Never throws. */
export type Publish = (topic: string, note: Note) => Promise<boolean>;

export const NTFY_URL = 'https://ntfy.sh/';

export const ntfyPublish: Publish = async (topic, note) => {
  try {
    // keepalive lets the report go out even while the app is being closed.
    const res = await fetch(NTFY_URL, { method: 'POST', body: JSON.stringify({ topic, ...note }), keepalive: true });
    return res.ok;
  } catch {
    return false; // offline: the next report carries the whole day anyway
  }
};
