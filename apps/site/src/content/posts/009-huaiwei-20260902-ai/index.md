---
title: "9月2日-华为笔试（AI岗）"
description: ""
pubDatetime: 2026-11-15T10:00:00+16:00
category: 题解
tags: [huawei, 模拟, 滑动窗口, 矩阵运算, 浮点数处理]
---



## 滑动窗口注意力机制

### 题目内容

标准的 Transformer 自注意力计算为：

$\operatorname{Attention}(Q,K,V)=\operatorname{softmax}\left(\frac{QK^T}{\sqrt{d_k}}\right)V$

对于序列长度为 $N$、维度为 $d_k$ 的输入，其时间复杂度和空间复杂度分别为：

$O(N^2 \cdot d_k),\quad O(N^2)$

近期研究表明，大多数任务中的依赖关系具有局部性，远距离 token 通常可以通过多层堆叠间接完成交互。因此，可以通过限制每个 token 的注意力范围来显著降低计算复杂度。

滑动窗口注意力机制是一种典型方法，其原理如下：

- 为每个 token 设定固定大小为 $w$ 的对称窗口。
- 位置 $i$ 的 query 只与满足$|i-j| \le w$的位置 $j$ 的 key 计算注意力，其中 $w \ll N$。
- 为保证数值稳定性，在计算 Softmax 前减去当前窗口内的最大值：
  $\operatorname{softmax}(x_i)=\frac{e^{x_i-\max(x)}}{\sum_j e^{x_j-\max(x)}}$

以 $N=8,w=1$ 为例，滑动窗口注意力可视化如下：

位置：

$0\quad 1\quad 2\quad 3\quad 4\quad 5\quad 6\quad 7$

各 query 的窗口范围：

| Query 位置 | 窗口范围  | 说明           |
| ---------- | --------- | -------------- |
| $Q_0$      | $[0,1]$   | 左边界限制为 0 |
| $Q_1$      | $[0,1,2]$ |                |
| $Q_2$      | $[1,2,3]$ |                |
| $Q_3$      | $[2,3,4]$ |                |
| $Q_4$      | $[3,4,5]$ |                |
| $Q_5$      | $[4,5,6]$ |                |
| $Q_6$      | $[5,6,7]$ |                |
| $Q_7$      | $[6,7]$   | 右边界限制为 7 |

其中：

- `[x]` 表示计算注意力；
- `[]` 表示掩码为 0，不计算。

### 输入描述

第一行输入四个整数：

$$$
\text{batch\_size},\text{seq\_len},d_k,\text{window\_size}
$$$

后续包含 $\text{batch\_size}$ 组数据，每组依次包含：

1. $\text{seq\_len}$ 行，每行 $d_k$ 个浮点数，表示 Query 矩阵。
2. $\text{seq\_len}$ 行，每行 $d_k$ 个浮点数，表示 Key 矩阵。
3. $\text{seq\_len}$ 行，每行 $d_k$ 个浮点数，表示 Value 矩阵。

### 输出描述

输出 $\text{batch\_size}$ 组结果，每组包含 $\text{seq\_len}$ 行，每行 $d_k$ 个浮点数，表示该位置的输出向量。

组间用一个空行分隔，最后一组后无空行。

最终结果保留 2 位小数，四舍五入。

注意力打分及 Softmax 权重在题目说明中保留 6 位小数展示，实际计算过程中无需提前进行舍入。

如果输入违反约束，输出 `0`。

### 约束

$\text{batch\_size} \ge 1$

$\text{seq\_len} \ge 1$

$d_k \ge 1$

$1 \le \text{window\_size} \le \text{seq\_len}$

### 样例1

#### 输入

```text
1 4 4 1
0.1 0.2 0.3 0.4
0.2 0.3 0.4 0.5
0.3 0.4 0.5 0.6
0.4 0.5 0.6 0.7
0.1 0.0 0.1 0.0
0.0 0.1 0.0 0.1
0.1 0.1 0.0 0.0
0.0 0.0 0.1 0.1
1.0 0.0 0.0 0.0
0.0 1.0 0.0 0.0
0.0 0.0 1.0 0.0
0.0 0.0 0.0 1.0
```

#### 输出

```text
0.50 0.50 0.00 0.00
0.33 0.34 0.33 0.00
0.00 0.33 0.33 0.34
0.00 0.00 0.50 0.50
```

#### 说明

输入：

$\text{batch\_size}=1,\text{seq\_len}=4,d_k=4,\text{window\_size}=1$

缩放因子：

$\text{scale}=\sqrt{d_k}=2$

$$$
Q=
\begin{bmatrix}
0.1 & 0.2 & 0.3 & 0.4\\
0.2 & 0.3 & 0.4 & 0.5\\
0.3 & 0.4 & 0.5 & 0.6\\
0.4 & 0.5 & 0.6 & 0.7
\end{bmatrix}
$$$

$$$
K=
\begin{bmatrix}
0.1 & 0.0 & 0.1 & 0.0\\
0.0 & 0.1 & 0.0 & 0.1\\
0.1 & 0.1 & 0.0 & 0.0\\
0.0 & 0.0 & 0.1 & 0.1
\end{bmatrix}
$$$

$$$
V=
\begin{bmatrix}
1.0 & 0.0 & 0.0 & 0.0\\
0.0 & 1.0 & 0.0 & 0.0\\
0.0 & 0.0 & 1.0 & 0.0\\
0.0 & 0.0 & 0.0 & 1.0
\end{bmatrix}
$$$

根据窗口大小 $\text{window\_size}=1$，注意力打分为：

位置 0 的权重：

$$$
\text{score}[0]
=
[Q[0]K[0],\ Q[0]K[1]]/\text{scale}
=
[0.020000,\ 0.030000]
$$$

归一化后为：

$[
[0.497500,\ 0.502500]
]$

位置 1 的权重：

$$$
[
\text{score}[1]
=
[Q[1]K[0],\ Q[1]K[1],\ Q[1]K[2]]/\text{scale}
=
[0.030000,\ 0.040000,\ 0.025000]
]
$$$

归一化后为：

$$$
[0.332772,\ 0.336116,\ 0.331112]
$$$

位置 2 的权重：

$$$
\text{score}[2]
=
[Q[2]K[1],\ Q[2]K[2],\ Q[2]K[3]]/\text{scale}
=
[0.050000,\ 0.035000,\ 0.055000]
$$$

归一化后为：

$$$
[0.334434,\ 0.329455,\ 0.336111]
$$$

位置 3 的权重：

$$$
\text{score}[3]
=
[Q[3]K[2],\ Q[3]K[3]]/\text{scale}
=
[0.045000,\ 0.060000]
$$$

归一化后为：

$$$
[0.496250,\ 0.503750]
$$$

上述归一化权重保留 6 位小数精度。

最后使用归一化后的权重对对应位置的 $V$ 进行加权求和，并将最终结果保留 2 位小数：

$$$
[
\text{output}[0]
=
0.497500 \times V[0]
+
0.502500 \times V[1]
=
[0.50,\ 0.50,\ 0.00,\ 0.00]
]
$$$

$$$
\text{output}[1]
=
0.332772 \times V[0]
+
0.336116 \times V[1]
+
0.331112 \times V[2]
=
[0.33,\ 0.34,\ 0.33,\ 0.00]
$$$

$$$
\text{output}[2]
=
0.334434 \times V[1]
+
0.329455 \times V[2]
+
0.336111 \times V[3]
=
[0.00,\ 0.33,\ 0.33,\ 0.34]
$$$

$$$
\text{output}[3]
=
0.496250 \times V[2]
+
0.503750 \times V[3]
=
[0.00,\ 0.00,\ 0.50,\ 0.50]
$$$

### 样例2

#### 输入

```text
1 2 2 0
0.3 0.4
0.4 0.5
0.5 0.6
0.6 0.7
0.1 0.0
0.0 0.1
```

#### 输出

```text
0
```

#### 说明

输入：
$$$
\text{batch\_size}=1,\quad \text{seq\_len}=2,\quad d_k=2,\quad \text{window\_size}=0
$$$

由于 $\text{window\_size}=0$ 违反输入范围要求，因此输出 `0`。

---

### 思路

这道题其实并不困难，解题关键在于读懂题目，以及处理好数据类型和向量边界。本质是一个**大模拟**题。那么按照题意一步一步：

对每个 batch：

1. 读入 `Q, K, V`，都是 `seq_len × d_k`。

2. 对每个位置 `i`：

   - 窗口左边界：`L = max(0, i - w)`

   - 窗口右边界：`R = min(seq_len - 1, i + w)`

   - 对窗口内每个 `j`，计算：

     ```
     score[j] = dot(Q[i], K[j]) / sqrt(d_k)
     ```

   - 找窗口内最大 `score`，做数值稳定：

     ```
     exp_score[j] = exp(score[j] - max_score)
     ```

   - 归一化：

     ```
     weight[j] = exp_score[j] / sum(exp_score)
     ```

   - 输出向量：

     ```
     out[i][t] = sum_j weight[j] * V[j][t]
     ```

3. 每个输出保留 2 位小数，四舍五入。

### 代码

```cpp
#include <bits/stdc++.h>
using namespace std;

double round2(double x)
{
    double y = round(x * 100.0) / 100.0;
    if (fabs(y) < 1e-9) y = 0.0; // 防止输出 -0.00
    return y;
}

int main()
{
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    long long B, N, D, W;
    cin >> B >> N >> D >> W;

    // 违反约束，直接输出 0
    if (B < 1 || N < 1 || D < 1 || W < 1 || W > N)
    {
        cout << 0 << '\n';
        return 0;
    }

    double scale = sqrt((double)D);

    cout << fixed << setprecision(2);

    for (long long b = 0; b < B; b++)
    {
        vector<vector<double>> Q(N, vector<double>(D));
        vector<vector<double>> K(N, vector<double>(D));
        vector<vector<double>> V(N, vector<double>(D));

        for (long long i = 0; i < N; i++)
            for (long long j = 0; j < D; j++)
                cin >> Q[i][j];

        for (long long i = 0; i < N; i++)
            for (long long j = 0; j < D; j++)
                cin >> K[i][j];

        for (long long i = 0; i < N; i++)
            for (long long j = 0; j < D; j++)
                cin >> V[i][j];

        // 组间空行
        if (b > 0) cout << '\n';

        for (long long i = 0; i < N; i++)
        {
            long long L = max(0LL, i - W);
            long long R = min(N - 1, i + W);
            long long len = R - L + 1;

            vector<double> score(len);
            double mx = -numeric_limits<double>::infinity();

            // 计算窗口内每个 key 的 score
            for (long long j = L; j <= R; j++)
            {
                double dot = 0.0;
                for (long long t = 0; t < D; t++)
                {
                    dot += Q[i][t] * K[j][t];
                }

                double s = dot / scale;
                score[j - L] = s;
                mx = max(mx, s);
            }

            // softmax，减最大值保证数值稳定
            double sum = 0.0;
            for (long long k = 0; k < len; k++)
            {
                score[k] = exp(score[k] - mx);
                sum += score[k];
            }

            // 对 V 加权求和
            vector<double> out(D, 0.0);

            for (long long j = L; j <= R; j++)
            {
                double weight = score[j - L] / sum;

                for (long long t = 0; t < D; t++)
                {
                    out[t] += weight * V[j][t];
                }
            }

            // 输出当前 query 位置的输出向量
            for (long long t = 0; t < D; t++)
            {
                if (t > 0) cout << ' ';
                cout << round2(out[t]);
            }
            cout << '\n';
        }
    }

    return 0;
}
```

时间复杂度：$O(BND\ min(N,2W+1))$ 