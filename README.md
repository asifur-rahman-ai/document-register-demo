# Document In/Out Register (Demo)

A lightweight web tool for logging incoming and outgoing office documents (envelopes, couriers, notices).

**Live demo:** https://asifur-rahman-ai.github.io/document-register-demo/

## Features
- Incoming / Outgoing tabs with timestamped entries
- Add, search and delete entries
- Demo mode: runs fully in the browser (data stays on your device, pre-loaded with fictional sample entries)
- Optional production mode: Google Sheets backend via Google Apps Script (`Code.gs`)

## Files
- `index.html` — the complete web app (HTML, CSS, JavaScript in one file)
- `Code.gs` — Google Apps Script backend for Google Sheets (optional)

## Using the Google Sheets backend
1. Create a Google Sheet, open Extensions > Apps Script, paste `Code.gs`.
2. Deploy as Web App (Execute as: Me, Access: Anyone with the link).
3. Paste the URL into `API_URL` in `index.html`.

## Note
All sample data is fictional. No real organisation data is included.
