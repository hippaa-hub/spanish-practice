# Adele's Spanish

A Duolingo-style app that follows Adele's beginner Spanish class (IB MYP
Phase 1). Built from `PLAN.md`; every word, phrase and verb
comes from `SPANISH_STUDIED.md` — her own lessons, nothing invented.

Mascot: **Coco**, a grey Canadian Sphynx kitten, drawn in Canva as a cartoon
sticker (8 poses in `public/coco/`). Nothing from Duolingo is copied but
the shape of the idea: a path of short lessons, streaks, XP and celebrations.

## Running it on this Mac

```
npm install --cache /Users/jeniahadas/scripts/.npm-cache
npm run dev
```

Then open the address it prints (`http://localhost:5193`). The `--host` flag is
already on, so the address with your Mac's IP in it opens on Adele's phone as
long as it is on the same wifi.

Other commands:

- `npm test` — checks the engine (strength maths, lesson building, levels,
  Unit Checks, answer checking with accents, streak and freeze) and the
  content (every id points at something real, every answer is an option).
- `npm run build` — makes the installable version in `dist/`.

## What is built

**Phase 1** — the path, Coco, streak and XP, tips cards, Spanish audio,
accent buttons, confetti, progress saved on the device.

**Phase 2** (16 Nov 2026)

- **Units 3 to 8** from her class: pronouns and tú/usted, the six verbs
  (one lesson each), countries and languages, getting to know someone,
  the classroom, and her timetable with *me gusta … porque …*. Each has a
  Tips card (the verb units show her teacher's table).
- **A Unit Check at the end of every unit**, in her teacher's formats:
  complete Daniel's self-introduction, put the dialogue in order, odd one out,
  tú or usted, and answering questions about herself. No new words, and the
  type of question keeps changing.
- **Four levels per lesson** (the 0/4 under each button). Level 1 shows the new
  words first; level 2 adds listening; level 3 adds dictation and typing the
  Spanish; level 4 asks her to answer in her own words.
- **New exercise types**: type what you hear (with a slow 🐢 button), write it
  in Spanish, answer the question, tú or usted.
- **The memory engine**: every word, phrase and verb form has its own strength
  that fades over the days and comes back up when she gets it right.
- **Bottom bar**: *Camino* (the path), *Práctica* (Fix my mistakes, Words to
  review, Verbos drill) and *Palabras* (every word she has met, with a
  strength bar).
- A wrong answer comes back once more at the end of the lesson — once, never
  more, so a hard question can never trap her.

**Phase 3** (16 Nov 2026) — stories and reading

- **Six short texts** in the *Historias* tab, and as 📖 stops on the path just
  before the Unit Check they belong to: Conócenos (posters, Unit 5); Mateo, el
  estudiante nuevo (Unit 6); El primer día en Tiflis — Adele is in it (Unit 7);
  Carlos y Elena en la biblioteca and El blog de Jiwon, written in the style of
  her 3 Nov reading test (Unit 8); and Petra y Jean: ¿Quién eres?, her current
  class topic.
- **Each story is read three times**, as the plan's reading research says:
  1 *Escucha* — the voice reads and each word lights up as it is spoken;
  2 *Lee conmigo* — line by line, slowly, she reads aloud with the voice;
  3 *Lee tú* — she reads each line alone, records herself, and plays her
  recording next to Coco's voice. Recordings stay in memory on the device and
  are gone when the story closes.
- **Questions in her teacher's Criterion B style**, labelled as such: facts,
  **true or false — and prove it by tapping the line**, what kind of text it is
  and what it is for, and "¿Y tú?" in her own words.
- Any word can be tapped to hear it slowly; the few words not in her units are
  dotted and show their meaning (colegio = school).
- 15 XP per story; a story read from Historias also turns its path stop gold.

**Phase 4** (16 Nov 2026) — speaking, writing, Unit 9

- **Unit 9 ¿Quién eres?** — what people can see (alta, el pelo largo, llevo
  gafas), what they cannot (tímida, creativa, amable), family and hobbies, the
  Petra y Jean story, and a Unit Check that is her **Identity Iceberg**.
  *The words are provisional:* her curriculum file only lists the topics her
  class is likely to do next. Replace them with her teacher's words in
  `src/content/unit-09-quien.ts` when the worksheets arrive.
- **Escribir** — a writing coach for **¡Me presento!** (the 6 Nov summative:
  herself, her teacher, a classmate, 3+ school things, a subject she likes and
  one she doesn't, with *porque*) and for the **Identity Iceberg** (3+ above the
  water, 6+ below, explain 3, reflect). One part at a time, with tap-to-start
  sentence beginnings, a live checklist, and pointers on verb mistakes
  (*yo tiene → yo tengo*, *soy doce años → tengo … años*). It never writes or
  rewrites a sentence for her. The iceberg is drawn with her own sentences
  above and below the water. Drafts save as she types; 15 XP once a day.
- **Hablar** — *Responde* (answer the class questions out loud), *Repite*
  (listen and repeat, per unit) and *Mi presentación* (say her own ¡Me
  presento! text). She records herself, plays it back next to Coco, and where
  the browser understands speech it says gently how much it caught. She can
  always say "I said it well" — a bad microphone never marks her down.
- **Speaking inside lessons**: at level 4 each lesson asks her to say one
  sentence out loud.
- The bottom bar is now Camino · Historias · Hablar · Escribir · Práctica;
  *Mis palabras* moved inside Práctica.

The "Esta semana en clase" card now points at Unit 9.

**Phase 5** (16 Nov 2026) — polish and the parent view

- **Profile** (👤 at the top): daily goal 10 / 20 / 30 XP, a five-week streak
  calendar, this week's report card, and all the badges from the plan (first
  lesson, 7- and 30-day streaks, 100 words, all verbs mastered, first story,
  first ¡Me presento!, one per unit finished). New badges are celebrated on
  the main screens, never in the middle of a lesson. Once a week she sees last
  week's report card.
- **For parents** (link at the bottom of the profile): days, minutes and XP
  this week and last, reading level, words and verbs, units, what she gets
  wrong most, her writing, export and import of progress.
- **Test prep** (plan section 6): when `nextTest` in `src/content/index.ts` is
  set, a card in Práctica builds a mixed lesson from just those units.
- **Offline**: tested by stopping the server and reloading — the app still
  opened in full. Google's font is cached too.
- **Privacy**: no surname and no teacher's name anywhere in the app.

**Parent tools** (16 Nov 2026) — the same as in her Exam Prep app:

- A 4-digit **parent code** in front of *For parents* (stored scrambled;
  `?parent-reset` forgets it).
- **Notifications to a parent's phone** through the free ntfy service: when she
  starts, when she reaches the daily goal, and when she leaves the app, with a
  short report in numbers only. Off until a parent turns it on; the channel can
  be the same one Exam Prep uses. Exported progress files never contain the
  code or the channel.

`GUIDE.md` (kept on the Mac, not published) explains installing on her phone,
publishing, and the weekly update.

## Adding a unit when her class moves on

1. Add the new words, phrases and sentences to `SPANISH_STUDIED.md`.
2. Copy `src/content/unit-02-presento.ts` to a new file, change the id, number,
   title, items, sentences and nodes. End it with a `kind: 'check'` node.
3. Add it to the list in `src/content/index.ts` and point `currentClass` at it.
4. Run `npm test` — it catches a typo in an id or an answer that is not one of
   the options.

Nothing else changes: the lesson builder and the memory engine pick it up.

## Where things live

- `src/content` — one file per unit. The only place content lives.
- `src/engine` — lesson building, memory strength, answer checking, XP and
  streak, with tests beside them.
- `src/screens`, `src/components`, `src/art` — the screens, the pictures and Coco.
- `src/storage` — saving progress on the device.

**Cat look** (16 Nov 2026): Coco is a grey Sphynx made in Canva (happy, wave,
cheer, oops, think, read, sleep, dance), with the app icon made from him. Lesson
buttons have cat ears, paw prints walk down the road, XP is shown as 🐟 fish
treats, and paws appear in the background, the progress bar, the active tab,
sparkles, confetti, sticker stamps and the finish screen.

**Locked path** (16 Nov 2026): lessons open in order — finishing a lesson once
(1/4) opens the next one; a story counts when read, a Unit Check when done.
The unit her class is on now (`currentClass.unitId`) is always open, still in
order inside it, and anything already started stays open. Tapping a locked
lesson says which one to finish first. Historias, Hablar, Escribir and
Práctica are not locked.
