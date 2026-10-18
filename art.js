window.TuneLabArt = (function () {
  "use strict";

  let n = 0;
  const esc = (s) =>
    String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

  /* ---------- سیلوئت ماشین‌ها (0 هاچ‌بک، 1 سدان، 2 اسپورت، 3 شاسی‌بلند) ---------- */
  const CARS = [
    {
      body: "M22 104 V88 Q22 78 38 74 L92 66 L118 38 Q122 34 130 34 H214 Q224 34 230 42 L262 80 Q282 82 294 88 V104 Z",
      win: "M102 64 L122 41 H218 L246 64 Z M170 41 V64",
      front: 22, rear: 294
    },
    {
      body: "M20 104 V86 Q20 76 36 72 L92 64 L116 38 Q120 34 128 34 H200 Q208 34 214 40 L236 64 L284 72 Q300 76 300 88 V104 Z",
      win: "M101 62 L121 41 H203 L224 62 Z M163 41 V62",
      front: 20, rear: 300
    },
    {
      body: "M16 104 V92 Q16 84 34 80 L112 70 L152 46 Q160 40 172 40 H206 Q220 40 232 50 L264 76 L292 82 Q308 86 308 96 V104 Z",
      win: "M126 68 L158 48 H204 Q214 48 222 54 L246 72 Z",
      front: 16, rear: 308
    },
    {
      body: "M20 104 V80 Q20 70 36 68 L84 62 L100 36 Q102 32 110 32 H226 Q234 32 238 40 L248 62 L290 66 Q304 68 304 82 V104 Z",
      win: "M92 61 L106 40 H168 V61 Z M174 40 H228 L238 61 H174 Z",
      front: 20, rear: 304
    }
  ];

  function carSilhouette(body, label) {
    const c = CARS[body] || CARS[1];
    const id = "ag" + ++n;
    return `<svg class="art art-car" viewBox="0 0 320 140" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${esc(label || "Car")}">
      <defs>
        <linearGradient id="${id}" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stop-color="#00e5ff" stop-opacity=".30"/>
          <stop offset="1" stop-color="#8a5cff" stop-opacity=".10"/>
        </linearGradient>
      </defs>
      <ellipse cx="160" cy="124" rx="140" ry="8" fill="#8a5cff" opacity=".22"/>
      <path d="${c.body}" fill="url(#${id})" stroke="#00e5ff" stroke-width="2.5" stroke-linejoin="round"/>
      <path d="${c.win}" fill="none" stroke="#00e5ff" stroke-width="1.6" stroke-linejoin="round" opacity=".7"/>
      <rect x="${c.front + 1}" y="88" width="9" height="5" rx="2" fill="#ffffff"/>
      <rect x="${c.rear - 10}" y="88" width="9" height="5" rx="2" fill="#ff2e93"/>
      <g fill="#07070d" stroke="#ff2e93" stroke-width="3">
        <circle cx="82" cy="104" r="20"/><circle cx="244" cy="104" r="20"/>
      </g>
      <g fill="none" stroke="#00e5ff" stroke-width="2">
        <circle cx="82" cy="104" r="9"/><circle cx="244" cy="104" r="9"/>
      </g>
    </svg>`;
  }

  /* ---------- نشان جایگزین برند (حروف اول، نه لوگوی واقعی) ---------- */
  function initials(name) {
    const words = String(name).replace(/\(.*?\)/g, "").split(/[\s-]+/).filter(Boolean);
    if (words.length >= 2) return (words[0][0] + words[1][0]).toUpperCase();
    return (words[0] || "?").slice(0, 2).toUpperCase();
  }

  function brandBadge(name, label) {
    const id = "ag" + ++n;
    return `<svg class="art art-badge" viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${esc(label || name)}">
      <defs>
        <linearGradient id="${id}" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stop-color="#00e5ff" stop-opacity=".30"/>
          <stop offset="1" stop-color="#8a5cff" stop-opacity=".25"/>
        </linearGradient>
      </defs>
      <polygon points="60,6 108,33 108,87 60,114 12,87 12,33" fill="url(#${id})" stroke="#00e5ff" stroke-width="3" stroke-linejoin="round"/>
      <text x="60" y="73" text-anchor="middle" font-family="'Space Grotesk','Inter',sans-serif" font-size="34" font-weight="700" fill="#ffffff">${esc(initials(name))}</text>
    </svg>`;
  }

  /* ---------- آیکون قطعات ---------- */
  const ICONS = {
    ecu: `<rect x="16" y="16" width="32" height="32" rx="4"/><rect x="25" y="25" width="14" height="14" rx="2"/>
          <path d="M22 16V8M32 16V8M42 16V8M22 48v8M32 48v8M42 48v8M16 22H8M16 32H8M16 42H8M48 22h8M48 32h8M48 42h8"/>`,
    coldair: `<rect x="14" y="20" width="26" height="24" rx="4"/><path d="M20 20v24M26 20v24M32 20v24"/>
              <path d="M40 32h16M51 27l5 5-5 5"/><path d="M4 28h8M4 36h8"/>`,
    ramair: `<path d="M10 46L26 22h28v24z"/><path d="M4 30h14M4 38h10"/><path d="M34 32h14"/>`,
    headers: `<path d="M10 8v16q0 10 12 10h10M24 8v12q0 6 8 6M38 8v12q0 4-6 6M52 8v16q0 10-12 10h-8"/><path d="M32 34v22"/>`,
    catback: `<path d="M4 40h14"/><rect x="18" y="30" width="30" height="20" rx="10"/><path d="M48 40h12"/><path d="M26 36v8M32 36v8M38 36v8"/>`,
    downpipe: `<circle cx="22" cy="24" r="12"/><path d="M22 16v16M14 24h16"/><path d="M34 32l14 14h12"/>`,
    intercooler: `<rect x="6" y="14" width="8" height="36" rx="2"/><rect x="50" y="14" width="8" height="36" rx="2"/>
                  <path d="M14 22h36M14 30h36M14 38h36M14 46h36"/>`,
    coilovers: `<path d="M32 6v14M32 48v10"/><path d="M26 20h12M26 48h12"/>
                <path d="M22 24L42 28L22 32L42 36L22 40L42 44L22 48"/>`,
    springs: `<path d="M20 8h24"/><path d="M22 14l20 5-20 5 20 5-20 5 20 5-20 5"/><path d="M20 56h24"/>`,
    brakes: `<circle cx="30" cy="32" r="22"/><circle cx="30" cy="32" r="7"/>
             <path d="M30 14v6M30 44v6M12 32h6M42 32h6"/><path d="M48 14q10 10 0 36" stroke-width="6"/>`,
    tires: `<circle cx="32" cy="32" r="24"/><circle cx="32" cy="32" r="12"/>
            <path d="M32 8v6M32 50v6M8 32h6M50 32h6M15 15l4 4M45 45l4 4M49 15l-4 4M19 45l-4 4"/>`,
    lsd: `<circle cx="32" cy="32" r="14"/><path d="M4 32h14M46 32h14"/><path d="M32 18v28M24 24l16 16M40 24L24 40"/>`,
    wheels: `<circle cx="32" cy="32" r="24"/><circle cx="32" cy="32" r="5"/>
             <path d="M32 8v19M32 37v19M8 32h19M37 32h19M15 15l13 13M36 36l13 13M49 15L36 28M28 36L15 49"/>`,
    aero: `<path d="M8 22h48l-6 8H14z"/><path d="M20 30v18M44 30v18M14 48h12M38 48h12"/>`,
    audio: `<rect x="14" y="8" width="36" height="48" rx="5"/><circle cx="32" cy="24" r="6"/>
            <circle cx="32" cy="42" r="10"/><circle cx="32" cy="42" r="3"/>`,
    lift: `<path d="M12 44h40v8H12z"/><path d="M32 6v28M22 16l10-10 10 10"/><path d="M16 44v-6M48 44v-6"/>`
  };

  function partIcon(id) {
    return `<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[id] || ICONS.ecu}</svg>`;
  }

  return { carSilhouette, brandBadge, partIcon };
})();