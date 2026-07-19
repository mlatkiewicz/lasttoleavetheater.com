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
     Re-measured on resize since layout can change. */
  var flagPhrases = document.getElementById('flagPhrases');
  var manifesto = document.getElementById('manifesto');

  function syncManifestoOverlap() {
    if (!flagPhrases || !manifesto) return;
    manifesto.style.position = 'static';
    manifesto.style.marginTop = '0px';
    var gap = manifesto.getBoundingClientRect().top - flagPhrases.getBoundingClientRect().top;
    manifesto.style.position = '';
    manifesto.style.marginTop = '-' + gap + 'px';
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
