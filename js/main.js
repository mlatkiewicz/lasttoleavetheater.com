(function () {
  'use strict';

  /* Manifesto sits sticky, pulled up by a negative margin exactly equal
     to #flagPhrases' own rendered height -- so at rest it covers exactly
     "this is a flag" / "planted in the real" and nothing more, matching
     the client's reference screenshot regardless of viewport size or
     font scaling. Re-measured on resize since that height is responsive.

     A true sticky mask can't partially reveal what's behind it (it
     covers its full height for its whole stuck duration -- confirmed by
     testing). So the reveal itself is this scroll-linked opacity fade:
     over REVEAL_BUFFER_PX of scroll (matching the buffer added to
     .manifesto's min-height in CSS), Manifesto fades 1 -> 0 -> 1, genuinely
     showing the phrases underneath at the dip, then re-solidifying
     before its own content needs to be read. */
  var flagPhrases = document.getElementById('flagPhrases');
  var manifesto = document.getElementById('manifesto');
  var hero = document.getElementById('hero');
  var REVEAL_BUFFER_PX = 250;
  var activationScrollY = 0;

  function syncManifestoOverlap() {
    if (!flagPhrases || !manifesto || !hero) return;
    var overlap = flagPhrases.getBoundingClientRect().height;
    manifesto.style.marginTop = '-' + overlap + 'px';
    // Derived from Hero (never sticky) so it's correct regardless of
    // Manifesto's current stuck state or scroll position.
    var heroBottomDoc = hero.getBoundingClientRect().bottom + window.scrollY;
    activationScrollY = heroBottomDoc - overlap;
  }

  function updateManifestoFade() {
    var progress = (window.scrollY - activationScrollY) / REVEAL_BUFFER_PX;
    progress = Math.max(0, Math.min(1, progress));
    var opacity = progress <= 0.5 ? 1 - progress / 0.5 : (progress - 0.5) / 0.5;
    manifesto.style.opacity = opacity;
  }

  syncManifestoOverlap();
  updateManifestoFade();
  window.addEventListener('scroll', updateManifestoFade, { passive: true });
  window.addEventListener('resize', function () {
    syncManifestoOverlap();
    updateManifestoFade();
  });

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
