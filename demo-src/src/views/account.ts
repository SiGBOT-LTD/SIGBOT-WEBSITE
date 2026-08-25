/**
 * Account — mirrors apps/web/src/app/(app)/upgrade/page.tsx, which the
 * sidebar labels "Account": the current plan with its usage, and the
 * plan you would move to.
 *
 * Prices track the pricing page (Pro $20/mo, $192/yr).
 */

import { icons } from '../icons';
import { contacts } from '../data';

const DAILY_LIMIT = 50;
const TOTAL_LIMIT = 300;
const USED_TODAY = 12;

function usageLine(label: string, used: number, limit: number): string {
  const pct = Math.min(100, Math.round((used / limit) * 100));
  return `
    <div class="usage-line">
      <div class="usage-labels">
        <span>${label}</span><span class="tabular">${used} / ${limit}</span>
      </div>
      <div class="usage-track"><div class="usage-fill${pct >= 80 ? ' warn' : ''}" style="width:${pct}%"></div></div>
    </div>`;
}

function feature(text: string): string {
  return `<li>${icons.check}<span>${text}</span></li>`;
}

export function renderAccount(): string {
  return `
    <div class="account-grid">
      <div class="card">
        <div class="stat-head">
          <p class="stat-title">Current plan</p>
          <span class="plan-badge">Free</span>
        </div>
        <div class="plan-row">
          <span class="plan-price">$0</span><span class="plan-period">/ forever</span>
        </div>
        <div style="margin-top:16px">
          ${usageLine('Emails scanned today', USED_TODAY, DAILY_LIMIT)}
          ${usageLine('Emails scanned total', contacts.length, TOTAL_LIMIT)}
        </div>
        <ul class="plan-list">
          ${feature('Scan up to 50 emails/day, 300 total')}
          ${feature('Outlook or a forwarding address &mdash; Gmail &amp; IMAP coming soon')}
          ${feature('AI signature parsing')}
          ${feature('CSV &amp; Excel export')}
          ${feature('Interactive map')}
        </ul>
      </div>

      <div class="card">
        <div class="stat-head">
          <p class="stat-title">Pro</p>
          <span class="plan-badge">Recommended</span>
        </div>
        <div class="plan-row">
          <span class="plan-price">$20</span><span class="plan-period">/ month, or $192 billed yearly</span>
        </div>
        <ul class="plan-list">
          ${feature('Unlimited scanning — 2,000 emails/day')}
          ${feature('Unlimited contacts')}
          ${feature('Full inbox backfill')}
          ${feature('Bulk import &amp; export')}
          ${feature('Mobile app + business card scanning')}
        </ul>
        <button class="usage-upgrade" style="margin-top:16px"
          data-demo="Checkout is disabled in this demo — upgrade from the real app at sigbot.app.">
          Upgrade to Pro
        </button>
      </div>
    </div>`;
}
