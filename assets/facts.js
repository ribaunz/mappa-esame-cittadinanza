/* ============================================================
   Life in the UK Facts — foglio di ripasso stampabile
   Solo i cinque capitoli del manuale ufficiale: ogni fatto
   esaminabile, impaginato su quante pagine servono.
   ============================================================ */

(function () {
  "use strict";

  var CHAPTERS = ["ch1", "ch2", "ch3", "ch4", "ch5"];
  var byId = {};
  MAPPA.nodes.forEach(function (n) { byId[n.id] = n; });
  var kids = {};
  MAPPA.nodes.forEach(function (n) { if (n.p) (kids[n.p] = kids[n.p] || []).push(n); });

  var COPY = {
    en: {
      kicker: "Revision sheet · Life in the UK Test · the 3rd-edition handbook · August 2026",
      title: "Life in the UK",
      titleSub: "The facts you have to know",
      note: "Every examinable fact from the <b>five chapters of the official handbook</b> — the only source the 24 questions are drawn from. The application process is deliberately left out: this sheet is the knowledge, not the paperwork. Facts follow the handbook, including where the country has since moved on.",
      run: "Life in the UK Test · revision sheet",
      foot: "Life in the United Kingdom — A Guide for New Residents, 3rd edition (2013) · gov.uk/life-in-the-uk-test",
      pg: "Page", of: "of", cont: "cont.",
      facts: "facts", print: "Print", fit: "Fit", full: "100%",
      hint: "Print A4 portrait (or A3 for fewer, denser pages), borderless, with background graphics on."
    },
    it: {
      kicker: "Foglio di ripasso · Life in the UK Test · manuale di 3ª edizione · agosto 2026",
      title: "Life in the UK",
      titleSub: "I fatti che devi sapere",
      note: "Tutti i fatti esaminabili dei <b>cinque capitoli del manuale ufficiale</b>, l'unica fonte da cui escono le 24 domande. La procedura di domanda è esclusa apposta: qui c'è la conoscenza, non la burocrazia. I fatti seguono il manuale, anche dove il paese è nel frattempo cambiato.",
      run: "Life in the UK Test · foglio di ripasso",
      foot: "Life in the United Kingdom — A Guide for New Residents, 3ª edizione (2013) · gov.uk/life-in-the-uk-test",
      pg: "Pagina", of: "di", cont: "segue",
      facts: "fatti", print: "Stampa", fit: "Adatta", full: "100%",
      hint: "Stampa in A4 verticale (o A3 per meno pagine, più dense), senza margini e con la grafica di sfondo attiva."
    }
  };

  var state = { lang: "en", size: "a4", zoom: "fit" };
  function L(o) { return o ? (o[state.lang] || o.en || o.it) : ""; }
  function alt() { return state.lang === "en" ? "it" : "en"; }
  function c(k) { return COPY[state.lang][k]; }

  /* ------------------- i blocchi da impaginare ------------------- */

  function buildBlocks() {
    var out = [];
    CHAPTERS.forEach(function (id) {
      var ch = byId[id];
      out.push({ kind: "chapter", hue: id, html:
        '<div class="chapter" style="--hue:var(--c-' + id + ')">' +
          '<span class="n">' + ch.code + " · " + L(ch.t) + "</span>" +
          "<h2>" + (state.lang === "en" ? ch.t.en : ch.t.it) + "</h2>" +
          '<span class="it">' + ch.t[alt()] + "</span></div>" });

      (kids[id] || []).forEach(function (k) {
        var head = function (cont) {
          return '<div class="topic" style="--hue:var(--c-' + id + ')"><h3>' +
            '<span class="code">' + k.code + "</span>" + L(k.t) +
            (cont ? ' <span class="cont">(' + c("cont") + ")</span>" : "") + "</h3></div>";
        };
        out.push({ kind: "topic", group: k.id, hue: id, html: head(false), cont: head(true) });

        (k.body || []).forEach(function (b) {
          if (b.p) out.push(item(id, k.id, '<p class="fact p">' + L(b.p) + "</p>"));
          if (b.warn) out.push(item(id, k.id, '<p class="fact warn">' + L(b.warn) + "</p>"));
          (b.ul || []).forEach(function (i) {
            out.push(item(id, k.id, '<p class="fact li">' + L(i) + "</p>"));
          });
          (b.kv || []).forEach(function (i) {
            out.push(item(id, k.id, '<p class="fact kv"><span class="k">' + L(i.k) + "</span> " + L(i.v) + "</p>"));
          });
        });
      });
    });
    return out;
  }

  function item(hue, group, html) {
    return { kind: "item", group: group, hue: hue, html: '<div style="--hue:var(--c-' + hue + ')">' + html + "</div>" };
  }

  /* ------------------------ impaginazione ------------------------ */

  var pagesEl = document.getElementById("pages");

  function newSheet(index, total) {
    var sheet = document.createElement("article");
    sheet.className = "sheet";
    sheet.innerHTML =
      (index === 0 ? masthead() : runhead()) +
      '<div class="cols"></div>' +
      '<div class="foot"><span>' + c("foot") + '</span><span class="pg"></span></div>';
    pagesEl.appendChild(sheet);
    var cols = sheet.querySelector(".cols");
    var n = parseInt(getComputedStyle(sheet).getPropertyValue("--ncol"), 10) || 3;
    for (var i = 0; i < n; i++) cols.appendChild(document.createElement("div")).className = "col";
    void total;
    return sheet;
  }

  function masthead() {
    var counts = CHAPTERS.map(function (id) {
      var n = 0;
      (kids[id] || []).forEach(function (k) {
        (k.body || []).forEach(function (b) {
          n += (b.ul ? b.ul.length : 0) + (b.kv ? b.kv.length : 0) + (b.p ? 1 : 0) + (b.warn ? 1 : 0);
        });
      });
      return n;
    });
    return '<header class="masthead">' +
      '<span class="kicker">' + c("kicker") + "</span>" +
      '<div class="row">' +
        "<h1>" + c("title") + "<span>" + c("titleSub") + "</span></h1>" +
        '<p class="note">' + c("note") + "</p>" +
        '<div class="legend">' + CHAPTERS.map(function (id, i) {
          return '<div><span class="sw" style="background:var(--c-' + id + ')"></span>' +
            '<span class="lb">' + byId[id].code + ". " + shortTitle(byId[id]) + "</span>" +
            '<span class="ct">' + counts[i] + " " + c("facts") + "</span></div>";
        }).join("") + "</div>" +
      "</div></header>";
  }

  function shortTitle(n) {
    return L(n.t).replace(/^(Cap\.|Ch\.)\s*\d+\s*—\s*/, "");
  }

  function runhead() {
    return '<div class="runhead"><b>' + c("title") + "</b><span>" + c("run") + "</span>" +
      '<span class="r">' + MAPPA.meta.updated + "</span></div>";
  }

  function paginate() {
    pagesEl.innerHTML = "";
    var blocks = buildBlocks();
    var sheet = newSheet(0);
    var cols = [].slice.call(sheet.querySelectorAll(".col"));
    var ci = 0;
    var lastGroup = null;
    var pending = null;   // titolo appena inserito, ancora senza fatti sotto

    function col() { return cols[ci]; }
    function fits(el) { return el.scrollHeight <= el.clientHeight + 0.5; }

    function advance() {
      // un titolo rimasto solo in fondo alla colonna scende con i suoi fatti
      var last = col().lastElementChild;
      if (last && (last.classList.contains("topic") || last.classList.contains("chapter"))) {
        col().removeChild(last);
        pending = last.outerHTML;
      }
      ci++;
      if (ci >= cols.length) {
        sheet = newSheet(pagesEl.children.length);
        cols = [].slice.call(sheet.querySelectorAll(".col"));
        ci = 0;
      }
      if (pending) { col().insertAdjacentHTML("beforeend", pending); pending = null; }
    }

    blocks.forEach(function (b) {
      // se un argomento riprende in una nuova colonna, si ripete il titolo
      if (b.kind === "item" && b.group !== lastGroup && col().children.length === 0) {
        var t = blocks.find(function (x) { return x.kind === "topic" && x.group === b.group; });
        if (t) col().insertAdjacentHTML("beforeend", t.cont);
      }
      col().insertAdjacentHTML("beforeend", b.html);
      if (!fits(col())) {
        var justAdded = col().lastElementChild;
        col().removeChild(justAdded);
        advance();
        if (b.kind === "item") {
          var t2 = blocks.find(function (x) { return x.kind === "topic" && x.group === b.group; });
          if (t2 && col().children.length === 0) col().insertAdjacentHTML("beforeend", t2.cont);
        }
        col().insertAdjacentHTML("beforeend", b.html);
      }
      if (b.kind === "item") lastGroup = b.group;
      if (b.kind === "topic") lastGroup = b.group;
    });

    // numerazione finale
    var sheets = pagesEl.querySelectorAll(".sheet");
    sheets.forEach(function (s, i) {
      s.querySelector(".pg").textContent = c("pg") + " " + (i + 1) + " " + c("of") + " " + sheets.length;
    });
    document.getElementById("c-meta").textContent =
      (state.size === "a4" ? "A4" : "A3") + " · " + sheets.length + (state.lang === "en" ? " pages" : " pagine");
  }

  /* --------------------------- interfaccia --------------------------- */

  var app = document.getElementById("app");
  app.innerHTML =
    '<div class="controls">' +
      '<span class="title">Life in the UK Facts <small id="c-meta"></small></span>' +
      '<div class="seg"><button class="ctl" id="lang-en">EN</button><button class="ctl" id="lang-it">IT</button></div>' +
      '<div class="seg"><button class="ctl" id="s-a4">A4</button><button class="ctl" id="s-a3">A3</button></div>' +
      '<div class="seg"><button class="ctl" id="z-fit"></button><button class="ctl" id="z-full"></button></div>' +
      '<button class="ctl primary" id="do-print"></button>' +
    "</div>" +
    '<p class="deskhint" id="hint"></p>' +
    '<div class="desk"><div class="scaler" id="scaler"><div class="pages" id="pages" data-size="a4"></div></div></div>';

  pagesEl = document.getElementById("pages");
  var scaler = document.getElementById("scaler");
  var pageStyle = document.createElement("style");
  document.head.appendChild(pageStyle);

  function applyZoom() {
    var sheet = pagesEl.querySelector(".sheet");
    if (!sheet) return;
    var natural = sheet.offsetWidth;
    var avail = document.querySelector(".desk").clientWidth - 28;
    var k = state.zoom === "fit" ? Math.min(1, avail / natural) : 1;
    scaler.style.transform = "scale(" + k + ")";
    scaler.style.height = (scaler.scrollHeight * k) + "px";
    document.getElementById("z-fit").setAttribute("aria-pressed", String(state.zoom === "fit"));
    document.getElementById("z-full").setAttribute("aria-pressed", String(state.zoom === "full"));
  }

  function setSize(sz) {
    state.size = sz;
    pagesEl.dataset.size = sz;
    pageStyle.textContent = "@page { size: " + (sz === "a3" ? "A3 landscape" : "A4 portrait") + "; margin: 0; }";
    document.getElementById("s-a4").setAttribute("aria-pressed", String(sz === "a4"));
    document.getElementById("s-a3").setAttribute("aria-pressed", String(sz === "a3"));
    paginate();
    applyZoom();
  }

  function setLang(l) {
    state.lang = l;
    document.documentElement.lang = l;
    document.getElementById("lang-en").setAttribute("aria-pressed", String(l === "en"));
    document.getElementById("lang-it").setAttribute("aria-pressed", String(l === "it"));
    labels();
    paginate();
    applyZoom();
  }

  function labels() {
    document.getElementById("z-fit").textContent = c("fit");
    document.getElementById("z-full").textContent = c("full");
    document.getElementById("do-print").textContent = c("print");
    document.getElementById("hint").textContent = c("hint");
  }

  document.getElementById("lang-en").onclick = function () { setLang("en"); };
  document.getElementById("lang-it").onclick = function () { setLang("it"); };
  document.getElementById("s-a4").onclick = function () { setSize("a4"); };
  document.getElementById("s-a3").onclick = function () { setSize("a3"); };
  document.getElementById("z-fit").onclick = function () { state.zoom = "fit"; applyZoom(); };
  document.getElementById("z-full").onclick = function () { state.zoom = "full"; applyZoom(); };
  document.getElementById("do-print").onclick = function () { window.print(); };

  var rt;
  window.addEventListener("resize", function () { clearTimeout(rt); rt = setTimeout(applyZoom, 150); });

  document.getElementById("lang-en").setAttribute("aria-pressed", "true");
  document.getElementById("lang-it").setAttribute("aria-pressed", "false");
  labels();
  setSize("a4");
  if (document.fonts) document.fonts.ready.then(function () { paginate(); applyZoom(); });
})();
