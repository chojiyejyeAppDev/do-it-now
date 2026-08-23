# do-it-now — AgentCompany 실습 저장소

**실습을 고르는 입구입니다.** 실습마다 `practices/` 아래에 자기 폴더가 있습니다.
설치할 프로그램은 없습니다 — 실습 폴더의 `index.html`을 더블클릭하면 바로 열립니다.

> ⚠️ 이 저장소에는 실습을 위해 **일부러 심어 둔 결함**이 있습니다. 실제로 쓰기 위한 프로그램이 아닙니다.
> 결함이 어디에 있는지는 밝히지 않습니다 — 그걸 찾아 고치는 것이 실습이기 때문입니다.
>
> ⚠️ **Pull Request 목록은 직접 해 보시기 전에 열지 마십시오.** 다른 학습자가 고친 코드가 그대로 보입니다.
> 막혔을 때 볼 정답은 `answers` 브랜치에 따로 있습니다 — 보실지는 학습자가 정하시면 됩니다.

---

## 실습 목록

| 실습 | 폴더 | 무엇을 만드나 | 쓰이는 과정 |
|---|---|---|---|
| **01 간단 가계부** | [`practices/01-household-ledger/`](practices/01-household-ledger/) | 쓴 돈을 적으면 합계와 분류별 통계를 보여 주는 웹 앱 | Claude Code 교육 시리즈 1기 (3·5·7·9·11회) |

실습이 늘어나면 이 표에 줄이 추가됩니다. **폴더 구조는 실습이 몇 개가 되든 같습니다.**

---

## 3분 시작하기

**1. 내려받습니다**

```
git clone https://github.com/chojiyejyeAppDev/do-it-now.git
cd do-it-now/practices/01-household-ledger
```

→ *이렇게 보이면 성공:* 지금 있는 폴더에 `index.html` 파일이 보입니다.

**2. 앱을 엽니다** — 그 폴더의 `index.html`을 **더블클릭**합니다.

→ *이렇게 보이면 성공:* 브라우저가 열리고 지출 목록 표에 **60건**이 보입니다.

**3. Claude Code는 실습 폴더 안에서 켭니다** — `claude` 를 실행합니다.

→ *이렇게 보이면 성공:* 세션 맨 위에 `01-household-ledger` 폴더 경로가 보입니다.

더 자세한 안내(테스트 여는 법·잘 안 될 때)는 실습 폴더의 [README](practices/01-household-ledger/README.md)에 있습니다.

---

## 회차 ↔ 브랜치 대응표 — 실습 01 간단 가계부

브랜치 이름 규칙은 **`start/<실습 이름>-ep<회차>`** 입니다. 실습이 늘어도 이름이 겹치지 않습니다.

| 회차 | 명령 | 시작 상태 |
|---|---|---|
| 1회 재실습 | `git switch -c my-ep01 origin/main` | 기본 상태 |
| **3회** | `git switch -c my-ep03 origin/start/ledger-ep03` | 결함 3건, 테스트 **3개 실패** |
| 5회 | `git switch -c my-ep05 origin/start/ledger-ep05` | 3회 결함 수정됨, `CLAUDE.md` 없음 |
| 7회 | `git switch -c my-ep07 origin/start/ledger-ep07` | `CLAUDE.md` 있음, `.claude/` 비어 있음 |
| 9회 | `git switch -c my-ep09 origin/start/ledger-ep09` | `mcp/` 서버 포함, `.mcp.json` 없음 |
| 11회 | `git switch -c my-ep11 origin/start/ledger-ep11` | CSV 가져오기 미구현 |

`start/ledger-ep03`은 `main`과 같은 상태입니다 — 이름 규칙을 맞추려고 함께 둡니다. 어느 쪽으로 시작해도 같습니다.
2·4·6·8·10·12회(최신편)는 이 저장소가 필요하지 않습니다.

---

## fork 할까요, clone 할까요?

| 상황 | 방법 |
|---|---|
| 실습 결과를 내 GitHub에 남기고 싶다 | 이 저장소를 **fork** 한 뒤 자기 fork를 clone |
| 그냥 실습만 해 보면 된다 | **clone만 해도** 전 회차 실습이 다 됩니다 |
| 이 저장소의 소유자다 | 자기 저장소는 fork할 수 없습니다. `git clone` 후 **자기 브랜치**에서 작업하세요 |

원본 저장소는 **읽기 전용으로 소비**됩니다. 여러 명이 동시에 써도 서로 영향을 주지 않습니다.

---

## 참여

실습 결과를 **Pull Request로 보내셔도 됩니다.** 병합은 하지 않고 리뷰를 남긴 뒤 닫습니다 — 거절이 아니라,
병합하면 다음 학습자의 시작 상태가 무너지기 때문입니다. 규칙: [CONTRIBUTING.md](CONTRIBUTING.md)

## 만든 곳·라이선스

- 만든 곳: **AgentCompany** — 시리즈 본문은 [allinfo.ai.kr](https://allinfo.ai.kr)에 실립니다.
- 라이선스: [MIT](LICENSE). 코드·샘플 데이터 전부 새로 만든 것이며 외부에서 가져온 자료는 없습니다.
- 질문·오류 제보: 이 저장소의 **Issues**로 남겨 주세요.
