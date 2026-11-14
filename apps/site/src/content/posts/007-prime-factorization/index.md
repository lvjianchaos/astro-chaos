---
title: "快速分解质因数：Pollard Rho 与 Miller-Rabin"
description: "试除法要 O(√n) 次取模，10^18 级别完全跑不动。用生日悖论把「随机猜因数」转化成「判环」，以 Floyd / Brent 判环 + 倍增优化做到期望 O(n^{1/4})，再配合 Miller-Rabin 素性测试"
pubDatetime: 2026-11-14T22:00:00+08:00
category: 算法
tags: [数论, 质因数分解, Pollard-Rho, Miller-Rabin, 随机化算法, 判环, 生日悖论]
---
**参考：**

1. [https://zhuanlan.zhihu.com/p/267884783](https://zhuanlan.zhihu.com/p/267884783)
2. [https://www.cnblogs.com/idreamo/p/9411265.html](https://www.cnblogs.com/idreamo/p/9411265.html)
3. [https://blog.csdn.net/qq_39972971/article/details/82346390](https://blog.csdn.net/qq_39972971/article/details/82346390)
4. [https://www.cnblogs.com/RioTian/p/13928916.html](https://www.cnblogs.com/RioTian/p/13928916.html)
5. [https://www.cnblogs.com/book-book/p/6349362.html](https://www.cnblogs.com/book-book/p/6349362.html)
6. [https://oi-wiki.org/math/number-theory/pollard-rho/](https://oi-wiki.org/math/number-theory/pollard-rho/)
7. [https://zhuanlan.zhihu.com/p/220203643](https://zhuanlan.zhihu.com/p/220203643)
8. [https://en.wikipedia.org/wiki/Pollard%27s_rho_algorithm](https://en.wikipedia.org/wiki/Pollard%27s_rho_algorithm)
9. [https://oi-wiki.org/math/number-theory/prime/](https://oi-wiki.org/math/number-theory/prime/)

## 引入

给定一个正整数 $N∈N^+$，试**快速**找到它的一个 非平凡因数 ( 除了1和数本身以外的因数 )。

### 朴素算法：

考虑**朴素**算法——试除法，因数是成对分布的，$N$ 的所有因数可以被分成两块，即 $[2,\sqrt{N}]$ 和 $[\sqrt{N}+1,N]$ 。只需要把 $[2, \sqrt {N}]$) 里的数遍历一遍，再根据除法就可以找出至少两个因数了。这个方法的时间复杂度为 $O(\sqrt {N})$。

最简单的算法即从 $[2,\sqrt{N}]$ 进行遍历。
```c++
vector<int> breakdown(int N) { 
	vector<int> result; 
	for (int i = 2; i * i <= N; i++) { 
		if (N % i == 0) { 
		// 如果 i 能够整除 N，说明 i 为 N 的一个质因子。 
			while (N % i == 0) N /= i; 
			result.push_back(i); 
		} 
	} 
	if (N != 1) { 
		// 说明再经过操作之后 N 留下了一个素数 
		result.push_back(N); 
	} 
	return result; 
}
```

我们能够证明 `result` 中的所有元素均为 `N` 的素因数。
> 首先证明元素均为 $N$ 的素因数：因为当且仅当 N % i == 0 满足时，result 发生变化：$i$ 储存 ，说明此时 $i$ 能整除 $\frac{N}{A}$ ，说明了存在一个数 $p$ 使得 $pi = \frac{N}{A}$ ，即 （其中，$A$ 为 $N$ 自身发生变化后遇到 $i$ 时所除的数。我们注意到 result 若在 $push\ i$ 之前就已经有数了，为 $R_1,R_2,...,R_n$ ，那么有 $N = \frac{N}{R_1^{q_1}·R_2^{q_2}...R_n^{q_n}}$，被除的乘积即为 $A$ ）。所以 i 为 N 的因子。
> 
> 其次证明 result 中均为素数。我们假设存在一个在 result 中的合数 $K$ ，并根据**算术基本定理**，分解为一个素数序列 $K = K_1^{e_1}·K_2^{e_2}·...·K_n^{e_n}$ ，而因为 $K_1 < K$，所以它一定会在 $K$ 之前被遍历到，并令 `while(N % k1 == 0) N /= k1`，即让 `N` 没有了素因子 $K_1$ ，故遍历到 $K$ 时，N 和 K 已经没有了整除关系了。

值得指出的是，如果开始已经打了一个**素数表**的话，时间复杂度将从 $O(\sqrt{N})$ 下降到 $O(\sqrt \frac{N}{ln N})$。具体可以去了解 **筛法** 的相关知识。[【埃筛 欧筛】](https://zhuanlan.zhihu.com/p/100051075)

但是，当 $N$ 是个大整数时( $\ge 10^{18}$ )，这个算法的运行时间是不优秀的。我们期望一个更优秀的算法。

这里给出一种想法，即：通过**随机的方法**，猜测一个数是不是 $N$ 的因数，如果运气好可以在 $O(1)$ 的时间复杂度下求解答案，但是对于的数据 $N$ 是个大整数时( $\ge 10^{18}$ )，成功猜测的概率是 $\frac{1}{10^{18}}$ ,
 , 期望猜测的次数是 $10^{18}$ 。如果是在$[2, \sqrt {N}]$) 里进行猜测，成功率会大一些。
 ```c++
template <class T>
T randint(T l, T r = 0) // 生成随机数建议用<random>里的引擎和分布，而不是rand()模数，那样保证是均匀分布
{
    static mt19937 eng(time(0));
    if (l > r)
        swap(l, r);
    uniform_int_distribution<T> dis(l, r);
    return dis(eng);
}
int find_factor(int n)
{
    if (is_prime(n)) // 特判素数
        return n;
    int x, d;
    do
    {
        x = randint(2, n - 1); // 生成2和n-1之间的随机数
        d = gcd(n, x);       // 求gcd
    } while (d == 1);
    return d;
}
 ```

 在最差的情况下，$n = p^2$ (p是质数)，这时 $[1,p^2-1]$ 里只有 1 个 p 是 n 的因数；然而，当 $x$ 取 $p,2p,3p,...,(p-1)p$ 时，都有 $gcd(x,n) = p > 1$ ，而公因数自然是 n 的因数 。所以此时最差期望时间复杂度可以降到 $O(\sqrt{n}logn)$ (gcd的复杂度log，根号来自 $x$ 有约 $p - 1 ≈ \sqrt{n}$ 种满足条件的选择) ，当然，它连朴素的试除法都比不过。 

 因此，我们仍希望有方法来优化猜测。

## Pollard Rho 算法
### 生日悖论

为了尝试优化，我们或许需要了解**生日悖论**。

> 生日悖论不算严格意义上的悖论，只是反直觉。

这里给出一个简易的表述：一个房间里有23个人，则他们中有两人生日相同的概率超过一半（不考虑闰年）。关于证明：即 $\frac{365}{365} × \frac{364}{365} × \frac{363}{365} × ... \frac{365 - 22}{365} < \frac{1}{2}$。

> 为了破除旧的生日悖论的直觉，建立新的认识，我们尝试去解决生日悖论的提问：一个房间中至少多少人，才能使其中两个人生日相同的概率达到 $50\%$ ?
> 	 
>  解：假设一年有 n 天，房间中有 k 人，用整数 1，2，...，k 对这些人进行编码。假定每个人的生日均匀分布于 n 天之中，且两个人的生日相互独立。
>  设 k 个人生日互不相同为事件 A，则事件 A 的概率为：$P(A) = \prod \limits_{i=0}^{k-1} \frac{n-i}{n}$ ，
>  至少有两个人生日相同的概率为 $P(\bar{A})=1-P(A)$。
>  根据题意得$P(\bar{A})\ge \frac{1}{2}$，那么有 $P(A)= \prod \limits_{i=0}^{k-1} \frac{n-i}{n}\le \frac{1}{2}$
>  由不等式 $1+x\le e^x$ 可得：$P(A)=\prod \limits_{i=0}^{k-1}exp(-\frac{i}{n})=exp(-\frac{k(k-1)}{2n})$  
>  因此，$exp(-\frac{k(k-1)}{2n})\le \frac{1}{2} => P(A)\le\frac{1}{2}$ 
>  将 $n=365$ 带入得：$k\ge23$。所以一个房间中至少23人，使其中两个人生日相同的概率达到 $50\%$。
> 	 		
>   而当 $k>56,n=365$ 时，出现两个人同一天生日的概率将大于一 $99\%$ 。
>   那么在一年有 $n$ 天的情况下，当房间中有 $\frac{1}{2}(\sqrt{8nln2 + 1}+1)≈\sqrt{2nln2}$个人时，至少有两个人的生日相同的概率约为 $50\%$。

这时，我们可以建立这样一个直觉：如果我们不断在某个范围内生成随机整数，很快便会生成到重复的数，期望大约在根号级别。精确地说，对于一个 $[1,𝑁]$ 内整数的理想随机数生成器，生成序列中第一个重复数字前期望有 $\sqrt{\frac{π𝑁}{2}}$ 个数。
	**证明**参见[知乎问答](https://www.zhihu.com/question/367513670/answer/991562741)

这里我们回归到原题，对于最坏的情形 $n=p^2$，如果我们不断在 $[1,n-1]$ 间生成随机数，那么期望在生成大约 $\sqrt{p}=n^{\frac{1}{4}}$ 个数后，可以出现 $2$ 个在模 $p$ 下相同的数（注意 $[1,n-1]$间的随机数模 $p$ 大致是 $[0,p-1]$ 间的随机数）。那么这 $2$ 个数的差的绝对值 $d$，就一定满足 $d \equiv 0\ (mod\ p)$ ，也就满足 $gcd(d,n)>1$ 。

但是知晓这件事的意义并不是那么大。正如生日悖论虽然正确，但你不一定等在班上遇到和自己生日相同的人，因为这个高概率是在**两两比较**下才成立的。对于这 $n^{\frac{1}{4}}$ 个数两两验证，复杂度还是立刻回到 $O(\sqrt{n}logn)$，这并没有什么进步，所以我们需要一些技巧。

### 利用最大公约数求出一个因数 || 伪随机数序列

我们再次回顾一下这个性质：$n$ 和 某个数 的最大公约数一定是 $n$ 的因数，即 $\forall k ∈ N_+,gcd(k,n)|n$，只要选择恰当的 $k$ 使得 $1 <gcd(k,n)<n$，就可以求得 $n$ 的一个约数 $gcd(k,n)$。满足这样条件的 $k$ 不少， $n$ 有若干个质因子，每个质因子及其大部分倍数都是可行的。

我们通过 $f(x)=(x^2+c)\ mod\ n$ 来生成一个序列 ${x_i}$：随机取一个 $x_1$ ，令 $x_2 = f(x_1),x_3 = f(x_2),...,x_i=f(x_{i-1})$ 。其中 $c$ 是一个随机选取的常数。

举个例子，取 $n=9400,c=24,x_1=0$，$f(x)$ 生成数据为：
	$0,24,600,2824,3800,1624,5400,1224,3600,6824,8800,2824,3800,1624,...$

![rho](https://cdn.jsdelivr.net/gh/lvjianchaos/Images/note/快速分解素因数/快速分解素因数.png)

可以发现数据在 $x_4$ 以后都在 $2824,3800,1624,5400,1224,3600,6824,8800$ 之间循环。如果将这些数如上图一样排列起来，会发现这个图像酷似一个𝜌，算法也因此得名 $rho$。
	不难发现这是显然的，因为每个数都是由前一个数决定的，可生成的数又是有限的，那么迟早会进入**循环**。当然，这个循环极大可能是**混循环**。

而之所以选择 $f(x)=(x^2+c)\ mod\ n$ 这个函数生成序列，是因为它有一个性质：
$\forall x \equiv y\ (mod\ p),\ f(x) \equiv f(y)\ (mod\ p)$，即 $f$ 是 $\mathbb{Z}_p$ 上的一个**自映射**。

> **证明**：若 $x \equiv y\ (mod\ p)$，则 $x^2 + c \equiv y^2 + c\ (mod\ p)$。注意到 $f(x) = x^2 + c - k_x n$，其中 $k_x$ 是一个依赖于 $x$ 的整数，且 $p \mid n$，所以 $f(x) \equiv x^2 + c\ (mod\ p)$，从而 $f(x) \equiv f(y)\ (mod\ p)$。

这个性质是整个算法的**题眼**。它意味着：把序列 $\{x_i\}$ 中的每一项模 $p$，得到的 $\{x_i \bmod p\}$ 恰好就是 $f$ 在 $\mathbb{Z}_p$ 上反复迭代的结果。而 $\mathbb{Z}_p$ 只有 $p$ 个元素，由前面小节的**生日悖论**，期望大约 $O(\sqrt{p})$ 步之后就会出现一次**碰撞**，即存在 $i \ne j$ 使得 $x_i \equiv x_j\ (mod\ p)$。

此时 $p \mid (x_i - x_j)$。又因为 $p \mid n$，所以
$$p \mid \gcd(|x_i - x_j|,\ n)$$
也就是说 $\gcd(|x_i - x_j|,\ n) > 1$，我们便得到了 $n$ 的一个非平凡因数。

麻烦在于：我们并不知道 $p$ 到底是多少，所以没办法直接判断"两个数模 $p$ 是否相等"。我们只能退而求其次，用 $\gcd(|x_i - x_j|,\ n) > 1$ 来当作"碰撞发生了"的判据。

### 判环：把数列看成图上的行走

把 $\mathbb{Z}_n$ 中的每个元素看作一个点，连一条有向边 $x \to f(x)$。因为 $f$ 是**函数**，每个点的出度都恰好为 $1$，这样的图称为**函数图**。而数列 $\{x_i\}$ 就是从某一点出发、沿着有向边一直走下去。

函数图的结构是确定的：**一条尾巴接一个环**（尾巴也可能为空）。因为每个点只有一条出边，一旦走到某个点就永远停不下来了。

所以"找到 $x_i \equiv x_j \ (mod\ p)$"这件事，本质上就是**判环**——我们要在不知道环长的情况下，快速找到环上的两个点。

#### Floyd 判环（龟兔赛跑）

假设两个人在赛跑，A 的速度快，B 的速度慢，经过一定时间后，A 一定会和 B 相遇，且相遇时 A 跑过的总距离减去 B 跑过的总距离一定是圈长的整数倍。

于是我们让两个指针在数列上赛跑：

- 慢指针 $a$：每轮走一步，$a \leftarrow f(a)$；
- 快指针 $b$：每轮走两步，$b \leftarrow f(f(b))$。

在第 $k$ 轮，两个指针分别停在 $x_k$ 与 $x_{2k}$ 上。**慢指针在 $k$、快指针在 $2k$**，这正是让"模 $p$ 意义下的碰撞"现形的方式。

我们每轮计算一次
$$d = \gcd(|a - b|,\ n) = \gcd(|x_k - x_{2k}|,\ n)$$
然后分类讨论：

- 若 $1 < d < n$，那么 $d$ 就是一个非平凡因数，**成功**；
- 若 $d = n$，说明 $x_k \equiv x_{2k}\ (mod\ n)$，两个指针在模 $n$ 意义下也撞上了，这次随机参数**失败**，换一个 $c$ 重来；
- 若 $d = 1$，说明这一轮还没碰撞到，继续跑；
- 若 $a = b$（两个指针作为整数完全相等），说明数列已经在模 $n$ 意义下跑完了一圈，继续下去也只是在环里打转，**失败**，换 $c$ 重来。

	为什么"模 $p$ 意义下的碰撞"一定会被我们撞到？设数列模 $p$ 之后的尾巴长为 $\mu_p$、环长为 $\lambda_p$。由 $f$ 保持同余的性质可知，模 $p$ 的循环节长度 $\lambda_p$ 整除模 $n$ 的循环节长度 $\lambda_n$，且 $\mu_p \le \mu_n$。于是任何满足 $k \ge \mu_p$ 且 $\lambda_p \mid k$ 的 $k$，都有 $x_k \equiv x_{2k}\ (mod\ p)$，也就是 $\gcd(|x_k - x_{2k}|,\ n) \ge p > 1$。

	换句话说，**我们几乎不可能"什么都撞不上"**：gcd 要么是 $1$（还没到时候），要么是一个非平凡因数，要么是 $n$（运气不好）。后两种之外只需要重试即可。

```c++
ll f(ll x, ll c, ll mod) { return (mul_mod(x, x, mod) + c) % mod; } // 伪随机数列

ll pollard_rho_floyd(ll n)
{
    if (n == 4) return 2; // 特判 4，因为一开始跳了两步
    ll c = randint(1LL, n - 1);
    ll t = f(0, c, n), r = f(f(0, c, n), c, n);
    while (t != r)
    {
        ll d = gcd(llabs(t - r), n);
        if (d > 1) return d; // 可能是 n，说明本次失败
        t = f(t, c, n);
        r = f(f(r, c, n), c, n);
    }
    return n; // t == r，数列在模 n 意义下已经跑完一圈了
}
```

`n = 4` 需要特判，是因为 $f(x) = x^2 + c$ 模 $4$ 时很容易一上来就让两个指针重合，导致"模 $p$ 的碰撞"和"模 $n$ 的碰撞"同时发生，直接失败。

#### Brent 判环

Floyd 判环每轮要算三次 $f$（慢指针一次、快指针两次），常数略大。Brent 判环能把它压到接近两次。

Brent 的做法是：维护一个**锚点** $s$ 与一段**区间长度** $2^k$。在第 $k$ 轮里，锚点 $s$ 保持不动，另一个指针 $t$ 从 $s$ 出发往前走 $2^k$ 步，每走一步就计算一次 $\gcd(|t - s|,\ n)$。这一轮走完之后如果还没找到因数，就让锚点 $s$ 瞬移到 $t$ 的位置，把区间长度翻倍，继续下一轮。

由于锚点与移动指针的下标之差恰好就是它走过的步数 $k$，当区间长度 $2^k$ 超过了模 $p$ 之后的环长 $\lambda_p$ 时，一定存在某个 $k$ 是 $\lambda_p$ 的倍数，此时 $\gcd(|t - s|,\ n) \ge p > 1$。原论文中的测试表明，Brent 判环需要的平均时间相较于 Floyd 判环减少了约 24%。

#### 倍增优化

前面每走一步都要算一次 $\gcd$，而 $\gcd$ 的复杂度是 $O(\log n)$，这就把总复杂度从 $O(\sqrt{p})$ 抬到了 $O(\sqrt{p}\log n)$。有没有办法把 $\gcd$ 的次数降下来？

回忆一下我们要的到底是什么：我们需要知道 $\gcd(|x_k - x_{2k}|,\ n) > 1$ 是否成立。而这里有一个漂亮的性质：

> **取模的性质**：如果 $\gcd(a, n) > 1$，那么对任意正整数 $b$ 都有 $\gcd(ab \bmod n,\ n) = \gcd(ab,\ n) > 1$。

因为我们数列里对 $n$ 取模是家常便饭，所以完全可以把若干个 $|x_k - x_{2k}|$ **先乘起来再取模**，最后只对乘积求一次 $\gcd$：

$$P = \prod_k |x_k - x_{2k}| \bmod n, \qquad d = \gcd(P,\ n)$$

如果其中某一个 $|x_k - x_{2k}|$ 与 $n$ 有大于一的公约数，那么乘积 $P$ 也一定含有这个公约数，于是 $d > 1$；反之若 $d = 1$，说明这批差值确实都与 $n$ 互质。

这样我们就可以**攒够一批再算一次 $\gcd$**，通常攒 127 个（这个数字是实验得出的）。复杂度于是变成 $O(\sqrt{p} + \frac{\sqrt{p}}{\beta}\log n + \beta \log n)$，其中 $\beta$ 是批量大小。当 $\beta$ 与 $\log n$ 同阶时，就得到了近似 $O(\sqrt{p})$ 的期望复杂度。

当然，攒批会引入两个新问题：

> 1. 如果还没攒够 127 个就已经撞上了环（$x_k = x_{2k}$），那这一批的乘积就白算了；
> 2. 如果这一批的乘积恰好是 $n$ 的倍数（模 $n$ 意义下为 $0$），说明这一批里"撞出"的因子太多，同样无法定位。
>
> 解决办法还是**倍增**：把批次长度本身做成 $1,2,4,8,\dots$ 增长的，同时在长批次内部每 127 步再额外算一次 $\gcd$。批次短的时候不会一次性攒太多因子，批次长的时候 $\gcd$ 的次数又足够少，兼顾了效率与精度。

Brent 判环 + 倍增优化的实现如下：

```c++
ll pollard_rho(ll n)
{
    if (n % 2 == 0) return 2;
    if (n % 3 == 0) return 3;
    if (n == 4) return 2; // 特判 4
    while (true)
    {
        ll c = randint(1LL, n - 1);
        ll t = 0, s = 0, val = 1;
        for (int goal = 1;; goal <<= 1, s = t, val = 1)
        {
            bool bad = false;
            for (int step = 1; step <= goal; ++step)
            {
                t = f(t, c, n);
                val = mul_mod(val, llabs(t - s), n); // 把差值累乘起来
                if (!val) { bad = true; break; }      // 乘积已经是 n 的倍数
                if (step % 127 == 0)
                {
                    ll d = gcd(val, n);
                    if (d == n) { bad = true; break; }
                    if (d > 1) return d;
                }
            }
            if (!bad)
            {
                ll d = gcd(val, n);
                if (d > 1 && d < n) return d;
                if (d == n) bad = true;
            }
            if (bad) break; // 本组随机参数失败，换一个 c 重来
        }
    }
}
```

### 复杂度分析

设 $p$ 是 $n$ 的最小素因子。

- 数列模 $p$ 之后的碰撞期望在 $O(\sqrt{p})$ 步之后出现，所以 Pollard Rho 的期望迭代次数为 $O(\sqrt{p})$；
- 每次 $\gcd$ 是 $O(\log n)$，所以 Floyd 判环的期望复杂度为 $O(\sqrt{p}\log n)$，加上倍增优化后接近 $O(\sqrt{p})$；
- 又因为 $p \le \sqrt{n}$，故 Pollard Rho 求出一个非平凡因子的期望复杂度是 $O(n^{\frac{1}{4}})$。

	$n = 10^{18}$ 时 $n^{\frac{1}{4}} \approx 3.2 \times 10^{4}$，也就是几万次迭代，毫秒级就能出结果。相比之下试除法的 $O(\sqrt{n}) = 10^9$ 次取模，完全不是一个量级。

	不过要说清楚：前面的分析是基于"完全随机的自映射"做的，而 $f(x) = x^2 + c$ 只是个**伪随机**函数，所以严格意义上这个算法并没有精确的复杂度证明。实践上它跑得相当快，江湖人称"不会被卡"。

### 素性测试：Miller-Rabin

Pollard Rho 只负责"找一个非平凡因数"，它无法判断一个数是不是素数。而要**完整地分解** $n$，我们还需要一个素性测试来判断"递归到底了没有"。这里用 **Miller-Rabin**。

> **二次探测定理**：如果 $p$ 是奇素数，则 $x^2 \equiv 1\ (mod\ p)$ 的解只有 $x \equiv 1\ (mod\ p)$ 与 $x \equiv p-1\ (mod\ p)$。

Miller-Rabin 把 $n - 1$ 写成 $n - 1 = d \cdot 2^s$（$d$ 为奇数），然后对随机底数 $a$ 检查：

$$a^d \equiv 1\ (mod\ n) \qquad \text{或} \qquad a^{d \cdot 2^r} \equiv -1\ (mod\ n),\ \ 0 \le r < s$$

两个条件都不满足，则 $n$ 一定是合数；如果满足，则 $n$ 大概率是素数。

奇合数 $n > 9$ 通过一次随机底数的 Miller-Rabin 测试的概率至多为 $\frac{1}{4}$，所以独立地测 $k$ 次之后，仍把合数误判成素数的概率不超过 $\frac{1}{4^k}$。

实现上，对 64 位整数可以直接用一组**确定性基底** $\{2, 325, 9375, 28178, 450775, 9780504, 1795265022\}$，它们对所有 $n < 2^{64}$ 都能给出完全正确的答案（此时就不再是概率性的了）。

```c++
bool is_prime(ll n) // Miller-Rabin 素性测试
{
    if (n < 2) return false;
    for (ll p : {2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37})
        if (n % p == 0) return n == p;
    ll d = n - 1, s = 0;
    while (!(d & 1)) d >>= 1, ++s;
    for (ll a : {2LL, 325LL, 9375LL, 28178LL, 450775LL, 9780504LL, 1795265022LL})
    {
        if (a % n == 0) continue;
        ll x = qpow(a % n, d, n);
        if (x == 1 || x == n - 1) continue;
        bool ok = false;
        for (ll r = 1; r < s; ++r)
        {
            x = mul_mod(x, x, n);
            if (x == n - 1) { ok = true; break; }
        }
        if (!ok) return false;
    }
    return true;
}
```

### 完整的质因数分解

有了素性测试和 Pollard Rho，完整的算法就是一个很朴素的递归：

```c++
// 递归分解 n，把（可重复的）质因子塞进 fac
void factor(ll n, vector<ll> &fac)
{
    if (n <= 1) return;
    if (is_prime(n)) { fac.push_back(n); return; }
    ll d = pollard_rho(n);
    factor(d, fac);
    factor(n / d, fac);
}
```

几个实用的小优化：

> 1. **先试除小质数**。$n$ 里若有 $2,3,5,7$ 这些因子，先除掉能省下不少时间。
> 2. **判断完全平方数**。若 $n = s^2$，那么 $s$ 就是一个现成的因数。而 $n = p^2$ 恰好是 Pollard Rho 最"难啃"的形状之一（两个素因子完全相同），特判掉收益很大。
> 3. **注意 $\gcd$ 的返回值**。Pollard Rho 有可能返回 $n$ 本身（失败），外层要用 `while (d == n) d = pollard_rho(n);` 之类的写法重试。

## 板子

把上面所有东西拼起来，就是下面这份可以直接抄走的模板：

> 关于编译标准：`std::gcd` 是 C++17 才有的，而不少 OJ / 编辑器默认是 C++14，所以这里自己写了一个 `gcd`，这样 C++11 及以上都能编译。若你的环境是 C++17，删掉自己写的那个、直接用 `std::gcd` 也一样。

```c++
#include <bits/stdc++.h>
using namespace std;
using ll = long long;
using ull = unsigned long long;
using i128 = __int128_t;

// 生成随机数建议用<random>里的引擎和分布，而不是rand()模数，那样保证是均匀分布
template <class T>
T randint(T l, T r = 0)
{
    static mt19937 eng(time(0));
    if (l > r)
        swap(l, r);
    uniform_int_distribution<T> dis(l, r);
    return dis(eng);
}

ll gcd(ll a, ll b) { return b ? gcd(b, a % b) : a; } // gcd，std::gcd 需要 C++17

ll mul_mod(ll a, ll b, ll mod) { return (i128)a * b % mod; } // 快速乘

ll qpow(ll a, ll b, ll mod) // 快速幂
{
    ll res = 1;
    while (b)
    {
        if (b & 1) res = mul_mod(res, a, mod);
        a = mul_mod(a, a, mod);
        b >>= 1;
    }
    return res;
}

bool is_prime(ll n) // Miller-Rabin 素性测试
{
    if (n < 2) return false;
    for (ll p : {2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37})
        if (n % p == 0) return n == p;
    ll d = n - 1, s = 0;
    while (!(d & 1)) d >>= 1, ++s;
    for (ll a : {2LL, 325LL, 9375LL, 28178LL, 450775LL, 9780504LL, 1795265022LL})
    {
        if (a % n == 0) continue;
        ll x = qpow(a % n, d, n);
        if (x == 1 || x == n - 1) continue;
        bool ok = false;
        for (ll r = 1; r < s; ++r)
        {
            x = mul_mod(x, x, n);
            if (x == n - 1) { ok = true; break; }
        }
        if (!ok) return false;
    }
    return true;
}

ll f(ll x, ll c, ll mod) { return (mul_mod(x, x, mod) + c) % mod; } // 伪随机数列

ll pollard_rho(ll n) // Brent 判环 + 倍增优化，返回 n 的一个非平凡因数
{
    if (n % 2 == 0) return 2;
    if (n % 3 == 0) return 3;
    if (n == 4) return 2; // 特判 4
    while (true)
    {
        ll c = randint(1LL, n - 1);
        ll t = 0, s = 0, val = 1;
        for (int goal = 1;; goal <<= 1, s = t, val = 1)
        {
            bool bad = false;
            for (int step = 1; step <= goal; ++step)
            {
                t = f(t, c, n);
                val = mul_mod(val, llabs(t - s), n); // 把差值累乘起来
                if (!val) { bad = true; break; }      // 乘积已经是 n 的倍数
                if (step % 127 == 0)
                {
                    ll d = gcd(val, n);
                    if (d == n) { bad = true; break; }
                    if (d > 1) return d;
                }
            }
            if (!bad)
            {
                ll d = gcd(val, n);
                if (d > 1 && d < n) return d;
                if (d == n) bad = true;
            }
            if (bad) break; // 本组随机参数失败，换一个 c 重来
        }
    }
}

// 递归分解 n，把（可重复的）质因子塞进 fac
void factor(ll n, vector<ll> &fac)
{
    if (n <= 1) return;
    if (is_prime(n)) { fac.push_back(n); return; }
    ll d = pollard_rho(n);
    factor(d, fac);
    factor(n / d, fac);
}

int main()
{
    ll n;
    cin >> n;
    vector<ll> fac;
    factor(n, fac);
    sort(fac.begin(), fac.end());
    for (size_t i = 0; i < fac.size(); ++i)
        cout << (i ? " * " : "") << fac[i];
    cout << endl;
    return 0;
}
```

## 例题

- **【模板】Pollard-Rho**：<https://www.luogu.com.cn/problem/P4718>。给定 $T \le 350$ 个 $2 \le n \le 10^{18}$ 的整数，若 $n$ 是素数则输出 `Prime`，否则输出它最大的质因子。数据量很大，**必须用倍增优化**，纯 Floyd 判环会超时。
- **CF 1445C Division**：<https://codeforces.com/problemset/problem/1445/C>。给定 $p \le 10^{18}$ 与 $2 \le q \le 10^9$，求最大的 $x$ 使得 $x \mid p$ 且 $q \nmid x$。做法是分解 $p$ 与 $q$，对 $q$ 的每个质因子 $c$ 不断从 $p$ 中除去 $c$，直到 $p$ 中 $c$ 的次数小于 $q$ 中 $c$ 的次数，对所有这样的方案取最大值。

## 小结

回顾一下整条思路：

1. 试除法是 $O(\sqrt{n})$，面对 $10^{18}$ 级别的整数完全无能为力；
2. 随机猜一个因子的期望次数是 $O(n)$，同样不行；
3. 于是我们用生日悖论，把"随机碰撞"的问题转化成了"在 $\mathbb{Z}_p$ 上判环"，用 $f(x) = x^2 + c \bmod n$ 生成伪随机数列；
4. 用 Floyd / Brent 判环找到两个"在模 $p$ 意义下相同"的数，再用 $\gcd$ 把这个"相同"翻译成一个非平凡因数；
5. 配上 Miller-Rabin 判断递归的终点，就能完整地分解 $n$。

整个算法是**随机化**的：它有可能失败（返回 $n$ 本身），但期望只需要 $O(n^{\frac{1}{4}})$ 次迭代就能成功一次。
