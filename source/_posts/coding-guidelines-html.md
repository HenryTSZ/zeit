---
title: html 编码指南
date: 2019-09-04
cover: true
categories: [FrontEnd, Html]
tags: [Html, Guidelines]
---
## html 规范

### 元素及标签闭合

HTML 元素共有以下 5 种:

- 空元素:area、base、br、col、command、embed、hr、img、input、keygen、link、meta、param、source、track、wbr
- 原始文本元素:script、style
- RCDATA 元素:textarea、title
- 外来元素: 来自 MathML 命名空间和 SVG 命名空间的元素.
- 常规元素: 其他 HTML 允许的元素都称为常规元素.

元素标签的闭合应遵循以下原则:

> Tags are used to delimit the start and end of elements in the markup. Raw text, escapable raw text, and normal elements have a start tag to indicate where they begin, and an end tag to indicate where they end. The start and end tags of certain normal elements can be omitted, as described below in the section on optional tags. Those that cannot be omitted must not be omitted. Void elements only have a start tag; end tags must not be specified for void elements. Foreign elements must either have a start tag and an end tag, or a start tag that is marked as self-closing, in which case they must not have an end tag.

- 原始文本元素、RCDATA 元素以及常规元素都有一个开始标签来表示开始, 一个结束标签来表示结束.
- [某些元素的开始和结束标签是可以省略的](http://www.w3.org/TR/html5/syntax.html#optional-tags), 如果规定标签不能被省略, 那么就绝对不能省略它.
- 空元素只有一个开始标签, 且不能为空元素设置结束标签.
- 外来元素可以有一个开始标签和配对的结束标签, 或者只有一个自闭合的开始标签, 且后者情况下该元素不能有结束标签.

### HTML 代码大小写

HTML 标签名、类名、标签属性和大部分属性值统一用小写

_推荐:_

```html
<div class="demo"></div>
```

_不推荐:_

```html
<div class="DEMO"></div>

<DIV class="DEMO"></DIV>
```

HTML 文本、CDATA、JavaScript、meta 标签某些属性等内容可大小写混合

```html
<!-- 优先使用 IE 最新版本和 Chrome Frame -->
<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1" />

<!-- HTML文本内容 -->
<h1>I AM WHAT I AM</h1>

<!-- JavaScript 内容 -->
<script type="text/javascript">
  let demoName = 'demoName';
  ...
</script>
```

### 类型属性

不需要为 CSS、JS 指定类型属性, HTML5 中默认已包含

_推荐:_

```html
<link rel="stylesheet" href="" />
<script src=""></script>
```

_不推荐:_

```html
<link rel="stylesheet" type="text/css" href="" />
<script type="text/javascript" src=""></script>
```

### 元素属性

- 元素属性值使用双引号语法

_推荐:_

```html
<input type="text" />
```

_不推荐:_

```html
<input type=text />

<input type='text' />
```

更多关于元素属性:[#Attributes](http://www.w3.org/TR/html5/syntax.html#attributes-0)

### 选择器

class 推荐使用 `-` 分割, 如: `header-title`

id 推荐使用 `_` 分割, 如: `header_title`

### 特殊字符引用

> In certain cases described in other sections, text may be mixed with character references. These can be used to escape characters that couldn't otherwise legally be included in text.

文本可以和字符引用混合出现. 这种方法可以用来转义在文本中不能合法出现的字符.

在 HTML 中不能使用小于号 "&lt;" 和大于号 "&gt;" 特殊字符, 浏览器会将它们作为标签解析, 若要正确显示, 在 HTML 源代码中使用字符实体

_推荐:_

```html
<a href="#">more&gt;&gt;</a>
```

_不推荐:_

```html
<a href="#">more>></a>
```

更多关于符号引用:[#Character references](http://www.w3.org/TR/html5/syntax.html#character-references)

### 代码缩进

统一使用两个空格进行代码缩进, 使得各编辑器表现一致(各编辑器有相关配置)

```html
<div class="jdc">
  <a href="#"></a>
</div>
```

### 纯数字输入框

使用 `type="tel"` 而不是 `type="number"`

```html
<input type="tel" />
```

### 代码嵌套

元素嵌套规范, 每个块状元素独立一行, 内联元素可选

_推荐:_

```html
<div>
  <h1></h1>
  <p></p>
</div>
<p><span></span><span></span></p>
```

_不推荐:_

```html
<div>
  <h1></h1><p></p>
</div>
<p>
  <span></span>
  <span></span>
</p>
```

段落元素与标题元素只能嵌套内联元素

_推荐:_

```html
<h1><span></span></h1>
<p><span></span><span></span></p>
```

_不推荐:_

```html
<h1><div></div></h1>
<p><div></div><div></div></p>
```

### 注释规范

HTML 注释规范写法应该遵循以下标准:

> Comments must start with the four character sequence U+003C LESS-THAN SIGN, U+0021 EXCLAMATION MARK, U+002D HYPHEN-MINUS, U+002D HYPHEN-MINUS (&lt; !--). Following this sequence, the comment may have text, with the additional restriction that the text must not start with a single "&gt; " (U+003E) character, nor start with a U+002D HYPHEN-MINUS character (-) followed by a "&gt; " (U+003E) character, nor contain two consecutive U+002D HYPHEN-MINUS characters (--), nor end with a U+002D HYPHEN-MINUS character (-). Finally, the comment must be ended by the three character sequence U+002D HYPHEN-MINUS, U+002D HYPHEN-MINUS, U+003E GREATER-THAN SIGN (--&gt; ).

- 必须以 4 个有序字符开始: 编码为 U+003C LESS-THAN SIGN 的小于号, 编码为 U+0021 EXCLAMATION MARK 的感叹号, 编码为 U+002D HYPHEN-MINUS 横线, 编码为 U+002D HYPHEN-MINUS 横线 , 即 "&lt; !--"
- 在此之后是注释内容, 注释的内容有以下限制:
  - 不能以单个 "&gt; " (U+003E) 字符开始
  - 不能以由 "-"(U+002D HYPHEN-MINUS)和 "&gt; " (U+003E) 组合的字符开始, 即 "-&gt; "
  - 不能包含两个连续的 U+002D HYPHEN-MINUS 字符, 即 "--"
  - 不能以一个 U+002D HYPHEN-MINUS 字符结束, 即 "-"
- 必须以 3 个有序字符结束: U+002D HYPHEN-MINUS, U+002D HYPHEN-MINUS, U+003E GREATER-THAN SIGN, 即 "--&gt; "

标准写法:

```html
<!--Comment Text-->
```

错误的写法:

```html
<!-->The Wrong Comment Text-->

<!--->The Wrong Comment Text-->

<!--The--Wrong--Comment Text-->

<!--The Wrong Comment Text--->
```

参考 www.w3.org [#Comments](http://www.w3.org/TR/2014/REC-html5-20141028/syntax.html#comments)

#### 单行注释

一般用于简单的描述, 如某些状态描述、属性描述等

注释内容前后各一个空格字符, 注释位于要注释代码的上面, 单独占一行

_推荐:_

```html
<!-- Comment Text -->
<div>...</div>
```

_不推荐:_

```html
<div>...</div><!-- Comment Text -->

<div><!-- Comment Text -->
...
</div>
```

#### 模块注释

一般用于描述模块的名称以及模块开始与结束的位置

注释内容前后各一个空格字符, `<!-- S Comment Text -->` 表示模块开始, `<!-- E Comment Text -->` 表示模块结束, 模块与模块之间相隔一行

_推荐写法:_

```html
<!-- S Comment Text A -->
<div class="mod_a">
  ...
</div>
<!-- E Comment Text A -->

<!-- S Comment Text B -->
<div class="mod_b">
  ...
</div>
<!-- E Comment Text B -->
```

_不推荐写法:_

```html
<!-- S Comment Text A -->
<div class="mod_a">
  ...
</div>
<!-- E Comment Text A -->
<!-- S Comment Text B -->
<div class="mod_b">
  ...
</div>
<!-- E Comment Text B -->
```

#### 嵌套模块注释

当模块注释内再出现模块注释的时候, 为了突出主要模块, 嵌套模块不再使用

```html
<!-- S Comment Text -->
<!-- E Comment Text -->
```

而改用

```html
<!-- /Comment Text -->
```

注释写在模块结尾标签底部, 单独一行.

```html
<!-- S Comment Text A -->
<div class="mod_a">

  <div class="mod_b">
    ...
  </div>
  <!-- /mod_b -->

  <div class="mod_c">
    ...
  </div>
  <!-- /mod_c -->

</div>
<!-- E Comment Text A -->
```
