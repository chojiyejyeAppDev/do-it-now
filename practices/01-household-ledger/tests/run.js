#!/usr/bin/env node
// 터미널에서 테스트를 돌린다:  node tests/run.js
// 실패가 있으면 종료 코드 1을 돌려준다.

var runner = require('./runner.js');
require('./cases.js');

var summary = runner.runAll();

for (var i = 0; i < summary.results.length; i++) {
  var r = summary.results[i];
  console.log((r.ok ? '  ✓ ' : '  ✗ ') + r.name);
  if (!r.ok) { console.log('      ' + r.message); }
}

console.log('');
console.log(summary.total + '개 중 ' + summary.passed + '개 통과 / ' + summary.failed + '개 실패');

process.exit(summary.failed === 0 ? 0 : 1);
