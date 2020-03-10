---
layout: post
title: Reg 正则中的问题
date: 2020-03-05
categories: [FrontEnd, Js]
tags: [Js, Reg]
keywords:
---

## `/[~!@#$%^&*()_+-=|\\{}\[\]:";'<>?,./]/` 这个正则怎么会匹配到数字呢?

### 问题

最近在群里看到有童鞋问了这么一个问题:

> `/[~!@#$%^&*()_+-=|\\{}\[\]:";'<>?,./]/` 这个正则怎么会匹配到数字呢?

看这个样子应该是匹配特殊字符的正则, 验证了一下, 发现确实可以匹配数字

![匹配到数字](/img/reg/002.png)

注: 所有数字均可以匹配, 这里只列出几个

### 尝试

一开始以为是通配符(`.`)引起的, 给 `.` 转义后, 发现仍然能匹配到数字(其实上图中已经排除通配符了, 因为字母并没有匹配到); 又发现里面有好多特殊字符, 比如 `$^*()+|{}?,` 等, 那是这些引起的吗? 先转义试试:

`/[~!@#\$%\^&\*\(\)_\+-=\|\\\{\}\[\]:";'<>\?,\./]/`

![转义后](/img/reg/003.png)

发现还是可以匹配到数字, 而且 `,` 不可以转义, 转义后什么也匹配不了了

最后查阅资料才发现

| 语法   | 说明                                                                                                                                                                                                                                                                        | 表达式示例 | 完整匹配的字符串 |
|--------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|----------|---------------|
| [...] | 字符集(字符类). 对应的位置可以是字符集中任意字符. 字符集中的字符可以逐个列出, 也可以给出范围, 如 `[abc]` 或 `[a-c]`. 第一个字符如果是 `^` 则表示取反, 如 `[^abc]` 表示不是 `abc` 的其他字符. 所有的特殊字符在字符集中都失去其原有的特殊含义. 在字符集中如果要使用 `]`、`-` 或 `^`, 可以在前面加上反斜杠, 或把 `]` 放在第一个字符, 把 `-` 放在第一个或最后一个字符, 把 `^` 放在非第一个字符. | a[bcd]e  | abe ace ade   |

关于以上知识, 在这篇 [PHP: 字符类(方括号) - Manual](https://www.php.net/manual/zh/regexp.reference.character-classes.php) 文章中也提到了, 虽然和 `js` 有点出入, 但意思是相通的

难怪转义完了没效果, 原来特殊字符都失去原有意义了.

### 解决

有特殊意义的只有 `]`、`-` 和 `^` 这三个, 那再修改一下就可以了吧:

`/[\]~!@#$%^&*()_+=|\\{}[:";'<>?,./-]/`

![成功](/img/reg/004.png)

### 疑惑

1. `]` 放到首字符后什么也匹配不到了, 目前只能转义
2. `,` 转义后就什么也匹配不到了
3. `-` 究竟是根据哪些字符判断出匹配范围包括数字的?

关于第三点:

目前只知道 `+-=` 这个正则可以匹配到数字, 而且不仅匹配到数字, 还匹配到额外到字符:

![+-=](/img/reg/005.png)

而 `--_` 竟然还能额外匹配所有字母:

![--_](/img/reg/006.png)

将 `+-=` 和 `--_` 的第一个字符替换为数字还会有意想不到的发现

但目前仍未知道其原理