---
title: forEach 会改变原数组值吗
date: 2018-05-26
categories: [FrontEnd, Js]
tags: [Js]
---

以前查 `forEach` 和 `map` 的区别时, 总能看到这样一句话:

> forEach() 方法不会返回执行结果, 而是 undefined. 也就是说, forEach() 会修改原来的数组. 而 map() 方法会得到一个新的数组并返回.

我的理解就是使用 `forEach` 遍历一个数组, 修改 `item` 的值, 就会改变原数组, 但最近发现并不一定会改变, 所以就做了一些测试

## 测试一

```js
let arr = [
  {
    a: 1,
    b: 2
  },
  {
    a: 3,
    b: 4
  }
]
arr.forEach(item => {
  item.a = 5
})

console.log(arr)
```

![](/img/js/025.png)

可以看到这样是可以修改原数组的值的

那试试 `map` 吧

```js
let arr1 = arr.map(item => {
  item.b = 5
  return item
})

console.log(arr1, arr)
```

![](/img/js/026.png)

咦? `arr` 这个原数组的值为什么也改变了呢?

[在网上搜了一下](https://segmentfault.com/q/1010000013170900?utm_source=index-hottest), 原来是上面的 `map` 方法不够 "纯粹", 实际上还是直接修改了每个 `item` 的属性, 要想不影响原有对象, 应该这么写:

```js
arr1 = arr.map(item => ({
  ...item,
  b: 6
}))

console.log(arr1, arr)
```

![](/img/js/027.png)

emmmm, 这样就不影响原数组了

## 测试二

上面的测试都是修改原数组中某一个对象的某一个属性, 那如果直接修改数组的某一个对象呢?

```js
arr.forEach(item => {
  item = 5
})

console.log(arr)
```

![](/img/js/028.png)

发现原数组并没有改变

那 `map` 呢?

```js
arr1 = arr.map(item => (item = 5))

console.log(arr1, arr)
```

![](/img/js/029.png)

发现原数组也没有改变

## 原理

不论是 `forEach` 还是 `map`, 所传入的 `item` 都是原数组所对应的对象的地址值, 当你修改 `item` 某一个属性后, 指向这个 `item` 对应的地址值的所有对象都会改变, 就会出现测试一的结果; 但如果你直接将 `item` 重新赋值, 那 `item` 就和原数组所对应的对象没有关系了, 不论你如何修改 `item`, 都不会影响原数组了

上面所说的都是数组中的每个值都是对象的情况, 也可以试试值不是对象的数组, 比如基本类型, 那这样是无论如何也不会修改原数组了, 因为基本类型并没有地址值这一说, 只是将值赋给 `item`, 他们之间并没有关联关系

```js
arr = [1, 'str', false, undefined, null]
arr.forEach(item => {
  item = 333
})

console.log(arr)
// [1, "str", false, undefined, null]
```

## 扩展

其实 `forEach` 和 `map` 的最大共同点就是都是函数, `item` 就相当于是形参, 我原来一直认为形参不会改变实参, 但其实并不是这样的, 类比上面结论可以得知:

- 如果实参是基本类型, 那确实改变不了实参;

- 如果实参是引用类型:

  	- 函数修改了形参的地址值或将其修改为基本类型, 改变不了实参

    - 函数没有修改形参的地址值, 只是修改形参内部的某些属性, 会改变实参
