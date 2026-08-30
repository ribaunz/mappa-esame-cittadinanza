/* ============================================================
   Dal visto al passaporto — diagramma di flusso
   Il percorso decisionale completo: ogni domanda, ogni ramo,
   con i numeri e le regole sui nodi. Bilingue, stampabile.
   ============================================================ */

(function () {
  "use strict";

  /* ------------------------- il flusso ------------------------- */

  var PHASES = [
    { t: { it: "Idoneità", en: "Eligibility" },
      s: { it: "Chi può presentare domanda, e su quale base giuridica", en: "Who may apply, and on what legal basis" } },
    { t: { it: "Residenza", en: "Residence" },
      s: { it: "Il requisito che fa cadere più domande di ogni altro", en: "The requirement that sinks more applications than any other" } },
    { t: { it: "Conoscenza e carattere", en: "Knowledge and character" },
      s: { it: "Le due gambe del KoLL, più la condotta", en: "The two legs of KoLL, plus conduct" } },
    { t: { it: "La domanda", en: "The application" },
      s: { it: "Moduli, tassa, biometria, attesa", en: "Forms, fee, biometrics, waiting" } },
    { t: { it: "Dopo la decisione", en: "After the decision" },
      s: { it: "Cerimonia, passaporto, doppia cittadinanza", en: "Ceremony, passport, dual nationality" } }
  ];

  var FLOW = [
    { phase: 0, k: "start",
      t: { it: "Vivi nel Regno Unito e vuoi la cittadinanza", en: "You live in the UK and want citizenship" } },

    { phase: 0, k: "d",
      t: { it: "Hai 18 anni compiuti?", en: "Are you 18 or over?" },
      d: { it: "Serve anche la capacità di intendere e volere.", en: "You must also be of sound mind." },
      side: { k: "exit",
        t: { it: "La domanda la fa un genitore", en: "A parent applies for you" },
        d: { it: "Per i minorenni si usa il <b>modulo MN1</b>, non il modulo AN: niente Life in the UK Test e niente prova di inglese. Un genitore già britannico può registrare il figlio.",
             en: "Under-18s use <b>form MN1</b>, not form AN: no Life in the UK Test and no English test. A parent who is already British can register the child." } } },

    { phase: 0, k: "d",
      t: { it: "Hai l'ILR o il settled status?", en: "Do you have ILR or settled status?" },
      d: { it: "La residenza permanente è quasi sempre il gradino obbligato prima della cittadinanza.", en: "Settlement is nearly always the required step before citizenship." },
      side: { k: "act", back: true,
        t: { it: "Prima il settlement", en: "Settlement comes first" },
        d: { it: "Di norma <b>5 anni continuativi</b> su un visto idoneo (Skilled Worker, coniuge, Global Talent…). L'ILR richiede già <b>Life in the UK Test</b> e <b>inglese B1</b>: quel lavoro non è sprecato, vale anche per la cittadinanza. L'ILR decade dopo <b>2 anni consecutivi</b> fuori dal Regno Unito.<br><b>⚠ Earned settlement</b>: proposta di portare il periodo standard da 5 a 10 anni. Consultazione chiusa il 12 febbraio 2026; ad agosto 2026 le regole attuative <b>non sono state depositate</b> in Parlamento.",
             en: "Normally <b>5 continuous years</b> on a qualifying visa (Skilled Worker, spouse, Global Talent…). ILR itself requires the <b>Life in the UK Test</b> and <b>English at B1</b>: that work is not wasted, it counts for citizenship too. ILR lapses after <b>2 consecutive years</b> outside the UK.<br><b>⚠ Earned settlement</b>: a proposal to raise the standard period from 5 to 10 years. The consultation closed on 12 February 2026; as of August 2026 the implementing rules have <b>not been laid</b> before Parliament." } } },

    { phase: 0, k: "fork",
      q: { it: "Quale percorso ti riguarda?", en: "Which route applies to you?" },
      panes: [
        { t: { it: "Percorso standard — sez. 6(1)", en: "Standard route — s.6(1)" },
          d: { it: "<b>5 anni</b> di residenza · max <b>450 giorni</b> fuori dal Regno Unito · ILR posseduto da almeno <b>12 mesi</b>",
               en: "<b>5 years</b> of residence · max <b>450 days</b> outside the UK · ILR held for at least <b>12 months</b>" } },
        { t: { it: "Coniuge di britannico — sez. 6(2)", en: "Spouse of a British citizen — s.6(2)" },
          d: { it: "<b>3 anni</b> di residenza · max <b>270 giorni</b> fuori · ILR alla data della domanda, <b>nessuna attesa</b> di 12 mesi",
               en: "<b>3 years</b> of residence · max <b>270 days</b> away · ILR at the date of application, <b>no 12-month wait</b>" } }
      ] },

    { phase: 1, k: "d",
      t: { it: "Rientri nei limiti di assenza?", en: "Are you within the absence limits?" },
      d: { it: "<b>450 giorni</b> in 5 anni (o <b>270</b> in 3) <b>e</b> non più di <b>90 giorni</b> negli ultimi 12 mesi. Il conteggio parte dalla data in cui l'Home Office <i>riceve</i> la domanda.",
           en: "<b>450 days</b> over 5 years (or <b>270</b> over 3) <b>and</b> no more than <b>90 days</b> in the final 12 months. The count runs back from the date the Home Office <i>receives</i> the application." },
      side: { k: "act", back: true,
        t: { it: "Aspetta e ricalcola", en: "Wait and recount" },
        d: { it: "La finestra si sposta con la data della domanda: rimandare di qualche mese può bastare. Tieni un registro dei viaggi con partenze e rientri fin dal primo giorno. L'Home Office ha discrezionalità sui superamenti contenuti, ma è discrezionale — non un diritto.",
             en: "The window moves with your application date: postponing by a few months is often enough. Keep a travel log with departures and returns from day one. The Home Office has discretion over modest excesses, but it is discretion — not a right." } } },

    { phase: 1, k: "d",
      t: { it: "Eri nel Regno Unito esattamente 5 (o 3) anni prima?", en: "Were you in the UK exactly 5 (or 3) years before?" },
      d: { it: "Serve la presenza fisica nel giorno preciso che apre il periodo di qualificazione.", en: "Physical presence is required on the exact day that opens the qualifying period." },
      side: { k: "act", back: true,
        t: { it: "Sposta la data di domanda", en: "Move your application date" },
        d: { it: "Non c'è nulla da sanare: basta scegliere una data di presentazione il cui giorno di apertura ti trovi nel Regno Unito.",
             en: "There is nothing to fix: simply pick a submission date whose opening day finds you in the UK." } } },

    { phase: 2, k: "d",
      t: { it: "Hai superato il Life in the UK Test?", en: "Have you passed the Life in the UK Test?" },
      d: { it: "Il certificato <b>non scade</b> e vale sia per l'ILR sia per la cittadinanza: si fa una volta sola. Esenti: <b>under 18</b>, <b>65 o più</b>, condizione medica documentata su modulo ufficiale.",
           en: "The certificate <b>never expires</b> and counts for both ILR and citizenship: you sit it once. Exempt: <b>under 18</b>, <b>65 or over</b>, or a documented medical condition on the official form." },
      side: { k: "act", back: true,
        t: { it: "Prenota, studia, passa", en: "Book it, study, pass" },
        d: { it: "Prenotazione solo su GOV.UK: <b>£50</b>, almeno <b>3 giorni lavorativi</b> di anticipo. L'indirizzo inserito deve coincidere <i>esattamente</i> con quello del documento che porterai: è il motivo numero uno di respingimento all'ingresso.<br><b>24 domande · 45 minuti · 18/24 per passare</b>. Unica fonte ammessa: <i>Life in the United Kingdom — A Guide for New Residents</i>, 3ª edizione (2013), cinque capitoli.<br>Se non passi: <b>7 giorni</b> di attesa, altri £50, tentativi illimitati.",
             en: "Book only on GOV.UK: <b>£50</b>, at least <b>3 working days</b> ahead. The address you enter must match <i>exactly</i> the one on the ID you bring: this is the number-one reason people are turned away.<br><b>24 questions · 45 minutes · 18/24 to pass</b>. The only permitted source: <i>Life in the United Kingdom — A Guide for New Residents</i>, 3rd edition (2013), five chapters.<br>If you fail: <b>7 days</b> before the next attempt, another £50, no cap on attempts." } } },

    { phase: 2, k: "d",
      t: { it: "Puoi dimostrare l'inglese a livello B1?", en: "Can you prove English at level B1?" },
      d: { it: "B1 del CEFR, solo <b>speaking e listening</b>: né lettura né scrittura.", en: "CEFR B1, in <b>speaking and listening</b> only: no reading, no writing." },
      side: { k: "act", back: true,
        t: { it: "Un SELT, oppure un'esenzione", en: "A SELT, or an exemption" },
        d: { it: "<b>SELT approvato</b> (~£150): IELTS for UKVI, LanguageCert, Trinity College London, Pearson, PSI. La versione accademica o non-UKVI dello stesso esame viene <b>rifiutata</b> anche col livello giusto.<br><b>Esenzioni</b>: under 18, 65+, condizione medica, cittadinanza di un paese anglofono riconosciuto (<b>l'Italia non lo è</b>), laurea insegnata in inglese con verifica <b>Ecctis</b>.<br><b>⚠ Dal 26 marzo 2027 il livello richiesto sale a B2.</b>",
             en: "An <b>approved SELT</b> (~£150): IELTS for UKVI, LanguageCert, Trinity College London, Pearson, PSI. The academic or non-UKVI version of the same exam is <b>rejected</b> even at the right level.<br><b>Exemptions</b>: under 18, 65+, a medical condition, nationality of a recognised majority English-speaking country (<b>Italy is not one</b>), or a degree taught in English verified by <b>Ecctis</b>.<br><b>⚠ From 26 March 2027 the required level rises to B2.</b>" } } },

    { phase: 2, k: "d",
      t: { it: "Fedina, tasse e immigrazione in regola?", en: "Criminal record, tax and immigration in order?" },
      d: { it: "Il requisito del <b>good character</b>, valutato caso per caso.", en: "The <b>good character</b> requirement, assessed case by case." },
      side: { k: "act", back: true,
        t: { it: "Sistema il quadro prima di pagare", en: "Put it right before you pay" },
        d: { it: "Pesano condanne penali (con periodi di preclusione legati alla pena, fino a permanenti), multe stradali non pagate, insolvenze, evasione fiscale o contributiva, debiti NHS oltre soglia, inganno in domande precedenti, ingressi irregolari.<br><b>Dichiarare tutto</b>: la reticenza scoperta vale come <i>deception</i> e pesa più dell'episodio nascosto. Nei casi dubbi, un consulente OISC o un avvocato prima di presentare.",
             en: "What counts: criminal convictions (with exclusion periods tied to the sentence, up to permanent), unpaid traffic fines, insolvency, tax or National Insurance evasion, NHS debts above the threshold, deception in earlier applications, irregular entry.<br><b>Declare everything</b>: concealment discovered later counts as deception and weighs more than the thing concealed. In doubtful cases, take OISC or solicitor advice before applying." } } },

    { phase: 3, k: "step",
      t: { it: "Presenta il modulo AN", en: "Submit form AN" },
      d: { it: "Online su GOV.UK. <b>Circa £1.839</b>, cerimonia da £130 inclusa e riscossa subito. Biometria all'<b>UKVCAS</b>: foto e impronte. <b>Due referees</b>: uno di professione riconosciuta, uno cittadino britannico di 25 anni o più; nessuno dei due parente o tuo rappresentante legale. Allegati: passaporto, eVisa, certificato del test, certificato di inglese, prova di residenza. Il passaporto non si spedisce: si caricano le scansioni.",
           en: "Online on GOV.UK. <b>About £1,839</b>, including the £130 ceremony fee, charged upfront. Biometrics at <b>UKVCAS</b>: photo and fingerprints. <b>Two referees</b>: one of recognised profession, one British citizen aged 25 or over; neither a relative nor your legal representative. Attachments: passport, eVisa, test certificate, English certificate, proof of residence. You do not post your passport: you upload scans." } },

    { phase: 3, k: "step",
      t: { it: "Attesa della decisione", en: "Wait for the decision" },
      d: { it: "Di norma <b>entro 6 mesi</b> dalla presentazione.", en: "Usually <b>within 6 months</b> of submission." } },

    { phase: 3, k: "d",
      t: { it: "Domanda approvata?", en: "Application approved?" },
      side: { k: "exit",
        t: { it: "Rifiuto", en: "Refused" },
        d: { it: "La tassa <b>non viene rimborsata</b>: torna solo la quota della cerimonia. Puoi chiedere un <i>reconsideration</i> entro i termini indicati nella lettera di rifiuto. Prima di ripresentare, rimuovi la causa: quasi sempre assenze eccessive o good character.",
             en: "The fee is <b>not refunded</b>: only the ceremony portion comes back. You can request a <i>reconsideration</i> within the deadline given in the refusal letter. Before reapplying, remove the cause: almost always excessive absences or good character." } } },

    { phase: 4, k: "step",
      t: { it: "Cerimonia di cittadinanza", en: "Citizenship ceremony" },
      d: { it: "<b>Entro 3 mesi</b> dall'invito, di norma presso il consiglio comunale. <b>Oath</b> di fedeltà al Re e ai suoi eredi — oppure <b>affirmation</b> laica per chi non giura su testi sacri — seguito dal <b>pledge</b> di lealtà al Regno Unito, ai suoi diritti, libertà e leggi. Si ascolta <i>God Save the King</i>. Ti consegnano il <b>certificato di naturalizzazione</b>.",
           en: "<b>Within 3 months</b> of the invitation, usually at your local council. The <b>oath</b> of allegiance to the King and his heirs — or a secular <b>affirmation</b> for those who do not swear on scripture — followed by the <b>pledge</b> of loyalty to the UK, its rights, freedoms and laws. <i>God Save the King</i> is played. You receive your <b>naturalisation certificate</b>." } },

    { phase: 4, k: "step",
      t: { it: "Passaporto britannico", en: "British passport" },
      d: { it: "Domanda online con il certificato di naturalizzazione, un garante e le foto. Da qui in poi: voto in tutte le elezioni e nei referendum, candidabilità, nessun controllo sull'immigrazione, niente più <i>Immigration Health Surcharge</i>.",
           en: "Apply online with your naturalisation certificate, a countersignatory and photos. From here on: voting in every election and referendum, eligibility to stand, no immigration control, no more Immigration Health Surcharge." } },

    { phase: 4, k: "end",
      t: { it: "Cittadino britannico — e ancora italiano", en: "A British citizen — and still Italian" },
      d: { it: "La <b>legge 91/1992</b> ammette la doppia cittadinanza: acquisire quella britannica <b>non fa perdere</b> quella italiana, e il Regno Unito non pone limiti. Resta iscritto all'<b>AIRE</b> presso il Consolato Generale d'Italia e comunica ogni cambio di indirizzo. Regola pratica: entra in Italia con il documento italiano, nel Regno Unito con quello britannico.",
           en: "Italian <b>Law 91/1992</b> allows dual nationality: taking British citizenship <b>does not cost you</b> your Italian one, and the UK sets no limit either. Stay registered with <b>AIRE</b> at the Italian Consulate General and report every change of address. Practical rule: enter Italy on the Italian document, the UK on the British one." } }
  ];

  var COPY = {
    it: {
      kicker: "Diagramma di flusso · dal visto al passaporto · aggiornato ad agosto 2026",
      title: "Dal visto al passaporto",
      sub: "Il percorso decisionale della cittadinanza britannica",
      note: "Ogni domanda con la sua risposta, i suoi numeri e la sua via d'uscita. Segui la colonna centrale: dove la risposta è <b>no</b>, il riquadro a destra dice cosa fare — e, se il bordo è tratteggiato, si torna alla stessa domanda.",
      yes: "sì", no: "no", back: "poi torna a questa domanda", exitLabel: "il percorso si ferma qui",
      legend: [["start", "inizio e fine"], ["d", "domanda"], ["step", "passo da compiere"], ["act", "cosa fare, poi si rientra"], ["exit", "uscita dal percorso"]],
      cont: "Il flusso continua alla pagina seguente",
      from: "segue dalla pagina precedente",
      foot: "Materiale di studio, non consulenza legale. Tariffe e requisiti dell'Home Office cambiano quasi ogni anno: verifica su GOV.UK prima di prenotare, pagare o presentare domanda.",
      pg: "Pagina", of: "di", print: "Stampa", fit: "Adatta", full: "100%",
      hint: "Stampa in verticale, senza margini e con la grafica di sfondo attiva."
    },
    en: {
      kicker: "Flowchart · from visa to passport · current to August 2026",
      title: "From visa to passport",
      sub: "The decision path to British citizenship",
      note: "Every question with its answer, its figures and its way out. Follow the central column: where the answer is <b>no</b>, the box on the right says what to do — and if its border is dashed, you come back to the same question.",
      yes: "yes", no: "no", back: "then come back to this question", exitLabel: "the path stops here",
      legend: [["start", "start and end"], ["d", "question"], ["step", "step to take"], ["act", "what to do, then rejoin"], ["exit", "exit from the path"]],
      cont: "The flow continues on the next page",
      from: "continued from the previous page",
      foot: "Study material, not legal advice. Home Office fees and requirements change almost every year: check GOV.UK before booking, paying or applying.",
      pg: "Page", of: "of", print: "Print", fit: "Fit", full: "100%",
      hint: "Print portrait, borderless, with background graphics on."
    }
  };

  var state = { lang: "it", size: "a3", zoom: "fit" };
  function L(o) { return o ? (o[state.lang] || o.it || o.en) : ""; }
  function c(k) { return COPY[state.lang][k]; }

  /* ------------------------ i blocchi ------------------------ */

  function blocks() {
    var out = [];
    var lastPhase = -1;
    FLOW.forEach(function (n, i) {
      if (n.phase !== lastPhase) {
        lastPhase = n.phase;
        out.push({ kind: "band", html: band(n.phase) });
      }
      out.push({ kind: "row", html: row(n, i) });
    });
    return out;
  }

  function band(i) {
    var p = PHASES[i];
    return '<div class="band" style="--hue:var(--p' + (i + 1) + ')">' +
      '<span class="num">' + (i + 1) + "</span>" +
      "<h2>" + L(p.t) + "</h2><p>" + L(p.s) + "</p></div>";
  }

  function row(n, i) {
    var main;
    if (n.k === "fork") {
      main = '<div class="node fork">' +
        '<p class="q">' + L(n.q) + "</p>" +
        '<div class="panes">' + n.panes.map(function (p) {
          return '<div class="pane"><h3>' + L(p.t) + "</h3><p>" + L(p.d) + "</p></div>";
        }).join("") + "</div></div>";
    } else {
      main = '<div class="node ' + n.k + '">' +
        (n.k === "d" ? '<span class="mark">◆</span>' : "") +
        "<h3>" + L(n.t) + "</h3>" +
        (n.d ? "<p>" + L(n.d) + "</p>" : "") + "</div>";
    }

    var branch = "";
    if (n.side) {
      branch =
        '<div class="hlink"><span class="lbl">' + c("no") + "</span>" +
          '<svg viewBox="0 0 100 10" preserveAspectRatio="none" aria-hidden="true">' +
            '<line x1="0" y1="5" x2="92" y2="5"/><polygon points="100,5 90,1.4 90,8.6"/></svg>' +
        "</div>" +
        '<div class="node side ' + n.side.k + (n.side.back ? " back" : "") + '">' +
          "<h4>" + L(n.side.t) + "</h4><p>" + L(n.side.d) + "</p>" +
          '<span class="tail">' + (n.side.back ? "↩ " + c("back") : "■ " + c("exitLabel")) + "</span>" +
        "</div>";
    }

    var next = FLOW[i + 1];
    var link = next
      ? '<div class="vlink' + (n.k === "d" ? " yes" : "") + '">' +
          (n.k === "d" ? '<span class="lbl">' + c("yes") + "</span>" : "") +
          '<svg viewBox="0 0 10 100" preserveAspectRatio="none" aria-hidden="true">' +
            '<line x1="5" y1="0" x2="5" y2="92"/><polygon points="5,100 1.4,90 8.6,90"/></svg>' +
        "</div>"
      : "";

    return '<div class="row' + (n.side ? "" : " nobranch") + '">' +
      '<div class="main">' + main + link + "</div>" + branch + "</div>";
  }

  /* ------------------------ impaginazione ------------------------ */

  var pagesEl, scaler, pageStyle, clipped = false;

  function head(first) {
    if (!first) {
      return '<div class="runhead"><b>' + c("title") + "</b><span>" + c("from") +
        " ←</span><span class=\"r\">" + MAPPA.meta.updated + "</span></div>";
    }
    return '<header class="masthead">' +
      '<span class="kicker">' + c("kicker") + "</span>" +
      '<div class="row2">' +
        "<h1>" + c("title") + "<span>" + c("sub") + "</span></h1>" +
        '<p class="note">' + c("note") + "</p>" +
        '<ul class="key">' + c("legend").map(function (l) {
          return '<li><span class="chip ' + l[0] + '"></span>' + l[1] + "</li>";
        }).join("") + "</ul>" +
      "</div></header>";
  }

  function newSheet(i) {
    var s = document.createElement("article");
    s.className = "sheet";
    var fs = pagesEl.style.getPropertyValue("--fs-set");
    if (fs) s.style.setProperty("--fs", fs);
    s.innerHTML = head(i === 0) + '<div class="flow"></div>' +
      '<div class="foot"><span>' + c("foot") + '</span><span class="pg"></span></div>';
    pagesEl.appendChild(s);
    return s;
  }

  function paginate(fs) {
    pagesEl.innerHTML = "";
    if (fs) pagesEl.style.setProperty("--fs-set", fs + "mm");
    var bl = blocks();
    var sheet = newSheet(0);
    var area = sheet.querySelector(".flow");
    clipped = false;

    bl.forEach(function (b) {
      area.insertAdjacentHTML("beforeend", b.html);
      if (area.scrollHeight <= area.clientHeight + 0.5) return;

      // non ci sta: si chiude la pagina e il blocco passa a quella dopo
      area.removeChild(area.lastElementChild);
      var carry = [b.html];

      // anche la nota "il flusso continua" deve starci: se serve,
      // scendono con lei gli ultimi blocchi della pagina
      area.insertAdjacentHTML("beforeend", '<p class="contd">' + c("cont") + " \u2193</p>");
      while (area.scrollHeight > area.clientHeight + 0.5 && area.children.length > 2) {
        var prev = area.lastElementChild.previousElementSibling;
        carry.unshift(prev.outerHTML);
        area.removeChild(prev);
      }
      // e una fascia di fase non resta sola in fondo alla pagina
      var tail = area.children[area.children.length - 2];
      if (tail && tail.classList.contains("band")) {
        carry.unshift(tail.outerHTML);
        area.removeChild(tail);
      }

      sheet = newSheet(pagesEl.children.length);
      area = sheet.querySelector(".flow");
      carry.forEach(function (h) { area.insertAdjacentHTML("beforeend", h); });
      if (area.scrollHeight > area.clientHeight + 0.5) clipped = true;
    });

    var sheets = pagesEl.querySelectorAll(".sheet");
    sheets.forEach(function (s, i) {
      s.querySelector(".pg").textContent = c("pg") + " " + (i + 1) + " " + c("of") + " " + sheets.length;
    });
    document.getElementById("c-meta").textContent =
      (state.size === "a3" ? "A3" : "A4") + " · " + sheets.length +
      (state.lang === "it" ? (sheets.length === 1 ? " pagina" : " pagine") : sheets.length === 1 ? " page" : " pages");
  }

  /* ------------------------- interfaccia ------------------------- */

  document.getElementById("app").innerHTML =
    '<div class="controls">' +
      '<span class="title">Dal visto al passaporto <small id="c-meta"></small></span>' +
      '<div class="seg"><button class="ctl" id="lang-it">IT</button><button class="ctl" id="lang-en">EN</button></div>' +
      '<div class="seg"><button class="ctl" id="s-a3">A3</button><button class="ctl" id="s-a4">A4</button></div>' +
      '<div class="seg"><button class="ctl" id="z-fit"></button><button class="ctl" id="z-full"></button></div>' +
      '<button class="ctl primary" id="do-print"></button>' +
    "</div>" +
    '<p class="deskhint" id="hint"></p>' +
    '<div class="desk"><div class="scaler" id="scaler"><div class="pages" id="pages" data-size="a3"></div></div></div>';

  pagesEl = document.getElementById("pages");
  scaler = document.getElementById("scaler");
  pageStyle = document.createElement("style");
  document.head.appendChild(pageStyle);

  function applyZoom() {
    var s = pagesEl.querySelector(".sheet");
    if (!s) return;
    var k = state.zoom === "fit"
      ? Math.min(1, (document.querySelector(".desk").clientWidth - 28) / s.offsetWidth) : 1;
    scaler.style.transform = "scale(" + k + ")";
    scaler.style.height = (scaler.scrollHeight * k) + "px";
    document.getElementById("z-fit").setAttribute("aria-pressed", String(state.zoom === "fit"));
    document.getElementById("z-full").setAttribute("aria-pressed", String(state.zoom === "full"));
  }

  function fitPages() {
    var target = state.size === "a3" ? 1 : 2;
    var steps = state.size === "a3"
      ? [2.85, 2.72, 2.6, 2.48, 2.38, 2.28]
      : [2.08, 2.0, 1.92, 1.85, 1.78, 1.7];
    var safest = null;
    for (var i = 0; i < steps.length; i++) {
      paginate(steps[i]);
      if (!clipped && safest === null) safest = steps[i];
      if (!clipped && pagesEl.children.length <= target) return;
    }
    // niente ha soddisfatto entrambe le condizioni: si torna al corpo più grande
    // che almeno non taglia nulla, accettando una pagina in più
    paginate(safest || steps[steps.length - 1]);
  }

  function setSize(sz) {
    state.size = sz;
    pagesEl.dataset.size = sz;
    pageStyle.textContent = "@page { size: " + (sz === "a3" ? "A3" : "A4") + " portrait; margin: 0; }";
    document.getElementById("s-a3").setAttribute("aria-pressed", String(sz === "a3"));
    document.getElementById("s-a4").setAttribute("aria-pressed", String(sz === "a4"));
    fitPages(); applyZoom();
  }

  function setLang(l) {
    state.lang = l;
    document.documentElement.lang = l;
    document.getElementById("lang-it").setAttribute("aria-pressed", String(l === "it"));
    document.getElementById("lang-en").setAttribute("aria-pressed", String(l === "en"));
    labels(); fitPages(); applyZoom();
  }

  function labels() {
    document.getElementById("z-fit").textContent = c("fit");
    document.getElementById("z-full").textContent = c("full");
    document.getElementById("do-print").textContent = c("print");
    document.getElementById("hint").textContent = c("hint");
  }

  document.getElementById("lang-it").onclick = function () { setLang("it"); };
  document.getElementById("lang-en").onclick = function () { setLang("en"); };
  document.getElementById("s-a3").onclick = function () { setSize("a3"); };
  document.getElementById("s-a4").onclick = function () { setSize("a4"); };
  document.getElementById("z-fit").onclick = function () { state.zoom = "fit"; applyZoom(); };
  document.getElementById("z-full").onclick = function () { state.zoom = "full"; applyZoom(); };
  document.getElementById("do-print").onclick = function () { window.print(); };

  var rt;
  window.addEventListener("resize", function () { clearTimeout(rt); rt = setTimeout(applyZoom, 150); });

  document.getElementById("lang-it").setAttribute("aria-pressed", "true");
  labels();
  setSize("a3");
  if (document.fonts) document.fonts.ready.then(function () { fitPages(); applyZoom(); });
})();
