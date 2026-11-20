// i7-a05: a reading-level check for the game's words. Loads the game's scripts in a bare sandbox (no browser, no
// network), gathers every event story, score tip, word meaning, tutorial step and Help guide line, and scores each with
// the Flesch-Kincaid grade formula (a simple syllable count). Lines above the limit are listed worst first.
//   node tools/reading-level.mjs            check: fails when a line is over the limit and not in the known list
//   node tools/reading-level.mjs --all      list every line over the limit, known or not
//   node tools/reading-level.mjs --update   write today's over-limit lines to the known list (after a rewrite pass)
// The known list (tools/reading-level-known.json) holds the lines that were already over the limit when the check
// started; new or changed lines must be at grade 6 or under (with a little room for one long word in a short line).
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const LIMIT = 6.5;          // "about grade 6"
const KNOWN = path.join(ROOT, 'tools', 'reading-level-known.json');

// a stand-in for anything the browser would have: every property is callable and returns another stand-in
const any = () => new Proxy(function(){}, {
  get: (t, k) => k === Symbol.toPrimitive ? () => '' : k === 'length' ? 0 : k === Symbol.iterator ? function*(){} : any(),
  apply: () => any(), construct: () => any(), has: () => true, set: () => true
});
export function loadGame(){
  const store = new Map();
  const ctx = { console, Math, Date, JSON, Intl, setTimeout: () => 0, clearTimeout: () => {}, setInterval: () => 0, clearInterval: () => {},
    document: any(), navigator: { userAgent: 'node' }, location: { search: '', hash: '', href: '' }, matchMedia: undefined,
    localStorage: { getItem: k => store.has(k) ? store.get(k) : null, setItem: (k, v) => store.set(k, String(v)), removeItem: k => store.delete(k), clear: () => store.clear() },
    addEventListener: () => {}, removeEventListener: () => {}, requestAnimationFrame: () => 0, performance: { now: () => 0 }, innerWidth: 390, innerHeight: 844 };
  ctx.window = ctx; ctx.self = ctx; ctx.globalThis = ctx;
  vm.createContext(ctx);
  const html = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
  for (const [, src] of html.matchAll(/<script src="([^"]+)"><\/script>/g)) {
    if (/boot\.js$/.test(src)) continue;                       // boot starts the game; we only want its words
    vm.runInContext(fs.readFileSync(path.join(ROOT, src), 'utf8'), ctx, { filename: src });
  }
  return ctx;
}

const plain = h => String(h).replace(/<[^>]+>/g, ' ').replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&[a-z]+;/g, ' ').replace(/\s+/g, ' ').trim();
// the lines to score, each { where, text }
export function gameLines(ctx = loadGame()){
  const out = [], add = (where, t) => { const x = plain(t); if (/[a-z]{3}/i.test(x)) out.push({ where, text: x }); };
  const get = expr => { try { return vm.runInContext(expr, ctx); } catch { return undefined; } };
  for (const name of ['EVENTS', 'ROAD_EVENTS', 'WORK_EVENTS', 'DUE_EVENTS', 'TOWN_EVENTS_W2', 'HEALTH_EVENTS', 'WX_EVENTS', 'STORY_EVENTS', 'JOB_EVENTS', 'PLAN_EVENTS', 'OUT_EVENTS', 'TOWN_EVENTS_A1']) {
    for (const ev of get(name) || []) if (typeof ev.text === 'string') add(`event: ${ev.title}`, ev.text);
  }
  for (const [k, v] of Object.entries(get('SCORE_TIPS') || {})) add(`tip: ${k}`, v);
  for (const [k, d] of Object.entries(get('DIFFS') || {})) add(`difficulty: ${k}`, d.blurb);
  for (const [k, d] of Object.entries(get('DIFF_WHO') || {})) add(`which mode: ${k}`, d);   // D9: Which mode is for me?
  add('which mode: note', get('DIFF_WHO_NOTE') || '');   // to-do 2 D1: the start screen's difficulty cards
  for (const [k, g] of Object.entries(get('GLOSSARY') || {})) { try { add(`word: ${g.w}`, typeof g.d === 'function' ? g.d() : g.d); } catch {} }
  for (const [i, st] of (get('TSTEPS') || []).entries()) add(`tutorial step ${i + 1}`, st.text);
  let guide = ''; try { guide = get('guideHTML()') || ''; } catch {}
  for (const sec of guide.split(/<section /).slice(1)) {
    const title = plain((sec.match(/<h2>(.*?)<\/h2>/) || [])[1] || '');
    for (const [, body] of sec.matchAll(/<(?:p|li)[^>]*>([\s\S]*?)<\/(?:p|li)>/g)) add(`help: ${title}`, body);
  }
  const seen = new Set();
  return out.filter(l => !seen.has(l.text) && seen.add(l.text));   // an event listed twice is scored once
}

// Flesch-Kincaid grade with a plain syllable count (vowel groups, a silent final e, at least one per word)
const syllables = w => {
  w = w.toLowerCase().replace(/[^a-z]/g, ''); if (!w) return 0; if (w.length <= 3) return 1;
  w = w.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, '').replace(/^y/, '');
  return Math.max(1, (w.match(/[aeiouy]{1,2}/g) || []).length);
};
export function grade(text){
  const t = text.replace(/\$?\d[\d,.]*%?/g, 'ten').replace(/[()]/g, ' ');
  const words = t.match(/[A-Za-z][A-Za-z'’-]*/g) || [];
  if (words.length < 4) return 0;                              // a label or a few words: nothing to score
  const sentences = Math.max(1, (t.match(/[.!?:;]+(\s|$)/g) || []).length);
  const syl = words.reduce((a, w) => a + w.split(/[-’']/).reduce((b, p) => b + syllables(p), 0), 0);
  return 0.39 * (words.length / sentences) + 11.8 * (syl / words.length) - 15.59;
}

export function check(lines = gameLines()){
  const scored = lines.map(l => ({ ...l, grade: Math.round(grade(l.text) * 10) / 10 })).sort((a, b) => b.grade - a.grade);
  const over = scored.filter(l => l.grade > LIMIT);
  const known = new Set(fs.existsSync(KNOWN) ? JSON.parse(fs.readFileSync(KNOWN, 'utf8')) : []);
  return { scored, over, fresh: over.filter(l => !known.has(l.text)) };
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const { scored, over, fresh } = check();
  const show = l => `  ${l.grade.toFixed(1).padStart(5)}  [${l.where}] ${l.text.length > 110 ? l.text.slice(0, 107) + '...' : l.text}`;
  if (process.argv.includes('--update')) {
    fs.writeFileSync(KNOWN, JSON.stringify(over.map(l => l.text), null, 0).replace(/","/g, '",\n"') + '\n');
    console.log(`Wrote ${over.length} known over-limit lines to tools/reading-level-known.json`);
    process.exit(0);
  }
  const avg = scored.reduce((a, l) => a + l.grade, 0) / Math.max(1, scored.length);
  console.log(`Reading level: ${scored.length} lines, average grade ${avg.toFixed(1)}, ${over.length} over grade ${LIMIT} (${over.length - fresh.length} already known).`);
  const list = process.argv.includes('--all') ? over : fresh;
  if (list.length) { console.log(`${process.argv.includes('--all') ? 'Over the limit' : 'New lines over the limit (rewrite these in shorter words and sentences)'}, worst first:`); list.slice(0, 40).forEach(l => console.log(show(l))); }
  if (fresh.length) process.exit(1);
}
