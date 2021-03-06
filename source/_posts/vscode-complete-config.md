---
title: VSCode 完整版配置
date: 2018-09-05
categories: [Software]
tags: [Vscode, Guidelines]
thumbnail: /img/vscode/thumbnail.png
---

VS Code 完整版配置

在官网 [Visual Studio Code](https://code.visualstudio.com/) 可以查看介绍和下载

也可以看看这篇文章: [Visual Studio Code 入门(译) - 简书](https://www.jianshu.com/p/3dda4756eca5)

## 同步设置

如果你喜欢我的配置, 可以通过 [Syncing](https://marketplace.visualstudio.com/items?itemName=nonoroazoro.syncing) 这个插件同步到你本地, 当然这会**覆盖**你本地的配置, 请慎重选择

以下是同步的过程:

1. [安装 Syncing 插件](vscode:extension/nonoroazoro.syncing)
2. 使用快捷键 `ctrl/cmd + shift + p` 或 `f1` 调出命令面板
3. 输入 `Syncing: Download Settings` 回车
4. 此时需要输入 `GitHub Personal Access Token` , 如果你以前没有上传配置到 `Gist` 或你想使用我的配置, 留空回车即可
5. 输入一个 `Gist ID` , 我的是 `e4881a8e307f3186e80cc4aea54011df` , 当然你也可以输入一个 `公开的 Gist ID` (比如你朋友共享给你的   `Gist` )
6. VS Code 会自动从云端下载配置
7. 如果提示: `下载失败, 请检测网络设置` , 很可能是被墙了, 此时需要[如何科学使用 GitHub 服务](https://tsz.now.sh/2019/02/05/scientific-use-of-github)
8. 重复一遍, 此操作会**覆盖**本地配置, 请慎重

## 代码片段

### 片段变量

在自定义代码段中, 您现在可以使用变量. 变量的语法适用于 `$name` 简单变量和 `${name:default}` 具有默认值的变量. 变量计算其值, 空字符串或其默认值(如果存在). 当变量未知时, 我们将其作为占位符插入.

可以使用以下变量:

- `TM_SELECTED_TEXT`  - 当前选定的文本或空字符串.
- `TM_CURRENT_LINE`  - 当前行的内容.
- `TM_CURRENT_WORD`  - 光标下的单词或空字符串的内容.
- `TM_LINE_INDEX`  - 基于零索引的行号.
- `TM_LINE_NUMBER`  - 基于单索引的行号.
- `TM_FILENAME`  - 当前文档的文件名.
- `TM_DIRECTORY`  - 当前文档的目录.
- `TM_FILEPATH`  - 当前文档的完整文件路径.
- `$BLOCK_COMMENT_START ${1:comment} $BLOCK_COMMENT_END` - 使用当前语言的规则添加注释

以下是使用单引号围绕所选文本的代码段示例, 或者, 如果未选择任何文本, 则插入 `type_here` -placeholder.

    "in quotes": {
      "prefix": "inq",
      "body": "'${TM_SELECTED_TEXT:${1:type_here}}'"
    }

示例:

此代码片段默认缩进是 2 个空格, 如需要修改为 4 个空格, 直接添加空格即可.

**注: 不支持 tab 缩进, 使用 tab 缩进会报错**

### HTML5 代码片段

```json
"html5": {
  "prefix": "html5",
  "body": [
    "<!DOCTYPE html>",
    "<html lang=\"en\">",
    "  <head>",
    "    <meta charset=\"UTF-8\">",
    "    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">",
    "    <meta http-equiv=\"X-UA-Compatible\" content=\"ie=edge\">",
    "    <title>${1:Document}</title>",
    "    <style type=\"text/css\">",
    "      ",
    "    </style>",
    "  </head>",
    "  <body>",
    "    $2",
    "  </body>",
    "</html>"
  ],
  "description": "HTML5"
}
```

### vue 代码片段

``` json
{
  "init Vue": {
    "prefix": "ivue",
    "body": [
      "<template>",
      "  <div class=\"$1\">$2</div>",
      "</template>",
      "",
      "<script>",
      "export default {",
      "  name: '$TM_FILENAME_BASE',",
      "  components: {},",
      "  props: {},",
      "  data() {",
      "    return {}",
      "  },",
      "  computed: {},",
      "  watch: {},",
      "  methods: {",
      "    init() {}",
      "  },",
      "  created() {",
      "    this.init()",
      "  },",
      "  mounted() {}",
      "}",
      "</script>",
      "",
      "<style lang=\"less\">",
      ".$1 {",
      "}",
      "</style>",
      ""
    ],
    "description": "init Vue"
  }
}
```

[这里](https://tsz.now.sh/2020/02/28/conclusion-the-code-snippet-in-my-work/)是本人工作中总结的代码片段, 仅供参考

可以在这个网址生成代码片段: [snippet generator](https://snippet-generator.app/)

详细介绍可以看这篇文章: [跟我一起在 Visual Studio Code 添加自定义 snippet（代码段），附详细配置 - 猫科龙 - CSDN博客](https://blog.csdn.net/maokelong95/article/details/54379046)

## [插件](https://tsz.now.sh/2018/09/08/vscode-extension/)

## 系统设置

```json
{
  // ------------------------ 样式 ------------------------
  // 字体
  "editor.fontSize": 20,
  // 系统需要安装 Fira Code 字体, 如果你需要这个字体
  // https://github.com/tonsky/FiraCode
  "editor.fontFamily": "Fira Code, Consolas, Menlo, Monaco, 'Courier New', monospace",
  "editor.fontLigatures": true,
  // 颜色主题 系统自带
  "workbench.colorTheme": "Monokai Dimmed",
  // 文件图标主题 插件名: VSCode Great Icons
  "workbench.iconTheme": "vscode-great-icons",

  // ------------------------ 格式化代码 ------------------------
  // 一个制表符等于的空格数
  "editor.tabSize": 2,
  // 启用后，保存文件时在文件末尾插入一个最终新行。
  "files.insertFinalNewline": true,
  // 启用后，保存文件时将删除在最终新行后的所有新行。
  "files.trimFinalNewlines": true,
  // 启用后，将在保存文件时剪裁尾随空格。
  "files.trimTrailingWhitespace": true,
  // 在保存时运行的代码操作类型
  "editor.codeActionsOnSave": {
    "source.fixAll": true
  },
  // 定义非必要分号的处理方式: 删除不必要的分号
  "javascript.format.semicolons": "remove",
  // 自动更新路径
  "javascript.updateImportsOnFileMove.enabled": "always",
  // 是否在每行末尾加一个分号
  "prettier.semi": false,
  // 使用单引号
  "prettier.singleQuote": true,
  // 换行字符串阈值
  "prettier.printWidth": 100,
  // JSX 有多个属性时，将 `>` 放在最后一行的末尾，而不是单独放在下一行（不适用于自闭元素）
  "prettier.jsxBracketSameLine": true,
  // 当箭头函数仅有一个参数时是否加上括号
  "prettier.arrowParens": "avoid",
  // 控制尾随逗号的输出
  "prettier.trailingComma": "none",
  // 格式化 vue 插件名: Vetur
  "vetur.format.defaultFormatter.html": "prettier",
  "vetur.format.defaultFormatterOptions": {
    "prettier": {
      "eslintIntegration": true,
      "semi": false,
      "singleQuote": true,
      "printWidth": 100,
      "jsxBracketSameLine": true
    }
  },
  // 各个类型文件的默认格式化工具
  "[javascript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[vue]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode",
  },
  "[markdown]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode",
    // 控制折行的方式: 在视区宽度处折行
    "editor.wordWrap": "on",
  },
  "[json]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[jsonc]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[html]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },

  // markdown 格式化配置 插件名: markdown-formatter
  // js 代码格式化
  "markdownFormatter.formatOpt": {
    "indent_size": 2,
    "end_with_newline": false,
    "space_after_anon_function": true,
    "space_after_named_function": true
  },
  // 自动将以下全角字符转换为半角字符
  "markdownFormatter.fullWidthTurnHalfWidth": "，：；！“”‘’（）？。",
  // 是否按照以下顺序: `* > + > -` 格式化无序列表的符号
  "markdownFormatter.formatULSymbol": false,

  // 控制编辑器是否自动格式化粘贴的内容。格式化程序必须可用，并且能针对文档中的某一范围进行格式化。
  "editor.formatOnPaste": true,

  // ------------------------ 编辑器相关 ------------------------
  // 执行文字相关的导航或操作时将用作文字分隔符的字符(比如双击选中文字, 只会选中下面分隔符中的文字)
  "editor.wordSeparators": "`~!！@#$￥%^……&*(（)）=+[【{]】}\\、|;；:：'‘\"”,，.。<《>》/、?？",
  // 在“打开的编辑器”窗格中显示的编辑器数量。将其设置为 0 可隐藏窗格。
  "explorer.openEditors.visible": 0,
  // 自动保存（失焦保存）
  "files.autoSave": "onFocusChange",
  // 控制编辑器是否显示控制字符。
  // [Mac 上的 VSCode 编写 Markdown 总是出现隐藏字符？ - 知乎](https://www.zhihu.com/question/61638859/answer/277721225)
  "editor.renderControlCharacters": true,
  // 控制是否在编辑器中输入时自动重命名
  "editor.renameOnType": true,
  // 控制是否绘制已修改 (存在更新) 的编辑器选项卡的顶部边框。
  "workbench.editor.highlightModifiedTabs": true,
  // 限制打开编辑器的数量, VS Code 将关闭最近最少使用的编辑器
  // [limit-the-number-of-open-editors](https://code.visualstudio.com/updates/v1_42#_limit-the-number-of-open-editors)
  "workbench.editor.limit.enabled": true,
  "workbench.editor.limit.value": 8,
  // 控制键入时是否应自动显示建议
  "editor.quickSuggestions": {
    "other": true,
    "comments": true, // 注释
    "strings": true // 字符串
  },
  // 面包屑导航
  // https://code.visualstudio.com/updates/v1_26#_breadcrumbs
  "breadcrumbs.enabled": true,
  // 在导航路径视图中仅显示当前符号
  "breadcrumbs.symbolPath": "last",
  // 当存在多个目标位置时, 跳转到主要位置(不显示预览视图)
  "editor.gotoLocation.multipleImplementations": "goto",

  // 控制资源管理器是否在把文件删除到废纸篓时进行确认。
  "explorer.confirmDelete": false,
  // 小地图最大宽度
  "editor.minimap.maxColumn": 80,
  // 小地图的高度始终是编辑器的高度
  "editor.minimap.size": "fill",
  // 小地图每行用色块显示
  "editor.minimap.renderCharacters": false,
  // 在状态栏显示代码错误信息
  "problems.showCurrentInStatus": true,

  // 若窗口在处于全屏模式时退出，控制其在恢复时是否还原到全屏模式。
  "window.restoreFullscreen": true,

  // 启用后, 差异编辑器将忽略前导空格或尾随空格中的更改
  "diffEditor.ignoreTrimWhitespace": false,

  // ------------------------ 插件相关 ------------------------
  // 生成文件头部注释和函数注释 插件名: koroFileHeader
  // 头部注释
  "fileheader.customMade": {
    "Author": "HenryTSZ", // 文件作者
    "Date": "Do not edit", // 文件创建时间(不变)
    "Description": "", // 说明
    "LastEditors": "HenryTSZ", // 文件最后编辑者
    "LastEditTime": "Do not edit", // 文件最后编辑时间
  },
  // 配置
  "fileheader.configObj": {
    "autoAdd": false,
    // "prohibitAutoAdd": [ "json", "md" ], // 禁止 .json .md 文件自动添加头部注释
    // "checkFileChange": true // 每次保存之后, 会进行一次 diff 检查, 如果文件只变更了 LastEditors/LastEditTime, 该文件将会回滚到本地仓库的最新版本.
  },

  // element-helper 版本 插件名: vscode-element-helper
  "element-helper.version": "2.5",

  // 在默认不支持 Emmet 的语言中启用 Emmet 缩写功能。在此添加该语言与受支持的语言间的映射。
  "emmet.includeLanguages": {
    "vue-html": "html"
  },

  // vim 插件名: Vim
  // Override VSCode's copy command with our own copy command, which works better with VSCodeVim. Turn this off if copying is not working.
  // "vim.overrideCopy": false,
  // "vim.startInInsertMode": true,
  // Enable some vim ctrl key commands that override otherwise common operations, like ctrl+c
  // If your operating system is Windows, please set to false
  // "vim.useCtrlKeys": false,

  // 同步配置插件 插件名: Syncing
  // 通过该配置项，可以决定是否让 Syncing 按照设备操作系统的不同来分开同步您的`快捷键配置`。
  // 鉴于 VSCode 从 1.27 版本开始提供了 `Platform Specific Keybindings` 功能，您现在可以关闭该功能了。
  // 注意：在关闭该功能之前，请务必确保您已经手动合并了现有的快捷键配置。
  "syncing.separateKeybindings": false,
  // 不同步的插件
  // 如果你想公开自己的配置，可以防止将 Github 的 token 公开，并且防止别人修改你的配置
  "syncing.excludedExtensions": ["nonoroazoro.syncing", "vscodevim.vim"],

  // 光标快速跳转到指定位置 插件名: metaGo
  "metaGo.decoration.fontSize": 20,
  "metaGo.decoration.height": 22,
  "metaGo.decoration.width": 13,
  "metaGo.decoration.y": 15,
  "metaGo.decoration.backgroundOpacity": "0.9",

  // 在 Terminal 打开当前路径 插件名: Open in Terminal
  // The name of your terminal app
  "openInTerminal.app": "iTerm",

  // 在当前选中的变量下面利用 console 输出该变量 插件名: Turbo Console Log
  // 使用单引号
  "turboConsoleLog.quote": "'",

  // 自动检测项目 插件名: Project Manager
  // 在如下目录检测 vscode 项目
  "projectManager.vscode.baseFolders": [
    "/Users/liheng/Documents/workspace/",
    "F:/basis-facility-web"
  ],

  // 路径别名跳转 插件名: path-alias
  // 是否补全文件扩展名
  "pathAlias.needExtension": false,
  // 在引号之间进行切换 插件名: Toggle Quotes
  "togglequotes.chars": [
    "\"",
    "'",
    "`"
  ],
  // 目录树 插件名: Directory-tree generator
  // 排除的文件和文件夹
  "dirconfgen.exclude": [
    "*.*",
    "node_modules"
  ],
  // 深度
  "dirconfgen.maxDepth": 2,
  // 智能代码提示 插件名: TabNine
  "tabnine.experimentalAutoImports": true,
  // 代码截图 插件名: CodeSnap
  // 背景透明
  "codesnap.transparentBackground": true,
  "editor.columnSelection": false
}
```

## [快捷键](https://tsz.now.sh/2018/09/09/vscode-shortcuts/)

## 一些小技巧

### [region](https://code.visualstudio.com/updates/v1_17#_folding-regions)

- TypeScript/JavaScript:  `//#region`  and  `//#endregion`  and  `//region`  and  `//endregion`

  ![Region Folding](/img/vscode/001.gif)

- C#:  `#region`  and  `#endregion`
- C/C++:  `#pragma region`  and  `#pragma endregion`
- F#:  `//#region`  and  `//#endregion`
- Powershell:  `#region`  and  `#endregion`
- VB:  `#Region`  and  `#End Region`
- [CSS/SCSS/Less](https://code.visualstudio.com/updates/v1_23#_css-region-folding): `/* #region */` and `/* #endregion */`
- [SCSS/Less](https://code.visualstudio.com/updates/v1_23#_css-region-folding): `// #region` and `// #endregion`

  ![css-folding](/img/vscode/002.gif)

- Markdown: 标题

  ![](/img/vscode/003.gif)

- Coffeescript:  `#region`  and  `#endregion`
- PHP:  `#region`  and  `#endregion`
- Bat:  `::#region`  and  `::#endregion`

Note: If you don't remember a folding marker, type  `#`  at the beginning of a line and you will get IntelliSense suggestions. Each language proposes completion proposals or snippets.

### [Markdown workspace symbol search](https://code.visualstudio.com/updates/v1_23#_markdown-workspace-symbol-search)

Markdown now has support for workspace symbol search. After opening a Markdown file for the first time, you can use ( `⌘T` ) to search through the headers of all Markdown files in the current workspace:

![markdown-workspace-symbol-search](/img/vscode/004.png)

### [Automatic member property suggestions](https://code.visualstudio.com/updates/v1_20#_automatic-member-property-suggestions)

Tired of typing  `this.`  to access class properties in JavaScript and TypeScript? Now you can just start typing to see available members.

![No more need to type this. to see property suggestions](/img/vscode/005.png)

Accept a member property suggestion, and VS Code automatically inserts the require  `this.` .

![this. is automatically inserted when you suggest a property suggestion](/img/vscode/006.png)

### [Platform specific keybindings](https://code.visualstudio.com/updates/v1_27#_platform-specific-keybindings)

It's now possible to enable keyboard shortcuts for specific operating systems using  `isLinux` ,   `isMac`  and  `isWindows`  within a keybinding's  `when`  clause:

```json
({
  "key": "ctrl+o",
  "command": "workbench.action.files.openFolder",
  "when": "!isMac"
},
{
  "key": "cmd+o",
  "command": "workbench.action.files.openFolder",
  "when": "isMac"
})
```

This makes it much easier to share your  `keybindings.json`  file across different machines.

### Tab completion

Editor Tab completion can now complete all kind of suggestions. After setting  `"editor.tabCompletion": "on"` , pressing Tab will complete any prefix, not just snippets. Also, pressing Tab will insert the next suggestion and ⇧Tab will insert the previous suggestion.

![Tab completion](/img/vscode/007.gif)

### Navigate to last edit location

A new command **Go to Last Edit Location** ( `workbench.action.navigateToLastEditLocation` ) was added to quickly navigate to the last location in a file that was edited. The default keybinding is  `⌘K ⌘Q` .

### Save without formatters

The new command **Save without Formatting** ( `workbench.action.files.saveWithoutFormatting` ) can be used to save a file without triggering any of the save participants (for example, formatters, remove trailing whitespace, final newline). The default keybinding is  `⌘K S` . This is useful when editing files outside your normal projects, which may have different formatting conventions.

### IntelliSense locality bonus

Suggestions can now be sorted based on their distance to the cursor. Set  `"editor.suggest.localityBonus": true`  and you'll see, for example, function parameters showing up at the top of the IntelliSense list.

![Locality bonus](/img/vscode/008.png)

### Smart selection for JavaScript and TypeScript

JavaScript and TypeScript now support [smart selection](https://code.visualstudio.com/updates/v1_33#_smart-select-api). This feature uses semantic knowledge to intelligently expand selections for expressions, types, statements, classes, and imports:

![Smart selection in a TypeScript file](/img/vscode/009.gif)

### 查找某个函数在哪些地方被调用了

比如我已经在 `a.js` 文件里调用了 `foo()` 函数. 那么, 如果我想知道 `foo()` 函数在其他文件中是否也被调用了, 该怎么做呢?

做法如下: 在 `a.js` 文件里, 选中 `foo()` 函数(或者将光标放置在 `foo()` 函数上), 然后按住快捷键「Shift + F12」, 就能看到 `foo()` 函数在哪些地方被调用了, 比较实用.

### 鼠标操作

- 在当前行的位置, 鼠标三击, 可以选中当前行.

- 用鼠标单击文件的**行号**, 可以选中当前行.

- 在某个**行号**的位置, **上下移动鼠标, 可以选中多行**.

## Emmet 的应用

vscode 中集成了 Emmet. Emmet 可以有效提升输入速度. 正常情况下, 编写 HTML 或者 CSS 时, 需要输入很多字符. 而现在有了 Emmet, 通过输入简写就行了.

- [Emmet 官网](https://emmet.io/)
- [Emmet in Visual Studio Code](https://code.visualstudio.com/docs/editor/emmet)
- [Emmet-前端开发神器](https://segmentfault.com/a/1190000007812543)

### 快速输入 HTML

如果熟悉 CSS 的语法, 你会发现 Emmet 就是很容易上手.

- `元素(Elements)` : 生成一个 HTML 元素
- `>` : 生成子元素
- `+` : 生成元素的兄弟节点
- `*` : 生成多个相同的元素

你可以 `.` 或者 `#` 来修饰元素, 给元素加上 `class` 或者 `id`

比如我们输入 `div.test>h3.title+ul>li*3>span.text` , 效果如下.

```html
<div class="test">
  <h3 class="title"></h3>
  <ul>
    <li><span class="text"></span></li>
    <li><span class="text"></span></li>
    <li><span class="text"></span></li>
  </ul>
</div>
```

![](/img/vscode/010.gif)

有些 HTML 元素有许多的属性, 在输入的过程中, 通过在标签后面加上 `:属性名` 就指定了元素的属性.

![](/img/vscode/011.gif)

### 快速输入 CSS

对于一些属性的名称较短的, 例如: `display` 与 `visibility` , 输入属性首字母与值的首字母即可. 比如: `df` 是 `display: block;` , `dn` 是 `display: none;` .

对于一些属性的值是数值, 例如: `padding` , `margin` , `left` , `width` 等, 输入属性首字母与值即可. 比如, `m1` 是 `margin: 1px;` . 单位默认是 `px` , 不过你可以指定一下单位, 比如: `w2vw` 就是 `width: 2vw;` . 当值是百分比时比较特殊, 字母 `p` 代表 `%` , 比如: `w5p` 就是 `width: 5%;` .

名称较长的属性往往含有连字符(-), 输入连字符前后两个单词的首字母再加上值即可. 比如: `pt10` 是 `padding-top: 10px;` .

![](/img/vscode/012.gif)

默认情况下, 不能在 js 文件中使用 Emmet. 在开发 React 项目时, 这会带来不便. 所以, 再调整一下 系统设置.

```json
{
  "emmet.includeLanguages": {
    "javascript": "javascriptreact"
  }
}
```

### Tag Wrapping

先选中需要添加父元素的子元素, 使用快捷键 `ctrl/cmd + shift + p` 或 `f1` 调出命令面板, 输入 `wrap` , 选择 `Emmet: Wrap Individual Lines with Abbreviation` , 输入父元素即可. 这个方法是对当前选中的文本添加父元素, 如果只对光标所在行添加, 选择 `Emmet: Wrap with Abbreviation` 即可

![](/img/vscode/013.gif)

### 内外平衡

这条建议来自  [https://vscodecandothat.com/](https://vscodecandothat.com/), 作者非常推荐它.

你可以使用   `balance inward`   和   `balance outward`   的 Emmet 命令在 VS 代码中选择整个标记. 将这些命令绑定到键盘快捷键是有帮助的, 例如   `Ctrl + Shift + 向上箭头` 用于平衡向外, 而   `Ctrl + Shift +向下箭头`   用于平衡向内.

![](/img/vscode/014.gif)

这里只是介绍一部分 Emmet 规则, 完整的列表点击[这里](https://docs.emmet.io/cheat-sheet/). 当你觉得有些输入很繁琐, 不妨查阅一下文档, 看看有无快捷输入的方式.

## 参考资料

- [微软 VS Code 开发技巧集锦](https://zhuanlan.zhihu.com/p/34989844)
- [VS Code Tips and Tricks](https://github.com/Microsoft/vscode-tips-and-tricks)
- [第一次使用 VS Code 时你应该知道的一切配置 - 掘金](https://juejin.im/post/5cb87c6e6fb9a068a03af93a)
- [VsCode 中使用 Emmet 神器快速编写 HTML 代码](https://www.cnblogs.com/summit7ca/p/6944215.html)
- [能让你开发效率翻倍的 VSCode 插件配置(上)](https://juejin.im/post/5a08d1d6f265da430f31950e)
- [能让你开发效率翻倍的 VSCode 插件配置(中)](https://juejin.im/post/5ad13d8a6fb9a028ce7c0721)
- [VS Code 折腾记 - (1) 扯淡](https://juejin.im/post/586cf732128fe10066602d43)
- [VS Code 折腾记 - (2) 快捷键大全, 没有更全](https://juejin.im/post/586e5a5cb123db005d0f2bd1)
- [VS Code 折腾记 - (3) 多图解 VSCode 基础功能](https://juejin.im/post/5880d3b9128fe10065ccaf27)
- [VS Code 折腾记 - (4) 常用必备插件推荐【前端】](https://juejin.im/post/58a691f461ff4b006c4981a0)
- [VS Code 折腾记 - (5) Angular 2+ && Typescript 2+必备插件推荐](https://juejin.im/post/58a6f518ac502e006cc4ee2a)
- [VS Code 折腾记 - (6) 基本配置/快捷键定义/代码片段的录入(snippet)](https://juejin.im/post/58aeeca22f301e006cf65c8b)
- [VS Code 折腾记 - (7) 内置 Debug 功能深入【调教 angular-cli 最新版】](https://juejin.im/post/58c0c2e344d90400697213f2)
- [VS Code 折腾记 - (8) 新一波实用插件推荐(前端)/NG2+/TS2/Vue/React/Node/版本控制/主题](https://juejin.im/post/592542c58d6d810058025d06)
- [VS Code 折腾记 - (9) 新一轮前端插件(代码质量/正则/版本控制/NG/Vue/React)](https://juejin.im/post/59a61edc5188252428611c6a)
- [VS Code 折腾记 - (10) 你想发布自己捣鼓的 snippets 到 VSCode 插件市场!](https://juejin.im/post/5a198dd36fb9a04504079336)
- [VS Code 折腾记 - (11) 再来一波插件推荐!(代码片段, 框架, Node, touchbar, TS, Git, 数据库, python!!)](https://juejin.im/post/5a1b869351882533d022c7f5)
- [VS Code 折腾记 - (12) 春节前的最后一波插件推荐(前端/协作/主题)](https://juejin.im/post/5a704d84518825734f5300c8)
- [VS Code 折腾记 - (13) VS Live Share (可提高效率的代码实时协作插件)的使用姿势](https://juejin.im/post/5afd4f99f265da0b8455a404)
- [VS Code 折腾记 - (14) 再来推荐一波大前端适用系列 (Node/React/Vue/小程序/主题/代码体验等) 的插件](https://juejin.im/post/5b3d9378f265da0f6012eb65)
- [VS Code 折腾记 - (15) 再来一波大前端适用系列的插件(主打编码体验改善)](https://juejin.im/post/5c356b106fb9a049ef26c368)
