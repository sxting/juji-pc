<template>
  <page-layout :desc="desc" :title="title" :linkList="linkList">

    <transition name="page-toggle">
      <keep-alive v-if="multipage">
        <router-view />
      </keep-alive>
      <router-view v-else />
    </transition>
  </page-layout>

</template>

<script>
import PageHeader from '../components/page/PageHeader'
import PageLayout from './PageLayout'
export default {
  name: "RouteView",
  components: {PageLayout, PageHeader},
  data () {
    return {
      title: '',
      desc: '',
      linkList: [],
      extraImage: ''
    }
  },
  computed: {
    multipage() {
      return this.$store.state.setting.multipage;
    }
  },
  mounted () {
    this.getPageHeaderInfo()
  },
  updated () {
    this.getPageHeaderInfo()
  },
  methods: {
    getPageHeaderInfo () {
      this.title = this.$route.name
      const page = this.$refs.page
      if (page) {
        this.desc = page.desc
        this.linkList = page.linkList
        this.extraImage = page.extraImage
      }
    }
  }
};
</script>

<style scoped>
</style>
