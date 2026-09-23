/* paddle.js is loaded from Paddle's CDN, which ad blockers routinely
       eat. Without this guard the ReferenceError below would take the
       whole file with it — country picker included — and the page's own
       rule is that failing to localise must not break anything else.
       paddle.js is only needed here for PricePreview (localised prices);
       checkout itself happens in the app — see openCheckout below. */
    if (window.Paddle) Paddle.Initialize({
      token: 'live_5ccca908a5ed4850c510274c3e2'
    });

    /* 2026 tiers — "Sigbot Individual / Starter / Professional" catalog
       created 2026-09-03 by scripts/setup-paddle.mjs (app repo), priced in
       USD. These feed PricePreview only — checkout happens in the app (see
       openCheckout). Team plans are annual-only; Individual is $190/yr or
       $19/mo since the 2026-09-09 repricing (the monthly id is a NEW price —
       the old $50 one stays archived). */
    var PRICE_IDS = {
      individual:         'pri_01m24wcz9tffjj1s5eq0pbbkph',
      individualAnnual:   'pri_01m1k1fmn6nhmwrerfks8thb2e',
      starterAnnual:      'pri_01m1k1fmzdhemebjnzfabg33gj',
      professionalAnnual: 'pri_01m1k1fng49mpkxfr9exp9tth9'
    };

    /* ─── LOCALISED PRICING ───────────────────────────────────────────
       The numbers written into pricing.html are US dollars. Paddle is
       the merchant of record: it converts and taxes at the checkout, so
       this asks Paddle what it will actually charge for each price ID in
       the visitor's country and renders that answer — the only number
       guaranteed to survive to the checkout.

       If the call fails — Paddle blocked, offline, ids not yet filled in
       — the USD markup already in the HTML is left untouched and the
       country picker never appears. */

    var LOCALE = (navigator.languages && navigator.languages[0]) ||
                 navigator.language || 'en';

    // Remembered so the currency does not flip back to the detected one
    // every time someone moves between the pricing page and the FAQ.
    var COUNTRY_KEY = 'sigbot.country';

    /* Grouped by continent because that is how someone scans for their
       own country in a list this long. */
    var REGIONS = [
      ['Africa', [
        ['EG', 'Egypt'], ['KE', 'Kenya'], ['MA', 'Morocco'],
        ['NG', 'Nigeria'], ['ZA', 'South Africa']
      ]],
      ['Asia', [
        ['CN', 'China'], ['HK', 'Hong Kong SAR'], ['IN', 'India'],
        ['ID', 'Indonesia'], ['IL', 'Israel'], ['JP', 'Japan'],
        ['MY', 'Malaysia'], ['PH', 'Philippines'], ['SA', 'Saudi Arabia'],
        ['SG', 'Singapore'], ['KR', 'South Korea'], ['TW', 'Taiwan'],
        ['TH', 'Thailand'], ['TR', 'Türkiye'],
        ['AE', 'United Arab Emirates'], ['VN', 'Vietnam']
      ]],
      ['Europe', [
        ['AT', 'Austria'], ['BE', 'Belgium'], ['CZ', 'Czechia'],
        ['DK', 'Denmark'], ['FI', 'Finland'], ['FR', 'France'],
        ['DE', 'Germany'], ['GR', 'Greece'], ['HU', 'Hungary'],
        ['IE', 'Ireland'], ['IT', 'Italy'], ['NL', 'Netherlands'],
        ['NO', 'Norway'], ['PL', 'Poland'], ['PT', 'Portugal'],
        ['RO', 'Romania'], ['ES', 'Spain'], ['SE', 'Sweden'],
        ['CH', 'Switzerland'], ['UA', 'Ukraine'], ['GB', 'United Kingdom']
      ]],
      ['North America', [
        ['CA', 'Canada'], ['MX', 'Mexico'], ['US', 'United States']
      ]],
      ['Oceania', [
        ['AU', 'Australia'], ['NZ', 'New Zealand']
      ]],
      ['South America', [
        ['AR', 'Argentina'], ['BR', 'Brazil'], ['CL', 'Chile'],
        ['CO', 'Colombia'], ['PE', 'Peru']
      ]]
    ];

    /* The USD prices live in pricing.html (generated from the app's
       catalog between sigbot:pricing:price:<tier> markers) and stand
       until Paddle answers. */

    // Filled in once Paddle answers; null means "leave the USD markup".
    var LOCAL = null;

    var regionRow    = document.getElementById('region-row');
    var regionSelect = document.getElementById('country-select');
    var regionNote   = document.getElementById('region-note');

    var faqIndividualYear  = document.getElementById('faq-individual-annual');

    var EL = {
      individual:   {
        price:   document.getElementById('individual-price'),
        monthly: document.getElementById('individual-monthly-price'),
        saving:  document.getElementById('individual-saving')
      },
      starter:      { price: document.getElementById('starter-price') },
      professional: { price: document.getElementById('professional-price') }
    };

    /* ─── MONEY ─────────────────────────────────────────────────────── */
    function currencyDigits(currency) {
      try {
        return new Intl.NumberFormat('en', {
          style: 'currency', currency: currency
        }).resolvedOptions().maximumFractionDigits;
      } catch (e) {
        return 2;
      }
    }

    /* Displayed prices round to the nearest whole amount — converted
       decimals (CA$68.86) read like a receipt, not a price point. The
       exact localised figure still appears at the Paddle checkout; the
       FAQ's currency answer discloses the rounding. */
    function money(minorUnits) {
      var digits = currencyDigits(LOCAL.currency);
      var amount = Math.round(Number(minorUnits) / Math.pow(10, digits));

      return new Intl.NumberFormat(LOCALE, {
        style: 'currency',
        currency: LOCAL.currency,
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      }).format(amount);
    }

    /* ─── RENDER ──────────────────────────────────────────────────────
       Yearly is the headline on every card; Individual also quotes its
       monthly price on the line beneath. Once Paddle answers, every figure
       is swapped for the localised one and the saving is recomputed from
       the localised amounts rather than assumed. */
    function render() {
      if (!LOCAL) return;
      EL.individual.price.textContent   = money(LOCAL.individual.annual);
      EL.individual.monthly.textContent = money(LOCAL.individual.monthly);
      var pct = Math.round(
        (1 - LOCAL.individual.annual / (LOCAL.individual.monthly * 12)) * 100
      );
      if (pct > 0) EL.individual.saving.textContent = pct + '%';
      EL.starter.price.textContent      = money(LOCAL.starter.annual);
      EL.professional.price.textContent = money(LOCAL.professional.annual);
    }

    /* The copy that quotes numbers has to move with the prices. */
    function renderCopy() {
      if (!LOCAL) return;

      faqIndividualYear.textContent =
        money(LOCAL.individual.annual) + '/yr or ' + money(LOCAL.individual.monthly) + '/mo';

      var note = 'Prices shown in ' + LOCAL.currency;
      if (LOCAL.taxRate > 0) {
        note += LOCAL.taxInclusive
          ? ', including ' + Math.round(LOCAL.taxRate * 100) + '% tax'
          : ', excluding local sales tax (' +
            Math.round(LOCAL.taxRate * 100) + '% here), added at checkout';
      }
      regionNote.textContent = note + '.';
    }

    /* ─── COUNTRY PICKER ────────────────────────────────────────────── */
    function buildCountryPicker(selected) {
      if (regionSelect.options.length) {
        regionSelect.value = selected;
        return;
      }

      var known = {};

      REGIONS.forEach(function (region) {
        var group = document.createElement('optgroup');
        group.label = region[0];

        region[1].forEach(function (country) {
          known[country[0]] = true;
          var option = document.createElement('option');
          option.value = country[0];
          option.textContent = country[1];
          group.appendChild(option);
        });

        regionSelect.appendChild(group);
      });

      if (selected && !known[selected]) {
        var extra = document.createElement('option');
        extra.value = selected;
        extra.textContent = countryName(selected);
        regionSelect.insertBefore(extra, regionSelect.firstChild);
      }

      regionSelect.value = selected;
    }

    function countryName(code) {
      try {
        return new Intl.DisplayNames([LOCALE], { type: 'region' }).of(code);
      } catch (e) {
        return code;
      }
    }

    /* ─── PADDLE PREVIEW ────────────────────────────────────────────── */
    function loadPrices(countryCode) {
      if (!window.Paddle || typeof Paddle.PricePreview !== 'function') return;

      // Ids not filled in yet (the 2026 catalog is created by
      // scripts/setup-paddle.mjs) — the USD markup stands.
      var ids = [PRICE_IDS.individual, PRICE_IDS.individualAnnual,
                 PRICE_IDS.starterAnnual, PRICE_IDS.professionalAnnual];
      for (var i = 0; i < ids.length; i++) {
        if (!ids[i]) return;
      }

      var request = {
        items: ids.map(function (id) { return { priceId: id, quantity: 1 }; })
      };

      // Omitting the address is what triggers Paddle's own IP lookup.
      if (countryCode) request.address = { countryCode: countryCode };

      Paddle.PricePreview(request).then(function (result) {
        var data  = result && result.data;
        var items = data && data.details && data.details.lineItems;
        if (!items || !items.length) return;

        var byId = {};
        items.forEach(function (item) {
          if (item.price && item.price.id) byId[item.price.id] = item;
        });

        // A partial answer is worse than none. All four or the markup stands.
        for (var i = 0; i < ids.length; i++) {
          if (!byId[ids[i]]) return;
        }

        /* Every catalog price now carries a whole-number override in every
           currency. Paddle's tax mode is location-based: in countries where
           tax is folded INTO the price (UK, EU, AU, …) the whole advertised
           figure is totals.total; where tax is added at the checkout
           (US, CA, …) it is totals.subtotal. Displaying the whole one is
           displaying the price. */
        var digits = currencyDigits(data.currencyCode);
        var unit = Math.pow(10, digits);
        function isWholeMinor(minor) { return Number(minor) % unit === 0; }
        function advertised(id) {
          var t = byId[id].totals;
          if (isWholeMinor(t.total) && !isWholeMinor(t.subtotal)) return Number(t.total);
          return Number(t.subtotal);
        }
        var indTotals = byId[PRICE_IDS.individualAnnual].totals;
        var taxInclusive =
          Number(indTotals.total) !== Number(indTotals.subtotal) &&
          advertised(PRICE_IDS.individualAnnual) === Number(indTotals.total);

        LOCAL = {
          currency: data.currencyCode,
          country:  (data.address && data.address.countryCode) || countryCode || null,
          taxRate:  Number(byId[PRICE_IDS.individualAnnual].taxRate || 0),
          taxInclusive: taxInclusive,
          individual:   {
            monthly: advertised(PRICE_IDS.individual),
            annual:  advertised(PRICE_IDS.individualAnnual)
          },
          starter:      { annual: advertised(PRICE_IDS.starterAnnual) },
          professional: { annual: advertised(PRICE_IDS.professionalAnnual) }
        };

        if (LOCAL.country) buildCountryPicker(LOCAL.country);
        regionRow.hidden = !LOCAL.country;

        render();
        renderCopy();

        // The "from $190/year" teasers on other pages read this instead
        // of loading paddle.js themselves. See price-teaser.js.
        try {
          localStorage.setItem('sigbot.localPrice.v7', JSON.stringify({
            country: LOCAL.country,
            individualYearly: money(LOCAL.individual.annual),
            ts: Date.now()
          }));
        } catch (e) {}
      }).catch(function () {
        /* Leave the USD markup alone. */
      });
    }

    regionSelect.addEventListener('change', function () {
      var country = regionSelect.value;

      try { localStorage.setItem(COUNTRY_KEY, country); } catch (e) {}

      sigbotTrack('pricing_country_changed', { country: country });

      loadPrices(country);
    });

    /* ─── CHECKOUT ────────────────────────────────────────────────────
       Checkout must happen inside the app, signed in — every Paddle
       purchase is keyed to a Firebase account via customData.firebase_uid.
       The buy buttons hand the visitor to the app with the chosen plan in
       the query string. Team plans are annual-only; Individual can go
       monthly from its second button.

       Two destinations, because buying a team plan is not the same job as
       buying a single licence:
         - individual → sigbot.app/upgrade, which opens the matching
           checkout once signed in;
         - starter / professional → sigbot.app/get-started?plan=…, the
           guided team flow: company name, then checkout, then a team is
           created and colleagues are invited. Sending a team buyer to
           /upgrade took their money and left them with a subscription and
           no team, and nothing on screen asking them to make one. */
    var TEAM_PLANS = { starter: 1, professional: 1 };

    function openCheckout(plan, cycle) {
      cycle = cycle || 'yearly';
      sigbotTrack('checkout_opened', {
        plan: plan,
        billing: cycle === 'yearly' ? 'annual' : 'monthly',
        currency: LOCAL ? LOCAL.currency : 'USD',
        country: LOCAL ? LOCAL.country : null
      });

      window.location.href = TEAM_PLANS[plan]
        ? 'https://sigbot.app/get-started?plan=' + plan
        : 'https://sigbot.app/upgrade?plan=' + plan + '&cycle=' + cycle;
    }

    ['individual', 'starter', 'professional'].forEach(function (plan) {
      document.getElementById(plan + '-checkout-btn').addEventListener('click', function () {
        openCheckout(plan, 'yearly');
      });
    });
    document.getElementById('individual-monthly-btn').addEventListener('click', function () {
      openCheckout('individual', 'monthly');
    });

    (function init() {
      var saved = null;
      try { saved = localStorage.getItem(COUNTRY_KEY); } catch (e) {}
      loadPrices(saved);
    })();
