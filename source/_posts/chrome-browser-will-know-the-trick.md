---
title: Chrome 浏览器必知必会的小技巧
date: 2017-12-03
categories: [Software, Browser]
tags: [Chrome]
---

这篇文章主要介绍的就是一些 Chrome 浏览器的小技巧, 很简单, 希望对大家有所帮助.

这其中的一些小技巧在低版本中是没有的, 所以建议大家用最新版的, 目前最新版是 62, 版本很重要, 如果发现有些技巧不起作用, 请先查看浏览器的版本.

## 快捷键

快捷键比较多, 这里挑出几个常用的说一下

Mac 快捷键有很多和 Windows 不同, 如果需要修改为和 Windows 一致, [请点这里](https://tsz.now.sh/2017/11/03/mac-custom-application-shortcut-keys)

### URL 链接

- 在新标签页打开
  - Ctrl + click / Cmd + click
  - 鼠标中键
- 在新窗口打开
  - Shift + click
- 在新标签页打开地址栏中内容或 URL
  - Alt + Enter / Opt + return

### 粘贴纯文本

在网页中编辑文本时(例如写邮件), 若只想复制纯文本, 不要使用 Ctrl+V, 而使用 Ctrl+Shift+V

### 下列快捷键可以在所有 开发者工具 面板中可以使用

| 全局快捷键                         | windows               | Mac              |
| :--------------------------------- | :-------------------- | :--------------- |
| 打开 开发者工具                    | F12、Ctrl+Shift+I     | Cmd+Opt+I        |
| 打开 开发者工具 并聚焦到控制台     | Ctrl+Shift+J          | Cmd+Opt+J        |
| 打开/切换检查元素模式和浏览器窗口  | Ctrl+Shift+C          | Cmd+Shift+C      |
| 刷新页面                           | F5、Ctrl+R            | Cmd+R            |
| 刷新忽略缓存内容的页面             | Ctrl+F5、Ctrl+Shift+R | Cmd+Shift+R      |
| 上一个面板                         | Ctrl + [              | Cmd + [          |
| 下一个面板                         | Ctrl + ]              | Cmd + ]          |
| 更改 DevTools 停靠位置             | Ctrl + Shift + D      | Cmd + Shift + D  |
| 打开 Device Mode                   | Ctrl + Shift + M      | Cmd + Shift + M  |
| 切换控制台                         | Esc                   | Esc              |
| 在当前文件或面板中搜索文本         | Ctrl + F              | Cmd + F          |
| 在所有源中搜索文本                 | Ctrl + Shift + F      | Cmd + Opt + F    |
| 按文件名搜索（除了在 Timeline 上） | Ctrl + O、Ctrl + P    | Cmd + O、Cmd + P |
| 放大（焦点在 DevTools 中时）       | Ctrl + +              | Cmd + Shift + +  |
| 缩小                               | Ctrl + -              | Cmd + Shift + -  |
| 恢复默认文本大小                   | Ctrl + 0              | Cmd + 0          |
| 打开 command 菜单                  | Ctrl + Shift + P      | Cmd + Shift + P  |

### 在 Elements 面板中使用的快捷键

| Elements 面板          | windows         | Mac             |
| :--------------------- | :-------------- | :-------------- |
| 编辑属性               | Enter、双击属性 | Enter、双击属性 |
| 隐藏元素               | H               | H               |
| 切换为以 HTML 形式编辑 | F2              | F2              |

### 在 Styles 边栏中使用的快捷键

| Styles 边栏           | windows                | Mac                    |
| :-------------------- | :--------------------- | :--------------------- |
| 转到源中属性值声明行  | Ctrl+点击属性值        | Cmd+点击属性值         |
| 在颜色定义值之间循环  | Shift+点击颜色选取器框 | Shift+点击颜色选取器框 |
| 编辑下一个/上一个属性 | Tab、Tab+Shift         | Tab、Tab+Shift         |

### 在控制台中使用的快捷键

| 控制台       | windows     | Mac           |
| :----------- | :---------- | :------------ |
| 聚焦到控制台 | Ctrl+\`     | 同 Windows    |
| 清除控制台   | Ctrl+L      | Cmd+K、Ctrl+L |
| 多行输入     | Shift+Enter | Shift+Return  |

### 快速切换文件

按 Ctrl+P(Cmd+P on mac), 就能快速搜寻和打开你项目的文件.

![](/img/chrome/001.gif)

### 在源代码中搜索

大家都知道如果在要在 Elements 查看源码, 只要定位到 Elements 面板, 然后按 Ctrl+F 就可以了

![](/img/chrome/002.png)

### 在源代码中快速跳转到指定的行

在 Sources 标签中打开一个文件之后, 按 Ctrl + G, 然后输入行号, chrome 控制台就会跳转到你输入的行号所在的行. 或者 Ctrl+P 后输入 `:行号`

![](/img/chrome/003.gif)

### 使用多个插入符进行选择

当编辑一个文件的时候, 你可以按住 Ctrl / Cmd 在你要编辑的地方点击鼠标, 可以设置多个插入符, 这样可以一次在多个地方编辑

![](/img/chrome/004.gif)

### 选择下一个匹配项

当在 Sources 标签下编辑文件时, 按下 Ctrl + D (Cmd + D) , 当前选中的单词的下一个匹配也会被选中, 有利于你同时对它们进行编辑.

![](/img/chrome/005.gif)

### 强制改变元素状态(方便查看不同状态下元素的样式)

chrome 控制台有一个可以模拟 CSS 状态的功能, 例如元素的 hover 和 focus, 可以很容易的改变元素样式. 在 CSS 编辑器中可以利用这个功能查看不同状态下元素的样式

![](/img/chrome/006.gif)

## 拖放的技巧

- 拖动文本到 Omnibox (地址栏, 也叫 Omnibar) 进行搜索: 如果你先复制文本再粘贴在 Omnibox 中进行搜索, 那就太浪费时间了, 这儿有一个更快的方法来, 只需将你选中的文字拖放到 Omnibox 中就行了!
- 拖动文本到标签栏, 可以在新标签中打开搜索: 与上一条小技巧很像. 差别是不再拖动文本到地址栏, 而是拖放在标签栏上, 这样可以在新标签中打开搜索页面.
- 拖动链接到 Omnibar 来打开它们: 拖动书签栏中的链接到地址栏打开它.
- 拖放链接到标签栏上, 可以在新标签中打开链接: 当浏览网页时, 想打开的链接很多, 但不想关闭或离开当前页面, 可以拖动链接到标签栏, 就可以在新标签中打开链接.
- 拖动图片到标签栏: 就像你拖动网址或文本到地址栏一样, 你可以拖动图像到地址栏并打开它们.
- 拖动链接到书签栏: 忘记添加书签的键盘快捷键吧, 直接拖动 URL 到你的书签栏, 体验不同的行事风格!
- 用 Chrome 的拖放打开在电脑上保存的文件: 你可以拖放本地文件到 Chrome 打开, HTML 文件和图像等最适合使用这种方法, 但我个人最喜欢通过这种方式打开 PDF 文件.

## 区域截屏

选取页面中的一部分, 保存为图片

1. 打开开发者工具

   使用 快捷键 F12 (Windows) 或 Cmd+Opt+I (Mac)

2. 选择左上角的元素选择按钮, 图标颜色变为蓝色即表示选中了

   ![](/img/chrome/007.png)

3. Windows 下按住 Ctrl, Mac 就按住 Command, 然后点击鼠标左键在页面选择区域即可, 松开鼠标后, 截图自动下载.
4. 图片自动下载好后, 点击图片后面的箭头, 可以在文件夹中显示

## 节点截图

选中页面中某一元素, 保存为图片

1. 打开开发者工具

   使用 快捷键 F12 (Windows) 或 Cmd+Opt+I (Mac)

2. 选中任意元素节点

   ![](/img/chrome/008.png)

3. 打开命令工具

   使用快捷键 Ctrl + Shift + p (Windows) 或 Cmd + Shift + p (Mac)

   ![](/img/chrome/009.png)

4. 点击 Capture node screenshot, 或者输入这行中任意的关键字, 比如输入 node, 也会出来这个选项, 然后点击这个选项, 图片会自动下载.

   ![](/img/chrome/010.png)

5. 图片自动下载好后, 点击图片后面的箭头, 可以在文件夹中显示

## 截全屏

保存完整网页为图片

### 第一种方式

1. 打开开发者工具

   使用 快捷键 F12 (Windows) 或 Cmd+Opt+I (Mac)

2. 打开命令工具

   使用快捷键 Ctrl + Shift + p (Windows) 或 Cmd + Shift + p (Mac)

3. 点击 Capture full size screenshot, 或者输入这行中任意的关键字, 比如输入 full, 也会出来这个选项
4. 图片自动下载好后, 点击图片后面的箭头, 可以在文件夹中显示

### 第二种方式

1. 打开开发者工具

   使用 快捷键 F12 (Windows) 或 Cmd+Opt+I (Mac)

2. 选中 切换开发模式按钮, 图标颜色变为蓝色即表示选中了

   ![](/img/chrome/011.png)

3. 点右上方的三个 小点, 点击 Capture full size screenshot, 图片会自动下载

   ![](/img/chrome/012.png)

## 拾色器

在颜色预览功能使用快捷键 Shift + Click, 可以在 rgba、hsl 和 hexadecimal 来回切换颜色的格式

![](/img/chrome/013.gif)

在 Styles 边栏 点击任意颜色的小色块, 就可以弹出颜色选择器

![](/img/chrome/014.png)

![](/img/chrome/015.png)

1. 颜色选择区域.
2. 吸管. 拾取页面中的颜色
3. 复制到剪贴板. 将显示值复制到剪贴板.
4. 显示值. 颜色的 RGBA, HSLA 或十六进制表示.
5. 调色板. 单击其中一个方块将颜色更改为该方块.
6. 色相.
7. 透明度.
8. 显示值切换器. 在当前颜色的 RGBA, HSLA 和 Hex 表示之间切换.
9. 调色板切换器.

当吸管开启时, 如果你停留在页面, 鼠标指针会变成一个放大镜, 让你去选择像素精度的颜色.

![](/img/chrome/016.gif)

## 快速添加样式规则

1. 在 Styles 边栏, 鼠标放在每一小块样式规则上, 右下方都会有三个小点

   ![](/img/chrome/017.png)

2. 鼠标放在这三个小点上, 会出现 5 个小图标, 每个小图标都有作用

   ![](/img/chrome/018.png)

3. 他们从左到右分别代表
   - 添加 text-shadow
   - 添加 box-shadow
   - 添加 color
   - 添加 background-color
   - 插入样式规则

## 增加移动设备

1. 打开开发者工具
2. 点击右上方的三个小点, 然后选择 Settings

   ![](/img/chrome/019.png)

3. 选择 Devices, 然后在需要添加的设备前面打上勾就可以了

   ![](/img/chrome/020.png)

## 总结

这些小技巧, 很简单, 希望对大家有所帮助, 不过对于有办法、有时间的朋友还是建议去官网看看吧, 毕竟那里才更加全面.

[Chrome 开发者工具](https://developers.google.com/web/tools/chrome-devtools/?hl=zh-cn)

## 参考资料

- [简单说 chrome 浏览器 必知必会的小技巧](https://segmentfault.com/a/1190000012143176)
- [Chrome 使用技巧](https://www.cnblogs.com/tester-l/p/6018067.html)
- [Chrome 有哪些不易发现的功能或使用技巧?](https://www.zhihu.com/question/20309902)
- [【译】你不知道的 Chrome 调试工具技巧](https://juejin.im/post/5c09a80151882521c81168a2)
