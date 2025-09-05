export type MDPart =
  | { type: 'text'; text: string }
  | { type: 'code'; lang?: string; code: string };

// Very small fenced code block parser for streaming-friendly content
export function parseMarkdownBlocks(input: string): MDPart[] {
  const parts: MDPart[] = [];
  const lines = input.split(/\r?\n/);
  let i = 0;
  let buffer: string[] = [];
  function flushText() {
    if (buffer.length) {
      parts.push({ type: 'text', text: buffer.join('\n') });
      buffer = [];
    }
  }
  while (i < lines.length) {
    const line = lines[i];
    const fence = line.match(/^```(\w+)?\s*$/);
    if (fence) {
      const lang = fence[1];
      flushText();
      i++;
      const code: string[] = [];
      while (i < lines.length && !lines[i].startsWith('```')) {
        code.push(lines[i]);
        i++;
      }
      // if closing fence found, skip it
      if (i < lines.length && lines[i].startsWith('```')) i++;
      parts.push({ type: 'code', lang, code: code.join('\n') });
      continue;
    }
    buffer.push(line);
    i++;
  }
  flushText();
  return parts;
}

