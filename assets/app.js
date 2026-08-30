/* ============================================================
   Bussola della Cittadinanza — logica dell'applicazione
   Mappa radiale con pan/zoom, indice, pannello bilingue, ricerca.
   Nessuna dipendenza esterna.
   ============================================================ */

(function () {
  "use strict";

  var LS = "mappa-cittadinanza-uk";
  var N = MAPPA.nodes;
  var byId = {};
  N.forEach(function (n) { byId[n.id] = n; });

  var root = byId.root;
  var branches = N.filter(function (n) { return n.p === "root"; });
  var childrenOf = {};
  N.forEach(function (n) {
    if (!n.p) return;
    (childrenOf[n.p] = childrenOf[n.p] || []).push(n);
  });

  /* ------------------------------ stato ------------------------------ */

  var state = {
    lang: "it",
    view: window.matchMedia("(min-width: 900px)").matches ? "map" : "outline",
    theme: null,
    open: null,          // ramo espanso (accordion)
    active: null,        // nodo nel pannello
    done: {}             // id -> true
  };

  try {
    var saved = JSON.parse(localStorage.getItem(LS) || "{}");
    if (saved.lang) state.lang = saved.lang;
    if (saved.view) state.view = saved.view;
    if (saved.theme) state.theme = saved.theme;
    if (saved.done) state.done = saved.done;
  } catch (e) { /* storage non disponibile: si prosegue con i valori di default */ }

  function save() {
    try {
      localStorage.setItem(LS, JSON.stringify({
        lang: state.lang, view: state.view, theme: state.theme, done: state.done
      }));
    } catch (e) { /* ignora */ }
  }

  /* --------------------------- utilità testo --------------------------- */

  function L(o) { return o ? (o[state.lang] || o.it || o.en || "") : ""; }
  function other() { return state.lang === "it" ? "en" : "it"; }
  function strip(s) { return String(s).replace(/<[^>]*>/g, ""); }

  function branchOf(n) {
    while (n && n.p && n.p !== "root") n = byId[n.p];
    return n && n.p === "root" ? n : null;
  }
  function hueOf(n) {
    if (!n || n.id === "root") return "var(--ink)";
    var b = n.p === "root" ? n : branchOf(n);
    return b ? "var(--c-" + b.id + ")" : "var(--ink-3)";
  }

  var T = {
    it: {
      map: "Mappa", outline: "Indice", search: "Cerca…",
      subtitle: "Life in the UK Test · 2026",
      openHint: "Trascina per spostarti · rotella o pinch per zoomare · tocca un'area per aprirla",
      areas: "Le nove aree", card: "voci", done: "Studiato",
      markDone: "Segna come studiato", isDone: "Studiato",
      deepen: "Approfondisci", prev: "Precedente", next: "Successivo",
      close: "Chiudi", progress: "argomenti studiati",
      introOutline: "Nove aree, 63 voci. Le prime tre riguardano la <em>procedura</em>; le cinque centrali sono i capitoli del <em>manuale ufficiale</em> da cui escono tutte le domande; l'ultima raccoglie gli aggiornamenti del 2026. Tocca una voce per aprirla in italiano e in inglese.",
      colophon: "Materiale di studio in italiano e inglese, aggiornato ad agosto 2026. Non è consulenza legale: prima di prenotare, pagare o presentare domanda verifica sempre le pagine ufficiali GOV.UK linkate in ogni scheda."
    },
    en: {
      map: "Map", outline: "Index", search: "Search…",
      subtitle: "Life in the UK Test · 2026",
      openHint: "Drag to move · wheel or pinch to zoom · tap an area to open it",
      areas: "The nine areas", card: "entries", done: "Studied",
      markDone: "Mark as studied", isDone: "Studied",
      deepen: "Go deeper", prev: "Previous", next: "Next",
      close: "Close", progress: "topics studied",
      introOutline: "Nine areas, 63 entries. The first three cover the <em>process</em>; the five in the middle are the chapters of the <em>official handbook</em> that every question comes from; the last gathers the 2026 updates. Tap an entry to open it in Italian and English.",
      colophon: "Study material in Italian and English, current to August 2026. Not legal advice: before booking, paying or applying, always check the official GOV.UK pages linked in each card."
    }
  };
  function t(k) { return T[state.lang][k]; }

  /* ------------------------------ icone ------------------------------ */

  var ICON = {
    search: '<svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>',
    map: '<svg viewBox="0 0 24 24"><path d="m9 4-6 3v13l6-3 6 3 6-3V4l-6 3z"/><path d="M9 4v13M15 7v13"/></svg>',
    list: '<svg viewBox="0 0 24 24"><path d="M8 6h13M8 12h13M8 18h13M3.5 6h.01M3.5 12h.01M3.5 18h.01"/></svg>',
    plus: '<svg viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></svg>',
    minus: '<svg viewBox="0 0 24 24"><path d="M5 12h14"/></svg>',
    fit: '<svg viewBox="0 0 24 24"><path d="M4 9V5a1 1 0 0 1 1-1h4M15 4h4a1 1 0 0 1 1 1v4M20 15v4a1 1 0 0 1-1 1h-4M9 20H5a1 1 0 0 1-1-1v-4"/></svg>',
    close: '<svg viewBox="0 0 24 24"><path d="m6 6 12 12M18 6 6 18"/></svg>',
    check: '<svg viewBox="0 0 24 24"><path d="m4 12 5 5L20 6"/></svg>',
    left: '<svg viewBox="0 0 24 24"><path d="m14 6-6 6 6 6"/></svg>',
    right: '<svg viewBox="0 0 24 24"><path d="m10 6 6 6-6 6"/></svg>',
    ext: '<svg viewBox="0 0 24 24"><path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5"/></svg>',
    sun: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>',
    moon: '<svg viewBox="0 0 24 24"><path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z"/></svg>'
  };

  /* =========================== INTELAIATURA =========================== */

  var app = document.getElementById("app");
  app.innerHTML =
    '<header class="bar">' +
      '<div class="brand"><h1></h1><span class="sub"></span></div>' +
      '<div class="tools">' +
        '<div class="search"><input type="search" id="q" autocomplete="off" spellcheck="false">' + ICON.search +
          '<div class="results" id="results" role="listbox"></div></div>' +
        '<div class="lang" role="group" aria-label="Lingua / Language">' +
          '<button id="lang-it" aria-pressed="true">IT</button>' +
          '<button id="lang-en" aria-pressed="false">EN</button>' +
        '</div>' +
        '<button class="btn" id="view-toggle" aria-pressed="false"></button>' +
        '<button class="btn" id="theme-toggle" title="Tema / Theme"></button>' +
      '</div>' +
      '<div class="progress"><i id="bar-fill" style="width:0"></i></div>' +
    '</header>' +
    '<div class="stage">' +
      '<div class="viewport" id="viewport">' +
        '<div class="world" id="world">' +
          '<svg class="links" id="links" viewBox="0 0 2800 2800" preserveAspectRatio="none" aria-hidden="true"></svg>' +
        '</div>' +
        '<div class="zoom">' +
          '<button id="zin" aria-label="Zoom +">' + ICON.plus + '</button>' +
          '<button id="zout" aria-label="Zoom −">' + ICON.minus + '</button>' +
          '<button id="zfit" aria-label="Adatta">' + ICON.fit + '</button>' +
        '</div>' +
        '<p class="hint" id="hint"></p>' +
        '<aside class="legend" id="legend"></aside>' +
      '</div>' +
      '<div class="outline hidden" id="outline"></div>' +
      '<aside class="panel" id="panel" hidden aria-label="Dettaglio"></aside>' +
    '</div>';

  var viewport = document.getElementById("viewport");
  var hintSeen = false;
  function dismissHint() {
    if (hintSeen) return;
    hintSeen = true;
    var h = document.getElementById("hint");
    if (h) { h.style.opacity = "0"; setTimeout(function () { h.style.display = "none"; }, 400); }
  }
  var world = document.getElementById("world");
  var svg = document.getElementById("links");
  var panel = document.getElementById("panel");
  var outline = document.getElementById("outline");
  var results = document.getElementById("results");
  var qInput = document.getElementById("q");

  var W = 2800, C = 1400;

  /* ============================= LAYOUT ============================= */

  var geom = {};    // id -> {x, y, ang}

  function compact() { return window.innerWidth < 760; }

  function layout() {
    geom = {};
    var rHub = compact() ? 300 : 360;
    var rLeaf = compact() ? 545 : 640;
    var rStagger = compact() ? 105 : 122;

    geom.root = { x: C, y: C, ang: -90 };

    branches.forEach(function (b, i) {
      var a = -90 + i * (360 / branches.length);
      var rad = a * Math.PI / 180;
      geom[b.id] = { x: C + Math.cos(rad) * rHub, y: C + Math.sin(rad) * rHub, ang: a };

      if (state.open !== b.id) return;
      var kids = childrenOf[b.id] || [];
      var n = kids.length;
      var spread = Math.min(92, Math.max(0, (n - 1) * 11.5));
      var step = n > 1 ? spread / (n - 1) : 0;
      kids.forEach(function (k, j) {
        var ka = a - spread / 2 + j * step;
        var kr = rLeaf + (j % 2) * rStagger;
        var krad = ka * Math.PI / 180;
        geom[k.id] = { x: C + Math.cos(krad) * kr, y: C + Math.sin(krad) * kr, ang: ka };
      });
    });
  }

  function visibleNodes() {
    return N.filter(function (n) { return !!geom[n.id]; });
  }

  /* ============================ DISEGNO ============================ */

  var nodeEls = {};

  function drawNodes(animateIds) {
    var wanted = {};
    visibleNodes().forEach(function (n) { wanted[n.id] = true; });

    // rimuove i nodi non più visibili
    Object.keys(nodeEls).forEach(function (id) {
      if (!wanted[id]) { nodeEls[id].remove(); delete nodeEls[id]; }
    });

    visibleNodes().forEach(function (n) {
      var el = nodeEls[n.id];
      if (!el) {
        el = document.createElement("button");
        el.type = "button";
        el.className = "node " + (n.id === "root" ? "root" : n.p === "root" ? "hub" : "leaf");
        el.dataset.id = n.id;
        el.addEventListener("click", function () { activate(n.id, true); });
        world.appendChild(el);
        nodeEls[n.id] = el;
        if (animateIds && animateIds[n.id]) {
          el.classList.add("appear");
          el.style.animationDelay = (animateIds[n.id] * 22) + "ms";
        }
      }
      var kids = childrenOf[n.id] || [];
      el.style.setProperty("--hue", hueOf(n));
      el.style.left = geom[n.id].x + "px";
      el.style.top = geom[n.id].y + "px";
      el.classList.toggle("done", !!state.done[n.id]);
      el.classList.toggle("active", state.active === n.id);
      el.innerHTML =
        (n.id === "root" ? "" : '<span class="code">' + n.code + '</span>') +
        '<span class="name">' + L(n.t) + "</span>" +
        (n.p === "root" ? '<span class="count">' + kids.length + " " + t("card") +
            (state.open === n.id ? " ·" : " +") + "</span>" : "") +
        '<span class="tick" aria-hidden="true">✓</span>';
      el.setAttribute("aria-label", L(n.t) + " — " + strip(L(n.lead)));
    });

    drawLinks();
  }

  function drawLinks() {
    var casings = [], lines = [];
    visibleNodes().forEach(function (n) {
      if (!n.p || !geom[n.p]) return;
      var a = geom[n.p], b = geom[n.id];
      var ua = { x: Math.cos(a.ang * Math.PI / 180), y: Math.sin(a.ang * Math.PI / 180) };
      var ub = { x: Math.cos(b.ang * Math.PI / 180), y: Math.sin(b.ang * Math.PI / 180) };
      if (n.p === "root") { ua = ub; }
      var d = Math.hypot(b.x - a.x, b.y - a.y);
      var f = d * 0.38;
      var path = "M" + a.x + " " + a.y +
                 " C" + (a.x + ua.x * f) + " " + (a.y + ua.y * f) +
                 " " + (b.x - ub.x * f) + " " + (b.y - ub.y * f) +
                 " " + b.x + " " + b.y;
      var on = state.open && (n.p === state.open || n.id === state.open);
      casings.push('<path class="casing" d="' + path + '"/>');
      lines.push('<path class="' + (on ? "on" : "") + '" style="--edge:' + hueOf(n) + '" d="' + path + '"/>');
    });
    svg.innerHTML = casings.join("") + lines.join("");
  }

  /* =========================== PAN & ZOOM =========================== */

  var view = { x: 0, y: 0, k: 1 };
  var MINK = 0.28, MAXK = 2.4;

  function applyView() {
    world.style.transform = "translate(" + view.x + "px," + view.y + "px) scale(" + view.k + ")";
  }

  function panelWidth() {
    return (!panel.hidden && window.innerWidth >= 900) ? 442 : 0;
  }
  function bottomInset() {
    return (!panel.hidden && window.innerWidth < 900) ? viewport.clientHeight * 0.45 : 0;
  }

  function fitTo(ids, animate) {
    var pts = (ids || visibleNodes().map(function (n) { return n.id; })).filter(function (i) { return geom[i]; });
    if (!pts.length) return;
    var minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    pts.forEach(function (id) {
      var el = nodeEls[id];
      var hw = el ? el.offsetWidth / 2 + 14 : 110;
      var hh = el ? el.offsetHeight / 2 + 14 : 40;
      minX = Math.min(minX, geom[id].x - hw); maxX = Math.max(maxX, geom[id].x + hw);
      minY = Math.min(minY, geom[id].y - hh); maxY = Math.max(maxY, geom[id].y + hh);
    });
    var availW = viewport.clientWidth - panelWidth() - 40;
    var availH = viewport.clientHeight - bottomInset() - 40;
    var k = Math.min(availW / (maxX - minX), availH / (maxY - minY));
    k = Math.max(MINK, Math.min(MAXK, k));
    var cx = (minX + maxX) / 2, cy = (minY + maxY) / 2;
    var target = {
      k: k,
      x: (availW / 2 + 20) - cx * k,
      y: (availH / 2 + 20) - cy * k
    };
    if (animate === false) applyTransform(target); else tweenView(target);
  }

  function applyTransform(v) { view.x = v.x; view.y = v.y; view.k = v.k; applyView(); }

  var tween = null;
  function tweenView(target) {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) { applyTransform(target); return; }
    if (tween) cancelAnimationFrame(tween);
    var from = { x: view.x, y: view.y, k: view.k }, t0 = performance.now(), dur = 420;
    (function step(now) {
      var p = Math.min(1, (now - t0) / dur);
      var e = 1 - Math.pow(1 - p, 3);
      applyTransform({
        x: from.x + (target.x - from.x) * e,
        y: from.y + (target.y - from.y) * e,
        k: from.k + (target.k - from.k) * e
      });
      if (p < 1) tween = requestAnimationFrame(step);
    })(t0);
  }

  function centerOn(id, k, animate) {
    if (!geom[id]) return;
    k = Math.max(MINK, Math.min(MAXK, k));
    var availW = viewport.clientWidth - panelWidth();
    var availH = viewport.clientHeight - bottomInset();
    var target = { k: k, x: availW / 2 - geom[id].x * k, y: availH / 2 - geom[id].y * k };
    if (animate === false) applyTransform(target); else tweenView(target);
  }

  function zoomAt(cx, cy, factor) {
    var k = Math.max(MINK, Math.min(MAXK, view.k * factor));
    var r = k / view.k;
    view.x = cx - (cx - view.x) * r;
    view.y = cy - (cy - view.y) * r;
    view.k = k;
    applyView();
  }

  // trascinamento e pizzico
  var pointers = new Map(), dragStart = null, pinchStart = null, moved = false;

  viewport.addEventListener("pointerdown", function (e) {
    dismissHint();
    if (e.target.closest(".node, .zoom, .legend")) return;
    viewport.setPointerCapture(e.pointerId);
    pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
    moved = false;
    if (pointers.size === 1) {
      dragStart = { x: e.clientX - view.x, y: e.clientY - view.y };
      viewport.classList.add("grabbing");
    } else if (pointers.size === 2) {
      var p = [...pointers.values()];
      pinchStart = {
        dist: Math.hypot(p[0].x - p[1].x, p[0].y - p[1].y),
        k: view.k,
        mid: { x: (p[0].x + p[1].x) / 2, y: (p[0].y + p[1].y) / 2 },
        vx: view.x, vy: view.y
      };
      dragStart = null;
    }
  });

  viewport.addEventListener("pointermove", function (e) {
    if (!pointers.has(e.pointerId)) return;
    pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
    moved = true;
    if (pointers.size === 2 && pinchStart) {
      var p = [...pointers.values()];
      var dist = Math.hypot(p[0].x - p[1].x, p[0].y - p[1].y);
      var k = Math.max(MINK, Math.min(MAXK, pinchStart.k * (dist / pinchStart.dist)));
      var rect = viewport.getBoundingClientRect();
      var mx = pinchStart.mid.x - rect.left, my = pinchStart.mid.y - rect.top;
      var r = k / pinchStart.k;
      view.k = k;
      view.x = mx - (mx - pinchStart.vx) * r;
      view.y = my - (my - pinchStart.vy) * r;
      applyView();
    } else if (dragStart) {
      view.x = e.clientX - dragStart.x;
      view.y = e.clientY - dragStart.y;
      applyView();
    }
  });

  function endPointer(e) {
    pointers.delete(e.pointerId);
    if (pointers.size < 2) pinchStart = null;
    if (pointers.size === 0) { dragStart = null; viewport.classList.remove("grabbing"); }
  }
  viewport.addEventListener("pointerup", endPointer);
  viewport.addEventListener("pointercancel", endPointer);

  viewport.addEventListener("wheel", function (e) {
    e.preventDefault();
    var rect = viewport.getBoundingClientRect();
    zoomAt(e.clientX - rect.left, e.clientY - rect.top, e.deltaY < 0 ? 1.12 : 1 / 1.12);
  }, { passive: false });

  document.getElementById("zin").onclick = function () { zoomAt(viewport.clientWidth / 2, viewport.clientHeight / 2, 1.25); };
  document.getElementById("zout").onclick = function () { zoomAt(viewport.clientWidth / 2, viewport.clientHeight / 2, 1 / 1.25); };
  document.getElementById("zfit").onclick = function () { fitTo(null, true); };

  /* ============================ PANNELLO ============================ */

  function renderBody(n) {
    var out = "";
    (n.body || []).forEach(function (b) {
      if (b.p) out += "<p>" + L(b.p) + "</p>";
      else if (b.ul) {
        out += "<ul>" + b.ul.map(function (i) { return "<li>" + L(i) + "</li>"; }).join("") + "</ul>";
      } else if (b.kv) {
        out += '<div class="kv">' + b.kv.map(function (i) {
          return '<div><span class="k">' + L(i.k) + '</span><span class="v">' + L(i.v) + "</span></div>";
        }).join("") + "</div>";
      } else if (b.warn) {
        out += '<div class="note">' + L(b.warn) + "</div>";
      }
    });
    return out;
  }

  function siblings(n) {
    if (!n.p) return [];
    return childrenOf[n.p] || [];
  }

  function openPanel(id) {
    var n = byId[id];
    if (!n) return;
    var sib = siblings(n);
    var idx = sib.indexOf(n);
    var hue = hueOf(n);
    var b = n.p === "root" ? n : branchOf(n);

    panel.style.setProperty("--hue", hue);
    panel.innerHTML =
      '<div class="grip"></div>' +
      '<div class="phead">' +
        '<button class="close" id="p-close" aria-label="' + t("close") + '">' + ICON.close + "</button>" +
        '<span class="eyebrow"><span class="dot"></span>' +
          (n.id === "root" ? L(MAPPA.meta.title) : n.code + (b && b !== n ? " · " + L(b.t) : "")) +
        "</span>" +
        "<h2>" + L(n.t) + "</h2>" +
        '<p class="alt">' + n.t[other()] + "</p>" +
        '<p class="lead">' + L(n.lead) + "</p>" +
      "</div>" +
      '<div class="pbody">' + renderBody(n) +
        ((n.links && n.links.length)
          ? '<p class="sechead">' + t("deepen") + "</p>" +
            '<div class="links-list">' + n.links.map(function (l) {
              return '<a href="' + l.u + '" target="_blank" rel="noopener noreferrer">' + ICON.ext + "<span>" + l.l + "</span></a>";
            }).join("") + "</div>"
          : "") +
      "</div>" +
      '<div class="pfoot">' +
        '<button class="mark" id="p-mark" aria-pressed="' + (state.done[id] ? "true" : "false") + '">' +
          ICON.check + "<span>" + (state.done[id] ? t("isDone") : t("markDone")) + "</span></button>" +
        '<div class="nav-sib">' +
          '<button id="p-prev" aria-label="' + t("prev") + '"' + (idx > 0 ? "" : " disabled") + ">" + ICON.left + "</button>" +
          '<button id="p-next" aria-label="' + t("next") + '"' + (idx > -1 && idx < sib.length - 1 ? "" : " disabled") + ">" + ICON.right + "</button>" +
        "</div>" +
      "</div>";

    panel.hidden = false;
    panel.querySelector(".pbody").scrollTop = 0;
    attachSheetDrag();
    document.getElementById("p-close").onclick = closePanel;
    document.getElementById("p-mark").onclick = function () { toggleDone(id); };
    var prev = document.getElementById("p-prev"), next = document.getElementById("p-next");
    if (prev && !prev.disabled) prev.onclick = function () { activate(sib[idx - 1].id, true); };
    if (next && !next.disabled) next.onclick = function () { activate(sib[idx + 1].id, true); };
  }

  function attachSheetDrag() {
    if (window.innerWidth >= 900) return;
    var head = panel.querySelector(".phead"), grip = panel.querySelector(".grip");
    var startY = null;
    function down(e) {
      if (e.target.closest(".close")) return;
      startY = e.clientY;
      panel.style.transition = "none";
      try { e.currentTarget.setPointerCapture(e.pointerId); } catch (err) { /* niente capture */ }
    }
    function move(e) {
      if (startY === null) return;
      var dy = Math.max(0, e.clientY - startY);
      panel.style.transform = "translateY(" + dy + "px)";
    }
    function up(e) {
      if (startY === null) return;
      var dy = e.clientY - startY;
      panel.style.transition = "";
      panel.style.transform = "";
      startY = null;
      if (dy > 90) closePanel();
    }
    [head, grip].forEach(function (el) {
      if (!el) return;
      el.addEventListener("pointerdown", down);
      el.addEventListener("pointermove", move);
      el.addEventListener("pointerup", up);
      el.addEventListener("pointercancel", up);
    });
  }

  function closePanel() {
    panel.hidden = true;
    panel.style.transform = "";
    state.active = null;
    if (state.view === "map") drawNodes();
    renderOutline();
  }

  function toggleDone(id) {
    if (state.done[id]) delete state.done[id]; else state.done[id] = true;
    save();
    if (state.active === id) openPanel(id);
    if (state.view === "map") drawNodes(); else renderOutline();
    updateProgress();
  }

  /* =========================== ATTIVAZIONE =========================== */

  function activate(id, focus) {
    var n = byId[id];
    if (!n) return;
    state.active = id;
    dismissHint();

    if (state.view === "map") {
      var animate = null;
      if (n.id === "root") {
        state.open = null;
      } else if (n.p === "root") {
        var order = {};
        if (state.open === n.id) {
          state.open = null;
        } else {
          state.open = n.id;
          (childrenOf[n.id] || []).forEach(function (k, i) { order[k.id] = i; });
        }
        animate = order;
      } else {
        var b = branchOf(n);
        if (b && state.open !== b.id) {
          state.open = b.id;
          animate = {};
          (childrenOf[b.id] || []).forEach(function (k, i) { animate[k.id] = i; });
        }
      }
      layout();
      drawNodes(animate);
      openPanel(id);
      if (focus !== false) {
        requestAnimationFrame(function () {
          if (compact()) {
            // su schermo stretto un ventaglio intero diventa illeggibile:
            // meglio centrare la voce aperta a una scala comoda e lasciar scorrere
            centerOn(n.id === "root" ? "root" : n.id, n.p === "root" || n.id === "root" ? 0.85 : 1);
          } else if (n.id === "root") {
            fitTo(null, true);
          } else {
            var b2 = n.p === "root" ? n : branchOf(n);
            var set = ["root", b2.id].concat((childrenOf[b2.id] || []).map(function (k) { return k.id; }));
            fitTo(set, true);
          }
        });
      }
    } else {
      openPanel(id);
      renderOutline();
    }
  }

  /* ============================= INDICE ============================= */

  function renderOutline() {
    outline.innerHTML =
      '<div class="wrap">' +
        '<p class="intro">' + t("introOutline") + "</p>" +
        branches.map(function (b) {
          var kids = childrenOf[b.id] || [];
          return '<section class="branchcard" style="--hue:' + hueOf(b) + '">' +
            '<span class="eyebrow">' + b.code + " · " + b.t[other()] + "</span>" +
            '<h2><button class="branchtitle" data-id="' + b.id + '">' + L(b.t) + "</button></h2>" +
            "<p>" + L(b.lead) + "</p>" +
            '<div class="olist">' +
              kids.map(function (k) {
                return '<button data-id="' + k.id + '" class="' + (state.done[k.id] ? "done" : "") + '">' +
                  '<span class="c">' + k.code + '</span><span class="n">' + L(k.t) + "</span></button>";
              }).join("") +
            "</div>" +
          "</section>";
        }).join("") +
        '<p class="colophon">' + t("colophon") + "</p>" +
      "</div>";

    outline.querySelectorAll("[data-id]").forEach(function (b) {
      b.onclick = function () { activate(b.dataset.id); };
    });
  }

  /* ============================= RICERCA ============================= */

  function haystack(n) {
    var s = [n.code, L(n.t), n.t[other()], strip(L(n.lead))];
    (n.body || []).forEach(function (b) {
      if (b.p) s.push(strip(L(b.p)));
      if (b.ul) b.ul.forEach(function (i) { s.push(strip(L(i))); });
      if (b.kv) b.kv.forEach(function (i) { s.push(strip(L(i.k)), strip(L(i.v))); });
      if (b.warn) s.push(strip(L(b.warn)));
    });
    return s.join(" ").toLowerCase();
  }

  function runSearch(q) {
    q = q.trim().toLowerCase();
    if (q.length < 2) { results.innerHTML = ""; return; }
    var hits = N.filter(function (n) { return haystack(n).indexOf(q) > -1; }).slice(0, 14);
    results.innerHTML = hits.length
      ? hits.map(function (n) {
          return '<button data-id="' + n.id + '"><span class="rc">' + n.code + "</span> " +
            '<span class="rt">' + L(n.t) + "</span>" +
            '<span class="rl">' + strip(L(n.lead)) + "</span></button>";
        }).join("")
      : '<button disabled><span class="rl">—</span></button>';
    results.querySelectorAll("[data-id]").forEach(function (b) {
      b.onclick = function () {
        activate(b.dataset.id);
        results.innerHTML = "";
        qInput.value = "";
        qInput.blur();
      };
    });
  }

  qInput.addEventListener("input", function () { runSearch(qInput.value); });
  qInput.addEventListener("keydown", function (e) {
    if (e.key === "Escape") { results.innerHTML = ""; qInput.value = ""; qInput.blur(); }
  });
  document.addEventListener("click", function (e) {
    if (!e.target.closest(".search")) results.innerHTML = "";
  });

  /* ============================= LEGENDA ============================= */

  function renderLegend() {
    document.getElementById("legend").innerHTML =
      "<h3>" + t("areas") + "</h3><ul>" +
      branches.map(function (b) {
        return '<li><span class="sw" style="background:' + hueOf(b) + '"></span>' + b.code + ". " + L(b.t) + "</li>";
      }).join("") + "</ul>";
  }

  /* =========================== PROGRESSO =========================== */

  function updateProgress() {
    var total = N.length - 1;
    var done = Object.keys(state.done).filter(function (id) { return byId[id]; }).length;
    document.getElementById("bar-fill").style.width = (done / total * 100) + "%";
    document.querySelector(".brand .sub").textContent =
      done ? done + "/" + total + " " + t("progress") : t("subtitle");
  }

  /* ============================ COMANDI ============================ */

  function setLang(l) {
    state.lang = l;
    save();
    document.documentElement.lang = l;
    document.getElementById("lang-it").setAttribute("aria-pressed", String(l === "it"));
    document.getElementById("lang-en").setAttribute("aria-pressed", String(l === "en"));
    renderChrome();
    if (state.view === "map") drawNodes();
    renderOutline();
    if (state.active) openPanel(state.active);
    updateProgress();
  }

  function setMode(v) {
    state.view = v;
    save();
    viewport.classList.toggle("hidden", v !== "map");
    outline.classList.toggle("hidden", v !== "outline");
    var btn = document.getElementById("view-toggle");
    btn.innerHTML = (v === "map" ? ICON.list : ICON.map) + "<span>" + (v === "map" ? t("outline") : t("map")) + "</span>";
    btn.setAttribute("aria-pressed", String(v === "outline"));
    if (v === "map") {
      layout(); drawNodes();
      requestAnimationFrame(function () {
        if (compact()) centerOn(state.open || "root", state.open ? 0.85 : 0.8, false);
        else fitTo(null, false);
      });
    }
  }

  function setTheme(th) {
    state.theme = th;
    save();
    if (th) document.documentElement.setAttribute("data-theme", th);
    else document.documentElement.removeAttribute("data-theme");
    var dark = th === "dark" || (!th && window.matchMedia("(prefers-color-scheme: dark)").matches);
    document.getElementById("theme-toggle").innerHTML = dark ? ICON.sun : ICON.moon;
  }

  function renderChrome() {
    document.querySelector(".brand h1").textContent = L(MAPPA.meta.title);
    qInput.placeholder = t("search");
    qInput.setAttribute("aria-label", t("search"));
    document.getElementById("hint").textContent = t("openHint");
    var btn = document.getElementById("view-toggle");
    btn.innerHTML = (state.view === "map" ? ICON.list : ICON.map) +
      "<span>" + (state.view === "map" ? t("outline") : t("map")) + "</span>";
    renderLegend();
  }

  document.getElementById("lang-it").onclick = function () { setLang("it"); };
  document.getElementById("lang-en").onclick = function () { setLang("en"); };
  document.getElementById("view-toggle").onclick = function () {
    setMode(state.view === "map" ? "outline" : "map");
    renderChrome();
  };
  document.getElementById("theme-toggle").onclick = function () {
    var dark = state.theme === "dark" ||
      (!state.theme && window.matchMedia("(prefers-color-scheme: dark)").matches);
    setTheme(dark ? "light" : "dark");
  };

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && !panel.hidden) closePanel();
    if (e.key === "/" && document.activeElement !== qInput) { e.preventDefault(); qInput.focus(); }
  });

  var resizeTimer;
  window.addEventListener("resize", function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () {
      if (state.view !== "map") return;
      layout(); drawNodes();
      fitTo(state.open ? ["root", state.open].concat((childrenOf[state.open] || []).map(function (k) { return k.id; })) : null, false);
    }, 180);
  });

  /* ============================== AVVIO ============================== */

  setTheme(state.theme);
  document.documentElement.lang = state.lang;
  document.getElementById("lang-it").setAttribute("aria-pressed", String(state.lang === "it"));
  document.getElementById("lang-en").setAttribute("aria-pressed", String(state.lang === "en"));
  renderChrome();
  layout();
  drawNodes();
  renderOutline();
  setMode(state.view);
  updateProgress();
  requestAnimationFrame(function () {
    if (compact()) centerOn("root", 0.8, false); else fitTo(null, false);
  });
})();
