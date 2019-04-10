<template>
  <a-locale-provider :locale="zh_CN">
    <page-layout :desc="desc" :title="title" :linkList="linkList">
      <div slot="extra" class="extraImg">
        <img :src="extraImage" />
      </div>
      <transition name="page-toggle">
        <!-- <keep-alive v-if="multipage">
        <router-view ref="page" />
      </keep-alive> -->
        <router-view ref="page" />
      </transition>
    </page-layout>
  </a-locale-provider>

</template>

<script>
import PageHeader from "../components/page/PageHeader";
import PageLayout from "./PageLayout";
import zh_CN from 'ant-design-vue/lib/locale-provider/zh_CN';

export default {
  name: "PageView",
  components: { PageLayout, PageHeader },
  data() {
    return {
      title: "",
      desc: "",
      linkList: [],
      extraImage: "",
      zh_CN,
    };
  },
  computed: {
    multipage() {
      return this.$store.state.setting.multipage;
    }
  },
  mounted() {
    this.getPageHeaderInfo();
  },
  updated() {
    this.getPageHeaderInfo();
  },
  methods: {
    getPageHeaderInfo() {
      this.title = this.$route.name;
      const page = this.$refs.page;
      if (page) {
        this.desc = page.desc;
        this.linkList = page.linkList;
        this.extraImage = page.extraImage;
      }
    }
  }
};
</script>

<style lang="less" scoped>
.extraImg {
  margin-top: -60px;
  text-align: center;
  width: 195px;
  img {
    width: 100%;
  }
}
</style>
