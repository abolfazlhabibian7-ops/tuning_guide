(function () {
  "use strict";

  const root = document.getElementById("sound-root");
  if (!root) return;

  const AC = window.AudioContext || window.webkitAudioContext;

  /* =========================================================
     1. DATA
     ========================================================= */
  const SOUNDS = ["deep", "buzzy", "aggr", "refined", "pops"];
  const TASTES = ["bass", "clear", "bal"];

  // قوانین تناسب: [عامل, امتیاز]. عامل‌ها از روی ماشین انتخاب‌شده محاسبه می‌شن.
  const RULES = {
    deep:    [["cylHigh", 2], ["cylLow", -1], ["heavy", 1]],
    buzzy:   [["cylLow", 1], ["light", 1], ["cylHigh", -1]],
    aggr:    [["turbo", 2], ["perf", 1], ["daily", -1], ["modern", -1]],
    refined: [["daily", 2], ["diesel", 1], ["perf", -1]],
    pops:    [["perf", 2], ["turbo", 1], ["modern", -2], ["daily", -2], ["diesel", -3]]
  };

  // پارامترهای ساخت هر صدا
  const PROFILE = {
    deep:    { sub: 0.9, harm: 0.35, dist: 8,  lpBase: 160, lpK: 7,  q: 1.0, amp: 0.5,  rasp: 0,    lfo: 0.35, pops: 0 },
    buzzy:   { sub: 0.1, harm: 1.0,  dist: 25, lpBase: 900, lpK: 25, q: 3.0, amp: 0.3,  rasp: 0.25, lfo: 0.2,  pops: 0 },
    aggr:    { sub: 0.5, harm: 0.8,  dist: 60, lpBase: 500, lpK: 18, q: 1.5, amp: 0.4,  rasp: 0.35, lfo: 0.4,  pops: 0.3 },
    refined: { sub: 0.6, harm: 0.1,  dist: 2,  lpBase: 130, lpK: 5,  q: 0.7, amp: 0.35, rasp: 0,    lfo: 0.12, pops: 0 },
    pops:    { sub: 0.5, harm: 0.8,  dist: 60, lpBase: 500, lpK: 18, q: 1.5, amp: 0.4,  rasp: 0.3,  lfo: 0.4,  pops: 1 }
  };

  // مراحل سیستم صوتی: min = حداقل بودجه، w = اهمیت برای هر سلیقه (0 = حذف)
  const STEPS = [
    { id: "dead",  min: 0, cost: 1, w: { bass: 2, clear: 3, bal: 3 } },
    { id: "front", min: 0, cost: 2, w: { bass: 1, clear: 3, bal: 3 } },
    { id: "wire",  min: 1, cost: 1, w: { bass: 3, clear: 2, bal: 2 } },
    { id: "amp",   min: 1, cost: 2, w: { bass: 3, clear: 2, bal: 2 } },
    { id: "sub",   min: 1, cost: 2, w: { bass: 3, clear: 0, bal: 2 } },
    { id: "dsp",   min: 2, cost: 3, w: { bass: 0, clear: 3, bal: 1 } }
  ];

  // سناریوی ۷٫۲ ثانیه‌ای: [ثانیه, دور موتور, میزان گاز]
  const PLAN = [
    [0, 850, 0.25], [0.8, 850, 0.25], [1.5, 3600, 1], [2.1, 2200, 0.3],
    [2.8, 5200, 1], [3.8, 5800, 1], [4.4, 2600, 0.1], [5.4, 1300, 0.1],
    [6.2, 900, 0.25], [7.2, 850, 0.25]
  ];
  const CYCLE = 7.2;

  /* ---------- helpers ---------- */
  const esc = (s) =>
    String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const refresh = () => { if (window.applyI18n) window.applyI18n(); };
  const car = () => (window.TuneLab && window.TuneLab.car) || null;
  const $ = (sel) => root.querySelector(sel);

  /* =========================================================
     2. رابط
     ========================================================= */
  root.innerHTML = `
    <h3 class="cat-title" data-i18n="sound.exh.title"></h3>
    <p class="fnote" data-i18n="sound.exh.hint"></p>
    <p class="fnote" id="s-carnote"></p>

    <div class="scards">
      ${SOUNDS.map((s) => `
        <article class="scard" data-s="${s}">
          <div class="shead">
            <h4 data-i18n="sound.s.${s}.name"></h4>
            <span class="sbest" data-i18n="sound.best"></span>
          </div>
          <span class="sfit"></span>
          <p class="sdesc" data-i18n="sound.s.${s}.desc"></p>
          <ul class="swhy"></ul>
          <button class="splay" type="button" data-s="${s}" aria-pressed="false" data-i18n="sound.play"></button>
          <p class="srecipe"><b data-i18n="sound.setup"></b><span data-i18n="sound.s.${s}.recipe"></span></p>
        </article>`).join("")}
    </div>
    <p class="fnote" data-i18n="sound.legal"></p>

    <h3 class="cat-title sgap" data-i18n="sound.audio.title"></h3>

    <div class="fgroup">
      <h3 data-i18n="sound.audio.budget"></h3>
      <div class="fopts">
        ${[1, 2, 3].map((b, i) =>
          `<button class="opt" type="button" data-group="budget" data-i="${i}" aria-pressed="false" data-i18n="garage.budget.${b}"></button>`
        ).join("")}
      </div>
    </div>

    <div class="fgroup">
      <h3 data-i18n="sound.audio.taste"></h3>
      <div class="fopts">
        ${TASTES.map((k, i) =>
          `<button class="opt" type="button" data-group="taste" data-i="${i}" aria-pressed="false" data-i18n="sound.taste.${k}"></button>`
        ).join("")}
      </div>
    </div>

    <div id="s-audio-result" aria-live="polite"></div>`;

  /* =========================================================
     3. تناسب صداها با ماشین
     ========================================================= */
  function rate(s, c) {
    const f = {
      cylHigh: c.cyl >= 6,
      cylLow: c.cyl <= 4,
      turbo: c.eng === 1,
      diesel: c.eng === 2,
      daily: c.goal === 0,
      perf: c.goal === 1,
      heavy: c.tags.indexOf("heavy") > -1 || c.body === 3,
      light: c.tags.indexOf("light") > -1 || c.body === 0,
      modern: c.tags.indexOf("modern") > -1
    };
    let score = 0;
    const hits = [];
    RULES[s].forEach(([k, w]) => {
      if (f[k]) { score += w; hits.push([k, Math.abs(w)]); }
    });
    hits.sort((a, b) => b[1] - a[1]);
    const why = hits.slice(0, 2).map(([k]) => (s === "pops" && k === "diesel" ? "noPops" : k));
    return { score, why };
  }

  function updateFit() {
    const c = car();
    const note = $("#s-carnote");

    if (!c) {
      note.innerHTML = `<a href="#garage" data-i18n="sound.car.none"></a>`;
    } else {
      note.innerHTML = `<span data-i18n="sound.car.for"></span>${c.label ? ": " + esc(c.label) : ""}`;
    }

    const rated = SOUNDS.map((s) => ({ s, r: c ? rate(s, c) : null }));
    let best = null;
    if (c) best = rated.reduce((a, b) => (b.r.score > a.r.score ? b : a));

    rated.forEach(({ s, r }) => {
      const card = root.querySelector(`.scard[data-s="${s}"]`);
      const fit = card.querySelector(".sfit");
      const why = card.querySelector(".swhy");

      if (!c) {
        fit.removeAttribute("data-i18n");
        fit.className = "sfit";
        fit.textContent = "";
        why.innerHTML = "";
        card.classList.remove("best");
        return;
      }

      const lvl = r.score >= 2 ? "high" : r.score >= 0 ? "mid" : "low";
      fit.className = "sfit fit-" + lvl;
      fit.setAttribute("data-i18n", "sound.fit." + lvl);
      why.innerHTML = r.why.map((k) => `<li data-i18n="sound.why.${k}"></li>`).join("");
      card.classList.toggle("best", best.s === s);
    });

    refresh();
  }

  /* =========================================================
     4. سازنده‌ی سیستم صوتی
     ========================================================= */
  const sa = { budget: null, taste: null };

  function subKey(taste) {
    const c = car();
    const small = c && (c.body === 0 || c.body === 2); // هاچ‌بک و اسپورت: صندوق کوچک
    if (small) return "slim";
    return taste === "bass" ? "ported" : "sealed";
  }

  function renderAudio() {
    const out = $("#s-audio-result");

    if (sa.budget === null || sa.taste === null) {
      out.innerHTML = `<p class="fnote" data-i18n="sound.audio.pick"></p>`;
      refresh();
      return;
    }

    const taste = TASTES[sa.taste];
    const steps = STEPS.filter((s) => s.min <= sa.budget && s.w[taste] > 0);

    out.innerHTML = `
      <h3 data-i18n="sound.audio.result"></h3>
      <ol class="steps">
        ${steps.map((s) => `
          <li>
            <div class="sbody">
              <strong data-i18n="sound.step.${s.id}.name"></strong>
              <span class="fcost">${"$".repeat(s.cost)}</span>
              ${s.w[taste] === 3 ? `<span class="chip-tag" data-i18n="sound.audio.prio"></span>` : ""}
              <p data-i18n="${s.id === "sub" ? "sound.sub." + subKey(taste) : "sound.step." + s.id + ".text"}"></p>
            </div>
          </li>`).join("")}
      </ol>
      <p class="fnote" data-i18n="sound.audio.warn1"></p>
      <p class="fnote" data-i18n="sound.audio.warn2"></p>`;
    refresh();
  }

  /* =========================================================
     5. موتور صدا (Web Audio)
     ========================================================= */
  let ctx = null, master = null, noiseBuf = null;
  let voice = null, playing = null;

  function init() {
    if (ctx) return;
    ctx = new AC();
    master = ctx.createGain();
    master.gain.value = 0.7;
    const comp = ctx.createDynamicsCompressor(); // جلوی ترکیدن صدا رو می‌گیره
    master.connect(comp);
    comp.connect(ctx.destination);

    const len = ctx.sampleRate * 2;
    noiseBuf = ctx.createBuffer(1, len, ctx.sampleRate);
    const d = noiseBuf.getChannelData(0);
    for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
  }

  function mkVoice() {
    const bus = ctx.createGain();
    bus.gain.value = 0.0001;
    bus.gain.linearRampToValueAtTime(1, ctx.currentTime + 0.06);
    bus.connect(master);
    const v = { bus, srcs: [], timers: [] };
    v.stop = (fade) => {
      v.timers.forEach(clearInterval);
      const t = ctx.currentTime;
      bus.gain.cancelScheduledValues(t);
      bus.gain.setValueAtTime(Math.max(bus.gain.value, 0.0001), t);
      bus.gain.linearRampToValueAtTime(0.0001, t + fade);
      setTimeout(() => {
        v.srcs.forEach((s) => { try { s.stop(); } catch (e) {} });
        bus.disconnect();
      }, fade * 1000 + 80);
    };
    return v;
  }

  function osc(v, type, f, oneShot) {
    const o = ctx.createOscillator();
    o.type = type;
    o.frequency.value = f;
    if (!oneShot) v.srcs.push(o);
    return o;
  }

  function noiseSrc(v, oneShot) {
    const s = ctx.createBufferSource();
    s.buffer = noiseBuf;
    s.loop = true;
    if (!oneShot) v.srcs.push(s);
    return s;
  }

  function gain(x) {
    const g = ctx.createGain();
    g.gain.value = x;
    return g;
  }

  function filt(type, f, q) {
    const b = ctx.createBiquadFilter();
    b.type = type;
    b.frequency.value = f;
    if (q) b.Q.value = q;
    return b;
  }

  function distCurve(k) {
    const n = 512;
    const c = new Float32Array(n);
    for (let i = 0; i < n; i++) {
      const x = (i * 2) / n - 1;
      c[i] = ((3 + k) * x * 20 * (Math.PI / 180)) / (Math.PI + k * Math.abs(x));
    }
    return c;
  }

  // یه انفجار کوتاه نویز (ترقه، پسشت توربو)
  function burst(v, t, o) {
    const n = noiseSrc(v, true);
    const f = filt(o.type || "bandpass", o.freq, o.q || 1);
    const g = gain(0.0001);
    n.connect(f);
    f.connect(g);
    g.connect(v.bus);
    if (o.sweepTo) {
      f.frequency.setValueAtTime(o.freq, t);
      f.frequency.exponentialRampToValueAtTime(o.sweepTo, t + o.att + o.dec);
    }
    g.gain.setValueAtTime(0.0001, t);
    g.gain.linearRampToValueAtTime(o.peak, t + o.att);
    g.gain.exponentialRampToValueAtTime(0.0001, t + o.att + o.dec);
    n.start(t, Math.random() * 1.5);
    n.stop(t + o.att + o.dec + 0.05);
  }

  function thump(v, t, peak) {
    const o = osc(v, "sine", 160, true);
    const g = gain(0.0001);
    o.connect(g);
    g.connect(v.bus);
    o.frequency.setValueAtTime(160, t);
    o.frequency.exponentialRampToValueAtTime(55, t + 0.09);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.linearRampToValueAtTime(peak, t + 0.003);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.1);
    o.start(t);
    o.stop(t + 0.15);
  }

  function pop(v, t, level) {
    burst(v, t, { freq: 1100 + Math.random() * 700, q: 0.8, peak: 0.8 * level, att: 0.002, dec: 0.07 });
    thump(v, t, 0.5 * level);
  }

  function pssh(v, t) {
    burst(v, t, { freq: 6000, q: 0.7, peak: 0.25, att: 0.01, dec: 0.38, sweepTo: 1800 });
  }

  function makeEngine(name) {
    const P = PROFILE[name];
    const c = car();
    const cyl = c ? c.cyl : 4;
    const turbo = !!c && c.eng === 1;
    const diesel = !!c && c.eng === 2;
    const rpmScale = diesel ? 0.66 : 1; // دیزل‌ها دور کمتری می‌گیرن
    const F = (rpm) => Math.max(14, (rpm * rpmScale * cyl) / 120); // فرکانس احتراق

    const v = mkVoice();

    // زنجیره: اسیلاتورها > دیستورشن > فیلتر > ولوم > لرزش > خروجی
    const mix = gain(1);
    const shaper = ctx.createWaveShaper();
    shaper.curve = distCurve(P.dist);
    shaper.oversample = "2x";
    const lp = filt("lowpass", 400, P.q);
    const amp = gain(0.1);
    const lump = gain(0.8);

    const o1 = osc(v, "sawtooth", 30);
    const o2 = osc(v, "sawtooth", 60);
    const o3 = osc(v, "sawtooth", 90);
    const sub = osc(v, "triangle", 15);
    const g2 = gain(P.harm * 0.6);
    const g3 = gain(P.harm * 0.4);
    const gs = gain(P.sub * 0.8);

    o1.connect(mix);
    o2.connect(g2); g2.connect(mix);
    o3.connect(g3); g3.connect(mix);
    sub.connect(gs); gs.connect(mix);
    mix.connect(shaper);
    shaper.connect(lp);
    lp.connect(amp);
    amp.connect(lump);
    lump.connect(v.bus);

    // لرزش و «قلپ‌قلپ» موتور
    const lfo = osc(v, "sine", 10);
    const lfoD = gain(P.lfo * 0.5);
    lfo.connect(lfoD);
    lfoD.connect(lump.gain);

    // خش اگزوز
    const nz = noiseSrc(v);
    const nbp = filt("bandpass", 1500, 1);
    const nG = gain(0.0001);
    nz.connect(nbp);
    nbp.connect(nG);
    nG.connect(v.bus);

    // سوت توربو
    let tw = null, twG = null;
    if (turbo && name !== "refined") {
      tw = osc(v, "sine", 1500);
      twG = gain(0.0001);
      tw.connect(twG);
      twG.connect(v.bus);
    }

    [o1, o2, o3, sub, lfo, nz, tw].forEach((s) => { if (s) s.start(); });

    function sched(param, fn, expo, T) {
      param.cancelScheduledValues(T);
      PLAN.forEach(([t, r, th], i) => {
        const val = Math.max(0.0001, fn(r, th));
        if (i === 0) param.setValueAtTime(val, T + t);
        else if (expo) param.exponentialRampToValueAtTime(val, T + t);
        else param.linearRampToValueAtTime(val, T + t);
      });
    }

    function run(T) {
      sched(o1.frequency, (r) => F(r), true, T);
      sched(o2.frequency, (r) => F(r) * 2, true, T);
      sched(o3.frequency, (r) => F(r) * 3, true, T);
      sched(sub.frequency, (r) => F(r) / 2, true, T);
      sched(lfo.frequency, (r) => F(r) * 0.5, true, T);
      sched(lp.frequency, (r) => P.lpBase + F(r) * P.lpK, true, T);
      sched(amp.gain, (r, th) => P.amp * (0.3 + 0.7 * th), false, T);
      sched(nG.gain, (r, th) => P.rasp * th * 0.35, false, T);
      if (tw) {
        sched(tw.frequency, (r) => 1200 + r * 0.5, true, T);
        sched(twG.gain, (r, th) => (Math.max(0, r - 2200) / 4000) * th * 0.035, false, T);
        pssh(v, T + 4.42); // پسشت توربو موقع رها کردن گاز
      }

      // ترقه‌ها موقع رها کردن گاز (دیزل ترقه نداره)
      const n = diesel ? 0 : Math.round(10 * P.pops);
      for (let i = 0; i < n; i++) {
        pop(v, T + 4.55 + i * 0.16 + Math.random() * 0.08, P.pops >= 1 ? 1 : 0.6);
      }
    }

    let next = ctx.currentTime + 0.05;
    run(next);
    next += CYCLE;
    v.timers.push(setInterval(() => {
      if (ctx.currentTime > next - 1.5) {
        run(next);
        next += CYCLE;
      }
    }, 250));

    return v;
  }

  /* ---------- کنترل پخش ---------- */
  function setBtns() {
    root.querySelectorAll(".splay").forEach((b) => {
      const on = b.dataset.s === playing;
      b.classList.toggle("playing", on);
      b.setAttribute("aria-pressed", String(on));
      b.setAttribute("data-i18n", on ? "sound.stop" : "sound.play");
    });
    refresh();
  }

  function stopAll() {
    if (voice) { voice.stop(0.25); voice = null; }
    playing = null;
    setBtns();
  }

  function toggle(name) {
    if (!AC) return;
    init();
    if (ctx.state === "suspended") ctx.resume();

    if (playing === name) { stopAll(); return; }
    if (voice) { voice.stop(0.15); voice = null; }

    // صدای ماشین بالای صفحه رو خاموش کن تا روی هم نیفتن
    const active = document.querySelector(".chip.active");
    if (active) active.click();

    voice = makeEngine(name);
    playing = name;
    setBtns();
  }

  /* =========================================================
     6. رویدادها
     ========================================================= */
  root.addEventListener("click", (e) => {
    const p = e.target.closest(".splay");
    if (p) { toggle(p.dataset.s); return; }

    const o = e.target.closest(".opt");
    if (o) {
      const g = o.dataset.group;
      const i = Number(o.dataset.i);
      sa[g] = sa[g] === i ? null : i; // کلیک دوباره = لغو انتخاب
      root.querySelectorAll(`.opt[data-group="${g}"]`).forEach((x) => {
        const on = Number(x.dataset.i) === sa[g];
        x.classList.toggle("active", on);
        x.setAttribute("aria-pressed", String(on));
      });
      renderAudio();
    }
  });

  // وقتی ماشین توی «ماشین من» عوض شد، امتیازها به‌روز بشن
  document.addEventListener("tunelab:car", () => {
    updateFit();
    renderAudio();
  });

  // صدا وقتی تب مخفی شد یا بخش از صفحه خارج شد، خودکار قطع بشه
  document.addEventListener("visibilitychange", () => { if (document.hidden) stopAll(); });
  if ("IntersectionObserver" in window) {
    new IntersectionObserver(([en]) => { if (!en.isIntersecting) stopAll(); }, { threshold: 0 }).observe(root);
  }

  updateFit();
  renderAudio();
})();