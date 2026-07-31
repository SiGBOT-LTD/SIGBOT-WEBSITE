/* Hero extraction demo.
 *
 * Walks the signature line by line: the line being read gets the amber
 * highlight, then its field lands in the record below with a mint check.
 * Once the record is complete it holds, then starts over.
 *
 * Under prefers-reduced-motion the finished state is rendered immediately and
 * nothing loops — the point of the graphic is the before/after, which a static
 * completed record still makes.
 */
(function () {
  const root = document.getElementById('extract');
  if (!root) return;

  const siglines = [...root.querySelectorAll('.sigline[data-field]')];
  const rows = [...root.querySelectorAll('.erow[data-row]')];
  if (!siglines.length || !rows.length) return;

  const rowFor = (field) => rows.find(r => r.dataset.row === field);

  const READ_MS = 620;   // how long a line stays highlighted
  const HOLD_MS = 2600;  // pause on the completed record before restarting

  const reduce = window.matchMedia
    && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function showAll() {
    siglines.forEach(l => l.classList.add('is-done'));
    rows.forEach(r => r.classList.add('is-in'));
  }

  if (reduce) {
    showAll();
    return;
  }

  let timer = null;

  function reset() {
    siglines.forEach(l => l.classList.remove('is-reading', 'is-done'));
    rows.forEach(r => r.classList.remove('is-in'));
  }

  function step(i) {
    if (i >= siglines.length) {
      timer = setTimeout(() => { reset(); step(0); }, HOLD_MS);
      return;
    }

    const line = siglines[i];
    if (i > 0) {
      siglines[i - 1].classList.remove('is-reading');
      siglines[i - 1].classList.add('is-done');
    }
    line.classList.add('is-reading');

    const row = rowFor(line.dataset.field);
    if (row) row.classList.add('is-in');

    timer = setTimeout(() => {
      if (i === siglines.length - 1) {
        line.classList.remove('is-reading');
        line.classList.add('is-done');
      }
      step(i + 1);
    }, READ_MS);
  }

  // Only run while the card is on screen — no reason to burn cycles or draw
  // the eye once the reader has scrolled past the hero.
  let running = false;
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting && !running) {
        running = true;
        step(0);
      } else if (!e.isIntersecting && running) {
        running = false;
        clearTimeout(timer);
        reset();
      }
    });
  }, { threshold: 0.25 });

  io.observe(root);
})();
