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
