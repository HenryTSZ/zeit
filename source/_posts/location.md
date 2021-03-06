---
layout: post
title: Location 对象
date: 2018-03-02
categories: [FrontEnd, Js]
tags: [Js, Location]
---

`Location` 对象包含有关当前 `URL` 的信息.

`Location` 对象是 `Window` 对象的一个部分, 可通过 `window.location` 属性来访问.

<!-- more -->

## Location 对象属性

| 属性     | 描述                                                                                          | 例子                                                   | 返回值                                   |
| -------- | --------------------------------------------------------------------------------------------- | ------------------------------------------------------ | ---------------------------------------- |
| <div style="width: 77px">href</div>     | 设置或返回完整的 URL.                                                                         | `http://example.com:1234/test.htm#part2`               | `http://example.com:1234/test.htm#part2` |
| host     | 设置或返回主机名和当前 URL 的端口号. 相当于 hostname + port, 当端口为 80 时, 和 hostname 一样 | `http://example.com:1234/test.htm#part2`               | `example.com:1234`                       |
| hostname | 设置或返回当前 URL 的主机名.                                                                  | `http://example.com:1234/test.htm#part2`               | `example.com`                            |
| port     | 设置或返回当前 URL 的端口号.                                                                  | `http://example.com:1234/test.htm#part2`               | `1234`                                   |
| protocol | 设置或返回当前 URL 的协议.                                                                    | `http://example.com:1234/test.htm#part2`               | `http:`                                  |
| pathname | 设置或返回当前 URL 的路径部分.                                                                | `http://example.com:1234/test.htm#part2`               | `/test.htm`                              |
| hash     | 设置或返回从井号 (#) 开始的 URL(锚).                                                          | `http://example.com:1234/test.htm#part2`               | `#part2`                                 |
| search   | 设置或返回从问号 (?) 开始的 URL(查询部分).                                                    | `http://example.com:1234/test/t.asp?f=hdom_loc_search` | `?f=hdom_loc_search`                     |

注: **当 `URL` 同时存在 `#` 和 `?` 时, 当 `?` 在 `#` 前面, `search` 能正确截取, 当 `?` 在 `#` 后面, `search` 返回为空字符串; 而 `hash` 只会从 `#` 开始截取到结尾, 不受位置影响**

**当一个 `Location` 对象被转换成字符串, `href` 属性的值被返回. 这意味着你可以使用表达式 `location` 来替代 `location.href`.**

很多时候我们需要验证拿到的是否是我们想要的参数, 难道只能先在浏览器地址栏打开 `URL`, 再从 `window.location` 中获取? 其实我们可以先创建一个 `a` 标签然后将需要解析的 `URL` 赋值给 `a` 的 `href` 属性, 然后就得到了一切我们想要的了.

```js
var a = document.createElement('a')
a.href = 'https://tsz.now.sh/2018/03/02/location'
console.log(a.host) // tsz.now.sh
```

利用这一原理, 稍微扩展一下, 就得到了一个更加健壮的解析 `URL` 各部分的通用方法了.

```js
function parseURL(url) {
  var a = document.createElement('a')
  a.href = url
  return {
    href: url,
    protocol: a.protocol.replace(':', ''),
    host: a.host,
    hostname: a.hostname,
    port: a.port,
    query: a.search,
    params: (function () {
      var ret = {},
        seg = a.search.replace(/^\?/, '').split('&'),
        len = seg.length,
        i = 0,
        s
      for (; i < len; i++) {
        if (!seg[i]) {
          continue
        }
        s = seg[i].split('=')
        ret[s[0]] = s[1]
      }
      return ret
    })(),
    pathname: a.pathname,
    file: (a.pathname.match(/\/([^\/?#]+)$/i) || [, ''])[1],
    hash: a.hash.replace('#', ''),
    path: a.pathname.replace(/^([^\/])/, '/$1'),
    relative: (a.href.match(/tps?:\/\/[^\/]+(.+)/) || [, ''])[1],
    segments: a.pathname.replace(/^\//, '').split('/'),
  }
}
```

你可以在下面输入框中输入需要查询的 `url` 来体验一下!

<style type="text/css">
  #input {
    -webkit-appearance: none;
    background-color: #fff;
    background-image: none;
    border-radius: 4px;
    border: 1px solid #dcdfe6;
    box-sizing: border-box;
    color: #606266;
    display: inline-block;
    font-size: inherit;
    height: 40px;
    line-height: 40px;
    outline: none;
    padding: 0 15px;
    transition: border-color .2s cubic-bezier(.645,.045,.355,1);
    width: 100%;
  }
  #input:focus {
    outline: none;
    border-color: #409eff;
  }
  #pre {
    visibility: hidden;
  }
</style>
<input id="input" type="text" autocomplete="off" placeholder="请输入内容" oninput="search()">
<pre id="pre">
  <code id="code"></code>
</pre>
<script>
  var input = document.getElementById('input')
  var pre = document.getElementById('pre')
  var code = document.getElementById('code')
  function search() {
    if (input.value.trim()) {
      pre.style.visibility = 'visible'
      code.innerHTML = JSON.stringify(parseURL(input.value), null, '\t')
    } else {
      pre.style.visibility = 'hidden'
      code.innerHTML = ''
    }
  }
  function parseURL(url) {
    var a = document.createElement('a')
    a.href = url
    return {
      href: url,
      protocol: a.protocol.replace(':', ''),
      host: a.host,
      hostname: a.hostname,
      port: a.port,
      query: a.search,
      params: (function () {
        var ret = {},
          seg = a.search.replace(/^\?/, '').split('&'),
          len = seg.length,
          i = 0,
          s
        for (; i < len; i++) {
          if (!seg[i]) {
            continue
          }
          s = seg[i].split('=')
          ret[s[0]] = s[1]
        }
        return ret
      })(),
      pathname: a.pathname,
      file: (a.pathname.match(/\/([^\/?#]+)$/i) || [, ''])[1],
      hash: a.hash.replace('#', ''),
      path: a.pathname.replace(/^([^\/])/, '/$1'),
      relative: (a.href.match(/tps?:\/\/[^\/]+(.+)/) || [, ''])[1],
      segments: a.pathname.replace(/^\//, '').split('/')
    }
  }
</script>

如果需要处理复杂的 `URL`, 请看[这篇](https://tsz.now.sh/2019/03/14/get-the-parameters-in-the-URL)

## Location 对象方法

| 属性      | 描述                    |
| --------- | ----------------------- |
| assign()  | 加载新的文档.           |
| reload()  | 重新加载当前文档.       |
| replace() | 用新的文档替换当前文档. |
