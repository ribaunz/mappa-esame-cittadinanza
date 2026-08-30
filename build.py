#!/usr/bin/env python3
"""Compila mappa e poster in file HTML autonomi, dentro dist/.

I file prodotti non contengono tag <html>/<head>/<body>: si aprono comunque nel
browser e vanno bene sia per la pubblicazione come Artifact sia come allegato.
"""
import pathlib

BASE = pathlib.Path(__file__).parent
FONTS = ("https://fonts.googleapis.com/css2?family=Archivo:wght@400;500;600;700"
         "&family=IBM+Plex+Mono:wght@400;500"
         "&family=Newsreader:ital,opsz,wght@0,6..72,400;0,6..72,600;1,6..72,400&display=swap")

def read(rel):
    return (BASE / rel).read_text(encoding="utf-8")


def bundle(title, css, scripts, shell):
    parts = [
        # senza questa riga il file autonomo, aperto da disco o servito senza
        # charset, viene letto come Latin-1 e gli accenti diventano illeggibili
        '<meta charset="utf-8">',
        f"<title>{title}</title>",
        '<link rel="preconnect" href="https://fonts.googleapis.com">',
        '<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>',
        f'<link rel="stylesheet" href="{FONTS}">',
        f"<style>\n{read(css)}\n</style>",
        shell,
    ]
    for src in scripts:
        parts.append(f"<script>\n{read(src)}\n</script>")
    return "\n".join(parts) + "\n"


TARGETS = [
    ("mappa-cittadinanza-uk.html", "Bussola della Cittadinanza", "assets/style.css",
     ["assets/data.js", "assets/app.js"], '<div class="app" id="app"></div>'),
    ("poster-cittadinanza-uk.html", "Poster della Cittadinanza", "assets/poster.css",
     ["assets/data.js", "assets/poster.js"], '<div id="app"></div>'),
    ("life-in-the-uk-facts.html", "Life in the UK Facts", "assets/facts.css",
     ["assets/data.js", "assets/facts.js"], '<div id="app"></div>'),
]

(BASE / "dist").mkdir(exist_ok=True)
for name, title, css, scripts, shell in TARGETS:
    out = bundle(title, css, scripts, shell)
    dest = BASE / "dist" / name
    dest.write_text(out, encoding="utf-8")
    print(f"scritto {dest} — {len(out.encode('utf-8')) / 1024:.0f} KB")
