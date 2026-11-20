import { Fragment, type ReactNode } from "react";

// Minimal, SAFE inline formatter for office-entered copy: line breaks, **bold**
// and *italic*. Renders to React nodes only — no HTML injection / dangerouslySet.
function parseInline(line: string): ReactNode[] {
  const nodes: ReactNode[] = [];
  const re = /\*\*([^*]+)\*\*|\*([^*]+)\*/g;
  let last = 0;
  let key = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(line)) !== null) {
    if (m.index > last) nodes.push(line.slice(last, m.index));
    if (m[1] !== undefined) nodes.push(<strong key={key++}>{m[1]}</strong>);
    else if (m[2] !== undefined) nodes.push(<em key={key++}>{m[2]}</em>);
    last = re.lastIndex;
  }
  if (last < line.length) nodes.push(line.slice(last));
  return nodes;
}

export function RichText({ text, className }: { text: string; className?: string }) {
  const lines = text.split("\n");
  return (
    <span className={className}>
      {lines.map((line, i) => (
        <Fragment key={i}>
          {i > 0 && <br />}
          {parseInline(line)}
        </Fragment>
      ))}
    </span>
  );
}
