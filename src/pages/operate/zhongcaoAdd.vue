<template>
  <div>
    <div class="editor">
        <div id="editor"></div>
        <button type="" @click="gettext">点击</button>
    </div>

  </div>
</template>

<script>

export default {
  name: "zhongcaoAdd",
  components: {},
  data() {
    return {
      editor: null,

    };
  },
  mounted() {
    this.editor = UE.getEditor('editor', {
      // autoHeightEnabled: true,
      // autoFloatEnabled: true
    });
  },
  destroyed() {
　　// 将editor进行销毁
　　this.editor.destroy();      　　
  },
  beforeUpdate: function() {

  },
  watch: {

  },
  methods: {
    gettext() {
　　　// 获取editor中的文本
    　console.log(this.editor.getContent())
　　 },
  }
};
</script>

<style lang="less" scoped>
  .editor {
    width: 800px;
  }
</style>
