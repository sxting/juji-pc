<template>
  <div>
    <a-card :body-style="{padding: '24px 32px'}" :bordered="false">
      <a-form :autoFormCreate="(form) => {this.form = form;}">
        <a-form-item label="商品名称" help="请选择参与活动的商品，一旦发布，活动期间该商品不可修改" :labelCol="{span: 7}" :wrapperCol="{span: 10}" :required="true">
          <a-button v-if="!productRadio" type="primary" @click="checkProduct">选择商品</a-button>
          <span v-else>
            <span>{{productRadio.productName}} 售价:{{productRadio.price/100}}元 原价:{{productRadio.originalPrice/100}}元 底价:{{productRadio.costPrice/100}}元</span>
            <a-button type="primary" :disabled="status === 'STARTED' ||status === 'ENDED'||status === 'READY'" v-if="productRadio" @click="delProduct">删除商品</a-button>
          </span>
        </a-form-item>
        <a-form-item label="活动限时" v-if="activityType === 'BARGAIN'||activityType === 'SPLICED'" help="可设定活动时长，活动限时不能超过24小时，不填默认选择24小时" :labelCol="{span: 7}" :wrapperCol="{span: 10}">
          <a-input-number :min="0" :disabled="status === 'STARTED' ||status === 'ENDED'" :step="1" v-model="timeLimit" :max="24" /> 时
        </a-form-item>
        <a-form-item label="砍价力度" v-if="activityType === 'BARGAIN'" :labelCol="{span: 7}" :wrapperCol="{span: 10}" :required="true">
          <div v-for="(item,index) in activityList" :key="index">
            {{index>0?'再':''}}需
            <a-input-number :min="1" :step="1" @change="bargainCountFun($event,item)" :value="item.bargainCount" :disabled="status === 'STARTED' ||status === 'ENDED'" :max="24" /> 刀， 砍掉
            <a-input-number :min="0" :step="1" @change="bargainAmountFun($event,item)" :value="item.bargainAmount" :disabled="status === 'STARTED' ||status === 'ENDED'" :max="99999" /> 元
            <a-button type="primary" :disabled="status === 'STARTED' ||status === 'ENDED'" v-if="index ===0" @click="addActivityList(index)">新增</a-button>
            <a-button type="primary" :disabled="status === 'STARTED' ||status === 'ENDED'" v-else @click="delActivityList(index)">删除</a-button>
          </div>

        </a-form-item>
        <a-form-item label="拼团价" v-else-if="activityType === 'SPLICED'" :labelCol="{span: 7}" :wrapperCol="{span: 10}" :required="true">
          <a-input-number :min="0" :disabled="status === 'STARTED' ||status === 'ENDED'" v-model="splicedPrice" /> 元
        </a-form-item>
        <a-form-item label="秒杀价" v-else :labelCol="{span: 7}" :wrapperCol="{span: 10}" :required="true">
          <a-radio-group v-model="skillCoin" :disabled="status === 'STARTED' ||status === 'ENDED'"  @change="skillCoinFun">
            <a-radio :value="'钱'">钱</a-radio>
            <a-radio :value="'桔子'" v-show="!((status === 'STARTED' ||status === 'ENDED')&&activityPoint==0)">钱+桔子</a-radio>
          </a-radio-group>
          <div>
            <a-input-number :min="0" :value="activityPrice" :disabled="status === 'STARTED' ||status === 'ENDED'" @change="priceChange($event)" :max="99999.99"  style="width:200px;margin-right:10px;"  placeholder="请输入钱数" /><span>元</span>
            <a-input-number :min="0" :value="activityPoint" :disabled="status === 'STARTED' ||status === 'ENDED'" v-if="skillCoin==='桔子'" @change="pointChange($event)" :max="99999" style="width:200px" placeholder="请输入桔子数量" /><span v-if="skillCoin==='桔子'">桔子</span>
          </div>
        </a-form-item>
        <a-form-item label="活动日期" v-if="activityType === 'BARGAIN'||activityType === 'SPLICED'" :labelCol="{span: 7}" :wrapperCol="{span: 10}" :required="true">
          <a-range-picker :disabled="status === 'STARTED' ||status === 'ENDED'" :disabledDate="disabledDate" :value="dateValue" @change="timeChange" :placeholder="['开始','结束']" />
        </a-form-item>
        <a-form-item label="秒杀开始时间" v-if="activityType === 'SEC_KILL'" :labelCol="{span: 7}" :wrapperCol="{span: 10}" :required="true">
          <a-date-picker :disabled="status === 'STARTED' ||status === 'ENDED'" :disabledDate="disabledDate" :value="moment(startDateValue, 'YYYY-MM-DD')" :defaultValue="moment(startDateValue, 'YYYY-MM-DD')" format="YYYY-MM-DD" @change="startDateChange"/>
          <a-time-picker style="margin-left: 10px;" :disabled="status === 'STARTED' ||status === 'ENDED'" :value="moment(startHoursValue, 'YYYY-MM-DD HH:mm:ss')" :defaultValue="moment(startHoursValue, 'YYYY-MM-DD HH:mm:ss')" format="HH" @openChange="handleOpenChange1"  :open="open1"  @change="startHoursChange">
            <!-- <a-button slot="addon" size="small" type="primary" @click="handleClose">确定</a-button> -->
          </a-time-picker>
        </a-form-item>
        <a-form-item label="秒杀结束时间" v-if="activityType === 'SEC_KILL'" :labelCol="{span: 7}" :wrapperCol="{span: 10}" :required="true">
          <a-date-picker :disabled="status === 'STARTED' ||status === 'ENDED'" :disabledDate="disabledDate" :value="moment(endDateValue, 'YYYY-MM-DD')" :defaultValue="moment(endDateValue, 'YYYY-MM-DD')" format="YYYY-MM-DD" @change="endDateChange"/>
          <a-time-picker style="margin-left: 10px;" :disabled="status === 'STARTED' ||status === 'ENDED'" :value="moment(endHoursValue, 'YYYY-MM-DD HH:mm:ss')" :defaultValue="moment(endHoursValue, 'YYYY-MM-DD HH:mm:ss')" format="HH" @openChange="handleOpenChange2"  @change="endHoursChange" :open="open2">
            <!-- <a-button slot="addon" size="small" type="primary" @click="handleClose">确定</a-button> -->
          </a-time-picker>
        </a-form-item>
        <a-form-item label="秒杀库存" v-if="activityType === 'SEC_KILL'" :labelCol="{span: 7}" :wrapperCol="{span: 10}" :required="true">
          <a-input-number :min="0" :disabled="status === 'STARTED' ||status === 'ENDED'" :step="1" :max="24" v-model="activityStock" /> 件
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
import moment from "moment";
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
      dateValue: null,
      startHoursValue: '00',
      endHoursValue: '00',
      hoursStart: '00',
      hoursEnd: '00',
      skillCoin:'钱',
      activityPrice:0,
      activityPoint:0,
      activityStock:0,
      startDateValue: this.timeForMat(-1)[0],
      endDateValue: this.timeForMat(-1)[0],
      today: this.timeForMat(0),
      open1:false,
      open2:false
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
    handleOpenChange1(open){
      console.log('open', open);
      this.open1 = open;
    },
    handleOpenChange2(open){
      console.log('open', open);
      this.open2 = open;
    },
    handleClose(e){
      console.log(e);
      this.open1 = false;
      this.open2 = false;
    },
    skillCoinFun(){
      if(this.skillCoin==='钱'){
        this.activityPoint = 0;
      }
    },
    priceChange(e){
      this.activityPrice = e;
    },
    pointChange(e){
      this.activityPoint = e;
    },
    disabledDate(current) {
      // Can not select days before today and today
      return current && current < moment().endOf("day");
    },
    addActivityList(index) {
      if (this.activityList.length > 4) {
        this.$error({
          title: "温馨提示",
          content: "最多新增五组"
        });
      } else {
        num++;
        this.activityList.push({
          bargainAmount: 0, //砍价金额
          bargainCount: 0, //砍价次数
          bargainStage: num, //砍价规则顺序
          initiatorBargainCount: 1, //发起者砍价次数
          participantBargainCount: 1 //参与者砍价次数
        });
      }
    },
    paginationChange(e) {
      this.pageNo = e;
      this.productListFun();
    },
    delProduct() {
      this.productRadio = "";
    },
    delActivityList(e) {
      num--;
      this.activityList.splice(e, 1);
    },
    timeChange(dates, dateStrings) {
      console.log(dates);
      console.log(dateStrings);
      this.dateValue = dates;
      this.dateStart = dateStrings[0];
      this.dateEnd = dateStrings[1];
    },
    startDateChange(time,dateString){
      console.log(time);
      console.log(dateString);
      this.startDateValue = dateString;
    },
    endDateChange(time,dateString){
      console.log(time);
      console.log(dateString);
      this.endDateValue = dateString;
    },
    startHoursChange(time,timeString){
      console.log(time);
      console.log(timeString);
      this.startHoursValue = time;
      this.hoursStart = timeString;
      this.open1 = false;
    }, 
    endHoursChange(time,timeString){
      console.log(time);
      console.log(timeString);
      this.endHoursValue = time;
      this.hoursEnd = timeString;
      this.open2 = false;
    },
    bargainCountFun(e, item) {
      item.bargainCount = e;
    },
    bargainAmountFun(e, item) {
      item.bargainAmount = e;
    },
    submit() {
      console.log(this.startDateValue);
      console.log(this.endDateValue);
      let seckillRull = [
        {
          activityPrice:0,
          activityPoint:0,
          activityStock:0
        }
      ];
      let that = this;
      let activityList2 = [];
      this.activityList.forEach(function(i) {
        activityList2.push(i);
      });
      activityList2.forEach(element => {
        element.bargainAmount = that.accurate_mul(element.bargainAmount, 100);
      });
      this.productId = this.productRadio.productId;

      let rules = null;
      if(this.activityType === "BARGAIN"){
        rules = activityList2;
      }else if(this.activityType === "SPLICED"){
        rules = [
          {
            enableMock: 0, //模拟成团
            splicedPeopleCount: 2, //拼团人数
            splicedPrice: this.accurate_mul(this.splicedPrice, 100) //拼团金额
          }
        ];
      }else if(this.activityType === "SEC_KILL"){
        rules = [
          {
            activityPrice:this.accurate_mul(this.activityPrice, 100),
            activityPoint:this.activityPoint,
            activityStock:this.activityStock
          }
        ];
      }
      // let hoursStart = this.dateStart.length > 11? '' : ' ' + this.hoursStart + ":00:00";
      // let hoursEnd = this.dateEnd.length > 11? '' : ' ' + this.hoursEnd + ":00:00";
      let data = null,hoursStart =null,hoursEnd = null;
      if(this.activityType === "BARGAIN"||this.activityType === "SPLICED"){
        hoursStart = this.dateStart.length > 11? '' : " 00:00:00";
        hoursEnd = this.dateEnd.length > 11? '' : " 23:59:59";
        data = {
          activityType: this.activityType,
          productId: this.productId,
          providerId: this.providerId,
          activityId: this.activityId,
          rules: rules,
          startTime: this.dateStart + hoursStart,
          endTime: this.dateEnd + hoursEnd,
          timeLimit: this.timeLimit || 24,
          timeLimitUnit: "HOUR"
        };
      }else{
        hoursStart = ' ' + this.hoursStart + ":00:00";
        hoursEnd = ' ' + this.hoursEnd + ":00:00";
        data = {
          activityType: this.activityType,
          productId: this.productId,
          providerId: this.providerId,
          activityId: this.activityId,
          rules: rules,
          startTime: this.startDateValue + hoursStart,
          endTime: this.endDateValue + hoursEnd,
          timeLimit: this.timeLimit || 24,
          timeLimitUnit: "HOUR"
        };
      }
      if (!data.activityId || this.status === "ENDED") delete data.activityId;
      let url = "/endpoint/activity/operate/create.json";
      let url2 = "/endpoint/activity/operate/modify.json";
      this.$axios({
        url: !this.activityId || this.status === "ENDED" ? url : url2,
        method: "post",
        processData: false,
        data: data
      }).then(res => {
        if (res.success) {
          let path = "";
          if(this.activityType === "BARGAIN"){
            path = "/activity/kanjiaList";
          }else if(this.activityType === "SPLICED"){
            path ="/activity/pintuanList";
          }else{
            path = "/activity/seckillList";
          }
          this.$router.push({
            path: path,
            query: {
              providerId: this.providerId
            }
          });
        } else {
          this.activityList.forEach(element => {
            element.bargainAmount = this.accurate_div(
              element.bargainAmount,
              100
            );
          });
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
        productName: this.productName,
        pageNo: this.pageNo,
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
          this.countTotal = res.data.countTotal;
        } else {
          this.$error({
            title: "温馨提示",
            content: res.errorInfo
          });
        }
      });
    },
    quxiao() {
      let path = '';
      if(this.activityType === "BARGAIN"){
        path = "/activity/kanjiaList";
      }else if(this.activityType === "SPLICED"){
        path = "/activity/pintuanList";
      }else{
        path = "/activity/seckillList";
      }
      this.$router.push({
        path: path,
        query: {
          providerId: this.providerId
        }
      });
    },
    onSearch(e) {
      this.productName = e;
      this.productListFun();
    },
    radioChange(e) {
      this.productName = '';
      this.productListFun();
      this.visible = false;
    },
    handleCancel() {
      this.productName = '';
      this.productListFun();
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
            productName: res.data.productName,
            originalPrice: res.data.originalPrice,
            costPrice: res.data.costPrice,
            price: res.data.salesPrice
          };
          if (this.activityType === "BARGAIN") {
            this.activityList = res.data.rules;
            this.activityList.forEach(function(i) {
              i.bargainAmount = that.accurate_div(i.bargainAmount, 100);
            });
          }else if(this.activityType === 'SPLICED'){
            this.splicedPrice = that.accurate_div(res.data.rules[0].splicedPrice, 100);
          }else if(this.activityType === 'SEC_KILL'){
            this.activityPrice = that.accurate_div(res.data.rules[0].activityPrice, 100);
            this.activityPoint = res.data.rules[0].activityPoint;
            if(res.data.rules[0].activityPoint>0){
              this.skillCoin = '桔子';
            }
            this.activityStock = res.data.rules[0].activityStock;
          }

          this.dateValue = [
            this.moment(res.data.startTime, "YYYY-MM-DD"),
            this.moment(res.data.endTime, "YYYY-MM-DD")
          ];
          // this.startHoursValue = this.moment(res.data.startTime, "YYYY-MM-DD HH:mm:ss");
          // this.endHoursValue = this.moment(res.data.endTime, "YYYY-MM-DD HH:mm:ss");
          // this.startDateValue = this.moment(res.data.startTime,"YYYY-MM-DD");
          // this.endDateValue = this.moment(res.data.startTime,"YYYY-MM-DD");
          this.startHoursValue = res.data.startTime;
          this.endHoursValue = res.data.endTime;
          this.startDateValue = res.data.startTime;
          this.endDateValue = res.data.endTime;
          this.dateStart = res.data.startTime;
          this.dateEnd = res.data.endTime;
          this.productId = res.data.productId;
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

