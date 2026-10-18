(function () {
  "use strict";

  const root = document.getElementById("garage-root");
  if (!root) return;

  const Art = window.TuneLabArt || {
    partIcon: () => "",
    carSilhouette: () => "",
    brandBadge: () => ""
  };

  /* =========================================================
     0. تنظیمات عکس‌ها
     فایل عکس رو توی images/brands یا images/cars بذار، بعد اسمش
     (بدون پسوند) رو توی لیست زیر بنویس. عکسی که اینجا نباشه،
     تصویر نئونی جایگزین نشون داده می‌شه.
     اسم دقیق فایل‌ها رو با دستور listCarImages() توی Console ببین.
     ========================================================= */
  const IMAGES = {
    brandExt: "png",   // images/brands/<brand>.png
    carExt: "jpg",     // images/cars/<brand>-<model>-<gen>.jpg
    brands: [],        // مثال: "toyota"
    cars: [],          // مثال: "toyota-gt86-gr86-gt86-zn6"
    credits: {}        // مثال: "toyota-gt86-gr86-gt86-zn6": "Photo: Name, CC BY-SA 4.0, Wikimedia Commons"
  };

  /* =========================================================
     1. DATA
     [نام نسل, سال, بدنه, موتور, دیفرانسیل, سیلندر, تگ‌ها]
     بدنه:  0 هاچ‌بک | 1 سدان | 2 اسپورت/کوپه | 3 شاسی‌بلند/پیکاپ
     موتور: 0 بنزینی معمولی | 1 توربو | 2 دیزل
     دیفرانسیل: "f" جلوپران | "r" عقب‌پران | "a" چهارچرخ
     ========================================================= */
  const DB = [
    ["Peugeot (Iran Khodro)", {
      "206":    [["Hatchback", "2000s–2010s", 0, 0, "f", 4, "economy light old"]],
      "206 SD": [["Sedan", "2000s–2010s", 1, 0, "f", 4, "economy old"]],
      "405":    [["Sedan", "1990s–2010s", 1, 0, "f", 4, "economy old"]],
      "Pars":   [["Sedan", "2000s–2010s", 1, 0, "f", 4, "economy old"]]
    }],
    ["Iran Khodro", {
      "Samand": [["Sedan", "2000s–2010s", 1, 0, "f", 4, "economy"]],
      "Soren":  [["Sedan", "2010s", 1, 0, "f", 4, "economy"]],
      "Dena":   [["Sedan", "2010s–2020s", 1, 0, "f", 4, "economy"]],
      "Runna":  [["Sedan", "2010s", 1, 0, "f", 4, "economy"]]
    }],
    ["Saipa", {
      "Pride": [["Hatchback", "1990s–2010s", 0, 0, "f", 4, "economy light old"]],
      "Tiba":  [["Hatchback", "2010s", 0, 0, "f", 4, "economy"]]
    }],
    ["Toyota", {
      "GT86 / GR86": [
        ["GT86 (ZN6)", "2012–2021", 2, 0, "r", 4, "light drift aftermarket"],
        ["GR86 (ZN8)", "2022+", 2, 0, "r", 4, "light drift aftermarket modern"]
      ],
      "Supra": [
        ["A80 (Mk4)", "1993–2002", 2, 1, "r", 6, "aftermarket collector"],
        ["A90 (Mk5)", "2019+", 2, 1, "r", 6, "aftermarket modern"]
      ],
      "Corolla": [
        ["E140 / E150", "2006–2013", 1, 0, "f", 4, "economy"],
        ["E210", "2019+", 1, 0, "f", 4, "economy modern"]
      ],
      "Camry": [["XV50", "2011–2017", 1, 0, "f", 4, "economy"]],
      "Hilux": [
        ["7th gen", "2005–2015", 3, 2, "a", 4, "heavy offroad old"],
        ["8th gen", "2015+", 3, 2, "a", 4, "heavy offroad"]
      ],
      "Land Cruiser": [["J200", "2008–2021", 3, 0, "a", 8, "heavy offroad"]]
    }],
    ["Honda", {
      "Civic": [
        ["EK", "1996–2000", 0, 0, "f", 4, "light aftermarket old"],
        ["FD2 Type R", "2007–2010", 1, 0, "f", 4, "aftermarket"],
        ["FK8 Type R", "2017–2021", 0, 1, "f", 4, "aftermarket modern"]
      ],
      "S2000":  [["AP1 / AP2", "1999–2009", 2, 0, "r", 4, "light collector"]],
      "Accord": [["8th gen", "2008–2012", 1, 0, "f", 4, "economy"]]
    }],
    ["Nissan", {
      "350Z": [["Z33", "2002–2008", 2, 0, "r", 6, "drift aftermarket"]],
      "370Z": [["Z34", "2009–2020", 2, 0, "r", 6, "drift aftermarket"]],
      "Silvia": [["S15", "1999–2002", 2, 1, "r", 4, "drift aftermarket collector"]],
      "Skyline GT-R": [["R34", "1999–2002", 2, 1, "a", 6, "aftermarket collector"]],
      "GT-R": [["R35", "2007+", 2, 1, "a", 6, "aftermarket modern"]],
      "Patrol": [
        ["Y61", "1997–2010s", 3, 0, "a", 6, "heavy offroad old"],
        ["Y62", "2010+", 3, 0, "a", 8, "heavy offroad"]
      ]
    }],
    ["Mazda", {
      "MX-5 Miata": [
        ["NA", "1989–1997", 2, 0, "r", 4, "light drift aftermarket old"],
        ["NB", "1998–2005", 2, 0, "r", 4, "light drift aftermarket old"],
        ["NC", "2005–2015", 2, 0, "r", 4, "light drift aftermarket"],
        ["ND", "2015+", 2, 0, "r", 4, "light drift aftermarket modern"]
      ],
      "Mazda3": [["BK / BL / BM", "2003–2018", 0, 0, "f", 4, "economy"]]
    }],
    ["Subaru", {
      "WRX / STI": [
        ["GD / GR", "2000–2014", 1, 1, "a", 4, "aftermarket"],
        ["VA", "2014–2021", 1, 1, "a", 4, "aftermarket"]
      ],
      "BRZ": [
        ["ZC6", "2012–2020", 2, 0, "r", 4, "light drift aftermarket"],
        ["ZD8", "2021+", 2, 0, "r", 4, "light drift aftermarket modern"]
      ]
    }],
    ["Mitsubishi", {
      "Lancer Evolution": [
        ["Evo VII–IX", "2001–2007", 1, 1, "a", 4, "aftermarket collector"],
        ["Evo X", "2007–2016", 1, 1, "a", 4, "aftermarket"]
      ]
    }],
    ["BMW", {
      "3 Series": [
        ["E36", "1990–2000", 1, 0, "r", 6, "drift aftermarket old"],
        ["E46", "1998–2006", 1, 0, "r", 6, "drift aftermarket old"],
        ["E90", "2005–2012", 1, 0, "r", 6, "aftermarket"],
        ["F30", "2012–2019", 1, 1, "r", 4, "aftermarket"]
      ],
      "M3": [
        ["E46 M3", "2000–2006", 2, 0, "r", 6, "drift aftermarket collector"],
        ["E92 M3", "2007–2013", 2, 0, "r", 8, "aftermarket"],
        ["F80 M3", "2014–2018", 1, 1, "r", 6, "aftermarket modern"]
      ]
    }],
    ["Mercedes-Benz", {
      "C-Class": [
        ["W203", "2000–2007", 1, 0, "r", 4, "old"],
        ["W204", "2007–2014", 1, 0, "r", 4, "aftermarket"],
        ["W205", "2014–2021", 1, 1, "r", 4, "modern"]
      ]
    }],
    ["Volkswagen", {
      "Golf GTI": [
        ["Mk5", "2004–2009", 0, 1, "f", 4, "aftermarket old"],
        ["Mk6", "2009–2013", 0, 1, "f", 4, "aftermarket"],
        ["Mk7", "2013–2020", 0, 1, "f", 4, "aftermarket"]
      ],
      "Golf R": [
        ["Mk6", "2010–2013", 0, 1, "a", 4, "aftermarket"],
        ["Mk7", "2013–2020", 0, 1, "a", 4, "aftermarket"]
      ]
    }],
    ["Audi", {
      "S3": [
        ["8P", "2006–2012", 0, 1, "a", 4, "aftermarket"],
        ["8V", "2013–2020", 0, 1, "a", 4, "aftermarket modern"]
      ]
    }],
    ["Hyundai", {
      "Elantra": [["AD", "2016–2020", 1, 0, "f", 4, "economy"]],
      "Veloster N": [["N", "2019–2022", 0, 1, "f", 4, "modern"]],
      "Genesis Coupe": [["BK", "2009–2016", 2, 1, "r", 4, "drift"]]
    }],
    ["Kia", {
      "Cerato / Forte": [["YD", "2013–2018", 1, 0, "f", 4, "economy"]],
      "Stinger": [["CK", "2018–2023", 1, 1, "r", 6, "modern"]]
    }],
    ["Ford", {
      "Mustang": [
        ["S197 GT", "2005–2014", 2, 0, "r", 8, "aftermarket"],
        ["S550 GT", "2015–2023", 2, 0, "r", 8, "aftermarket modern"],
        ["S550 EcoBoost", "2015–2023", 2, 1, "r", 4, "aftermarket modern"]
      ],
      "Focus": [
        ["ST (Mk3)", "2012–2018", 0, 1, "f", 4, "aftermarket"],
        ["RS (Mk3)", "2016–2018", 0, 1, "a", 4, "aftermarket"]
      ],
      "Fiesta ST": [["Mk7", "2013–2017", 0, 1, "f", 4, "light aftermarket"]],
      "Ranger": [["T6", "2012–2022", 3, 2, "a", 4, "heavy offroad"]]
    }],
    ["Chevrolet", {
      "Camaro": [
        ["5th gen SS", "2010–2015", 2, 0, "r", 8, "aftermarket"],
        ["6th gen SS", "2016–2024", 2, 0, "r", 8, "aftermarket modern"]
      ],
      "Corvette": [
        ["C6", "2005–2013", 2, 0, "r", 8, "aftermarket"],
        ["C7", "2014–2019", 2, 0, "r", 8, "aftermarket modern"]
      ]
    }]
  ];

  /* ---------- ساختار نرمال‌شده با اسلاگ (برای آدرس‌ها و اسم فایل عکس‌ها) ---------- */
  const slug = (s) => String(s).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

  const BR = DB.map(([name, models]) => ({
    name,
    slug: slug(name),
    models: Object.keys(models).map((mn) => ({
      name: mn,
      slug: slug(mn),
      gens: models[mn].map((g) => ({
        name: g[0], slug: slug(g[0]), years: g[1],
        body: g[2], eng: g[3], drive: g[4], cyl: g[5],
        tags: g[6].split(" ").filter(Boolean)
      }))
    }))
  }));

  const carKey = (b, m, g) => `${b.slug}-${m.slug}-${g.slug}`;

  const BODY_KEYS = ["finder.car.hatch", "finder.car.sedan", "finder.car.sport", "finder.car.suv"];
  const ENG_KEYS = ["finder.eng.na", "finder.eng.turbo", "finder.eng.diesel"];
  const DRIVE_KEYS = { f: "garage.drive.f", r: "garage.drive.r", a: "garage.drive.a" };
  const GOALS = ["daily", "perf", "show"];
  const ENGS = ["na", "turbo", "diesel"];

  // تگ‌ها امتیاز بعضی قطعات رو بالا یا پایین می‌برن
  const BONUS = {
    heavy:   { brakes: 2, tires: 1 },
    old:     { brakes: 1 },
    drift:   { lsd: 2, coilovers: 1 },
    offroad: { lift: 3, coilovers: -3, springs: -3, aero: -3, lsd: -3, brakes: 1, tires: 1 }
  };
  const DRIVE_BONUS = { lsd: { f: 1, r: 2, a: -1 } };

  /* ---------- state ---------- */
  const st = { body: 1, eng: 0, drive: "f", cyl: 4, tags: [], goal: null, budget: null, label: "" };
  let isOtherView = false;
  let rendered = false;

  /* ---------- helpers ---------- */
  const $ = (id) => document.getElementById(id);
  const esc = (s) =>
    String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const money = (n) => "$".repeat(n);
  const refresh = () => { if (window.applyI18n) window.applyI18n(); };
  const smooth = () =>
    window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth";

  function setView(html) {
    root.innerHTML = html;
    refresh();
  }

  /* =========================================================
     2. تصاویر (عکس واقعی یا جایگزین نئونی)
     ========================================================= */
  function fallbackHTML(kind, label, body) {
    return kind === "brand" ? Art.brandBadge(label, label) : Art.carSilhouette(body, label);
  }

  function imgHTML(kind, key, label, body) {
    const list = kind === "brand" ? IMAGES.brands : IMAGES.cars;
    if (list.includes(key)) {
      const path =
        kind === "brand"
          ? `images/brands/${key}.${IMAGES.brandExt}`
          : `images/cars/${key}.${IMAGES.carExt}`;
      return `<img class="cimg cimg-${kind}" src="${path}" alt="${esc(label)}" loading="lazy" decoding="async"
                data-fb="${kind}" data-label="${esc(label)}" data-body="${body}">`;
    }
    return fallbackHTML(kind, label, body);
  }

  // اگه فایل عکس لود نشد، جایگزین نئونی نشون بده
  root.addEventListener(
    "error",
    (e) => {
      const img = e.target;
      if (!img || img.tagName !== "IMG" || !img.dataset.fb) return;
      img.outerHTML = fallbackHTML(img.dataset.fb, img.dataset.label, Number(img.dataset.body));
    },
    true
  );

  // دستور کمکی: توی Console بنویس listCarImages()
  window.listCarImages = function () {
    const rows = [];
    BR.forEach((b) =>
      b.models.forEach((m) =>
        m.gens.forEach((g) =>
          rows.push({ key: carKey(b, m, g), file: `images/cars/${carKey(b, m, g)}.${IMAGES.carExt}` })
        )
      )
    );
    console.table(rows);
    console.log("Brand logos:", BR.map((b) => `images/brands/${b.slug}.${IMAGES.brandExt}`));
  };

  /* =========================================================
     3. صفحه‌ها
     ========================================================= */
  function crumbs(items) {
    return (
      `<nav class="crumbs" aria-label="Breadcrumb">` +
      items
        .map((it, i) => {
          const label = it.key ? `<span data-i18n="${it.key}"></span>` : esc(it.text);
          const node = it.href
            ? `<a href="${it.href}">${label}</a>`
            : `<span aria-current="page">${label}</span>`;
          return (i ? `<span class="sep" aria-hidden="true">›</span>` : "") + node;
        })
        .join("") +
      `</nav>`
    );
  }

  function viewHome() {
    isOtherView = false;
    setView(`
      <h3 class="cat-title" data-i18n="cat.pickBrand"></h3>
      <div class="cgrid">
        ${BR.map((b) => `
          <a class="ccard" href="#/${b.slug}">
            ${imgHTML("brand", b.slug, b.name, 0)}
            <strong>${esc(b.name)}</strong>
            <small><span data-i18n="cat.models"></span>: ${b.models.length}</small>
          </a>`).join("")}
        <a class="ccard" href="#/other">
          ${Art.brandBadge("?", "Other")}
          <strong data-i18n="cat.other"></strong>
          <small data-i18n="cat.otherSub"></small>
        </a>
      </div>`);
  }

  function viewBrand(b) {
    isOtherView = false;
    setView(`
      ${crumbs([{ href: "#garage", key: "cat.allBrands" }, { text: b.name }])}
      <h3 class="cat-title" data-i18n="cat.pickModel"></h3>
      <div class="cgrid cgrid-wide">
        ${b.models.map((m) => {
          const g0 = m.gens[0];
          return `
          <a class="ccard" href="#/${b.slug}/${m.slug}">
            ${imgHTML("car", carKey(b, m, g0), b.name + " " + m.name, g0.body)}
            <strong>${esc(m.name)}</strong>
            <small><span data-i18n="cat.versions"></span>: ${m.gens.length}</small>
          </a>`;
        }).join("")}
      </div>`);
  }

  function viewModel(b, m) {
    isOtherView = false;
    setView(`
      ${crumbs([
        { href: "#garage", key: "cat.allBrands" },
        { href: `#/${b.slug}`, text: b.name },
        { text: m.name }
      ])}
      <h3 class="cat-title" data-i18n="cat.pickGen"></h3>
      <div class="cgrid cgrid-wide">
        ${m.gens.map((g) => `
          <a class="ccard" href="#/${b.slug}/${m.slug}/${g.slug}">
            ${imgHTML("car", carKey(b, m, g), `${b.name} ${m.name} ${g.name}`, g.body)}
            <strong>${esc(g.name)}</strong>
            <small>${esc(g.years)}</small>
            <div class="chips">
              <span class="chip-tag" data-i18n="${BODY_KEYS[g.body]}"></span>
              <span class="chip-tag" data-i18n="${ENG_KEYS[g.eng]}"></span>
              <span class="chip-tag" data-i18n="${DRIVE_KEYS[g.drive]}"></span>
            </div>
          </a>`).join("")}
      </div>`);
  }

  function viewNotFound() {
    isOtherView = false;
    setView(`
      ${crumbs([{ href: "#garage", key: "cat.allBrands" }])}
      <p class="fnote" data-i18n="cat.notFound"></p>`);
  }

  /* ---------- صفحه‌ی ماشین ---------- */
  function specSelects() {
    return `
      <div class="gform">
        <div class="gfield">
          <label for="g-body" data-i18n="garage.body"></label>
          <select id="g-body">
            ${BODY_KEYS.map((k, i) => `<option value="${i}" data-i18n="${k}"></option>`).join("")}
          </select>
        </div>
        <div class="gfield">
          <label for="g-eng" data-i18n="garage.engine"></label>
          <select id="g-eng">
            ${ENG_KEYS.map((k, i) => `<option value="${i}" data-i18n="${k}"></option>`).join("")}
          </select>
        </div>
        <div class="gfield">
          <label for="g-drive" data-i18n="garage.drive"></label>
          <select id="g-drive">
            ${["f", "r", "a"].map((d) => `<option value="${d}" data-i18n="${DRIVE_KEYS[d]}"></option>`).join("")}
          </select>
        </div>
        <div class="gfield">
          <label for="g-cyl" data-i18n="cat.cyl"></label>
          <select id="g-cyl">
            ${[3, 4, 5, 6, 8, 10, 12].map((n) => `<option value="${n}">${n}</option>`).join("")}
          </select>
        </div>
      </div>`;
  }

  function renderCarPage(crumbItems, photo, titleHTML) {
    setView(`
      ${crumbs(crumbItems)}
      <div class="cdetail">
        <div class="cphoto" id="c-photo">${photo}</div>
        <div class="cinfo">
          ${titleHTML}
          <div class="chips">
            ${st.tags.map((t) => `<span class="chip-tag" data-i18n="chip.${t}"></span>`).join("")}
          </div>
          <p class="fnote" data-i18n="cat.editHint"></p>
          <div class="gspecs">
            <h3 data-i18n="garage.specs"></h3>
            ${specSelects()}
          </div>
        </div>
      </div>

      <div class="fgroup">
        <h3 data-i18n="garage.goal"></h3>
        <div class="fopts">
          ${GOALS.map((g, i) =>
            `<button class="opt" type="button" data-group="goal" data-i="${i}" aria-pressed="false" data-i18n="finder.goal.${g}"></button>`
          ).join("")}
        </div>
      </div>

      <div class="fgroup">
        <h3 data-i18n="garage.budget"></h3>
        <div class="fopts">
          ${[1, 2, 3].map((b, i) =>
            `<button class="opt" type="button" data-group="budget" data-i="${i}" aria-pressed="false" data-i18n="garage.budget.${b}"></button>`
          ).join("")}
        </div>
      </div>

      <div id="garage-result" aria-live="polite"></div>`);

    $("g-body").value = String(st.body);
    $("g-eng").value = String(st.eng);
    $("g-drive").value = st.drive;
    $("g-cyl").value = String(st.cyl);
    syncOpts();
    update();
  }

  function viewCar(b, m, g) {
    isOtherView = false;
    st.body = g.body;
    st.eng = g.eng;
    st.drive = g.drive;
    st.cyl = g.cyl;
    st.tags = g.tags.slice();
    st.label = `${b.name} ${m.name} (${g.name}, ${g.years})`;

    const key = carKey(b, m, g);
    const credit = IMAGES.cars.includes(key) && IMAGES.credits[key];
    const photo =
      imgHTML("car", key, `${b.name} ${m.name} ${g.name}`, g.body) +
      (credit ? `<p class="ccredit">${esc(credit)}</p>` : "");

    renderCarPage(
      [
        { href: "#garage", key: "cat.allBrands" },
        { href: `#/${b.slug}`, text: b.name },
        { href: `#/${b.slug}/${m.slug}`, text: m.name },
        { text: g.name }
      ],
      photo,
      `<h3 class="ctitle">${esc(b.name)} ${esc(m.name)}</h3><p class="cgen">${esc(g.name)} · ${esc(g.years)}</p>`
    );
  }

  function viewOther() {
    isOtherView = true;
    st.body = 1;
    st.eng = 0;
    st.drive = "f";
    st.cyl = 4;
    st.tags = [];
    st.label = "";

    renderCarPage(
      [{ href: "#garage", key: "cat.allBrands" }, { key: "cat.other" }],
      Art.carSilhouette(st.body, "Your car"),
      `<h3 class="ctitle" data-i18n="cat.otherCar"></h3>`
    );
  }

  /* =========================================================
     4. برنامه‌ی تیونینگ
     ========================================================= */
  function buildPlan() {
    const P = window.TuneLabParts || [];
    return P
      .map((p, idx) => {
        if (!(p.eng[st.eng] > 0 && p.car[st.body] > 0)) return null;

        let s = p.eng[st.eng] + p.car[st.body] + p.goal[st.goal];
        s += (DRIVE_BONUS[p.id] && DRIVE_BONUS[p.id][st.drive]) || 0;
        st.tags.forEach((t) => { s += (BONUS[t] && BONUS[t][p.id]) || 0; });
        s -= Math.max(0, p.cost - (st.budget + 1)) * 3; // قطعه‌ی گران‌تر از بودجه امتیاز کمتر می‌گیره

        return { p, idx, s };
      })
      .filter(Boolean)
      .sort((a, b) => b.s - a.s || a.idx - b.idx)
      .slice(0, 6);
  }

  function renderResult() {
    const result = $("garage-result");
    if (!result) return;

    if (st.goal === null || st.budget === null) {
      result.innerHTML = `<p class="fnote" data-i18n="garage.pick"></p>`;
      refresh();
      return;
    }

    const plan = buildPlan();
    result.innerHTML = `
      <h3><span data-i18n="garage.result"></span>${st.label ? ": " + esc(st.label) : ""}</h3>
      <ul class="gnotes">
        <li data-i18n="garage.note.${st.drive}"></li>
        <li data-i18n="finder.note.${ENGS[st.eng]}"></li>
        <li data-i18n="finder.note.${GOALS[st.goal]}"></li>
        ${st.tags.map((t) => `<li data-i18n="tag.${t}"></li>`).join("")}
      </ul>
      <ol class="fresults">
        ${plan.map(({ p }) => `
          <li><a href="#part-${p.id}">
            <strong data-i18n="p.${p.id}.name"></strong>
            <span class="fcost">${money(p.cost)}</span>
            <small data-i18n="p.${p.id}.pros"></small>
          </a></li>`).join("")}
      </ol>
      <p class="fnote" data-i18n="garage.verify"></p>`;
    refresh();
  }

  // اطلاعات ماشین انتخاب‌شده برای بخش‌های بعدی سایت (مرحله ۹)
  function publish() {
    window.TuneLab = window.TuneLab || {};
    window.TuneLab.car = {
      label: st.label,
      body: st.body,
      eng: st.eng,
      drive: st.drive,
      cyl: st.cyl,
      tags: st.tags.slice(),
      goal: st.goal,
      budget: st.budget
    };
    document.dispatchEvent(new CustomEvent("tunelab:car", { detail: window.TuneLab.car }));
  }

  function update() {
    renderResult();
    publish();
  }

  function syncOpts() {
    root.querySelectorAll(".opt").forEach((x) => {
      const on = st[x.dataset.group] === Number(x.dataset.i);
      x.classList.toggle("active", on);
      x.setAttribute("aria-pressed", String(on));
    });
  }

  /* =========================================================
     5. رویدادها
     ========================================================= */
  root.addEventListener("change", (e) => {
    const id = e.target.id;
    const v = e.target.value;
    if (id === "g-body") {
      st.body = Number(v);
      const photo = $("c-photo");
      if (isOtherView && photo) photo.innerHTML = Art.carSilhouette(st.body, "Your car");
    } else if (id === "g-eng") st.eng = Number(v);
    else if (id === "g-drive") st.drive = v;
    else if (id === "g-cyl") st.cyl = Number(v);
    else return;
    update();
  });

  root.addEventListener("click", (e) => {
    const b = e.target.closest(".opt");
    if (b) {
      const g = b.dataset.group;
      const i = Number(b.dataset.i);
      st[g] = st[g] === i ? null : i; // کلیک دوباره = لغو انتخاب
      syncOpts();
      update();
      return;
    }

    // کلیک روی یکی از قطعات پیشنهادی: فیلتر دانشنامه روی «همه» برگرده تا کارت مخفی نباشه
    if (e.target.closest(".fresults a")) {
      const all = document.querySelector('.fbtn[data-cat="all"]');
      if (all && !all.classList.contains("active")) all.click();
    }
  });

  /* =========================================================
     6. مسیریابی با آدرس (#/برند/مدل/نسخه)
     ========================================================= */
  function scrollToView(initial) {
    setTimeout(
      () => root.scrollIntoView({ behavior: smooth(), block: "start" }),
      initial ? 250 : 0
    );
  }

  function go(initial) {
    const raw = location.hash;

    // آدرس‌هایی مثل #types یا #part-ecu مال کاتالوگ نیستن؛ دست نمی‌زنیم
    if (!raw.startsWith("#/")) {
      if (!rendered || raw === "" || raw === "#" || raw === "#garage") {
        viewHome();
        rendered = true;
      }
      return;
    }

    const seg = raw.slice(2).split("/").filter(Boolean);
    rendered = true;

    if (seg[0] === "other") {
      viewOther();
      scrollToView(initial);
      return;
    }

    const b = BR.find((x) => x.slug === seg[0]);
    if (!b) { viewNotFound(); scrollToView(initial); return; }

    if (seg.length === 1) { viewBrand(b); scrollToView(initial); return; }

    const m = b.models.find((x) => x.slug === seg[1]);
    if (!m) { viewNotFound(); scrollToView(initial); return; }

    if (seg.length === 2) {
      // اگه مدل فقط یک نسخه داره، مستقیم برو صفحه‌ی ماشین
      if (m.gens.length === 1) {
        location.replace(`#/${b.slug}/${m.slug}/${m.gens[0].slug}`);
        return;
      }
      viewModel(b, m);
      scrollToView(initial);
      return;
    }

    const g = m.gens.find((x) => x.slug === seg[2]);
    if (!g) { viewNotFound(); scrollToView(initial); return; }

    viewCar(b, m, g);
    scrollToView(initial);
  }

  window.addEventListener("hashchange", () => go(false));
  go(true);
})();