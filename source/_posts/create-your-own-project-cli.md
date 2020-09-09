---
title: 打造属于自己的项目脚手架工具
date: 2020-08-14
categories: [FrontEnd, Js]
tags: [node, cli, Vue]
---

由于我们项目采用主框架 + `iframe` 方式嵌套页面( `Vue` 项目, 别问为什么这样做, 历史遗留): 主框架负责主页面布局及路由切换, 切换路由加载对应 `iframe` , 而 `iframe` 地址就是 `Vue` 项目打包后的路径; 所以每开发一个页面, 就需要新建一个 `Vue` 工程, 而这就出现问题了

<!-- more -->

1. 新建项目如果用 `vue-cli` 创建, 创建以后还需要加入自己的配置和下载第三方组件
2. 如果复制粘贴旧项目再 `CRUD` , 可能会有遗漏, 导致出现无用的代码; 又或者忘记改打包输出地址, 导致覆盖掉旧项目的打包文件; 而且大家一般不敢删 `package.json` 中的文件, 不知道这个依赖哪里使用了, 导致最后就像老太太的裹脚布--又臭又长
3. 提取出一个基础模版项目, 把一下公共配置和第三方组件都配置好, 大家每次新建项目都拷贝这个项目.

目前来看确实是第三种最优, 而且我们以前也都是这么干的, 但还是有一点瑕疵: 虽然将公共配置都配置好了, 但每个项目肯定有个性化设置, 最简单的就是打包地址, 这个肯定都不一样, 总会有人拷贝模版项目后忘记修改打包路径, 导致编译以后找不到文件, 最后才发现这个问题, 还要修改后再打包

所以我们需要创建一个像 `vue-cli` 那样的工具, 通过我们输入或选择后, 生成我们想要的项目框架

## 实现思路

说实话做之前对脚手架工具就是仰望高端玩家的视角, 但做了之后发现实现一个简单易用的脚手架工具还真不难, 甚至挺有意思的.

整体的实现步骤是这样的:

### 创建脚手架执行文件

在终端执行下面命令:

``` sh
mkdir my-cli
cd my-cli
npm init -y
touch index.js
```

在 `index.js` 中输入如下内容:

``` sh
#!/usr/bin/env node
console.log('hello node')
```

**注意: 在使用 `Node` 开发命令行工具时, 所执行的入口 `js` 脚本中头部必须加入 `#!/usr/bin/env node` 声明**

`#!/usr/bin/env node` 的意思就是找到对应的 `node` 脚本解释器来解释后面的内容.

在 `my-cli` 根目录下执行 `node index.js` 就可以看到控制台输出 `hello node` .

在 `package.json` 中增加 `bin` 字段:

``` json
"bin": {
  "my-cli": "index.js"
}
```

然后使用  `npm-link`  命令把这个文件映射到全局后, 就可以在任意目录下的命令行中输入  `my-cli`  执行我们的 `index.js` 脚本文件:

![link](/img/node/002.png)

输入 `npm list -g --depth=0` 可以查看已安装的全局模块

![list](/img/node/003.png)

到这里, 我们已经成功将一个脚本文件映射到全局, 也就是只要我们输入 `package.json` 中 `bin` 配置的 `key` 值也就是 `my-cli` 就可以执行我们 `my-cli` 文件夹下的 `index.js` 脚本了.

似乎有点内味了, 接下来就用 `commander.js` 去为我们的 `my-cli` 指令添加参数并且解析, 然后完成一系列的操作.

### 使用 commander.js 解析命令行指令参数

> commander.js: 完整的 [node.js](http://nodejs.org/) 命令行解决方案, 灵感来自 Ruby 的 [commander](https://github.com/commander-rb/commander).
