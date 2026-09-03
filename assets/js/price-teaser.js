/* ─── LOCALISED PRICE TEASERS ─────────────────────────────────────
   The home and web-app pages each quote "from $50/month" once. After
   the pricing page started showing what Paddle actually charges in the
   visitor's country, these lines were the last places still speaking
   dollars to everyone.

   One number does not justify loading the full checkout script on the
   marketing pages, so this goes cache-first: a visit to the pricing
   page leaves the localised Individual price in localStorage, and if that is
   fresh the swap costs nothing. Only when there is no usable cache does
   paddle.js get injected — after the page is idle, so it can never
   compete with the hero, the globe, or anything else that matters.

   Every path out of here that isn't a confirmed local price leaves the
   "$50/month" markup untouched. Same rule as the pricing page: a page
   that cannot localise should look like one that never tried.

   The token and price ID are duplicated from pricing.js on purpose —
   this file must stay loadable on pages that don't load that one.
   Change them together. */
(function () {
  var TOKEN = 'live_5ccca908a5ed4850c510274c3e2';
  var INDIVIDUAL_MONTHLY = 'pri_01m1k1fmh4jvpst9t6gqmdb5zb';

  var CACHE_KEY   = 'sigbot.localPrice.v3';
  var COUNTRY_KEY = 'sigbot.country';
  var CACHE_TTL   = 24 * 60 * 60 * 1000;

  var targets = document.querySelectorAll('[data-local-price]');
  if (!targets.length) return;

  function apply(formatted) {
    for (var i = 0; i < targets.length; i++) {
      targets[i].textContent = formatted + '/month';
    }
  }

  function savedCountry() {
    try { return localStorage.getItem(COUNTRY_KEY); } catch (e) { return null; }
  }

  /* Cache is only trusted if it was priced for the country the visitor
     has picked (or would be detected as — null matches null). A stale
     currency here would disagree with the pricing page one click away,
     which is the exact mismatch this file exists to remove. */
  function fromCache() {
    try {
      var cached = JSON.parse(localStorage.getItem(CACHE_KEY));
      if (!cached || !cached.individualMonthly) return null;
      if (Date.now() - cached.ts > CACHE_TTL) return null;
      var picked = savedCountry();
      if (picked && cached.country !== picked) return null;
      return cached.individualMonthly;
    } catch (e) {
      return null;
    }
  }

  /* Same formatting rules as pricing.js: rounded to the nearest whole
     amount, because the surrounding sentence quotes a price point, not
     a receipt. The exact localised figure appears at the checkout. */
  function money(minorUnits, currency) {
    var locale = (navigator.languages && navigator.languages[0]) ||
                 navigator.language || 'en';
    var digits = 2;
    try {
      digits = new Intl.NumberFormat('en', {
        style: 'currency', currency: currency
      }).resolvedOptions().maximumFractionDigits;
    } catch (e) {}

    var amount = Math.round(Number(minorUnits) / Math.pow(10, digits));

    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  }

  function preview() {
    if (!INDIVIDUAL_MONTHLY) return; // catalog ids not filled in yet
    var request = { items: [{ priceId: INDIVIDUAL_MONTHLY, quantity: 1 }] };
    var picked = savedCountry();
    if (picked) request.address = { countryCode: picked };

    Paddle.PricePreview(request).then(function (result) {
      var data = result && result.data;
      var item = data && data.details && data.details.lineItems &&
                 data.details.lineItems[0];
      if (!item || !item.totals) return;

      var formatted = money(item.totals.subtotal, data.currencyCode);
      apply(formatted);

      try {
        localStorage.setItem(CACHE_KEY, JSON.stringify({
          country: (data.address && data.address.countryCode) || picked || null,
          individualMonthly: formatted,
          ts: Date.now()
        }));
      } catch (e) {}
    }).catch(function () { /* the $50 markup stands */ });
  }

  function loadPaddleAndPreview() {
    if (window.Paddle && typeof Paddle.PricePreview === 'function') {
      preview();
      return;
    }
    var script = document.createElement('script');
    script.src = 'https://cdn.paddle.com/paddle/v2/paddle.js';
    script.async = true;
    script.onload = function () {
      try {
        Paddle.Initialize({ token: TOKEN });
        preview();
      } catch (e) { /* the $50 markup stands */ }
    };
    document.head.appendChild(script);
  }

  var cached = fromCache();
  if (cached) {
    apply(cached);
    return;
  }

  if ('requestIdleCallback' in window) {
    requestIdleCallback(loadPaddleAndPreview, { timeout: 4000 });
  } else {
    setTimeout(loadPaddleAndPreview, 1);
  }
})();
