---
title: "灵神算法基础|相向双指针"
description: "两个指针`left=0``right=n-1`，从数组的两端开始，向中间移动。"
pubDatetime: 2026-10-28T10:30:00+08:00
series: 灵神|基础算法精讲
tags: [来源:leetcode, lt:中等, 相向双指针, 前后缀分解]
---

## 两数之和 II - 输入有序数组

> 题目：[167. 两数之和 II - 输入有序数组](https://leetcode.cn/problems/two-sum-ii-input-array-is-sorted/) 

### 题意

给一个有序整形数组，与一个目标值 `target`。要求你输出数组中两数之和等于目标值的下标。规定每个输入都有唯一答案。

### 思路

显然的思路是**暴力**：枚举第一个数，接着枚举第二个数，若两数之和等于目标值，输出其下标；代码由双层`for`循环实现，时间复杂度 $O(n^2)$，显然很高。但，这里没有用到有序数组的**有序**特性。

我们假设有 $[2,3,4,6,8]$ 这个有序数组，目标值为 $9$ 。我们先随便选两个数：$3$ 和 $8$ ，$3+8>9$，也就是说 $8$ 在与 $3$ 之后的任何数相加都大于目标值，即 $8$ 就舍弃掉。我们假设最开始选择最左和最右两个数，若两数相加大于目标值，则说明最右可以舍弃，`right--`；若小于则最左可以舍弃，`left++`；相等则输出下标组。如此循环，最终会得到一个确定的答案输出。时间复杂度 $O(n)$。

在原本的暴力算法中，我们只能两两组合来判断是否相等于目标值；而现在，我们在枚举左右时，每次会排除接近 $n$ 个的组合。换句话说，暴力算法中`O(1)`时间会得到`O(1)`的信息，而现在会得到`O(n)`的信息；时间复杂度 `O(n)`，空间复杂度`O(1)`。

### 代码

```c++ {8}
class Solution {
public:
    vector<int> twoSum(vector<int>& numbers, int target) {
        int l = 0, r = numbers.size() - 1;
        while(true) {
            int s = numbers[l] + numbers[r];
            if(s == target) return {l+1,r+1};
            s > target ? r -- : l ++;
        }
    }
};
```

## 三数之和

> 题目：[15. 三数之和](https://leetcode.cn/problems/3sum/) 

### 题意

给定整型数组，返回所有和为 `0` 的且不重复的三元组。

### 思路

完成上题[[#两数之和 II - 输入有序数组]]，一个大概的思路就是：**先排序**方便后续操作（双指针以及跳过相同元素），**外层循环枚举第一个数`i`，内层就是两数之和的做法**。

需要特殊考虑的是答案里不能有重复三元组：

1. 外层循环中，若 $nums[i] = nums[i-1]$，那么$nums[i]$ 能与后面组成和为 $0$ 的三元组，则$nums[i-1]$也能组成相同三元组，所以在外层遇到 $nums[i] = nums[i-1]$的情况，直接 `continue`。
2. 内层循环中，当三数之和等于 $0$ 时，为避免相同的三元组计入答案，要跳过后续相同的 $nums[j]$ 与 $nums[k]$ （也可只跳过相同的 $nums[j]$）。

**优化**：

1. 若 $nums[i] + nums[i+1] + nums[i+2] > 0$，则说明 $nums[i]$ 与后面任何数相加都大于零，即不可能存在三数之和等于零，`break` 外层循环；
2. 若 $nums[i] + nums[n-2] + nums[n-1] < 0$，则说明 $nums[i]$ 与后面任何数相加都小于零，也不存在三数之和等于零，继续枚举（因为 $nums[i]$ 会逐渐变大，有机会找到三数之和等于零），`continue` 外层循环。

### 代码

#### 写法一

```c++ title="写法一.cpp"
class Solution {
public:
    vector<vector<int>> threeSum(vector<int>& nums) {
        sort(nums.begin(),nums.end());
        vector<vector<int>> ans;
        int n = nums.size();
        for(int i = 0;i < n-2;i ++) {
            // 跳过重复数字
            if(i && nums[i] == nums[i-1]) continue;
            // 2个优化
            if(nums[i] + nums[i+1] + nums[i+2] > 0) break;
            if(nums[i] + nums[n-1] + nums[n-2] < 0) continue;
            int j = i + 1, k = n - 1;
            while(j < k) {
                int s = nums[i] + nums[j] + nums[k];
                if(s > 0) k --;
                else if(s < 0) j ++;
                else {
                    ans.push_back({nums[i],nums[j],nums[k]});
                    // 跳过重复数字
                    for(j ++;j < k && nums[j] == nums[j-1];j ++);
                    for(k --;k > j && nums[k] == nums[k+1];k --);
                }
            }
        }
        return ans;
    }
};
```

#### 写法二

写法一内层循环跳过重复数字，也可以写成这样：如果三数之和等于 $0$ ，且 $j > i+1~\&\&~nums[j] == nums[j-1]$，说明之前找到过相同的三元组。

```c++ title="写法二.cpp"
class Solution {
public:
    vector<vector<int>> threeSum(vector<int>& nums) {
        sort(nums.begin(),nums.end());
        vector<vector<int>> ans;
        int n = nums.size();
        for(int i = 0;i < n-2;i ++) {
            // 跳过重复数字
            if(i && nums[i] == nums[i-1]) continue;
            // 2个优化
            if(nums[i] + nums[i+1] + nums[i+2] > 0) break;
            if(nums[i] + nums[n-1] + nums[n-2] < 0) continue;
            int j = i + 1, k = n - 1;
            while(j < k) {
                int s = nums[i] + nums[j] + nums[k];
                if(s > 0) k --;
                else if(s < 0) j ++;
                else {
                    // j == i + 1 表示内存循环刚开始，j 左边没有数字
                    // nums[j] != nums[j - 1] 表明与上一轮循环的三元组不同
                    if (j == i + 1 || nums[j] != nums[j - 1]) {
                        ans.push_back({x, nums[j], nums[k]});
                    }
                    j++;
                    k--;
                }
            }
        }
        return ans;
    }
};
```

#### 复杂度分析

- **时间复杂度：** $O(n^2)$，其中 $n$ 为数组长度。排序 $O(nlogn)$ 。外层循环 $O(n)$，内层循环为相向双指针 $O(n)$，总时间复杂度 $O(n^2)$。

- **空间复杂度：** $O(1)$，忽略排序的栈开销。

## 盛水最多的容器

> [11. 盛最多水的容器](https://leetcode.cn/problems/container-with-most-water/) 

### 题意

给定一整型数组，要求你找出两个线作为高度、下标差为底看作盛水的容器，使得盛水量最大。

![盛水最多的容器](https://gcore.jsdelivr.net/gh/lvjianchaos/image-host@main/io/post/000-opposite-two-pointers/container-with-most-water.webp)

### 思路

直观的，容器的高度取决于更短的那条线，容器的宽度取决于两条线的距离，即下标差，盛水量即面积。我们先随意选择两条线，可参考图。对于短的那条线，如果中间（两条线之间）的线和它构成容器：

1. 中间的线比它长或恰好相等，那么高度依旧由更短的那条线决定，所以高度不变，但宽度（下标差）变小，盛水量减少；
2. 中间的线比它短，高度由更短的那条即中间的那条控制，所以高度减少，宽度减少，盛水量减少；

也就是说，中间任何线无法和短线构成更大的容器了，即：要想构成更大的容器肯定不会包含这条线，所以这条线可以直接去掉，在剩下的线中继续寻找。

**相向双指针**，初始化两个指针 $left=0$ 和 $right=n-1$ ，分别指向最左和最右，哪条线短就移动哪条，若一样长移动哪条都可以。但在移动前，我们要计算这两条线的“盛水量”，若比答案大则更新答案。

我们每次 $O(1)$ 的时间去掉 $1$ 条线，时间复杂度 $O(n)$。

### 代码

```c++ {11}
class Solution {
public:
    int maxArea(vector<int>& height) {
        // 初始化答案，与左右指针
        int ans = 0;
        int l = 0, r = height.size() - 1;
        while (l < r) {
            ans = max(ans, (r - l) * min(height[l], height[r]));
            // 若左边更短，则说明 height[l] 与右边任意垂线无法组成比 ans 更大的
            // 若右边更短，则说明 height[r] 与左边任意垂线无法组成比 ans 更大的
            height[l] < height[r] ? l ++ : r --;
        }
        return ans;
    }
};
```

## 接雨水

> [ 42. 接雨水](https://leetcode.cn/problems/trapping-rain-water/) 

###  题意

给定非负整型数组，表示高度，即图中黑色区块，那么可能形成洼地，问能接多少雨水。

![接雨水](https://gcore.jsdelivr.net/gh/lvjianchaos/image-host@main/io/post/000-opposite-two-pointers/trapping-rain-water.webp)

### 思路

假设每个位置都是一个宽度为 $1$ 的桶，那么就需要计算左边这块木板以及右边这块的高度，取最小值。左边木板高度取决于左边最大高度，高于这个最大高度的水会从左边流出去，而低于不会；同理，右边木板高度取决于右边的最大高度。

做法有两种：

1. 需要用到 $2$ 个额外数组。第一个数组存储从左到第 $i$ 个位置（前缀）的最大高度，即前缀的最大值；第二个数组存储从右到第 $i$ 个位置（后缀）的最大高度，及后缀的最大值。算出前缀最大值数组、后缀最大值数组，我们就可以计算每个桶所接雨水量—— $min(pre\_max[i], suf\_max[i]) - height[i]$ ，遍历求和从而得到答案。时空复杂度都是 $O(n)$。

2. 做法一时间复杂度已然最优，那么空间复杂度能否优化呢？假设我们只算了部分的前缀最大值和后缀最大值，我们能知道左边桶左侧木板的高度，以及右侧木板至少的高度，右边桶同理。

   若前缀最大值小于后缀最大值，则我们知道左边桶的高度（$min(pre\_max, \ge suf\_max) = pre\_max$）为前缀最大值，继续向右扩展前缀最大值；若后缀最大值小于前缀最大值，则我们知道右边桶的高度 $suf\_max$ 为后缀最大值，继续向左扩展后缀最大值；若相等，移动哪边都可以。

   具体如何实现呢？同上题，设两个指针 $L = 0, R = n-1$ 分别指向最左边和最右边，按照上述过程模拟即可。每次移动指针花费 $O(1)$ 时间，左右指针距离之和 $n$ ，时间复杂度 $O(n)$，这样只用到两个变量存储前缀最大值和后缀最大值，而不需要创建额外数组，空间复杂度 $O(1)$ 。

### 代码

```c++ title="做法一.cpp" {9-11}
class Solution {
public:
    int trap(vector<int>& height) {
        int ans = 0;
        int n = height.size();
        int pre_max[n], suf_max[n];
        pre_max[0] = height[0];
        suf_max[n-1] = height[n-1];
        for(int i = 1;i < n;i ++) pre_max[i] = max(height[i],pre_max[i-1]);
        for(int i = n-2;i >= 0;i --) suf_max[i] = max(height[i],suf_max[i+1]);
        for(int i = 0;i < n;i ++) ans += min(pre_max[i],suf_max[i]) - height[i];
        return ans;
    }
};
```

```c++ title="做法二.cpp" {9-17}
class Solution {
public:
    int trap(vector<int>& height) {
        int ans = 0;
        int l = 0, r = height.size() - 1;
        int pre_max = 0, suf_max = 0;
        // 这里 <= 或 < 均可，因为l, r 最终相遇的位置为最高点，该桶无雨水
        while(l <= r) {
            pre_max = max(pre_max,height[l]);
            suf_max = max(suf_max,height[r]);
            if(pre_max < suf_max) { // 可确定左侧接水量
                ans += pre_max - height[l];
                l++;
            } else { // 可确定右侧接水量
                ans += suf_max - height[r]; 
                r--;
            }
        }
        return ans;
    }
};
```

