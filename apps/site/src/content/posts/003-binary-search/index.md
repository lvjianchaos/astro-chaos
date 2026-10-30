---
title: "灵神算法基础|二分查找"
description: "三种写法，四种情况。"
pubDatetime: 2026-10-30T10:30:00+08:00
series: 灵神|基础算法精讲
tags: [来源:leetcode, lt:中等, 二分查找, 红蓝染色法]
---



## 引入

![暴力做法](https://gcore.jsdelivr.net/gh/lvjianchaos/image-host@main/io/post/003-binary-search/01-brute-force.webp)

暴力做法的**时间复杂度**为 $O(n)$。并没有利用到数组的**有序**特性，而这正是优化的着手点。

![二分查找-闭区间](https://gcore.jsdelivr.net/gh/lvjianchaos/image-host@main/io/post/003-binary-search/02-solution.webp)

**取中间，可以立即知道数组中一半元素与目标值之间的大小关系，故而最合适。**

若区间里有偶数个数，可以取左边的数， $\lfloor \frac{L+R}{2} \rfloor$ ；但如 Java、C 这类语言， $L+R$ 可能会溢出，可以先相减再相加，即 $L+(R-L)/2$。

关于 $L$ 更新为 $M+1$ 而非 $M$。因为我们选择采用**闭区间**进行处理（闭区间里都是还没确定关系的数），若改为 $M$ 那就是左开右闭区间，导致死循环。

![L移动](https://gcore.jsdelivr.net/gh/lvjianchaos/image-host@main/io/post/003-binary-search/03-step-1.webp)

![R移动](https://gcore.jsdelivr.net/gh/lvjianchaos/image-host@main/io/post/003-binary-search/04-step-2.webp)

对于所有元素都比 8 要小的情况， $L$会不断向右移动，最后移动的 $R$ 的右侧，也就是下标 $n$ 的位置，所以 $L$ 是等于数组长度的。

### 代码

```c++ collapse={5-20,24-39,43-58} {7-9,26-28,45-47}
// lower_bound 返回最小的满足 nums[i] >= target 的下标 i
// 如果数组为空，或者所有数都 < target，则返回 nums.size()
// 要求 nums 是非递减的，即 nums[i] <= nums[i + 1]
int lower_bound(vector<int>& nums, int target) {
    int left = 0, right = (int) nums.size() - 1; // 闭区间 [left, right]
    while (left <= right) { // 区间不为空
        // 循环不变量：
        // nums[left-1] < target
        // nums[right+1] >= target
        int mid = left + (right - left) / 2;
        if (nums[mid] >= target) {
            right = mid - 1; // 范围缩小到 [left, mid-1]
        } else {
            left = mid + 1; // 范围缩小到 [mid+1, right]
        }
    }
    // 循环结束后 left = right+1
    // 此时 nums[left-1] < target 而 nums[left] = nums[right+1] >= target
    // 所以 left 或 right+1 就是第一个 >= target 的元素下标
    return left;
}

int lower_bound2(vector<int>& nums, int target) {
    int left = 0, right = (int) nums.size(); // 左闭右开区间 [left, right)
    while (left < right) { // 区间不为空
        // 循环不变量：
        // nums[left-1] < target
        // nums[right] >= target
        int mid = left + (right - left) / 2;
        if (nums[mid] >= target) {
            right = mid; // 范围缩小到 [left, mid)
        } else {
            left = mid + 1; // 范围缩小到 [mid+1, right)
        }
    }
    // 循环结束后 left = right
    // 此时 nums[left-1] < target 而 nums[left] = nums[right] >= target
    // 所以 left/right 就是第一个 >= target 的元素下标
    return left;
}

int lower_bound3(vector<int>& nums, int target) {
    int left = -1, right = (int) nums.size(); // 开区间 (left, right)
    while (left + 1 < right) { // 区间不为空
        // 循环不变量：
        // nums[left] < target
        // nums[right] >= target
        int mid = left + (right - left) / 2;
        if (nums[mid] >= target) {
            right = mid; // 范围缩小到 (left, mid)
        } else {
            left = mid; // 范围缩小到 (mid, right)
        }
    }
    // 循环结束后 left + 1 = right
    // 此时 nums[left] < target 而 nums[right] >= target
    // 所以 right 就是第一个 >= target 的元素下标
    return right;
}
```

### 二分查找常用转化表（非递减数组 nums，长度 n）

> lowerBound(nums, x)：**≥x 的第一个元素下标**；不存在时返回 `n`

| 需求                    | 写法                      | 不存在时返回值 |
| ----------------------- | ------------------------- | -------------- |
| ≥x 的第一个整数的下标   | lowerBound(nums, x)       | n              |
| >x 的第一个整数的下标   | lowerBound(nums, x+1)     | n              |
| <x 的最后一个整数的下标 | lowerBound(nums, x) − 1   | −1             |
| ≤x 的最后一个整数的下标 | lowerBound(nums, x+1) − 1 | −1             |

| 需求                      | 写法                                        |
| ------------------------- | ------------------------------------------- |
| <x 的整数个数             | lowerBound(nums, x)                         |
| ≤x 的整数个数             | lowerBound(nums, x+1)                       |
| ≥x 的整数个数             | n − lowerBound(nums, x)                     |
| >x 的整数个数             | n − lowerBound(nums, x+1)                   |
| =x 的整数个数             | lowerBound(nums, x+1) − lowerBound(nums, x) |
| [L, R] 闭区间内的整数个数 | lowerBound(nums, R+1) − lowerBound(nums, L) |

> 补充：
>
> 1. `<x` 和 `≥x` 互为补集，元素个数之和为 `n`
> 2. `≤x` 和 `>x` 互为补集，元素个数之和为 `n`

## 在排序数组中查找元素的第一个和最后一个位置

> [34. 在排序数组中查找元素的第一个和最后一个位置](https://leetcode.cn/problems/find-first-and-last-position-of-element-in-sorted-array/)

### 题意

给定一个按照非递减顺序排列的整数数组 `nums`，和一个目标值 `target`。找出给定目标值在数组中的开始位置和结束位置。若不存在，返回 `[-1,-1]`。

### 思路

题目要求求出开始位置与结束位置，那也就是 $\ge$ 和 $\le$ 。

### 代码

```c++ collapse={6-19}
class Solution {
    // lower_bound 返回最小的满足 nums[i] >= target 的下标 i
    // 如果数组为空，或者所有数都 < target，则返回 nums.size()
    // 要求 nums 是非递减的，即 nums[i] <= nums[i + 1]
    int lower_bound(vector<int>& nums, int target) {
        int left = 0;
        int right = nums.size() - 1; // 闭区间 [left, right]
        while(left <= right) { // 区间不为空
            // 循环不变量：
            // nums[left-1] < target
            // nums[right+1] >= target
            int mid = left+(right-left)/2;
            if(nums[mid] >= target) right = mid-1; // 范围缩小到 [left, mid-1]
            else left = mid+1; // 范围缩小到 [mid+1, right]
        }
        // 循环结束后 left = right + 1
        // 此时 nums[left-1] < target 而 nums[left] = nums[right+1] >= target
        // 所以 left 就是第一个 >= target 的元素下标
        return left;
    }
public:
    vector<int> searchRange(vector<int>& nums, int target) {
        int start = lower_bound(nums,target);
        // nums 中无 target
        if(start == nums.size() || nums[start] != target) return {-1,-1};
        // 若 start 存在，end 一定存在
        int end = lower_bound(nums,target+1)-1;
        return {start,end};
    }
};
```

- **时间复杂度**：取决于 `lower_bound()`，每次去掉一半元素，$logn$ 次减成空，也就是 $O(logn)$；
- **空间复杂度**：$O(1)$。

`lower_bound()` 函数其他写法可参考 [[#代码]]，这里附**库函数写法**：

```c++ title="写法一" collapse={13-17}
class Solution {
public:
    vector<int> searchRange(vector<int>& nums, int target) {
        // 也可以用 equal_range，见【C++ 写法二】
        int start = ranges::lower_bound(nums, target) - nums.begin();
        if (start == nums.size() || nums[start] != target) {
            return {-1, -1};
        }
        int end = ranges::upper_bound(nums, target) - nums.begin() - 1;
        return {start, end};
    }
};

// 作者：灵茶山艾府
// 链接：https://leetcode.cn/problems/find-first-and-last-position-of-element-in-sorted-array/solutions/1980196/er-fen-cha-zhao-zong-shi-xie-bu-dui-yi-g-t9l9/
// 来源：力扣（LeetCode）
// 著作权归作者所有。商业转载请联系作者获得授权，非商业转载请注明出处。
```

```c++ title="写法二" collapse={11-15}
class Solution {
public:
    vector<int> searchRange(vector<int>& nums, int target) {
        auto [start, end] = ranges::equal_range(nums, target);
        if (start == end) {
            return {-1, -1};
        }
        return {(int) (start - nums.begin()), (int) (end - nums.begin() - 1)};
    }
};

作者：灵茶山艾府
链接：https://leetcode.cn/problems/find-first-and-last-position-of-element-in-sorted-array/solutions/1980196/er-fen-cha-zhao-zong-shi-xie-bu-dui-yi-g-t9l9/
来源：力扣（LeetCode）
著作权归作者所有。商业转载请联系作者获得授权，非商业转载请注明出处。
```



---

## 寻找峰值

> [162. 寻找峰值](https://leetcode.cn/problems/find-peak-element/) 

### 题意

给定一整型数组，找到峰顶并返回其下标。

### 思路

由于 $nums[-1]=nums[n]=-∞$，所以数组一定有峰值。

尽管可能有多个峰顶，但题目只要求返回其中一个的下标。

**当 $i<n-1$， 且 $nums[i] ≠ nums[i+1]$，那么 $nums[i]<nums[i+1]$ ，则表明 $[i+1,n-1]$ 中一定存在峰值；同理可得，$nums[i] > nums[i+1]$，$[0,i]$ 一定存在峰值。所以可通过比较 $nums[i]$ 和 $nums[i+1]$ 的大小关系，二分找到峰值。**

#### **定义二分（我选择闭区间写法）**

**循环不变量：**

- 闭区间 $[l,r]$ 内：**没确定峰值归属、关系未知**的下标
- 区间外：
  - $[0,l)$：已经确定，全在峰值的左边，我们要找的峰值一定不在这段；
  - $(r,n-1]$：已经确定，包含峰值的位置。最终的 $r+1$ 就是峰值也就是 $l$。

每一轮二分，就是通过 `mid` 的比较结果，排除掉一部分待排查区间，维护上面这个不变量。

每次取 `mid = l + (r-l)/2`，比较 `nums[mid]` 和 `nums[mid+1]`：

1. **`nums[mid] < nums[mid+1]`** 

   根据定理：峰值一定在 $[mid+1, n-1]$。 

   说明 mid 本身以及 mid 左边都不可能是峰值，直接把 `l = mid + 1`。 

   效果：把 mid 划入左侧排除区 $[0,l)$，缩小待查区间。

2. **`nums[mid] > nums[mid+1]`** 

   根据定理：峰值一定在 $[0, mid]$。 

   说明峰值不在 $[mid+1, n-1]$，mid+1 及右侧（除 mid 外）可以排除，`r = mid - 1`。 

   效果：把 mid 右侧划入 $(r, n-1]$ 的候选区，缩小待查区间。

循环条件：`while(l <= r)`，也就是闭区间 $[l,r]$ 非空时继续循环。 当循环退出时，满足：$l > r$，此时闭区间 $[l,r]$ 为空，没有待排查元素了。

再回看不变量：峰值一定在 $(r, n-1]$； 现在 $l>r$，$(r, n-1]$ 的左边界刚好就是 $l$，所以峰值下标就是 `l`。

### 代码

```c++ title="闭区间写法" collapse={4-9}
class Solution {
public:
    int findPeakElement(vector<int>& nums) {
        // 区间外：[0,l) 峰顶左侧 (r,n-1] 峰顶及峰顶右侧
        // 由于性质：nums[i] != nums[i + 1]，只存在两种情况：
        // 1. nums[mid] < nums[mid+1] -> mid=峰顶左侧 l移动到mid+1
        // 2. nums[mid] > nums[mid+1] -> mid=峰顶或峰顶右侧 r移动到mid-1
        // 由于 n-1 要么是峰顶要么在峰顶右侧，是已确定的关系，在右指针的右侧范围，所以右指针定义 n-2
        // 当整个数组单调递增时，n-1 就是峰值，也是最后 l 会跳到的位置
        int l = 0,r = nums.size() - 2; // 闭区间 [l, r] 都是关系未知的元素
        while(l <= r) {
            int mid = l + (r-l)/2;
            if(nums[mid] < nums[mid+1]) l = mid+1;
            else r = mid-1;
        }
        // 峰值下标就是 r+1 = l
        return l;
    }
};
```

```c++ title="开区间写法" collapse={16-20}
class Solution {
public:
    int findPeakElement(vector<int>& nums) {
        int left = -1, right = nums.size() - 1; // 开区间 (-1, n-1)
        while (left + 1 < right) { // 开区间不为空
            int mid = left + (right - left) / 2;
            if (nums[mid] > nums[mid + 1]) { // 峰顶位置 <= mid
                right = mid;
            } else { // 峰顶位置 > mid
                left = mid;
            }
        }
        return right;
    }
};

作者：灵茶山艾府
链接：https://leetcode.cn/problems/find-peak-element/solutions/1987497/by-endlesscheng-9ass/
来源：力扣（LeetCode）
著作权归作者所有。商业转载请联系作者获得授权，非商业转载请注明出处。
```

- **时间复杂度**：$O(log\ n)$
- **空间复杂度**：$O(1)$ 

## 寻找旋转排序数组中的最小值

> [153. 寻找旋转排序数组中的最小值](https://leetcode.cn/problems/find-minimum-in-rotated-sorted-array/)

### 题意

原本严格升序、元素互不相同的数组经过多次旋转，得到输入数组，要求找出数组最小值。

### 思路

假设 $x=nums[mid]$ 是现在二分取到的数。

关键在于，判断 $x$ 与数组最小值的位置关系。

把 `x` 与最后一个数 `nums[n−1]` 比大小：

- 如果  $x > nums[n−1]$
  - nums 一定被分成左右两个递增段；
  - 第一段的所有元素均大于第二段的所有元素；
  - x 在第一段；
  - 最小值在第二段；
  - 所以 x 一定在最小值的左边。
- 如果 $x ≤ nums[n−1]$
  - x 一定在第二段（或者 nums 就是递增数组，此时只有一段）；
  - x 要么是最小值，要么在最小值右边。

所以，**只需要比较 `x` 和 `nums[n−1]` 的大小关系，就间接地知道了 `x` 和数组最小值的位置关系，从而不断地缩小数组最小值所在位置的范围，二分找到数组最小值**。

### 代码

```c++ title="闭区间写法"
class Solution {
public:
    int findMin(vector<int>& nums) {
        int n = nums.size();
        int l = 0, r = n - 2;
        while(l <= r) {
            int mid = l + (r-l)/2; 
            if(nums[mid] > nums[n-1]) l = mid + 1; 
            else r = mid - 1; 
        }
        return nums[l];
    }
};
```

```c++ title="开区间写法" collapse={12-16}
class Solution {
public:
    int findMin(vector<int>& nums) {
        int left = -1, right = nums.size() - 1; // 开区间 (-1, n-1)
        while (left + 1 < right) { // 开区间不为空
            int mid = left + (right - left) / 2;
            (nums[mid] < nums.back() ? right : left) = mid;
        }
        return nums[right];
    }
};

作者：灵茶山艾府
链接：https://leetcode.cn/problems/find-minimum-in-rotated-sorted-array/solutions/1987499/by-endlesscheng-owgd/
来源：力扣（LeetCode）
著作权归作者所有。商业转载请联系作者获得授权，非商业转载请注明出处。
```

## 搜索旋转排序数组

> [33. 搜索旋转排序数组](https://leetcode.cn/problems/search-in-rotated-sorted-array/)

### 题意

### 思路

### 代码