/* ============================================================
   KILL LA KILL × STEEL BALL RUN — ANIME CROSSOVER & SCENE CUTS
   Efectos de corte manga/anime dinámicos para navbar y escenas
   ============================================================ */

(function initAnimeCrossover() {
  function start() {
    const togCheckbox = document.getElementById("btu-tog");
    const globalSlashOverlay = document.getElementById("globalSlashOverlay");
    const globalKanjiFx = document.getElementById("globalKanjiFx");
    const tobeCont = document.getElementById("jojoToBeContinued");

    // Generador de efectos de sonido anime sintetizado (Web Audio API)
    let audioCtx = null;
    function playAnimeSlashSound() {
      try {
        if (!audioCtx) {
          audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        }
        if (audioCtx.state === "suspended") {
          audioCtx.resume();
        }
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        const filter = audioCtx.createBiquadFilter();

        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(900, audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(70, audioCtx.currentTime + 0.25);

        filter.type = "lowpass";
        filter.frequency.setValueAtTime(3200, audioCtx.currentTime);
        filter.frequency.linearRampToValueAtTime(250, audioCtx.currentTime + 0.25);

        gain.gain.setValueAtTime(0.28, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.26);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(audioCtx.destination);

        osc.start();
        osc.stop(audioCtx.currentTime + 0.26);
      } catch (e) {
        // En caso de que el navegador limite la reproducción previa
      }
    }

    const kanjiList = [
      { text: "ゴゴゴゴ", sub: "MENACING", color: "#ff3d5f" },
      { text: "戦維喪失", sub: "SEN'I SŌSHITSU!", color: "#f2bb13" },
      { text: "黄金の回転", sub: "GOLDEN SPIN!", color: "#00d2b4" },
      { text: "ドドドド", sub: "RUMBLE!", color: "#ff3d5f" },
      { text: "ズキュウウン", sub: "STAND POWER!", color: "#f2bb13" },
      { text: "ドンッ！", sub: "IMPACT CUT!", color: "#00d2b4" }
    ];

    // Transición de nubes para cruzar entre universos.
    function triggerGlobalSceneSlash() {
      playAnimeSlashSound();

      // 1. Nubes que cubren y despejan el horizonte.
      if (globalSlashOverlay) {
        globalSlashOverlay.classList.remove("is-slashing");
        void globalSlashOverlay.offsetWidth;
        globalSlashOverlay.classList.add("is-slashing");
        setTimeout(() => globalSlashOverlay.classList.remove("is-slashing"), 450);
      }

      // 2. Mensaje breve de transición.
      if (globalKanjiFx) {
        const randomKanji = kanjiList[Math.floor(Math.random() * kanjiList.length)];
        globalKanjiFx.innerHTML = `<span class="kanji-main" style="color: ${randomKanji.color}">${randomKanji.text}</span><span class="kanji-sub">${randomKanji.sub}</span>`;
        globalKanjiFx.classList.remove("is-active");
        void globalKanjiFx.offsetWidth;
        globalKanjiFx.classList.add("is-active");
        setTimeout(() => globalKanjiFx.classList.remove("is-active"), 650);
      }

      // 3. Vibración de pantalla tipo cómic
      document.body.classList.remove("screen-slash-shake");
      void document.body.offsetWidth;
      document.body.classList.add("screen-slash-shake");
      setTimeout(() => document.body.classList.remove("screen-slash-shake"), 300);

      // 4. Indicador To Be Continued
      if (tobeCont) {
        tobeCont.classList.add("is-spin");
        setTimeout(() => tobeCont.classList.remove("is-spin"), 600);
      }
    }

    // ============================================================
    // 1. ASIGNAR CORTE DE ESCENA A TODOS LOS ENLACES DE NAVEGACIÓN
    // ============================================================
    function setupNavCutEffects() {
      const navLinks = document.querySelectorAll(
        ".btu-menu a, .btu-drawer-list a, .btu-guidebook-links a, .footer-links a, .hero-actions a, .curtain-actions a, a[href^='#']"
      );

      navLinks.forEach(link => {
        link.addEventListener("click", (e) => {
          const href = link.getAttribute("href");
          if (!href || href === "#") return;
          if (href.startsWith("#")) {
            const targetEl = document.querySelector(href);
            if (targetEl) {
              // Disparar corte visual y sonoro
              triggerGlobalSceneSlash();
              // Cerrar drawer lateral
              if (togCheckbox) togCheckbox.checked = false;
            }
          }
        });
      });
    }

    setupNavCutEffects();

    // Re-bind si se agregan dinámicamente nuevos links
    window.triggerGlobalSceneSlash = triggerGlobalSceneSlash;

    // ============================================================
    // 2. CONTROLADOR DE PESTAÑAS DE ESCENAS (KILL LA KILL / JOJO)
    // ============================================================
    const sceneButtons = document.querySelectorAll(".scene-cut-btn");
    const scenePanels = document.querySelectorAll(".scene-panel");

    sceneButtons.forEach(btn => {
      btn.addEventListener("click", () => {
        const targetId = btn.dataset.target;
        if (!targetId) return;

        triggerGlobalSceneSlash();

        sceneButtons.forEach(b => {
          b.classList.remove("is-active");
          b.setAttribute("aria-selected", "false");
        });
        btn.classList.add("is-active");
        btn.setAttribute("aria-selected", "true");

        setTimeout(() => {
          scenePanels.forEach(panel => {
            if (panel.id === targetId) {
              panel.classList.add("is-active");
              panel.removeAttribute("hidden");
            } else {
              panel.classList.remove("is-active");
              panel.setAttribute("hidden", "true");
            }
          });
        }, 80);
      });
    });

    // ============================================================
    // 3. INTERACTIVIDAD EN TARJETAS DE PERSONAJES KILL LA KILL
    // ============================================================
    const klkCharCards = document.querySelectorAll(".klk-char-card");
    klkCharCards.forEach(card => {
      card.addEventListener("click", () => {
        klkCharCards.forEach(c => c.classList.remove("is-selected"));
        card.classList.add("is-selected");
        triggerGlobalSceneSlash();
      });
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start);
  } else {
    start();
  }
})();
