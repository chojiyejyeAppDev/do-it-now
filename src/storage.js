// 브라우저 저장. 저장이 막히면 메모리 저장으로 자동 대체한다.
// 이 파일 하나만 바꾸면 저장 방식을 통째로 갈아끼울 수 있다.

var STORAGE_KEY = 'moneybook.expenses.v1';
var memoryStore = null;      // 저장이 막혔을 때 대신 쓰는 그릇
var storageBlocked = false;  // true면 화면 상단에 안내 띠가 뜬다

// 브라우저 저장을 쓸 수 있는지 실제로 한 번 써 보고 판정한다.
function storageAvailable() {
  try {
    if (typeof localStorage === 'undefined') { return false; }
    localStorage.setItem('moneybook.probe', '1');
    localStorage.removeItem('moneybook.probe');
    return true;
  } catch (e) {
    return false;
  }
}

function loadExpenses() {
  if (!storageAvailable()) {
    storageBlocked = true;
    return memoryStore === null ? null : memoryStore;
  }
  var raw = localStorage.getItem(STORAGE_KEY);
  if (raw === null) { return null; }
  try {
    return JSON.parse(raw);
  } catch (e) {
    return null;
  }
}

function saveExpenses(items) {
  if (!storageAvailable()) {
    storageBlocked = true;
    memoryStore = items;
    return false;
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  return true;
}

function clearExpenses() {
  memoryStore = null;
  if (storageAvailable()) { localStorage.removeItem(STORAGE_KEY); }
}

function isStorageBlocked() {
  return storageBlocked;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    STORAGE_KEY: STORAGE_KEY,
    loadExpenses: loadExpenses,
    saveExpenses: saveExpenses,
    clearExpenses: clearExpenses,
    isStorageBlocked: isStorageBlocked
  };
}
