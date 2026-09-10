/* ─── SITE CONFIG ─────────────────────────────────────────────────
   The handful of values that more than one page needs, in one file so
   there is exactly one line to change when they move.

   ► TO TURN ON CALENDLY: put the scheduling link in CALENDLY_URL below,
     commit, push. Every "Book a call" button on the site switches from
     the request form to the live calendar by itself — book.html embeds
     it, and nothing else has to change.

     e.g. CALENDLY_URL: 'https://calendly.com/sigbot/20min'

     Left empty (the state today) the site uses its own booking form,
     which posts to CONTACT_ENDPOINT and lands in support@sigbot.co with
     a confirmation to the person who asked. That path is complete on its
     own — Calendly is an upgrade to it, not a dependency.

   Loaded before any script that reads it; plain global, no modules, in
   keeping with the rest of the site (static HTML, no build step). */
window.SIGBOT_CONFIG = {
  /** Calendly (or any scheduling) link. Empty string = use the form. */
  CALENDLY_URL: '',

  /**
   * Cloud Function that records an enquiry, emails support@sigbot.co with
   * Reply-To set to the sender, and confirms back to them.
   * Region must match FUNCTIONS_REGION in @sigbot/shared (europe-west2).
   */
  CONTACT_ENDPOINT:
    'https://europe-west2-sigbot-prod.cloudfunctions.net/submitContactRequest',

  /** Where to tell people to write when all else fails. */
  SUPPORT_EMAIL: 'support@sigbot.co',
};
