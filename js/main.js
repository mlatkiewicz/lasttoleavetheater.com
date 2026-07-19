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

  /* Scroll-triggered fade-ins */
  var fadeEls = document.querySelectorAll('.fade-in');
  if ('IntersectionObserver' in window) {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -10% 0px' }
    );
    fadeEls.forEach(function (el) {
      observer.observe(el);
    });
  } else {
    fadeEls.forEach(function (el) {
      el.classList.add('is-visible');
    });
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
