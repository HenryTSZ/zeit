---
title: Mac 终端软件安装利器 - Homebrew
date: 2018-10-27
categories: [Software, Mac]
tags: [Homebrew]
---

[Homebrew](https://brew.sh/index_zh-cn.html) 是一款 `Mac OS` 平台下的软件包管理工具, 拥有安装、卸载、更新、查看、搜索等很多实用的功能. 简单的一条指令, 就可以实现包管理, 而不用你关心各种依赖和文件路径的情况, 十分方便快捷.

## Homebrew 怎么安装 ? 怎么卸载 ?

### 1、安装

确保你的 `Mac` 系统版本在 `OS X 10.9` 或以上

安装 `XCode` 或者 `Command Line Tools for Xcode` . 如果你使用 `XCode` 来进行软件的开发, 那么只需要在 `App Store` 中安装 `Xcode` 即可. 如果你并不使用 `Xcode` 这个庞然大物来编码, 那么可以安装 `Command Line Tools for Xcode` : 打开终端, 键入以下代码完成安装:

    xcode-select --install

在弹出的窗口选择 `Install` 以安装 `Command Line Tools` , 路径为 `/Library/Developer/CommandLineTools` , 如要卸载, 删除此文件夹即可.

安装 `Homebrew`. 打开终端, 输入以下代码, 稍等片刻, 输入密码, 等待安装完成

    /usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"

注: `Mac OS X 10.11` 系统以后, `/usr/local/` 等系统目录下的文件读写是需要系统 `root` 权限的, 以往的 `Homebrew` 安装如果没有指定安装路径, 会默认安装在这些需要系统 `root` 用户读写权限的目录下, 导致有些指令需要添加 `sudo` 前缀来执行, 如果你不想每次都使用 `sudo` 指令, 你有两种方法可以选择:

**1、安装 Homebrew 时对安装路径进行指定, 直接安装在不需要系统 root 用户授权就可以自由读写的目录下**

    <安装路径> -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"

**2、对 `/usr/local` 目录下的文件读写进行 root 用户授权**

    $ sudo chown -R $(whoami) /usr/local

### 2、卸载

打开终端, 输入以下代码, 稍等片刻, 输入密码, 等待卸载完成

    /usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/uninstall)"

注意前面的路径是当初安装时的路径

可以使用 `brew --repo` 查看安装路径

## Homebrew 有比较快的源(mirror)吗?

`homebrew` 主要分两部分: `git repo`(位于 `GitHub`)和二进制 `bottles`(位于 `bintray`), 这两者在国内访问都不太顺畅.

可以替换为 `Coding` 家的 `Homebrew` 源( 该源每 5 分钟和上游同步一次, 依托 `Coding` 遍布全国的 [Git 服务节点](http://Coding.net) , 让你的 `brew update` 更快!)

    cd "$(brew --repo)" && git remote set-url origin https://git.coding.net/homebrew/homebrew.git
    $ cd $home && brew update

两步搞定! 快来 `brew brew brew` !

## Homebrew 基本使用

- 安装任意包

  `$ brew install <packageName>`

  例如: 安装 `node`

  `$ brew install node`

- 卸载任意包

  `$ brew uninstall <packageName>`

  示例: 卸载 node

  `$ brew uninstall node`

- 查询可用包(一般需要英文名)

  `$ brew search <packageName>`

- 查看已安装包列表

  `$ brew list`

- 查看任意包信息

  `$ brew info <packageName>`

- 更新 Homebrew

  `$ brew update`

- 查看 Homebrew 版本

  `$ brew -v`

- Homebrew 帮助信息

  `$ brew -h`

### 搜索应用

就像在 `App Store` 中搜索应用一样, `HomeBrew` 也支持搜索, 而且它会同时从 `GitHub`、应用官网等多个源头搜索, 很容易找到需要的应用, 无广告、速度快.

比如我们需要安装 `chrome` 浏览器:

```shell
$ brew search chrome

==> Formulae
chrome-cli                                                   chrome-export

==> Casks
chrome-devtools                                              google-chrome
chrome-remote-desktop-host                                   mkchromecast
chromedriver                                                 homebrew/cask-versions/google-chrome-beta
dmm-player-for-chrome                                        homebrew/cask-versions/google-chrome-canary
epichrome                                                    homebrew/cask-versions/google-chrome-dev
```

我们可以看到 `HomeBrew` 提供了多种结果, `Formulae` : 一般这类都是命令行工具, 可以直接使用 `$ brew install <packageName>` 安装, 你还可以看到一类   `Casks`   的应用, 它们需要换个命令来安装: `$brew cask 应用名` , 就如其名字所代表的一样, `brew cask` (木桶)下载下来的是一个个打包好的   `.app`   文件.

那此时我们就需要使用 `brew cask google-chrome` 来安装 `chrome` 浏览器了

若想了解更多关于 `cask` 的内容, 请阅读:[借助 Homebrew Cask, 教你快速下载安装 Mac App 新姿势](https://tsz.now.sh/2018/11/07/with-homebrew-cask-you-can-quickly-download-and-install-new-poses-for-your-mac-app/)

### 更新应用和清理旧版

有的应用不会自动更新(或默认不打开), 其实通过 `HomeBrew` 的命令, 哪些应用需要更新一目了然, 即使它们不提供自动更新, 我们时不时去检查、更新一下也能保证应用处于最新版.

首先用下面的命令检查一下可更新的应用有哪些

    brew outdated

![outdated](/img/mac/051.png)

接下来更新一下可更新的应用. 一般我会更新所有应用, 所以我最常用的是这条命令:

    brew upgrade

但有时我们不想更新所有应用, 比如 `Chromium` 有个历史版本不禁用 `Flash`, 我一直留着它以应对那些食古不化的网站, 不希望 `Chromium` 更新到更高版本. 此时我们可以在上面那条命令的基础上加上需要更新的应用名, 避开不需要更新的应用:

    brew upgrade 应用名

![upgrade](/img/mac/052.png)

更新完后可以运行一下下面的命令, 把应用的旧版本和缓存删除.

    brew cleanup

![cleanup](/img/mac/053.png)

如果你只是想看看有哪些应用可以清理, 但暂时不需要处理它们, 则可以通过这个命令一窥究竟:

    brew cleanup -n

当然, 有的应用缓存和旧版应用是有用的(比如可能保存了我的用户配置文件), 那就不能一杆子打尽, 而是像指定更新个别应用一样, 指定需要清理缓存的应用:

    brew cleanup 应用名

### 访问应用官网

有时我们不确定自己是否需要更新一个应用, 比如, 它的新功能我是不是需要? 它的新版本适不适配我的系统? 纠结这些, 不如即刻去应用官网上一探究竟:

    brew home 应用名

## 参考资料

- [Mac 终端软件安装利器: Homebrew - 简书](https://www.jianshu.com/p/2ca8a4e47dff)
- [Homebrew 有比较快的源(mirror)吗? - 知乎](https://www.zhihu.com/question/31360766)
- [9 条进阶命令, 把 HomeBrew 打造成管理第三方应用的 App Store - 少数派](https://sspai.com/post/43451)
