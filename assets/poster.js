/* ============================================================
   Bussola della Cittadinanza — poster stampabile
   Compone in un solo foglio i 63 nodi della mappa, più una fascia
   di numeri e date da ripasso. Nessuna dipendenza esterna.
   ============================================================ */

(function () {
  "use strict";

  var N = MAPPA.nodes;
  var byId = {};
  N.forEach(function (n) { byId[n.id] = n; });
  var branches = N.filter(function (n) { return n.p === "root"; });
  var kids = {};
  N.forEach(function (n) { if (n.p) (kids[n.p] = kids[n.p] || []).push(n); });

  /* -------------------- fascia di ripasso -------------------- */

  var TIMELINE = [
    ["43 d.C.", "Claudio conquista la Britannia", "Claudius conquers Britain"],
    ["1066", "Hastings: Guglielmo il Conquistatore", "Hastings: William the Conqueror"],
    ["1215", "Magna Carta", "Magna Carta"],
    ["1348", "Peste Nera", "The Black Death"],
    ["1485", "Bosworth: iniziano i Tudor", "Bosworth: the Tudors begin"],
    ["1534", "Nasce la Church of England", "The Church of England is founded"],
    ["1588", "Sconfitta dell'Armada spagnola", "The Spanish Armada defeated"],
    ["1649", "Carlo I giustiziato", "Charles I executed"],
    ["1689", "Bill of Rights", "Bill of Rights"],
    ["1707", "Act of Union: Gran Bretagna", "Act of Union: Great Britain"],
    ["1801", "Unione con l'Irlanda", "Union with Ireland"],
    ["1805/15", "Trafalgar e Waterloo", "Trafalgar and Waterloo"],
    ["1833", "Abolizione della schiavitù", "Slavery abolished"],
    ["1928", "Voto alle donne a 21 anni", "Equal votes for women at 21"],
    ["1944", "D-Day, 6 giugno", "D-Day, 6 June"],
    ["1948", "Nasce l'NHS · Windrush", "The NHS founded · Windrush"],
    ["1979", "Thatcher, prima donna PM", "Thatcher, first woman PM"],
    ["1998", "Good Friday Agreement e devolution", "Good Friday Agreement and devolution"]
  ];

  var FACTS = [
    {
      h: { it: "L'esame in numeri", en: "The exam in numbers" },
      rows: [
        ["24", { it: "domande a scelta multipla", en: "multiple-choice questions" }],
        ["45 min", { it: "di tempo", en: "to answer" }],
        ["18/24", { it: "<b>soglia: 75%</b> — puoi sbagliarne 6", en: "<b>pass mark: 75%</b> — six may be wrong" }],
        ["£50", { it: "per tentativo, non rimborsabili", en: "per attempt, non-refundable" }],
        ["7 gg", { it: "di attesa fra un tentativo e l'altro", en: "wait between attempts" }],
        ["3 gg", { it: "di anticipo minimo per prenotare", en: "minimum notice to book" }],
        ["&lt;18 · 65+", { it: "esenti dal test e dall'inglese", en: "exempt from test and English" }],
        ["2013", { it: "manuale di 3ª edizione: unica fonte", en: "3rd-edition handbook: the only source" }]
      ]
    },
    {
      h: { it: "La domanda in numeri", en: "The application in numbers" },
      rows: [
        ["5 anni", { it: "residenza · max <b>450 giorni</b> fuori", en: "residence · max <b>450 days</b> away" }],
        ["3 anni", { it: "se coniuge · max <b>270 giorni</b>", en: "if a spouse · max <b>270 days</b>" }],
        ["90 gg", { it: "massimo nell'ultimo anno", en: "maximum in the final year" }],
        ["12 mesi", { it: "di ILR prima di fare domanda", en: "holding ILR before applying" }],
        ["B1", { it: "inglese · <b>B2 dal 26.3.2027</b>", en: "English · <b>B2 from 26.3.2027</b>" }],
        ["~£1.839", { it: "tassa 2026, cerimonia inclusa", en: "2026 fee, ceremony included" }],
        ["3 mesi", { it: "per la cerimonia dopo l'invito", en: "to attend the ceremony after the invitation" }]
      ]
    },
    {
      h: { it: "Istituzioni in cifre", en: "Institutions in figures" },
      rows: [
        ["650", { it: "MP alla Camera dei Comuni", en: "MPs in the House of Commons" }],
        ["129", { it: "MSP al Parlamento scozzese", en: "MSPs in the Scottish Parliament" }],
        ["60", { it: "membri del Senedd gallese", en: "members of the Welsh Senedd" }],
        ["90", { it: "MLA all'Assemblea nordirlandese", en: "MLAs in the NI Assembly" }],
        ["12 · 15", { it: "giurati: Inghilterra · Scozia", en: "jurors: England · Scotland" }],
        ["18 · 16", { it: "voto: politiche · devolute SCO/WAL", en: "voting: general · devolved SCO/WAL" }],
        ["5 anni", { it: "intervallo massimo fra elezioni", en: "maximum gap between elections" }]
      ]
    },
    {
      h: { it: "Le quattro nazioni", en: "The four nations" },
      rows: [
        ["Inghilterra", { it: "Londra · <b>St George, 23 apr</b> · rosa", en: "London · <b>St George, 23 Apr</b> · rose" }],
        ["Scozia", { it: "Edimburgo · <b>St Andrew, 30 nov</b> · cardo", en: "Edinburgh · <b>St Andrew, 30 Nov</b> · thistle" }],
        ["Galles", { it: "Cardiff · <b>St David, 1 mar</b> · narciso", en: "Cardiff · <b>St David, 1 Mar</b> · daffodil" }],
        ["Irl. del Nord", { it: "Belfast · <b>St Patrick, 17 mar</b> · trifoglio", en: "Belfast · <b>St Patrick, 17 Mar</b> · shamrock" }],
        ["Union Flag", { it: "tre croci: Giorgio, Andrea, Patrizio — <b>il Galles non c'è</b>", en: "three crosses: George, Andrew, Patrick — <b>Wales is absent</b>" }],
        ["GB ≠ UK", { it: "Gran Bretagna = senza l'Irlanda del Nord", en: "Great Britain = without Northern Ireland" }]
      ]
    }
  ];

  var COPY = {
    it: {
      kicker: "Mappa concettuale · Life in the UK Test · aggiornata ad agosto 2026",
      blurb: "Nove aree, 63 voci. Le prime tre sono la <b>procedura</b>; le cinque centrali sono i capitoli del <b>manuale ufficiale</b> da cui escono tutte le domande; l'ultima raccoglie gli <b>aggiornamenti 2026</b>.",
      stats: [["24", "domande"], ["45'", "minuti"], ["18", "per passare"], ["£50", "a tentativo"]],
      tl: "Le date che tornano più spesso",
      warn: "<b>Materiale di studio, non consulenza legale.</b> Tariffe e requisiti dell'Home Office cambiano quasi ogni anno: verifica su GOV.UK prima di prenotare, pagare o presentare domanda.",
      src: "Fonte: Life in the United Kingdom — A Guide for New Residents, 3ª ed. · GOV.UK",
      print: "Stampa", fit: "Adatta", full: "100%", size: "Formato"
    },
    en: {
      kicker: "Concept map · Life in the UK Test · current to August 2026",
      blurb: "Nine areas, 63 entries. The first three are the <b>process</b>; the five in the middle are the chapters of the <b>official handbook</b> every question comes from; the last gathers the <b>2026 updates</b>.",
      stats: [["24", "questions"], ["45'", "minutes"], ["18", "to pass"], ["£50", "per attempt"]],
      tl: "The dates that come up most",
      warn: "<b>Study material, not legal advice.</b> Home Office fees and requirements change almost every year: check GOV.UK before booking, paying or applying.",
      src: "Source: Life in the United Kingdom — A Guide for New Residents, 3rd ed. · GOV.UK",
      print: "Print", fit: "Fit", full: "100%", size: "Size"
    }
  };

  /* ------------------------- stato ------------------------- */

  var state = { lang: "it", size: "a3", zoom: "fit" };
  try {
    var s = JSON.parse(localStorage.getItem("mappa-cittadinanza-uk") || "{}");
    if (s.lang) state.lang = s.lang;
  } catch (e) { /* nessuna preferenza salvata */ }

  function L(o) { return typeof o === "string" ? o : (o[state.lang] || o.it); }
  function c(k) { return COPY[state.lang][k]; }
  function alt() { return state.lang === "it" ? "en" : "it"; }

  /* ------------------------ struttura ------------------------ */

  var app = document.getElementById("app");
  app.innerHTML =
    '<div class="controls">' +
      '<span class="title">Bussola della Cittadinanza <small id="c-kicker"></small></span>' +
      '<div class="seg"><button class="ctl" id="lang-it">IT</button><button class="ctl" id="lang-en">EN</button></div>' +
      '<div class="seg"><button class="ctl" id="s-a3">A3</button><button class="ctl" id="s-a4">A4</button></div>' +
      '<div class="seg"><button class="ctl" id="z-fit"></button><button class="ctl" id="z-full"></button></div>' +
      '<button class="ctl primary" id="do-print"></button>' +
    "</div>" +
    '<p class="deskhint" id="hint"></p>' +
    '<div class="desk"><div class="scaler" id="scaler"><article class="poster" id="poster" data-size="a3"></article></div></div>';

  var poster = document.getElementById("poster");
  var scaler = document.getElementById("scaler");
  var pageStyle = document.createElement("style");
  document.head.appendChild(pageStyle);

  /* ------------------------ disegno ------------------------ */

  function render() {
    poster.innerHTML =
      '<header class="phead">' +
        '<div class="root">' +
          '<span class="kicker">' + c("kicker") + "</span>" +
          "<h1>" + L(byId.root.t) + "<span>" + byId.root.t[alt()] + "</span></h1>" +
        "</div>" +
        '<p class="blurb">' + c("blurb") + "</p>" +
        '<div class="statstrip">' + c("stats").map(function (s) {
          return '<div><span class="n">' + s[0] + '</span><span class="l">' + s[1] + "</span></div>";
        }).join("") + "</div>" +
      "</header>" +

      '<div class="map">' +
        '<div class="trunk"></div>' +
        '<div class="cols">' + branches.map(function (b, i) {
          return '<section class="col" style="--hue:var(--c' + (i + 1) + ')">' +
            '<div class="stem"></div>' +
            '<div class="hub"><span class="code">' + b.code + "</span>" +
              "<h2>" + L(b.t) + "</h2>" +
              '<span class="en">' + b.t[alt()] + "</span>" +
              '<p class="lead">' + L(b.lead) + "</p></div>" +
            '<ol class="leaves">' + (kids[b.id] || []).map(function (k) {
              return "<li><span class=\"code\">" + k.code + "</span> " +
                '<span class="it">' + L(k.t) + "</span>" +
                '<span class="en">' + k.t[alt()] + "</span></li>";
            }).join("") + "</ol>" +
          "</section>";
        }).join("") + "</div>" +
      "</div>" +

      '<footer class="facts">' +
        '<section class="timeline"><h3>' + c("tl") + "</h3>" +
          '<div class="tlrow">' + TIMELINE.slice(0, 9).map(tlCell).join("") + "</div>" +
          '<div class="tlrow">' + TIMELINE.slice(9).map(tlCell).join("") + "</div>" +
        "</section>" +
        FACTS.map(function (f) {
          return "<section><h3>" + L(f.h) + "</h3><dl>" + f.rows.map(function (r) {
            return "<dt>" + r[0] + "</dt><dd>" + L(r[1]) + "</dd>";
          }).join("") + "</dl></section>";
        }).join("") +
        '<div class="colophon"><span class="warn">' + c("warn") + "</span>" +
          '<span class="src">' + c("src") + "</span></div>" +
      "</footer>";
  }

  function tlCell(t) {
    return '<div><span class="y">' + t[0] + '</span><span class="e">' +
      (state.lang === "it" ? t[1] : t[2]) + "</span></div>";
  }

  /* ------------------------ comandi ------------------------ */

  function setSize(sz) {
    state.size = sz;
    poster.dataset.size = sz;
    pageStyle.textContent = "@page { size: " + (sz === "a3" ? "A3" : "A4") + " landscape; margin: 0; }";
    document.getElementById("s-a3").setAttribute("aria-pressed", String(sz === "a3"));
    document.getElementById("s-a4").setAttribute("aria-pressed", String(sz === "a4"));
    autofit();
    applyZoom();
  }

  // La stampa deve restare in una pagina anche con caratteri diversi da quelli
  // previsti: si parte da un corpo generoso e si scende finché tutto entra.
  function autofit() {
    var start = state.size === "a3" ? 3.4 : 2.4;
    var floor = state.size === "a3" ? 2.1 : 1.5;
    var cols = poster.querySelector(".cols");
    for (var f = start; f > floor; f -= 0.05) {
      poster.style.setProperty("--fs", f.toFixed(2) + "mm");
      void poster.offsetHeight;
      var tallest = 0;
      poster.querySelectorAll(".col").forEach(function (c) { tallest = Math.max(tallest, c.offsetHeight); });
      if (tallest <= cols.clientHeight && poster.scrollHeight <= poster.clientHeight) break;
    }
  }

  function applyZoom() {
    var w = poster.getBoundingClientRect().width / (scaler.dataset.k || 1);
    var natural = poster.offsetWidth;
    var avail = document.querySelector(".desk").clientWidth - 28;
    var k = state.zoom === "fit" ? Math.min(1, avail / natural) : 1;
    scaler.dataset.k = k;
    scaler.style.transform = "scale(" + k + ")";
    scaler.style.height = (poster.offsetHeight * k) + "px";
    document.getElementById("z-fit").setAttribute("aria-pressed", String(state.zoom === "fit"));
    document.getElementById("z-full").setAttribute("aria-pressed", String(state.zoom === "full"));
    void w;
  }

  function setLang(l) {
    state.lang = l;
    document.getElementById("lang-it").setAttribute("aria-pressed", String(l === "it"));
    document.getElementById("lang-en").setAttribute("aria-pressed", String(l === "en"));
    document.documentElement.lang = l;
    render();
    labels();
    autofit();
    applyZoom();
  }

  function labels() {
    document.getElementById("c-kicker").textContent = state.size === "a3" ? "A3 · 420 × 297 mm" : "A4 · 297 × 210 mm";
    document.getElementById("z-fit").textContent = c("fit");
    document.getElementById("z-full").textContent = c("full");
    document.getElementById("do-print").textContent = c("print");
    document.getElementById("hint").textContent = state.lang === "it"
      ? "Un solo foglio: tutte le 63 voci della mappa più i numeri e le date da ripasso. Stampa in orizzontale, senza margini e con la grafica di sfondo attiva."
      : "One sheet: all 63 entries of the map plus the numbers and dates to revise. Print landscape, borderless, with background graphics on.";
  }

  document.getElementById("lang-it").onclick = function () { setLang("it"); };
  document.getElementById("lang-en").onclick = function () { setLang("en"); };
  document.getElementById("s-a3").onclick = function () { setSize("a3"); labels(); };
  document.getElementById("s-a4").onclick = function () { setSize("a4"); labels(); };
  document.getElementById("z-fit").onclick = function () { state.zoom = "fit"; applyZoom(); };
  document.getElementById("z-full").onclick = function () { state.zoom = "full"; applyZoom(); };
  document.getElementById("do-print").onclick = function () { window.print(); };

  var rt;
  window.addEventListener("resize", function () { clearTimeout(rt); rt = setTimeout(applyZoom, 150); });

  /* ------------------------- avvio ------------------------- */

  document.getElementById("lang-it").setAttribute("aria-pressed", String(state.lang === "it"));
  document.getElementById("lang-en").setAttribute("aria-pressed", String(state.lang === "en"));
  render();
  setSize("a3");
  labels();
  if (document.fonts) document.fonts.ready.then(function () { autofit(); applyZoom(); });
})();
