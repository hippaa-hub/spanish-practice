import { useState } from 'react';
import { Coco, type CocoMood } from '../art/Coco';
import { daysBetween, dayKey } from '../engine/dates';
import type { Progress } from '../engine/types';

/**
 * Coco's tips — about her class and her tests: her teacher's test formats
 * (Criterion B reading, Criterion D writing), the textbook's culture notes,
 * and the sentence starters from her projects. The point is to be ready for
 * the next test.
 */
export const TIPS: { tag: string; text: string }[] = [
  { tag: 'Reading test', text: 'For “true or false”, always copy the line from the text that proves it.' },
  { tag: 'Reading test', text: 'Read the questions first, then hunt for the answers in the text.' },
  { tag: 'Reading test', text: 'Your teacher asks what KIND of text it is: a blog greets readers, a dialogue has dashes, a profile lists facts.' },
  { tag: 'Writing', text: 'Say WHY with porque: Me gusta el arte porque es divertido.' },
  { tag: 'Writing', text: 'Age uses TENER: Tengo doce años — never “soy doce años”.' },
  { tag: 'Writing', text: 'Start every question with ¿ and every shout with ¡ — it counts in your writing.' },
  { tag: 'Writing', text: 'SER is for who you are: Soy estudiante. Ella es simpática.' },
  { tag: 'Speaking', text: 'Start a presentation with “¡Hola! Hoy voy a presentar…” and end with “Gracias por escuchar.”' },
  { tag: 'Speaking', text: 'Stuck in class? Say “¿Puede repetir, por favor?” or “¿Cómo se dice…?”' },
  { tag: 'Grammar', text: 'tú for friends and family — usted for the doctor, the police, a shop, and your teacher.' },
  { tag: 'Grammar', text: 'With yo the verb ends in -o: hablo, vivo, tengo… except soy!' },
  { tag: 'Culture', text: 'In Spain people greet friends with a kiss on each cheek.' },
  { tag: 'Culture', text: 'Spanish people have two surnames: Lucía Juares Camacho — one from each parent.' },
  { tag: 'Culture', text: 'ñ is a letter of its own, with its own sound: España, años, mañana.' },
];

const greeting = (p: Progress): { mood: CocoMood; line: string } => {
  const today = dayKey();
  if (!p.lastGoalDay && p.xpTotal === 0) return { mood: 'wave', line: '¡Hola Adele! Tap the first lesson to start.' };
  if (p.xpToday >= p.dailyGoal) return { mood: 'dance', line: '¡Meta cumplida! Today’s goal is done 🎉' };
  const away = p.lastActiveDay ? daysBetween(p.lastActiveDay, today) : 0;
  if (p.xpToday === 0 && away >= 2) return { mood: 'sleep', line: '¡Te echo de menos! I missed you. One lesson wakes me up.' };
  const left = p.dailyGoal - p.xpToday;
  const lessons = Math.max(1, Math.ceil(left / 10));
  return {
    mood: p.xpToday > 0 ? 'cheer' : 'wave',
    line: `¡Hola Adele! ${lessons} lesson${lessons > 1 ? 's' : ''} to today’s goal${p.streak ? ` — keep your 🔥 ${p.streak}!` : '.'}`,
  };
};

/** Coco at the top of the path: how today is going, plus a tip for the next test. Tap for another tip. */
export const CocoCoach = ({ progress }: { progress: Progress }) => {
  const start = Math.abs(dayKey().split('-').reduce((a, b) => a * 31 + Number(b), 7)) % TIPS.length;
  const [n, setN] = useState(start);
  const g = greeting(progress);
  const tip = TIPS[n % TIPS.length];
  return (
    <div className="coach" onClick={() => setN(n + 1)} role="button" aria-label="Another tip from Coco">
      <Coco mood={g.mood} size={84} />
      <div className="speech-bubble">
        <strong>{g.line}</strong>
        <div className="tip">
          <b>{tip.tag}:</b> {tip.text}
        </div>
      </div>
    </div>
  );
};
