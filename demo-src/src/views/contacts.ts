/**
 * Contacts — mirrors apps/web/src/app/(app)/contacts/page.tsx.
 *
 * The app's table: a select-all checkbox, sortable Name / Email /
 * Company / Title headers, then Phone and Location, with columns
 * dropping out at md / lg / xl. Selecting rows raises a bulk bar
 * offering folder assignment, export and delete.
 *
 * Search matches the same fields the app's store filters on.
 */

import { icons } from '../icons';
import { contacts, getInitials, type Contact } from '../data';

function matches(c: Contact, q: string): boolean {
  if (!q) return true;
  const needle = q.toLowerCase();
  return [c.firstName, c.lastName, c.email, c.company, c.jobTitle, c.phone, c.location]
    .some((v) => (v ?? '').toLowerCase().includes(needle));
}

function sortHeader(label: string, extraClass = ''): string {
  return `<th class="${extraClass}">
    <button class="sort-btn" data-demo="Sorting is disabled in this demo — the app sorts on every column.">
      ${label}${icons.arrowUpDown}
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
      <td class="col-md mono-cell muted-cell">${c.email}</td>
      <td class="col-lg">${c.company}</td>
      <td class="col-lg muted-cell">${c.jobTitle}</td>
      <td class="col-lg mono-cell muted-cell">${c.phone}</td>
      <td class="col-lg muted-cell">${c.location}</td>
    </tr>`;
}

export function renderContacts(query: string): string {
  const rows = contacts.filter((c) => matches(c, query));

  const body = rows.length
    ? rows.map(row).join('')
    : `<tr class="empty-row"><td colspan="7">No contacts match “${query}”.</td></tr>`;

  return `
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
            ${sortHeader('Name')}
            ${sortHeader('Email', 'col-md')}
            ${sortHeader('Company', 'col-lg')}
            ${sortHeader('Title', 'col-lg')}
            <th class="col-lg">Phone</th>
            <th class="col-lg">Location</th>
          </tr>
        </thead>
        <tbody>${body}</tbody>
      </table>
    </div>`;
}

/**
 * Row selection. Delegated from the document in main.ts's render cycle
 * would re-run on every keystroke, so selection is wired here against
 * the live table and re-bound whenever the table is rebuilt.
 */
export function bindSelection(): void {
  const bar = document.getElementById('bulk-bar');
  const count = document.getElementById('bulk-count');
  const selectAll = document.getElementById('select-all') as HTMLInputElement | null;
  if (!bar || !count) return;

  const boxes = (): HTMLInputElement[] =>
    Array.from(document.querySelectorAll<HTMLInputElement>('tbody input[type="checkbox"]'));

  const sync = (): void => {
    const n = boxes().filter((b) => b.checked).length;
    bar.hidden = n === 0;
    count.textContent = `${n} selected`;
    if (selectAll) {
      selectAll.checked = n > 0 && n === boxes().length;
      selectAll.indeterminate = n > 0 && n < boxes().length;
    }
  };

  boxes().forEach((b) => b.addEventListener('change', sync));

  selectAll?.addEventListener('change', () => {
    boxes().forEach((b) => (b.checked = selectAll.checked));
    sync();
  });
}
