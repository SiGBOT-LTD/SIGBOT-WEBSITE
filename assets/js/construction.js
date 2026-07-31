/* Opt the document into the scroll-reveal treatment. Until this runs,
   .con-fadeUp content is plain visible — see construction.css. */
    document.documentElement.classList.add('js-reveal');

    /* Motion preference. Every looping or travelling effect below checks this and
       falls back to its finished state rather than its animated one. */
    const conReduceMotion = window.matchMedia
      && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    /* ── FADE UP OBSERVER ── */
    const conFadeObserver = new IntersectionObserver((entries) => {
      entries.forEach((e, i) => {
        if (e.isIntersecting) {
          setTimeout(() => e.target.classList.add('visible'), i * 60);
          conFadeObserver.unobserve(e.target);
        }
      });
    }, { threshold: 0.08 });
    document.querySelectorAll('.con-fadeUp').forEach(el => conFadeObserver.observe(el));

    /* ── COUNTER ANIMATION ── */
    function conAnimateCounter(el, target, duration, suffix) {
      if (conReduceMotion) {
        el.textContent = target + (suffix || '');
        return;
      }
      let startTime = null;
      function step(ts) {
        if (!startTime) startTime = ts;
        const progress = Math.min((ts - startTime) / duration, 1);
        const val = Math.floor(progress * target);
        el.textContent = val + (suffix || '');
        if (progress < 1) requestAnimationFrame(step);
        else el.textContent = target + (suffix || '');
      }
      requestAnimationFrame(step);
    }

    const conStatsObserver = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        conAnimateCounter(document.getElementById('con-counter1'), 340, 2000, '+');
        conStatsObserver.disconnect();
      }
    }, { threshold: 0.5 });
    conStatsObserver.observe(document.querySelector('.con-statsSection'));

    /* ── FLOW ANIMATION ── */
    const conFlowNodes = [0,1,2,3,4].map(i => document.getElementById('con-fn'+i));
    const conFlowArrows = [0,1,2,3].map(i => document.getElementById('con-fa'+i));
    const conContactCards = [0,1,2].map(i => document.getElementById('con-cc'+i));
    let conLiveCount = 0;
    const conLiveCounterEl = document.getElementById('con-liveCounter');
    let conFlowStep = 0;

    function conRunFlow() {
      // Reduced motion: present the completed pipeline instead of looping it.
      if (conReduceMotion) {
        conFlowNodes.forEach(n => n.classList.add('lit'));
        conFlowArrows.forEach(a => a.classList.add('lit'));
        conContactCards.forEach(c => c.style.opacity = '1');
        conLiveCounterEl.textContent = conContactCards.length;
        return;
      }

      conFlowNodes.forEach(n => n.classList.remove('lit'));
      conFlowArrows.forEach(a => a.classList.remove('lit'));
      conContactCards.forEach(c => c.style.opacity = '0');
      conFlowStep = 0;

      function advance() {
        if (conFlowStep <= 4) {
          conFlowNodes[conFlowStep].classList.add('lit');
          if (conFlowStep > 0) conFlowArrows[conFlowStep-1].classList.add('lit');
          conFlowStep++;
          setTimeout(advance, 500);
        } else {
          conContactCards.forEach((c, i) => {
            setTimeout(() => {
              c.style.opacity = '1';
              conLiveCount++;
              conLiveCounterEl.textContent = conLiveCount;
            }, i * 400);
          });
          setTimeout(conRunFlow, 4000);
        }
      }
      advance();
    }

    const conFlowObserver = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        conRunFlow();
        conFlowObserver.disconnect();
      }
    }, { threshold: 0.3 });
    conFlowObserver.observe(document.getElementById('con-flowNodes'));

    /* ── HOW IT WORKS STEP SWITCHER ── */
    const conSteps = document.querySelectorAll('.con-howStep');
    const conPanels = document.querySelectorAll('.con-visualPanel');
    let conCurrentStep = 0;
    let conAutoTimer;

    function conShowStep(idx) {
      conSteps.forEach(s => s.classList.remove('active'));
      conPanels.forEach(p => p.classList.remove('active'));
      conSteps[idx].classList.add('active');
      conPanels[idx].classList.add('active');
      conCurrentStep = idx;

      if (idx === 1) {
        const mock = document.getElementById('con-scanningMock');
        mock.classList.add('con-scanning');
        const fields = document.querySelectorAll('.con-fieldRow');
        fields.forEach(f => f.classList.remove('show'));
        fields.forEach((f, i) => {
          setTimeout(() => f.classList.add('show'), 300 + i * 280);
        });
        setTimeout(() => mock.classList.remove('con-scanning'), 2000);
      }
    }

    conSteps.forEach((step, idx) => {
      step.addEventListener('click', () => {
        clearInterval(conAutoTimer);
        conShowStep(idx);
        conStartAutoTimer();
      });
    });

    function conStartAutoTimer() {
      // An auto-advancing carousel is motion the reader did not ask for, and it
      // moves the panel out from under anyone reading it. Clicking a step still
      // works — it just stays put afterwards.
      if (conReduceMotion) return;
      conAutoTimer = setInterval(() => {
        conShowStep((conCurrentStep + 1) % conSteps.length);
      }, 4000);
    }
    conStartAutoTimer();

    /* ── SMOOTH SCROLL ── */
    document.querySelectorAll('a[href^="#con-"]').forEach(a => {
      a.addEventListener('click', e => {
        const target = document.querySelector(a.getAttribute('href'));
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: conReduceMotion ? 'auto' : 'smooth' });
        }
      });
    });
