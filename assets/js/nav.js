/* Shared nav + footer behaviour for all marketing pages. */
(function () {
  // Footer year
  var year = document.getElementById('y');
  if (year) year.textContent = new Date().getFullYear();

  // Hamburger toggle
  var hamburger = document.querySelector('.nav-hamburger');
  var navlinks = document.querySelector('.navlinks');
  if (hamburger && navlinks) {
    hamburger.addEventListener('click', function (e) {
      e.stopPropagation();
      var open = navlinks.classList.toggle('open');
      hamburger.classList.toggle('open', open);
      hamburger.setAttribute('aria-expanded', open);
    });
  }

  // Product dropdown. Click-driven rather than hover: a hover menu cannot be
  // opened from a keyboard and is a moving target on a trackpad.
  var toggle = document.querySelector('.nav-dropdown-toggle');
  var menu = document.querySelector('.nav-dropdown-menu');
  if (toggle && menu) {
    var setOpen = function (open) {
      menu.classList.toggle('open', open);
      toggle.classList.toggle('open', open);
      // The visual state and the announced state have to move together, or a
      // screen reader reads a collapsed menu that is plainly on screen.
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    };

    toggle.addEventListener('click', function (e) {
      e.stopPropagation();
      setOpen(!menu.classList.contains('open'));
    });

    // Prevent clicks inside the menu from bubbling to the document handler
    // so the link navigates before the menu is torn down
    menu.addEventListener('click', function (e) {
      e.stopPropagation();
    });

    document.addEventListener('click', function () {
      setOpen(false);
    });

    // Escape closes and returns focus to the control that opened it —
    // otherwise focus is stranded inside a menu that is no longer visible.
    document.addEventListener('keydown', function (e) {
      if (e.key !== 'Escape' || !menu.classList.contains('open')) return;
      setOpen(false);
      toggle.focus();
    });

    // Tabbing out of the menu closes it too.
    document.addEventListener('focusin', function (e) {
      if (!menu.classList.contains('open')) return;
      if (!menu.contains(e.target) && e.target !== toggle) setOpen(false);
    });
  }

  // Sticky nav surface. The nav is transparent while it is still sitting on
  // the page's own background and only takes a blurred surface once content
  // is passing underneath it — a permanent bar would put a hard edge across
  // the hero on first paint. A sentinel element is cheaper and smoother than
  // a scroll listener: no work happens on the frames between crossings.
  var nav = document.querySelector('.nav-wrap');
  if (nav && 'IntersectionObserver' in window) {
    var sentinel = document.createElement('div');
    sentinel.setAttribute('aria-hidden', 'true');
    sentinel.style.cssText = 'position:absolute;top:0;left:0;width:1px;height:1px;pointer-events:none;';
    document.body.prepend(sentinel);

    new IntersectionObserver(function (entries) {
      nav.classList.toggle('is-stuck', !entries[0].isIntersecting);
    }).observe(sentinel);
  }
})();
