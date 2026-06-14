#!/usr/bin/env node
'use strict';

/*
 * lint-article.js — house-style linter for Thai article prose.
 * Usage:  node scripts/lint-article.js <file.html> [more.html ...]
 *
 * Checks 4 rules on PROSE ONLY. Non-prose regions are masked out first
 * (line numbers are preserved): <head>, <style>, <script>, HTML comments
 * <!-- ... -->, and any element carrying class "poem-th" (S2 verse exception).
 *
 *   [R1] "ทว่า" in prose                       (S2 / Rule 14 — use "แต่")
 *   [R2] "มิใช่"                                (S2 — use "ไม่ใช่")
 *   [R3] em-dash "—" (U+2014) in prose          (S3 — use "-"; <title> em-dash is
 *                                                in <head>, already masked, per Rule 44)
 *   [R4] ไม้ยมก "ๆ" with no space after it      (S4 — "ๆ" attaches to the word
 *                                                before and needs one space after)
 *
 * Exit code: 0 if all files PASS, 1 if any file FAILs, 2 on usage/IO error.
 *
 * NOTE ON R4: the source scan request specified the regex /(?<=[^\s\n>])ๆ/.
 * That lookbehind matches every "ๆ" preceded by a non-space char — i.e. the
 * HOUSE-STYLE-CORRECT attached form "ต่างๆ" — so it flags all 30 correct yamok
 * in the canonical moon-sighting article and would FAIL it. Per S4 the real
 * violation is a MISSING SPACE AFTER "ๆ", so R4 is implemented as
 * /ๆ(?=[฀-๺a-zA-Z0-9])/ (yamok immediately followed by a Thai/Latin/
 * digit char). This makes the canonical PASS and still catches "กันดีๆครับ".
 * Flagged for editorial ratification.
 */

const fs = require('fs');

/* R1 uses a negative lookbehind so it does NOT fire mid-word: "บทว่าด้วย"
   (บท "chapter" + ว่าด้วย) contains "ทว่า" but is not the conjunction. The real
   conjunction follows a space / tag / punctuation, never a Thai consonant. */
const RULES = [
  { id: 'R1', re: /(?<![ก-ฮ])ทว่า/,            desc: '"ทว่า" ในร้อยแก้ว (ใช้ "แต่")' },
  { id: 'R2', re: /มิใช่/,                          desc: '"มิใช่" (ใช้ "ไม่ใช่")' },
  { id: 'R3', re: /—/,                         desc: 'em-dash "—" ในร้อยแก้ว (ใช้ "-")' },
  { id: 'R4', re: /ๆ(?=[฀-๺a-zA-Z0-9])/,  desc: 'ไม้ยมก "ๆ" ไม่เว้นวรรคหลัง' }
];

/* Replace every non-newline char of each match with a space, so the text is
   neutralised but line numbers and column positions are preserved. */
function blank(src, re) {
  return src.replace(re, function (m) { return m.replace(/[^\n]/g, ' '); });
}

function maskNonProse(html) {
  html = blank(html, /<head\b[\s\S]*?<\/head>/i);
  html = blank(html, /<style\b[\s\S]*?<\/style>/gi);
  html = blank(html, /<script\b[\s\S]*?<\/script>/gi);
  html = blank(html, /<!--[\s\S]*?-->/g);
  // poem-th elements (verse blocks, S2 exception) — non-nested
  html = blank(html, /<([a-zA-Z][\w-]*)\b[^>]*\bclass\s*=\s*"[^"]*\bpoem-th\b[^"]*"[^>]*>[\s\S]*?<\/\1>/g);
  // Arabic blocks (lang="ar" / dir="rtl") — S1-S8 govern THAI prose only, never
  // Arabic text; an em-dash inside an Arabic citation is out of scope.
  html = blank(html, /<([a-zA-Z][\w-]*)\b[^>]*(?:lang\s*=\s*"ar"|dir\s*=\s*"rtl")[^>]*>[\s\S]*?<\/\1>/gi);
  return html;
}

function snippet(line, idx) {
  var start = Math.max(0, idx - 8);
  var end = Math.min(line.length, idx + 12);
  return (start > 0 ? '…' : '') + line.slice(start, end).trim() + (end < line.length ? '…' : '');
}

function lintFile(file) {
  var raw;
  try { raw = fs.readFileSync(file, 'utf8'); }
  catch (e) { console.log('ERROR — ' + file + '  (' + e.message + ')'); return null; }

  var masked = maskNonProse(raw);
  var lines = masked.split('\n');
  var findings = [];

  lines.forEach(function (line, i) {
    RULES.forEach(function (rule) {
      var re = new RegExp(rule.re.source, 'g');
      var m;
      while ((m = re.exec(line)) !== null) {
        findings.push({ id: rule.id, line: i + 1, text: snippet(line, m.index) });
        if (m.index === re.lastIndex) re.lastIndex++; // guard zero-width
      }
    });
  });

  findings.sort(function (a, b) { return a.line - b.line; });
  return findings;
}

function main() {
  var files = process.argv.slice(2);
  if (!files.length) {
    console.error('usage: node scripts/lint-article.js <file.html> [more.html ...]');
    process.exit(2);
  }
  var anyFail = false;
  files.forEach(function (file) {
    var findings = lintFile(file);
    if (findings === null) { anyFail = true; return; }
    if (findings.length === 0) {
      console.log('PASS — ' + file);
    } else {
      anyFail = true;
      console.log('FAIL — ' + file);
      findings.forEach(function (f) {
        console.log('  [' + f.id + '] line ' + f.line + ': "' + f.text + '"');
      });
    }
  });
  process.exit(anyFail ? 1 : 0);
}

main();
