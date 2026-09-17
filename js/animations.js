/* =====================================================================
   Fénix FS · Animaciones de scroll (GSAP + ScrollTrigger)
   ---------------------------------------------------------------------
   - Imágenes con parallax: se expanden suavemente mientras entran en pantalla.
   - Bloques que aparecen con un fundido al hacer scroll.
   - Escudo del hero con un ligero desplazamiento.
   Todo se desactiva si el visitante tiene "reducir movimiento" activado.
   Se ejecuta después de que main.js haya pintado el contenido dinámico.
   ===================================================================== */
(function () {
  "use strict";
  if (!window.gsap || !window.ScrollTrigger) return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  gsap.registerPlugin(ScrollTrigger);

  /* Contenedores de imagen que reciben el efecto de expansión */
  const MEDIA = [
    ".team-media", ".kit-media", ".timeline-media", ".news-media", ".product-media", ".scorer-media"
  ];

  function parallaxImages() {
    document.querySelectorAll(MEDIA.join(",")).forEach(box => {
      const imgs = box.querySelectorAll("img");
      if (!imgs.length) return;
      /* Escala de 1.18 a 1 y un desplazamiento vertical mientras el bloque recorre la pantalla */
      gsap.fromTo(imgs, { scale: 1.18, yPercent: -6 }, {
        scale: 1, yPercent: 6, ease: "none",
        scrollTrigger: { trigger: box, start: "top bottom", end: "bottom top", scrub: 0.6 }
      });
    });
  }

  const revealTweens = [];
  function revealBlocks() {
    /* El bloque de contacto queda fuera: debe verse al instante al saltar desde el menú */
    const targets = [
      ".section-head", ".timeline-item", ".card", ".member", ".sponsors-block", ".sponsor-cta",
      ".match", ".fcf-table-wrap", ".stat-tiles", ".scorer", ".ig-widget"
    ];
    document.querySelectorAll(targets.join(",")).forEach(el => {
      if (el.dataset.animated || el.closest("#contacto")) return;
      el.dataset.animated = "1";
      const tw = gsap.fromTo(el, { autoAlpha: 0, y: 24 }, {
        autoAlpha: 1, y: 0, duration: 0.55, ease: "power3.out",
        scrollTrigger: { trigger: el, start: "top 92%", once: true }
      });
      revealTweens.push(tw);
    });
  }

  /* Al saltar por un enlace interno (menú, botones), mostrar al instante lo que ya está en pantalla */
  function showVisibleNow() {
    /* Sin ScrollTrigger.refresh() aquí: restauraría la posición de scroll y cancelaría el salto al ancla */
    const vh = window.innerHeight;
    revealTweens.forEach(tw => {
      const el = tw.targets()[0];
      const r = el.getBoundingClientRect();
      if (r.top < vh * 1.1 && r.bottom > -vh * 0.2) tw.progress(1);
    });
  }
  document.addEventListener("click", (ev) => {
    const a = ev.target.closest('a[href^="#"]');
    if (!a) return;
    setTimeout(showVisibleNow, 50);
    setTimeout(showVisibleNow, 450);
    setTimeout(showVisibleNow, 900);
  });
  window.addEventListener("hashchange", () => { setTimeout(showVisibleNow, 50); setTimeout(showVisibleNow, 500); });

  function hero() {
    const crest = document.querySelector(".hero-crest img");
    const title = document.querySelector(".hero-text-block");
    if (crest) gsap.to(crest, { yPercent: 22, ease: "none", scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true } });
    if (title) gsap.to(title, { yPercent: 12, autoAlpha: 0.15, ease: "none", scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true } });
    const stats = document.querySelectorAll(".hero-stats .stat");
    if (stats.length) gsap.from(stats, { y: 24, autoAlpha: 0, duration: 0.5, stagger: 0.07, ease: "power3.out", delay: 0.15 });
    const items = document.querySelectorAll(".hero-kicker, .hero-title, .hero-text, .hero-actions");
    if (items.length) gsap.from(items, { y: 20, autoAlpha: 0, duration: 0.55, stagger: 0.06, ease: "power3.out" });
    if (crest) gsap.from(crest, { scale: 0.9, autoAlpha: 0, duration: 0.7, ease: "power3.out", delay: 0.1 });
  }

  function init() {
    /* Neutralizar el sistema anterior de "reveal" para que no compita con GSAP */
    document.querySelectorAll(".reveal").forEach(el => el.classList.add("in"));
    hero();
    parallaxImages();
    revealBlocks();
    ScrollTrigger.refresh();
    /* Si la página se abre ya con un #ancla (enlace compartido), mostrar esa zona de inmediato */
    if (location.hash) setTimeout(showVisibleNow, 100);
  }

  /* El contenido lo pinta main.js al cargar; algunos bloques (FCF, estadísticas) llegan después. */
  if (document.readyState === "complete") init(); else window.addEventListener("load", init);
  window.addEventListener("fcf:loaded", () => { parallaxImages(); revealBlocks(); ScrollTrigger.refresh(); });
  window.addEventListener("resize", () => ScrollTrigger.refresh());
})();
