const KEYS = ['á', 'é', 'í', 'ó', 'ú', 'ñ', '¿', '¡'];

/** The accent buttons, so she never has to hunt for á or ñ on the keyboard. */
export const AccentBar = ({ onInsert }: { onInsert: (ch: string) => void }) => (
  <div className="accents">
    {KEYS.map((k) => (
      <button key={k} type="button" onMouseDown={(e) => e.preventDefault()} onClick={() => onInsert(k)}>
        {k}
      </button>
    ))}
  </div>
);
