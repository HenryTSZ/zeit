---
title: 基于 ElementUI 封装的 Tree2
date: 2020-01-31
categories: [FrontEnd]
tags: [Js, ElementUI]
thumbnail: /img/element-ui/thumbnail.svg
---

最近在使用自己封装的 [Tree](https://tsz.now.sh/2020/01/02/based-on-element-ui-encapsulation-tree/) 的时候, 发现只有点击复选框的时候, `全选` 复选框可以联动, 通过 `setCheckedNodes` 、 `setCheckedKeys` 和 `default-checked-keys` 设置目前勾选的节点时, 无法联动, 需要再优化

<!-- more -->

如下图所示:

![setCheckedNodes](/img/element-ui/011.png)

通过 `node` 设置后, 全选并没有显示为半选状态

## 方法一

[源码](https://github.com/HenryTSZ/vue-element-extend/blob/master/src/plugins/Tree2.vue)在这里

需要用到 `check-change` 这个 `Event`

> 节点选中状态发生变化时的回调
>
> 共三个参数, 依次为: 传递给 data 属性的数组中该节点所对应的对象、节点本身是否被选中、节点的子树中是否有被选中的节点

需要在这个方法里判断全选的状态, 但发现这个逻辑有点麻烦: 首先你要对传入的三个参数都需要判断, 还需要和 `allNodes` 做判断.

对, 其实不需要判断传入的三个参数, 直接拿到 `allNodes`, 根据所有根节点的选中状态来处理全选的状态

但这个 `Event` 只要有节点变化就会触发, 像上图例子会调用好几次, 而且点击复选框的时候也会调用. 咱们在点击复选框的时候已经处理过逻辑了, 如果要使用 `check-change`, 那么 `check` 这个事件就不能要了

``` HTML
<el-tree
  :ref="ref"
  v-bind="$attrs"
  :show-checkbox="showCheckbox"
  v-on="$listeners"
  @check-change="handleCheckChange"
>
  <slot slot-scope="{ node, data }" v-bind="{ node, data }"> {{ node.label }} </slot>
</el-tree>
```

``` JS
data() {
  return {
    ref: 'elTree',
    isIndeterminate: false,
    isCheckAll: false,
    time: 0
  }
},
watch: {
  defaultCheckedKeys: {
    handler: 'handleCheckChange',
    immediate: true
  }
},
methods: {
  handleCheckChange() {
    if (!this.showCheckAll || !this.showCheckbox) {
      return
    }
    // 节流
    if (Date.now() - this.time > 100) {
      this.time = Date.now()
    } else {
      return
    }
    this.$nextTick(() => {
      this.handleCheckAllStatus()
    })
  },
  handleCheckAllStatus() {
    const elTreeStore = this.$refs[this.ref].store
    const allNodes = elTreeStore
      ._getAllNodes()
      .filter(({ level, visible }) => level === 1 && visible)
    // 关于 filter 的说明:
    // 全选的状态其实只和根节点的状态有关, 而且也处理了 set 方法中 leafOnly 为 true 的情况
    // visible 结合过滤使用
    this.checkAll = allNodes.every(({ checked }) => checked)
    this.isIndeterminate =
      allNodes.some(({ indeterminate }) => indeterminate) ||
      (allNodes.some(({ checked }) => checked) && !this.checkAll)
  }
}
```

## 方法二

[源码](https://github.com/HenryTSZ/vue-element-extend/blob/master/src/plugins/Tree3.vue)在这里

处理一下传入 `el-tree` 的 `data` 数据, 加上一个 `全选` 的根节点

``` HTML
<el-tree
  :ref="ref"
  v-bind="$attrs"
  :data="treeData"
  :show-checkbox="showCheckbox"
  v-on="$listeners"
>
  <slot slot-scope="{ node, data }" v-bind="{ node, data }"> {{ node.label }} </slot>
</el-tree>
```

``` JS
props: {
  data: {
    type: Array,
    default() {
      return []
    }
  }
},
data() {
  return {
    treeData: [],
    ref: 'elTree'
  }
},
mounted() {
  this.treeData =
    this.showCheckAll && this.showCheckbox
      ? [
          {
            [this.$refs[this.ref].props.label]: '全选',
            [this.$refs[this.ref].nodeKey || 'id']: 'rootId', // 这里可以灵活处理
            [this.$refs[this.ref].props.children]: this.data
          }
        ]
      : this.data
}
```

好了, 组件封装完了. 全选的状态由 `el-tree` 内部处理, 咱们什么也不用管, 完成!

才怪嘞!!! 这样虽然简单, 但毕竟修改数据了, 一旦涉及到修改数据, 就会有很多麻烦需要处理.

比如: `getChecked` 这些获取选中节点的方法有可能会返回咱们添加的全选的数据, 而且全选的 `check` 和 `check-change` 也会触发(不过这个影响不算太大, 可以根据实际需求灵活应变)

那就只能修改 `getChecked` 方法, 先拿到当前选中的数据, 过滤掉 `全选` 的数据, 不能使用 `el-tree` 的默认方法了

``` JS
data() {
  return {
    treeData: [],
    ref: 'elTree',
    nodeKey: '',
    checkAllId: '__rootId__'
  }
},
computed: {
  isCheckAll() {
    return this.showCheckAll && this.showCheckbox
  }
},
methods: {
  getCheckedNodes(leafOnly, includeHalfChecked) {
    if (this.isCheckAll) {
      return this.$refs[this.ref]
        .getCheckedNodes(leafOnly, includeHalfChecked)
        .filter(node => node[this.nodeKey] !== this.checkAllId)
    }
    return this.$refs[this.ref].getCheckedNodes(leafOnly, includeHalfChecked)
  },
  getHalfCheckedNodes() {
    if (this.isCheckAll) {
      return this.$refs[this.ref]
        .getHalfCheckedNodes()
        .filter(node => node[this.nodeKey] !== this.checkAllId)
    }
    return this.$refs[this.ref].getHalfCheckedNodes()
  },
  getCheckedKeys(leafOnly) {
    if (this.isCheckAll) {
      return this.$refs[this.ref].getCheckedKeys(leafOnly).filter(key => key !== this.checkAllId)
    }
    return this.$refs[this.ref].getCheckedKeys(leafOnly)
  },
  getHalfCheckedKeys() {
    if (this.isCheckAll) {
      return this.$refs[this.ref].getHalfCheckedKeys().filter(key => key !== this.checkAllId)
    }
    return this.$refs[this.ref].getHalfCheckedKeys()
  }
},
mounted() {
  if (this.isCheckAll) {
    this.nodeKey = this.$refs[this.ref].nodeKey || 'id'
    this.treeData = [
      {
        [this.$refs[this.ref].props.label]: '全选',
        [this.nodeKey]: this.checkAllId,
        [this.$refs[this.ref].props.children]: this.data
      }
    ]
  } else {
    this.treeData = this.data
  }
  // 绑定 el-tree 方法
  for (let key in this.$refs[this.ref]) {
    if (!(key in this) && typeof this.$refs[this.ref][key] === 'function') {
      this[key] = this.$refs[this.ref][key].bind(this.$refs[this.ref])
    }
  }
}
```
