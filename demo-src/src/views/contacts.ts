/**
 * Contacts — mirrors apps/web/src/app/(app)/contacts/page.tsx.
 *
 * The app's table: a select-all checkbox, sortable Name / Email /
 * Company / Title headers, then Phone and Location, with columns
 * dropping out at md / lg / xl. Selecting rows raises a bulk bar.
 *
 * Sorting and folder filtering are real here — all 54 contacts are
 * client-side, so there is no reason to fake them. Only the actions that
 * would write (import, export, delete, new contact) are switched off.
 */

import { icons } from '../icons';
import { contacts, folders, getInitials, type Contact } from '../data';

export type SortField = 'firstName' | 'email' | 'company' | 'jobTitle';
export type SortDir = 'asc' | 'desc';

export interface TableState {
  query: string;
  sortField: SortField | null;
  sortDir: SortDir;
  folder: string | null;
}

const HEADERS: { field: SortField; label: string; cls: string }[] = [
  { field: 'firstName', label: 'Name', cls: '' },
  { field: 'email', label: 'Email', cls: 'c-email' },
  { field: 'company', label: 'Company', cls: 'c-company' },
  { field: 'jobTitle', label: 'Title', cls: 'c-title' },
];

function matches(c: Contact, q: string): boolean {
  if (!q) return true;
  const needle = q.toLowerCase();
  return [c.firstName, c.lastName, c.email, c.company, c.jobTitle, c.phone, c.location]
    .some((v) => (v ?? '').toLowerCase().includes(needle));
}

/** Sort value for a field, lower-cased so ordering is case-insensitive. */
function keyOf(c: Contact, field: SortField): string {
  const raw = field === 'firstName' ? `${c.firstName} ${c.lastName}` : (c[field] ?? '');
  return raw.toLowerCase();
}

export function visibleContacts(state: TableState): Contact[] {
  let rows = contacts;

  if (state.folder) {
    const folder = folders.find((f) => f.name === state.folder);
    const emails = folder ? folder.emails : [];
    rows = rows.filter((c) => emails.includes(c.email));
  }

  rows = rows.filter((c) => matches(c, state.query));

  if (state.sortField) {
    const field = state.sortField;
    const dir = state.sortDir === 'asc' ? 1 : -1;
    rows = [...rows].sort((a, b) => {
      const ka = keyOf(a, field);
      const kb = keyOf(b, field);
      // Contacts missing the sorted field sink to the bottom either way;
      // a block of blanks at the top of an A–Z sort looks like a bug.
      if (!ka && kb) return 1;
      if (ka && !kb) return -1;
      return ka.localeCompare(kb) * dir;
    });
  }

  return rows;
}

function sortHeader(
  field: SortField,
  label: string,
  cls: string,
  state: TableState
): string {
  const active = state.sortField === field;
  const arrow = active
    ? state.sortDir === 'asc'
      ? '<svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m6 15 6-6 6 6"/></svg>'
      : '<svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg>'
    : icons.arrowUpDown;

  return `<th class="${cls}">
    <button class="sort-btn${active ? ' active' : ''}" data-sort="${field}"
      aria-label="Sort by ${label}${active ? `, currently ${state.sortDir}ending` : ''}">
      ${label}${arrow}
    </button>
  </th>`;
}

function row(c: Contact): string {
  return `
    <tr>
      <td><input type="checkbox" aria-label="Select ${c.firstName} ${c.lastName}" /></td>
      <td>
        <div class="cell-name">
          <div class="avatar">${getInitials(c)}</div>
          <div>
            <div class="name-main">${c.firstName} ${c.lastName}</div>
            <div class="name-source">${c.source}</div>
          </div>
        </div>
      </td>
      <td class="c-email mono-cell muted-cell">${c.email}</td>
      <td class="c-company">${c.company}</td>
      <td class="c-title muted-cell">${c.jobTitle}</td>
      <td class="c-phone mono-cell muted-cell">${c.phone}</td>
      <td class="c-location muted-cell">${c.location}</td>
    </tr>`;
}

export function renderContacts(state: TableState): string {
  const rows = visibleContacts(state);

  const emptyText = state.folder
    ? `Nothing in ${state.folder} matches “${state.query}”.`
    : `No contacts match “${state.query}”.`;

  const body = rows.length
    ? rows.map(row).join('')
    : `<tr class="empty-row"><td colspan="7">${emptyText}</td></tr>`;

  // Mirrors the app's folder chip: filtering by folder is visible and
  // reversible, rather than a silently shorter list.
  const folderChip = state.folder
    ? `<div class="filter-chip">
         <span>Folder: <strong>${state.folder}</strong></span>
         <button data-clear-folder aria-label="Clear folder filter">${icons.x}</button>
       </div>`
    : '';

  const count = `<p class="row-count">${rows.length} of ${contacts.length} contacts</p>`;

  return `
    <div class="table-meta">${folderChip}${count}</div>

    <div class="bulk-bar" id="bulk-bar" hidden>
      <span class="bulk-count" id="bulk-count">0 selected</span>
      <button class="btn btn-sm" data-demo="Folder assignment is disabled in this demo.">Add to folder</button>
      <button class="btn btn-sm" data-demo="Export is disabled in this demo.">Export selected</button>
      <button class="btn btn-sm" data-demo="Deleting is disabled in this demo.">${icons.trash}Delete</button>
    </div>

    <div class="table-wrap">
      <table>
        <thead>
          <tr>
            <th style="width:40px"><input type="checkbox" id="select-all" aria-label="Select all contacts" /></th>
            ${HEADERS.map((h) => sortHeader(h.field, h.label, h.cls, state)).join('')}
            <th class="c-phone">Phone</th>
            <th class="c-location">Location</th>
          </tr>
        </thead>
        <tbody>${body}</tbody>
      </table>
    </div>`;
}

/**
 * Row selection. Bound against the live table and re-bound whenever it
 * is rebuilt, since the table is replaced wholesale on search and sort.
 */
export function bindSelection(): void {
  const bar = document.getElementById('bulk-bar');
  const count = document.getElementById('bulk-count');
  const selectAll = document.getElementById('select-all') as HTMLInputElement | null;
  if (!bar || !count) return;

  const boxes = (): HTMLInputElement[] =>
    Array.from(document.querySelectorAll<HTMLInputElement>('tbody input[type="checkbox"]'));

  const sync = (): void => {
    const all = boxes();
    const n = all.filter((b) => b.checked).length;
    bar.hidden = n === 0;
    count.textContent = `${n} selected`;
    if (selectAll) {
      selectAll.checked = n > 0 && n === all.length;
      selectAll.indeterminate = n > 0 && n < all.length;
    }
  };

  boxes().forEach((b) => b.addEventListener('change', sync));

  selectAll?.addEventListener('change', () => {
    boxes().forEach((b) => (b.checked = selectAll.checked));
    sync();
  });
}
