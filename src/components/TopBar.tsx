import type { Progress } from '../engine/types';

export const TopBar = ({ p, onToggleMute, onProfile }: { p: Progress; onToggleMute: () => void; onProfile: () => void }) => {
  const pct = Math.min(1, p.dailyGoal ? p.xpToday / p.dailyGoal : 0);
  const r = 15;
  const circumference = 2 * Math.PI * r;
  return (
    <header className="topbar">
      <div className="stat flame" title="Streak">
        <span className="emoji">🔥</span>
        {p.streak}
      </div>
      <div className="stat xp" title="XP today (fish treats for Coco)">
        <span className="emoji">🐟</span>
        {p.xpToday}
      </div>
      {p.freezes > 0 && (
        <div className="stat" title="Streak freeze">
          <span className="emoji">🧊</span>
          {p.freezes}
        </div>
      )}
      <div className="goal-ring">
        <svg className="ring" viewBox="0 0 36 36">
          <circle cx="18" cy="18" r={r} fill="none" stroke="#e9e3da" strokeWidth="5" />
          <circle
            cx="18" cy="18" r={r} fill="none" stroke="var(--sun)" strokeWidth="5" strokeLinecap="round"
            strokeDasharray={`${circumference * pct} ${circumference}`}
          />
        </svg>
        <span>{p.xpToday}/{p.dailyGoal}</span>
        <button className="icon-btn" onClick={onToggleMute} aria-label={p.muted ? 'Turn sound on' : 'Turn sound off'}>
          {p.muted ? '🔇' : '🔊'}
        </button>
        <button className="icon-btn" onClick={onProfile} aria-label="Mi perfil">👤</button>
      </div>
    </header>
  );
};
