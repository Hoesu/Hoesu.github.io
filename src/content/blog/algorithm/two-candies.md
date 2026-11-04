---
title: '2개의 사탕'
description: '백트래킹으로 푼 2개의 사탕. 3045ms에서 752ms까지 줄인 기록'
pubDate: 2026-09-02
updatedDate: 2026-09-28
tags: ['backtracking', 'simulation']
---

| | 1차 풀이 | 2차 풀이 |
|---|---|---|
| 날짜 | 2026-09-02 | 2026-09-28 |
| 체감 난이도 | G3 | G3 |
| 소요 시간 | 1시간 3분 | 44분 |
| 시도 | 1회 | 1회 |
| 실행 시간 | 3045ms (리팩토링 후 808ms) | 752ms |
| 메모리 | 27MB | 26MB |

## 1차 풀이 (2026-09-02)

### 구상

요즘 새로운 루틴을 시도하는 중이라 구상 시간은 **10분**으로 짧게 잡았다. 이 시간 동안 문제를 두 번 읽었다.

1. **첫 번째**: 핵심 정보를 한 줄씩 나만의 언어로 바꿔가며 필기
2. **두 번째**: 필기한 내용과 문제를 대조하며 잘못 읽은 부분이 없는지 확인

그다음엔 TODO 주석으로 pseudo 코드를 작성했다. 구상과 구현 사이 어딘가에 있는 단계다.

**풀이 방향: 백트래킹**

완전한 아이디어형 문제가 아니라면 큰 그림은 보통 금방 그려진다. 이번에는 이런 이유로 백트래킹을 골랐다.

- 기울이는 방향(상하좌우)마다 분기가 생긴다
- 격자가 최대 10 × 10으로 작다
- 시간 제한이 무려 10초(?)다

**pseudo 코드로 잡아낸 것들**

나는 천재가 아니라서, 머릿속으로만 그리면 구현할 때 항상 예상 못 한 문제가 튀어나온다. 그래서 주석으로 pseudo 코드를 일단 막 적어두고 하나씩 점검했더니 로직의 구멍이 하나씩 잡혔다.

- **파란 사탕 처리**: 가장 까다로운 부분이었는데, 결국 사탕이 탈출하는 순간만 잘 잡아서 종료 처리하면 된다는 걸 깨달았다.
- **이동 순서**: 기울이는 방향을 보면 어떤 사탕이 먼저 움직일지 정할 수 있다. 마커로 두 사탕을 구별하기로 했고, 좌우로 기울일 때 두 사탕의 열이 같으면 순서가 상관없다는 것도 체크했다.

### 구현

주석으로 써둔 pseudo 코드를 보면서 그대로 옮겨 치는 시간이었다. 다만 써둔 내용을 비판적으로 다시 보면서 몇 군데는 고쳤다.

- 빨간 사탕이 탈출했을 때의 종료 조건 개선
- `navigate` 함수가 현재 사탕의 탈출 여부를 불리언으로 반환하도록 변경
- 사탕이 2개뿐이라 for문 대신 하나씩 하드코딩으로 처리

### 디버깅

오픈 테스트케이스는 처음부터 다 맞았는데, 실행 속도가 영 시원찮았다. 10 × 10 케이스를 직접 만들어서 돌려봤더니 느낌이 쎄했다.

그래도 내 구현에 불필요한 연산이나 비효율적인 메서드가 많다고는 생각하지 않았다. 시간 초과가 나면 눈치 못 챈 실수가 있거나 방법론을 잘못 고른 거라 받아들이기로 하고 그냥 제출했다.

### 후기

맞긴 맞았는데 영 개운하지 않다. 이 근본 없는 **3045ms**는 도대체 뭘까... 강사님 코드는 **82ms**인 걸 보고 "엥?"만 반복했다.

가능성은 두 가지라고 봤다.

1. 원래 백트래킹 같은 완전탐색을 의도한 문제인데, 다른 사람들이 빈틈을 잘 공략했다.
2. 원래는 시간 제한이 빡빡해서 정석 풀이가 아니면 답이 없는데, 코드트리가 나 같은 사회적 약자를 배려해서 10초로 늘려줬다.

진실은 뭘까. 어쨌든 더 나은 답을 찾아보기로 했다.

**리팩토링해보니 (3045ms → 808ms)**

- 비효율적이지 않긴 개뿔. `get_order`, `navigate` 둘 다 메서드와 패키지를 과하게 써서 너무 비쌌다.
- 최솟값을 구하는 문제라 가지치기를 할 수 있었는데 안 하고 있었다.
- 가지치기 조건이 `>`인지 `>=`인지 항상 따져보자. 이것만으로 약 500ms 차이가 났다.

> **결론**: 시간 제한 1초로도 충분하다. 이 문제는 사실상 틀린 거나 다름없다.

### 코드

```py collapse={82-116}
# TODO 1: 백트래커 함수: 0~3 사이의 방향 벡터 인덱스로 길이 10의 중복있는 순열 생성.
def backtrack(rr, rc, br, bc, r_esp=False, b_esp=False, step=0):
    # TODO 1.0 가지치기
    global answer
    if step >= answer:
        return

    # TODO 1.1 파란 사탕이 먼저 탈출하거나 같이 탈출
    if b_esp:
        return

    # TODO 1.2 빨간 사탕만 탈출, 가능하면 정답 업데이트
    if r_esp:
        if step <= answer:
            answer = step
        return

    # TODO 1.3 종료 조건: step=10
    if step == 10:
        return

    # TODO 1.4 상하좌우 기울이고 재귀 호출
    for i in range(4):
        # TODO 1.4.1 빨간 사탕과 파란 사탕 이동 우선 순위 정하기
        cr1, cc1, m1, cr2, cc2, m2 = get_order(rr, rc, br, bc, i)

        # TODO 1.4.2 각 사탕을 우선 순위에 맞춰 이동시키고, 새로운 좌표와 탈출여부 파악하기
        nr1, nc1, escp1 = navigate(cr1, cc1, i, beware=[])
        nr2, nc2, escp2 = navigate(cr2, cc2, i, beware=[nr1, nc1])

        # TODO 1.4.3 재귀 호출
        if m1 == 'r':
            backtrack(nr1, nc1, nr2, nc2, escp1, escp2, step+1)
        else:
            backtrack(nr2, nc2, nr1, nc1, escp2, escp1, step+1)


# TODO 2: 기울일 방향 정해지면 먼저 움직이는 사탕 찾기: 메서드 사용 최소화
def get_order(rr, rc, br, bc, direction_id):
    # 북, 행 작을수록 높음
    if direction_id == 0 and rr <= br:
        r_first = True
    # 동, 열 클수록 높음
    elif direction_id == 1 and rc >= bc:
        r_first = True
    # 남, 행 클수록 높음
    elif direction_id == 2 and rr >= br:
        r_first = True
    # 서, 열 작을수록 높음
    elif direction_id == 3 and rc <= bc:
        r_first = True
    else:
        r_first = False

    if r_first:
        return rr, rc, 'r', br, bc, 'b'
    else:
        return br, bc, 'b', rr, rc, 'r`'


# TODO 3: One-way 이동 함수
def navigate(cr, cc, direction_id, beware: list):
    # 큐 쓰지 말라고 이놈아
    dr, dc = directions[direction_id]
    nr, nc = cr, cc

    while True:
        cr, cc = nr, nc
        nr, nc = nr + dr, nc + dc
        # 장애물 만나면 중지, 현재 좌표 반환
        if arr[nr][nc] == 1:
            return cr, cc, False
        # 탈출구 만나면 중지, 탈출 성공 표시
        # 좌표는 아무거나 줘도 상관 없음.
        if arr[nr][nc] == 2:
            return 0, 0, True
        # 다른 사탕이 먼저 움직였고, 해당 위치에 사탕이 존재하면 중지.
        if beware and nr == beware[0] and nc == beware[1]:
            return cr, cc, False


if __name__ == '__main__':
    answer = int(1e9)
    R, C = map(int, input().split())
    arr = [[1] * C for _ in range(R)]
    directions = [(-1, 0), (0, 1), (1, 0), (0, -1)]

    # 파란 사탕, 빨간 사탕 위치만 따로 저장
    blue_loc = None
    red_loc = None

    # 0: 빈칸, 1: 장애물, 2: 탈출구, 사탕 위치는 0으로 치환
    for r in range(R):
        line = input().strip()
        for c in range(C):
            if line[c] == '.':
                arr[r][c] = 0
            elif line[c] == '#':
                continue
            elif line[c] == 'B':
                arr[r][c] = 0
                blue_loc = [r, c]
            elif line[c] == 'R':
                arr[r][c] = 0
                red_loc = [r, c]
            else:
                arr[r][c] = 2

    # 백트래킹 호출.
    backtrack(red_loc[0], red_loc[1], blue_loc[0], blue_loc[1])

    # 정답 출력
    if answer <= 10:
        print(answer)
    else:
        print(-1)
```

## 2차 풀이 (2026-09-28)

### 코멘트

실행 시간이 여전히 길긴 하지만, 1차 때 여러 번 리팩토링해서 겨우 도달한 시간(808ms)을 생각하면 준수하다.

BFS로 푸는 방법도 있었던 것 같은데, 그걸 아는 상태에서 떠올리는 건 반칙 같아서 내가 느끼기에 가장 자연스러운 방법으로 풀었다.

솔직히 이번 풀이는 너무 쉽게 느껴졌다. 1차와 달라진 점을 굳이 꼽자면 두 가지다.

- 보드 배열을 숫자로 변환하지 않고 그대로 썼다.
- 이동 방향에 따라 우선순위를 정렬한 뒤, 두 사탕의 이동을 `tilt` 함수 하나에서 한 번에 처리했다.

다시 풀지는 않을 문제. 아니다, 다음엔 BFS?

### 코드

```py collapse={64-86}
def tilt(br, bc, rr, rc, d):
    movers = [[br, bc, 'B'], [rr, rc, 'R']]
    if d == 0:
        movers.sort(key=lambda x: x[0])
    elif d == 1:
        movers.sort(key=lambda x: -x[0])
    elif d == 2:
        movers.sort(key=lambda x: x[1])
    else:
        movers.sort(key=lambda x: -x[1])

    escaped = []
    cr1, cc1, m1 = movers[0]
    while True:
        nr, nc = cr1 + dr[d], cc1 + dc[d]
        if board[nr][nc] == '#':
            break
        if board[nr][nc] == 'O':
            cr1, cc1 = nr, nc
            escaped.append(m1)
            break
        cr1, cc1 = nr, nc

    cr2, cc2, m2 = movers[1]
    while True:
        nr, nc = cr2 + dr[d], cc2 + dc[d]
        if board[nr][nc] == '#':
            break
        if board[nr][nc] == 'O':
            cr2, cc2 = nr, nc
            escaped.append(m2)
            break
        if not escaped and nr == cr1 and nc == cc1:
            break
        cr2, cc2 = nr, nc

    positions = [(cr1, cc1, m1), (cr2, cc2, m2)]
    positions.sort(key=lambda x: x[-1])
    br, bc, _ = positions[0]
    rr, rc, _ = positions[1]
    return escaped, br, bc, rr, rc


def backtrack(br, bc, rr, rc, escaped=[], step=0):
    global answer
    if escaped:
        if len(escaped) == 1:
            if escaped[0] == 'R':
                if step < answer:
                    answer = step
        return

    if step >= answer:
        return

    if step == 10:
        return

    for d in range(4):
        next_escaped, nbr, nbc, nrr, nrc = tilt(br, bc, rr, rc, d)
        backtrack(nbr, nbc, nrr, nrc, next_escaped, step+1)


if __name__ == '__main__':
    dr = [-1, 1, 0, 0]
    dc = [0, 0, -1, 1]

    N, M = map(int, input().split())
    board = [list(input().strip()) for _ in range(N)]

    Br, Bc, Rr, Rc = 0, 0, 0, 0
    for r in range(N):
        for c in range(M):
            if board[r][c] == 'B':
                Br, Bc = r, c
                board[r][c] = '.'
            if board[r][c] == 'R':
                Rr, Rc = r, c
                board[r][c] = '.'

    answer = int(1e9)
    backtrack(Br, Bc, Rr, Rc)
    if answer == int(1e9):
        print(-1)
    else:
        print(answer)
```
