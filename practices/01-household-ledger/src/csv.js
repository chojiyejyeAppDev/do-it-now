// CSV 내보내기·가져오기.

var CSV_HEADER = ['날짜', '분류', '금액', '메모'];

// 값 하나를 CSV 칸으로 바꾼다.
function toCsvCell(value) {
  return String(value);
}

// 항목 배열을 CSV 문자열로 바꾼다.
function toCsv(items) {
  var lines = [CSV_HEADER.join(',')];
  for (var i = 0; i < items.length; i++) {
    var item = items[i];
    lines.push([
      toCsvCell(item.date),
      toCsvCell(item.category),
      toCsvCell(item.amount),
      toCsvCell(item.memo)
    ].join(','));
  }
  return lines.join('\n');
}

// CSV 문자열을 항목 배열로 바꾼다.
function fromCsv(text) {
  // TODO: 아직 구현되지 않았습니다
  return null;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { CSV_HEADER: CSV_HEADER, toCsvCell: toCsvCell, toCsv: toCsv, fromCsv: fromCsv };
}
