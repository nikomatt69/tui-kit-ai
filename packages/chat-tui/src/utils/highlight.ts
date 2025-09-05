// Minimal syntax highlighter using blessed tags

const JS_KW = new Set(['const','let','var','function','return','if','else','for','while','switch','case','break','continue','class','extends','new','try','catch','finally','throw','import','from','export','default','async','await','this','super']);
const PY_KW = new Set(['def','return','if','elif','else','for','while','break','continue','class','try','except','finally','raise','import','from','as','with','lambda','yield','None','True','False','pass']);

function escape(str: string) {
  return str.replace(/[{}]/g, ch => ch === '{' ? '\\{' : '\\}');
}

export function highlightCode(lang: string, code: string): string {
  lang = (lang || '').toLowerCase();
  switch (lang) {
    case 'js':
    case 'ts':
    case 'javascript':
    case 'typescript':
      return highlightJs(code);
    case 'json':
      return highlightJson(code);
    case 'py':
    case 'python':
      return highlightPy(code);
    case 'sh':
    case 'bash':
      return highlightShell(code);
    default:
      return escape(code);
  }
}

function color(tok: string, fg: string) {
  return `{${fg}-fg}${tok}{/${fg}-fg}`;
}

function highlightJs(code: string): string {
  return code.split(/\n/).map(line => {
    let out = '';
    let i = 0;
    while (i < line.length) {
      const rest = line.slice(i);
      // comment
      const cmt = rest.match(/^\/\/.*$/);
      if (cmt) { out += color(escape(cmt[0]), 'grey'); break; }
      // string
      const str = rest.match(/^("([^"\\]|\\.)*"|'([^'\\]|\\.)*'|`([^`\\]|\\.)*`)/);
      if (str) { out += color(escape(str[0]), 'yellow'); i += str[0].length; continue; }
      // number
      const num = rest.match(/^\b\d+(?:\.\d+)?\b/);
      if (num) { out += color(num[0], 'magenta'); i += num[0].length; continue; }
      // identifier or keyword
      const id = rest.match(/^\b[\w$]+\b/);
      if (id) { out += JS_KW.has(id[0]) ? color(id[0],'cyan') : escape(id[0]); i += id[0].length; continue; }
      out += escape(line[i]); i++;
    }
    return out;
  }).join('\n');
}

function highlightJson(code: string): string {
  try {
    const obj = JSON.parse(code);
    code = JSON.stringify(obj, null, 2);
  } catch {}
  return code.replace(/("[^"]*"\s*:)|("[^"]*")|(\b\d+\b)|(true|false|null)/g, (_m, key, str, num, lit) => {
    if (key) return color(key, 'cyan');
    if (str) return color(str, 'yellow');
    if (num) return color(num, 'magenta');
    if (lit) return color(lit, 'red');
    return _m;
  });
}

function highlightPy(code: string): string {
  return code.split(/\n/).map(line => {
    const hash = line.indexOf('#');
    const body = hash >= 0 ? line.slice(0, hash) : line;
    const cm = hash >= 0 ? line.slice(hash) : '';
    const highlighted = body.replace(/\b[A-Za-z_][A-Za-z0-9_]*\b/g, id => PY_KW.has(id) ? color(id,'cyan') : id)
      .replace(/("[^"]*"|'[^']*')/g, s => color(s,'yellow'))
      .replace(/\b\d+(?:\.\d+)?\b/g, n => color(n,'magenta'));
    return escape(highlighted) + (cm ? color(escape(cm), 'grey') : '');
  }).join('\n');
}

function highlightShell(code: string): string {
  return code.split(/\n/).map(line => {
    if (line.trim().startsWith('#')) return color(escape(line), 'grey');
    return line.replace(/("[^"]*"|'[^']*')/g, s => color(s,'yellow'));
  }).join('\n');
}

