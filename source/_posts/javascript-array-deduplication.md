---
title: JavaScript 数组去重
date: 2018-08-02
categories: [FrontEnd, Js]
tags: [Js]
---

数组去重, 一般都是在面试的时候才会碰到, 一般是要求手写数组去重方法的代码. 如果是被提问到, 数组去重的方法有哪些? 你能答出其中的 10 种, 面试官很有可能对你刮目相看.

在真实的项目中碰到的数组去重, 一般都是后台去处理, 很少让前端处理数组去重. 虽然日常项目用到的概率比较低, 但还是需要了解一下, 以防面试的时候可能回被问到.

本文是基于 [JavaScript 数组去重(12 种方法, 史上最全)](https://segmentfault.com/a/1190000016418021)的代码而进行的重度测试, 并加入自己的理解, 如有不对之处, 请不吝赐教.

## 测试数据

```js
var arr = [
  0,
  0,
  1,
  1,
  'true',
  'true',
  true,
  true,
  'false',
  'false',
  false,
  false,
  'undefined',
  'undefined',
  undefined,
  undefined,
  'null',
  'null',
  null,
  null,
  'NaN',
  'NaN',
  NaN,
  NaN,
  {},
  {},
  {
    a: 1
  },
  {
    b: 2
  },
  {
    a: 1,
    b: 2
  },
  [1, 2, 3],
  [1, 2, 3],
  [11, 2, 3],
  [1, 22, 3],
  function fun() {},
  function fun() {},
  function f() {},
  function fun() {
    return 1
  },
  function fun() {
    return 2
  }
]
```

## 一、利用 ES6 Set 去重(ES6 中最常用)

```js
function unique(arr) {
  return Array.from(new Set(arr))
}

console.log(unique(arr))
// (26) [0, 1, "true", true, "false", false, "undefined", undefined, "null", null, "NaN", NaN, {…}, {…}, {…}, {…}, {…}, Array(3), Array(3), Array(3), Array(3), ƒ, ƒ, ƒ, ƒ, ƒ]
```

不考虑兼容性, 这种去重的方法代码最少. 但这种方法无法 **去掉对象**.

## 二、利用 for 嵌套 for, 然后 splice 去重(ES5 中最常用)

```js
// ===
function unique(arr) {
  for (var i = 0; i < arr.length; i++) {
    for (var j = i + 1; j < arr.length; j++) {
      if (arr[i] === arr[j]) {
        // 第一个等同于第二个，splice 方法删除第二个
        arr.splice(j, 1)
        j--
      }
    }
  }
  return arr
}

console.log(unique(arr))
// (27) [0, 1, "true", true, "false", false, "undefined", undefined, "null", null, "NaN", NaN, NaN, {…}, {…}, {…}, {…}, {…}, Array(3), Array(3), Array(3), Array(3), ƒ, ƒ, ƒ, ƒ, ƒ]
// NaN 和 对象没有去重

// ==
function unique(arr) {
  for (var i = 0; i < arr.length; i++) {
    for (var j = i + 1; j < arr.length; j++) {
      if (arr[i] == arr[j]) {
        // 第一个等同于第二个，splice 方法删除第二个
        arr.splice(j, 1)
        j--
      }
    }
  }
  return arr
}

console.log(unique(arr))
// (24) [0, 1, "true", "false", "undefined", undefined, "null", "NaN", NaN, NaN, {…}, {…}, {…}, {…}, {…}, Array(3), Array(3), Array(3), Array(3), ƒ, ƒ, ƒ, ƒ, ƒ]
// 0 去掉 0 和 false, 1 去掉 1 和 true, undefined 去掉 undefined 和 null, NaN 和 对象没有去重
// 不建议使用 ==
```

双层循环, 外层循环元素, 内层循环时比较值. 值相同时, 则删去这个值.

**NaN 和 对象没有去重**

## 三、利用 indexOf 去重

```js
function unique(arr) {
  if (!Array.isArray(arr)) {
    console.log('type error!')
    return
  }
  var array = []
  for (var i = 0; i < arr.length; i++) {
    if (array.indexOf(arr[i]) === -1) {
      array.push(arr[i])
    }
  }
  return array
}

console.log(unique(arr))
// (27) [0, 1, "true", true, "false", false, "undefined", undefined, "null", null, "NaN", NaN, NaN, {…}, {…}, {…}, {…}, {…}, Array(3), Array(3), Array(3), Array(3), ƒ, ƒ, ƒ, ƒ, ƒ]
```

新建一个空的结果数组, for 循环原数组, 判断结果数组是否存在当前元素, 如果有相同的值则跳过, 不相同则 push 进数组.

在评论中看到下面代码, 感觉思路不错

`if(s.indexOf(s[i]) !== s.lastIndexOf(s[i]) && res.indexOf(s[i]) === -1) res.push(s[i])`

**NaN 和 对象没有去重**

## 四、利用 sort()

```js
function unique(arr) {
  if (!Array.isArray(arr)) {
    console.log('type error!')
    return
  }
  arr.sort()
  var array = [arr[0]]
  for (var i = 1; i < arr.length; i++) {
    if (arr[i] !== arr[i - 1]) {
      array.push(arr[i])
    }
  }
  return array
}


console.log(unique(arr))
// (29) [0, 1, Array(3), Array(3), Array(3), Array(3), NaN, "NaN", NaN, {…}, {…}, {…}, {…}, {…}, false, "false", false, ƒ, ƒ, ƒ, ƒ, ƒ, null, "null", true, "true", true, "undefined", undefined]
// arr.sort() ==> arr: (38) [0, 0, 1, 1, Array(3), Array(3), Array(3), Array(3), NaN, "NaN", "NaN", NaN, {…}, {…}, {…}, {…}, {…}, false, "false", "false", false, ƒ, ƒ, ƒ, ƒ, ƒ, null, null, "null", "null", true, "true", "true", true, "undefined", "undefined", undefined, undefined]
// 而且改变 arr 值的顺序会得到不同的结果
// var arr = [0, 1, 'true', true, 'false', false,'undefined', undefined, 'null', null, 'NaN', NaN, {}, [1, 2, 3], [11, 2, 3], [1, 22, 3], function fun () {}, function f () {}, function fun () {return 1}, 0, 1, 'true', true, 'false', false, 'undefined', undefined, 'null', null, 'NaN', NaN, {}, {a: 1}, {b: 2}, {a: 1, b: 2}, [1, 2, 3], function fun () {}, function fun () {return 2}];
// arr.sort() ==> arr: (38) [0, 0, 1, 1, Array(3), Array(3), Array(3), Array(3), "NaN", "NaN", NaN, NaN, {…}, {…}, {…}, {…}, {…}, "false", "false", false, false, ƒ, ƒ, ƒ, ƒ, ƒ, "null", null, "null", null, true, true, "true", "true", "undefined", "undefined", undefined, undefined]
// (29) [0, 1, Array(3), Array(3), Array(3), Array(3), "NaN", NaN, NaN, {…}, {…}, {…}, {…}, {…}, "false", false, ƒ, ƒ, ƒ, ƒ, ƒ, "null", null, "null", null, true, "true", "undefined", undefined]
```

利用 sort() 排序方法, 然后根据排序后的结果进行遍历及相邻元素比对.

**[sort()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/sort)** 方法用[原地算法](https://en.wikipedia.org/wiki/In-place_algorithm)对数组的元素进行排序，并返回数组。排序不一定是[稳定的](https://zh.wikipedia.org/wiki/%E6%8E%92%E5%BA%8F%E7%AE%97%E6%B3%95#.E7.A9.A9.E5.AE.9A.E6.80.A7)


由于本例数据类型很特殊, 导致排序出现无法估算的后果, sort 后 '字符串布尔值' 和 '布尔值' 顺序发生变化, 从而导致相邻元素类型不同

但如果数据结构简单或可以预估排序后是自己想要的结果, 可以根据排序后进行去重, 那么可以使用

**对象无法去重, 而且需要自己预估排序后的结果是否符合可以去重的结果**

## 五、利用对象的属性不能相同的特点进行去重

```js
function unique(arr) {
  if (!Array.isArray(arr)) {
    console.log('type error!')
    return
  }
  var array = []
  var obj = {}
  for (var i = 0; i < arr.length; i++) {
    if (!obj[arr[i]]) {
      array.push(arr[i])
      obj[arr[i]] = 1
    } else {
      obj[arr[i]]++
    }
  }
  console.log(obj)
  return array
}

console.log(unique(arr))
// {
//   0: 2
//   1: 2
//   1,2,3: 2
//   1,22,3: 1
//   11,2,3: 1
//   NaN: 4
//   [object Object]: 5
//   false: 4
//   function f () {}: 1
//   function fun () {return 1}: 1
//   function fun () {return 2}: 1
//   function fun () {}: 2
//   null: 4
//   true: 4
//   undefined: 4
// }
// (15) [0, 1, "true", "false", "undefined", "null", "NaN", {…} ==> {}, Array(3) ==> [1, 2, 3], Array(3) ==> [11, 2, 3], Array(3) ==> [1, 22, 3], ƒ ==> fun, ƒ ==> f, ƒ ==> fun, ƒ ==> fun]
```

**NaN 和 数组/函数 等对象去重了, 但所有 Object 等去重过度了**

**所有 '字符串类基本类型'(如 'true') 和 '基本类型'(如 true) 均去重了, 但也是去重过度**

这都是由于对象的 [] 的 key 只能是 string, 你传递其他类型的 key, 最后都转成了 string

## 六、利用 includes

```js
function unique(arr) {
  if (!Array.isArray(arr)) {
    console.log('type error!')
    return
  }
  var array = []
  for (var i = 0; i < arr.length; i++) {
    if (!array.includes(arr[i])) {
      // includes 检测数组是否有某个值
      array.push(arr[i])
    }
  }
  return array
}

console.log(unique(arr))
// (26) [0, 1, "true", true, "false", false, "undefined", undefined, "null", null, "NaN", NaN, {…}, {…}, {…}, {…}, {…}, Array(3), Array(3), Array(3), Array(3), ƒ, ƒ, ƒ, ƒ, ƒ]
```

**所有对象(包括数组/函数)均没有去重, 其余均正确去重**

## 七、利用 hasOwnProperty

```js
function unique(arr) {
  var obj = {}
  var a = []
  a = arr.filter(function(item, index, arr) {
    return obj.hasOwnProperty(typeof item + item) ? false : (obj[typeof item + item] = true)
  })
  console.log(obj)
  return a
  // 由于测试需要输出 obj, 才使用上面写法, 实际使用下面代码即可
  // var obj = {};
  // return arr.filter(function(item, index, arr){
  //   return obj.hasOwnProperty(typeof item + item) ? false : (obj[typeof item + item] = true)
  // })
}

console.log(unique(arr))
// obj: {
// booleanfalse: true
// booleantrue: true
// functionfunction f () {}: true
// functionfunction fun () {return 1}: true
// functionfunction fun () {return 2}: true
// functionfunction fun () {}: true
// number0: true
// number1: true
// numberNaN: true
// object1,2,3: true
// object1,22,3: true
// object11,2,3: true
// object[object Object]: true
// objectnull: true
// stringNaN: true
// stringfalse: true
// stringnull: true
// stringtrue: true
// stringundefined: true
// undefinedundefined: true
// }
// (20) [0, 1, "true", true, "false", false, "undefined", undefined, "null", null, "NaN", NaN, {…}, Array(3), Array(3), Array(3), ƒ, ƒ, ƒ, ƒ]
```

**NaN 和 数组/函数 等对象去重了, 但所有 Object 等去重过度了**

利用 hasOwnProperty 判断是否存在对象属性, 和利用对象的 [] 一样, 无法判断 Object, 过度去重

## 八、利用 filter

```js
function unique(arr) {
  return arr.filter(function(item, index, arr) {
    //当前元素，在原始数组中的第一个索引 == 当前索引值，否则返回当前元素
    return arr.indexOf(item, 0) === index
  })
}

console.log(unique(arr))
// (25) [0, 1, "true", true, "false", false, "undefined", undefined, "null", null, "NaN", {…}, {…}, {…}, {…}, {…}, Array(3), Array(3), Array(3), Array(3), ƒ, ƒ, ƒ, ƒ, ƒ]
```

**NaN 被去重了, 所有对象都没有去重**

## 九、利用递归去重

```js
function unique(arr) {
  var array = arr
  var len = array.length

  array.sort(function(a, b) {
    //排序后更加方便去重
    return a - b
  })

  function loop(index) {
    if (index >= 1) {
      if (array[index] === array[index - 1]) {
        array.splice(index, 1)
      }
      loop(index - 1) //递归loop，然后数组去重
    }
  }
  loop(len - 1)
  return array
}

console.log(unique(arr))
// (29) [null, 0, ƒ, ƒ, "true", Array(3), Array(3), "false", false, "undefined", ƒ, ƒ, "null", 0, null, "NaN", NaN, NaN, {…}, {…}, {…}, {…}, {…}, Array(3), Array(3), true, 1, ƒ, undefined]
// sort 后: arr: (38) [null, 0, ƒ ==> fun, ƒ ==> fun, "true", "true", Array(3) ==> [1, 22, 3], Array(3) ==> [11, 2, 3], "false", "false", false, false, "undefined", "undefined", ƒ ==> fun, ƒ ==> fun, "null", "null", 0, null, "NaN", "NaN", NaN, NaN, {…} ==> {}, {…} ==> {}, {…} ==> {a: 1}, {…} ==> {b: 2}, {…} ==> {a: 1, b: 2}, Array(3) ==> [1, 2, 3], Array(3) ==> [1, 2, 3], true, true, 1, 1, ƒ ==> f, undefined, undefined]
```

和第四点类似, 都是先排序再去重, 但由于排序并不稳定, 导致这种方法并不可靠. 此例中排序由于使用 `-` 来排序, 会进行类型隐式转换

## 十、利用 Map 数据结构去重

```js
function unique(arr) {
  let map = new Map()
  let array = new Array() // 数组用于返回结果
  for (let i = 0; i < arr.length; i++) {
    if (map.has(arr[i])) {
      // 如果有该 key 值
      map.set(arr[i], true)
    } else {
      map.set(arr[i], false) // 如果没有该 key 值
      array.push(arr[i])
    }
  }
  console.log(map)
  return array
}

console.log(unique(arr))
// Map(26){
// 0: {0 => true}
// 1: {1 => true}
// 2: {"true" => true}
// 3: {true => true}
// 4: {"false" => true}
// 5: {false => true}
// 6: {"undefined" => true}
// 7: {undefined => true}
// 8: {"null" => true}
// 9: {null => true}
// 10: {"NaN" => true}
// 11: {NaN => true}
// 12: {Object => false}
// 13: {Object => false}
// 14: {Object => false}
// 15: {Object => false}
// 16: {Object => false}
// 17: {Array(3) => false}
// 18: {Array(3) => false}
// 19: {Array(3) => false}
// 20: {Array(3) => false}
// 21: {function fun () {} => false}
// 22: {function fun () {} => false}
// 23: {function f () {} => false}
// 24: {function fun () {return 1} => false}
// 25: {function fun () {return 2} => false}
// }
// (26) [0, 1, "true", true, "false", false, "undefined", undefined, "null", null, "NaN", NaN, {…}, {…}, {…}, {…}, {…}, Array(3), Array(3), Array(3), Array(3), ƒ, ƒ, ƒ, ƒ, ƒ]
```

创建一个空 Map 数据结构, 遍历需要去重的数组, 把数组的每一个元素作为 key 存到 Map 中. 由于 Map 中不会出现相同的 key 值, 所以最终得到的就是去重后的结果.

但由于对象保存的是引用地址值, 在咱们看来是相同的对象, 程序却根据引用值判断并不相同, 从而不会去重

**所有对象(包括数组/函数)均没有去重, 其余均正确去重**

## 十一、利用 reduce+includes

```js
function unique(arr) {
  return arr.reduce((prev, cur) => (prev.includes(cur) ? prev : [...prev, cur]), [])
}

console.log(unique(arr))
// (26) [0, 1, "true", true, "false", false, "undefined", undefined, "null", null, "NaN", NaN, {…}, {…}, {…}, {…}, {…}, Array(3), Array(3), Array(3), Array(3), ƒ, ƒ, ƒ, ƒ, ƒ]
```

原理和六一样, 只不过比六代码量少

## 十二、[...new Set(arr)]

```js
console.log([...new Set(arr)])
// (26) [0, 1, "true", true, "false", false, "undefined", undefined, "null", null, "NaN", NaN, {…}, {…}, {…}, {…}, {…}, Array(3), Array(3), Array(3), Array(3), ƒ, ƒ, ƒ, ƒ, ƒ]
```

代码就是这么少. 其实, 严格来说并不算是一种, 相对于第一种方法来说只是简化了代码

## 十三、根据类型去重

```js
function unique(arr) {
  let newArr = []
  let obj = {}
  arr.forEach(item => {
    if (typeof item !== 'object') {
      if (newArr.indexOf(item) === -1) {
        newArr.push(item)
      }
    } else {
      let str = JSON.stringify(item)
      if (!obj[str]) {
        newArr.push(item)
        obj[str] = 1
      }
    }
  })
  return newArr
}

console.log(unique(arr))
// (25) [0, 1, "true", true, "false", false, "undefined", undefined, "null", null, "NaN", NaN, NaN, {…}, {…}, {…}, {…}, Array(3), Array(3), Array(3), ƒ, ƒ, ƒ, ƒ, ƒ]
```

**对象/数组去重成功, 但函数并没有去重, typeof 判断类型还是差一点**

如果数组里都是 对象/数组, 那么可以使用下面方法

```js
var strArr = arr.map(item => JSON.stringify(item))
var uniqueStrArr = [...new Set(strArr)]
var uniqueArr = uniqueStrArr.map(item => JSON.parse(item))
```
