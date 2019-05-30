<template>
  <div>
    <a-card :body-style="{padding: '24px 32px'}" :bordered="false">
      <a-form :autoFormCreate="(form) => {this.form = form;}">
        <a-form-item label="商品名称" help="请选择参与活动的商品，一旦发布，活动期间该商品不可修改" :labelCol="{span: 3}" :wrapperCol="{span: 21}" :required="true">
          <a-button v-if="!productRadio" type="primary" @click="checkProduct">选择商品</a-button>
          <span v-else>
            <span>{{productRadio.productName}} <!--售价:{{productRadio.price/100}}元 原价:{{productRadio.originalPrice/100}}元 底价:{{productRadio.costPrice/100}}元--></span>
            <a-button type="primary" :disabled="status === 'STARTED' ||status === 'ENDED'||status === 'READY'" v-if="productRadio" @click="delProduct">删除商品</a-button>
          </span>
        </a-form-item>

        <a-form-item v-if="productRadio" label="商品规格" :labelCol="{span: 3}" :wrapperCol="{span: 21}" :required="true">
          <a-table :dataSource="guigeDataSource" :columns="guigeColumns" :pagination="false">
            <template v-for="(col, i) in colArr" :slot="col" slot-scope="text, record">
              <div :key="col" v-if="col == 'kanjiap'">
                <div v-for="(item,i) in text" :key="i" class="disflex" :class="{mt15: i>0}">
                  <span class="nowrap">{{i>0?'再':''}}需 </span>
                  <a-input-number :min="1" :step="1" @change="bargainCountFun($event,item)" :value="item.bargainCount" :disabled="status === 'STARTED' ||status === 'ENDED'" :max="24" style="margin: -5px 0; width: 50px;" /> <span class="nowrap">刀，砍掉</span>
                  <a-input-number :min="0" :step="1" @change="bargainAmountFun($event,item)" :value="item.bargainAmount" :disabled="status === 'STARTED' ||status === 'ENDED'" :max="99999" style="margin: -5px 0; width: 70px;" /> 元
                  <a-button type="primary" :disabled="status === 'STARTED' ||status === 'ENDED'" v-if="i ===0" @click="addActivityList1(i, text)" style="margin: -5px 0; padding: 0 10px; margin-left: 5px;">新增</a-button>
                  <a-button type="primary" :disabled="status === 'STARTED' ||status === 'ENDED'" v-else @click="delActivityList1(i, text)" style="margin: -5px 0; padding: 0 10px; margin-left: 5px;">删除</a-button>
                </div>
              </div>
              <div :key="col" v-else-if="col == 'miaoshap'" class="disflex">
                <a-input
                  :disabled="status === 'STARTED' ||status === 'ENDED'"
                  style="margin: -5px 0; width: 70px;"
                  :value="text.price"
                  @change="e => handleChange2(e.target.value, record.key, col)"
                  @blur="e => handleBlur2(e.target.value, record.key, col)"
                />  <span class="nowrap">元 +</span>
                <a-input
                  :disabled="status === 'STARTED' ||status === 'ENDED'"
                  style="margin: -5px 0; width: 70px;"
                  :value="text.juzi"
                  @change="e => handleChange3(e.target.value, record.key, col)"
                  @blur="e => handleBlur3(e.target.value, record.key, col)"
                /> <span class="nowrap">桔子</span>
              </div>
              <div :key="col" v-else>
                <div class="disflex" v-if="guigeColumns[i].editable">
                  <a-input
                    :disabled="status === 'STARTED' ||status === 'ENDED'"
                    style="margin: -5px 0; width: 70px;"
                    :value="text"
                    @change="e => handleChange1(e.target.value, record.key, col)"
                    @blur="e => handleBlur1(e.target.value, record.key, col)"
                  />
                  <span v-if="guigeColumns[i].rate"> % </span>
                  <span class="w40" v-if="i == 6">{{record.salesp}}</span>
                  <span class="w40" v-if="i == 7">{{record.managep}}</span>
                </div>
                <template v-else>{{text}}</template>
              </div>
            </template>
          </a-table>
        </a-form-item>

        <a-form-item label="活动限时" v-if="activityType === 'BARGAIN'||activityType === 'SPLICED'" help="可设定活动时长，活动限时不能超过24小时，不填默认选择24小时" :labelCol="{span: 3}" :wrapperCol="{span: 21}">
          <a-input-number :min="0" :disabled="status === 'STARTED' ||status === 'ENDED'" :step="1" v-model="timeLimit" :max="24" /> 时
        </a-form-item>
        <!--
        <a-form-item label="砍价力度" v-if="activityType === 'BARGAIN'" :labelCol="{span: 3}" :wrapperCol="{span: 21}" :required="true">
          <div v-for="(item,index) in activityList" :key="index">
            {{index>0?'再':''}}需
            <a-input-number :min="1" :step="1" @change="bargainCountFun($event,item)" :value="item.bargainCount" :disabled="status === 'STARTED' ||status === 'ENDED'" :max="24" /> 刀， 砍掉
            <a-input-number :min="0" :step="1" @change="bargainAmountFun($event,item)" :value="item.bargainAmount" :disabled="status === 'STARTED' ||status === 'ENDED'" :max="99999" /> 元
            <a-button type="primary" :disabled="status === 'STARTED' ||status === 'ENDED'" v-if="index ===0" @click="addActivityList(index)">新增</a-button>
            <a-button type="primary" :disabled="status === 'STARTED' ||status === 'ENDED'" v-else @click="delActivityList(index)">删除</a-button>
          </div>
        </a-form-item>
        <a-form-item label="拼团价" v-else-if="activityType === 'SPLICED'" :labelCol="{span: 3}" :wrapperCol="{span: 21}" :required="true">
          <a-input-number :min="0" :disabled="status === 'STARTED' ||status === 'ENDED'" v-model="splicedPrice" /> 元
        </a-form-item>
        <a-form-item label="秒杀价" v-else :labelCol="{span: 3}" :wrapperCol="{span: 21}" :required="true">
          <a-radio-group v-model="skillCoin" :disabled="status === 'STARTED' ||status === 'ENDED'"  @change="skillCoinFun">
            <a-radio :value="'钱'">钱</a-radio>
            <a-radio :value="'桔子'" v-show="!((status === 'STARTED' ||status === 'ENDED')&&activityPoint==0)">钱+桔子</a-radio>
          </a-radio-group>
          <div>
            <a-input-number :min="0" :value="activityPrice" :disabled="status === 'STARTED' ||status === 'ENDED'" @change="priceChange($event)" :max="99999.99"  style="width:200px;margin-right:10px;"  placeholder="请输入钱数" /><span>元</span>
            <a-input-number :min="0" :value="activityPoint" :disabled="status === 'STARTED' ||status === 'ENDED'" v-if="skillCoin==='桔子'" @change="pointChange($event)" :max="99999" style="width:200px" placeholder="请输入桔子数量" /><span v-if="skillCoin==='桔子'">桔子</span>
          </div>
        </a-form-item>-->
        <a-form-item label="活动日期" v-if="activityType === 'BARGAIN'||activityType === 'SPLICED'" :labelCol="{span: 3}" :wrapperCol="{span: 21}" :required="true">
          <a-range-picker :disabled="status === 'STARTED' ||status === 'ENDED'" :disabledDate="disabledDate" :value="dateValue" @change="timeChange" :placeholder="['开始','结束']" />
        </a-form-item>
        <a-form-item label="秒杀开始时间" v-if="activityType === 'SEC_KILL'" :labelCol="{span: 7}" :wrapperCol="{span: 10}" :required="true">
          <a-date-picker :disabled="status === 'STARTED' ||status === 'ENDED'" :disabledDate="disabledDate2" :value="moment(startDateValue, 'YYYY-MM-DD')" :defaultValue="moment(startDateValue, 'YYYY-MM-DD')" format="YYYY-MM-DD" :allowClear="false" @change="startDateChange"/>
          <a-time-picker style="margin-left: 10px;" :disabled="status === 'STARTED' ||status === 'ENDED'" :value="moment(startHoursValue, 'YYYY-MM-DD HH:mm:ss')" :defaultValue="moment(startHoursValue, 'YYYY-MM-DD HH:mm:ss')" format="HH" :allowEmpty="false" @openChange="handleOpenChange1"  :open="open1"  @change="startHoursChange">
            <!-- <a-button slot="addon" size="small" type="primary" @click="handleClose">确定</a-button> -->
          </a-time-picker>
        </a-form-item>
        <a-form-item label="秒杀结束时间" v-if="activityType === 'SEC_KILL'" :labelCol="{span: 7}" :wrapperCol="{span: 10}" :required="true">
          <a-date-picker :disabled="status === 'STARTED' ||status === 'ENDED'" :disabledDate="disabledDate2" :value="moment(endDateValue, 'YYYY-MM-DD')" :defaultValue="moment(endDateValue, 'YYYY-MM-DD')" format="YYYY-MM-DD" :allowClear="false" @change="endDateChange"/>
          <a-time-picker style="margin-left: 10px;" :disabled="status === 'STARTED' ||status === 'ENDED'" :value="moment(endHoursValue, 'YYYY-MM-DD HH:mm:ss')" :defaultValue="moment(endHoursValue, 'YYYY-MM-DD HH:mm:ss')" format="HH" :allowEmpty="false" @openChange="handleOpenChange2"  @change="endHoursChange" :open="open2">
            <!-- <a-button slot="addon" size="small" type="primary" @click="handleClose">确定</a-button> -->
          </a-time-picker>
        </a-form-item>
        <!--<a-form-item label="秒杀库存" v-if="activityType === 'SEC_KILL'" :labelCol="{span: 3}" :wrapperCol="{span: 21}" :required="true">
          <a-input-number :min="0" :disabled="status === 'STARTED' ||status === 'ENDED'" :step="1" :max="24" v-model="activityStock" /> 件
        </a-form-item>-->
        <a-form-item :wrapperCol="{span: 21, offset: 3}">
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

const guigeColumns1 = [
  {
    title: '规格名称',
    dataIndex: 'name',
    scopedSlots: { customRender: 'name' },
  }, {
    title: '原价(元)',
    dataIndex: 'originp',
    scopedSlots: { customRender: 'originp' },
  }, {
    title: '售价(元)',
    dataIndex: 'currentp',
    scopedSlots: { customRender: 'currentp' },
  }, {
    title: '桔子积分',
    dataIndex: 'point',
    scopedSlots: { customRender: 'point' },
  }, {
    title: '底价(元)',
    dataIndex: 'costp',
    scopedSlots: { customRender: 'costp' },
  }, {
    title: '拼团价(元)',
    dataIndex: 'pintuanp',
    scopedSlots: { customRender: 'pintuanp' },
    editable: true
  }, {
    title: '销售返利(%/元)',
    dataIndex: 'salesRate',
    scopedSlots: { customRender: 'salesRate' },
    editable: true,
    rate: true
  }, {
    title: '管理佣金(%/元)',
    dataIndex: 'manageRate',
    scopedSlots: { customRender: 'manageRate' },
    editable: true,
    rate: true
  }
  // , {
  //   title: '平台抽佣',
  //   dataIndex: 'platform',
  //   scopedSlots: { customRender: 'platform' },
  // }, {
  //   title: '代理商分佣(元)',
  //   dataIndex: 'provider',
  //   scopedSlots: { customRender: 'provider' },
  // }
]
const guigeDataSource1 = [
  {
    key: '0',
    name: '',
    originp: '99',
    currentp: '49',
    point: '0',
    costp: '19',
    pintuanp: '0',
    salesRate: '0',
    manageRate: '0',
    platform: '0',
    provider: '0',
    salesp: '0',
    managep: '0'
  }
]

const guigeColumns2 = [
  {
    title: '规格名称',
    dataIndex: 'name',
    scopedSlots: { customRender: 'name' },
  }, {
    title: '原价(元)',
    dataIndex: 'originp',
    scopedSlots: { customRender: 'originp' },
  }, {
    title: '售价(元)',
    dataIndex: 'currentp',
    scopedSlots: { customRender: 'currentp' },
  }, {
    title: '桔子积分',
    dataIndex: 'point',
    scopedSlots: { customRender: 'point' },
  }, {
    title: '底价(元)',
    dataIndex: 'costp',
    scopedSlots: { customRender: 'costp' },
  }, {
    title: '砍价力度',
    dataIndex: 'kanjiap',
    scopedSlots: { customRender: 'kanjiap' },
  }
  , {
    title: '销售返利(%/元)',
    dataIndex: 'salesRate',
    scopedSlots: { customRender: 'salesRate' },
    editable: true,
    rate: true
  }, {
    title: '管理佣金(%/元)',
    dataIndex: 'manageRate',
    scopedSlots: { customRender: 'manageRate' },
    editable: true,
    rate: true
  }
]
const guigeDataSource2 = [
  {
    key: '0',
    name: '',
    originp: '0',
    currentp: '0',
    point: '0',
    costp: '0',
    kanjiap: [
      {
        bargainAmount: "0", //砍价金额
        bargainCount: "0", //砍价次数
        bargainStage: num, //砍价规则顺序
        initiatorBargainCount: 1, //发起者砍价次数
        participantBargainCount: 1 //参与者砍价次数
      }
    ],
    salesRate: '0',
    manageRate: '0',
    salesp: '0',
    managep: '0'
  }
]

const guigeColumns3 = [
  {
    title: '规格名称',
    dataIndex: 'name',
    scopedSlots: { customRender: 'name' },
  }, {
    title: '原价(元)',
    dataIndex: 'originp',
    scopedSlots: { customRender: 'originp' },
  }, {
    title: '售价(元)',
    dataIndex: 'currentp',
    scopedSlots: { customRender: 'currentp' },
  }, {
    title: '桔子积分',
    dataIndex: 'point',
    scopedSlots: { customRender: 'point' },
  }, {
    title: '底价(元)',
    dataIndex: 'costp',
    scopedSlots: { customRender: 'costp' },
  }, {
    title: '秒杀价',
    dataIndex: 'miaoshap',
    scopedSlots: { customRender: 'miaoshap' },
    editable: true
  }, {
    title: '销售返利(%/元)',
    dataIndex: 'salesRate',
    scopedSlots: { customRender: 'salesRate' },
    editable: true,
    rate: true
  }, {
    title: '管理佣金(%/元)',
    dataIndex: 'manageRate',
    scopedSlots: { customRender: 'manageRate' },
    editable: true,
    rate: true
  },{
    title: '商品库存',
    dataIndex: 'stock1',
    scopedSlots: { customRender: 'stock1' },
  }, {
    title: '秒杀库存',
    dataIndex: 'stock2',
    scopedSlots: { customRender: 'stock2' },
    editable: true,
  }

]
const guigeDataSource3 = [
  {
    key: '0',
    name: '',
    originp: '0',
    currentp: '0',
    point: '0',
    costp: '0',
    miaoshap: {
      price: '0',
      juzi: '0'
    },
    salesRate: '0',
    manageRate: '0',
    stock1: '0',
    stock2: '0',
    salesp: '',
    managep: '',
  }
]

const colArr1 = ['name', 'originp', 'currentp', 'point', 'costp', 'pintuanp', 'salesRate', 'manageRate', 'platform', 'provider']
const colArr2 = ['name', 'originp', 'currentp', 'point', 'costp', 'kanjiap', 'salesRate', 'manageRate']
const colArr3 = ['name', 'originp', 'currentp', 'point', 'costp', 'miaoshap', 'salesRate', 'manageRate', 'stock1', 'stock2']

export default {
  name: "addActivity",
  data() {
    return {
      guigeColumns: guigeColumns1,
      guigeDataSource: guigeDataSource1,
      colArr: colArr1,
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
      startDateValue: this.timeForMat(0)[0],
      endDateValue: this.timeForMat(0)[0],
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
    if(this.activityType === 'SPLICED') {
      this.guigeColumns = guigeColumns1;
      this.guigeDataSource = guigeDataSource1;
      this.colArr = colArr1;
    } else if(this.activityType === 'BARGAIN') {
      this.guigeColumns = guigeColumns2;
      this.guigeDataSource = guigeDataSource2;
      this.colArr = colArr2;
    } else if(this.activityType === 'SEC_KILL') {
      this.guigeColumns = guigeColumns3;
      this.guigeDataSource = guigeDataSource3;
      this.colArr = colArr3;
    };
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
    handleChange1 (value, key, column) {
      const newData = [...this.guigeDataSource]
      const target = newData.filter(item => key === item.key)[0];
      if (target) {
        target[column] = value
        this.guigeDataSource = newData
      }
    },
    handleBlur1(value, key, column) {
      const newData = [...this.guigeDataSource]
      const target = newData.filter(item => key === item.key)[0];
      if(column == 'salesRate' || column == 'manageRate') {
        if(/^[0-9]*$/.test(value)) {
          this.fenyongFun(target)
        } else {
          console.log('数据格式错误');
        }
      }
    },
    handleChange2 (value, key, column) {
      const newData = [...this.guigeDataSource]
      const target = newData.filter(item => key === item.key)[0];
      if (target) {
        target[column].price = value;
        this.guigeDataSource = newData
      }
    },
    handleBlur2(value, key, column) {
      const newData = [...this.guigeDataSource]
      const target = newData.filter(item => key === item.key)[0];
      if(column == 'salesRate' || column == 'manageRate') {
        if(/^[0-9]*$/.test(value)) {
          this.fenyongFun(target)
        } else {
          console.log('数据格式错误');
        }
      }
    },
    handleChange3 (value, key, column) {
      const newData = [...this.guigeDataSource]
      const target = newData.filter(item => key === item.key)[0];
      if (target) {
        target[column].juzi = value;
        this.guigeDataSource = newData
      }
    },
    handleBlur3(value, key, column) {
      const newData = [...this.guigeDataSource]
      const target = newData.filter(item => key === item.key)[0];
      if(column == 'salesRate' || column == 'manageRate') {
        if(/^[0-9]*$/.test(value)) {
          this.fenyongFun(target)
        } else {
          console.log('数据格式错误');
        }
      }
    },
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
    disabledDate2(current) {
      // Can not select days before today and today
      return current && current < moment().startOf("day");
    },
    addActivityList1(index, list) {
      if (list.length > 4) {
        this.$error({
          title: "温馨提示",
          content: "最多新增五组"
        });
      } else {
        num++;
        list.push({
          bargainAmount: 0, //砍价金额
          bargainCount: 0, //砍价次数
          bargainStage: num, //砍价规则顺序
          initiatorBargainCount: 1, //发起者砍价次数
          participantBargainCount: 1 //参与者砍价次数
        });
      }
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
    delActivityList1(e, list) {
      num--;
      list.splice(e, 1);
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
      let that = this;
      this.productId = this.productRadio.productId;

      let rules = [];
      if(this.activityType === "BARGAIN"){
        // rules = activityList2;
        this.guigeDataSource.forEach(function(item1, index1) {
          item1.kanjiap.forEach(function(item2, index2){
            rules.push({
              bargainAmount: that.accurate_mul(item2.bargainAmount, 100),
              bargainCount: item2.bargainCount,
              bargainStage: index2, //砍价规则顺序
              initiatorBargainCount: 1,
              participantBargainCount: 1,
              skuId: item1.skuId,
              manageRateStr: item1.manageRate,
              saleRateStr: item1.salesRate
            })
          })
        })
      }else if(this.activityType === "SPLICED"){
        this.guigeDataSource.forEach(function(item, index) {
          rules[index] = {
            enableMock: 0, //模拟成团
            splicedPeopleCount: 2, //拼团人数
            splicedPrice: parseFloat(item.pintuanp) * 100 + "",  //拼团金额
            skuId: item.skuId,
            manageRateStr: item.manageRate,
            saleRateStr: item.salesRate
          }
        })
      }else if(this.activityType === "SEC_KILL"){
        this.guigeDataSource.forEach(function(item, index) {
          if(parseFloat(item.miaoshap.juzi)) {
            rules[index] = {
              activityPrice: parseFloat(item.miaoshap.price) * 100 + "",
              activityPoint: parseFloat(item.miaoshap.juzi) + "",
              activityStock: item.stock2,
              skuId: item.skuId,
              manageRateStr: item.manageRate,
              saleRateStr: item.salesRate
            }
          } else {
            rules[index] = {
              activityPrice: parseFloat(item.miaoshap.price) * 100 + "",
              activityStock: item.stock2,
              skuId: item.skuId,
              manageRateStr: item.manageRate,
              saleRateStr: item.salesRate
            }
          }
        })
      }
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
      console.log(JSON.stringify(data));
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
      console.log(this.productRadio);
      let guigeDataSource = [];
      if(this.activityType === 'SPLICED') {
        this.productRadio.productSkus.forEach(function(item, index) {
          guigeDataSource[index] = {
            key: index,
            name: item.skuName,
            originp: item.originalPrice/100,
            currentp: item.price/100,
            point: item.point,
            costp: item.costPrice/100,
            pintuanp: '0',
            salesRate: '0',
            manageRate: '0',
            platform: '0',
            provider: '0',
            salesp: '0',
            managep: '0',
            skuId: item.skuId
          }
        })
      } else if(this.activityType === 'BARGAIN') {
        this.productRadio.productSkus.forEach(function(item, index) {
          guigeDataSource[index] = {
            key: index,
            name: item.skuName,
            originp: item.originalPrice/100,
            currentp: item.price/100,
            point: item.point,
            costp: item.costPrice/100,
            kanjiap: [
              {
                bargainAmount: "0", //砍价金额
                bargainCount: "0", //砍价次数
                bargainStage: num, //砍价规则顺序
                initiatorBargainCount: 1, //发起者砍价次数
                participantBargainCount: 1 //参与者砍价次数
              }
            ],
            salesRate: '0',
            manageRate: '0',
            salesp: '0',
            managep: '0',
            skuId: item.skuId
          }
        })
      } else if(this.activityType === 'SEC_KILL') {
        this.productRadio.productSkus.forEach(function(item, index) {
          guigeDataSource[index] = {
            key: index,
            name: item.skuName,
            originp: item.originalPrice/100,
            currentp: item.price/100,
            point: item.point,
            costp: item.costPrice/100,
            miaoshap: {
              price: '0',
              juzi: '0'
            },
            salesRate: '0',
            manageRate: '0',
            stock1: item.stock,
            stock2: '0',
            salesp: '',
            managep: '',
            skuId: item.skuId
          }
        })
      };
      this.guigeDataSource = guigeDataSource;
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
          let guigeDataSource = [];
          if (this.activityType === "BARGAIN") {
            res.data.rules.forEach(function(item, index) {
              guigeDataSource[index] = {
                key: index,
                name: item.skuName,
                originp: item.originalPrice/100,
                currentp: item.price/100,
                costp: item.costPrice/100,
                point: item.pointPrice,
                kanjiap: [],
                salesRate: item.rules[0].saleRateStr,
                manageRate: item.rules[0].manageRateStr,
                salesp: item.rules[0].salePrice ? item.rules[0].salePrice/100 : 0,
                managep: item.rules[0].managePrice ? item.rules[0].managePrice/100 : 0,
                skuId: item.skuId
              }
              item.rules.forEach(function(item2, index2){
                guigeDataSource[index].kanjiap[index2] = {
                  bargainAmount: item2.bargainAmount/100, //砍价金额
                  bargainCount: item2.bargainCount, //砍价次数
                  bargainStage: item2.bargainStage, //砍价规则顺序
                  initiatorBargainCount: 1, //发起者砍价次数
                  participantBargainCount: 1 //参与者砍价次数
                }
              })
            })
          }else if(this.activityType === 'SPLICED'){
            res.data.rules.forEach(function(item, index) {
              guigeDataSource[index] = {
                key: index,
                name: item.skuName,
                originp: item.originalPrice/100,
                currentp: item.price/100,
                point: item.pointPrice,
                costp: item.costPrice/100,
                pintuanp: item.rules[0].splicedPrice/100,
                salesRate: item.rules[0].saleRateStr,
                manageRate: item.rules[0].manageRateStr,
                platform: '0',
                provider: '0',
                salesp: item.rules[0].salePrice ? item.rules[0].salePrice/100 : 0,
                managep: item.rules[0].managePrice ? item.rules[0].managePrice/100 : 0,
                skuId: item.skuId
              }
            })
          }else if(this.activityType === 'SEC_KILL'){
            res.data.rules.forEach(function(item, index) {
              guigeDataSource[index] = {
                key: index,
                name: item.skuName,
                originp: item.originalPrice/100,
                currentp: item.price/100,
                point: item.pointPrice,
                costp: item.costPrice/100,
                miaoshap: {
                  price: item.rules[0].activityPrice/100,
                  juzi: item.rules[0].activityPoint ? item.rules[0].activityPoint : 0
                },
                stock1: item.rules[0].balanceStock,
                stock2: item.rules[0].activityStock,
                salesRate: item.rules[0].saleRateStr,
                manageRate: item.rules[0].manageRateStr,
                salesp: item.rules[0].salePrice ? item.rules[0].salePrice/100 : 0,
                managep: item.rules[0].managePrice ? item.rules[0].managePrice/100 : 0,
                skuId: item.skuId,
              }
            });
          }
          // console.log(guigeDataSource);
          this.guigeDataSource = guigeDataSource;

          this.dateValue = [
            this.moment(res.data.startTime, "YYYY-MM-DD"),
            this.moment(res.data.endTime, "YYYY-MM-DD")
          ];
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
    },
    fenyongFun(item) {
      let data = {
        productId: this.productRadio.productId,
        manageRateStr: item.manageRate,
        salesRateStr: item.salesRate,
        skuId: item.skuId
      };
      let that = this;
      this.$axios({
        url: "/endpoint/distributor/product/calculateEstimateSettlement.json",
        method: "get",
        processData: false,
        params: data
      }).then(res => {
        if (res.success) {
          res.data.forEach(function(i) {
            if (i.settlementType === "MERCHANT") i.boolean = true;
            that.guigeDataSource.forEach(function(item2, index) {
              if(item.skuId == item2.skuId) {
                if (i.settlementType === "DISTRIBUTOR_SALES_REBATE"){
                  i.name = "销售返利";
                  i.boolean = true;
                  item2.salesp = i.estimateAmount/100;
                }
                if (i.settlementType === "DISTRIBUTOR_MANAGER_REBATE"){
                  i.name = "管理佣金";
                  i.boolean = true;
                  item2.managep = i.estimateAmount/100;
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
  }
};
</script>

<style lang="less" scoped>
.radioBox {
  height: 300px;
  overflow-y: auto;
}
.disflex {
  display: flex;
}
.nowrap {
  white-space: nowrap;
}
.w40 {
  width: 40px;
  margin-left: 10px;
}
.mt15 {
  margin-top: 15px;
}
a-input {
  width: 70px;
}
</style>

