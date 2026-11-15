---
title: "11月11日-华为笔试（非AI岗）"
description: "涉及到归并思想、多源与单源BFS以及dp"
pubDatetime: 2026-11-12T10:00:00+08:00
category: 题解
tags: [huawei, 逆序对, 归并排序, 分治, 数组, 多源BFS, BFS, 网格图最短路, 图论, 队列, 森林转树, 动态规划, DFS序, 树形依赖背包]
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

我们在合并左右有序区间时进行计算，具体如下：

左区间 `[l, mid)`、右区间 `[mid, r)`

若在合并时 `a[i] > a[j]`，由于左区间有序，所以 `[i, mid-1]`间的所有元素都大于等于 `a[i]`，也就是说都大于 `a[j]`。

因此，这区间的 `mid-1` 个都会与 `a[j]` 组成逆序对，即：产生 `mid-1` 个逆序对。

当然，若 `a[i] <= a[j]` ，那么就不产生逆序对。注意这里的小于等于，这保证了相等元素不会被统计为逆序对。

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

#### 一、依赖关系本质是一片森林

每件物品最多只有一个前置对象，且题目保证无环，所以把物品看成节点、把 `parent[i] = p` 看成从 `p` 到 `i` 的一条边，得到的就是一片森林：每个节点最多一个父亲，且不会出现环。例如 `0 -> 1`、`2 -> 3` 表示选 `1` 必须先选 `0`，选 `3` 必须先选 `2`。

为了把森林统一成一棵树，增加一个虚拟根，编号为 `m`，属性为 `cost = 0, gain = 0`，把所有 `parent[i] = -1` 的节点挂到虚拟根下面。因为虚拟根不占重量也不产生价值，选不选它都不影响答案。这样原问题就变成：在这棵树上选一个“祖先闭合”的节点集合，即选了某个节点就必须选它的所有祖先，在总重量不超过 `cap` 的前提下最大化总价值。这是一个典型的树形依赖背包。

#### 二、普通树形背包为什么不够用

普通树形背包通常定义 `dp[u][j]` 为以 `u` 为根的子树中、必须选 `u`、容量为 `j` 时的最大价值，合并子节点时要同时枚举当前子树已用容量和该子节点所用容量，单次合并是 `O(cap^2)`，整棵树下来可能达到 `O(m * cap^2)`。本题 `m <= 1000`、`cap <= 10000`，`cap^2 = 1e8`，再乘 `m` 可能会超时，所以不能直接套普通树形背包。如果使用树形背包，应该进行**size 优化**才可通过。

#### 三、按 DFS 序展开树

对树做一次 DFS，记录每个节点的 DFS 入序 `dfn[u]`、DFS 序对应的节点数组 `order_arr`、以及以 `u` 为根的子树节点数 `subtree_size[u]`（包括 `u` 自己）。DFS 序有一个关键性质：以 `u` 为根的整棵子树在 DFS 序中占据一段连续区间 `[dfn[u], dfn[u] + subtree_size[u] - 1]`。这意味着如果要跳过 `u` 的整棵子树，只需要把下标从 `dfn[u]` 直接跳到 `dfn[u] + subtree_size[u]`，这正是后面处理依赖的关键。

#### 四、重新定义 DP 并写出转移

定义 `dp[i][j]` 表示只考虑 DFS 序从 `i` 开始的节点、剩余容量为 `j` 时能获得的最大价值，其中 `u = order_arr[i]`。对于当前节点 `u` 有两种选择。不选 `u` 时，因为选了子节点必须先选父节点，所以 `u` 的整棵子树都不能选，状态直接跳到 `dp[i + subtree_size[u]][j]`。选 `u` 时，前提是 `j >= cost[u]`，先消耗 `cost[u]` 并取得 `gain[u]`，然后继续考虑 DFS 序的下一个节点，即 `gain[u] + dp[i + 1][j - cost[u]]`。转移方程合起来就是：

```cpp
dp[i][j] = max(
    dp[i + subtree_size[u]][j],              // 不选 u，跳过整棵子树
    gain[u] + dp[i + 1][j - cost[u]]         // 选 u，继续看下一个 DFS 序
)
```

第二种情况需要满足 `j >= cost[u]`。注意 `i + 1` 很可能就是 `u` 的某个子节点，这就自然允许继续选子树中的物品，依赖约束被自动满足，无需再单独判断。

#### 五、为什么外层倒序、内层可以正序

从转移可以看出，`dp[i][j]` 依赖的 `dp[i + 1][...]` 和 `dp[i + subtree_size[u]][...]` 下标都比 `i` 大，也就是只依赖 DFS 序更靠后的行，而不依赖同一行中容量更小的状态。因此递推必须从 DFS 序末尾开始往前推，外层循环写成 `for (int i = n - 1; i >= 0; i--)`。如果反过来从 `i = 0` 正序计算，`dp[i + 1]` 和 `dp[i + subtree_size[u]]` 此时还没算出来，仍然是初始值 `0`，转移结果必然出错。所以倒序不是习惯问题，而是由状态依赖方向决定的。边界上，当 `i = n` 时已经没有节点可选，`dp[n][j] = 0`，`dp` 初始化为全 `0` 正好满足；同时任意节点都满足 `i + subtree_size[u] <= n`，因为子树最多延伸到 DFS 序末尾，不会越界。

至于内层容量 `j`，正序倒序都不影响正确性。例如：传统一维 01 背包中 `dp[j]` 依赖同一行的 `dp[j - cost]`，所以容量必须倒序；本题使用的是二维表，`dp[i][j]` 只依赖 `dp[i + 1][...]` 和 `dp[i + subtree_size[u]][...]`，不依赖同一行其他容量，所以内层容量顺序自由，真正决定顺序的只有外层 DFS 序必须倒序。

#### 六、最终答案

虚拟根的 `cost = 0, gain = 0`，选它不影响重量和价值，所以从 DFS 序第 `0` 个节点（虚拟根）开始、容量为 `cap` 的状态就是答案：`dp[0][cap]`。一件都不选也是合法方案，`dp` 初始为 `0`，不会出现负数。

核心：**不选父节点就跳过整棵子树，选了父节点就继续看 DFS 序的下一个节点。** 这样把树形依赖背包压缩成线性 DP，时间复杂度从 `O(m * cap^2)` 降到 `O(m * cap)`。

### 代码实现

#### 写法一：dfs序压缩成线性dp

```cpp collapse={10-19}
#include <bits/stdc++.h>
using namespace std;

// DFS 需要的全局状态
vector<vector<int>> children;
vector<int> dfn, order_arr, subtree_size;
int timer;

void dfs(int u) {
    dfn[u] = timer;
    order_arr[timer] = u;
    timer++;

    subtree_size[u] = 1;
    for (int v : children[u]) {
        dfs(v);
        subtree_size[u] += subtree_size[v];
    }
}

int main() {
    ios::sync_with_stdio(0), cin.tie(0), cout.tie(0);
    
    int cap, m; cin >> cap >> m;

    vector<int> cost(m), gain(m);
    for (int i = 0; i < m; i++) {
        cin >> cost[i] >> gain[i];
    }

    vector<int> parent(m);
    for (int i = 0; i < m; i++) cin >> parent[i];

    // 虚拟根编号为 m
    int root = m;
    int n = m + 1;

    vector<int> cost_all(n), gain_all(n);
    for (int i = 0; i < m; i++) {
        cost_all[i] = cost[i];
        gain_all[i] = gain[i];
    }
    cost_all[root] = 0;
    gain_all[root] = 0;

    // 建树：虚拟根挂所有 parent = -1 的节点
    children.assign(n, vector<int>());
    for (int i = 0; i < m; i++) {
        if (parent[i] == -1) {
            children[root].push_back(i);
        } else {
            children[parent[i]].push_back(i);
        }
    }

    // 初始化 DFS 全局状态
    dfn.assign(n, -1);
    order_arr.assign(n, 0);
    subtree_size.assign(n, 0);
    timer = 0;

    dfs(root);

    // DP
    vector<vector<int>> dp(n + 1, vector<int>(cap + 1, 0));

    for (int i = n - 1; i >= 0; i--) {
        int u = order_arr[i];
        int c = cost_all[u];
        int g = gain_all[u];
        int sz = subtree_size[u];

        for (int j = 0; j <= cap; j++) {
            // 不选 u，跳过整棵子树
            dp[i][j] = dp[i + sz][j];

            // 选 u
            if (j >= c) {
                dp[i][j] = max(dp[i][j], g + dp[i + 1][j - c]);
            }
        }
    }

    cout << dp[0][cap] << '\n';
    return 0;
}
```

设：$n = m + 1$为加上虚拟根后的节点总数。

**时间复杂度**

- 建树：`O(m)`

- DFS：`O(n)`

- DP：i 从 0 到 n-1，j 从 0 到 cap

​	所以 DP 部分时间复杂度：$O(n * cap)$

总时间复杂度：$O(m * cap)$

**空间复杂度**

- 主要数组：

  - `children`：`O(n)`

  - `dfn`、`order`、`subtree_size`：`O(n)`

  - `dp`：`(n + 1) * (cap + 1)`

所以空间复杂度：$O(n * cap)$

#### 写法二 树形背包（**子树重量上界限制**/“size 优化”）

```cpp
#include <bits/stdc++.h>
using namespace std;

int cap, m;
vector<vector<int>> children;
vector<int> c, g;
vector<vector<int>> dp;
vector<int> sz;   // sz[u]：子树 u 中所有物品 cost 之和的上界（会被截断到 cap）

void dfs(int u) {
    // 必须选 u，初始只有 dp[u][c[u]] 有效
    for (int j = 0; j <= cap; j++) dp[u][j] = -1;
    dp[u][c[u]] = g[u];

    int curSize = c[u];   // 当前已合并部分的总重量上界

    for (int v : children[u]) {
        dfs(v);

        // 倒序枚举 j，防止同一个子节点被重复使用
        for (int j = min(curSize, cap); j >= c[u]; j--) {
            if (dp[u][j] == -1) continue;

            // 选 v 的某一部分
            for (int k = c[v]; k <= sz[v] && j + k <= cap; k++) {
                if (dp[v][k] == -1) continue;
                dp[u][j + k] = max(dp[u][j + k], dp[u][j] + dp[v][k]);
            }
        }

        curSize += sz[v];
        if (curSize > cap) curSize = cap;
    }

    sz[u] = curSize;
}

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    cin >> cap >> m;

    c.resize(m);
    g.resize(m);
    for (int i = 0; i < m; i++) cin >> c[i] >> g[i];

    vector<int> parent(m);
    for (int i = 0; i < m; i++) cin >> parent[i];

    int root = m;
    int n = m + 1;

    // 加上虚拟根
    c.push_back(0);
    g.push_back(0);

    children.assign(n, vector<int>());
    for (int i = 0; i < m; i++) {
        if (parent[i] == -1) {
            children[root].push_back(i);
        } else {
            children[parent[i]].push_back(i);
        }
    }

    dp.assign(n, vector<int>(cap + 1, -1));
    sz.assign(n, 0);

    dfs(root);

    int ans = 0;
    for (int j = 0; j <= cap; j++) {
        ans = max(ans, dp[root][j]);
    }

    cout << ans << '\n';
    return 0;
}
```

做了范围优化，实际时间复杂度在 $O(m * cap)\sim O(m * cap^2)$ 接近 $O(m * cap)$