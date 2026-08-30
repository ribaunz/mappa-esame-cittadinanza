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
index.html            pagina principale
assets/data.js        i 63 nodi bilingui (contenuti e link)
assets/style.css      foglio di stile, token di colore per tema chiaro e scuro
assets/app.js         layout radiale, pan/zoom, pannello, ricerca, indice
build.py              compila tutto in un unico file autonomo
dist/                 il file autonomo prodotto da build.py
```

Nessuna dipendenza, nessun processo di build obbligatorio: `index.html` si apre
direttamente nel browser. Per ottenere un unico file da condividere o mettere offline:

```sh
python3 build.py     # → dist/mappa-cittadinanza-uk.html
```

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
