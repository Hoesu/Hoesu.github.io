---
title: '술래잡기'
description: '대각선 코너 조건으로 달팽이 이동을 한 칸씩 처리한 시뮬레이션. 2차는 33분 컷'
pubDate: 2026-09-06
updatedDate: 2026-10-04
tags: ['simulation']
---
| | 1차 풀이 | 2차 풀이 |
|---|---|---|
| 날짜 | 2026-09-06 | 2026-10-04 |
| 체감 난이도 | G2 | G4 |
| 소요 시간 | 2시간 | 33분 |
| 시도 | 2회 | 1회 |
| 실행 시간 | 52ms | 58ms |
| 메모리 | 17MB | 16MB |

## 1차 풀이 (2026-09-06)

### 구상

**달팽이 이동과 방향 역전**

달팽이 모양으로 격자를 이동하다가 끝에 다다르면 진행 방향이 역전된다는 내용에 대해 가장 많이 고민했다.

기존처럼 `112233...` 패턴을 활용해서 전체 진로를 그리는 건 쉬운데.. 한 턴에 한 칸씩만 이동한다는 점이 발목을 잡았다. 최대 라운드가 **100회**이므로, 그냥 길이 101짜리 위치, 방향 히스토리를 뽑아놓고 쓸까 고민했다. 그런데 이 방식이 뭔가... 아름답지(?) 못하다는 생각이 들어서 대각을 활용한 방식을 쓰기로 했다.

- 정중앙과 (0, 0)에만 특별히 예외 처리를 해준다.
- 나머지 모든 코너를 조건문으로 표현해서 방향을 꺾을 지점을 알려준다.
- 즉, 현재 위치와 이동 방향만 넣어주면 다음 위치와 이동 방향을 반환하는 함수를 활용한다.

**시간복잡도**

일단 N이 최대 99이므로, 전체 배열 순회에 대한 시간복잡도만 해도 10^4가 소요된다. 모든 도망자를 매 턴 이동시키면서 반드시 한 번은 봐야 하고, 술래의 시야 범위에 들어 있는 도망자를 탐색하는 과정도 필요하다.

예를 들어 나무가 한 그루도 없고, 술래 위치를 제외한 모든 칸에 도망자가 서 있는 최악의 케이스에서 리스트를 쓰는 경우를 상정해봤다.

- 모든 도망자를 이동시키려면 10^4
- 술래 시야 범위 3칸 안에 들어오는 도망자를 찾기 위해 또 10^4 (애들이 죽을수록 줄어들긴 함)

살짝 과장을 보태면 **10^8**이 된다고 생각해서, 처음엔 딕셔너리를 활용해 두 번째 과정의 시간을 단축하고자 했다.

결론적으로 리스트나 딕셔너리나 시간에서 큰 차이가 없었다. 솔직히 딕셔너리가 더 빠를 거라 생각했는데, 차이가 없는 이유는 잘 모르겠다.

### 구현

처음에 딕셔너리를 쓰는 과정에서 실수를 했다. 술래로부터의 맨해튼 거리가 3 초과인 녀석들은 전부 다음 딕셔너리로 넘겨줬는데, 이때 **값을 덮어씌우는 실수**를 해서 정답이 제대로 나오지 않았다.

### 디버깅

코드 한 30분 째려보고 고쳐서 제출했다. 끝나고 리스트를 쓰는 풀이로 리팩토링해봤는데, 시간 차이가 없었다.

### 후기

구현에 너무 많은 시간을 썼다...

### 코드

```py collapse={43-137}
# 맨하탄 거리 함수
def dist(x1, y1, x2, y2):
    return abs(x1-x2) + abs(y1-y2)


# 달팽이 이동 함수
def get_next(cr, cc, cd):
    # reverse: 달팽이 이동이 진행되는 방향 확인용 불리언 값
    # change: 다음 위치로 이동하면 이동 방향의 변경 여부 확인용 불리언 값
    global reverse
    change = False
    # 현재 이동 방향 기준 다음 위치 계산
    dr, dc = directions[cd]
    nr, nc = cr + dr, cc + dc

    # (0, 0)에서 진행 방향 역전
    if nr == 0 and nc == 0:
        reverse = True
        return 0, 0, 2
    # 행렬 정중앙에서 진행 방향 역전
    elif nr == N//2 and nc == N//2:
        reverse = False
        return N//2, N//2, 0
    # 술래의 이동 방향이 바뀌는 모든 대각선상에 대한 처리
    else:
        if nr-nc == -1 and nr+nc < N-1:
            change = True
        if nr-nc == 0 and nr+nc > N-1:
            change = True
        if nr-nc != 0 and nr+nc == N-1:
            change = True
        # 이동 방향에 대한 변경사항이 없으면 다음 좌표와 기존 이동 방향 반환
        if not change:
            return nr, nc, cd
        # 이동 방향에 대한 변경사항이 존재하면 현재 진행 방향 기준 다음 좌표와 새로운 이동 방향 반환
        else:
            if reverse:
                return nr, nc, (cd-1) % 4
            else:
                return nr, nc, (cd+1) % 4


if __name__ == '__main__':
    # 방향 벡터
    directions = [(-1, 0), (0, 1), (1, 0), (0, -1)]

    # 배열 크기, 도망자 수, 나무 수, 진행 라운드
    N, M, H, K = map(int, input().split())

    # 도망자 리스트 초기화
    runners = []
    for _ in range(M):
        x, y, d = map(int, input().split())
        runners.append([x-1, y-1, d])

    # 나무 위치 담은 땅 배열 초기화
    land = [[0] * N for _ in range(N)]
    for _ in range(H):
        x, y = map(int, input().split())
        land[x-1][y-1] = 1

    # 술래 위치, 이동 방향, 진행 방향 초기화
    cr, cc, cd = N//2, N//2, 0
    reverse = False

    # 시간, 점수 초기화
    time = 1
    score = 0

    # 최대 K번만 연산 수행
    while time < K+1:

        # 도망자 모두 잡았으면 조기 종료
        if not runners:
            break

        # 다음 라운드 도망자 위치 저장하기 위한 임시 리스트 초기화
        next_runners = []

        # 도망자 이동
        for x, y, d in runners:
            # 술래와의 맨하탄 거리가 3 이하인 경우
            if dist(x, y, cr, cc) <= 3:
                dx, dy = directions[d]
                nx, ny = x+dx, y+dy
                # 다음 위치가 범위 안이고
                if 0 <= nx < N and 0 <= ny < N:
                    # 술래가 있는 위치면 이동 불가
                    if nx == cr and ny == cc:
                        next_runners.append([x, y, d])
                    # 술래가 없는 위치면 이동 가능
                    else:
                        next_runners.append([nx, ny, d])
                # 다음 위치가 범위 바깥이고
                else:
                    nd = (d+2)%4
                    dx, dy = directions[nd]
                    nx, ny = x+dx, y+dy
                    # 술래가 있는 위치면 이동 불가 (방향만 반전)
                    if nx == cr and ny == cc:
                        next_runners.append([x, y, nd])
                    # 술래가 없는 위치면 이동 가능
                    else:
                        next_runners.append([nx, ny, nd])
            # 술래와의 맨하탄 거리가 3 초과인 경우
            else:
                next_runners.append([x, y, d])

        # 술래 이동
        cr, cc, cd = get_next(cr, cc, cd)

        # 도둑 잡기
        dr, dc = directions[cd]
        runners = []
        for x, y, d in next_runners:
            # 나무에 가려져 있는 좌표에선 도둑 사살 불가
            if land[x][y] == 1:
                runners.append([x, y, d])
                continue
            # 첫번째 칸에서 도둑 사살
            if x == cr and y == cc:
                score += time
            # 두번째 칸에서 도둑 사살
            elif x == cr + dr and y == cc + dc:
                score += time
            # 세번째 칸에서 도둑 사살
            elif x == cr + dr * 2 and y == cc + dc * 2:
                score += time
            # 잡지 못한 도둑은 다음 리스트로 넘어간다.
            else:
                runners.append([x, y, d])

        # 시간 증가
        time += 1

    # 정답 출력
    print(score)
```

## 2차 풀이 (2026-10-04)

### 코멘트

거의 비슷하게 풀었다. 굳이 차별점을 찾자면 두 가지가 있겠다.

- 도망자 관리를 딕셔너리로 수행했다.
- 달팽이 이동 함수가 조금 더 깔끔해졌다.

다시 풀지 않을 문제.

### 코드

```py collapse={32-85}
def run(cr, cc, cd):
    nr, nc = cr + DR[cd], cc + DC[cd]
    if not (0 <= nr < N and 0 <= nc < N):
        nr, nc = cr - DR[cd], cc - DC[cd]
        if nr == R and nc == C:
            return cr, cc, (cd+2) % 4
        return nr, nc, (cd+2) % 4
    if nr == R and nc == C:
        return cr, cc, cd
    return nr, nc, cd


def chase(cr, cc, cd, cf):
    nr, nc = cr + DR[cd], cc + DC[cd]
    if nr == 0 and nc == 0:
        return nr, nc, 1, -1
    if nr == N//2 and nc == N//2:
        return nr, nc, 3, 1
    if nr < N//2 and nr-nc == -1:
        nd = (cd + cf) % 4
    elif nr > N//2 and nr-nc == 0:
        nd = (cd + cf) % 4
    elif nr < N//2 and nr+nc == N-1:
        nd = (cd + cf) % 4
    elif nr > N//2 and nr+nc == N-1:
        nd = (cd + cf) % 4
    else:
        nd = cd
    return nr, nc, nd, cf


if __name__ == '__main__':
    DR = (0, 1, 0, -1)
    DC = (1, 0, -1, 0)
    N, M, H, K = map(int, input().split())
    R, C, D, F = N//2, N//2, 3, 1

    runners = dict()
    for _ in range(M):
        x, y, d = map(lambda z: int(z)-1, input().split())
        runners[(x, y)] = [d]

    trees = set()
    for _ in range(H):
        x, y, = map(lambda z: int(z)-1, input().split())
        trees.add((x, y))

    time = 1
    answer = 0
    nxt_runners = dict()

    for _ in range(K):

        # TODO 1: 도망자 이동
        nxt_runners.clear()
        for (r, c), v in runners.items():
            if abs(R-r) + abs(C-c) <= 3:
                for d in v:
                    gr, gc, gd = run(r, c, d)
                    if (gr, gc) in nxt_runners:
                        nxt_runners[(gr, gc)].append(gd)
                    else:
                        nxt_runners[(gr, gc)] = [gd]
            else:
                if (r, c) in nxt_runners:
                    nxt_runners[(r, c)].extend(v)
                else:
                    nxt_runners[(r, c)] = v
        runners = nxt_runners.copy()

        # TODO 2: 술래 이동
        R, C, D, F = chase(R, C, D, F)
        for i in range(3):
            r = R + DR[D] * i
            c = C + DC[D] * i
            if not(0 <= r < N and 0 <= c < N):
                break
            if (r, c) in trees:
                continue
            if (r, c) not in runners:
                continue
            answer += len(runners[(r, c)]) * time
            runners.pop((r, c))
        time += 1
    print(answer)
```
