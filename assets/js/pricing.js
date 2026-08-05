/* paddle.js is loaded from Paddle's CDN, which ad blockers routinely
       eat. Without this guard the ReferenceError below would take the
       whole file with it — billing toggle included — and the page's own
       rule is that failing to localise must not break anything else.
       Checkout genuinely cannot work without paddle.js, so that stays
       broken either way; the rest of the page must not. */
    if (window.Paddle) Paddle.Initialize({
      token: 'live_5ccca908a5ed4850c510274c3e2',
      eventCallback: function(event) {
        if (event.name === 'checkout.completed') {
          // Captured before the redirect. Paddle is the authority on revenue,
          // but without this event PostHog sees the session end at the
          // checkout and scores every purchase as an abandonment.
          sigbotTrack('checkout_completed', {
            plan: (event.data && event.data.items && event.data.items[0]
                    && event.data.items[0].price_name) || null,
            value: event.data && event.data.totals && event.data.totals.total,
            currency: event.data && event.data.currency_code
          });
          window.location.href = 'https://sigbot.app/dashboard';
        }
      }
    });

    /* These belong to the "Sigbot Pro" / "Sigbot Team" catalog created
       2026-07-23, priced in USD. The original products were denominated
       in CAD by mistake and are archived — archived price IDs fail both
       PricePreview and checkout, so an old ID here is a dead buy button. */
    var PRICE_IDS = {
      pro:        'pri_01ky5yqwjqxtjf3mxjd0yc4xsy',
      proAnnual:  'pri_01ky5yqwq5pjjnett4r6dt31ka',
      team:       'pri_01ky5yqx1wdas1d5ht3q78jmz5',
      teamAnnual: 'pri_01ky5yqx6hvwrz8cqhx1g80njw'
    };

    /* ─── LOCALISED PRICING ───────────────────────────────────────────
       The numbers written into pricing.html are US dollars. Everyone
       outside the US was reading a price they would never be charged:
       Paddle is the merchant of record, it converts and taxes at the
       checkout, so a visitor in Berlin saw "$20" on this page and a euro
       total on the next one.

       Nothing below invents an exchange rate. Paddle is asked what it
       will actually charge for each price ID in the visitor's country
       and the page renders that answer, which is the only number that
       can be guaranteed to survive to the checkout.

       If the call fails — Paddle blocked, offline, an ad blocker eating
       paddle.js — the USD markup already in the HTML is left untouched
       and the country picker never appears. A page that cannot localise
       should look like a page that never tried, not a broken one. */

    var LOCALE = (navigator.languages && navigator.languages[0]) ||
                 navigator.language || 'en';

    // Remembered so the currency does not flip back to the detected one
    // every time someone moves between the pricing page and the FAQ.
    var COUNTRY_KEY = 'sigbot.country';

    /* Grouped by continent because that is how someone scans for their
       own country in a list this long. Countries are here to cover the
       currencies Paddle settles in plus the markets Sigbot actually
       sees traffic from; anywhere else still works, it just arrives via
       IP detection and gets added to the list below on the fly. */
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

    /* The prices in the markup, as strings, so the renderer has one code
       path whether or not Paddle answered. These must stay in step with
       pricing.html — they are what a visitor sees if the preview call
       never lands. */
    var STATIC = {
      pro:  { monthly: '$20',  annualMonthly: '$16',  annualTotal: '$192' },
      team: { monthly: '$200', annualMonthly: '$160', annualTotal: '$1,920' }
    };

    // Filled in once Paddle answers; null means "render the USD markup".
    var LOCAL = null;

    var toggle       = document.getElementById('billing-toggle');
    var labelMonthly = document.getElementById('label-monthly');
    var labelAnnual  = document.getElementById('label-annual');
    var annualBadge  = document.getElementById('annual-badge');

    var regionRow    = document.getElementById('region-row');
    var regionSelect = document.getElementById('country-select');
    var regionNote   = document.getElementById('region-note');

    var faqSavePct   = document.getElementById('faq-save-pct');
    var faqProYear   = document.getElementById('faq-pro-annual');
    var faqTeamYear  = document.getElementById('faq-team-annual');

    var PLAN_EL = {
      pro: {
        price:   document.getElementById('pro-price'),
        period:  document.getElementById('pro-period'),
        orig:    document.getElementById('pro-original'),
        savings: document.getElementById('pro-savings')
      },
      team: {
        price:   document.getElementById('team-price'),
        period:  document.getElementById('team-period'),
        orig:    document.getElementById('team-original'),
        savings: document.getElementById('team-savings')
      }
    };

    /* ─── MONEY ───────────────────────────────────────────────────────
       Paddle returns amounts in the currency's smallest unit as strings:
       "1600" is £16.00, but "1600" in yen is ¥1,600. Intl knows how many
       decimal places each currency has, so it decides where the point
       goes rather than a hardcoded /100.

       Trailing ".00" is dropped. The headline price is set in a large
       display weight and "$20" is the shape this page was designed
       around; "$20.00" reads as a receipt. Anything that does not divide
       evenly — a converted annual price split over twelve months — keeps
       its decimals, because rounding those away would be a lie. */
    function currencyDigits(currency) {
      try {
        return new Intl.NumberFormat('en', {
          style: 'currency', currency: currency
        }).resolvedOptions().maximumFractionDigits;
      } catch (e) {
        return 2;
      }
    }

    function money(minorUnits) {
      var digits = currencyDigits(LOCAL.currency);
      var amount = Number(minorUnits) / Math.pow(10, digits);
      var isWhole = Math.abs(amount - Math.round(amount)) < 0.005;

      return new Intl.NumberFormat(LOCALE, {
        style: 'currency',
        currency: LOCAL.currency,
        minimumFractionDigits: isWhole ? 0 : digits,
        maximumFractionDigits: isWhole ? 0 : digits
      }).format(amount);
    }

    /* ─── RENDER ──────────────────────────────────────────────────────
       One source of the three strings each plan needs, so the billing
       toggle does not have to know whether prices came from Paddle or
       from the markup. */
    function displayed(plan) {
      if (!LOCAL) return STATIC[plan];

      var monthly = LOCAL[plan].monthly;
      var annual  = LOCAL[plan].annual;

      return {
        monthly:       money(monthly),
        // The annual plan bills once a year; the headline shows what it
        // works out at per month, with the yearly total spelled out
        // underneath so the actual charge is never hidden.
        annualMonthly: money(Math.round(annual / 12)),
        annualTotal:   money(annual)
      };
    }

    function render() {
      var annual = toggle.checked;

      labelMonthly.classList.toggle('active', !annual);
      labelAnnual.classList.toggle('active', annual);

      ['pro', 'team'].forEach(function (plan) {
        var d = displayed(plan);
        var els = PLAN_EL[plan];

        els.price.textContent  = annual ? d.annualMonthly : d.monthly;
        els.period.textContent = '/ month';

        if (annual) {
          els.orig.textContent = d.monthly;
          els.orig.classList.add('show');
          els.savings.textContent = 'billed ' + d.annualTotal + '/yr';
          els.savings.classList.add('show');
        } else {
          els.orig.classList.remove('show');
          els.savings.classList.remove('show');
        }
      });
    }

    /* The copy that quotes numbers — the "Save 20%" badge and the yearly
       billing answer in the FAQ — has to move with the prices, or the
       page argues with itself in every currency but dollars. The saving
       is recalculated rather than assumed: local price points are set
       per currency and need not land on exactly 20%. */
    function renderCopy() {
      if (!LOCAL) return;

      var pct = Math.round(
        (1 - LOCAL.pro.annual / (LOCAL.pro.monthly * 12)) * 100
      );

      if (pct > 0) {
        annualBadge.textContent = 'Save ' + pct + '%';
        faqSavePct.textContent  = pct + '%';
      }

      faqProYear.textContent  = money(LOCAL.pro.annual) + '/yr';
      faqTeamYear.textContent = money(LOCAL.team.annual) + '/yr';

      var note = 'Prices shown in ' + LOCAL.currency;
      if (LOCAL.taxRate > 0) {
        // Paddle's subtotal is the price before tax, which is the number
        // this page has always shown. Saying so is cheaper than a
        // surprise at the checkout.
        note += ', excluding local sales tax (' +
                Math.round(LOCAL.taxRate * 100) + '% here), added at checkout';
      }
      regionNote.textContent = note + '.';
    }

    /* ─── COUNTRY PICKER ──────────────────────────────────────────────
       IP detection is right most of the time and wrong in exactly the
       cases that matter: a VPN, a work laptop routed through head
       office, someone buying for a team in another country. The picker
       is the escape hatch.

       It is built only after a successful preview, so it can never
       appear as a control that does nothing. */
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

      // Paddle sells into far more countries than are listed above. If
      // the visitor was detected somewhere else, that somewhere else
      // belongs in the list — selecting nothing would read as an error.
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

    /* ─── PADDLE PREVIEW ──────────────────────────────────────────────
       All four price IDs go in one request: mixing billing periods is
       supported, and one round trip means the monthly and yearly
       headlines can never be a currency apart from each other. */
    function loadPrices(countryCode) {
      if (!window.Paddle || typeof Paddle.PricePreview !== 'function') return;

      var request = {
        items: [
          { priceId: PRICE_IDS.pro,        quantity: 1 },
          { priceId: PRICE_IDS.proAnnual,  quantity: 1 },
          { priceId: PRICE_IDS.team,       quantity: 1 },
          { priceId: PRICE_IDS.teamAnnual, quantity: 1 }
        ]
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

        // A partial answer is worse than none: three localised prices
        // and one dollar figure is the exact confusion this is meant to
        // remove. All four or the markup stands.
        var ids = [PRICE_IDS.pro, PRICE_IDS.proAnnual,
                   PRICE_IDS.team, PRICE_IDS.teamAnnual];
        for (var i = 0; i < ids.length; i++) {
          if (!byId[ids[i]]) return;
        }

        function subtotal(id) { return Number(byId[id].totals.subtotal); }

        LOCAL = {
          currency: data.currencyCode,
          country:  (data.address && data.address.countryCode) || countryCode || null,
          taxRate:  Number(byId[PRICE_IDS.pro].taxRate || 0),
          pro:  { monthly: subtotal(PRICE_IDS.pro),  annual: subtotal(PRICE_IDS.proAnnual) },
          team: { monthly: subtotal(PRICE_IDS.team), annual: subtotal(PRICE_IDS.teamAnnual) }
        };

        if (LOCAL.country) buildCountryPicker(LOCAL.country);
        regionRow.hidden = !LOCAL.country;

        render();
        renderCopy();

        // The "from $20/month" teasers on other pages read this instead
        // of loading paddle.js themselves. See price-teaser.js.
        try {
          localStorage.setItem('sigbot.localPrice', JSON.stringify({
            country: LOCAL.country,
            proMonthly: money(LOCAL.pro.monthly),
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

      // Worth naming: it is the clearest signal there is that the
      // detected country was wrong for a real buyer, and it says which
      // markets are asking for prices they were not being shown.
      sigbotTrack('pricing_country_changed', { country: country });

      loadPrices(country);
    });

    toggle.addEventListener('change', function () {
      // Cheap to record and hard to learn any other way: how many people
      // price the annual plan before deciding, not just who buys it.
      sigbotTrack('billing_period_toggled', {
        billing: toggle.checked ? 'annual' : 'monthly'
      });

      render();
    });

    /* ─── CHECKOUT ────────────────────────────────────────────────────
       No address is passed to the checkout on purpose. Paddle geolocates
       there too, by the same method, so the default path already agrees
       with this page; forcing an address in would mean also supplying a
       postal code for the countries that require one, and getting that
       wrong fails the checkout — the one thing on this page that must
       never break. */
    function openCheckout(plan) {
      var isAnnual = toggle.checked;
      var priceId = plan === 'pro'
        ? (isAnnual ? PRICE_IDS.proAnnual : PRICE_IDS.pro)
        : (isAnnual ? PRICE_IDS.teamAnnual : PRICE_IDS.team);

      sigbotTrack('checkout_opened', {
        plan: plan,
        billing: isAnnual ? 'annual' : 'monthly',
        currency: LOCAL ? LOCAL.currency : 'USD',
        country: LOCAL ? LOCAL.country : null
      });

      Paddle.Checkout.open({ items: [{ priceId: priceId, quantity: 1 }] });
    }

    document.getElementById('pro-checkout-btn').addEventListener('click', function () {
      openCheckout('pro');
    });

    document.getElementById('team-checkout-btn').addEventListener('click', function () {
      openCheckout('team');
    });

    (function init() {
      var saved = null;
      try { saved = localStorage.getItem(COUNTRY_KEY); } catch (e) {}
      loadPrices(saved);
    })();
