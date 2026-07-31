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

  // Products dropdown toggle
  var toggle = document.querySelector('.nav-dropdown-toggle');
  var menu = document.querySelector('.nav-dropdown-menu');
  if (toggle && menu) {
    toggle.addEventListener('click', function (e) {
      e.stopPropagation();
      var open = menu.classList.toggle('open');
      toggle.classList.toggle('open', open);
    });
    // Prevent clicks inside the menu from bubbling to the document handler
    // so the link navigates before the menu is torn down
    menu.addEventListener('click', function (e) {
      e.stopPropagation();
    });
    document.addEventListener('click', function () {
      menu.classList.remove('open');
      toggle.classList.remove('open');
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
