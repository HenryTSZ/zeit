---
layout: post
title: 开发效率提升之工具篇
date: 2020-07-24
categories: [Software]
keywords: Productivity, Tools
---

工欲善其事必先利其器! 使用得心应手的工具必然会提高开发效率.

## 输入法

### 痛点

`Mac` 每次输入都需要查看顶部状态栏的输入法状态, 而且有的软件全屏后会隐藏顶部状态栏, 这时要不先随便输入一下查看输入源, 要不鼠标滑到顶部查看输入源, 极其影响效率

### 解决

可以使用 `SwitchKey` 为特定应用程序指定默认输入法

![SwitchKey](https://cdn.sspai.com/editor/u_713147/15578861142709.jpg)

但如果做到绝对控制, 需要给所有应用程序指定默认输入法; 而且有时候要输入中文, 切换到应用程序却是英文, 还需要再切换一次输入法

[ShowyEdge: 根据输入源切换不同颜色](https://tsz.now.sh/2018/06/30/Mac-commonly-used-software/#ShowyEdge-%E6%A0%B9%E6%8D%AE%E8%BE%93%E5%85%A5%E6%BA%90%E5%88%87%E6%8D%A2%E4%B8%8D%E5%90%8C%E9%A2%9C%E8%89%B2)

![ShowyEdge](https://showyedge.pqrs.org/images/menubar.png)

**`Windows` 可以嵌入底部任务栏, 还是比较方便的**

## 改键

### Mac

由于 `Mac` 的键盘和主流布局不一致, 许多人都会遇到外接键盘布局不适应的情况; 即便是 `Mac` 的内置键盘, 也有人觉得其设计不够合理, 不符合自己的工作习惯. 好在键盘和使用者之间是可以磨合的, [Karabiner-Elements](https://pqrs.org/osx/karabiner/) 就是 `Mac` 上一款非常好用的开源改键利器, 能让键盘顺着你的意愿来工作.

[Karabiner-Elements 使用介绍](https://tsz.now.sh/2018/06/23/Karabiner-Elements/)

`Vim` 风格到方向键, `F1~F12` , `Home` , `End` , `PageUp` , `PageDown` ...

路径: `~/.config/karabiner/karabiner.json`

### Windows

[AutoHotkey](https://autohotkey.com/) 是一个 `Windows` 下的开源、免费、自动化软件工具. 它由最初旨在提供键盘快捷键的脚本语言驱动(称为:**热键**), 随着时间的推移演变成一个完整的脚本语言. 但你不需要把它想得太深, 你只需要知道它可以简化你的重复性工作, 一键自动化启动或运行程序等等; 以此提高我们的**工作效率**, 改善**生活品质**; 通过按键映射, 鼠标模拟, 定义宏等.

- [快速参考 | AutoHotkey v2](https://wyagd001.github.io/v2/docs/AutoHotkey.htm)
- [Win 下最爱效率神器: AutoHotKey | 晚晴幽草轩](https://www.jeffjade.com/2016/03/11/2016-03-11-autohotkey/)

## 启动器

快速查找文件、打开应用程序、快捷网页搜索、计算器、有道翻译...

### Mac

[Alfred](https://tsz.now.sh/2018/06/01/Alfred/)

### Windows

[火柴官网(原火萤酱)-文件秒搜|局域网聊天\_电脑必备|效率神器](https://www.huochaipro.com/)

## 剪切板历史记录

输入用户名密码的时候, 先在记事本中复制用户名, 然后到网站粘贴, 输入密码的时候再重复一般, 需要来回在记事本和网页之间切换

### Mac

[Alfred](https://tsz.now.sh/2018/06/01/Alfred/) 的 `Clipboard History`

### Windows

`Win 10` : 系统自带, 快捷键: `win + v`
但不好用: 无法使用方向键选择, 只能使用鼠标滚动; 功能单一, 无法搜索

[免费开源的 Windows 管理剪贴板, 让你处理文字更高效: Ditto - 少数派](https://sspai.com/post/43700)

## 选中弹窗

最基本的功能就是复制粘贴的使用, 除此之外, 根据鼠标选中的内容, 还支持链接的跳转打开、自带词典的翻译、邮件地址跳转、搜索引擎搜索、单词纠正等功能.

### Mac

[没那么简单: PopClip for Mac - 少数派](https://sspai.com/post/25483)

### Windows

[Windows 平台的 Pop Clip，可以自定义的划词「加速器」：Pantherbar - 少数派](https://sspai.com/post/61014)

## VS Code

### 插件 & 快捷键
