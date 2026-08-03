Paddle.Initialize({
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

    var PRICE_IDS = {
      pro:        'pri_01kpq42h593dy8h8s01cb9bxes',
      proAnnual:  'pri_01ksbbc7cr7nyy93gvmznm17xf',
      team:       'pri_01kpq6tvcwxkntrdra0781evfk',
      teamAnnual: 'pri_01ksbbghb3ajgnvrf0xsycptgx'
    };

    document.getElementById('pro-checkout-btn').addEventListener('click', function() {
      var isAnnual = document.getElementById('billing-toggle').checked;
      sigbotTrack('checkout_opened', { plan: 'pro', billing: isAnnual ? 'annual' : 'monthly' });
      Paddle.Checkout.open({
        items: [{ priceId: isAnnual ? PRICE_IDS.proAnnual : PRICE_IDS.pro, quantity: 1 }]
      });
    });

    document.getElementById('team-checkout-btn').addEventListener('click', function() {
      var isAnnual = document.getElementById('billing-toggle').checked;
      sigbotTrack('checkout_opened', { plan: 'team', billing: isAnnual ? 'annual' : 'monthly' });
      Paddle.Checkout.open({
        items: [{ priceId: isAnnual ? PRICE_IDS.teamAnnual : PRICE_IDS.team, quantity: 1 }]
      });
    });

    const toggle = document.getElementById("billing-toggle");
    const labelMonthly = document.getElementById("label-monthly");
    const labelAnnual = document.getElementById("label-annual");

    const proPrice   = document.getElementById("pro-price");
    const proPeriod  = document.getElementById("pro-period");
    const proOrig    = document.getElementById("pro-original");
    const proSavings = document.getElementById("pro-savings");

    const teamPrice   = document.getElementById("team-price");
    const teamPeriod  = document.getElementById("team-period");
    const teamOrig    = document.getElementById("team-original");
    const teamSavings = document.getElementById("team-savings");

    toggle.addEventListener("change", () => {
      const annual = toggle.checked;

      // Cheap to record and hard to learn any other way: how many people
      // price the annual plan before deciding, not just who buys it.
      sigbotTrack('billing_period_toggled', { billing: annual ? 'annual' : 'monthly' });

      labelMonthly.classList.toggle("active", !annual);
      labelAnnual.classList.toggle("active", annual);

      if (annual) {
        proPrice.textContent   = "$16";
        proPeriod.textContent  = "/ month";
        proOrig.textContent    = "$20";
        proOrig.classList.add("show");
        proSavings.classList.add("show");

        teamPrice.textContent   = "$160";
        teamPeriod.textContent  = "/ month";
        teamOrig.textContent    = "$200";
        teamOrig.classList.add("show");
        teamSavings.classList.add("show");
      } else {
        proPrice.textContent   = "$20";
        proPeriod.textContent  = "/ month";
        proOrig.classList.remove("show");
        proSavings.classList.remove("show");

        teamPrice.textContent   = "$200";
        teamPeriod.textContent  = "/ month";
        teamOrig.classList.remove("show");
        teamSavings.classList.remove("show");
      }
    });
