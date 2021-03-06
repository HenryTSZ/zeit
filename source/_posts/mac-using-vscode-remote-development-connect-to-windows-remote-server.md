---
title: Mac 使用 VS Code 配合 Remote Development 插件连接 Windows 远程服务器
date: 2020-10-11
categories: [Software]
tags: [Vscode, Remote]
thumbnail: /img/vscode/thumbnail.png
---

鲁迅曾经说过:

> 前端开发, 必备两台显示器: 一台 Code, 另一台 View

<!-- more -->

## 现状

大佬说过的话, 咱肯定要照做呀(鲁迅: 我可没说过!). 以前确实是这样的: `Mac` 电脑编写代码并起服务, `Windows` 通过 `ip` 访问服务来浏览效果, 开发体验杠杠的

奈何天不遂人愿, 最近公司整改 `Wi-Fi` , 硬生生把上传速度从 `10Mb/s` 限制到 `500kb/s` , 这一下可苦了, 刷新一下页面要等一分多钟才能加载完成, 这整天啥也不用干了, 就等刷新时间了

无奈只能问问 `IT` 同事看看有没有办法解决, 毕竟这只是内网互传呀, 你说访问公网上传限制就限制一下吧, 内网还限制啥呀. 最后得到的结论就是:

> 不要用 `Wi-Fi` , 使用网线

好吧, 看来 `Wi-Fi` 以后是不能用了, 上京东看看扩展坞吧, 好家伙, 都得一百多, 这么一想, 刷新后等一分钟也是可以接受的嘛(🐶)

难道就没有别的办法了吗?

办法肯定是有的啦, 那就是使用 `VS Code` 的远程开发功能; 又省了一百大洋, 离买房计划又进了一步(😊)

## 介绍

微软在 `PyCon 2019` 大会上发布了 `VS Code Remote` , 从 `1.35.0` 版本正式提供可以在本地编辑远程开发环境的文件的功能, 所以首先确保你的 `VS Code` 版本是在这个之上的才能体验到.

`VS Code` 远程开发的工作原理, 大致是这样的:

![architecture](/img/vscode/023.png)

官方文档: [Visual Studio Code Remote Development](https://code.visualstudio.com/docs/remote/remote-overview)

## Windows 准备工作 (Win 10)

### 安装 OpenSSH

从开始菜单打开 `设置` , 然后选择 `应用和功能` , 这里就有一个 `管理可选功能` 的选项.

![application and function](/img/vscode/029.png)

点击之后便可以看到一个可选功能, 选择 `OpenSSH` 服务器即可, 一般情况下是没有安装的. 如果没有安装的话它会提示一个安装按钮, 这里我已经安装好了, 就提示了一个卸载按钮.

![OpenSSH](/img/vscode/030.png)

OK, 有了它, 直接点击安装即可完成 `OpenSSH` 服务器的安装.

当然如果你是想批量部署 `Windows` 服务器的话, 当然是推荐使用 `PowerShell` 来自动化部署了.

首先需要用管理员身份启动 `PowerShell` (在开始菜单右键选择)

![admin PowerShell](/img/vscode/031.png)

使用如下命令看一下, 要确保 `OpenSSH` 可用于安装:

```BASH
Get-WindowsCapability -Online | ? Name -like 'OpenSSH*'
```

输出应该是类似的结果:

```BASH
Name  : OpenSSH.Client~~~~0.0.1.0
State : NotPresent
Name  : OpenSSH.Server~~~~0.0.1.0
State : NotPresent
```

上面输出表示 `OpenSSH` 的客户端和服务端均不存在

我们这里只需要服务端: 如果 `Server` 的状态为 `Installed`, 就表示已经安装完成

观看下面的[配置 OpenSSH](https://tsz.now.sh/2020/10/11/mac-using-vscode-remote-development-connect-to-windows-remote-server/#%E9%85%8D%E7%BD%AE-OpenSSH) 即可

如果状态为 `NotPresent` 就需要执行下面的命令来安装了

然后使用 `PowerShell` 安装服务器即可:

```BASH
Add-WindowsCapability -Online -Name OpenSSH.Server~~~~0.0.1.0
```

输出结果类似:

```BASH
Path          :
Online        : True
RestartNeeded : False
```

这样也可以完成 `OpenSSH` 的安装.

### 配置 OpenSSH

安装完成之后, 就需要进行一些初始化配置了, 还是以管理员身份, 使用 `PowerShell` 执行即可.

首先需要开启 `SSHD` 服务:

```BASH
Start-Service sshd
```

然后设置服务的自动启动:

```BASH
Set-Service -Name sshd -StartupType 'Automatic'
```

最后确认一下防火墙是否是放开的:

```BASH
Get-NetFirewallRule -Name *ssh*
```

如果是放开的, 那么结果会提示 `OpenSSH-Server-In-TCP` 这个状态是 `enabled` .

好了, 完成如上操作之后我们就可以使用 `SSH` 来连接我们的 `Windows` 服务器了.

## Mac 准备工作

### 安装 VS Code 并下载插件

首先你需要有 `VS Code` , 没有的话尽快去官网下载. 这里有一份完整配置, 请查收: [VSCode 完整版配置 | Henry](https://tsz.now.sh/2018/09/05/vscode-complete-config/)

下载远程插件: [Remote - SSH - Visual Studio Marketplace](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-ssh), [轻轻点我安装](vscode:extension/ms-vscode-remote.remote-ssh)

安装后在侧边栏和左下角均有显示

![installed](/img/vscode/024.png)

### 配置远程连接

首先点侧边栏的「远程资源管理器」之后点击「设置按钮」, 进入远程机器(代指 `Windows` , 下同)配置界面.

![settings](/img/vscode/025.png)

修改 `ssh` 配置文件, 用于登录远程机器, 各项含义在图中有说明.

![config](/img/vscode/026.png)

![set config](/img/vscode/027.png)

点击连接, 登录远程服务器, 需要输入远程服务器的密码(后面会教你怎么免密登录), 输入确认即可. 第一次连接会做 `VS Code Server` 的初始化工作比较慢, 耐心等待.

![connect](/img/vscode/028.png)

登录成功, 即可像操作本地环境一样, 在 `VS Code` 客户端操作远程云主机上的文件. 注意, 此时「打开文件夹」已经是远端机器上的目录结构了.

安装的插件是在云服务器的 `VS Code` 上, 对本机的 `VS Code` 没有影响, 插件在远端提供功能, 比如代码审查、自动补齐等等, 而这所有的一切就像在本地操作一样, 对文件的更改也是直接操作的云主机上的文件, 丝滑连接.

![extension](/img/vscode/032.png)

## 配置 SSH 免密登录

按照上面的配置步骤, 每次连接到远程服务器, 都需要输入服务器登录密码很麻烦, 可以配置 `SSH` 免密登录, 免去每次输入密码的烦恼, 具体操作步骤如下:

### Mac 生成 ssh-key

在终端, 输入 `ssh-keygen -t rsa` 生成秘钥对. 关于这个命令可以参考: [如何生成 SSH key 及查看 SSH key - Rh 九尾鱼 - 博客园](https://www.cnblogs.com/zheng577564429/p/8317524.html), [SSH key 的介绍与在 Git 中的使用 - 简书](https://www.jianshu.com/p/1246cfdbe460), 这里不多赘述

打开生成的秘钥保存路径: `cd ~/.ssh/` , 拷贝 `id_rsa.pub` 文件中的内容以备后面使用

### Windows 接收 ssh-key

打开秘钥保存路径: `cd ~/.ssh/` , 如果没有的话也生成一下, 不过这个秘钥用不到, 只是需要这个路径.

新建文件: `authorized_keys` , 将从 `Mac` 拷贝的 `id_rsa.pub` 中的内容复制到该文件中

再次尝试远程连接, 如果实现免密登陆, 那么就不用往下看了, 安心享受丝滑般的编码体验吧

如果还是需要密码, 那么接着往下看

还是以管理员身份运行 `PowerShell` 打开 `OpenSSH` 配置文件

```BASH
cd C:\ProgramData\ssh\

vim sshd_config
```

注释相关行:

```BASH
#Match Group administrators
# AuthorizedKeysFile __PROGRAMDATA__/ssh/administrators_authorized_keys
```

允许使用 `sshd_config` 文件中的 `RSA` 密钥访问 `Windows` :

```BASH
PubkeyAuthentication yes
```

并禁用 `ssh` 密码登录:

```BASH
PasswordAuthentication no
```

将更改保存到 `sshd_config` 后, 不要忘记重新启动 `sshd` 服务.

```BASH
restart-service sshd
```

好了, 这次可以免密登陆啦

## 问题

### 长时间不操作就断开连接

在连接远程服务器的时候出现一段时间不操作连接断开的解决方法:

找到 `sshd_config` 配置文件进行编辑:

```BASH
sudo vim /etc/ssh/sshd_config
```

在其中找到以下配置项目:

```BASH
#ClientAliveInterval 0
#ClientAliveCountMax 3
```

去除注释并修改

```BASH
ClientAliveInterval 60
ClientAliveCountMax 3
```

`ClientAliveInterval` 指定了服务器端向客户端请求消息的时间间隔, 默认是 `0` , 不发送. 而 `ClientAliveInterval 60` 表示每分钟发送一次, 然后客户端响应, 这样就保持长连接了.

`ClientAliveCountMax` , 使用默认值 `3` 即可. `ClientAliveCountMax` 表示服务器发出请求后客户端没有响应的次数达到一定值, 就自动断开. 正常情况下, 客户端不会不响应.

重启 `sshd service`

```BASH
sudo launchctl unload /System/Library/LaunchDaemons/ssh.plist
sudo launchctl load -w /System/Library/LaunchDaemons/ssh.plist
```

或者

```bash
sudo launchctl stop com.openssh.sshd
sudo launchctl start com.openssh.sshd
```

## 参考资料

- [如何使用 SSH 控制连接 Windows 服务器 | 静觅](https://cuiqingcai.com/6509.html)
- [手把手教你配置 VS Code 远程开发工具, 工作效率提升 N 倍 - 知乎](https://zhuanlan.zhihu.com/p/141344165)
- [Configuring SSH Key-Based Authentication on Windows 10/ Server 2019 | Windows OS Hub](http://woshub.com/using-ssh-key-based-authentication-on-windows/)
- [使用 VS Code 配合 Remote Development 插件连接远程服务器(Mac/Linux+Windows) | Using VS Code with Remote Development Connect to Remote Server (Mac/Linux+Windows) - 天靖居士 - 博客园](https://www.cnblogs.com/kkyyhh96/p/11026814.html)
- [Connecting to GitHub with SSH - GitHub Docs](https://docs.github.com/en/free-pro-team@latest/github/authenticating-to-github/connecting-to-github-with-ssh)
- [SSH key 的介绍与在 Git 中的使用 - 简书](https://www.jianshu.com/p/1246cfdbe460)
- [如何生成 SSH key 及查看 SSH key - Rh 九尾鱼 - 博客园](https://www.cnblogs.com/zheng577564429/p/8317524.html)
- [使用 VS Code 配合 Remote Development 插件连接远程服务器(Mac/Linux+Windows) | Using VS Code with Remote Development Connect to Remote Server (Mac/Linux+Windows) - 天靖居士 - 博客园](https://www.cnblogs.com/kkyyhh96/p/11026814.html)
- [windows 上安装 openSSH 服务\_慧写代码-CSDN 博客](https://blog.csdn.net/hehuihh/article/details/90575791)
- [windows 下使用 vscode 远程连接 Linux 服务器进行开发 - 简书](https://www.jianshu.com/p/df7b2842d105)
- [How To Restart SSH Service under Linux / UNIX - nixCraft](https://www.cyberciti.biz/faq/howto-restart-ssh/)
