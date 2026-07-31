/* ─── ROTATING WIREFRAME GLOBE WITH CONTACT PINS ─── */
(function () {
  const canvas = document.getElementById('globe-canvas');
  const stage = document.getElementById('globe-stage');
  const popup = document.getElementById('globe-popup');
  if (!canvas || !stage || !popup || typeof d3 === 'undefined') return;

  const context = canvas.getContext('2d');
  if (!context) return;

  // Demo contacts — one pin per city
  const PINS = [
    { lat: 37.39, lng: -122.08, name: 'Sarah Jenkins', role: 'Senior Engineer', company: 'Google', email: 'sarah@google.com', location: 'Mountain View, US', initials: 'SJ', grad: 'linear-gradient(135deg,#EA4335,#FBBC05)' },
    { lat: 43.65, lng: -79.38, name: 'David Miller', role: 'VP of Business Development', company: 'Acme Corp', email: 'david.miller@acmecorp.com', location: 'Toronto, CA', initials: 'DM', grad: 'linear-gradient(135deg,#3b82f6,#8b5cf6)' },
    { lat: 51.51, lng: -0.13, name: 'Sophie Turner', role: 'Head of Partnerships', company: 'Northgate Ltd', email: 'sophie@northgate.co.uk', location: 'London, UK', initials: 'ST', grad: 'linear-gradient(135deg,#f59e0b,#ef4444)' },
    { lat: 52.52, lng: 13.4, name: 'Lukas Weber', role: 'CTO', company: 'Fenster GmbH', email: 'lukas@fenster.de', location: 'Berlin, DE', initials: 'LW', grad: 'linear-gradient(135deg,#10b981,#3b82f6)' },
    { lat: 19.08, lng: 72.88, name: 'Priya Sharma', role: 'Product Lead', company: 'Lotus Tech', email: 'priya@lotustech.in', location: 'Mumbai, IN', initials: 'PS', grad: 'linear-gradient(135deg,#f97316,#ec4899)' },
    { lat: 35.68, lng: 139.69, name: 'Kenji Sato', role: 'Sales Director', company: 'Nakamura KK', email: 'kenji@nakamura.jp', location: 'Tokyo, JP', initials: 'KS', grad: 'linear-gradient(135deg,#ec4899,#8b5cf6)' },
    { lat: -33.87, lng: 151.21, name: 'Olivia Bennett', role: 'Operations Lead', company: 'Harbour Group', email: 'olivia@harbourgroup.au', location: 'Sydney, AU', initials: 'OB', grad: 'linear-gradient(135deg,#06b6d4,#3b82f6)' },
    { lat: -23.55, lng: -46.63, name: 'Maria Santos', role: 'Marketing Director', company: 'Verde SA', email: 'maria@verde.com.br', location: 'São Paulo, BR', initials: 'MS', grad: 'linear-gradient(135deg,#22c55e,#eab308)' },
    { lat: 40.71, lng: -74.01, name: 'Marcus Reid', role: 'Managing Partner', company: 'Hudson & Clarke', email: 'm.reid@hudsonclarke.com', location: 'New York, US', initials: 'MR', grad: 'linear-gradient(135deg,#6366f1,#06b6d4)' },
    { lat: 49.28, lng: -123.12, name: 'Chloe Nguyen', role: 'Estimating Manager', company: 'Westpoint Engineering', email: 'chloe.n@westpointeng.ca', location: 'Vancouver, CA', initials: 'CN', grad: 'linear-gradient(135deg,#14b8a6,#3b82f6)' },
    { lat: 19.43, lng: -99.13, name: 'Diego Ramírez', role: 'Procurement Lead', company: 'Grupo Aurora', email: 'diego@grupoaurora.mx', location: 'Mexico City, MX', initials: 'DR', grad: 'linear-gradient(135deg,#ef4444,#a855f7)' },
    { lat: 53.35, lng: -6.26, name: 'Aoife Byrne', role: 'Finance Director', company: 'Liffey Holdings', email: 'aoife@liffeyholdings.ie', location: 'Dublin, IE', initials: 'AB', grad: 'linear-gradient(135deg,#059669,#22d3ee)' },
    { lat: 48.86, lng: 2.35, name: 'Camille Laurent', role: 'Account Executive', company: 'Maison Duval', email: 'camille@maisonduval.fr', location: 'Paris, FR', initials: 'CL', grad: 'linear-gradient(135deg,#8b5cf6,#ec4899)' },
    { lat: 25.2, lng: 55.27, name: 'Omar Haddad', role: 'Regional Manager', company: 'Zenith Contracting', email: 'omar@zenithcontracting.ae', location: 'Dubai, AE', initials: 'OH', grad: 'linear-gradient(135deg,#0ea5e9,#6366f1)' },
    { lat: 1.35, lng: 103.82, name: 'Wei Lin Tan', role: 'Head of Supply Chain', company: 'Meridian Pte', email: 'weilin@meridian.sg', location: 'Singapore, SG', initials: 'WT', grad: 'linear-gradient(135deg,#f43f5e,#6366f1)' },
    { lat: -33.92, lng: 18.42, name: 'Thandiwe Mokoena', role: 'Business Development', company: 'Table Bay Group', email: 'thandiwe@tablebay.co.za', location: 'Cape Town, ZA', initials: 'TM', grad: 'linear-gradient(135deg,#84cc16,#06b6d4)' },
    { lat: -36.85, lng: 174.76, name: 'Jack Thornton', role: 'Site Manager', company: 'Kauri Build', email: 'jack@kauribuild.nz', location: 'Auckland, NZ', initials: 'JT', grad: 'linear-gradient(135deg,#3b82f6,#a855f7)' }
  ];

  const projection = d3.geoOrthographic().clipAngle(90);
  const path = d3.geoPath(projection, context);
  const graticule = d3.geoGraticule();

  let width = 0;
  let height = 0;
  let radius = 0;
  let landFeatures = null;
  const allDots = [];
  const rotation = [-40, -18];
  let autoRotate = true;
  let popupPin = null;
  let dragStart = null;

  function resize() {
    width = Math.min(760, stage.clientWidth);
    height = Math.max(360, Math.min(540, width * 0.72));
    radius = Math.min(width, height) / 2.35;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';
    context.setTransform(dpr, 0, 0, dpr, 0, 0);
    projection.scale(radius).translate([width / 2, height / 2]).rotate(rotation);
    render();
  }

  function pointInPolygon(point, polygon) {
    const x = point[0];
    const y = point[1];
    let inside = false;
    for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
      const xi = polygon[i][0];
      const yi = polygon[i][1];
      const xj = polygon[j][0];
      const yj = polygon[j][1];
      if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) {
        inside = !inside;
      }
    }
    return inside;
  }

  function pointInFeature(point, feature) {
    const geometry = feature.geometry;
    if (geometry.type === 'Polygon') {
      const coords = geometry.coordinates;
      if (!pointInPolygon(point, coords[0])) return false;
      for (let i = 1; i < coords.length; i++) {
        if (pointInPolygon(point, coords[i])) return false;
      }
      return true;
    }
    if (geometry.type === 'MultiPolygon') {
      for (const polygon of geometry.coordinates) {
        if (pointInPolygon(point, polygon[0])) {
          let inHole = false;
          for (let i = 1; i < polygon.length; i++) {
            if (pointInPolygon(point, polygon[i])) { inHole = true; break; }
          }
          if (!inHole) return true;
        }
      }
      return false;
    }
    return false;
  }

  function generateDots(feature) {
    const bounds = d3.geoBounds(feature);
    const minLng = bounds[0][0];
    const minLat = bounds[0][1];
    const maxLng = bounds[1][0];
    const maxLat = bounds[1][1];
    const step = 1.28;
    for (let lng = minLng; lng <= maxLng; lng += step) {
      for (let lat = minLat; lat <= maxLat; lat += step) {
        if (pointInFeature([lng, lat], feature)) {
          allDots.push([lng, lat]);
        }
      }
    }
  }

  function pinVisible(pin) {
    const r = projection.rotate();
    return d3.geoDistance([pin.lng, pin.lat], [-r[0], -r[1]]) < Math.PI / 2 - 0.06;
  }

  // Pull the palette off the stylesheet rather than repeating hexes here, so
  // the globe cannot drift out of sync with the tokens the way it did when the
  // accent was still a hardcoded blue.
  const css = getComputedStyle(document.documentElement);
  const token = (name, fallback) => (css.getPropertyValue(name).trim() || fallback);
  const PALETTE = {
    sphere: token('--bg', '#0A0B0D'),
    accent: token('--accent', '#F0A93B'),
    accentRgb: token('--accent-rgb', '240, 169, 59'),
    land: token('--chrome', '#6B7080'),
  };

  function render() {
    context.clearRect(0, 0, width, height);

    // Sphere
    context.beginPath();
    context.arc(width / 2, height / 2, projection.scale(), 0, 2 * Math.PI);
    context.fillStyle = PALETTE.sphere;
    context.fill();
    context.strokeStyle = 'rgba(255,255,255,0.8)';
    context.lineWidth = 1.5;
    context.stroke();

    // Graticule
    context.beginPath();
    path(graticule());
    context.strokeStyle = '#ffffff';
    context.lineWidth = 0.6;
    context.globalAlpha = 0.22;
    context.stroke();
    context.globalAlpha = 1;

    if (landFeatures) {
      // Land outlines
      context.beginPath();
      landFeatures.features.forEach(function (f) { path(f); });
      context.strokeStyle = 'rgba(255,255,255,0.85)';
      context.lineWidth = 0.8;
      context.stroke();

      // Halftone dots
      context.fillStyle = PALETTE.land;
      allDots.forEach(function (dot) {
        const p = projection(dot);
        if (p) {
          context.beginPath();
          context.arc(p[0], p[1], 1.1, 0, 2 * Math.PI);
          context.fill();
        }
      });
    }

    // Contact pins
    PINS.forEach(function (pin) {
      if (!pinVisible(pin)) return;
      const p = projection([pin.lng, pin.lat]);
      if (!p) return;
      context.beginPath();
      context.arc(p[0], p[1], 10, 0, 2 * Math.PI);
      context.fillStyle = 'rgba(' + PALETTE.accentRgb + ', 0.25)';
      context.fill();
      context.beginPath();
      context.arc(p[0], p[1], 5, 0, 2 * Math.PI);
      context.fillStyle = PALETTE.accent;
      context.fill();
      context.strokeStyle = '#ffffff';
      context.lineWidth = 1.5;
      context.stroke();
    });

    // Keep popup pinned to its contact while visible
    if (popupPin) {
      if (!pinVisible(popupPin)) {
        closePopup();
      } else {
        positionPopup();
      }
    }
  }

  function positionPopup() {
    const p = projection([popupPin.lng, popupPin.lat]);
    if (!p) return;
    const x = canvas.offsetLeft + p[0];
    const y = canvas.offsetTop + p[1];
    const half = 135;
    popup.style.left = Math.max(half, Math.min(stage.clientWidth - half, x)) + 'px';
    popup.style.top = (y - 12) + 'px';
  }

  function openPopup(pin) {
    popupPin = pin;
    autoRotate = false;
    popup.innerHTML =
      '<button class="globe-popup-close" aria-label="Close">×</button>' +
      '<div class="globe-popup-head">' +
        '<div class="globe-popup-avatar" style="background:' + pin.grad + '">' + pin.initials + '</div>' +
        '<div>' +
          '<div class="globe-popup-name">' + pin.name + '</div>' +
          '<div class="globe-popup-role">' + pin.role + '</div>' +
        '</div>' +
      '</div>' +
      '<div class="globe-popup-rows">' +
        '<div><span>🏢</span>' + pin.company + '</div>' +
        '<div><span>✉</span>' + pin.email + '</div>' +
        '<div><span>📍</span>' + pin.location + '</div>' +
      '</div>' +
      '<div class="globe-popup-badge">✓ EXTRACTED BY SIGBOT</div>';
    popup.hidden = false;
    popup.querySelector('.globe-popup-close').addEventListener('click', closePopup);
    positionPopup();
  }

  function closePopup() {
    popupPin = null;
    popup.hidden = true;
    autoRotate = true;
  }

  function pinAt(event) {
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    for (const pin of PINS) {
      if (!pinVisible(pin)) continue;
      const p = projection([pin.lng, pin.lat]);
      if (p && Math.hypot(p[0] - x, p[1] - y) < 14) return pin;
    }
    return null;
  }

  canvas.addEventListener('pointerdown', function (e) {
    dragStart = { x: e.clientX, y: e.clientY, rot: rotation.slice(), moved: false };
    autoRotate = false;
    canvas.setPointerCapture(e.pointerId);
  });

  canvas.addEventListener('pointermove', function (e) {
    if (!dragStart) {
      canvas.style.cursor = pinAt(e) ? 'pointer' : 'grab';
      return;
    }
    const dx = e.clientX - dragStart.x;
    const dy = e.clientY - dragStart.y;
    if (Math.abs(dx) + Math.abs(dy) > 4) dragStart.moved = true;
    rotation[0] = dragStart.rot[0] + dx * 0.4;
    rotation[1] = Math.max(-90, Math.min(90, dragStart.rot[1] - dy * 0.4));
    projection.rotate(rotation);
    render();
  });

  canvas.addEventListener('pointerup', function (e) {
    const wasDrag = dragStart && dragStart.moved;
    dragStart = null;
    if (!wasDrag) {
      const pin = pinAt(e);
      if (pin) { openPopup(pin); return; }
      closePopup();
      return;
    }
    if (!popupPin) autoRotate = true;
  });

  // Auto-rotation. Skipped entirely under prefers-reduced-motion — the globe
  // stays interactive (drag and pin clicks still work), it just doesn't spin
  // on its own. Live query so a mid-session OS change is honoured.
  var reduceMotion = window.matchMedia
    ? window.matchMedia('(prefers-reduced-motion: reduce)')
    : null;

  d3.timer(function () {
    if (autoRotate && !(reduceMotion && reduceMotion.matches)) {
      rotation[0] += 0.25;
      projection.rotate(rotation);
      render();
    }
  });

  let resizeTimer;
  window.addEventListener('resize', function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(resize, 150);
  });

  resize();

  // Load land data and build halftone dots
  fetch('https://raw.githubusercontent.com/martynafford/natural-earth-geojson/refs/heads/master/110m/physical/ne_110m_land.json')
    .then(function (res) {
      if (!res.ok) throw new Error('Failed to load land data');
      return res.json();
    })
    .then(function (json) {
      landFeatures = json;
      landFeatures.features.forEach(generateDots);
      render();
    })
    .catch(function () {
      // Globe still renders as a wireframe sphere with pins if land data fails
      render();
    });
})();
