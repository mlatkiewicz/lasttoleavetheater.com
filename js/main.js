(function () {
  'use strict';

  /* Manifesto sits sticky, pulled up by a negative margin exactly equal
     to #flagPhrases' own rendered height -- so at rest it covers exactly
     "this is a flag" / "planted in the real" and nothing more, matching
     the client's reference screenshot regardless of viewport size or
     font scaling. Re-measured on resize since that height is responsive. */
  var flagPhrases = document.getElementById('flagPhrases');
  var manifesto = document.getElementById('manifesto');

  function syncManifestoOverlap() {
    if (!flagPhrases || !manifesto) return;
    var overlap = flagPhrases.getBoundingClientRect().height;
    manifesto.style.marginTop = '-' + overlap + 'px';
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
