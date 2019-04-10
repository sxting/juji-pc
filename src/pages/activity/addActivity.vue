<template>
  <div>
    <a-card :body-style="{padding: '24px 32px'}" :bordered="false">
      <a-form :autoFormCreate="(form) => {this.form = form;}">
        <a-form-item label="商品类型" help="请选择参与活动的商品，一旦发布，活动期间该商品不可修改" :labelCol="{span: 7}" :wrapperCol="{span: 10}" :required="true">
          <a-button v-if="!productRadio" type="primary" @click="checkProduct">选择商品</a-button>
          <span v-else>
            <span>{{productRadio.productName}} 售价:{{productRadio.price/100}} 原价:{{productRadio.originalPrice/100}} 底价:{{productRadio.costPrice/100}}</span>
            <a-button type="primary" :disabled="status === 'STARTED' ||status === 'ENDED'||status === 'READY'" v-if="productRadio" @click="delProduct">删除商品</a-button>
          </span>
        </a-form-item>
        <a-form-item label="活动限时" help="可设定活动时长，活动限时不能超过24小时，不填默认选择24小时" :labelCol="{span: 7}" :wrapperCol="{span: 10}">
          <a-input-number :min="0" :disabled="status === 'STARTED' ||status === 'ENDED'" :step="1" v-model="timeLimit" :max="24" /> 时
        </a-form-item>
        <a-form-item label="砍价力度" v-if="activityType === 'BARGAIN'" :labelCol="{span: 7}" :wrapperCol="{span: 10}" :required="true">
          <div v-for="(item,index) in activityList" :key="index">
            需
            <a-input-number :min="1" :step="1" @change="bargainCountFun($event,item)" :value="item.bargainCount" :disabled="status === 'STARTED' ||status === 'ENDED'" :max="24" /> 刀， 砍掉
            <a-input-number :min="0" :step="1" @change="bargainAmountFun($event,item)" :value="item.bargainAmount" :disabled="status === 'STARTED' ||status === 'ENDED'" :max="99999" /> 元
            <a-button type="primary" :disabled="status === 'STARTED' ||status === 'ENDED'" v-if="index ===0" @click="addActivityList(index)">新增</a-button>
            <a-button type="primary" :disabled="status === 'STARTED' ||status === 'ENDED'" v-else @click="delActivityList(index)">删除</a-button>
          </div>

        </a-form-item>
        <a-form-item label="拼团价" v-else :labelCol="{span: 7}" :wrapperCol="{span: 10}">
          <a-input-number :min="0" :disabled="status === 'STARTED' ||status === 'ENDED'" :step="1" :max="24" v-model="splicedPrice" /> 元
        </a-form-item>
        <a-form-item label="活动日期" :labelCol="{span: 7}" :wrapperCol="{span: 10}" :required="true">
          <a-range-picker :disabled="status === 'STARTED' ||status === 'ENDED'" :value="dateValue"  @change="timeChange" :placeholder="['开始','结束']" />
        </a-form-item>
        <a-form-item :wrapperCol="{span: 10, offset: 7}">
          <a-button style="margin-right:20px" v-if="status !== 'STARTED'" @click="submit">保存并发布</a-button>
          <a-button @click="quxiao">取消</a-button>

        </a-form-item>
      </a-form>
    </a-card>
    <a-modal title="选择商品" :visible="visible" :footer="null" @cancel="handleCancel">
      <a-input-search placeholder="请输入商品名称" @search="onSearch" enterButton="搜索" size="large" />
      <div class="radioBox">
        <a-radio-group @change="radioChange" v-model="productRadio">
          <a-radio v-for="item in productList" :key="item.productId" :style="radioStyle" :value="item">{{item.productName}}</a-radio>
        </a-radio-group>
      </div>
      <div style="margin-top:20px;height: 50px;">
        <a-pagination style="float:right" @change="paginationChange" :current="pageNo" :pageSize="50" :total="countTotal" />
      </div>
    </a-modal>
  </div>

</template>

<script>
import { Modal } from "ant-design-vue";
var num = 0;
export default {
  name: "addActivity",
  data() {
    return {
      radioStyle: {
        display: "block",
        height: "30px",
        lineHeight: "30px",
        marginTop: "5px"
      },
      visible: false,
      activityList: [
        {
          bargainAmount: "", //砍价金额
          bargainCount: "", //砍价次数
          bargainStage: num, //砍价规则顺序
          initiatorBargainCount: 1, //发起者砍价次数
          participantBargainCount: 1 //参与者砍价次数
        }
      ],
      productRadio: "",
      productList: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      activityType: "",
      providerId: "",
      timeLimit: "",
      dateStart: "",
      dateEnd: "",
      productId: "",
      splicedPrice: "",
      countTotal: 50,
      pageNo: 1,
      activityId: "",
      status: "",
      dateValue:null
    };
  },
  created() {
    this.providerId = this.$route.query.providerId;
    this.activityType = this.$route.query.activityType;
    this.activityId = this.$route.query.activityId;
    this.status = this.$route.query.status;
    if (this.activityId) this.detailFun();
    this.productListFun();
  },
  mounted() {},
  computed: {
    filteredOptions() {
      return this.merchantList.filter(o => !this.selectedItems.includes(o));
    }
  },
  methods: {
    addActivityList(index) {
      num++;
      this.activityList.push({
        bargainAmount: 0, //砍价金额
        bargainCount: 0, //砍价次数
        bargainStage: num, //砍价规则顺序
        initiatorBargainCount: 1, //发起者砍价次数
        participantBargainCount: 1 //参与者砍价次数
      });
    },
    paginationChange(e) {
      this.pageNo = e;
    },
    delProduct() {
      this.productRadio = "";
    },
    delActivityList(e) {
      num--;
      this.activityList.splice(e);
    },
    timeChange(dates, dateStrings) {
      this.dateStart = dateStrings[0];
      this.dateEnd = dateStrings[1];
    },
    bargainCountFun(e, item) {
      item.bargainCount = e;
    },
    bargainAmountFun(e, item) {
      item.bargainAmount = e;
    },
    submit() {
      let pintuanRule = [
        {
          enableMock: 0, //模拟成团
          splicedPeopleCount: 2, //拼团人数
          splicedPrice: this.accurate_mul(this.splicedPrice, 100) //拼团金额
        }
      ];
      this.activityList.forEach(element => {
        element.bargainAmount = this.accurate_mul(element.bargainAmount, 100);
      });
      this.productId = this.productRadio.productId;
      let data = {
        activityType: this.activityType,
        endTime: this.dateEnd + " 23:59:59",
        productId: this.productId,
        providerId: this.providerId,
        activityId: this.activityId,
        rules:
          this.activityType === "BARGAIN" ? this.activityList : pintuanRule,
        startTime: this.dateStart + " 00:00:00",
        timeLimit: this.timeLimit || 24,
        timeLimitUnit: "HOUR"
      };
      if (!data.activityId || this.status === "ENDED") delete data.activityId;
      let url = "/endpoint/activity/operate/create.json";
      let url2 = "/endpoint/activity/operate/modify.json";
      this.$axios({
        url: !this.activityId|| this.status === "ENDED" ? url : url2,
        method: "post",
        processData: false,
        data: data
      }).then(res => {
        if (res.success) {
          let path = "/activity/kanjiaList";
          let path2 = "/activity/pintuanList";
          this.$router.push({
            path: this.activityType === "BARGAIN" ? path : path2
          });
        } else {
          this.$error({
            title: "温馨提示",
            content: res.errorInfo
          });
        }
      });
    },
    productListFun() {
      let data = {
        providerId: this.providerId,
        activityType: this.activityType,
        productName: "",
        pageNo: 1,
        pageSize: 50
      };
      this.$axios({
        url: "/endpoint/product/unLockProducts.json",
        method: "get",
        processData: false,
        params: data
      }).then(res => {
        if (res.success) {
          this.productList = res.data.list;
        } else {
          this.$error({
            title: "温馨提示",
            content: res.errorInfo
          });
        }
      });
    },
    quxiao() {
      let path = "/activity/kanjiaList";
      let path2 = "/activity/pintuanList";
      this.$router.push({
        path: this.activityType === "BARGAIN" ? path : path2
      });
    },
    onSearch(e) {
      console.log(e);
    },
    radioChange(e) {
      this.visible = false;
    },
    handleCancel() {
      this.visible = false;
    },
    checkProduct() {
      this.visible = true;
    },
    //活动详情 /endpoint/activity/operate/detail.json
    detailFun() {
      let data = {
        providerId: this.providerId,
        activityId: this.activityId,
        activityType: this.activityType
      };
      let that = this;
      this.$axios({
        url: "/endpoint/activity/operate/detail.json",
        method: "get",
        processData: false,
        params: data
      }).then(res => {
        if (res.success) {
          this.timeLimit = res.data.timeLimit;
          this.productRadio = {
            originalPrice: res.data.originalPrice,
            costPrice: res.data.costPrice,
            price: res.data.salesPrice
          };
          this.activityList = res.data.rules;
          this.dateValue = [this.moment(res.data.startTime, 'YYYY-MM-DD'), this.moment(res.data.endTime, 'YYYY-MM-DD')]
          this.dateStart = res.data.startTime
          this.dateEnd = res.data.endTime
          this.productId = res.data.productId
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
.radioBox {
  height: 300px;
  overflow-y: auto;
}
</style>

