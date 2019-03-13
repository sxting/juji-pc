<template>
  <div>
    <a-card :body-style="{padding: '24px 32px'}" :bordered="false">
      <a-form @submit="submit" :autoFormCreate="(form) => this.form = form">
        <a-form-item label="商品类型" :labelCol="{span: 7}" :wrapperCol="{span: 10}" :required="true">
          <a-radio-group v-model="productType" :style="{ marginBottom: '8px' }">
            <a-radio-button value="PRODUCT">普通商品</a-radio-button>
            <a-radio-button value="POINT">积分商品</a-radio-button>
          </a-radio-group>
        </a-form-item>
        <a-form-item label="商品标签" :labelCol="{span: 7}" :wrapperCol="{span: 10}" :required="true">
          <a-radio-group v-model="biaoqian">
            <a-radio :value="'美食饮品'">美食饮品</a-radio>
            <a-radio :value="'丽人美发'">丽人美发</a-radio>
            <a-radio :value="'休闲娱乐'">休闲娱乐</a-radio>
            <a-radio :value="'其他'">其他</a-radio>
          </a-radio-group>
        </a-form-item>
        <a-form-item label="商品名称" :labelCol="{span: 7}" :wrapperCol="{span: 10}" fieldDecoratorId="repository.productName" :fieldDecoratorOptions="{rules: [{ required: true, message: '请输入仓库名称', whitespace: true}]}" :required="true">
          <a-input placeholder="请输入商品名称，限1-40字" />
        </a-form-item>
        <a-form-item label="原价" :labelCol="{span: 7}" :wrapperCol="{span: 10}" fieldDecoratorId="repository.originalPrice" :fieldDecoratorOptions="{rules: [{ required: true, message: '请输入原价', whitespace: true}]}" :required="true">
          <a-input placeholder="请输入商品原价" />
        </a-form-item>
        <a-form-item label="售价" :labelCol="{span: 7}" :wrapperCol="{span: 10}" fieldDecoratorId="repository.price" :fieldDecoratorOptions="{rules: [{ required: true, message: '请输入售价', whitespace: true}]}" :required="true">
          <a-input placeholder="请输入商品售价" />
        </a-form-item>
        <a-form-item label="商品首图" :labelCol="{span: 7}" :wrapperCol="{span: 10}" :required="true">
          <div class="clearfix">
            <a-upload listType="picture-card" :fileList="fileList1" :showUploadList="{showPreviewIcon:false,showRemoveIcon:true}" :beforeUpload="beforeUpload" :customRequest="nzCustomRequestFun"  @change="handleChange1($event)">
              <div v-if="fileList1.length < 1">
                <a-icon type="plus" />
                <div class="ant-upload-text">上传图片</div>
              </div>
            </a-upload>
            <a-modal :visible="previewVisible" :footer="null" @cancel="handleCancel">
              <img alt="example" style="width: 100%" :src="previewImage" />
            </a-modal>
          </div>
        </a-form-item>
        <a-form-item label="商品图片" :labelCol="{span: 7}" :wrapperCol="{span: 10}" :required="false">
          <div class="clearfix">
            <a-upload listType="picture-card" :showUploadList="{showPreviewIcon:false,showRemoveIcon:true}"  :fileList="fileList2" :beforeUpload="beforeUpload" :customRequest="nzCustomRequestFun" @preview="handlePreview" @change="handleChange2($event)">
              <div v-if="fileList2.length < 5">
                <a-icon type="plus" />
                <div class="ant-upload-text">上传图片</div>
              </div>
            </a-upload>
          </div>
        </a-form-item>
        <a-form-item label="图文详情" :labelCol="{span: 7}" :wrapperCol="{span: 10}" :required="false">
          <div v-for="(list, j) in picXQ" :key="j" style="margin-top:20px;">
            <div class="clearfix">
              <a-upload listType="picture-card" :showUploadList="{showPreviewIcon:false,showRemoveIcon:true}" :fileList="list.fileList" :beforeUpload="beforeUpload" :customRequest="nzCustomRequestFun" @preview="handlePreview" @change="handleChange3($event,j)">
                <div v-if="list.fileList.length < 5">
                  <a-icon type="plus" />
                  <div class="ant-upload-text">上传图片</div>
                </div>
              </a-upload>
            </div>
            <a-textarea rows="4" :value="list.picIds" @change="XQgetnoteDetaildata(j,$event.target.value)" placeholder="请输入图文详情的介绍文字，展示在图片下方" />
            <div>
              <p class="double_btn">
                <span class="descriptions_addAll_btn" @click="XQaddGroupBuynote()">增加一组</span>
                <span class="descriptions_minusAll_btn" @click="XQpluseGroupbuyNote(j)">删除此组</span>
              </p>
            </div>
          </div>

        </a-form-item>
        <a-form-item label="购买须知" :labelCol="{span: 7}" :wrapperCol="{span: 10}" :required="false">
          <div class="marketing_means">
            <div class="edit_goods_infor clearfix">
              <div class="divUl clearfix">
                <div class="divLi clearfix">
                  <div class="right-block fl descriptions">
                    <form class="descriptions_form" v-for="(list, j) in buyerNotes" :key="j">
                      <a-input type="text" maxlength="40" class="juniu_input" :value="list.title" @change="getnoteTitledata(j,$event.target.value)" placeholder="请输入标题，最多输入40个字" />
                      <div class="details_list_box">
                        <div class="form_parent" style="position:relative;" v-for="(detail, noteIndex) in list.details" :key="noteIndex">
                          <a-textarea type="text" maxlength="100" class="desc_textarea" :value="detail.item" @change="getnoteDetaildata(j,noteIndex,$event.target.value)" placeholder="请输入内容，最多输入100个字，更多内容点“添加更多”"></a-textarea>
                          <!-- <span>
                            <span class="descriptions_add_btn descriptions_btns" @click="addLineNoteDetail(j)">添加更多</span>
                            <span class="descriptions_minus_btn descriptions_btns" @click="deleteNoteDetail(j,noteIndex)">删除</span>
                          </span> -->
                        </div>
                      </div>
                      <div>
                        <p class="double_btn">
                          <span class="descriptions_addAll_btn" @click="addGroupBuynote()">增加一组</span>
                          <span class="descriptions_minusAll_btn" @click="pluseGroupbuyNote(j)">删除此组</span>
                        </p>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </a-form-item>
        <a-form-item label="库存" :labelCol="{span: 7}" :wrapperCol="{span: 10}" fieldDecoratorId="repository.stock" :fieldDecoratorOptions="{rules: [{ required: true, message: '请输入使用库存', whitespace: true}]}" :required="true">
          <div>
          <a-input-number :min="1" :max="99999" />
          </div>
        </a-form-item>
        <a-form-item label="使用有效期" :labelCol="{span: 7}" :wrapperCol="{span: 10}" fieldDecoratorId="repository.cutOffDays" :fieldDecoratorOptions="{rules: [{ required: true, message: '请输入使用有效期', whitespace: true}]}" :required="true">
          <div>
            自购买之日起
            <a-input-number :min="1" :step="1" :max="30" /> 天内有效
          </div>
        </a-form-item>
        <a-form-item label="购买限制" :labelCol="{span: 7}" :wrapperCol="{span: 10}" :required="false">
          <div>
            每单最多购买
            <a-input-number :min="0" :step="1" :max="999" v-model="limitMaxNum" /> 个
          </div>
          <div>
            每日最多购买
            <a-input-number :min="0" :step="1" :max="999" v-model="limitPerDayNum" /> 个
          </div>
          <div>
            每人最多购买
            <a-input-number :min="0" :step="1" :max="999" v-model="limitPerOrderNum" /> 个
          </div>
        </a-form-item>
        <a-form-item label="展示顺序" :labelCol="{span: 7}" :wrapperCol="{span: 10}" fieldDecoratorId="repository.idx" :required="false">
          <div>
            第
            <a-input-number :min="0" :step="1" :max="99999" /> 位
          </div>
        </a-form-item>
        <a-form-item label="所属商家" :labelCol="{span: 7}" :wrapperCol="{span: 10}" :required="true">
          <a-select  @change="mechantChange">
            <a-select-option v-for="(item,index) in merchantList" :key="index">{{item.name}}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="适用门店" :labelCol="{span: 7}" :wrapperCol="{span: 10}" v-if="mechantId" :required="true">

          已选择 {{allShopsNumber}} 家门店
          <span class="buttons" @click="checkStord">选择门店</span>
        </a-form-item>

        <a-form-item :wrapperCol="{span: 10, offset: 7}">
          <a-button htmlType="submit">提交</a-button>
        </a-form-item>
      </a-form>
      <!--门店v-if="showStoreSelect"-->

    </a-card>
    <a-modal title="选择门店" :visible="visible" @ok="handleOk" :confirmLoading="confirmLoading" @cancel="handleCancel">
      <a-checkbox-group v-model="storeIdList" @change="onChange">
        <a-row>
          <a-col v-for="(item,index) in cityStoreList" :key="index">
            <a-checkbox :value="item.id">{{item.name}}</a-checkbox>
          </a-col>
        </a-row>
      </a-checkbox-group>
    </a-modal>
  </div>

</template>

<script>
import { Modal } from "ant-design-vue";
export default {
  name: "AddProduct",
  data() {
    return {
      desc:
        "表单页用于向用户收集或验证信息，基础表单常见于数据项较少的表单场景。",
      biaoqian: "其他",
      previewVisible: false,
      productType: "PRODUCT",
      previewImage: "",
      buyerNotes: [{ title: "", details: [{ item: "" }] }], //购买须知
      picXQ: [{fileList:[],picIds:''}], //图片详情
      fileList1: [],
      fileList2: [],
      fileList3: [],
      cityStoreList: [], // 数据格式转换过的门店列表
      selectStoresIds: "", //选中的门店
      storesChangeNum: 0, //选中门店的个数
      koubeiProductId: "", //口碑商品查询id
      ifSelectAll: false, //是否全选
      allShopsNumber: 0, //所有的门店数量
      allStoresIds: "", //所有的门店id
      ModalText: "Content of the modal",
      visible: false,
      confirmLoading: false,
      mechantId: {},
      merchantList: [],
      storeIdListTrue: [],
      storeIdList: [],
      limitMaxNum: "", //最大购买数量 ,
      limitPerDayNum: "", // 限制每天购买数量 ,
      limitPerOrderNum: "", //限制每单购买数量 ,
      providerId: "",
      picIds: ""
    };
  },
  created() {},
  mounted() {
    this.getData();
  },
  watch: {
    $route(to, from) {
      // 刷新参数放到这里里面去触发就可以刷新相同界面了
      this.getData();
    }
  },
  methods: {
    getData() {
      this.providerId = this.$route.query.providerId;
      this.merchantListFun(this.providerId);
    },
    checkStord() {
      this.visible = true;
    },
    onChange(event) {
      console.log(event);
      this.storeIdList = event;
    },
    addLineNoteDetail(index) {
      if (this.buyerNotes[index].details.length >= 5) {
        this.$error({
          title: "温馨提示",
          content: "最多添加五组!!"
        });
      } else {
        this.buyerNotes[index].details.push({ item: "" });
      }
    },
    deleteNoteDetail(count, index) {
      if (this.buyerNotes[count].details.length <= 1) {
        this.$error({
          title: "温馨提示",
          content: "手下留情啊,不能再删除了!!"
        });
        return;
      } else {
        this.buyerNotes[count].details.splice(index, 1);
      }
    },
    addGroupBuynote() {
      if (this.buyerNotes.length >= 5) {
        this.$error({
          title: "温馨提示",
          content: "最多添加五组!!"
        });
      } else {
        this.buyerNotes.push({
          title: "",
          details: [{ item: "" }]
        });
      }
    },
    pluseGroupbuyNote(index) {
      if (this.buyerNotes.length <= 1) {
        this.$error({
          title: "温馨提示",
          content: "手下留情啊,不能再删除了!!"
        });
        return;
      } else {
        this.buyerNotes.splice(index, 1);
      }
    },
    XQaddGroupBuynote() {
      if (this.buyerNotes.length >= 5) {
        this.$error({
          title: "温馨提示",
          content: "最多添加五组!!"
        });
      } else {
        this.picXQ.push(
         {fileList:[],picIds:''}
        );
      }
    },
    XQpluseGroupbuyNote(index) {
      if (this.picXQ.length <= 1) {
        this.$error({
          title: "温馨提示",
          content: "手下留情啊,不能再删除了!!"
        });
        return;
      } else {
        this.picXQ.splice(index, 1);
      }
    },
    XQgetnoteDetaildata(index, event) {
      this.picXQ[index].picIds = event;
    },
    submit(e) {
      e.preventDefault();
      let data,picXQArr=[],note = [],storeIdArr = [];
       this.picXQ.forEach(function(i){
        let pic = [];
        i.fileList.forEach(function(m){
            pic.push(m.response)
        })
        picXQArr.push(
          {title:"", content:[i.picIds],picIds:pic}
        )
      })
      this.buyerNotes.forEach(function(i){
          note.push({
            title : i.title,
            content : [i.details[0].item]
          })
      })
      this.storeIdList.forEach(function(i){
          storeIdArr.push({
            storeId : i,
          })
      })
      this.form.validateFields((err, values) => {
        if (!err) {
          console.log("Received values of form: ", values);
        }
        data = {
          cutOffDays: values.repository.cutOffDays, //核销截止日期
          description:JSON.stringify(picXQArr),
          idx: values.repository.idx,
          limitMaxNum: this.limitMaxNum,
          limitPerDayNum: this.limitPerDayNum,
          limitPerOrderNum: this.limitPerOrderNum,
          merchantId: this.merchantId,
          merchantName: this.merchantName,
          note: JSON.stringify(note),
          originalPrice: values.repository.originalPrice,
          picId: this.fileList1[0].response,
          picIds: "",
          point: 1,
          price: values.repository.price *100,
          productName: values.repository.productName,
          productStores: storeIdArr,
          providerId: this.providerId,
          providerName: values.repository.providerName,
          putAway: 1,
          stock: values.repository.stock,
          tag: this.biaoqian,
          type: this.productType
        };
      });
      this.$axios({
        url: "/endpoint/produt/add.json",
        method: "post",
        processData: false,
        data: data
      }).then(res => {
        if (res.success) {
          console.log(res);
        } else {
          this.$error({
            title: "温馨提示",
            content: res.errorInfo
          });
        }
      });
    },
    getnoteTitledata(index, event) {
      this.buyerNotes[index].title = event;
    },
    getnoteDetaildata(index, notenum, event) {
      this.buyerNotes[index].details[notenum].item = event;
    },
    showModal() {
      this.visible = true;
    },
    handleOk(e) {
      this.storeIdListTrue = this.storeIdList;
      this.allShopsNumber = this.storeIdListTrue.length;
      this.visible = false;
    },
    handleCancel() {
      this.allShopsNumber = 0;
      this.storeIdListTrue = [];
      this.storeIdList = [];
      this.previewVisible = false;
    },
    handlePreview(file) {
      this.previewImage = file.url || file.thumbUrl;
      this.previewVisible = true;
    },
    handleChange1({ fileList }) {
      this.fileList1 = fileList;
    },
    handleChange2({ fileList }) {
      this.fileList2 = fileList;
    },
    handleChange3({ fileList },ind) {
      this.picXQ[ind].fileList = fileList;
    },
    handleCancel(e) {
      this.visible = false;
    },
    merchantListFun(providerId) {
      let data = {
        providerId: providerId
      };
      this.$axios({
        url: "/endpoint/juji/provider/merchant/list.json",
        method: "get",
        processData: false,
        params: data
      }).then(res => {
        if (res.success) {
          this.merchantList = res.data;
        } else {
          this.$error({
            title: "温馨提示",
            content: res.errorInfo
          });
        }
      });
    },
    nzCustomRequestFun(e) {
      const formData = new FormData();
      formData.append("multipartFile", e.file, e.file.name);
      this.$axios({
        url: "http://juji-dev.juniuo.com/upload/image.json",
        method: "post",
        processData: false,
        data: formData,
        type:"formData"
      }).then(res => {
        if (res.errorCode === '0') {
          e.onProgress(res, e.file);
          e.onSuccess(res["data"], e.file, res);
        } else {
          this.$error({
            title: "温馨提示",
            content: res.errorInfo+'请稍后重新上传'
          });
          e.onError(res.errorInfo, e.file);
        }
      });
    },
    mechantChange(event) {
      this.allShopsNumber = 0;
      this.storeIdListTrue = [];
      this.storeIdList = [];
      this.merchantId = this.merchantList[event].id;
      this.merchantName = this.merchantList[event].name;
      
      let data = {
        merchantId: this.merchantList[event].id
      };
      this.$axios({
        url: "/endpoint/juji/merchant/store/list.json",
        method: "get",
        processData: false,
        params: data
      }).then(res => {
        if (res.success) {
          this.cityStoreList = res.data;
        } else {
          this.$error({
            title: "温馨提示",
            content: res.errorInfo
          });
        }
      });
    },
    beforeUpload() {}
  }
};
</script>
  
<style lang="less" scoped>
@import "./addProduct.less";
</style>

