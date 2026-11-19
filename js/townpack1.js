// The Burg: townpack1.js (Waitsburg event pack A, part 1: W1–W15; loads after outabout.js and shares the one global scope)
/* ============================================================
   🏡 EVENT PACK A: WAITSBURG EVENTS, PART 1 (review doc 2026-11-18, section A, W1–W15)
   Town events, paced with the rest of the town category (G5). Every amount is in 2027 dollars and goes through
   cost(); labels show today's price with fmtc(). Yearly events wait 40 weeks, the rest 8 (turn.js).
   ============================================================ */
// small state these events keep (new lives get it in newGame, older saves in migrate, through EVENT_STATE)
function townStateA(){ return { cat:false, generator:false }; }
function ownHome(){ return !!HOMES[S.home].own; }
const CAT_MONTHLY = 20;            // W14: a barn cat costs about $20 a month and brings half a dog's cheer
// W1, W8, W13: helping out counts as a week toward this season's town goal (#77)
function townGoalHelp(){
  const g = seasonGoal(); if (!g || S.practice) return '';
  const id = seasonId(g);
  if (!S.sgoal || S.sgoal.id !== id) S.sgoal = { id, prog:0, done:false };
  if (S.sgoal.done) return '';
  S.sgoal.prog++;
  if (S.sgoal.prog >= g.need) {
    S.sgoal.done = true; adj(g.fx); S.seasonWins = (S.seasonWins || 0) + 1;
    log(`Helped the town: ${g.name.toLowerCase()}.`, 'mile');
    return ` That finished the town goal: ${g.name}!`;
  }
  return ` It counts toward the town goal (${S.sgoal.prog}/${g.need}).`;
}

const TOWN_EVENTS_A1 = [
  // W1
  { ic:'🧹', title:'Preston Park cleanup day', yr:1, w:2, when:m => inM(m,3),
    text:'Saturday is cleanup day at Preston Park by the river: winter leaves, branches and a lot of litter.',
    choices:() => [
      {label:'Help rake and haul', go:() => { adj({community:3, health:-1}); return 'Blisters, a free hot dog and a park that looks like spring.' + townGoalHelp(); }},
      {label:`Donate rakes (-${fmtc(25)})`, go:() => { adj({money:-cr(25), community:1}); return 'Your rakes went to work without you.'; }},
      {label:'Skip it', go:() => { adj({community:-1}); return 'A neighbor asked where you were.'; }}
    ]},
  // W2 (stand-in for the town's historic house museum)
  { ic:'🏛️', title:'Museum open house', yr:1, w:2, when:m => inM(m,5),
    text:'The historical society opens its old house museum on Main Street for the summer: 1880s furniture, photos and a creaky staircase.',
    choices:() => [
      {label:'Volunteer as a guide', go:() => { adj({community:3, happy:1}); return 'You learned the town\'s history well enough to tell it with a straight face.'; }},
      {label:`Take the tour (-${fmtc(10)})`, go:() => { adj({money:-cr(10), happy:2}); return 'The old photos of Main Street were the best part.'; }},
      {label:'Skip it', go:() => 'Maybe next summer.'}
    ]},
  // W3
  { ic:'🎆', title:'Fourth of July parade', yr:1, w:3, when:m => inM(m,6),
    text:'Tractors, fire trucks, the kids on bikes with streamers: the parade rolls down Main Street at ten.',
    choices:() => [
      {label:'Ride on a float', if:() => S.community >= 40, go:() => { adj({community:3, happy:3}); return 'You threw candy from a hay wagon and waved like a celebrity.'; }},
      {label:'Watch from Main Street', go:() => { adj({happy:2}); return 'A lawn chair, a flag and a sno-cone.'; }}
    ]},
  // W4
  { ic:'🎣', title:'Trout opener on Coppei Creek', yr:1, w:2, when:m => inM(m,3),
    text:'Fishing season opens Saturday. The creek is cold and clear, and the trout don\'t know what\'s coming.',
    choices:() => [
      {label:`Fish opening morning (-${fmtc(30)} license)`, go:() => { adj({money:-cr(30), health:2, happy:3}); return 'Two trout, a cold thermos of coffee and the sun coming up over the hills.'; }},
      {label:'Skip it', go:() => 'You slept in.'}
    ]},
  // W5
  { ic:'📚', title:'Library book sale', yr:1, w:2, when:m => inM(m,9),
    text:'The library is clearing its shelves: a dollar a book, five for a box.',
    choices:() => [
      {label:studying() ? `Fill a box (-${fmtc(15)}, a week of class work)` : `Fill a box (-${fmtc(15)})`, go:() => { adj({money:-cr(15), happy:2}); if (studying()) { classWeeks(1); return 'A box of books, two of them for your class. You\'re a week ahead.'; } return 'A box of paperbacks for the winter.'; }},
      {label:'Volunteer sorting', go:() => { adj({community:2}); return 'You sorted mysteries from westerns all afternoon.'; }}
    ]},
  // W6
  { ic:'🥧', title:'FFA bake sale', w:1,
    text:'The high school FFA kids have a table out front of the post office.',
    choices:() => [
      {label:`Bake something (-${fmtc(8)})`, go:() => { adj({money:-cr(8), community:2}); practice('cook', 1); return 'Your cookies sold out before noon.'; }},
      {label:`Buy a pie (-${fmtc(12)})`, go:() => { adj({money:-cr(12), happy:1}); return 'Marionberry. Worth it.'; }},
      {label:'Walk past', go:() => 'You smiled and kept walking.'}
    ]},
  // W7
  { ic:'🐔', title:'Neighbor\'s chickens loose in your yard', w:1, when:m => inM(m,2,3,4,5,6,7),
    text:'Six hens are scratching up your yard and one is on the porch rail, staring at you.',
    choices:() => [
      {label:'Help catch them', go:() => { adj({community:2, happy:1}); return 'Twenty minutes of flapping. The neighbor brought over a dozen eggs.'; }},
      {label:'Grumble over the fence', go:() => { adj({community:-2}); return 'The neighbor fixed the fence and stopped waving.'; }}
    ]},
  // W8
  { ic:'🧊', title:'Ice storm knocks out power', yr:1, w:2, when:m => inM(m,11,0,1),
    text:() => `Freezing rain coated every branch and power line in town overnight. The power is out${S.generator ? ', but your generator kicked on' : ' and the house is getting cold'}.`,
    choices:() => [
      {label:'Check on older neighbors', go:() => { adj({community:3, health:-1}); return 'Blankets, a thermos of soup and a few doorsteps. Everyone was okay.' + townGoalHelp(); }},
      {label:S.generator ? 'Run the generator and wait' : 'Wait it out', go:() => { if (S.generator) return 'The generator hummed all night. Warm house, cold coffee maker (it\'s not on the generator).'; adj({happy:-2}); return 'Two cold days under every blanket you own.'; }},
      {label:`Buy a generator (-${fmtc(450)})`, if:() => !S.generator, go:() => { adj({money:-cr(450)}); S.generator = true; return 'It\'s loud, but the lights are on. Power outages won\'t bother you again.'; }}
    ]},
  // W9
  { ic:'🚰', title:'Frozen pipes', yr:1, w:2, when:m => inM(m,11,0,1),
    text:() => ownHome() ? 'The kitchen faucet coughs and stops. A pipe under the house froze solid last night.' : 'The kitchen faucet coughs and stops. A pipe froze last night.',
    choices:() => ownHome() ? [
      {label:`Call a plumber (-${fmtc(350)})`, go:() => { adj({money:-cr(350)}); return 'The plumber thawed it and wrapped the pipe. Lesson learned.'; }},
      {label:`Fix it yourself (-${fmtc(60)})`, if:() => skillLv('handy') >= 1, go:() => { adj({money:-cr(60), health:-1}); practice('handy', 2); return 'A hair dryer, some heat tape and a cold hour in the crawl space. It runs.'; }}
    ] : [
      {label:'Call the landlord', go:() => { adj({happy:-1}); return 'The landlord fixed it. You did dishes in the bathtub for a day.'; }}
    ]},
  // W10
  { ic:'🏷️', title:'Citywide yard sale', yr:1, w:2, when:m => inM(m,5),
    text:'Every driveway in town has a table out this Saturday.',
    choices:() => [
      {label:'Sell your stuff', go:() => { const v = cr(ri(80, 200)); adj({money:v}); return `The garage is emptier and you made ${fmt(v)}.`; }},
      {label:`Bargain hunt (-${fmtc(40)})`, go:() => { adj({money:-cr(40), happy:3}); return 'A cast-iron pan, a lamp and a box of old records.'; }},
      {label:'Both', go:() => { const v = cr(ri(40, 160)); adj({money:v, happy:2}); return `You sold a lot and bought a little: ${fmt(v)} ahead.`; }}
    ]},
  // W11
  { ic:'🧵', title:'School fundraiser auction', yr:1, w:2, when:m => inM(m,2),
    text:'The school\'s spring auction is in the gym: baskets, firewood, a hand-sewn quilt.',
    choices:() => [
      {label:`Donate (-${fmtc(50)})`, go:() => { adj({money:-cr(50), community:3}); return 'Your name is on the thank-you poster by the gym door.'; }},
      {label:`Bid on the quilt (-${fmtc(120)})`, go:() => { adj({money:-cr(120), happy:3, community:1}); return 'You won the quilt. It\'s on your bed tonight.'; }},
      {label:'Skip it', go:() => 'You\'ll go next year.'}
    ]},
  // W12
  { ic:'🥞', title:'Fire district pancake breakfast', yr:1, w:2, when:m => inM(m,4),
    text:'The volunteer firefighters are flipping pancakes at the station to raise money for new gear.',
    choices:() => [
      {label:`Eat (-${fmtc(10)})`, go:() => { adj({money:-cr(10), happy:2, community:2}); return 'Three pancakes, sausage, and half the town at the long tables.'; }},
      {label:'Flip pancakes', if:() => S.community >= 30, go:() => { adj({community:4, health:-1}); return 'Two hundred pancakes later, the crew wants you back next year.'; }}
    ]},
  // W13
  { ic:'🔥', title:'Smoke from a wheat-field fire', yr:1, w:2, when:m => inM(m,7),
    text:'A combine spark set a wheat field burning north of town. Smoke is rolling over the rooftops.',
    choices:() => [
      {label:'Haul water for the crews', go:() => { adj({community:4, health:-2}); return 'You ran water jugs to the fire line until it was out.' + townGoalHelp(); }},
      {label:'Stay in', go:() => { adj({health:-1}); return 'Windows shut, towels under the doors. You still coughed for a day.'; }},
      {label:`Leave town for the weekend (-${fmtc(80)})`, go:() => { adj({money:-cr(80)}); return 'A motel in the mountains and clean air. The smoke cleared by Monday.'; }}
    ]},
  // W14
  { ic:'🐭', title:'Mice in the walls', yr:1, w:2, when:m => inM(m,9),
    text:'The nights are cold, and something is scratching in the walls.',
    choices:() => [
      {label:`Set traps (-${fmtc(20)})`, go:() => { adj({money:-cr(20), happy:-1}); return 'Snap. Snap. Snap. It worked, and you didn\'t enjoy it.'; }},
      {label:`Call an exterminator (-${fmtc(180)})`, go:() => { adj({money:-cr(180)}); return 'The exterminator sealed the gaps. Quiet walls again.'; }},
      {label:`Adopt a barn cat (about ${fmtc(CAT_MONTHLY)}/mo)`, if:() => !S.cat, go:() => { S.cat = true; adj({happy:4}); return 'A gray barn cat from a farm up the road. The mice left. The cat stayed.'; }}
    ]},
  // W15
  { ic:'👋', title:'An old friend moves back', once:1, w:1,
    text:'Someone you grew up with is moving back to town, into a house two streets over.',
    choices:() => [
      {label:`Take them to dinner (-${fmtc(30)})`, go:() => { adj({money:-cr(30), happy:4}); return 'You talked until they stacked the chairs.'; }},
      {label:'Help them move', go:() => { adj({community:2, health:-1}); return 'A couch, a piano and too many boxes of books.'; }},
      {label:'Wave from the porch', go:() => 'They waved back.'}
    ]},
];
EVENTS.push(...TOWN_EVENTS_A1);
// where each event happens on the Waitsburg map
Object.assign(EVENT_PLACE, {
  'Preston Park cleanup day':['T','river'], 'Museum open house':['T','mainst'], 'Fourth of July parade':['T','mainst'],
  'Trout opener on Coppei Creek':['T','river'], 'Library book sale':['T','library'], 'FFA bake sale':['T','board'],
  'Neighbor\'s chickens loose in your yard':['T','home'], 'Ice storm knocks out power':['T','home'], 'Frozen pipes':['T','home'],
  'Citywide yard sale':['T','home'], 'School fundraiser auction':['T','school'], 'Fire district pancake breakfast':['T','mainst'],
  'Smoke from a wheat-field fire':['T','fields'], 'Mice in the walls':['T','home'], 'An old friend moves back':['T','mainst']
});
