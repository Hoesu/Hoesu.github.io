---
title: '회전하는 빙하'
description: '부분 배열 회전 시뮬레이션. 1772ms 시간초과 위기에서 함수별 시간 측정으로 병목을 찾아 421ms까지 줄인 기록'
pubDate: 2026-08-26
updatedDate: 2026-09-20
tags: ['simulation', 'rotation', 'flood-fill']
---
| | 1차 풀이 | 2차 풀이 |
|---|---|---|
| 날짜 | 2026-08-26 | 2026-09-20 |
| 체감 난이도 | G3 | G3 |
| 소요 시간 | 1시간 51분 | 3시간 |
| 시도 | 2회 | 1회 |
| 실행 시간 | 1772ms (리팩토링 후 421ms) | 360ms |
| 메모리 | 27MB | 23MB |

## 1차 풀이 (2026-08-26)

### 구상

**25분** 정도 구상하고 들어갔다. 내용을 이해하는 데 오래 걸리진 않았고, 완탐, DFS, BFS처럼 비교적 익숙한 맛의 내용들도 있었다.

문제는 **부분 배열 회전**이었다. 미리 pseudo 코드를 작성해봤는데, 여태 한 구상 중에 가장 정성스럽게 했다.

- 부분 배열을 4등분하면 몇 사분면인지에 따라 내부 값들이 이동하는 방향이 결정된다는 걸 파악했다.
- 이동하는 거리는 항상 `2^(LEVEL-1)`만큼이었다.

얼음 녹이기, 덩어리 영역 구하기는 이미 아는 내용이라 바로 구현에 들어갔다.

### 구현

여기서 엄청난 고역을 치렀다. 부분 배열 회전 구상이 틀리진 않았는데, **너무 복잡하게** 생각했다. 그러다 보니 구현 과정에서 자잘한 실수를 많이 저질렀고, 검증 단계에서 정상 작동하게 만드느라 시간을 너무 많이 썼다.

결국 회전을 완료하고 얼음 녹이기와 덩어리 크기 계산만 남겨둔 상태에서, 시간이 정말 없다는 걸 깨달았다. 그때 어디선가 제2의 자아가 튀어나와서 나에게 외쳤다.

> "어서 타! 설명할 시간이 없어!!!"

절대 틀리지는 않되 최적화는 고려하지 않는다는 마인드로 미친 듯이 질주했다.

- DFS가 갑자기 생각 안 나서 BFS로 땜빵쳤다.
- 녹이기 완탐도 가지치기 같은 거 없이 그냥 막 적었다.

어찌저찌 끝은 내고 오픈 테케가 다 맞는지 서둘러 확인했다.

### 디버깅

첫 제출은 **시간 초과**였다... 물론 이때도 시간은 가고 있었고, 코드를 재빨리 읽으며 최적화할 만한 구석을 찾았다.

마침 `melt` 함수에서 얼음 없는 칸에서도 탐색을 돌리고 있다는 걸 포착했고, 가지치기를 끼워 넣어서 겨우겨우 2초 안으로 돌아가게 만들었다.

### 후기

사실 이 문제는 풀이 당시보다, 야자 시간에 시간 단축을 위한 디버깅을 하면서 정말 많이 배웠다.

- 랜덤 모듈을 활용해서 대형 테케를 만드는 걸 숙달할 수 있었다.
- 타임 모듈 응용도도 꽤 올렸다고 생각한다.

예를 들면 같은 for문 안에서 `rotate`, `melt`가 같이 돌아가고 있어서 각자의 실행 시간을 따로 보기 힘들었다. 그래서 함수별로 시간을 따로 재서 바깥의 합산 시간에 계속 더해주는 방식을 시도했다. 그렇게 하니까 몇백 번씩 돌아가도 어떤 함수에서 병목이 생기는지 분리해서 볼 수 있었다.

이런 식으로 개선할 범위를 계속 좁히니까, 이전에는 보이지 않던 문제가 명확히 보였다.

> **결론**: 시간 초과의 가장 큰 원흉은 회전 정보 저장을 위한 **임시 배열을 불필요하게 자주 생성**한 것이었다.

구현량이 이렇게 많은 문제는 처음 풀어보는 것 같은데... 피로도가 상당했다.

### 코드

```py collapse={86-131}
def rotate(level):
    # 전체 배열을 2**level * 2**level 크기의 사각형으로 분할하고 다시 4등분하면,
    # 1사분면 (남), 2사분면 (동), 3사분면 (북), 4사분면 (서)로 나누어 생각할 수 있다.
    step = pow(2, level) // 2
    # 회전 후 빙하 정보를 기록할 임시 배열
    result = [row.copy() for row in glacier]

    # 현재 보고 있는 격자의 회전 방향을 알기 위한 플래그
    r_flag = 0
    c_flag = 0

    # 전체 배열을 2**(level-1) 단위로 분할하고
    # 왼쪽 상단 모서리 좌표를 기준으로 생각하자.
    for r in range(0, limit, step):
        for c in range(0, limit, step):
            # r_flag, c_flag의 홀짝 여부로 현재 격자가 몇 사분면인지 알 수 있다.
            r_mod = r_flag % 2
            c_mod = c_flag % 2

            # 제 1사분면 (남)
            if r_mod == 0 and c_mod == 1:
                dr, dc = 1, 0
            # 제 2사분면 (동)
            elif r_mod == 0 and c_mod == 0:
                dr, dc = 0, 1
            # 제 3사분면 (북)
            elif r_mod == 1 and c_mod == 0:
                dr, dc = -1, 0
            # 제 4사분면 (서)
            else:
                dr, dc = 0, -1
            # 임시 배열[이동 후 위치] = 원본 배열[이동 전 위치]
            for cr in range(r, r+step):
                for cc in range(c, c+step):
                    result[cr + dr*step][cc + dc*step] = glacier[cr][cc]

            c_flag = (c_flag + 1) % limit
        r_flag = (r_flag + 1) % limit
    return result


def melt():
    # 얼음 녹이는 과정은 완탐 아니면 방법이 없다.
    vst = [[0] * limit for _ in range(limit)]
    for cr in range(limit):
        for cc in range(limit):
            # 다만 얼음이 없는 칸은 녹일 수 없으므로 무시 가능
            if glacier[cr][cc] == 0:
                continue

            glacier_cnt = 0
            for i in range(4):
                nr, nc = cr + delta_r[i], cc + delta_c[i]
                # 범위 바깥은 얼음이 없다고 친다.
                if not(0 <= nr < limit and 0 <= nc < limit):
                    continue
                if glacier[nr][nc] == 0:
                    continue
                glacier_cnt += 1
            # 얼음 카운트가 3 미만이면 방문 배열에 기록
            if glacier_cnt < 3:
                vst[cr][cc] = -1
    # 전부 탐색한 다음 한꺼번에 녹이기
    for r in range(limit):
        for c in range(limit):
            glacier[r][c] += vst[r][c]


def dfs(r, c):
    # 전역 변수로 값 업데이트
    global cur_size
    vst[r][c] = 1
    cur_size += 1

    for i in range(4):
        nr, nc = r + delta_r[i], c + delta_c[i]
        if not(0 <= nr < limit and 0 <= nc < limit):
            continue
        if vst[nr][nc] == 1:
            continue
        if glacier[nr][nc] == 0:
            continue
        dfs(nr, nc)


if __name__ == '__main__':
    N, Q = map(int, input().split())
    glacier = [list(map(int, input().split())) for _ in range(2**N)]
    commands = list(map(int, input().split()))
    delta_r = [-1, 1, 0, 0]
    delta_c = [0, 0, -1, 1]
    # 전체 배열 길이 매번 계산하기 싫어요
    limit = pow(2, N)

    # 주어진 회전 명령 순회
    for lv in commands:
        # 회전 레벨 0이면 녹이기만 하고 넘어가기.
        if lv == 0:
            melt()
            continue
        # 회전 레벨 0보다 크면 회전 + 녹이기
        glacier = rotate(lv)
        melt()

    # DFS에서 전역 변수로 사용할 현재 군집 크기
    cur_size = 0
    # 출력으로 사용될 최대 군집 크기
    max_size = 0
    # 방문 배열은 한번만 초기화
    vst = [[0] * limit for _ in range(limit)]

    # 군집 크기는 DFS로 측정
    for r in range(limit):
        for c in range(limit):
            # 얼음 없는 칸 무시
            if glacier[r][c] == 0:
                continue
            # 이미 방문한 칸 무시
            if vst[r][c] == 1:
                continue
            # DFS 시작
            dfs(r, c)
            # 최대 크기 업데이트
            if cur_size > max_size:
                max_size = cur_size
            cur_size = 0

    # 남아있는 얼음 합 출력
    print(sum([sum(row) for row in glacier]))
    # 최대 덩어리 크기 출력
    print(max_size)
```

## 2차 풀이 (2026-09-20)

### 코멘트

와 진짜 회전만 나오면 애가 왜 이렇게 저능해지는지 모르겠다.

사실 이번에 오래 걸린 이유는 **배열 카피를 만들지 않고** 패턴을 활용해서 회전을 시켜보고 싶어서였다. 저번에 공부한 좌표 변환으로 배열을 회전하는 것과는 살짝 개념이 다르다.

나머지 파트는 그냥 할 만했다. DFS가 생각 안 나서 잠시 멈칫하긴 함.

무조건 다시 풀어볼 문제인 것 같다.

### 코드

```py collapse={60-79}
def rotate(level):
    if level == 0:
        return

    l = 2 ** N
    p = 2 ** level
    q = 2 ** (level-1)

    for sr in range(0, l, p):
        for sc in range(0, l, p):

            for i in range(q):
                for j in range(q):

                    temp = arr[sr+i][sc+j]
                    arr[sr+i][sc+j] = arr[sr+i+q][sc+j]
                    arr[sr+i+q][sc+j] = arr[sr+i+q][sc+j+q]
                    arr[sr+i+q][sc+j+q] = arr[sr+i][sc+j+q]
                    arr[sr+i][sc+j+q] = temp


def melt():
    delta = [[0]*(2**N) for _ in range(2**N)]
    for cr in range(2**N):
        for cc in range(2**N):
            if arr[cr][cc] == 0:
                continue

            ice_count = 0
            for i in range(4):
                nr, nc = cr+dr[i], cc+dc[i]
                if not(0 <= nr < 2**N and 0 <= nc < 2**N):
                    continue
                if arr[nr][nc] > 0:
                    ice_count += 1
            if ice_count < 3:
                delta[cr][cc] = -1

    for cr in range(2**N):
        for cc in range(2**N):
            arr[cr][cc] = max(0, arr[cr][cc]+delta[cr][cc])


def area(cr, cc):
    global step
    step += 1
    vst[cr][cc] = step

    for i in range(4):
        nr, nc = cr+dr[i], cc+dc[i]
        if not (0 <= nr < 2 ** N and 0 <= nc < 2 ** N):
            continue
        if vst[nr][nc] != 0:
            continue
        if arr[nr][nc] == 0:
            continue
        area(nr, nc)


if __name__ == "__main__":
    dr = [-1, 1, 0, 0]
    dc = [0, 0, -1, 1]
    N, Q = map(int, input().split())
    arr = [list(map(int, input().split())) for _ in range(2**N)]
    levels = list(map(int, input().split()))

    for level in levels:
        rotate(level)
        melt()

    vst = [[0]*(2**N) for _ in range(2**N)]
    for r in range(2**N):
        for c in range(2**N):
            if arr[r][c] > 0 and vst[r][c] == 0:
                step = 0
                area(r, c)

    print(sum(map(sum, arr)))
    print(max(map(max, vst)))
```
