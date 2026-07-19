(function () {
  'use strict';

  /* Bulb intro — plays once per browser session, never blocks scroll.
     Hero wordmark/tape/LA fade up on this same timeline (not on scroll). */
  var INTRO_KEY = 'ltl-intro-seen';
  var overlay = document.getElementById('introOverlay');
  var heroEls = document.querySelectorAll('.hero-reveal');

  function revealHero() {
    heroEls.forEach(function (el) {
      el.classList.add('is-visible');
    });
  }

  if (overlay) {
    if (sessionStorage.getItem(INTRO_KEY)) {
      overlay.remove();
      revealHero();
    } else {
      sessionStorage.setItem(INTRO_KEY, '1');
      requestAnimationFrame(function () {
        overlay.classList.add('is-playing');
      });
      setTimeout(function () {
        overlay.classList.add('is-done');
        revealHero();
        setTimeout(function () {
          overlay.remove();
        }, 700);
      }, 1600);
    }
  } else {
    revealHero();
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
