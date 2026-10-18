/* =========================================================
   PART A: 3D tilt effect on cards (CSS 3D)
   ========================================================= */
(function () {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduceMotion) return;

  document.querySelectorAll(".card").forEach((card) => {
    card.addEventListener("pointermove", (e) => {
      if (e.pointerType !== "mouse") return;
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      card.style.transition = "transform .1s, border-color .3s, box-shadow .3s";
      card.style.transform =
        `perspective(800px) rotateX(${(-y * 12).toFixed(2)}deg) rotateY(${(x * 12).toFixed(2)}deg) translateY(-8px)`;
    });
    card.addEventListener("pointerleave", () => {
      card.style.transition = "";
      card.style.transform = "";
    });
  });
})();

/* =========================================================
   PART B: Three.js scene (neon car)
   ========================================================= */
(function () {
  "use strict";

  const canvas = document.getElementById("scene3d");
  if (!canvas) return;

  // اگه Three.js لود نشد یا مرورگر WebGL نداشت، بخش 3D مخفی می‌شه
  const hideStage = () => { canvas.parentElement.style.display = "none"; };
  if (typeof THREE === "undefined") { hideStage(); return; }

  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  } catch (err) {
    hideStage();
    return;
  }

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setClearColor(0x000000, 0);

  /* ---------- Scene, camera, lights ---------- */
  const scene = new THREE.Scene();
  scene.fog = new THREE.Fog(0x07070d, 10, 32);

  const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 100);

  scene.add(new THREE.AmbientLight(0x6060a0, 1.1));

  const keyLight = new THREE.PointLight(0x00e5ff, 1.3, 30);
  keyLight.position.set(4, 5, 4);
  scene.add(keyLight);

  const rimLight = new THREE.PointLight(0x8a5cff, 1.2, 30);
  rimLight.position.set(-5, 3, -4);
  scene.add(rimLight);

  /* ---------- Floor: moving neon grid ---------- */
  const grid = new THREE.GridHelper(60, 60, 0x00e5ff, 0x8a5cff);
  grid.material.transparent = true;
  grid.material.opacity = 0.28;
  scene.add(grid);

  /* ---------- Background particles ---------- */
  const pCount = 300;
  const pPos = new Float32Array(pCount * 3);
  for (let i = 0; i < pCount; i++) {
    pPos[i * 3] = (Math.random() - 0.5) * 40;
    pPos[i * 3 + 1] = Math.random() * 12 + 0.5;
    pPos[i * 3 + 2] = (Math.random() - 0.5) * 40;
  }
  const pGeo = new THREE.BufferGeometry();
  pGeo.setAttribute("position", new THREE.BufferAttribute(pPos, 3));
  const particles = new THREE.Points(
    pGeo,
    new THREE.PointsMaterial({ color: 0x00e5ff, size: 0.06, transparent: true, opacity: 0.6 })
  );
  scene.add(particles);

  /* ---------- Helpers ---------- */
  function addEdges(mesh, color) {
    const edges = new THREE.LineSegments(
      new THREE.EdgesGeometry(mesh.geometry),
      new THREE.LineBasicMaterial({ color })
    );
    mesh.add(edges);
    return edges;
  }

  /* ---------- Car ---------- */
  const car = new THREE.Group();
  scene.add(car);

  // همه‌ی اجزای بدنه توی این گروهن تا با تعلیق پایین بیان (چرخ‌ها جدا هستن)
  const chassis = new THREE.Group();
  car.add(chassis);

  const bodyMat = new THREE.MeshStandardMaterial({ color: 0x1b1b2e, metalness: 0.5, roughness: 0.35 });
  const cabinMat = new THREE.MeshStandardMaterial({
    color: 0x0a0a14, metalness: 0.9, roughness: 0.1,
    emissive: 0x00e5ff, emissiveIntensity: 0.08
  });

  // بدنه‌ی پایین
  const body = new THREE.Mesh(new THREE.BoxGeometry(4.4, 0.6, 1.9), bodyMat);
  body.position.y = 0.62;
  addEdges(body, 0x00e5ff);
  chassis.add(body);

  // کابین (بالاش رو باریک می‌کنیم تا شکل ماشین بگیره)
  const cabinGeo = new THREE.BoxGeometry(2.4, 0.6, 1.7);
  const cp = cabinGeo.attributes.position;
  for (let i = 0; i < cp.count; i++) {
    if (cp.getY(i) > 0) {
      cp.setX(i, cp.getX(i) * 0.62);
      cp.setZ(i, cp.getZ(i) * 0.9);
    }
  }
  cp.needsUpdate = true;
  cabinGeo.computeVertexNormals();
  const cabin = new THREE.Mesh(cabinGeo, cabinMat);
  cabin.position.set(-0.25, 1.22, 0);
  addEdges(cabin, 0x00e5ff);
  chassis.add(cabin);

  // چراغ جلو و عقب
  const headMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
  const tailMat = new THREE.MeshBasicMaterial({ color: 0xff1744 });
  [-0.6, 0.6].forEach((z) => {
    const h = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.12, 0.4), headMat);
    h.position.set(2.2, 0.75, z);
    chassis.add(h);
  });
  const tail = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.1, 1.5), tailMat);
  tail.position.set(-2.2, 0.78, 0);
  chassis.add(tail);

  // ورودی هوای کاپوت (فقط برای مود موتور)
  const scoop = new THREE.Group();
  scoop.position.set(1.1, 0.92, 0);
  const scoopMesh = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.14, 0.5), bodyMat);
  scoopMesh.position.y = 0.07;
  addEdges(scoopMesh, 0x8a5cff);
  scoop.add(scoopMesh);
  chassis.add(scoop);

  // اسپویلر (فقط برای مود ظاهر)
  const spoiler = new THREE.Group();
  spoiler.position.set(-2.0, 0.92, 0);
  const wing = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.06, 1.8), bodyMat);
  wing.position.y = 0.38;
  addEdges(wing, 0xff2e93);
  spoiler.add(wing);
  [-0.6, 0.6].forEach((z) => {
    const post = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.36, 0.08), bodyMat);
    post.position.set(0, 0.18, z);
    spoiler.add(post);
  });
  chassis.add(spoiler);

  // اگزوز و شعله
  const exhaustMat = new THREE.MeshStandardMaterial({
    color: 0x333344, emissive: 0xff5a1f, emissiveIntensity: 0.2, metalness: 0.8, roughness: 0.3
  });
  const flameMat = new THREE.MeshBasicMaterial({
    color: 0xff7a2f, transparent: true, opacity: 0.85, blending: THREE.AdditiveBlending, depthWrite: false
  });
  const flames = [];
  [-0.55, 0.55].forEach((z) => {
    const pipe = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.09, 0.35, 16), exhaustMat);
    pipe.rotation.z = Math.PI / 2;
    pipe.position.set(-2.3, 0.38, z);
    chassis.add(pipe);

    const flame = new THREE.Mesh(new THREE.ConeGeometry(0.08, 0.6, 12), flameMat);
    flame.rotation.z = Math.PI / 2; // نوک شعله به سمت عقب
    flame.position.set(-2.75, 0.38, z);
    chassis.add(flame);
    flames.push(flame);
  });

  /* ---------- Wheels ---------- */
  const tireMat = new THREE.MeshStandardMaterial({ color: 0x0b0b12, roughness: 0.8 });
  const rimMat = new THREE.MeshBasicMaterial({ color: 0x00e5ff });
  const caliperMat = new THREE.MeshBasicMaterial({ color: 0xff2e93 });
  const wheels = [];
  const calipers = [];

  function makeWheel(x, z) {
    const side = Math.sign(z);
    const g = new THREE.Group();
    g.position.set(x, 0.42, z);

    const spin = new THREE.Group();
    g.add(spin);

    const tire = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.42, 0.32, 28), tireMat);
    tire.rotation.x = Math.PI / 2;
    spin.add(tire);

    const rim = new THREE.Mesh(new THREE.TorusGeometry(0.28, 0.035, 8, 28), rimMat);
    rim.position.z = side * 0.17;
    spin.add(rim);

    for (let i = 0; i < 3; i++) {
      const spoke = new THREE.Mesh(new THREE.BoxGeometry(0.56, 0.05, 0.04), rimMat);
      spoke.rotation.z = (i * Math.PI) / 3;
      spoke.position.z = side * 0.17;
      spin.add(spoke);
    }

    // کالیپر ترمز (ثابته و نمی‌چرخه)
    const caliper = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.22, 0.1), caliperMat);
    caliper.position.set(0.16, 0.24, side * 0.2);
    g.add(caliper);
    calipers.push(caliper);

    car.add(g);
    wheels.push(spin);
  }

  [1.4, -1.4].forEach((x) => [0.92, -0.92].forEach((z) => makeWheel(x, z)));

  /* ---------- Underglow & lights under car ---------- */
  const underLight = new THREE.PointLight(0xff2e93, 1, 7);
  underLight.position.set(0, 0.2, 0);
  car.add(underLight);

  const exhaustLight = new THREE.PointLight(0xff6a2a, 0, 6);
  exhaustLight.position.set(-3, 0.5, 0);
  car.add(exhaustLight);

  const glowDisc = new THREE.Mesh(
    new THREE.CircleGeometry(3, 48),
    new THREE.MeshBasicMaterial({
      color: 0xff2e93, transparent: true, opacity: 0.1,
      blending: THREE.AdditiveBlending, depthWrite: false
    })
  );
  glowDisc.rotation.x = -Math.PI / 2;
  glowDisc.position.y = 0.02;
  glowDisc.scale.set(1.5, 0.8, 1);
  car.add(glowDisc);

  /* ---------- Sound rings (audio mod) ---------- */
  const rings = [];
  for (let i = 0; i < 3; i++) {
    const ring = new THREE.Mesh(
      new THREE.RingGeometry(0.97, 1, 64),
      new THREE.MeshBasicMaterial({
        color: 0x00e5ff, transparent: true, opacity: 0, side: THREE.DoubleSide,
        blending: THREE.AdditiveBlending, depthWrite: false
      })
    );
    ring.rotation.x = -Math.PI / 2;
    ring.position.y = 0.03;
    car.add(ring);
    rings.push(ring);
  }

  /* ---------- Mods (حالت‌های تیونینگ) ---------- */
  const BASE = {
    color: 0x1b1b2e, ride: 0, exhaust: 0.15, scoop: 0, spoiler: 0,
    caliper: 0, rings: 0, glow: 0.7, cabin: 0.08, speed: 2
  };
  const mod = (o) => Object.assign({}, BASE, o);

  const MODS = {
    stock: mod({}),
    engine: mod({ color: 0x2b1458, exhaust: 1, scoop: 1, glow: 1.2, speed: 12 }),
    chassis: mod({ color: 0x10304a, ride: -0.14, caliper: 1, glow: 1, speed: 4 }),
    look: mod({ color: 0x8a0f4d, spoiler: 1, glow: 2.4, speed: 2.5 }),
    audio: mod({ rings: 1, cabin: 0.5, glow: 1, speed: 2 })
  };

  const numericKeys = Object.keys(BASE).filter((k) => k !== "color");
  const cur = {};
  numericKeys.forEach((k) => (cur[k] = BASE[k]));

  let target = MODS.stock;
  const targetColor = new THREE.Color(BASE.color);

  function setMod(name) {
    target = MODS[name] || MODS.stock;
    targetColor.set(target.color);
  }

  // دکمه‌ها
  const chips = Array.from(document.querySelectorAll(".chip"));
  chips.forEach((chip) => {
    chip.addEventListener("click", () => {
      const wasActive = chip.classList.contains("active");
      chips.forEach((c) => {
        c.classList.remove("active");
        c.setAttribute("aria-pressed", "false");
      });
      if (wasActive) {
        setMod("stock"); // کلیک دوباره = برگشت به حالت اولیه
      } else {
        chip.classList.add("active");
        chip.setAttribute("aria-pressed", "true");
        setMod(chip.dataset.mod);
      }
    });
  });

  /* ---------- Camera orbit + drag ---------- */
  let angle = 0.85;
  let targetAngle = 0.85;
  let dragging = false;
  let lastX = 0;
  let aspect = 1.6;

  canvas.addEventListener("pointerdown", (e) => {
    dragging = true;
    lastX = e.clientX;
    canvas.setPointerCapture(e.pointerId);
  });
  canvas.addEventListener("pointermove", (e) => {
    if (!dragging) return;
    targetAngle -= (e.clientX - lastX) * 0.008;
    lastX = e.clientX;
  });
  ["pointerup", "pointercancel"].forEach((ev) =>
    canvas.addEventListener(ev, () => { dragging = false; })
  );

  function resize() {
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    aspect = w / h;
    camera.aspect = aspect;
    camera.updateProjectionMatrix();
  }
  new ResizeObserver(resize).observe(canvas);
  resize();

  /* ---------- Animation loop ---------- */
  let visible = false;
  let running = false;
  let last = 0;
  let t = 0;
  let travel = 0;

  function loop(now) {
    if (!visible) { running = false; return; } // وقتی دیده نمی‌شه، رندر نکن
    requestAnimationFrame(loop);

    const dt = Math.min((now - last) / 1000, 0.05);
    last = now;
    t += dt;

    // نرم رفتن به سمت مقدار هدف
    const k = 1 - Math.exp(-dt * 5);
    numericKeys.forEach((key) => { cur[key] += (target[key] - cur[key]) * k; });
    bodyMat.color.lerp(targetColor, k);

    // اعمال مقادیر
    chassis.position.y = cur.ride;
    exhaustMat.emissiveIntensity = cur.exhaust * 1.6;
    exhaustLight.intensity = cur.exhaust * 1.4;
    underLight.intensity = cur.glow * 1.2;
    glowDisc.material.opacity = 0.1 * cur.glow;

    const s = (v) => Math.max(v, 0.001);
    scoop.scale.setScalar(s(cur.scoop));
    scoop.visible = cur.scoop > 0.02;
    spoiler.scale.setScalar(s(cur.spoiler));
    spoiler.visible = cur.spoiler > 0.02;
    calipers.forEach((c) => { c.scale.setScalar(s(cur.caliper)); c.visible = cur.caliper > 0.02; });

    flames.forEach((f) => {
      f.visible = cur.exhaust > 0.3;
      f.scale.set(s(cur.exhaust), s(cur.exhaust * (0.7 + Math.random() * 0.6)), s(cur.exhaust));
    });

    cabinMat.emissiveIntensity = cur.cabin + cur.rings * 0.15 * (0.5 + 0.5 * Math.sin(t * 8));

    // حلقه‌های صوتی
    rings.forEach((ring, i) => {
      const p = (t * 0.6 + i / 3) % 1;
      const size = 2 + p * 5;
      ring.scale.set(size * 1.5, size, 1);
      ring.material.opacity = cur.rings * (1 - p) * 0.8;
    });

    // چرخش چرخ‌ها و حرکت زمین (هماهنگ با هم)
    wheels.forEach((w) => { w.rotation.z -= cur.speed * dt; });
    travel += cur.speed * 0.42 * dt;
    grid.position.x = -(travel % 1);

    particles.rotation.y += dt * 0.02;

    // دوربین دور ماشین می‌چرخه
    if (!dragging && !reduceMotion) targetAngle += dt * 0.15;
    angle += (targetAngle - angle) * Math.min(1, dt * 6);

    const dist = Math.min(9.5 * Math.max(1, 1.6 / aspect), 22);
    camera.position.set(Math.cos(angle) * dist, dist * 0.28, Math.sin(angle) * dist);
    camera.lookAt(0, 0.7, 0);

    renderer.render(scene, camera);
  }

  new IntersectionObserver((entries) => {
    visible = entries[0].isIntersecting;
    if (visible && !running) {
      running = true;
      last = performance.now();
      requestAnimationFrame(loop);
    }
  }).observe(canvas);
})();