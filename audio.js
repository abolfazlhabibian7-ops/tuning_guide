(function () {
  "use strict";

  const chips = Array.from(document.querySelectorAll(".chip"));
  const toggleBtn = document.getElementById("sound-toggle");
  const canvas = document.getElementById("scene3d");
  const AC = window.AudioContext || window.webkitAudioContext;

  // اگه مرورگر Web Audio نداشت، دکمه‌ی صدا رو مخفی کن
  if (!chips.length || !AC) {
    if (toggleBtn) toggleBtn.style.display = "none";
    return;
  }

  /* =========================================================
     1. STATE
     ========================================================= */
  let ctx = null;        // AudioContext (بعد از اولین کلیک ساخته می‌شه)
  let master = null;     // ولوم اصلی
  let noiseBuf = null;   // بافر نویز سفید
  let muted = false;
  let current = null;    // اسم مود فعال
  let voice = null;      // صدایی که الان پخش می‌شه

  try { muted = localStorage.getItem("muted") === "1"; } catch (e) {}

  function initAudio() {
    if (ctx) return;
    ctx = new AC();

    master = ctx.createGain();
    master.gain.value = muted ? 0 : 0.8;

    // کمپرسور جلوی بلند شدن ناگهانی و ترکیدن صدا رو می‌گیره
    const comp = ctx.createDynamicsCompressor();
    master.connect(comp);
    comp.connect(ctx.destination);

    // ۲ ثانیه نویز سفید؛ مواد خام صدای هوا، ترقه و هات
    const len = ctx.sampleRate * 2;
    noiseBuf = ctx.createBuffer(1, len, ctx.sampleRate);
    const data = noiseBuf.getChannelData(0);
    for (let i = 0; i < len; i++) data[i] = Math.random() * 2 - 1;
  }

  /* =========================================================
     2. VOICE: یه «کانال» برای هر صدا تا بشه یه‌جا قطعش کرد
     ========================================================= */
  function createVoice() {
    const bus = ctx.createGain();
    bus.gain.value = 0.0001;
    bus.gain.linearRampToValueAtTime(1, ctx.currentTime + 0.08); // فید این
    bus.connect(master);

    const v = { bus, srcs: [], timers: [] };

    v.interval = (fn, ms) => {
      const id = setInterval(fn, ms);
      v.timers.push(id);
      return id;
    };

    v.stop = (fade = 0.15) => {
      v.timers.forEach(clearInterval);
      const t = ctx.currentTime;
      bus.gain.cancelScheduledValues(t);
      bus.gain.setValueAtTime(Math.max(bus.gain.value, 0.0001), t);
      bus.gain.linearRampToValueAtTime(0.0001, t + fade); // فید اوت
      setTimeout(() => {
        v.srcs.forEach((s) => { try { s.stop(); } catch (e) {} });
        bus.disconnect();
      }, fade * 1000 + 80);
    };

    return v;
  }

  /* =========================================================
     3. ابزارهای ساخت صدا
     ========================================================= */
  function mkOsc(v, type, freq) {
    const o = ctx.createOscillator();
    o.type = type;
    o.frequency.value = freq;
    v.srcs.push(o);
    return o;
  }

  function mkNoise(v) {
    const s = ctx.createBufferSource();
    s.buffer = noiseBuf;
    s.loop = true;
    v.srcs.push(s);
    return s;
  }

  function mkGain(val) {
    const g = ctx.createGain();
    g.gain.value = val;
    return g;
  }

  function mkFilter(type, freq, q) {
    const f = ctx.createBiquadFilter();
    f.type = type;
    f.frequency.value = freq;
    if (q) f.Q.value = q;
    return f;
  }

  // پوش صدا: بالا رفتن سریع (attack) و محو شدن (decay)
  function env(param, t, peak, attack, decay) {
    param.cancelScheduledValues(t);
    param.setValueAtTime(0.0001, t);
    param.linearRampToValueAtTime(peak, t + attack);
    param.exponentialRampToValueAtTime(0.0001, t + attack + decay);
  }

  // یه انفجار کوتاه نویز (هوا، کلیک، ترقه، هات، کلپ)
  function noiseBurst(v, t, o) {
    const {
      type = "bandpass", freq = 1000, q = 1, peak = 0.5,
      attack = 0.003, decay = 0.1, sweepTo = 0, out = v.bus
    } = o;
    const sweepTime = o.sweepTime || attack + decay;

    const n = mkNoise(v);
    const f = mkFilter(type, freq, q);
    const g = mkGain(0.0001);
    n.connect(f);
    f.connect(g);
    g.connect(out);

    if (sweepTo) {
      f.frequency.setValueAtTime(freq, t);
      f.frequency.exponentialRampToValueAtTime(sweepTo, t + sweepTime);
    }
    env(g.gain, t, peak, attack, decay);
    n.start(t, Math.random() * 1.5);
    n.stop(t + attack + decay + 0.05);
  }

  // یه نُت یا صدای کوتاه (می‌تونه فرکانسش سر بخوره: f0 به f1)
  function tone(v, t, o) {
    const {
      type = "sine", f0 = 440, f1 = 0, dur = 0.2,
      peak = 0.3, attack = 0.005, lp = 0, out = v.bus
    } = o;

    const osc = mkOsc(v, type, f0);
    const g = mkGain(0.0001);
    let last = osc;
    if (lp) {
      const f = mkFilter("lowpass", lp);
      osc.connect(f);
      last = f;
    }
    last.connect(g);
    g.connect(out);

    if (f1) {
      osc.frequency.setValueAtTime(f0, t);
      osc.frequency.exponentialRampToValueAtTime(f1, t + dur);
    }
    env(g.gain, t, peak, attack, dur - attack);
    osc.start(t);
    osc.stop(t + dur + 0.05);
  }

  // ترقه‌ی اگزوز
  function pop(v, t) {
    noiseBurst(v, t, {
      type: "bandpass", freq: 1100 + Math.random() * 700, q: 0.8,
      peak: 0.9, attack: 0.002, decay: 0.07
    });
    tone(v, t, { type: "sine", f0: 160, f1: 55, dur: 0.09, peak: 0.5, attack: 0.002 });
  }

  // بلوآف توربو (پشششت)
  function pssh(v, t) {
    noiseBurst(v, t, {
      type: "bandpass", freq: 6000, q: 0.7, peak: 0.28,
      attack: 0.01, decay: 0.38, sweepTo: 1800, sweepTime: 0.4
    });
  }

  // منحنی دیستورشن برای غرش موتور
  function distCurve(k) {
    const n = 512;
    const curve = new Float32Array(n);
    for (let i = 0; i < n; i++) {
      const x = (i * 2) / n - 1;
      curve[i] = ((3 + k) * x * 20 * (Math.PI / 180)) / (Math.PI + k * Math.abs(x));
    }
    return curve;
  }

  /* =========================================================
     4. ENGINE: گاز، شتاب، دنده، ترقه
     ========================================================= */
  function engineVoice() {
    const v = createVoice();

    // زنجیره: اسیلاتورها > دیستورشن > فیلتر > ولوم > لرزش > خروجی
    const mix = mkGain(1);
    const shaper = ctx.createWaveShaper();
    shaper.curve = distCurve(30);
    shaper.oversample = "2x";
    const lp = mkFilter("lowpass", 700, 1.2);
    const amp = mkGain(0.2);
    const lump = mkGain(0.75);

    const saw1 = mkOsc(v, "sawtooth", 38);
    const saw2 = mkOsc(v, "sawtooth", 76);
    saw2.detune.value = 9;
    const sub = mkOsc(v, "triangle", 38);
    const g2 = mkGain(0.5);
    const gs = mkGain(0.6);

    saw1.connect(mix);
    saw2.connect(g2); g2.connect(mix);
    sub.connect(gs); gs.connect(mix);
    mix.connect(shaper);
    shaper.connect(lp);
    lp.connect(amp);
    amp.connect(lump);
    lump.connect(v.bus);

    // لرزش و «قلپ‌قلپ» موتور
    const lfo = mkOsc(v, "sine", 17);
    const lfoDepth = mkGain(0.22);
    lfo.connect(lfoDepth);
    lfoDepth.connect(lump.gain);

    // سوت توربو
    const turbo = mkOsc(v, "sine", 1600);
    const turboGain = mkGain(0.0001);
    turbo.connect(turboGain);
    turboGain.connect(v.bus);

    [saw1, saw2, sub, lfo, turbo].forEach((o) => o.start());

    // f = «فرکانس احتراق» (هرچی بیشتر، دور موتور بالاتر)
    // هر پارامتر صدا یه فرمول از f داره و همه با هم تغییر می‌کنن
    const links = [
      [saw1.frequency, (f) => f],
      [saw2.frequency, (f) => f * 2],
      [sub.frequency, (f) => f],
      [lfo.frequency, (f) => f * 0.45],
      [lp.frequency, (f) => 250 + f * 14],
      [amp.gain, (f) => 0.16 + f * 0.0017],
      [turbo.frequency, (f) => 800 + f * 22],
      [turboGain.gain, (f) => Math.max(0.0001, (f - 70) * 0.0006)]
    ];

    // سکانس: ['s' = پرش ناگهانی، 'r' = رفتن نرم تا زمان t]، [زمان، f]
    const plan = [
      ["s", 0, 38],
      ["r", 0.5, 38],     // درجا
      ["r", 0.85, 125],   // گاز اول
      ["r", 1.3, 42],     // رها کردن
      ["r", 1.9, 40],
      ["r", 3.6, 165],    // شتاب دنده ۱
      ["s", 3.7, 100],    // عوض کردن دنده
      ["r", 5.2, 170],    // شتاب دنده ۲
      ["s", 5.3, 115],    // دنده ۳
      ["r", 6.8, 180],    // شتاب دنده ۳
      ["r", 7.5, 44],     // رها کردن گاز
      ["r", 8.6, 38]      // برگشت به درجا
    ];

    function run(T) {
      links.forEach(([p]) => p.cancelScheduledValues(T));
      plan.forEach(([kind, t, f]) => {
        links.forEach(([p, fn]) => {
          const val = Math.max(0.0001, fn(f));
          if (kind === "s") p.setValueAtTime(val, T + t);
          else p.exponentialRampToValueAtTime(val, T + t);
        });
      });

      // بلوآف موقع عوض کردن دنده
      [3.6, 5.2, 6.8].forEach((t) => pssh(v, T + t + 0.03));
      [3.7, 5.3].forEach((t) => pop(v, T + t + 0.02));

      // ترقه‌های اگزوز موقع رها کردن گاز
      [7.55, 7.68, 7.8, 7.97, 8.15, 8.3].forEach((t) =>
        pop(v, T + t + Math.random() * 0.03)
      );
    }

    run(ctx.currentTime + 0.05);
    v.interval(() => run(ctx.currentTime + 0.05), 12000);
    return v;
  }

  /* =========================================================
     5. CHASSIS: تعلیق و ترمز
     ========================================================= */
  function chassisVoice() {
    const v = createVoice();
    const T = ctx.currentTime + 0.05;

    // خالی شدن هوای تعلیق (دو پف)
    noiseBurst(v, T, {
      type: "bandpass", freq: 4200, q: 0.8, peak: 0.35,
      attack: 0.02, decay: 0.55, sweepTo: 1400, sweepTime: 0.6
    });
    noiseBurst(v, T + 0.22, {
      type: "bandpass", freq: 3600, q: 0.8, peak: 0.22,
      attack: 0.02, decay: 0.5, sweepTo: 1200, sweepTime: 0.55
    });

    // ویز هیدرولیک
    tone(v, T + 0.05, {
      type: "sawtooth", f0: 260, f1: 150, dur: 0.9,
      peak: 0.07, attack: 0.08, lp: 900
    });

    // ضربه‌ی نشستن روی زمین
    tone(v, T + 1.0, { type: "sine", f0: 110, f1: 38, dur: 0.35, peak: 0.9, attack: 0.004 });
    noiseBurst(v, T + 1.0, {
      type: "lowpass", freq: 700, q: 0.7, peak: 0.5, attack: 0.003, decay: 0.18
    });

    // کلیک کالیپر ترمز و جیر ترمز
    [1.45, 1.57].forEach((dt) =>
      noiseBurst(v, T + dt, {
        type: "highpass", freq: 3000, q: 0.7, peak: 0.4, attack: 0.001, decay: 0.03
      })
    );
    tone(v, T + 1.5, {
      type: "sawtooth", f0: 3300, f1: 2900, dur: 0.55,
      peak: 0.035, attack: 0.05, lp: 4200
    });

    return v;
  }

  /* =========================================================
     6. LOOK: قفل مرکزی، اسپویلر، نئون
     ========================================================= */
  function lookVoice() {
    const v = createVoice();
    const T = ctx.currentTime + 0.05;

    // بوق بیپ‌بیپ قفل مرکزی
    [0, 0.17].forEach((dt) =>
      tone(v, T + dt, {
        type: "square", f0: 1850, dur: 0.1, peak: 0.1, attack: 0.004, lp: 3500
      })
    );

    // موتور اسپویلر که بیرون میاد و ضربه‌ی آخرش
    tone(v, T + 0.55, {
      type: "sawtooth", f0: 170, f1: 420, dur: 0.8,
      peak: 0.12, attack: 0.05, lp: 1400
    });
    noiseBurst(v, T + 1.4, {
      type: "lowpass", freq: 900, q: 0.7, peak: 0.45, attack: 0.003, decay: 0.12
    });
    tone(v, T + 1.4, { type: "sine", f0: 140, f1: 60, dur: 0.18, peak: 0.5, attack: 0.003 });

    // جرقه‌های روشن شدن نئون
    [0.7, 0.78, 0.95, 1.02, 1.1, 1.3, 1.33].forEach((dt) =>
      noiseBurst(v, T + dt, {
        type: "bandpass", freq: 2400, q: 2, peak: 0.3, attack: 0.001, decay: 0.04
      })
    );
    tone(v, T + 1.35, {
      type: "sine", f0: 300, f1: 2200, dur: 0.7, peak: 0.06, attack: 0.1
    });

    // همهمه‌ی ثابت نئون (تا وقتی مود فعاله)
    const hum = mkOsc(v, "sawtooth", 100);
    const humLp = mkFilter("lowpass", 420);
    const humG = mkGain(0.0001);
    hum.connect(humLp);
    humLp.connect(humG);
    humG.connect(v.bus);
    humG.gain.setValueAtTime(0.0001, T + 1.2);
    humG.gain.linearRampToValueAtTime(0.05, T + 1.9);
    hum.start(T + 1.2);

    return v;
  }

  /* =========================================================
     7. AUDIO: بیت هاوس ۱۲۲ BPM
     ========================================================= */
  function musicVoice() {
    const v = createVoice();
    const BPM = 122;
    const stepTime = 60 / BPM / 4; // طول هر یک‌شانزدهم

    // بیس و کورد از این کانال رد می‌شن تا با کیک «ساید‌چین» بشن
    const duck = mkGain(1);
    duck.connect(v.bus);

    // پروگرسیون Am - F - C - G
    const roots = [55, 43.65, 65.41, 49];
    const chords = [
      [220, 261.63, 329.63],
      [174.61, 220, 261.63],
      [196, 261.63, 329.63],
      [196, 246.94, 293.66]
    ];

    function kick(t) {
      tone(v, t, { type: "sine", f0: 160, f1: 42, dur: 0.35, peak: 0.9, attack: 0.002 });
      duck.gain.cancelScheduledValues(t);
      duck.gain.setValueAtTime(0.3, t);
      duck.gain.linearRampToValueAtTime(1, t + 0.22);
    }

    function clap(t) {
      [0, 0.012, 0.024].forEach((d) =>
        noiseBurst(v, t + d, {
          freq: 1500, q: 1.1, peak: 0.35, attack: 0.001, decay: d === 0.024 ? 0.14 : 0.02
        })
      );
    }

    function hat(t, open) {
      noiseBurst(v, t, {
        type: "highpass", freq: 8000, q: 0.7,
        peak: open ? 0.1 : 0.05, attack: 0.001, decay: open ? 0.12 : 0.03
      });
    }

    function schedule(s, t) {
      const bar = Math.floor(s / 16) % 4;
      const k = s % 16;

      if (k % 4 === 0) kick(t);
      if (k === 4 || k === 12) clap(t);
      if (k % 4 === 2) hat(t, true);
      else if (k % 2 === 1) hat(t, false);

      // بیس
      if ([2, 3, 6, 10, 11, 14].includes(k)) {
        const f = roots[bar] * (k === 3 || k === 11 ? 2 : 1);
        tone(v, t, {
          type: "sawtooth", f0: f, dur: 0.2, peak: 0.33,
          attack: 0.006, lp: 380, out: duck
        });
      }

      // کورد کوتاه
      if (k === 3 || k === 10) {
        chords[bar].forEach((f) =>
          tone(v, t, {
            type: "sawtooth", f0: f, dur: 0.2, peak: 0.045,
            attack: 0.005, lp: 1800, out: duck
          })
        );
      }
    }

    // زمان‌بند: هر ۳۰ میلی‌ثانیه، نُت‌های ۱۵۰ میلی‌ثانیه‌ی آینده رو دقیق روی ساعت صوتی می‌چینه
    let next = ctx.currentTime + 0.1;
    let i = 0;
    v.interval(() => {
      while (next < ctx.currentTime + 0.15) {
        schedule(i, next);
        next += stepTime;
        i++;
      }
    }, 30);

    return v;
  }

  /* =========================================================
     8. کنترل پخش
     ========================================================= */
  const makers = {
    engine: engineVoice,
    chassis: chassisVoice,
    look: lookVoice,
    audio: musicVoice
  };

  function stopVoice(fade) {
    if (voice) {
      voice.stop(fade);
      voice = null;
    }
  }

  function startVoice(name) {
    stopVoice(0.12);
    if (!ctx || !makers[name]) return;
    voice = makers[name]();
  }

  chips.forEach((chip) => {
    chip.addEventListener("click", () => {
      initAudio();
      if (ctx.state === "suspended") ctx.resume();

      const name = chip.dataset.mod;
      if (current === name) {      // کلیک دوباره = خاموش
        current = null;
        stopVoice(0.25);
      } else {
        current = name;
        startVoice(name);
      }
    });
  });

  /* ---------- دکمه‌ی قطع/وصل ---------- */
  function applyMute() {
    if (toggleBtn) {
      toggleBtn.textContent = muted ? "🔇" : "🔊";
      toggleBtn.setAttribute("aria-pressed", String(!muted));
    }
    if (master) master.gain.setTargetAtTime(muted ? 0 : 0.8, ctx.currentTime, 0.05);
  }

  if (toggleBtn) {
    toggleBtn.addEventListener("click", () => {
      muted = !muted;
      try { localStorage.setItem("muted", muted ? "1" : "0"); } catch (e) {}
      applyMute();
    });
  }
  applyMute();

  /* ---------- وقتی تب مخفی شد یا هیرو از صفحه خارج شد، صدا قطع بشه ---------- */
  document.addEventListener("visibilitychange", () => {
    if (!ctx) return;
    if (document.hidden) ctx.suspend();
    else ctx.resume();
  });

  if (canvas && "IntersectionObserver" in window) {
    new IntersectionObserver(([entry]) => {
      if (!ctx) return;
      if (!entry.isIntersecting) stopVoice(0.3);
      else if (current && !voice) startVoice(current);
    }, { threshold: 0.1 }).observe(canvas);
  }
})();