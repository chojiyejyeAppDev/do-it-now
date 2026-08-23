#!/usr/bin/env node
// 간단 가계부 MCP 서버 — 9회 실습용.
//
// 이 저장소의 가계부 데이터를 Claude Code가 직접 물어볼 수 있게 열어 준다.
// 바깥에서 가져온 라이브러리는 없다. Node 표준 기능만 쓴다.
//
// 실행: node mcp/moneybook-server.js   (직접 실행하면 아무 것도 안 보이는 게 정상이다.
//       이 프로그램은 사람이 아니라 Claude Code와 대화한다.)

var path = require('path');
var stats = require(path.join(__dirname, '..', 'src', 'stats.js'));
var money = require(path.join(__dirname, '..', 'src', 'money.js'));
var SAMPLE = require(path.join(__dirname, '..', 'data', 'sample-expenses.js'));

var PROTOCOL_VERSION = '2024-11-05';

var TOOLS = [
  {
    name: 'total_by_category',
    description: '분류별 지출 합계를 알려 준다. 분류를 지정하면 그 분류만, 비워 두면 여섯 분류 전부를 돌려준다. 달(month)을 "2025-12" 형식으로 주면 그 달만 계산한다.',
    inputSchema: {
      type: 'object',
      properties: {
        category: { type: 'string', description: '식비·교통·주거·의료·문화·기타 중 하나' },
        month: { type: 'string', description: 'YYYY-MM 형식. 예: 2025-12' }
      }
    }
  },
  {
    name: 'total_by_month',
    description: '달마다 쓴 돈의 합계를 알려 준다.',
    inputSchema: { type: 'object', properties: {} }
  },
  {
    name: 'list_expenses',
    description: '지출 내역을 돌려준다. 달(month)이나 분류(category)로 좁힐 수 있다.',
    inputSchema: {
      type: 'object',
      properties: {
        month: { type: 'string', description: 'YYYY-MM 형식' },
        category: { type: 'string' },
        limit: { type: 'number', description: '최대 몇 건까지 볼지. 기본 20건' }
      }
    }
  }
];

function pick(args) {
  var items = SAMPLE;
  if (args && args.month) {
    items = items.filter(function (it) { return it.date.slice(0, 7) === args.month; });
  }
  if (args && args.category) {
    items = items.filter(function (it) { return it.category === args.category; });
  }
  return items;
}

function runTool(name, args) {
  args = args || {};
  if (name === 'total_by_category') {
    var items = pick({ month: args.month });
    var byCategory = stats.totalByCategory(items);
    if (args.category) {
      var one = byCategory[args.category];
      if (one === undefined) { return '그런 분류는 없습니다: ' + args.category; }
      return (args.month ? args.month + ' ' : '전체 기간 ') + args.category +
             ' 합계는 ' + money.formatWon(one) + '입니다. (' + items.filter(function (it) {
               return it.category === args.category; }).length + '건)';
    }
    var lines = [(args.month ? args.month : '전체 기간') + ' 분류별 합계'];
    stats.CATEGORIES.forEach(function (c) {
      lines.push('- ' + c + ': ' + money.formatWon(byCategory[c] || 0));
    });
    lines.push('합계: ' + money.formatWon(stats.totalOfAll(items)));
    return lines.join('\n');
  }

  if (name === 'total_by_month') {
    var byMonth = stats.totalByMonth(SAMPLE);
    var months = stats.monthsOf(SAMPLE);
    return months.map(function (m) { return '- ' + m + ': ' + money.formatWon(byMonth[m]); }).join('\n');
  }

  if (name === 'list_expenses') {
    var found = pick(args);
    var limit = args.limit || 20;
    var shown = found.slice(0, limit);
    var head = found.length + '건 중 ' + shown.length + '건';
    return head + '\n' + shown.map(function (it) {
      return '- ' + it.date + ' | ' + it.category + ' | ' + money.formatWon(it.amount) + ' | ' + it.memo;
    }).join('\n');
  }

  throw new Error('모르는 도구입니다: ' + name);
}

// ---- JSON-RPC (줄 단위 JSON) ------------------------------------

function send(message) {
  process.stdout.write(JSON.stringify(message) + '\n');
}

function reply(id, result) {
  send({ jsonrpc: '2.0', id: id, result: result });
}

function replyError(id, code, message) {
  send({ jsonrpc: '2.0', id: id, error: { code: code, message: message } });
}

function handle(request) {
  var method = request.method;

  // 알림(id가 없는 요청)에는 답하지 않는다.
  if (request.id === undefined || request.id === null) { return; }

  if (method === 'initialize') {
    reply(request.id, {
      protocolVersion: PROTOCOL_VERSION,
      capabilities: { tools: {} },
      serverInfo: { name: 'moneybook', version: '0.1.0' }
    });
    return;
  }

  if (method === 'tools/list') {
    reply(request.id, { tools: TOOLS });
    return;
  }

  if (method === 'tools/call') {
    var params = request.params || {};
    try {
      var text = runTool(params.name, params.arguments);
      reply(request.id, { content: [{ type: 'text', text: text }], isError: false });
    } catch (e) {
      reply(request.id, { content: [{ type: 'text', text: String(e.message || e) }], isError: true });
    }
    return;
  }

  if (method === 'ping') { reply(request.id, {}); return; }

  replyError(request.id, -32601, '지원하지 않는 요청입니다: ' + method);
}

var buffer = '';
process.stdin.setEncoding('utf8');
process.stdin.on('data', function (chunk) {
  buffer += chunk;
  var lines = buffer.split('\n');
  buffer = lines.pop();
  lines.forEach(function (line) {
    var trimmed = line.trim();
    if (trimmed === '') { return; }
    var request;
    try {
      request = JSON.parse(trimmed);
    } catch (e) {
      return;
    }
    handle(request);
  });
});
process.stdin.on('end', function () { process.exit(0); });
