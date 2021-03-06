---
layout: post
title: Vue 开发技巧
date: 2020-08-04
categories: [FrontEnd, Vue]
tags: [Vue]
thumbnail: /img/vue/thumbnail.png
---

记录一下开发中使用的 `vue` 技巧

<!-- more -->

## 路由参数解耦

一般在组件内使用路由参数, 大多数人会这样做:

``` js
export default {
  methods: {
    getParamsId () {
      return this.$route.params.id
    }
  }
}
```

在组件中使用 `$route` 会使之与其对应路由形成高度耦合, 从而使组件只能在某些特定的 `URL` 上使用, 限制了其灵活性.

正确的做法是通过 `props` 解耦

``` js
const router = new VueRouter({
  routes: [{
    path: '/user/:id',
    component: User,
    props: true
  }]
})
```

将路由的 `props` 属性设置为 `true` 后, 组件内可通过 `props` 接收到 `params` 参数

``` js
export default {
  props: ['id'],
  methods: {
    getParamsId () {
      return this.id
    }
  }
}
```

另外你还可以通过函数模式来返回 `props`

``` js
const router = new VueRouter({
  routes: [{
    path: '/user/:id',
    component: User,
    props: route => ({
      id: route.query.id
    })
  }]
})
```

文档: [路由组件传参 | Vue Router](https://router.vuejs.org/zh/guide/essentials/passing-props.html)

## 函数式组件

函数式组件是无状态, 它无法实例化, 没有任何的生命周期和方法. 创建函数式组件也很简单, 只需要在模板添加 `functional` 声明即可. 一般适合只依赖于外部数据的变化而变化的组件, 因其轻量, 渲染性能也会有所提高.

组件需要的一切都是通过 `context` 参数传递. 它是一个上下文对象, 具体属性查看文档. 这里 `props` 是一个包含所有绑定属性的对象.

> 函数式组件

``` html
<template functional>
  <div class="list">
    <div class="item" v-for="item in props.list" :key="item.id" @click="props.itemClick(item)">
      <p>{{item.title}}</p>
      <p>{{item.content}}</p>
    </div>
  </div>
</template>
```

> 父组件使用

``` html
<template>
  <div>
    <List :list="list" :itemClick="item => (currentItem = item)"></List>
  </div>
</template>
```

``` js
import List from '@/components/List.vue'
export default {
  components: {
    List
  },
  data () {
    return {
      list: [{
        title: 'title',
        content: 'content'
      }],
      currentItem: ''
    }
  }
}
```

文档: [函数式组件](https://cn.vuejs.org/v2/guide/render-function.html#%E5%87%BD%E6%95%B0%E5%BC%8F%E7%BB%84%E4%BB%B6)

## watch

### 触发 watch 监听执行多个方法

使用数组可以设置多项, 形式包括字符串、函数、对象

``` js
export default {
  data: {
    name: 'Joe'
  },
  watch: {
    name: [
      'sayName1',
      function (newVal, oldVal) {
        this.sayName2()
      },
      {
        handler: 'sayName3',
        immediate: true
      }
    ]
  },
  methods: {
    sayName1 () {
      console.log('sayName1==>', this.name)
    },
    sayName2 () {
      console.log('sayName2==>', this.name)
    },
    sayName3 () {
      console.log('sayName3==>', this.name)
    }
  }
}
```

### watch 监听多个变量

watch 本身无法监听多个变量. 但我们可以将需要监听的多个变量通过计算属性返回对象, 再监听这个对象来实现 "监听多个变量"

``` js
export default {
  data () {
    return {
      msg1: 'apple',
      msg2: 'banana'
    }
  },
  computed: {
    msgObj () {
      const {
        msg1,
        msg2
      } = this
      return {
        msg1,
        msg2
      }
    }
  },
  watch: {
    msgObj: {
      handler (newVal, oldVal) {
        if (newVal.msg1 != oldVal.msg1) {
          console.log('msg1 is change')
        }
        if (newVal.msg2 != oldVal.msg2) {
          console.log('msg2 is change')
        }
      },
      deep: true
    }
  }
}
```

文档: [watch](https://cn.vuejs.org/v2/api/#watch)

## 程序化的事件侦听器

比如, 在页面挂载时定义计时器, 需要在页面销毁时清除定时器. 这看起来没什么问题. 但仔细一看 `this.timer` 唯一的作用只是为了能够在 `beforeDestroy` 内取到计时器序号, 除此之外没有任何用处.

``` js
export default {
  mounted () {
    this.timer = setInterval(() => {
      console.log(Date.now())
    }, 1000)
  },
  beforeDestroy () {
    clearInterval(this.timer)
  }
}
```

如果可以的话最好只有生命周期钩子可以访问到它. 这并不算严重的问题, 但是它可以被视为杂物.

我们可以通过 `$on` 或 `$once` 监听页面生命周期销毁来解决这个问题:

``` js
export default {
  mounted () {
    this.createInterval('hello')
    this.createInterval('world')
  },
  createInterval (msg) {
    let timer = setInterval(() => {
      console.log(msg)
    }, 1000)
    this.$once('hook:beforeDestroy', function () {
      clearInterval(timer)
    })
  }
}
```

使用这个方法后, 即使我们同时创建多个计时器, 也不影响效果. 因为它们会在页面销毁后程序化的自主清除.

文档: [程序化的事件侦听器](https://cn.vuejs.org/v2/guide/components-edge-cases.html#%E7%A8%8B%E5%BA%8F%E5%8C%96%E7%9A%84%E4%BA%8B%E4%BB%B6%E4%BE%A6%E5%90%AC%E5%99%A8)
