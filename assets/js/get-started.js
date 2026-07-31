/* Signup flow — front end only.
 *
 * Every call that has to reach a server is stubbed and marked with
 * `BACKEND HOOK`. Search this file for that string to find every wire-up
 * point; nothing else in here needs changing to go live.
 *
 * The four stages are a state machine over `hidden`, so the DOM state and
 * the visual state can never disagree, and focus moves to the heading of
 * whichever stage just opened.
 *
 * Stage 03 drives the extraction card exactly the way hero-extract.js does
 * — amber marks the line being read, mint confirms the field that landed —
 * because it is the same component saying the same thing about real mail.
 */
(function () {
  var root = document.getElementById('stage-account');
  if (!root) return;

  var STAGES = ['account', 'inbox', 'scan', 'plan'];

  var reduceMotion = window.matchMedia
    && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ── Chrome ────────────────────────────────────────────────────── */

  var toastEl = document.getElementById('gs-toast');
  var toastTimer = null;

  function toast(message) {
    if (!toastEl) return;
    toastEl.textContent = message;
    toastEl.classList.add('is-shown');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () {
      toastEl.classList.remove('is-shown');
    }, 2600);
  }

  function showError(el, message) {
    if (!el) return;
    el.textContent = message;
    el.hidden = false;
  }

  function clearError(el) {
    if (!el) return;
    el.hidden = true;
  }

  /* ── Stage machine ─────────────────────────────────────────────── */

  function goStage(name) {
    var index = STAGES.indexOf(name);
    if (index < 0) return;

    STAGES.forEach(function (stage) {
      var section = document.getElementById('stage-' + stage);
      if (!section) return;
      var active = stage === name;
      section.hidden = !active;
      section.classList.toggle('is-active', active);
    });

    document.querySelectorAll('.gs-step').forEach(function (step) {
      var at = STAGES.indexOf(step.dataset.step);
      step.classList.toggle('is-current', at === index);
      step.classList.toggle('is-done', at < index);
      if (at === index) {
        step.setAttribute('aria-current', 'step');
      } else {
        step.removeAttribute('aria-current');
      }
    });

    // Focus the heading of the stage that just opened, so a keyboard or
    // screen-reader user lands where the sighted user is looking.
    var heading = document.querySelector('#stage-' + name + ' .gs-title');
    if (heading) {
      heading.setAttribute('tabindex', '-1');
      heading.focus({ preventScroll: true });
    }
    window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
  }

  document.querySelectorAll('[data-back]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      goStage(btn.dataset.back);
    });
  });

  document.querySelectorAll('[data-go]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      goStage(btn.dataset.go);
    });
  });

  /* ── Stage 01: account ─────────────────────────────────────────── */

  var accountError = document.getElementById('gs-account-error');

  document.querySelector('[data-signup="microsoft"]').addEventListener('click', function () {
    // BACKEND HOOK — Microsoft sign-in.
    //   Firebase OAuthProvider('microsoft.com') with the Mail.Read scope, so
    //   the same consent creates the account and connects the mailbox.
    //   On success: write the user doc { plan: 'free', onboardingStep: 'scanning' },
    //   POST the token to the inbox-connect endpoint, then call startScan().
    //   On failure: showError(accountError, <what went wrong and what to do>).
    toast('Signed in with Microsoft — Outlook connected');
    markInboxConnected();
    goStage('scan');
    startScan();
  });

  document.getElementById('gs-account-form').addEventListener('submit', function (e) {
    e.preventDefault();
    var email = document.getElementById('gs-email');
    var password = document.getElementById('gs-password');

    if (!email.value.trim() || !email.checkValidity()) {
      showError(accountError, 'That email address is not complete. Check it and try again.');
      email.focus();
      return;
    }
    if (password.value.length < 8) {
      showError(accountError, 'Passwords need at least 8 characters.');
      password.focus();
      return;
    }
    clearError(accountError);

    // BACKEND HOOK — email sign-up.
    //   createUserWithEmailAndPassword(email.value, password.value), then
    //   write the user doc { plan: 'free', onboardingStep: 'connect_inbox' }.
    //   Send the verification mail here too if you want it before the scan.
    //   On failure (address already in use, weak password): pass the message
    //   to showError(accountError, …) rather than an alert.
    goStage('inbox');
  });

  /* ── Stage 02: inbox ───────────────────────────────────────────── */

  // Step 02 is complete whichever route got used, including the Microsoft
  // one that skipped past it.
  function markInboxConnected() {
    var step = document.querySelector('.gs-step[data-step="inbox"]');
    if (step) step.classList.add('is-done');
  }

  var imapToggle = document.getElementById('gs-imap-toggle');
  var imapForm = document.getElementById('gs-imap-form');
  var imapError = document.getElementById('gs-imap-error');

  imapToggle.addEventListener('click', function () {
    var open = imapForm.hidden;
    imapForm.hidden = !open;
    imapToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    imapToggle.textContent = open ? 'Hide IMAP settings' : 'Set up IMAP';
    if (open) document.getElementById('gs-imap-email').focus();
  });

  imapForm.addEventListener('submit', function (e) {
    e.preventDefault();
    var address = document.getElementById('gs-imap-email');
    var host = document.getElementById('gs-imap-host');
    var port = document.getElementById('gs-imap-port');
    var appPassword = document.getElementById('gs-imap-pw');

    if (!address.value.trim() || !address.checkValidity()) {
      showError(imapError, 'Enter the address of the inbox you want read.');
      address.focus();
      return;
    }
    if (!host.value.trim()) {
      showError(imapError, 'Enter your IMAP host — Gmail is imap.gmail.com.');
      host.focus();
      return;
    }
    if (!/^\d+$/.test(port.value.trim())) {
      showError(imapError, 'The port is a number. 993 covers almost every provider.');
      port.focus();
      return;
    }
    if (!appPassword.value) {
      showError(imapError, 'Paste the app password your provider generated.');
      appPassword.focus();
      return;
    }
    clearError(imapError);

    // BACKEND HOOK — IMAP connect.
    //   POST { email, host, port, appPassword } to the inbox-connect endpoint
    //   over TLS and clear the password field as soon as the request is sent.
    //   Do not persist it anywhere in the browser.
    //   On a rejected login, showError(imapError, 'That app password was
    //   refused by <host>. Generate a new one and try again.').
    appPassword.value = '';
    markInboxConnected();
    goStage('scan');
    startScan();
  });

  document.querySelector('[data-connect="outlook"]').addEventListener('click', function () {
    // BACKEND HOOK — Outlook connect.
    //   Trigger the Microsoft consent flow for Mail.Read (or reuse the token
    //   from sign-in), then POST it to the inbox-connect endpoint.
    markInboxConnected();
    goStage('scan');
    startScan();
  });

  document.querySelector('[data-connect="forwarding"]').addEventListener('click', function () {
    // BACKEND HOOK — forwarding.
    //   The address in #gs-forward-addr is a placeholder. Render the real
    //   per-user address the API issued, and only advance once at least one
    //   message has arrived at it.
    markInboxConnected();
    goStage('scan');
    startScan();
  });

  var copyBtn = document.getElementById('gs-forward-copy');
  copyBtn.addEventListener('click', function () {
    var address = document.getElementById('gs-forward-addr').textContent.trim();
    var done = function () {
      copyBtn.textContent = 'Copied';
      copyBtn.classList.add('is-copied');
      setTimeout(function () {
        copyBtn.textContent = 'Copy';
        copyBtn.classList.remove('is-copied');
      }, 2000);
    };

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(address).then(done, function () {
        toast('Copying was blocked. Select the address and copy it by hand.');
      });
    } else {
      toast('Copying was blocked. Select the address and copy it by hand.');
    }
  });

  /* ── Stage 03: the first scan ──────────────────────────────────── */

  /* Sample signatures, used only until the scan endpoint is streaming.
     BACKEND HOOK — first scan.
       Poll or stream your scan job and expect roughly:
         { emailsRead, contactsFound, companies, done, contact: {...} }
       Then per update: readSignature(contact) to run the card, fileContact()
       to add it to the ledger, setMeters(...) for the counters and bar, and
       finishScan(contactsFound, emailsRead) when done is true. Delete SAMPLES
       and the pacing timer below once real records arrive. */
  var SAMPLES = [
    {
      pre: 'Happy to get the revised drawings over to you.',
      source: 'Inbox — RE: Foundation package',
      name: 'Marcus Bright',
      title: 'Senior Project Manager',
      company: 'Northgate Construction',
      phone: '+44 7700 900418',
      email: 'm.bright@northgate.co.uk'
    },
    {
      pre: 'Costs attached, shout if anything looks off.',
      source: 'Inbox — Cost plan rev C',
      name: 'Dana Reyes',
      title: 'Quantity Surveyor',
      company: 'Meridian Build Group',
      phone: '(604) 555-0172',
      email: 'dreyes@meridianbuild.com'
    },
    {
      pre: 'We can hold that price until the end of the month.',
      source: 'Inbox — Steel quote',
      name: 'Priya Nair',
      title: 'Procurement Lead',
      company: 'Cascade Contractors',
      phone: '+1 778 555 0143',
      email: 'priya.nair@cascadegc.com'
    },
    {
      pre: 'Site is clear from Tuesday.',
      source: 'Inbox — Access week 14',
      name: 'Tom Achebe',
      title: 'Site Supervisor',
      company: 'Halden Groundworks',
      phone: '+44 7700 900233',
      email: 't.achebe@haldengw.co.uk'
    }
  ];

  // Stand-in for the mailbox size until the backend reports it.
  var TARGET_EMAILS = 142;
  var READ_MS = 480;   // how long a line stays highlighted
  var GAP_MS = 900;    // pause on a finished record before the next message

  var scanEls = {
    card: document.getElementById('gs-extract'),
    source: document.getElementById('gs-extract-src'),
    pre: document.getElementById('gs-sig-pre'),
    read: document.getElementById('gs-read'),
    found: document.getElementById('gs-found'),
    companies: document.getElementById('gs-companies'),
    bar: document.getElementById('gs-bar'),
    caption: document.getElementById('gs-scan-caption'),
    ledger: document.getElementById('gs-ledger'),
    ledgerEmpty: document.getElementById('gs-ledger-empty'),
    done: document.getElementById('gs-scan-done')
  };

  var siglines = [].slice.call(document.querySelectorAll('#gs-extract .sigline[data-field]'));
  var rows = [].slice.call(document.querySelectorAll('#gs-extract .erow[data-row]'));

  var scanState = { started: false, emails: 0, found: 0, companyCount: 0, timers: [] };

  function later(fn, ms) {
    var t = setTimeout(fn, ms);
    scanState.timers.push(t);
    return t;
  }

  function paintSignature(contact) {
    scanEls.source.textContent = contact.source;
    scanEls.pre.textContent = contact.pre;
    siglines.forEach(function (line) {
      line.textContent = contact[line.dataset.field] || '';
      line.classList.remove('is-reading', 'is-done');
    });
    rows.forEach(function (row) {
      row.querySelector('.erow-val').textContent = contact[row.dataset.row] || '';
      row.classList.remove('is-in');
    });
  }

  function fileContact(contact) {
    var item = document.createElement('li');
    item.innerHTML =
      '<svg class="gs-ledger-check" viewBox="0 0 24 24" fill="none" stroke="currentColor" ' +
      'stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
      '<polyline points="20 6 9 17 4 12"></polyline></svg>' +
      '<span><span class="gs-ledger-name"></span>' +
      '<span class="gs-ledger-meta"></span></span>';
    item.querySelector('.gs-ledger-name').textContent = contact.name;
    item.querySelector('.gs-ledger-meta').textContent = contact.company + ' · ' + contact.email;

    scanEls.ledger.prepend(item);
    scanEls.ledgerEmpty.hidden = true;
    while (scanEls.ledger.children.length > 5) {
      scanEls.ledger.lastElementChild.remove();
    }
  }

  /* The card draws one signature at a time; the counters count the whole
     job. They are not the same rate and should not pretend to be — the
     ledger is the last few records, not all of them.
     BACKEND HOOK — pass the real emailsRead / contactsFound / companies
     straight through and delete the ratios. */
  var CONTACTS_PER_EMAIL = 0.26;
  var COMPANIES_PER_CONTACT = 0.55;

  function setMeters(emailsRead, total) {
    scanState.emails = emailsRead;
    scanState.found = Math.round(emailsRead * CONTACTS_PER_EMAIL);
    scanState.companyCount = Math.max(
      scanState.found ? 1 : 0,
      Math.round(scanState.found * COMPANIES_PER_CONTACT)
    );

    scanEls.read.textContent = emailsRead;
    scanEls.found.textContent = scanState.found;
    scanEls.companies.textContent = scanState.companyCount;

    var pct = Math.min(100, Math.round((emailsRead / total) * 100));
    scanEls.bar.querySelector('i').style.width = pct + '%';
    scanEls.bar.setAttribute('aria-valuenow', pct);
    scanEls.caption.textContent = 'Reading signatures — ' + emailsRead + ' of ' + total + ' messages';
  }

  // Walks one signature line by line, then files the contact.
  function readSignature(contact, onDone) {
    paintSignature(contact);

    (function step(i) {
      if (i >= siglines.length) {
        if (onDone) later(onDone, GAP_MS);
        return;
      }
      if (i > 0) {
        siglines[i - 1].classList.remove('is-reading');
        siglines[i - 1].classList.add('is-done');
      }
      siglines[i].classList.add('is-reading');
      var row = rows.filter(function (r) { return r.dataset.row === siglines[i].dataset.field; })[0];
      if (row) row.classList.add('is-in');

      later(function () {
        if (i === siglines.length - 1) {
          siglines[i].classList.remove('is-reading');
          siglines[i].classList.add('is-done');
          fileContact(contact);
        }
        step(i + 1);
      }, READ_MS);
    })(0);
  }

  function startScan() {
    if (scanState.started) return;
    scanState.started = true;

    // Reduced motion gets the same information without the loop: one
    // completed record, the ledger filled, and the finished counts.
    if (reduceMotion) {
      SAMPLES.forEach(function (contact) { fileContact(contact); });
      paintSignature(SAMPLES[0]);
      siglines.forEach(function (l) { l.classList.add('is-done'); });
      rows.forEach(function (r) { r.classList.add('is-in'); });
      setMeters(TARGET_EMAILS, TARGET_EMAILS);
      scanEls.caption.textContent = 'Scan complete — ' + TARGET_EMAILS + ' messages read';
      finishScan(scanState.found, TARGET_EMAILS);
      return;
    }

    var index = 0;
    (function next() {
      readSignature(SAMPLES[index % SAMPLES.length], next);
      index += 1;
    })();

    // The message counter runs on its own: mail is read faster than
    // signatures are drawn, and pretending otherwise would be a lie about
    // how quickly the scan actually moves.
    var tick = setInterval(function () {
      var read = Math.min(TARGET_EMAILS, scanState.emails + Math.ceil(Math.random() * 6));
      setMeters(read, TARGET_EMAILS);
      if (read >= TARGET_EMAILS) {
        clearInterval(tick);
        scanState.timers.forEach(clearTimeout);
        scanEls.caption.textContent = 'Scan complete — ' + TARGET_EMAILS + ' messages read';
        finishScan(scanState.found, TARGET_EMAILS);
      }
    }, 280);
    scanState.timers.push(tick);
  }

  function finishScan(contactCount, emailsRead) {
    // The count is the reason anyone finished the flow, so it only appears
    // once there is a real one. Deep-linking to the plan stage shows the
    // plans, not a headline reading "0 contacts".
    document.getElementById('gs-result-count').textContent = contactCount;
    document.getElementById('gs-result').hidden = false;

    // The free plan scans 300 emails, 50 a day. Only say the cap is close
    // when this mailbox actually runs past it.
    if (emailsRead > 300) {
      document.getElementById('gs-cap-note').hidden = false;
    }

    // The last step is always taken deliberately: nothing auto-advances
    // onto a page that asks for money.
    scanEls.done.hidden = false;
  }

  /* ── Stage 04: plan ────────────────────────────────────────────── */

  document.querySelectorAll('[data-plan]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      if (btn.dataset.plan === 'pro') {
        // BACKEND HOOK — Pro checkout.
        //   Load Paddle.js on this page and reuse the token and price IDs
        //   already in assets/js/pricing.js:
        //     Paddle.Checkout.open({
        //       items: [{ priceId: PRICE_IDS.pro, quantity: 1 }],
        //       customer: { email: <the address they signed up with> }
        //     });
        //   The eventCallback in pricing.js already routes a completed
        //   checkout to sigbot.app/dashboard.
        toast('Opening checkout…');
      } else {
        // BACKEND HOOK — stay free.
        //   Set { plan: 'free', onboardingStep: 'complete' } on the user doc.
        toast('You are on Starter. Taking you to your contacts…');
      }

      // BACKEND HOOK — hand off to the app.
      //   window.location.href = 'https://sigbot.app/dashboard';
    });
  });

  /* ── Resuming ──────────────────────────────────────────────────────
     Someone who signed up on Monday and comes back on Tuesday should land
     where they stopped rather than at the top.
     BACKEND HOOK — read onboardingStep off the user doc and open that stage.
     The query string is only how the app can deep-link back in today
     (get-started.html?step=inbox); it must not be trusted once the user doc
     is the source of truth. Runs last so every stage is wired first. */
  var requested = new URLSearchParams(window.location.search).get('step');
  if (requested && STAGES.indexOf(requested) > 0) {
    goStage(requested);
    if (requested === 'scan') startScan();
  }
})();
