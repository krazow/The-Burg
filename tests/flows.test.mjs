// More gameplay flows, by tapping like a player: the Life tab (homes, vehicles, 401(k)), quitting and retiring,
// the hospital, the debt ending, family and council events, every event's every choice, trips around the region,
// and a Lifetime game to its end. Run with: npm run test:flows
import { serve, launch, runner, seedScript, assert, near } from './helpers.mjs';

const srv = await serve();
const browser = await launch();
const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, serviceWorkers: 'block' });
await ctx.addInitScript(seedScript(9001));
const page = await ctx.newPage();
const errors = [];
page.on('pageerror', e => errors.push(String(e)));
page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
const t = runner();
const open = '#modal:not(.hidden)';
const S = () => page.evaluate(() => JSON.parse(JSON.stringify(S)));
const setup = (fn, arg) => page.evaluate(fn, arg);
async function clearSheets(max = 8) {
  for (let i = 0; i < max; i++) {
    if (await page.$(`${open} #again`)) return;
    const b = await page.$(`${open} #ok, ${open} [data-i]`);
    if (!b) return;
    await b.click();
  }
}
// a fresh life on a chosen tab, set up for the check, with no random events getting in the way
async function life(extra = {}, tabName = 'home', len = 'two') {
  await setup(([extra, tabName, len]) => {
    localStorage.clear(); newGame('Flow', len, 0); Object.assign(S, extra); S.noEvents = true;
    setPref('tips', ['focus', 'strip', 'tabs']); closeSheet(); tab = tabName; render();
  }, [extra, tabName, len]);
}

await page.goto(srv.url, { waitUntil: 'load' });

await t.check('Life tab: moving to a rented house costs $300 and raises the rent', async () => {
  await life({ jobId: 'farmhand', money: 5000 }, 'life');
  await page.click('[data-home="house"]');
  await page.click(`${open} #y`);
  const s = await S();
  assert(s.home === 'house' && s.money === 4700, `home ${s.home}, money ${s.money}`);
  await page.click('[data-tab=home]'); await page.click('#end'); await clearSheets();
  assert(near((await S()).last.lines.find(l => l[0] === 'Rent')[1], -1150 * 12 / 52), 'rent not charged at the new rate');
});

await t.check('Life tab: buying the fixer-upper takes the down payment and starts a mortgage', async () => {
  await life({ jobId: 'farmhand', money: 20000 }, 'life');
  await page.click('[data-home="fixer"]');
  await page.click(`${open} #y`);
  const s = await S();
  assert(s.home === 'fixer' && s.money === 20000 - 9000 - 300 && s.equity === 9000 && s.mortgage === 950, JSON.stringify({ home: s.home, money: s.money, equity: s.equity, mortgage: s.mortgage }));
  assert((await page.textContent('#main')).includes('Home equity'), 'Life tab should show equity');
});

await t.check('Life tab: not enough money for a down payment says how much you need', async () => {
  await life({ money: 500 }, 'life');
  await page.click('[data-home="farm"]');
  assert(!(await page.$(open)), 'should not offer to buy');
  assert((await page.textContent('#toast')).includes('You need'), 'no message about the money needed');
});

await t.check('Life tab: buying the used sedan trades in the pickup', async () => {
  await life({ money: 10000 }, 'life');
  await page.click('[data-car="sedan"]');
  await page.click(`${open} #y`);
  const s = await S();
  assert(s.car === 'sedan' && s.money === 10000 - (9000 - 2500) && s.carValue === 9000, JSON.stringify({ car: s.car, money: s.money }));
});

await t.check('Life tab: financing the new pickup locks other vehicle purchases until it\'s paid off', async () => {
  await life({ money: 10000 }, 'life');
  await page.click('[data-car="truck"]');
  await page.click(`${open} #y`);
  const s = await S();
  assert(s.car === 'truck' && s.loanLeft === 60 && s.loanPay === 640, JSON.stringify({ car: s.car, loanLeft: s.loanLeft }));
  assert(await page.isDisabled('[data-car="sedan"]'), 'the sedan should be locked during the loan');
  assert((await page.textContent('#main')).includes('weekly payments left'), 'payments left not shown');
});

await t.check('Life tab: the 401(k) buttons set the savings rate', async () => {
  await life({ jobId: 'farmhand' }, 'life');
  await page.click('[data-k401="2"]');
  assert((await S()).k401rate === 2, 'rate not set to 10%');
  await page.click('[data-tab=home]'); await page.click('#end'); await clearSheets();
  assert((await S()).k401 > 0, 'nothing saved after a week');
});

await t.check('quitting your job asks first, then shows the "Find a job" banner', async () => {
  await life({ jobId: 'diner' }, 'jobs');
  await page.click('#quit');
  await page.click(`${open} #n`);
  assert((await S()).jobId === 'diner', 'Never mind should keep the job');
  await page.click('#quit');
  await page.click(`${open} #y`);
  assert((await S()).jobId === null, 'still employed');
  await page.click('[data-tab=home]');
  await page.click('[data-go="jobs"]');
  assert((await page.evaluate(() => tab)) === 'jobs', 'Find a job should open Jobs');
});

await t.check('in Lifetime, retiring at 62 swaps the paycheck for Social Security', async () => {
  await life({ jobId: 'clerk', ageMonths: 62 * 12 + 1 }, 'jobs', 'life');
  await page.click('#retire');
  const s = await S();
  assert(s.retired && s.jobId === null, 'not retired');
  await page.click('[data-tab=home]'); await page.click('#end'); await clearSheets();
  const lines = Object.fromEntries((await S()).last.lines);
  assert(lines['Social Security'] > 0 && !lines['Paycheck'], JSON.stringify(lines));
});

await t.check('the Retire button only appears in Lifetime games from age 62', async () => {
  await life({ jobId: 'clerk', ageMonths: 61 * 12 }, 'jobs', 'life');
  assert(!(await page.$('#retire')), 'Retire shown at 61');
  await life({ jobId: 'clerk', ageMonths: 70 * 12 }, 'jobs', 'five');
  assert(!(await page.$('#retire')), 'Retire shown in a 5-year game');
});

await t.check('reaching 0 health sends you to the hospital, with a bill', async () => {
  await life({ jobId: 'hanford', health: -5, focus: 'work' });
  await page.click('#end');
  await page.waitForSelector(`${open} >> text=hospital`);
  await clearSheets();
  assert((await S()).health === 30, 'health should reset to 30');
});

await t.check('falling below -$40,000 ends the game: you leave town', async () => {
  await life({ money: -40500 });
  await page.click('#end');
  await clearSheets();
  await page.waitForSelector(`${open} >> text=Buried in debt`);
  await page.click(`${open} #again`);
  await page.waitForSelector('#start');
});

await t.check('a low-happiness banner sets the suggested focus', async () => {
  await life({ jobId: 'farmhand', happy: 20, focus: 'work' });
  await page.click('[data-sugg]');
  assert((await S()).focus === 'outdoors', 'suggested focus not applied');
});

await t.check('family: having a baby shows on the Life tab and adds a weekly cost', async () => {
  await life({ jobId: 'rn', partner: true, ageMonths: 28 * 12 });
  await page.evaluate(() => showEvent(EVENTS.find(e => e.title === 'Starting a family?')));
  await page.click(`${open} [data-i="0"]`); await clearSheets();
  await page.click('[data-tab=life]');
  assert((await page.textContent('#main')).includes('age 0'), 'kid not listed');
  await page.click('[data-tab=home]'); await page.click('#end'); await clearSheets();
  assert((await S()).last.lines.some(l => l[0] === 'Kid'), 'no weekly kid cost');
});

await t.check('winning a town council seat shows on the Life tab', async () => {
  await life({ community: 80, ageMonths: 30 * 12, money: 5000 });
  for (let i = 0; i < 12 && !(await S()).council; i++) {
    await page.evaluate(() => showEvent(EVENTS.find(e => e.title === 'Run for town council?')));
    await page.click(`${open} [data-i="0"]`); await clearSheets();
  }
  assert((await S()).council, 'never won a council seat in 12 tries');
  await page.click('[data-tab=life]');
  assert((await page.textContent('#main')).includes('Council member'), 'council not shown');
});

await t.check('every event\'s every choice works and shows a result', async () => {
  const titles = await page.evaluate(() => EVENTS.map(e => e.title));
  let tried = 0;
  for (const title of titles) {
    // a life where every choice is open: a job, a partner, a kid of 18, money, standing
    const base = { jobId: 'cellar', jobMonths: 24, partner: true, community: 75, money: 60000, ageMonths: 45 * 12, k401: 1000 };
    await life(base, 'home', 'life');
    await page.evaluate(() => { S.kids = [S.ageMonths - 18.2 * 12]; });
    const n = await page.evaluate(t => EVENTS.find(e => e.title === t).choices().filter(c => !c.if || c.if()).length, title);
    assert(n > 0, `${title} offers no choices`);
    for (let i = 0; i < n; i++) {
      await life(base, 'home', 'life');
      await page.evaluate(() => { S.kids = [S.ageMonths - 18.2 * 12]; });
      await page.evaluate(t => showEvent(EVENTS.find(e => e.title === t)), title);
      await page.click(`${open} [data-i="${i}"]`);
      const sheetResult = await page.$(`${open} #ok`);
      const text = sheetResult ? await page.textContent('#sheet') : await page.textContent('#toast');
      assert(text && text.trim().length > 3, `${title} choice ${i + 1} showed no result`);
      if (sheetResult) await sheetResult.click();
      tried++;
    }
  }
  assert(tried >= titles.length, `only ${tried} choices across ${titles.length} events`);
  console.log(`     (${tried} choices across ${titles.length} events)`);
});

await t.check('a Lifetime game plays to the end with ⏭ Auto, and its slot is freed', async () => {
  await life({ jobId: null, retired: true, ageMonths: 96 * 12, health: 35 }, 'home', 'life');
  await page.evaluate(() => { S.noEvents = false; save(); });
  let ended = false;
  for (let i = 0; i < 400 && !ended; i++) {
    if (await page.$(`${open} #again`)) { ended = true; break; }
    const b = await page.$(`${open} #ok, ${open} [data-i]`);
    if (b) { await b.click(); continue; }
    await page.click('#auto');
  }
  assert(ended, 'the life never ended');
  const txt = await page.textContent('#sheet');
  assert(/passed|health finally gave out/.test(txt), 'not a Lifetime ending');
  assert(!(await page.evaluate(() => slots()[0])), 'slot not freed');
});

await t.check('an event says where it happens, and the map marks the spot with what happened', async () => {
  await life({ jobId: 'farmhand' });
  await page.evaluate(() => { const e = EVENTS.find(x => x.title === 'The Touchet is running high'); S.evPins = [{ t: e.title, ic: e.ic, m: 'T', k: 'river', turn: S.turn, r: '' }]; showEvent(e); });
  assert((await page.textContent('#sheet .evplace')).includes('Touchet River'), 'event sheet does not say where');
  await page.click(`${open} [data-i="0"]`); await clearSheets();
  await page.click('#main .maptog button:nth-child(2)');
  await page.waitForSelector('.evbadge');
  await page.click('.mpin[aria-label="Touchet River"]');
  const txt = await page.textContent('.mapdet');
  assert(txt.includes('Recently here') && txt.includes('Touchet is running high') && txt.includes('this week'), txt.slice(0, 200));
  await page.click('#main .maptog button:nth-child(1)');
});

await t.check('region events (Bluewood, Walla Walla) are marked on the region map', async () => {
  await life({ jobId: 'farmhand' });
  await page.evaluate(() => { S.evPins = [{ t: 'Powder day at Bluewood', ic: '⛷️', m: 'R', k: 'bluewood', turn: S.turn, r: 'Bluebird skies and fresh tracks.' }]; render(); });
  await page.click('[data-tab=jobs]');
  await page.click('#main .maptog button:nth-child(2)');
  await page.waitForSelector('.evbadge');
  await page.click('.mpin[aria-label="Bluewood ski area"]');
  assert((await page.textContent('.mapdet')).includes('Bluebird skies'), 'Bluewood detail missing the event');
  await page.click('#main .maptog button:nth-child(1)');
});

await t.check('backup: Menu downloads a backup file of every life', async () => {
  await life({ jobId: 'farmhand' });
  await page.evaluate(() => { S.turn = 12; save(); });
  await page.click('[data-tab=menu]'); await page.click('#backup');
  const [dl] = await Promise.all([page.waitForEvent('download'), page.click('#bkfile')]);
  assert(/^the-burg-backup-\d{4}-\d{2}-\d{2}\.json$/.test(dl.suggestedFilename()), dl.suggestedFilename());
  const path = await dl.path();
  const data = JSON.parse((await import('node:fs')).readFileSync(path, 'utf8'));
  assert(data.app === 'theburg' && data.slots[0].name === 'Flow' && data.slots[0].turn === 12, 'backup file content wrong');
  globalThis.__backupFile = path;
  await page.click(`${open} #no`);
});

await t.check('backup: a copied code restores the lives on a "new device" from the title screen', async () => {
  await page.click('[data-tab=menu]'); await page.click('#backup');
  await page.click('#bkcode');
  await page.waitForSelector('#bkcodetext');
  const code = await page.inputValue('#bkcodetext');
  assert(code.startsWith('BURG'), 'no backup code shown');
  await page.click(`${open} #no`);
  await page.evaluate(() => { localStorage.clear(); S = null; renderTitle(); });   // a fresh device
  assert((await page.$$('[data-cont]')).length === 0, 'expected no lives on the new device');
  await page.click('#restore');
  await page.fill('#rscode', code);
  await page.click('#rscheck');
  await page.waitForSelector('#rsadd');
  assert((await page.textContent('#rsout')).includes('Flow'), 'preview does not list the life');
  await page.click('#rsadd');
  await page.waitForSelector('[data-cont="0"]');
  await page.click('[data-cont="0"]');
  assert((await S()).name === 'Flow' && (await S()).turn === 12, 'restored life is wrong');
});

await t.check('backup: restoring from a file can replace all lives, after a warning', async () => {
  await page.evaluate(() => { localStorage.clear(); for (let i = 0; i < 3; i++) { newGame('Old' + i, 'half', i); save(); } S = null; renderTitle(); });
  await page.click('#restore');
  await page.setInputFiles('#rsfile', globalThis.__backupFile);
  await page.waitForSelector('#rsrep');
  await page.click('#rsrep');
  await page.waitForSelector('#rsyes');
  await page.click('#rsback');
  await page.waitForSelector('#rsrep');
  await page.click('#rsrep'); await page.click('#rsyes');
  const names = await page.evaluate(() => slots().map(g => g && g.name));
  assert(names.join() === 'Flow,,,,', `after replace: ${names}`);
});

await t.check('backup: junk is rejected with a plain message', async () => {
  await page.click('#restore');
  await page.fill('#rscode', 'not a backup at all');
  await page.click('#rscheck');
  await page.waitForSelector('#rsout .warnline');
  assert((await page.textContent('#rsout')).includes("doesn't look like a backup"), await page.textContent('#rsout'));
  await page.click(`${open} #no`);
});

await t.check('the Journal lists what happened, newest first', async () => {
  await life({ jobId: 'farmhand' });
  await page.evaluate(() => { log('First thing'); log('Second thing'); render(); });
  await page.click('[data-tab=log]');
  const items = await page.$$eval('.logitem', els => els.map(e => e.textContent));
  assert(items[0].includes('Second thing') && items[1].includes('First thing'), items.slice(0, 2).join(' | '));
});

await t.check('Plan a trip from Home: pick a town and stops, end the week, see it in the Journal', async () => {
  await life({ jobId: 'farmhand', money: 2000, date: new Date(2027, 5, 7).getTime() });
  await page.click('#tripchip');
  await page.click(`${open} [data-town="kennewick"]`);
  await page.click(`${open} [data-stop="stock"]`);
  await page.click(`${open} [data-stop="park"]`);
  await page.click(`${open} [data-stop="arena"]`);
  const fourthOff = await page.$eval(`${open} [data-stop="movies"]`, b => b.disabled);
  const sum = await page.textContent('#tripsum');
  assert(fourthOff && /3 of 3 stops/.test(sum), `limit: disabled=${fourthOff} sum="${sum}"`);
  await page.click(`${open} #go`);
  const chip = await page.textContent('#tripchip');
  assert(/Kennewick \(3\)/.test(chip), `chip: ${chip}`);
  await page.click('#end'); await clearSheets();
  const s = await S();
  assert(s.trip === null && s.stockUntil > s.turn - 1 && s.log.some(e => /Trip to Kennewick/.test(e.m)), `after: ${JSON.stringify({ trip: s.trip, stock: s.stockUntil, log: s.log[0] })}`);
  await page.click('#strip');
  const details = await page.textContent(open);
  assert(/Trip to Kennewick: gas/.test(details) && /A show at the arena/.test(details), 'the week details should list the trip');
  await page.click(`${open} #ok`);
});

await t.check('Plan a trip from the region map, change it, then cancel it', async () => {
  await life({ jobId: 'farmhand', date: new Date(2027, 2, 1).getTime() });
  await page.evaluate(() => { setPref('mapView', true); MAPSIDE = 'R'; render(); });
  await page.click('.mpin[aria-label="Dayton"]');
  await page.click('#main .mapdet button:has-text("Plan a trip")');
  await page.click(`${open} [data-stop="cafe"]`); await page.click(`${open} #go`);
  await page.click('.mpin[aria-label="Dayton"]'); await page.click('.mpin[aria-label="Dayton"]');
  const label = await page.textContent('#main .mapdet');
  assert(/Change my trip/.test(label), 'the town card should offer to change the planned trip');
  await page.click('#main .mapdet button:has-text("Change my trip")');
  const pressed = await page.$eval(`${open} [data-stop="cafe"]`, b => b.getAttribute('aria-pressed'));
  assert(pressed === 'true', 'the planned stop should be selected');
  await page.click(`${open} #cancel`);
  assert((await S()).trip === null, 'trip not canceled');
  await page.evaluate(() => { setPref('mapView', false); MAPSIDE = null; render(); });
});

await t.check('Life Score so far opens its breakdown from Home; a commuter can join a carpool on Jobs', async () => {
  await life({ jobId: 'rail', community: 40 });
  await page.click('#scorenow');
  assert(/Life Score so far/.test(await page.textContent(open)), 'score sheet');
  await page.click(`${open} #ok`);
  await page.click('[data-tab=jobs]');
  await page.click('#carpool');
  assert((await S()).carpool === true, 'carpool not joined');
  assert(/Drive alone/.test(await page.textContent('#carpool')), 'carpool button should switch');
});

await t.check('the title screen starts a life with a background and a mode', async () => {
  await page.evaluate(() => { localStorage.clear(); S = null; closeSheet(); render(); });
  await page.fill('#nm', 'Kid');
  await page.click('[data-bg="farm"]'); await page.click('[data-mode="hard"]');
  assert(/family farm/.test(await page.textContent('#bgdesc')) && /more events/i.test(await page.textContent('#modedesc')), 'descriptions should follow the picks');
  await page.click('#start');
  const s = await S();
  assert(s.bg === 'farm' && s.mode === 'hard' && s.jobId === 'farmhand', JSON.stringify({ bg: s.bg, mode: s.mode, job: s.jobId }));
  assert(/Hard/.test(await page.textContent('header.top')), 'the header should show the mode');
});

await t.check('pick life goals on the Life tab, and start a challenge from the title screen', async () => {
  await life({ jobId: 'farmhand' }, 'life');
  await page.click('#goals');
  await page.click(`${open} [data-goal="dog"]`); await page.click(`${open} [data-goal="homeowner"]`);
  await page.click(`${open} #ok`);
  assert((await S()).goals.join() === 'dog,homeowner', 'goals not saved');
  assert(/Good dog/.test(await page.textContent('#main')), 'goal card should list the goal');
  await page.evaluate(() => { localStorage.clear(); S = null; render(); });
  await page.click('#chal');
  await page.click(`${open} [data-sc="farm"]`);
  const s = await S();
  assert(s.scenario === 'farm' && s.bg === 'farm' && s.len === 'five', JSON.stringify({ sc: s.scenario, bg: s.bg, len: s.len }));
  assert(/Challenge/.test(await page.textContent('#main')), 'Home should show the challenge');
});

await t.check('no errors in the console the whole time', async () => { assert(!errors.length, errors.join('; ')); });

await browser.close();
srv.close();
if (t.failed) { console.log(`${t.failed} flow check(s) failed`); process.exit(1); }
console.log('All flow checks passed');
