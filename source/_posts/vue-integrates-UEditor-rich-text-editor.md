---
layout: post
title: Vue 集成 UEditor 富文本编辑器
date: 2018-03-05
categories: [FrontEnd, Vue]
tags: [Vue]
thumbnail: /img/vue/thumbnail.png
---

`vue` 是前端开发者所追捧的框架, 简单易上手, 但是基于 `vue` 的富文本编辑器大多数太过于精简. 于是我将百度富文本编辑器放到 `vue` 项目中使用.

<!-- more -->

## 基础配置

01. 下载 `UEditor` 源码.[UEditor - 下载](https://ueditor.baidu.com/website/download.html)
02. 把项目复制到 `vue` 项目的 `static` 文件下. 目的是让服务可以访问到里面的文件.
03. 在 `.vue` 文件中引入主要 `js` 文件

    ``` js
    import '/static/utf8-jsp/ueditor.config'
    import '/static/utf8-jsp/ueditor.all'
    import '/static/utf8-jsp/lang/zh-cn/zh-cn'
    ```

    引入方式不必局限在上面这一种, 上面的引入方式会在组件初始化就执行 `ue` 编辑器的 `js` 代码, 也可以在需要 `ue` 时, 动态创建 `script` 标签, 再引入上面的 `js` 文件

04. 在 `data` 中声明一个变量存储 `UEditor` 的实例, 方便以后操作 `UEditor` ; 然后再声明一个变量用于初始化写入编辑器的内容和存储编辑器里面的内容
05. 在 `html` 部分写一个 `div` 标签

    ``` html
    <div id="editor" type="text/plain" style="width: 1024px; height: 500px;"></div>
    ```

06. 在 `vue` 的 `mounted` 钩子函数中调用编辑器的方法生成实例存储到刚刚声明的变量中, 在实例中传入参数. 第一个是 `id` , `id` 是生成编辑器的 `div` 的 `id` . 第二个参数是一个对象, 对象内容是对编辑器的配置. 如资源访问路径, `toolbars` 内容配置, 具体配置可以在 `ueditor.config.js` 中查找

    ``` js
    this.ue = window.UE.getEditor('editor', {
      BaseUrl: '',
      UEDITOR_HOME_URL: '/static/utf8-jsp/'
      // 这个 UEDITOR_HOME_URL 就是配置编辑器自己访问自己所需要的依赖的路径。
      // 设置到存放的文件下，utf8-jsp 是编辑器文件的根目录。目录不一样可自行更改
    })
    ```

07. 然后保存，就可以在界面上显示一个完整的富文本编辑器
08. 如果要获取编辑器内容则使用 `this.ue.getContent()`
09. 如果要设置内容则使用 `this.ue.setContent('需要设置的内容')` ;
10. 更多方法参考官方文档 [UEditor Docs](http://fex.baidu.com/ueditor/)

## 上传配置

按照上述步骤就可以在页面中显示 `UEditor`, 但此时上传仍不能使用

点击上传按钮会提示 `后端配置项没有正常加载，上传插件不能正常使用！` , 并且控制台报错 `后台配置项返回格式出错，上传功能将不能正常使用！`

出现这种情况是由于请求没有返回 `config.json`

需要修改 `ueditor.config.js` 的 `serverUrl`

注: **本人使用的是 `jsp` 版本 `utf-8` 版的, 这个 `config.json` 在下载文件解压后的 `jsp` 文件夹里面. 在这个 `json` 文件中是前后端通信相关的配置, 包括上传路径, 文件格式限制等**

下面是 `json` 配置的部分代码

``` js
"imageActionName": "uploadimage", /* 执行上传图片的action名称 */
"imageFieldName": "upfile", /* 提交的图片表单名称 */
"imageMaxSize": 2048000, /* 上传大小限制，单位B */
"imageAllowFiles": [".png", ".jpg", ".jpeg", ".gif", ".bmp"], /* 上传图片格式显示 */
"imageCompressEnable": true, /* 是否压缩图片,默认是true */
"imageCompressBorder": 1600, /* 图片压缩最长边限制 */
"imageInsertAlign": "none", /* 插入的图片浮动方式 */
"imageUrlPrefix": "", /* 图片访问路径前缀 */
"imagePathFormat": "/ueditor/jsp/upload/image/{yyyy}{mm}{dd}/{time}{rand:6}"
```

解决这种问题需分两种情况讨论:

1.  我不需要上传文件，而且我也在 `toolbars` 中将所有上传按钮都干掉了，但控制台还是报错
2.  我需要上传文件，需要解决这个问题

### 先解决第一种情况

要么将 `ueditor.config.js` 的 `serverUrl` 这行代码注释掉

``` js
// 服务器统一请求接口路径
// serverUrl: URL + 'jsp/controller.jsp',
```

要么在 `vue` 初始化 `ue` 配置项里配置 `serverUrl` , 推荐这种, 尽量不要修改源码

``` js
this.ue = window.UE.getEditor('editor', {
  BaseUrl: '',
  UEDITOR_HOME_URL: 'static/utf8-jsp/',
  serverUrl: ''
  // serverUrl 可取的值： '', undefined, false 或者指向本地的 json 上传配置文件: '/static/plugin/ue/jsp/config.js'
})
```

### 解决第二种情况

这种情况需要后端支持

前端先配置请求接口

例如:

``` js
this.ue = window.UE.getEditor('editor', {
  BaseUrl: '',
  UEDITOR_HOME_URL: 'static/utf8-jsp/',
  serverUrl: '/api/ue/config'
  // 这个 url 路径是和后台商量好的，保证访问这个接口可以返回 config.json
})
```

后端配置:

百度富文本编辑器(`ueditor`)上传配置自定义, 使用 `SpringMvc` 实现

第一步:

`config` 获取, 其实使用他自带的 `controller`, 在初始化时会调用 `controller` 并且参数 `action` 为 `config` 的请求. 这个请求主要目的是为了获取 `config.json` 内的 `json` 字符串. 其实我们可以自己读取并返回, 不需要 `ueditor` 的依赖包. 代码如下:

``` java
@RequestMapping("config")
@ResponseBody
public String viewConfig(String action, HttpServletRequest request, HttpServletResponse response) {
  String rootPath = this.getClass().getResource("/").getPath();
  // return new ActionEnter( request, rootPath ).exec();
  if ("config".equals(action)) {
    try {
      return readFile(rootPath + "ueditor/config.json");
    } catch (IOException e) {
      e.printStackTrace();
      return "{\"state\":\"配置文件不存在\"}";
    }
  } else {
    return "{\"state\":\"功能屏蔽\"}";
  }
}

private String readFile(String path) throws IOException {
  StringBuilder builder = new StringBuilder();
  try {
    InputStreamReader reader = new InputStreamReader(new FileInputStream(path), "UTF-8");
    BufferedReader bfReader = new BufferedReader(reader);

    String tmpContent = null;
    while ((tmpContent = bfReader.readLine()) != null) {
      builder.append(tmpContent);
    }
    bfReader.close();
  } catch (UnsupportedEncodingException localUnsupportedEncodingException) {
  }
  return filter(builder.toString());
}

private String filter(String input) {
  return input.replaceAll("/\\*[\\s\\S]*?\\*/", "");
}
```

注意修改 `ueditor.config.js` 中 `serverUrl` 为以上自定义的 `controller`.

``` java
// 服务器统一请求接口路径
serverUrl: URL + "api/ue/config"
```

这样就能去掉 `ueditor` 的依赖包, 可以试试插件启动正常.

第二步:

接下来就是上传文件了

在引用组件的地方插入以下代码在上传文件时会自动调用以下 `action` 地址上传:

``` java
UE.Editor.prototype._bkGetActionUrl = UE.Editor.prototype.getActionUrl;
UE.Editor.prototype.getActionUrl = function(action) {
  if (action == 'uploadimage' || action == 'uploadscrawl' || action == 'uploadvideo'){
    return '/file/upload';   //上传文件的action地址
  } else {
    return this._bkGetActionUrl.call(this, action);
  }
}
```

..... 上传文件的 `action` 这里就不贴代码了, 网上很多

好了, 至此 `ue` 都配置完成

## 常见问题

### 百度富文本编辑器 UEditor 1.4.3 插入视频后路径被清空问题

版本: `UEditor 1.4.3.3 jsp utf-8`

<del>解决方法: 把 ueditor.config.js 368 行中的  whitList 修改为 whiteList</del>

解决方法:(感谢 ybzhkz 分享!)

[Update ueditor.config.js by relaxio · Pull Request #2957 · fex-team/ueditor](https://github.com/fex-team/ueditor/pull/2957/commits/d4b875ce165b3225929496c2d85848afbff0deeb?diff=split)

> `xssFilter` 导致插入视频异常, 编辑器在切换源码的过程中过滤掉 `img` 的 `_url` 属性(用来存储视频 `url`) `_src/plugins/video.js` 里处理的是 `_url`, 而不是 `_src`

修改 `ueditor.config.js`:

``` js
img: ['src', 'alt', 'title', 'width', 'height', 'id', '_src', '_url', 'loadingclass', 'class', 'data-latex'],
```

``` js
video: ['autoplay', 'controls', 'loop', 'preload', 'src', 'height', 'width', 'class', 'style'],
  source: ['src', 'type'],
  embed: ['type', 'class', 'pluginspage', 'src', 'width', 'height', 'align', 'style', 'wmode', 'play', 'loop', 'menu', 'allowscriptaccess', 'allowfullscreen']
```

### 使用百度编辑器 ueditor 表格无法显示边框以及边框颜色等系列问题解决方案

**第一步, 设置 `ueditor.all.js` 文件, 在如下位置设置边框效果:**

![](/img/vue/007.png)

这样, 我们就设置了一个简单的效果.

**第二步, 设置 `ueditor.config.js` 文件, 在如下位置设置允许使用属性 `cellpadding` 和 `cellspacing`:**

![](/img/vue/008.png)

这样, 整个设置就完成了, 这里我们在页面上不需要设置引用什么 `ueditor.parse.js` 文件

**第三步, 我们就需要在使用 `ueditor` 的页面来使用我们的设置了, 过程如下:**

![](/img/vue/009.jpg)

![](/img/vue/010.jpg)

![](/img/vue/011.jpg)

`ueditor` 页面显示效果:

![](/img/vue/012.jpg)

### 如何让某一元素内的内容不被 `reset.css` 重置?

突然在网上看到说用 `iframe`, 觉得完全可行啊, 把富文本编辑器输出的内容嵌入到一个 `iframe` 中就可以完美解决这个问题啊

关于被 `reset.css` 重置的解决方法(Vue 版):

.vue 文件

``` html
<!-- 利用 iframe 可以使 reset.css 不起作用；动态 src 是为了重新加载 html 页面，避免缓存 -->
<iframe :id="iframeId" v-if="showIframe" :src="src" width="100%" height="100%" frameborder="0"></iframe>
```

``` js
data() {
  return {
    iframeId: `iframe_${Math.random().toString().substr(2)}` ,
    src: '',
    showIframe: false
  }
},
methods: {
  // 保存 ue 内容
  saveValue (value) {
    sessionStorage.setItem(this.iframeId, value)
    this.src = `/static/ueditor.html?id=${this.iframeId}&_t=${Date.now()}`
    this.showIframe = true
  }
},
beforeDestroy() {
  sessionStorage.removeItem(this.iframeId)
}
```

ueditor.html 文件

``` html
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta http-equiv="X-UA-Compatible" content="ie=edge" />
  <title>Document</title>
  <!-- ue 使用的是 video.js 处理视频播放，这里需要引入 -->
  <link rel="stylesheet" href="/static/plugin/video-js/video-js.min.css" />
  <script src="/static/plugin/video-js/video.js"></script>
  <style type="text/css">
    html,
    body {
      padding: 0;
      margin: 0;
    }
  </style>
</head>

<body>
  <div id="uePreview"></div>
</body>
<script>
  var params = getParams()
  document.getElementById('uePreview').innerHTML = sessionStorage.getItem(params.id)
  setTimeout(function () {
    var videoDom = document.querySelector('.video-js')
    if (videoDom) {
      videojs(videoDom)
    }
  }, 100)

  function getParams () {
    var ret = {},
      seg = window.location.search.replace(/^\?/, '').split('&'),
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
  }
</script>

</html>
```

### [让编辑器自适应宽度的解决方案](https://www.cnblogs.com/VAllen/p/UEditor-InitialFrameWidth-Auto.html)

将 `initialFrameWidth` 的默认值 `1000` 修改为 `100%`, 即配置 `initialFrameWidth: 100%`

``` js
this.ue = window.UE.getEditor('editor', {
  BaseUrl: '',
  UEDITOR_HOME_URL: 'static/utf8-jsp/',
  serverUrl: window.location.protocol + '//' + window.location.host + '/api/ue/config',
  initialFrameWidth: '100%'
})
```

### 去掉本地保存成功提示

`ue` 配置项里有这个配置:

`enableAutoSave`  {Boolean} [默认值: true] //启用自动保存

但配置为 `false` 并没有什么卵用...

那只能调大自动保存间隔了

`saveInterval`  {Number} [默认值: 500] //自动保存间隔时间, 单位 ms

可以给 `saveInterval` 一个无限大的数字, 这样几乎就解决问题, 但你不能保证没有无聊之人 qaq

网上有通过修改源码从而达到效果的:

01. `ueditor.config.js`, `enableAutoSave` 的注释去掉并设置成 `false`, `saveInterval` 的注释也去掉设置成 0
02. 修改 `ueditor.all.js`, 在 `'contentchange': function () {` 函数的第一行添加代码:

    ``` js
    if (!me.getOpt('enableAutoSave')) {
      return
    }
    ```

或者

找到 `ueditor.all.min.js` 文件

`UE.plugin.register("autosave"`………………

这个 `autosave` 就是自动保存方法.

注释掉这个方法即可!

其实完全可以从 `css` 角度解决这个问题, 只要将提示隐藏不就解决问题了吗?

``` css
/* 去掉本地保存成功提示 */
.edui-default .edui-editor-messageholder {
  display: none;
}
```

## 参考资料

- [vue 集成百度 UEditor 富文本编辑器](https://blog.csdn.net/psd_html/article/details/73312859)
- [百度富文本编辑器(ueditor)上传配置](http://www.olbids.com/f/topic/view?topic=5)
- [百度富文本编辑器 UEditor 1.4.3 插入视频后路径被清空问题](https://blog.csdn.net/eunyeon/article/details/52964152)
- [使用百度编辑器 ueditor 表格无法显示边框以及边框颜色等系列问题解决方案](https://blog.csdn.net/kingqiji01/article/details/65495647#reply)
- [如何让某一元素内的内容不被 reset.css 重置?](https://segmentfault.com/q/1010000013204367/a-1020000013210136)
