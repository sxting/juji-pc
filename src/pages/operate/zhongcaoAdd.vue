<template>
  <div>
    <!-- <div class="editor">
        <div id="editor"></div>
        <button type="" @click="gettext">点击</button>
    </div> -->

    <a-card :body-style="{padding: '24px 32px'}" :bordered="false">
        <a-form :autoFormCreate="(form) => {this.form = form;}">
            <a-form-item label="文章标题" :labelCol="{span: 7}"  :wrapperCol="{span: 10}" fieldDecoratorId="title" :fieldDecoratorOptions="{rules: [{ required: true, message: '请输入文章标题，限1-40字', whitespace: true}]}" :required="true">
                <a-input placeholder="请输入文章标题，限1-40字" />
            </a-form-item>
            <a-form-item label="种草内容详情" :labelCol="{span: 7}"  :wrapperCol="{span: 10}" fieldDecoratorId="editors" :fieldDecoratorOptions="{rules: [{ required: true, message: '', whitespace: true}]}">
                <div class="editor">
                    <div id="editor"></div>
                    <button type="" @click="gettext">点击</button>
                </div>
            </a-form-item>
        </a-form>
    </a-card>

  </div>
</template>

<script>

export default {
  name: "zhongcaoAdd",
  components: {},
  data() {
    return {
      editor: null,
      title: '',
      editors: ''
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
