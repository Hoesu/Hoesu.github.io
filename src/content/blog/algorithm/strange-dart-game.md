---
title: '이상한 다트 게임'
description: '회전, 인접 제거, 정규화 세 함수로 나눈 시뮬레이션. 열만 끝과 끝이 이어지는 치사한 조건에 당한 기록'
pubDate: 2026-08-31
tags: ['simulation', 'rotation']
---
| | 풀이 |
|---|---|
| 날짜 | 2026-08-31 |
| 체감 난이도 | G5 |
| 소요 시간 | 1시간 15분 |
| 시도 | 1회 |
| 실행 시간 | 143ms |
| 메모리 | 21MB |

## 풀이 (2026-08-31)

### 구상

문제에서 시키는 게 은근 많아서 구상부터 철저히 하고 들어갔다. (항상 월요일 같은 컨디션이면 얼마나 좋을까)

크게 **회전, 인접 제거, 정규화** 3개의 함수로 나눠서 설계했다.

**회전**

별거 없었고, 굳이 `deque`로 `rotate`를 해야 하나 고민했다. 특히 나중에 인접 제거 파트로 넘어가면 인덱싱을 해야 하는데, 그럴 바엔 리스트 슬라이싱으로 구현하는 게 낫겠다고 생각했다.

**인접 제거**

진짜 너무 치사하다는 생각밖에 안 든다.

- 이제는 너무나도 익숙해진 끝과 끝 연결인데, **열 방향만** 그렇고 행 방향은 그렇지 않다. (구상 때는 모르고 넘어갔고, 나중에 디버깅하면서 찾았다)
- 정말 중요한 부분은, 값이 지워져서 0이 됐으면 중복 체크 대상에서 아예 제외시켜야 한다는 것.
- 한 칸 체크하고 거기서 지워버리면 다음 연산에서 꼬이기 때문에 방문 배열을 활용할 계획을 세웠다. 전부 1로 초기화하고, 인접 체크된 곳만 0으로 바꿔서 나중에 원본 배열에 합성곱해주는 방식이다.

**정규화**

뭐... 그냥 시키는 대로 하면 된다. 그래도 나름 중요한 부분은, 인접 제거 단계에서 미리 제거 여부를 남겨두면 배열 순회를 안 해도 된다는 것.

그리고 `x` 값 들어온 걸 1 안 빼고 그대로 쓰고 싶어서 일부러 배열 인덱스를 1부터 했는데, 나중 가서 좀 후회했다.

### 구현

그냥 열심히 구현하니까 됐다. 구상을 잘하고 들어가서 거의 막힘없이 풀었다.

내가 주석을 쓰지 않고 코드를 짰다는 건 그렇게 고뇌하지 않았다는 뜻이기에...

### 디버깅

요즘 사람들 코드를 보면 다들 배열 프린트 함수를 만들어서 디버깅 시간을 단축하려는 모습이 보인다. 좋아 보여서 나도 따라 해봤다. 내 거는 커스텀 메시지도 출력해줌!

**1차 디버깅: 끝과 끝 연결 독해 이슈**

문제를 다시 읽어보니 역시 좀 애매한 감이 없잖아 있는데... 행의 끝 부분을 `n`으로 표현한 부분이 일반화한 식이라고 착각할 여지가 있었다. 그래서 행에 대해서는 범위 제한을 주고, 열에 대해서는 끝과 끝 이동 방식을 사용하게 해서 해결했다.

**2차 디버깅: 정규화 재점검**

제출 버튼을 누르려는 찰나, 욕망을 억누르고 정규화까지 재점검했다. 결론적으로 정말 보기 잘했다. 분명 구상 단계에서 **0 무시**를 생각하고 들어갔는데, 구현에서 빼먹었었다.

### 후기

어이 출제자, 정정당당하게 싸워라.

### 코드

```py collapse={92-117}
# 회전 함수. 걍 리스트 써라.
# 대꾸(deque) 하지 말고 엌ㅋㅋ
def rotate(x, d, k):
    k %= M
    for i in range(0, N+1, x):
        if i == 0:
            continue
        if d == 0:
            l1 = arr[i][-k:]
            l2 = arr[i][:-k]
            arr[i] = l1 + l2
        else:
            l1 = arr[i][k:]
            l2 = arr[i][:k]
            arr[i] = l1 + l2


# 인접 중복을 체크하며 숫자 제거하는 함수
def remove():
    # 동시에 싹다 지워야 하므로 방문 배열 필요
    vst = [[]] + [[1] * M for _ in range(N)]
    for r in range(1, N+1):
        for c in range(M):
            # 값 이미 지워진 상태면 무시합니다.
            if arr[r][c] == 0:
                continue

            # 현재 칸과 인접 칸 중에 중복 몇개?
            dup_cnt = 0
            # 4방향 순회
            for i in range(4):
                # 행은 끝과 끝 연결이 아님
                nr = r + dr[i]
                # 열은 끝과 끝 연결이 가능
                nc = (c + dc[i]) % M
                # 행 범위 벗어난건 무시
                if not 1 <= nr < N+1:
                    continue
                # 만약 인접 중에 값이 동일한 애들 있으면
                if arr[r][c] == arr[nr][nc]:
                    # 방문 배열 해당 위치 0으로 만들고
                    vst[nr][nc] = 0
                    # 중복 카운트 올려주기
                    dup_cnt += 1
            # 현재 위치에 인접한 애들 순회한 결과 카운트 1 이상이면
            # 현재 위치도 방문 배열에서 0 처리해주기
            if dup_cnt > 0:
                vst[r][c] = 0
    # 나중에 정규화 할지 말지 알려주기 위한 카운트
    rmv_cnt = 0
    # 원본 배열과 방문 배열 합성곱
    for r in range(1, N+1):
        for c in range(M):
            if vst[r][c] == 0:
                arr[r][c] = 0
                rmv_cnt += 1
    return rmv_cnt


# 정규화를 합시다
def normalize():
    # 0은 무시해줘야 해서 루프 돌아야 한다..
    sm, cnt = 0, 0
    for r in range(1, N+1):
        for c in range(M):
            if arr[r][c] > 0:
                sm += arr[r][c]
                cnt += 1
    avg = sm // cnt
    # 문제에서 시킨대로 평균 기준 플마 1
    for r in range(1, N+1):
        for c in range(M):
            if arr[r][c] == 0:
                continue
            if arr[r][c] > avg:
                arr[r][c] -= 1
            elif arr[r][c] < avg:
                arr[r][c] += 1
            else:
                continue


# 요즘 다들 이거 하더라구요
def debug(msg):
    print(msg)
    for row in arr:
        print(*row)
    print('------')
    print()


if __name__ == '__main__':
    dr = [-1, 1, 0, 0]
    dc = [0, 0, -1, 1]
    N, M, Q = map(int, input().split())
    arr = [[]] + [list(map(int, input().split())) for _ in range(N)]

    for _ in range(Q):
        x, d, k = map(int, input().split())
        rotate(x, d, k)
        # debug('after rotating...')

        num_removed = remove()
        # debug(f'after removing {num_removed} numbers...')

        # 최근에 배운 배열 전체 합 매핑으로 하는법
        if sum(map(sum, arr)) == 0:
            break
        # 지운 값이 존재하면 정규화 안함.
        elif num_removed > 0:
            continue
        else:
            normalize()
            # debug(f'after normalizing values...')

    # 정답 출력
    print(sum(map(sum, arr)))
```
