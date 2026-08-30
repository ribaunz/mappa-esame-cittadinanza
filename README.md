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

## Due formati

**Mappa interattiva** (`index.html`) — da esplorare a schermo, area per area.

**Poster stampabile** (`poster.html`) — le stesse 63 voci su **un solo foglio**, in A3
orizzontale (da parete) o A4 orizzontale (da scrivania), con in fondo una fascia di ripasso:
la linea del tempo delle date che tornano più spesso, i numeri dell'esame, i numeri della
domanda, le cifre delle istituzioni e le quattro nazioni con i loro santi patroni.
Il corpo del testo si adatta da solo per stare sempre in una pagina sola.

Tre PDF già pronti in `stampa/`:

| File | Formato |
|------|---------|
| `poster-cittadinanza-A3-it.pdf` | A3 orizzontale, italiano |
| `poster-cittadinanza-A4-it.pdf` | A4 orizzontale, italiano |
| `poster-citizenship-A3-en.pdf` | A3 orizzontale, inglese |

Per la resa tipografica migliore conviene però stampare da `poster.html` nel browser
(*Stampa* → orizzontale, margini nulli, grafica di sfondo attiva): i PDF qui sopra sono
stati generati in un ambiente senza accesso a Google Fonts e usano caratteri sostitutivi.

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
assets/data.js        i 63 nodi bilingui (contenuti e link) — sorgente unica
assets/style.css      stile della mappa, token di colore per tema chiaro e scuro
assets/app.js         layout radiale, pan/zoom, pannello, ricerca, indice
assets/poster.css     stile del poster (foglio sempre bianco, misure in mm)
assets/poster.js      composizione del poster, fascia di ripasso, adattamento del corpo
build.py              compila mappa e poster in file autonomi
dist/                 i file autonomi prodotti da build.py
stampa/               i PDF pronti da stampare
```

Nessuna dipendenza, nessun processo di build obbligatorio: `index.html` e `poster.html`
si aprono direttamente nel browser. Per ottenere i file singoli da condividere o mettere
offline:

```sh
python3 build.py     # → dist/mappa-cittadinanza-uk.html e dist/poster-cittadinanza-uk.html
```

Mappa e poster leggono lo stesso `assets/data.js`: una correzione si riflette su entrambi.
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
