---
title: node 和 npm 常见问题
date: 2017-08-04
categories: [Software]
tags: [node, npm]
---

记录 node 和 npm 常见问题

- npm 配置淘宝镜像: `npm config set registry "https://registry.npm.taobao.org"`

- node-sass 安装失败的解决方法:

  - 设置全局镜像源: `npm config set sass_binary_site https://npm.taobao.org/mirrors/node-sass/`
  - 参考资料: [整理 node-sass 安装失败的原因及解决办法 - - SegmentFault 思否](https://segmentfault.com/a/1190000010984731#articleHeader1)
