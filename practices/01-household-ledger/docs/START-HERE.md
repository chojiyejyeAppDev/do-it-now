# 어느 회차를 하려면 어디서 시작하나

_실습 01 간단 가계부 기준입니다. 파일 경로는 모두 `practices/01-household-ledger/` 안을 가리킵니다._

이 표에는 **정답이 들어 있지 않습니다.** 어느 브랜치에서 시작하는지만 적혀 있습니다.

| 회차 | 제목 유형 | 이 저장소 사용 | 시작 명령 |
|---|---|---|---|
| 1회 | 기본편 | 재실습 경로 | `git switch -c my-ep01 origin/main` |
| 2회 | 최신편 | 사용 안 함 | — |
| **3회** | 기본편 | **사용** | `git switch -c my-ep03 origin/start/ledger-ep03` |
| 4회 | 최신편 | 사용 안 함 | — |
| **5회** | 기본편 | **사용** | `git switch -c my-ep05 origin/start/ledger-ep05` |
| 6회 | 최신편 | 사용 안 함 | — |
| **7회** | 기본편 | **사용** | `git switch -c my-ep07 origin/start/ledger-ep07` |
| 8회 | 최신편 | 사용 안 함 | — |
| **9회** | 기본편 | **사용** (Node.js 18+ 필요) | `git switch -c my-ep09 origin/start/ledger-ep09` |
| 10회 | 최신편 | 사용 안 함 | — |
| **11회** | 기본편 | **사용** | `git switch -c my-ep11 origin/start/ledger-ep11` |
| 12회 | 최신편 | 사용 안 함 | — |

## 각 시작점에서 테스트를 열면 이렇게 보입니다

| 브랜치 | `tests.html` 첫 줄 |
|---|---|
| `main` | `17개 중 14개 통과 / 3개 실패` |
| `start/ledger-ep05` | `19개 중 18개 통과 / 1개 실패` |
| `start/ledger-ep07` | `19개 중 19개 통과 / 0개 실패` |
| `start/ledger-ep09` | `19개 중 19개 통과 / 0개 실패` |
| `start/ledger-ep11` | `21개 중 19개 통과 / 2개 실패` |

숫자가 이와 다르면 브랜치를 잘못 잡았거나 파일이 수정된 상태입니다.
`git switch <브랜치>` 후 `git checkout -- .` 로 되돌리세요.
(`main`은 `start/ledger-ep03`과 같은 상태입니다.)

## 최신편(2·4·6·8·10·12회)은 왜 저장소를 안 쓰나요

최신편은 "이번 달에 새로 나온 기능을 쓸지 말지 판단하는" 회차입니다.
확인 수단이 **판단 메모**여서 코드가 필요 없습니다.
양식이 필요하면 [`templates/change-note.md`](templates/change-note.md)를 복사해 쓰세요.
