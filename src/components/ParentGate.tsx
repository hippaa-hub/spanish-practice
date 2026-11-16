// The door to the parent view (same as in her Exam Prep app): choose a 4-digit code the first
// time, type it every time after that. The gate locks again whenever the parent view is closed.
import { useCallback, useEffect, useState, type ReactNode } from 'react';
import { PIN_LENGTH, pinMatches, scramblePin } from '../engine/pin';

type Step = 'enter' | 'choose' | 'confirm' | 'open';

export const ParentGate = ({
  savedPin,
  onSetPin,
  onClose,
  children,
}: {
  savedPin?: string;
  onSetPin: (scrambled: string) => void;
  onClose: () => void;
  /** The parent view itself. It gets a function that starts "change the code". */
  children: (changeCode: () => void) => ReactNode;
}) => {
  const [step, setStep] = useState<Step>(savedPin ? 'enter' : 'choose');
  const [digits, setDigits] = useState('');
  const [first, setFirst] = useState('');
  const [message, setMessage] = useState('');

  const submit = useCallback(
    (pin: string) => {
      if (step === 'enter') {
        if (pinMatches(pin, savedPin)) {
          setStep('open');
          setMessage('');
        } else setMessage('That is not the code. Try again.');
      } else if (step === 'choose') {
        setFirst(pin);
        setStep('confirm');
        setMessage('');
      } else if (step === 'confirm') {
        if (pin === first) {
          onSetPin(scramblePin(pin));
          setStep('open');
          setMessage('');
        } else {
          setStep('choose');
          setFirst('');
          setMessage('Those two did not match. Choose a code again.');
        }
      }
      setDigits('');
    },
    [step, savedPin, first, onSetPin],
  );

  const press = useCallback(
    (d: string) => {
      setMessage('');
      setDigits((cur) => {
        if (cur.length >= PIN_LENGTH) return cur;
        const next = cur + d;
        if (next.length === PIN_LENGTH) window.setTimeout(() => submit(next), 120); // let the last dot show first
        return next;
      });
    },
    [submit],
  );
  const back = useCallback(() => setDigits((cur) => cur.slice(0, -1)), []);

  useEffect(() => {
    if (step === 'open') return;
    const onKey = (e: KeyboardEvent) => {
      if (/^\d$/.test(e.key)) press(e.key);
      else if (e.key === 'Backspace') back();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [step, press, back]);

  if (step === 'open') {
    return (
      <>
        {children(() => {
          setStep('choose');
          setFirst('');
          setDigits('');
          setMessage('');
        })}
      </>
    );
  }

  const title = step === 'enter' ? 'Enter the parent code' : step === 'choose' ? 'Choose a parent code' : 'Type the code again';
  const hint =
    step === 'enter'
      ? 'This part is for parents.'
      : step === 'choose'
        ? 'Four digits you will remember. It keeps the tracker and the notification settings private.'
        : 'Once more, to make sure.';

  return (
    <main className="screen gate">
      <button className="link-btn" onClick={onClose} style={{ paddingLeft: 0, alignSelf: 'flex-start' }}>← Perfil</button>
      <div className="gate-lock" aria-hidden="true">🔒</div>
      <h1>{title}</h1>
      <p className="lead" style={{ textAlign: 'center' }}>{hint}</p>
      <div className="pin-dots" role="img" aria-label={`${digits.length} of ${PIN_LENGTH} digits entered`}>
        {Array.from({ length: PIN_LENGTH }, (_, i) => (
          <i key={i} className={i < digits.length ? 'on' : ''} />
        ))}
      </div>
      <p className="gate-message" role="alert">{message}</p>
      <div className="keypad" role="group" aria-label="Number pad">
        {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((d) => (
          <button key={d} type="button" className="key" onClick={() => press(d)}>{d}</button>
        ))}
        <span />
        <button type="button" className="key" onClick={() => press('0')}>0</button>
        <button type="button" className="key del" onClick={back} aria-label="Delete the last digit">⌫</button>
      </div>
      {step === 'enter' && <p className="lead small-center">Forgotten it? See GUIDE.md on the Mac.</p>}
    </main>
  );
};
