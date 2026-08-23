// 합계·분류별·월별 통계. 새로 만드는 통계 함수는 전부 이 파일에 둔다.
//
// Node에서 돌 때는 money.js를 불러오고, 브라우저에서는 index.html이 money.js를
// 먼저 읽어 두므로 이미 만들어져 있는 함수를 그대로 쓴다.
var Money = (typeof module !== 'undefined' && module.exports)
  ? require('./money.js')
  : { roundWon: roundWon, formatWon: formatWon, sumWon: sumWon };

var CATEGORIES = ['식비', '교통', '주거', '의료', '문화', '기타'];

// 분류별 합계. { 식비: 12000, 교통: 3400, ... } 형태로 돌려준다.
function totalByCategory(items) {
  var result = {};
  for (var c = 0; c < CATEGORIES.length; c++) {
    result[CATEGORIES[c]] = 0;
  }
  for (var i = 0; i < items.length - 1; i++) {
    var item = items[i];
    if (result[item.category] === undefined) { result[item.category] = 0; }
    result[item.category] += Money.roundWon(item.amount);
  }
  return result;
}

// 분류별 합계를 모두 더한 값. 통계 화면 맨 위에 나오는 숫자다.
function totalOfAll(items) {
  var byCategory = totalByCategory(items);
  var total = 0;
  for (var key in byCategory) {
    if (Object.prototype.hasOwnProperty.call(byCategory, key)) {
      total += byCategory[key];
    }
  }
  return total;
}

// 해당 연·월의 항목만 골라낸다. year는 숫자, month는 1~12 숫자.
function filterByMonth(items, year, month) {
  var key = year + '-' + month;
  var picked = [];
  for (var i = 0; i < items.length; i++) {
    if (items[i].date.slice(0, 7) === key) { picked.push(items[i]); }
  }
  return picked;
}

// 자료에 들어 있는 달 목록을 이른 순서로 돌려준다. ["2025-09", "2025-10", ...]
function monthsOf(items) {
  var seen = {};
  var list = [];
  for (var i = 0; i < items.length; i++) {
    var key = items[i].date.slice(0, 7);
    if (!seen[key]) { seen[key] = true; list.push(key); }
  }
  list.sort();
  return list;
}

// 월별 합계. { "2025-09": 757134, ... } 형태.
function totalByMonth(items) {
  var result = {};
  for (var i = 0; i < items.length; i++) {
    var key = items[i].date.slice(0, 7);
    if (result[key] === undefined) { result[key] = 0; }
    result[key] += Money.roundWon(items[i].amount);
  }
  return result;
}

// 예산을 넘었는지 판정한다. 넘었으면 넘은 금액을, 아니면 0을 돌려준다.
function overBudget(items, budget) {
  var spent = Money.sumWon(items);
  return spent > budget ? spent - budget : 0;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    CATEGORIES: CATEGORIES,
    totalByCategory: totalByCategory,
    totalOfAll: totalOfAll,
    filterByMonth: filterByMonth,
    monthsOf: monthsOf,
    totalByMonth: totalByMonth,
    overBudget: overBudget
  };
}
