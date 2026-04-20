# Technetium Leadgen Dashboard

Dashboard voor Jurgen om ROC-kandidaten uit de n8n-pipeline te bekijken en te bevestigen voor outreach.

## Werking

- **Bron**: Google Sheet `Technetium Leadgeneratie Apollo`, tab `Leads`
- **Lezen**: via Google Sheets `gviz`-API (sheet moet gedeeld zijn als "Iedereen met link - Lezer")
- **Schrijven**: via Google Apps Script Web App — `Status` kolom updaten (`Nieuw` → `Verzenden` / `Afgewezen`)

## Statussen

| Status | Betekenis |
|---|---|
| `Nieuw` | Zojuist gescrapet door ROC Search Pipeline, wacht op review |
| `Verzenden` | Jurgen bevestigt → AI Leadgen workflow pakt hem op voor connectie + bericht |
| `Afgewezen` | Niet geschikt — blijft in sheet, wordt overgeslagen door outreach |

## Deploy

### 1. Apps Script endpoint

1. Open https://script.google.com → New project
2. Plak inhoud van `apps-script.gs`
3. Deploy → New deployment → Type: Web app
   - Execute as: **Me**
   - Who has access: **Anyone**
4. Kopieer de Web App URL (eindigt op `/exec`)
5. Plak die URL in `index.html` bij `SYNC_URL = ''`

### 2. Sheet delen

Google Sheet → Share → Algemene toegang: **Iedereen met link — Viewer**
(Write-access gebeurt via Apps Script, niet direct via sheet-permissies.)

### 3. Dashboard deployen

Vercel (zoals smartesg-dashboard):

```
cd technetium-dashboard
vercel --prod
```

Of GitHub Pages — commit + push naar `main`, Pages activeren op `/`.

## Lokaal testen

Open `index.html` direct in browser. Data laadt via `gviz` (publieke sheet). Status-updates werken alleen als `SYNC_URL` is ingesteld.

## Bestanden

- `index.html` — UI (single file, inline CSS + JS)
- `apps-script.gs` — backend voor status sync
