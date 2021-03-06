---
layout: post
title: JavaScript toFixed() 方法
date: 2017-07-20
categories: [FrontEnd, Js]
tags: [Js]
---

简单介绍一下 `JavaScript toFixed()` 方法和使用中的问题

## 定义和用法

`toFixed()` 方法可把 `Number` 四舍五入为指定小数位数的数字, 如果是整数的话会在小数点后面补齐 `0`

## 语法

`NumberObject.toFixed(num)`

## 参数 描述

|    参数    | 描述                                                                                                                        |
| :--------: | :-------------------------------------------------------------------------------------------------------------------------- |
| `num` 必需 | 规定小数的位数, 是 `0` ~ `20` 之间的值, 包括 `0` 和 `20` , 有些实现可以支持更大的数值范围. 如果省略了该参数, 将用 `0` 代替. |

## 返回值

返回 `NumberObject` 的字符串表示, 不采用指数计数法, 小数点后有固定的 `num` 位数字. 如果必要, 该数字会被舍入, 也可以用 `0` 补足, 以便它达到指定的长度. 如果 `num` 大于 `le+21` , 则该方法只调用 `NumberObject.toString()` , 返回采用指数计数法表示的字符串.

## 问题

### 整数如何直接调用

```js
var num = 12
alert(num.toFixed(4))
// 可以正常弹出
```

```js
alert(12. toFixed(4))
// 不可以弹出
// 报错：Uncaught SyntaxError: Invalid or unexpected token
// 原因：认为 12 后面的点是小数点
```

```js
//修改
alert((12).toFixed(4))
// 可以正常弹出
// 原因：将 12 括起来, 让其认为是一个完整的数值
```

### 精度问题

例子:

```JS
1.35.toFixed(1) // 1.4 正确
1.335.toFixed(2) // 1.33  错误
1.3335.toFixed(3) // 1.333 错误
1.33335.toFixed(4) // 1.3334 正确
1.333335.toFixed(5) // 1.33333 错误
1.3333335.toFixed(6) // 1.333333 错误
```

关于这个的原因可以看看网上大佬的分析: [为什么(2.55).toFixed(1)等于 2.5? - 知乎](https://zhuanlan.zhihu.com/p/31202697)

解决方法也有很多, 主要就是判断保留指定位数的最后一位小数是否是 `5`

> 第一种修复方式: 判断最后一位小数为 5 的, 改成 6, 再调用 toFixed. 例如 1.335(调用 toFixed(2) 结果为 1.33)先修改为 1.336, 在调用 toFixed(2) , 得到的结果是 1.34, 符合预期.

> 第二种修复方式: 将数字先进行放大指定倍数, 使最后一位小数显示成个位数, 然后加上一个 0.5 后, 使最后一位进位(如果最后一位大于等于 5), 再调用 parsInt() 去尾并缩小相同倍数. 例如 1.335 放大 100 倍后是 133.5, 加上 0.5 后是 134.0, 调用 parseInt() 得到 134, 再缩小 100 倍得到 1.34, 结果符合预期.

> 第三种修复方式: 在调用 toFixed() 方法前, 先给数字补一个极小值, 然后再调用 toFixed() 方法. 例如 1.335 加上一个极小值(0.00000001)后是 1.33500001, 然后调用 toFixed(2)得到 1.34, 结果符合预期. 这个极小值只要不影响最后结果, 可以根据要保留的小数位数决定取多少, 但也不能太小了(例如 1.3350000001.toFixed(2) 结果是 1.34, 而 1.33500000000000001.toFixed(2) 结果是 1.33).

这里就推荐下面这种吧

```JS
/**
 * @description: 解决 toFixed 精度问题
 * @param {Number} number 待格式化的数字
 * @param {Number} digits 小数位数
 * @param {Boolean} flag 整数时是否用 0 补齐小数位数, 默认 true
 * @return {Number} 格式化后的数字
 */
function toFixed (number, digits, flag = true) {
  number = +number
  digits = +digits
  if (digits > 20 || digits < 0) {
    throw new RangeError('toFixed() digits argument must be between 0 and 20')
  }
  if (isNaN(number) || number >= Math.pow(10, 21)) {
    return number.toString()
  }
  if (typeof digits === 'undefined' || digits === 0) {
    return Math.round(number).toString()
  }

  let result = number.toString()
  const arr = result.split('.')

  // 整数的情况
  if (arr.length < 2) {
    return `${result}${flag ? `.${new Array(digits).fill(0).join('')}` : ''}`
  }

  const [integer, decimal] = arr
  if (decimal.length === digits) {
    return result
  }

  if (decimal.length < digits) {
    return `${result}${flag ? `.${new Array(digits - decimal.length).fill(0).join('')}` : ''}`
  }

  result = integer + '.' + decimal.substr(0, digits)
  const last = decimal.substr(digits, 1)
  // 四舍五入，转换为整数再处理，避免浮点数精度的损失
  if (parseInt(last, 10) >= 5) {
    const x = Math.pow(10, digits)
    result = (Math.round(parseFloat(result) * x) + (integer >= 0 ? 1 : -1)) / x
    result = result.toFixed(digits)
  }

  return result
}
```

参考资料:

- [js 中 toFixed 精度问题的解决办法 - 简书](https://www.jianshu.com/p/849b0ae36b36)
- [JavaScript 中 Number.prototype.toFixed 方法五舍六入的问题 - whinc 的个人空间 - OSCHINA](https://my.oschina.net/u/1756807/blog/777893)
