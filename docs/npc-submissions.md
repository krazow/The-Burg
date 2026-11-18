# Be in The Burg: player-submitted NPCs

_Analysis and plan, November 18, 2026. Tracked in the to-do list (TODO.md) and GitHub issues #39–#44._

A player fills in a questionnaire inside the game describing themselves as a Waitsburg character: who they are, where
they hang out, what they're like, and how they react to the player. The answers go to the Formspree form at
`https://formspree.io/f/xyewwazg`. After review, approved answers become a non-player character (NPC) that every
player can meet in a later release.

---

## 1. What the game has today

- **No people yet.** The game has no characters. Events mention unnamed people instead: "a buddy who knows engines"
  (Truck trouble), "a friend" (A tip from a friend), "a coworker" (Gas prices spike), "the family next door"
  (Neighbor's moving day), "friends" (Wine country weekend) and "your boss" (A raise, Layoffs). Those are the natural
  first places for NPCs to show up.
- **Places to hang out already exist.** The town map has Main Street, the Weller Public Library, the Touchet River,
  the post office bulletin board, the Fairgrounds, Waitsburg schools, the grain elevator, the wheat fields, Home and
  the highway. The region map has Dayton, Walla Walla, Kennewick, Richland, Pasco and Bluewood. Events already pin to
  these places (#8), so an NPC can be pinned the same way.
- **The game is a static web app.** There's no server of its own. It can send answers to Formspree, but it can't read
  submissions back or show other players' characters live. Approved NPCs have to be built into the game's data and
  shipped in a release.
- **Nothing blocks sending.** The page has no content-security policy that would block a request to formspree.io.
  The offline cache (`sw.js`) only handles GET requests, so a POST to Formspree goes straight to the network.

## 2. Formspree: what it does and doesn't do

- **Sending from the game works.** The game can post the answers as JSON across sites, with the header
  `Accept: application/json`, and Formspree replies with JSON instead of a web page. Nothing needs installing.
- **Rate limit.** Each form takes at most 20 posts a minute on every plan. Over that, the game gets a `429` error,
  so the Send button must stay disabled while a send is in progress.
- **Free plan limits.** The free plan allows **50 submissions a month**, keeps only **30 days of history**, and
  includes email notifications. Reading submissions by API (and autoresponses) needs a paid plan. So on the free plan:
  - Approved answers are moved out at least monthly, by a CSV export from the dashboard or from the notification
    emails.
  - Over 50 in a month, extra submissions go to an "over limit" folder.
- **Spam.** Formspree supports a hidden honeypot field (`_gotcha`) and its own spam filtering. Spam still counts
  toward the 50 a month.
- **No photos.** File uploads aren't on the free plan, so the questionnaire uses an emoji avatar instead.

## 3. How it would work, end to end

1. **Player:** a new 🙋 **Be in the game** item in the start page and in Menu opens the questionnaire. It has 10
   short pages, with progress dots and Back/Next. Answers are kept on the device as a draft, so leaving and coming back
   loses nothing.
2. **Preview:** before sending, the player sees their character card the way other players would see it: name,
   avatar, place, greeting and a sample event.
3. **Send:** the game posts JSON to `https://formspree.io/f/xyewwazg` with a submission ID, the game version and the
   form version.
   - **Offline:** the submission is queued and sent the next time the game is open and online.
   - **After a successful send:** the game says "Thanks! Your character will be reviewed and could appear in a
     future update." It also shows the submission ID, which the player needs for changes or removal.
4. **Review (you):** you export submissions from Formspree, run `tools/import-npcs.py`, and check its report. The
   tool:
   - checks lengths, banned words, real-business names and missing consent;
   - flags anything identifying, like full names, addresses, phone numbers or emails in free text;
   - writes `data/npcs.json` and a review report.

   You approve, edit or reject each character in a pull request.
5. **Ship:** approved NPCs go out in the next `/release now`. A "New neighbors" note in What's new lists who
   arrived.
6. **Changes and removal:** a person can ask to change or remove their character using their submission ID,
   through the same form or by email. Removal ships in the next release, and the import tool keeps a list of removed
   IDs so they never come back.

## 4. The questionnaire

Fields are named the way they're sent to Formspree. Every free-text answer has a length limit so it fits on a phone
screen. **R** = required. Choices come from the game's real places, jobs and events, so each answer maps directly onto
something the game can do.

### Page 1: Before you start (consent)
| Field | Type | Notes |
|---|---|---|
| `consent_age` **R** | checkbox | "I am 18 or older." Under-18 players get a friendly "Thanks, this is for adults" and no form. |
| `consent_appear` **R** | checkbox | "The Burg may use my answers to make a character that anyone playing the game can meet." |
| `consent_edit` **R** | checkbox | "My answers may be shortened or edited to fit the game, and might not be used." |
| `consent_real` **R** | checkbox | "I'm describing myself (or a made-up character), not someone else without their OK." |
| `email` | email, optional | Only for questions about the submission. Never shown in the game. |

### Page 2: Your character
| Field | Type | Notes |
|---|---|---|
| `display_name` **R** | text, ≤ 20 | The name shown in the game. A first name or nickname only, no last names. |
| `credit` | choice | Show "Submitted by a player" / show my name in the credits / no credit. |
| `avatar` **R** | emoji picker | About 40 people and animal emoji. |
| `pronouns` | choice + other | she/her, he/him, they/them, other (≤ 12). Used in event text. |
| `age_band` **R** | choice | 18–25, 26–40, 41–60, 61+ (in the game, not necessarily real). Gates events, for example a retired NPC isn't anyone's boss. |
| `real_or_made_up` **R** | choice | "This is me" / "A character I made up". Shown to reviewers only. |

### Page 3: Your place in town
| Field | Type | Notes |
|---|---|---|
| `home_town` **R** | choice | Waitsburg, Dayton, Walla Walla, Kennewick, Richland, Pasco. |
| `years_here` | choice | New in town / a few years / 10+ years / born and raised. Sets how much local knowledge they share. |
| `work` **R** | choice | Any of the game's 25 jobs, plus Retired, Student, Stay-at-home parent, Self-employed (≤ 30). An NPC with a game job can be the player's coworker or boss. |
| `hangouts` **R** | pick 1–3 | Main Street, Weller Public Library, Touchet River, Post office bulletin board, Fairgrounds, Waitsburg schools, Grain elevator, Wheat fields, Bluewood, Dayton Depot, Walla Walla downtown. Where their pin appears on the maps. |
| `best_time` | choice | Mornings / afternoons / evenings / weekends. |
| `seasons` | pick 0–4 | The seasons they're most likely to show up. |
| `favorite_events` | pick 0–5 | The game's local events: Celebration Days, Harvest, Touchet high water, Wine country weekend, Powder day at Bluewood, Walla Walla Sweets, Dayton Depot festival, Fair & Frontier Days, Hunting season, Friday night game. They appear in these events. |

### Page 4: Your personality (sliders, 1–5)
| Field | Low end ↔ high end |
|---|---|
| `p_social` **R** | Keeps to myself ↔ Talks to everyone |
| `p_helpful` **R** | Minds my own business ↔ First to show up when someone needs help |
| `p_money` **R** | Spends freely ↔ Pinches every penny |
| `p_risk` **R** | Plays it safe ↔ Tries anything once |
| `p_humor` **R** | Serious ↔ Always joking |
| `p_outdoors` **R** | Homebody ↔ Always outside |
| `p_competitive` **R** | Easygoing ↔ Has to win |
| `p_gossip` **R** | Keeps secrets ↔ Knows everyone's business |
| `three_words` | 3 × text, ≤ 15 each | "Describe yourself in three words." Shown on their card. |

These eight traits decide most of the NPC's behavior without anyone writing code per NPC. For example:
- Helpful: offers favors.
- Thrifty: gives money tips and disapproves of big purchases.
- Risky: invites the player to bets and adventures.
- Gossip: passes on job tips and news about town.

### Page 5: How you treat newcomers
| Field | Type | Notes |
|---|---|---|
| `first_meeting` **R** | choice | Warm welcome / polite nod / sizes you up / ignores you until you earn it. Sets the starting friendship. |
| `role_wanted` **R** | pick 1–3 | Friend, mentor, neighbor, coworker, rival (friendly), local character. Romance isn't offered (see section 6). |
| `offers` | pick 0–4 | What you'd do for the player: job lead, ride to work, help fixing the truck, small loan, advice on money, invite to an outing, introduce them around, teach a skill. Each maps to a game effect (section 5). |
| `asks` | pick 0–3 | What you'd ask the player for: help moving, a ride, volunteer at an event, cover a shift, borrow money, come to my game/show. |

### Page 6: How you react (your NPC's reactions)
For each situation the player picks a reaction, and can optionally add their own line.

| Situation | `react_*` choices | Optional line |
|---|---|---|
| The player helps you | grateful / repays the favor later / brags about them to everyone | `line_thanks` ≤ 100 |
| The player turns you down | shrugs it off / a little hurt / holds a grudge for a while | `line_declined` ≤ 100 |
| The player gets a new job or a raise | celebrates / jealous / "about time" | `line_good_news` ≤ 100 |
| The player is struggling (low money or health) | offers help / gives advice / stays out of it | `line_hard_times` ≤ 100 |
| The player takes a big risk (bet, big purchase) | cheers them on / warns them / says "told you so" | `line_risk` ≤ 100 |
| The player hasn't seen you in a while | checks in / forgets them / "Where've you been?" | `line_missed` ≤ 100 |

### Page 7: Your words
| Field | Type | Notes |
|---|---|---|
| `line_hello` **R** | text, ≤ 80 | How you say hi. |
| `line_bye` | text, ≤ 80 | How you say goodbye. |
| `catchphrase` | text, ≤ 60 | Something you always say. |
| `local_tip` | text, ≤ 140 | A real tip about the area: "Best milkshake in Dayton is…", "Fish the Touchet in May". Becomes a tip in the game. No business names without their OK. |
| `story` | text, ≤ 280 | A short local story about you. Used for flavor on their card, not as an event. |

### Page 8: Your own event (optional)
A small event the player might run into with you. The effects are picked from fixed sizes, so a submission can't
break the game's balance.

| Field | Type | Notes |
|---|---|---|
| `ev_title` | text, ≤ 30 | For example "Dale needs a hand". |
| `ev_place` | choice | One of their hangouts. |
| `ev_season` | choice | Any time / spring / summer / fall / winter. |
| `ev_text` | text, ≤ 160 | What happens. |
| `ev_choice1_label`, `ev_choice2_label` | text, ≤ 40 each | Two choices. A third, "Not this time", is always added. |
| `ev_choice1_effect`, `ev_choice2_effect` | choice | From a fixed menu: small/medium money gain or cost, happiness up, health up or down, community up, friendship up, a gamble (some chance of good or bad). Maximum ±$400 at 2027 prices, ±8 in any stat. |
| `ev_choice1_result`, `ev_choice2_result` | text, ≤ 100 each | What happens after. |

### Page 9: Boundaries
| Field | Type | Notes |
|---|---|---|
| `never` | pick + text ≤ 100 | Things your character should never do or be in: drinking events, betting, hunting, arguments, money loans, being a boss… |
| `topics_avoid` | text, ≤ 100 | Topics you don't want connected to your character. |
| `ok_to_combine` | checkbox | "OK to combine my answers with other submissions if needed." |

### Page 10: Preview and send
The character card, a sample event and the reactions, shown the way other players will see them, with an Edit link
for each page.
- **Send** posts the answers. Hidden fields go along too: `_subject` ("New NPC: {display_name}"), `_gotcha`
  (honeypot), `submission_id` (a random ID), `game_version` and `form_version` (1).
- After sending, the screen confirms it was sent and shows the submission ID, with "Keep this ID to change or remove
  your character."

## 5. How answers become game behavior

| Questionnaire answer | Game mechanic |
|---|---|
| `hangouts`, `best_time` | The NPC's pin appears at those places on the town or region map. Tapping a place with an NPC can start a meeting. |
| Spending a week at their hangout (map focus) | A higher chance of meeting that NPC that week. |
| `first_meeting` | Starting friendship (0–100) for each player. |
| Personality sliders | Weights for which offers, asks and reactions they make, and how fast friendship changes. |
| `offers` | **Job lead** reuses "A tip from a friend". **Ride** and **help fixing the truck** reuse the Gas prices and Truck trouble options. **Small loan** pays back over 12 weeks. **Money advice** gives a small 401(k) or savings tip. **Outing** is happiness for a small cost. **Introductions** give community. **Teach a skill** is a small boost toward school. Every effect is capped and scales with friendship. |
| `asks` | Become NPC-specific versions of Neighbor's moving day, volunteering and covering a shift: community and friendship for time or health. |
| `react_*` and lines | NPC reactions after player milestones (new job, raise, debt, a big purchase, a long absence), shown as a short note in the week's results with their avatar. |
| `favorite_events` | They're named in those events, for example "Dale is already at the parade". |
| Their event | Added to the event list with a place pin, a season and a 40-week cooldown, at a low weight so the mix of events doesn't change much. |
| `work` matching a game job | They can be the player's coworker, and the boss in A raise or Layoffs if their job fits. |
| Friendship | Shown on a new 👥 **People** screen (who you've met, where to find them, friendship hearts). High friendship counts toward community and unlocks better offers. |

Balance rules: no NPC changes the Life Score by more than about 2 points over a full game, by design. The bot
simulation must still land careless play at 60 or below, idle at 50 or below, and good play at 70 or above, with NPCs
present.

## 6. Decisions and risks

These need your OK before building. The defaults are in **bold**.

1. **Minimum age: 18+ (default).** Waitsburg is a small town, and minors' details shouldn't be collected for a
   public game. Under-18 players see a thank-you screen and no form.
2. **No romance with player NPCs (default).** "Someone catches your eye" stays anonymous. A real person showing up
   as the player's date would be uncomfortable for both.
3. **First names or nicknames only; no photos, addresses or business names without permission (default).** In a
   town of about 1,200 people, a full name plus a job is enough to identify someone.
4. **Every submission is reviewed by a person before it ships (default).** Nothing from the form reaches the game
   automatically.
5. **Removal on request, in the next release (default).** This needs a privacy note in the game (Help → "Be in the
   game") saying what's collected, where it goes (Formspree, then the public game data), how long Formspree keeps it,
   and how to remove a character.
6. **Formspree plan.** The free plan's 50 a month and 30-day history are probably enough to start. Upgrade if
   submissions grow.
7. **Krazow LLC.** If the LLC is formed, the privacy note and credits should name it.

Risks:
- **Moderation load:** free text needs reading.
- **Abuse:** submitting a character as someone else. The `consent_real` box and review reduce this but can't stop it.
- **The 50-a-month cap:** a burst of submissions could spill into the over-limit folder.
- **Balance drift:** many NPCs could add up to too much free help. Caps and the simulation guard against this.

## 7. Work breakdown

| Issue | Work | Size |
|---|---|---|
| #39 | **Policy and Formspree setup:** decide section 6, write the in-game privacy note and consent text, turn on the honeypot and spam filtering, notification emails, and a monthly export routine. | S (mostly your decisions) |
| #40 | **In-game questionnaire:** Be in the game entry points, 10-page form sheet with sliders, pickers and limits, draft auto-save, preview card, send to Formspree with offline queue and 429 handling, success and error states, accessible and 44 px targets. | L |
| #41 | **Import and review tool:** `tools/import-npcs.py` reads a Formspree CSV or JSON export, validates against a schema, flags identifying and unsafe text, writes `data/npcs.json` and a review report; a removal list; README section. | M |
| #42 | **NPC engine:** NPC data model, per-player friendship in saves (slot migration and backups), map pins at hangouts, meetings, a People screen, the Help guide section. | L |
| #43 | **NPC behavior and events:** offers, asks and reactions mapped to capped effects; personal events from submissions; naming NPCs in the existing anonymous events; boss/coworker matching. | L |
| #44 | **NPC QA:** rules tests (caps, consent gating, schema), flows (questionnaire to sent, offline queue, mocked Formspree), screens (form at 7 sizes, keyboard and screen reader), simulation with NPCs, and 3–5 sample NPCs for testing. | M |

Suggested order: #39 first (decisions), then #40 and #41 so submissions can start coming in. After that, #42, #43 and
#44 together, so the first players' characters arrive in the release that adds people to the game.
