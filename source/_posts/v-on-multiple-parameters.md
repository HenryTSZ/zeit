---
layout: post
title: 关于父组件通过 v-on 接收子组件多个参数的一点研究
date: 2020-06-20
categories: [FrontEnd, Vue]
tags: [Vue]
thumbnail: /img/vue/thumbnail.png
---

写组件的时候遇到一个需求, 我需要在子组件向父组件传递信息

```js
this.$emit('myEvent', '信息1', '信息2')
```

在父组件使用 v-on 来接收

```html
<my-component @myEvent="handler" />
```

这样就可以接收到子组件传递的 `信息1` 和 `信息2` , easy.

```js
handler(param1, param2) {
  console.log(param1, param2) // => 信息1, 信息2
}
```

但我需要在内联语句中传递一个额外参数, 平时子组件只附带一个参数的时候, 可以使用 `$event`

```html
<my-component @myEvent="handler('extra parameter', $event)" />
```

但是[\$event](https://cn.vuejs.org/v2/guide/components.html#%E4%BD%BF%E7%94%A8%E4%BA%8B%E4%BB%B6%E6%8A%9B%E5%87%BA%E4%B8%80%E4%B8%AA%E5%80%BC)只接收第一个参数, 也就是这么写只能接收到 `信息1`

```js
handler(extra, param1, param2) {
  console.log(extra, param1, param2) // => 'extra parameter', 信息1, undefined
}
```

可以使用 `arguments`:

```html
<my-component @myEvent="handler('extra parameter', arguments[0], arguments[1])" />
```

可以获取到参数了

```js
handler(extra, param1, param2) {
  console.log(extra, param1, param2) // => 'extra parameter', 信息1, 信息2
}
```

因为实际上这里的 `$event` 就是 `arguments[0]` , 下面这一段现在的 `vue` 文档上好像已经找不到了, 但是 `arguments` 还是可以用的

![arguments](/img/vue/017.png)

由于官方已经不推荐这种写法了, 所以我们可以用另一种方法:

```html
<my-component @myEvent="(param1, param2) => handler('extra parameter', param1, param2)" />
```

先接收参数, 再整合参数调用方法
