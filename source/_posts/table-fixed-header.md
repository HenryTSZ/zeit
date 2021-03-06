---
layout: post
title: 表格固定表头的几种方法
date: 2020-01-11
categories: [FrontEnd, Css]
tags: [Css, Table]
keywords: table fixed header
---

后台管理的项目经常要用到 `table` 表格来做数据统计, 数据少时还好, 但如果表格中的数据是有滚动条的, 那么用户在滚动的时候会希望表格头是固定在上方, 否则没办法看出单元格数据对应的含义.

关于使用纯 CSS 实现固定表头的方法网上一大堆, 这里就不再一一介绍了, 着重挑几篇大家看看即可: [浅谈表格组件的实现：固定表头和固定列 - 知乎](https://zhuanlan.zhihu.com/p/33280304), [纯 CSS 实现表头固定 - 司徒正美 - 博客园](https://www.cnblogs.com/rubylouvre/archive/2010/03/06/1679381.html), [纯 css 实现 table 的表头固定 tbody 内容显示垂直滚动条-码云笔记](https://www.mybj123.com/667.html)

## el-table

`Element` 的 `table` 设置 `height` 即可实现

关于 `height` 的说明:

> Table 的高度，默认为自动高度。如果 height 为 number 类型，单位 px；如果 height 为 string 类型，则这个高度会设置为 Table 的 style.height 的值，Table 的高度会受控于外部样式。

就是说你如果想给 `table` 一个固定的高度, 那么直接设置 `height` 的值即可. 比如 `200px` 的高度, 那么 `height="200"`, `height="200px"`, `:height="200"` 都是可以的. 如果是要设置百分比的高度, 那必须保证父元素有高度. 比如一般后台管理页面, 上面是一排操作按钮, 下面是表格展示数据, 我就习惯给 `el-table` 套一个父元素, 利用绝对定位来自动沾满整个屏幕

```CSS
.wrapper {
  position: absolute;
  top: 50px; /* 预留操作按钮的高度 */
  bottom: 0;
  left: 0;
  right: 0;
}
```

这样 `el-table` 设置 `header="100%` 即可

可以在这里查看效果: [el-table-height](https://codepen.io/henrytsz/pen/dyPqpvd)

## 表格 HTML 结构部分分表头和表体两部分

结构类似下面这种的:

```HTML
<div class="table-wrapper">
  <div class="table-header"></div>
  <div class="table-body"></div>
</div>
```

可以利用 `position: sticky` 来实现, 不过不支持 `IE` 这种妖艳贱货, 可以在 [Can I use](https://caniuse.com/#search=position%3Asticky) 查看支持情况

具体的介绍可以看看张鑫旭大佬的文章: [杀了个回马枪，还是说说 position:sticky 吧 « 张鑫旭-鑫空间-鑫生活](https://www.zhangxinxu.com/wordpress/2018/12/css-position-sticky/)

咱们直接进入主题:

1. 确保 `table-wrapper` 没有设置 `overflow` 属性, 如果设置了, 改为: `overflow: visible`
2. 父级元素也不能设置固定的 `height` 高度值, 如果设置了, 改为: `height: auto`
3. `table-header` 添加一下样式:
   ```CSS
   .table-header {
     position: sticky;
     top: 0;
     z-index: 2; /* 防止被 body 遮挡 */
   }
   ```

好了, 你的表格已经固定表头了, 又可以愉快的滚动了

当然, 这个方法也可以用在 `el-table` 没有设置 `height` 上. 不过对于设置了 `border` 的 `el-table`, 由于 `.el-table` 有一个 `border-top`, 导致滚动的时候表头有跳动错位, 需要小小的修改一下 `table` 样式.

``` CSS
.el-table {
  border-top: none;
}
.el-table__header-wrapper {
  border-top: 1px solid #ebeef5;
}
```
