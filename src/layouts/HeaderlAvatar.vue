<template>
  <a-dropdown style="display: inline-block; height: 100%; vertical-align: initial">
    <span style="cursor: pointer">
      <a-avatar class="avatar" size="small" shape="circle" :src="currUser.avatar" />
      <router-link to="/login">
        <span @click="fun">点击退出</span>
      </router-link>

    </span>
    <!-- <a-menu style="width: 150px" slot="overlay"> -->
    <!-- <a-menu-item>
        <a-icon type="user" />
        <span>个人中心</span>
      </a-menu-item>
      <a-menu-item>
        <a-icon type="setting" />
        <span>设置</span>
      </a-menu-item>
      <a-menu-divider /> -->
    <!-- <a-menu-item>
        <router-link to="/login">
          <a-icon type="poweroff" />
          <span>退出登录</span>
        </router-link>
      </a-menu-item> -->
    <!-- </a-menu> -->
  </a-dropdown>
</template>

<script>
export default {
  name: "HeaderAvatar",
  computed: {
    currUser() {
      return this.$store.state.account.user;
    }
  },
  methods: {
    fun() {
      sessionStorage.setItem("menuBoolean", false);
    }
  }
};
</script>

<style lang="less" scoped>
.avatar {
  margin: 20px 4px 20px 0;
  color: #1890ff;
  background: hsla(0, 0%, 100%, 0.85);
  vertical-align: middle;
}
</style>
