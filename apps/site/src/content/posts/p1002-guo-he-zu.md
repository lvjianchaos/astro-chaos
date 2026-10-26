---
title: "「洛谷 P1002」过河卒"
description: "棋盘上的路径计数：从状态设计到空间压缩，一步一步把暴力 DP 推到 O(nm)。"
pubDatetime: 2026-10-18T09:00:00+08:00
category: 题解
series: 动态规划入门
tags: [洛谷, P1002, 动态规划, 路径计数]
---

> - **题目**：洛谷 [P1002 过河卒](https://www.luogu.com.cn/problem/P1002) · 普及-
> - **时空限制**：1s / 128MB

## 题意

给定一个 $A \times B$ 的棋盘，棋子从左下角出发走到右上角，只能向右或向上走，每一步走一格。棋盘上有若干个"卒"的位置不能经过，求路径总数。

数据范围：$1 \le A, B \le 400$，$0 \le$ 障碍数 $\le 200$。

## 思路

### 1. 先想清楚状态

从下往上、从左往右推格子。设 $f[i][j]$ 表示**从起点走到 $(i,j)$ 的方案数**，那么：

$$
f[i][j] = f[i-1][j] + f[i][j-1]
$$

其中越界位置视为 $0$。障碍点的 $f$ 值为 $0$。

> 关键在于"到达"而不是"出发"：把状态定义成"到达某点的方案数"，转移就天然是"从左边或下面走来"，只需要两个邻居。

### 2. 处理障碍

障碍点不能被走到，所以直接令 $f[i][j] = 0$。注意不要写成"跳过这个点"——跳过意味着还能从别处到达它，语义就错了。

### 3. 空间压缩

转移只依赖上一行和当前行的左边，可以滚动成一维数组：

$$
f[j] \leftarrow f[j] + f[j-1]
$$

注意**更新顺序**：$j$ 必须从小到大枚举，这样 $f[j-1]$ 才是当前行已经更新过的值。写反成从大到小，就会退化成"同一条路走两遍"。

## 复杂度

- 时间：$O(AB)$
- 空间：$O(B)$（滚动数组）

## 代码

```cpp title="P1002.cpp"
#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    int a, b;
    cin >> a >> b;

    // 障碍点：读到 (x, y) 表示第 x 行第 y 列
    int m;
    cin >> m;
    vector<vector<bool>> blocked(a + 1, vector<bool>(b + 1, false));
    for (int i = 0; i < m; ++i) {
        int x, y;
        cin >> x >> y;
        blocked[x][y] = true;
    }

    // 起点在左下角 (a, 1)，终点在右上角 (1, b)，这里按“到达”倒推
    vector<int> dp(b + 1, 0);
    for (int i = a; i >= 1; --i) {
        for (int j = 1; j <= b; ++j) {
            if (blocked[i][j]) {
                dp[j] = 0;
            } else if (i == a && j == 1) {
                dp[j] = 1;
            } else {
                dp[j] = (dp[j] + dp[j - 1]) % 100003;
            }
        }
    }
    cout << dp[b] << '\n';
    return 0;
}
```

> [!TIP]
> 模数 $100003$ 是质数，但这里不需要用到任何逆元——只有加法，直接取模即可。
