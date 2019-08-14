<template>
  <div style="padding-bottom: 30px">
    <a-card :body-style="{padding: '24px 32px'}" :bordered="false">
        <a-form :autoFormCreate="(form) => {this.form = form;}">
            <a-form-item label="文章标题" :labelCol="{span: 5}" :wrapperCol="{span: 10}" :fieldDecoratorOptions="{rules: [{ required: true, message: '请输入文章标题，限1-40字', whitespace: true}]}" :required="true">
                <a-input placeholder="请输入文章标题，限1-40字" v-model="title" />
            </a-form-item>
            <a-form-item label="列表图片" :labelCol="{span: 5}" :wrapperCol="{span: 10}" :required="true">
              <div class="clearfix">
                <a-upload listType="picture-card" :showUploadList="{showPreviewIcon:false,showRemoveIcon:true}" :fileList="fileList2" :beforeUpload="beforeUpload" :customRequest="nzCustomRequestFun" @change="handleChange2($event)">
                  <div v-if="fileList2.length < 1">
                    <a-icon type="plus" />
                    <div class="ant-upload-text">上传图片</div>
                  </div>
                </a-upload>
              </div>
            </a-form-item>
            <a-form-item label="种草内容" :labelCol="{span: 5}" :wrapperCol="{span: 10}" fieldDecoratorId="editors" :fieldDecoratorOptions="{rules: [{ required: true, message: '', whitespace: true}]}">
                <div class="editor">
                    <div id="editor"></div>
                </div>
            </a-form-item>
            <a-form-item label="展示顺序" :labelCol="{span: 5}" :wrapperCol="{span: 10}" fieldDecoratorId="idx" :fieldDecoratorOptions="{rules: [{ required: true, message: '请输入展示顺序', whitespace: true}]}">
                <a-input placeholder="请输入展示顺序" v-model="idx" />
            </a-form-item>
        </a-form>
        <div style="text-align: center;margin-bottom: 30px;">
          <div class="btn btn_cancel">取消</div>
          <div class="btn btn_save" @click="submit()">保存</div>
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
      providerList:[],
      providerId:this.$route.query.providerId,
      tweetsId:this.$route.query.tweetsId,
      fileList2:[],
      title: '',
      cover:'',
      editors: '',
      idx:0
    };
  },
  mounted() {
    this.providerList = JSON.parse(sessionStorage.getItem("LoginDate")).providerList;
    this.providerId = this.providerList[0].providerId;
    this.editor = UE.getEditor('editor', {
      initialFrameHeight:600,
      serverUrl:'https://api.juniuo.com/ueditor/utf8-php/php/controller.php',
      imagePathFormat: "/ueditor/php/upload/image/{yyyy}{mm}{dd}/{time}{rand:6}",
      imageUrlPrefix: "https://upic.juniuo.com/file/picture/",
      autoHeightEnabled: true
    });
  },
  methods: {
    gettext() {
    　console.log(this.editor.getContent())
　　 },
    submit(){
      this.$axios({
        url: "/endpoint/tweets/add.json",
        method: "post",
        data: {
          cover:this.fileList2[0].response,
          html:this.editor.getContent(),
          providerId:this.providerId,
          show:1,
          title:this.title,
          idx:Number(this.idx)
        },
      }).then(res => {
        if (res.errorCode === "200") {
          this.$success({content: "发布新内容成功！"});
          this.$router.go(-1);
        } else {

        }
      })
    },
    beforeUpload(file) {
      const isLt2M = file.size / 1024 / 1024 < 10;
      if (!isLt2M) {
        this.$message.error("上传图片大小必须小于10MB!");
      }
    },
    handleChange2({ fileList }) {
      this.fileList2 = fileList;
    },
    nzCustomRequestFun(e) {
      const formData = new FormData();
      formData.append("multipartFile", e.file, e.file.name);
      this.$axios({
        url: "https://juji.juniuo.com//upload/image.json",
        method: "post",
        processData: false,
        data: formData,
        type: "formData"
      }).then(res => {
        if (res.errorCode === "0") {
          e.onProgress(res, e.file);
          e.onSuccess(res["data"], e.file, res);
        } else {
          this.$error({
            title: "温馨提示",
            content: res.errorInfo + "请稍后重新上传"
          });
          e.onError(res.errorInfo, e.file);
        }
      });
    },
    uploadImg() {
      console.log(111);
      const image = new Image();
      // 解决跨域 canvas 污染问题
      image.setAttribute("crossOrigin", "anonymous");
      image.onload = function() {
        const canvas = document.createElement("canvas");
        canvas.width = image.width;
        canvas.height = image.height;
        const context = canvas.getContext("2d");
        context.drawImage(image, 0, 0, image.width, image.height);
        //得到图片的base64编码数据
        const url = canvas.toDataURL("image/png");
        // 生成一个 a 标签
        const a = document.createElement("a");
        // 创建一个点击事件
        const event = new MouseEvent("click");
        // 将 a 的 download 属性设置为我们想要下载的图片的名称，若 name 不存在则使用'图片'作为默认名称
        a.download = name || "图片";
        // 将生成的 URL 设置为 a.href 属性
        a.href = url;
        // 触发 a 的点击事件
        a.dispatchEvent(event);
        // return a;
      };
      image.src = this.qrCodeBig;
    }
  }
};
</script>

<style scoped>
.editor {width: 800px;}
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
