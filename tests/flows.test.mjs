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
    // a life where every choice is open: a job, a partner, a kid of 18, money, standing, and the skills that open choices
    const base = { jobId: 'cellar', jobMonths: 24, partner: true, community: 75, money: 60000, ageMonths: 45 * 12, k401: 1000, skills: { mechanic: 24, cook: 24 } };
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
  const cats = await page.evaluate(() => ['road', 'work'].map(c => EVENTS.filter(e => e.cat === c).length));
  assert(cats[0] === 30 && cats[1] === 30, `expected 30 road and 30 work events, got ${cats}`);
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
  await page.click('#moreopts');
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

await t.check('start and sell a business on the Life tab; skills show there too', async () => {
  await life({ jobId: 'farmhand', money: 8000 }, 'life');
  assert(/Skills/.test(await page.textContent('#main')), 'skills card missing');
  await page.click('[data-biz="shop"]');
  assert((await S()).biz.type === 'shop', 'business not started');
  await page.click('#bizsell'); await page.click(`${open} #y`);
  assert((await S()).biz === null, 'business not sold');
});

await t.check('the weekly challenge starts a seeded 6-month life from the title screen; the end screen offers a score card', async () => {
  await page.evaluate(() => { localStorage.clear(); S = null; closeSheet(); render(); });
  await page.click('#weekly'); await page.click(`${open} #y`);
  const s = await S();
  assert(s.weekly && s.rng !== null && s.len === 'half', JSON.stringify({ weekly: s.weekly, rng: s.rng, len: s.len }));
  await page.evaluate(() => { S.noEvents = true; finish('done'); });
  assert(await page.$(`${open} #share`), 'no share button');
  await page.click(`${open} #again`);
});

// ---- review gaps (G2, G6, G7, G8, R7) ----
await t.check('title screen: Start comes before a closed "More options" panel, which opens, sums up the picks and is remembered', async () => {
  await page.evaluate(() => { localStorage.clear(); S = null; closeSheet(); renderTitle(); });
  const order = await page.evaluate(() => { const y = s => document.querySelector(s).getBoundingClientRect().top; return { start: y('#start'), more: y('#moreopts'), chal: y('#chal') }; });
  assert(order.start < order.more && order.more < order.chal, JSON.stringify(order));
  assert(await page.isHidden('#morepanel') && (await page.getAttribute('#moreopts', 'aria-expanded')) === 'false', 'the panel should start closed');
  await page.click('#moreopts');
  assert(await page.isVisible('[data-bg="grad"]') && (await page.getAttribute('#moreopts', 'aria-expanded')) === 'true', 'the panel did not open');
  await page.click('[data-bg="grad"]'); await page.click('[data-mode="relaxed"]');
  assert(/Grad coming home · .*Relaxed/.test(await page.textContent('#moresum')), await page.textContent('#moresum'));
  await page.evaluate(() => renderTitle());
  assert(await page.isVisible('#morepanel'), 'open panel not remembered');
  await page.click('#moreopts');
  await page.evaluate(() => renderTitle());
  assert(await page.isHidden('#morepanel'), 'closed panel not remembered');
});

await t.check('title screen: "Your records" shows best scores by length and mode, challenges, and only this week\'s weekly best', async () => {
  await page.evaluate(() => { localStorage.clear(); S = null; closeSheet(); renderTitle(); });
  assert(!(await page.$('#records')), 'no records button before any life is finished');
  assert(!(await page.$('.title .best')), 'the old long best-score line should be gone');
  await page.evaluate(() => { store.set(BEST_KEY, { two: 66, 'half-hard': 48, 'life-relaxed': 71, 'sc-farm': 80, ['wk-' + isoWeek()]: 59, 'wk-2001-W01': 99 });
    store.set(CHALLENGE_KEY, { farm: 1 }); pruneWeekly(); renderTitle(); });
  const kept = await page.evaluate(() => Object.keys(store.get(BEST_KEY)));
  assert(!kept.includes('wk-2001-W01') && kept.includes('wk-' + await page.evaluate(() => isoWeek())), `old weekly bests should be pruned: ${kept}`);
  await page.click('#records');
  const rows = await page.$$eval(`${open} table.rec tbody tr`, trs => trs.map(tr => [...tr.children].map(c => c.textContent.trim())));
  assert(rows.length === 4 && rows[1][0] === '2 Years' && rows[1][2] === '66' && rows[0][3] === '48' && rows[3][1] === '71' && rows[0][1] === '–', JSON.stringify(rows));
  const txt = await page.textContent(open);
  assert(/1\/4 completed/.test(txt) && /Save the family farm ✅/.test(txt) && /best 80/.test(txt) && /Your best this week59/.test(txt) && !/99/.test(txt), txt.slice(0, 300));
  await page.keyboard.press('Escape');
  assert(await page.isHidden('#modal'), 'Escape should close the records');
});

await t.check('What\'s new shows once to returning players after an update, never to new players or in the tutorial', async () => {
  const r = await page.evaluate(() => { localStorage.clear(); closeSheet(); S = null; renderTitle();
    const fresh = whatsNew(), freshSeen = store.get(SEEN_KEY);
    store.set(SEEN_KEY, '0.1.0'); newGame('Old', 'half', 0); save(); S = null; renderTitle();
    const first = whatsNew(), text = document.querySelector('#sheet').textContent; closeSheet();
    const again = whatsNew();
    store.set(SEEN_KEY, '0.1.0'); TUT = { i: 0 }; const tut = whatsNew(); TUT = null;
    return { fresh, freshSeen, first, text, again, tut, v: baseVersion() }; });
  assert(!r.fresh && r.freshSeen === r.v, 'a brand-new player should not see it (but it counts as seen)');
  assert(r.first && /What's new in 0\.2\.0/.test(r.text) && /Trips around the region/.test(r.text) && /Legacy/.test(r.text), r.text.slice(0, 200));
  assert(!r.again && !r.tut, JSON.stringify(r));
  await page.evaluate(() => closeSheet());
});

await t.check('Journal filter chips: Money, Events, Milestones and Trips, with old entries classified by their text', async () => {
  await life({ jobId: 'farmhand' });
  await page.evaluate(() => { S.log = [];
    log('Hired as Wheat farm hand in Waitsburg!'); log('Earned a badge: Good dog.'); log('Trip to Dayton: lunch at a small-town café.');
    log('Celebration Days: You ran the pie booth.'); log('📋 Report card: Life Score 51.');
    S.log.push({ d: 'Week of Jan 4, 2027', m: 'Drove home a used sedan.' }, { d: 'Week of Jan 4, 2027', m: 'A year of the food truck: The truck is a hit.' });
    render(); });
  await page.click('[data-tab=log]');
  const count = () => page.$$eval('.logitem', els => els.length);
  assert((await count()) === 7, 'All should list everything');
  const kinds = {};
  for (const k of ['money', 'ev', 'mile', 'trip']) { await page.click(`[data-lf="${k}"]`); kinds[k] = await page.$$eval('.logitem', els => els.map(e => e.textContent)); }
  assert(kinds.money.length === 2 && kinds.money.some(x => /sedan/.test(x)), `money ${kinds.money}`);
  assert(kinds.ev.length === 1 && /Celebration/.test(kinds.ev[0]), `events ${kinds.ev}`);
  assert(kinds.mile.length === 3 && kinds.mile.some(x => /food truck/.test(x)) && kinds.mile.some(x => /Report card/.test(x)), `milestones ${kinds.mile}`);
  assert(kinds.trip.length === 1, `trips ${kinds.trip}`);
  assert((await page.getAttribute('[data-lf="trip"]', 'aria-pressed')) === 'true', 'the chosen chip should be pressed');
  await page.evaluate(() => { S.log = S.log.filter(e => !/Trip/.test(e.m)); renderLog(); });
  assert(/Nothing under trips yet/.test(await page.textContent('#main')), 'empty filter message');
  await page.click('[data-lf="all"]');
});

await t.check('Out and about: visit every business from Home, with its card, limits and results', async () => {
  const ids = await page.evaluate(() => PLACES.map(p => p.id));
  for (const id of ids) {
    await life({ jobId: 'farmhand', money: 5000, ageMonths: 30 * 12, partner: false }, 'home');
    await setup(() => { S.date = new Date(2027, 4, 10).getTime(); S.turn = 4; render(); });
    await page.click('#outbtn');
    await page.click(`${open} [data-place="${id}"]`);
    const btn = await page.$(`${open} [data-act]:not([disabled])`);
    assert(btn, `${id}: nothing to do in May`);
    const before = (await S()).money;
    await btn.click();
    const out = await page.textContent('#sheet');
    const info = await page.$(`${open} #back`) && !(await page.$(`${open} #bizout b`));
    assert(info ? /Bank|trades/.test(out) : (await page.textContent('#bizout')).length > 5, `${id}: no result shown`);
    if (!info) assert((await S()).out.n === 1 && (await S()).money <= before, `${id}: the visit was not counted`);
    await page.click(`${open} #no`);
  }
  await page.click('#outbtn');
  assert((await page.textContent('#outbtn')).includes('left this week'), 'the button should count visits left');
  await page.click(`${open} #no`);
});

await t.check('the Main Street close-up opens from the town map, and its pins open business cards by tap or keyboard', async () => {
  await life({ jobId: 'diner', ageMonths: 30 * 12 }, 'home');
  await page.click('#main .maptog button:nth-child(2)');
  await page.click('.mpin[aria-label="Main Street"]');
  assert(await page.$('.msmap'), 'no Main Street close-up');
  assert((await page.$$('.msmap .mspin')).length >= 13, 'Main Street businesses missing');
  await page.click('.mspin[data-biz="bean"]');
  assert((await page.textContent('#sheet h2')).includes('Howlin'), 'the coffee shop card did not open');
  await page.click(`${open} #no`); await page.waitForTimeout(100);
  await page.focus('.mspin[data-biz="bank"]'); await page.keyboard.press('Enter');
  assert((await page.textContent('#sheet h2')).includes('Standard Bearer Bank'), 'Enter on a pin should open its card');
  await page.click(`${open} #no`);
  await page.click('.mpin[aria-label="Main Street"]');
  await page.click('.mpin[aria-label="Bourbon Gulch Sports Bar"]');
  assert((await page.textContent('.mapdet')).includes('You work here as line cook'), 'the sports bar should be the line cook\'s workplace');
  await page.click('.mapdet >> text=Visit or see the card');
  assert((await page.textContent('#sheet')).includes('701 Preston'), 'the Preston Avenue card did not open');
  await page.click(`${open} #no`);
  await page.click('#main .maptog button:nth-child(1)');
});

await t.check('H2: End this life now asks first, and Escape keeps playing', async () => {
  await life({ jobId: 'farmhand' });
  await page.evaluate(() => { S.turn = 5; save(); });
  await page.click('[data-tab="menu"]');
  await page.click(`${open} #retireNow`);
  await page.waitForSelector(`${open} #yes`);
  const txt = await page.textContent('#sheet');
  assert(/Life Score so far: \d+/.test(txt) && /Keep playing/.test(txt), `confirm sheet: ${txt}`);
  assert(await page.evaluate(() => document.activeElement && document.activeElement.id === 'no' || document.querySelector('#sheet button').id === 'no'), 'Keep playing should be the default');
  await page.keyboard.press('Escape');
  const r = await page.evaluate(() => ({ open: !document.querySelector('#modal').classList.contains('hidden'), slot: slots()[0] && slots()[0].name, over: S.over }));
  assert(!r.open && r.slot === 'Flow' && !r.over, JSON.stringify(r));
  await page.click('[data-tab="menu"]'); await page.click(`${open} #retireNow`); await page.click(`${open} #yes`);   // and ending it still works
  assert(await page.evaluate(() => S.over && !slots()[0]), 'End this life did not end it');
  await clearSheets();
});

await t.check('H2: Replace on a full board asks first, and Back changes nothing', async () => {
  await page.evaluate(() => { closeSheet(); localStorage.clear(); for (let i = 0; i < 5; i++) { newGame('Life' + (i+1), 'half', i); save(); } S = null; renderTitle(); });
  const before = await page.evaluate(() => JSON.stringify(slots()));
  await page.fill('#nm', 'Sixth'); await page.click('#start');
  await page.click(`${open} [data-over="1"]`);
  await page.waitForSelector(`${open} #back`);
  assert((await page.textContent('#sheet')).includes("Replace Life2's life? ") || (await page.textContent('#sheet h2')) === "Replace Life2's life?", 'no replace warning');
  assert((await page.textContent('#sheet')).includes("This can't be undone"), 'no undo warning');
  await page.click(`${open} #back`);
  await page.waitForSelector(`${open} [data-over]`);
  await page.keyboard.press('Escape');
  const after = await page.evaluate(() => JSON.stringify(slots()));
  assert(after === before, 'slots changed after Back');
  await page.evaluate(() => { closeSheet(); localStorage.clear(); S = null; renderTitle(); });
});

/* ---------- round 2 feel: Settings, sound, vibration, text size, night theme, swipes, thumb reach, two columns, install ---------- */
await t.check('i2-a03: Menu → Settings holds every comfort option; Back returns to the Menu, Escape closes it', async () => {
  await life({ jobId: 'farmhand' });
  await page.click('[data-tab=menu]');
  await page.click(`${open} #settings`);
  await page.waitForSelector(`${open} .setrow`);
  const groups = await page.$$eval('#sheet .setrow', g => g.map(x => x.getAttribute('aria-labelledby')));
  for (const k of ['theme', 'textSize', 'sound', 'swipe']) assert(groups.includes('set-' + k), `no ${k} setting (${groups})`);
  assert(await page.$eval('#sheet [data-set=sound][data-v=off]', b => b.getAttribute('aria-pressed') === 'true'), 'sound is not off by default');
  assert(await page.$eval('#sheet [data-set=theme][data-v=auto]', b => b.getAttribute('aria-pressed') === 'true'), 'theme does not follow the phone by default');
  await page.click(`${open} #back`);
  await page.waitForSelector(`${open} #settings`);
  await page.click(`${open} #settings`);
  await page.keyboard.press('Escape');            // Escape = Back to the Menu
  await page.waitForSelector(`${open} #settings`);
  await page.keyboard.press('Escape');
  assert(await page.isHidden('#modal'), 'Escape did not close the Menu');
});

await t.check('i2-a06/i2-a07: text size and night theme apply at once, are remembered, and come back after a reload', async () => {
  await life({ jobId: 'farmhand' });
  await page.evaluate(() => settingsSheet(true));
  await page.click(`${open} [data-set=theme][data-v=night]`);
  await page.click(`${open} [data-set=textSize][data-v=xl]`);
  const r = await page.evaluate(() => ({ night: document.documentElement.classList.contains('night'), px: getComputedStyle(document.documentElement).fontSize,
    bg: getComputedStyle(document.body).backgroundColor, pressed: document.querySelector('#sheet [data-set=textSize][data-v=xl]').getAttribute('aria-pressed') }));
  assert(r.night && r.px === '20px' && r.bg === 'rgb(23, 18, 14)' && r.pressed === 'true', JSON.stringify(r));
  await page.reload({ waitUntil: 'load' });
  const after = await page.evaluate(() => ({ night: document.documentElement.classList.contains('night'), px: getComputedStyle(document.documentElement).fontSize }));
  assert(after.night && after.px === '20px', `after reload: ${JSON.stringify(after)}`);
  await page.evaluate(() => { setPref('theme', 'day'); setPref('textSize', 'normal'); applyPrefs(); });
  assert(await page.evaluate(() => !document.documentElement.classList.contains('night') && getComputedStyle(document.documentElement).fontSize === '16px'), 'day / normal did not come back');
});

await t.check('i2-a07: "Match phone" follows the dark mode setting; Day and Night override it', async () => {
  await page.emulateMedia({ colorScheme: 'dark' });
  const night = () => page.evaluate(() => document.documentElement.classList.contains('night'));
  await page.evaluate(() => { setPref('theme', 'auto'); applyPrefs(); });
  assert(await night(), 'auto + dark phone is not night');
  await page.evaluate(() => { setPref('theme', 'day'); applyPrefs(); });
  assert(!(await night()), 'Day did not override a dark phone');
  await page.emulateMedia({ colorScheme: 'light' });
  await page.evaluate(() => { setPref('theme', 'auto'); applyPrefs(); });
  assert(!(await night()), 'auto + light phone is night');
  await page.emulateMedia({ colorScheme: 'dark' });           // the change listener switches without a reload
  await page.waitForTimeout(50);
  assert(await night(), 'did not follow the phone switching to dark');
  await page.emulateMedia({ colorScheme: 'light' });
  await page.evaluate(() => { localStorage.removeItem(PREF_KEY); applyPrefs(); });
});

await t.check('i2-a04: a buzz for a week, an event and a badge; none when Vibration is off', async () => {
  await life({ jobId: 'farmhand' });
  await page.evaluate(() => { window.__buzz = []; navigator.vibrate = p => { window.__buzz.push(p); return true; }; S.badges = Object.fromEntries(BADGES.map(b => [b.id, 1])); });
  await page.click('#end'); await clearSheets();
  await page.evaluate(() => { S.badges = {}; });
  await page.click('#end'); await clearSheets();
  await page.evaluate(() => showEvent(EVENTS.find(e => e.title === 'Celebration Days')));
  const { got, want } = await page.evaluate(() => ({ got: window.__buzz.map(p => JSON.stringify(p)), want: ['week', 'event', 'badge'].map(k => JSON.stringify(BUZZ[k])) }));
  assert(want.every(w => got.includes(w)), `buzzes: ${got}`);
  await page.click(`${open} [data-i="2"]`); await clearSheets();
  await page.evaluate(() => { setPref('vibrate', 'off'); window.__buzz = []; });
  await page.click('#end'); await clearSheets();
  await page.evaluate(() => showEvent(EVENTS.find(e => e.title === 'Celebration Days')));
  assert((await page.evaluate(() => window.__buzz.length)) === 0, 'buzzed with Vibration off');
  await page.click(`${open} [data-i="2"]`); await clearSheets();
});

await t.check('i2-a05: sounds are off by default; once on, a week ticks, events chime, and ⏩ stays quiet', async () => {
  await life({ jobId: 'farmhand' });
  await page.evaluate(() => { sfx.last = null; AUDIO = null; });
  await page.click('#end'); await clearSheets();
  assert(await page.evaluate(() => sfx.last === null && AUDIO === null), 'a sound played (or audio started) while Sounds is off');
  await page.evaluate(() => { setPref('sound', 'soft'); sfx.last = null; });
  await page.click('#end'); await clearSheets();
  assert((await page.evaluate(() => sfx.last)) === 'week' && await page.evaluate(() => !!AUDIO), 'no week sound');
  await page.evaluate(() => { sfx.last = null; S.badges = Object.fromEntries(BADGES.map(b => [b.id, 1])); });
  await page.click('#ff4'); await clearSheets();
  assert((await page.evaluate(() => sfx.last)) === null, `⏩ 4 played "${await page.evaluate(() => sfx.last)}"`);
  await page.evaluate(() => showEvent(EVENTS.find(e => e.title === 'Celebration Days')));
  assert((await page.evaluate(() => sfx.last)) === 'event', 'no event chime');
  await page.click(`${open} [data-i="0"]`);
  assert(['good', 'bad', 'tap'].includes(await page.evaluate(() => sfx.last)), 'no sound for the result');
  await clearSheets();
  await page.evaluate(() => { setPref('sound', 'off'); });
});

const swipe = (sel, dx, dy, type = 'touch') => page.evaluate(([sel, dx, dy, type]) => {
  const el = document.querySelector(sel), r = el.getBoundingClientRect(), x = r.left + r.width / 2, y = r.top + Math.min(r.height / 2, 20);
  const ev = (t, x, y) => el.dispatchEvent(new PointerEvent(t, { bubbles: true, pointerId: 7, pointerType: type, isPrimary: true, clientX: x, clientY: y }));
  ev('pointerdown', x, y); ev('pointermove', x + dx / 2, y + dy / 2); ev('pointerup', x + dx, y + dy);
}, [sel, dx, dy, type]);
await t.check('i2-a22: swiping left and right changes tabs; scrolling, a mouse drag or Swipes off do not', async () => {
  await life({ jobId: 'farmhand' });
  await swipe('#main .card', -140, 10);
  assert((await page.evaluate(() => tab)) === 'jobs', 'swipe left did not go to Jobs');
  await page.waitForTimeout(120);
  assert((await page.textContent('#sr')).includes('Jobs'), 'tab change not announced');
  await swipe('#main .card', 140, 0);
  assert((await page.evaluate(() => tab)) === 'home', 'swipe right did not come back Home');
  await swipe('#main .card', 140, 0);
  assert((await page.evaluate(() => tab)) === 'home', 'swiped past the first tab');
  await swipe('#main .card', -60, 200);
  assert((await page.evaluate(() => tab)) === 'home', 'a scroll changed tabs');
  await swipe('#main .card', -140, 0, 'mouse');
  assert((await page.evaluate(() => tab)) === 'home', 'a mouse drag changed tabs');
  await page.evaluate(() => setPref('swipe', 'off'));
  await swipe('#main .card', -140, 0);
  assert((await page.evaluate(() => tab)) === 'home', 'swiped with Swipes off');
  await page.evaluate(() => setPref('swipe', 'on'));
});

await t.check('i2-a22: a pop-up swipes closed from its handle, but an event asking for a choice cannot', async () => {
  await life({ jobId: 'farmhand' });
  await page.click('[data-tab=menu]');
  assert(await page.$(`${open} .grab`), 'the Menu has no handle');
  await swipe('#sheet .grab', 0, 30);
  assert(await page.isVisible('#modal'), 'a short pull closed it');
  await swipe('#sheet .grab', 0, 150);
  assert(await page.isHidden('#modal'), 'swiping the handle down did not close the Menu');
  await page.evaluate(() => showEvent(EVENTS.find(e => e.title === 'Celebration Days')));
  assert(!(await page.$(`${open} .grab`)), 'an event with choices has a handle');
  await page.evaluate(() => { const sh = document.querySelector('#sheet'); for (const [t, y] of [['pointerdown', 200], ['pointerup', 500]]) sh.dispatchEvent(new PointerEvent(t, { bubbles: true, pointerId: 8, pointerType: 'touch', isPrimary: true, clientX: 100, clientY: y })); });
  await page.keyboard.press('Escape');
  assert(await page.isVisible('#modal'), 'the event was dismissed without a choice');
  await page.click(`${open} [data-i="2"]`);
  assert(await page.$(`${open} .grab`), 'the result has no handle');
  await swipe('#sheet .grab', 0, 150);
  assert(await page.isHidden('#modal'), 'the result did not swipe closed');
});

await t.check('i2-a24: event choices sit at the bottom of the pop-up, and the result keeps the layout', async () => {
  await life({ jobId: 'farmhand' });
  await page.evaluate(() => showEvent(EVENTS.find(e => e.title === 'Celebration Days')));
  const m = await page.evaluate(() => { const sh = document.querySelector('#sheet').getBoundingClientRect(), last = [...document.querySelectorAll('#sheet [data-i]')].pop().getBoundingClientRect();
    return { ev: document.querySelector('#sheet').classList.contains('ev'), gap: sh.bottom - last.bottom, h: sh.height, vh: innerHeight }; });
  assert(m.ev && m.gap < 60 && m.h >= m.vh * 0.55, JSON.stringify(m));
  await page.click(`${open} [data-i="2"]`);
  const r = await page.evaluate(() => { const sh = document.querySelector('#sheet').getBoundingClientRect(), ok = document.querySelector('#sheet #ok').getBoundingClientRect(); return { ev: document.querySelector('#sheet').classList.contains('ev'), gap: sh.bottom - ok.bottom }; });
  assert(r.ev && r.gap < 60, `result layout ${JSON.stringify(r)}`);
  await clearSheets();
  await page.evaluate(() => sheet('<h2>Plain</h2><button id="ok">OK</button>'));
  assert(!(await page.evaluate(() => document.querySelector('#sheet').classList.contains('ev'))), 'other pop-ups kept the event layout');
  await page.evaluate(() => closeSheet());
});

await t.check('i2-a27: Home has a side column on a tablet held sideways, and one column on a phone', async () => {
  await life({ jobId: 'farmhand' });
  await page.click('#end'); await clearSheets();
  const cols = () => page.evaluate(() => { const a = document.querySelector('.hmain').getBoundingClientRect(), b = document.querySelector('.hside').getBoundingClientRect();
    return { side: b.left >= a.right - 1 && b.top < a.bottom, recent: getComputedStyle(document.querySelector('.hside .wideonly')).display !== 'none' }; });
  let c = await cols();
  assert(!c.side && !c.recent, `phone: ${JSON.stringify(c)}`);
  await page.setViewportSize({ width: 1024, height: 768 });
  c = await cols();
  assert(c.side && c.recent, `tablet: ${JSON.stringify(c)}`);
  await page.setViewportSize({ width: 390, height: 844 });
});

await t.check('i2-a30: the install card waits for 8 weeks of play, installs on tap, and hides for good after', async () => {
  await life({ jobId: 'farmhand' });
  await page.evaluate(() => { window.__prompted = 0; const e = new Event('beforeinstallprompt', { cancelable: true }); e.prompt = () => { window.__prompted++; }; e.userChoice = Promise.resolve({ outcome: 'accepted' }); window.dispatchEvent(e); });
  assert(!(await page.$('#install')), 'offered to install in the first week');
  await page.evaluate(() => { S.turn = 8; render(); });
  assert(await page.$('#install'), 'no install card after 8 weeks');
  await page.click('#install');
  await page.waitForTimeout(50);
  assert((await page.evaluate(() => window.__prompted)) === 1 && await page.evaluate(() => prefs().installed === true), 'install did not prompt or was not remembered');
  assert(!(await page.$('#install')), 'card still showing after installing');
  // Not now hides it; the Android app (or a home-screen app) never shows it
  await page.evaluate(() => { localStorage.removeItem(PREF_KEY); setPref('tips', ['focus', 'strip', 'tabs']); INSTALL_EVT = { prompt(){}, userChoice: Promise.resolve({ outcome: 'dismissed' }) }; render(); });
  await page.click('#installno');
  assert(!(await page.$('#install')) && await page.evaluate(() => !!prefs().installNo), 'Not now did not hide it');
  await page.evaluate(() => { setPref('installNo', null); Object.defineProperty(document, 'referrer', { configurable: true, get: () => 'android-app://com.krazow.theburg' }); render(); });
  assert(!(await page.$('#install')), 'shown inside the Android app');
  await page.evaluate(() => { delete document.referrer; INSTALL_EVT = null; render(); });
});

await t.check('no errors in the console the whole time', async () => { assert(!errors.length, errors.join('; ')); });

await browser.close();
srv.close();
if (t.failed) { console.log(`${t.failed} flow check(s) failed`); process.exit(1); }
console.log('All flow checks passed');
