---
title: Chrome 浏览器所有页面全部崩溃
date: 2019-03-03
categories: [Software, Browser]
tags: [Chrome]
---

Chrome 浏览器打开的所有的页面打开一个, 崩溃一个, 卸载重装了, 结果还是一样!

最近准备重装 Chrome, 正常卸载 --> 下载 Chrome --> 安装, 一切都 OK, 但启动后却整个浏览器都崩溃了, 没有一个页面可以打开, 包括 `chrome://` 开头的页面也崩溃

经过大半天的 `网上冲浪` , 终于发现了 Chrome 奔溃的真正原因! ! !

都是百度的锅! ! !

原因就是 `C:\Windows\System32\drivers\bd0001.sys` 这个文件

不论是用 `IObit Unlocker` 或者是 360强力删除(不建议) 或者是其他的强力删除软件, 只要删除这个文件, 再重启电脑, 就不会再有奔溃的情况出现!

如果无法删除, 尝试修改后缀名, 或者进入安全模式删除

## 参考资料

- [Chrome浏览器所有页面全部崩溃！？ - 知乎](https://www.zhihu.com/question/29305453)
