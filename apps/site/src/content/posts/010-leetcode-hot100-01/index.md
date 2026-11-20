---
title: "LeetCode-Hot100-day1"
description: "day1-dp"
pubDatetime: 2026-11-17T10:00:00+08:00
series: hot100速刷 
tags: [动态规划, 01背包, 完全背包]
---



> 刷题节奏参考我的好友 Codingxb 的博客 [【题单】hot100](https://blog.codingxb.cn/article/%E9%9D%A2%E8%AF%95/%E7%AE%97%E6%B3%95%E9%A2%98/%E3%80%90%E9%A2%98%E5%8D%95%E3%80%91hot100)

## 动态规划

### 70. 爬楼梯

爬楼梯，$n$ 阶到达楼顶，每次可爬 `1` 或 `2` 阶。问：多少种方法？

设 $dp[i]$ 为到达阶 $i$ 的方法数，则有：

1. $dp[1] = 1, dp[2] = 2$
2. $dp[i] = dp[i-1] + dp[i-2],i>2$

按照公式递推即可，但我们发现$dp[i]$每次只与前两个有关，所以可以写成如下：

```cpp
class Solution {
public:
    int climbStairs(int n) {
        if(n <= 2) return n;
        int a=1,b=2;
        int ans = 0;
        for(int i = 3;i <= n;i ++) {
            ans = a+b;
            a = b;
            b = ans;
        }
        return ans;
    }
};
```

### 118. 杨辉三角

返回杨辉三角的前`numsRows`行。

设 $dp[i][j]$ 表示在位置$[i][j]$的值，则有：

$dp[i][j] = dp[i-1][j-1]+dp[i-1][j]$，对于越界部分，0替代即可。

```cpp
class Solution {
public:
    vector<vector<int>> generate(int numRows) {
        vector<vector<int>> dp(numRows,vector<int>());
        dp[0].push_back(1);
        for(int i = 1;i < numRows;i ++) {
            for(int j = 0;j <= i;j ++) {
                if(j == 0) {
                    dp[i].push_back(dp[i-1][j]);
                    continue;
                }
                if(j == i) {
                    dp[i].push_back(dp[i-1][j-1]);
                    continue;
                }
                dp[i].push_back(dp[i-1][j-1] + dp[i-1][j]);
            }
        }
        return dp;
    }
};
```

### 279. 完全平方数

返回和为 `n` 的完全平方数的最少数量

我们可以看作一个选/不选的问题，注意这里同一个数**可以重复选**，是一个完全背包问题（外层物品、内层容量，正序遍历）。

设 $dp[i][j]$表示为从前 $i$ 个完全平方数选择，和为 $j$ 的最小值。

$dp[i][j]=min(dp[i-1][j],dp[i][j-i^2]+1)$

观察递推方程可发现，在计算 $dp[i]$ 时，只会用到 $dp[i−1]$，不会用到比 $i−1$ 更早的状态。所以可以减掉一维。

```cpp
class Solution {
public:
    int numSquares(int n) {
        vector<int> dp(n+1,n);
        dp[0] = 0;
        for(int i = 1;i * i <= n;i ++) {
            for(int j = i*i;j <= n;j ++) {
                dp[j] = min(dp[j],dp[j-i*i]+1);
            }
        }
        return dp[n];
    }
};
```

### 322. 零钱兑换

`coins`数组：不同面额的硬币（外层物品），硬币无限；总金额`amount`，求出能组合成总金额的最小硬币数。

类似上一题，对不同硬币进行选/不选，可重复选。

```cpp
class Solution {
public:
    int coinChange(vector<int>& coins, int amount) {
        vector<int> dp(amount+1,10001);
        dp[0] = 0;
        for(int i = 0;i < coins.size();i ++) {
            for(int j = coins[i];j <= amount;j ++) {
                dp[j] = min(dp[j],dp[j-coins[i]]+1); 
            }
        }

        return dp[amount] == 10001 ? -1 : dp[amount];
    }
};
```

### 416. 分割等和子集

给你一个 **只包含正整数** 的 **非空** 数组 `nums` 。请你判断是否可以将这个数组分割成两个子集，使得两个子集的元素和相等。

选或不选（不可重复）01背包，确定可以选出子集和为 sum/2，sum不可整除无法分割直接返回失败。$dp[j]$ 表示可以选出子集和为 $j$ 的子集。

```cpp
class Solution {
public:
    bool canPartition(vector<int>& nums) {
        int n = nums.size();
        int sum = 0;
        for(int i = 0;i < n;i ++) sum += nums[i];
        
        if(sum&1) return false;
        
        vector<bool> dp(sum/2+1,false);
        dp[0] = true;
        for(int i = 0;i < n;i ++) {
            for(int j = sum/2;j >= nums[i];j --) {
                dp[j] = dp[j - nums[i]] | dp[j];
            }
        }
        
        return dp[sum/2];
    }
};
```

### 121. 买卖股票的最佳时机

如果我们要卖出股票，那么最佳的是买入的股票应当价格最低，所以维护在第 i 天前的股票最小值，确定为买入日，那么第i天卖出的最大利润就是今天减最小值那天。

```cpp
class Solution {
public:
    int maxProfit(vector<int>& prices) {
        int minn = prices[0];
        int profit = 0;
        for(int i = 1;i < prices.size();i ++) {
            profit = max(profit,prices[i]-minn);
            minn = min(minn,prices[i]);
        }
        return profit;
    }
};
```

### 198. 打家劫舍

一排房屋，相邻屋子不能都偷，问一夜偷盗最高价值。

设 $dp[i]$ 为从前 $i$ 个房子获取的最大价值，那么

$dp[i] = max(dp[i-1],dp[i-2]+nums[i])$

```cpp
class Solution {
public:
    int rob(vector<int>& nums) {
        int n = nums.size();
        if(n == 1) return nums[0]; 
        if(n == 2) return max(nums[0],nums[1]);
        vector<int> dp(n);
        dp[0] = nums[0];
        dp[1] = max(nums[0],nums[1]);
        for(int i = 2;i < n;i ++) 
            dp[i] = max(dp[i-1],dp[i-2]+nums[i]);
        
        return dp[n-1];
    }
};
```

由于$dp[i]$只和前两个变量有关系，可以优化掉其他空间：
```cpp
class Solution {
public:
    int rob(vector<int>& nums) {
        int n = nums.size();
        if(n == 1) return nums[0]; 
        if(n == 2) return max(nums[0],nums[1]);
        int a = nums[0];
        int b = max(nums[0],nums[1]);
        int ans = 0;
        for(int i = 2;i < n;i ++) {
			ans = max(b,a+nums[i]);
            a = b;
            b = ans;
        }
        return ans;
    }
};
```

### 62. 不同路径

只能向下、右移动，易得$dp[i][j] = dp[i-1][j] + dp[i][j-1]$，而第一行和第一列，显然只有1条路径，对这些进行初始化后，进行dp。

```cpp
class Solution {
public:
    int uniquePaths(int m, int n) {
        vector<vector<int>> dp(m,vector<int>(n,1));
        //dp[i][j] = dp[i-1][j] + dp[i][j-1];

        for(int i = 1;i < m;i ++) {
            for(int j = 1;j < n;j ++) {
                dp[i][j] = dp[i-1][j] + dp[i][j-1];     
            }
        }
        return dp[m-1][n-1];
    }
};
```

### 64. 最小路径和

给定 $m×n$ 网格，找出坐上到右下一条路径（只能向下或向右），使得路径和最小，输出最小路径和。

设 $dp[i][j]$ 表示从左上到 `(i,j)` 的最小路径和。答题思路同上一题。

$dp[i][j] = min(dp[i-1][j],dp[i][j-1])+grid[i][j]$

```cpp
class Solution {
public:
    int minPathSum(vector<vector<int>>& grid) {
        int m = grid.size();
        int n = grid[0].size();
        vector<vector<int>> dp(m,vector<int>(n,0));
        dp[0][0] = grid[0][0];
        for(int j = 1;j < n;j ++) dp[0][j] = dp[0][j-1] + grid[0][j];
        for(int i = 1;i < m;i ++) dp[i][0] = dp[i-1][0] + grid[i][0];
        for(int i = 1;i < m;i ++) {
            for(int j = 1;j < n;j ++) {
                dp[i][j] = min(dp[i-1][j],dp[i][j-1])+grid[i][j];
            }
        }
        return dp[m-1][n-1];
    }
};
```

### 53. 最大子数组和

给定一数组，找出最大子数组和。

设 $dp[i]$ 表示以 $nums[i]$为结尾的最大值数组和，那么

若 $dp[i-1] \le 0$ ，说明dp[i-1]对dp[i]产生负贡献，换句话说，$dp[i-1]+nums[i] \le nums[i]$。

$dp[i-1] > 0,dp[i] = dp[i-1] + nums[i]$

$dp[i-1] \le 0,dp[i]=nums[i]$

```cpp
class Solution {
public:
    int maxSubArray(vector<int>& nums) {
        int n = nums.size();
        vector<int> dp(n,0);
        dp[0] = nums[0];
        for(int i = 1;i < n;i ++) {
            if(dp[i-1] < 0) dp[i] = nums[i];
            else dp[i] = dp[i-1] + nums[i];
        }
        int ans = -10001;
        for(int i = 0;i < n;i ++) ans = max(ans,dp[i]);
        return ans;
    }
};
```

可以发现，dp[i] 仅与上一个元素有关，可以进行空间优化。

```cpp
class Solution {
public:
    int maxSubArray(vector<int>& nums) {
        int n = nums.size();
        int sum = nums[0];
        int ans = nums[0];
        for(int i = 1;i < n;i ++) {
            if(sum < 0) sum = nums[i];
            else sum += nums[i];
            ans = max(ans,sum);
        }
        return ans;
    }
};
```

### 300. 最长递增子序列 🌟

如题，定义 $dp[i]$ 为以 i-th 为结尾的子序列最长长度，那么对于 $0 \le j<i,nums[j]<nums[i]$，$dp[i] = max(dp[i],dp[j] + 1)$。

```cpp
class Solution {
public:
    int lengthOfLIS(vector<int>& nums) {
        int n = nums.size();

        vector<int> dp(n,1);
        int ans = 1;
        for(int i = 1;i < n;i ++) {
            for(int j = i-1;j >= 0;j --) {
                if(nums[i] > nums[j]) {
                    dp[i] = max(dp[i],dp[j] + 1);
                }
            }
            ans = max(ans,dp[i]);
        } 
        return ans;
    }
};
```

对于外层的循环线性遍历计算dp无法优化，所以可优化的点在于内层线性寻找 dp[j]

### 1143. 最长公共子序列 🌟

LCS；$dp[i][j]$代表text1的前i个字符和text2的前j个字符形成的最长公共子序列长度。

- `text1[i-1]==text2[j-1]` : $dp[i][j]=dp[i−1][j−1]+1$。代表**必然使用 text1[i-1] 与 text2[j-1] 时** LCS 的长度。
- `text1[i-1]!=text2[j-1]` : $dp[i][j]=max(dp[i−1][j],dp[i][j−1])$。代表**必然不使用 text1[i-1]（但可能使用text2[j-1]）时** 和 **必然不使用 text2[j-1]（但可能使用text1[i-1]）时** LCS 的长度。

```cpp
class Solution {
public:
    int longestCommonSubsequence(string text1, string text2) {
        int n = text1.length();
        int m = text2.length();
        vector<vector<int>> dp(n+1,vector<int>(m+1,0));
        for(int i = 1;i <= n;i ++) {
            for(int j = 1;j <= m;j ++) {
                if(text1[i-1] == text2[j-1]) {
                    dp[i][j] = dp[i-1][j-1]+1;
                } else {
                    dp[i][j] = max(dp[i-1][j],dp[i][j-1]);
                }
            }
        }
        return dp[n][m];
    }
};
```

### 72. 编辑距离 🌟

给你两个单词 `word1` 和 `word2`， 返回将 `word1` 转换成 `word2` 所使用的最少操作数 。

可以对一个单词进行如下三种操作：

- 插入一个字符
- 删除一个字符
- 替换一个字符

类似 LCS；定义 $dp[i][j]$ 表示word1 前 i 个字符转换为 word2 前 j 个字符最少的操作次数。

对于 word[i-1] == word[j-1]，$dp[i][j]=dp[i-1][j-1]$

对于 !=，$dp[i][j] = min(dp[i-1]dp[j-1],dp[i-1][j],dp[i][j-1])+1$，按顺序分别表示替换、删除和插入操作。

```cpp

class Solution {
public:
    int minDistance(string word1, string word2) {
        int n = word1.length();
        int m = word2.length();
        
        vector<vector<int>> dp(n+1,vector<int>(m+1,0));

        for(int j = 0;j <= m;j ++) dp[0][j] = j;
        for(int i = 0;i <= n;i ++) dp[i][0] = i;

        for(int i = 1;i <= n;i ++) {
            for(int j = 1;j <= m;j ++) {
                if(word1[i-1] == word2[j-1]) dp[i][j] = dp[i-1][j-1];
                else {
                    dp[i][j] = min(dp[i-1][j-1],min(dp[i-1][j],dp[i][j-1])) + 1;
                }
            }
        }

        return dp[n][m];
    }
};
```

### 139. 单词拆分 🌟

把 *s* 划分成若干段，使得每段都在 *wordDict* 中。判断能否划分。

定义状态为 *dfs*(*i*)，表示能否把前缀 *s*[:*i*]（表示 *s*[0] 到 *s*[*i*−1] 这段子串）划分成若干段，使得每段都在 *wordDict* 中。

**递归边界**：*dfs*(0)=true。递归到空串，说明 *s* 成功地划分完毕。

**递归入口**：*dfs*(*n*)，也就是答案。

整个递归过程中有大量重复递归调用（递归入参相同）。由于递归函数没有副作用，同样的入参无论计算多少次，算出来的结果都是一样的，因此可以用**记忆化搜索**来优化：

- 如果一个状态（递归入参）是第一次遇到，那么可以在返回前，把状态及其结果记到一个 *memo* 数组中。
- 如果一个状态不是第一次遇到（*memo* 中保存的结果不等于 *memo* 的初始值），那么可以直接返回 *memo* 中保存的结果。

```cpp title="递归"
class Solution {
public:
    bool wordBreak(string s, vector<string>& wordDict) {
        auto it = std::max_element(wordDict.begin(), wordDict.end(),
                                   [](const string& a, const string& b) {
                                       return a.size() < b.size();
                                   });
        int max_len = it->size();
        unordered_set<string> words(wordDict.begin(), wordDict.end());
        int n = s.size();
        vector<int> memo(n + 1, -1);
        auto dfs = [&](this auto&& dfs, int i) -> bool {
            if (i == 0) {
                return true;
            }
            int& res = memo[i];
            if (res != -1) {
                return res;
            }
            for (int j = i - 1; j >= max(i - max_len, 0); j--) {
                if (words.contains(s.substr(j, i - j)) && dfs(j)) {
                    return res = true;
                }
            }
            return res = false;
        };

        return dfs(n);
    }
};
```

翻译成递推。

具体来说，*f*[*i*] 的定义和 *dfs*(*i*) 的定义是一样的，都表示能否把前缀 *s*[:*i*]（表示 *s*[0] 到 *s*[*i*−1]）划分成若干段，使得每段都在 *wordDict* 中。

同样地，枚举 *j*=*i*−1,*i*−2,*i*−3,…,max(*i*−*maxLen*,0)，只要其中一个 *j* 满足 *s*[*j*:*i*] 在 *wordDict* 中且 *f*[*j*]=true，那么 *f*[*i*] 就是 true。

初始值 *f*[0]=true，翻译自递归边界 *dfs*(0)=true。

答案为 *f*[*n*]，翻译自递归入口 *dfs*(*n*)。

```cpp collapse="21-25"
class Solution {
public:
    bool wordBreak(string s, vector<string>& wordDict) {
        int max_len = ranges::max(wordDict, {}, &string::size).size();
        unordered_set<string> words(wordDict.begin(), wordDict.end());

        int n = s.size();
        vector<int> f(n + 1);
        f[0] = true;
        for (int i = 1; i <= n; i++) {
            for (int j = i - 1; j >= max(i - max_len, 0); j--) {
                if (f[j] && words.contains(s.substr(j, i - j))) {
                    f[i] = true;
                    break;
                }
            }
        }
        return f[n];
    }
};

作者：灵茶山艾府
链接：https://leetcode.cn/problems/word-break/solutions/2968135/jiao-ni-yi-bu-bu-si-kao-dpcong-ji-yi-hua-chrs/
来源：力扣（LeetCode）
著作权归作者所有。商业转载请联系作者获得授权，非商业转载请注明出处。
```

