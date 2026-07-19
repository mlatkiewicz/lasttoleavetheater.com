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
