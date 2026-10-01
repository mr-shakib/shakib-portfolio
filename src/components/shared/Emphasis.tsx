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

/** Plain text with the highlight markers removed (for aria-labels and meta). */
export function stripEmphasis(text: string) {
  return text.replace(/\*([^*]+)\*/g, "$1");
}
