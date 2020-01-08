<template>
  <!-- class 为组件名的 kebab 形式, 即以中划线分割的单词组 -->
  <div class="projects-list">
    <scroller>
      <group>
        <cell>
          <!-- 组件名统一使用 kebab 形式 -->
          <number-input></number-input>
        </cell>
      </group>
    </scroller>
  </div>
</template>

<script>
// 首先引入 'vuex'
import { mapState, mapGetters, mapActions } from 'vuex'
// 先引入自己的组件, 根据组件出现在页面的位置从上到下依次引入
import Scroller from '@components/Scroller'
import NumberInput from '@components/NumberInput'
// 再引入 UI 组件
import { Group, Cell } from 'vux'
// 引入 mixins
import mixins from '@components/mixins'
// 组件的选项统一使用以下顺序
export default {
  // 为防止 name 重复, 统一设置为组件名
  name: 'ProjectsList',
  // 组件注册顺序和引入顺序保持统一
  components: {
    Scroller,
    NumberInput,
    Group,
    Cell
  },
  mixins: [mixins],
  // props 最好包含类型检查和默认值; 默认值如果为对象, 必须使用 return 返回
  props: {
    list: {
      type: Array,
      default() {
        return []
      }
    }
  },
  // data 定义变量的顺序根据出现在页面的位置从上到下依次定义
  data() {
    return {
      projectsList: []
    }
  },
  // computed 优先计算 'vuex'
  computed: {
    ...mapState(['projectId']),
    ...mapGetters(['isOffline']),
    disabled() {
      return !projectsList.length
    }
  },
  watch: {
    list() {
      this.init()
    }
  },
  methods: {
    // 方法中最好有一个 init, 来执行页面初始化的所有函数
    init() {
      this.fetchProjectList()
    },
    // 方法顺序也是根据出现在页面的位置从上到下依次写入
    // 如果页面是 增删改查, 按照: 查--增--改--删 的顺序写入
    fetchProjectList() {},
    addProject(){},
    editProject(){},
    deleteProject(){},
    // format 类型的函数最后写入
    formatProject(){},
  },
  created() {},
  mounted() {
    this.init()
  }
}
</script>

<style lang="less">
/*
  * css 不推荐通过添加 scope 来防止样式冲突(使用 scope 会导致无法覆盖某些 ui 组件库样式)
  * 而使用一个大类包裹当前页面所有样式来防止样式冲突
  * 当然必须保证这个大类在该项目中的唯一性
  * 最保险的办法就是同时使用特定前缀和组件名
  * 比如 page-projects-list, page 这个前缀只有组件的大类才可以使用
  */
.projects-list {
  width: 100%;
}
</style>
