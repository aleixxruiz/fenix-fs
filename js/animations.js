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

  function revealBlocks() {
    const targets = [
      ".section-head", ".timeline-item", ".card", ".member", ".sponsors-block", ".sponsor-cta",
      ".match", ".fcf-table-wrap", ".stat-tiles", ".scorer", ".ig-widget", ".contact-text", ".contact-form"
    ];
    document.querySelectorAll(targets.join(",")).forEach(el => {
      if (el.dataset.animated) return;
      el.dataset.animated = "1";
      gsap.fromTo(el, { autoAlpha: 0, y: 32 }, {
        autoAlpha: 1, y: 0, duration: 0.9, ease: "power3.out",
        scrollTrigger: { trigger: el, start: "top 88%", once: true }
      });
    });
  }

  function hero() {
    const crest = document.querySelector(".hero-crest img");
    const title = document.querySelector(".hero-text-block");
    if (crest) gsap.to(crest, { yPercent: 22, ease: "none", scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true } });
    if (title) gsap.to(title, { yPercent: 12, autoAlpha: 0.15, ease: "none", scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true } });
    const stats = document.querySelectorAll(".hero-stats .stat");
    if (stats.length) gsap.from(stats, { y: 30, autoAlpha: 0, duration: 0.8, stagger: 0.12, ease: "power3.out", delay: 0.3 });
    const items = document.querySelectorAll(".hero-kicker, .hero-title, .hero-text, .hero-actions");
    if (items.length) gsap.from(items, { y: 26, autoAlpha: 0, duration: 0.9, stagger: 0.1, ease: "power3.out" });
    if (crest) gsap.from(crest, { scale: 0.85, autoAlpha: 0, duration: 1.1, ease: "power3.out", delay: 0.15 });
  }

  function init() {
    /* Neutralizar el sistema anterior de "reveal" para que no compita con GSAP */
    document.querySelectorAll(".reveal").forEach(el => el.classList.add("in"));
    hero();
    parallaxImages();
    revealBlocks();
    ScrollTrigger.refresh();
  }

  /* El contenido lo pinta main.js al cargar; algunos bloques (FCF, estadísticas) llegan después. */
  if (document.readyState === "complete") init(); else window.addEventListener("load", init);
  window.addEventListener("fcf:loaded", () => { parallaxImages(); revealBlocks(); ScrollTrigger.refresh(); });
  window.addEventListener("resize", () => ScrollTrigger.refresh());
})();
