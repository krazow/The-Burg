// Gameplay tests: plays the core loop the way a person does, by tapping. Run with: npm run test:gameplay
import { serve, launch, runner, seedScript, assert } from './helpers.mjs';

const srv = await serve();
const browser = await launch();
const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, serviceWorkers: 'block' });
await ctx.addInitScript(seedScript(20261116));
const page = await ctx.newPage();
const errors = [];
page.on('pageerror', e => errors.push(String(e)));
page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
const t = runner();

const open = '#modal:not(.hidden)';
const S = () => page.evaluate(() => JSON.parse(JSON.stringify(S)));
// close whatever sheet is open (Continue / OK, or the first choice of an event)
async function clearSheets(max = 6) {
  for (let i = 0; i < max; i++) {
    const b = await page.$(`${open} #ok, ${open} [data-i]`);
    if (!b) return;
    await b.click();
  }
}
// End Week ignores a second tap within 350 ms of the last week (double-tap guard), so wait like a person would
async function tapEnd() { await page.waitForFunction(() => performance.now() - PLAY_AT >= 350); await page.click('#end'); }
async function endWeek() { await tapEnd(); await clearSheets(); }

await page.goto(srv.url, { waitUntil: 'load' });

await t.check('the title offers all four game lengths', async () => {
  for (const k of ['half', 'two', 'five', 'life']) await page.waitForSelector(`[data-len=${k}]`);
});

await t.check('a new 6-month game starts in week one, age 18, on the Jobs tab', async () => {
  await page.fill('#nm', 'Tester');
  await page.click('[data-len=half]');
  await page.click('#start');
  const s = await S();
  assert(s.name === 'Tester' && s.len === 'half' && s.turn === 0, 'wrong new-game state');
  assert(Math.floor(s.ageMonths / 12) === 18, 'should start at 18');
  await page.waitForSelector('[data-apply]');
});

await t.check('applying for a job eventually gets you hired (one try per week)', async () => {
  for (let wk = 0; wk < 12; wk++) {
    await page.click('[data-tab=jobs]');
    await page.click('[data-apply="diner"]');
    const hired = await page.$(`${open} >> text=You're hired`);
    await clearSheets();
    if ((await S()).jobId) break;
    const again = await page.$('[data-apply="diner"]');
    assert(await again.isDisabled(), 'Apply should be disabled after one application this week');
    await page.click('[data-tab=home]');
    await endWeek();
    void hired;
  }
  assert((await S()).jobId === 'diner', 'never got hired in 12 weeks');
});

await t.check('ending a week moves the date forward 7 days and pays you', async () => {
  await page.click('[data-tab=home]');
  const before = await S();
  await page.click('[data-f=work]');
  await endWeek();
  const after = await S();
  assert(after.turn === before.turn + 1, 'turn did not advance');
  assert(after.date - before.date === 7 * 864e5, 'date did not move one week');
  assert(after.last && after.last.lines.some(([l]) => l.startsWith('Paycheck')), 'no paycheck line last week');
});

await t.check('an event shows choices, and choosing one shows a result', async () => {
  let seen = false;
  for (let i = 0; i < 20 && !seen; i++) {
    const t0 = (await S()).turn; await tapEnd();
    assert((await S()).turn === t0 + 1, 'End Week did not play a week');
    for (let k = 0; k < 3; k++) {
      const choice = await page.$(`${open} [data-i]`);
      if (choice) {
        const n = (await page.$$(`${open} [data-i]`)).length;
        await choice.click();
        if (n < 2) { await clearSheets(); continue; }   // an event with one way to go closes with a toast; look for one with a choice
        seen = true; await page.waitForSelector(`${open} #ok`);
        break;
      }
      const ok = await page.$(`${open} #ok`); if (ok) await ok.click(); else break;
    }
    await clearSheets();
  }
  assert(seen, 'no event in 20 weeks');
  const s = await S();
  assert(s.log.length > 2, 'event result not logged in the journal');
});

await t.check('⏩ 4 weeks plays up to four weeks and stops early when something happens', async () => {
  const before = (await S()).turn;
  assert(!(await page.isVisible('#ff4')), '⏩ 4 should hide behind a long press on a narrow phone');
  await page.dispatchEvent('#end', 'contextmenu');      // a long press on End Week opens the skip options
  await page.click(`${open} #sk4`);
  await clearSheets();
  const d = (await S()).turn - before;
  assert(d >= 1 && d <= 4, `skipped ${d} weeks`);
});

await t.check('the game saves to its slot, and Continue picks up the same week after a reload', async () => {
  const before = await S();
  assert(before.slot === 0, `first life should be in slot 1, was ${before.slot + 1}`);
  await page.reload({ waitUntil: 'load' });
  assert((await page.$$('[data-cont]')).length === 1, 'title should list one saved life');
  await page.click('[data-cont="0"]');
  const after = await S();
  assert(after.turn === before.turn && Math.round(after.money) === Math.round(before.money) && after.jobId === before.jobId, 'save did not round-trip');
});

await t.check('Menu → Save game saves to this life\'s own slot', async () => {
  await page.click('[data-tab=menu]');
  await page.click('#save');
  await page.evaluate(() => { S.money += 1; });
  await page.click(`${open} [data-copy="0"]`);
  assert(Math.round((await page.evaluate(() => slots()))[0].money) === Math.round((await S()).money), 'Save did not write slot 1');
  assert(!(await page.$(open)), 'the sheet should close after saving');
});

await t.check('Menu → Save game to another slot makes a checkpoint, and play continues in the original', async () => {
  await page.click('[data-tab=menu]');
  await page.click('#save');
  await page.click('[data-copy="1"]');
  const slots = await page.evaluate(() => slots());
  assert(slots[0] && slots[1] && slots[1].slot === 1 && slots[1].turn === slots[0].turn, 'copy not saved to slot 2');
  assert((await S()).slot === 0, 'should still be playing slot 1');
  await endWeek();
  const after = await page.evaluate(() => slots());
  assert(after[0].turn === after[1].turn + 1, 'the copy should stay at the checkpoint while the original moves on');
});

await t.check('Menu → Load game switches to the copy, saving the current life first', async () => {
  const cur = await S();
  await page.click('[data-tab=menu]');
  await page.click('#load');
  await page.click('[data-load="1"]');
  const s = await S();
  assert(s.slot === 1 && s.turn === cur.turn - 1, 'did not load the copy');
  assert((await page.evaluate(() => slots()))[0].turn === cur.turn, 'the original was not kept');
  await page.click('[data-tab=menu]'); await page.click('#load'); await page.click('[data-load="0"]');
  assert((await S()).slot === 0, 'could not load the original back');
});

await t.check('the title lists every life, and deleting one asks first', async () => {
  await page.click('[data-tab=menu]'); await page.click('#title');
  assert((await page.$$('[data-cont]')).length === 2, 'title should list two lives');
  await page.click('[data-del="1"]');
  await page.click(`${open} #no`);
  assert((await page.$$('[data-cont]')).length === 2, 'Keep it should keep the life');
  await page.click('[data-del="1"]');
  await page.click(`${open} #yes`);
  assert((await page.$$('[data-cont]')).length === 1, 'delete did not remove the life');
  await page.click('[data-cont="0"]');
});

await t.check('End Week shows this week\'s focus, and the week strip shows what it did', async () => {
  await page.click('[data-tab=home]');
  await page.click('[data-f=outdoors]');
  assert((await page.textContent('#end')).includes('Outside'), 'End Week should show the focus');
  await endWeek();
  await page.click('[data-tab=home]');
  await page.waitForSelector('#strip');
  await page.click('#strip');
  await page.waitForSelector(`${open} >> text=Total change in cash`);
  await page.click(`${open} #ok`);
});

await t.check('tapping a stat explains what moves it', async () => {
  await page.click('[data-stat=community]');
  await page.waitForSelector(`${open} >> text=Goes up with`);
  await page.click(`${open} #ok`);
  await page.click('[data-stat=net]');
  await page.waitForSelector(`${open} >> text=Home equity`);
  await page.click(`${open} #ok`);
});

await t.check('a single-choice event resolves in one tap', async () => {
  await page.evaluate(() => showEvent(EVENTS.find(e => e.title === 'Found money')));
  await page.click(`${open} [data-i="0"]`);
  assert(!(await page.$(open)), 'the sheet should close after one tap');
  assert(await page.isVisible('#toast'), 'the result should show as a toast');
});

await t.check('a long streak of one focus fades, and a rut gets a warning', async () => {
  await page.evaluate(() => { S.focus = 'rest'; S.streakF = 'rest'; S.streakN = 8; render(); });
  assert((await page.textContent('.fdesc')).includes('weeks in a row'), 'Home should show the streak');
  await tapEnd();
  await page.waitForSelector(`${open} >> text=in a rut`);
  await clearSheets();
  await page.click('[data-f=community]');
});

await t.check('⏭ Auto plays weeks until something needs you', async () => {
  const before = (await S()).turn;
  await page.click('#auto');
  const after = (await S()).turn, sheetOpen = !!(await page.$(open));
  assert(after > before && (sheetOpen || after - before === 26 || after >= 26), `auto played ${after - before} weeks without stopping for anything`);
  await clearSheets();
});

await t.check('locked jobs explain how to unlock them and can set Take classes', async () => {
  await page.click('[data-tab=jobs]');
  await page.click('[data-locked="para"]');
  await page.waitForSelector(`${open} >> text=Trade certificate`);
  await page.click(`${open} #yes`);
  const s = await S();
  assert(s.focus === 'study' && (await page.evaluate(() => tab)) === 'home', 'should switch to Take classes on Home');
});

await t.check('the Can apply filter hides locked jobs, and jobs show take-home pay', async () => {
  await page.click('[data-tab=jobs]');
  assert((await page.$$('[data-locked]')).length > 0, 'expected locked jobs before filtering');
  await page.click('#jobok');
  assert((await page.$$('[data-locked]')).length === 0, 'locked jobs still shown');
  assert((await page.textContent('#main')).includes('take-home') || (await page.textContent('#main')).includes('▲') || (await page.textContent('#main')).includes('▼'), 'no take-home shown');
  await page.click('#jobok');
  await page.click('[data-tab=home]');
});

await t.check('i2-a16: the first-month checklist ticks steps as you do them, remembers them, and hides for good', async () => {
  await page.evaluate(() => { setPref('cl', {}); setPref('clHide', false); S.k401rate = 0; render(); });
  assert(await page.$('#checklist'), 'a checklist should show early in a real game');
  const before = await page.textContent('#checklist .tag');
  await page.click('[data-tab=life]'); await page.click('[data-k401="1"]'); await page.click('[data-tab=home]');
  assert((await page.evaluate(() => prefs().cl.k401)) === 1, 'saving in the 401(k) was not ticked');
  assert((await page.textContent('#checklist .tag')) !== before, 'the count did not move');
  await page.click('#checklist [data-cl="jobs"]').catch(() => {});
  await page.click('[data-tab=home]');
  await page.click('#clhide');
  assert(!(await page.$('#checklist')) && (await page.evaluate(() => prefs().clHide)), 'Hide should hide it for good');
  await page.evaluate(() => { S.k401rate = 0; render(); });
});

await t.check('the Waitsburg map sets this week\'s focus by place', async () => {
  await page.click('[data-tab=home]');
  await page.click('.maptog button:nth-child(2)');
  await page.click('.mpin[aria-label="Touchet River"]');
  await page.click('text=Spend this week here');
  assert((await S()).focus === 'outdoors', 'focus not set from the map');
});

await t.check('the region map shows a town\'s drive and jobs, with Apply', async () => {
  await page.click('[data-tab=jobs]');
  await page.click('.maptabs button:nth-child(2)').catch(() => {});
  await page.click('.mpin[aria-label="Walla Walla"]');
  await page.waitForSelector('.mapdet >> text=21 mi each way');
  const ww = await page.evaluate(() => JOBS.filter(x => x.city === 'wallawalla').length);   // 5, plus the round-3 jobs (VA clerk, electrician, phlebotomist)
  assert(ww === 8 && (await page.$$('.mapdet .kv.job')).length === ww, `Walla Walla should list ${ww} jobs`);
});

await t.check('the List/Map choice is remembered', async () => {
  await page.reload({ waitUntil: 'load' });
  await page.click('[data-cont="0"]');
  await page.waitForSelector('.mapsvg');
  await page.click('.maptog button:nth-child(1)');
  await page.waitForSelector('.fbtn');
});

await t.check('the last week ends the game with a Life Score, and Play again returns to the title', async () => {
  await page.evaluate(() => { S.turn = LENGTHS[S.len].turns - 1; });
  await tapEnd();
  await clearSheets(1);
  await page.waitForSelector(`${open} #again`);
  await page.waitForSelector(`${open} >> text=How the score adds up`);
  const score = Number(await page.textContent('.score'));
  assert(Number.isInteger(score) && score >= 0 && score <= 100, `bad score ${score}`);
  await page.click('#again');
  await page.waitForSelector('#start');
  assert(!(await page.$('[data-cont="0"]')), 'a finished game should leave its slot');
});

await t.check('a 2-year game shows a year in review at New Year', async () => {
  await page.evaluate(() => { newGame('Yr', 'two', 4); S.jobId = 'farmhand'; S.date = new Date(2027, 11, 27).getTime(); tab = 'home'; render(); });
  await tapEnd();
  for (let i = 0; i < 4 && !(await page.$(`${open} >> text=2027 in review`)); i++) {
    const b = await page.$(`${open} #ok, ${open} [data-i]`); if (!b) break; await b.click();
  }
  await page.waitForSelector(`${open} >> text=2027 in review`);
  await clearSheets();
  await page.evaluate(() => { writeSlot(4, null); });
});

await t.check('Help on the title screen opens the guide, and its contents jump to sections', async () => {
  await page.evaluate(() => { S = null; renderTitle(); });
  await page.click('#how');
  await page.waitForSelector('#helpview:not(.hidden) #tutstart');
  const sections = await page.$$eval('#helpview .guide section', els => els.map(e => e.id));
  assert(sections.length >= 14, `guide has only ${sections.length} sections`);
  assert((await page.$$('#helpview .toc button')).length === sections.length, 'contents should list every section');
  try {
    await page.click('#helpview .toc button:has-text("Jobs")');
    let top = 9999;
    for (let i = 0; i < 20 && top > 160; i++) { await page.waitForTimeout(150); top = await page.$eval('#g-jobs', e => e.getBoundingClientRect().top); }
    assert(top < 160, `Jobs section not scrolled into view (top ${Math.round(top)})`);
    assert((await page.textContent('#g-jobs')).includes('National lab scientist'), 'job table missing');
  } finally { await page.click('#helpclose'); }
  assert(await page.isHidden('#helpview'), 'Close should hide help');
});

await t.check('the gameplay tutorial walks through every step by tapping, then leaves saves and settings alone', async () => {
  await page.evaluate(() => { localStorage.clear(); setPref('mapView', false); newGame('Mine', 'two', 0); S.turn = 7; tab = 'home'; render(); save(); });   // i31: drawing opens what's due by week 7, then it's saved
  const before = await page.evaluate(() => JSON.stringify(slots().map(g => g && { ...g, savedAt: 0 })));
  await page.click('#helpbtn');
  await page.click('#tutstart');
  let steps = 0, skipped = [], seen = new Set(), covered = [];
  for (let guard = 0; guard < 120; guard++) {
    await page.waitForTimeout(450);
    const st = await page.evaluate(() => {
      if (!TUT) return null;
      const s = TSTEPS[TUT.i], el = s.sel && document.querySelector(s.sel), r = el && el.getBoundingClientRect();
      const hit = r && document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2);
      return { i: TUT.i, sel: s.sel || null, tap: !!s.tap, skipped: [...TUT.skipped], shown: !document.querySelector('#coach').classList.contains('hidden'), reach: !!(hit && el.contains(hit)) };
    });
    if (!st) break;
    skipped = st.skipped;
    if (!st.shown) continue;
    steps = Math.max(steps, st.i + 1);
    if (st.sel) seen.add(st.sel);
    if (st.tap && !st.reach) covered.push(st.sel);                // the pulsing ring must sit on a spot you can actually tap
    if (st.tap) { const box = await (await page.$(st.sel)).boundingBox(); await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2); }
    else await page.click('#cnext');
  }
  const total = await page.evaluate(() => TSTEPS.length);
  assert(steps === total, `tutorial reached step ${steps} of ${total}`);
  assert(!skipped.length, `tutorial steps skipped because their target never appeared: ${skipped.join(', ')}`);
  assert(!covered.length, `tap targets hidden under the coach: ${covered.join(', ')}`);
  // G1: the tutorial shows what's on main now
  for (const sel of ['#auto', '#planbtn', '#outbtn', '#tripchip', '#main .term[data-term="takehome"]', '[data-job="lineman"]', '#undo', '#inssheet', '#outlook', '.mpin[aria-label="Main Street"]', '.msmap', '#modal:not(.hidden) #settings'])
    assert(seen.has(sel), `the tutorial never showed ${sel}`);
  assert(total <= 42, `the tutorial is getting long: ${total} steps`);
  const s = await S();
  assert(s.name === 'Mine' && s.turn === 7 && !s.practice, 'the real life was not restored');
  assert((await page.evaluate(() => JSON.stringify(slots().map(g => g && { ...g, savedAt: 0 })))) === before, 'the tutorial changed the saves');
  assert(!(await page.evaluate(() => prefs().mapView)), 'the tutorial left the map setting on');
  assert(!(await page.evaluate(() => LIFE_UNDO.length || MAPSEL)), 'the tutorial left an undo or a map pick behind');
});

await t.check('the tutorial dims everything but the highlighted spot, and Skip tutorial returns to the game', async () => {
  await page.click('#helpbtn');
  await page.click('#tutstart');
  await page.waitForSelector('#coach:not(.hidden) .cdim');
  await page.click('#cnext');                                   // step 1 → the Apply step
  await page.waitForSelector('#coach:not(.hidden) .cring.tap');
  const blocked = await page.evaluate(() => { const r = document.querySelector('nav [data-tab="life"]').getBoundingClientRect(); const el = document.elementFromPoint(r.left + r.width/2, r.top + r.height/2); return el.classList.contains('cdim'); });
  assert(blocked, 'taps outside the highlighted spot should be blocked');
  await page.click('#cskip');
  const s = await S();
  assert(s.name === 'Mine' && !(await page.$('#coach:not(.hidden)')), 'Skip did not return to the real game');
});

await t.check('with all 5 slots full, a new life asks which one to replace', async () => {
  await page.evaluate(() => { for (let i = 0; i < 5; i++) { newGame('Life' + (i+1), 'half', i); save(); } S = null; renderTitle(); });
  assert((await page.$$('[data-cont]')).length === 5, 'title should list five lives');
  await page.fill('#nm', 'Sixth');
  await page.click('#start');
  await page.waitForSelector(`${open} [data-over]`);
  await page.click(`${open} [data-over="2"]`);
  await page.waitForSelector(`${open} #yes`);                   // H2: replacing a life asks first
  assert((await page.textContent('#sheet h2')).includes("Replace Life3's life?"), 'no replace warning');
  await page.click(`${open} #yes`);
  const s = await S(), all = await page.evaluate(() => slots());
  assert(s.name === 'Sixth' && s.slot === 2 && all[2].name === 'Sixth' && all[1].name === 'Life2' && all[3].name === 'Life4', 'replace went to the wrong slot');
});

await t.check('a save from before slots moves into a slot', async () => {
  await page.evaluate(() => {
    localStorage.clear();
    newGame('Oldtimer', 'two'); S.turn = 9; const g = JSON.parse(JSON.stringify(S)); delete g.slot;
    localStorage.clear(); localStorage.setItem('theburg.save.v2', JSON.stringify(g));
  });
  await page.reload({ waitUntil: 'load' });
  // a player from an older version is welcomed back with What's new first
  assert(/What's new/.test(await page.textContent(`${open} h2`)), 'a returning player should see What\'s new');
  await page.click(`${open} #ok`);
  await page.click('[data-cont="0"]');
  const s = await S();
  assert(s.name === 'Oldtimer' && s.turn === 9 && s.slot === 0, 'old save was not moved');
  assert(!(await page.evaluate(() => localStorage.getItem('theburg.save.v2'))), 'old save key should be removed');
});

await t.check('no errors in the console the whole time', async () => { assert(!errors.length, errors.join('; ')); });

await browser.close();
srv.close();
if (t.failed) { console.log(`${t.failed} gameplay check(s) failed`); process.exit(1); }
console.log('All gameplay checks passed');
