---
title: '종전'
description: '아랫 꼭짓점을 고정한 완전탐색. 대각선마다 고윳값을 매기는 아이디어로 구획 분리를 해결'
pubDate: 2026-09-01
updatedDate: 2026-09-24
tags: ['brute-force']
---
| | 1차 풀이 | 2차 풀이 |
|---|---|---|
| 날짜 | 2026-09-01 | 2026-09-24 |
| 체감 난이도 | G3 | G3 |
| 소요 시간 | INF | 1시간 5분 |
| 시도 | 1회 | 1회 |
| 실행 시간 | 305ms | 263ms |
| 메모리 | 23MB | 22MB |

## 1차 풀이 (2026-09-01)

### 구상

아이디어가 필요한 문제. 시간 내에 풀이는 실패했다.

**아랫 꼭짓점 고정**

첫 구상 때부터 깨달은 건 아랫 꼭짓점의 위치가 제한되어 있다는 것이다. N × N 배열 기준으로 행은 2번째부터 N-1번째까지, 열은 2번째부터 N-2번째까지 가능하다.

그래서 굳이 백트래킹으로 뭔가 시도하기보다, 아랫 꼭짓점 위치를 먼저 찍고 나머지 선분들을 이어나가는 방식으로 완탐을 해야겠다고 생각했다.

**대각으로 얼마나 뻗어나갈 수 있나**

- 우리가 그리는 도형은 평행사변형이라, 꼭짓점 기준으로 a, b, a, b만큼 대각선으로 뻗어나간다.
- 현재 아랫 꼭짓점 위치가 r행 c열이면, `2 <= a+b <= max{r, c}`가 무조건 성립한다.
- 이때 범위를 벗어나는 케이스 몇 가지만 걸러주면 모든 경우의 수를 도출할 수 있다.

다만, 마름모를 그리고 나서 구획을 나누어 연산하는 부분에서 막혀버렸다. 나아~중에 문제에서 '체스의 비숍'을 언급하는 부분을 보고 아 이거 그때 그 방법인가? 하는 생각을 했다. 근데 그날 너무 힘들어서 야자 시간에 해결 못 하고 리타이어.

**다음 날 아침**

아침에 일어나서 생각해보니까 대충 윤곽이 나왔다. 모든 대각선 방향에 대해 동일 선상에 있는 녀석들만 **'대소 비교가 가능한 고윳값'**으로 표현할 수 있다면? 그러면 그냥 평소 하듯이 배열을 순회하면서 간단한 조건문으로 구획 분리가 가능하다.

### 구현

그림을 다 그려놓고, 꼭짓점 좌표를 시뮬레이션해서 `r1, c1, r2, c2, r3, c3, r4, c4` 기준으로 구획을 나눴다. 그림 보면서 조건문을 작성했고, 덕분에 실수는 없지 않았다(?)

### 디버깅

이게 그림을 보면서 구현해도 살짝 헷갈리기 때문에, 가벼운 예제로 프린트문 찍으면서 수정했다.

2, 3, 4, 5 구역에 들어가는 애들만 조건문으로 처리하고, 나머지는 전부 1번 구역에 몰아주는 방식으로 코드를 개선했다.

### 후기

대각선의 묘리를 깨우친 자.. 이 전쟁을 끝내리...

### 코드

```py collapse={1-47}
if __name__ == '__main__':
    N = int(input())
    arr = [list(map(int, input().split())) for _ in range(N)]
    total = sum(map(sum, arr))
    answer = int(1e9)

    for r1 in range(2, N):
        for c1 in range(1, N-1):
            lim = max(r1, c1)

            for i in range(2, lim+1):
                for j in range(1, i):

                    r2, c2 = r1-j, c1+j
                    if not(0 <= r2 < N and 0 <= c2 < N):
                        continue

                    r3, c3 = r2-(i-j), c2-(i-j)
                    if not(0 <= r3 < N and 0 <= c3 < N):
                        continue

                    r4, c4 = r3+j, c3-j
                    if not(0 <= r4 < N and 0 <= c4 < N):
                        continue

                    pop = [0] * 6
                    for r in range(N):
                        for c in range(N):
                            # 2번
                            if 0 <= r < r4 and 0 <= c <= c3 and r+c < r3+c3:
                                pop[2] += arr[r][c]
                            # 3번
                            elif 0 <= r <= r2 and c3 < c < N and r-c < r2-c2:
                                pop[3] += arr[r][c]
                            # 4번
                            elif r4 <= r < N and 0 <= c < c1 and r-c > r4-c4:
                                pop[4] += arr[r][c]
                            # 5번
                            elif r2 < r < N and c1 <= c < N and r+c > r1+c1:
                                pop[5] += arr[r][c]
                            else:
                                pop[1] += arr[r][c]

                    diff = abs(max(pop[1:]) - min(pop[1:]))
                    if diff < answer:
                        answer = diff
    print(answer)
```

## 2차 풀이 (2026-09-24)

### 코멘트

이걸 어떻게 잊으리... 대각선 아이디어만 있으면 나머지는 그냥 노가다라서 다시 푸는 일은 없을 것 같다.

굳이 백트래킹으로 풀고 싶진 않은 문제.

### 코드

```py collapse={1-49}
if __name__ == '__main__':
    N = int(input())
    arr = [list(map(int, input().split())) for _ in range(N)]
    answer = int(1e9)

    # 아랫쪽 꼭지점을 지정 가능한 범위
    for sr in range(2, N):
        for sc in range(1, N-1):

            # 평행사변형의 두 변의 길이의 합에 대한 제약: a+b <= max(sr, sc)
            max_span = max(sr, sc)
            for span in range(2, max_span+1):
                for i in range(1, span):

                    # 평행사변형 구축
                    P = [(sr, sc)]
                    for dr, dc, sp in [(-1, 1, i), (-1, -1, span-i), (1, -1, i)]:
                        nr = P[-1][0] + dr * sp
                        nc = P[-1][1] + dc * sp
                        if not(0 <= nr < N and 0 <= nc < N):
                            break
                        P.append((nr, nc))

                    # 길이가 4인 경우만 인구 수 체크
                    if len(P) == 4:
                        p0r, p0c = P[0]
                        p1r, p1c = P[1]
                        p2r, p2c = P[2]
                        p3r, p3c = P[3]

                        pop = [0, 0, 0, 0, 0]
                        for r in range(N):
                            for c in range(N):
                                if r < p3r and c <= p2c and r+c < p2r+p2c:
                                    pop[1] += arr[r][c]
                                elif r <= p1r and p2c < c and r-c < p2r-p2c:
                                    pop[2] += arr[r][c]
                                elif p3r <= r and c < p0c and r-c > p0r-p0c:
                                    pop[3] += arr[r][c]
                                elif p1r < r and p0c <= c and r+c > p0r+p0c:
                                    pop[4] += arr[r][c]
                                else:
                                    pop[0] += arr[r][c]

                        check = max(pop) - min(pop)
                        if check < answer:
                            answer = check

    print(answer)
```
