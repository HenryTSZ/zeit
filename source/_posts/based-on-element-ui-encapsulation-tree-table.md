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

### 查阅官方文档

首先查看官方文档发现两个参数:

| 参数               | 说明                                                                                              | 类型    | 可选值 | 默认值 |
| ------------------ | ------------------------------------------------------------------------------------------------- | ------- | ------ | ------ |
| default-expand-all | 是否默认展开所有行, 当 Table 包含展开行存在或者为树形表格时有效                                   | Boolean | -      | false  |
| expand-row-keys    | 可以通过该属性设置 Table 目前的展开行, 需要设置 row-key 属性才能使用, 该属性为展开行的 keys 数组. | Array   | -      |

这里我想到一个最笨到办法: 我们可以对源数据进行处理, 根据层级将数据分类, 将相同层级的 `id` 放到一个数组中, 将这些数组和层级做一个 `map` 映射. `level` 等于 `0` 时, `default-expand-all` 为 `true` , 大于 `0` 时, 从映射中取出对应的数组, 给 `expand-row-keys` 赋值, 这样不就可以了吗. 我真是一个天才啊. 但结果总是在那么不经意间给你当头一棒(这个暂且不表, 后续会说明的)

所以 `html` 为:

```HTML
<el-table
  class="tree-table"
  :ref="ref"
  v-bind="$attrs"
  :default-expanded-all="defaultExpandAll"
  :expand-row-keys="expandRowKeys"
>
  <slot></slot>
</el-table>
```

### 参考 el-tree 方法

由于本人曾经封装过 `el-tree` 的相同功能, 所以想着 `el-table` 是不是可以参考一下呢? 结果发现还是太年轻啊

封装 `el-tree` 的思路:

> 先找出 `tree` 的所有 `node` , 再根据传入的 `level` 来判断 `node` 是展开还是折叠状态

`level` 的 `props` 和 `watch` 这里就不在赘述了, 和 `el-tree` 是一样的. 就说一下怎么处理展开折叠吧

`tree` 的 `store` 有 `_getAllNodes` 方法可以获取所有数据, 但 `table` 没有. 没有怎么办? 找找看有没有别的方法或数据吧.

终于经过大半天的苦苦探索后, 发现了这个: `this.$refs[this.ref].store.states.treeData`

```JS
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

### 处理数据

首先我们来分析一下数据: 我们一般说 展开到 `level` 级是指到 `level` 级前是展开状态, 那 `treeData` 的 `level` 和咱们说的 `level` 相差为 `2` , 所以我们比较的时候需要将传入的 `level` 减去 `2` . 而 `level = 0` 时是指全部展开, 所以此时 `level` 应该为 `treeData` 的 `maxLevel`

我们先处理一下数据:

```JS
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

```JS
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
   *  // 但如果数据量很大, 重新渲染会很耗性能, 所以不推荐使用
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

```JS
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

### 优化

虽然实现功能了, 但上面自己义正言辞的说 `key` 不能用, 这里倒用的挺勤快的. 这不是既当又立吗? 而且 `level` 增加的时候其实是不需要的, 只有减少的时候才需要, 那这里再判断一下? 还有如果使用这个组件的时候传入 `default-expand-all` , 展开折叠完全无效好伐

现在问题好像有点麻烦了, 咱们是不是一开始方向就错了? 当初自己也说了这是一个笨办法, 是不是有什么细节被忽略了呢?

咱们再看一下 `treeData`

```JS
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

```JS
for (const key in this.treeData) {
  if (this.treeData.hasOwnProperty(key)) {
    this.treeData[key].expanded = this.treeData[key].level <= level
  }
}
```

搞定! 不需要 `key`, 传入的 `default-expand-all` 也不影响了, 完美. 哎, 写代码就是这么朴实无华且枯燥

## 全选

这个正好从网上找到一个大佬分享的方法: [el-table 树形结构的复选 - 个人文章 - SegmentFault 思否](https://segmentfault.com/a/1190000021501121), 修改一下应该就可以了

### 分析大佬代码

首先大佬是直接写死的 `row-key` 和 `children`, 而我们现在是封装成组件, 那就需要定义成变量; 还需要把那几个选择方法 `emit` 出去; 而且大佬这个方法只能够选到第二级, 所以需要用到递归

### 处理数据

```HTML
<el-table
  class="tree-table"
  :ref="ref"
  :data="data"
  v-bind="$attrs"
  @select="select"
  @select-all="selectAll"
  @selection-change="selectionChange"
  v-on="$listeners"
>
  <slot></slot>
</el-table>
```

```JS
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
    rowKey: '',
    children: '',
    timeout: null
  }
},
methods: {
  handleData() {
    this.treeData = this.$refs[this.ref].store.states.treeData
    this.maxLevel =
      Math.max.apply(
        null,
        Object.values(this.treeData).map(({ level }) => level)
      ) + 2
    this.$emit('max-level', this.maxLevel)

    // 保存变量
    this.rowKey = this.$refs[this.ref].rowKey
    this.children = this.$refs[this.ref].treeProps.children
  },

  // 手动勾选数据行
  select(selection, row) {
    // 判断当前行是否选中
    const selected = selection.some(item => item[this.rowKey] === row[this.rowKey])
    // 处理所有子级
    this.selectChildren(row, selected)
  },
  selectAll(selection) {
    // tableData 第一层只要有在 selection 里面就是全选
    const tableDataIds = this.data.map(({id}) => id)
    const isSelect = selection.some(item => tableDataIds.includes(item.id))
    // tableDate 第一层只要有不在 selection 里面就是全不选
    const selectIds = selection.map(({id}) => id)
    const isCancel = !this.data.every(item => selectIds.includes(item.id))
    if (isSelect) {
      selection.forEach(item => {
        this.selectChildren(item, isSelect)
      })
    }
    if (isCancel) {
      this.data.forEach(item => {
        this.selectChildren(item, !isCancel)
      })
    }
  },
  selectChildren(row, selected) {
    if (row[this.children] && Array.isArray(row[this.children])) {
      row[this.children].forEach(item => {
        this.toggleSelection(item, selected)
        this.selectChildren(item, selected)
      })
    }
  },
  selectionChange(selection) {
    // 这个其实多此一举了
    this.$emit('selection-change', selection)
  },
  toggleSelection(row, select) {
    row && this.$nextTick(() => {
      this.$refs[this.ref] && this.$refs[this.ref].toggleRowSelection(row, select)
    })
  },
  cancelAll() {
    this.$refs[this.ref] && this.$refs[this.ref].clearSelection()
  }
}
```

### 优化

1. `selection`、`row` 和 `this.data` 中的对象引用地址是相同的, 所以可以直接比较, 不用比较 `id`
2. `selectAll` 只有两种状态, 所以只判断一种情况即可
3. 切换全选和父级的状态时, `selectionChange` 会触发多次, 需要防抖

```js
methods: {
  handleData() {
    this.treeData = this.$refs[this.ref].store.states.treeData
    this.maxLevel =
      Math.max.apply(
        null,
        Object.values(this.treeData).map(({ level }) => level)
      ) + 2
    this.$emit('max-level', this.maxLevel)

    // 保存变量
    this.children = this.$refs[this.ref].treeProps.children
  },

  // 手动勾选数据行
  select(selection, row) {
    // 判断当前行是否选中
    // 不需要判断 id, 因为引用地址相同
    const selected = selection.some(item => item === row)
    // 处理所有子级
    this.selectChildren(row, selected)
  },
  selectAll(selection) {
    /*
     * 这里我做了一些优化:
     * selectAll 只有两种状态: 全选和全不选
     * 所以我们只需要判断一种状态即可
     * 而且也不需要判断 id, 因为 selection 和 this.data 中对象引用地址是相同的
     */
    // tableData 第一层只要有在 selection 里面就是全选
    const isSelect = this.data.some(item => selection.includes(item))
    if (isSelect) {
      selection.forEach(item => {
        this.selectChildren(item, isSelect)
      })
    } else {
      this.data.forEach(item => {
        this.selectChildren(item, isSelect)
      })
    }
  },
  selectChildren(row, selected) {
    if (row[this.children] && Array.isArray(row[this.children])) {
      row[this.children].forEach(item => {
        this.toggleSelection(item, selected)
        this.selectChildren(item, selected)
      })
    }
  },
  selectionChange(selection) {
    this.debounce(this.emitSelectionChange, 100, selection)
  },
  emitSelectionChange(selection) {
    this.$emit('selection-change', selection)
  },
  toggleSelection(row, select) {
    row && this.$nextTick(() => {
      this.$refs[this.ref] && this.$refs[this.ref].toggleRowSelection(row, select)
    })
  },
  cancelAll() {
    this.$refs[this.ref] && this.$refs[this.ref].clearSelection()
  },
  // 防抖
  debounce(fun, wait, params) {
    clearTimeout(this.timeout)
    this.timeout = setTimeout(fun, wait, params)
  }
}
```

### 存在的问题

1. 目前我们只是把 `selection-change` `emit` 出去了, `select` 和 `select-all` 并没有 `emit` 出去. 鉴于工作中很少用到这两个方法, 暂时就先不做处理了, 以后如果需要再说
2. 选中子级的时候, 父级没有联动, 无法出现半选和选中状态, 只有表头的全选有联动.

## 添加配置项

现在我们实现了展开到 `level` 级和全选功能. 万一有人需要展开到 `level` 级, 而全选功能保持原来到样子怎么办?

所以我们需要添加一些配置项来让使用者控制功能

目前需要两个配置项:

1. check-strictly: Boolean, 同 el-tree, 在显示复选框的情况下，是否严格的遵循父子不互相关联的做法，默认为 false
2. check-all: Boolean, 点击表头的多选框时, 是否影响全部数据, 默认为 true

代码如下:

```JS
props: {
  checkStrictly: {
    type: Boolean,
    default: false
  },
  checkAll: {
    type: Boolean,
    default: true
  }
},
methods: {
  select(selection, row) {
    if (this.checkStrictly) {
      this.$emit('select', selection, row)
      return
    }
    // ...
  },
  selectAll(selection) {
    if (!this.checkAll) {
      this.$emit('select-all', selection)
      return
    }
    // ...
  }
}
```

## 修正

当初封装组件的时候没有测试方法, 今天一测试, 发现 `selection-change`、 `select` 和 `select-all` 都触发了, 而且 `selection-change` 触发了两次, 一次是 `el-table` 的, 一次是咱 `emit` 出去的, 如果选中的是父级并且 `check-strictly` 为 `false` 时, 会触发多次, 咱做的防抖确实是只 `emit` 最后一次, 但 `el-table` 自己会触发多次

一直以为 `$listeners` 和 `$attrs` 是一样的: 写在标签里的属性会覆盖 `$attrs`; 但方法不会, ~~我想应该是方法是对象, 引用地址不同, 所以不会覆盖~~

关于这两个属性的介绍可以看看这篇文章: [Vue $attrs 和 $listeners | Henry](https://tsz.now.sh/2020/04/06/vue-$attrs-$listeners/)

那这样的话就需要咱们自己覆盖了

```HTML
<el-table
  class="tree-table"
  :ref="ref"
  :data="data"
  v-bind="$attrs"
  v-on="{ ...$listeners, select, 'select-all': selectAll, 'selection-change': selectionChange }"
>
  <slot></slot>
</el-table>
```

```JS
select(selection, row) {
  if (!this.checkStrictly) {
    const selected = selection.some(item => item === row)
    this.selectChildren(row, selected)
  }
  this.$emit('select', selection, row)
},
selectAll(selection) {
  if (this.checkAll) {
    // tableData 第一层只要有在 selection 里面就是全选
    const isSelect = this.data.some(item => selection.includes(item))
    if (isSelect) {
      selection.forEach(item => {
        this.selectChildren(item, isSelect)
      })
    } else {
      this.data.forEach(item => {
        this.selectChildren(item, isSelect)
      })
    }
  }
  // 使用 $nextTick 以后可以正确 emit 出去当前选中项
  this.$nextTick(() => {
    this.$emit('select-all', selection)
  })
}
```

而且我还发现一个现象: 使用 `console.log` 输出 `selectAll` 的 `selection` 一开始为所有根级, 但点击以后发现是全部数据, 那么就可以使用 `$nextTick` 来 `emit` 正确数据了. 但 `select` 的 `selection` 不会变, 所以这个在选中父级后, 仍然只能 `emit` 父级, 想要将子级也全部 `emit` 出去, 那就还需要递归将所有子级全部加到 `selection` 中去. 鉴于目前没有使用到这个数据, 就暂时不做处理了, 等以后需要或者想到更好办法了再解决吧.

## 实际工作中发现的问题

### data 变化后无法展开层级

由于本人测试的时候, `data` 是写死的, 而实际工作中, 一般都是初始值为 `[]`, 随后通过接口获取重新赋值. 这个时候发现展开层级无效了, 所以还需要 `watch` 一下 `data`

```JS
watch: {
  level: {
    handler: 'expandToLevel',
    immediate: true
  },
  data: {
    handler: 'handleData',
    deep: true
  }
},
methods: {
  async expandToLevel() {
    if (!this.$refs[this.ref]) return
    if (!this.maxLevel) {
      await this.handleData()
    }
    let level = 0
    if (this.level <= 0) {
      level = this.maxLevel - 2
    } else {
      level = this.level - 2
    }
    for (const key in this.treeData) {
      if (this.treeData.hasOwnProperty(key)) {
        this.treeData[key].expanded = this.treeData[key].level <= level
      }
    }
  },
  handleData() {
    this.$nextTick(() => {
      this.treeData = this.$refs[this.ref].store.states.treeData
      // 防止出现 -Infinity
      const levels = Object.values(this.treeData).map(({ level }) => level)
      if (levels.length) {
        this.maxLevel = Math.max.apply(null, levels) + 2
      } else {
        this.maxLevel = 0
      }
      this.$emit('max-level', this.maxLevel)

      this.children = this.$refs[this.ref].treeProps.children
      return Promise.resolve()
    })
  }
}
```

## columns 中 label、prop 需支持动态设置

有一个项目是动态表头, 需要后端生成返给前端. 当然可以和后端约定好字段, 但咱们作为一个成熟的框架, 也需要支持这个需求

```JS
props: {
  keyProps: {
    type: Object,
    default() {
      return null
    }
  }
},
computed: {
  cols() {
    return this.keyProps
      ? this.columns.map(column => ({
          ...column,
          prop: column[this.keyProps.prop || 'prop'],
          label: column[this.keyProps.label || 'label']
        }))
      : this.columns
  }
}
```

目前只支持这两个字段, 以后有可能还需要扩展支持更多自定义字段, 需要的时候再加
