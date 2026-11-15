---
title: "9月2日-华为笔试（AI岗）"
description: ""
pubDatetime: 2026-11-15T10:00:00+16:00
category: 题解
tags: [huawei, 模拟, 滑动窗口, 注意力, 矩阵运算, 浮点数处理]
---



## 1-滑动窗口注意力机制

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

## 2-整数缩放因子下的全整型矩阵乘积

### 题目内容
在模型量化中，常需要把高精度浮点数转换为低位整数。对于实数 $r$ 与缩放因子 $s$，线性量化定义为
$$$ 
q = \operatorname{round}(r / s) 
$$$

反量化则恢复为 $r = s q$。在 $n$ 比特量化下，缩放因子通常取
$$$
s = \frac{\max( |r_{\min}|, |r_{\max}| )}{2^{n-1} - 1} 
$$$

矩阵可以按行或按列分别量化，并为每一行或每一列保存一个缩放因子。

为了进一步避免缩放因子参与浮点运算，可以把缩放因子 $s$ 写成两个整数 $a,b$ 的比值：
$$$ 
s = \frac{a}{2^{b}} 
$$$
这样，两个缩放因子相乘时可以表示为
$$$ 
\frac{a_1}{2^{b_1}} \times \frac{a_2}{2^{b_2}} = \frac{a_1 a_2}{2^{b_1+b_2}} 
$$$

本题要求在这种全整数缩放因子表示下完成矩阵乘法。给定已经按行完成量化的矩阵 $A$，以及尚未量化的浮点矩阵 $B$。矩阵 $A$ 的大小为 $m \times k$，矩阵 $B$ 的大小为 $k \times n$。需要计算矩阵乘积 $C = A \times B$，并以全整型量化形式输出 $C$ 的每个元素。

矩阵 $A$ 的每一行已经附加了缩放因子 $s_A = \dfrac{a_A}{2^{b_A}}$。矩阵 $B$ 需要按列进行 8 比特量化：对第 $j$ 列，先取该列所有元素绝对值的最大值，令该列缩放因子
$$$ 
s_B = \frac{\max(|B_{1,j}|,\dots,|B_{k,j}|)}{127} 
$$$

然后按量化公式得到该列整数表示，并裁剪到 $[-127,127]$；同时将 $s_B$ 表示为 $\dfrac{a_B}{2^{b_B}}$ 的形式。

对于结果矩阵 $C$ 中第 $i$ 行第 $j$ 列的元素，其量化值为 $A$ 第 $i$ 行量化整数与 $B$ 第 $j$ 列量化整数的点积。其缩放因子为两个缩放因子的乘积：
$$$ 
\frac{a_A}{2^{b_A}} \times \frac{a_B}{2^{b_B}} = \frac{a_A a_B}{2^{b_A+b_B}} 
$$$

因此该元素需要输出三个整数：点积结果、$a_A a_B$、$b_A+b_B$。点积结果不需要限制在 $[-127,127]$ 内，缩放因子也无需约分。

### 约束条件
- 矩阵 $A$ 每行给出的已量化整数以及矩阵 $B$ 量化后的整数均在 $-127$ 到 $127$ 之间。
- 缩放因子中，$a$ 的取值范围为 $0$ 到 $127$，$b$ 的取值范围为 $0$ 到 $30$。
- 矩阵 $B$ 使用 8 比特量化，量化后的整数范围为 $-127$ 到 $127$。

### 输入描述
第一行包含三个整数 $m,k,n$，依次表示矩阵 $A$ 的行数、矩阵 $A$ 的列数（也是矩阵 $B$ 的行数）、矩阵 $B$ 的列数。

接下来 $m$ 行，每行包含 $k+2$ 个整数。前 $k$ 个整数是矩阵 $A$ 当前行已经量化的整数；最后两个整数依次为该行缩放因子的 $a$ 和 $b$。

再接下来 $n$ 行，每行包含 $k$ 个浮点数。这些行按矩阵 $B$ 的转置给出，其中第 $i$ 行表示矩阵 $B$ 的第 $i$ 列。

### 输出描述
输出共 $m$ 行。每一行对应矩阵 $C$ 的一行，包含 $n$ 个结果元素。每个结果元素由三个整数依次组成：量化值、缩放因子的 $a$、缩放因子的 $b$。同一行内所有整数之间用空格分隔。

### 样例1
#### 输入

```text
2 3 2
1 2 3 1 0
10 -5 4 3 2
127.0 0.0 -127.0
0.0 127.0 64.0
```

#### 输出

```text
-254 64 6 446 64 6
762 192 8 -379 192 8
```

#### 说明

矩阵 $A$ 第 1 行的缩放因子为 $1/2^{0}$，即 $a_A=1,b_A=0$；第 2 行的缩放因子为 $3/2^{2}$，即 $a_A=3,b_A=2$。

矩阵 $B$ 两列的最大绝对值均为 $127$，因此 $s_B = 127/127 = 1$。将 $1$ 表示为 $a_B/2^{b_B}$ 时，四舍五入得到 $a_B=64,b_B=6$。

计算点积如下：

第 1 行第 1 列：
$1 \times 127 + 2 \times 0 + 3 \times (-127) = -254$。
第 1 行第 2 列：
$1 \times 0 + 2 \times 127 + 3 \times 64 = 446$。
第 2 行第 1 列：
$10 \times 127 + (-5) \times 0 + 4 \times (-127) = 762$。
第 2 行第 2 列：
$10 \times 0 + (-5) \times 127 + 4 \times 64 = -379$。

结果缩放因子：

第 1 行：
$a_A a_B = 1 \times 64 = 64$，
$b_A + b_B = 0 + 6 = 6$。
第 2 行：
$a_A a_B = 3 \times 64 = 192$，
$b_A + b_B = 2 + 6 = 8$。

因此输出如样例输出所示。

### 样例2
#### 输入

```text
1 1 1
5 1 0
0.0
```

#### 输出

```text
0 0 0
```

#### 说明

矩阵 $B$ 唯一列的元素为 $[0.0]$，最大绝对值为 $0$，因此 $s_B = 0/127 = 0$，量化后整数仍为 $0$，缩放因子表示为 $0/2^{0}$，即 $a_B=0,b_B=0$。

矩阵 $A$ 的唯一量化整数为 $5$，缩放因子为 $1/2^{0}$。点积为 $5 \times 0 = 0$。结果缩放因子为 $a_A a_B = 1 \times 0 = 0$，$b_A + b_B = 0 + 0 = 0$。

因此输出 $0\ 0\ 0$。

### 样例3
#### 输入

```text
1 2 1
5 -3 2 3
1.0 -2.0
```

#### 输出

```text
701 130 15
```

#### 说明

矩阵 $B$ 唯一列的元素为 $[1.0,-2.0]$，最大绝对值为 $2$，所以 $s_B = 2/127$。

量化时：

$1.0 / (2/127) = 63.5$，四舍五入为 $64$；
$-2.0 / (2/127) = -127$，四舍五入为 $-127$。

缩放因子 $2/127$ 按照 $a_B/2^{b_B}$ 表示并四舍五入，得到 $a_B=65,b_B=12$。

矩阵 $A$ 的量化整数为 $[5,-3]$，缩放因子为 $2/2^{3}$。点积为 $5 \times 64 + (-3) \times (-127) = 701$。结果缩放因子为 $a_A a_B = 2 \times 65 = 130$，$b_A + b_B = 3 + 12 = 15$。

因此输出 $701\ 130\ 15$。

### 思路

1. 读入

   - 读 $m,k,n$，再读矩阵 A（每行 $k+2$ 个数）
   - 读入 n 行浮点数，存入 `B[n][k]`，`B[j]` 对应原矩阵 B 的第 j 列

2. 预处理 B 的每一列

   （循环 $j:0\to n-1$）

   - 求该列绝对值最大值 mx
   - 如果 mx 接近 0：量化数组全部置 0，$a_B=0,b_B=0$，跳过后面计算
   - 否则计算 $sB = mx / 127.0$
   - **倒序 b 从 30 到 0(关键)：**
     - `val = sB * (1LL << b)`
     - `a_cand = round(val)`
     - 如果 $0\le a_\mathrm{cand}\le 127$，锁定这个 $a_B,b_B$，break
   - 逐个量化该列浮点数：$q=\mathrm{round}(x/sB)$，限制在 $[-127,127]$
   - 保存：量化后的整数列 `Bq[j]`，以及 `Ba[j], Bb[j]`

3. 逐行计算输出

   对 A 的每一行 i：

   - 取出该行的量化数组 `Aq`、$aA,bA$
   - 对每一列 j（输出的第 j 个三元组）：
     - 求点积：$\displaystyle \mathrm{dot}=\sum_{t=0}^{k-1} Aq[t] \cdot Bq[j][t]$
     - 计算 `oa = aA * Ba[j]`，`ob = bA + Bb[j]`
     - 输出 `dot oa ob`，同一行连续输出

4. 全部用 `long long`，防止点积、乘法溢出。

> 问题：为什么是 **从 $b=30$ 往 0 试，而不是从小到大？**
>
> 在满足 $0\le a \le 127$ 的所有合法 $(a,b)$ 里面，题目要的是**让近似 $\dfrac{a}{2^b}$ 最贴近原始 $s_B$ 的那一组**；等价于优先取**尽可能大的 b**。
>
> 把式子变形：
>
> $\frac{a}{2^b} \approx s_B \Rightarrow a \approx s_B \cdot 2^b$
>
> 固定 $s_B>0$：
>
> - b 越大，$2^b$ 越大，$s_B\cdot 2^b$ 越大；
> - b 越大，分母 $2^b$ 越大，$\dfrac{a}{2^b}$ 的**表示精度越高（步长越小）**。
>
> $\dfrac{a}{2^b}$ 的最小刻度是 $\dfrac{1}{2^b}$：
>
> - $b=6$：刻度 $1/64 \approx 0.0156$
> - $b=12$：刻度 $1/4096 \approx 0.000244$
> - $b=30$：刻度 $1/2^{30}$，极其精细
>
> 想要逼近一个实数，在 $a\in[0,127]$ 的限制下，**越大的 b，分辨率越高，拟合误差越小**。所以策略就是：从最大允许的 $b=30$ 往下扫，遇到第一个使得 $\operatorname{round}(s_B\cdot 2^b)$ 落在 $[0,127]$ 的，直接选它。

### 代码

```cpp
#include <bits/stdc++.h>
using namespace std;
using ll = long long;
const double eps = 1e-12;

inline ll clamp(ll x, ll L, ll R) {
    if (x < L) return L;
    if (x > R) return R;
    return x;
}

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    cout.tie(nullptr);

    ll m, k, n;
    cin >> m >> k >> n;

    vector<vector<ll>> A(m, vector<ll>(k + 2));
    for (ll i = 0; i < m; ++i) {
        for (ll j = 0; j < k + 2; ++j) {
            cin >> A[i][j];
        }
    }

    vector<vector<double>> B(n, vector<double>(k));
    for (ll i = 0; i < n; ++i) {
        for (ll j = 0; j < k; ++j) {
            cin >> B[i][j];
        }
    }

    // Bq[j]：B 的第 j 列量化后的整数
    // Ba[j], Bb[j]：该列的 aB, bB
    vector<vector<ll>> Bq(n, vector<ll>(k));
    vector<ll> Ba(n), Bb(n);

    for (ll col = 0; col < n; ++col) {
        double mx = 0.0;
        for (ll t = 0; t < k; ++t) {
            mx = max(mx, fabs(B[col][t]));
        }

        if (fabs(mx) < eps) {
            // 最大值为 0，全部量化为 0
            for (ll t = 0; t < k; ++t) Bq[col][t] = 0;
            Ba[col] = 0;
            Bb[col] = 0;
            continue;
        }

        double sB = mx / 127.0;
        ll aB = 0, bB = 0;
        // 核心：从 30 往下枚举，找到第一个合法 b
        for (int b = 30; b >= 0; --b) {
            double val = sB * (1LL << b);
            ll cand = llround(val);
            if (cand >= 0 && cand <= 127) {
                aB = cand;
                bB = b;
                break;
            }
        }
        Ba[col] = aB;
        Bb[col] = bB;

        // 量化本列每个元素
        for (ll t = 0; t < k; ++t) {
            double x = B[col][t];
            ll q = llround(x / sB);
            q = clamp(q, -127, 127);
            Bq[col][t] = q;
        }
    }

    // 计算并输出结果
    for (ll i = 0; i < m; ++i) {
        // A 的一行
        const auto& rowA = A[i];
        ll aA = rowA[k];
        ll bA = rowA[k + 1];

        for (ll j = 0; j < n; ++j) {
            ll dot = 0;
            for (ll t = 0; t < k; ++t) {
                dot += rowA[t] * Bq[j][t];
            }
            ll oa = aA * Ba[j];
            ll ob = bA + Bb[j];
            cout << dot << " " << oa << " " << ob;
            if (j != n - 1) cout << " ";
        }
        cout << "\n";
    }

    return 0;
}

```

