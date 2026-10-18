(function () {
  "use strict";

  // ---------- DATA ----------
  // eng:  [بنزینی معمولی, توربو, دیزل]
  // car:  [هاچ‌بک, سدان, اسپورت, شاسی‌بلند]
  // goal: [روزمره, عملکرد, ظاهر]
  // عدد 0 در eng یا car یعنی «این قطعه به درد این حالت نمی‌خوره» و حذف می‌شه
  const PARTS = [
    { id: "ecu",         cat: "engine",  cost: 3, diff: 2, eng: [1,3,3], car: [2,2,2,2], goal: [2,3,0] },
    { id: "coldair",     cat: "engine",  cost: 1, diff: 1, eng: [1,1,0], car: [1,1,1,1], goal: [1,2,1] },
    { id: "ramair",      cat: "engine",  cost: 1, diff: 1, eng: [1,1,0], car: [1,1,1,1], goal: [0,1,1] },
    { id: "headers",     cat: "engine",  cost: 2, diff: 3, eng: [2,1,0], car: [1,1,2,1], goal: [0,2,1] },
    { id: "catback",     cat: "engine",  cost: 2, diff: 1, eng: [2,2,1], car: [1,1,2,1], goal: [1,1,2] },
    { id: "downpipe",    cat: "engine",  cost: 2, diff: 2, eng: [0,3,0], car: [1,1,2,1], goal: [0,3,1] },
    { id: "intercooler", cat: "engine",  cost: 2, diff: 2, eng: [0,3,2], car: [1,1,2,2], goal: [0,3,0] },
    { id: "coilovers",   cat: "chassis", cost: 3, diff: 2, eng: [1,1,1], car: [2,2,3,1], goal: [0,3,2] },
    { id: "springs",     cat: "chassis", cost: 1, diff: 2, eng: [1,1,1], car: [2,2,2,1], goal: [1,1,3] },
    { id: "brakes",      cat: "chassis", cost: 2, diff: 2, eng: [1,1,1], car: [1,2,2,3], goal: [2,3,0] },
    { id: "tires",       cat: "chassis", cost: 2, diff: 1, eng: [2,2,2], car: [3,3,3,3], goal: [3,3,1] },
        { id: "lift",         cat: "chassis", cost: 3, diff: 2, eng: [1,1,2], car: [0,0,0,2], goal: [1,2,2] },
    { id: "lsd",         cat: "chassis", cost: 3, diff: 3, eng: [1,2,1], car: [2,1,3,0], goal: [0,3,0] },
    { id: "wheels",      cat: "look",    cost: 2, diff: 1, eng: [1,1,1], car: [2,2,3,1], goal: [1,2,3] },
    { id: "aero",        cat: "look",    cost: 2, diff: 2, eng: [1,1,1], car: [1,1,3,1], goal: [0,1,3] },
    { id: "audio",       cat: "audio",   cost: 2, diff: 2, eng: [1,1,1], car: [2,3,1,3], goal: [3,0,2] }
  ];
    window.TuneLabParts = PARTS;

  const CATS = [
    { id: "engine",  key: "types.engine.title" },
    { id: "chassis", key: "types.chassis.title" },
    { id: "look",    key: "types.look.title" },
    { id: "audio",   key: "types.audio.title" }
  ];

  const money = (n) => "$".repeat(n);
  const dots = (n) => "●".repeat(n) + "○".repeat(3 - n);
  const refresh = () => { if (window.applyI18n) window.applyI18n(); };

  const grid = document.getElementById("parts-grid");
  const filters = document.getElementById("parts-filters");
  const root = document.getElementById("finder-root");
  const vs = document.getElementById("vs-grid");

  /* ---------- 1. PARTS ENCYCLOPEDIA ---------- */
  if (grid && filters) {
    filters.innerHTML =
      `<button class="fbtn active" type="button" data-cat="all" aria-pressed="true" data-i18n="parts.all"></button>` +
      CATS.map((c) =>
        `<button class="fbtn" type="button" data-cat="${c.id}" aria-pressed="false" data-i18n="${c.key}"></button>`
      ).join("");

    grid.innerHTML = PARTS.map((p) => `
      <article class="pcard" id="part-${p.id}" data-cat="${p.cat}">
              <div class="picon">${window.TuneLabArt ? window.TuneLabArt.partIcon(p.id) : ""}</div>
        <h3 data-i18n="p.${p.id}.name"></h3>
        <p class="pcard-what" data-i18n="p.${p.id}.what"></p>
        <div class="pcard-pc">
          <div class="pro"><b data-i18n="compare.th.pros"></b><p data-i18n="p.${p.id}.pros"></p></div>
          <div class="con"><b data-i18n="compare.th.cons"></b><p data-i18n="p.${p.id}.cons"></p></div>
        </div>
        <div class="pcard-meta">
          <span><span data-i18n="parts.cost"></span>: <em>${money(p.cost)}</em></span>
          <span><span data-i18n="parts.diff"></span>: <em>${dots(p.diff)}</em></span>
        </div>
      </article>`).join("");
  }

  function setFilter(cat) {
    if (!grid || !filters) return;
    filters.querySelectorAll(".fbtn").forEach((b) => {
      const on = b.dataset.cat === cat;
      b.classList.toggle("active", on);
      b.setAttribute("aria-pressed", String(on));
    });
    grid.querySelectorAll(".pcard").forEach((c) => {
      c.hidden = cat !== "all" && c.dataset.cat !== cat;
    });
  }

  if (filters) {
    filters.addEventListener("click", (e) => {
      const b = e.target.closest(".fbtn");
      if (b) setFilter(b.dataset.cat);
    });
  }

  /* ---------- 2. CAR FINDER ---------- */
  const GROUPS = [
    { key: "car",  q: "finder.q1", opts: ["hatch", "sedan", "sport", "suv"], pre: "finder.car." },
    { key: "eng",  q: "finder.q2", opts: ["na", "turbo", "diesel"],          pre: "finder.eng." },
    { key: "goal", q: "finder.q3", opts: ["daily", "perf", "show"],          pre: "finder.goal." }
  ];
  const state = { car: null, eng: null, goal: null };

  if (root) {
    root.innerHTML =
      GROUPS.map((g) => `
        <div class="fgroup">
          <h3 data-i18n="${g.q}"></h3>
          <div class="fopts">
            ${g.opts.map((o, i) =>
              `<button class="opt" type="button" data-group="${g.key}" data-i="${i}" aria-pressed="false" data-i18n="${g.pre}${o}"></button>`
            ).join("")}
          </div>
        </div>`).join("") +
      `<div id="finder-result" aria-live="polite"></div>`;

    const result = document.getElementById("finder-result");

    function render() {
      if (state.car === null || state.eng === null || state.goal === null) {
        result.innerHTML = `<p class="fnote" data-i18n="finder.hint"></p>`;
      } else {
        const ranked = PARTS
          .map((p, idx) => ({
            p,
            idx,
            ok: p.eng[state.eng] > 0 && p.car[state.car] > 0,
            score: p.eng[state.eng] + p.car[state.car] + p.goal[state.goal]
          }))
          .filter((x) => x.ok)
          .sort((a, b) => b.score - a.score || a.idx - b.idx)
          .slice(0, 5);

        const engKey = GROUPS[1].opts[state.eng];
        const goalKey = GROUPS[2].opts[state.goal];

        result.innerHTML = `
          <h3 data-i18n="finder.result"></h3>
          <p class="fnote" data-i18n="finder.note.${engKey}"></p>
          <p class="fnote" data-i18n="finder.note.${goalKey}"></p>
          <ol class="fresults">
            ${ranked.map(({ p }) => `
              <li><a href="#part-${p.id}">
                <strong data-i18n="p.${p.id}.name"></strong>
                <span class="fcost">${money(p.cost)}</span>
                <small data-i18n="p.${p.id}.pros"></small>
              </a></li>`).join("")}
          </ol>`;
      }
      refresh();
    }

    root.addEventListener("click", (e) => {
      const b = e.target.closest(".opt");
      if (b) {
        const g = b.dataset.group;
        const i = Number(b.dataset.i);
        state[g] = state[g] === i ? null : i; // کلیک دوباره = لغو انتخاب

        root.querySelectorAll(`.opt[data-group="${g}"]`).forEach((x) => {
          const on = Number(x.dataset.i) === state[g];
          x.classList.toggle("active", on);
          x.setAttribute("aria-pressed", String(on));
        });
        render();
        return;
      }
      // کلیک روی یکی از نتیجه‌ها: فیلتر رو روی «همه» می‌ذاریم تا کارت مخفی نباشه
      if (e.target.closest(".fresults a")) setFilter("all");
    });

    render();
  }

  /* ---------- 3. DIFFERENCES ---------- */
  if (vs) {
    vs.innerHTML = [1, 2, 3, 4].map((n) => `
      <article class="vs-card">
        <h3 data-i18n="vs.${n}.title"></h3>
        <p data-i18n="vs.${n}.text"></p>
      </article>`).join("");
  }
})();