<template>
  <div>
    <a-card :body-style="{padding: '24px 32px'}" :bordered="false">
      <a-form :autoFormCreate="(form) => {this.form = form;}">

        <!--
        <a-form-item label="商品类型" :labelCol="{span: 7}" :wrapperCol="{span: 10}" :required="true">
          <a-radio-group v-model="productType" :style="{ marginBottom: '8px' }">
            <a-radio-button value="PRODUCT">普通商品</a-radio-button>
            <a-radio-button value="POINT">积分商品</a-radio-button>
          </a-radio-group>
        </a-form-item>
        -->

        <a-form-item label="商品标签" :labelCol="{span: 7}" :wrapperCol="{span: 10}" :required="true">

          <a-checkbox-group v-model="biaoqian" @change="onBianqianChange" :style="{ paddingTop: '8px' }">
            <a-row>
              <a-col :span="4"><a-checkbox value="要吃" defaultChecked>要吃</a-checkbox></a-col>
              <a-col :span="4"><a-checkbox value="要美">要美</a-checkbox></a-col>
              <a-col :span="4"><a-checkbox value="要玩">要玩</a-checkbox></a-col>
              <a-col :span="4"><a-checkbox value="度假">度假</a-checkbox></a-col>
              <a-col :span="4"><a-checkbox value="亲子">亲子</a-checkbox></a-col>
              <a-col :span="4"><a-checkbox value="其它">其它</a-checkbox></a-col>
            </a-row>
          </a-checkbox-group>

         <!--  <a-radio-group v-model="biaoqian">
            <a-radio :value="'要吃'">要吃</a-radio>
            <a-radio :value="'要美'">要美</a-radio>
            <a-radio :value="'要玩'">要玩</a-radio>
            <a-radio :value="'度假'">度假</a-radio>
            <a-radio :value="'亲子'">亲子</a-radio>
            <a-radio :value="'其他'">其他</a-radio>
          </a-radio-group> -->
        </a-form-item>
        <a-form-item label="商品名称" :labelCol="{span: 7}"  :wrapperCol="{span: 10}" fieldDecoratorId="repository.productName" :fieldDecoratorOptions="{rules: [{ required: true, message: '请输入商品名称', whitespace: true}]}" :required="true">
          <a-input placeholder="请输入商品名称，限1-40字" />
        </a-form-item>

        <a-form-item v-if="productId" label="商品id" :labelCol="{span: 7}"  :wrapperCol="{span: 10}">
          {{productId}}
        </a-form-item>

        <a-form-item v-if="productId" label="商品小程序码" :labelCol="{span: 7}"  :wrapperCol="{span: 10}">
           <img class="qrCode" :src="qrCode" alt="">
           <a-button type="primary" @click="uploadImg">点击下载</a-button>
        </a-form-item>

        <a-form-item label="商品规格" :labelCol="{span: 7}"  :wrapperCol="{span: 16}" :required="true">
          <div>
            <a-table :dataSource="guigeDataSource" :columns="guigeColumns" :pagination="false">
              <template v-for="(col, i) in ['name', 'originp', 'currentp', 'jifen', 'costp', 'stock']" :slot="col" slot-scope="text, record, index">
                <div :key="col">
                  <div v-if="true" class="disflex">
                    <a-input
                      style="margin: -5px 0"
                      :value="text"
                      @change="e => handleChange(e.target.value, record.key, col)"
                    />
                  </div>
                  <template v-else>{{text}}</template>
                </div>
              </template>
              <template slot="operation" slot-scope="text, record">
                <a-popconfirm
                  v-if="guigeDataSource.length > 1"
                  title="确定删除?"
                  @confirm="() => onDelete(record.key)">
                  <a href="javascript:;">删除</a>
                </a-popconfirm>
              </template>
            </a-table>
            <a-button class="editable-add-btn fr" @click="handleAdd">增加</a-button>
          </div>
        </a-form-item>

        <a-form-item label="商品首图" :labelCol="{span: 7}" :wrapperCol="{span: 10}" :required="true">
          <div class="clearfix">
            <a-upload listType="picture-card" :fileList="fileList1" :showUploadList="{showPreviewIcon:false,showRemoveIcon:true}" :beforeUpload="beforeUpload" :customRequest="nzCustomRequestFun" @change="handleChange1($event)">
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
            <a-upload listType="picture-card" :showUploadList="{showPreviewIcon:false,showRemoveIcon:true}" :fileList="fileList2" :beforeUpload="beforeUpload" :customRequest="nzCustomRequestFun" @change="handleChange2($event)">
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
              <a-upload listType="picture-card" :showUploadList="{showPreviewIcon:false,showRemoveIcon:true}" :fileList="list.fileList" :beforeUpload="beforeUpload" :customRequest="nzCustomRequestFun" @change="handleChange3($event,j)">
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
                          <a-textarea type="text" maxlength="1000" class="desc_textarea" :value="detail.item" @change="getnoteDetaildata(j,noteIndex,$event.target.value)" placeholder="请输入内容，最多输入1000个字，更多内容点“添加更多”"></a-textarea>
                          <span>
                            <span class="descriptions_add_btn descriptions_btns" @click="addLineNoteDetail(j)">添加更多</span>
                            <span class="descriptions_minus_btn descriptions_btns" @click="deleteNoteDetail(j,noteIndex)">删除</span>
                          </span>
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
        <!--
        <a-form-item label="库存" :labelCol="{span: 7}" :wrapperCol="{span: 10}" fieldDecoratorId="repository.stock" :fieldDecoratorOptions="{rules: [{ required: true, message: '请输入使用库存'}]}" :required="true">
          <a-input-number :min="1" :max="99999" />
        </a-form-item>
        -->
        <a-form-item label="使用有效期" :labelCol="{span: 7}" help="自购买之日起开始计算时间" :wrapperCol="{span: 10}" fieldDecoratorId="repository.cutOffDays" :fieldDecoratorOptions="{rules: [{ required: true, message: '请输入使用有效期'}]}" :required="true">
          <a-input-number :min="1" :step="1" :max="180" />
        </a-form-item>
        <a-form-item label="购买限制" :labelCol="{span: 7}" :wrapperCol="{span: 10}" :required="false">
          <div>
            每单最多购买
            <a-input-number :min="0" :step="1" :max="999" v-model="limitPerOrderNum" /> 个
          </div>
          <div>
            每日最多购买
            <a-input-number :min="0" :step="1" :max="999" v-model="limitPerDayNum" /> 个
          </div>
          <div>
            每人最多购买
            <a-input-number :min="0" :step="1" :max="999" v-model="limitMaxNum" /> 个
          </div>
        </a-form-item>
        <a-form-item label="展示顺序" :labelCol="{span: 7}" help="第几位" :wrapperCol="{span: 10}" fieldDecoratorId="repository.idx" :required="false">
          <a-input-number :min="0" :step="1" :max="99999" />
        </a-form-item>
        <!-- @change="mechantChange"  fieldDecoratorId="repository.mechantId"   :value="item.id"-->
        <a-form-item label="所属商家" :labelCol="{span: 7}"   fieldDecoratorId="repository.merchantId" :fieldDecoratorOptions="{rules: [{ required: true, message: '请选择商家'}]}" :wrapperCol="{span: 10}" :required="true">
          <a-select  :value="selectedItems" @change="mechantChange($event,false)">
            <a-select-option v-for="(item,index) in filteredOptions" :key="index" :value="item.id">{{item.name}}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="适用门店" :labelCol="{span: 7}" v-if="cityStoreList.length>0" :wrapperCol="{span: 10}" :required="true">
          已选择 {{allShopsNumber}} 家门店
          <span class="buttons" @click="checkStord">选择门店</span>
        </a-form-item>
        <a-form-item label="活动主题" :labelCol="{span: 7}" :wrapperCol="{span: 10}" :required="false">
          <a-checkbox-group v-model="subject" @change="onSubjectChange" :style="{ paddingTop: '8px' }">
            <a-row>
              <a-col :span="8"><a-checkbox value="新品尝鲜" defaultChecked>特惠品鉴</a-checkbox></a-col>
              <a-col :span="8"><a-checkbox value="好店礼券">优选好券</a-checkbox></a-col>
              <a-col :span="8"><a-checkbox value="打卡潮店">打卡潮店</a-checkbox></a-col>
            </a-row>
          </a-checkbox-group>
        </a-form-item>
        <!-- 首页展示 -->
        <a-form-item label="首页展示" :labelCol="{span: 7}" :wrapperCol="{span: 10}" :required="true">
          <a-switch checkedChildren="开" unCheckedChildren="关" v-model="homeDisplay" @change="onHomeDisplayChange" />
        </a-form-item>
        <a-form-item label="精选推荐" :labelCol="{span: 7}" :wrapperCol="{span: 10}" :required="true">
          <a-switch checkedChildren="开" unCheckedChildren="关" v-model="recommend" @change="onRecommendChange" />
        </a-form-item>
        <a-form-item label="会员专区" :labelCol="{span: 7}" :wrapperCol="{span: 10}" :required="true">
          <a-switch checkedChildren="开" unCheckedChildren="关" v-model="remember" @change="onRememberChange" />
        </a-form-item>
        <a-form-item v-if="!productId" label="购买送会员" :labelCol="{span: 7}" :wrapperCol="{span: 10}">
          <a-switch checkedChildren="开" unCheckedChildren="关" v-model="buyMember" @change="onBuyMemberChange" />
        </a-form-item>
        <a-form-item v-if="productId" label="购买送会员" :labelCol="{span: 7}" :wrapperCol="{span: 10}">
          {{buyMember ? '是' : '否'}}
        </a-form-item>
        <a-form-item label="旅游专属" :labelCol="{span: 7}" :wrapperCol="{span: 10}">
          <a-switch checkedChildren="开" unCheckedChildren="关" v-model="lvyou" @change="onLvyouChange" />
        </a-form-item>
        <a-form-item label="异业合作礼品商品" :labelCol="{span: 7}" :wrapperCol="{span: 10}">
          <a-switch checkedChildren="开" unCheckedChildren="关" v-model="innerVip" @change="onInnerVipChange" />
        </a-form-item>
        <a-form-item label="分享文字" :labelCol="{span: 7}" :wrapperCol="{span: 10}" fieldDecoratorId="repository.shareText" :required="false">
          <a-textarea type="text" class="desc_textarea" placeholder="请输入分享文案，不填写则为系统默认文案"></a-textarea>
        </a-form-item>
        <a-form-item label="分享图片" help="分享图片推荐尺寸420*336，推荐比例5:4，不传则为商品详情页截图" :labelCol="{span: 7}" :wrapperCol="{span: 10}" :required="false">
          <div class="clearfix">
            <a-upload listType="picture-card" :fileList="fileList4" :showUploadList="{showPreviewIcon:false,showRemoveIcon:true}" :beforeUpload="beforeUpload" :customRequest="nzCustomRequestFun" @change="handleChange4($event)">
              <div v-if="fileList4.length < 1">
                <a-icon type="plus" />
                <div class="ant-upload-text">上传图片</div>
              </div>
            </a-upload>
          </div>
        </a-form-item>
        <a-form-item :wrapperCol="{span: 10, offset: 7}" v-if="unAuditCount>0">
          <span style="color: #f5222d;">商品正在审核中，无法修改</span>
        </a-form-item>
        <a-form-item :wrapperCol="{span: 10, offset: 7}">
          <a-button type="primary" v-if="!unAuditCount" @click="submit">提交</a-button>
          <a-button type="primary" v-if="unAuditCount>0" disabled @click="submit">提交</a-button>
        </a-form-item>

      </a-form>
      <!--门店v-if="showStoreSelect"-->

    </a-card>
    <a-modal title="选择门店" :visible="visible" @ok="handleOk" :confirmLoading="confirmLoading" @cancel="handleCancel">
      <div :style="{ borderBottom: '1px solid #E9E9E9' }">
        <a-checkbox @change="onCheckAllChange" :checked="checkAll">
          全选
        </a-checkbox>
      </div>
      <a-checkbox-group v-model="storeIdList" @change="onChange" :defaultChecked="true">
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
      editor: null,
      desc:
        "表单页用于向用户收集或验证信息，基础表单常见于数据项较少的表单场景。",
      biaoqian: [],
      previewVisible: false,
      previewShareImgVisible: false,
      productType: "PRODUCT",
      previewImage: "",
      checkAll: true,
      guigeDataSource: [
        {
          key: '0',
          name: '默认规格',
          originp: '0',
          currentp: '0',
          jifen: '0',
          costp: '0',
          stock: '0',
          skuId: '',
          id: '',
          manageRate: '0',
          saleRate: '0',
          managep: '0',
          salesp: '0'
        }
      ],
      guigeColumns: [
        {
          title: '规格名称',
          dataIndex: 'name',
          width: '20%',
          scopedSlots: { customRender: 'name' },
        }, {
          title: '原价',
          dataIndex: 'originp',
          scopedSlots: { customRender: 'originp' },
        }, {
          title: '售价',
          dataIndex: 'currentp',
          scopedSlots: { customRender: 'currentp' },
        }, {
          title: '桔子积分',
          dataIndex: 'jifen',
          scopedSlots: { customRender: 'jifen' },
        }, {
          title: '底价',
          dataIndex: 'costp',
          scopedSlots: { customRender: 'costp' },
        }, {
          title: '库存',
          dataIndex: 'stock',
          scopedSlots: { customRender: 'stock' },
        }, {
          title: '操作',
          dataIndex: 'operation',
          scopedSlots: { customRender: 'operation' },
        }
      ],
      count: 1,
      buyerNotes: [{ title: "", details: [{ item: "" }] }], //购买须知
      picXQ: [{ fileList: [], picIds: "" }], //图片详情
      fileList1: [],
      fileList2: [],
      fileList3: [],
      fileList4: [], //分享图片
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
      merchantId: "",
      merchantList: [],
      storeIdListTrue: [],
      storeIdList: [],
      limitMaxNum: "", //最大购买数量 ,
      limitPerDayNum: "", // 限制每天购买数量 ,
      limitPerOrderNum: "", //限制每单购买数量 ,
      providerId: "",
      picIds: "",
      jifen: "桔子兑换",
      point: 0,
      price: 0,
      checkedList: [],
      selectedItems:[],
      productId: sessionStorage.getItem("PROCIDERID") || "",
      unAuditCount: 0,
      subject: [], // 活动主题； 字符串 逗号分隔
      homeDisplay: true,
      recommend: true, //是否推荐； 0，1
      shareText: '', //分享文字
      remember: false,
      lvyou: false,
      innerVip: false,
      buyMember:false,
      qrCode: '',
      qrCodeBig: '',
    };
  },
  created() {
    this.getData();
  },
  mounted() {},
  watch: {
    $route(to, from) {
      // 刷新参数放到这里里面去触发就可以刷新相同界面了
      this.getData();
    }
  },
  computed: {
    filteredOptions() {
      return this.merchantList.filter(o => !this.selectedItems.includes(o));
    }
  },
  methods: {
    getQrCode() {
      let data = {
        productId: this.productId,
        path: 'pages/login/index'
      };
      this.$axios({
        url: "/endpoint/qr/getByProductId.json",
        method: "get",
        processData: false,
        params: data
      }).then(res => {
        if (res.success) {
          this.qrCode = "https://upic.juniuo.com/file/picture/" + res.data + "/resize_85_85/mode_filt/format_jpg/quality_0";
          this.qrCodeBig = "https://upic.juniuo.com/file/picture/" + res.data + "/resize_200_200/mode_filt/format_jpg/quality_0"
        } else {
          this.$error({
            title: "温馨提示",
            content: res.errorInfo
          });
        }
      });
    },
    handleChange (value, key, column) {
      const newData = [...this.guigeDataSource]
      const target = newData.filter(item => key === item.key)[0];
      if (target) {
        target[column] = value
        this.guigeDataSource = newData
      }
    },
    handleBlur(value, key, column) {
      const newData = [...this.guigeDataSource]
      const target = newData.filter(item => key === item.key)[0];
      if(column == 'saleRate' || column == 'manageRate') {
        if(/^[0-9]*$/.test(value)) {
          this.fenyongFun(target)
        } else {
          console.log('数据格式错误');
        }
      }
    },
    onDelete (key) {
      const guigeDataSource = [...this.guigeDataSource]
      this.guigeDataSource = guigeDataSource.filter(item => item.key !== key)
    },
    handleAdd () {
      const { count, guigeDataSource } = this;
      const newData = {
        key: count,
        name: '',
        originp: '',
        currentp: '',
        jifen: '',
        costp: '',
        stock: '',
        manageRate: '',
        saleRate: '',
      }
      this.guigeDataSource = [...guigeDataSource, newData]
      this.count = count + 1;
      console.log(this.guigeDataSource);
    },

    jifenFun(){
      this.price = 0;
    },
    pointChange(e) {
      this.point = e;
    },
    onCheckAllChange(e) {
      let arr = [];
      this.cityStoreList.forEach(function(i) {
        arr.push(i.id);
      });
      this.checkAll = e.target.checked;
      this.storeIdList = e.target.checked ? arr : [];
    },
    priceChange(e) {
       this.price = e;
    },
    getData() {
      this.providerId =
        sessionStorage.getItem("PROCIDERID") || this.$route.query.providerId;
      this.productId = this.$route.query.productId;
      this.merchantListFun(this.providerId);
      this.getQrCode();
    },
    checkStord() {
      this.visible = true;
    },
    onBuyMemberChange(event){
      this.buyMember = event;
    },
    onHomeDisplayChange(event) {
      this.homeDisplay = event;
    },
    onRecommendChange(event) {
      this.recommend = event;
      if(this.recommend && this.remember) {
        this.$error({
          title: "温馨提示",
          content: "“会员专享”和“精选推荐”不可以同时开启,但可以同时关闭"
        });
        this.remember = false;
      }
    },
    onRememberChange(event) {
      this.remember = event;
      if(this.recommend && this.remember) {
        this.$error({
          title: "温馨提示",
          content: "“会员专享”和“精选推荐”不可以同时开启,但可以同时关闭"
        });
        this.recommend = false;
      }
    },
    onLvyouChange(event) {
      this.lvyou = event;
    },
    onInnerVipChange(event) {
      this.innerVip = event;
    },
    onSubjectChange(event) {
      this.subject = event;
    },
    onBianqianChange(event){
      this.biaoqian = event;
    },
    onChange(event) {
      console.log(event);
      this.checkAll = event.length === this.cityStoreList.length;
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
      this.buyerNotes.push({
          title: "",
          details: [{ item: "" }]
      });
      // if (this.buyerNotes.length >= 5) {
      //   this.$error({
      //     title: "温馨提示",
      //     content: "最多添加五组!!"
      //   });
      // } else {
      //   this.buyerNotes.push({
      //     title: "",
      //     details: [{ item: "" }]
      //   });
      // }
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
      if (this.picXQ.length >= 5) {
        this.$error({
          title: "温馨提示",
          content: "最多添加五组!!"
        });
      } else {
        this.picXQ.push({ fileList: [], picIds: "" });
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
    rtrim(str) {
      //删除右边的空格
      return str.replace(/(\s*$)/g, ",");
    },
    XQgetnoteDetaildata(index, event) {
      if (event.length > 1000) {
        this.$error({
          title: "温馨提示",
          content: "不能输入超过1000个字"
        });
      } else {
        this.picXQ[index].picIds = event;
      }
    },
    submit(e) {
      // console.dir(this.guigeDataSource);
      e.preventDefault();
      let that = this,
        data,
        picXQArr = [],
        note = [],
        storeIdArr = [];
      this.picXQ.forEach(function(i) {
        let pic = [];
        i.fileList.forEach(function(m) {
          pic.push(m.response ? m.response : m.name);
        });
        picXQArr.push({ title: "", content: [i.picIds], picIds: pic });
      });
      this.buyerNotes.forEach(function(i) {
        let arr = [];
        i.details.forEach(function(n) {
          arr.push(n.item);
        });
        note.push({
          title: i.title,
          content: arr
        });
      });
      this.storeIdList.forEach(function(i) {
        storeIdArr.push({
          storeId: i
        });
      });
      let picIds = "";
      if (this.fileList2 && this.fileList2.length > 0) {
        this.fileList2.forEach(function(m) {
          picIds += (m.response ? m.response : m.name) + ",";
        });
        picIds = picIds.slice(0, picIds.length - 1);
      }
      this.form.validateFields((err, values) => {
        if (err) {
          console.log(err);
        } else {
          if (this.fileList1.length < 1) {
            this.$error({
              title: "温馨提示",
              content: "请上传商品首图"
            });
          } else if (!values.repository.merchantId) {
            this.$error({
              title: "温馨提示",
              content: "请选择所属商家"
            });
          } else if (storeIdArr.length < 1) {
            this.$error({
              title: "温馨提示",
              content: "请选择试用门店"
            });
          } else {
            let productSkus = [];
            let productType = 'PRODUCT';
            this.guigeDataSource.forEach(function(item, index) {
              if(parseFloat(item.jifen)) {
                productType = 'POINT'
              }
              productSkus[index] = {
                costPrice: that.accurate_mul(item.costp, 100),
                originalPrice: that.accurate_mul(item.originp, 100),
                point: parseFloat(item.jifen),
                price: that.accurate_mul(item.currentp, 100),
                productName: values.repository.productName,
                skuName: item.name,
                status: 'NORMAL',
                stock: parseFloat(item.stock),
                skuId: item.skuId,
                id: item.id,
              }
            });
            data = {
              productSkus: productSkus,
              cutOffDays: values.repository.cutOffDays, //核销截止日期
              description: JSON.stringify(picXQArr),
              idx: values.repository.idx,
              limitMaxNum: this.limitMaxNum || 9999,
              limitPerDayNum: this.limitPerDayNum || 9999,
              limitPerOrderNum: this.limitPerOrderNum || 9999,
              merchantId: values.repository.merchantId,
              merchantName: this.merchantName,
              note: JSON.stringify(note),
              picId: this.fileList1[0].response
                ? this.fileList1[0].response
                : this.fileList1[0].name,
              picIds: picIds,
              productName: values.repository.productName,
              productStores: storeIdArr,
              providerId: this.providerId,
              providerName: values.repository.providerName,
              putAway: 1,
              tag: this.biaoqian.join(','),
              type: productType,
              productId: this.productId,
              subject: this.subject.join(','),
              homeDisplay: this.homeDisplay ? 1 : 0,
              recommend: this.recommend ? 1 : 0,
              openMember:this.buyMember?1:0,
              voucherGenerateType: this.lvyou ? 'TSTC' : '',
              innerVip: this.innerVip ? 1 : 0,
              shareText: values.repository.shareText,
              shareImg: this.fileList4[0] ? this.fileList4[0].response : '',
              isMember: this.remember ? 1 : 0
            };
            console.log(data);
            if (this.productId) {
              this.checkdataFun(data);
            } else {
              this.updataFun(data);
            }
          }
        }
      });
    },
    updataFun(data) {
      this.$axios({
        url: "/endpoint/produt/add.json",
        method: "post",
        processData: false,
        data: data
      }).then(res => {
        if (res.success) {
          this.$router.push({
            path: "/product/productList"
          });
        } else {
          this.$error({
            title: "温馨提示",
            content: res.errorInfo
          });
        }
      });
    },
    checkdataFun(data) {
      this.$axios({
        url: "/endpoint/product/update.json",
        method: "post",
        processData: false,
        data: data
      }).then(res => {
        if (res.success) {
          this.$router.push({
            path: "/product/productList"
          });
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
    handleChange3({ fileList }, ind) {
      this.picXQ[ind].fileList = fileList;
    },
    handleChange4({ fileList }) {
      this.fileList4 = fileList;
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
          if (this.productId) {
            this.productInfo();
          }
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
     mechantChange(event, storeIdArr) {
      let that = this;
      this.allShopsNumber = 0;
      this.storeIdListTrue = [];
      this.storeIdList = [];
      this.merchantId = this.event;
        this.selectedItems = event
      this.merchantList.forEach(function(i) {
        if (i.merchantId === event) that.merchantName = i.name;
      });
      let data = {
        merchantId: event
      };
      this.$axios({
        url: "/endpoint/juji/merchant/store/list.json",
        method: "get",
        processData: false,
        params: data
      }).then(res => {
        if (res.success) {
          this.cityStoreList = res.data;
          let arr = [];
          this.cityStoreList.forEach(function(i) {
            arr.push(i.id);
          });
          if (storeIdArr) this.storeIdList = storeIdArr;
          else this.storeIdList = arr;
          this.allShopsNumber = this.storeIdList.length;
        } else {
          this.$error({
            title: "温馨提示",
            content: res.errorInfo
          });
        }
      });
    },
    picUrl(id) {
      return (
        "https://upic.juniuo.com/file/picture/" + id + "/resize_85_85/mode_fill"
      );
    },
    productInfo() {
      let that = this;
      this.$axios({
        url: "/endpoint/product/info.json",
        method: "get",
        processData: false,
        params: { productId: this.productId }
      }).then(res => {
        if (res.success) {
          this.unAuditCount = res.data.unAuditCount;
          this.productType = res.data.type;

          this.biaoqian = res.data.tag ? res.data.tag.split(',') : [];

          this.count = res.data.productSkus.length;

          let guigeDataSource = [];
          res.data.productSkus.forEach(function(item, index) {
            guigeDataSource[index] = {
              key: index,
              name: item.skuName,
              originp: that.accurate_div(item.originalPrice, 100),
              currentp: that.accurate_div(item.price, 100),
              jifen: item.point,
              costp: that.accurate_div(item.costPrice, 100),
              stock: item.stock,
              skuId: item.skuId,
              id: item.id,
            };
          })
          this.guigeDataSource = guigeDataSource;

          this.jifen = res.data.type === "PRODUCT" ? res.data.price? "桔子+钱": "桔子兑换" :"桔子兑换";
          this.limitMaxNum =
            res.data.limitMaxNum > 0 ? res.data.limitMaxNum : "";
          this.limitPerDayNum = res.data.limitPerDayNum
            ? res.data.limitPerDayNum
            : "";
          this.limitPerOrderNum = res.data.limitPerOrderNum
            ? res.data.limitPerOrderNum
            : "";
          // merchantId:res.data.merchantId
          this.merchantId = res.data.merchantId;
          this.$nextTick(() => {
            this.form.setFieldsValue({
              repository: {
                cutOffDays: res.data.cutOffDays,
                idx: res.data.idx,
                productName: res.data.productName,
                merchantId: res.data.merchantId,
                shareText: res.data.shareText
              }
            });
          });
          this.subject = res.data.subject ? res.data.subject.split(',') : [];
          this.homeDisplay = res.data.homeDisplay ? true : false;
          this.recommend = res.data.recommend ? true : false;
          this.remember = res.data.isMember ? true : false;
          this.buyMember = res.data.openMember ? true : false;
          this.lvyou = res.data.voucherGenerateType == 'TSTC' ? true : false;
          this.innerVip = res.data.innerVip ? true : false;

          let storeIdArr = [];
          res.data.productStores.forEach(function(i) {
            storeIdArr.push(i.storeId);
          });
          this.mechantChange(this.merchantId, storeIdArr);
          this.fileList1 = [
            {
              uid: "-1",
              name: res.data.picId,
              status: "done",
              url: this.picUrl(res.data.picId)
            }
          ];
          this.fileList4 = res.data.shareImg ? [
            {
              uid: "-1",
              name: res.data.shareImg,
              status: "done",
              url: this.picUrl(res.data.shareImg)
            }
          ] : [];
          this.buyerNotes = [];
          this.picXQ = [];
          let noteArr = JSON.parse(res.data.note);
          let picXQArr = JSON.parse(res.data.description);
          if (noteArr && noteArr.length > 0) {
            noteArr.forEach(function(i) {
              let content = [];
              if (i.content) {
                i.content.forEach(function(n) {
                  content.push({ item: n });
                });
                that.buyerNotes.push({ title: i.title, details: content });
              }
            });
          } else {
            that.buyerNote = [{ title: "", details: [{ item: "" }] }];
          }
          if (picXQArr && picXQArr.length > 0) {
            picXQArr.forEach(function(i) {
              let fileList = [];
              i.picIds.forEach(function(n, m) {
                fileList.push({
                  uid: m + "1",
                  name: n,
                  status: "done",
                  url: that.picUrl(n)
                });
              });
              that.picXQ.push({ fileList: fileList, picIds: i.content });
            });
          } else {
            that.picXQ = [{ fileList: [], picIds: "" }];
          }
          let fileList2 = res.data.picIds ? res.data.picIds.split(",") : [];
          if (fileList2 && fileList2.length > 0) {
            let fileList = [];
            fileList2.forEach(function(n, m) {
              fileList.push({
                uid: m + "1",
                name: n,
                status: "done",
                url: that.picUrl(n)
              });
            });
            this.fileList2 = fileList;
          }else{
            this.fileList2 = []
          }
        } else {
          this.$error({
            title: "温馨提示",
            content: res.errorInfo
          });
        }
      });
    },
    fenyongFun(item) {
      let data = {
        providerId: this.providerId,
        price: this.accurate_mul(item.currentp, 100),
        costPrice: this.accurate_mul(item.costp, 100),
        manageRateStr: item.manageRate,
        salesRateStr: item.saleRate
      };
      let that = this;
      this.$axios({
        url: "/endpoint/distributor/product/preCalculateEstimateSettlement.json",
        method: "get",
        processData: false,
        params: data
      }).then(res => {
        if (res.success) {
          res.data.forEach(function(i) {
            // if (i.settlementType === "MERCHANT") i.boolean = true;
            that.guigeDataSource.forEach(function(item2, index) {
              if(item.skuId == item2.skuId) {
                if (i.settlementType === "DISTRIBUTOR_SALES_REBATE"){
                  i.name = "销售返利";
                  i.boolean = true;
                  item2.salesp = that.accurate_div(i.estimateAmount, 100);
                }
                if (i.settlementType === "DISTRIBUTOR_MANAGER_REBATE"){
                  i.name = "管理佣金";
                  i.boolean = true;
                  item2.managep = that.accurate_div(i.estimateAmount, 100);
                }
              }
            })
            // if (i.settlementType === "JUJI_PLATFORM") i.name = "平台抽佣"; //平台抽佣
            // if (i.settlementType === "PROVIDER") i.name = "代理商分佣比例"; //代理商分佣比例
          });
        } else {
          this.$error({
            title: "温馨提示",
            content: res.errorInfo
          });
        }
      });
    },
    beforeUpload(file) {
      const isLt2M = file.size / 1024 / 1024 < 10;
      if (!isLt2M) {
        this.$message.error("上传图片大小必须小于10MB!");
      }
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

<style lang="less" scoped>
@import "./addProduct.less";
.fr {
  float: right;
  margin-top: 10px;
}
.disflex {
  display: flex;
}
.w40 {
  width: 40px;
  margin-left: 10px;
}
.qrCode {
  width: 85px;
  height: 85px;
  background-color: #eee;
  margin-right: 20px;
}
</style>

