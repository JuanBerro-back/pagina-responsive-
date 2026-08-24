(function themeSwitcher() {
  const buttons = document.querySelectorAll("[data-theme-choice]");
  const fileInput = document.getElementById("frierenImage");
  const preview = document.getElementById("frierenPreview");
  const previewImage = document.getElementById("frierenPreviewImage");
  const fx = document.getElementById("globalKanjiFx");

  const content = {
    kill: {
      pageTitle: "Kill la Kill · Battle Archive",
      heroEyebrow: "Academia Honnouji · Distrito de la élite",
      heroTitle: "KILL LA <em>KILL</em>",
      heroSub: "Ryuko Matoi llega con una tijera escarlata para cortar las mentiras, desafiar a la élite y recuperar la verdad sobre su padre.",
      bioEyebrow: "La rebelión",
      bioTitle: "Ryuko Matoi no se arrodilla",
      bio: [
        "Ryuko llega a la Academia Honnouji con una mitad de la Tijera Escarlata y una sola pregunta: quién mató a su padre.",
        "Su encuentro con Senketsu despierta un poder que no depende de la jerarquía. Juntos desafían a Satsuki, al Consejo Estudiantil y al imperio textil de Revocs.",
        "Kill la Kill convierte la ropa en armadura, identidad y campo de batalla. Cada transformación es una elección: vestir el poder sin dejar que el poder te vista."
      ],
      animeTitle: "KILL LA KILL <span class=\"anime-vs\">×</span> FIBRAS VIVAS",
      animeSubtitle: "Explora las escenas, personajes y poderes que hacen de la rebelión textil una batalla inolvidable.",
      navigation: ["Academia Honnouji", "La rebelión", "Línea de batalla", "Uniformes Goku", "Selector de universos", "Fibras vivas", "Camino de combate"],
      curtain: ["Distrito de la élite", "Academia Honnouji", "Aquí la ropa decide el rango y la rebeldía se paga caro.", "Fibras vivas", "Una batalla de tijeras, uniformes y voluntad contra el sistema que viste al mundo.", "Combate final", "La tijera escarlata", "Romper las fibras vivas exige elegir tu propio camino."],
      timelineTitle: "Línea de batalla",
      cardsTitle: "Armas y uniformes",
      quote: "«No nos vestimos para encajar. Nos vestimos para ser nosotros mismos.»",
      gameTitle: "Camino de combate 3D",
      gameIntro: "Ayuda a Ryuko a cruzar la academia esquivando vehículos. Usa las flechas del teclado (o WASD) y los controles en pantalla.",
      guide: ["Rebelión", "Batalla", "Uniformes", "JoJo's", "Fibras vivas", "Juego 3D"],
      drawerQuote: "«No pierdas tu camino.»",
      bannerName: "ACADEMIA HONNOUJI · TOKYO · 2013",
      bannerTitle: "Kill la Kill",
      guideBrand: "TRIGGER",
      guideTitle: "Guía de combate",
      stats: [[24, "episodios de acción"], [4, "estrellas Goku"], [1, "tijera escarlata"]],
      sceneButtons: ["Kill la Kill (Ryuko y Fibras Vivas)", "Steel Ball Run (Johnny y Gyro)", "DIO Overdrive (The World)"],
      scenePrimary: ["Fibras Vivas · Kamui Senketsu · Tijera Rending", "Kill la Kill: La Rebelión Textil de la Tijera Escarlata", "Una batalla de tijeras, uniformes y voluntad contra el sistema que viste al mundo."]
    },
    jojo: {
      pageTitle: "JoJo's Bizarre Adventure · Battle Archive",
      heroEyebrow: "Egipto · 1988 · El destino se acerca",
      heroTitle: "JOJO'S <em>BIZARRE</em> ADVENTURE",
      heroSub: "Jotaro Kujo y sus aliados cruzan el mundo para detener a DIO. El tiempo, la voluntad y los Stands chocan en una batalla imposible.",
      bioEyebrow: "La amenaza",
      bioTitle: "DIO se levanta sobre el destino",
      bio: [
        "DIO domina The World, un Stand capaz de detener el tiempo durante los segundos que separan la vida de la derrota.",
        "Jotaro responde con Star Platinum: precisión absoluta, sangre fría y una voluntad que no acepta inclinarse ante ningún vampiro.",
        "En JoJo's, cada combate es una partida de ingenio. El poder importa, pero leer al rival y resistir el destino importa más."
      ],
      animeTitle: "JOJO'S <span class=\"anime-vs\">×</span> THE WORLD",
      animeSubtitle: "Cambia de universo y entra en una batalla de Stands, destino y segundos robados al tiempo.",
      navigation: ["Mansión Joestar", "El destino", "Línea de sangre", "Stands", "Selector de universos", "The World", "Batalla de Stands"],
      curtain: ["Mansión Joestar", "La familia Joestar", "Una línea de sangre perseguida por un destino que nunca se queda quieto.", "El Cairo · Noche", "Jotaro se enfrenta a DIO cuando cada segundo puede ser el último.", "Combate de Stands", "KONO DIO DA!", "The World detiene el tiempo. Star Platinum responde con precisión."],
      timelineTitle: "Línea de sangre",
      cardsTitle: "Stands y combatientes",
      quote: "«Yare yare daze.»",
      gameTitle: "Batalla de Stands 3D",
      gameIntro: "Ayuda a Jotaro a cruzar las calles de El Cairo esquivando vehículos. Usa las flechas del teclado (o WASD) y los controles en pantalla.",
      guide: ["El destino", "Sangre Joestar", "Stands", "JoJo's", "The World", "Juego 3D"],
      drawerQuote: "«Yare yare daze.»",
      bannerName: "EL CAIRO · EGIPTO · 1988",
      bannerTitle: "JoJo's Bizarre Adventure",
      guideBrand: "STARDUST CRUSADERS",
      guideTitle: "Guía de Stands",
      stats: [[3, "segundos detenidos"], [2, "Stands enfrentados"], [1, "destino Joestar"]],
      sceneButtons: ["Kill la Kill (Ryuko y Fibras Vivas)", "Steel Ball Run (Johnny y Gyro)", "DIO Overdrive (The World)"],
      scenePrimary: ["Stand: Star Platinum · The World", "Jotaro Kujo: La voluntad que atraviesa el tiempo", "DIO desafía a los Joestar con The World, un Stand capaz de congelar el tiempo y convertir cada segundo en una amenaza."]
    },
    frieren: {
      pageTitle: "Frieren · Beyond Journey's End",
      heroEyebrow: "Continente · Después del viaje · Magia antigua",
      heroTitle: "FRIEREN <em>BEYOND JOURNEY'S END</em>",
      heroSub: "La maga elfa continúa viajando después de derrotar al Rey Demonio, aprendiendo que una vida larga también está hecha de pequeños encuentros.",
      bioEyebrow: "La viajera",
      bioTitle: "La magia de recordar",
      bio: [
        "Frieren es una elfa maga que ha vivido más de mil años. Para ella, diez años de aventura parecen un instante, pero la memoria de sus compañeros cambia su forma de mirar el mundo.",
        "Acompañada por Fern y Stark, recorre caminos, ruinas y pueblos en busca de hechizos mientras aprende a valorar los momentos que antes dejó pasar.",
        "Su magia no busca espectáculo: observa, espera y comprende. En este universo, una brisa, una flor y una conversación pueden contener más poder que una batalla."
      ],
      animeTitle: "FRIEREN <span class=\"anime-vs\">×</span> JOURNEY",
      animeSubtitle: "Un archivo de hechizos, recuerdos y caminos que continúan mucho después del final de la gran aventura.",
      navigation: ["El camino", "La viajera", "Después del viaje", "Hechizos", "Selector de universos", "Memorias", "Camino mágico"],
      curtain: ["Bosque del norte", "El camino continúa", "El mundo cambia despacio cuando tienes siglos para observarlo.", "Magia y memoria", "Una aventura silenciosa entre hierba, viento y hechizos olvidados.", "Ruinas antiguas", "El hechizo perdido", "A veces la magia más valiosa es la que guarda un recuerdo."],
      timelineTitle: "Después del viaje",
      cardsTitle: "Magias y compañeros",
      quote: "«Qué pérdida de tiempo tan bonita.»",
      gameTitle: "Camino mágico 3D",
      gameIntro: "Ayuda a Frieren a cruzar el bosque esquivando obstáculos. Usa las flechas del teclado (o WASD) y los controles en pantalla.",
      guide: ["El camino", "Memorias", "Hechizos", "Frieren", "Después del viaje", "Juego 3D"],
      drawerQuote: "«Los recuerdos hacen que el tiempo tenga sentido.»",
      bannerName: "CONTINENTE · DESPUÉS DEL VIAJE",
      bannerTitle: "Frieren",
      guideBrand: "MAGIA ANTIGUA",
      guideTitle: "Cuaderno de viaje",
      stats: [[1000, "años de memoria"], [3, "compañeros de viaje"], [1, "hechizo perdido"]],
      sceneButtons: ["Frieren (La maga elfa)", "Fern (La aprendiz)", "Stark (El guerrero)"],
      scenePrimary: ["Magia antigua · Hechizos · Memoria", "Frieren: La maga que continúa el viaje", "Frieren viaja entre bosques y ruinas buscando hechizos, mientras aprende que cada encuentro deja una huella.",],
      gameMode: "frieren"
    }
  };

  function setText(selector, value) {
    const element = document.querySelector(selector);
    if (element) element.innerHTML = value;
  }

  function setMany(selector, values) {
    if (!values) return;
    document.querySelectorAll(selector).forEach((element, index) => {
      if (values[index] !== undefined) element.innerHTML = values[index];
    });
  }

  function applyTheme(theme, announce) {
    const selected = content[theme];
    document.title = selected.pageTitle;
    document.body.classList.toggle("theme-jojo", theme === "jojo");
    document.body.classList.toggle("theme-frieren", theme === "frieren");
    buttons.forEach((button) => {
      const active = button.dataset.themeChoice === theme;
      button.classList.toggle("is-active", active);
      button.setAttribute("aria-pressed", String(active));
    });

    setText(".hero .eyebrow", selected.heroEyebrow);
    setText("#bannerName", `${selected.bannerName}<b>${selected.bannerTitle}</b>`);
    setText("#guideBrand", selected.guideBrand);
    setText("#guideTitle", selected.guideTitle);
    setText(".hero-title", selected.heroTitle);
    setText(".hero-sub", selected.heroSub);
    setText("#bioEyebrow", selected.bioEyebrow);
    setText("#bioTitle", selected.bioTitle);
    selected.bio.forEach((text, index) => setText(`#bioText${index === 0 ? "One" : index === 1 ? "Two" : "Three"}`, text));
    setText("#animeTitle", selected.animeTitle);
    setText("#animeSubtitle", selected.animeSubtitle);
    setMany(".btu-drawer-list .drawer-text", selected.navigation);
    setMany(".scene-btn-title", selected.sceneButtons);
    document.querySelectorAll(".scene-cut-btn").forEach((button, index) => {
      button.hidden = theme === "jojo" ? index !== 2 : index !== 0;
    });
    setText("#sceneKillLaKill .scene-pill", selected.scenePrimary[0]);
    setText("#sceneKillLaKill .scene-heading", selected.scenePrimary[1]);
    setText("#sceneKillLaKill .scene-lead", selected.scenePrimary[2]);
    setMany(".btu-guidebook-links a", selected.guide);
    setText(".btu-drawer-quote", selected.drawerQuote);
    setMany(".curtain-pane .pane-tag, .curtain-pane .pane-title, .curtain-pane .pane-desc", [selected.curtain[0], selected.curtain[1], selected.curtain[2], selected.curtain[5], selected.curtain[6], selected.curtain[7]]);
    setText(".curtain-middle .eyebrow", selected.curtain[3]);
    setText(".curtain-quote", selected.curtain[4]);
    setText("#linea-tiempo h2", selected.timelineTitle);
    setText("#obras h2", selected.cardsTitle);
    setText(".big-quote p", selected.quote);
    setText("#camino-combate h2", selected.gameTitle);
    setText("#camino-combate .section-intro", selected.gameIntro);
    setText("#camino-combate .score-label", theme === "jojo" ? "Stand Power:" : theme === "frieren" ? "Mana:" : "Puntaje:");
    selected.stats.forEach(([number, label], index) => {
      const statNumber = document.querySelector(`#stat${["One", "Two", "Three"][index]}`);
      if (statNumber) { statNumber.dataset.count = number; statNumber.textContent = number; }
      setText(`#statLabel${["One", "Two", "Three"][index]}`, label);
    });
    setText("#bannerLyric", selected.drawerQuote);
    setText("#camino-combate .crossy-result-card h3", theme === "jojo" ? "¡ORA ORA ORA!" : "¡Alto en el camino!");
    const crossyGame = document.getElementById("crossyGameWrap");
    const jojoGame = document.getElementById("jojoGameWrap");
    const frierenGame = document.getElementById("frierenGameWrap");
    if (crossyGame && jojoGame && frierenGame) {
      crossyGame.hidden = theme !== "kill";
      jojoGame.hidden = theme !== "jojo";
      frierenGame.hidden = theme !== "frieren";
    }
    window.dispatchEvent(new CustomEvent("battle-theme-change", { detail: { theme } }));
    if (theme === "jojo") document.querySelector('[data-target="sceneDioOverdrive"]')?.click();
    else document.querySelector('[data-target="sceneKillLaKill"]')?.click();

    if (theme === "jojo" && announce) {
      fx.innerHTML = "<strong>KONO DIO DA!</strong><span>THE WORLD</span>";
      fx.classList.remove("is-active");
      void fx.offsetWidth;
      fx.classList.add("is-active");
    } else if (theme === "frieren" && announce) {
      fx.innerHTML = "<strong>SEMPITERNAL</strong><span>EL VIAJE CONTINÚA</span>";
      fx.classList.remove("is-active");
      void fx.offsetWidth;
      fx.classList.add("is-active");
    }
  }

  buttons.forEach((button) => button.addEventListener("click", () => applyTheme(button.dataset.themeChoice, true)));

  fileInput?.addEventListener("change", () => {
    const [file] = fileInput.files;
    if (!file || !file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.addEventListener("load", () => {
      previewImage.src = reader.result;
      preview.hidden = false;
      document.body.classList.add("has-dio-image");
    });
    reader.readAsDataURL(file);
  });

  applyTheme("kill", false);
})();
