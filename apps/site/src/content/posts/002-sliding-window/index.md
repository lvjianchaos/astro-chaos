---
title: "灵神算法基础|滑动窗口"
description: "在一段连续数组/字符串上，用左右两个指针框出一个窗口，根据条件动态移动左、右边界，只遍历一遍，高效求解连续子区间问题，避免暴力双重循环。"
pubDatetime: 2026-10-29T10:30:00+08:00
series: 灵神|基础算法精讲
tags: [来源:leetcode, lt:中等, 滑动窗口]
---

## 长度最小的子数组

> [209. 长度最小的子数组](https://leetcode.cn/problems/minimum-size-subarray-sum/)

### 题意

给定一数组与目标值，找到一个长度最小的子数组，满足子数组元素和$\ge$ 目标值，输出该子数组长度。

### 思路

暴力的做法不难想：枚举左端点，右端点不断向右扩展子数组，字数组和大于等于target计算长度更新 $ans$；或者枚举右端点，不断向左扩展…枚举右端点 $O(n)$，扩展左端点 $O(n)$，时间复杂度 $O(n^2)$。

注意到暴力做法没有用到**数组元素都是正数**的性质。假设我们枚举右端点时有一段符合的子数组，那么我们在下次枚举时，并不需要再次重新向左扩展，我们可以保留上一次计算结果，在上次枚举的基础上把该数包含进去，由于元素为正数，所以子数组和依然是大于等于 $target$。那么我们转变一下思路，不是去扩展左端点，而是缩小窗口、右移左端点，通过这种方式把所有满足条件的子数组长度求出，取最小也就是答案。由于枚举右端点 $O(n)$，右移左端点也是 $O(n)$，时间复杂度也就是 $O(n)$。

举例：$target = 7, nums = [2,3,1,2,4,3]$。窗口的变化应当是：

![窗口变化过程](.\minimum-size-subarray-sum.excalidraw "wide")

### 代码

#### 写法一 while 循环结束后更新答案

```c++ 
class Solution {
public:
    int minSubArrayLen(int target, vector<int>& nums) {
        int n = nums.size();
        int ans = n + 1;
        int sum = 0;
        int l = 0;
        for (int r = 0; r < n;r ++) { // 枚举子数组右端点
            sum += nums[r];
            while (sum - nums[l] >= target) { // 尽量缩小子数组长度
                sum -= nums[l];
                l ++; // 左端点右移
            }
            if (sum >= target) {
                ans = min(ans, r - l + 1);
            }
        }
        return ans <= n ? ans : 0;
    }
};
```

#### 写法二 while 循环内更新答案

```c++
class Solution {
public:
    int minSubArrayLen(int target, vector<int>& nums) {
        int n = nums.size();
        int ans = n + 1;
        int sum = 0;
        int l = 0;
        for (int r = 0; r < n;r ++) { // 枚举子数组右端点
            sum += nums[r];
            while (sum >= target) { // 满足要求
                ans = min(ans, r - l + 1);
                sum -= nums[l];
                l ++; // 左端点右移
            }
        }
        return ans <= n ? ans : 0;
    }
};
```

#### 复杂度分析

时间复杂度：$O(n)$，其中 $n$ 为 $nums$ 的长度。虽然写了二重循环，但内层循环中对 $l++$ 的总执行次数不会超过 $n$ 次，所以总的时间复杂度为 $O(n)$。

空间复杂度：$O(1)$。

## 乘积小于 K 的子数组

> [713. 乘积小于 K 的子数组](https://leetcode.cn/problems/subarray-product-less-than-k/)

### 题意

给定一个整数数组 `nums` 和一个整数 `k`。返回 **子数组** 内所有元素的 **乘积严格小于** `k` 的连续子数组的数目。

### 思路

方法同上题，我们枚举右端点，右移左端点。具体的说，举例：$nums = [10,5,2,6], k = 100$，我们在枚举到右端点 $2$ 时，窗口为 $[10,5,2]$，乘积 $\ge k$ ，右移左端点即 $[5,2]$，那么以 $2$ 为右端点的子数组符合条件的有 $[5,2]$、 $[2]$，数目为 $2$。**假设此时（以某元素为右端点的最大长度的子数组）左端点 $l$，右端点 $r$，那么满足条件的以 $r$ 为右端点的子数组的数目为 $r - l + 1$**，原因在于，整数数组元素都为正数，若 $[l,r]$ 这段乘积 $\le k$，那么 $[l+1,r]$ 乘积$\le[l,r]$ $\le k$，也就是说 $[l,r],[l+1,r],...[r,r]$ 都满足条件，个数就是 $r-l+1$。

### 代码

```c++
class Solution {
public:
    int numSubarrayProductLessThanK(vector<int>& nums, int k) {
        if (k <= 1) return 0;
        int ans = 0, prod = 1, l = 0;
        for (int r = 0; r < nums.size();r ++) {
            prod *= nums[r];
            while (prod >= k) { // 不满足要求
                prod /= nums[l];
                l++; // 缩小窗口
            }
            // 对于固定的 r，有 r-l+1 个合法的左端点
            ans += r - l + 1;
        }
        return ans;
    }
};
```

由于数组元素都为正整数，那么若 $k\le1$，永远没有符合条件的子数组，答案恒 $0$，可以直接特判；若不特判，$prod\ge k$ 恒为 $true$，$l++$ 导致越界，所以不特判就需要额外判断 $l <= r$ 避免**下标越界**，即内层循环条件为 `l <= r && prod >= k`。

**时间复杂度**：$O(n)$，其中 $n$ 为 $nums$ 的长度。虽然写了二重循环，但内层循环中对 $l$ 加一的总执行次数不超过 $n$ 次，所以总的时间复杂度为 $O(n)$。

**空间复杂度**：$O(1)$。

## 无重复字符的最长子串

> [3. 无重复字符的最长子串](https://leetcode.cn/problems/longest-substring-without-repeating-characters/)

### 题意

给定一个字符串 `s` ，找出其中不含有重复字符的 **最长子串** 的长度。

### 思路

方法同上，<u>枚举右端点，发现字串不符合条件（有重复字符）右移左端点</u>。由于我们每次都是从一个不含重复字符的子串新添一个右端点的字符，那么这个重复字符一定来自于我们这个新添的。问题就在于，我们如何去判断这个字符是否是重复的呢？我们可以使用一个哈希表来实时记录字符出现的次数。如果准备新添的字符的记录次数大于零，即重复，我们就不断右移左端点直到次数等于零，即可新添字符。具体见代码。

### 代码

#### 写法一 哈希表

```c++ {8-15}
class Solution {
public:
    int lengthOfLongestSubstring(string s) {
        int n = s.length();
        int ans = 0;
        int l = 0;
        unordered_map<char,int> cnt; // 维护窗口内的字符
        for(int r = 0;r < n;r ++) {
            while(cnt[s[r]]) { // 新添的为重复字符
                cnt[s[l]] --; // 移除窗口左端点字符
                l ++;
            }
            cnt[s[r]] ++;
            ans = max(ans,r-l+1); // 更新窗口最大值
        }
        return ans;
    }
};
```

#### 写法二 哈希集合

```c++ collapse={20-24}
class Solution {
public:
    int lengthOfLongestSubstring(string s) {
        int n = s.length(), ans = 0, left = 0;
        unordered_set<char> window; // 维护从下标 left 到下标 right 的字符
        for (int right = 0; right < n; right++) {
            char c = s[right];
            // 如果窗口内已经包含 c，那么再加入一个 c 会导致窗口内有重复元素
            // 所以要在加入 c 之前，先移出窗口内的 c
            while (window.contains(c)) { // 窗口内有 c
                window.erase(s[left]);
                left++; // 缩小窗口
            }
            window.insert(c); // 加入 c
            ans = max(ans, right - left + 1); // 更新窗口长度最大值
        }
        return ans;
    }
};

// 作者：灵茶山艾府
// 链接：https://leetcode.cn/problems/longest-substring-without-repeating-characters/solutions/1959540/xia-biao-zong-suan-cuo-qing-kan-zhe-by-e-iaks/
// 来源：力扣（LeetCode）
// 著作权归作者所有。商业转载请联系作者获得授权，非商业转载请注明出处。
```

#### 复杂度分析

- **时间复杂度**：$O(n)$，其中 $n$ 为 $s$ 的长度。注意 $l$ 至多增加 $n$ 次，所以整个二重循环至多循环 $O(n)$ 次。
- **空间复杂度**：$O(∣Σ∣)$，其中 $∣Σ∣$ 为字符集合的大小，本题中字符均为 $ASCII$ 字符，所以 $∣Σ∣≤128$。
