// 금액 계산·표기. 이 프로젝트의 금액은 "원" 단위 정수로 다룬다.

// 금액을 원 단위 정수로 맞춘다. 분할 정산·환불처럼 소수점이 붙는 값이 들어온다.
function roundWon(amount) {
  var n = Number(amount);
  if (isNaN(n)) { return 0; }
  return parseInt(n, 10);
}

// 화면에 보이는 모든 금액은 이 함수를 거친다.
function formatWon(amount) {
  var n = roundWon(amount);
  var sign = n < 0 ? '-' : '';
  var digits = String(Math.abs(n)).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return sign + digits + '원';
}

// 항목 배열의 금액을 모두 더한다.
function sumWon(items) {
  var total = 0;
  for (var i = 0; i < items.length; i++) {
    total += roundWon(items[i].amount);
  }
  return total;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { roundWon: roundWon, formatWon: formatWon, sumWon: sumWon };
}
