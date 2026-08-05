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

   The trigger is the hero leaving the viewport outright: at threshold 0,
   isIntersecting goes false only once the last pixel of .hero is above the
   fold, which is exactly "the hero has scrolled past". */
(function () {
  'use strict';

  var hero = document.querySelector('.hero');
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
  if (!hero || !('IntersectionObserver' in window)) {
    setVisible(true);
    return;
  }

  new IntersectionObserver(function (entries) {
    setVisible(!entries[0].isIntersecting);
  }, { threshold: 0 }).observe(hero);
})();
