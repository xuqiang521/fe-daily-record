## 一、冒泡排序

### 1.1、算法步骤

1. 比较相邻的元素。如果第一个比第二个大，就交换他们两个。
2. 对每一对相邻元素作同样的工作，从开始第一对到结尾的最后一对。这步做完后，最后的元素会是最大的数。
3. 针对所有的元素重复以上的步骤，除了最后一个。
4. 持续每次对越来越少的元素重复上面的步骤，直到没有任何一对数字需要比较。

### 1.2、动图演示

![](https://user-images.githubusercontent.com/17243165/28749710-5213c280-7503-11e7-977e-7c0616e3b582.gif)

### 1.3、代码实现

```javascript
function bubbleSort (arr) {
  let len = arr.length
  for (let i = 0; i < len - 1; i++) {
    for (let j = 0; j < len - 1 - i; j++) {
      if (arr[j] > arr[j + 1]) { // 相邻元素两两比较
        let temp = arr[j + 1]  // 元素交换
        arr[j + 1] = arr[j]
        arr[j] = temp
      }
    }
  }
  return arr
}
let arr = [1, 3, 2, 7, 5, 6]
console.log(bubbleSort(arr))
// [1, 2, 3, 5, 6, 7]
```

## 二、选择排序

**选择排序是一种简单直观的排序算法，无论什么数据进去都是O(n²)的时间复杂度。所以用到它时，数据规模越小越好。**

### 2.1、算法步骤

1. 首先在未排序序列中找到最小（大）元素，存放在排序序列的起始位置
2. 再从剩余未排序元素中继续找最小（大）元素，然后放到已排列序列的末尾
3. 重复第二步，直到所有元素均排序完毕

### 2.2、动图演示

![](https://user-images.githubusercontent.com/17243165/28749720-90304278-7503-11e7-9bc8-e3b56539d8bf.gif)

### 2.3、代码实现

```javascript
function selectionSort (arr) {
  let len = arr.length, minIndex, temp
  for (let i = 0; i < len; i++) {
    minIndex = i
    for (let j = i + 1; j < len; j++) {
      if (arr[j] < arr[minIndex]) { // 找最小的数
        minIndex = j // 将最小的数保存
      }
    }
    temp = arr[i]
    arr[i] = arr[minIndex]
    arr[minIndex] = temp
  }
  return arr
}
let arr = [1, 3, 2, 7, 5, 6]
console.log(selectionSort(arr))
// [1, 2, 3, 5, 6, 7]
```

## 三、插入排序

**插入排序是一种最简单直观的排序算法，它的工作原理是通过构建有序序列，对于末排序数据，在已排序序列中从后往前进行扫描，找到相应位置并插入**

插入排序和冒泡排序一样，也有一种优化算法，叫拆半插入

### 3.1、算法步骤

1. 将第一待排序序列第一个元素看做一个有序序列，把第二个元素到最后一个元素当成未排序序列
2. 从头到尾依次扫描未排序序列，将扫描到的每个元素插入有序序列的适当位置（如果待插入的元素与有序序列中的某个元素相等，则将待插入元素插入到相等元素的后面）

### 3.2、动图演示

![](https://user-images.githubusercontent.com/17243165/28749729-ca072084-7503-11e7-881c-92aa915ce369.gif)

### 3.3、代码实现

```javascript
function insertionSort (arr) {
  let len = arr.length, prevIndex, current
  for (let i = 1; i < len; i++) {
    prevIndex = i - 1
    current = arr[i]
    while (prevIndex >=0 && arr[prevIndex] > current) {
      arr[prevIndex + 1] = arr[prevIndex]
      prevIndex--
    }
    arr[prevIndex + 1] = current
  }
  return arr
}
let arr = [1, 3, 2, 7, 5, 6]
console.log(insertionSort(arr))
// [1, 2, 3, 5, 6, 7]
```

## 四、希尔排序

**希尔排序，也称递减增量排序算法，是插入排序的一种更高效的改进版本。但希尔排序是非稳定排序算法**

希尔排序是基于插入排序的以下两点性质而提出改进方法的：

- 插入排序在对几乎已经排好序的数据操作时，效率高，即可达到线性排序的效率
- 但插入排序一般来说是低效的，因为插入排序每次只能讲数据移动一位

希尔排序的基本思想是：先将整个待排序的记录序列分割成若干长度为 m 的子序列，分别对各字表进行直接插入排序。仅增量因子为 1 时，整个序列作为一个表来处理，表长度即为整个序列的长度

### 4.1、算法步骤
1. 选择一个增量序列 t1, t2, ..., tk, 其中 t1 > tj, tk = 1
2. 按增量序列个数 k, 对序列进行 k 趟排序
3. 每趟排序，根据对应的增量 ti, 将待排序序列分割成若干长度为 m 的子序列, 分别对各字表进行直接插入排序。仅增量因子为 1 时，整个序列作为一个表来处理，表长度即为整个序列的长度

### 4.2、代码实现

```javascript
function shellSort (arr) {
  let len = arr.length, temp, gap = 1
  while(gap < len/3) { // 动态定义间隔序列
    gap = gap * 3 + 1
  }
  for (gap; gap > 0; gap = Math.floor(gap/3)) {
    for (let i = gap; i < len; i++) {
      temp = arr[i]
      let j
      for (j = i - gap; j >= 0 && arr[j] > temp; j -= gap) {
        arr[j + gap] = arr[j]
      }
      arr[j + gap] = temp
    }
  }
  return arr
}
let arr = [1, 3, 2, 7, 5, 6]
console.log(shellSort(arr))
// [1, 2, 3, 5, 6, 7]
```