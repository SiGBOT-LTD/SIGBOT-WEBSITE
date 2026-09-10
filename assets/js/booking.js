/* ─── BOOKING / ENQUIRY FORM ──────────────────────────────────────
   Posts to the Cloud Function that records the enquiry, emails
   support@sigbot.co with Reply-To set to the sender, and confirms back
   to them. Replaces the old mailto: handoff, which only worked for
   people with a desktop mail client wired up and told us nothing when
   it didn't.

   Progressive by design. If the endpoint is unreachable — offline, an
   ad blocker eating the request, the function cold and slow — the form
   falls back to the same mailto: it used to be, pre-filled, so the
   enquiry still has somewhere to go. A booking page that can fail
   closed is worse than one that degrades.

   Used by book.html and contact.html. Needs site-config.js first. */
(function () {
  var CONFIG = window.SIGBOT_CONFIG || {};
  var SUPPORT = CONFIG.SUPPORT_EMAIL || 'support@sigbot.co';

  /* What each enquiry is about: the kind sent to the server, the heading,
     and whether asking "when suits?" makes sense. Keys match the `kind`
     the function accepts. */
  var TOPICS = {
    build: {
      title: 'Book a call about a build',
      blurb: 'Twenty minutes. Ten to hear how bid day works today, ten to pick the right build. No demo unless you want one.',
      scheduling: true,
    },
    pilot: {
      title: 'Talk about a 60-day pilot',
      blurb: 'We agree what the pilot should prove, who is involved, and when it starts. Twenty minutes.',
      scheduling: true,
    },
    team: {
      title: 'Team rollout',
      blurb: 'Tell us how many mailboxes and how your projects are organised, and we will come back with a plan and a price.',
      scheduling: true,
    },
    enterprise: {
      title: 'Enterprise enquiry',
      blurb: 'Custom contracts, SSO, security review, invoicing. Tell us what you need and we will set up a call.',
      scheduling: true,
    },
    demo: {
      title: 'See a demo',
      blurb: 'A walk through Sigbot on real data, on a call, at a time that suits you.',
      scheduling: true,
    },
    support: {
      title: 'Contact support',
      blurb: 'Tell us what is happening and we will pick it up — usually the same day.',
      scheduling: false,
    },
  };

  function topicFromQuery() {
    var m = /[?&]topic=([a-z]+)/.exec(window.location.search);
    var key = m && m[1];
    return TOPICS[key] ? key : null;
  }

  /* Fall back to the address the whole site already used. */
  function mailtoFor(kind, data) {
    var lines = [
      data.message || '',
      '',
      data.preferredTimes ? 'When suits: ' + data.preferredTimes : '',
      data.company ? 'Company: ' + data.company : '',
      data.phone ? 'Phone: ' + data.phone : '',
      '— ' + data.name + ' (' + data.email + ')',
    ].filter(Boolean);
    var subject = (TOPICS[kind] || TOPICS.support).title;
    return 'mailto:' + SUPPORT +
      '?subject=' + encodeURIComponent('Sigbot — ' + subject) +
      '&body=' + encodeURIComponent(lines.join('\n'));
  }

  function track(event, props) {
    if (typeof sigbotTrack === 'function') sigbotTrack(event, props);
  }

  /**
   * Wire a form up. The form supplies the fields; this owns submission,
   * the button state, and what the person is told afterwards.
   */
  window.sigbotWireEnquiryForm = function (form, opts) {
    opts = opts || {};
    var kind = opts.kind || 'support';
    var status = document.getElementById(opts.statusId || 'form-status');
    var button = form.querySelector('button[type="submit"]');
    var buttonText = button ? button.textContent : 'Send';

    function say(text, tone) {
      if (!status) return;
      status.textContent = text;
      status.hidden = false;
      status.className = 'form-status' + (tone ? ' form-status--' + tone : '');
    }

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var el = form.elements;
      var data = {
        kind: kind,
        name: (el.name && el.name.value || '').trim(),
        email: (el.email && el.email.value || '').trim(),
        company: (el.company && el.company.value || '').trim(),
        phone: (el.phone && el.phone.value || '').trim(),
        message: (el.message && el.message.value || '').trim(),
        preferredTimes: (el.preferredTimes && el.preferredTimes.value || '').trim(),
        /* Honeypot: hidden from people, irresistible to naive bots. */
        website: (el.website && el.website.value || '').trim(),
        sourcePage: window.location.pathname + window.location.search,
      };

      if (!data.name || !data.email) {
        say('Please fill in your name and email.', 'error');
        return;
      }
      if (!data.message && !data.preferredTimes) {
        say('Tell us a little about what you need.', 'error');
        return;
      }

      if (button) { button.disabled = true; button.textContent = 'Sending…'; }
      say('Sending…');
      track('enquiry_submitted', { kind: kind });

      var endpoint = CONFIG.CONTACT_ENDPOINT;
      var timeout = setTimeout(function () { controller.abort(); }, 15000);
      var controller = new AbortController();

      fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
        signal: controller.signal,
      })
        .then(function (res) {
          clearTimeout(timeout);
          return res.json().then(function (json) { return { ok: res.ok, json: json }; });
        })
        .then(function (r) {
          if (!r.ok) throw new Error((r.json && r.json.error) || 'Request failed');
          form.hidden = true;
          say('', null);
          var done = document.getElementById('form-done');
          if (done) done.hidden = false;
          track('enquiry_sent', { kind: kind });
        })
        .catch(function (err) {
          clearTimeout(timeout);
          if (button) { button.disabled = false; button.textContent = buttonText; }
          /* Never a dead end: hand them the pre-filled email instead. */
          var reason = (err && err.message) || 'network';
          track('enquiry_failed', { kind: kind, reason: reason.slice(0, 60) });
          say('We could not send that from here. Opening your email app instead — or write to ' + SUPPORT + '.', 'error');
          window.location.href = mailtoFor(kind, data);
        });
    });
  };

  /* ─── book.html ──────────────────────────────────────────────────
     One page for every "book a call" button, told what it is about by
     ?topic=. With a Calendly link configured it hands straight over to
     the calendar; without one it shows the form. */
  window.sigbotInitBookingPage = function () {
    var kind = topicFromQuery() || 'build';
    var topic = TOPICS[kind];

    var title = document.getElementById('book-title');
    var blurb = document.getElementById('book-blurb');
    if (title) title.textContent = topic.title;
    if (blurb) blurb.textContent = topic.blurb;
    document.title = topic.title + ' | Sigbot';

    /* Scheduling questions only make sense for a call. */
    var timesGroup = document.getElementById('group-preferredTimes');
    if (timesGroup && !topic.scheduling) timesGroup.hidden = true;

    var calendly = (CONFIG.CALENDLY_URL || '').trim();
    var calendarPanel = document.getElementById('book-calendar');
    var formPanel = document.getElementById('book-form-panel');

    if (calendly && calendarPanel && formPanel) {
      /* Calendly configured: embed it, keep the form available underneath
         for anyone who would rather write than pick a slot. */
      var frame = document.createElement('iframe');
      frame.src = calendly + (calendly.indexOf('?') >= 0 ? '&' : '?') +
        'hide_gdpr_banner=1&background_color=0f1117&text_color=e2e4e9';
      frame.title = 'Choose a time';
      frame.loading = 'lazy';
      frame.className = 'calendly-frame';
      calendarPanel.appendChild(frame);
      calendarPanel.hidden = false;
      var toggle = document.getElementById('book-form-toggle');
      if (toggle) toggle.hidden = false;
      formPanel.hidden = true;
      if (toggle) {
        toggle.addEventListener('click', function () {
          formPanel.hidden = !formPanel.hidden;
          toggle.textContent = formPanel.hidden
            ? 'Rather send a message?'
            : 'Rather pick a time?';
        });
      }
      track('booking_calendar_shown', { kind: kind });
    }

    var form = document.getElementById('enquiry-form');
    if (form) window.sigbotWireEnquiryForm(form, { kind: kind });
  };
})();
