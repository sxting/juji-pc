<template>
  <div style="padding-bottom: 30px">
    <!-- <div class="editor">
        <div id="editor"></div>
        <button type="" @click="gettext">点击</button>
    </div> -->

    <a-card :body-style="{padding: '24px 32px'}" :bordered="false">
        <a-form :autoFormCreate="(form) => {this.form = form;}">
            <a-form-item label="文章标题" :labelCol="{span: 5}" :wrapperCol="{span: 10}" fieldDecoratorId="title" :fieldDecoratorOptions="{rules: [{ required: true, message: '请输入文章标题，限1-40字', whitespace: true}]}" :required="true">
                <a-input placeholder="请输入文章标题，限1-40字" />
            </a-form-item>
            <a-form-item label="种草内容详情" :labelCol="{span: 5}" :wrapperCol="{span: 10}" fieldDecoratorId="editors" :fieldDecoratorOptions="{rules: [{ required: true, message: '', whitespace: true}]}">
                <div class="editor">
                    <div id="editor"></div>
                </div>
            </a-form-item>
            <a-form-item label="展示顺序" :labelCol="{span: 5}" :wrapperCol="{span: 10}" fieldDecoratorId="number" :fieldDecoratorOptions="{rules: [{ required: true, message: '请输入展示顺序', whitespace: true}]}">
                <a-input placeholder="请输入展示顺序" />
            </a-form-item>
        </a-form>
        <div style="text-align: center;margin-bottom: 30px;">
          <div class="btn btn_cancel">取消</div>
          <div class="btn btn_save">保存</div>
        </div>
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
      initialFrameHeight:600
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

<style scoped>
  .editor {
    width: 800px;
  }
  .btn_save{width:200px;height:32px;line-height:32px;border-radius:4px;text-align:center;background: #fff;border: 1px #ddd solid;margin: 0 auto;cursor: default;display:inline-block}
  .btn_cancel{width:200px;height:32px;line-height:32px;border-radius:4px;text-align:center;background: #f2f2f2;border: 1px #ddd solid;margin: 0 auto;cursor: default;display:inline-block;margin-right:20px}
  .btn_save:hover{background: #e5e5e5}
  .btn_cancel:hover{background: #f5f5f5}
</style>
<style>
.edui-default{line-height: 20px}
.edui-arrow{width: 12px!important;}
.ant-form-item-children input[type="text"]{width: 800px;}
.edui-button-body.edui-default{line-height: 20px}
.edui-combox-body.edui-default{line-height: 20px}
</style>
