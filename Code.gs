const COLS = ['id', 'ts', 'kind', 'user', 'item', 'qty', 'cost', 'price', 'meta'];

function sheet_() {
  const ss = SpreadsheetApp.getActive();
  let sh = ss.getSheetByName('Records');
  if (!sh) { sh = ss.insertSheet('Records'); sh.appendRow(COLS); sh.setFrozenRows(1); }
  return sh;
}

function out_(o) {
  return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON);
}

function doGet(e) {
  const rows = sheet_().getDataRange().getValues();
  rows.shift();
  const all = rows.map(r => Object.fromEntries(COLS.map((c, i) => [c, r[i]])));
  const a = e && e.parameter && e.parameter.after;
  if (a === undefined) return out_(all);
  return out_({ n: all.length, ev: all.slice(+a || 0) });
}

function doPost(e) {
  const events = JSON.parse(e.postData.contents);
  const lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    const sh = sheet_();
    const have = new Set(sh.getDataRange().getValues().map(r => String(r[0])));
    events.forEach(x => {
      if (!have.has(String(x.id))) sh.appendRow(COLS.map(c => x[c] === undefined ? '' : x[c]));
    });
  } finally {
    lock.releaseLock();
  }
  return out_({ ok: true });
}
