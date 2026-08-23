// 화면 조립·검색·정렬. 화면 그리기는 브라우저에서만 돌고,
// 검색·정렬 같은 순수 계산은 Node의 테스트에서도 그대로 쓴다.
//
// Node에서 돌 때는 money.js를 불러오고, 브라우저에서는 index.html이 먼저 읽어 둔다.
var AppMoney = (typeof module !== 'undefined' && module.exports)
  ? require('./money.js')
  : { roundWon: roundWon, formatWon: formatWon, sumWon: sumWon };

var state = {
  items: [],
  view: 'record',      // 'record' | 'stats'
  keyword: '',
  sortKey: 'date',     // 'date' | 'amount'
  sortDesc: true,
  budget: 800000
};

// ---- 자료 다루기 -------------------------------------------------

function nextId(items) {
  var max = 0;
  for (var i = 0; i < items.length; i++) {
    var n = parseInt(String(items[i].id).replace(/[^0-9]/g, ''), 10);
    if (!isNaN(n) && n > max) { max = n; }
  }
  return 'e' + String(max + 1).padStart(3, '0');
}

// 검색어로 항목을 걸러낸다. 메모와 분류를 함께 본다.
function searchItems(items, keyword) {
  var word = keyword;
  if (word === '') { return items.slice(); }
  var found = [];
  for (var i = 0; i < items.length; i++) {
    var item = items[i];
    if (item.memo.indexOf(word) !== -1 || item.category.indexOf(word) !== -1) {
      found.push(item);
    }
  }
  return found;
}

function sortItems(items, key, desc) {
  var sorted = items.slice();
  sorted.sort(function (a, b) {
    var left = key === 'amount' ? AppMoney.roundWon(a.amount) : a.date;
    var right = key === 'amount' ? AppMoney.roundWon(b.amount) : b.date;
    if (left < right) { return desc ? 1 : -1; }
    if (left > right) { return desc ? -1 : 1; }
    return 0;
  });
  return sorted;
}

function visibleItems() {
  return sortItems(searchItems(state.items, state.keyword), state.sortKey, state.sortDesc);
}

// ---- 화면 그리기 -------------------------------------------------

function el(id) { return document.getElementById(id); }

function renderNotice() {
  el('storage-notice').hidden = !isStorageBlocked();
}

function renderRecord() {
  var rows = visibleItems();
  var body = el('expense-rows');
  body.innerHTML = '';
  for (var i = 0; i < rows.length; i++) {
    var item = rows[i];
    var tr = document.createElement('tr');
    tr.innerHTML =
      '<td>' + escapeHtml(item.date) + '</td>' +
      '<td><span class="tag">' + escapeHtml(item.category) + '</span></td>' +
      '<td class="num">' + escapeHtml(formatWon(item.amount)) + '</td>' +
      '<td>' + escapeHtml(item.memo) + '</td>' +
      '<td><button class="link" data-del="' + escapeHtml(item.id) + '">삭제</button></td>';
    body.appendChild(tr);
  }
  el('row-count').textContent = rows.length + '건';
  el('empty-hint').hidden = rows.length !== 0;
}

function renderStats() {
  el('stat-total').textContent = formatWon(totalOfAll(state.items));

  var byCategory = totalByCategory(state.items);
  var catBody = el('category-rows');
  catBody.innerHTML = '';
  for (var c = 0; c < CATEGORIES.length; c++) {
    var name = CATEGORIES[c];
    var tr = document.createElement('tr');
    tr.innerHTML = '<td>' + escapeHtml(name) + '</td>' +
                   '<td class="num">' + escapeHtml(formatWon(byCategory[name] || 0)) + '</td>';
    catBody.appendChild(tr);
  }

  var byMonth = totalByMonth(state.items);
  var months = monthsOf(state.items);
  var monthBody = el('month-rows');
  monthBody.innerHTML = '';
  for (var m = 0; m < months.length; m++) {
    var key = months[m];
    var row = document.createElement('tr');
    row.innerHTML = '<td>' + escapeHtml(key) + '</td>' +
                    '<td class="num">' + escapeHtml(formatWon(byMonth[key] || 0)) + '</td>';
    monthBody.appendChild(row);
  }

  var picker = el('month-picker');
  if (picker.options.length !== months.length + 1) {
    picker.innerHTML = '<option value="">달을 고르세요</option>';
    for (var k = 0; k < months.length; k++) {
      var opt = document.createElement('option');
      opt.value = months[k];
      opt.textContent = months[k];
      picker.appendChild(opt);
    }
  }

  var over = overBudget(state.items, state.budget);
  var warn = el('budget-warning');
  warn.hidden = over === 0;
  if (over > 0) { warn.textContent = '예산을 ' + formatWon(over) + ' 넘었습니다.'; }
}

function renderMonthPick() {
  var value = el('month-picker').value;
  var box = el('month-result');
  if (value === '') { box.textContent = ''; return; }
  var parts = value.split('-');
  var picked = filterByMonth(state.items, Number(parts[0]), Number(parts[1]));
  box.textContent = value + ' : ' + picked.length + '건 / ' + formatWon(sumWon(picked));
}

function render() {
  el('view-record').hidden = state.view !== 'record';
  el('view-stats').hidden = state.view !== 'stats';
  el('tab-record').classList.toggle('on', state.view === 'record');
  el('tab-stats').classList.toggle('on', state.view === 'stats');
  renderNotice();
  if (state.view === 'record') { renderRecord(); } else { renderStats(); }
}

function escapeHtml(text) {
  return String(text)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

// ---- 사용자 조작 -------------------------------------------------

function persist() {
  saveExpenses(state.items);
  renderNotice();
}

function addExpense(date, category, amount, memo) {
  state.items.push({
    id: nextId(state.items),
    date: date,
    category: category,
    amount: Number(amount),
    memo: memo
  });
  persist();
  render();
}

function removeExpense(id) {
  var kept = [];
  for (var i = 0; i < state.items.length; i++) {
    if (state.items[i].id !== id) { kept.push(state.items[i]); }
  }
  state.items = kept;
  persist();
  render();
}

function loadSample() {
  state.items = JSON.parse(JSON.stringify(SAMPLE_EXPENSES));
  persist();
  render();
}

function downloadCsv() {
  var text = toCsv(state.items);
  var blob = new Blob(['﻿' + text], { type: 'text/csv;charset=utf-8' });
  var url = URL.createObjectURL(blob);
  var a = document.createElement('a');
  a.href = url;
  a.download = 'moneybook.csv';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function importCsv(text) {
  var parsed = fromCsv(text);
  if (parsed === null) {
    alert('CSV 가져오기는 아직 준비 중입니다.');
    return;
  }
  state.items = parsed;
  persist();
  render();
}

function start() {
  var saved = loadExpenses();
  state.items = saved === null ? JSON.parse(JSON.stringify(SAMPLE_EXPENSES)) : saved;

  el('tab-record').addEventListener('click', function () { state.view = 'record'; render(); });
  el('tab-stats').addEventListener('click', function () { state.view = 'stats'; render(); });

  el('add-form').addEventListener('submit', function (event) {
    event.preventDefault();
    var date = el('in-date').value;
    var category = el('in-category').value;
    var amount = el('in-amount').value;
    var memo = el('in-memo').value;
    if (date === '' || amount === '') { alert('날짜와 금액은 반드시 입력해 주세요.'); return; }
    addExpense(date, category, amount, memo);
    el('in-amount').value = '';
    el('in-memo').value = '';
  });

  el('search').addEventListener('input', function (event) {
    state.keyword = event.target.value;
    render();
  });

  el('sort-key').addEventListener('change', function (event) {
    state.sortKey = event.target.value;
    render();
  });

  el('sort-dir').addEventListener('click', function () {
    state.sortDesc = !state.sortDesc;
    el('sort-dir').textContent = state.sortDesc ? '내림차순' : '오름차순';
    render();
  });

  el('expense-rows').addEventListener('click', function (event) {
    var id = event.target.getAttribute('data-del');
    if (id) { removeExpense(id); }
  });

  el('btn-sample').addEventListener('click', function () {
    if (confirm('지금 목록을 지우고 샘플 데이터 60건을 넣습니다. 계속할까요?')) { loadSample(); }
  });

  el('btn-export').addEventListener('click', downloadCsv);

  el('btn-import').addEventListener('click', function () { el('file-import').click(); });
  el('file-import').addEventListener('change', function (event) {
    var file = event.target.files[0];
    if (!file) { return; }
    var reader = new FileReader();
    reader.onload = function () { importCsv(String(reader.result)); };
    reader.readAsText(file);
    event.target.value = '';
  });

  el('budget').value = state.budget;
  el('budget').addEventListener('input', function (event) {
    state.budget = Number(event.target.value) || 0;
    render();
  });

  el('month-picker').addEventListener('change', renderMonthPick);

  render();
}

if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', start);
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { searchItems: searchItems, sortItems: sortItems, nextId: nextId };
}
