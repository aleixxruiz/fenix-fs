/* =====================================================================
   Fénix FS · Lógica de la web
   Lee los datos de js/data.js y pinta cada sección.
   ===================================================================== */
(function () {
  "use strict";

  const $ = (sel, ctx) => (ctx || document).querySelector(sel);
  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  }[c]));
  const initials = (name) => name.split(/\s+/).filter(Boolean).slice(0, 2).map(w => w[0].toUpperCase()).join("");

  /* ---------- Menú móvil ---------- */
  const toggle = $(".nav-toggle");
  const nav = $("#main-nav");
  if (toggle && nav) {
    toggle.addEventListener("click", () => {
      const open = nav.classList.toggle("open");
      toggle.setAttribute("aria-expanded", String(open));
      document.body.classList.toggle("nav-open", open);
    });
    nav.querySelectorAll("a").forEach(a => a.addEventListener("click", () => {
      nav.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
      document.body.classList.remove("nav-open");
    }));
  }

  /* ---------- Cabecera compacta al hacer scroll ---------- */
  const header = $(".site-header");
  const onScroll = () => header && header.classList.toggle("scrolled", window.scrollY > 40);
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- Cifras ---------- */
  const statsEl = $("#hero-stats");
  if (statsEl && CLUB.stats) {
    statsEl.innerHTML = CLUB.stats.map(s => `
      <div class="stat">
        <span class="stat-value">${esc(s.value)}</span>
        <span class="stat-label">${esc(s.label)}</span>
      </div>`).join("");
  }

  /* ---------- Historia ---------- */
  const introEl = $("#historia-intro");
  if (introEl) introEl.textContent = CLUB.historiaIntro || "";

  const tlEl = $("#timeline");
  if (tlEl && CLUB.historia) {
    tlEl.innerHTML = CLUB.historia.map(h => `
      <li class="timeline-item ${h.highlight ? "is-highlight" : ""} ${h.image ? "has-image" : ""} reveal">
        <span class="timeline-year">${esc(h.year)}</span>
        <div class="timeline-body">
          <h3>${esc(h.title)}</h3>
          <p>${esc(h.text)}</p>
        </div>
        ${h.image ? `<figure class="timeline-media"><img src="${esc(h.image)}" alt="${esc(h.title)}" loading="lazy" onerror="this.closest('.timeline-item').classList.remove('has-image');this.parentNode.remove()"></figure>` : ""}
      </li>`).join("");
  }

  /* ---------- Equipos ---------- */
  const teamsEl = $("#teams");
  if (teamsEl && CLUB.equipos) {
    const staffList = (s) => {
      if (!s) return "";
      if (typeof s === "string") return `<p class="card-meta">${esc(s)}</p>`;
      if (!s.length) return "";
      return `<ul class="team-staff">${s.map(p => `<li><span>${esc(p.role)}</span>${esc(p.name)}</li>`).join("")}</ul>`;
    };
    const teamMedia = (t) => {
      const imgs = (t.images && t.images.length) ? t.images : (t.image ? [t.image] : []);
      if (imgs.length <= 1) {
        return imgs.length ? `<img src="${esc(imgs[0])}" alt="${esc(t.name)}" loading="lazy" onerror="this.remove()">` : "";
      }
      return `
        <div class="team-gallery" data-index="0">
          ${imgs.map((src, i) => `<img src="${esc(src)}" alt="${esc(t.name)} · foto ${i + 1}" loading="lazy" class="${i === 0 ? "active" : ""}" onerror="this.remove()">`).join("")}
          <button type="button" class="gal-btn gal-prev" aria-label="Foto anterior">&#8249;</button>
          <button type="button" class="gal-btn gal-next" aria-label="Foto siguiente">&#8250;</button>
          <div class="gal-dots">${imgs.map((_, i) => `<span class="${i === 0 ? "active" : ""}"></span>`).join("")}</div>
        </div>`;
    };
    teamsEl.innerHTML = CLUB.equipos.map((t, idx) => `
      <article class="card team-card ${t.pending ? "team-pending" : ""} reveal" data-team="${idx}" tabindex="0" role="button" aria-label="Ver plantilla de ${esc(t.name)}">
        <div class="team-media">
          ${teamMedia(t)}
          <span class="team-badge">${t.pending ? "En preparación" : esc(t.tagline || "")}</span>
        </div>
        <div class="card-body">
          <p class="card-kicker">${esc(t.category)}</p>
          <h3>${esc(t.name)}</h3>
          <p>${esc(t.description)}</p>
          ${staffList(t.staff)}
          ${t.pending ? `<p class="card-meta">Pendiente de confirmación. ¿Quieres formar parte? <a href="#contacto">Escríbenos</a>.</p>` : ""}
          <span class="team-open">Ver plantilla <i>&#8250;</i></span>
        </div>
      </article>`).join("");
  }

  /* ---------- Ventana emergente compartida (equipos y noticias) ---------- */
  const modal = $("#team-modal");
  const openModal = ({ kicker = "", title = "", tagline = "", body = "", mode = "" }) => {
    if (!modal) return;
    $("#modal-category").textContent = kicker;
    $("#modal-title").textContent = title;
    $("#modal-tagline").textContent = tagline;
    $("#modal-body").innerHTML = body;
    modal.querySelector(".modal-panel").className = "modal-panel" + (mode ? " modal-" + mode : "");
    modal.hidden = false;
    document.body.classList.add("modal-open");
    modal.querySelector(".modal-panel").scrollTop = 0;
    modal.querySelector(".modal-close").focus();
  };
  const closeModal = () => {
    if (!modal) return;
    modal.hidden = true;
    document.body.classList.remove("modal-open");
  };
  if (modal) {
    modal.addEventListener("click", (ev) => { if (ev.target.closest("[data-close]")) closeModal(); });
    document.addEventListener("keydown", (ev) => { if (ev.key === "Escape" && !modal.hidden) closeModal(); });
  }

  /* ---------- Pop-up de plantilla ---------- */
  if (modal && teamsEl) {
    const POSITIONS = ["Portero", "Cierre", "Ala", "Pívot"];
    const normPos = (p) => {
      const s = String(p || "").toLowerCase().replace(/í/g, "i");
      if (s.startsWith("por")) return "Portero";
      if (s.startsWith("cie")) return "Cierre";
      if (s.startsWith("ala")) return "Ala";
      if (s.startsWith("piv")) return "Pívot";
      return "Otros";
    };
    const playerCard = (p, teamIdx, playerIdx) => `
      <li class="player" data-player="${teamIdx}:${playerIdx}" tabindex="0" role="button" aria-label="Ficha de ${esc(p.name)}">
        <div class="player-photo" data-initials="${esc(initials(p.name))}">
          ${p.photo ? `<img src="${esc(p.photo)}" alt="${esc(p.name)}" loading="lazy" onerror="this.remove()">` : ""}
          ${p.number ? `<span class="player-number">${esc(p.number)}</span>` : ""}
        </div>
        <span class="player-name">${esc(p.name)}</span>
        ${p.number ? `<span class="player-dorsal">Dorsal ${esc(p.number)}</span>` : ""}
      </li>`;

    /* Ficha individual del jugador */
    const normKey = (s) => String(s || "").normalize("NFD").replace(/[̀-ͯ]/g, "").toUpperCase().replace(/\s+/g, " ").trim();
    const openPlayer = (teamIdx, playerIdx) => {
      const t = CLUB.equipos[teamIdx]; const p = t && (t.plantilla || [])[playerIdx];
      if (!p) return;
      const st = ((window.PLAYER_STATS || {})[t.name] || {})[normKey(p.name)] || { goles: 0, amarillas: 0, rojas: 0 };
      const pos = normPos(p.position);
      const facts = [
        p.edad ? ["Edad", p.edad] : null,
        p.altura ? ["Altura", p.altura] : null,
        p.pie ? ["Pie", p.pie] : null,
        p.desde ? ["En el club desde", p.desde] : null,
        p.procedencia ? ["Procedencia", p.procedencia] : null
      ].filter(Boolean);
      const body = `
        <div class="pcard">
          <div class="pcard-media" data-initials="${esc(initials(p.name))}">
            ${p.photo ? `<img src="${esc(p.photo)}" alt="${esc(p.name)}" onerror="this.remove()">` : ""}
            ${p.number ? `<span class="pcard-number">${esc(p.number)}</span>` : ""}
          </div>
          <div class="pcard-info">
            <div class="pcard-stats">
              <div class="pcard-stat"><strong>${st.goles || 0}</strong><span>Goles</span></div>
              <div class="pcard-stat"><strong>${st.amarillas || 0}</strong><span><i class="card-y"></i>Amarillas</span></div>
              <div class="pcard-stat"><strong>${st.rojas || 0}</strong><span><i class="card-r"></i>Rojas</span></div>
            </div>
            ${facts.length ? `<dl class="pcard-facts">${facts.map(f => `<div><dt>${esc(f[0])}</dt><dd>${esc(f[1])}</dd></div>`).join("")}</dl>` : ""}
            ${p.bio ? `<p class="pcard-bio">${esc(p.bio)}</p>` : ""}
            ${p.instagram ? `<a class="btn btn-outline btn-small" href="https://www.instagram.com/${esc(String(p.instagram).replace(/^@/, ""))}/" target="_blank" rel="noopener">@${esc(String(p.instagram).replace(/^@/, ""))}</a>` : ""}
            <p class="pcard-back"><a href="#" data-back-team="${teamIdx}">&#8249; Volver a la plantilla del ${esc(t.name)}</a></p>
          </div>
        </div>`;
      openModal({ kicker: `${esc(t.name)} · ${pos}`, title: p.name, tagline: p.number ? `Dorsal ${p.number}` : "", body, mode: "player" });
    };
    const openTeam = (idx) => {
      const t = CLUB.equipos[idx];
      if (!t) return;
      const groups = {};
      (t.plantilla || []).forEach((p, pi) => { const k = normPos(p.position); (groups[k] = groups[k] || []).push({ p, pi }); });
      const order = POSITIONS.concat(Object.keys(groups).filter(k => !POSITIONS.includes(k)));
      let html = "";
      if (t.staff && t.staff.length) {
        html += `<div class="modal-staff-cards">${t.staff.map((s, si) => `
          <div class="staffcard" data-staff="${idx}:${si}" tabindex="0" role="button" aria-label="Ficha de ${esc(s.name)}">
            <div class="staffcard-photo" data-initials="${esc(initials(s.name))}">${s.photo ? `<img src="${esc(s.photo)}" alt="${esc(s.name)}" loading="lazy" onerror="this.remove()">` : ""}</div>
            <div class="staffcard-info"><em>${esc(s.role)}</em><strong>${esc(s.name)}</strong></div>
          </div>`).join("")}</div>`;
      }
      const sections = order.filter(k => groups[k] && groups[k].length);
      if (sections.length) {
        html += sections.map(k => `
          <section class="position-group">
            <h3 class="position-title">${esc(k)}${k === "Otros" ? "" : "s"}<span>${groups[k].length}</span></h3>
            <ul class="players">${groups[k].map(x => playerCard(x.p, idx, x.pi)).join("")}</ul>
          </section>`).join("");
      } else {
        html += `<p class="modal-empty">${t.pending ? "Plantilla en construcción. ¿Quieres formar parte del equipo?" : "Plantilla pendiente de publicar."} <a href="#contacto" data-close>Escríbenos</a>.</p>`;
      }
      openModal({ kicker: t.category || "", title: t.name || "", tagline: t.tagline || "", body: html, mode: "team" });
    };
    teamsEl.addEventListener("click", (ev) => {
      if (ev.target.closest(".gal-btn, .gal-dots, a")) return;
      const card = ev.target.closest("[data-team]");
      if (card) openTeam(+card.dataset.team);
    });
    teamsEl.addEventListener("keydown", (ev) => {
      if (ev.key !== "Enter" && ev.key !== " ") return;
      const card = ev.target.closest("[data-team]");
      if (card && ev.target === card) { ev.preventDefault(); openTeam(+card.dataset.team); }
    });
    /* Dentro del pop-up: abrir ficha de jugador y volver a la plantilla */
    /* Ficha del cuerpo técnico: enfocada al equipo (balance de temporada) y a la trayectoria */
    const openStaff = (teamIdx, staffIdx) => {
      const t = CLUB.equipos[teamIdx]; const s = t && (t.staff || [])[staffIdx];
      if (!s) return;
      const bal = (window.TEAM_BAL || {})[t.name];
      const facts = [
        s.desde ? ["En el club desde", s.desde] : null,
        s.titulacion ? ["Titulación", s.titulacion] : null,
        s.anteriores ? ["Clubes anteriores", s.anteriores] : null,
        s.jugador ? ["Como jugador", s.jugador] : null
      ].filter(Boolean);
      const body = `
        <div class="pcard pcard-staff">
          <div class="pcard-media" data-initials="${esc(initials(s.name))}">
            ${s.photo ? `<img src="${esc(s.photo)}" alt="${esc(s.name)}" onerror="this.remove()">` : ""}
          </div>
          <div class="pcard-info">
            <p class="pcard-role-note">Balance del ${esc(t.name)} esta temporada</p>
            <div class="pcard-stats pcard-stats-4">
              <div class="pcard-stat"><strong>${bal ? bal.pj : "–"}</strong><span>Partidos</span></div>
              <div class="pcard-stat stat-win"><strong>${bal ? bal.g : "–"}</strong><span>Victorias</span></div>
              <div class="pcard-stat stat-draw"><strong>${bal ? bal.e : "–"}</strong><span>Empates</span></div>
              <div class="pcard-stat stat-loss"><strong>${bal ? bal.p : "–"}</strong><span>Derrotas</span></div>
            </div>
            ${facts.length ? `<dl class="pcard-facts">${facts.map(f => `<div><dt>${esc(f[0])}</dt><dd>${esc(f[1])}</dd></div>`).join("")}</dl>` : ""}
            ${s.filosofia ? `<blockquote class="pcard-quote">“${esc(s.filosofia)}”</blockquote>` : ""}
            ${s.bio ? `<p class="pcard-bio">${esc(s.bio)}</p>` : ""}
            ${s.instagram ? `<a class="btn btn-outline btn-small" href="https://www.instagram.com/${esc(String(s.instagram).replace(/^@/, ""))}/" target="_blank" rel="noopener">@${esc(String(s.instagram).replace(/^@/, ""))}</a>` : ""}
            <p class="pcard-back"><a href="#" data-back-team="${teamIdx}">&#8249; Volver a la plantilla del ${esc(t.name)}</a></p>
          </div>
        </div>`;
      openModal({ kicker: `${esc(t.name)} · Cuerpo técnico`, title: s.name, tagline: s.role || "", body, mode: "player" });
    };
    modal.addEventListener("click", (ev) => {
      const back = ev.target.closest("[data-back-team]");
      if (back) { ev.preventDefault(); openTeam(+back.dataset.backTeam); return; }
      const st = ev.target.closest("[data-staff]");
      if (st) { const [ti, si] = st.dataset.staff.split(":").map(Number); openStaff(ti, si); return; }
      const pl = ev.target.closest("[data-player]");
      if (pl) { const [ti, pi] = pl.dataset.player.split(":").map(Number); openPlayer(ti, pi); }
    });
    modal.addEventListener("keydown", (ev) => {
      if (ev.key !== "Enter" && ev.key !== " ") return;
      const st = ev.target.closest("[data-staff]");
      if (st && ev.target === st) { ev.preventDefault(); const [ti, si] = st.dataset.staff.split(":").map(Number); openStaff(ti, si); return; }
      const pl = ev.target.closest("[data-player]");
      if (pl && ev.target === pl) { ev.preventDefault(); const [ti, pi] = pl.dataset.player.split(":").map(Number); openPlayer(ti, pi); }
    });
  }

  /* Galerías de equipo: flechas y puntos */
  document.querySelectorAll(".team-gallery").forEach(gal => {
    const imgs = () => Array.from(gal.querySelectorAll("img"));
    const dots = Array.from(gal.querySelectorAll(".gal-dots span"));
    const show = (i) => {
      const list = imgs();
      if (!list.length) return;
      const n = (i + list.length) % list.length;
      gal.dataset.index = n;
      list.forEach((im, k) => im.classList.toggle("active", k === n));
      dots.forEach((d, k) => d.classList.toggle("active", k === n));
    };
    gal.querySelector(".gal-prev").addEventListener("click", () => show(+gal.dataset.index - 1));
    gal.querySelector(".gal-next").addEventListener("click", () => show(+gal.dataset.index + 1));
    dots.forEach((d, k) => d.addEventListener("click", () => show(k)));
    /* Deslizar con el dedo en móvil */
    let x0 = null;
    gal.addEventListener("touchstart", e => { x0 = e.touches[0].clientX; }, { passive: true });
    gal.addEventListener("touchend", e => {
      if (x0 === null) return;
      const dx = e.changedTouches[0].clientX - x0; x0 = null;
      if (Math.abs(dx) > 40) show(+gal.dataset.index + (dx < 0 ? 1 : -1));
    });
  });

  /* ---------- Miembros ---------- */
  const membersEl = $("#members");
  if (membersEl && CLUB.miembros) {
    membersEl.innerHTML = CLUB.miembros.map(m => `
      <article class="member reveal">
        <div class="member-avatar" data-initials="${esc(initials(m.name))}">
          ${m.photo ? `<img src="${esc(m.photo)}" alt="${esc(m.name)}" loading="lazy" onerror="this.remove()">` : ""}
        </div>
        <h3>${esc(m.name)}</h3>
        <p>${esc(m.role)}</p>
      </article>`).join("");
  }

  /* ---------- Patrocinadores ---------- */
  const sponsorsEl = $("#sponsors");
  const collabEl = $("#collaborators");
  const collabTitle = $("#collaborators-title");
  if (sponsorsEl && CLUB.patrocinadores) {
    const isColor = (c) => /^#[0-9a-f]{3,8}$/i.test(c || "");
    const render = (list) => list.map(s => {
      const hasUrl = s.url && s.url !== "#";
      const tag = hasUrl ? "a" : "div";
      const attrs = hasUrl ? `href="${esc(s.url)}" target="_blank" rel="noopener"` : "";
      const tile = isColor(s.bg);
      return `
      <${tag} class="sponsor ${tile ? "sponsor-tile" : ""} reveal" ${attrs} title="${esc(s.name)}" ${tile ? `style="background:${s.bg}"` : ""}>
        <img src="${esc(s.logo)}" alt="${esc(s.name)}" loading="lazy" onerror="this.replaceWith(Object.assign(document.createElement('span'),{textContent:this.alt}))">
      </${tag}>`;
    }).join("");
    const main = CLUB.patrocinadores.filter(s => s.tier !== "colaborador");
    const collab = CLUB.patrocinadores.filter(s => s.tier === "colaborador");
    sponsorsEl.innerHTML = `<div class="sponsors-grid">${render(main)}</div>`;
    if (collabEl) {
      collabEl.innerHTML = collab.length ? `<div class="sponsors-grid sponsors-grid-collab">${render(collab)}</div>` : "";
      if (collabTitle) collabTitle.hidden = collab.length === 0;
    }
  }

  /* ---------- Partidos ---------- */
  const isFenix = (name) => /f[eé]nix/i.test(name || "");
  const fmtDate = (iso, withWeekday) => {
    const d = new Date(iso + "T00:00:00");
    if (isNaN(d)) return esc(iso);
    const opts = withWeekday
      ? { weekday: "short", day: "numeric", month: "short" }
      : { day: "numeric", month: "short", year: "numeric" };
    return d.toLocaleDateString("es-ES", opts);
  };
  const matchCard = (m) => {
    const played = !!m.resultado;
    const [gl, gv] = played ? m.resultado.split("-").map(s => s.trim()) : ["", ""];
    const fenixLocal = isFenix(m.local);
    let outcome = "";
    if (played && gl !== undefined && gv !== undefined && !isNaN(gl) && !isNaN(gv)) {
      const f = fenixLocal ? +gl : +gv, r = fenixLocal ? +gv : +gl;
      outcome = f > r ? "win" : f < r ? "loss" : "draw";
    }
    return `
      <article class="match ${played ? "match-played " + outcome : "match-next"} reveal">
        <div class="match-meta">
          <span class="match-team">${esc(m.equipo)}</span>
          <span class="match-comp">${esc(m.competicion || "")}</span>
        </div>
        <div class="match-main">
          <span class="match-side ${fenixLocal ? "is-fenix" : ""}">${esc(m.local)}</span>
          <span class="match-score">${played ? `${esc(gl)}<i>-</i>${esc(gv)}` : `<small>${esc(m.hora || "")}</small>`}</span>
          <span class="match-side ${!fenixLocal ? "is-fenix" : ""}">${esc(m.visitante)}</span>
        </div>
        <div class="match-foot">
          <span>${fmtDate(m.fecha, true)}</span>
          ${m.lugar ? `<span>${esc(m.lugar)}</span>` : ""}
        </div>
      </article>`;
  };
  const nextEl = $("#next-matches");
  const lastEl = $("#last-results");
  if (nextEl && lastEl && CLUB.partidos) {
    const byDate = (a, b) => a.fecha.localeCompare(b.fecha);
    const next = CLUB.partidos.filter(m => !m.resultado).sort(byDate).slice(0, 5);
    const last = CLUB.partidos.filter(m => m.resultado).sort(byDate).reverse().slice(0, 5);
    nextEl.innerHTML = next.length ? next.map(matchCard).join("") : `<p class="matches-empty">Calendario pendiente de publicar.</p>`;
    lastEl.innerHTML = last.length ? last.map(matchCard).join("") : `<p class="matches-empty">Aún no hay resultados esta temporada.</p>`;
  }
  /* ---------- Datos oficiales de la FCF (clasificación + partidos) ---------- */
  const fcfEl = $("#fcf");
  const fcfGroups = (CLUB.fcfGrupos || []).filter(g => g.grupId && /^\d+$/.test(g.grupId));
  if (fcfEl && (CLUB.fcfGrupos || []).length) {
    const norm = (s) => String(s || "").normalize("NFD").replace(/[̀-ͯ]/g, "").toUpperCase();
    const CLUBKEY = norm(CLUB.fcfNombreClub || "FENIX");
    const isClub = (name) => norm(name).includes(CLUBKEY);
    const LOGO = "https://files.fcf.cat/escudos/clubes/escudos/";
    const crest = (file, name) => file
      ? `<img class="fcf-crest" src="${LOGO}${esc(file)}" alt="" loading="lazy" onerror="this.replaceWith(Object.assign(document.createElement('span'),{className:'fcf-crest fcf-crest-empty'}))">`
      : `<span class="fcf-crest fcf-crest-empty"></span>`;
    const pretty = (name) => String(name || "").replace(/\s+/g, " ").trim()
      .toLowerCase().replace(/(^|\s|-|'|\.)(\S)/g, (m, p, c) => p + c.toUpperCase())
      .replace(/\b(Fs|Cfs|Fc|Ae|Ce|Ue|Cf)\b/g, s => s.toUpperCase()).replace(/\bEsp\./g, "Esp.");
    const num = (v) => parseInt(v, 10) || 0;
    const fmtDT = (iso) => {
      if (!iso || iso.startsWith("0000")) return { d: "Fecha por confirmar", t: "" };
      const d = new Date(iso.replace(" ", "T"));
      if (isNaN(d)) return { d: iso, t: "" };
      return {
        d: d.toLocaleDateString("es-ES", { weekday: "short", day: "numeric", month: "short" }),
        t: d.toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" })
      };
    };

    const renderTable = (clas) => {
      const rows = (clas && clas.data) || [];
      if (!rows.length) return `<p class="matches-empty">La FCF todavía no ha publicado la clasificación de este grupo. Aparecerá aquí en cuanto esté disponible.</p>`;
      const started = rows.some(r => num(r.played) > 0);
      const sorted = started ? rows.slice().sort((a, b) => num(a.position) - num(b.position)) : rows;
      return `
        <div class="fcf-table-wrap">
        <table class="fcf-table">
          <thead><tr><th>#</th><th class="fcf-th-team">Equipo</th><th>PJ</th><th>G</th><th>E</th><th>P</th><th>GF</th><th>GC</th><th class="fcf-th-pts">Pts</th></tr></thead>
          <tbody>
            ${sorted.map((r, i) => `
              <tr class="${isClub(r.team && r.team.name) ? "is-club" : ""}">
                <td class="fcf-pos">${started ? esc(r.position) : i + 1}</td>
                <td class="fcf-team"><span class="fcf-team-inner">${crest(r.team && r.team.logo)}<span>${esc(pretty(r.team && r.team.name))}</span></span></td>
                <td>${num(r.played)}</td><td>${num(r.won)}</td><td>${num(r.drawn)}</td><td>${num(r.lost)}</td>
                <td>${num(r.goalsFor)}</td><td>${num(r.goalsAgainst)}</td>
                <td class="fcf-pts">${Math.round(parseFloat(r.points) || 0)}</td>
              </tr>`).join("")}
          </tbody>
        </table>
        </div>
        ${started ? "" : `<p class="fcf-note">La liga aún no ha empezado: orden provisional de la FCF.</p>`}`;
    };

    const matchRow = (m, played) => {
      const home = isClub(m.NOMBRE_CASA), away = isClub(m.NOMBRE_FUERA);
      const dt = fmtDT(m.COMIENZO1);
      let outcome = "";
      if (played) {
        const gh = num(m.GOLES_CASA), ga = num(m.GOLES_FUERA);
        const f = home ? gh : ga, r = home ? ga : gh;
        outcome = f > r ? "win" : f < r ? "loss" : "draw";
      }
      return `
        <article class="match fcf-match ${played ? "match-played " + outcome : (m.__pending ? "match-pending" : "match-next")}">
          <div class="match-meta"><span class="match-team">Jornada ${esc(m.JORNADA)}</span><span>${esc(dt.d)}</span></div>
          <div class="match-main">
            <span class="match-side ${home ? "is-fenix" : ""}">${crest(m.ESCUDO_CASA)}${esc(pretty(m.NOMBRE_CASA))}</span>
            <span class="match-score">${played ? `${num(m.GOLES_CASA)}<i>-</i>${num(m.GOLES_FUERA)}` : (m.__pending ? `<small class="score-pending">Pendiente</small>` : `<small>${esc(dt.t || "--:--")}</small>`)}</span>
            <span class="match-side ${away ? "is-fenix" : ""}">${esc(pretty(m.NOMBRE_FUERA))}${crest(m.ESCUDO_FUERA)}</span>
          </div>
          ${m.CAMPO ? `<div class="match-foot"><span>${esc(pretty(m.CAMPO))}</span></div>` : ""}
        </article>`;
    };

    const renderMatches = (partidos) => {
      const all = [];
      Object.keys(partidos || {}).forEach(j => (partidos[j] || []).forEach(m => all.push(m)));
      const ours = all.filter(m => isClub(m.NOMBRE_CASA) || isClub(m.NOMBRE_FUERA));
      const played = ours.filter(m => m.GOLES_CASA !== null && m.GOLES_CASA !== "" && m.GOLES_FUERA !== null && m.GOLES_FUERA !== "");
      /* Partidos ya disputados cuya acta aún no ha publicado la FCF: van a "Últimos resultados" como pendientes */
      const nowIso = new Date(Date.now() - 3 * 3600 * 1000).toISOString().slice(0, 19).replace("T", " ");
      const pendingActa = ours.filter(m => !played.includes(m) && m.COMIENZO1 && !m.COMIENZO1.startsWith("0000") && m.COMIENZO1 < nowIso).map(m => Object.assign({}, m, { __pending: true }));
      const next = ours.filter(m => !played.includes(m) && !pendingActa.some(p => p.CODACTA === m.CODACTA)).sort((a, b) => String(a.COMIENZO1).localeCompare(String(b.COMIENZO1))).slice(0, 4);
      const last = played.concat(pendingActa).sort((a, b) => String(b.COMIENZO1).localeCompare(String(a.COMIENZO1))).slice(0, 4);
      return `
        <div class="matches-col">
          <h3 class="matches-subtitle">Próximos partidos</h3>
          <div class="matches">${next.length ? next.map(m => matchRow(m, false)).join("") : `<p class="matches-empty">Calendario pendiente de publicar.</p>`}</div>
        </div>
        <div class="matches-col">
          <h3 class="matches-subtitle">Últimos resultados</h3>
          <div class="matches">${last.length ? last.map(m => matchRow(m, !m.__pending)).join("") : `<p class="matches-empty">Aún no hay resultados esta temporada.</p>`}</div>
        </div>`;
    };

    const tabsEl = $("#fcf-tabs"), panelsEl = $("#fcf-panels");
    const renderAll = () => {
      const data = window.FCF || {};
      /* Todos los equipos configurados: con datos, o con aviso si la FCF aún no ha publicado su grupo */
      const all = (CLUB.fcfGrupos || []).map((g, i) => ({ ...g, key: g.grupId || ("pend-" + i), ready: !!(g.grupId && data[g.grupId]) }));
      if (!all.length) return;
      fcfEl.hidden = false;
      const empty = $("#fcf-empty");
      if (empty) empty.remove();
      tabsEl.innerHTML = all.map((g, i) => `
        <button type="button" class="fcf-tab ${i === 0 ? "active" : ""} ${g.ready ? "" : "fcf-tab-pending"}" role="tab" aria-selected="${i === 0}" data-tab="${esc(g.key)}">
          ${esc(g.equipo)}<small>${esc(g.competicion || "")}</small>
        </button>`).join("");
      panelsEl.innerHTML = all.map((g, i) => {
        if (!g.ready) {
          return `
        <div class="fcf-panel ${i === 0 ? "active" : ""}" data-panel="${esc(g.key)}" role="tabpanel">
          <div class="fcf-pending">
            <span class="fcf-pending-badge">Próximamente</span>
            <h3>Calendario y clasificación del ${esc(g.equipo)}</h3>
            <p>La Federació Catalana de Futbol todavía no ha publicado el grupo de ${esc(g.competicion || "esta competición")}. En cuanto lo haga, aquí aparecerán el calendario, los resultados y la clasificación, actualizados cada semana de forma automática.</p>
          </div>
        </div>`;
        }
        const d = data[g.grupId];
        return `
        <div class="fcf-panel ${i === 0 ? "active" : ""}" data-panel="${esc(g.key)}" role="tabpanel">
          <div class="matches-grid">${renderMatches(d.partidos)}</div>
          <h3 class="matches-subtitle fcf-clas-title">Clasificación</h3>
          ${renderTable(d.clasificacion)}
          <div class="fcf-foot">
            <span>Datos oficiales FCF · actualizado ${esc(d.actualizado || "")}</span>
            ${g.url ? `<a href="${esc(g.url)}" target="_blank" rel="noopener" class="btn btn-outline btn-small">Ver en la FCF</a>` : ""}
          </div>
        </div>`;
      }).join("");
      tabsEl.querySelectorAll(".fcf-tab").forEach(b => b.addEventListener("click", () => {
        tabsEl.querySelectorAll(".fcf-tab").forEach(x => { x.classList.toggle("active", x === b); x.setAttribute("aria-selected", x === b); });
        panelsEl.querySelectorAll(".fcf-panel").forEach(p => p.classList.toggle("active", p.dataset.panel === b.dataset.tab));
      }));
    };
    let pending = fcfGroups.length;
    if (!pending) { renderAll(); window.dispatchEvent(new Event("fcf:loaded")); }
    fcfGroups.forEach(g => {
      const s = document.createElement("script");
      s.src = `data/fcf/${g.grupId}.js`;
      s.onload = s.onerror = () => { if (--pending === 0) { renderAll(); window.dispatchEvent(new Event("fcf:loaded")); } };
      document.head.appendChild(s);
    });
  }

  /* ---------- Estadísticas: goles, tarjetas y balance (FCF + eventos manuales) ---------- */
  const statsTabs = $("#stats-tabs"), statsPanels = $("#stats-panels"), statsEmpty = $("#stats-empty");
  const renderStats = () => {
    if (!statsTabs || !statsPanels) return;
    const activeTab = (statsTabs.querySelector(".fcf-tab.active") || {}).textContent;
    const normName = (s) => String(s || "").normalize("NFD").replace(/[̀-ͯ]/g, "").toUpperCase().replace(/\s+/g, " ").trim();
    const clubKey = normName(CLUB.fcfNombreClub || "FENIX");
    const isClubTeam = (name) => normName(name).includes(clubKey);
    const num = (v) => parseInt(v, 10) || 0;
    const titleCase = (s) => String(s || "").toLowerCase().replace(/(^|\s|-|')(\S)/g, (m, p, c) => p + c.toUpperCase());

    /* Foto de un jugador: por 'jugadoresFotos' o por la plantilla del equipo */
    const photoFor = (name, teamName) => {
      const map = CLUB.jugadoresFotos || {};
      const k = Object.keys(map).find(x => normName(x) === normName(name));
      if (k) return map[k];
      const team = (CLUB.equipos || []).find(t => t.name === teamName);
      const p = team && (team.plantilla || []).find(x => normName(x.name) === normName(name));
      return p && p.photo ? p.photo : "";
    };

    /* Extrae goleadores/sanciones de los datos de la FCF de forma tolerante al formato */
    const pick = (o, keys) => { for (const k of keys) { if (o && o[k] != null && o[k] !== "") return o[k]; } return undefined; };
    const flatten = (v) => Array.isArray(v) ? v.flatMap(flatten) : (v && typeof v === "object" ? Object.values(v).flatMap(flatten).concat([v]) : []);
    const fcfPlayers = (fcf) => {
      const out = {};
      const add = (name, field, n) => { if (!name || !n) return; const k = normName(name); out[k] = out[k] || { name: titleCase(name), goles: 0, amarillas: 0, rojas: 0 }; out[k][field] += n; };
      flatten(fcf.goleadores || []).forEach(o => {
        const team = pick(o, ["EQUIPO", "NOMBRE_EQUIPO", "equipo", "team", "NOMBRE_EQUIP"]);
        if (team && !isClubTeam(team)) return;
        const name = pick(o, ["JUGADOR", "NOMBRE", "nombre", "name", "NOM"]);
        const g = num(pick(o, ["GOLES", "GOLS", "goles", "goals", "TOTAL"]));
        if (name && g) add(name, "goles", g);
      });
      flatten(fcf.sanciones || {}).forEach(o => {
        const team = pick(o, ["EQUIPO", "NOMBRE_EQUIPO", "equipo", "team"]);
        if (team && !isClubTeam(team)) return;
        const name = pick(o, ["JUGADOR", "NOMBRE", "nombre", "name", "NOM"]);
        if (!name) return;
        const am = num(pick(o, ["AMARILLAS", "GROGUES", "amarillas", "yellow"]));
        const ro = num(pick(o, ["ROJAS", "VERMELLES", "rojas", "red"]));
        const tipo = String(pick(o, ["TIPO", "TIPUS", "tipo", "type"]) || "").toUpperCase();
        if (am) add(name, "amarillas", am);
        if (ro) add(name, "rojas", ro);
        if (!am && !ro && tipo) add(name, /ROJ|VERM|RED/.test(tipo) ? "rojas" : "amarillas", 1);
      });
      return out;
    };

    const teamsWithData = [];
    (CLUB.equipos || []).forEach(t => {
      const grp = (CLUB.fcfGrupos || []).find(g => g.equipo === t.name && g.grupId);
      const fcf = grp && window.FCF && window.FCF[grp.grupId];
      const events = (CLUB.eventos || []).filter(e => e.equipo === t.name);
      let players = fcf ? fcfPlayers(fcf) : {};
      const fromFcf = Object.keys(players).length > 0;
      if (!fromFcf) {
        events.forEach(e => {
          const add = (obj, field) => Object.entries(obj || {}).forEach(([name, n]) => {
            const k = normName(name); players[k] = players[k] || { name, goles: 0, amarillas: 0, rojas: 0 }; players[k][field] += num(n);
          });
          add(e.goles, "goles"); add(e.amarillas, "amarillas"); add(e.rojas, "rojas");
        });
      }
      /* Balance del equipo: fila de la FCF si hay liga jugada; si no, suma de eventos */
      let bal = null;
      const row = fcf && fcf.clasificacion && (fcf.clasificacion.data || []).find(r => isClubTeam(r.team && r.team.name));
      if (row && num(row.played) > 0) {
        bal = { pj: num(row.played), g: num(row.won), e: num(row.drawn), p: num(row.lost), gf: num(row.goalsFor), gc: num(row.goalsAgainst), fuente: "Liga · FCF" };
      } else if (events.length) {
        bal = { pj: 0, g: 0, e: 0, p: 0, gf: 0, gc: 0, fuente: "Resultados anotados" };
        events.forEach(e => {
          const m = String(e.resultado || "").match(/(\d+)\s*-\s*(\d+)/); if (!m) return;
          const home = isClubTeam(e.local); const f = home ? +m[1] : +m[2], r = home ? +m[2] : +m[1];
          bal.pj++; bal.gf += f; bal.gc += r; if (f > r) bal.g++; else if (f < r) bal.p++; else bal.e++;
        });
      }
      const list = Object.values(players);
      teamsWithData.push({ team: t, players: list, bal, fromFcf, events, hasData: !!(list.length || bal) });
      /* Totales por jugador, para la ficha del pop-up de plantilla */
      window.PLAYER_STATS = window.PLAYER_STATS || {};
      window.PLAYER_STATS[t.name] = {};
      window.TEAM_BAL = window.TEAM_BAL || {};
      if (bal) window.TEAM_BAL[t.name] = bal;
      list.forEach(p => { window.PLAYER_STATS[t.name][normName(p.name)] = p; });
    });

    /* Pestaña "Club": suma de todos los equipos */
    const anyData = teamsWithData.some(d => d.hasData);
    {
      const merged = {};
      const balClub = { pj: 0, g: 0, e: 0, p: 0, gf: 0, gc: 0, fuente: "Suma de todos los equipos" };
      let any = false;
      teamsWithData.forEach(d => {
        d.players.forEach(p => { const k = normName(p.name) + "|" + d.team.name; merged[k] = merged[k] || { name: p.name, team: d.team.name, goles: 0, amarillas: 0, rojas: 0 }; merged[k].goles += p.goles; merged[k].amarillas += p.amarillas; merged[k].rojas += p.rojas; });
        if (d.bal) { any = true; ["pj", "g", "e", "p", "gf", "gc"].forEach(k => balClub[k] += d.bal[k]); }
      });
      teamsWithData.unshift({ team: { name: "Club", category: "Todos los equipos" }, players: Object.values(merged), bal: any ? balClub : null, fromFcf: false, events: [], hasData: anyData, isClub: true });
    }

    if (!teamsWithData.length) {
      if (statsEmpty) statsEmpty.hidden = false;
    } else {
      /* Silueta de jugador para quien no tiene foto */
      const silhouetteHtml = `<svg class="scorer-silhouette" viewBox="0 0 200 260" aria-hidden="true"><path fill="currentColor" d="M100 18c-24 0-42 20-42 46s18 50 42 50 42-24 42-50-18-46-42-46zm-58 118c-16 6-26 20-30 40l-8 84h192l-8-84c-4-20-14-34-30-40l-28-10c-9 8-19 12-30 12s-21-4-30-12z"/></svg>`;
      window.silhouette = window.silhouette || (() => { const t = document.createElement("template"); t.innerHTML = silhouetteHtml; return t.content.firstChild; });
      const card = (p, i, teamName) => {
        const ph = photoFor(p.name, p.team || teamName);
        return `
        <div class="scorer ${i === 0 ? "scorer-top" : ""}">
          <div class="scorer-media">${ph ? `<img src="${esc(ph)}" alt="${esc(p.name)}" loading="lazy" onerror="this.replaceWith(silhouette())">` : silhouetteHtml}</div>
          <div class="scorer-info">
            <span class="scorer-rank">${i + 1}${p.team ? ` · ${esc(p.team)}` : ""}</span>
            <span class="scorer-name">${esc(p.name)}</span>
            <span class="scorer-goals"><strong>${p.goles}</strong> ${p.goles === 1 ? "gol" : "goles"}</span>
          </div>
        </div>`;
      };
      statsTabs.innerHTML = teamsWithData.map((d, i) => `
        <button type="button" class="fcf-tab ${i === 0 ? "active" : ""}" role="tab" aria-selected="${i === 0}" data-stab="${i}">${esc(d.team.name)}<small>${esc(d.team.category || "")}</small></button>`).join("");
      statsPanels.innerHTML = teamsWithData.map((d, i) => {
        const scorers = d.players.filter(p => p.goles > 0).sort((a, b) => b.goles - a.goles).slice(0, 5);
        const cards = d.players.filter(p => p.amarillas || p.rojas).sort((a, b) => (b.rojas * 3 + b.amarillas) - (a.rojas * 3 + a.amarillas));
        const b = d.bal;
        if (!d.hasData) {
          return `
        <div class="stats-panel ${i === 0 ? "active" : ""}" data-spanel="${i}">
          <div class="stat-tiles stat-tiles-empty">
            ${["Partidos", "Victorias", "Empates", "Derrotas", "Goles a favor", "Goles en contra"].map(l => `<div class="stat-tile"><strong>–</strong><span>${l}</span></div>`).join("")}
          </div>
          <div class="stats-grid">
            <div class="stats-col">
              <h3 class="matches-subtitle">Máximos goleadores</h3>
              <div class="scorers">${[0, 1, 2].map(k => `
                <div class="scorer scorer-placeholder ${k === 0 ? "scorer-top" : ""}">
                  <div class="scorer-media">${silhouetteHtml}</div>
                  <div class="scorer-info"><span class="scorer-rank">${k + 1}</span><span class="scorer-name">Por decidir</span><span class="scorer-goals"><strong>0</strong> goles</span></div>
                </div>`).join("")}</div>
            </div>
            <div class="stats-col">
              <h3 class="matches-subtitle">Tarjetas</h3>
              <p class="matches-empty">Sin datos todavía.</p>
            </div>
          </div>
          <p class="stats-source">Las estadísticas de ${esc(d.team.name)} aparecerán con los primeros partidos de la temporada.</p>
        </div>`;
        }
        return `
        <div class="stats-panel ${i === 0 ? "active" : ""}" data-spanel="${i}">
          ${b ? `
          <div class="stat-tiles">
            <div class="stat-tile"><strong>${b.pj}</strong><span>Partidos</span></div>
            <div class="stat-tile stat-win"><strong>${b.g}</strong><span>Victorias</span></div>
            <div class="stat-tile stat-draw"><strong>${b.e}</strong><span>Empates</span></div>
            <div class="stat-tile stat-loss"><strong>${b.p}</strong><span>Derrotas</span></div>
            <div class="stat-tile"><strong>${b.gf}</strong><span>Goles a favor</span></div>
            <div class="stat-tile"><strong>${b.gc}</strong><span>Goles en contra</span></div>
          </div>` : ""}
          <div class="stats-grid">
            <div class="stats-col">
              <h3 class="matches-subtitle">Máximos goleadores</h3>
              ${scorers.length ? `<div class="scorers">${scorers.map((p, k) => card(p, k, d.team.name)).join("")}</div>` : `<p class="matches-empty">Aún no hay goles registrados.</p>`}
            </div>
            <div class="stats-col">
              <h3 class="matches-subtitle">Tarjetas</h3>
              ${cards.length ? `<ul class="cards-list">${cards.map(p => `
                <li><span class="cards-name">${esc(p.name)}</span>
                  <span class="cards-count">${p.amarillas ? `<i class="card-y"></i>${p.amarillas}` : ""}${p.rojas ? `<i class="card-r"></i>${p.rojas}` : ""}</span></li>`).join("")}</ul>` : `<p class="matches-empty">Sin tarjetas. Así da gusto.</p>`}
              ${d.events.length ? `
              <h3 class="matches-subtitle stats-sub2">Últimos resultados anotados</h3>
              <ul class="events-list">${d.events.slice().sort((a, b) => String(b.fecha).localeCompare(String(a.fecha))).slice(0, 4).map(e => `
                <li><span>${esc(e.local)} <strong>${esc(e.resultado)}</strong> ${esc(e.visitante)}</span><small>${esc(e.competicion || "")} · ${esc(e.fecha)}</small></li>`).join("")}</ul>` : ""}
            </div>
          </div>
          <p class="stats-source">Fuente: ${d.fromFcf ? "datos oficiales de la FCF" : "resultados anotados por el club"}${b ? ` · balance: ${esc(b.fuente)}` : ""}.</p>
        </div>`;
      }).join("");
      statsTabs.querySelectorAll("[data-stab]").forEach(btn => btn.addEventListener("click", () => {
        statsTabs.querySelectorAll("[data-stab]").forEach(x => { x.classList.toggle("active", x === btn); x.setAttribute("aria-selected", x === btn); });
        statsPanels.querySelectorAll(".stats-panel").forEach(p => p.classList.toggle("active", p.dataset.spanel === btn.dataset.stab));
      }));
      if (statsEmpty) statsEmpty.hidden = true;
      const keep = [...statsTabs.querySelectorAll("[data-stab]")].find(b => b.textContent === activeTab);
      if (keep) keep.click();
    }
  };
  renderStats();
  window.addEventListener("fcf:loaded", renderStats);

  const linksEl = $("#matches-links");
  if (linksEl && CLUB.partidosEnlaces && CLUB.partidosEnlaces.length) {
    linksEl.innerHTML = CLUB.partidosEnlaces.map(l =>
      `<a href="${esc(l.url)}" target="_blank" rel="noopener" class="btn btn-outline btn-small">${esc(l.label)}</a>`).join("");
  }

  /* ---------- Noticias ---------- */
  const newsEl = $("#news");
  if (newsEl && CLUB.noticias) {
    newsEl.innerHTML = CLUB.noticias.map((n, idx) => `
      <article class="card news-card reveal" data-news="${idx}" tabindex="0" role="button" aria-label="Leer: ${esc(n.titulo)}">
        <div class="news-media">
          ${n.imagen ? `<img src="${esc(n.imagen)}" alt="" loading="lazy" onerror="this.remove()">` : ""}
        </div>
        <div class="card-body">
          <p class="card-kicker">${fmtDate(n.fecha)}</p>
          <h3>${esc(n.titulo)}</h3>
          <p>${esc(n.resumen)}</p>
          <span class="news-more">Leer más <i>&#8250;</i></span>
        </div>
      </article>`).join("");

    /* Pop-up de noticia: texto completo sin salir de la web */
    const openNews = (idx) => {
      const n = CLUB.noticias[idx];
      if (!n) return;
      const paragraphs = String(n.contenido || n.resumen || "")
        .split(/\n\s*\n|\n/).map(s => s.trim()).filter(Boolean)
        .map(p => `<p>${esc(p)}</p>`).join("");
      const ext = n.url && /^https?:/i.test(n.url);
      let link = "";
      if (n.url) {
        const label = n.urlTexto || (ext ? (/instagram\.com/i.test(n.url) ? "Ver en Instagram" : "Ver enlace") : "Ir a la sección");
        link = ext
          ? `<a class="btn btn-primary btn-small" href="${esc(n.url)}" target="_blank" rel="noopener">${esc(label)}</a>`
          : `<a class="btn btn-primary btn-small" href="${esc(n.url)}" data-close>${esc(label)}</a>`;
      }
      const body = `
        ${n.imagen ? `<div class="news-modal-media"><img src="${esc(n.imagen)}" alt="" onerror="this.parentNode.remove()"></div>` : ""}
        <div class="news-modal-text">${paragraphs}</div>
        ${link ? `<div class="news-modal-actions">${link}</div>` : ""}`;
      openModal({ kicker: fmtDate(n.fecha), title: n.titulo || "", tagline: n.subtitulo || "", body, mode: "news" });
    };
    newsEl.addEventListener("click", (ev) => {
      const card = ev.target.closest("[data-news]");
      if (card) openNews(+card.dataset.news);
    });
    newsEl.addEventListener("keydown", (ev) => {
      if (ev.key !== "Enter" && ev.key !== " ") return;
      const card = ev.target.closest("[data-news]");
      if (card && ev.target === card) { ev.preventDefault(); openNews(+card.dataset.news); }
    });
  }

  /* ---------- Tienda ---------- */
  const shopEl = $("#shop");
  const shopSoon = CLUB.tiendaEstado === "proximamente";
  if (shopEl && CLUB.tienda) {
    if (shopSoon) {
      const sec = $("#tienda");
      const cfg = CLUB.tiendaProximamente || {};
      sec.classList.add("shop-soon");
      const k = sec.querySelector(".section-kicker"), t = sec.querySelector(".section-title"), i = sec.querySelector(".section-intro");
      if (k && cfg.kicker) k.textContent = cfg.kicker;
      if (t && cfg.titulo) t.textContent = cfg.titulo;
      if (i && cfg.intro) i.textContent = cfg.intro;
    }
    shopEl.innerHTML = CLUB.tienda.map(p => {
      const href = shopSoon ? "#contacto" : (p.url || "#contacto");
      const ext = !shopSoon && /^https?:/i.test(p.url || "");
      const label = shopSoon ? "Avísame" : (p.url ? "Comprar" : "Lo quiero");
      return `
      <article class="card product ${shopSoon ? "product-soon" : ""} reveal">
        <div class="product-media">
          ${p.imagen ? `<img src="${esc(p.imagen)}" alt="${esc(p.nombre)}" loading="lazy" onerror="this.remove()">` : ""}
          ${shopSoon ? `<span class="product-badge">Próximamente</span>` : ""}
        </div>
        <div class="card-body">
          <h3>${esc(p.nombre)}</h3>
          ${shopSoon ? `<p class="product-price product-price-soon">Precio por anunciar</p>` : `<p class="product-price">${esc(p.precio)}</p>`}
          <a href="${esc(href)}" ${ext ? 'target="_blank" rel="noopener"' : ""} class="btn ${shopSoon ? "btn-outline" : "btn-primary"} btn-small" data-product="${esc(p.nombre)}" ${shopSoon ? 'data-soon="1"' : ""}>
            ${label}
          </a>
        </div>
      </article>`;
    }).join("");
    /* Si el producto no tiene enlace de compra (o la tienda está en "próximamente"),
       rellenamos el formulario de contacto con el producto. */
    shopEl.addEventListener("click", (ev) => {
      const btn = ev.target.closest("[data-product]");
      if (!btn || btn.getAttribute("href") !== "#contacto") return;
      const tipo = $("#tipo"), msg = $("#mensaje");
      if (tipo) tipo.value = "Tienda";
      if (msg && !msg.value) {
        msg.value = btn.dataset.soon
          ? `Hola, avisadme cuando esté disponible en la tienda: ${btn.dataset.product}.`
          : `Hola, quiero pedir: ${btn.dataset.product}. Talla: ___. Cantidad: 1.`;
      }
    });
  }
  const shopNote = $("#shop-note");
  if (shopNote) shopNote.textContent = shopSoon ? ((CLUB.tiendaProximamente || {}).nota || "") : (CLUB.tiendaNota || "");

  /* ---------- Instagram ---------- */
  const igEl = $("#instagram-feed");
  if (igEl) {
    const posts = (CLUB.instagramPosts || []).filter(u => /^https:\/\/(www\.)?instagram\.com\/(p|reel)\/[\w-]+\/?/.test(u));
    const profile = String(CLUB.instagramPerfil || "").replace(/^@/, "").trim();
    let html = "";
    if (profile && /^[\w.]+$/.test(profile)) {
      /* Widget de perfil: cabecera propia + cuadrícula en vivo (últimas 6 publicaciones)
         recortada del embed oficial de Instagram. */
      const st = CLUB.instagramStats || {};
      const stat = (v, label) => v ? `<div class="ig-stat"><strong>${esc(v)}</strong><span>${esc(label)}</span></div>` : "";
      const url = `https://www.instagram.com/${esc(profile)}/`;
      html += `
        <div class="ig-widget">
          <div class="ig-head">
            <a class="ig-avatar" href="${url}" target="_blank" rel="noopener"><img src="assets/img/logo.png" alt=""></a>
            <div class="ig-names">
              <a class="ig-name" href="${url}" target="_blank" rel="noopener">${esc(CLUB.instagramNombre || profile)}</a>
              <a class="ig-handle" href="${url}" target="_blank" rel="noopener">@${esc(profile)}</a>
            </div>
            <div class="ig-stats">
              ${stat(st.publicaciones, "Publicaciones")}${stat(st.seguidores, "Seguidores")}${stat(st.siguiendo, "Siguiendo")}
            </div>
            <a class="ig-follow" href="${url}" target="_blank" rel="noopener">
              <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path fill="currentColor" d="M12 2.2c3.2 0 3.6 0 4.8.1 1.2.1 1.8.2 2.2.4.6.2 1 .5 1.4.9.4.4.7.8.9 1.4.2.4.4 1 .4 2.2.1 1.2.1 1.6.1 4.8s0 3.6-.1 4.8c-.1 1.2-.2 1.8-.4 2.2-.2.6-.5 1-.9 1.4-.4.4-.8.7-1.4.9-.4.2-1 .4-2.2.4-1.2.1-1.6.1-4.8.1s-3.6 0-4.8-.1c-1.2-.1-1.8-.2-2.2-.4-.6-.2-1-.5-1.4-.9-.4-.4-.7-.8-.9-1.4-.2-.4-.4-1-.4-2.2C2.2 15.6 2.2 15.2 2.2 12s0-3.6.1-4.8c.1-1.2.2-1.8.4-2.2.2-.6.5-1 .9-1.4.4-.4.8-.7 1.4-.9.4-.2 1-.4 2.2-.4C8.4 2.2 8.8 2.2 12 2.2M12 0C8.7 0 8.3 0 7.1.1 5.8.1 4.9.3 4.1.6c-.8.3-1.5.7-2.1 1.4C1.3 2.6.9 3.3.6 4.1.3 4.9.1 5.8.1 7.1 0 8.3 0 8.7 0 12s0 3.7.1 4.9c.1 1.3.3 2.2.6 3 .3.8.7 1.5 1.4 2.1.6.7 1.3 1.1 2.1 1.4.8.3 1.7.5 3 .6 1.2.1 1.6.1 4.9.1s3.7 0 4.9-.1c1.3-.1 2.2-.3 3-.6.8-.3 1.5-.7 2.1-1.4.7-.6 1.1-1.3 1.4-2.1.3-.8.5-1.7.6-3 .1-1.2.1-1.6.1-4.9s0-3.7-.1-4.9c-.1-1.3-.3-2.2-.6-3-.3-.8-.7-1.5-1.4-2.1-.6-.7-1.3-1.1-2.1-1.4-.8-.3-1.7-.5-3-.6C15.7 0 15.3 0 12 0zm0 5.8a6.2 6.2 0 1 0 0 12.4 6.2 6.2 0 0 0 0-12.4zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.4-11.8a1.4 1.4 0 1 0 0 2.9 1.4 1.4 0 0 0 0-2.9z"/></svg>
              Seguir
            </a>
          </div>
          ${posts.length ? `
          <div class="ig-posts">
            ${posts.slice(0, Number(CLUB.instagramMax) || 6).map(u => {
              const clean = u.replace(/[?#].*$/, "").replace(/\/?$/, "/");
              return `
              <div class="ig-post">
                <iframe class="ig-post-frame" src="${esc(clean)}embed/" title="Publicación de Instagram" loading="lazy" allowtransparency="true" scrolling="no"></iframe>
                <a class="ig-post-link" href="${esc(clean)}" target="_blank" rel="noopener" aria-label="Ver publicación en Instagram"></a>
              </div>`;
            }).join("")}
          </div>` : `
          <div class="ig-grid">
            <iframe class="instagram-profile-frame" src="https://www.instagram.com/${esc(profile)}/embed/" title="Instagram de @${esc(profile)}" loading="lazy" allowtransparency="true" scrolling="no"></iframe>
          </div>`}
          <a class="ig-grid-link" href="${url}" target="_blank" rel="noopener">Ver todas las publicaciones en Instagram &#8250;</a>
        </div>`;
    }
    if (html) {
      igEl.innerHTML = html;
      /* Posts individuales: cada embed lleva una cabecera de ~54 px que ocultamos
         para dejar solo la imagen (formato 4:5). */
      const postFrames = igEl.querySelectorAll(".ig-post-frame");
      if (postFrames.length) {
        const OFF = Number(CLUB.instagramPostOffset) || 54;
        const BASE = 250; /* por debajo de este ancho el embed no encoge: lo escalamos */
        const fitPosts = () => {
          postFrames.forEach(f => {
            const w = f.parentNode.getBoundingClientRect().width || BASE;
            const base = Math.max(w, BASE);
            const scale = w / base;
            f.style.width = base + "px";
            f.style.height = Math.round(OFF + base * 1.25 + 260) + "px";
            f.style.transformOrigin = "0 0";
            f.style.transform = scale < 1 ? `scale(${scale})` : "";
            f.style.top = (-OFF * scale) + "px";
          });
        };
        fitPosts();
        window.addEventListener("resize", fitPosts, { passive: true });
      }
      /* Cuadrícula automática del perfil (si no hay posts en la lista): el embed lleva
         su propia cabecera (~150 px) y 2 filas de fotos de ancho/3. */
      const frame = igEl.querySelector(".instagram-profile-frame");
      const grid = igEl.querySelector(".ig-grid");
      if (frame && grid) {
        const fit = () => {
          const w = grid.getBoundingClientRect().width || 540;
          const HEADER = Number(CLUB.instagramEmbedOffset) || (w < 500 ? 148 : 158);
          const rows = (w / 3) * 2 + 2;
          grid.style.height = Math.round(rows) + "px";
          frame.style.height = Math.round(HEADER + rows + 40) + "px";
          frame.style.top = (-HEADER) + "px";
        };
        fit();
        window.addEventListener("resize", fit, { passive: true });
      }
    } else {
      igEl.innerHTML = `
        <a class="instagram-placeholder reveal" href="https://www.instagram.com/fenix_fs/" target="_blank" rel="noopener">
          <img src="assets/img/logo.png" alt="" width="120" height="150">
          <span class="instagram-handle">@fenix_fs</span>
          <span class="instagram-hint">Fotos, vídeos y resultados en nuestro Instagram</span>
        </a>`;
    }
  }

  /* ---------- Animación de aparición ---------- */
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } });
    }, { threshold: 0.12 });
    document.querySelectorAll(".reveal").forEach(el => io.observe(el));
  } else {
    document.querySelectorAll(".reveal").forEach(el => el.classList.add("in"));
  }

  /* ---------- Formulario ---------- */
  const form = $("#contact-form");
  const status = $("#form-status");
  if (form) {
    form.addEventListener("submit", async (ev) => {
      ev.preventDefault();
      status.textContent = "";
      status.className = "form-status";

      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }

      /* Asunto del correo con el tipo de consulta y el nombre, para que se ordene solo en la bandeja */
      const subj = form.querySelector('input[name="subject"]');
      if (subj) {
        const tipoTxt = $("#tipo") && $("#tipo").selectedOptions[0] ? $("#tipo").selectedOptions[0].textContent.trim() : "";
        subj.value = `[Web Fénix FS] ${tipoTxt || "Consulta"} · ${($("#nombre") || {}).value || ""}`.trim();
      }
      const data = new FormData(form);
      const usingPlaceholder = form.action.includes("TU_ID_FORMSPREE");

      /* Si aún no se ha configurado Formspree, abrimos el correo del usuario
         con el mensaje ya redactado (funciona sin servidor). */
      if (usingPlaceholder) {
        const subject = `[Web Fénix FS] ${data.get("tipo")} · ${data.get("nombre")}`;
        const body =
          `Nombre: ${data.get("nombre")}\n` +
          `Email: ${data.get("email")}\n` +
          `Teléfono: ${data.get("telefono") || "-"}\n` +
          `Tipo: ${data.get("tipo")}\n\n` +
          `${data.get("mensaje")}`;
        window.location.href = `mailto:fenixfutsala@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        status.textContent = "Se ha abierto tu programa de correo con el mensaje preparado. ¡Gracias!";
        status.classList.add("ok");
        return;
      }

      const btn = form.querySelector("button[type=submit]");
      const btnLabel = btn.textContent;
      btn.disabled = true;
      btn.textContent = "Enviando...";
      try {
        const res = await fetch(form.action, {
          method: "POST",
          body: data,
          headers: { "Accept": "application/json" }
        });
        if (res.ok) {
          form.reset();
          status.textContent = "¡Mensaje enviado! Te contestaremos lo antes posible.";
          status.classList.add("ok");
        } else {
          throw new Error("Respuesta no válida");
        }
      } catch (err) {
        status.textContent = "No se ha podido enviar. Escríbenos a fenixfutsala@gmail.com.";
        status.classList.add("error");
      } finally {
        btn.disabled = false;
        btn.textContent = btnLabel;
      }
    });
  }

  /* ---------- Botón flotante de WhatsApp ---------- */
  const wa = CLUB.whatsapp;
  if (wa && wa.numero && /^\d{9,15}$/.test(String(wa.numero))) {
    const url = `https://wa.me/${wa.numero}?text=${encodeURIComponent(wa.mensaje || "")}`;
    const el = document.createElement("a");
    el.className = "wa-float";
    el.href = url; el.target = "_blank"; el.rel = "noopener";
    el.setAttribute("aria-label", "Escríbenos por WhatsApp");
    el.innerHTML = `
      <span class="wa-bubble">${esc(wa.etiqueta || "WhatsApp")}</span>
      <span class="wa-icon"><svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38a9.9 9.9 0 0 0 4.79 1.22c5.46 0 9.91-4.45 9.91-9.91S17.5 2 12.04 2zm0 18.15c-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.2 8.2 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.25-8.24 4.54 0 8.24 3.7 8.24 8.24 0 4.55-3.7 8.24-8.24 8.24zm4.52-6.16c-.25-.12-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.12-.17.25-.64.81-.78.97-.14.17-.29.19-.54.06-.25-.12-1.05-.39-1.99-1.23-.74-.66-1.23-1.47-1.38-1.72-.14-.25-.02-.38.11-.51.11-.11.25-.29.37-.43.12-.14.17-.25.25-.41.08-.17.04-.31-.02-.43-.06-.12-.56-1.34-.76-1.84-.2-.48-.41-.42-.56-.43h-.48c-.17 0-.43.06-.66.31-.22.25-.86.85-.86 2.07 0 1.22.89 2.4 1.01 2.56.12.17 1.75 2.67 4.23 3.74.59.26 1.05.41 1.41.52.59.19 1.13.16 1.56.1.48-.07 1.47-.6 1.67-1.18.21-.58.21-1.07.14-1.18-.06-.1-.22-.16-.47-.28z"/></svg></span>`;
    document.body.appendChild(el);
    /* La burbuja de texto aparece unos segundos al cargar y luego se recoge; vuelve al pasar el ratón */
    setTimeout(() => el.classList.add("wa-show"), 1500);
    setTimeout(() => el.classList.remove("wa-show"), 7000);
  }

  /* ---------- Año del pie ---------- */
  const year = $("#year");
  if (year) year.textContent = new Date().getFullYear();
})();
