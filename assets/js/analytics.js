/* ─── POSTHOG ANALYTICS ───────────────────────────────────────────
   The site is static HTML with no build step, so the project token
   lives here rather than in each page. Every page loads this one file;
   change the two values below and the whole site follows.

   The guard matters: until a real token is set, this file does nothing
   at all — no network calls, no cookies, no `posthog` global. A site
   with analytics misconfigured should behave exactly like a site with
   no analytics, not a broken one.

   Loader body below is PostHog's published HTML snippet, verbatim. It
   stubs the API, queues calls, and swaps in the real library once
   /static/array.js lands, so `posthog.capture(...)` is safe to call
   from any page script immediately. */

/* Project settings — from PostHog: Settings → Project → Project API key. */
var POSTHOG_KEY = 'phc_qdQVQSmr85uTi2utSvNrKpVXEhToGhPGATiuo6PuyFxx';
var POSTHOG_HOST = 'https://eu.i.posthog.com';  // US projects: https://us.i.posthog.com

(function () {
  if (POSTHOG_KEY.indexOf('phc_') !== 0 || POSTHOG_KEY.indexOf('REPLACE') !== -1) return;

  !function(t,e){var o,n,p,r;e.__SV||(window.posthog=e,e._i=[],e.init=function(i,s,a){function g(t,e){var o=e.split(".");2==o.length&&(t=t[o[0]],e=o[1]),t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}}(p=t.createElement("script")).type="text/javascript",p.crossOrigin="anonymous",p.async=!0,p.src=s.api_host.replace(".i.posthog.com","-assets.i.posthog.com")+"/static/array.js",(r=t.getElementsByTagName("script")[0]).parentNode.insertBefore(p,r);var u=e;for(void 0!==a?u=e[a]=[]:a="posthog",u.people=u.people||[],u.toString=function(t){var e="posthog";return"posthog"!==a&&(e+="."+a),t||(e+=" (stub)"),e},u.people.toString=function(){return u.toString(1)+".people (stub)"},o="init capture register register_once register_for_session unregister unregister_for_session getFeatureFlag getFeatureFlagResult isFeatureEnabled reloadFeatureFlags updateEarlyAccessFeatureEnrollment getEarlyAccessFeatures on onFeatureFlags onSessionId getSurveys getActiveMatchingSurveys renderSurvey canRenderSurvey getNextSurveyStep identify setPersonProperties group resetGroups setPersonPropertiesForFlags resetPersonPropertiesForFlags setGroupPropertiesForFlags resetGroupPropertiesForFlags reset get_distinct_id getGroups get_session_id get_session_replay_url alias set_config startSessionRecording stopSessionRecording sessionRecordingStarted captureException loadToolbar get_property getSessionProperty createPersonProfile opt_in_capturing opt_out_capturing has_opted_in_capturing has_opted_out_capturing clear_opt_in_out_capturing debug".split(" "),n=0;n<o.length;n++)g(u,o[n]);e._i.push([i,s,a])},e.__SV=1)}(document,window.posthog||[]);

  posthog.init(POSTHOG_KEY, {
    api_host: POSTHOG_HOST,
    defaults: '2026-05-30'
  });
})();

/* ─── TRACKING HELPER ─────────────────────────────────────────────
   Page scripts call sigbotTrack() rather than posthog.capture() so a
   missing token, a blocked CDN, or an ad blocker can never turn a
   analytics line into a TypeError that halts the surrounding handler.
   The signup flow in particular runs tracking next to navigation, and
   an exception there would strand someone mid-onboarding.

   `page` rides along on every event because the same CTA text appears
   on several pages and "which page did this convert from" is the whole
   question. PostHog's own $current_url is the full URL; this is the
   short name used for grouping. */
function sigbotPage() {
  var path = window.location.pathname.replace(/\/index\.html$/, '/');
  if (path === '/' || path === '') return 'home';
  return path.replace(/^\//, '').replace(/\.html$/, '');
}

function sigbotTrack(event, props) {
  try {
    if (!window.posthog || typeof window.posthog.capture !== 'function') return;
    var payload = props || {};
    payload.page = sigbotPage();
    window.posthog.capture(event, payload);
  } catch (e) { /* analytics must never break the page */ }
}

/* ─── SITE-WIDE CTA CLICKS ────────────────────────────────────────
   Autocapture already records that a click happened, but it identifies
   elements by DOM path, so a nav restyle silently renames the thing
   you have been trending for months. These named events survive markup
   changes, and they resolve the destination rather than the wording —
   "Start free", "Get started", and "Try it free" are one funnel step,
   not three.

   Delegated from the document so it covers every page and every link
   added later, including the ones inside the nav dropdown. */
(function () {
  var DESTINATIONS = [
    { test: /sigbot\.app\/login/, name: 'login' },
    { test: /get-started/, name: 'get_started' },
    { test: /pricing/, name: 'pricing' },
    { test: /demo/, name: 'demo' },
    { test: /contact/, name: 'contact' }
  ];

  document.addEventListener('click', function (e) {
    var link = e.target && e.target.closest && e.target.closest('a[href]');
    if (!link) return;

    var href = link.getAttribute('href') || '';
    if (href.charAt(0) === '#') return;

    var match = null;
    for (var i = 0; i < DESTINATIONS.length; i++) {
      if (DESTINATIONS[i].test.test(href)) { match = DESTINATIONS[i].name; break; }
    }
    if (!match) return;

    // Where on the page it was clicked. A hero CTA and the same CTA in the
    // footer convert at very different rates, and averaging them hides that.
    var section = link.closest('section[id], header, footer, nav, .nav-wrap');
    var location = section
      ? (section.id || section.tagName.toLowerCase())
      : 'body';

    sigbotTrack('cta_clicked', {
      destination: match,
      location: location,
      label: (link.textContent || '').trim().slice(0, 60),
      href: href
    });
  }, true);
})();
