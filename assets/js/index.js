// Simple fade in on scroll
    const cards = document.querySelectorAll('.feature-card, .cta-col');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = 1;
          entry.target.style.transform = 'translateY(0)';
        }
      });
    }, { threshold: 0.1 });

    cards.forEach((card, index) => {
      card.style.opacity = 0;
      card.style.transform = 'translateY(20px)';
      card.style.transition = `all 0.6s ease ${index * 0.1}s`; // Stagger effect
      observer.observe(card);
    });

    (function () {
      // ─── SIGNATURE FIELD HIGHLIGHT ───
      const sigFields = ['demo-name', 'demo-title', 'demo-company', 'demo-phone', 'demo-email'].map(id => document.getElementById(id));
      if (!sigFields[0]) return;
      let sigIdx = 0;
      setInterval(() => {
        sigFields.forEach(f => { if (f) { f.style.background = 'rgba(255,255,255,0.06)'; f.style.boxShadow = 'none'; } });
        if (sigFields[sigIdx]) {
          sigFields[sigIdx].style.background = 'rgba(255,255,255,0.18)';
          sigFields[sigIdx].style.boxShadow = '0 0 10px rgba(255,255,255,0.12)';
          setTimeout(() => { if (sigFields[sigIdx]) { sigFields[sigIdx].style.background = 'rgba(255,255,255,0.06)'; sigFields[sigIdx].style.boxShadow = 'none'; } }, 700);
        }
        sigIdx = (sigIdx + 1) % sigFields.length;
      }, 900);
    })();
