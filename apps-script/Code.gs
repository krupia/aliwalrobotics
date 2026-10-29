/**
 * Aliwal Robotics: intake form -> Google Sheet
 *
 * Paste this into the Sheet's Extensions > Apps Script editor, then
 * Deploy > New deployment > Web app (Execute as: Me, Who has access: Anyone).
 * Put the /exec URL in FORM_ENDPOINT in intake/index.html.
 */

// Where new-lead alerts go: the Google account that owns this script, by default.
// (Sending to hello@ would loop back through Gmail and may only show up in Sent.)
// Set to '' to turn alerts off.
var NOTIFY_EMAIL = Session.getEffectiveUser().getEmail();
var SHEET_NAME = 'Leads';

var COLUMNS = [
  ['received',     'Received'],
  ['name',         'Name'],
  ['company',      'Company'],
  ['email',        'Email'],
  ['phone',        'Phone'],
  ['type',         'Looking for'],
  ['items',        'Part numbers / specs'],
  ['qty',          'Qty'],
  ['budget',       'Budget'],
  ['compliance',   'Compliance'],
  ['needby',       'Needed by'],
  ['urgency',      'Urgency'],
  ['ship_city',    'Ship-to city'],
  ['ship_country', 'Ship-to country'],
  ['notes',        'Notes'],
  ['status',       'Status'],
  ['page',         'Source page']
];

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
  var sheet = ss.getSheetByName(SHEET_NAME) || ss.insertSheet(SHEET_NAME);
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(COLUMNS.map(function (c) { return c[1]; }));
    sheet.setFrozenRows(1);
    sheet.getRange(1, 1, 1, COLUMNS.length).setFontWeight('bold');
    sheet.getRange('A:A').setNumberFormat('yyyy-mm-dd hh:mm');
    sheet.getRange('P2:P').setDataValidation(
      SpreadsheetApp.newDataValidation()
        .requireValueInList(['New', 'Contacted', 'Quoted', 'Won', 'Lost'], true)
        .build());
  }
  return sheet;
}

function notify_(p, sheet) {
  var subject = 'New quote request: ' + clean_(p.company || p.name) +
                (p.urgency && p.urgency !== 'Standard' ? ' [' + p.urgency + ']' : '');
  var lines = COLUMNS
    .filter(function (c) { return ['received', 'status', 'page'].indexOf(c[0]) < 0 && p[c[0]]; })
    .map(function (c) { return c[1] + ': ' + clean_(p[c[0]]); });
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
