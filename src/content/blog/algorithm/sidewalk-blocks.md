---
title: '보도블럭'
description: '행/열별로 경사로 설치 가능 여부를 따지는 풀이. 2차에선 집합과 불리언 없이 인덱싱으로 간결하게'
pubDate: 2026-08-27
updatedDate: 2026-09-20
tags: ['simulation']
---
| | 1차 풀이 | 2차 풀이 |
|---|---|---|
| 날짜 | 2026-08-27 | 2026-09-20 |
| 체감 난이도 | S1 | S1 |
| 소요 시간 | 1시간 34분 | 34분 |
| 시도 | 1회 | 2회 |
| 실행 시간 | 67ms | 73ms |
| 메모리 | 17MB | 17MB |

## 1차 풀이 (2026-08-27)

### 구상

구상을 **27분** 정도로 길게 가져갔다. 그림 예제가 상당히 별로였고, 중간에 면담이 잡혀 있어서 집중이 너무 안 됐다.

결국 행/열별로 제시된 조건을 위배하지 않는 경우의 수를 계산하는 문제였고, 가장 중요한 이슈는 두 가지였다.

1. 진행 중 값이 다른 경우가 등장하면, 어떤 방향으로 경사로를 설치해야 하는가?
2. 이미 경사로가 설치되어 있는 위치에 경사로를 중복으로 설치하지 않는 방법은?

2번 질문은 방문 배열을 사용해서 해결하기로 계획을 세웠고, 1번은 구현을 하면서 조금씩 다듬어 나갔다.

### 구현

구현을 하면서 **현재 값과 다음 값의 크기 차이**에 의해 경사로 방향이 결정된다는 걸 파악했다.

에.. 사실은 구상 단계에서 미리 파악하고 들어갔어야 했지만, 오늘따라 너무 산만하고 집중이 안 됐다. 반성하자.

### 디버깅

최소, 최대 케이스를 다 찍어서 돌려봤다.

### 후기

문제가 좀 별로다.

### 코드

```py collapse={56-69}
def scan(lst):
    # 조회하는 행, 열마다 길이 N 방문 리스트 초기화
    vst = [0] * N
    # 아무 문제 없이 루프 다 통과하면 통행 가능하다.
    # 단, 연산량이 적은 조건을 우선으로 본다.
    walkable = True

    # 현재 위치와 다음 위치 대조해야 해서 N-1번만 순회.
    for i in range(N-1):
        # 현재 값과 다음 값이 동일하면 넘어가기
        if lst[i] == lst[i+1]:
            continue

        # 현재 값이 다음 값보다 작으면 뒤로 보기, (i-L+1, i+1)
        elif lst[i] < lst[i+1]:
            s, e = i-L+1, i+1
            # 범위 벗어나면 실패!
            if s < 0:
                walkable = False
                break
            # 값 차이가 1 아니면 실패!
            if lst[i+1]-lst[i] != 1:
                walkable = False
                break
            # 경사로 설치할 땅이 고르지 않으면 실패!
            if len(set(lst[s: e])) > 1:
                walkable = False
                break
            # 이미 다른 경사로 들어와 있으면 실패!
            if sum(vst[s: e]) != 0:
                walkable = False
                break
            # 경사로 설치 가능하면 방문배열 체크 후 넘어가기
            for j in range(s, e):
                vst[j] = 1
        # 현재 값이 다음 값보다 크면 앞으로 보기, (i+1, i+L+1)
        else:
            s, e = i+1, i+L+1
            if e > N:
                walkable = False
                break
            if lst[i]-lst[i+1] != 1:
                walkable = False
                break
            if len(set(lst[s: e])) > 1:
                walkable = False
                break
            if sum(vst[s: e]) != 0:
                walkable = False
                break
            for j in range(s, e):
                vst[j] = 1
    return walkable


if __name__ == '__main__':
    N, L = map(int, input().split())
    arr = [list(map(int, input().split())) for _ in range(N)]

    answer = 0
    # 행 스캔
    for row in arr:
        if scan(row):
            answer += 1
    # 열 스캔
    for col in zip(*arr):
        if scan(col):
            answer += 1
    print(answer)
```

## 2차 풀이 (2026-09-20)

### 코멘트

아, **1 이상 차이 나면** 보도블럭 설치가 아예 불가능하다는 걸 누락했다. 장장 3시간에 걸친 회전 빙하 수난기로 인해 집중력이 저하된 것으로 보임. 다음 문제는 정신 똑바로 차리고 풀자.

그래도 전체적인 구현은 훨씬 간결해진 게 보인다. 쓸데없는 집합이나 불리언 값 사용 없이, 그냥 인덱싱을 활용해 직관적으로 해결했다.

### 코드

```py collapse={37-50}
def check(lst):
    vst = [0] * len(lst)
    for i in range(len(lst)-1):

        # 1 이상 차이나면 무조건 실패
        if abs(lst[i]-lst[i+1]) > 1:
            return False

        # 다음 값이 현재 값보다 클 때: i번째 포함 이전 L개 값 체크
        elif lst[i] < lst[i+1]:
            for j in range(L):
                if i-j < 0:
                    return False
                if vst[i-j] == 1:
                    return False
            # 가능하면 보도블럭 마킹
            for j in range(L):
                vst[i-j] = 1

        # 다음 값이 현재 값보다 작을 때: i+1번째 포함 다음 L개 값 체크
        elif lst[i] > lst[i+1]:
            for j in range(L):
                if i+j+1 >= len(lst):
                    return False
                if vst[i+j+1] == 1:
                    return False
            # 가능하면 보도블럭 마킹
            for j in range(L):
                vst[i+j+1] = 1

        # 다음 값이 현재 값과 같을 때: 진행
        else:
            continue
    return True


if __name__ == '__main__':
    N, L = map(int, input().split())
    arr = [list(map(int, input().split())) for _ in range(N)]
    answer = 0

    for row in arr:
        if check(row):
            answer += 1

    for col in zip(*arr):
        if check(list(col)):
            answer += 1

    print(answer)
```
