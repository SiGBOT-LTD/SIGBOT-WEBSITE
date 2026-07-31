/**
 * Map — mirrors apps/web/src/components/map/map-view.tsx.
 *
 * The app uses react-leaflet with a marker-cluster layer over the CARTO
 * dark basemap; this is the same Leaflet setup driven directly. Cluster
 * bubble styling matches the `.marker-cluster` rules in the app's
 * globals.css.
 */

import { contacts } from '../data';

declare const L: any;

let map: any = null;

export function renderMap(): string {
  return '<div class="map-holder"><div id="map"></div></div>';
}

export function mountMap(): void {
  const el = document.getElementById('map');
  if (!el || typeof L === 'undefined') return;

  // A fresh container each render, so drop any previous instance rather
  // than letting Leaflet attach twice to a detached node.
  if (map) {
    map.remove();
    map = null;
  }

  map = L.map(el, { center: [51.0, -60.0], zoom: 3, zoomControl: true });

  L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/">CARTO</a>',
    subdomains: 'abcd',
    maxZoom: 19,
  }).addTo(map);

  const clusters = L.markerClusterGroup({
    maxClusterRadius: 50,
    showCoverageOnHover: false,
    iconCreateFunction: (cluster: any) =>
      L.divIcon({
        html: `<div style="background:#e8e8e0;color:#0d0d0d;">${cluster.getChildCount()}</div>`,
        className: 'marker-cluster',
        iconSize: L.point(40, 40),
      }),
  });

  contacts.forEach((c) => {
    if (c.latitude == null || c.longitude == null) return;
    L.marker([c.latitude, c.longitude])
      .bindPopup(
        `<div class="popup-name">${c.firstName} ${c.lastName}</div>` +
          `<div class="popup-meta">${c.company}</div>` +
          `<div class="popup-meta">${c.jobTitle}</div>`
      )
      .addTo(clusters);
  });

  map.addLayer(clusters);

  // The container is sized by flex layout, which Leaflet cannot know
  // about at construction time.
  requestAnimationFrame(() => map && map.invalidateSize());
}
