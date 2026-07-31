/**
 * Sigbot web app demo — application shell.
 *
 * Mirrors apps/web/src/app/(app)/layout.tsx: a 220px sidebar (brand, team
 * switcher, nav, folders, usage meter) beside a main column carrying the
 * toolbar from components/layout/header.tsx. The four destinations are the
 * app's four: /dashboard, /contacts, /map and /upgrade ("Account").
 *
 * Everything here is local and read-only — no Firebase, no auth, no
 * writes. Controls that would mutate data in the real app say so rather
 * than silently doing nothing.
 */

import './style.css';
import { icons } from './icons';
import { contacts } from './data';
import { renderDashboard } from './views/dashboard';
import { renderContacts, bindSelection } from './views/contacts';
import { renderMap, mountMap } from './views/map';
import { renderAccount } from './views/account';

export type View = 'dashboard' | 'contacts' | 'map' | 'account';

const NAV: { view: View; label: string; icon: string }[] = [
  { view: 'dashboard', label: 'Dashboard', icon: icons.layoutDashboard },
  { view: 'contacts', label: 'Contacts', icon: icons.users },
  { view: 'map', label: 'Map', icon: icons.map },
  { view: 'account', label: 'Account', icon: icons.circleUser },
];

/** Free-plan caps, matching PLAN_METADATA in @sigbot/shared. */
const DAILY_LIMIT = 50;
const TOTAL_LIMIT = 300;
const USED_TODAY = 12;

let current: View = 'dashboard';
let searchQuery = '';

// ── Demo notice ───────────────────────────────────────────────────

let toastTimer: number | undefined;

export function notice(message: string): void {
  const el = document.getElementById('toast');
  if (!el) return;
  el.textContent = message;
  el.classList.add('show');
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => el.classList.remove('show'), 2800);
}

// ── Shell ─────────────────────────────────────────────────────────

function usageMeter(): string {
  const totalPct = Math.round((contacts.length / TOTAL_LIMIT) * 100);
  const dayPct = Math.round((USED_TODAY / DAILY_LIMIT) * 100);
  return `
    <div class="usage">
      <div class="usage-head">
        <span class="usage-title">Email scraping</span>
        <span class="plan-badge">Free</span>
      </div>
      <div class="usage-line">
        <div class="usage-labels"><span>Today</span><span class="tabular">${USED_TODAY} / ${DAILY_LIMIT}</span></div>
        <div class="usage-track"><div class="usage-fill" style="width:${dayPct}%"></div></div>
      </div>
      <div class="usage-line">
        <div class="usage-labels"><span>Total</span><span class="tabular">${contacts.length} / ${TOTAL_LIMIT}</span></div>
        <div class="usage-track"><div class="usage-fill" style="width:${totalPct}%"></div></div>
      </div>
      <button class="usage-upgrade" data-goto="account">Upgrade</button>
    </div>`;
}

function sidebar(): string {
  const links = NAV.map(
    (n) => `<button class="nav-link${n.view === current ? ' active' : ''}" data-view="${n.view}">
      ${n.icon}${n.label}
    </button>`
  ).join('');

  return `
    <aside class="sidebar">
      <div class="sidebar-brand">Sigbot</div>

      <div class="team-switcher">
        <button data-demo="Team switching is disabled in this demo.">
          <span>Personal</span>${icons.chevronDown}
        </button>
      </div>

      <nav class="sidebar-nav">${links}</nav>

      <div class="sidebar-folders">
        <div class="folders-head">
          <span>Folders</span>
          <button data-demo="Folders are read-only in this demo." aria-label="New folder">${icons.plus}</button>
        </div>
        <button class="folder-item" data-demo="Folders are read-only in this demo.">
          ${icons.folder}Tendering
        </button>
        <button class="folder-item" data-demo="Folders are read-only in this demo.">
          ${icons.folder}Site contacts
        </button>
      </div>

      ${usageMeter()}
    </aside>`;
}

function header(): string {
  const titles: Record<View, string> = {
    dashboard: 'Dashboard',
    contacts: 'Contacts',
    map: 'Map',
    account: 'Account',
  };

  // Search drives the contacts table only, as in the app.
  const search =
    current === 'contacts'
      ? `<div class="search-wrap">
           ${icons.search}
           <input class="search-input" id="search" type="text" placeholder="Search contacts..."
             value="${searchQuery}" aria-label="Search contacts" />
         </div>`
      : '';

  return `
    <header class="header">
      <div class="header-row">
        <h1 class="header-title">${titles[current]}</h1>
        <div class="header-spacer"></div>
        ${search}

        <div class="menu-wrap">
          <button class="btn" data-menu="add">${icons.upload}<span class="btn-label">Add Data</span></button>
          <div class="menu" id="menu-add" hidden>
            <button data-demo="Importing is disabled here. The real app takes Excel, CSV and vCard.">
              ${icons.fileUp}Import (Excel/CSV/vCard)
            </button>
            <button data-demo="Connect an inbox at sigbot.app — Outlook in one click, or IMAP with an app password.">
              ${icons.mail}Scrape Emails
            </button>
          </div>
        </div>

        <div class="menu-wrap">
          <button class="btn" data-menu="export">${icons.download}<span class="btn-label">Export Data</span></button>
          <div class="menu" id="menu-export" hidden>
            <button data-demo="Export is disabled in this demo.">Export Excel</button>
            <button data-demo="Export is disabled in this demo.">Export CSV</button>
            <button data-demo="Export is disabled in this demo.">Export JSON</button>
            <button data-demo="Export is disabled in this demo.">Export vCard</button>
          </div>
        </div>

        <button class="btn btn-primary" data-demo="Adding contacts is disabled in this demo.">
          ${icons.plus}<span class="btn-label">New Contact</span>
        </button>
      </div>
    </header>`;
}

function viewBody(): string {
  switch (current) {
    case 'contacts':
      return renderContacts(searchQuery);
    case 'map':
      return renderMap();
    case 'account':
      return renderAccount();
    default:
      return renderDashboard();
  }
}

function render(): void {
  const app = document.getElementById('app');
  if (!app) return;

  app.innerHTML = `
    ${sidebar()}
    <div class="main">
      ${header()}
      <div class="content${current === 'map' ? ' content--map' : ''}" id="content">${viewBody()}</div>
    </div>
    <div class="toast" id="toast" role="status" aria-live="polite"></div>`;

  // Leaflet needs its container in the document before it initialises.
  if (current === 'map') mountMap();

  if (current === 'contacts') bindSearch();
}

function bindSearch(): void {
  bindSelection();

  const input = document.getElementById('search') as HTMLInputElement | null;
  if (!input) return;

  input.addEventListener('input', () => {
    searchQuery = input.value;
    // Only the table is replaced, so the field keeps focus and caret —
    // but the new checkboxes need binding again.
    const content = document.getElementById('content');
    if (content) {
      content.innerHTML = renderContacts(searchQuery);
      bindSelection();
    }
  });
}

function go(view: View): void {
  if (view === current) return;
  current = view;
  if (view !== 'contacts') searchQuery = '';
  render();
}

// ── Events ────────────────────────────────────────────────────────
// One delegated listener: the shell re-renders wholesale, so per-element
// handlers would need rebinding on every change.

function closeMenus(): void {
  document.querySelectorAll<HTMLElement>('.menu').forEach((m) => (m.hidden = true));
}

document.addEventListener('click', (e) => {
  const target = e.target as HTMLElement;

  const navBtn = target.closest<HTMLElement>('[data-view]');
  if (navBtn) {
    go(navBtn.dataset.view as View);
    return;
  }

  const goto = target.closest<HTMLElement>('[data-goto]');
  if (goto) {
    go(goto.dataset.goto as View);
    return;
  }

  const menuBtn = target.closest<HTMLElement>('[data-menu]');
  if (menuBtn) {
    const id = `menu-${menuBtn.dataset.menu}`;
    const menu = document.getElementById(id);
    const wasOpen = menu ? !menu.hidden : false;
    closeMenus();
    if (menu) menu.hidden = wasOpen;
    return;
  }

  // Anything that would write in the real app explains itself instead.
  const demo = target.closest<HTMLElement>('[data-demo]');
  if (demo) {
    notice(demo.dataset.demo ?? '');
    closeMenus();
    return;
  }

  closeMenus();
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeMenus();
});

render();
