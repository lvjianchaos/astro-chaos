---
title: "11月11日-华为笔试（非AI岗）"
description: "涉及到归并思想、多源与单源BFS以及dp"
pubDatetime: 2026-11-12T10:00:00+08:00
category: 题解
tags: [逆序对, 归并排序, 分治, 数组, 多源BFS, BFS, 网格图最短路, 图论, 队列,森林转树, 动态规划]
---



##  1-仓储箱序整理

### 题意

有一排货箱，第 `i` 个箱子的重量是 `a[i]`。每次操作可以交换**相邻的两个箱子**，耗电 `1`。目标是让整排箱子的重量**非递减**，即：$a[1] <= a[2] <= ... <= a[m]$ ，求完成整理所需的最小耗电量。

### 思路

每次交换相邻两个数，最多只能消除一个逆序对。按照题意的描述，整理仓储箱序就是一个冒泡排序的过程。我们知道：**最少相邻交换次数 = 逆序对数量**。

例如：

```text
4 1 4 2 3 0
```

统计每个数右边有多少个比它小的数：

| 位置 | 值   | 右边更小的数 | 个数 |
| :--- | :--- | :----------- | :--- |
| 1    | 4    | 1, 2, 3, 0   | 4    |
| 2    | 1    | 0            | 1    |
| 3    | 4    | 2, 3, 0      | 3    |
| 4    | 2    | 0            | 1    |
| 5    | 3    | 0            | 1    |
| 6    | 0    | 无           | 0    |

总数：$4 + 1 + 3 + 1 + 1 + 0 = 10$ 即答案。

所以就转变为了**如何高效的统计逆序对**。不难想暴力的思路：
```cpp
for (int i = 0; i < n; i++) {
    for (int j = i + 1; j < n; j++) {
        if (a[i] > a[j]) ans++;
    }
}
```

时间复杂度：$O(n^2)$，必定超时在当前题目规定下。

使用**归并排序**统计逆序对（我在做这道题的时候有想过，但代码很生疏）：

我们在合并左右有序区间时进行计算，具体如下：左区间 `[l, mid)`、右区间 `[mid, r)`，若在合并时 `a[i] > a[j]`，由于左区间有序，所以 `[i, mid-1]`间的所有元素都大于等于 `a[i]`，也就是说都大于 `a[j]`。因此，这区间的 `mid-1` 个都会与 `a[j]` 组成逆序对，即：产生 `mid-1` 个逆序对。当然，若 `a[i] <= a[j]` ，那么就不产生逆序对。注意，这里的小于等于，这保证了相等元素不会被统计为逆序对。

### 代码实现

```cpp collapse={9-37}
#include <bits/stdc++.h>
using namespace std;
using ll = long long;

ll ans = 0;
vector<ll> a, tmp;

void mergeSort(int l, int r) {
    // 对区间 [l, r) 进行归并排序，并统计逆序对
    if (r - l <= 1) return;

    int mid = (l + r) / 2;

    mergeSort(l, mid);
    mergeSort(mid, r);

    int i = l;
    int j = mid;
    int k = l;

    while (i < mid && j < r) {
        if (a[i] <= a[j]) {
            // 相等时先取左边，避免把相等元素算成逆序对
            tmp[k++] = a[i++];
        } else {
            // a[i] > a[j]
            // 左区间 [i, mid) 中的所有元素都大于 a[j]
            ans += mid - i;
            tmp[k++] = a[j++];
        }
    }

    while (i < mid) tmp[k++] = a[i++];
    while (j < r) tmp[k++] = a[j++];

    for (int p = l; p < r; p++) a[p] = tmp[p];
}

int main() {
    ios::sync_with_stdio(0), cin.tie(0), cout.tie(0);
    int m;cin >> m;

    a.resize(m);
    tmp.resize(m);

    for (int i = 0; i < m; i++) cin >> a[i];
    
    mergeSort(0, m);

    cout << ans << '\n';

    return 0;
}
```

- **时间复杂度**：$O(nlogn)$

- 空间复杂度：$O(n)$

> 注意：答案使用 `long long` 类型，以防整型溢出。

## 2-直播信号通路

### 题意

有一个 `h × w` 的网格，部分格子有基站。每个基站能覆盖与它**曼哈顿距离不超过 `r`** 的所有格子。

人从起点 `(a,b)` 出发，每次只能走上下左右相邻一格，并且**沿途经过的每一格都必须被至少一个基站覆盖**，起点和终点也算“经过”。

求从起点到终点的最少步数；如果无法保持覆盖走到终点，输出 `-1`。
如果起点等于终点，只有该格被覆盖时才输出 `0`，否则输出 `-1`。

### 思路

大体思路：

1. 多源 BFS 求出所有“有信号”的格子；
2. 在有信号的格子上做单源 BFS 求最短路。

但需要注意某些边界或初始化细节，这道题我只过了 70%，可能就在这些问题上。



### 代码实现

```cpp {58-68}
#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(0), cin.tie(0), cout.tie(0);

    int h, w, r;
    cin >> h >> w >> r;

    int a, b, c, d;
    cin >> a >> b;
    cin >> c >> d;

    vector<vector<int>> g(h, vector<int>(w));
    for (int i = 0; i < h; i++) {
        for (int j = 0; j < w; j++) {
            cin >> g[i][j];
        }
    }

    int dx[4] = {-1, 1, 0, 0};
    int dy[4] = {0, 0, -1, 1};

    // 1. 多源 BFS：求每个格子到最近基站的距离，只保留 <= r 的格子
    vector<vector<int>> coverDist(h, vector<int>(w, -1));
    queue<pair<int, int>> q;

    for (int i = 0; i < h; i++) {
        for (int j = 0; j < w; j++) {
            if (g[i][j] == 1) {
                coverDist[i][j] = 0;
                q.push(make_pair(i, j));
            }
        }
    }

    while (!q.empty()) {
        int x = q.front().first;
        int y = q.front().second;
        q.pop();

        // 当前距离已经到 r，不能再向外扩展
        if (coverDist[x][y] == r) continue;

        for (int k = 0; k < 4; k++) {
            int nx = x + dx[k];
            int ny = y + dy[k];
			// 越界
            if (nx < 0 || nx >= h || ny < 0 || ny >= w) continue;
            // 访问过
            if (coverDist[nx][ny] != -1) continue;

            coverDist[nx][ny] = coverDist[x][y] + 1;
            q.push(make_pair(nx, ny));
        }
    }

    // 2. 起点或终点没有覆盖，直接无解
    if (coverDist[a][b] == -1 || coverDist[c][d] == -1) {
        cout << -1 << '\n';
        return 0;
    }

    // 3. 起点等于终点，且已确保该格被覆盖
    if (a == c && b == d) {
        cout << 0 << '\n';
        return 0;
    }

    // 4. 单源 BFS：只在有覆盖的格子上走
    vector<vector<int>> step(h, vector<int>(w, -1));
    queue<pair<int, int>> q2;

    step[a][b] = 0;
    q2.push(make_pair(a, b));

    while (!q2.empty()) {
        int x = q2.front().first;
        int y = q2.front().second;
        q2.pop();

        for (int k = 0; k < 4; k++) {
            int nx = x + dx[k];
            int ny = y + dy[k];
			// 越界
            if (nx < 0 || nx >= h || ny < 0 || ny >= w) continue;
            // 无信号
            if (coverDist[nx][ny] == -1) continue;
            // 访问过
            if (step[nx][ny] != -1) continue;

            step[nx][ny] = step[x][y] + 1;
            q2.push(make_pair(nx, ny));
        }
    }

    cout << step[c][d] << '\n';
    return 0;
}
```

- 时空复杂度：$O(h*w)$

> 
>
> 我个人认为我没过那 30% ，似乎有以下几个需要核对：
>
> 1. 起点等于终点但未覆盖时，是否错误输出 `0`；
> 2. 起点未覆盖时，是否仍然从起点开始单源 BFS；
> 3. 单源 BFS 是否漏了“目标格必须有覆盖”的判断；
> 4. 没有基站时是否输出 `-1`。

## 3-行李依赖装箱

### 题意

有一个承重上限为 `cap` 的箱子，和 `m` 件物品，编号 `0 ~ m-1`。

每件物品有两个属性：

- `cost[i]`：占用重量；
- `gain[i]`：获得价值。

同时给出依赖关系 `parent[i]`：

- `parent[i] = -1`：物品 `i` 没有前置物品，可以直接选；
- `parent[i] = p`：如果要选物品 `i`，就必须同时选物品 `p`。

依赖可以跨越多层，但保证无环。每件物品最多选一次。

求在总重量不超过 `cap` 的前提下，能获得的**最大总价值**。
可以一件都不选，答案为 `0`。

### 思路

### 代码实现