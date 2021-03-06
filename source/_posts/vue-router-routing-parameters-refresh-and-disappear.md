---
layout: post
title: vue-router 路由参数刷新消失的问题
date: 2017-08-17
categories: [FrontEnd, Vue]
tags: [Vue]
thumbnail: /img/vue/thumbnail.png
---

页面使用 `vue-router` 在跳转时需要给下一个页面携带参数. 在进入页面后再次刷新, 参数就消失了.

<!-- more -->

## 问题

页面使用 `vue-router` 在跳转时需要给下一个页面携带参数. 在进入页面后再次刷新, 参数就消失了.

这是上个页面跳转写的.

``` JS
this.$router.push({
  name: 'articleDetail',
  params: {
    articleId: this.articleId
  }
})
```

这边是从上个页面接收这个参数请求数据

``` js
methods: {
  init () {
    console.log(this.$route.params.articleId)
    this.params = this.$route.params
    this.articleId = this.params.articleId
    this.getArticleDetail(this.articleId)
  }
}
```

进入页面后再次刷新的话请求的数据就没有了.

## 解决

你在用 `vue-router` 跳转的时候可以把参数写进 `query` 里

``` js
this.$router.push({
  name: 'articleDetail',
  query: {
    articleId: this.articleId
  }
});
```

这样你的 url 就会像 `http://xxx.xxx.xxx/articleDetail?articleId=123` , 这样无论你怎么刷新 `articleId` 都不会丢失

然后在你的 `init` 方法里 可以用 `this.articleId = this.$route.query.articleId` 来获取 `id`

如果要用 `params` 传参的话, 可能需要在你的路由路径里也加上这个参数, 比如上面的例子, 那么在路由里就要这样写

``` js
routes: [{
  path: '/articleDetail/:articleId',
  name: 'articleDetail'
}]
```

`path: '/articleDetail/:articleId'` 里的 `:articleId` 是必须要有的

如果要传递对象, 需要使用 `JSON` 转一下

``` js
this.$router.push({
  path: '/manage/composition',
  query: {
    dropDefaultActive: this.dropDefaultActive,
    option: JSON.stringify(this.option)
  }
})
```

相应的, 接收页面还需要转回来

``` js
getUrlParam() {
  let param = this.$route.query;
  this.dropDefaultActive = param.dropDefaultActive;
  this.option = JSON.parse(param.option)
}
```
