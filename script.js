// ====== 1. TRANSLATIONS ======
const translations = {
  en: {
    "nav.types": "Tuning Types",
    "nav.compare": "Compare",
    "nav.guide": "Guide",
    "nav.faq": "FAQ",
    "hero.title": "Build a Car That's Truly Yours",
    "hero.subtitle": "Compare tuning options, understand the pros and cons, and plan your build with confidence.",
    "hero.cta": "Start Exploring",
    "types.title": "Tuning Types",
    "types.engine.title": "Engine Power",
    "types.engine.text": "ECU remap, exhaust and intake upgrades for more power and response.",
    "types.chassis.title": "Suspension & Brakes",
    "types.chassis.text": "Better handling, stability and stopping power.",
    "types.look.title": "Exterior & Lighting",
    "types.look.text": "Body kits, wheels and lighting to change the car's character.",
    "types.audio.title": "Sound & Audio",
    "types.audio.text": "Speakers, amplifiers and sound insulation for a better cabin.",
    "compare.title": "Quick Comparison",
    "compare.th.type": "Type",
    "compare.th.cost": "Cost",
    "compare.th.pros": "Pros",
    "compare.th.cons": "Cons",
    "compare.engine.cost": "$$$",
    "compare.engine.pros": "Noticeable power and response",
    "compare.engine.cons": "May affect warranty, fuel use and engine life",
    "compare.chassis.cost": "$$",
    "compare.chassis.pros": "Safer, sharper handling",
    "compare.chassis.cons": "Stiffer, less comfortable ride",
    "compare.look.cost": "$$",
    "compare.look.pros": "Unique look",
    "compare.look.cons": "Local laws may restrict some changes",
    "compare.audio.cost": "$ - $$$",
    "compare.audio.pros": "Big comfort upgrade, no mechanical risk",
    "compare.audio.cons": "Can drain the battery if installed badly",
    "guide.title": "Where Do I Start?",
    "guide.step1": "Define your goal: daily comfort, speed or looks.",
    "guide.step2": "Set a realistic budget, including installation.",
    "guide.step3": "Check local laws, insurance and warranty.",
    "guide.step4": "Choose a trusted, experienced workshop.",
    "faq.title": "FAQ",
    "faq.q1": "Does tuning void my warranty?",
    "faq.a1": "It can. Always check your warranty terms before modifying the car.",
    "faq.q2": "Which upgrade should I do first?",
    "faq.a2": "Most people start with tires and suspension, because they improve safety and feel.",
    "notice.text": "Important: modifications may affect safety, insurance and legal compliance. This site is for general information only."
  },

  fa: {
    "nav.types": "انواع تیونینگ",
    "nav.compare": "مقایسه",
    "nav.guide": "راهنما",
    "nav.faq": "سؤالات متداول",
    "hero.title": "ماشینی بساز که واقعاً مال خودته",
    "hero.subtitle": "گزینه‌های تیونینگ را مقایسه کن، مزایا و معایبشان را بشناس و با اطمینان برای ساخت ماشینت برنامه‌ریزی کن.",
    "hero.cta": "شروع کن",
    "types.title": "انواع تیونینگ",
    "types.engine.title": "قدرت موتور",
    "types.engine.text": "ریمپ ECU، اگزوز و ورودی هوا برای قدرت و واکنش بیشتر.",
    "types.chassis.title": "تعلیق و ترمز",
    "types.chassis.text": "فرمان‌پذیری بهتر، پایداری بیشتر و ترمزگیری قوی‌تر.",
    "types.look.title": "ظاهر و نورپردازی",
    "types.look.text": "بادی‌کیت، رینگ و نورپردازی برای تغییر شخصیت ماشین.",
    "types.audio.title": "صدا و سیستم صوتی",
    "types.audio.text": "اسپیکر، آمپلی‌فایر و عایق صدا برای کابینی بهتر.",
    "compare.title": "مقایسه سریع",
    "compare.th.type": "نوع",
    "compare.th.cost": "هزینه",
    "compare.th.pros": "مزایا",
    "compare.th.cons": "معایب",
    "compare.engine.pros": "افزایش محسوس قدرت و واکنش",
    "compare.engine.cons": "ممکن است روی گارانتی، مصرف سوخت و عمر موتور اثر بگذارد",
    "compare.chassis.pros": "فرمان‌پذیری ایمن‌تر و دقیق‌تر",
    "compare.chassis.cons": "سواری سفت‌تر و کم‌راحتی‌تر",
    "compare.look.pros": "ظاهر منحصربه‌فرد",
    "compare.look.cons": "قوانین محلی ممکن است برخی تغییرات را محدود کنند",
    "compare.audio.pros": "ارتقای زیاد راحتی، بدون ریسک مکانیکی",
    "compare.audio.cons": "نصب نادرست می‌تواند باتری را تخلیه کند",
    "guide.title": "از کجا شروع کنم؟",
    "guide.step1": "هدفت را مشخص کن: راحتی روزمره، سرعت یا ظاهر.",
    "guide.step2": "بودجه‌ای واقع‌بینانه تعیین کن، با احتساب هزینه نصب.",
    "guide.step3": "قوانین محلی، بیمه و گارانتی را بررسی کن.",
    "guide.step4": "کارگاهی معتبر و باتجربه انتخاب کن.",
    "faq.title": "سؤالات متداول",
    "faq.q1": "آیا تیونینگ گارانتی را باطل می‌کند؟",
    "faq.a1": "ممکن است. قبل از تغییر ماشین، شرایط گارانتی را حتماً بررسی کن.",
    "faq.q2": "اول کدام ارتقا را انجام بدهم؟",
    "faq.a2": "بیشتر افراد با لاستیک و تعلیق شروع می‌کنند، چون ایمنی و حس رانندگی را بهتر می‌کنند.",
    "notice.text": "مهم: تغییرات ممکن است روی ایمنی، بیمه و رعایت قوانین اثر بگذارند. این سایت فقط برای اطلاعات عمومی است."
  },

  ru: {
    "nav.types": "Виды тюнинга",
    "nav.compare": "Сравнение",
    "nav.guide": "Руководство",
    "nav.faq": "Вопросы",
    "hero.title": "Создай автомобиль, который по-настоящему твой",
    "hero.subtitle": "Сравнивайте варианты тюнинга, узнайте о плюсах и минусах и уверенно планируйте свой проект.",
    "hero.cta": "Начать",
    "types.title": "Виды тюнинга",
    "types.engine.title": "Мощность двигателя",
    "types.engine.text": "Прошивка ЭБУ, выпуск и впуск для большей мощности и отзывчивости.",
    "types.chassis.title": "Подвеска и тормоза",
    "types.chassis.text": "Лучшая управляемость, устойчивость и эффективность торможения.",
    "types.look.title": "Внешний вид и свет",
    "types.look.text": "Обвесы, диски и освещение, чтобы изменить характер автомобиля.",
    "types.audio.title": "Звук и аудиосистема",
    "types.audio.text": "Динамики, усилители и шумоизоляция для комфортного салона.",
    "compare.title": "Быстрое сравнение",
    "compare.th.type": "Тип",
    "compare.th.cost": "Стоимость",
    "compare.th.pros": "Плюсы",
    "compare.th.cons": "Минусы",
    "compare.engine.pros": "Заметный прирост мощности и отклика",
    "compare.engine.cons": "Может повлиять на гарантию, расход топлива и ресурс двигателя",
    "compare.chassis.pros": "Более безопасная и точная управляемость",
    "compare.chassis.cons": "Более жёсткая и менее комфортная езда",
    "compare.look.pros": "Уникальный внешний вид",
    "compare.look.cons": "Местные законы могут ограничивать некоторые изменения",
    "compare.audio.pros": "Большой прирост комфорта без механических рисков",
    "compare.audio.cons": "При неправильной установке может разряжать аккумулятор",
    "guide.title": "С чего начать?",
    "guide.step1": "Определите цель: повседневный комфорт, скорость или внешний вид.",
    "guide.step2": "Установите реалистичный бюджет с учётом стоимости установки.",
    "guide.step3": "Проверьте местные законы, страховку и гарантию.",
    "guide.step4": "Выберите надёжную мастерскую с опытом.",
    "faq.title": "Вопросы и ответы",
    "faq.q1": "Аннулирует ли тюнинг гарантию?",
    "faq.a1": "Может. Всегда проверяйте условия гарантии перед изменениями.",
    "faq.q2": "С какого улучшения лучше начать?",
    "faq.a2": "Большинство начинает с шин и подвески: они улучшают безопасность и ощущения от вождения.",
    "notice.text": "Важно: изменения могут повлиять на безопасность, страховку и соответствие закону. Сайт носит исключительно информационный характер."
  },

  es: {
    "nav.types": "Tipos de tuning",
    "nav.compare": "Comparar",
    "nav.guide": "Guía",
    "nav.faq": "Preguntas",
    "hero.title": "Crea un coche que sea realmente tuyo",
    "hero.subtitle": "Compara opciones de tuning, entiende sus ventajas y desventajas y planifica tu proyecto con confianza.",
    "hero.cta": "Empezar",
    "types.title": "Tipos de tuning",
    "types.engine.title": "Potencia del motor",
    "types.engine.text": "Reprogramación de la ECU, escape y admisión para más potencia y respuesta.",
    "types.chassis.title": "Suspensión y frenos",
    "types.chassis.text": "Mejor manejo, estabilidad y capacidad de frenado.",
    "types.look.title": "Exterior e iluminación",
    "types.look.text": "Kits de carrocería, llantas e iluminación para cambiar el carácter del coche.",
    "types.audio.title": "Sonido y audio",
    "types.audio.text": "Altavoces, amplificadores y aislamiento acústico para un mejor habitáculo.",
    "compare.title": "Comparación rápida",
    "compare.th.type": "Tipo",
    "compare.th.cost": "Coste",
    "compare.th.pros": "Ventajas",
    "compare.th.cons": "Desventajas",
    "compare.engine.pros": "Mejora notable de potencia y respuesta",
    "compare.engine.cons": "Puede afectar a la garantía, al consumo y a la vida del motor",
    "compare.chassis.pros": "Manejo más seguro y preciso",
    "compare.chassis.cons": "Marcha más dura y menos cómoda",
    "compare.look.pros": "Aspecto único",
    "compare.look.cons": "Las leyes locales pueden restringir algunos cambios",
    "compare.audio.pros": "Gran mejora de confort sin riesgo mecánico",
    "compare.audio.cons": "Puede descargar la batería si se instala mal",
    "guide.title": "¿Por dónde empiezo?",
    "guide.step1": "Define tu objetivo: comodidad diaria, velocidad o estética.",
    "guide.step2": "Fija un presupuesto realista, incluyendo la instalación.",
    "guide.step3": "Revisa las leyes locales, el seguro y la garantía.",
    "guide.step4": "Elige un taller de confianza y con experiencia.",
    "faq.title": "Preguntas frecuentes",
    "faq.q1": "¿El tuning anula la garantía?",
    "faq.a1": "Puede hacerlo. Revisa siempre las condiciones de tu garantía antes de modificar el coche.",
    "faq.q2": "¿Qué mejora debo hacer primero?",
    "faq.a2": "La mayoría empieza por neumáticos y suspensión, porque mejoran la seguridad y las sensaciones.",
    "notice.text": "Importante: las modificaciones pueden afectar a la seguridad, al seguro y al cumplimiento legal. Este sitio es solo informativo."
  },

  ja: {
    "nav.types": "チューニングの種類",
    "nav.compare": "比較",
    "nav.guide": "ガイド",
    "nav.faq": "よくある質問",
    "hero.title": "本当に自分だけの一台をつくろう",
    "hero.subtitle": "チューニングの選択肢を比較し、メリットとデメリットを理解して、安心して計画を立てましょう。",
    "hero.cta": "はじめる",
    "types.title": "チューニングの種類",
    "types.engine.title": "エンジンパワー",
    "types.engine.text": "ECUチューン、マフラー、吸気系の改良でパワーとレスポンスを向上。",
    "types.chassis.title": "サスペンションとブレーキ",
    "types.chassis.text": "ハンドリング、安定性、制動力の向上。",
    "types.look.title": "外装とライティング",
    "types.look.text": "エアロ、ホイール、ライトで愛車の印象を変える。",
    "types.audio.title": "サウンドとオーディオ",
    "types.audio.text": "スピーカー、アンプ、防音で車内をより快適に。",
    "compare.title": "かんたん比較",
    "compare.th.type": "種類",
    "compare.th.cost": "費用",
    "compare.th.pros": "メリット",
    "compare.th.cons": "デメリット",
    "compare.engine.pros": "パワーとレスポンスが明確に向上",
    "compare.engine.cons": "保証、燃費、エンジン寿命に影響する場合がある",
    "compare.chassis.pros": "より安全でシャープなハンドリング",
    "compare.chassis.cons": "乗り心地が硬くなる",
    "compare.look.pros": "個性的な外観",
    "compare.look.cons": "地域の法規制で制限される変更がある",
    "compare.audio.pros": "快適性が大きく向上し、機械的リスクがない",
    "compare.audio.cons": "取り付けが悪いとバッテリー上がりの原因に",
    "guide.title": "どこから始める？",
    "guide.step1": "目的を決める：日常の快適さ、速さ、見た目。",
    "guide.step2": "取り付け費用を含めた現実的な予算を立てる。",
    "guide.step3": "地域の法律、保険、保証を確認する。",
    "guide.step4": "信頼できる経験豊富なショップを選ぶ。",
    "faq.title": "よくある質問",
    "faq.q1": "チューニングすると保証は無効になりますか？",
    "faq.a1": "無効になる場合があります。改造前に必ず保証条件を確認してください。",
    "faq.q2": "最初に行うべきアップグレードは？",
    "faq.a2": "多くの人はタイヤとサスペンションから始めます。安全性と乗り味が向上するためです。",
    "notice.text": "重要：改造は安全性、保険、法令遵守に影響する可能性があります。本サイトは一般的な情報提供のみを目的としています。"
  }
};
// ====== ادغام ترجمه‌های فایل i18n-extra.js ======
if (typeof extraTranslations !== "undefined") {
  Object.keys(extraTranslations).forEach((lang) =>
    Object.assign(translations[lang], extraTranslations[lang])
  );
}
if (typeof carTranslations !== "undefined") {
  Object.keys(carTranslations).forEach((lang) =>
    Object.assign(translations[lang], carTranslations[lang])
  );
}

// ====== متن‌های کوچک اضافی ======
const smallTexts = {
  en: {
    "meta.title": "TuneLab | Car Tuning Guide",
    "hint.3d": "Drag to rotate · Tap a button to see and hear the mod"
  },
  fa: {
    "meta.title": "TuneLab | راهنمای تیونینگ ماشین",
    "hint.3d": "برای چرخاندن بکش · روی دکمه‌ها بزن تا تغییر را ببینی و بشنوی"
  },
  ru: {
    "meta.title": "TuneLab | Руководство по тюнингу авто",
    "hint.3d": "Перетащите, чтобы повернуть · Нажмите кнопку, чтобы увидеть и услышать доработку"
  },
  es: {
    "meta.title": "TuneLab | Guía de tuning de coches",
    "hint.3d": "Arrastra para girar · Pulsa un botón para ver y oír la mejora"
  },
  ja: {
    "meta.title": "TuneLab | カーチューニングガイド",
    "hint.3d": "ドラッグで回転 · ボタンを押すと改造の見た目と音を体験できます"
  }
};
Object.keys(smallTexts).forEach((lang) =>
  Object.assign(translations[lang], smallTexts[lang])
);

// ====== 2. SETTINGS ======
const supportedLangs = Object.keys(translations);
const rtlLangs = ["fa"];
const select = document.getElementById("lang-select");

// ====== 3. DETECT LANGUAGE ======
function detectLanguage() {
  // a) the language the user chose before
  try {
    const saved = localStorage.getItem("lang");
    if (saved && supportedLangs.includes(saved)) return saved;
  } catch (e) {}

  // b) the browser language (e.g. "ru-RU" -> "ru")
  const browserLang = (navigator.language || "en").slice(0, 2).toLowerCase();
  if (supportedLangs.includes(browserLang)) return browserLang;

  // c) fallback
  return "en";
}

// ====== 4. APPLY LANGUAGE ======

function setLanguage(lang) {
  const dict = translations[lang];

  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const key = el.dataset.i18n;
    // if a key is missing in this language, fall back to English
    const text = dict[key] ?? translations.en[key];
    if (text !== undefined) el.textContent = text;
  });

  document.documentElement.lang = lang;
  document.title = dict["meta.title"] ?? translations.en["meta.title"];
  document.documentElement.dir = rtlLangs.includes(lang) ? "rtl" : "ltr";
  select.value = lang;

  try {
    localStorage.setItem("lang", lang);
  } catch (e) {}
}

window.applyI18n = () => setLanguage(select.value);

// ====== 5. EVENTS ======
select.addEventListener("change", (e) => setLanguage(e.target.value));

// ====== 6. START ======
setLanguage(detectLanguage());
// ====== 7. SCROLL REVEAL ======
(function () {
  if (!("IntersectionObserver" in window)) return; // مرورگر قدیمی: همه‌چیز عادی نشون داده می‌شه

  const items = document.querySelectorAll(
    ".section h2, .cards, .table-wrap, .steps li, details, .notice p"
  );

  document.documentElement.classList.add("js-reveal");

  items.forEach((el) => {
    el.classList.add("reveal");
    // تأخیر پله‌ای برای آیتم‌های هم‌خانواده (مراحل راهنما، سؤالات)
    if (el.matches(".steps li, details")) {
      const index = Array.from(el.parentElement.children).indexOf(el);
      el.style.setProperty("--d", Math.min(index, 5) * 0.1 + "s");
    }
  });

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          io.unobserve(entry.target); // فقط یک بار
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -6% 0px" }
  );

  items.forEach((el) => io.observe(el));
})();

// ====== 8. SCROLL EFFECTS (نوار پیشرفت، هدر، دکمه‌ی بالا) ======
(function () {
  const progress = document.getElementById("progress");
  const header = document.querySelector(".header");
  const toTop = document.getElementById("to-top");
  let ticking = false;

  function update() {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const ratio = max > 0 ? window.scrollY / max : 0;
    if (progress) progress.style.transform = `scaleX(${ratio})`;
    if (header) header.classList.toggle("scrolled", window.scrollY > 20);
    if (toTop) toTop.classList.toggle("show", window.scrollY > 600);
    ticking = false;
  }

  // با requestAnimationFrame فقط یک بار در هر فریم محاسبه می‌کنیم تا اسکرول سنگین نشه
  window.addEventListener("scroll", () => {
    if (!ticking) {
      requestAnimationFrame(update);
      ticking = true;
    }
  }, { passive: true });

  if (toTop) {
    toTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
  }
  update();
})();

// ====== 9. MOBILE MENU ======
(function () {
  const btn = document.getElementById("menu-btn");
  const nav = document.getElementById("nav");
  if (!btn || !nav) return;

  function setOpen(open) {
    nav.classList.toggle("open", open);
    btn.setAttribute("aria-expanded", String(open));
  }

  btn.addEventListener("click", () => setOpen(!nav.classList.contains("open")));
  nav.querySelectorAll("a").forEach((a) => a.addEventListener("click", () => setOpen(false)));
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") setOpen(false); });
  window.addEventListener("resize", () => { if (window.innerWidth > 768) setOpen(false); });
})();

// ====== 10. ACTIVE NAV LINK ======
(function () {
  if (!("IntersectionObserver" in window)) return;
  const links = document.querySelectorAll(".nav a");

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        links.forEach((a) =>
          a.classList.toggle("active", a.getAttribute("href") === "#" + entry.target.id)
        );
      });
    },
    { rootMargin: "-45% 0px -50% 0px" } // فقط وقتی بخش وسط صفحه‌ست
  );

  document.querySelectorAll("#types, #garage, #parts, #soundlab, #compare, #guide, #faq").forEach((s) => io.observe(s));
})();