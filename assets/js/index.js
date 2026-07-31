// Respected by both effects below. Read once at load — these are entry
// animations, so re-evaluating mid-session would not change anything useful.
const prefersReducedMotion = window.matchMedia
  && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Fade in on scroll. Under reduced motion the cards are left alone entirely
// rather than hidden and revealed — hiding first means a failed observer or a
// blocked script leaves the content permanently invisible.
const cards = document.querySelectorAll('.feature-card, .cta-col');

if (!prefersReducedMotion) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = 1;
        entry.target.style.transform = 'translateY(0)';
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  cards.forEach((card, index) => {
    card.style.opacity = 0;
    card.style.transform = 'translateY(20px)';
    card.style.transition = `all 0.6s ease ${index * 0.1}s`; // Stagger effect
    observer.observe(card);
  });
}

(function () {
  // ─── SIGNATURE FIELD HIGHLIGHT ───
  // A rolling highlight over the signature fields, showing which parts Sigbot
  // picks up. It loops indefinitely, so it stays off under reduced motion.
  const sigFields = ['demo-name', 'demo-title', 'demo-company', 'demo-phone', 'demo-email']
    .map(id => document.getElementById(id));
  if (!sigFields[0] || prefersReducedMotion) return;

  const REST = 'rgba(255,255,255,0.06)';
  const LIT = 'rgba(255,255,255,0.18)';
  let sigIdx = 0;

  setInterval(() => {
    sigFields.forEach(f => {
      if (f) { f.style.background = REST; f.style.boxShadow = 'none'; }
    });
    const field = sigFields[sigIdx];
    if (field) {
      field.style.background = LIT;
      field.style.boxShadow = '0 0 10px rgba(255,255,255,0.12)';
      setTimeout(() => {
        if (field) { field.style.background = REST; field.style.boxShadow = 'none'; }
      }, 700);
    }
    sigIdx = (sigIdx + 1) % sigFields.length;
  }, 900);
})();
