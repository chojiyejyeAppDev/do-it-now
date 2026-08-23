// 테스트 항목. 이름은 "이 프로그램이 해야 하는 일"로 쓴다.
//
// 브라우저(tests.html)에서는 runner.js와 src/*.js가 먼저 읽혀 있고,
// Node(tests/run.js)에서는 여기서 직접 불러온다. 코드는 한 벌뿐이다.
var isNode = (typeof module !== 'undefined' && module.exports);
var Runner = isNode ? require('./runner.js') : window;
var M      = isNode ? require('../src/money.js') : window;
var S      = isNode ? require('../src/stats.js') : window;
var A      = isNode ? require('../src/app.js') : window;
var C      = isNode ? require('../src/csv.js') : window;
var SAMPLE = isNode ? require('../data/sample-expenses.js') : window.SAMPLE_EXPENSES;

var test = Runner.test;
var assertEqual = Runner.assertEqual;
var assertDeepEqual = Runner.assertDeepEqual;
var assertTrue = Runner.assertTrue;

// 검산하기 쉬운 작은 자료. 분류 2종·3건뿐이라 손으로도 답을 낼 수 있다.
var SMALL = [
  { id: 'e001', date: '2025-09-01', category: '식비', amount: 1000, memo: '아침' },
  { id: 'e002', date: '2025-10-02', category: '교통', amount: 2000, memo: '버스' },
  { id: 'e003', date: '2025-10-03', category: '식비', amount: 3000, memo: '점심, 커피' }
];

// ---- 금액 -------------------------------------------------------

test('금액을 원 단위 정수로 맞춘다', function () {
  assertEqual(M.roundWon(1200), 1200);
  assertEqual(M.roundWon(1200.4), 1200);
  assertEqual(M.roundWon('3000'), 3000, '문자열로 들어와도');
});

test('음수 금액도 올바르게 반올림한다', function () {
  assertEqual(M.roundWon(-4166.6), -4167, '환불 금액');
  assertEqual(M.roundWon(-1200.4), -1200);
});

test('금액을 세 자리마다 쉼표를 넣어 표기한다', function () {
  assertEqual(M.formatWon(1234567), '1,234,567원');
  assertEqual(M.formatWon(-4167), '-4,167원');
  assertEqual(M.formatWon(0), '0원');
});

test('항목 배열의 금액을 모두 더한다', function () {
  assertEqual(M.sumWon(SMALL), 6000);
  assertEqual(M.sumWon([]), 0);
});

// ---- 통계 -------------------------------------------------------

test('분류별 합계가 모든 항목을 포함한다', function () {
  var byCategory = S.totalByCategory(SMALL);
  assertEqual(byCategory['식비'], 4000, '식비');
  assertEqual(byCategory['교통'], 2000, '교통');
});

test('분류별 합계에 여섯 분류가 모두 들어 있다', function () {
  var byCategory = S.totalByCategory(SMALL);
  for (var i = 0; i < S.CATEGORIES.length; i++) {
    assertTrue(typeof byCategory[S.CATEGORIES[i]] === 'number', S.CATEGORIES[i] + ' 칸');
  }
});

test('한 자리 달도 그 달의 항목을 찾아낸다', function () {
  assertEqual(S.filterByMonth(SMALL, 2025, 9).length, 1, '2025년 9월');
  assertEqual(S.filterByMonth(SMALL, 2025, 10).length, 2, '2025년 10월');
});

test('월별 합계를 달마다 나눠 더한다', function () {
  assertDeepEqual(S.totalByMonth(SMALL), { '2025-09': 1000, '2025-10': 5000 });
});

test('자료에 들어 있는 달을 이른 순서로 모은다', function () {
  assertDeepEqual(S.monthsOf(SMALL), ['2025-09', '2025-10']);
});

test('예산을 넘은 금액만 알려 준다', function () {
  assertEqual(S.overBudget(SMALL, 5000), 1000, '넘었을 때');
  assertEqual(S.overBudget(SMALL, 6000), 0, '딱 맞을 때');
  assertEqual(S.overBudget(SMALL, 9000), 0, '남았을 때');
});

// ---- 검색·정렬 --------------------------------------------------

test('메모와 분류 양쪽에서 검색한다', function () {
  assertEqual(A.searchItems(SMALL, '커피').length, 1, '메모');
  assertEqual(A.searchItems(SMALL, '식비').length, 2, '분류');
  assertEqual(A.searchItems(SMALL, '').length, 3, '빈 검색어');
});

test('금액이 큰 순서로 정렬한다', function () {
  var sorted = A.sortItems(SMALL, 'amount', true);
  assertEqual(sorted[0].id, 'e003');
  assertEqual(sorted[2].id, 'e001');
});

test('날짜가 이른 순서로도 정렬한다', function () {
  var sorted = A.sortItems(SMALL, 'date', false);
  assertEqual(sorted[0].id, 'e001');
  assertEqual(sorted[2].id, 'e003');
});

test('새 항목 번호는 기존 번호 다음으로 매긴다', function () {
  assertEqual(A.nextId(SMALL), 'e004');
  assertEqual(A.nextId([]), 'e001', '첫 항목');
});

// ---- CSV --------------------------------------------------------

test('CSV 내보내기가 머리글과 모든 줄을 담는다', function () {
  var lines = C.toCsv(SMALL).split('\n');
  assertEqual(lines.length, 4, '머리글 1줄 + 항목 3줄');
  assertEqual(lines[0], C.CSV_HEADER.join(','));
});

// ---- 샘플 데이터 -------------------------------------------------

test('샘플 데이터는 60건이다', function () {
  assertEqual(SAMPLE.length, 60);
});

test('샘플 데이터의 식비 합계는 200,600원이다', function () {
  assertEqual(S.totalByCategory(SAMPLE)['식비'], 200600);
});

if (typeof module !== 'undefined' && module.exports) { module.exports = {}; }
