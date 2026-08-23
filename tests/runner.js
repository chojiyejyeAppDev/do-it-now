// 초소형 테스트 러너. 바깥에서 가져온 것 없이 직접 만들었다.
// 브라우저(tests.html)와 Node(tests/run.js)가 이 파일 하나를 함께 쓴다.

var TESTS = [];

// 테스트 하나를 등록한다. 이름은 "기대하는 동작"으로 쓴다.
function test(name, fn) {
  TESTS.push({ name: name, fn: fn });
}

function fail(message) {
  var error = new Error(message);
  error.isAssertion = true;
  throw error;
}

// 두 값이 같은지 본다. 숫자·문자열처럼 단순한 값에 쓴다.
function assertEqual(actual, expected, note) {
  if (actual !== expected) {
    fail((note ? note + ' — ' : '') + '기대값: ' + expected + ' / 실제값: ' + actual);
  }
}

// 배열·객체가 같은지 본다.
function assertDeepEqual(actual, expected, note) {
  var a = JSON.stringify(actual);
  var b = JSON.stringify(expected);
  if (a !== b) {
    fail((note ? note + ' — ' : '') + '기대값: ' + b + ' / 실제값: ' + a);
  }
}

function assertTrue(value, note) {
  if (value !== true) { fail((note ? note + ' — ' : '') + '참이어야 하는데 ' + value + ' 이었습니다.'); }
}

// 등록된 테스트를 전부 돌리고 결과를 돌려준다.
function runAll() {
  var results = [];
  var passed = 0;
  for (var i = 0; i < TESTS.length; i++) {
    var item = TESTS[i];
    try {
      item.fn();
      results.push({ name: item.name, ok: true, message: '' });
      passed++;
    } catch (e) {
      results.push({ name: item.name, ok: false, message: e && e.message ? e.message : String(e) });
    }
  }
  return { total: TESTS.length, passed: passed, failed: TESTS.length - passed, results: results };
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    test: test, runAll: runAll,
    assertEqual: assertEqual, assertDeepEqual: assertDeepEqual, assertTrue: assertTrue,
    _tests: TESTS
  };
}
