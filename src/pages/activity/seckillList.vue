<template>
  <a-card>
    <div v-if="showTable">

      <div>
        <a-col>
          <a-button @click="addNew" type="primary">新增秒杀活动</a-button>
        </a-col>
        <a-form layout="horizontal">
          <div>
            <a-row>
              <a-col :md="12" :sm="24">
                <a-form-item label="运营商" :labelCol="{span: 5}" :wrapperCol="{span: 18, offset: 1}">
                  <a-select placeholder="请选择" @change="providerListFun" :defaultValue="providerId">
                    <a-select-option v-for="(item) in providerList" :key="item.providerId">{{item.providerName}}</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :md="12" :sm="24">
                <a-form-item label="选择日期" :labelCol="{span: 5}" :wrapperCol="{span: 18, offset: 1}">
                  <a-range-picker @change="timeChange" :defaultValue="[moment(today[0], 'YYYY-MM-DD'), moment(today[1], 'YYYY-MM-DD')]" />
                </a-form-item>
              </a-col>

            </a-row>
            <a-row>
              <a-col :md="12" :sm="24">
                <a-form-item label="商品名称" :labelCol="{span: 5}" :wrapperCol="{span: 18, offset: 1}">
                  <a-input style="width: 100%" placeholder="请输入" :value="productName" @change="productNameFun" />
                </a-form-item>
              </a-col>
              <a-col :md="12" :sm="24">
                <span style="float: right; margin-top: 3px;">
                  <a-button type="primary" @click="submit">查询</a-button>
                </span>
              </a-col>
            </a-row>
          </div>

        </a-form>

      </div>

      <div class="operator">
        <a-row>
          <a-col>
            <a-tabs @change="tabsFun">
              <a-tab-pane :tab="'进行中'" key="STARTED"></a-tab-pane>
              <a-tab-pane :tab="'未开始'" key="READY"></a-tab-pane>
              <a-tab-pane :tab="'已结束'" key="ENDED"></a-tab-pane>
            </a-tabs>
          </a-col>
        </a-row>

      </div>
      <div>

        <a-table :columns="columns" :dataSource="data" :pagination="false" :locale="{emptyText: '暂无数据'}">
          <span slot="action" slot-scope="text, record">
            <a @click="chakan(record)" v-if="status ==='STARTED' || status ==='ENDED'">查看详情</a>
            <a-divider v-if="status ==='STARTED'" type="vertical" />
            <a @click="chakan(record)" v-if="status ==='READY'">编辑</a>
            <!-- 测试可用 -->
            <!-- <a-divider v-if="status ==='READY'" type="vertical" /> -->
             <!-- <a-popconfirm title="是否确认？" v-if="status ==='READY'" okText="确认" cancelText="否" @confirm="startFun(record)">
                <a-icon slot="icon" type="question-circle-o" style="color: red" />
                <a  class="ant-dropdown-link">立即开始</a>
              </a-popconfirm> -->
            <a-popconfirm title="是否确认？" v-if="status ==='STARTED'" okText="确认" cancelText="否" @confirm="stopFun(record)">
                <a-icon slot="icon" type="question-circle-o" style="color: red" />
                <a  class="ant-dropdown-link">结束活动</a>
              </a-popconfirm>
            <a-divider v-if="status ==='READY'" type="vertical" />
            <a-popconfirm title="是否确认？" v-if="status ==='READY'" okText="确认" cancelText="否" @confirm="delFun(record)">
                <a-icon slot="icon" type="question-circle-o" style="color: red" />
                <a  class="ant-dropdown-link">删除</a>
              </a-popconfirm>
          </span>
        </a-table>
        <div style="margin-top:20px;">
          <a-pagination style="float:right" @change="onChange" :current="pageNo" :pageSize="10" :total="countTotal" />
        </div>
      </div>
    </div>
    <div v-else>
      <a-form-item label="商品类型" :labelCol="{span: 7}" :wrapperCol="{span: 10}">
        {{productInfo.type === "PRODUCT"?'普通商品':'积分商品'}}
      </a-form-item>
      <a-form-item label="商品标签" :labelCol="{span: 7}" :wrapperCol="{span: 10}">
        {{productInfo.tag}}
      </a-form-item>
      <a-form-item label="商品名称" :labelCol="{span: 7}" :wrapperCol="{span: 10}">
        {{productInfo.productName}}
      </a-form-item>
      <a-form-item label="结算价" :labelCol="{span: 7}" :wrapperCol="{span: 10}">
        {{productInfo.productName}}
      </a-form-item>
      <a-form-item label="原价" :labelCol="{span: 7}" :wrapperCol="{span: 10}">
        {{productInfo.productName}}
      </a-form-item>
      <a-form-item label="售价" :labelCol="{span: 7}" v-if="productInfo.type === 'PRODUCT'" :wrapperCol="{span: 10}">
        {{productInfo.price/100}}
      </a-form-item>
      <a-form-item label="售价" :labelCol="{span: 7}" v-if="productInfo.type === 'POINT'" :wrapperCol="{span: 10}">
        <div>
          桔子{{productInfo.point}}
          <span v-if="productInfo.price">+钱{{productInfo.price/100}}</span>
        </div>
      </a-form-item>
      <a-form-item label="商品首图" :labelCol="{span: 7}" :wrapperCol="{span: 10}">
        <div class="clearfix">
          <a-upload listType="picture-card" :showUploadList="{showPreviewIcon:false,showRemoveIcon:false}" :fileList="fileList1">
          </a-upload>
        </div>
      </a-form-item>
      <a-form-item label="商品图片" :labelCol="{span: 7}" :wrapperCol="{span: 10}" v-if="fileList2&&fileList2.length>0">
        <div class="clearfix">
          <a-upload listType="picture-card" :showUploadList="{showPreviewIcon:false,showRemoveIcon:false}" :fileList="fileList2">
          </a-upload>
        </div>
      </a-form-item>
      <a-form-item label="图文详情" :labelCol="{span: 7}" :wrapperCol="{span: 10}">
        <div v-for="(list, j) in picXQ" :key="j">
          <div class="clearfix" v-if="list.fileList&&list.fileList.length>0">
            <a-upload listType="picture-card" :showUploadList="{showPreviewIcon:false,showRemoveIcon:false}" :fileList="list.fileList">
            </a-upload>
          </div>
          <div v-else>未上传图片详情</div>
          <a-textarea rows="4" :disabled="true" :value="list.picIds" placeholder="未上传文字详情" />
        </div>

      </a-form-item>
      <a-form-item label="购买须知" :labelCol="{span: 7}" :wrapperCol="{span: 10}">
        <div class="marketing_means">
          <div class="edit_goods_infor clearfix">
            <div class="divUl clearfix">
              <div class="divLi clearfix">
                <div class="right-block fl descriptions">
                  <form class="descriptions_form" v-for="(list, j) in buyerNotes" :key="j">
                    <a-input type="text" maxlength="40" :disabled="true" class="juniu_input" :value="list.title" placeholder="未上传标题" />
                    <div class="details_list_box">
                      <div class="form_parent" style="position:relative;" v-for="(detail, noteIndex) in list.details" :key="noteIndex">
                        <a-textarea type="text" maxlength="1000" :disabled="true" class="desc_textarea" :value="detail.item" placeholder="未上传内容"></a-textarea>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </a-form-item>
      <a-form-item label="库存" :labelCol="{span: 7}" :wrapperCol="{span: 10}">
        {{productInfo.stock}}
      </a-form-item>
      <a-form-item label="使用有效期" :labelCol="{span: 7}" :wrapperCol="{span: 10}">
        {{productInfo.cutOffDays}}
      </a-form-item>
      <a-form-item label="购买限制" :labelCol="{span: 7}" :wrapperCol="{span: 10}" v-if="productInfo.limitPerOrderNum || productInfo.limitPerDayNum || productInfo.limitMaxNum">
        <div v-if="productInfo.limitPerOrderNum">
          每单最多购买{{productInfo.limitPerOrderNum}}个
        </div>
        <div v-if="productInfo.limitPerDayNum">
          每日最多购买{{productInfo.limitPerDayNum}}个
        </div>
        <div v-if="productInfo.limitMaxNum">
          每人最多购买{{productInfo.limitMaxNum}}个
        </div>
      </a-form-item>
      <a-form-item label="展示顺序" :labelCol="{span: 7}" :wrapperCol="{span: 10}" v-if="productInfo.idx">
        {{productInfo.idx}}
      </a-form-item>
      <a-form-item label="所属商家" :labelCol="{span: 7}" :wrapperCol="{span: 10}">
        {{productInfo.merchantName}}
      </a-form-item>
      <a-form-item label="审核结果" :labelCol="{span: 7}" :wrapperCol="{span: 10}">
        <a-radio-group v-model="tongguo">
          <a-radio value="0" v-if="status!=='REJECT'">通过</a-radio>
          <a-radio value="1">不通过</a-radio>
        </a-radio-group>
        <a-input v-if="tongguo==='1'" type="text" maxlength="40" v-model="butongguo" @change="butongguoFun" class="juniu_input" placeholder="请填写不通过原因" />
      </a-form-item>
      <a-form-item :wrapperCol="{span: 10, offset: 7}">
        <a-button type="primary" style="margin-right:20px" @click="reviewedSubmit">提交</a-button>
        <a-button type="primary" @click="quxiao">取消</a-button>

      </a-form-item>
    </div>
  </a-card>
</template>

<script>
import StandardTable from "../../components/table/StandardTable";
const columns = [
  {
    title: "商品名称",
    dataIndex: "productName"
  },
  {
    title: "商品原价",
    dataIndex: "originalPrice"
  },
  {
    title: "商品底价",
    dataIndex: "costPrice"
  },
  {
    title: "活动起止时间",
    dataIndex: "time"
  },
  {
    title: "操作",
    key: "action",
    scopedSlots: {
      customRender: "action"
    }
  }
];
const data = [];
const dataSource = [];

export default {
  name: "KanjiaList",
  components: {
    StandardTable
  },
  data() {
    return {
      showTable: true,
      columns: columns,
      data: data,
      tongguo: "0",
      buyerNotes: [
        {
          title: "",
          details: [
            {
              item: ""
            }
          ]
        }
      ], //购买须知
      picXQ: [
        {
          fileList: [],
          picIds: ""
        }
      ], //图片详情
      fileList2: [],
      fileList1: [],
      pageNo: 1,
      butongguo: "",
      providerId: "ALL",
      countTotal: 1,
      productType: "ALL",
      status: "STARTED",
      productName: "",
      productInfo: {},
      dateStart: "",
      dateEnd: "",
      INITNUM: 0,
      PASSNUM: 0,
      REJECTNUM: 0,
      id: "",
      yestoday: this.timeForMat(1),
      today: this.timeForMat(0),
      providerList: JSON.parse(sessionStorage.getItem("LoginDate")).providerList,
      activityType:'SEC_KILL'
    };
  },
  created() {
    this.providerList = JSON.parse(
      sessionStorage.getItem("LoginDate")
    ).providerList;
    this.providerId = this.$route.query.providerId?this.$route.query.providerId:this.providerList[0].providerId;
    this.dateStart = this.today[0];
    this.dateEnd = this.today[1];
    this.activityList();
  },
  mounted() {},
  methods: {
    startFun(e) {
      let data  = {
        providerId : this.providerId,
        activityId : e.activityId,
        activityType : this.activityType
      }
      this.$axios({
        url: "/endpoint/activity/operate/starting.json",
        method: "get",
        processData: false,
         params: data
      }).then(res => {
        if (res.success) {
          this.activityList();
        } else {
          this.$error({
            title: "温馨提示",
            content: res.errorInfo
          });
        }
      });
    },
    stopFun(e) {
      let data  = {
        providerId : this.providerId,
        activityId : e.activityId,
        activityType : this.activityType
      }
      this.$axios({
        url: "/endpoint/activity/operate/ending.json",
        method: "get",
        processData: false,
         params: data
      }).then(res => {
        if (res.success) {
          this.activityList();
        } else {
          this.$error({
            title: "温馨提示",
            content: res.errorInfo
          });
        }
      });
    },
    delFun(e) {
      let data  = {
        providerId : this.providerId,
        activityId : e.activityId,
        activityType : this.activityType
      }
      this.$axios({
        url: "/endpoint/activity/operate/delete.json",
        method: "get",
        processData: false,
         params: data
      }).then(res => {
        if (res.success) {
          this.activityList();
        } else {
          this.$error({
            title: "温馨提示",
            content: res.errorInfo
          });
        }
      });
    },
    providerListFun(e) {
      this.providerId = e;
    },
    addNew() {
      this.$router.push({
        path: "/activity/addKanjia",
        query: { providerId: this.providerId, activityType: this.activityType }
      });
    },
    timeChange(dates, dateStrings) {
      this.dateStart = dateStrings[0];
      this.dateEnd = dateStrings[1];
      this.activityList();
    },
    statuNum() {
      this.$axios({
        url: "/endpoint/product/audit/status.json",
        method: "get",
        processData: false
      }).then(res => {
        if (res.success) {
          this.INITNUM = res.data.INIT;
          this.PASSNUM = res.data.PASS;
          this.REJECTNUM = res.data.REJECT;
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
    quxiao() {
      this.showTable = true;
    },
    reviewedSubmit() {
      if (this.tongguo === "0") this.tongguoHttp();
      if (this.tongguo === "1") {
        if (!this.butongguo) {
          this.$error({
            title: "温馨提示",
            content: "请填写不通过原因"
          });
        } else {
          this.butongguoHttp();
        }
      }
    },
    chakan(e) {
      this.$router.push({
        path: "/activity/addKanjia",
        query: {
          providerId: this.providerId,
          activityType: this.activityType,
          activityId: e.activityId,
          status:this.status
        }
      });
    },
    tabsFun(e) {
      this.status = e;
      if (this.status === "PASS") this.columns = columns2;
      else this.columns = columns;
      this.activityList();
    },
    butongguoFun(e) {
      // console.log(e)
      // this.butongguo = e;
    },
    providerFun(e) {
      this.providerId = e;
    },
    productTypeFun(e) {
      this.productType = e;
    },
    productNameFun(e) {
      console.log(e);
      this.productName = e.target.value;
    },
    submit() {
      this.activityList();
    },
    onChange(e) {
      this.pageNo = e;
      this.activityList();
    },
    activityList() {
      let data = {
        pageNo: this.pageNo,
        pageSize: 10,
        providerId: this.providerId,
        productName: this.productName,
        activityType: this.activityType,
        activityStatus: this.status,
        startDate: this.dateStart,
        endDate: this.dateEnd
      };
      let that = this;
      if (!data.productName) delete data.productName;
      this.$axios({
        url: "/endpoint/activity/operate/list.json",
        method: "get",
        processData: false,
        params: data
      }).then(res => {
        if (res.success) {
          this.data = res.data.elements;
          this.data.forEach(function(i) {
            i.originalPrice = that.accurate_div(i.originalPrice, 100);
            i.costPrice = that.accurate_div(i.costPrice, 100);
            i.time = i.startTime + "-" + i.endTime;
          });
        } else {
          this.$error({
            title: "温馨提示",
            content: res.errorInfo
          });
        }
      });
    }
  }
};
</script>

<style lang="less" scoped>
.search {
  margin-bottom: 54px;
}

.fold {
  width: calc(100% - 216px);
  display: inline-block;
}

.operator {
  margin-bottom: 18px;
}

@media screen and (max-width: 900px) {
  .fold {
    width: 100%;
  }
}
</style>
