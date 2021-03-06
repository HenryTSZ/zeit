---
title: 基于 ElementUI 封装的 SelectTree
date: 2019-11-29
categories: [FrontEnd]
tags: [Js, ElementUI]
thumbnail: /img/element-ui/thumbnail.svg
---

最近重构项目, 遇到一个需要 `SelectTree` 的组件, 就在网上找了一圈, 发现 [Element-UI二次封装实现TreeSelect 树形下拉选择组件 - sleepwalker_1992的专栏 - CSDN博客](https://blog.csdn.net/sleepwalker_1992/article/details/87894588)这个还不错, 但奈何作者不更新了, 而且现在样式有点问题, 就想着参考大佬的思路自己也封装一下

话不多说, 先将[本人源码](https://github.com/HenryTSZ/vuepress-element-extend/blob/master/docs/.vuepress/components/SelectTree.vue)奉上. 好了, 开干!

<!-- more -->

## 分析大佬源码

```html
<template>
  <div>
    <div class="mask" v-show="isShowSelect" @click="isShowSelect = !isShowSelect"></div>
    <el-popover
      placement="bottom-start"
      trigger="manual"
      v-model="isShowSelect"
      @hide="popoverHide"
    >
      <el-tree
        ref="tree"
        :data="data"
        :props="defaultProps"
        :show-checkbox="multiple"
        @node-click="handleNodeClick"
        @check-change="handleCheckChange"
      ></el-tree>
      <el-select
        slot="reference"
        ref="select"
        v-model="selectedData"
        :multiple="multiple"
        @click.native="isShowSelect = !isShowSelect"
        @remove-tag="removeSelectedNodes"
        @clear="removeSelectedNode"
        @change="changeSelectedNodes"
      >
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select>
    </el-popover>
  </div>
</template>
```

首先大佬利用 `el-popover` 弹出框为基础, 将 `el-select` 作为 `reference`  的 `slot` 触发 `Popover` 显示的 HTML 元素, `el-tree` 作为内容. 并且利用 `select` 的 `option` 来解决 `value` 和 `label` 的转化(虽然自己也可以解决, 但既然组件已经有轮子了, 那就拿过来用即可)

一开始我也感觉应该是这样的, 查看重构前的代码发现了另一种思路:

```html
<el-select ref="select" v-model="selectData">
  <el-option value=""></el-option>
  <tree
    :data="data"
    :isAllOpen="false"
    :isShowCheck="true"
    :isMultiple="true"
    :isAllChecked="false"
  ></tree>
</el-select>
```

```css
.el-select-dropdown__item {
  display: none;
}
```

给 `el-option` 一个默认值, 并利用 css 将其隐藏, 这样下方的 `tree` 组件就相当于 `el-option` 了

那咱们就把两者结合一下

## 初稿

```html
<template>
  <div class="select-tree">
    <el-select
      v-model="selectData"
      :multiple="multiple"
      :disabled="disabled"
      :value-key="valueKey"
      :size="size"
      :clearable="clearable"
      :collapse-tags="collapseTags"
      :multiple-limit="multipleLimit"
      :placeholder="placeholder"
      @change="selectChange"
      @remove-tag="removeTag"
    >
      <el-option
        v-for="item in selectOptions"
        :key="item.value"
        :value="item.value"
        :label="item.label"
      ></el-option>
      <el-tree
        ref="tree"
        :data="data"
        :node-key="nodeKey"
        :props="props"
        :highlight-current="highlightCurrent"
        :default-expand-all="defaultExpandAll"
        :expand-on-click-node="expandOnClickNode"
        :check-on-click-node="checkOnClickNode"
        :auto-expand-parent="autoExpandParent"
        :default-expanded-keys="defaultExpandedKeys"
        :show-checkbox="multiple"
        :check-strictly="checkStrictly"
        :default-checked-keys="defaultCheckedKeys"
        :current-node-key="currentNodeKey"
        :accordion="accordion"
        :indent="indent"
        @node-click="handleNodeClick"
        @check-change="handleCheckChange"
      ></el-tree>
    </el-select>
  </div>
</template>
```

咱封装组件一般都喜欢保留原组件的 `Attributes`, 这样别人使用的时候按照原来的习惯使用即可. 但这样就有问题了: 首先是在组件上添加了太多的 `Attributes`, `props` 也需要都指定一下, 有时候还需要指定默认值, 工作量太大了, 而且用户实际上只使用几个属性. 理想情况下应该是: 咱们不对用户传入的属性做处理, 直接仍给原组件去处理

查看 `Vue` 官方文档后发现可以[传入一个对象的所有属性](https://cn.vuejs.org/v2/guide/components-props.html#%E4%BC%A0%E5%85%A5%E4%B8%80%E4%B8%AA%E5%AF%B9%E8%B1%A1%E7%9A%84%E6%89%80%E6%9C%89%E5%B1%9E%E6%80%A7), 那这样我不是接收两个属性就可以了吗? 一个是 `select` 的, 一个是 `tree` 的

## 优化 Attributes

```html
<template>
  <div class="select-tree">
    <el-select
      ref="select"
      v-model="selectData"
      :clearable="false"
      v-bind="selectProps"
      @visible-change="handleVisibleChange"
      @remove-tag="handleRemoveTag"
      @clear="handleClear"
    >
      <el-option
        v-for="item in selectOptions"
        :key="item.value"
        :value="item.value"
        :label="item.label"
      ></el-option>
      <el-tree
        :key="treeKey"
        ref="tree"
        v-bind="treeBind"
        @node-click="handleNodeClick"
        @current-change="handleCurrentChange"
        @check-change="handleCheckChange"
      ></el-tree>
    </el-select>
  </div>
</template>
```

```js
export default {
  name: 'SelectTree',
  props: {
    value: {
      type: [String, Number, Array],
      required: true
    },
    selectProps: {
      type: Object,
      default() {
        return {}
      },
      required: true
    },
    treeProps: {
      type: Object,
      default() {
        return {}
      },
      required: true
    },
    // 单选时是否只能选择叶子节点
    currentIsLeaf: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      treeKey: Math.random(),
      multiple: false,
      selectData: '',
      selectOptions: []
    }
  },
  computed: {
    treeBind() {
      return {
        showCheckbox: this.selectProps.multiple,
        highlightCurrent: !this.selectProps.multiple,
        expandOnClickNode: this.expandOnClickNode,
        ...this.treeProps,
        defaultCheckedKeys: this.selectProps.multiple ? this.value : [],
        currentNodeKey: this.selectProps.multiple ? '' : this.value
      }
    },
    expandOnClickNode() {
      return this.multiple ? true : this.currentIsLeaf ? true : false
    }
  }
}
```

传入的参数:

```js
selectProps: {
  multiple: true,
  // 'collapse-tags': true,
  collapseTags: true,
  clearable: true
},
treeProps: {
  data,
  showCheckbox: false,
  // expandOnClickNode: false,
  props: { children: 'childrenList', label: 'menuName' },
  nodeKey: 'menuId'
}
```

使用 `v-bind` 是不是一下就少了好多代码, 而且也不用自己处理属性了, 完全把用户传过来的直接扔给了组件

细心观察的同学会发现上面的代码其实有对比参照的.

先看 `select` 的属性:

```js
:clearable="false"
v-bind="selectProps"
```

本来是想定义一些默认属性, 然后用户的属性可以覆盖

我以为属性这样写, 会和对象一样, 下面的属性覆盖上面的, 却发现无法覆盖, 而且无论 `:clearable` 放在 `v-bind` 上面还是下面, 最终都是 `false`, 貌似 `v-bind` 中的 `clearable` 没有生效

那就只能先处理一下, 再使用 `v-bind` 绑定. 最后成果就是 `tree` 中的 `v-bind="treeBind"`.

但这样也有一个问题: 那就是用户只能传入驼峰值, 不能传入中划线分割的值, 否则无法覆盖默认值(注: 比较过两种传值, `Vue` 推荐使用中划线方式, 但现在用户其实传入的是对象, 中划线方式还需要外层包围引号, 而且对象中写中划线感觉很别扭, 就定为驼峰了)

注: 如果看过本人对 `tree` 的封装文章的同学, 这里可能会问为什么不用 `v-bind="$attrs"`, 一是本人封装 `tree` 的时候才算了解这个属性; 二是这里有两个组件, 虽然目前它们需要的属性名都不一样, 但不知道以后会不会有同名但作用不同的属性, 而且传一堆没用的属性过去也不好, 所以就不改了

## 处理逻辑

主要考虑的逻辑就是 `tree` 的单选和多选

```js
@current-change="handleCurrentChange"
@check-change="handleCheckChange"

// 单选，节点被点击时的回调,返回被点击的节点数据
handleCurrentChange() {
  // 如果是多选就返回
  if (this.multiple) return
  // 获取当前选中的数据. 注: 是 data, 而不是 node
  const currentNode = this.$refs.tree.getCurrentNode()
  // 这个才是 node
  const node = this.$refs.tree.getNode(currentNode)
  // 判断是否只能选择叶子节点
  if (this.currentIsLeaf && !node.isLeaf) return
  this.selectOptions = []
  this.selectData = ''
  const value = node.key
  const label = node.label
  this.selectOptions.push({
    value,
    label
  })
  this.selectData = value
  this.$refs.select.blur()
},
// 多选，节点勾选状态发生变化时的回调
handleCheckChange() {
  // 给 selectOptions 一个默认值, 防止出现无数据, 从而无法显示 tree
  this.selectOptions = [{}]
  this.selectData = []
  // 获取当前选中的数据. 注: 是 data, 而不是 node
  const checkedNodes = this.$refs.tree.getCheckedNodes()
  checkedNodes.forEach(node => {
    const value = node[this.$refs.tree.nodeKey]
    this.selectOptions.push({
      value,
      label: node[this.$refs.tree.props.label]
    })
    this.selectData.push(value)
  })
}
```

具体逻辑上面注释已经很清楚了, 就不多做说明了

这里先吐槽一下, 明明是 `getCurrentNode` 和 `getCheckedNode`, 返回的却是 `data`. 这个应该是历史遗留问题吧, 就不深究了. 幸好官方提供了 `getNode` 这个方法

接下来说正事. 想说的是在取数据方面又是一个对比: 单选步骤是: 先拿到当前 `data`, 再通过 `data` 拿到当前 `node`, 不论你传入的 `nodeKey` 和 `props.label` 是什么, `node` 都会转化为固定的 `key` 和 `label`; 多选的步骤是拿到当前 `data`, 然后直接通过 `this.$refs.tree` 获取 `nodeKey` 和 `props.label`, 再通过 `data` 取值

这里说一个小插曲, 本人看到 `this.$refs.tree` 使用很多次, 就想着能不能在初始化的时候提取出来, 这样以后就可以直接用了. 考虑过 `tree` 的 `set` 方法是否能生效, 测试了一下发现可以成功, 最后发现还是太年轻, 由于数据刷新, 使用初始化提取出来的仍然是旧值, 没有实时更新, 所以还是老老实实用 `this.$refs.tree` 吧

## 完成(其实是一稿, 大家都懂得)

```html
<template>
  <div class="select-tree">
    <el-select
      ref="select"
      v-model="selectData"
      v-bind="selectProps"
      @visible-change="handleVisibleChange"
      @remove-tag="handleRemoveTag"
      @clear="handleClear"
    >
      <el-option
        v-for="item in selectOptions"
        :key="item.value"
        :value="item.value"
        :label="item.label"
      ></el-option>
      <el-tree
        :key="treeKey"
        ref="tree"
        v-bind="treeBind"
        @current-change="handleCurrentChange"
        @check-change="handleCheckChange"
      ></el-tree>
    </el-select>
  </div>
</template>

<script>
export default {
  name: 'SelectTree',
  props: {
    value: {
      type: [String, Number, Array],
      required: true
    },
    selectProps: {
      type: Object,
      default() {
        return {}
      },
      required: true
    },
    treeProps: {
      type: Object,
      default() {
        return {}
      },
      required: true
    },
    // 单选时是否只能选择叶子节点
    currentIsLeaf: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      treeKey: Math.random(),
      selectData: '',
      selectOptions: []
    }
  },
  computed: {
    treeBind() {
      return {
        showCheckbox: this.selectProps.multiple,
        highlightCurrent: !this.selectProps.multiple,
        expandOnClickNode: this.expandOnClickNode,
        ...this.treeProps,
        defaultCheckedKeys: this.selectProps.multiple ? this.value : [],
        currentNodeKey: this.selectProps.multiple ? '' : this.value
      }
    },
    multiple() {
      return this.selectProps.multiple
    },
    expandOnClickNode() {
      return this.multiple ? true : this.currentIsLeaf ? true : false
    }
  },
  watch: {
    value() {
      // 为了检测 v-model 的变化
      if (this.value + '' !== this.selectData + '') {
        this.treeKey = Math.random()
        this.init()
      }
    }
  },
  methods: {
    init() {
      this.$nextTick(() => {
        if (this.multiple) {
          this.handleCheckChange()
        } else {
          this.handleCurrentChange()
        }
      })
    },
    // select 下拉框出现/隐藏
    handleVisibleChange(val) {
      // 下拉框隐藏并且值改变后
      if (!val && this.value + '' !== this.selectData + '') {
        this.$emit('input', this.selectData)
        this.$emit('change', this.selectData)
      }
      this.$emit('visible-change', val)
    },
    // select 清空
    handleClear() {
      if (this.$refs.tree.showCheckbox) {
        this.selectData = []
        this.$refs.tree.setCheckedKeys([])
      } else {
        this.selectData = ''
        this.$refs.tree.setCurrentKey(null)
      }
      this.$emit('input', this.selectData)
      this.$emit('change', this.selectData)
      this.$emit('clear')
    },
    // select 移除 tag
    handleRemoveTag(val) {
      this.$refs.tree.setChecked(val, false)
      let node = this.$refs.tree.getNode(val)
      if (!this.$refs.tree.checkStrictly && node.childNodes.length > 0) {
        this.tree2List(node).map(item => {
          if (item.childNodes.length <= 0) {
            this.$refs.tree.setChecked(item, false)
          }
        })
        this.handleCheckChange()
      }
      this.$emit('input', this.selectData)
      this.$emit('change', this.selectData)
      this.$emit('remove-tag', val)
    },
    // 单选, 节点被点击时的回调, 返回被点击的节点数据
    handleCurrentChange() {
      // 如果多选, 不处理
      if (this.multiple) return
      // 给 selectOptions 一个默认值, 防止出现无数据, 从而无法显示 tree
      this.selectOptions = [{}]
      const currentNode = this.$refs.tree.getCurrentNode()
      // 初始值为空
      if (!currentNode) return
      const node = this.$refs.tree.getNode(currentNode)
      // 判断叶子节点
      if (this.currentIsLeaf && !node.isLeaf) return
      this.selectOptions = []
      this.selectData = ''
      const value = node.key
      const label = node.label
      this.selectOptions.push({
        value,
        label
      })
      this.selectData = value
      this.$refs.select.blur()
    },
    // 多选，节点勾选状态发生变化时的回调
    handleCheckChange() {
      // 给 selectOptions 一个默认值, 防止出现无数据, 从而无法显示 tree
      this.selectOptions = [{}]
      this.selectData = []
      const checkedNodes = this.$refs.tree.getCheckedNodes()
      checkedNodes.forEach(node => {
        const value = node[this.$refs.tree.nodeKey]
        this.selectOptions.push({
          value,
          label: node[this.$refs.tree.props.label]
        })
        this.selectData.push(value)
      })
    },
    tree2List(tree) {
      let queen = []
      let out = []
      queen = queen.concat(tree)
      while (queen.length) {
        let first = queen.shift()
        if (first.childNodes) {
          queen = queen.concat(first.childNodes)
        }
        out.push(first)
      }
      return out
    }
  },
  mounted() {
    this.init()
  }
}
</script>

<style lang="less" scoped>
.select-tree {
  display: inline-block;
  width: 100%;
}
.el-select-dropdown__item {
  display: none;
}
</style>
```

## 修正

经后期测试, 通过 `this.$refs.tree` 获取 `nodeKey` 和 `props.label` 存在一定问题, 如果用户未传入 `nodeKey` 或 `props.label`, 那么拿到的值都是 `undefined`, 这种方式还是不靠谱, 还是用单选方式靠谱. 当时本人测试的时候这两个值都传入了, 所以没有测出 `bug`, 实际使用的时候, 没有传入 `nodeKey`, 导致获取到的值都是 `undefined`

so, 咱们改成单选方式试试:

``` js
// 多选，节点勾选状态发生变化时的回调
handleCheckChange() {
  // 给 selectOptions 一个默认值, 防止出现无数据, 从而无法显示 tree
  this.selectOptions = [{}]
  this.selectData = []
  const checkedNodes = this.$refs.tree.getCheckedNodes()
  checkedNodes.forEach(node => {
    const checkedNode = this.$refs.tree.getNode(node)
    const value = checkedNode.key
    this.selectOptions.push({
      value,
      label: checkedNode.label
    })
    this.selectData.push(value)
  })
}
```

使用以上代码发现 `getNode` 永远返回 `null`, 原因是 `nodeKey` 为 `undefined`, 无法获取 `node`. 而且 `getCheckedNodes` 可以正常返回数据, `getCheckedKeys` 返回的都是 `undefined`. 所以必须给 `nodeKey` 一个默认值了.

``` js
treeBind() {
  return {
    showCheckbox: this.selectProps.multiple,
    highlightCurrent: !this.selectProps.multiple,
    expandOnClickNode: this.expandOnClickNode,
    nodeKey: 'id',
    ...this.treeProps,
    defaultCheckedKeys: this.selectProps.multiple ? this.value : [],
    currentNodeKey: this.selectProps.multiple ? '' : this.value
  }
}
```

这样, `getCheckedNodes`, `getCheckedKeys`, `getNode` 都可以正常使用了

## 实际工作中发现的问题

### tree 为 undefined(已解决)

由于本人后面封装了 `tree`, 就想着使用 `tree` 代替这里的 `el-tree`, 并且通过懒加载方式引入组件

``` JS
components: {
  Tree: resolve => require(['plugins/Tree'], resolve)
}
```

结果杯具了, `this.$refs.tree` 初始化永远是 `undefined`, 只有手动点击下拉框后才能正常获取.

一开始以为加一个 `$nextTick` 就好了, 最后发现没用. 然后就想到是不是懒加载影响的, 替换成 `import Tree from 'plugins/Tree'` 一下就好了. 看来什么东西也不能太绝对了, 太追求性能也不行

### EditableElements 使用 select-tree 时, placeholder 不会自动生成(已解决)

如果不知道 `EditableElements`, 可以看看这篇文章: [基于 ElementUI 封装的基础 table 和 form | Henry](https://tsz.now.sh/2020/05/16/based-on-element-ui-encapsulation-table-form/#%E5%B0%81%E8%A3%85%E5%8F%AF%E7%BC%96%E8%BE%91%E7%BB%84%E4%BB%B6)

原因是现在只能通过 `selectProps` 来传入 `placeholder`, 直接传入的话是不认的

其实这里设计的有点问题, `tree` 的 `props` 必须通过 `treeProps` 传入, `select` 的 `props` 应该是直接传入即可, 就和 `el-select` 一样

那就兼容一下吧:

``` HTML
<el-select
  v-bind="{ ...$attrs, ...selectProps }"
>
```

``` JS
props: {
  multiple: {
    type: Boolean,
    default: false
  }
},
computed: {
  treeBind() {
    return {
      showCheckbox: this.isMultiple,
      highlightCurrent: !this.isMultiple,
      expandOnClickNode: this.expandOnClickNode,
      nodeKey: 'id',
      ...this.treeProps,
      defaultCheckedKeys: this.isMultiple ? this.value : [],
      currentNodeKey: this.isMultiple ? '' : this.value
    }
  },
  isMultiple() {
    return this.selectProps.multiple || this.multiple
  },
  expandOnClickNode() {
    return this.isMultiple ? true : this.currentIsLeaf
  }
}
```

`this.multiple` 修改为 `this.isMultiple` 即可

这样就可以

由于本组件已经在项目中使用了, 去掉 `selectProps` 改动有点大, 只能这样兼容一下

如果是新项目, 可以去掉 `selectProps` 了:

``` HTML
<el-select
  v-bind="$attrs"
>
```

### 单选时只能选择叶子节点, 但会选择父级(已解决)(改为 Tree 解决)

其实这个应该是 `Tree` 的功能, 当初未想到这些, 导致加到了这里. 但思路是相通的

[基于 ElementUI 封装的 Tree2 | Henry](https://tsz.now.sh/2020/01/31/based-on-element-ui-encapsulation-tree-2/#%E5%8D%95%E9%80%89%E5%8F%AA%E8%83%BD%E9%80%89%E6%8B%A9%E5%8F%B6%E5%AD%90%E8%8A%82%E7%82%B9)

目前只是通过 `node.isLeaf` 来判断是否是叶子节点, 但有时候只有一个父级, 那么这个父级既是父节点, 又是叶子节点, 我们有时候是不能选择这个节点的. 当然如果你们的需求就是可以选择这个节点, 那就不用往下看了, 目前完全可以胜任你们的需求

而且判断是不是叶子节点, 不同的数据源会有不同的判断方式, 所以需要放出一个方法, 让使用者自己判断是否是叶子节点

添加一个 `props`:

``` JS
props: {
  /**
    * @description: 自定义单选时只能选择子节点方法; 优先级高于 currentIsLeaf
    * @param {data: Object}: 当前节点数据
    * @param {node: Object}: 当前节点 Node 对象
    * @return: Boolean
    */
  isLeafFun: {
    type: Function
  }
},
methods: {
  // 单选, 节点被点击时的回调, 返回被点击的节点数据
  handleCurrentChange() {
    // do something
    // 判断叶子节点
    if (this.isLeafFun ? this.isLeafFun(currentNode, node) : !node.isLeaf && this.currentIsLeaf) {
      return
    }
    // do something
  }
}
```

### 单选时只能选择叶子节点, 但点击父节点后, 父节点会有选中状态

比如当前选中一个叶子节点, 但需要选择另一个叶子节点, 当点击这个叶子节点的父节点时, 初始选中的叶子节点的选中状态消失了, 出现在父节点上了; 虽然不会改变选择框中的值, 但也算一个显示 `bug`

![select bug](/img/element-ui/014.gif)

所以我们需要在判断是否是叶子节点中做一些处理: 如果不是叶子节点, 需要设置当前选中为上一个已选中的叶子节点或 `null`(没有上一个已选中的叶子节点)

``` JS
// 判断叶子节点
if (this.isLeafFun ? this.isLeafFun(currentNode, node) : !node.isLeaf && this.currentIsLeaf) {
  // 如果不是叶子节点, 设置当前选中节点仍为上一个叶子节点
  this.$refs.tree.setCurrentKey(this.selectData || null)
  return
}
```

### v-model 绑定的值赋值为空后, 界面仍显示上次的值(已解决)

主要问题出现在这里:

``` JS
// 单选, 节点被点击时的回调, 返回被点击的节点数据
handleCurrentChange() {
  // do something
  const currentNode = this.$refs.tree.getCurrentNode()
  // 初始值为空
  if (!currentNode) return
  // do something
}
```

这里由于 `v-model` 传入的是一个空值, 在 `tree` 中无法找到(其实不只是空值, 只要是在 `tree` 中无法找到就有这个问题), 从而直接返回了, 并没有对 `selectData` 做清空操作, 导致仍显示上次的结果

所以我们需要在这里清空一下 `selectData`

``` JS
// 单选, 节点被点击时的回调, 返回被点击的节点数据
handleCurrentChange() {
  // do something
  const currentNode = this.$refs.tree.getCurrentNode()
  // 当前传入的值在 tree 中无法找到, 需要清空 select 值
  if (!currentNode) {
    this.selectData = ''
    return
  }
  // do something
}
```

可能有小伙伴问了: 你下面也有清空操作, 这里也有, 那直接把清空操作提出来, 在这里清空不就好了吗? 下面就不用写了呀

但这里不能将清空操作提出来, 因为下面还有一个判断叶子节点的逻辑. 如果在这里清空了, 下面进入判断叶子节点的逻辑后, 直接返回了: 这里正常逻辑是维持界面显示不变, 但由于上面清空了, 导致与实际情况不符, 所以不能提出来
