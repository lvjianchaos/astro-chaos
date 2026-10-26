---
title: "「洛谷 P3385」负环复盘"
description: "用 SPFA 判负环，真正卡住我的不是算法，而是三个容易写错的细节。"
pubDatetime: 2026-10-24T20:00:00+08:00
category: 题目
tags: [SPFA, 最短路, 洛谷, 复盘]
problem:
  source: 洛谷
  id: P3385
  url: https://www.luogu.com.cn/problem/P3385
  difficulty: 普及+
  limits: "1s / 128MB"
  tags: [最短路, 负环, SPFA]
---

这是一篇**复盘**，不是完整题解。题目本身很简单：给一张有向图，判断图中是否存在负环。

## 我卡住的地方

### 1. 队列里到底放什么

一开始我把"松弛成功的次数"当成判负环的依据，跑大数据直接 TLE。正确的做法是**统计路径长度**：维护 `cnt[v]`，表示当前到达 $v$ 的这条路径上有多少条边。

$$
cnt[v] = cnt[u] + 1
$$

只要存在一个点满足 $cnt[v] \ge n$，就说明这条路径上有重复的点，即存在负环。

### 2. 为什么不能用 `visited` 数组

SPFA 的 `inQueue` 只是"这个点现在在不在队列里"，跟负环判定没有直接关系。用它判负环会漏判或误判。

### 3. 环上权值和必须是负数

注意题目问的是**负环**而不是**零环**。正权环和零权环都不该判为有解。

## 最终代码

```cpp title="P3385.cpp" {1-2,12-14}
#include <bits/stdc++.h>
using namespace std;

struct Edge {
    int to, w;
};

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    int n, m;
    cin >> n >> m;

    vector<vector<Edge>> g(n + 1);
    for (int i = 0; i < m; ++i) {
        int u, v, w;
        cin >> u >> v >> w;
        g[u].push_back({v, w});
    }

    // 所有点距离置 0 并全部入队，等价于超级源点连向所有点
    vector<int> dist(n + 1, 0), cnt(n + 1, 0);
    queue<int> q;
    vector<bool> inQueue(n + 1, true);
    for (int i = 1; i <= n; ++i) q.push(i);

    bool hasNegativeCycle = false;
    while (!q.empty()) {
        int u = q.front();
        q.pop();
        inQueue[u] = false;

        for (auto [v, w] : g[u]) {
            if (dist[v] > dist[u] + w) {
                dist[v] = dist[u] + w;
                cnt[v] = cnt[u] + 1;
                if (cnt[v] >= n) {
                    hasNegativeCycle = true;
                    break;
                }
                if (!inQueue[v]) {
                    q.push(v);
                    inQueue[v] = true;
                }
            }
        }
        if (hasNegativeCycle) break;
    }

    cout << (hasNegativeCycle ? "YES" : "NO") << '\n';
    return 0;
}
```

## 还没想清楚的问题

SPFA 判负环在最坏情况下是 $O(nm)$，洛谷 P3385 的数据卡得比较紧，实测用 `cnt` 判环 + `SLF`（small label first）优化能过，但正确性证明我还没补上。

> [!NOTE]
> 下次补一篇完整的 SPFA 与 Bellman-Ford 的对比笔记。
