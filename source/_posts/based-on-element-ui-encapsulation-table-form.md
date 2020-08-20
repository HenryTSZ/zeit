---
title: 基于 ElementUI 封装的基础 table 和 form
date: 2020-05-16
categories: [FrontEnd]
tags: [Js, ElementUI]
thumbnail: /img/element-ui/thumbnail.svg
---

一般做后台管理系统的项目, 用到最多的 `UI` 组件应该就是表格和表单吧.

一个最基础的例子就是上面一排操作按钮: 增删改查; 下面一个表格, 展示数据; 增改的时候弹出表单; 而且大部分情况下表格和表单的字段都是一样的, 但却要写两套代码, 作为一个崇尚简洁的程序员, 越简洁越好(才不是懒得写呢)

所以就想封装一下这两个组件, 最好一行代码就搞定了

<!-- more -->

## 分析现有代码

### table

先看 `table` 例子:

```html
<el-table :data="tableData" style="width: 100%">
  <el-table-column prop="date" label="日期" width="180"> </el-table-column>
  <el-table-column prop="name" label="姓名" width="180"> </el-table-column>
  <el-table-column prop="address" label="地址"> </el-table-column>
</el-table>
```

我们可以把 `column` 这部分抽出一个数组, 数组中包含所有属性; 和 `data` 似的传入封装好的组件中, 组件自己遍历生成 `el-table-column` , 那咱们调用组件的时候是不是就一行代码就搞定了呀:

```HTML
<base-table :data="tableData" :columns="columns" style="width: 100%"></base-table>
```

### form

再看 `form` 例子:

```HTML
<el-form ref="form" :model="form" label-width="80px">
  <el-form-item label="活动名称">
    <el-input v-model="form.name"></el-input>
  </el-form-item>
  <el-form-item label="活动区域">
    <el-select v-model="form.region" placeholder="请选择活动区域">
      <el-option label="区域一" value="shanghai"></el-option>
      <el-option label="区域二" value="beijing"></el-option>
    </el-select>
  </el-form-item>
  <el-form-item label="活动时间">
    <el-col :span="11">
      <el-date-picker
        type="date"
        placeholder="选择日期"
        v-model="form.date1"
        style="width: 100%;"
      ></el-date-picker>
    </el-col>
    <el-col class="line" :span="2">-</el-col>
    <el-col :span="11">
      <el-time-picker
        placeholder="选择时间"
        v-model="form.date2"
        style="width: 100%;"
      ></el-time-picker>
    </el-col>
  </el-form-item>
  <el-form-item label="即时配送">
    <el-switch v-model="form.delivery"></el-switch>
  </el-form-item>
  <el-form-item label="活动性质">
    <el-checkbox-group v-model="form.type">
      <el-checkbox label="美食/餐厅线上活动" name="type"></el-checkbox>
      <el-checkbox label="地推活动" name="type"></el-checkbox>
      <el-checkbox label="线下主题活动" name="type"></el-checkbox>
      <el-checkbox label="单纯品牌曝光" name="type"></el-checkbox>
    </el-checkbox-group>
  </el-form-item>
  <el-form-item label="特殊资源">
    <el-radio-group v-model="form.resource">
      <el-radio label="线上品牌商赞助"></el-radio>
      <el-radio label="线下场地免费"></el-radio>
    </el-radio-group>
  </el-form-item>
  <el-form-item label="活动形式">
    <el-input type="textarea" v-model="form.desc"></el-input>
  </el-form-item>
  <el-form-item>
    <el-button type="primary" @click="onSubmit">立即创建</el-button>
    <el-button>取消</el-button>
  </el-form-item>
</el-form>
```

`form` 就比较难一些了: 不仅要判断表单类型( `input` , `select` , `textarea` 等等), `select` 等表单还需要 `option` 数组

为了实现一行代码就搞定, 所以我们最终调用的方式应该是这样的:

```HTML
<base-form ref="form" :model="form" :form-items="formItems" label-width="80px"></base-form>
```

那就需要在 `formItems` 中做处理了: 首先需要区分表单类型; 对于 `select` 等这类表单, 还需要传入 `option` 选择数组

## 初稿

### table

`table` 就比较简单了

组件源码:

```HTML
<el-table v-bind="$attrs">
  <el-table-column
    v-for="column in columns"
    :key="column.prop"
    v-bind="column"
  >
  </el-table-column>
</el-table>
```

```JS
name: 'BaseTable',
props: {
  columns: {
    type: Array,
    default () {
      return []
    }
  }
}
```

调用:

```HTML
<base-table :data="tableData" :columns="columns" style="width: 100%"></base-table>
```

```JS
data() {
  return {
    tableData: [
      {
        date: '2016-05-02',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄'
      }
    ],
    columns: [
      {
        label: '日期',
        prop: 'date',
        width: 180
      },
      {
        label: '姓名',
        prop: 'name',
        width: 180
      },
      {
        label: '地址',
        prop: 'address'
      }
    ]
  }
}
```

### form

`form` 需要做的事情比 `table` 多一些

组件源码:

```HTML
<el-form v-bind="$attrs" :model="model">
  <el-form-item v-for="item in formItems" :key="item.prop">
    <el-input
      v-if="item.type === 'input'"
      v-model="model[item.prop]"
      v-bind="item"
    >
    </el-input>
    <el-select v-if="item.type === 'select'" v-model="model[item.prop]" v-bind="item">
      <el-option
        v-for="option in item.select"
        :key="option.value"
        :label="option.label"
        :value="option.value">
      </el-option>
    </el-select>
    <el-switch
      v-if="item.type === 'switch'"
      v-model="model[item.prop]"
      v-bind="item"
    >
    </el-switch>
  </el-form-item>
</el-form>
```

其余的表单就不写了, 都差不多的样子

```JS
name: 'BaseForm',
props: {
  modle: {
    type: Object,
    default() {
      return {}
    }
  },
  formItems: {
    type: Array,
    default() {
      return []
    }
  }
}
```

调用:

```HTML
<base-form ref="form" :model="form" :form-items="formItems" label-width="80px"></base-form>
```

```JS
data() {
  return {
    form: {
      name: '',
      region: ''
    },
    formItems: [
      {
        type: 'input',
        label: '活动名称',
        prop: 'name'
      },
      {
        type: 'select',
        label: '活动区域',
        prop: 'region',
        select: [
          {
            label: '区域一',
            value: 'shanghai'
          },
          {
            label: '区域二',
            value: 'beijing'
          }
        ]
      }
    ]
  }
}
```

## 优化

目前使用我们封装好的组件, 确实可以实现一行代码就搞定的效果, 而且如果 `form` 和 `table` 字段一样的话, `formItems` 和 `columns` 完全可以合并为一个数组. 但还有几个问题:

1. `BaseTable` 功能过于单一, 只能展示数据, 我们实际工作中还有可编辑的表格
2. `BaseForm` 封装的组件重复代码太多, 判断太多, 很多时候只是组件名字不同, 里面内容完全一致, 比如 `el-input` 和 `el-switch`; 现在把 `ElementUI` 所有表单元素都写进去了, 但实际上就 `el-input` 用的比较多, 而且可扩展性不好, 想要再加表单, 就需要修改封装的组件的源码

综合以上两个问题我们不难看出目前的主要问题就是这些可编辑的表单元素, 那我们解决了这个问题就可以了呀

> 只是组件名字不同, 里面内容完全一致

从这句话想到了什么吗? 对! 就是这个 `Vue` 内置组件: [component](https://cn.vuejs.org/v2/api/#component)

我们完全可以去掉那些 `v-if` 判断, 而只使用 `component` 即可, 这样可扩展性问题也解决了:

```HTML
<el-form v-bind="$attrs" :model="model">
  <el-form-item v-for="item in formItems" :key="item.prop">
    <component :is="item.type" v-model="model[item.prop]" v-bind="item">
      <el-option
        v-for="option in item.select"
        :key="option.value"
        :label="option.label"
        :value="option.value"
      >
      </el-option>
      <el-radio
        v-for="radio in item.radio"
        :key="radio[item.value]"
        :label="radio[item.value]"
      >
        {{ radio[item.label] }}
      </el-radio>
    </component>
  </el-form-item>
</el-form>
```

是不是一下就简单多了?

那么现在 `item.type` 就是组件的名字了, 比如 `el-input`; 关于 `el-select` 这类还需要有选择数据的组件(`el-option`, `el-radio` 等), 我目前是全部放到 `component` 里面的, 一来是不传这些选择数组的时候, 就不会渲染, 二来是就算渲染了, 组件内部 `slot` 如果不接收, 也不会显示出来, 三呢就是这些组件已经在项目中使用了, 改动的话有点麻烦, 所以如果是新项目, 这些也可以使用 `component`

那 `form` 的改完了, `table` 是不是也可以使用这个呢?

```HTML
<el-table v-bind="$attrs" v-on="$listeners">
  <template v-for="(column, index) in columns">
    <el-table-column v-if="column.editable" :key="column.prop" v-bind="column">
      <component
        slot-scope="{ row }"
        :is="column.type"
        v-model="row[column.prop]"
        v-bind="column"
      >
        <el-option
          v-for="option in column.select"
          :key="option.value"
          :label="option.label"
          :value="option.value"
        >
        </el-option>
        <el-radio
          v-for="radio in column.radio"
          :key="radio[column.value]"
          :label="radio[column.value]"
        >
          {{ radio[column.label] }}
        </el-radio>
      </component>
    </el-table-column>
    <el-table-column v-else :key="column.prop" v-bind="column"> </el-table-column>
  </template>
</el-table>
```

一想到这个组件可能被很多地方使用, 那咱们是不是也需要将这个可编辑的组件也封装为一个组件呢?

## 封装可编辑组件

这个就没啥好说的了, 就是把上面的拿下来即可

```HTML
<component :is="item.type" v-model="model[item.prop]" v-bind="item">
  <el-option
    v-for="option in item.select"
    :key="option.value"
    :label="option.label"
    :value="option.value"
  >
  </el-option>
  <el-radio
    v-for="radio in item.radio"
    :key="radio[item.value]"
    :label="radio[item.value]"
  >
    {{ radio[item.label] }}
  </el-radio>
</component>
```

```JS
name: 'EditableElements',
props: {
  item: {
    type: Object,
    default() {
      return {}
    }
  },
  model: {
    type: Object,
    default() {
      return {}
    }
  }
}
```

## 终稿

到这里本次封装之旅差不多就结束了, 想想还有点小激动呢!

闲话不多说, 加了亿点点小细节, `enjoy`

这里是源码: [BaseForm](https://github.com/HenryTSZ/vue-element-extend/blob/master/src/plugins/BaseForm.vue), [BaseTable](https://github.com/HenryTSZ/vue-element-extend/blob/master/src/plugins/BaseTable.vue), [EditableElements](https://github.com/HenryTSZ/vue-element-extend/blob/master/src/plugins/EditableElements.vue)

以下为简略代码:

### form

```HTML
<el-form v-bind="$attrs" :model="model" ref="elForm" class="base-form">
  <slot name="prev"></slot>
  <el-form-item
    v-for="item in items"
    :key="item.prop"
    v-bind="item"
    :rules="[
      {
        required: !item.noRequired,
        message: item.ruleMessage || `${handlePlaceholder(item.type)}${item.label}`,
        trigger: item.type === 'select' ? 'change' : 'blur'
      },
      ...(rules[item.prop] || [])
    ]"
  >
    <editable-elements :model="model" :item="item" v-on="$listeners"></editable-elements>
  </el-form-item>
  <slot></slot>
</el-form>
```

```JS
props: {
  keyProps: {
    type: Object,
    default() {
      return null
    }
  },
  model: {
    type: Object,
    default() {
      return {}
    }
  },
  formItems: {
    type: Array,
    default() {
      return []
    }
  },
  rules: {
    type: Object,
    default() {
      return {}
    }
  }
},
computed: {
  items() {
    return this.keyProps
      ? this.formItems.map(item => ({
          ...item,
          prop: item[this.keyProps.prop || 'prop'],
          label: item[this.keyProps.label || 'label']
        }))
      : this.formItems
  }
}
```

### table

```HTML
<el-table ref="elTable" class="base-table" v-bind="$attrs" v-on="$listeners">
  <slot name="prev"></slot>
  <template v-for="(column, index) in cols">
    <el-table-column v-if="column.editable" :key="column.prop" v-bind="column">
      <editable-elements
        slot-scope="{ row, $index }"
        :model="row"
        :item="{ ...column, focus: index === focusCol && $index === focusRow }"
        @change="change(row, $event, column)"
      ></editable-elements>
    </el-table-column>
    <el-table-column v-else :key="column.prop" v-bind="column"> </el-table-column>
  </template>
  <slot></slot>
</el-table>
```

```JS
props: {
  keyProps: {
    type: Object,
    default() {
      return null
    }
  },
  columns: {
    type: Array,
    default() {
      return []
    }
  },
  focusRow: {
    type: Number,
    default: 0
  },
  focusCol: {
    type: Number,
    default: 0
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

### editable-elements

```HTML
<component
  :is="item.component"
  v-model="model[item.prop]"
  :key="item.prop"
  v-bind="item"
  v-focus="item.focus"
  :placeholder="item.placeholder || `${handlePlaceholder(item.type)}${item.label}`"
  v-on="{ ...$listeners, ...item.events }"
>
  {{ item.type === 'info' ? model[item.prop] : '' }}
  <el-option
    v-for="option in item.select"
    :key="option[item.selectProps ? item.selectProps.value : 'value']"
    :value="option[item.selectProps ? item.selectProps.value : 'value']"
    :label="option[item.selectProps ? item.selectProps.label : 'label']"
  ></el-option>
  <el-radio
    v-for="radio in item.radio"
    :key="radio[item.radioProps ? item.radioProps.value : 'value']"
    :label="radio[item.radioProps ? item.radioProps.value : 'value']"
  >
    {{ radio[item.radioProps ? item.radioProps.label : 'label'] }}
  </el-radio>
  <el-checkbox v-for="checkbox in item.checkbox" :key="checkbox" :label="checkbox"></el-checkbox>
  <slot v-for="(value, key) in item.slots" :name="key" :slot="key">{{ value }}</slot>
</component>
```

## 实际工作中发现的问题

### 改变 `editable` 后页面没变化

最近项目增加了权限控制, 一些可编辑的表格需要先判断权限, 有权限才可以编辑.

所以需要动态修改 `editable` 的值, 初始为 `false`, 后续根据权限改变值.

但发现明明有权限, 却还是不可编辑状态, 而且跟踪代码也发现值确实改变了, 但页面却没有改变

只有触发页面重绘后才会变成可编辑状态, 就好像是状态其实已经改变了, 就差最后的绘制了

这时候突然想到是不是表格复用了, 仍然用的是不可编辑状态的表格: [利用 v-if 动态渲染表格时, 在 el-table-column 中添加 key 属性防止表格复用](https://tsz.now.sh/2017/09/15/element-ui-problem-collection/#%E5%88%A9%E7%94%A8-v-if-%E5%8A%A8%E6%80%81%E6%B8%B2%E6%9F%93%E8%A1%A8%E6%A0%BC%E6%97%B6-%E5%9C%A8-el-table-column-%E4%B8%AD%E6%B7%BB%E5%8A%A0-key-%E5%B1%9E%E6%80%A7%E9%98%B2%E6%AD%A2%E8%A1%A8%E6%A0%BC%E5%A4%8D%E7%94%A8)

查看代码发现果然是复用了: 可编辑和不可编辑用的相同的 `key`

```HTML
<el-table-column
  v-if="column.editable"
  :key="column.prop"
  v-bind="column">
</el-table-column>
<el-table-column
  v-else
  :key="column.prop"
  v-bind="column">
</el-table-column>
```

当初封装组件的时候想着他俩肯定只能存在一个, 用相同的 `key` 应该没什么问题, 却忘了切换 `editable` 后, 相同的 `key` 会复用的问题了

那稍微修改一下吧:

```HTML
<el-table-column
  v-if="column.editable"
  :key="`${column.prop}-edit`"
  v-bind="column">
</el-table-column>
<el-table-column
  v-else
  :key="column.prop"
  v-bind="column">
</el-table-column>
```

**所以以后尽量还是用不同的 `key` 吧, 即使是 `if else`.**
