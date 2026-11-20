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
// (with every system open, i31-b20, unless a check passes unlock 'go' to play 'Open as I go')
async function life(extra = {}, tabName = 'home', len = 'two', unlock = 'all') {
  await setup(([extra, tabName, len, unlock]) => {
    localStorage.clear(); newGame('Flow', len, 0, { unlock }); Object.assign(S, extra); S.noEvents = true;
    setPref('tips', ['focus', 'strip', 'tabs']); closeSheet(); tab = tabName; render();
  }, [extra, tabName, len, unlock]);
}

await page.goto(srv.url, { waitUntil: 'load' });

await t.check('Life tab: moving to a rented house costs $300 and raises the rent', async () => {
  await life({ jobId: 'farmhand', money: 5000 }, 'life');
  await page.click('[data-home="house"]');
  await page.click(`${open} #y`);
  const s = await S();
  assert(s.home === 'house' && s.money === 4700, `home ${s.home}, money ${s.money}`);
  await page.click('[data-tab=home]'); await page.click('#end'); await clearSheets();
  assert(near((await S()).last.lines.find(l => l[0] === 'Rent')[1], -1250 * 12 / 52), 'rent not charged at the new rate');
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

await t.check('falling below -$40,000 offers bankruptcy; leaving town ends the game', async () => {
  await life({ money: -40500 });
  await page.click('#end');
  await page.waitForSelector(`${open} #bkfile`);
  await page.click(`${open} #bkleave`);
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
  assert(cats[0] === 32 && cats[1] === 37, `expected 32 road and 37 work events (with the contract vote, the federal shutdown, a personal day, desk stiffness and round 75's wind on Highway 12, smoke rule, de-icing and Hanford heat), got ${cats}`);
  console.log(`     (${tried} choices across ${titles.length} events)`);
});

await t.check('Waitsburg pack A, part 1 (W1–W15): every choice works for owners and renters, shows a result, and labels its price', async () => {
  const titles = await page.evaluate(() => TOWN_EVENTS_A1.map(e => e.title));
  assert(titles.length === 15, `expected 15 events in the pack, got ${titles.length}`);
  // an owner who is handy, well known, studying and pet-free; and a renter with a generator and a cat, new in town
  const variants = [
    { home: 'fixer', mortgage: 900, skills: { handy: 24, cook: 24 }, community: 50, focus: 'study', edu: 0, ageMonths: 30 * 12, money: 20000, cat: false, generator: false, dog: false },
    { home: 'room', skills: {}, community: 10, focus: 'rest', ageMonths: 30 * 12, money: 20000, cat: true, generator: true, dog: false }];
  let tried = 0;
  for (const title of titles) {
    const seen = new Set(), all = new Set();
    for (const v of variants) {
      await life(v, 'home', 'life');
      const labels = await page.evaluate(t => { const e = EVENTS.find(x => x.title === t); return { open: e.choices().filter(c => !c.if || c.if()).map(c => c.label), all: e.choices().map(c => c.label) }; }, title);
      labels.all.forEach(l => all.add(l.replace(/\$[\d,]+/g, '$')));
      for (let i = 0; i < labels.open.length; i++) {
        await life(v, 'home', 'life');
        const before = await page.evaluate(() => S.money);
        await page.evaluate(t => showEvent(EVENTS.find(e => e.title === t)), title);
        assert(/📍 .+Waitsburg/.test(await page.textContent('#sheet .evplace')), `${title} has no place in Waitsburg`);
        await page.click(`${open} [data-i="${i}"]`);
        const ok = await page.$(`${open} #ok`);
        const text = ok ? await page.textContent('#sheet') : await page.textContent('#toast');
        assert(text && text.trim().length > 3, `${title} choice "${labels.open[i]}" showed no result`);
        const after = await page.evaluate(() => S.money);
        if (/\(-\$/.test(labels.open[i])) assert(after < before, `${title}: "${labels.open[i]}" should cost money`);
        if (ok) await ok.click();
        seen.add(labels.open[i].replace(/\$[\d,]+/g, '$')); tried++;
      }
    }
    for (const l of all) assert(seen.has(l), `${title}: the choice "${l}" was never tried`);
  }
  console.log(`     (${tried} choices across ${titles.length} Waitsburg events)`);
});

await t.check('W8 and W14 keep what you chose: a generator stops later outages, and a barn cat shows on Life with its bill', async () => {
  await life({ home: 'room', money: 5000, cat: false, generator: false }, 'home', 'life');
  await page.evaluate(() => showEvent(EVENTS.find(e => e.title === 'Ice storm knocks out power')));
  await page.click(`${open} [data-i="2"]`); await clearSheets();
  await page.evaluate(() => showEvent(EVENTS.find(e => e.title === 'Mice in the walls')));
  await page.click(`${open} [data-i="2"]`); await clearSheets();
  const r = await page.evaluate(() => { const h = S.happy, m = S.money; const res = EVENTS.find(e => e.title === 'Windstorm').choices()[0].go();
    const lab = EVENTS.find(e => e.title === 'Ice storm knocks out power').choices().filter(c => !c.if || c.if()).map(c => c.label);
    return { gen: S.generator, cat: S.cat, res, kept: S.money === m && S.happy === h, lab, bill: billLines().some(([l]) => l === 'Cat food') }; });
  assert(r.gen && r.cat && r.kept && /generator/.test(r.res), JSON.stringify(r));
  assert(/generator/.test(r.lab[1]) && !r.lab.some(l => /Buy a generator/.test(l)), `the ice storm runs the generator instead of offering one: ${r.lab}`);
  assert(r.bill, 'no cat food on the weekly bills');
  await page.click('[data-tab=life]');
  const txt = await page.textContent('#main');
  assert(txt.includes('A barn cat') && txt.includes('Ready for outages'), 'the cat or generator is not on the Life tab');
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
  await life({ jobId: 'farmhand', money: 8000 }, 'life');   // i75-b15: the shop costs $6,000
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
  const ids = await page.evaluate(() => PLACES.filter(p => !(p.hide && p.hide())).map(p => p.id));   // the senior center shows from 65 (health tests)
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

await t.check('Life tab: Undo takes back a change made this week, one step at a time, until End Week', async () => {
  await life({ jobId: 'farmhand', money: 20000 }, 'life');
  const before = await S();
  await page.click('[data-k401="1"]');
  await page.click('[data-car="sedan"]'); await page.click(`${open} #y`);
  await page.waitForSelector('#undo');
  assert((await page.textContent('.undo')).includes('sedan'), 'the Undo bar should say what it undoes');
  await page.click('#undo');
  let s = await S();
  assert(s.car === before.car && s.k401rate === 1, `first undo: car ${s.car}, 401(k) ${s.k401rate}`);
  await page.click('#undo');
  s = await S();
  assert(s.k401rate === 0 && near(s.money, before.money), 'second undo should restore the 401(k) rate and the cash');
  assert(!(await page.$('#undo')), 'nothing left to undo');
  await page.click('[data-k401="2"]'); await page.waitForSelector('#undo');
  await page.click('[data-tab=home]'); await page.click('#end'); await clearSheets(); await page.click('[data-tab=life]');
  assert(!(await page.$('#undo')), 'a played week cannot be undone');
});

await t.check('Life tab: a change that rolled the dice cannot be undone (no rerolls)', async () => {
  await life({ jobId: 'farmhand' }, 'life');
  await setup(() => { document.querySelector('#main').insertAdjacentHTML('afterbegin', '<button id="rnd">Roll</button>'); $('#rnd').onclick = () => { S.money += Math.round(Math.random() * 100) + 1; save(); }; });
  await page.click('#rnd'); await page.waitForTimeout(50); await setup(() => render());
  assert(!(await page.$('#undo')), 'a dice roll was offered for undo');
});

await t.check('a long press, Shift+Enter or the Menu opens the skip options; Auto until and the speed are remembered', async () => {
  await life({ jobId: 'farmhand' }, 'home', 'five');
  assert(await page.isVisible('#auto') && !(await page.isVisible('#ff4')) && !(await page.isVisible('#ff13')), 'a narrow phone shows End Week and Auto only');
  await page.focus('#end'); await page.keyboard.press('Shift+Enter');
  await page.waitForSelector(`${open} #sk13`);
  assert((await S()).turn === 0, 'Shift+Enter should not play a week');
  await page.click(`${open} [data-until="season"]`);
  assert(await page.getAttribute(`${open} [data-until="season"]`, 'aria-checked') === 'true', 'the pick is not shown as checked');
  await page.click(`${open} #close`);
  assert(/season turns/.test(await page.getAttribute('#auto', 'aria-label')), 'Auto should say what it plays until');
  await page.click('#auto'); await clearSheets();
  const s = await S();
  assert(s.turn >= 8 && s.turn <= 9 && new Date(s.date).getMonth() === 2, `Auto until the season changes stopped at week ${s.turn}`);
  await page.click('[data-tab=menu]'); await page.click(`${open} #skipopts`); await page.click(`${open} [data-until="event"]`); await page.click(`${open} #close`);
  await page.setViewportSize({ width: 768, height: 1024 });
  await setup(() => render());
  assert(await page.isVisible('#ff4') && await page.isVisible('#ff13'), 'wide screens keep the ⏩ buttons');
  await page.setViewportSize({ width: 390, height: 844 });
});

await t.check('🗓 Plan: build a rotation, End Week follows it, and picking by hand pauses it for a week', async () => {
  await life({ jobId: 'farmhand' }, 'home');
  await page.click('#planbtn');
  await page.click(`${open} [data-rm="0"]`);
  for (const k of ['work', 'community', 'outdoors']) await page.click(`${open} [data-add="${k}"]`);
  await page.click(`${open} #psave`);
  assert((await S()).focus === 'work' && (await page.textContent('.planline')).includes('Plan'), 'plan not on');
  assert(await page.getAttribute('#planbtn', 'aria-pressed') === 'true', 'Plan toggle not pressed');
  await page.waitForTimeout(400); await page.click('#end'); await clearSheets();
  assert((await S()).focus === 'community', 'End Week should move on to the next focus in the plan');
  await page.click('[data-f=rest]');
  assert((await page.textContent('.planline')).includes('paused'), 'a hand pick should pause the plan');
  await page.waitForTimeout(400); await page.click('#end'); await clearSheets();
  assert((await S()).focus === 'outdoors', 'the plan should pick up again the next week');
  await page.click('#planbtn'); await page.click(`${open} #poff`);
  assert(!(await S()).plan.length && !(await page.$('.planline')), 'Stop the plan should turn it off');
});
// ---- jobs and school (ideas round 3), by tapping ----
await t.check('i3-a07/a08: Apply opens an interview; an answer leads to the offer, and a hard-to-fill job lets you ask for more', async () => {
  await life({ edu: 2, community: 60 }, 'jobs');
  await page.click('[data-apply="rn"]');
  await page.waitForSelector(`${open} >> text=Interview: Registered nurse`);
  assert((await page.$$(`${open} [data-i]`)).length === 3, 'three interview answers');
  await page.evaluate(() => { window._r = Math.random; Math.random = () => 0.3; });
  await page.click(`${open} [data-i="0"]`);
  await page.waitForSelector(`${open} >> text=You're hired`);
  assert((await page.$$(`${open} [data-i]`)).length === 3, 'the offer should have three choices');
  await page.click(`${open} [data-i="1"]`);
  await page.evaluate(() => { Math.random = window._r; });
  await page.waitForSelector(`${open} >> text=5% more`);
  await page.click(`${open} #ok`);
  const s = await S();
  assert(s.jobId === 'rn' && Math.abs(s.raise - 1.05) < 1e-9, JSON.stringify({ job: s.jobId, raise: s.raise }));
});

await t.check('i3-a07: Decide later leaves the interview pending until End Week', async () => {
  await life({}, 'jobs');
  await page.click('[data-apply="diner"]');
  await page.click(`${open} #no`);
  assert((await S()).interview.id === 'diner', 'pending interview');
  assert((await page.textContent('#main')).includes('Waiting to hear back'), 'the Jobs tab should say you are waiting');
});

await t.check('i3-a01/a09: the Jobs tab shows your ladder; giving notice ends the job after two weeks with a good reference', async () => {
  await life({ jobId: 'cellar', tenure: 14, rung: 1 }, 'jobs');
  const main = await page.textContent('#main');
  assert(main.includes('Cellar master') && main.includes('Assistant winemaker') && main.includes('Next step up'), 'ladder not shown');
  await page.click('#quit');
  await page.click(`${open} #notice`);
  assert(!(await page.$('#quit')) && (await page.textContent('#main')).includes('last day'), 'notice not shown');
  await page.click('[data-tab=home]');
  for (let i = 0; i < 3; i++) { await page.waitForTimeout(400); await page.click('#end'); await clearSheets(); }   // three presses, not a double tap
  const s = await S();
  assert(s.jobId === null && s.ref && s.ref.k === 'good', JSON.stringify({ job: s.jobId, ref: s.ref }));
});

await t.check('i3-a02/a03: the Life tab picks a program and signs up for a certificate', async () => {
  await life({ money: 3000 }, 'life');
  await page.click('[data-prog="nursing"]');
  assert((await S()).program === 'nursing', 'program not set');
  assert((await page.textContent('#main')).includes('registered nurse'), 'matching jobs not listed');
  await page.click('[data-cert="phlebotomy"]');
  await page.click(`${open} #yes`);
  const s = await S();
  assert(s.certStudy && s.certStudy.id === 'phlebotomy' && s.money === 2300, JSON.stringify({ c: s.certStudy, m: s.money }));
  assert(await page.$eval('[data-cert="welding"]', b => b.disabled), 'one course at a time');
  await page.click('[data-tab=jobs]');
  await page.click('[data-locked="welder"]');
  await page.waitForSelector(`${open} >> text=Welding`);
  await page.click(`${open} #no`);
});

await t.check('i3-a14: the bus toggle shows for a Walla Walla job and swaps out the carpool', async () => {
  await life({ jobId: 'cellar', community: 40 }, 'jobs');
  assert(await page.$('#carpool'), 'carpool first');
  await page.click('#bus');
  const s = await S();
  assert(s.bus === true && !(await page.$('#carpool')) && (await page.getAttribute('#bus', 'aria-pressed')) === 'true', 'bus not on');
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
  await page.waitForTimeout(400); await page.click('#end'); await clearSheets();   // a second press, not a double tap
  await page.evaluate(() => { S.badges = {}; });
  await page.waitForTimeout(400); await page.click('#end'); await clearSheets();   // a second press, not a double tap
  await page.evaluate(() => showEvent(EVENTS.find(e => e.title === 'Celebration Days')));
  const { got, want } = await page.evaluate(() => ({ got: window.__buzz.map(p => JSON.stringify(p)), want: ['week', 'event', 'badge'].map(k => JSON.stringify(BUZZ[k])) }));
  assert(want.every(w => got.includes(w)), `buzzes: ${got}`);
  await page.click(`${open} [data-i="2"]`); await clearSheets();
  await page.evaluate(() => { setPref('vibrate', 'off'); window.__buzz = []; });
  await page.waitForTimeout(400); await page.click('#end'); await clearSheets();   // a second press, not a double tap
  await page.evaluate(() => showEvent(EVENTS.find(e => e.title === 'Celebration Days')));
  assert((await page.evaluate(() => window.__buzz.length)) === 0, 'buzzed with Vibration off');
  await page.click(`${open} [data-i="2"]`); await clearSheets();
});

await t.check('i2-a05: sounds are off by default; once on, a week ticks, events chime, and ⏩ stays quiet', async () => {
  await life({ jobId: 'farmhand' });
  await page.evaluate(() => { sfx.last = null; AUDIO = null; });
  await page.waitForTimeout(400); await page.click('#end'); await clearSheets();   // a second press, not a double tap
  assert(await page.evaluate(() => sfx.last === null && AUDIO === null), 'a sound played (or audio started) while Sounds is off');
  await page.evaluate(() => { setPref('sound', 'soft'); sfx.last = null; });
  await page.waitForTimeout(400); await page.click('#end'); await clearSheets();   // a second press, not a double tap
  assert((await page.evaluate(() => sfx.last)) === 'week' && await page.evaluate(() => !!AUDIO), 'no week sound');
  await page.evaluate(() => { sfx.last = null; S.badges = Object.fromEntries(BADGES.map(b => [b.id, 1])); });
  await page.waitForTimeout(400); await page.dispatchEvent('#end', 'contextmenu'); await page.click(`${open} #sk4`); await clearSheets();   // ⏩ 4 sits behind a long press on a narrow phone
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
  await page.evaluate(() => { S.turn = 8; setPref('clHide', true); render(); });   // one card at a time: the first-month checklist goes first
  assert(await page.$('#install'), 'no install card after 8 weeks');
  await page.click('#install');
  await page.waitForTimeout(50);
  assert((await page.evaluate(() => window.__prompted)) === 1 && await page.evaluate(() => prefs().installed === true), 'install did not prompt or was not remembered');
  assert(!(await page.$('#install')), 'card still showing after installing');
  // Not now hides it; the Android app (or a home-screen app) never shows it
  await page.evaluate(() => { localStorage.removeItem(PREF_KEY); setPref('tips', ['focus', 'strip', 'tabs']); setPref('clHide', true); INSTALL_EVT = { prompt(){}, userChoice: Promise.resolve({ outcome: 'dismissed' }) }; render(); });
  await page.click('#installno');
  assert(!(await page.$('#install')) && await page.evaluate(() => !!prefs().installNo), 'Not now did not hide it');
  await page.evaluate(() => { setPref('installNo', null); Object.defineProperty(document, 'referrer', { configurable: true, get: () => 'android-app://com.krazow.theburg' }); render(); });
  assert(!(await page.$('#install')), 'shown inside the Android app');
  await page.evaluate(() => { delete document.referrer; INSTALL_EVT = null; render(); });
});


/* ---------- Round 2 clarity (i2-a02 … i2-a32) ---------- */
await t.check('i2-a02: the focus preview uses the same math as the week, shows a fading focus, and changes nothing', async () => {
  const r = await setup(() => {
    localStorage.clear(); newGame('Prev', 'two', 0); S.noEvents = true; S.jobId = 'farmhand'; S.happy = 50; S.health = 50;
    const before = JSON.stringify(S), p = focusPreview('work'); const same = JSON.stringify(S) === before;
    S.focus = 'rest'; weekTick(false); const a = Object.fromEntries(S.last.lines)['Paycheck'];
    S.focus = 'work'; S.streakF = null; weekTick(false); const b = Object.fromEntries(S.last.lines)['Paycheck + overtime'];
    S.streakF = 'community'; S.streakN = 6; const fade = focusPreview('community');
    S.focus = 'community'; S.streakF = 'outdoors'; S.streakN = 1; S.happy = 50; const fx = focusPreview('community').fx;
    const h0 = S.community; adj(focusFx('community', focusEffect('community', 1), false));
    return { same, cash: p.cash[0][1], extra: (b - a) * 0.85, eff: fade.eff, line: previewLine('community'), fx: fx.community, moved: S.community - h0 };
  });
  assert(r.same, 'the preview changed the save');
  assert(near(r.cash, r.extra, 0.02), `overtime preview ${r.cash} vs the week's ${r.extra}`);
  assert(near(r.eff, 0.64) && /works at 64%/.test(await setup(() => { S.streakF = 'community'; S.streakN = 6; return previewLine('community'); })), `fading ${r.eff}`);
  assert(near(r.fx, r.moved), `preview ${r.fx} vs applied ${r.moved}`);
  await setup(() => { S.streakF = 'community'; S.streakN = 6; S.focus = 'rest'; tab = 'home'; setPref('mapView', false); render(); });
  assert((await page.textContent('.fbtn[data-f="community"]')).includes('64%'), 'the Town button should say 64%');
  assert(await page.$('#fprev'), 'no preview under the focus buttons');
});

await t.check('i2-a21: every money line says why, and the details explain why stats moved', async () => {
  await life({ jobId: 'foodplant', dog: true, partner: true, money: -500, k401rate: 1 });
  await page.click('#end'); await clearSheets();
  const s = await S();
  const missing = s.last.lines.filter(l => !l[2]).map(l => l[0]);
  assert(!missing.length, `no why for: ${missing.join(', ')}`);
  assert(s.last.why.some(w => /Your focus/.test(w)) && s.last.why.some(w => /58 miles/.test(w)) && s.last.why.some(w => /debt/i.test(w)), JSON.stringify(s.last.why));
  await page.click('#strip');
  const row = await page.$(`${open} .whyrow`);
  assert((await row.getAttribute('aria-expanded')) === 'false', 'why starts closed');
  await row.click();
  assert((await row.getAttribute('aria-expanded')) === 'true' && await page.isVisible(`${open} .whytext`), 'tapping a line should show why');
  assert((await page.textContent('#sheet')).includes('Why your stats moved'), 'no stat reasons');
  await page.click(`${open} #ok`);
});

await t.check('i2-a10: badges earned in a week get one celebration card, then the week goes on', async () => {
  await life({ jobId: 'farmhand', dog: true }, 'home');
  await setup(() => { S.badges = {}; });
  await page.click('#end');
  await page.waitForSelector(`${open} .big`);
  const txt = await page.textContent('#sheet');
  assert(/new milestones/.test(txt) && txt.includes('First paycheck') && txt.includes('Good dog'), txt.slice(0, 200));
  assert((await page.$$(`${open} h2`)).length === 1, 'two badges should share one card');
  await page.click(`${open} #ok`);
  assert(await page.isHidden('#modal'), 'Continue should close the card');
  assert(!(await S()).newBadges.length, 'celebrated badges should be cleared');
  await setup(() => { setPref('motion', 'off'); S.newBadges = ['🐕 Badge earned: Good dog']; celebrate(S.newBadges, null); });
  assert((await page.$$(`${open} .celebrate i`)).length === 0, 'no confetti when animations are off');
  await setup(() => { setPref('motion', 'on'); closeSheet(); });
});

await t.check('i2-a08: cash counts up after a week, and not with reduced motion', async () => {
  await life({ jobId: 'farmhand', money: 1000, badges: { job: 1 } });
  await page.click('#end');
  const mid = await page.textContent('.top .money');
  await page.waitForTimeout(600);
  const end = await page.textContent('.top .money'), real = await page.evaluate(() => fmt(S.money));
  assert(end === real && mid !== real, `mid ${mid}, end ${end}, real ${real}`);
  await clearSheets();
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.click('#end');
  assert((await page.textContent('.top .money')) === await page.evaluate(() => fmt(S.money)), 'reduced motion should show the final cash right away');
  await clearSheets();
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.click('[data-tab=menu]'); await page.click(`${open} #settings`);
  await page.click(`${open} [data-set="motion"][data-v="off"]`);
  assert(await page.evaluate(() => setting('motion') === 'off' && calmMotion()), 'Settings → Animations should turn them off');
  await page.click(`${open} [data-set="motion"][data-v="on"]`); await page.evaluate(() => closeSheet());
});

await t.check('i2-a14: coming back after a while shows "Previously in the Burg" once', async () => {
  await setup(() => { localStorage.clear(); newGame('Back', 'two', 0); S.noEvents = true; S.jobId = 'farmhand'; S.goals = ['dog']; save();
    const a = slots(); a[0].savedAt = Date.now() - 2 * 864e5; store.set(SLOTS_KEY, a); S = null; renderTitle(); });
  await page.click('[data-cont="0"]');
  await page.waitForSelector(`${open} >> text=Previously in the Burg`);
  const txt = await page.textContent('#sheet');
  assert(txt.includes('2 days ago') && txt.includes('Wheat farm hand') && txt.includes('Good dog'), txt.slice(0, 300));
  await page.click(`${open} #ok`);
  await setup(() => { save(); S = null; renderTitle(); });
  await page.click('[data-cont="0"]');
  assert(await page.isHidden('#modal'), 'the recap should not show again for the same save');
});

await t.check('i2-a17: a first-time explainer shows once per system, one per screen, and Got it remembers it', async () => {
  await life({ jobId: 'farmhand' }, 'life');
  await setup(() => { setPref('first', {}); render(); });
  assert((await page.$$('[data-firstcard]')).length === 1, 'one explainer per screen');
  const k = await page.getAttribute('[data-firstcard]', 'data-firstcard');
  assert(/Life Score/.test(await page.textContent('[data-firstcard]')) || k !== 'goals', 'the goals explainer should mention the score');
  await page.click(`[data-first="${k}"]`);
  assert(!(await page.$(`[data-firstcard="${k}"]`)) && (await page.evaluate(k => prefs().first[k], k)) === 1, 'Got it did not stick');
  await setup(() => render());
  assert((await page.getAttribute('[data-firstcard]', 'data-firstcard')) !== k, 'the same explainer came back');
  const trip = await setup(() => { tripPicker(); return document.querySelector('#sheet [data-firstcard]') && document.querySelector('#sheet').textContent; });
  assert(trip && trip.includes(`${await page.evaluate(() => TRIP_TIME * 100)}%`), 'the trips explainer should use the trip numbers');
  await setup(() => { closeSheet(); setPref('first', Object.fromEntries(Object.keys(FIRST).map(x => [x, 1]))); });
});

await t.check('i2-a20: tapping a word shows what it means, and screen readers get it too', async () => {
  await life({ jobId: 'farmhand' }, 'jobs');
  const b = await page.$('#main .term');
  const id = await b.getAttribute('aria-describedby');
  assert(/taxes/.test(await page.textContent('#' + id)), 'the description is missing');
  await b.click();
  assert((await b.getAttribute('aria-expanded')) === 'true' && await page.isVisible('#main .termdef'), 'no meaning shown');
  await b.focus(); await page.keyboard.press('Enter');
  assert(!(await page.$('#main .termdef')), 'Enter should close it again');
});

await t.check('i2-a19: Home shows one next step from the weakest part of the score, and it only goes somewhere', async () => {
  await life({ jobId: 'farmhand', k401rate: 0, happy: 80, health: 80, community: 80, money: 100 });
  await setup(() => { setPref('clHide', true); render(); });
  const txt = await page.textContent('.card.next');
  assert(/401\(k\)/.test(txt), txt);
  const before = await S();
  await page.click('[data-next]');
  const after = await S();
  assert((await page.evaluate(() => tab)) === 'life' && after.k401rate === before.k401rate && after.focus === before.focus, 'the hint should only change tabs');
  await setup(() => { S.k401rate = 1; S.community = 12; S.focus = 'rest'; tab = 'home'; render(); });
  assert(/Show up for town/.test(await page.textContent('.card.next')), 'community should be the next step');
  await setup(() => setPref('clHide', false));
});

await t.check('i2-a32: moving, buying a vehicle and quitting list what will change first', async () => {
  await life({ jobId: 'farmhand', money: 30000 }, 'life');
  await page.click('[data-home="fixer"]');
  let txt = await page.textContent('#sheet');
  assert(txt.includes('What will change') && txt.includes('$30,000 →') && /a week\)/.test(txt), txt.slice(0, 300));
  await page.keyboard.press('Escape');
  assert((await S()).home === 'room', 'Escape should cancel');
  await page.click('[data-car="sedan"]');
  txt = await page.textContent('#sheet');
  assert(/Gas: about .*\/wk → .*\/wk/.test(txt) && txt.includes('32 mpg'), txt.slice(0, 300));
  await page.click(`${open} #n`);
  await page.click('[data-tab=jobs]'); await page.click('#quit');
  txt = await page.textContent('#sheet');
  assert(/Take-home: .*\/wk → \$0/.test(txt), txt.slice(0, 300));
  await page.click(`${open} #n`);
});

await t.check('i2-a29: the ending tells your life story year by year, skippable in one tap, and the score card has highlights', async () => {
  const r = await setup(() => {
    localStorage.clear(); newGame('Story', 'five', 0); S.noEvents = true; S.jobId = 'farmhand'; log('Hired as Wheat farm hand in Waitsburg!');
    for (let i = 0; i < 60; i++) weekTick(false);
    return { years: S.years.length, m: S.years[0].m };
  });
  assert(r.years >= 1 && r.m.some(m => /Hired as/.test(m)), JSON.stringify(r));
  await setup(() => finish('Five years in the Burg is in the books.'));
  await page.waitForSelector(`${open} #story`);
  assert(/2027 · age \d+/.test(await page.textContent('#story')), 'no year rows in the story');
  assert(await page.$(`${open} #again`), 'Play again should still be there');
  await page.click('#skipstory');
  assert(!(await page.$('#story')) && (await page.evaluate(() => document.activeElement.id)) === 'finalscore', 'Skip should jump to the score');
  const hl = await setup(() => lifeStory().rows.length);
  assert(hl >= 1, 'no highlights for the score card');
  await page.click(`${open} #again`);
});

/* ---------- round 3: money (insurance, housing, loans, investing, farm markets, debt help) ---------- */
await t.check('i3-a27: filing for bankruptcy wipes the debt and keeps the life going, once', async () => {
  await life({ money: -40500, car: 'truck', carValue: 30000, loanLeft: 30, loanPay: 640, k401: 5000, stocks: 2000 });
  await page.click('#end');
  await page.waitForSelector(`${open} #bkfile`);
  const txt = await page.textContent('#sheet');
  assert(/lose/.test(txt) && /401\(k\)/.test(txt) && /only do it once/.test(txt), txt.slice(0, 300));
  await page.click(`${open} #bkfile`);
  let s = await S();
  assert(s.money === 0 && s.bk != null && s.car === 'beater' && s.loanLeft === 0 && s.stocks === 0 && s.k401 >= 5000 && !s.over, JSON.stringify({ m: s.money, bk: s.bk, car: s.car, k: s.k401 }));
  assert(await page.$('#end'), 'the game should go on');
  await page.evaluate(() => { S.money = -40500; });
  await page.click('#end');
  await clearSheets();
  await page.waitForSelector(`${open} >> text=Buried in debt`);
  assert(!(await page.$(`${open} #bkfile`)), 'bankruptcy is once a life');
  await page.click(`${open} #again`);
  await page.waitForSelector('#start');
});

await t.check('i3-a19: the insurance sheet changes coverage and the weekly bill', async () => {
  await life({ jobId: 'farmhand', money: 5000 }, 'life');
  assert((await page.textContent('#main')).includes('Insurance & phone'), 'no insurance card on Life');
  await page.click('#inssheet');
  await page.click(`${open} [data-ins="auto"][data-v="liab"]`);
  await page.click(`${open} [data-ins="renters"][data-v="false"]`);
  assert(await page.getAttribute(`${open} [data-ins="auto"][data-v="liab"]`, 'aria-pressed') === 'true', 'the choice should show as pressed');
  await page.click(`${open} #ok`);
  const s = await S();
  assert(s.ins.auto === 'liab' && s.ins.renters === false, JSON.stringify(s.ins));
  await page.click('[data-tab=home]'); await page.click('#end'); await clearSheets();
  assert(near((await S()).last.lines.find(l => l[0] === 'Insurance & phone')[1], -(220 - 75 - 15) * 12 / 52), 'the bill should drop by $90 a month');
});

await t.check('i3-a21/a22/a23: the home card shows the market and rates; refinancing and borrowing against the house work', async () => {
  await life({ jobId: 'farmhand', money: 20000, homeGrow: 0.07 }, 'life');
  assert(/Hot/.test(await page.textContent('#main')), 'a hot market should show');
  await page.click('[data-home="fixer"]');
  assert(/hot/.test(await page.textContent('#sheet')), 'the buy sheet shows the market');
  await page.click(`${open} #y`);
  let s = await S();
  assert(s.money === 20000 - Math.round(9000 * 1.05) - 300 && near(s.mortgage, 950 * 1.05) && s.mortRate === 6.5, JSON.stringify({ m: s.money, mort: s.mortgage }));
  await page.evaluate(() => { S.rate = 5.25; S.equity = 40000; render(); });
  await page.click('#refi'); await page.click(`${open} #y`);
  s = await S();
  assert(s.mortRate === 5.25 && s.mortgage < 950 * 1.05 * 0.9, `refi ${s.mortgage}`);
  await page.click('#heloan');
  await page.click(`${open} [data-he="20000"]`);
  s = await S();
  assert(s.heLeft === 120 && s.hePay > 200 && /Home equity loan/.test(await page.textContent('#main')), JSON.stringify({ he: s.heLeft, pay: s.hePay }));
});

await t.check('i3-a29/a17: index funds and wine futures from the Life tab', async () => {
  await life({ jobId: 'farmhand', money: 9000, date: new Date(2027, 9, 4).getTime() }, 'life');
  await page.click('[data-inv="5000"]');
  await page.click('[data-inv="-1000"]');
  await page.click('#wine');
  const s = await S();
  assert(s.stocks === 4000 && s.wine.length === 1 && s.money === 9000 - 4000 - 2500, JSON.stringify({ st: s.stocks, w: s.wine, m: s.money }));
  assert(!(await page.$('#wine')) && /in on the 2027 vintage/.test(await page.textContent('#main')), 'one vintage a year');
  await page.click('[data-inv="all"]');
  assert((await S()).stocks === 0, 'sell all');
});

await t.check('i3-a15/a16: the harvest asks sell or store; stored wheat sells from the Life tab; crop insurance toggles', async () => {
  await life({ jobId: 'farmhand', money: 10000, date: new Date(2027, 7, 2).getTime() }, 'life');
  await page.evaluate(() => { startBiz('wheat'); S.biz.paidYear = null; S.noEvents = false; S.due = []; });   // i22-a04: as if leased by March
  await page.click('#cropins');
  assert((await S()).biz.ins === true, 'crop insurance should turn on');
  await page.evaluate(() => { bizWeek([], []); showEvent(takeDue()); });
  assert(/elevator/.test(await page.textContent('#sheet')), 'the harvest choice explains storing');
  await page.click(`${open} [data-i="1"]`); await page.click(`${open} #ok`);
  let s = await S();
  assert(s.biz.stored > 0 && s.biz.crop === 0, JSON.stringify(s.biz));
  await page.click('[data-tab=life]');
  const m = s.money; await page.click('#sellwheat');
  s = await S();
  assert(s.biz.stored === 0 && s.money > m, 'selling stored wheat pays');
});

await t.check('i3-a18: a cattle herd shows on the Life tab and warns when nobody has checked it', async () => {
  await life({ jobId: 'farmhand', money: 20000 }, 'life');
  await page.evaluate(() => { startBiz('cattle'); S.biz.check = S.turn - 10; render(); });
  const txt = await page.textContent('#main');
  assert(/6 cows/.test(txt) && /Get outside/.test(txt), txt.slice(0, 200));
});
// ---- Retirement and planning (ideas round 3) ----
await t.check('i3-a33/a28: the Life tab writes a will, opens the 13-week money outlook, and the legacy sheet reads the will', async () => {
  await life({ jobId: 'farmhand', money: 3000, ageMonths: 30 * 12 }, 'life', 'life');
  assert((await page.textContent('#main')).includes('Planning ahead'), 'no planning card');
  await page.click('#will');
  let s = await S();
  assert(s.will && s.out.will && near(s.money, 2700), JSON.stringify({ will: s.will, money: s.money }));
  assert((await page.textContent('#main')).includes('On file') && !(await page.$('#will')), 'will not shown as on file');
  await page.click('#outlook');
  const txt = await page.textContent('#sheet');
  assert(/next 13 weeks/.test(txt) && /On track|dips below zero/.test(txt) && (await page.$$('#sheet tbody tr')).length === 13, txt.slice(0, 200));
  await page.keyboard.press('Escape');
  assert(!(await page.$(open)), 'Escape closes the outlook');
  await setup(() => { S.kids = [S.ageMonths - 240]; S.money = 300000; finish('done'); });
  await page.click('#legacy');
  assert((await page.textContent('#sheet')).includes('left a will'), 'legacy sheet should say a will was left');
  await page.click(`${open} #heirgo`);
  s = await S();
  assert(s.gen === 2 && s.money > 100000 && !s.probate, JSON.stringify({ gen: s.gen, money: s.money, probate: s.probate }));
});
await t.check('i3-a34/a32: owners can list the spare room, and the rich can endow a scholarship from the Life tab', async () => {
  await life({ jobId: 'farmhand', money: 200000, home: 'farm', mortgage: 1650, equity: 40000 }, 'life');
  await page.click('#host');
  assert((await S()).roomHost === true && (await page.getAttribute('#host', 'aria-pressed')) === 'true', 'hosting not on');
  await page.click('#scholar'); await page.click(`${open} #y`);
  const s = await S();
  assert(s.scholar && s.money === 160000, JSON.stringify({ scholar: s.scholar, money: s.money }));
  assert((await page.textContent('#main')).includes('Flow Scholarship'), 'scholarship row missing');
});
await t.check('i3-a24: the retire button counts a vested pension', async () => {
  await life({ ageMonths: 63 * 12, jobId: 'para', pensionYears: 20, pensionPay: 2900 }, 'jobs', 'life');
  const label = await page.textContent('#retire');
  assert(/pension/.test(label), label);
  await page.click('#retire'); await page.click('[data-tab=home]'); await page.click('#end'); await clearSheets();
  const l = Object.fromEntries((await S()).last.lines);
  assert(l['Pension'] > 0 && l['Social Security'] > 0, JSON.stringify(l));
});

// Event pack A, part 2 (W16–W30): every choice of every new town event, with the life each one needs
await t.check('W16–W30: every choice of the new Waitsburg events works, costs rise with prices, and each has a place', async () => {
  const W2 = ['Snow day', 'Community potluck at Town Hall', '"Lost dog" poster', 'Pour beer at the Celebration Days beer garden', 'Town Hall roof fundraiser',
    'Adopt a Main Street flower basket', 'Little League needs a coach', 'A cross-country cyclist asks for water', 'Late frost kills the garden',
    'Christmas lights contest', "Neighbor's tree takes out your fence", 'Barn dance at the fairgrounds', 'Wild turkeys strut down Main Street',
    'Graduation party invitations', 'Rattlesnake in the woodpile'];
  const info = await page.evaluate(W2 => W2.map(t => { const e = EVENTS.find(x => x.title === t); return e && { cat: e.cat || 'town', place: !!EVENT_PLACE[t] }; }), W2);
  info.forEach((x, i) => assert(x && x.cat === 'town' && x.place, `${W2[i]}: missing, not a town event, or no place`));
  // a homeowner with Handy 2 and Cook 2, single, so every choice is open; prices at 1.5x the 2027 level
  const base = { home: 'fixer', money: 20000, community: 50, ageMonths: 30 * 12, col: 1.5, partner: false, skills: { handy: 24, cook: 24 } };
  let tried = 0;
  for (const title of W2) {
    await life(base, 'home', 'life');
    const n = await page.evaluate(t => EVENTS.find(e => e.title === t).choices().filter(c => !c.if || c.if()).length, title);
    const want = await page.evaluate(t => EVENTS.find(e => e.title === t).choices().length, title);
    assert(n === want, `${title}: only ${n} of ${want} choices open`);
    for (let i = 0; i < n; i++) {
      await life(base, 'home', 'life');
      await page.evaluate(t => showEvent(EVENTS.find(e => e.title === t)), title);
      assert((await page.textContent('#sheet .evplace')).includes('Waitsburg') || (await page.textContent('#sheet .evplace')).includes('Home'), `${title}: no place shown`);
      const label = await page.textContent(`${open} [data-i="${i}"]`);
      const m = label.match(/-\$([\d,]+)/);
      const m0 = (await S()).money;
      await page.click(`${open} [data-i="${i}"]`);
      const ok = await page.$(`${open} #ok`);
      const text = ok ? await page.textContent('#sheet') : await page.textContent('#toast');
      assert(text && text.trim().length > 3, `${title} choice ${i + 1} showed no result`);
      if (ok) await ok.click();
      const spent = m0 - (await S()).money;
      // a cost in the label is today's price (1.5x), and that's what the choice takes (luck can add a reward or a bill on top)
      if (m && !/Handle it|Search|Go big/.test(label)) assert(Math.abs(spent - Number(m[1].replace(/,/g, ''))) <= 1, `${title}: label ${label} but spent ${spent}`);
      tried++;
    }
  }
  assert(tried === 32, `expected 32 choices, tried ${tried}`);
  // who and when: renters never lose a garden or a fence, a dog owner skips the poster, the beer garden is 21+ in May
  const gate = await page.evaluate(() => {
    const ev = t => EVENTS.find(e => e.title === t);
    S.home = 'room'; const renter = ev('Late frost kills the garden').when(4);
    S.home = 'fixer'; const owner = ev('Late frost kills the garden').when(4), april = ev('Late frost kills the garden').when(3);
    S.dog = true; const dog = ev('"Lost dog" poster').when(5); S.dog = false;
    S.ageMonths = 20 * 12; const young = ev('Pour beer at the Celebration Days beer garden').when(4); S.ageMonths = 30 * 12;
    const may = ev('Pour beer at the Celebration Days beer garden').when(4);
    S.community = 25; const lowCom = ev('Little League needs a coach').when(2); S.community = 50;
    const noWind = ev("Neighbor's tree takes out your fence").when(5);
    S.evCd['Windstorm'] = S.turn + 38; const wind = ev("Neighbor's tree takes out your fence").when(5);
    S.home = 'house'; const windRenter = ev("Neighbor's tree takes out your fence").when(5); S.home = 'fixer';
    return { renter, owner, april, dog, young, may, lowCom, noWind, wind, windRenter };
  });
  assert(!gate.renter && gate.owner && !gate.april && !gate.dog && !gate.young && gate.may && !gate.lowCom && !gate.noWind && gate.wind && !gate.windRenter, JSON.stringify(gate));
  // W16: shoveling counts toward the winter town goal
  await life({ ...base, date: new Date(2028, 0, 10).getTime() }, 'home', 'life');
  await page.evaluate(() => showEvent(EVENTS.find(e => e.title === 'Snow day')));
  await page.click(`${open} [data-i="1"]`); await clearSheets();
  assert(((await S()).sgoal || {}).prog === 1, 'shoveling did not count toward the winter goal');
  // W27: a barn dance while single makes the next "catches your eye" likelier, once
  await page.evaluate(() => showEvent(EVENTS.find(e => e.title === 'Barn dance at the fairgrounds')));
  await page.click(`${open} [data-i="0"]`); await clearSheets();
  assert((await S()).danceBoost === true, 'no barn-dance boost');
  await page.evaluate(() => showEvent(EVENTS.find(e => e.title === 'Someone catches your eye')));
  await page.click(`${open} [data-i="0"]`); await clearSheets();
  assert((await S()).danceBoost === false, 'the boost was not used up');
});

await t.check('W22: the Little League season runs coach → losing streak → comeback → season party, each when it\'s due', async () => {
  for (const [streak, party] of [[0, 0], [1, 1]]) {
    await life({ community: 50, money: 5000, date: new Date(2028, 2, 6).getTime() }, 'home', 'life');
    await page.evaluate(() => showEvent(EVENTS.find(e => e.title === 'Little League needs a coach')));
    await page.click(`${open} [data-i="0"]`); await clearSheets();
    assert(await page.evaluate(() => leagueOn() && !EVENTS.find(e => e.title === 'Little League needs a coach').when(2)), 'coaching did not start the season');
    for (const [title, pick] of [['A losing streak', streak], ['The comeback', 0], ['The season party', party]]) {
      const due = await page.evaluate(() => { S.turn = S.chains.league.at; const d = planDue(curMonth()); return d && d.title; });
      assert(due === title, `expected ${title} to be due, got ${due}`);
      await page.evaluate(t => showEvent(PLAN_DUE.find(e => e.title === t)), title);
      const n = await page.$$eval(`${open} [data-i]`, b => b.length);
      assert(pick < n, `${title}: no choice ${pick + 1}`);
      await page.click(`${open} [data-i="${pick}"]`); await clearSheets();
    }
    const end = await page.evaluate(() => ({ step: S.chains.league.step, on: leagueOn(), again: EVENTS.find(e => e.title === 'Little League needs a coach').when(2) }));
    assert(end.step === 99 && !end.on && end.again, JSON.stringify(end));
  }
  // skipping never starts the story
  await life({ community: 50, date: new Date(2028, 2, 6).getTime() }, 'home', 'life');
  await page.evaluate(() => showEvent(EVENTS.find(e => e.title === 'Little League needs a coach')));
  await page.click(`${open} [data-i="1"]`); await clearSheets();
  assert(!(await page.evaluate(() => leagueOn() || !!planDue(curMonth()))), 'skipping started the season');
});

// ---- i31: systems open as you go ----
for (const len of ['half', 'two', 'five', 'life']) {
  await t.check(`i31-b02/b22/b33: a ${len} life starts with four focuses and opens every system by its deadline`, async () => {
    await life({ jobId: 'farmhand', money: 2000 }, 'home', len, 'go');
    const r = await setup(() => {
      const start = { open: [...document.querySelectorAll('#main .fbtn[data-f]')].map(b => b.dataset.f), soon: document.querySelectorAll('#main .fbtn[data-soon]').length,
        out: !!document.querySelector('#outbtn'), plan: !!document.querySelector('#planbtn'), trip: !!document.querySelector('#tripchip'), score: !!document.querySelector('#scorenow') };
      const last = Math.max(...UNLOCKS.map(u => unlockBy(u) ?? 0));
      const dl = UNLOCKS.filter(u => unlockBy(u) != null).map(u => u.id);
      let maxQ = 0, w1 = null;
      for (let i = 0; i <= last && !S.over; i++) { weekTick(false); maxQ = Math.max(maxQ, S.unlockQ.length);
        if (i === 0) { tab = 'home'; render(); w1 = document.querySelectorAll('#main .fbtn[data-f]').length; } }
      tab = 'home'; render();
      return { start, w1, dl, opened: S.opened, cards: document.querySelectorAll('#unlockcard').length, maxQ, turn: S.turn };
    });
    assert(r.start.open.join() === 'work,rest,community,outdoors' && r.start.soon === 2, JSON.stringify(r.start));
    assert(!r.start.out && !r.start.plan && !r.start.trip && !r.start.score, `week 1 is just focuses and End Week: ${JSON.stringify(r.start)}`);
    assert(r.w1 === 5, `study opens after the first week (${r.w1} focuses)`);
    for (const id of r.dl) assert(r.opened[id], `${id} should be open by week ${r.turn} of a ${len} life`);
    assert(r.cards === 1, `one unlock card at a time (${r.cards}), queue ${r.maxQ}`);
  });
}

await t.check('i31-b15/b16/b17: the unlock card shows one at a time, Got it moves on, Show me runs a tour that changes nothing', async () => {
  await life({ jobId: 'farmhand', money: 2000 }, 'life', 'two', 'go');
  await setup(() => { for (let i = 0; i < 4; i++) weekTick(false); tab = 'life'; render(); });
  const q0 = (await S()).unlockQ;
  assert(q0.length >= 2, `several systems waiting: ${q0}`);
  assert(await page.$('#app > nav button[data-tab="home"] .ndot'), 'the Home tab gets a New dot');
  assert(/new/.test(await page.getAttribute('#app > nav button[data-tab="home"]', 'aria-label')), 'screen readers hear new');
  await page.click('#app > nav button[data-tab="home"]');
  assert((await page.$$('#unlockcard')).length === 1, 'one card');
  const first = await page.getAttribute('#unlockcard', 'data-unlock');
  assert(first === q0[0], `${first} is first in line`);
  await page.click('#unok');
  const second = await page.getAttribute('#unlockcard', 'data-unlock');
  assert(second === q0[1], `${second} comes next`);
  const before = await S();
  await page.click('#unshow');
  await page.waitForSelector('#coach:not(.hidden) .cbubble');
  assert(/Show me how/.test(await page.textContent('#coach .cstep')), 'a short tour');
  for (let i = 0; i < 6; i++) {
    await page.waitForFunction(() => !TUT || document.querySelector('#coach:not(.hidden) #cnext'));
    if (!(await page.evaluate(() => !!TUT))) break;
    await page.click('#coach #cnext');
  }
  await page.waitForFunction(() => !TUT);
  const after = await S();
  assert(after.turn === before.turn && after.money === before.money, 'the tour plays no week and spends nothing');
  assert(!after.unlockQ.includes(second), 'Show me also clears the card');
});

await t.check('i31-b19: a Soon spot offers "I know this one", which opens it quietly and works the same', async () => {
  await life({ jobId: 'farmhand', money: 2000 }, 'home', 'two', 'go');
  await page.click('#main .fbtn[data-soon="hustle"]');
  await page.click(`${open} #early`);
  const s = await S();
  assert(s.opened.hustle && s.opened.hustle.how === 'early' && !s.unlockQ.includes('hustle'), JSON.stringify(s.opened.hustle));
  assert(await page.$('#main .fbtn[data-f="hustle"]'), 'the Side hustle focus is in the grid');
  assert(!(await page.$('#unlockcard[data-unlock="hustle"]')), 'no card for an early open');
});

await t.check('i31-b20: "Everything open" opens every system at the start with no cards or tags', async () => {
  await setup(() => { localStorage.clear(); setPref('tips', ['focus', 'strip', 'tabs']); });
  await page.evaluate(() => renderTitle());
  await page.click('#moreopts');
  await page.click('[data-um="all"]');
  await page.click('#start');
  await setup(() => { closeSheet(); S.jobId = 'farmhand'; S.noEvents = true; for (let i = 0; i < 4; i++) weekTick(false); tab = 'home'; render(); });
  const s = await S();
  assert(s.unlockMode === 'all' && Object.keys(s.opened).length === await page.evaluate(() => UNLOCKS.length), JSON.stringify(s.opened));
  assert(!(await page.$('#unlockcard')) && !(await page.$('.newtag')) && !(await page.$('.ndot')), 'no cards, tags or dots');
  assert((await page.$$('#main .fbtn[data-f]')).length === 6, 'all six focuses');
  await setup(() => setPref('unlockMode', 'go'));
});

await t.check('i31: an older save keeps every system it already uses open', async () => {
  const r = await setup(() => {
    localStorage.clear(); newGame('Old', 'five', 0);
    const g = JSON.parse(JSON.stringify(S)); delete g.opened; delete g.unlockQ; delete g.unlockMode;
    Object.assign(g, { turn: 1, hustleWeeks: 3, plan: ['work', 'rest'], biz: { type: 'truck', earned: 0 }, skills: { cook: 2 } });
    return migrate(g).opened;
  });
  for (const id of ['hustle', 'plan', 'biz', 'skills', 'study', 'out', 'goals']) assert(r[id], `${id} stays open: ${Object.keys(r)}`);
  assert(!r.score && !r.trip, `nothing unused and not due yet opens: ${Object.keys(r)}`);
});

await t.check('no errors in the console the whole time', async () => { assert(!errors.length, errors.join('; ')); });

await browser.close();
srv.close();
if (t.failed) { console.log(`${t.failed} flow check(s) failed`); process.exit(1); }
console.log('All flow checks passed');
