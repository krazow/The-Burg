// Balance sim guards (wave 1): extra bots and checks that keep known exploits from coming back.
// Every guard takes a difficulty ('classic' = today's full game with Normal numbers, the default; or 'easy', 'normal',
// 'hard' once the sim plays each difficulty) and reads its targets from GUARD_TARGETS, so one set of bots can guard
// every difficulty. tests/sim.test.mjs adds guardJobs() to its game list and calls guardChecks() after the report.
//
//   i26-b01 + i38-a20  Out-and-about bots: idle + the free farm counter + Shop local; careless + 2 random visits a week
//   i38-a18 + i37-b07  careless and idle ceilings per game length, and careless 5-year games in every background
//   i38-a19            'drifter': careless, and applies to a random job it qualifies for in 30% of weeks
//   i35-b04            every story challenge played by good, struggling and idle bots (4 games each)
//   i42-a30            'idle tripper' (rest + the same Dayton stops weekly) and 'work-town tripper' (commuter + a weekly
//                      trip to the town of the job)
//   i59-b04 + i59-b05  the swap table (planner with one weekly slot or add-on changed, same dice) and the dead-option check
//   i63-a06            'jobless', 'comeback' (no job for 40 weeks, then the planner) and 'diver' (finances the pickup early)

// The targets per difficulty (to-do 2 stage 4): Normal and Hard as today, Easy a little looser. ceiling = target plus a
// small margin for dice (the sim fails above the ceiling).
export const GUARD_TARGETS = {
  classic: { careless: 60, idle: 50, planner: 70, jobless: 45 },
  hard:    { careless: 60, idle: 50, planner: 70, jobless: 45 },
  normal:  { careless: 60, idle: 50, planner: 70, jobless: 45 },
  easy:    { careless: 65, idle: 55, planner: 75, jobless: 50 }
};
export const MARGIN = 2;
export const guardTargets = (diff = 'classic') => {
  const t = GUARD_TARGETS[diff] || GUARD_TARGETS.classic;
  return { ...t, ceiling: { careless: t.careless + MARGIN, idle: t.idle + MARGIN, jobless: t.jobless } };
};

// bot name -> the strategy it plays (the sim's own bot code) and whose dice it reuses, so pairs compare directly
export const GUARD_BOTS = {
  idleV:       { play: 'idle',     seedAs: 'idle',     family: 'idle',     what: 'idle + farm counter + Shop local' },
  idleTripper: { play: 'idle',     seedAs: 'idle',     family: 'idle',     what: 'idle + Dayton depot and café every week' },
  carelessV:   { play: 'careless', seedAs: 'careless', family: 'careless', what: 'careless + 2 random visits a week' },
  drifter:     { play: 'careless', seedAs: 'careless', family: 'careless', what: 'careless, hops to a random job' },
  workTripper: { play: 'commuter', seedAs: 'commuter', what: 'commuter + a trip to the work town every week' },
  jobless:     { play: 'jobless',  seedAs: 'planner',  what: 'never works: Town, Outside, Rest' },
  comeback:    { play: 'planner',  seedAs: 'planner',  what: 'no job for 40 weeks, then the planner' },
  diver:       { play: 'planner',  seedAs: 'planner',  what: 'planner who finances the pickup early' }
};
// i59-b04: what each swap game changes (the planner's 6th slot is Rest; add-ons are its trips and visits)
export const SWAPS = ['rest', 'work', 'community', 'outdoors', 'hustle', 'study', 'noTrip', 'weeklyTrip', 'noCoffee', 'twoVisits'];
const SWAP_FOCUS = ['work', 'community', 'outdoors', 'hustle', 'study'];
const SWAP_NAME = { rest: 'Rest (as played)', noTrip: 'No monthly trip', weeklyTrip: 'A trip every week', noCoffee: 'No coffee', twoVisits: 'Two visits a week' };
const LENS = ['half', 'two', 'five', 'life'];

// The guard games for one difficulty. o: { scale, groups: Set of 'bots' | 'lengths' | 'challenges' | 'swap', scenarios }
export function guardJobs(diff = 'classic', o = {}) {
  const scale = o.scale || 1, n = k => Math.max(1, Math.round(k * scale)), dOpts = diff === 'classic' ? {} : { diff };
  const groups = o.groups || new Set(['bots', 'lengths', 'challenges']);
  const label = `guard:${diff}`, jobs = [];
  const add = (len, bot, count, opts = {}, extra = {}, g0 = 0) => {
    const b = GUARD_BOTS[bot] || { play: bot, seedAs: bot };
    for (let g = g0; g < g0 + count; g++) jobs.push({ len, strat: b.play, seedAs: b.seedAs, bot, g, opts: { ...dOpts, ...opts }, label, diff, ...extra });
  };
  if (groups.has('bots')) {
    for (const bot of ['idleV', 'idleTripper', 'carelessV', 'drifter']) { add('half', bot, n(4)); add('two', bot, n(3)); add('five', bot, n(2)); }
    add('two', 'workTripper', n(4));
    for (const bot of ['jobless', 'comeback', 'diver']) add('two', bot, n(4));
  }
  // i37-b07: careless 5-year games in every background (the per-length ceiling covers them)
  if (groups.has('lengths')) for (const bg of ['farm', 'grad', 'transplant', 'parent']) add('five', 'careless', n(2), { bg }, { bg });
  // i38-a18: more careless and idle games (new dice) where a length's median is a single game (Lifetime) or sits close to
  // the ceiling (6 months), so one game can't decide the check
  if (groups.has('lengths')) for (const bot of ['careless', 'idle']) { add('life', bot, 2, {}, { extraLen: true }, 10); add('half', bot, 6, {}, { extraLen: true }, 10); }
  // i35-b04: story challenges are always Hard lives, so they're played once (in Classic and Hard runs)
  if (groups.has('challenges') && (diff === 'classic' || diff === 'hard'))
    for (const [k, sc] of Object.entries(o.scenarios || {})) for (const [bot, play] of [['good', 'planner'], ['struggling', 'struggler'], ['idle', 'idle']])
      for (let g = 0; g < 4; g++) jobs.push({ len: sc.len, strat: play, seedAs: play, bot: `sc-${bot}`, g, opts: { bg: sc.bg, scenario: k }, label, diff, scenario: k });
  // i59-b04: the swap family, paired dice (the planner's game 0), one game per length
  if (groups.has('swap')) for (const len of LENS) for (const sw of SWAPS)
    jobs.push({ len, strat: 'planner', seedAs: 'planner', bot: `swap:${sw}`, g: 0, opts: { ...dOpts, swap: sw }, label, diff, swap: sw });
  return jobs;
}

const money = n => n == null ? '—' : (n < 0 ? '-$' : '$') + Math.abs(n).toLocaleString();
const med = a => { const s = [...a].sort((x, y) => x - y); return s.length ? s[Math.floor(s.length / 2)] : null; };

// The report section and the checks for one difficulty. base(strat, len?) returns the plain bots' games for this
// difficulty (for Classic: the sim's 'normal' rows).
export async function guardChecks(t, results, diff = 'classic', { base, scenarios = {}, check = true } = {}) {
  const T = guardTargets(diff), C = T.ceiling;
  const mine = results.filter(r => r.label === `guard:${diff}`);
  const bot = (b, len) => mine.filter(r => r.bot === b && (!len || r.len === len));
  const score = rs => med(rs.map(r => r.score));
  const name = diff === 'classic' ? 'Classic' : diff[0].toUpperCase() + diff.slice(1);
  let md = `\n## Balance guards: ${name}\n`;
  const fails = [];   // [check name, problem or '']
  const want = (title, bad) => fails.push([title, bad || '']);

  // i38-a18 + i37-b07: careless and idle per length, and careless 5-year games per background
  const lens = LENS.filter(l => base('careless', l).length || base('idle', l).length);
  if (lens.length) {
    md += `\n**Careless and idle per length** (i38-a18; ceilings ${C.careless} and ${C.idle}):\n\n| Length | Careless | Idle |\n|---|---|---|\n`;
    const over = [];
    for (const l of lens) {
      const more = st => mine.filter(r => r.extraLen && r.strat === st && r.len === l);
      const c = score([...base('careless', l), ...more('careless')]), i = score([...base('idle', l), ...more('idle')]);
      md += `| ${l} | ${c ?? '—'} | ${i ?? '—'} |\n`;
      if (c != null && c > C.careless) over.push(`careless ${l} ${c}`);
      if (i != null && i > C.idle) over.push(`idle ${l} ${i}`);
    }
    const bgs = [...new Set(mine.filter(r => r.bg).map(r => r.bg))];
    if (bgs.length) {
      md += `\nCareless 5-year games per background: ${bgs.map(bg => `${bg} ${score(mine.filter(r => r.bg === bg))}`).join(', ')}.\n`;
      for (const bg of bgs) { const c = score(mine.filter(r => r.bg === bg)); if (c > C.careless) over.push(`careless 5-year ${bg} ${c}`); }
    }
    want(`i38-a18 (${name}): careless and idle stay under their ceilings at every length and background`, over.join(', '));
  }

  // i26-b01, i38-a20, i38-a19, i42-a30: careless and idle bots that also use Out and about, trips or job hopping
  const fam = Object.entries(GUARD_BOTS).filter(([b, v]) => v.family && bot(b).length);
  if (fam.length) {
    md += `\n**Out-and-about, trip and job-hopping bots** (each held to its family's ceiling):\n\n| Bot | Plays | 6 mo | 2 yr | 5 yr | All | Ceiling |\n|---|---|---|---|---|---|---|\n`;
    const over = [];
    for (const [b, v] of fam) {
      const all = score(bot(b)), cap = C[v.family];
      md += `| ${b} | ${v.what} | ${['half', 'two', 'five'].map(l => score(bot(b, l)) ?? '—').join(' | ')} | ${all} | ${cap} |\n`;
      if (all > cap) over.push(`${b} ${all} (ceiling ${cap})`);
    }
    want(`i26-b01/i38-a19/i38-a20/i42-a30 (${name}): out-and-about, tripping and job-hopping careless and idle bots stay under their ceilings`, over.join(', '));
  }
  // i42-a30: a trip to the work town every week can't buy more than 5 points over the same commuter
  if (bot('workTripper').length) {
    const wt = bot('workTripper'), cm = base('commuter', 'two').filter(r => wt.some(x => x.g === r.g));
    const a = score(wt), b = score(cm);
    md += `\nWork-town tripper (2 years) **${a}** vs the commuter with the same dice **${b ?? '—'}** (at most 5 more).\n`;
    if (b != null) want(`i42-a30 (${name}): the work-town tripper stays within 5 of the commuter (${a} vs ${b})`, a > b + 5 ? `${a} vs ${b}` : '');
  }
  // i63-a06: a no-job life, a comeback and an early truck buyer (2-year games)
  if (bot('jobless').length) {
    const j = score(bot('jobless')), cb = score(bot('comeback')), dv = score(bot('diver'));
    const pl = score(base('planner', 'two').filter(r => bot('diver').some(x => x.g === r.g)));
    md += `\n**No job, a comeback, an early truck** (i63-a06, 2 years): jobless **${j}** (${T.jobless} or below), comeback **${cb}** (jobless + 10 or more), diver **${dv}** vs planner **${pl ?? '—'}** (planner + 1 or below).\n`;
    want(`i63-a06 (${name}): jobless ${T.jobless} or below (${j})`, j > T.jobless ? `jobless ${j}` : '');
    if (cb != null) want(`i63-a06 (${name}): a comeback scores 10+ over jobless (${cb} vs ${j})`, cb < j + 10 ? `comeback ${cb}, jobless ${j}` : '');
    if (dv != null && pl != null) want(`i63-a06 (${name}): financing the pickup early doesn't beat the planner (${dv} vs ${pl})`, dv > pl + 1 ? `diver ${dv}, planner ${pl}` : '');
  }

  // i35-b04: every story challenge, played well, struggling and idle
  const scs = [...new Set(mine.filter(r => r.scenario).map(r => r.scenario))];
  if (scs.length) {
    md += `\n**Story challenges** (i35-b04; 4 games per bot):\n\n| Challenge | Bot | Won | Median win week | Median score | Median cash at the end |\n|---|---|---|---|---|---|\n`;
    const idleWins = [];
    for (const k of scs) for (const b of ['good', 'struggling', 'idle']) {
      const rs = mine.filter(r => r.scenario === k && r.bot === `sc-${b}`); if (!rs.length) continue;
      const won = rs.filter(r => r.scWin);
      md += `| ${(scenarios[k] && scenarios[k].name) || k} | ${b} | ${won.length} of ${rs.length} | ${won.length ? med(won.map(r => r.scWeek)) : '—'} | ${score(rs)} | ${money(med(rs.map(r => r.cash)))} |\n`;
      if (process.env.SIM_DEBUG) console.log(k, b, 'cash', rs.map(r => r.cash).join(','), 'nw', rs.map(r => r.nw).join(','));
      if (b === 'idle' && won.length > rs.length / 4) idleWins.push(`${k}: idle won ${won.length} of ${rs.length}`);
    }
    want(`i35-b04 (${name}): idle play wins no challenge more than 1 game in 4`, idleWins.join(', '));
  }

  // i59-b04 + i59-b05: the swap table and dead options
  const sw = mine.filter(r => r.swap);
  if (sw.length) {
    const swapLens = LENS.filter(l => sw.some(r => r.len === l && r.swap === 'rest'));
    const pts = (s, l) => { const a = score(sw.filter(r => r.swap === s && r.len === l)), b = score(sw.filter(r => r.swap === 'rest' && r.len === l)); return a == null || b == null ? null : a - b; };
    md += `\n**What each weekly choice is worth** (i59-b04): the planner with its Rest slot swapped, or an add-on changed, same dice; points against Rest.\n\n| Choice | ${swapLens.join(' | ')} |\n|---|${swapLens.map(() => '---|').join('')}\n`;
    for (const s of SWAPS) md += `| ${SWAP_NAME[s] || s} | ${swapLens.map(l => { const p = pts(s, l); return p == null ? '—' : s === 'rest' ? score(sw.filter(r => r.swap === 'rest' && r.len === l)) : (p > 0 ? '+' : '') + p; }).join(' | ')} |\n`;
    const dead = SWAP_FOCUS.filter(s => {
      const ls = swapLens.filter(l => !(s === 'study' && l === 'half') && pts(s, l) != null);
      return ls.length && ls.every(l => pts(s, l) <= -2);
    });
    want(`i59-b05 (${name}): no weekly choice loses to Rest by 2+ at every length`, dead.map(s => `dead option: ${s}`).join(', '));
  }

  console.log(md);
  if (check) for (const [title, bad] of fails) await t.check(title, async () => { if (bad) throw new Error(bad); });
  return md;
}
