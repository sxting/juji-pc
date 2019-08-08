<template>
    <div>
      <a-button @click="addNew" type="primary">发布新内容</a-button>

    </div>
  </template>

  <script>

  export default {
    name: "zhongcaoManage",
    components: {},
    data() {
      return {

      };
    },
    mounted() {

    },
    beforeUpdate: function() {

    },
    watch: {

    },
    methods: {
      addNew() {
        this.$router.push({
        path: "/operate/zhongcaoAdd",
        query: {}
      });
      }
    }
  };
  </script>

  <style lang="less" scoped>
    .editor {
      width: 800px;
    }
  </style>
