# Bussola della Cittadinanza

Mappa concettuale navigabile per l'esame di cittadinanza britannica — il **Life in the UK
Test** e tutto ciò che gli sta intorno. Bilingue **italiano / inglese**, aggiornata ad
**agosto 2026**, con link di approfondimento su ogni scheda.

Pensata per chi studia dall'Italia o vive già nel Regno Unito: oltre ai cinque capitoli del
manuale ufficiale copre la procedura di naturalizzazione, il requisito di inglese, i costi
2026, la doppia cittadinanza italiana e le riforme annunciate (earned settlement, B2 dal 2027).

## Cosa contiene

**63 voci in nove aree.**

| # | Area | Voci |
|---|------|------|
| 1 | Il percorso — dal visto alla cerimonia | 9 |
| 2 | Life in the UK Test — formato, prenotazione, strategia | 7 |
| 3 | Requisito di inglese — B1, SELT, esenzioni | 4 |
| 4 | Cap. 1 del manuale — Valori e principi | 3 |
| 5 | Cap. 2 — Cos'è il Regno Unito | 3 |
| 6 | Cap. 3 — Una lunga storia | 7 |
| 7 | Cap. 4 — Società moderna | 7 |
| 8 | Cap. 5 — Governo e legge | 10 |
| 9 | Aggiornamenti 2026 | 3 |

Le aree 4-8 seguono i cinque capitoli di *Life in the United Kingdom: A Guide for New
Residents*, 3ª edizione (2013), l'unica fonte da cui escono le domande d'esame.

## Quattro formati

**Mappa interattiva** (`index.html`) — da esplorare a schermo, area per area.

**Poster stampabile** (`poster.html`) — le stesse 63 voci su **un solo foglio**, in A3
orizzontale (da parete) o A4 orizzontale (da scrivania), con in fondo una fascia di ripasso:
la linea del tempo delle date che tornano più spesso, i numeri dell'esame, i numeri della
domanda, le cifre delle istituzioni e le quattro nazioni con i loro santi patroni.
Il corpo del testo si adatta da solo per stare sempre in una pagina sola.

**Foglio di ripasso** (`facts.html`) — in inglese, e solo i **concetti d'esame**: i 193
fatti dei cinque capitoli del manuale, ognuno per esteso. Niente procedura, niente
burocrazia. Si impagina da solo su 3 pagine A4 verticali o 2 pagine A3 orizzontali,
con i titoli ripetuti quando un argomento prosegue nella colonna successiva.

**Diagramma di flusso** (`flow.html`) — il rovescio del foglio di ripasso: non i concetti
ma il **percorso decisionale**. Quindici nodi lungo una colonna centrale, otto rami
laterali con i numeri di ogni requisito. Bordo tratteggiato = si torna alla stessa domanda;
rail rosso = il percorso si ferma lì. Sta in **una sola pagina A3 verticale** (due A4): il
corpo del testo scende quel tanto che basta perché ci stia, senza mai tagliare nulla.

PDF già pronti in `stampa/`:

| File | Formato | Contenuto |
|------|---------|-----------|
| `poster-cittadinanza-A3-it.pdf` | A3 orizzontale, 1 pagina | mappa completa, italiano |
| `poster-cittadinanza-A4-it.pdf` | A4 orizzontale, 1 pagina | mappa completa, italiano |
| `poster-citizenship-A3-en.pdf` | A3 orizzontale, 1 pagina | mappa completa, inglese |
| `life-in-the-uk-facts-A4-en.pdf` | A4 verticale, 3 pagine | i 193 fatti, inglese |
| `life-in-the-uk-facts-A3-en.pdf` | A3 orizzontale, 2 pagine | i 193 fatti, inglese |
| `life-in-the-uk-fatti-A4-it.pdf` | A4 verticale, 3 pagine | i 193 fatti, italiano |
| `flusso-cittadinanza-A3-it.pdf` | A3 verticale, 1 pagina | diagramma di flusso, italiano |
| `flusso-cittadinanza-A4-it.pdf` | A4 verticale, 2 pagine | diagramma di flusso, italiano |
| `citizenship-flowchart-A3-en.pdf` | A3 verticale, 1 pagina | diagramma di flusso, inglese |

Per la resa tipografica migliore conviene però stampare dalle pagine nel browser
(*Stampa* → margini nulli, grafica di sfondo attiva): i PDF qui sopra sono stati generati
in un ambiente senza accesso a Google Fonts e usano caratteri sostitutivi.

## Come si usa

- **Mappa** — trascina per spostarti, rotella o pinch per zoomare, tocca un'area per aprire
  il ventaglio delle sue voci. Si espande un ramo alla volta, così la mappa resta leggibile.
- **Indice** — la stessa struttura come elenco, più comoda su telefono e per la stampa.
  È la vista predefinita sotto i 900 px.
- **IT / EN** — ogni scheda esiste in entrambe le lingue; il titolo nell'altra lingua resta
  sempre visibile sotto l'intestazione.
- **Ricerca** (`/`) — cerca nel testo completo di tutte le schede, in entrambe le lingue.
- **Segna come studiato** — l'avanzamento resta nel browser (`localStorage`), voce per voce.
- Tema chiaro/scuro automatico, con interruttore manuale.

## Struttura del progetto

```
index.html            mappa interattiva
poster.html           poster stampabile A3 / A4
facts.html            foglio di ripasso, solo i concetti d'esame
flow.html             diagramma di flusso del percorso decisionale
assets/data.js        i 63 nodi bilingui (contenuti e link) — sorgente unica
assets/style.css      stile della mappa, token di colore per tema chiaro e scuro
assets/app.js         layout radiale, pan/zoom, pannello, ricerca, indice
assets/poster.css     stile del poster (foglio sempre bianco, misure in mm)
assets/poster.js      composizione del poster, fascia di ripasso, adattamento del corpo
assets/facts.css      stile del foglio di ripasso
assets/facts.js       impaginazione su più pagine, colonna per colonna
assets/flow.css       stile del diagramma (colonna centrale, rami, frecce)
assets/flow.js        i nodi del percorso e l'adattamento al numero di pagine
build.py              compila i quattro file autonomi
dist/                 i file autonomi prodotti da build.py
stampa/               i PDF pronti da stampare
```

Nessuna dipendenza, nessun processo di build obbligatorio: `index.html` e `poster.html`
si aprono direttamente nel browser. Per ottenere i file singoli da condividere o mettere
offline:

```sh
python3 build.py     # → i quattro file in dist/
```

Mappa, poster e foglio di ripasso leggono lo stesso `assets/data.js`: una correzione si
riflette su tutti e tre. Il diagramma di flusso ha invece i suoi nodi in `assets/flow.js`,
perché descrive un percorso decisionale, non la stessa gerarchia di argomenti.
Per aggiungere o correggere una voce basta modificare `assets/data.js`: ogni nodo ha
`id`, `p` (il genitore), `code`, titolo e sintesi bilingui, blocchi di contenuto
(`p`, `ul`, `kv`, `warn`) e i link di approfondimento. Il layout si adatta da solo.

## Attendibilità dei contenuti

Verificato ad agosto 2026: formato del test (24 domande, 45 minuti, 18/24, £50), manuale di
3ª edizione ancora unica fonte ufficiale, inglese B1 in vigore con passaggio a B2 annunciato
per il 26 marzo 2027, earned settlement ancora allo stadio di proposta.

Le tariffe e i requisiti dell'Home Office cambiano spesso. **Questo è materiale di studio,
non consulenza legale**: prima di prenotare, pagare o presentare domanda, verifica le pagine
GOV.UK linkate in ogni scheda.
