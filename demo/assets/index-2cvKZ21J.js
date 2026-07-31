(function(){let e=document.createElement(`link`).relList;if(e&&e.supports&&e.supports(`modulepreload`))return;for(let e of document.querySelectorAll(`link[rel="modulepreload"]`))n(e);new MutationObserver(e=>{for(let t of e)if(t.type===`childList`)for(let e of t.addedNodes)e.tagName===`LINK`&&e.rel===`modulepreload`&&n(e)}).observe(document,{childList:!0,subtree:!0});function t(e){let t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),e.crossOrigin===`use-credentials`?t.credentials=`include`:e.crossOrigin===`anonymous`?t.credentials=`omit`:t.credentials=`same-origin`,t}function n(e){if(e.ep)return;e.ep=!0;let n=t(e);fetch(e.href,n)}})();var e=(e,t=16)=>`<svg viewBox="0 0 24 24" width="${t}" height="${t}" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${e}</svg>`,t={layoutDashboard:e(`<rect x="3" y="3" width="7" height="9" rx="1"/><rect x="14" y="3" width="7" height="5" rx="1"/><rect x="14" y="12" width="7" height="9" rx="1"/><rect x="3" y="16" width="7" height="5" rx="1"/>`),users:e(`<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>`),map:e(`<path d="M14.106 5.553a2 2 0 0 0 1.788 0l3.659-1.83A1 1 0 0 1 21 4.619v12.764a1 1 0 0 1-.553.894l-4.553 2.277a2 2 0 0 1-1.788 0l-4.212-2.106a2 2 0 0 0-1.788 0l-3.659 1.83A1 1 0 0 1 3 19.381V6.618a1 1 0 0 1 .553-.894l4.553-2.277a2 2 0 0 1 1.788 0z"/><path d="M15 5.764v15M9 3.236v15"/>`),circleUser:e(`<circle cx="12" cy="12" r="10"/><circle cx="12" cy="10" r="3"/><path d="M7 20.662V19a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v1.662"/>`),chevronDown:e(`<path d="m6 9 6 6 6-6"/>`),plus:e(`<path d="M5 12h14M12 5v14"/>`),folder:e(`<path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z"/>`),search:e(`<circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>`),upload:e(`<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="M17 8l-5-5-5 5"/><path d="M12 3v12"/>`),download:e(`<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="M7 10l5 5 5-5"/><path d="M12 15V3"/>`),fileUp:e(`<path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v5h5"/><path d="M12 18v-6M9.5 14.5 12 12l2.5 2.5"/>`),mail:e(`<rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>`),phone:e(`<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.9.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92Z"/>`),building:e(`<rect x="4" y="2" width="16" height="20" rx="2"/><path d="M9 22v-4h6v4"/><path d="M8 6h.01M16 6h.01M12 6h.01M12 10h.01M12 14h.01M16 10h.01M16 14h.01M8 10h.01M8 14h.01"/>`),briefcase:e(`<rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>`),mapPin:e(`<path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"/><circle cx="12" cy="10" r="3"/>`),trendingUp:e(`<path d="M16 7h6v6"/><path d="m22 7-8.5 8.5-5-5L2 17"/>`),trash:e(`<path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>`),check:e(`<path d="M20 6 9 17l-5-5"/>`),arrowUpDown:e(`<path d="m21 16-4 4-4-4"/><path d="M17 20V4"/><path d="m3 8 4-4 4 4"/><path d="M7 4v16"/>`,12),x:e(`<path d="M18 6 6 18M6 6l12 12"/>`)},n=[[`Marcus`,`Holloway`,`marcus.h@westpointeng.ca`,`Westpoint Engineering`,`Senior Estimator`,`+1 (604) 312-8847`,`Vancouver, BC`,49.2827,-123.1207,`outlook`,41],[`Ruth`,`Danniells`,`r.danniells@westpointeng.ca`,`Westpoint Engineering`,`Project Manager`,`+1 (604) 312-8851`,`Vancouver, BC`,49.2827,-123.1207,`outlook`,40],[`Tobias`,`Ferrand`,`t.ferrand@westpointeng.ca`,`Westpoint Engineering`,``,`+1 (604) 312-8863`,`Vancouver, BC`,49.2827,-123.1207,`outlook`,33],[`Nadia`,`Weston`,`nadia.w@westpointeng.ca`,`Westpoint Engineering`,`Quality Manager`,`+1 (250) 487-6613`,`Burnaby, BC`,49.2488,-122.9805,`outlook`,27],[`Callum`,`Reyes`,`c.reyes@westpointeng.ca`,`Westpoint Engineering`,``,``,`Vancouver, BC`,49.2827,-123.1207,`imap`,12],[`Rachel`,`Thornton`,`rachel.t@bayviewconst.ca`,`Bayview Construction`,`Contracts Manager`,`+1 (250) 519-7742`,`Victoria, BC`,48.4284,-123.3656,`outlook`,39],[`David`,`Miller`,`d.miller@bayviewconst.ca`,`Bayview Construction`,`VP of Business Development`,`+1 (416) 555-0182`,`Toronto, ON`,43.6532,-79.3832,`outlook`,36],[`Imogen`,`Prasad`,`i.prasad@bayviewconst.ca`,`Bayview Construction`,`Project Manager`,`+1 (250) 519-7758`,`Victoria, BC`,48.4284,-123.3656,`outlook`,22],[`Stefan`,`Oyelaran`,`s.oyelaran@bayviewconst.ca`,`Bayview Construction`,``,`+1 (250) 519-7761`,``,null,null,`imap`,9],[`Priya`,`Kavanaugh`,`priya.k@clearwaterind.com`,`Clearwater Industries`,`Project Manager`,`+1 (778) 509-3321`,`Vancouver, BC`,49.2827,-123.1207,`outlook`,38],[`Gordon`,`Selby`,`g.selby@clearwaterind.com`,`Clearwater Industries`,`Operations Director`,`+1 (778) 509-3344`,`Vancouver, BC`,49.2827,-123.1207,`outlook`,30],[`Yuki`,`Tanaka-Bell`,`y.tanakabell@clearwaterind.com`,`Clearwater Industries`,`Procurement Lead`,``,`Seattle, WA`,47.6062,-122.3321,`gmail`,16],[`Elena`,`Driscoll`,`elena.d@summitgroupco.com`,`Summit Group Companies`,`Estimating Manager`,`+1 (250) 614-9982`,`Kelowna, BC`,49.888,-119.496,`outlook`,37],[`Peter`,`Nakashima`,`p.nakashima@summitgroupco.com`,`Summit Group Companies`,`Project Manager`,`+1 (250) 614-9990`,`Kelowna, BC`,49.888,-119.496,`outlook`,24],[`Bronwen`,`Achebe`,`b.achebe@summitgroupco.com`,`Summit Group Companies`,``,`+1 (403) 771-2205`,`Calgary, AB`,51.0447,-114.0719,`outlook`,11],[`Derek`,`Malone`,`derek.m@horizonbuild.ca`,`Horizon Builders`,`Preconstruction Manager`,`+1 (604) 442-8871`,`Vancouver, BC`,49.2827,-123.1207,`outlook`,35],[`Anneke`,`Vos`,`a.vos@horizonbuild.ca`,`Horizon Builders`,`Site Superintendent`,`+1 (604) 442-8884`,`Vancouver, BC`,49.2827,-123.1207,`outlook`,19],[`Femi`,`Adeyemi`,`f.adeyemi@horizonbuild.ca`,`Horizon Builders`,``,``,`Vancouver, BC`,49.2827,-123.1207,`imap`,6],[`Liam`,`Ashford`,`liam.a@cedarstonedev.ca`,`Cedarstone Developments`,`CFO`,`+1 (604) 883-4156`,`Vancouver, BC`,49.2827,-123.1207,`outlook`,34],[`Sylvie`,`Marchetti`,`s.marchetti@cedarstonedev.ca`,`Cedarstone Developments`,`Development Manager`,`+1 (604) 883-4162`,`Vancouver, BC`,49.2827,-123.1207,`outlook`,21],[`Hugh`,`Brennan`,`h.brennan@cedarstonedev.ca`,`Cedarstone Developments`,`Project Manager`,`+1 (604) 883-4177`,`Vancouver, BC`,49.2827,-123.1207,`gmail`,6],[`Owen`,`Beckett`,`owen.b@arclightmech.ca`,`Arclight Mechanical`,`Operations Lead`,`+1 (416) 773-2201`,`Toronto, ON`,43.6532,-79.3832,`outlook`,32],[`Meredith`,`Cole`,`m.cole@arclightmech.ca`,`Arclight Mechanical`,``,`+1 (416) 773-2218`,`Toronto, ON`,43.6532,-79.3832,`outlook`,14],[`Tessa`,`Langford`,`tessa.l@northshoreroof.ca`,`North Shore Roofing Co`,`Director`,`+1 (250) 671-3390`,`Nanaimo, BC`,49.1659,-123.9401,`outlook`,31],[`Aaron`,`Kirkbride`,`a.kirkbride@northshoreroof.ca`,`North Shore Roofing Co`,`Estimator`,`+1 (250) 671-3402`,`Nanaimo, BC`,49.1659,-123.9401,`imap`,13],[`Victor`,`Sandoval`,`victor.s@ridgelineltd.ca`,`Ridgeline Limited`,`Preconstruction Manager`,`+1 (250) 603-1108`,`Victoria, BC`,48.4284,-123.3656,`outlook`,29],[`Wren`,`Halloway`,`w.halloway@ridgelineltd.ca`,`Ridgeline Limited`,``,`+1 (250) 603-1121`,``,null,null,`outlook`,10],[`Gemma`,`Oyelowo`,`g.oyelowo@ironbridgefab.ca`,`Iron Bridge Fabrication`,`Quality Manager`,`+1 (250) 487-6620`,`Nanaimo, BC`,49.1659,-123.9401,`outlook`,28],[`Curtis`,`Nowak`,`c.nowak@ironbridgefab.ca`,`Iron Bridge Fabrication`,`Fabrication Lead`,``,`Nanaimo, BC`,49.1659,-123.9401,`imap`,5],[`Rick`,`Falconer`,`rick@falconequip.ca`,`Falcon Equipment`,`Owner`,`+1 (250) 754-8802`,`Nanaimo, BC`,49.1659,-123.9401,`outlook`,26],[`Jolene`,`Mbeki`,`j.mbeki@megacrane.ca`,`Mega Crane`,`Dispatch Manager`,`+1 (604) 298-4410`,`Vancouver, BC`,49.2827,-123.1207,`outlook`,25],[`Carl`,`Whitfield`,`carl.w@megacrane.ca`,`Mega Crane`,``,`+1 (604) 298-4423`,`Vancouver, BC`,49.2827,-123.1207,`outlook`,23],[`Sasha`,`Petrenko`,`s.petrenko@northwindciv.ca`,`Northwind Civil`,`Project Manager`,`+1 (403) 244-9917`,`Calgary, AB`,51.0447,-114.0719,`outlook`,20],[`Grant`,`Ibbotson`,`g.ibbotson@northwindciv.ca`,`Northwind Civil`,`Site Engineer`,`+1 (403) 244-9925`,`Calgary, AB`,51.0447,-114.0719,`gmail`,5],[`Dana`,`Rousseau`,`d.rousseau@prairiesteel.ca`,`Prairie Steel Works`,`Sales Manager`,`+1 (306) 668-3315`,`Saskatoon, SK`,52.1332,-106.67,`outlook`,18],[`Elijah`,`Munroe`,`e.munroe@prairiesteel.ca`,`Prairie Steel Works`,``,``,`Saskatoon, SK`,52.1332,-106.67,`imap`,4],[`Anita`,`Bergeron`,`a.bergeron@lauriergroupe.ca`,`Laurier Groupe`,`Directrice de projet`,`+1 (514) 397-2264`,`Montreal, QC`,45.5019,-73.5674,`outlook`,17],[`Colin`,`Fraser`,`c.fraser@atlanticmarine.ca`,`Atlantic Marine Services`,`Operations Manager`,`+1 (902) 429-7731`,`Halifax, NS`,44.6488,-63.5752,`outlook`,15],[`Marguerite`,`Okonkwo`,`m.okonkwo@redriverint.ca`,`Red River Interiors`,`Project Manager`,`+1 (204) 953-6620`,`Winnipeg, MB`,49.8951,-97.1384,`outlook`,15],[`Theo`,`Lindqvist`,`t.lindqvist@edmontonmech.ca`,`Edmonton Mechanical`,`Estimator`,`+1 (780) 421-9908`,`Edmonton, AB`,53.5461,-113.4938,`outlook`,12],[`Bianca`,`Ferreira`,`b.ferreira@puget-fab.com`,`Puget Fabrication`,`Operations Lead`,`+1 (206) 812-4470`,`Seattle, WA`,47.6062,-122.3321,`gmail`,26],[`Nathan`,`Oduya`,`n.oduya@puget-fab.com`,`Puget Fabrication`,``,`+1 (206) 812-4488`,`Seattle, WA`,47.6062,-122.3321,`gmail`,9],[`Erin`,`Kowalczyk`,`erin.k@willametteciv.com`,`Willamette Civil`,`Contracts Manager`,`+1 (503) 640-2219`,`Portland, OR`,45.5152,-122.6784,`gmail`,11],[`Sophie`,`Turner`,`sophie@northgate.co.uk`,`Northgate Ltd`,`Head of Partnerships`,`+44 20 7946 0812`,`London, UK`,51.5074,-.1278,`imap`,30],[`Alastair`,`Finch`,`a.finch@northgate.co.uk`,`Northgate Ltd`,``,`+44 20 7946 0829`,`London, UK`,51.5074,-.1278,`imap`,16],[`Priti`,`Raval`,`p.raval@mercerbuild.co.uk`,`Mercer Build Group`,`Commercial Manager`,`+44 161 496 0331`,`Manchester, UK`,53.4808,-2.2426,`imap`,21],[`Douglas`,`Mair`,`d.mair@clydeworks.co.uk`,`Clyde Works`,`Managing Director`,`+44 141 249 7702`,`Glasgow, UK`,55.8642,-4.2518,`imap`,14],[`Aoife`,`Byrne`,`aoife@liffeyholdings.ie`,`Liffey Holdings`,`Finance Director`,`+353 1 903 4417`,`Dublin, IE`,53.3498,-6.2603,`imap`,4],[`Ewan`,`Castellano`,`e.castellano@severnplant.co.uk`,`Severn Plant Hire`,``,``,`Bristol, UK`,51.4545,-2.5879,`imap`,3],[`Harriet`,`Okafor`,`h.okafor@lakeshoreelec.ca`,`Lakeshore Electrical`,`Project Manager`,`+1 (416) 990-2214`,`Toronto, ON`,43.6532,-79.3832,`outlook`,2],[`Sean`,`Whitlock`,`s.whitlock@lakeshoreelec.ca`,`Lakeshore Electrical`,``,`+1 (416) 990-2230`,`Toronto, ON`,43.6532,-79.3832,`outlook`,2],[`Margot`,`Delacroix`,`m.delacroix@aurorafacades.ca`,`Aurora Facades`,`Technical Director`,`+1 (613) 555-7788`,`Ottawa, ON`,45.4215,-75.6972,`outlook`,1],[`Ibrahim`,`Chaudhry`,`i.chaudhry@aurorafacades.ca`,`Aurora Facades`,`Estimator`,``,`Ottawa, ON`,45.4215,-75.6972,`outlook`,1],[`Lena`,`Vasquez`,`l.vasquez@stonecroftpm.ca`,`Stonecroft PM`,`Project Manager`,`+1 (778) 220-6614`,`Vancouver, BC`,49.2827,-123.1207,`outlook`,0]],r={"Westpoint Engineering":`Engineering`,"Clearwater Industries":`Industrial`,"Summit Group Companies":`Construction`,"Bayview Construction":`Construction`,"Horizon Builders":`Construction`,"Cedarstone Developments":`Property Development`,"Arclight Mechanical":`Mechanical`,"North Shore Roofing Co":`Roofing`,"Ridgeline Limited":`Construction`,"Iron Bridge Fabrication":`Fabrication`,"Falcon Equipment":`Plant & Equipment`,"Mega Crane":`Plant & Equipment`,"Northwind Civil":`Civil Engineering`,"Prairie Steel Works":`Fabrication`,"Laurier Groupe":`Construction`,"Atlantic Marine Services":`Marine`,"Red River Interiors":`Interiors`,"Edmonton Mechanical":`Mechanical`,"Puget Fabrication":`Fabrication`,"Willamette Civil":`Civil Engineering`,"Northgate Ltd":`Construction`,"Mercer Build Group":`Construction`,"Clyde Works":`Fabrication`,"Liffey Holdings":`Property Development`,"Severn Plant Hire":`Plant & Equipment`,"Lakeshore Electrical":`Electrical`,"Aurora Facades":`Facades`,"Stonecroft PM":`Project Management`},i=new Date;i.setHours(9,0,0,0);function a(e){return new Date(i.getTime()-e*864e5).toISOString()}function o(e){return`https://www.`+(e.split(`@`)[1]??``)}var s=n.map(([e,t,n,i,s,c,l,u,d,f,p])=>({firstName:e,lastName:t,email:n,company:i,jobTitle:s,phone:c,location:l,website:o(n),sector:r[i]??``,latitude:u??void 0,longitude:d??void 0,source:f,createdAt:a(p)}));function c(){let e={};return s.forEach(t=>{t.company&&(e[t.company]=(e[t.company]||0)+1)}),Object.entries(e).sort((e,t)=>t[1]-e[1])[0]?.[0]??`—`}function l(){let e={};return s.forEach(t=>{t.jobTitle&&t.jobTitle!==`—`&&(e[t.jobTitle]=(e[t.jobTitle]||0)+1)}),Object.entries(e).sort((e,t)=>t[1]-e[1])[0]?.[0]??`—`}function u(e){let t=Date.now()-new Date(e).getTime(),n=Math.floor(t/36e5);if(n<1)return`just now`;if(n<24)return`${n}h ago`;let r=Math.floor(n/24);return r<7?`${r}d ago`:`${Math.floor(r/7)}w ago`}function d(e){return((e.firstName?.[0]??``)+(e.lastName?.[0]??``)).toUpperCase()}var f=[{name:`Tendering`,emails:[`marcus.h@westpointeng.ca`,`elena.d@summitgroupco.com`,`rachel.t@bayviewconst.ca`,`victor.s@ridgelineltd.ca`,`derek.m@horizonbuild.ca`,`a.kirkbride@northshoreroof.ca`,`erin.k@willametteciv.com`,`t.lindqvist@edmontonmech.ca`,`p.raval@mercerbuild.co.uk`,`i.chaudhry@aurorafacades.ca`]},{name:`Site contacts`,emails:[`a.vos@horizonbuild.ca`,`g.ibbotson@northwindciv.ca`,`nadia.w@westpointeng.ca`,`g.oyelowo@ironbridgefab.ca`,`c.nowak@ironbridgefab.ca`,`j.mbeki@megacrane.ca`,`rick@falconequip.ca`,`c.fraser@atlanticmarine.ca`,`e.castellano@severnplant.co.uk`]}];function p(e){return s.filter(t=>t.company===e).length}function ee(e){return s.filter(t=>t.jobTitle===e).length}function m(e){let t=s.filter(t=>{let n=t[e];return typeof n==`string`&&n.trim()!==``&&n!==`—`}).length;return Math.round(t/s.length*100)}function h(e,t,n,r){return`
    <div class="card">
      <div class="stat-head">
        <p class="stat-title">${e}</p>
        ${r}
      </div>
      <p class="stat-value">${t}</p>
      <p class="stat-sub">${n}</p>
    </div>`}function g(){let e=[...s].sort((e,t)=>new Date(e.createdAt).getTime()-new Date(t.createdAt).getTime()).map((e,t)=>({t:new Date(e.createdAt).getTime(),n:t+1})),t=e[0]?.t??Date.now(),n=e[e.length-1]?.t??Date.now(),r=Math.max(n-t,1),i=Math.max(e.length,1),a=e=>38+(e-t)/r*850,o=e=>12+(1-e/i)*164,c=e.map(e=>`${a(e.t).toFixed(1)},${o(e.n).toFixed(1)}`).join(` `),l=`38,${176 .toFixed(1)} ${c} ${a(n).toFixed(1)},${176 .toFixed(1)}`,u=[0,.25,.5,.75,1].map(e=>{let t=Math.round(i*e),n=o(t).toFixed(1);return`<line class="chart-grid" x1="38" y1="${n}" x2="888" y2="${n}" />
        <text class="chart-label" x="32" y="${n}" text-anchor="end" dominant-baseline="middle">${t}</text>`}).join(``),d=e=>new Date(e).toLocaleDateString(`en-GB`,{day:`numeric`,month:`short`});return`
    <svg class="chart" viewBox="0 0 900 200"
      role="img" aria-label="Cumulative contact growth over time">
      ${u}
      <polygon class="chart-area" points="${l}" />
      <polyline class="chart-line" points="${c}" />
      <circle class="chart-dot" cx="${a(n).toFixed(1)}" cy="${o(i).toFixed(1)}" r="3" />
      <text class="chart-label" x="38" y="194">${d(t)}</text>
      <text class="chart-label" x="888" y="194" text-anchor="end">${d(n)}</text>
    </svg>`}function _(){return`
    <div class="card">
      <h2 class="card-title">Recent Contacts</h2>
      <ul class="recent-list">${[...s].sort((e,t)=>new Date(t.createdAt).getTime()-new Date(e.createdAt).getTime()).slice(0,5).map(e=>`
      <li class="recent-item">
        <div class="avatar">${d(e)}</div>
        <div class="recent-body">
          <p class="recent-name">${e.firstName} ${e.lastName}</p>
          <p class="recent-meta">${e.company}</p>
        </div>
      </li>`).join(``)}</ul>
    </div>`}function v(){return`
    <div class="card">
      <h2 class="card-title">Recent Activity</h2>
      <ul class="activity-list">${[...s].sort((e,t)=>new Date(t.createdAt).getTime()-new Date(e.createdAt).getTime()).slice(0,6).map(e=>`
      <li>
        <span class="muted">Added </span>
        <span>${e.firstName} ${e.lastName}</span>
        <span class="when">${u(e.createdAt)}</span>
      </li>`).join(``)}</ul>
    </div>`}function y(e,t,n){return`
    <button class="comp-row" data-demo="In the app, this opens a fill-in-the-blanks flow for that field.">
      ${e}
      <span class="comp-label">${t}</span>
      <span class="comp-track"><span class="comp-fill" style="width:${n}%"></span></span>
      <span class="comp-pct tabular">${n}%</span>
    </button>`}function te(){let e=[...new Set(s.map(e=>e.source))].map(e=>`<span class="chip">${e} · ${s.filter(t=>t.source===e).length}</span>`);return`
    <div class="card">
      <h2 class="card-title">Data Completeness</h2>
      ${y(t.mail,`Email`,m(`email`))}
      ${y(t.phone,`Phone`,m(`phone`))}
      ${y(t.building,`Company`,m(`company`))}
      ${y(t.briefcase,`Job Title`,m(`jobTitle`))}
      ${y(t.mapPin,`Location`,m(`location`))}
      <div class="sources">
        <p>Sources</p>
        <div class="source-chips">${e.join(``)}</div>
      </div>
    </div>`}function b(e,t=0){let n=Date.now()-t*864e5,r=n-e*864e5;return s.filter(e=>{let t=new Date(e.createdAt).getTime();return t>r&&t<=n}).length}function x(){let e=c(),n=l(),r=b(7),i=b(7,7),a=i===0?r>0?`+100%`:`0%`:`${r>=i?`+`:``}${Math.round((r-i)/i*100)}%`;return`
    <div class="stat-grid">
      ${h(`Total Contacts`,String(s.length),`${r} added this week`,t.users)}
      ${h(`Top Company`,e,`${p(e)} contacts`,t.building)}
      ${h(`Top Role`,n,`${ee(n)} contacts`,t.briefcase)}
      ${h(`Growth`,a,`Week over week`,t.trendingUp)}
    </div>

    <div class="card section-gap">
      <h2 class="card-title">Contact Growth</h2>
      ${g()}
    </div>

    <div class="grid-3 section-gap">
      ${_()}
      ${v()}
      ${te()}
    </div>`}var S=[{field:`firstName`,label:`Name`,cls:``},{field:`email`,label:`Email`,cls:`col-md`},{field:`company`,label:`Company`,cls:`col-lg`},{field:`jobTitle`,label:`Title`,cls:`col-lg`}];function C(e,t){if(!t)return!0;let n=t.toLowerCase();return[e.firstName,e.lastName,e.email,e.company,e.jobTitle,e.phone,e.location].some(e=>(e??``).toLowerCase().includes(n))}function w(e,t){return(t===`firstName`?`${e.firstName} ${e.lastName}`:e[t]??``).toLowerCase()}function T(e){let t=s;if(e.folder){let n=f.find(t=>t.name===e.folder),r=n?n.emails:[];t=t.filter(e=>r.includes(e.email))}if(t=t.filter(t=>C(t,e.query)),e.sortField){let n=e.sortField,r=e.sortDir===`asc`?1:-1;t=[...t].sort((e,t)=>{let i=w(e,n),a=w(t,n);return!i&&a?1:i&&!a?-1:i.localeCompare(a)*r})}return t}function E(e,n,r,i){let a=i.sortField===e,o=a?i.sortDir===`asc`?`<svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m6 15 6-6 6 6"/></svg>`:`<svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg>`:t.arrowUpDown;return`<th class="${r}">
    <button class="sort-btn${a?` active`:``}" data-sort="${e}"
      aria-label="Sort by ${n}${a?`, currently ${i.sortDir}ending`:``}">
      ${n}${o}
    </button>
  </th>`}function D(e){return`
    <tr>
      <td><input type="checkbox" aria-label="Select ${e.firstName} ${e.lastName}" /></td>
      <td>
        <div class="cell-name">
          <div class="avatar">${d(e)}</div>
          <div>
            <div class="name-main">${e.firstName} ${e.lastName}</div>
            <div class="name-source">${e.source}</div>
          </div>
        </div>
      </td>
      <td class="col-md mono-cell muted-cell">${e.email}</td>
      <td class="col-lg">${e.company}</td>
      <td class="col-lg muted-cell">${e.jobTitle}</td>
      <td class="col-lg mono-cell muted-cell">${e.phone}</td>
      <td class="col-lg muted-cell">${e.location}</td>
    </tr>`}function O(e){let n=T(e),r=e.folder?`Nothing in ${e.folder} matches “${e.query}”.`:`No contacts match “${e.query}”.`,i=n.length?n.map(D).join(``):`<tr class="empty-row"><td colspan="7">${r}</td></tr>`;return`
    <div class="table-meta">${e.folder?`<div class="filter-chip">
         <span>Folder: <strong>${e.folder}</strong></span>
         <button data-clear-folder aria-label="Clear folder filter">${t.x}</button>
       </div>`:``}${`<p class="row-count">${n.length} of ${s.length} contacts</p>`}</div>

    <div class="bulk-bar" id="bulk-bar" hidden>
      <span class="bulk-count" id="bulk-count">0 selected</span>
      <button class="btn btn-sm" data-demo="Folder assignment is disabled in this demo.">Add to folder</button>
      <button class="btn btn-sm" data-demo="Export is disabled in this demo.">Export selected</button>
      <button class="btn btn-sm" data-demo="Deleting is disabled in this demo.">${t.trash}Delete</button>
    </div>

    <div class="table-wrap">
      <table>
        <thead>
          <tr>
            <th style="width:40px"><input type="checkbox" id="select-all" aria-label="Select all contacts" /></th>
            ${S.map(t=>E(t.field,t.label,t.cls,e)).join(``)}
            <th class="col-lg">Phone</th>
            <th class="col-lg">Location</th>
          </tr>
        </thead>
        <tbody>${i}</tbody>
      </table>
    </div>`}function k(){let e=document.getElementById(`bulk-bar`),t=document.getElementById(`bulk-count`),n=document.getElementById(`select-all`);if(!e||!t)return;let r=()=>Array.from(document.querySelectorAll(`tbody input[type="checkbox"]`)),i=()=>{let i=r(),a=i.filter(e=>e.checked).length;e.hidden=a===0,t.textContent=`${a} selected`,n&&(n.checked=a>0&&a===i.length,n.indeterminate=a>0&&a<i.length)};r().forEach(e=>e.addEventListener(`change`,i)),n?.addEventListener(`change`,()=>{r().forEach(e=>e.checked=n.checked),i()})}var A=null;function ne(){return`<div class="map-holder"><div id="map"></div></div>`}function re(){let e=document.getElementById(`map`);if(!e||typeof L>`u`)return;A&&=(A.remove(),null),A=L.map(e,{center:[51,-60],zoom:3,zoomControl:!0}),L.tileLayer(`https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png`,{attribution:`&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/">CARTO</a>`,subdomains:`abcd`,maxZoom:19}).addTo(A);let t=L.markerClusterGroup({maxClusterRadius:50,showCoverageOnHover:!1,iconCreateFunction:e=>L.divIcon({html:`<div style="background:#e8e8e0;color:#0d0d0d;">${e.getChildCount()}</div>`,className:`marker-cluster`,iconSize:L.point(40,40)})});s.forEach(e=>{e.latitude==null||e.longitude==null||L.marker([e.latitude,e.longitude]).bindPopup(`<div class="popup-name">${e.firstName} ${e.lastName}</div><div class="popup-meta">${e.company}</div><div class="popup-meta">${e.jobTitle}</div>`).addTo(t)}),A.addLayer(t),requestAnimationFrame(()=>A&&A.invalidateSize())}var j=50,M=300,N=12;function P(e,t,n){let r=Math.min(100,Math.round(t/n*100));return`
    <div class="usage-line">
      <div class="usage-labels">
        <span>${e}</span><span class="tabular">${t} / ${n}</span>
      </div>
      <div class="usage-track"><div class="usage-fill${r>=80?` warn`:``}" style="width:${r}%"></div></div>
    </div>`}function F(e){return`<li>${t.check}<span>${e}</span></li>`}function I(){return`
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
          ${P(`Emails scanned today`,N,j)}
          ${P(`Emails scanned total`,s.length,M)}
        </div>
        <ul class="plan-list">
          ${F(`Scan up to 300 emails (50/day)`)}
          ${F(`Outlook, IMAP, or a forwarding address`)}
          ${F(`AI signature parsing`)}
          ${F(`CSV &amp; Excel export`)}
          ${F(`Interactive map`)}
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
          ${F(`Unlimited scanning — 2,000 emails/day`)}
          ${F(`Unlimited contacts`)}
          ${F(`Full inbox backfill`)}
          ${F(`Bulk import &amp; export`)}
          ${F(`Mobile app + business card scanning`)}
        </ul>
        <button class="usage-upgrade" style="margin-top:16px"
          data-demo="Checkout is disabled in this demo — upgrade from the real app at sigbot.app.">
          Upgrade to Pro
        </button>
      </div>
    </div>`}var R=[{view:`dashboard`,label:`Dashboard`,icon:t.layoutDashboard},{view:`contacts`,label:`Contacts`,icon:t.users},{view:`map`,label:`Map`,icon:t.map},{view:`account`,label:`Account`,icon:t.circleUser}],z=50,B=300,V=12,H=`dashboard`,U={query:``,sortField:null,sortDir:`asc`,folder:null},W;function G(e){let t=document.getElementById(`toast`);t&&(t.textContent=e,t.classList.add(`show`),window.clearTimeout(W),W=window.setTimeout(()=>t.classList.remove(`show`),2800))}function K(){let e=Math.round(s.length/B*100);return`
    <div class="usage">
      <div class="usage-head">
        <span class="usage-title">Email scraping</span>
        <span class="plan-badge">Free</span>
      </div>
      <div class="usage-line">
        <div class="usage-labels"><span>Today</span><span class="tabular">${V} / ${z}</span></div>
        <div class="usage-track"><div class="usage-fill" style="width:${Math.round(V/z*100)}%"></div></div>
      </div>
      <div class="usage-line">
        <div class="usage-labels"><span>Total</span><span class="tabular">${s.length} / ${B}</span></div>
        <div class="usage-track"><div class="usage-fill" style="width:${e}%"></div></div>
      </div>
      <button class="usage-upgrade" data-goto="account">Upgrade</button>
    </div>`}function q(){let e=R.map(e=>`<button class="nav-link${e.view===H?` active`:``}" data-view="${e.view}">
      ${e.icon}${e.label}
    </button>`).join(``);return`
    <aside class="sidebar">
      <div class="sidebar-brand">Sigbot</div>

      <div class="team-switcher">
        <button data-demo="Team switching is disabled in this demo.">
          <span>Personal</span>${t.chevronDown}
        </button>
      </div>

      <nav class="sidebar-nav">${e}</nav>

      <div class="sidebar-folders">
        <div class="folders-head">
          <span>Folders</span>
          <button data-demo="Creating folders is disabled in this demo." aria-label="New folder">${t.plus}</button>
        </div>
        ${f.map(e=>`<button class="folder-item${U.folder===e.name?` active`:``}"
              data-folder="${e.name}">${t.folder}${e.name}
              <span class="folder-count tabular">${e.emails.length}</span>
            </button>`).join(``)}
      </div>

      ${K()}
    </aside>`}function J(){let e={dashboard:`Dashboard`,contacts:`Contacts`,map:`Map`,account:`Account`},n=H===`contacts`?`<div class="search-wrap">
           ${t.search}
           <input class="search-input" id="search" type="text" placeholder="Search contacts..."
             value="${U.query}" aria-label="Search contacts" />
         </div>`:``;return`
    <header class="header">
      <div class="header-row">
        <h1 class="header-title">${e[H]}</h1>
        <div class="header-spacer"></div>
        ${n}

        <div class="menu-wrap">
          <button class="btn" data-menu="add">${t.upload}<span class="btn-label">Add Data</span></button>
          <div class="menu" id="menu-add" hidden>
            <button data-demo="Importing is disabled here. The real app takes Excel, CSV and vCard.">
              ${t.fileUp}Import (Excel/CSV/vCard)
            </button>
            <button data-demo="Connect an inbox at sigbot.app — Outlook in one click, or IMAP with an app password.">
              ${t.mail}Scrape Emails
            </button>
          </div>
        </div>

        <div class="menu-wrap">
          <button class="btn" data-menu="export">${t.download}<span class="btn-label">Export Data</span></button>
          <div class="menu" id="menu-export" hidden>
            <button data-demo="Export is disabled in this demo.">Export Excel</button>
            <button data-demo="Export is disabled in this demo.">Export CSV</button>
            <button data-demo="Export is disabled in this demo.">Export JSON</button>
            <button data-demo="Export is disabled in this demo.">Export vCard</button>
          </div>
        </div>

        <button class="btn btn-primary" data-demo="Adding contacts is disabled in this demo.">
          ${t.plus}<span class="btn-label">New Contact</span>
        </button>
      </div>
    </header>`}function Y(){switch(H){case`contacts`:return O(U);case`map`:return ne();case`account`:return I();default:return x()}}function X(){let e=document.getElementById(`app`);e&&(e.innerHTML=`
    ${q()}
    <div class="main">
      ${J()}
      <div class="content${H===`map`?` content--map`:``}" id="content">${Y()}</div>
    </div>
    <div class="toast" id="toast" role="status" aria-live="polite"></div>`,H===`map`&&re(),H===`contacts`&&ie())}function ie(){k();let e=document.getElementById(`search`);e&&e.addEventListener(`input`,()=>{U.query=e.value,Z()})}function Z(){let e=document.getElementById(`content`);e&&(e.innerHTML=O(U),k())}function Q(e){e!==H&&(H=e,e!==`contacts`&&(U.query=``),X())}function $(){document.querySelectorAll(`.menu`).forEach(e=>e.hidden=!0)}document.addEventListener(`click`,e=>{let t=e.target,n=t.closest(`[data-view]`);if(n){Q(n.dataset.view);return}let r=t.closest(`[data-sort]`);if(r){let e=r.dataset.sort;U.sortField===e?U.sortDir=U.sortDir===`asc`?`desc`:`asc`:(U.sortField=e,U.sortDir=`asc`),Z();return}let i=t.closest(`[data-folder]`);if(i){let e=i.dataset.folder??null;U.folder=U.folder===e?null:e,H===`contacts`?X():(H=`contacts`,U.query=``,X());return}if(t.closest(`[data-clear-folder]`)){U.folder=null,X();return}let a=t.closest(`[data-goto]`);if(a){Q(a.dataset.goto);return}let o=t.closest(`[data-menu]`);if(o){let e=`menu-${o.dataset.menu}`,t=document.getElementById(e),n=t?!t.hidden:!1;$(),t&&(t.hidden=n);return}let s=t.closest(`[data-demo]`);if(s){G(s.dataset.demo??``),$();return}$()}),document.addEventListener(`keydown`,e=>{e.key===`Escape`&&$()}),X();