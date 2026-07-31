/* ─── SCROLL REVEAL ───────────────────────────────────────────────
   Replaces the reveal half of index.js, which observed `.feature-card`
   — a class that exists on no page in this site — and set inline styles
   with `transition: all`.

   Two rules this one follows that the old one did not:

   1. The hiding class goes on <html> from script, so markup alone never
      hides anything. If this file 404s or throws, the page is simply a
      page with no entrance animation, not a blank one.
   2. Reduced motion is checked before arming, so those users never get
      the hidden state at all — there is nothing to fail open from.

   Elements opt in with `data-reveal`. Siblings that should cascade take
   `data-reveal="2"`, `"3"`, … which feeds the CSS stagger. */
(function () {
  var reduceMotion = window.matchMedia
    && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (reduceMotion || !('IntersectionObserver' in window)) return;

  var targets = document.querySelectorAll('[data-reveal]');
  if (!targets.length) return;

  document.documentElement.classList.add('js-reveal');

  targets.forEach(function (el) {
    var order = parseInt(el.getAttribute('data-reveal'), 10);
    if (order > 1) el.style.setProperty('--reveal-delay', order - 1);
  });

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-revealed');
      observer.unobserve(entry.target);
    });
  }, {
    // Fire slightly before the element's top edge clears the fold, so the
    // motion resolves as it arrives rather than after it has been sitting
    // in view — a reveal the reader has already looked at reads as a glitch.
    rootMargin: '0px 0px -12% 0px',
    threshold: 0.01
  });

  targets.forEach(function (el) { observer.observe(el); });
})();
