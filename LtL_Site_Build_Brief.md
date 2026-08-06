# Last to Leave — Site Architecture & Conventions (v2 Aug 5 launch)

**What this document is.** A reference for anyone — human or Claude Code — about to change lasttoleavetheater.com. It describes what exists, how it is wired, which parts are load-bearing, and what has already been tried and abandoned. It is not a build spec. Nothing here is a to-do list; where something is unfinished it says so explicitly.

**Status.** Both pages are live. The homepage launched July 22, 2026; the *Assassins* show page and the homepage's Assassins feature launched August 5, 2026.

**This file is public.** It sits in a public repository and is served at the domain root. Keep licensing terms, ticketing configuration, pricing under negotiation, and anything else contractual or private out of it. Where a constraint here originates in a contract, it is stated as a constraint, not quoted.

---

## Stack and infrastructure

Static site. Plain HTML, CSS, and vanilla JavaScript. No framework, no build step, no package manager, no preprocessor. What is in the repo is what the browser receives.

Hosted on GitHub Pages from `mlatkiewicz/lasttoleavetheater.com`, branch `main`, folder root. Custom domain `lasttoleavetheater.com` with the CNAME file committed by GitHub, HTTPS enforced, `www` redirecting.

**`main` is live.** Every push publishes immediately. There is no staging environment. Work that spans more than one commit belongs on a branch — the show page was built on `assassins-page` and merged in one move at launch.

Local working copy: `~/Sites/lasttoleavetheater.com`.

### Off limits

- **`mlatkiewicz.github.io`** is a different repository — Matthew's personal site at mattlat.com. It is never touched under any circumstances.
- **`mlatkiewicz/lasttoleave`** is the abandoned V1 repository. Inactive, pending archival. Nothing in it is current.

---

## The two pages

```
index.html              css/style.css       js/main.js        ← homepage
assassins/index.html    css/assassins.css   js/assassins.js   ← show page
```

**The two pages share no CSS and no JavaScript.** This is deliberate and should hold. `css/assassins.css` opens by saying so, and it re-declares the `@font-face` rules verbatim rather than importing them. The show page's video player is a fresh port of the homepage's, not a shared module. The duplication is the cost of being able to change either page without auditing the other; it is cheaper than the coupling.

**One consequence worth knowing.** In both stylesheets the `@font-face` `src` paths are relative — `url('../fonts/…')` resolves against the stylesheet's own location at `/css/`, not against the page. On the show page at `/assassins/` this looks wrong and is correct. Do not "fix" these to root-relative. Root-relative is only right for paths written in HTML.

Inclusive Sans and IBM Plex Mono arrive from Google Fonts via a `<link>` in each page head. Glacial Indifference is self-hosted from `/fonts/`.

---

## Homepage architecture

Single long scroll, black-dominant, company brand.

| Section | Element |
|---|---|
| Hero + flag beat (one section) | `#hero` inside `#heroWrap` |
| Manifesto | `#manifesto` |
| 4A — Assassins feature | `#assassins-feature` |
| 4B — Conversion (follow / sign up) | `#conversion` |
| Who we are | `#who-we-are` |
| Play Reading Club | `#reading-club` |
| Lights-out beat + footer | `#lights-out`, `#footer` |

The page's concept: it opens cold and assured and grows warmer and more handmade as it descends. Zine and bricolage design language, authored rather than templated.

### Load-bearing mechanisms

**The sticky manifesto reveal.** The hero and manifesto sit together inside `.hero-wrap`. `.manifesto` is `position: sticky; top: 30vh; z-index: 10`, with a negative `margin-top` written by `syncManifestoOverlap()` in `js/main.js` to exactly match the rendered height of `#flagPhrases`. The result is that the manifesto initially covers just the two flag phrases, then holds while the hero scrolls up underneath it, then releases.

Three things make this work and will break it if changed carelessly:

- The sticky `top` is a *positive* offset, not `0`. At `0` the manifesto's covering box would start at the top of the viewport with nothing above it to reveal. The 30vh band is where the reveal actually happens.
- `.hero` sets `padding-bottom: 0` because the overlap math assumes the hero's rendered bottom edge coincides with `#flagPhrases`' own bottom edge. Top padding is safe; bottom padding is not.
- `body` uses `overflow-x: clip`, not `hidden`. Per the CSS overflow spec, a non-visible `overflow-x` paired with a visible `overflow-y` forces `overflow-y` to compute as `auto`, which turns `body` into a scroll container and breaks `position: sticky` for every descendant. `clip` has no such side effect.

**JavaScript that runs at every viewport width.** `syncManifestoVideoSize()` and `syncManifestoOverlap()` have no `matchMedia` guard — they run on phones too, writing inline styles that only CSS can undo. This is why the `@media (max-width: 640px)` block sets `.manifesto { margin-top: 0 !important; opacity: 1 !important }`. Those `!important` declarations are a deliberate JS override scoped to mobile, not cruft. Removing them re-breaks the phone layout.

**Function inventory in `js/main.js`:** `syncManifestoOverlap`, `syncManifestoTitle`, `syncManifestoVideoSize`, `syncManifestoLayout`, `syncConversionGhostColumns`, plus `contentWidth` and `fitFontToWidth` as helpers and the manifesto video handlers. `syncDebutTeaserTape()` is dead — the element it measured was deleted when 4A was replaced — and is pending removal along with its comment.

**The custom video player, on both pages.** The `<video>` ships without a `controls` attribute and muted in the markup. Pressing the button unmutes and plays; clicking the frame pauses. Two gestures, no volume, no scrub, no fullscreen. Unmuting happens inside the click handler, which counts as a user gesture, so nothing can make noise before a deliberate press. Both players behave identically on purpose.

**Intentional effects that look like bugs.** The doubled and offset "PLAY READING CLUB" heading is authored. The `.hero__tape` tilt is offset against the tape artwork's own baked-in angle. Neither is a rendering fault.

---

## Show page architecture

`/assassins/`. Show palette throughout, company black and pink only in the footer.

| Section | Element |
|---|---|
| Persistent chrome (nav + ticket CTA) | `#siteNav`, `#ticketCta` |
| Hero | `.hero`, ending in `#chromeSentinel` |
| Concept | `#concept` |
| Tickets | `#tickets` |
| Production team | `#team` |
| Plan your visit | `#visit` |
| Credits | `#credits` |
| Footer | `#footer` |

### The persistent chrome

The sticky nav and the sticky ticket CTA are **one system**: one `IntersectionObserver`, one class (`is-visible`), both elements toggled in the same call. They are adjacent in the markup so that moving one moves the other. Do not split this into an observer per element, and do not replace it with a scroll listener — a scroll handler runs every frame to answer a question the observer answers once, when the answer changes.

**The observed target is not the hero.** It is `.chrome-sentinel`, a zero-height block sitting as the hero's last child, so its top edge *is* the hero's bottom edge. This is a correction, not a preference: a full-height target's intersection with the viewport depends on whether it is taller than the viewport, which is true on desktop and false on phones, so an observer on the hero itself showed the chrome at scroll position zero on mobile. A zero-height target has one edge that has either passed the trigger line or has not, at every viewport height.

`.chrome-sentinel` must not affect layout. No content, padding, margin, border, or height.

`TRIGGER_ABOVE_FOLD` is `450` — a fixed pixel distance, replacing an earlier percentage `rootMargin` that behaved differently at different viewport heights. The constant feeds both the comparison and the `rootMargin` string so the two cannot drift apart. It is currently one value for phone and desktop and may want splitting per breakpoint; the reveal fires while a few hundred pixels of hero are still on screen.

**Hidden state uses `visibility`, not `display`.** `display: none` cannot transition, and the delayed `visibility` step is what keeps a hidden element out of the tab order without cutting the fade short.

**Every code path that ends without an observer must end with the chrome shown.** Both elements are hidden in CSS, so a browser without `IntersectionObserver`, or a missing sentinel, must fall through to visible — never stranded invisible.

**Chrome `z-index` is 100.** High enough to clear everything the stylesheet paints (the only other value on the page is `.tape` at 2), low enough that the ticketing checkout overlay covers it instead of fighting it. Do not raise this into six figures.

### Measurements that other things depend on

`--nav-h: 64px` and the composed `--cta-bar-h` live in `:root`, not on the components, because `html` and `body` are the elements reserving space against them and neither can read a custom property declared on `.site-nav`.

- `html { scroll-padding-top: calc(var(--nav-h) + 1rem) }` — so in-page jumps don't land under the bar. Derived, never a literal.
- `--cta-bar-h` is composed from the CTA's own padding variables rather than measured, so the bar and the space reserved for it grow together. It deliberately excludes the safe-area inset; every consumer adds `env()` itself.
- `.concept`'s `--nav-clearance` is **hand-tuned and not derived**. If `--nav-h` ever changes, re-check that number by hand.

### The nav bulb

`images/bulb.png` is white line art on transparency, 348×2208 — a long diagonal cord with the bulb and pull chain in the bottom portion. It is used as a **CSS mask and coloured**, not tinted through filters, which is what lets it take the page's yellow. Anchoring the graphic's bottom inside the bar puts the bulb in the bar and sends the cord up through the top edge, where `.site-nav`'s `overflow: hidden` crops it. An `@supports` guard means a browser without mask support gets nothing rather than a solid yellow slab.

### The credits block

**This is a compliance artifact, not a design element.** Its type sizes all derive from a single custom property. Never adjust one line independently — change the variable and the whole block re-proportions correctly. Never let a refactor introduce a box, border, rule, or background panel around the billing. `.team__name` carries a `min()` ceiling for the same reason. Do not use a possessive construction anywhere on the site that places the company's name in front of the show's title.

### Hero and responsive conditions

`.hero` deliberately has no `min-height: 100vh`; on landscape it is `--hero-cap: 88vh` so the top edge of the next section stays visible at the bottom of the viewport.

The portrait crop condition — `(max-aspect-ratio: 1/1) and (max-width: 900px)` — appears in both the CSS `@media` block and the `<picture>` `source` `media` attributes. **These two must stay character-identical.** If they diverge, the CSS and the image selection disagree about which crop is showing.

The date plate tracks the chalkboard through the crop as viewport aspect ratio changes. The single knob is `--anchor`. `--crop-y` must always match the Y value in `object-position` — a stale comment about this cost a full debugging cycle once already.

---

## Conventions established across both builds

**Comments carry the reasoning, not the description.** The stylesheets explain *why* a value is what it is, what it is derived from, and what breaks if it changes. A comment that only restates the code is noise; a comment that records a rejected alternative is worth its lines. This is why dead code with a confident comment is worse than dead code without one — the comment describes a thing that no longer exists and reads as current.

**Derive, don't repeat.** Where two numbers must agree, one is computed from the other. Where that is impossible, the comment says the number is hand-tuned and must be re-checked by hand.

**Desktop-first ordering in `assassins.css`,** with `860px` as the content breakpoint reused by `.concept`, `.team`, `.visit` and `.credits`, and `900px` for the hero's portrait condition.

**Cascade order in `style.css`:** broader breakpoints before narrower ones in source order, so phone rules downstream can override tablet rules. The current source order runs `768px`, then `900px`, then `640px`. The 768 and 900 blocks touch disjoint selectors, so nothing currently misbehaves, but the ordering is not the pattern — anything new that lands in both 768 and 900 needs checking.

**Naming.** Block and element classes throughout (`.site-nav__link`, `.hero__frame`), with `--modifier` for variants. IDs only where JavaScript needs a handle.

**One element, two shapes.** The ticket CTA is a corner pill on desktop and a full-width bar on phones — the same markup with different CSS, not two elements toggled with `display: none`. There is one thing to keep in sync with the section it points at, not two.

**Accessibility as a default, not a pass.** `aria-current` on the current nav link, `aria-hidden` on decorative marks, `.visually-hidden` (not `display: none`) for the show page's `<h1>`, `alt` text written as description rather than keyword, `prefers-reduced-motion` blocks in both stylesheets.

---

## Brand system as it applies to the site

**Company / homepage palette.** Black `#000000` dominant, white `#FFFFFF`, hot pink `#F11AC5` used strategically — once at full frame in the manifesto, and as the tape treatment behind "POTENT THEATER" in the hero and footer as a deliberate bookend. Never a general accent. Dark grey `#3C3C3C` for the Play Reading Club field. Light grey `#CCCCCC` for hairlines.

***Assassins* / show palette.** Dark grey-green `#232921`, yellow `#FFDE00`, white `#FFFFFF`. Nothing else. The show page footer is the single authorized exception, carrying company black and pink.

The homepage's 4A section uses `#232921` against the page's black. This is a deliberate palette break marking show territory on a company page, and it is the only place the two systems meet on the homepage.

**Type.** Knewave for the wordmark, always as a PNG, never live type. Glacial Indifference for titles and headings. Inclusive Sans for subheads and body. IBM Plex Mono for the recurring monospace asides and for the nav links. Madelyn Rough is Canva-licensed and ships as PNG where it cannot be legally embedded.

**Motion.** Text enters by fade or by scroll. Never twirls, bounces, or zooms. No audio plays without a deliberate press.

---

## Tried and abandoned

Recorded so they are not retried without new information.

**Footer scroll pinning.** A pinned-and-revealing footer was attempted repeatedly on launch night across several full mechanism rewrites. Each rewrite traded one failure for another — a positioning approach produced drift in the last ~150px; the drift fix produced a static footer; the revert reintroduced the layout problem. Abandoned and reverted to a clean static footer. Still open as a project, but any new attempt should be a targeted fix with a specific hypothesis, not a fourth ground-up rewrite.

**The homepage bulb intro animation.** The original spec called for the bulb to appear alone in the dark, hold, then fade the wordmark up. It was built, then removed. The hero and flag beat are now one section with no animation — everything loads in immediately. This is settled; the code and comments relating to it are pending removal.

**Percentage `rootMargin` for the chrome reveal.** Collapsed the observation band in a way that depended on the hero being taller than the viewport, so the chrome appeared at scroll zero on phones. Replaced by a zero-height sentinel plus a fixed pixel trigger. Do not reintroduce a percentage here.

**Observing the hero element directly** for the chrome reveal. Same root cause. See the sentinel note above.

**A second newsletter form in the footer.** Removed. One form on the homepage, in Play Reading Club. One list, two reasons to be on it.

***Life Plan* as its own homepage section.** Cut for muddying the page's two-beat narrative. It survives as a single factual line with a link at the end of Matthew's bio.

**Multi-viewport preview tools** render each frame with a non-standard user agent, which the ticketing widget's bot protection reads as automated traffic and answers with a challenge page that takes the whole document with it. Nothing in the markup causes this and real visitors never see it. Do responsive sweeps on the show page in Safari's responsive design mode or in Arc, resizing manually.

---

## Known issues, open

**Horizontal scroll on the homepage on phones.** Something is breaking the viewport frame and producing a small horizontal joggle. Undiagnosed. Note that `body { overflow-x: clip }` is already in place, so the source is likely an element sized against the viewport rather than simple content overflow.

**Horizontal overflow on the homepage on resize.** Distinct from the above: `syncManifestoTitle` does not shrink the title when the window narrows, and the headshot tape spans contribute. Does not reproduce on a fresh load at a given width — only while resizing.

**The sticky ticket CTA on phones** scrolls to the bottom and sits over the footer. Currently handled by reserving bottom padding on `body` equal to the bar's composed height. Parking it above the footer would need a second observer and a `fixed`/`absolute` swap — the same class of problem as footer pinning, and deliberately deferred.

**The chrome reveal trigger** uses one value at every breakpoint. May want splitting.

**Key art resolution.** The 4:5 hero is below what the layout wants and is capped at a 1600px frame to limit artifact amplification. On a retina display that frame renders into roughly 3200 device pixels, so a future export should target about 3200px wide. The file carries visible generation artifacts that upscaling sharpens rather than removes, which argues for a fresh high-resolution generation over an upscale. A wide 16:9 outpainted version is unfinished; the working technique was structural guide blocks painted into the extension areas at low temperature in a fresh session, and the failure mode was geometry — a plausible different room rather than an extension of this one. Staging the extension through an intermediate ratio is the untried next step.

**Pending cleanup.** `syncDebutTeaserTape()` and its comment in `js/main.js`. `images/tape-for-debut-production.png` and `images/so-obviously.png`, both unreferenced but still tracked. This file and `reference/4b-design.png` are served from the domain root; note that the repository is public, so moving them out of the served tree changes discoverability, not access.

---

## Working method

Established over both builds and worth keeping.

**One change at a time**, verified in the browser before moving on. **Commit at every working step** — clean fallbacks are what make an aggressive change safe.

**Diagnosis before editing.** Read-only diagnostic prompts run first; fix prompts only once the mechanism is actually understood. A hypothesis gets tested, not assumed. A wrong guess costs a full cycle.

**Fresh Claude Code session at each section boundary,** opening with an orientation prompt: read this file, plus an explicit list of what is off limits for that session. Deployment and merge sessions are the exception — skip the orientation prompt, which primes the wrong behavior, and scope tightly with an explicit "no edits unless instructed."

**`.claude/settings.local.json`** carries deny rules protecting whichever page is not being edited, and requires explicit approval for `git push`, `git reset`, and `git checkout`. Those rules get re-pointed at the start of each session depending on what is in scope.

**Both pages are live.** Push deliberately, never in a batch.

**Fine-tuning happens by hand** in the editor with the browser inspector — spacing, sizing, and type scale are faster that way than through prompts. Claude Code is for structural changes.

**On mobile, simplify rather than fight.** Dropping a decorative element at phone width is preferable to preserving a complex desktop composition through three layers of override.
