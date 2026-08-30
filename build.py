#!/usr/bin/env python3
"""Compila la mappa in un unico file HTML autonomo (dist/mappa-cittadinanza-uk.html).

Il file prodotto non contiene tag <html>/<head>/<body>: si apre comunque nel
browser e va bene sia per la pubblicazione come Artifact sia per un allegato.
"""
import pathlib

BASE = pathlib.Path(__file__).parent
FONTS = ("https://fonts.googleapis.com/css2?family=Archivo:wght@400;500;600;700"
         "&family=IBM+Plex+Mono:wght@400;500"
         "&family=Newsreader:ital,opsz,wght@0,6..72,400;0,6..72,600;1,6..72,400&display=swap")

css = (BASE / "assets/style.css").read_text(encoding="utf-8")
data = (BASE / "assets/data.js").read_text(encoding="utf-8")
app = (BASE / "assets/app.js").read_text(encoding="utf-8")

out = f"""<title>Bussola della Cittadinanza</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="{FONTS}">
<style>
{css}
</style>
<div class="app" id="app"></div>
<script>
{data}
</script>
<script>
{app}
</script>
"""

dest = BASE / "dist" / "mappa-cittadinanza-uk.html"
dest.parent.mkdir(exist_ok=True)
dest.write_text(out, encoding="utf-8")
print(f"scritto {dest} — {len(out.encode('utf-8')) / 1024:.0f} KB")
