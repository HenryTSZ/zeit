---
layout: post
title: 为什么两个 width 50% 的子元素会超出父元素
date: 2018-06-12
categories: [FrontEnd, Css]
tags: [Css]
---

让两个子元素各占父元素的一半, 每个人能想到的都是 `display: inline-block; width: 50%;` , 但实际上却并不会平分, 而是会上下排列, 这是怎么回事呢?

<!-- more -->

## 问题

话不多说, 先看代码:

```html
<html>
  <head>
    <style type="text/css">
      .box1 {
        background: #f00;
        height: 50px;
      }

      .box {
        display: inline-block;
        width: 50%;
        height: 100%;
      }

      .box2 {
        background: #0f0;
      }

      .box3 {
        background: #00f;
      }
    </style>
  </head>

  <body>
    <div class="box1">
      <div class="box box2"></div>
      <div class="box box3"></div>
    </div>
  </body>
</html>
```

本来想让 `box2` 和 `box3` 各占 `box1` 的一半, 但 `box3` 却被 "挤下去了", 难道 `50% + 50% > 100%` ?

![](/img/css/001.png)

## 探索

既然被 "挤下去了", 那我宽度窄点怎么样?

```css
.box3 {
  width: 45%;
}
```

![](/img/css/002.png)

果然 "上去了", 但中间的空隙是什么鬼?

## 原因

原来, 行内元素 (包括行内块元素) 之间的空隙, 是由于 换行符 / tab(制表符)/ 空格 等引起的

## 解决

### 删除 换行符 / tab(制表符)/ 空格

1.  连成一行:

    ```html
    <div class="box box2"></div>
    <div class="box box3"></div>
    ```

    很影响阅读

2.  标签之间没有 "间隙"

    ```html
    <div class="box box2"></div>
    <div class="box box3"></div>
    ```

    或者

    ```html
    <div class="box box2"></div>
    <div class="box box3"></div>
    ```

    看的有点别扭, 但确实好使

3. 利用 `HTML` 注释

   ```html
   <div class="box box2"></div><!--
   --><div class="box box3"></div>
   ```

    会增加代码量

### 使用 `margin` 负值

```css
.box {
  margin-right: -4px;
}
```

`margin` 负值的大小与上下文的字体和文字大小相关, 并不一定是 `-4px` ; 间距对应大小值可以参考张鑫旭的 [拜拜了, 浮动布局 - 基于 display:inline-block 的列表布局](https://www.zhangxinxu.com/wordpress/2010/11/%E6%8B%9C%E6%8B%9C%E4%BA%86%E6%B5%AE%E5%8A%A8%E5%B8%83%E5%B1%80-%E5%9F%BA%E4%BA%8Edisplayinline-block%E7%9A%84%E5%88%97%E8%A1%A8%E5%B8%83%E5%B1%80/) 一文的 `part 6`

其计算程度之复杂, 以及最后一个元素多出的负 `margin` 值等问题, 这个方法不适合大规模使用.

### 让闭合标签吃胶囊

如下处理:

```html
<div class="space">
  <a href="##"> 惆怅
  <a href="##"> 淡定
  <a href="##"> 热血 </a>
</div>
```

注意, 为了向下兼容 `IE6/IE7` 等喝蒙牛长大的浏览器, 最后一个列表的标签的结束(闭合)标签不能丢.

在 HTML5 中, 我们直接:

```html
<div class="space">
  <a href="##"> 惆怅
  <a href="##"> 淡定
  <a href="##"> 热血
</div>
```

好吧, 虽然感觉上有点怪怪的, 但是, 这是 `OK` 的.

注: 使用这种方法的条件: **标签不能嵌套自身**

如下面示例:

```html
<div class="space">
  <a href="##"> 惆怅
  <a href="##"> 淡定
  <a href="##"> 热血 </a>
</div>

<div class="space">
  <span> 惆怅
  <span> 淡定
  <span> 热血 </span>
</div>

<div class="space">
  <p> 惆怅
  <p> 淡定
  <p> 热血 </p>
</div>
```

审查元素:

![](/img/css/003.png)

可以看到, `a` 标签和 `p` 标签按照预期渲染, 而 `span` 元素却是嵌套的. 这是由于 `a` 标签和 `p` 标签不能包含自身, 所以遇到下一个和自身相同的标签后, 会自动闭合; 而 `span` 可以包含自身, 所以会一直嵌套下去

### font-size:0

```css
.box1 {
  font-size: 0;
}

.box {
  font-size: 14px;
}
```

这个方法, 基本上可以解决大部分浏览器下内联元素之间的间距 ( `IE7` 等浏览器有时候会有 `1` 像素的间距).

### letter-spacing

```css
.box1 {
  letter-spacing: -5px;
}

.box {
  letter-spacing: 0;
}
```

负值视具体浏览器而定, 但一般 `-10` 以下其兼容性上的差异就可以被忽略

### word-spacing

```css
.box1 {
  word-spacing: -6px;
}

.box {
  word-spacing: 0;
}
```

一个是字符间距 ( `letter-spacing` ), 一个是单词间距 ( `word-spacing` ), 大同小异. 也是负值大到一定程度兼容性上的差异就可以被忽略

### 浮动

```css
.box {
  float: left;
}
```

父元素要注意是否需要清除浮动带来的影响

### 其他成品方法

下面展示的是 [YUI 3 CSS Grids](http://yuilibrary.com/yui/docs/cssgrids/) 使用 `letter-spacing` 和 `word-spacing` 去除格栅单元见间隔方法(注意, 其针对的是 `block` 水平的元素, 因此对 `IE8-` 浏览器做了 `hack` 处理):

```css
.yui3-g {
  letter-spacing: -0.31em;
  /* webkit */
  *letter-spacing: normal;
  /* IE < 8 重置 */
  word-spacing: -0.43em;
  /* IE < 8 && gecko */
}

.yui3-u {
  display: inline-block;
  zoom: 1;
  *display: inline;
  /* IE < 8: 伪造 inline-block */
  letter-spacing: normal;
  word-spacing: normal;
  vertical-align: top;
}
```

以下是一个名叫 [RayM](http://raym31.home.comcast.net/) 的人提供的方法:

```css
li {
  display: inline-block;
  background: orange;
  padding: 10px;
  word-spacing: 0;
}

ul {
  width: 100%;
  display: table;
  /* 调教 webkit*/
  word-spacing: -1em;
}

.nav li {
  *display: inline;
}
```

## 参考资料

- [去除 inline-block 元素间间距的 N 种方法](https://www.zhangxinxu.com/wordpress/2012/04/inline-block-space-remove-%E5%8E%BB%E9%99%A4%E9%97%B4%E8%B7%9D/)

- [行内元素产生水平空隙的原因及解决方案](https://blog.csdn.net/u010600693/article/details/51505476)
