/**
 * Sample database for the demo.
 *
 * Shaped to match `Contact` in @sigbot/shared. Sources are limited to
 * the two live ingest routes ('outlook' | 'forwarding') — Gmail and
 * IMAP are Coming Soon in the app, so the demo must not show contacts
 * sourced from them.
 *
 * The distribution matters as much as the rows. This is meant to behave
 * like a database someone has actually been running for six weeks, so
 * the panels have something true to say:
 *
 *   - createdAt is spread across ~6 weeks, so Contact Growth is a curve
 *     with a couple of import spikes rather than a straight line.
 *   - Fields are deliberately patchy. Signature scraping does not return
 *     a job title every time, so Data Completeness lands around
 *     email 100 / company 96 / phone 79 / title 63 / location 79 —
 *     an honest picture, not five full bars.
 *   - Companies repeat, so Top Company and Top Role are real answers.
 *   - Both live ingest routes appear, so the source chips mean something.
 *   - Coordinates spread over BC, the prairies, Ontario, the US west
 *     coast, the UK and Ireland, so the map clusters instead of
 *     stacking every pin on one city.
 */

export interface Contact {
  firstName: string;
  lastName: string;
  email: string;
  company: string;
  jobTitle: string;
  phone: string;
  mobile?: string;
  website?: string;
  location: string;
  sector?: string;
  businessType?: string;
  latitude?: number;
  longitude?: number;
  tags?: string[];
  notes?: string;
  source: 'outlook' | 'forwarding';
  createdAt: string;
}

/**
 * Compact row form, so the distribution above stays legible and easy to
 * tune. An empty string is a genuinely missing field — that is the point
 * of several of these rows, not an oversight.
 *
 * [first, last, email, company, jobTitle, phone, location, lat, lng, source, daysAgo]
 */
type Row = [
  string, string, string, string, string, string, string,
  number | null, number | null, Contact['source'], number,
];

const ROWS: Row[] = [
  // ── Westpoint Engineering — the top company ──
  ['Marcus', 'Holloway', 'marcus.h@westpointeng.ca', 'Westpoint Engineering', 'Senior Estimator', '+1 (604) 312-8847', 'Vancouver, BC', 49.2827, -123.1207, 'outlook', 41],
  ['Ruth', 'Danniells', 'r.danniells@westpointeng.ca', 'Westpoint Engineering', 'Project Manager', '+1 (604) 312-8851', 'Vancouver, BC', 49.2827, -123.1207, 'outlook', 40],
  ['Tobias', 'Ferrand', 't.ferrand@westpointeng.ca', 'Westpoint Engineering', '', '+1 (604) 312-8863', 'Vancouver, BC', 49.2827, -123.1207, 'outlook', 33],
  ['Nadia', 'Weston', 'nadia.w@westpointeng.ca', 'Westpoint Engineering', 'Quality Manager', '+1 (250) 487-6613', 'Burnaby, BC', 49.2488, -122.9805, 'outlook', 27],
  ['Callum', 'Reyes', 'c.reyes@westpointeng.ca', 'Westpoint Engineering', '', '', 'Vancouver, BC', 49.2827, -123.1207, 'forwarding', 12],

  // ── Bayview Construction ──
  ['Rachel', 'Thornton', 'rachel.t@bayviewconst.ca', 'Bayview Construction', 'Contracts Manager', '+1 (250) 519-7742', 'Victoria, BC', 48.4284, -123.3656, 'outlook', 39],
  ['David', 'Miller', 'd.miller@bayviewconst.ca', 'Bayview Construction', 'VP of Business Development', '+1 (416) 555-0182', 'Toronto, ON', 43.6532, -79.3832, 'outlook', 36],
  ['Imogen', 'Prasad', 'i.prasad@bayviewconst.ca', 'Bayview Construction', 'Project Manager', '+1 (250) 519-7758', 'Victoria, BC', 48.4284, -123.3656, 'outlook', 22],
  ['Stefan', 'Oyelaran', 's.oyelaran@bayviewconst.ca', 'Bayview Construction', '', '+1 (250) 519-7761', '', null, null, 'forwarding', 9],

  // ── Clearwater Industries ──
  ['Priya', 'Kavanaugh', 'priya.k@clearwaterind.com', 'Clearwater Industries', 'Project Manager', '+1 (778) 509-3321', 'Vancouver, BC', 49.2827, -123.1207, 'outlook', 38],
  ['Gordon', 'Selby', 'g.selby@clearwaterind.com', 'Clearwater Industries', 'Operations Director', '+1 (778) 509-3344', 'Vancouver, BC', 49.2827, -123.1207, 'outlook', 30],
  ['Yuki', 'Tanaka-Bell', 'y.tanakabell@clearwaterind.com', 'Clearwater Industries', 'Procurement Lead', '', 'Seattle, WA', 47.6062, -122.3321, 'forwarding', 16],

  // ── Summit Group Companies ──
  ['Elena', 'Driscoll', 'elena.d@summitgroupco.com', 'Summit Group Companies', 'Estimating Manager', '+1 (250) 614-9982', 'Kelowna, BC', 49.888, -119.496, 'outlook', 37],
  ['Peter', 'Nakashima', 'p.nakashima@summitgroupco.com', 'Summit Group Companies', 'Project Manager', '+1 (250) 614-9990', 'Kelowna, BC', 49.888, -119.496, 'outlook', 24],
  ['Bronwen', 'Achebe', 'b.achebe@summitgroupco.com', 'Summit Group Companies', '', '+1 (403) 771-2205', 'Calgary, AB', 51.0447, -114.0719, 'outlook', 11],

  // ── Horizon Builders ──
  ['Derek', 'Malone', 'derek.m@horizonbuild.ca', 'Horizon Builders', 'Preconstruction Manager', '+1 (604) 442-8871', 'Vancouver, BC', 49.2827, -123.1207, 'outlook', 35],
  ['Anneke', 'Vos', 'a.vos@horizonbuild.ca', 'Horizon Builders', 'Site Superintendent', '+1 (604) 442-8884', 'Vancouver, BC', 49.2827, -123.1207, 'outlook', 19],
  ['Femi', 'Adeyemi', 'f.adeyemi@horizonbuild.ca', 'Horizon Builders', '', '', 'Vancouver, BC', 49.2827, -123.1207, 'forwarding', 6],

  // ── Cedarstone Developments ──
  ['Liam', 'Ashford', 'liam.a@cedarstonedev.ca', 'Cedarstone Developments', 'CFO', '+1 (604) 883-4156', 'Vancouver, BC', 49.2827, -123.1207, 'outlook', 34],
  ['Sylvie', 'Marchetti', 's.marchetti@cedarstonedev.ca', 'Cedarstone Developments', 'Development Manager', '+1 (604) 883-4162', 'Vancouver, BC', 49.2827, -123.1207, 'outlook', 21],
  ['Hugh', 'Brennan', 'h.brennan@cedarstonedev.ca', 'Cedarstone Developments', 'Project Manager', '+1 (604) 883-4177', 'Vancouver, BC', 49.2827, -123.1207, 'forwarding', 6],

  // ── Two-person firms ──
  ['Owen', 'Beckett', 'owen.b@arclightmech.ca', 'Arclight Mechanical', 'Operations Lead', '+1 (416) 773-2201', 'Toronto, ON', 43.6532, -79.3832, 'outlook', 32],
  ['Meredith', 'Cole', 'm.cole@arclightmech.ca', 'Arclight Mechanical', '', '+1 (416) 773-2218', 'Toronto, ON', 43.6532, -79.3832, 'outlook', 14],
  ['Tessa', 'Langford', 'tessa.l@northshoreroof.ca', 'North Shore Roofing Co', 'Director', '+1 (250) 671-3390', 'Nanaimo, BC', 49.1659, -123.9401, 'outlook', 31],
  ['Aaron', 'Kirkbride', 'a.kirkbride@northshoreroof.ca', 'North Shore Roofing Co', 'Estimator', '+1 (250) 671-3402', 'Nanaimo, BC', 49.1659, -123.9401, 'forwarding', 13],
  ['Victor', 'Sandoval', 'victor.s@ridgelineltd.ca', 'Ridgeline Limited', 'Preconstruction Manager', '+1 (250) 603-1108', 'Victoria, BC', 48.4284, -123.3656, 'outlook', 29],
  ['Wren', 'Halloway', 'w.halloway@ridgelineltd.ca', 'Ridgeline Limited', '', '+1 (250) 603-1121', '', null, null, 'outlook', 10],
  ['Gemma', 'Oyelowo', 'g.oyelowo@ironbridgefab.ca', 'Iron Bridge Fabrication', 'Quality Manager', '+1 (250) 487-6620', 'Nanaimo, BC', 49.1659, -123.9401, 'outlook', 28],
  ['Curtis', 'Nowak', 'c.nowak@ironbridgefab.ca', 'Iron Bridge Fabrication', 'Fabrication Lead', '', 'Nanaimo, BC', 49.1659, -123.9401, 'forwarding', 5],

  // ── Prairies and east ──
  ['Rick', 'Falconer', 'rick@falconequip.ca', 'Falcon Equipment', 'Owner', '+1 (250) 754-8802', 'Nanaimo, BC', 49.1659, -123.9401, 'outlook', 26],
  ['Jolene', 'Mbeki', 'j.mbeki@megacrane.ca', 'Mega Crane', 'Dispatch Manager', '+1 (604) 298-4410', 'Vancouver, BC', 49.2827, -123.1207, 'outlook', 25],
  ['Carl', 'Whitfield', 'carl.w@megacrane.ca', 'Mega Crane', '', '+1 (604) 298-4423', 'Vancouver, BC', 49.2827, -123.1207, 'outlook', 23],
  ['Sasha', 'Petrenko', 's.petrenko@northwindciv.ca', 'Northwind Civil', 'Project Manager', '+1 (403) 244-9917', 'Calgary, AB', 51.0447, -114.0719, 'outlook', 20],
  ['Grant', 'Ibbotson', 'g.ibbotson@northwindciv.ca', 'Northwind Civil', 'Site Engineer', '+1 (403) 244-9925', 'Calgary, AB', 51.0447, -114.0719, 'forwarding', 5],
  ['Dana', 'Rousseau', 'd.rousseau@prairiesteel.ca', 'Prairie Steel Works', 'Sales Manager', '+1 (306) 668-3315', 'Saskatoon, SK', 52.1332, -106.67, 'outlook', 18],
  ['Elijah', 'Munroe', 'e.munroe@prairiesteel.ca', 'Prairie Steel Works', '', '', 'Saskatoon, SK', 52.1332, -106.67, 'forwarding', 4],
  ['Anita', 'Bergeron', 'a.bergeron@lauriergroupe.ca', 'Laurier Groupe', 'Directrice de projet', '+1 (514) 397-2264', 'Montreal, QC', 45.5019, -73.5674, 'outlook', 17],
  ['Colin', 'Fraser', 'c.fraser@atlanticmarine.ca', 'Atlantic Marine Services', 'Operations Manager', '+1 (902) 429-7731', 'Halifax, NS', 44.6488, -63.5752, 'outlook', 15],
  ['Marguerite', 'Okonkwo', 'm.okonkwo@redriverint.ca', 'Red River Interiors', 'Project Manager', '+1 (204) 953-6620', 'Winnipeg, MB', 49.8951, -97.1384, 'outlook', 15],
  ['Theo', 'Lindqvist', 't.lindqvist@edmontonmech.ca', 'Edmonton Mechanical', 'Estimator', '+1 (780) 421-9908', 'Edmonton, AB', 53.5461, -113.4938, 'outlook', 12],

  // ── US west coast ──
  ['Bianca', 'Ferreira', 'b.ferreira@puget-fab.com', 'Puget Fabrication', 'Operations Lead', '+1 (206) 812-4470', 'Seattle, WA', 47.6062, -122.3321, 'forwarding', 26],
  ['Nathan', 'Oduya', 'n.oduya@puget-fab.com', 'Puget Fabrication', '', '+1 (206) 812-4488', 'Seattle, WA', 47.6062, -122.3321, 'forwarding', 9],
  ['Erin', 'Kowalczyk', 'erin.k@willametteciv.com', 'Willamette Civil', 'Contracts Manager', '+1 (503) 640-2219', 'Portland, OR', 45.5152, -122.6784, 'forwarding', 11],

  // ── UK and Ireland ──
  ['Sophie', 'Turner', 'sophie@northgate.co.uk', 'Northgate Ltd', 'Head of Partnerships', '+44 20 7946 0812', 'London, UK', 51.5074, -0.1278, 'forwarding', 30],
  ['Alastair', 'Finch', 'a.finch@northgate.co.uk', 'Northgate Ltd', '', '+44 20 7946 0829', 'London, UK', 51.5074, -0.1278, 'forwarding', 16],
  ['Priti', 'Raval', 'p.raval@mercerbuild.co.uk', 'Mercer Build Group', 'Commercial Manager', '+44 161 496 0331', 'Manchester, UK', 53.4808, -2.2426, 'forwarding', 21],
  ['Douglas', 'Mair', 'd.mair@clydeworks.co.uk', 'Clyde Works', 'Managing Director', '+44 141 249 7702', 'Glasgow, UK', 55.8642, -4.2518, 'forwarding', 14],
  ['Aoife', 'Byrne', 'aoife@liffeyholdings.ie', 'Liffey Holdings', 'Finance Director', '+353 1 903 4417', 'Dublin, IE', 53.3498, -6.2603, 'forwarding', 4],
  ['Ewan', 'Castellano', 'e.castellano@severnplant.co.uk', 'Severn Plant Hire', '', '', 'Bristol, UK', 51.4545, -2.5879, 'forwarding', 3],

  // ── This week ──
  ['Harriet', 'Okafor', 'h.okafor@lakeshoreelec.ca', 'Lakeshore Electrical', 'Project Manager', '+1 (416) 990-2214', 'Toronto, ON', 43.6532, -79.3832, 'outlook', 2],
  ['Sean', 'Whitlock', 's.whitlock@lakeshoreelec.ca', 'Lakeshore Electrical', '', '+1 (416) 990-2230', 'Toronto, ON', 43.6532, -79.3832, 'outlook', 2],
  ['Margot', 'Delacroix', 'm.delacroix@aurorafacades.ca', 'Aurora Facades', 'Technical Director', '+1 (613) 555-7788', 'Ottawa, ON', 45.4215, -75.6972, 'outlook', 1],
  ['Ibrahim', 'Chaudhry', 'i.chaudhry@aurorafacades.ca', 'Aurora Facades', 'Estimator', '', 'Ottawa, ON', 45.4215, -75.6972, 'outlook', 1],
  ['Lena', 'Vasquez', 'l.vasquez@stonecroftpm.ca', 'Stonecroft PM', 'Project Manager', '+1 (778) 220-6614', 'Vancouver, BC', 49.2827, -123.1207, 'outlook', 0],
];

/** Sector by company, so the sample carries the field the app classifies on. */
const SECTORS: Record<string, string> = {
  'Westpoint Engineering': 'Engineering',
  'Clearwater Industries': 'Industrial',
  'Summit Group Companies': 'Construction',
  'Bayview Construction': 'Construction',
  'Horizon Builders': 'Construction',
  'Cedarstone Developments': 'Property Development',
  'Arclight Mechanical': 'Mechanical',
  'North Shore Roofing Co': 'Roofing',
  'Ridgeline Limited': 'Construction',
  'Iron Bridge Fabrication': 'Fabrication',
  'Falcon Equipment': 'Plant & Equipment',
  'Mega Crane': 'Plant & Equipment',
  'Northwind Civil': 'Civil Engineering',
  'Prairie Steel Works': 'Fabrication',
  'Laurier Groupe': 'Construction',
  'Atlantic Marine Services': 'Marine',
  'Red River Interiors': 'Interiors',
  'Edmonton Mechanical': 'Mechanical',
  'Puget Fabrication': 'Fabrication',
  'Willamette Civil': 'Civil Engineering',
  'Northgate Ltd': 'Construction',
  'Mercer Build Group': 'Construction',
  'Clyde Works': 'Fabrication',
  'Liffey Holdings': 'Property Development',
  'Severn Plant Hire': 'Plant & Equipment',
  'Lakeshore Electrical': 'Electrical',
  'Aurora Facades': 'Facades',
  'Stonecroft PM': 'Project Management',
};

/**
 * Fixed clock. The rows are positioned in days-ago, and a demo that
 * re-derives "now" on every load would drift the growth chart's axis
 * every time someone opens it — but pinning a literal date would age.
 * Midnight today is the compromise: stable within a session, current
 * across days.
 */
const TODAY = new Date();
TODAY.setHours(9, 0, 0, 0);

function daysAgo(n: number): string {
  return new Date(TODAY.getTime() - n * 86400000).toISOString();
}

function domainOf(email: string): string {
  return 'https://www.' + (email.split('@')[1] ?? '');
}

export const contacts: Contact[] = ROWS.map(
  ([firstName, lastName, email, company, jobTitle, phone, location, lat, lng, source, days]) => ({
    firstName,
    lastName,
    email,
    company,
    jobTitle,
    phone,
    location,
    website: domainOf(email),
    sector: SECTORS[company] ?? '',
    latitude: lat ?? undefined,
    longitude: lng ?? undefined,
    source,
    createdAt: daysAgo(days),
  })
);

// ── Derived values ────────────────────────────────────────────────

export function getTopCompany(): string {
  const freq: Record<string, number> = {};
  contacts.forEach((c) => {
    if (c.company) freq[c.company] = (freq[c.company] || 0) + 1;
  });
  return Object.entries(freq).sort((a, b) => b[1] - a[1])[0]?.[0] ?? '—';
}

export function getTopRole(): string {
  const freq: Record<string, number> = {};
  contacts.forEach((c) => {
    if (c.jobTitle && c.jobTitle !== '—') freq[c.jobTitle] = (freq[c.jobTitle] || 0) + 1;
  });
  return Object.entries(freq).sort((a, b) => b[1] - a[1])[0]?.[0] ?? '—';
}

export function getTimeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const hours = Math.floor(diff / 3600000);
  if (hours < 1) return 'just now';
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  const weeks = Math.floor(days / 7);
  return `${weeks}w ago`;
}

export function getInitials(c: Contact): string {
  return ((c.firstName?.[0] ?? '') + (c.lastName?.[0] ?? '')).toUpperCase();
}

// ── Folders ───────────────────────────────────────────────────────
// The app stores folder membership by contact email and filters the
// table through a `folder:<name>` search query. Same model here, so the
// sidebar folders actually filter rather than being decoration.

export const folders: { name: string; emails: string[] }[] = [
  {
    name: 'Tendering',
    emails: [
      'marcus.h@westpointeng.ca',
      'elena.d@summitgroupco.com',
      'rachel.t@bayviewconst.ca',
      'victor.s@ridgelineltd.ca',
      'derek.m@horizonbuild.ca',
      'a.kirkbride@northshoreroof.ca',
      'erin.k@willametteciv.com',
      't.lindqvist@edmontonmech.ca',
      'p.raval@mercerbuild.co.uk',
      'i.chaudhry@aurorafacades.ca',
    ],
  },
  {
    name: 'Site contacts',
    emails: [
      'a.vos@horizonbuild.ca',
      'g.ibbotson@northwindciv.ca',
      'nadia.w@westpointeng.ca',
      'g.oyelowo@ironbridgefab.ca',
      'c.nowak@ironbridgefab.ca',
      'j.mbeki@megacrane.ca',
      'rick@falconequip.ca',
      'c.fraser@atlanticmarine.ca',
      'e.castellano@severnplant.co.uk',
    ],
  },
];

export function contactsInFolder(name: string): Contact[] {
  const folder = folders.find((f) => f.name === name);
  if (!folder) return [];
  return contacts.filter((c) => folder.emails.includes(c.email));
}
