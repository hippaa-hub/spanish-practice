import { speak } from '../audio/speech';

/** Any Spanish text: tap it to hear it slowly (PLAN section 6, reading track). */
export const Spanish = ({ text, className = '' }: { text: string; className?: string }) => (
  <span className={`word ${className}`} onClick={() => speak(text, { slow: true })} role="button" tabIndex={0}
    onKeyDown={(e) => e.key === 'Enter' && speak(text, { slow: true })}>
    {text}
  </span>
);

/** A sentence where every word can be tapped on its own. */
export const SpanishSentence = ({ text, className = '' }: { text: string; className?: string }) => (
  <span className={className}>
    {text.split(' ').map((w, i) => (
      <span key={`${w}-${i}`}>
        {i > 0 && ' '}
        <Spanish text={w} />
      </span>
    ))}
  </span>
);
