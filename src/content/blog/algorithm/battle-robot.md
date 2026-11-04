---
title: '전투 로봇'
description: 'BFS와 우선순위 큐로 푼 전투 로봇. 최적화 집착이 부른 버그로 4번 제출하고, 2차엔 겉멋 빼고 27분'
pubDate: 2026-08-24
updatedDate: 2026-09-19
tags: ['simulation', 'bfs', 'priority-queue']
---
| | 1차 풀이 | 2차 풀이 |
|---|---|---|
| 날짜 | 2026-08-24 | 2026-09-19 |
| 체감 난이도 | G4 | G4 |
| 소요 시간 | INF | 27분 |
| 시도 | 4회 | 1회 |
| 실행 시간 | 59ms | 54ms |
| 메모리 | 16MB | 17MB |

## 1차 풀이 (2026-08-24)

### 구상

구상 시간은 총 **23분**. 이번에도 클래스로 풀어보려고 했다.

로봇의 행동을 세 단계로 나눠서 생각했다.

1. 최단거리 스캔
2. 가장 가까운 타겟 탐색
3. 이동과 처치

탐색은 **BFS**로 했고, 순위는 **우선순위 큐**로 따지기로 했다.

### 구현

구현 과정에서 큰 실수를 두 가지 범했다. 생각해보면 풀 만한 문제였지만, 그냥 실력으로 깨졌다.

1. 로봇의 레벨이 6보다 높아질 수 있다는 걸 간과했다. → **인덱스 에러**
2. 로봇이 갈 수 없는 칸의 방문 배열 값 처리를 잘못해서 음수가 거리 값으로 들어왔다. → **오답**

### 디버깅

솔직히 현재 구조를 그대로 가져간다면 똑같은 실수를 또 반복했을 것 같다.

**첫 번째 실수: 최적화의 함정**

첫 번째 실수는 시간 초과를 피하려고 나름의 최적화를 시도하는 과정에서 발생했다.

- 기존에는 검사 대상들을 전부 리스트에 넣는 식으로 `in` 연산을 해서, 항상 시간 초과의 위험에 놓여 있었다.
- 이를 개선하려고 `set` 자료형과 `discard` (O(1)) 함수를 활용하기 시작했다.
- 이번 문제에서는 몬스터를 찾으려고 매번 원본 배열을 순회하는 걸 막기 위해, 먹을 수 있는 범위의 레벨만 살펴보고 처치한 몬스터 정보는 셋에서 삭제하려고 했다.
- 하지만 전투 로봇의 레벨이 7을 초과하면 인덱스 에러가 발생하게 된다.

최적화에 집착하다 보니, 오히려 이런 사소한 에러에 취약해지는 스스로를 발견할 수 있었다.

**두 번째 실수: 음수 거리**

레벨은 낮은데 방문할 수 없는 칸을 0으로 처리한 뒤, 힙큐에 넣을 때 1을 빼주면서 음수가 되어버린 케이스였다.

- 내가 직접 짠 코드라서 방문 배열 값이 0인 경우가 나올 수 있다는 건 알고 있었다. (뒷단에서 예외 처리도 하고 있었음)
- 하지만 오류가 한번 안 보이기 시작하면 끝도 없기 때문에...

어떻게 하면 처음부터 이런 버그를 방지할 수 있을지 고민이다.

**별의별 예제**

암튼 어떻게든 정답을 맞혀보려고 별의별 예제들을 뽑아서 다 해봤다. 가로막혀서 한 마리도 처치하지 못하는 시나리오도 시도해봤지만, 그 벽 너머에 처치할 수 있는 몬스터가 존재하는 시나리오까지는 확장하지 못했다.

버그 찾기 너무 어렵다. 아예 지우고 처음부터 다시 짜봤어야 하나?

### 후기

결국 모든 버그는 `get_target` 함수로부터 비롯되었다.

- 우선순위 큐를 과신해서 음수 체크고 뭐고 뜯어볼 생각을 안 했다. → 그리고 생각해보니 이거 굳이 쓸 필요도 없었음.
- 셋 자료형을 활용해서 탐색 범위를 관리하는 연습을 하면서 숙련도를 올릴 필요가 있다.

### 코드

```py collapse={72-97}
from collections import deque
from heapq import heappush, heappop


class Robot:
    def __init__(self, sr, sc):
        self.r = sr
        self.c = sc
        self.level = 2
        self.kills = 0
        self.age = 0
        self.run = True

    def scan_area(self):
        vst = [[0] * N for _ in range(N)]
        vst[self.r][self.c] = 1
        que = deque()
        que.append([self.r, self.c])
        while que:
            cr, cc = que.popleft()
            for i in range(4):
                nr, nc = cr + dr[i], cc + dc[i]
                if not(0 <= nr < N and 0 <= nc < N):
                    continue
                if battlefield[nr][nc] > self.level:
                    continue
                if vst[nr][nc] != 0:
                    continue
                vst[nr][nc] = vst[cr][cc] + 1
                que.append([nr, nc])
        return vst

    def get_target(self, vst):
        # 현재 위치에서 가장 가까운 죽일만한 몬스터 위치 체크
        wanted = []
        for lv, ms in enumerate(monsters):
            if self.level <= lv:
                continue
            for nr, nc in ms:
                if vst[nr][nc] == 0:
                    continue
                heappush(wanted, [vst[nr][nc]-1, nr, nc, lv])
        if wanted:
            d, nr, nc, lv = heappop(wanted)
            monsters[lv].discard((nr, nc))
            return d, nr, nc
        return None, None, None

    def kill(self):
        self.kills += 1
        battlefield[self.r][self.c] = 0
        if self.kills == self.level:
            self.level += 1
            self.kills = 0

    def move(self):
        # 주어진 위치로 이동, 시간 기록, 몬스터 살해.
        vst = self.scan_area()
        distance, gr, gc = self.get_target(vst)
        # 더 이상 갈 수 있는 곳이 없으면 종료
        if distance is None:
            self.run = False
            return
        # 현재 위치 이동
        self.r, self.c = gr, gc
        # 이동한 시간만큼 나이 추가
        self.age += distance
        # 이동한 위치에서 몬스터 살해
        self.kill()


if __name__ == '__main__':
    N = int(input())
    dr, dc = [-1, 1, 0, 0], [0, 0, -1, 1]
    monsters = [set() for _ in range(7)]
    battlefield = [[0] * N for _ in range(N)]
    sr, sc = 0, 0

    for r in range(N):
        line = list(map(int, input().split()))
        for c in range(N):
            if 1 <= line[c] <= 6:
                # 몬스터의 레벨을 인덱스로 하여 위치 저장.
                monsters[line[c]].add((r, c))
                battlefield[r][c] = line[c]
            elif line[c] == 9:
                # 전투로봇의 시작 위치를 추출.
                sr, sc = r, c
                battlefield[r][c] = 0
            else:
                continue

    # 시뮬레이션 시작
    robot = Robot(sr, sc)
    while robot.run:
        robot.move()
    print(robot.age)
```

## 2차 풀이 (2026-09-19)

### 코멘트

아마 이 문제를 처음 풀면서 반성을 많이 하고 스타일을 바꿔보려는 노력을 많이 했던 것 같다. 돌이켜보면 참으로 고마운 문제.

겉멋 다 빼고, **조기 종료**를 추가해서 풀어봤다.

### 코드

```py collapse={40-75}
from collections import deque


def bfs(sr, sc):
    dr = [-1, 1, 0, 0]
    dc = [0, 0, -1, 1]

    que = deque()
    que.append((sr, sc))
    vst = [[-1] * N for _ in range(N)]
    vst[sr][sc] = 0

    candidates = []
    min_dist = int(1e9)

    while que:
        cr, cc = que.popleft()
        if vst[cr][cc] > min_dist:
            break

        for i in range(4):
            nr, nc = cr+dr[i], cc+dc[i]

            if not(0 <= nr < N and 0 <= nc < N):
                continue
            if vst[nr][nc] != -1:
                continue
            if arr[nr][nc] > level:
                continue

            vst[nr][nc] = vst[cr][cc]+1
            que.append((nr, nc))

            if 0 < arr[nr][nc] < level:
                candidates.append([vst[nr][nc], nr, nc])
                min_dist = vst[nr][nc]
    return candidates


if __name__ == '__main__':
    N = int(input())
    arr = [list(map(int, input().split())) for _ in range(N)]

    cr, cc = None, None
    level, kills = 2, 0

    for r in range(N):
        for c in range(N):
            if arr[r][c] == 9:
                arr[r][c] = 0
                cr, cc = r, c

    time = 0
    while True:
        # 타겟 탐색
        candidates = bfs(cr, cc)

        # 타겟 없으면 종료
        if not candidates:
            break

        # 로봇 이동
        candidates.sort(key=lambda x: [x[0], x[1], x[2]])
        dist, nr, nc = candidates[0]
        time, cr, cc = time+dist, nr, nc
        arr[cr][cc] = 0
        kills += 1

        # 레벨 체크
        if kills == level:
            level += 1
            kills = 0

    # 정답 출력
    print(time)
```
