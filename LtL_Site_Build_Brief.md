# Last to Leave — Website Build Brief (v1, July 22 launch)

**Purpose:** Hand-off spec for the Claude Code build. Everything here is decided. Build against this, don't re-litigate.

**Stack:** Static site, plain HTML/CSS/vanilla JS. No framework. Hosted on GitHub Pages. One page (long-scroll homepage). The Assassins page is Phase 2 (Aug 5) — not in this build.

**The page's job:** Two beats. (1) Last to Leave is a new LA theater company with a strong POV. (2) A debut production is announced Aug 5 — follow / sign up to catch it. Every section serves one of these. The whole page is a *held breath* — it withholds the show on purpose. Cold and assured up top, warmer and more handmade descending.

---

## Global / system

**Palette (company brand — this page is all company, no show):**
- Black `#000000` (dominant background / material)
- White `#FFFFFF`
- Hot pink `#F11AC5` — strategic only. Used at full frame ONCE (manifesto) and as the tape treatment behind "POTENT THEATER" (hero + footer, deliberate bookend). Never a general accent.
- Dark grey `#3C3C3C` — Play Reading Club background (gives the "will turn out the lights" beat somewhere to land; steps the gradient toward the black footer).
- Light grey `#CCCCCC` — hairlines/rules only.

**Type (all free/self-hostable for web EXCEPT as noted):**
- Wordmark: **Knewave** — logo only, supplied as PNG, never live type.
- Titles/headings: **Glacial Indifference** (self-host).
- Subheads/body: **Inclusive Sans** (Google Fonts).
- Monospace asides ("this is a flag…", "will turn out the lights", "…or you find out late"): confirm which mono is in the Canva file and self-host/Google-host it. These asides are a recurring voice element — same treatment every time.
- Handwritten callout ("so, obviously"): **Madelyn Rough** — Canva-licensed, likely CANNOT be a webfont. TEST FIRST. If it doesn't embed cleanly + legally, ship "so, obviously" as a transparent PNG exported from Canva. This is the only instance on the page, so it's a contained test.

**Motion rules (from brand doc — keep minimal for v1):**
- Text enters by fade or by scroll. Never twirls/bounces/zooms.
- No audio anywhere on the page (browsers block autoplay sound; silence is on-brand).
- Bulb intro: on load, bulb appears alone in the dark, holds ~1–2 beats, then wordmark + "Potent theater" tape + "Los Angeles" fade up. Must NOT block scrolling — a visitor can scroll immediately. Consider running the full intro once per session (not every load) so repeat visitors don't re-watch it.
- Bulb persists top-corner as a small mark through the scroll (connective tissue).

**STRUCTURAL FLAGS (one line each — don't forget, they're cheap now, expensive later):**
1. Build the **debut-teaser area as TWO separate blocks (4A teaser + 4B conversion)** that flow as one on July 22. On Aug 5: 4A is replaced by the Assassins feature; 4B survives and is promoted to its own standalone secondary-CTA section. See section 4 for the full split. Don't entangle either with the hero above or manifesto below.
2. **Leave room for a fixed-position pinned ticket CTA** that doesn't exist yet. Page should be structured so a `position: fixed` overlay button can be added later without reflowing anything. (Clean vertical section blocks already handle this.)

**Responsive:** Most launch-day traffic is mobile (off Instagram). Every section needs a phone layout. The hard cases are the marginal/rotated zine elements — they have no gutter to live in at ~380px, so on mobile they become inline interruptions between blocks, not margin-floats. Mobile layouts roughed in Canva; match them.

**Pre-build verification (do before/at start of build — high stakes, five minutes):**
- IG/social handle spelling exact-matches the real accounts. This is the launch-day conversion target. (Screenshots have shown "@lasttoleavetheater".)
- All four social icons (IG, FB, TikTok, YouTube) link to real, live accounts. If YouTube doesn't exist yet, drop the icon rather than link a dead one.
- The single unified handle "@lasttoleavetheater" is correct on ALL linked platforms; if any differs, that platform needs its own handle.
- Email domain (`info@lasttoleavetheater.com`) matches the site's actual domain. Decide: custom domain `lasttoleavetheater.com` on GitHub Pages, or `*.github.io`? Email should match whatever the site is.
- Life Plan bio link points to the existing Hollywood Fringe page and opens in a new tab.

---

## Sections, top to bottom

### 1 — Hero (full-viewport, black)
- Bulb intro sequence (see motion rules).
- Wordmark (Knewave PNG), slightly off-center — weight pulled left, space falling right. Subtle tilt. NOT dead-center.
- "POTENT THEATER" in pink tape treatment (tape = strips of pink behind text, hand-stuck look, from deck cover).
- "Los Angeles" plain white below.
- Tagline is "Potent theater. Los Angeles." — nothing longer.

### 2 — Flag beat (full-viewport black, transitional)
- Bulb holds position from hero as page scrolls; this beat appears tethered to it.
- Monospace, two blocks: "This is a flag" (vertical/rotated) crossing "planted in the real" (horizontal). Collision must land in whitespace — both words fully legible. (Already resolved in Canva.)
- Then bulb + text scroll up together into the manifesto.
- Mobile: rotated "This is a flag" becomes a simple inline horizontal aside; don't preserve the rotation if it cramps.

### 3 — Manifesto (full-viewport, PINK — the one full-frame detonation)
- "POTENT THEATER" huge, black on pink (echoes deck slide 3).
- Four descriptive lines (NOT imperative — this is audience-facing, defines what potent theater is):
  - AIMS FOR THE NERVOUS SYSTEM
  - DESIGNS FOR DEEP ATTENTION
  - BUILDS ENVIRONMENTS, NOT SETS
  - PUSHES BEYOND ENTERTAINMENT
- Launch video still, taped in at a tilt (video-as-photo-stuck-to-page, NOT full-bleed background). Play button overlay. Confirmed still reads "potency" without music/context. **HOLD CHECK: confirm no frame of this video reveals Assassins (title/classroom/Sondheim). If it does, it cannot be on the July 22 site.**
- Header "POTENT THEATER" must stay visually tethered to the four verb-lines (they're predicates hanging off it as subject).

### 4 — Debut teaser + conversion — BUILD AS TWO SEPARATE BLOCKS (critical for Aug 5)
On July 22 these two blocks flow together as one seamless beat (teaser → CTA), matching the screenshot. But build them as two distinct, self-contained blocks, because on Aug 5 they have DIFFERENT fates:
- **Block 4A (the teaser) gets REPLACED** by the Assassins feature (key art, title, dates, link to the Assassins page).
- **Block 4B (the conversion) SURVIVES and gets PROMOTED** to its own standalone section — the secondary CTA (after "Buy tickets to Assassins"), big and bold, essentially the same follow/sign-up material restyled as a section.

Building them fused = the Aug 5 change means cutting the block in half (surgery). Building them separate = Aug 5 is a clean drop-in.

**Block 4A — Teaser (replaceable):**
- Pink tape, two lines: **"Our debut production will be announced Aug. 5"**
- Closing muttered aside, monospace, floating alone low in the black: **"...or you find out late"** — NO illustration, no emoji, no face. The line alone.
  - NOTE: this line is a *tease* — it only works while something's withheld. It RETIRES on Aug 5 along with 4A (post-announcement, nothing is being withheld, so the sneer is meaningless). It lives in 4B's markup (`#conversion`), not 4A's — "low in the black" only reads correctly once the full 4A+4B beat is on screen, and 4A's own box ends too early for it to land there. Keep it as its own tiny, distinctly-tagged, removable element within 4B (not entangled with the follow/sign-up content) so it can be deleted on Aug 5 without touching anything that survives into the promoted section.

**Block 4B — Conversion (promotable / survives):**
- (Also contains the retiring "...or you find out late" aside from 4A — see 4A's note above. Remove it here on Aug 5; don't let it ride along into the promoted section.)
- "so, obviously" (Madelyn Rough / PNG) as handoff aside.
- "FOLLOW &" huge white.
- Social icon row (IG, FB, TikTok, YouTube) + "@lasttoleavetheater" (pink).
- "SIGN UP" huge white + "for our newsletter" + email field + SUBMIT button.
- Ghost column of repeating "FOLLOW" / "SIGN UP" in dark grey behind the type (old-web/zine texture — real artifact, keep it).
- SUBMIT button: pink or black/white with hard edges. NOT the grey default pill.
- Build this as a genuinely self-contained conversion unit so that on Aug 5 it can be lifted into its own section with minimal restyling (mainly: add whatever standalone heading it needs once it's no longer flowing out of the teaser).

### 5 — Who we are (max-width column, black)
- Heading: "**Last to Leave** is a new Los Angeles theater company founded by co-artistic directors Matthew Latkiewicz and Paul Luoma" ("Last to Leave" in pink).
- Two headshots, taped in with pink tape at tilts.
- Bios (from deck, tightened). Matthew's bio ENDS with the demoted Life Plan line: "Matthew's last LA show, *Life Plan*, premiered at the 2019 Hollywood Fringe Festival." — show title linked to the Fringe page, new tab. Factual, one line, no "read more →" brochure phrasing.
- Paul's bio as in deck.

### 6 — Play Reading Club (max-width, DARK GREY background)
- Eyebrow: "You are invited to LtL's"
- Header "PLAY READING CLUB" stacked big.
- Body (locked copy):
  - "Once a month, we get on a call with theater friends from across the country and read a play out loud, top to bottom. Low stakes way to read new plays, meet new folks."
  - "The group picks what we read. Everyone who wants a part gets one."
  - "Some of the plays we've read: *The Dumb Waiter*, *The Pillowman*, and *The Aliens*"
  - "Add your name to the newsletter. We'll send the invite."
- SIGN UP field + SUBMIT (same styling as section 4; this is the same list — one newsletter, two reasons to join).
- This is the ONE newsletter form on the page (the duplicate footer form was removed). Keep it here.
- Slightly more "normal website" than the rest — acceptable for v1. Optional later: one tilted/marginal element to pull it into the zine family. Not a blocker.

### 7 — Lights-out beat + footer (black)
- Bulb + wordmark come up together with monospace "will turn out the lights" (full line reads "Last to Leave will turn out the lights" — wordmark IS the subject). Bookends the flag beat from the top; same mono treatment.
- "will turn out the lights" scrolls up (into the dark-grey reading-club section above, which gives it somewhere to go), footer lands.
- Footer contents:
  - Wordmark (consider showing once across the lights-beat + footer pair — two wordmarks in ~300px is a lot; drop one).
  - "POTENT THEATER" pink tape + "Los Angeles" (deliberate bookend of hero — this pink repeat is authorized because the same phrase returns).
  - CONTACT: info@lasttoleavetheater.com
  - FOLLOW: social icon row.
  - "© 2026 Last to Leave Theater Company, LLC"
- NO: address, phone, sitemap, "site by" credit, second newsletter form, quick-links column. Restraint is on-brand.

---

## Explicitly NOT in this build
- No Assassins content of any kind (show is unnamed until Aug 5).
- No ticket-selling (Ticket Tailor) — that's the Aug 5 Assassins page.
- No fundraising / donate (tabled).
- No standalone Life Plan page (linking to Fringe instead).
- No nav bar / jump-links (Phase 2).
- MTI + Actors' Equity credit lines: these attach to the *show*. Since the show isn't named on this page, they're not triggered here — they belong on the Assassins page/teaser once live. **Verify against the actual MTI contract language before Aug 5** in case referencing "a debut production" at all triggers a credit requirement; likely not, but check the contract, don't guess.

---

## Asset checklist (export from Canva before build)
- [ ] Wordmark PNG(s) — white-on-transparent (and any tilt variants used)
- [ ] Bulb graphic (PNG or SVG) — for intro + persistent mark
- [ ] "so, obviously" — PNG *if* Madelyn Rough can't be webfont
- [ ] Launch video file (confirmed hold-safe) + poster still
- [ ] Two headshots
- [ ] Pink tape graphic elements (or recreate in CSS)
- [ ] Any marginal/aside elements that are set in non-web fonts → PNG
- [ ] Social icons (IG, FB, TikTok, YouTube)
