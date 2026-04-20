// Technetium Lead Dashboard - Status sync endpoint
// Deploy als Web App: Execute as "Me", Access "Anyone".
// Plaats de Web App URL in index.html (SYNC_URL).

var SHEET_ID = '1ptoQQS7TUpxJfK8GoNjrg2T0RB0msQpURiJA9W9sehw';
var SHEET_NAME = 'Leads';
var URL_COLUMN = 'Linkedin URL';
var STATUS_COLUMN = 'Status';
var ALLOWED_STATUSES = ['Nieuw', 'Verzenden', 'Afgewezen'];

function doGet(e) {
  try {
    var action = (e && e.parameter && e.parameter.action) || 'ping';
    if (action === 'ping') return jsonResponse({ok: true, msg: 'Technetium dashboard endpoint alive'});
    if (action === 'setStatus') return handleSetStatus(e);
    return jsonResponse({ok: false, error: 'unknown action'});
  } catch (err) {
    return jsonResponse({ok: false, error: String(err)});
  }
}

function handleSetStatus(e) {
  var url = (e.parameter.url || '').trim();
  var status = (e.parameter.status || '').trim();
  if (!url) return jsonResponse({ok: false, error: 'missing url'});
  if (ALLOWED_STATUSES.indexOf(status) === -1) return jsonResponse({ok: false, error: 'invalid status'});

  var sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName(SHEET_NAME);
  if (!sheet) return jsonResponse({ok: false, error: 'sheet not found'});

  var headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  var urlColIdx = headers.indexOf(URL_COLUMN);
  var statusColIdx = headers.indexOf(STATUS_COLUMN);
  if (urlColIdx === -1 || statusColIdx === -1) return jsonResponse({ok: false, error: 'missing headers'});

  var targetUrl = normalizeUrl(url);
  var lastRow = sheet.getLastRow();
  if (lastRow < 2) return jsonResponse({ok: false, error: 'empty sheet'});

  var urlValues = sheet.getRange(2, urlColIdx + 1, lastRow - 1, 1).getValues();
  for (var i = 0; i < urlValues.length; i++) {
    var rowUrl = normalizeUrl(String(urlValues[i][0] || ''));
    if (rowUrl === targetUrl) {
      sheet.getRange(i + 2, statusColIdx + 1).setValue(status);
      return jsonResponse({ok: true, row: i + 2, status: status});
    }
  }
  return jsonResponse({ok: false, error: 'url not found in sheet'});
}

function normalizeUrl(u) {
  return String(u || '').toLowerCase().split('?')[0].replace(/\/$/, '').replace(/^https?:\/\//, '').replace(/^(www\.|nl\.|m\.)/, '').trim();
}

function jsonResponse(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
