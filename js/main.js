(function () {
  'use strict';

  /* Manifesto sits sticky, pulled up by a negative margin so that at rest
     it covers exactly "this is a flag" / "planted in the real" and nothing
     more, matching the client's reference screenshot.

     The pull-up distance is NOT simply #flagPhrases' own height -- that
     only works if Hero's box ends exactly at flagPhrases' bottom edge with
     zero slack. But .hero has min-height:100vh with justify-content:
     flex-start, so on any viewport taller than Hero's actual content,
     flex leaves empty space below flagPhrases before Hero's box (and thus
     Manifesto's un-shifted flow position) actually ends. So instead we
     measure the real gap directly: temporarily drop Manifesto back into
     normal flow (position:static, no margin) to read its true un-stuck
     position, diff that against flagPhrases' top, and pull up by exactly
     that -- correct regardless of slack, viewport size, or font scaling.

     The sticky `top` offset ALSO needs to be set dynamically, not left at
     a fixed CSS value: it must equal flagPhrases' own resting screen
     position, so Manifesto is already sitting exactly at its stuck
     threshold at scroll 0. Otherwise (e.g. a fixed `top: 30vh`) Manifesto
     first drifts upward with normal scroll for a while, covering the SAME
     content the whole time, and only starts revealing once it happens to
     reach that offset -- a dead-scroll preamble where the pink section
     looks like it's just scrolling normally. With `top` matched to its
     resting position, any scroll at all -- even 1px -- immediately exceeds
     the threshold and freezes it in place, so the reveal starts on the
     very first scroll pixel instead of after a delay.

     Both values are re-measured on resize since layout can change. */
  var flagPhrases = document.getElementById('flagPhrases');
  var manifesto = document.getElementById('manifesto');

  function syncManifestoOverlap() {
    if (!flagPhrases || !manifesto) return;
    manifesto.style.position = 'static';
    manifesto.style.marginTop = '0px';
    var manifestoNaturalTop = manifesto.getBoundingClientRect().top;
    var flagRect = flagPhrases.getBoundingClientRect();
    var gap = manifestoNaturalTop - flagRect.top;
    manifesto.style.position = '';
    manifesto.style.marginTop = '-' + gap + 'px';
    /* Normalize by current scrollY so this is correct even if a resize
       fires mid-scroll, not just at rest. No-op on mobile, where the
       stylesheet resolves `position` to static and `top` has no effect. */
    manifesto.style.top = (flagRect.top + window.scrollY) + 'px';
  }

  syncManifestoOverlap();
  window.addEventListener('resize', syncManifestoOverlap);

  /* "Potent Theater" is fit to exactly span #manifesto's own content
     width (not just approximated via vw units) -- desktop measures both
     words together as one line; below the 640px breakpoint (matches the
     stylesheet's .manifesto__title-word { display:block }) each word
     becomes its own stacked line, and "Potent" / "Theater" need
     DIFFERENT font-sizes to each independently reach full width, so
     they're fit separately. Font-size scales the glyph widths AND the
     em-based letter-spacing together, so a single proportional pass
     (measured width -> target width) lands exactly on width, not just
     approximately -- no iteration needed. Re-fit on resize and once
     webfonts finish loading, since measuring against a fallback font
     would otherwise bake in that font's metrics. */
  var manifestoTitle = document.getElementById('manifestoTitle');
  var manifestoTitleWords = manifestoTitle
    ? manifestoTitle.querySelectorAll('.manifesto__title-word')
    : [];

  function contentWidth(el) {
    var cs = getComputedStyle(el);
    return el.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
  }

  function fitFontToWidth(el, targetWidth) {
    el.style.fontSize = '';
    var naturalWidth = el.getBoundingClientRect().width;
    if (naturalWidth <= 0) return;
    var naturalSize = parseFloat(getComputedStyle(el).fontSize);
    el.style.fontSize = (naturalSize * (targetWidth / naturalWidth)) + 'px';
  }

  function syncManifestoTitle() {
    if (!manifestoTitle || manifestoTitleWords.length < 2 || !manifesto) return;
    manifestoTitleWords.forEach(function (w) { w.style.fontSize = ''; });
    manifestoTitle.style.fontSize = '';

    var targetWidth = contentWidth(manifesto);
    var isStacked = window.matchMedia('(max-width: 640px)').matches;

    if (isStacked) {
      manifestoTitleWords.forEach(function (w) { fitFontToWidth(w, targetWidth); });
    } else {
      fitFontToWidth(manifestoTitle, targetWidth);
    }
  }

  /* .video-frame's width is set to whatever makes its height (via its
     own aspect-ratio) match .manifesto__lines' rendered height, so the
     text and video columns balance vertically instead of the video
     sitting at some unrelated, independently-derived size -- but never
     at the cost of wrapping the list. Deriving the video's width from
     .manifesto__lines' height at whatever width the list CURRENTLY has
     is not safe: giving the video a width shrinks the row space left
     for the list, which can wrap a line and grow its height, which (via
     the 16/9 ratio) grows the video wider still, shrinking the list
     further -- a feedback loop that runs away rather than settles,
     since 16/9 > 1 amplifies each round.

     Instead: temporarily neutralize BOTH columns' flex sizing (list to
     its natural max-content/no-wrap size, video collapsed to zero) to
     measure, in one shot, the width the list actually needs to avoid
     wrapping at all, and the height it has at that width. Reserve that
     width for the list; whatever's left in the row goes to the video,
     capped at the height-matching ideal. If there's enough room, the
     two columns balance exactly; if not, the video ends up shorter than
     the list rather than forcing the list to wrap -- legible text wins
     over an exact height match. */
  var manifestoLines = document.querySelector('.manifesto__lines');
  var manifestoVideoWrap = document.querySelector('.manifesto__video-wrap');
  var manifestoBody = document.querySelector('.manifesto__body');
  var videoFrame = document.querySelector('.video-frame');

  function syncManifestoVideoSize() {
    if (!manifestoLines || !manifestoVideoWrap || !manifestoBody || !videoFrame) return;
    videoFrame.style.width = '';

    var prevLinesFlex = manifestoLines.style.flex;
    var prevVideoFlex = manifestoVideoWrap.style.flex;
    manifestoLines.style.flex = '0 0 auto';
    manifestoVideoWrap.style.flex = '0 0 0px';
    var naturalWidth = manifestoLines.getBoundingClientRect().width;
    var naturalHeight = manifestoLines.getBoundingClientRect().height;
    manifestoLines.style.flex = prevLinesFlex;
    manifestoVideoWrap.style.flex = prevVideoFlex;
    if (naturalHeight <= 0) return;

    var rowWidth = manifestoBody.getBoundingClientRect().width;
    var gapPx = parseFloat(getComputedStyle(manifestoBody).columnGap) || 0;
    var availableForVideo = rowWidth - gapPx - naturalWidth;
    var idealVideoWidth = naturalHeight * 16 / 9;
    videoFrame.style.width = Math.max(0, Math.min(idealVideoWidth, availableForVideo)) + 'px';
  }

  function syncManifestoLayout() {
    syncManifestoTitle();
    syncManifestoVideoSize();
  }

  syncManifestoLayout();
  window.addEventListener('resize', syncManifestoLayout);
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(syncManifestoLayout);
  }

  /* .debut-teaser__tape-text is centered over the tape PNG via
     position:absolute;inset:0 -- but that means its own
     getBoundingClientRect() always reports the IMAGE's box, never the
     text's actual rendered width (same measurement trap as the
     manifesto title before it got align-self:flex-start). The CSS
     font-size clamp is tuned for common viewport widths, but the tape
     image's width and the font-size's vw-based scaling don't move in
     exact lockstep at every width, so at some sizes the longer of the
     two lines ("Our debut production will be") can grow wider than the
     tape graphic's safe, un-notched middle -- overflowing past the torn
     edges or wrapping onto a third line. This caps (never grows) the
     font-size so that line always fits inside 80% of the tape's width,
     matching where the PNG's jagged corner notches stop encroaching
     (checked by sampling the image's alpha channel): measure the text
     unconstrained (drop the absolute positioning and force nowrap so a
     hard <br> still breaks the two lines but neither line soft-wraps
     further), and only shrink if it doesn't already fit. */
  var debutTapeImg = document.querySelector('.debut-teaser__tape-img');
  var debutTapeText = document.querySelector('.debut-teaser__tape-text');

  function syncDebutTeaserTape() {
    if (!debutTapeImg || !debutTapeText) return;
    debutTapeText.style.fontSize = '';

    var prevPosition = debutTapeText.style.position;
    var prevInset = debutTapeText.style.inset;
    var prevDisplay = debutTapeText.style.display;
    var prevWhiteSpace = debutTapeText.style.whiteSpace;
    debutTapeText.style.position = 'static';
    debutTapeText.style.inset = 'auto';
    debutTapeText.style.display = 'inline-block';
    debutTapeText.style.whiteSpace = 'nowrap';
    var naturalWidth = debutTapeText.getBoundingClientRect().width;
    debutTapeText.style.position = prevPosition;
    debutTapeText.style.inset = prevInset;
    debutTapeText.style.display = prevDisplay;
    debutTapeText.style.whiteSpace = prevWhiteSpace;
    if (naturalWidth <= 0) return;

    var maxWidth = debutTapeImg.getBoundingClientRect().width * 0.8;
    if (naturalWidth <= maxWidth) return;

    var naturalSize = parseFloat(getComputedStyle(debutTapeText).fontSize);
    debutTapeText.style.fontSize = (naturalSize * (maxWidth / naturalWidth)) + 'px';
  }

  syncDebutTeaserTape();
  window.addEventListener('resize', syncDebutTeaserTape);
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(syncDebutTeaserTape);
  }

  /* The two ghost-column lanes in the conversion section must hug the
     "FOLLOW &" heading and the "SIGN UP" block exactly -- but those
     "blocks" aren't wrapped in their own containers (the FOLLOW & heading
     and the socials row are loose siblings, not one element), so there's
     no CSS-only way to say "span from this heading's top to that other
     block's top." Measure the real rendered edges instead: "seam" below is
     wherever .conversion__signup begins, and the SIGN UP lane runs the
     full height of .conversion__signup, top-anchored at that seam. The
     FOLLOW lane is anchored from the OPPOSITE edge -- bottom-anchored one
     line above that seam (LINE_STEP below), with top/height computed from
     its own natural content height -- so its box sizes to however many
     <span> repeats are in the markup and grows upward from that fixed
     bottom. That's deliberate: it's what lets the lane's top rise past
     this section's own top edge, up behind .debut-teaser's tape above,
     just by adding more repeats to the HTML, with no positioning math
     involved for how high it reaches. The +LINE_STEP offset (rather than
     bottom-anchoring FOLLOW at the seam directly) is what makes the two
     lanes overlap by one line instead of meeting exactly -- .conversion__
     signup's own margin-top was pulled up by the same LINE_STEP in CSS, so
     without this offset here FOLLOW would silently drift up by the same
     amount too, since it's measured off that same seam. This way SIGN UP
     moves and FOLLOW doesn't, even though both read off one shared
     measurement. Horizontally, each lane's right edge is pinned just left
     of its own heading's actual left edge -- the SIGN UP heading carries
     its own extra margin-left from being offset from FOLLOW &, so it can't
     reuse FOLLOW's measurement. Re-run on resize and once webfonts settle,
     since both depend on rendered glyph metrics. */
  var conversionSection = document.querySelector('.conversion');
  var followHeading = document.querySelector('.conversion__heading');
  var signupBlock = document.querySelector('.conversion__signup');
  var signupHeading = signupBlock ? signupBlock.querySelector('.conversion__heading') : null;
  var ghostFollow = document.querySelector('.ghost-column--follow');
  var ghostSignup = document.querySelector('.ghost-column--signup');
  var ghostAmpersand = document.querySelector('.ghost-column-ampersand');
  var GHOST_LINE_STEP = 19.84; // one ghost-column line: 13.44px line-height + 6.4px gap

  function syncConversionGhostColumns() {
    if (!conversionSection || !followHeading || !signupBlock || !signupHeading || !ghostFollow || !ghostSignup) return;

    var gap = 14;
    var sectionRect = conversionSection.getBoundingClientRect();
    var headingRect = followHeading.getBoundingClientRect();
    var signupRect = signupBlock.getBoundingClientRect();
    var signupHeadingRect = signupHeading.getBoundingClientRect();

    var seam = signupRect.top - sectionRect.top;
    var signupBottom = signupRect.bottom - sectionRect.top;
    var followBottom = seam + GHOST_LINE_STEP;

    /* Measure the FOLLOW lane's natural content height (however tall its
       repeated <span>s render at the current font-size), then lock that in
       as an explicit top+height rather than leaving it auto-sized off a
       `bottom` anchor. Layout-wise the two are equivalent, but at least one
       engine has been seen laying out an auto-sized, bottom-anchored box
       correctly (right geometry, confirmed via devtools) while not fully
       repainting the newly-exposed region above where the box used to end
       -- explicit top+height is the same pattern the SIGN UP lane already
       uses below without that problem. */
    ghostFollow.style.height = 'auto';
    var followContentHeight = ghostFollow.getBoundingClientRect().height;

    ghostFollow.style.height = followContentHeight + 'px';
    ghostFollow.style.top = (followBottom - followContentHeight) + 'px';
    ghostFollow.style.right = (sectionRect.width - (headingRect.left - sectionRect.left) + gap) + 'px';

    ghostSignup.style.top = seam + 'px';
    ghostSignup.style.height = Math.max(0, signupBottom - seam) + 'px';
    ghostSignup.style.right = (sectionRect.width - (signupHeadingRect.left - sectionRect.left) + gap) + 'px';

    /* The "&" sits on the shared line the two lanes overlap on, centered
       in the horizontal gap between them -- read off their FINAL rendered
       boxes (post-assignment above) rather than re-deriving that gap from
       the individual measurements that produced them. */
    if (ghostAmpersand) {
      var ghostFollowRect = ghostFollow.getBoundingClientRect();
      var ghostSignupRect = ghostSignup.getBoundingClientRect();
      ghostAmpersand.style.left = ((ghostFollowRect.right + ghostSignupRect.left) / 2 - sectionRect.left) + 'px';
      ghostAmpersand.style.top = ((ghostSignupRect.top + ghostFollowRect.bottom) / 2 - sectionRect.top) + 'px';
    }
  }

  syncConversionGhostColumns();
  window.addEventListener('resize', syncConversionGhostColumns);
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(syncConversionGhostColumns);
  }

  /* Manifesto video play/pause toggle */
  var video = document.getElementById('manifestoVideo');
  var playBtn = document.getElementById('videoPlayBtn');

  if (video && playBtn) {
    playBtn.addEventListener('click', function () {
      video.muted = false;
      video.play();
      playBtn.classList.add('is-hidden');
    });

    video.addEventListener('pause', function () {
      playBtn.classList.remove('is-hidden');
    });

    video.addEventListener('ended', function () {
      playBtn.classList.remove('is-hidden');
    });

    video.addEventListener('click', function () {
      if (!video.paused) {
        video.pause();
      }
    });
  }
})();
