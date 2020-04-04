---
title: 基于 ElementUI 封装的 TreeTable
date: 2020-04-04
categories: [FrontEnd]
tags: [Js, ElementUI]
thumbnail: /img/element-ui/thumbnail.svg
---

最近在使用 `el-table` 的树形表格的时候, 发现两个问题:

1. 没有展开到 `level` 级的功能
2. 表头的 `checkbox` 只能控制第一层级的 `checkbox` , 无法控制子级

> element-ui: 2.13.0

<!--more -->

国际惯例, 先奉上[源码](https://github.com/HenryTSZ/vue-element-extend/blob/master/src/plugins/TreeTable.vue)

## 展开到 level 级

首先查看官方文档发现两个参数:

| 参数               | 说明                                                                                              | 类型    | 可选值 | 默认值 |
| ------------------ | ------------------------------------------------------------------------------------------------- | ------- | ------ | ------ |
| default-expand-all | 是否默认展开所有行, 当 Table 包含展开行存在或者为树形表格时有效                                   | Boolean | -      | false  |
| expand-row-keys    | 可以通过该属性设置 Table 目前的展开行, 需要设置 row-key 属性才能使用, 该属性为展开行的 keys 数组.| Array   | -      |

|

这里我想到一个最笨到办法: 我们可以对源数据进行处理, 根据层级将数据分类, 将相同层级的 `id` 放到一个数组中, 将这些数组和层级做一个 `map` 映射. `level` 等于 `0` 时, `default-expand-all` 为 `true` , 大于 `0` 时, 从映射中取出对应的数组, 给 `expand-row-keys` 赋值, 这样不就可以了吗. 我真是一个天才啊. 但结果总是在那么不经意间给你当头一棒(这个暂且不表, 后续会说明的)

所以 `html` 为:

``` HTML
<el-table class="tree-table" :ref="ref" v-bind="$attrs" :default-expanded-all="defaultExpandAll" :expand-row-keys="expandRowKeys">
  <slot></slot>
</el-table>
```

由于本人曾经封装过 `el-tree` 的相同功能, 所以想着 `el-table` 是不是可以参考一下呢? 结果发现还是太年轻啊

封装 `el-tree` 的思路:

> 先找出 `tree` 的所有 `node` , 再根据传入的 `level` 来判断 `node` 是展开还是折叠状态

`level` 的 `props` 和 `watch` 这里就不在赘述了, 就说一下怎么处理展开折叠吧

`tree` 的 `store` 有 `_getAllNodes` 方法可以获取所有数据, 但 `table` 没有. 没有怎么办? 找找看有没有别的方法或数据吧.

终于经过大半天的苦苦探索后, 发现了这个: `this.$refs[this.ref].store.states.treeData`

``` JS
{
  3: {
    children: [31, 32],
    level: 0,
    expanded: false,
    display: true
  },
  31: {
    children: [311, 312],
    level: 1,
    expanded: false
  },
  311: {
    children: [3111, 3112],
    level: 2,
    expanded: false
  }
}
```

看来我和 `ElementUI` 不谋而合呀. 这种方式虽然没有 `level: [ids]` 取值方便, 但处理一下也行呀

首先我们来分析一下数据: 我们一般说 展开到 `level` 级是指到 `level` 级前是展开状态, 那 `treeData` 的 `level` 和咱们说的 `level` 相差为 `2` , 所以我们比较的时候需要将传入的 `level` 减去 `2` . 而 `level = 0` 时是指全部展开, 所以此时 `level` 应该为 `treeData` 的 `maxLevel`

我们先处理一下数据:

``` JS
handleData() {
  this.treeData = this.$refs[this.ref].store.states.treeData
  this.maxLevel =
    Math.max.apply(
      null,
      Object.values(this.treeData).map(({
        level
      }) => level)
    ) + 2
  this.$emit('max-level', this.maxLevel)
}
```

这样我们在 `watch level` 中就可以处理展开折叠了:

``` JS
if (!this.$refs[this.ref]) return
if (!this.maxLevel) {
  this.handleData()
}
let level = 0
if (this.level <= 0) {
  level = this.maxLevel -2
  /** 这里也可以使用如下代码
   *  this.defaultExpandAll = true
   *  this.key = Date.now()
   *  return
   *  // this.key 为 el-table 的 key
   *  // 因为 defaultExpandAll 只在 table 初始化生效, 后续改变值并不会生效
   *  // 所以需要使用 key 重新渲染
   *  // 但如果数据量很大, 重新渲染会消耗性能, 所以不推荐使用
   */
} else {
  level = this.level - 2
}
let expandRowKeys = []
for (const key in this.treeData) {
  if (this.treeData.hasOwnProperty(key)) {
    // table 没有 auto-expand-parent
    // 所以展开子节点的时候也需要将父 id 传入
    if (this.treeData[key].level <= level) {
      expandRowKeys.push(key)
    }
  }
}
this.expandRowKeys = expandRowKeys
```

本来以为到这里应该就完美解决了, 没想到啊, `expandRowKeys` 只负责展开, 不负责折叠.

比如现在展开到 `3` 级了, 想要展开到 `2` 级, `table` 一看目前 `2` 级节点是展开状态, 不用我管了, 我继续吃瓜去了. 什么? 你说 `3` 级为什么不折叠起来? 我收到的展开节点的 `id` 数组为第 `1` 级和第 `2` 级, 现在不是展开状态吗? 我有错吗? `emmmm` , 你好像确实没错, 是我错怪你了, 你继续吃瓜去吧. 当头一棒该来的还是来了呀. 但我怎么折叠呀! 有了, 不是还有 `key` 吗?

``` JS
let expandRowKeys = []
for (const key in this.treeData) {
  if (this.treeData.hasOwnProperty(key)) {
    if (this.treeData[key].level <= level) {
      expandRowKeys.push(key)
    }
  }
}
this.key = Date.now()
this.expandRowKeys = expandRowKeys
```

虽然实现功能了, 但上面自己义正言辞的说 `key` 不能用, 这里倒用的挺勤快的. 这不是既当又立吗? 而且 `level` 增加的时候其实是不需要的, 只有减少的时候才需要, 那这里再判断一下? 还有如果使用这个组件的时候传入 `default-expand-all` , 展开折叠完全无效好伐

现在问题好像有点麻烦了, 咱们是不是一开始方向就错了? 当初自己也说了这是一个笨办法, 是不是有什么细节被忽略了呢?

咱们再看一下 `treeData'

``` JS
{
  3: {
    children: [31, 32],
    level: 0,
    expanded: false,
    display: true
  }
}
```

这个 `expanded` 不就是控制展开折叠的吗? 修改这个值不就可以了吗? 我的天呐

``` JS
for (const key in this.treeData) {
  if (this.treeData.hasOwnProperty(key)) {
    this.treeData[key].expanded = this.treeData[key].level <= level
  }
}
```

搞定! 不需要 `key`, 传入的 `default-expand-all` 也不影响了, 完美. 哎, 写代码就是这么朴实无华且枯燥

## 全选
