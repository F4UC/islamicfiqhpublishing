'use strict';
const fs = require('fs');
const path = require('path');

const READING_CPM = 900; // tunable: Thai characters per minute

const ROOT = path.resolve(__dirname, '..');

const VOID_ELEMENTS = new Set([
  'area','base','br','col','embed','hr','img','input',
  'link','meta','param','source','track','wbr'
]);

function getClasses(raw) {
  const m = raw.match(/\bclass=["']([^"']*)["']/);
  return m ? m[1].split(/\s+/).filter(Boolean) : [];
}

function getTagName(raw) {
  const m = raw.match(/^<\/?([a-zA-Z][a-zA-Z0-9-]*)/);
  return m ? m[1].toLowerCase() : '';
}

function isOpenTag(raw) {
  return raw.startsWith('<') && !raw.startsWith('</') && !raw.startsWith('<!--') && !raw.startsWith('<!') && !raw.startsWith('<?') && !raw.endsWith('/>');
}

function isSelfClose(raw) {
  return raw.endsWith('/>');
}

function isCloseTag(raw) {
  return raw.startsWith('</');
}

function isExcluded(raw) {
  if (/\slang=["']ar["']/.test(raw)) return true;
  if (/\sdir=["']rtl["']/.test(raw)) return true;
  const classes = getClasses(raw);
  const EXCL = new Set(['ar','ar-block','ar-feature','ar-inline',
    'bibliography-section','ar-toggle','fn-list','footnotes',
    'quote-container','source-toggle']);
  return classes.some(c => EXCL.has(c));
}

function isThaiQuote(raw) {
  return getClasses(raw).includes('thai-quote');
}

function isArticleBody(raw) {
  return getClasses(raw).includes('article-body');
}

// Parse next token from str starting at position i.
// Returns { token, end } or null if at end.
function nextToken(str, i) {
  if (i >= str.length) return null;
  if (str[i] !== '<') {
    // text node: read until next '<'
    const end = str.indexOf('<', i);
    return end === -1
      ? { token: str.slice(i), end: str.length, isTag: false }
      : { token: str.slice(i, end), end, isTag: false };
  }
  // comment
  if (str.startsWith('<!--', i)) {
    const end = str.indexOf('-->', i + 4);
    return end === -1
      ? { token: str.slice(i), end: str.length, isTag: true }
      : { token: str.slice(i, end + 3), end: end + 3, isTag: true };
  }
  // DOCTYPE / processing instruction
  if (str[i + 1] === '!' || str[i + 1] === '?') {
    const end = str.indexOf('>', i + 1);
    return end === -1
      ? { token: str.slice(i), end: str.length, isTag: true }
      : { token: str.slice(i, end + 1), end: end + 1, isTag: true };
  }
  // regular tag — must handle quoted attributes
  let j = i + 1;
  let inQuote = null;
  while (j < str.length) {
    const ch = str[j];
    if (inQuote) {
      if (ch === inQuote) inQuote = null;
    } else if (ch === '"' || ch === "'") {
      inQuote = ch;
    } else if (ch === '>') {
      return { token: str.slice(i, j + 1), end: j + 1, isTag: true };
    }
    j++;
  }
  return { token: str.slice(i), end: str.length, isTag: true };
}

function extractThaiChars(html) {
  let i = 0;
  let inArticleBody = false;
  // Stack entries: { tag, excluded, thaiQuote }
  const stack = [];
  let excludeCount = 0;   // depth into excluded subtrees
  let thaiQuoteCount = 0; // depth into .thai-quote (overrides exclude)
  let result = '';

  while (i < html.length) {
    const tok = nextToken(html, i);
    if (!tok) break;
    i = tok.end;

    if (!tok.isTag) {
      // Text node
      if (inArticleBody && (thaiQuoteCount > 0 || excludeCount === 0)) {
        result += tok.token;
      }
      continue;
    }

    const raw = tok.token;
    if (raw.startsWith('<!--') || raw.startsWith('<!') || raw.startsWith('<?')) continue;

    const tagName = getTagName(raw);
    if (!tagName) continue;

    if (isCloseTag(raw)) {
      if (stack.length === 0) continue;
      // Pop stack entries until we find matching tag
      let idx = -1;
      for (let k = stack.length - 1; k >= 0; k--) {
        if (stack[k].tag === tagName) { idx = k; break; }
      }
      if (idx === -1) continue;
      // Unwind
      for (let k = stack.length - 1; k >= idx; k--) {
        const frame = stack[k];
        if (frame.tag === 'div' || frame.tag === 'section' || frame.tag === 'blockquote' || frame.tag === 'ul' || frame.tag === 'ol' || frame.tag === 'details' || frame.tag === 'nav' || frame.tag === 'aside' || frame.tag === 'article' || frame.tag === 'header' || frame.tag === 'footer' || frame.tag === 'main' || frame.tag === 'p' || frame.tag === 'span' || frame.tag === 'h1' || frame.tag === 'h2' || frame.tag === 'h3' || frame.tag === 'h4' || frame.tag === 'h5' || frame.tag === 'h6' || frame.tag === 'li' || frame.tag === 'td' || frame.tag === 'th' || frame.tag === 'tr' || frame.tag === 'tbody' || frame.tag === 'table') {
          if (frame.isArticleBody) inArticleBody = false;
          if (frame.excluded) excludeCount = Math.max(0, excludeCount - 1);
          if (frame.thaiQuote) thaiQuoteCount = Math.max(0, thaiQuoteCount - 1);
        }
      }
      stack.splice(idx);
      continue;
    }

    if (isOpenTag(raw) && !isSelfClose(raw) && !VOID_ELEMENTS.has(tagName)) {
      const artBody = isArticleBody(raw);
      const excl = inArticleBody && isExcluded(raw);
      const tq = inArticleBody && isThaiQuote(raw);

      if (artBody) inArticleBody = true;
      if (excl) excludeCount++;
      if (tq) thaiQuoteCount++;

      stack.push({ tag: tagName, isArticleBody: artBody, excluded: excl, thaiQuote: tq });
    }
  }

  return result;
}

function countChars(text) {
  // Remove HTML entities, collapse whitespace, count chars
  return text
    .replace(/&[a-z]+;|&#\d+;|&#x[0-9a-f]+;/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .length;
}

function computeReadingTime(chars) {
  return Math.max(1, Math.ceil(chars / READING_CPM));
}

// ---- Main ----
const articlesPath = path.join(ROOT, 'articles.json');
const articles = JSON.parse(fs.readFileSync(articlesPath, 'utf8'));

const rows = [];
for (const art of articles) {
  // url is like /articles/kalam/foo.html — strip leading slash
  const relPath = art.url.replace(/^\//, '');
  const filePath = path.join(ROOT, relPath);

  let chars = 0;
  let error = null;
  if (!fs.existsSync(filePath)) {
    error = 'FILE NOT FOUND';
  } else {
    const html = fs.readFileSync(filePath, 'utf8');
    const text = extractThaiChars(html);
    chars = countChars(text);
  }

  const minutes = error ? null : computeReadingTime(chars);
  art.readingTime = minutes;

  rows.push({ id: art.id, chars, minutes, error });
}

fs.writeFileSync(articlesPath, JSON.stringify(articles, null, 2) + '\n', 'utf8');

// Print table
const pad = (s, n) => String(s).padEnd(n);
const rpad = (s, n) => String(s).padStart(n);
console.log('\n' + pad('id', 56) + rpad('chars', 8) + rpad('min', 5));
console.log('-'.repeat(70));
for (const r of rows) {
  const minStr = r.error ? r.error : String(r.minutes);
  console.log(pad(r.id, 56) + rpad(r.chars, 8) + rpad(minStr, 5));
}
console.log('\nRPM constant: ' + READING_CPM + ' chars/min');
console.log('articles.json updated — ' + articles.length + ' entries');
