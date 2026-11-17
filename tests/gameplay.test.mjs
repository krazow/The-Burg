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
async function endWeek() { await page.click('#end'); await clearSheets(); }

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
    await page.click('#end');
    for (let k = 0; k < 3; k++) {
      const choice = await page.$(`${open} [data-i]`);
      if (choice) {
        seen = true; await choice.click();
        await page.waitForSelector(`${open} #ok`);
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
  await page.click('#ff4');
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
  assert((await page.$$('.mapdet .kv.job')).length === 5, 'Walla Walla should list 5 jobs');
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
  await page.click('#end');
  await clearSheets(1);
  await page.waitForSelector(`${open} #again`);
  const score = Number(await page.textContent('.score'));
  assert(Number.isInteger(score) && score >= 0 && score <= 100, `bad score ${score}`);
  await page.click('#again');
  await page.waitForSelector('#start');
  assert(!(await page.$('[data-cont="0"]')), 'a finished game should leave its slot');
});

await t.check('with all 5 slots full, a new life asks which one to replace', async () => {
  await page.evaluate(() => { for (let i = 0; i < 5; i++) { newGame('Life' + (i+1), 'half', i); save(); } S = null; renderTitle(); });
  assert((await page.$$('[data-cont]')).length === 5, 'title should list five lives');
  await page.fill('#nm', 'Sixth');
  await page.click('#start');
  await page.waitForSelector(`${open} [data-over]`);
  await page.click(`${open} [data-over="2"]`);
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
