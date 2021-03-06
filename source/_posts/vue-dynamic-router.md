---
title: Vue 动态路由
date: 2020-02-08
categories: [FrontEnd, Vue]
tags: [Vue]
thumbnail: /img/vue/thumbnail.png
---

现在很多人还是在默默的一个个功能页去配置管理路由, 目录管理 -> 导入`.vue` 文件 -> 路由配置 -> 页面上应用. 当应用越来越大, 这一套流程的管理会变得越来越繁杂和臃肿. 修改起来也特别麻烦.

<!-- more -->

假如某文件夹下的目录能自动生成对应路由那就方便多了. 即假如我在 `page` 文件下添加 `a.vue` 文件, 那么我就可以从 `http://localhost:8080/#/page/a` 中访问到该组件. 我不用再去 `router.js` 那里 `import` 组件并配置路由路径.

想要实现这个功能主要有两个知识点, 一个是[动态路由](https://router.vuejs.org/zh/guide/essentials/dynamic-matching.html#%E5%8A%A8%E6%80%81%E8%B7%AF%E7%94%B1%E5%8C%B9%E9%85%8D), 一个是[动态组件](https://cn.vuejs.org/v2/guide/components.html#%E5%8A%A8%E6%80%81%E7%BB%84%E4%BB%B6).

动态路由:

```js
const router = new VueRouter({
  routes: [
    // 动态路径参数以冒号开头
    { path: '/page/:path', component: Home }
  ]
})

```

`this.$route.params.path` 可以获取到 `path` 参数

动态组件:

```js
<component v-bind:is="name"></component>
```

`:is` 是动态组件的用法, 当 `name` 变化, 组件就会发生变化.

所以我们可以在动态组件中实时计算路由变化.

```js
// 需要使用 vue-async-computed 插件
asyncComputed: {
  name() {
    // 获取 this.$route.params 中的参数
    const path = this.$route.params.path
    if (path) {
      // 根据 path 导入组件并 return
      // webpackChunkName 的作用是定义打包后的文件名称
      // [webpack中动态import()打包后的文件名称定义_逝水流光的博客-CSDN博客](https://blog.csdn.net/javao_0/article/details/85162458)
      return import(/* webpackChunkName: "[request]" */ `@page/${path}`)
        .then(res => {
          return res.default
        })
        .catch(err => {
          console.log('TCL: name -> err', err)
          this.$router.push('/404')
        })
    }
  }
}
```

组件就会根据 `path` 改变自动改变

简化的主要流程:

1. 动态路由监听路由变化

2. 浏览器输入 `http://localhost:8080/#/page/a`, 路由发生变化

3. `this.$route.params` 中获取动态路由的参数, 发现动态路由的参数为 `a`

4. 动态组件中导入 `page` 文件下的 `a.vue` 文件

5. 动态组件更新, 渲染到页面

附上源码: [main.js](https://github.com/HenryTSZ/vue-element-extend/blob/master/src/main.js), [Home.vue](https://github.com/HenryTSZ/vue-element-extend/blob/master/src/views/Home.vue), [router.js](https://github.com/HenryTSZ/vue-element-extend/blob/master/src/router/index.js)
