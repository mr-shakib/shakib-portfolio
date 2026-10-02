/**
 * Renders text where *asterisk-wrapped* words are highlighted — the syntax
 * the admin's copy fields support.
 */
export function Emphasis({ text, className }: { text: string; className?: string }) {
  const parts = text.split(/\*([^*]+)\*/g);
  return (
    <>
      {parts.map((part, i) =>
        i % 2 === 1 ? (
          <span key={i} className={className}>
            {part}
          </span>
        ) : (
          part
        ),
      )}
    </>
  );
}

export interface EmphasisWord {
  text: string;
  /** Inside *asterisks*. */
  em: boolean;
  /** Preceded by whitespace (false for punctuation glued to a closing *). */
  spaced: boolean;
}

/** Split text into words, flagging the ones inside *asterisks*. */
export function emphasisWords(text: string): EmphasisWord[] {
  const words: EmphasisWord[] = [];
  const re = /\*([^*]+)\*|[^\s*]+/g;
  let last = 0;
  for (let m = re.exec(text); m; m = re.exec(text)) {
    const spaced = words.length > 0 && /\s/.test(text.slice(last, m.index));
    if (m[1] !== undefined) {
      m[1].trim().split(/\s+/).forEach((w, i) => words.push({ text: w, em: true, spaced: i > 0 || spaced }));
    } else {
      words.push({ text: m[0], em: false, spaced });
    }
    last = m.index + m[0].length;
  }
  return words;
}

/** Plain text with the highlight markers removed (for aria-labels and meta). */
export function stripEmphasis(text: string) {
  return text.replace(/\*([^*]+)\*/g, "$1");
}
