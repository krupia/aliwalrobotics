/**
 * Aliwal Robotics: intake form -> Google Sheet
 *
 * Paste this into the Sheet's Extensions > Apps Script editor, then
 * Deploy > New deployment > Web app (Execute as: Me, Who has access: Anyone).
 * Put the /exec URL in FORM_ENDPOINT in intake/index.html.
 *
 * After editing this file, update the existing deployment so the URL stays the same:
 * Deploy > Manage deployments > pencil icon > Version: New version > Deploy.
 */

// Where new-lead alerts go: the Google account that owns this script, by default.
// (Sending to hello@ would loop back through Gmail and may only show up in Sent.)
// Set to '' to turn alerts off.
var NOTIFY_EMAIL = Session.getEffectiveUser().getEmail();
var SHEET_NAME = 'Leads';

var COLUMNS = [
  ['received',   'Received'],
  ['name',       'Name'],
  ['company',    'Company'],
  ['email',      'Email'],
  ['phone',      'Phone'],
  ['type',       'Looking for'],
  ['catalog',    'Catalog items'],
  ['details',    'Other items / specs'],
  ['qty',        'Qty'],
  ['budget',     'Budget'],
  ['compliance', 'Compliance'],
  ['needby',     'Needed by'],
  ['urgency',    'Urgency'],
  ['ship_to',    'Ship to'],
  ['notes',      'Notes'],
  ['status',     'Status'],
  ['page',       'Source page']
];
var STATUSES = ['New', 'Contacted', 'Quoted', 'Won', 'Lost'];

function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    var p = (e && e.parameter) || {};
    if (p.website) return json_({ ok: true }); // honeypot: ignore bots

    var sheet = getSheet_();
    var row = COLUMNS.map(function (c) {
      if (c[0] === 'received') return new Date();
      if (c[0] === 'status') return 'New';
      return clean_(p[c[0]]);
    });
    sheet.appendRow(row);

    if (NOTIFY_EMAIL) notify_(p, sheet);
    return json_({ ok: true });
  } catch (err) {
    console.error(err);
    return json_({ ok: false });
  } finally {
    lock.releaseLock();
  }
}

// Lets you open the /exec URL in a browser to check the deployment is live.
function doGet() {
  return json_({ ok: true, service: 'aliwal-intake' });
}

function getSheet_() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(SHEET_NAME);
  var headers = COLUMNS.map(function (c) { return c[1]; });

  // If the tab was created by an earlier version with different columns, keep it as an archive
  // and start a fresh tab, so new rows never land under the wrong headings.
  if (sheet && sheet.getLastRow() > 0) {
    var current = sheet.getRange(1, 1, 1, Math.max(sheet.getLastColumn(), 1)).getValues()[0]
      .map(String).filter(function (h) { return h !== ''; });
    if (current.join('|') !== headers.join('|')) {
      var name = SHEET_NAME + ' (v1)', n = 2;
      while (ss.getSheetByName(name)) name = SHEET_NAME + ' (v' + (n++) + ')';
      sheet.setName(name);
      sheet = null;
    }
  }
  if (!sheet) sheet = ss.insertSheet(SHEET_NAME, 0);

  if (sheet.getLastRow() === 0) {
    sheet.appendRow(headers);
    sheet.setFrozenRows(1);
    sheet.getRange(1, 1, 1, headers.length).setFontWeight('bold');
    sheet.getRange(2, 1, sheet.getMaxRows() - 1, 1).setNumberFormat('yyyy-mm-dd hh:mm');
    var statusCol = indexOf_('status') + 1;
    sheet.getRange(2, statusCol, sheet.getMaxRows() - 1, 1).setDataValidation(
      SpreadsheetApp.newDataValidation().requireValueInList(STATUSES, true).build());
    sheet.setColumnWidth(indexOf_('catalog') + 1, 320);
    sheet.setColumnWidth(indexOf_('details') + 1, 320);
  }
  return sheet;
}

function indexOf_(key) {
  for (var i = 0; i < COLUMNS.length; i++) if (COLUMNS[i][0] === key) return i;
  return -1;
}

function notify_(p, sheet) {
  var subject = 'New quote request: ' + clean_(p.company || p.name) +
                (p.urgency && p.urgency !== 'Standard' ? ' [' + p.urgency + ']' : '');
  var lines = COLUMNS
    .filter(function (c) { return ['received', 'status', 'page'].indexOf(c[0]) < 0 && p[c[0]]; })
    .map(function (c) {
      if (c[0] === 'catalog') return c[1] + ':\n  - ' + clean_(p.catalog).split('; ').join('\n  - ');
      return c[1] + ': ' + clean_(p[c[0]]);
    });
  lines.push('', 'All leads: ' + sheet.getParent().getUrl());
  MailApp.sendEmail({
    to: NOTIFY_EMAIL,
    replyTo: clean_(p.email),
    subject: subject,
    body: lines.join('\n')
  });
}

// Trim, cap length, and stop spreadsheet formula injection (=, +, -, @ at the start).
function clean_(v) {
  var s = String(v == null ? '' : v).trim().slice(0, 5000);
  return /^[=+\-@]/.test(s) ? "'" + s : s;
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

// Run once from the editor (select testSetup, click Run) to create the Leads tab and grant permissions.
function testSetup() {
  getSheet_();
}
