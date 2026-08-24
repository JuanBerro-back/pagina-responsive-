/* ============================================================
  KILL LA KILL — JavaScript
  1. Viento en el hero (canvas)
   2. Animaciones de aparición al hacer scroll (IntersectionObserver)
   3. Contadores animados en las estadísticas
   4. Menú hamburguesa en móvil
   5. Botón "volver arriba"
   ============================================================ */

const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ---------- 1. Viento sutil en el hero ---------- */
(function wind() {
  const canvas = document.getElementById("wind");
  if (!canvas || reducedMotion) return;

  const ctx = canvas.getContext("2d");
  let width, height, gusts = [];

  function resize() {
    const rect = canvas.parentElement.getBoundingClientRect();
    width = canvas.width = rect.width;
    height = canvas.height = rect.height;
  }

  function makeGust() {
    return {
      x: -width * 0.2 - Math.random() * width,
      y: Math.random() * height,
      length: 90 + Math.random() * 180,
      speed: 0.7 + Math.random() * 1.1,
      wave: Math.random() * Math.PI * 2,
      alpha: 0.08 + Math.random() * 0.12
    };
  }

  function draw(gust) {
    ctx.save();
    ctx.globalAlpha = gust.alpha;
    ctx.strokeStyle = "#dce9ff";
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(gust.x, gust.y);
    ctx.bezierCurveTo(gust.x + gust.length * 0.35, gust.y - 18, gust.x + gust.length * 0.7, gust.y + 18, gust.x + gust.length, gust.y);
    ctx.stroke();
    ctx.restore();
  }

  function step() {
    ctx.clearRect(0, 0, width, height);
    for (const gust of gusts) {
      gust.wave += 0.015;
      gust.x += gust.speed;
      gust.y += Math.sin(gust.wave) * 0.2;
      if (gust.x > width + 40) gust.x = -gust.length;
      draw(gust);
    }
    requestAnimationFrame(step);
  }

  resize();
  const count = Math.min(14, Math.max(7, Math.floor(width / 100)));
  gusts = Array.from({ length: count }, makeGust);
  window.addEventListener("resize", resize);
  step();
})();

/* ---------- 2. Aparición al hacer scroll ---------- */
(function scrollReveal() {
  const items = document.querySelectorAll(".reveal");
  if (reducedMotion || !("IntersectionObserver" in window)) {
    items.forEach((el) => el.classList.add("in-view"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in-view");
          observer.unobserve(entry.target); // solo anima una vez
        }
      });
    },
    { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
  );

  items.forEach((el) => observer.observe(el));
})();

/* ---------- 3. Contadores animados ---------- */
(function counters() {
  const nums = document.querySelectorAll(".stat-num[data-count]");
  if (!nums.length) return;

  function animate(el) {
    const target = parseInt(el.dataset.count, 10);
    if (reducedMotion) { el.textContent = target; return; }

    const duration = 1400;
    const start = performance.now();

    function tick(now) {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3); // ease-out cúbico
      el.textContent = Math.round(target * eased);
      if (p < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animate(entry.target);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.6 }
  );

  nums.forEach((el) => observer.observe(el));
})();

/* ---------- 4. Menú hamburguesa ---------- */
(function mobileMenu() {
  const toggle = document.getElementById("navToggle");
  const links = document.getElementById("navLinks");
  if (!toggle || !links) return;

  toggle.addEventListener("click", () => {
    const open = links.classList.toggle("open");
    toggle.classList.toggle("open", open);
    toggle.setAttribute("aria-expanded", String(open));
  });

  // Cierra el menú al elegir un enlace
  links.querySelectorAll("a").forEach((a) =>
    a.addEventListener("click", () => {
      links.classList.remove("open");
      toggle.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
    })
  );
})();

/* ---------- 5. Botón "volver arriba" ---------- */
(function toTop() {
  const btn = document.getElementById("toTop");
  if (!btn) return;
  window.addEventListener("scroll", () => {
    btn.classList.toggle("visible", window.scrollY > 600);
  }, { passive: true });
})();

/* ---------- 6. Cortina interactiva Scroll-to-Reveal ---------- */
(function curtainReveal() {
  const section = document.getElementById("portal-academy");
  const grid = document.getElementById("curtainGrid");
  const hint = document.getElementById("curtainHint");
  if (!section || !grid) return;

  function updateCurtain() {
    const rect = section.getBoundingClientRect();
    const windowHeight = window.innerHeight;
    const totalDistance = rect.height - windowHeight;
    const currentScroll = -rect.top;
    
    let progress = 0;
    if (totalDistance > 0) {
      progress = Math.min(Math.max(currentScroll / totalDistance, 0), 1);
    }

    grid.style.setProperty("--curtain-progress", progress.toFixed(4));
    
    if (hint) {
      hint.style.opacity = progress > 0.15 ? "0" : "1";
    }
  }

  window.addEventListener("scroll", updateCurtain, { passive: true });
  window.addEventListener("resize", updateCurtain);
  updateCurtain();
})();

/* ---------- 7. Cursor interactivo (Skin THIS DAY WE FIGHT) ---------- */
(function customCursor() {
  const cursor = document.getElementById("cursor");
  if (!cursor || window.matchMedia("(pointer: coarse)").matches) return;

  let hasMouse = false;

  window.addEventListener(
    "mousemove",
    () => {
      if (!hasMouse) {
        hasMouse = true;
        cursor.classList.add("visible");
      }
    },
    { once: true }
  );

  document.addEventListener("mousemove", (e) => {
    cursor.style.left = e.clientX + "px";
    cursor.style.top = e.clientY + "px";
  });

  const hoverTargets = "a, button, label, .card, .btn, .chip, .mcard, input, [tabindex]";
  document.addEventListener("mouseover", (e) => {
    if (e.target.closest(hoverTargets)) {
      cursor.classList.add("big");
    }
  });

  document.addEventListener("mouseout", (e) => {
    if (e.target.closest(hoverTargets)) {
      cursor.classList.remove("big");
    }
  });
})();


