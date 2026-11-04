---
title: '나무박멸'
description: '시키는 대로 정직하게 푼 시뮬레이션. 예전에 틀린 이유가 벽 덮어쓰기와 제초제 고정관념이었음을 찾아낸 기록'
pubDate: 2026-09-15
updatedDate: 2026-09-22
tags: ['simulation']
---
| | 1차 풀이 | 2차 풀이 |
|---|---|---|
| 날짜 | 2026-09-15 | 2026-09-22 |
| 체감 난이도 | G4 | G4 |
| 소요 시간 | 48분 | 44분 |
| 시도 | 1회 | 1회 |
| 실행 시간 | 386ms | 311ms |
| 메모리 | 27MB | 26MB |

## 1차 풀이 (2026-09-15)

### 구상

쓸데없는 기교 부리지 않고 정확하게 제시된 내용만 따르면서 풀었다.

예전에 풀지 못한 상태로 코드리뷰에 참석했었는데, 대단한 묘리가 숨어있다기보단 내가 그냥 말을 제대로 안 들은 탓이었다. 그래서 내용을 적당히 잊을 만한 기간을 스스로에게 주고, 오늘 다시 풀어봤다.

### 구현

문제 내용을 잘 정리해둔 걸로 열심히 구현했다.

딕셔너리, 셋 같은 자료형을 굳이 굳이 끼워 넣거나 여러 단계를 한 번에 합치는 등 나대지 않았다. 그냥 순서대로 구현했다.

### 디버깅

디버깅하면서 예전에 내가 왜 틀렸는지 정확히 찾아낼 수 있었다.

배열에서 **나무 그루 수와 지형 정보를 분리하지 않았는데**, 제초제가 벽을 만나면 멈추는 건 잘 처리했지만 나무를 지운답시고 벽 자리를 0으로 만들어버렸다.

다행히 디버깅 중에 이슈를 잡아내서 처리했다. 실수 모음 +1.

> **결론**: 정보는 종류에 맞춰 다른 배열을 쓰는 게 나을 것 같다.

### 후기

디버깅 중 발견한 문제점을 바탕으로 이전 코드를 수정했는데, 여전히 오답이 나왔다. 마찬가지로 코드를 읽다 보니 어떤 부분이 문제였는지 알 수 있었다.

- 처음 시도할 당시에, 제초제는 **나무에다 뿌려야 한다**는 고정관념에 사로잡혀 있었다.
- 즉, 모든 칸이 벽이거나 빈칸인 경우에는 제초제 자체를 뿌리지 않으므로, 정답보다 많은 수의 나무가 살아남았던 것이다.

근데 이게 참 무서운 게, 재풀이 시점에서 당연하다는 듯이 고쳐지는 파트가 있는 반면, 똑같은 실수를 그대로 재현해서 디버깅 단계에서나 발견할 수도 있다는 거다.

이 문제를 최대한 실수 없이 푸는 방법은 나무를 제외한 지형지물을 한 배열에, 나무 정보를 다른 배열에 저장해서 따로 관리하는 것 같다. 굳이? 싶을 수도 있는데, 값 덮어씌우는 실수를 자주 하는 편이라 나 한정 해결책이다.

### 코드

```py collapse={86-103}
def debug(msg):
    print()
    print(msg)
    for row in land:
        print(*row)


def grow():
    delta = [[0] * N for _ in range(N)]
    for cr in range(N):
        for cc in range(N):
            if land[cr][cc] > 0:
                for dr, dc in [(-1, 0), (0, 1), (1, 0), (0, -1)]:
                    nr, nc = cr+dr, cc+dc
                    if not(0 <= nr < N and 0 <= nc < N):
                        continue
                    if land[nr][nc] <= 0:
                        continue
                    delta[cr][cc] += 1

    for cr in range(N):
        for cc in range(N):
            land[cr][cc] += delta[cr][cc]


def reproduce():
    delta = [[0] * N for _ in range(N)]
    for cr in range(N):
        for cc in range(N):
            if land[cr][cc] > 0:
                candidates = []

                for dr, dc in [(-1, 0), (0, 1), (1, 0), (0, -1)]:
                    nr, nc = cr + dr, cc + dc
                    if not (0 <= nr < N and 0 <= nc < N):
                        continue
                    if chem[nr][nc] >= time:
                        continue
                    if land[nr][nc] == 0:
                        candidates.append((nr, nc))

                for nr, nc in candidates:
                    delta[nr][nc] += land[cr][cc] // len(candidates)

    for cr in range(N):
        for cc in range(N):
            land[cr][cc] += delta[cr][cc]


def spread(cr, cc):
    result = [land[cr][cc], [(cr, cc)]]
    if land[cr][cc] <= 0:
        return result

    for dr, dc in [(-1, -1), (-1, 1), (1, 1), (1, -1)]:
        for rep in range(1, K + 1):
            nr, nc = cr+dr*rep, cc+dc*rep
            if not (0 <= nr < N and 0 <= nc < N):
                continue
            if land[nr][nc] <= 0:
                result[1].append((nr, nc))
                break
            result[0] += land[nr][nc]
            result[1].append((nr, nc))
    return result


def kill(time):
    global answer
    candidates = []
    for cr in range(N):
        for cc in range(N):
            if land[cr][cc] >= 0:
                kills, coords = spread(cr, cc)
                candidates.append([kills, cr, cc, coords])
    candidates.sort(key=lambda x: [-x[0], x[1], x[2]])

    kills, _, _, coords = candidates[0]
    for cr, cc in coords:
        if land[cr][cc] > 0:
            land[cr][cc] = 0
        chem[cr][cc] = time+C
    answer += kills


if __name__ == '__main__':
    N, M, K, C = map(int, input().split())
    land = [list(map(int, input().split())) for _ in range(N)]
    chem = [[-1] * N for _ in range(N)]

    answer = 0
    time = 0

    for _ in range(M):
        grow()
        # debug('after growth')
        reproduce()
        # debug('after reproduction')
        kill(time)
        # debug('after kills')
        time += 1

    print(answer)
```

## 2차 풀이 (2026-09-22)

### 코멘트

함수 안 쓰는 연습 2. 디버깅이나 단위 테스트가 어려워서 이제 시도 안 할 듯.

처음 푼다고 생각하고, 내가 했을 법한 행동을 취해봤다(성장과 번식 한 번에 처리하기). 예전 같았으면 아마 집합 가지고 까불다가 번번이 실패했을 텐데, 이번엔 별 어려움 없이 구현했다.

그리고 저번에 생각한 대로 나무 그루 수와 지형 정보를 따로 관리할까 생각해봤는데, 득보다 실이 많을 것으로 판단해서 그만두기로 했다.

그냥 문제를 너무 실수하기 좋게 만들어서 값을 덮어씌우는 실수를 또 할 뻔했다. 다행히 제출 전에 코드를 처음부터 끝까지 읽으며 조기에 잡아낼 수 있었다.

### 코드

```py collapse={1-99}
if __name__ == '__main__':
    N, M, K, C = map(int, input().split())
    land = [list(map(int, input().split())) for _ in range(N)]
    chem = [[-1] * N for _ in range(N)]

    dr = [-1, -1, 0, 1, 1, 1, 0, -1]
    dc = [0, 1, 1, 1, 0, -1, -1, -1]

    time = 0
    answer = 0

    for _ in range(M):

        # TODO: 인접 4칸 중 나무 있는 칸의 수 만큼 나무 성장 (동시)
        # TODO: 벽, 다른 나무, 제초제가 없는 빈칸에 번식 (동시)
        #   번식량 = (현재 칸 나무 그루 수) // (번식이 가능한 칸의 개수)
        g_delta = [[0] * N for _ in range(N)]
        r_delta = [[0] * N for _ in range(N)]

        for cr in range(N):
            for cc in range(N):
                if land[cr][cc] > 0:

                    g_cnt = 0
                    r_cnt = 0
                    r_loc = []

                    for i in range(0, 8, 2):
                        nr = cr + dr[i]
                        nc = cc + dc[i]

                        if not(0 <= nr < N and 0 <= nc < N):
                            continue
                        if land[nr][nc] > 0:
                            g_cnt += 1
                            continue
                        if chem[nr][nc] >= time:
                            continue
                        if land[nr][nc] < 0:
                            continue

                        r_cnt += 1
                        r_loc.append((nr, nc))

                    g_delta[cr][cc] += g_cnt
                    for nr, nc in r_loc:
                        r_delta[nr][nc] += (land[cr][cc] + g_cnt) // r_cnt

        for cr in range(N):
            for cc in range(N):
                land[cr][cc] += g_delta[cr][cc]
                land[cr][cc] += r_delta[cr][cc]

        # TODO: 가장 많은 나무를 죽일 수 있는 제초제 시작점과 투약 좌표 탐색
        #   나무 없는 칸: 해당 자리만 뿌림
        #   나무 있는 칸: 기존 칸 제외 최대 K칸 대각선으로 전파
        #       벽이나 빈 공간 만나면 거기까지만 전파
        #   우선 순위: 행, 열 작은 순
        candidates = []
        for cr in range(N):
            for cc in range(N):

                if land[cr][cc] <= 0:
                    candidates.append([0, cr, cc, [(cr, cc)]])
                    continue

                kills = land[cr][cc]
                locations = [(cr, cc)]

                for i in range(1, 8, 2):
                    for j in range(1, K+1):
                        nr = cr + dr[i] * j
                        nc = cc + dc[i] * j

                        if not (0 <= nr < N and 0 <= nc < N):
                            break

                        if land[nr][nc] <= 0:
                            locations.append((nr, nc))
                            break

                        kills += land[nr][nc]
                        locations.append((nr, nc))
                candidates.append([kills, cr, cc, locations])
        candidates.sort(key=lambda x: [-x[0], x[1], x[2]])

        # TODO: 제초제 뿌리고 죽인 나무의 수 만큼 점수 추가
        #   뿌린 위치에 현재 시간 + C만큼 유통기한 기록
        kills, _, _, locations = candidates[0]
        answer += kills
        for cr, cc in locations:
            land[cr][cc] = min(0, land[cr][cc])
            chem[cr][cc] = time + C

        # TODO: 시간 증가
        time += 1

    # 정답 출력
    print(answer)
```
