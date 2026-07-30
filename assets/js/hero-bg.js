/* ─── HERO BACKGROUND: EMAILS FLYING → CONTACT CARDS ─── */
(function () {
  const canvas = document.getElementById('hero-bg');
  const hero = canvas ? canvas.closest('.hero') : null;
  if (!canvas || !hero) return;
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  let w = 0;
  let h = 0;

  function resize() {
    // Measure the hero's real rendered size and set the canvas in px —
    // CSS % height doesn't resolve on an absolutely positioned child of an
    // auto-height flex container, so we drive sizing from JS instead.
    const rect = hero.getBoundingClientRect();
    w = Math.max(1, Math.round(window.innerWidth));
    h = Math.max(1, Math.round(rect.height + 60));
    canvas.style.width = w + 'px';
    canvas.style.height = h + 'px';
    const dpr = window.devicePixelRatio || 1;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  const COUNT = 10;
  const particles = [];

  function spawn(p, initial) {
    p.scale = 0.6 + Math.random() * 0.7;
    p.y = h * (0.06 + Math.random() * 0.88);
    p.x = initial ? Math.random() * w : -90;
    p.speed = 45 + Math.random() * 55;
    p.cx = w * (0.3 + Math.random() * 0.4);
    p.bobPhase = Math.random() * Math.PI * 2;
    p.bobAmp = 4 + Math.random() * 8;
  }

  // resize() must run first so w/h are real values — spawning particles
  // while w/h are still 0 pins them all to the top-left corner.
  resize();

  for (let i = 0; i < COUNT; i++) {
    const p = {};
    spawn(p, true);
    particles.push(p);
  }

  function drawEnvelope(x, y, s, alpha) {
    const ew = 34 * s;
    const eh = 23 * s;
    ctx.save();
    ctx.translate(x - ew / 2, y - eh / 2);
    ctx.globalAlpha = alpha;
    ctx.strokeStyle = 'rgba(255,255,255,0.55)';
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    if (ctx.roundRect) ctx.roundRect(0, 0, ew, eh, 3 * s);
    else ctx.rect(0, 0, ew, eh);
    ctx.stroke();
    // Flap
    ctx.beginPath();
    ctx.moveTo(0, 1);
    ctx.lineTo(ew / 2, eh * 0.58);
    ctx.lineTo(ew, 1);
    ctx.stroke();
    ctx.restore();
  }

  function drawCard(x, y, s, alpha) {
    const cw = 48 * s;
    const ch = 30 * s;
    ctx.save();
    ctx.translate(x - cw / 2, y - ch / 2);
    ctx.globalAlpha = alpha;
    // Card body
    ctx.strokeStyle = 'rgba(255,255,255,0.5)';
    ctx.lineWidth = 1.4;
    ctx.fillStyle = 'rgba(255,255,255,0.05)';
    ctx.beginPath();
    if (ctx.roundRect) ctx.roundRect(0, 0, cw, ch, 5 * s);
    else ctx.rect(0, 0, cw, ch);
    ctx.fill();
    ctx.stroke();
    // Avatar
    ctx.beginPath();
    ctx.arc(9 * s, ch / 2, 5 * s, 0, 2 * Math.PI);
    ctx.fillStyle = 'rgba(59,130,246,0.85)';
    ctx.fill();
    // Text lines
    ctx.fillStyle = 'rgba(255,255,255,0.55)';
    ctx.fillRect(18 * s, ch / 2 - 5 * s, 22 * s, 2.6 * s);
    ctx.fillStyle = 'rgba(255,255,255,0.28)';
    ctx.fillRect(18 * s, ch / 2 + 2 * s, 15 * s, 2.6 * s);
    ctx.restore();
  }

  let last = performance.now();

  function frame(now) {
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;

    ctx.clearRect(0, 0, w, h);

    particles.forEach(function (p) {
      p.x += p.speed * dt;
      if (p.x > w + 90) spawn(p, false);

      const y = p.y + Math.sin(now / 900 + p.bobPhase) * p.bobAmp;
      // Morph progress: 0 = envelope, 1 = card, over an 80px window at p.cx
      const t = Math.max(0, Math.min(1, (p.x - p.cx) / 80));

      if (t < 1) drawEnvelope(p.x, y, p.scale, (1 - t) * 0.55);
      if (t > 0) drawCard(p.x, y, p.scale, t * 0.55);

      // Conversion flash
      if (t > 0 && t < 1) {
        const glow = Math.sin(t * Math.PI);
        ctx.beginPath();
        ctx.arc(p.x, y, 22 * p.scale, 0, 2 * Math.PI);
        ctx.fillStyle = 'rgba(59,130,246,' + (0.14 * glow) + ')';
        ctx.fill();
      }
    });

    // Vignette so particles fade directly behind the headline text only —
    // sized to roughly match the text block, not the whole canvas, so the
    // flying envelopes stay visible everywhere else.
    const vw = Math.min(w * 0.85, 760);
    const vh = Math.min(h * 0.75, 420);
    const g = ctx.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, Math.max(vw, vh) / 2);
    g.addColorStop(0, 'rgba(5,5,5,0.88)');
    g.addColorStop(0.6, 'rgba(5,5,5,0.5)');
    g.addColorStop(1, 'rgba(5,5,5,0)');
    ctx.save();
    ctx.beginPath();
    ctx.ellipse(w / 2, h / 2, vw / 2, vh / 2, 0, 0, 2 * Math.PI);
    ctx.fillStyle = g;
    ctx.fill();
    ctx.restore();

    requestAnimationFrame(frame);
  }

  let resizeTimer;
  window.addEventListener('resize', function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(resize, 150);
  });

  requestAnimationFrame(frame);
})();
