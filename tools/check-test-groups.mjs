// CI runs the tests as parallel groups (package.json test:group1..N) instead of one long `npm test`.
// This makes sure the groups run exactly what `npm test` runs: every suite in one group, nothing extra.
// A test added to `npm test` must also go in a group (and the other way round). Run with: node tools/check-test-groups.mjs
import fs from 'node:fs';

const scripts = JSON.parse(fs.readFileSync('package.json', 'utf8')).scripts;
const cmds = s => s.split('&&').map(c => c.trim()).filter(Boolean);
const base = c => c.replace(/\s+--part=\d+$/, '');   // the screens suite runs in parts across two groups
const all = cmds(scripts.test);
const groups = Object.keys(scripts).filter(k => /^test:group\d+$/.test(k)).sort();
const inGroups = groups.flatMap(k => cmds(scripts[k]));
const problems = [];
if (!groups.length) problems.push('no test:group scripts in package.json');
for (const c of all) if (!inGroups.some(g => base(g) === c)) problems.push(`"${c}" is in npm test but in no test:group script`);
for (const g of inGroups) if (!all.includes(base(g))) problems.push(`"${g}" is in a test:group script but not in npm test`);
const parts = inGroups.filter(g => /--part=/.test(g));
for (const p of new Set(parts.map(base))) {
  const got = parts.filter(g => base(g) === p).map(g => g.match(/--part=(\d+)/)[1]).sort().join();
  if (got !== '1,2') problems.push(`"${p}" runs parts ${got}; it needs exactly --part=1 and --part=2`);
}
for (const g of inGroups.filter(g => !/--part=/.test(g))) if (inGroups.filter(x => x === g).length > 1) problems.push(`"${g}" is in more than one group`);
if (problems.length) { for (const p of problems) console.log('FAIL ' + p); process.exit(1); }
console.log(`ok   ${groups.length} test groups run exactly the ${all.length} commands in npm test`);
