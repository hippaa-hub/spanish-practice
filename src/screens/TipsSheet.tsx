import { Coco } from '../art/Coco';
import { SpanishSentence } from '../components/SpanishWord';
import type { Unit } from '../content/types';

/** The short grammar card before a unit — the part Duolingo leaves out. */
export const TipsSheet = ({ unit, onClose }: { unit: Unit; onClose: () => void }) => {
  const tips = unit.tips;
  if (!tips) return null;
  return (
    <div className="sheet-backdrop" onClick={onClose}>
      <div className="sheet" onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Coco mood="think" size={64} />
          <div>
            <h2>{tips.title}</h2>
            <p style={{ margin: 0, color: 'var(--ink-soft)', fontSize: 14 }}>
              Unit {unit.number} · {unit.title}
            </p>
          </div>
        </div>
        {tips.lines.map((line) => (
          <p className="tip" key={line}>
            <SpanishSentence text={line} />
          </p>
        ))}
        {tips.table && (
          <div className="table-scroll">
          <table className="verbs">
            <thead>
              <tr>{tips.table.head.map((h) => <th key={h}>{h}</th>)}</tr>
            </thead>
            <tbody>
              {tips.table.rows.map((row) => (
                <tr key={row[0]}>
                  {row.map((cell, i) => (i === 0 ? <th key={cell}>{cell}</th> : <td key={cell}><SpanishSentence text={cell} /></td>))}
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        )}
        <button className="btn warm" onClick={onClose}>Got it</button>
      </div>
    </div>
  );
};
