/**
 * Dashboard — mirrors apps/web/src/app/(app)/dashboard/page.tsx.
 *
 * Same composition in the same order: four stat cards (Total Contacts,
 * Top Company, Top Role, Growth), the Contact Growth chart, then a
 * three-column row of Recent Contacts, Recent Activity and Data
 * Completeness with source chips underneath.
 */

import { icons } from '../icons';
import {
  contacts,
  getTopCompany,
  getTopRole,
  getTimeAgo,
  getInitials,
  type Contact,
} from '../data';

// ── Stats ─────────────────────────────────────────────────────────

function countCompany(company: string): number {
  return contacts.filter((c) => c.company === company).length;
}

function countRole(role: string): number {
  return contacts.filter((c) => c.jobTitle === role).length;
}

/** Percentage of contacts carrying a usable value in `field`. */
function completeness(field: keyof Contact): number {
  const filled = contacts.filter((c) => {
    const v = c[field];
    return typeof v === 'string' && v.trim() !== '' && v !== '—';
  }).length;
  return Math.round((filled / contacts.length) * 100);
}

function statCard(title: string, value: string, subtitle: string, icon: string): string {
  return `
    <div class="card">
      <div class="stat-head">
        <p class="stat-title">${title}</p>
        ${icon}
      </div>
      <p class="stat-value">${value}</p>
      <p class="stat-sub">${subtitle}</p>
    </div>`;
}

// ── Growth chart ──────────────────────────────────────────────────
// components/dashboard/growth-chart.tsx plots the cumulative contact
// count over time; this draws the same series as a plain SVG polyline.

function growthChart(): string {
  const w = 900;
  const h = 200;
  const padL = 38;
  const padR = 12;
  const padT = 12;
  const padB = 24;

  const sorted = [...contacts].sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  );

  const points = sorted.map((c, i) => ({ t: new Date(c.createdAt).getTime(), n: i + 1 }));
  const first = points[0]?.t ?? Date.now();
  const last = points[points.length - 1]?.t ?? Date.now();
  const span = Math.max(last - first, 1);
  const max = Math.max(points.length, 1);

  const x = (t: number): number => padL + ((t - first) / span) * (w - padL - padR);
  const y = (n: number): number => padT + (1 - n / max) * (h - padT - padB);

  const line = points.map((p) => `${x(p.t).toFixed(1)},${y(p.n).toFixed(1)}`).join(' ');
  const area = `${padL},${(h - padB).toFixed(1)} ${line} ${x(last).toFixed(1)},${(h - padB).toFixed(1)}`;

  const ticks = [0, 0.25, 0.5, 0.75, 1]
    .map((f) => {
      const n = Math.round(max * f);
      const yy = y(n).toFixed(1);
      return `<line class="chart-grid" x1="${padL}" y1="${yy}" x2="${w - padR}" y2="${yy}" />
        <text class="chart-label" x="${padL - 6}" y="${yy}" text-anchor="end" dominant-baseline="middle">${n}</text>`;
    })
    .join('');

  const fmt = (t: number): string =>
    new Date(t).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });

  return `
    <svg class="chart" viewBox="0 0 ${w} ${h}"
      role="img" aria-label="Cumulative contact growth over time">
      ${ticks}
      <polygon class="chart-area" points="${area}" />
      <polyline class="chart-line" points="${line}" />
      <circle class="chart-dot" cx="${x(last).toFixed(1)}" cy="${y(max).toFixed(1)}" r="3" />
      <text class="chart-label" x="${padL}" y="${h - 6}">${fmt(first)}</text>
      <text class="chart-label" x="${w - padR}" y="${h - 6}" text-anchor="end">${fmt(last)}</text>
    </svg>`;
}

// ── Panels ────────────────────────────────────────────────────────

function recentContacts(): string {
  const items = [...contacts]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5)
    .map(
      (c) => `
      <li class="recent-item">
        <div class="avatar">${getInitials(c)}</div>
        <div class="recent-body">
          <p class="recent-name">${c.firstName} ${c.lastName}</p>
          <p class="recent-meta">${c.company}</p>
        </div>
      </li>`
    )
    .join('');

  return `
    <div class="card">
      <h2 class="card-title">Recent Contacts</h2>
      <ul class="recent-list">${items}</ul>
    </div>`;
}

function recentActivity(): string {
  const items = [...contacts]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 6)
    .map(
      (c) => `
      <li>
        <span class="muted">Added </span>
        <span>${c.firstName} ${c.lastName}</span>
        <span class="when">${getTimeAgo(c.createdAt)}</span>
      </li>`
    )
    .join('');

  return `
    <div class="card">
      <h2 class="card-title">Recent Activity</h2>
      <ul class="activity-list">${items}</ul>
    </div>`;
}

function completenessRow(icon: string, label: string, pct: number): string {
  return `
    <button class="comp-row" data-demo="In the app, this opens a fill-in-the-blanks flow for that field.">
      ${icon}
      <span class="comp-label">${label}</span>
      <span class="comp-track"><span class="comp-fill" style="width:${pct}%"></span></span>
      <span class="comp-pct tabular">${pct}%</span>
    </button>`;
}

function dataCompleteness(): string {
  const sources = [...new Set(contacts.map((c) => c.source))].map(
    (s) => `<span class="chip">${s} · ${contacts.filter((c) => c.source === s).length}</span>`
  );

  return `
    <div class="card">
      <h2 class="card-title">Data Completeness</h2>
      ${completenessRow(icons.mail, 'Email', completeness('email'))}
      ${completenessRow(icons.phone, 'Phone', completeness('phone'))}
      ${completenessRow(icons.building, 'Company', completeness('company'))}
      ${completenessRow(icons.briefcase, 'Job Title', completeness('jobTitle'))}
      ${completenessRow(icons.mapPin, 'Location', completeness('location'))}
      <div class="sources">
        <p>Sources</p>
        <div class="source-chips">${sources.join('')}</div>
      </div>
    </div>`;
}

// ── View ──────────────────────────────────────────────────────────

/** Contacts created within the last `days` days. */
function addedWithin(days: number, offsetDays = 0): number {
  const now = Date.now();
  const end = now - offsetDays * 86400000;
  const start = end - days * 86400000;
  return contacts.filter((c) => {
    const t = new Date(c.createdAt).getTime();
    return t > start && t <= end;
  }).length;
}

export function renderDashboard(): string {
  const topCompany = getTopCompany();
  const topRole = getTopRole();

  // Both figures come off the sample rather than being written in, so
  // they stay true if the data changes. The app computes the same pair.
  const thisWeek = addedWithin(7);
  const lastWeek = addedWithin(7, 7);
  const growth =
    lastWeek === 0
      ? thisWeek > 0 ? '+100%' : '0%'
      : `${thisWeek >= lastWeek ? '+' : ''}${Math.round(((thisWeek - lastWeek) / lastWeek) * 100)}%`;

  return `
    <div class="stat-grid">
      ${statCard('Total Contacts', String(contacts.length), `${thisWeek} added this week`, icons.users)}
      ${statCard('Top Company', topCompany, `${countCompany(topCompany)} contacts`, icons.building)}
      ${statCard('Top Role', topRole, `${countRole(topRole)} contacts`, icons.briefcase)}
      ${statCard('Growth', growth, 'Week over week', icons.trendingUp)}
    </div>

    <div class="card section-gap">
      <h2 class="card-title">Contact Growth</h2>
      ${growthChart()}
    </div>

    <div class="grid-3 section-gap">
      ${recentContacts()}
      ${recentActivity()}
      ${dataCompleteness()}
    </div>`;
}
