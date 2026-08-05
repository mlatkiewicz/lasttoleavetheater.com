/* ASSASSINS — page script for /assassins/.

   Standalone. js/main.js is neither linked from this page nor edited; the
   toggle below is a fresh port of that file's manifesto video handler, so the
   two players behave identically.

   The interface is deliberately just two gestures — press the button to
   start, click the frame to stop. There is no volume, scrub, or fullscreen,
   because the <video> ships without `controls`. That is the homepage's
   bargain, kept here on purpose for consistency. */
(function () {
  'use strict';

  var video = document.getElementById('conceptVideo');
  var playBtn = document.getElementById('conceptPlayBtn');

  if (video && playBtn) {
    /* The video is muted in the markup so nothing can make noise before a
       deliberate press. Unmuting here is safe: it happens inside the click
       handler, which counts as a user gesture. */
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

    /* While playing there is no visible control, so the frame itself is the
       pause target. */
    video.addEventListener('click', function () {
      if (!video.paused) {
        video.pause();
      }
    });
  }
})();

/* Persistent chrome — the sticky nav and the sticky ticket CTA.

   ONE observer, ONE class, BOTH elements. They are a pair, and the cheapest
   guarantee that they arrive together is that there is no second trigger to
   drift out of step with the first. Do not split this into an observer per
   element, and do not reach for a scroll listener — a scroll handler would run
   on every frame of every scroll to answer a question the observer answers
   once, at the moment the answer changes.

   The observed target is NOT the hero. It is #chromeSentinel, a zero-height
   element sitting on the hero's bottom edge — see .chrome-sentinel in
   css/assassins.css. Observing the hero itself made the trigger depend on
   whether the hero was taller than the viewport, which is true on desktop and
   false on phones, so the chrome arrived on load at phone sizes. */
(function () {
  'use strict';

  var sentinel = document.getElementById('chromeSentinel');
  var bars = [
    document.getElementById('siteNav'),
    document.getElementById('ticketCta')
  ].filter(Boolean);

  if (!bars.length) { return; }

  function setVisible(on) {
    bars.forEach(function (el) { el.classList.toggle('is-visible', on); });
  }

  /* Both elements are hidden in CSS, so every path that ends without an
     observer has to end with them SHOWN — never stranded invisible. */
  if (!sentinel || !('IntersectionObserver' in window)) {
    setVisible(true);
    return;
  }

  /* How far ABOVE the viewport's top edge the sentinel — which is the hero's
     bottom edge — has to travel before the chrome arrives. A fixed pixel
     distance on purpose: it fires the reveal slightly before the hero has
     fully cleared, and it behaves identically at every viewport height, which
     the percentage it replaced did not. */
  var TRIGGER_ABOVE_FOLD = 450;

  new IntersectionObserver(function (entries) {
    var entry = entries[0];
    /* The sentinel is outside the observed band on BOTH sides of the scroll:
       below the fold before you have scrolled, above the trigger line after.
       Only the second means the hero has gone, so its position is what tells
       the two apart — !isIntersecting on its own would show the chrome at
       scroll 0 on any window the hero is taller than. */
    setVisible(!entry.isIntersecting &&
               entry.boundingClientRect.top < TRIGGER_ABOVE_FOLD);
  }, {
    threshold: 0,
    /* Order is top right bottom left, so this moves the top edge only: the
       observed band's top edge is pulled TRIGGER_ABOVE_FOLD px down from the
       viewport's top, and the sentinel leaves the band that far before the
       hero's bottom edge would actually clear the screen. Built from the
       constant above so the two cannot drift apart. */
    rootMargin: '-' + TRIGGER_ABOVE_FOLD + 'px 0px 0px 0px'
  }).observe(sentinel);
})();
