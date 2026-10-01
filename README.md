# Violine Shape — Landing pages

Site estático (HTML, CSS e JS puros) em `site/`.

- `site/index.html` — V1, visual claro/nude premium
- `site/cientifica.html` — V2, estilo científico/agressivo (baseado no site atual)
- `imagens-geradas-codex/` — PNGs originais gerados com o Codex CLI

## Rodar localmente

```bash
python3 -m http.server 8099 --directory site
```

## Deploy

Vercel com *Root Directory* = `site` (sem build).
