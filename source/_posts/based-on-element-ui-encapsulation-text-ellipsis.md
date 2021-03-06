---
title: 基于 ElementUI 封装的 TextEllipsis
date: 2020-09-03
categories: [FrontEnd]
tags: [Js, ElementUI]
thumbnail: /img/element-ui/thumbnail.svg
---

做项目中文本溢出显示省略号是一个非常常见的功能, 一般做法都是增加 `css` 样式并且鼠标悬浮后显示全部内容, 但有时候明明没有溢出, 悬浮也会显示内容, 所以我们需要做一点处理

<!-- more -->

这里是[源码](https://github.com/HenryTSZ/vuepress-element-extend/blob/master/docs/.vuepress/components/TextEllipsis.vue)

这里我们主要使用 `el-tooltip` 这个组件来实现这个功能

封装思路:

1. 通过 `content` 传入文本
2. 通过 `css` 实现溢出显示省略号的样式
3. 鼠标悬浮后, 判断 `scrollWidth` 是否超过 `offsetWidth`, 如果超过, 显示 `tooltip`, 否则设置 `disabled`

由于比较简单, 直接上代码了:

``` HTML
<template>
  <el-tooltip class="text-ellipsis" v-bind="$attrs" :disabled="disabled" :content="content">
    <div @mouseenter.stop="handleMouseEnter">
      {{ content }}
    </div>
  </el-tooltip>
</template>

<script>
export default {
  name: 'TextEllipsis',
  props: {
    content: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      disabled: true
    }
  },
  methods: {
    handleMouseEnter(e) {
      const { scrollWidth, offsetWidth } = e.target
      this.disabled = scrollWidth <= offsetWidth
    }
  }
}
</script>

<style lang="less" scoped>
.text-ellipsis {
  width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
```
