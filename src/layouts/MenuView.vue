<template>
  <global-layout>
    <contextmenu :itemList="menuItemList" :visible.sync="menuVisible" @select="onMenuSelect" />
    <!-- <a-tabs
      @contextmenu.native="e => onContextmenu(e)"
      v-if="multipage"
      :active-key="activePage"
      style="margin-top: -8px; margin-bottom: 8px"
      :hide-add="true"
      type="editable-card"
      @change="changePage"
      @edit="editPage">
      <a-tab-pane :id="page.fullPath" :key="page.fullPath" v-for="page in pageList">
        <span slot="tab" :pagekey="page.fullPath">{{page.name}}</span>
      </a-tab-pane>
    </a-tabs> -->
    <transition name="page-toggle">
      <!-- <keep-alive v-if="multipage">
        <router-view />
      </keep-alive> -->
      <router-view/>
    </transition>
  </global-layout>
</template>

<script>
import GlobalLayout from './GlobalLayout'
import Contextmenu from '../components/menu/Contextmenu'
export default {
  name: 'MenuView',
  components: {Contextmenu, GlobalLayout},
  data () {
    return {
      activePage: '',
      menuVisible: false,
      menuItemList: [
        { key: '1', icon: 'arrow-left', text: '关闭左侧' },
        { key: '2', icon: 'arrow-right', text: '关闭右侧' },
        { key: '3', icon: 'close', text: '关闭其它' }
      ]
    }
  },
  computed: {
    multipage () {
      return this.$store.state.setting.multipage
    }
  },
  created () {
    this.activePage = this.$route.fullPath
  },
  watch: {
    '$route': function (newRoute, oldRoute) {
      this.activePage = newRoute.fullPath
    },
    'activePage': function (key) {
      this.$router.push(key)
    },
    'multipage': function (newVal, oldVal) {
    }
  },
  methods: {
    changePage (key) {
      this.activePage = key
    },
    editPage (key, action) {
      this[action](key)
    },
    onContextmenu (e) {
      const pagekey = this.getPageKey(e.target)
      if (pagekey !== null) {
        e.preventDefault()
        this.menuVisible = true
      }
    },
    /**
     * 由于ant-design-vue组件库的TabPane组件暂不支持自定义监听器，无法直接获取到右键target所在标签页的 pagekey 。故增加此方法用于
     * 查询右键target所在标签页的标识 pagekey ，以用于自定义右键菜单的事件处理。
     * 注：TabPane组件支持自定义监听器后可去除该方法并重构 ‘自定义右键菜单的事件处理’
     * @param target 查询开始目标
     * @param count 查询层级深度 （查找层级最多不超过3层，超过3层深度直接返回 null）
     * @returns {String}
     */
    getPageKey (target, depth) {
      depth = depth || 0
      if (depth > 2) {
        return null
      }
      let pageKey = target.getAttribute('pagekey')
      pageKey = pageKey || (target.previousElementSibling ? target.previousElementSibling.getAttribute('pagekey') : null)
      return pageKey || (target.firstElementChild ? this.getPageKey(target.firstElementChild, ++depth) : null)
    },
    onMenuSelect (key, target) {
      let pageKey = this.getPageKey(target)
      switch (key) {
        case '1':
          this.closeLeft(pageKey)
          break
        case '2':
          this.closeRight(pageKey)
          break
        case '3':
          this.closeOthers(pageKey)
          break
        default:
          break
      }
    },

  }
}
</script>

<style scoped>

</style>
