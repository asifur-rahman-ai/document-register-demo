/**
 * Document IN/OUT Register — Apps Script backend
 * Deploy: Extensions > Apps Script (in your Google Sheet) > paste this > Deploy > New deployment > Web app
 *   Execute as: Me | Who has access: Anyone with the link
 * Copy the deployment URL into register.html (API_URL constant).
 *
 * Sheet setup: create two tabs named exactly "IN" and "OUT" in this spreadsheet.
 * Header rows (row 1) — script will create them automatically if missing.
 */

const SHEETS = {
  IN: ["Timestamp", "Envelope/From", "Document", "Pages", "Pieces", "Article No.", "Receiver", "Notification", "Receive Confirmation"],
  OUT: ["Timestamp", "Envelope/To", "Document", "Sender", "Notification", "Courier/Post"],
};

const IN_KEYS = ["date", "envelope", "doc", "pages", "pieces", "article", "receiver", "notification", "confirmation"];
const OUT_KEYS = ["date", "envelope", "doc", "sender", "notification", "dispatch"];

function getSheet_(tab) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sh = ss.getSheetByName(tab);
  if (!sh) sh = ss.insertSheet(tab);
  if (sh.getLastRow() === 0) {
    sh.appendRow(SHEETS[tab]);
    sh.getRange(1, 1, 1, SHEETS[tab].length).setFontWeight("bold");
  }
  return sh;
}

function doGet(e) {
  const tab = (e.parameter.tab || "IN").toUpperCase();
  const sh = getSheet_(tab);
  const data = sh.getDataRange().getValues();
  const rows = data.slice(1).map((r, i) => {
    const keys = tab === "IN" ? IN_KEYS : OUT_KEYS;
    const obj = { row: i + 2 };
    keys.forEach((k, idx) => (obj[k] = r[idx] !== undefined ? String(r[idx]) : ""));
    return obj;
  }).reverse();
  return ContentService.createTextOutput(JSON.stringify({ ok: true, entries: rows }))
    .setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  const body = JSON.parse(e.postData.contents);
  const tab = (body.tab || "IN").toUpperCase();
  const action = body.action || "add";
  const sh = getSheet_(tab);
  const keys = tab === "IN" ? IN_KEYS : OUT_KEYS;

  if (action === "add") {
    const entry = body.entry || {};
    const timestamp = new Date().toISOString();
    const row = keys.map((k) => (k === "date" ? timestamp : entry[k] || ""));
    sh.appendRow(row);
    return respond_({ ok: true });
  }

  if (action === "delete") {
    const rowNum = Number(body.row);
    if (rowNum >= 2) sh.deleteRow(rowNum);
    return respond_({ ok: true });
  }

  return respond_({ ok: false, error: "Unknown action" });
}

function respond_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
