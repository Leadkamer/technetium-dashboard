# Technetium Leadgen Dashboard

Dashboard voor Jurgen om ROC-kandidaten uit de n8n-pipeline te bekijken en te bevestigen voor outreach.

## Werking

- **Bron**: Google Sheet `Technetium Leadgeneratie Apollo`, tab `Leads`
- **Lezen**: via Google Sheets `gviz`-API (sheet moet gedeeld zijn als "Iedereen met link — Lezer")
- **Schrijven**: via n8n webhook → `Status` kolom updaten (`Nieuw` → `Verzenden` / `Afgewezen`)

## Statussen

| Status | Betekenis |
|---|---|
| `Nieuw` | Zojuist gescrapet door ROC Search Pipeline, wacht op review |
| `Verzenden` | Jurgen bevestigt → AI Leadgen workflow pakt hem op voor connectie + bericht |
| `Afgewezen` | Niet geschikt — blijft in sheet, wordt overgeslagen door outreach |

## Architectuur

```
[Dashboard index.html] --fetch--> [n8n webhook] --> [Google Sheets node] --> Sheet (Status kolom)
       |
       +--gviz API--> Sheet (read-only)
```

- **Webhook workflow**: `Technetium - Dashboard Status Webhook` (n8n ID `vVYitD9cB1IgDjuq`)
- **Endpoint**: `https://leadkamer.app.n8n.cloud/webhook/technetium-status?url={linkedin_url}&status={status}`
- **CORS**: open (`*`) — dashboard kan vanaf elk domein posten

## Deploy

### Sheet delen
Google Sheet → Share → **Iedereen met link — Lezer**. (Write gaat via n8n workflow, niet via sheet-permissions.)

### n8n workflow activeren
Open https://leadkamer.app.n8n.cloud/workflow/vVYitD9cB1IgDjuq → zet op **Active**.

### Dashboard deployen
Vercel:
```
cd technetium-dashboard
vercel --prod
```
Of GitHub Pages (commit + push `main`, Pages aan op `/`).

## Lokaal testen
Open `index.html` direct in browser. Data laadt via gviz. Status-updates gaan via de n8n webhook (die moet actief zijn).

## Bestanden
- `index.html` — single-file UI (inline CSS + JS)
- `apps-script.gs` — **niet gebruikt**, bewaard als alternatief indien n8n webhook ooit vervangen wordt
- `.gitignore`
