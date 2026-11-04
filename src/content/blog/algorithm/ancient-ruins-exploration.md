---
title: '고대 문명 유적 탐사'
description: '부분 회전 완전탐색과 BFS로 푼 유적 탐사. 좌표 변환 회전이 특정 칸에서만 맞아서 zip으로 갈아탄 기록'
pubDate: 2026-09-17
updatedDate: 2026-10-05
tags: ['simulation', 'rotation', 'bfs']
---
| | 1차 풀이 | 2차 풀이 |
|---|---|---|
| 날짜 | 2026-09-17 | 2026-10-05 |
| 체감 난이도 | G4 | G4 |
| 소요 시간 | 2시간 13분 | 40분 |
| 시도 | 1회 | 1회 |
| 실행 시간 | 144ms | 122ms |
| 메모리 | 21MB | 20MB |

## 1차 풀이 (2026-09-17)

### 구상

문제가 직관적이고 간단해서 구상에 큰 어려움은 없었다.

**배열 회전**

배열 회전이 나오자마자 살짝 식은땀을 흘렸다. 왜냐, 아직 완벽하게 마스터하지 못했기 때문.

- 슬라이싱, `zip`으로도 풀 수 있는 문제였는데, 저번에 연습한 좌표 변환을 사용해 보기로 했다.
- 무조건 완전탐색을 해야 해서 180도, 270도 회전도 그냥 90도 회전 하나 구현해 놓고 반복해서 쓰기로 했다.

**유물 찾기와 채우기**

- 유물 짝을 맞춰서 3 이상인 경우를 모두 찾는 건 간단한 BFS라고 생각했다.
- 빈칸을 채울 때 벽면에 있는 값들을 순차적으로 사용하는 부분은 전역 변수로 처리하기로 했다. 매번 번호를 하나씩 빼갈 때마다 카운트를 1 증가시켜서 모듈로로 뽑아가는 방식.

### 구현

바로 회전부터 잡았다. 좌표 변환으로 시작하고 단위 테스트를 돌렸는데, 나는 맞은 줄 알았다.

일단 불안한 회전부터 해결하고 바로 실행부 구성에 들어갔다.

- 요즘은 실행 파트부터 짜고, 중간중간 함수화가 필요하다 싶으면 선언만 해놓는다.
- 그래서 실행부에서 퍼즐이 얼추 다 맞춰지면, 그제야 함수로 올라가서 입력과 출력이 명확한 상태로 구현을 하는 게 좋다.

이 부분도 큰 어려움은 없었고, 초기 구상에서 달라진 부분은 없었다.

**람다 정렬**

람다 정렬을 아주 맛있게 잘 써먹은 케이스라고 생각한다. 튜플 비교 혐오자라...

- **27가지** 경우의 수에서 우선순위를 따지는 동시에 비울 칸 리스트를 받아오게 했다.
- 비울 칸 리스트를 다시 행, 열 우선순위에 맞춰 정렬하여 값을 바로 채워 넣었다.

### 디버깅

여기까지 다 완성하고 갑자기 불안해서 후보 리스트 정렬 결과 디버깅을 돌렸다. 첫 후보들은 다 맞게 나오는데, 그 아래서부터 뭔가 이상했다.

알고 보니 **특정 칸에서만** 부분 회전이 올바르게 작동했던 것... 그래서 머리를 쥐어짜며 고민하다가 도저히 생각이 안 나서 `zip`으로 바꿨다.

### 후기

더 이상은 미룰 수 없겠다 싶어 회전의 묘리를 마스터하고 돌아왔다. 팀을 위한 유형 정리도 할 겸, 전부 정리해서 자료를 남겼다.

### 코드

```py collapse={44-107}
from collections import deque


def partial_rotate90(arr, sr, sc):
    temp = [row[:] for row in arr]
    for i in range(3):
        for j in range(3):
            arr[sr+i][sc+j] = temp[sr+2-j][sc+i]
    return arr


def find_groups(arr):
    vst = [[0]*5 for _ in range(5)]
    coords = []

    for sr in range(5):
        for sc in range(5):
            if vst[sr][sc] != 1:

                vst[sr][sc] = 1
                que = deque()
                que.append((sr, sc))
                temp = [(sr, sc)]

                while que:
                    cr, cc = que.popleft()
                    for i in range(4):
                        nr, nc = cr+dr[i], cc+dc[i]
                        if not(0 <= nr < 5 and 0 <= nc < 5):
                            continue
                        if vst[nr][nc] == 1:
                            continue
                        if arr[nr][nc] != arr[sr][sc]:
                            continue
                        vst[nr][nc] = 1
                        que.append((nr, nc))
                        temp.append((nr, nc))

                if len(temp) >= 3:
                    coords.extend(temp)
    return len(coords), coords


if __name__ == '__main__':
    K, M = map(int, input().split())
    field = [list(map(int, input().split())) for _ in range(5)]
    spawn = list(map(int, input().split()))

    score = []
    spawn_calls = 0
    dr = [-1, 1, 0, 0]
    dc = [0, 0, -1, 1]

    for step in range(1, K+1):
        # TODO 0: 이번 라운드에서 획득한 총 점수
        cur_score = 0

        # TODO 1: 좌상단 좌표 9가지, 회전 방향 3가지, 총 27가지 경우의 탐색
        #   만약 유물을 얻을 수 없다고 하더라도 일단 돌려봐야 하나? => 아니다.
        candidates = []
        for r, c in [(i, j) for i in range(3) for j in range(3)]:
            sample = [row.copy() for row in field]
            for k in range(3):
                sample = partial_rotate90(sample, r, c)
                value, to_fill = find_groups(sample)
                if value > 0:
                    candidates.append([value, k, r, c, to_fill])

        # TODO 2: 어떻게 돌려도 점수 얻지 못하면 조기 종료
        if not candidates:
            break

        # TODO 3: 우선 순위가 가장 높은 방식대로 결정
        candidates.sort(key=lambda x: [-x[0], x[1], x[3], x[2]])
        cur_score += candidates[0][0]
        angle = candidates[0][1]+1
        center_row = candidates[0][2]
        center_col = candidates[0][3]
        for i in range(angle):
            field = partial_rotate90(field, center_row, center_col)

        # TODO 4: 획득한 유물 위치 비우고 새로 채워넣기
        to_fill = candidates[0][4]
        if to_fill:
            to_fill.sort(key=lambda x: [x[1], -x[0]])
            for cr, cc in to_fill:
                spawn_idx = spawn_calls % len(spawn)
                field[cr][cc] = spawn[spawn_idx]
                spawn_calls += 1

        # TODO 5: 유물 짝 맞추기 반복 수행
        while True:
            value, to_fill = find_groups(field)
            if value == 0:
                break
            cur_score += value
            to_fill.sort(key=lambda x: [x[1], -x[0]])
            for cr, cc in to_fill:
                spawn_idx = spawn_calls % len(spawn)
                field[cr][cc] = spawn[spawn_idx]
                spawn_calls += 1

        # TODO 6: 라운드 점수 추가
        score.append(cur_score)

    # TODO 7: 정답 출력
    print(*score)
```

## 2차 풀이 (2026-10-05)

### 코멘트

쉽다 쉬워. 다시 안 풀 문제.

### 코드

```py collapse={42-86}
from collections import deque


def rotate(arr, sr, sc):
    brr = [x[:] for x in arr]
    for i in range(3):
        for j in range(3):
            arr[sr+j][sc+2-i] = brr[sr+i][sc+j]
    return arr


def bfs(arr):
    result = []
    vst = [[0] * 5 for _ in range(5)]
    for sr in range(5):
        for sc in range(5):
            if vst[sr][sc] == 0:
                que = deque()
                que.append((sr, sc))
                vst[sr][sc] = 1
                lst = [(sr, sc)]

                while que:
                    cr, cc = que.popleft()
                    for dr, dc in [(-1, 0), (0, 1), (1, 0), (0, -1)]:
                        nr, nc = cr + dr, cc + dc
                        if not(0 <= nr < 5 and 0 <= nc < 5):
                            continue
                        if vst[nr][nc] != 0:
                            continue
                        if arr[nr][nc] != arr[sr][sc]:
                            continue
                        vst[nr][nc] = 1
                        que.append((nr, nc))
                        lst.append((nr, nc))

                if len(lst) >= 3:
                    result.extend(lst)
    return len(result), result


if __name__ == '__main__':
    K, M = map(int, input().split())
    board = [list(map(int, input().split())) for _ in range(5)]
    spawn = list(map(int, input().split()))
    spawn.reverse()
    answer = []

    for _ in range(K):
        # 회전 후보 탐색
        candidates = []
        for r in range(3):
            for c in range(3):
                temp = [x[:] for x in board]
                for d in range(1, 4):
                    temp = rotate(temp, r, c)
                    count, _ = bfs(temp)
                    candidates.append([count, d, r, c])
        candidates.sort(key=lambda x: (-x[0], x[1], x[3], x[2]))

        # 종료 조건
        if candidates[0][0] == 0:
            break

        # 보드 준비
        _, d, r, c = candidates[0]
        for _ in range(d):
            board = rotate(board, r, c)

        # 연쇄 획득
        score = 0
        while True:
            count, coords = bfs(board)
            if count == 0:
                break

            score += count
            coords.sort(key=lambda x: (x[1], -x[0]))
            for r, c in coords:
                board[r][c] = spawn.pop()

        # 점수 기록
        answer.append(score)

    # 정답 출력
    print(*answer)
```
