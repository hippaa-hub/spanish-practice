import { useEffect } from 'react';
import { Coco } from '../art/Coco';
import { Confetti } from '../art/Confetti';
import { sfxFinish } from '../audio/sfx';
import { getBadge, type WeekReport } from '../engine/badges';

const pretty = (day: string) => {
  const [y, m, d] = day.split('-').map(Number);
  return new Date(y, m - 1, d).toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' });
};

/** A new badge (or several) — shown on the main screens, never in the middle of a lesson. */
export const BadgeCelebration = ({ ids, onClose }: { ids: string[]; onClose: () => void }) => {
  useEffect(() => sfxFinish(), []);
  return (
    <div className="sheet-backdrop center" onClick={onClose}>
      <Confetti />
      <div className="sheet pop" onClick={(e) => e.stopPropagation()}>
        <Coco mood="cheer" size={90} />
        <h2>{ids.length > 1 ? '¡Nuevas medallas!' : '¡Nueva medalla!'}</h2>
        {ids.map((id) => {
          const b = getBadge(id);
          if (!b) return null;
          return (
            <div key={id} className="badge-row">
              <span className="badge-icon">{b.icon}</span>
              <span>
                <strong>{b.title}</strong>
                <div className="lead" style={{ margin: 0 }}>{b.en}</div>
              </span>
            </div>
          );
        })}
        <button className="btn" onClick={onClose}>¡Genial!</button>
      </div>
    </div>
  );
};

/** The weekly report card — her week at a glance. */
export const ReportCard = ({ report, title, onClose }: { report: WeekReport; title: string; onClose?: () => void }) => {
  const body = (
    <div className="report">
      <h3>{title}</h3>
      <div className="report-grid">
        <div><span className="big">{report.daysPractised}</span>/7 days practised</div>
        <div><span className="big">{report.goalDays}</span> days goal met</div>
        <div><span className="big">{report.xp}</span> XP</div>
        <div><span className="big">{report.minutes}</span> minutes</div>
      </div>
      {report.bestDay && <p className="lead" style={{ margin: '8px 0 0' }}>Best day: {pretty(report.bestDay)}</p>}
    </div>
  );
  if (!onClose) return body;
  return (
    <div className="sheet-backdrop center" onClick={onClose}>
      <div className="sheet pop" onClick={(e) => e.stopPropagation()}>
        <Coco mood={report.daysPractised >= 4 ? 'cheer' : 'happy'} size={80} />
        {body}
        <p className="lead">
          {report.daysPractised >= 5
            ? '¡Fantástico! A wonderful week.'
            : report.daysPractised >= 3
              ? '¡Muy bien! Can you make it five days this week?'
              : 'A new week — let’s practise a little every day.'}
        </p>
        <button className="btn" onClick={onClose}>¡Vamos!</button>
      </div>
    </div>
  );
};
