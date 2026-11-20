---
title: "叠箱子"
description: "对Cpp的自定义compare还不熟练"
pubDatetime: 2026-11-20T10:00:00+08:00
category: 题解
tags: [动态规划]
---



## 题意

题意很简单，给你 $n$ 个箱子，以及它们的长宽高，要求你叠箱子使得高度最高，输出该高度。

注意：

1. 箱子无法旋转；
2. 每个箱子的长严格小于下一层的长，宽同理。

``` text title="input"
3
1 1 1
2 2 2
1 2 4
```

```text title="output"
4
```

## 思路

因为不能旋转，所以只关心 `(l,w)`，高度 `h` 是权重。

定义：

- `dp[i]`：以第 `i` 个箱子作为当前堆的**最下面**时，能得到的最大高度。
- 转移：如果箱子 `j` 能放在 `i` 上面，即 `l[j] < l[i] && w[j] < w[i]`，则 `dp[i] = max(dp[i], dp[j] + h[i])`。

## 代码

```cpp
#include <bits/stdc++.h>
using namespace std;

struct Box {
    int l,w,h;
};

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
	// 输入
    int n;cin >> n;
    vector<Box> boxes(n);
    for(int i = 0;i < n;i ++) cin >> boxes[i].l >> boxes[i].w >> boxes[i].h;
    int ans = 0;
    
    // 预处理：对箱子进行排序（先按照长升序，再按照宽）
    // 因为要满足长、宽的严格小于
 	sort(boxes.begin(), boxes.end(),[](const Box& a, const Box& b) -> {
        if(a.l != b.l) return a.l < b.l;
        return a.w < b.w;
    })   
 
    vector<int> dp(n,0);
    for(int i = 0;i < n;i ++) {
        dp[i] = boxes[i].h; // dp[i] 至少可以以自己为基底
        for(int j = 0;j < i;j ++) {
            // 箱子 j 能放在箱子 i 上面
            if (boxes[j].l < boxes[i].l && boxes[j].w < boxes[i].w) {
                dp[i] = max(dp[i], dp[j] + boxes[i].h);
            }
        }
        ans = max(ans, dp[i]);
    }
    
    // 输出
    cout << ans << '\n';
    return 0;
}
```

