<template>
  <a-card>
    <div v-if="!changeBoo">
      <div>
        <a-form layout="horizontal">
          <div>
            <a-row>
              <a-col :md="8" :sm="24">
                <a-form-item label="选择日期" :labelCol="{span: 5}" :wrapperCol="{span: 18, offset: 1}">
                  <a-range-picker @change="onChange" :defaultValue="[moment(today[0], 'YYYY-MM-DD'), moment(today[1], 'YYYY-MM-DD')]" />
                </a-form-item>
              </a-col>
              <a-col :md="8" :sm="24">
                <a-form-item label="全部运营商" :labelCol="{span: 5}" :wrapperCol="{span: 18, offset: 1}">
                  <a-select placeholder="请选择" :defaultValue="providerId" @change="providerListFun">
                    <a-select-option v-for="(item) in providerList" :key="item.providerId">{{item.providerName}}</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>

              <a-col :md="8" :sm="24" v-if="merchantId">
                <a-form-item label="所属商家" :labelCol="{span: 5}" :wrapperCol="{span: 18, offset: 1}">
                  <a-select placeholder="全部商家" :defaultValue="ALL" @change="merchantChange">
                    <a-select-option :key="'ALL'" >全部商家</a-select-option>
                    <a-select-option v-for="(item) in merchantList" :key="item.id">{{item.name}}</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>

            </a-row>
            <div>
              <a-button @click="excelFun" type="primary">导出报表</a-button>
            </div>
          </div>
        </a-form>
      </div>
      <a-row style="margin: 0 -12px">
        <a-col :sm="24" :md="12" :xl="6" style="padding: 12px 12px 24px;">
          <a-card title="商家结算" style="margin-top:20px">
            {{numSet.merchantAmount/100 || 0}}
          </a-card>
        </a-col>
        <a-col :sm="24" :md="12" :xl="6" style="padding: 12px 12px 24px;">
          <a-card title="运营商分佣" style="margin-top:20px">
            {{numSet.providerAmount/100 || 0}}
          </a-card>
        </a-col>
        <a-col :sm="24" :md="12" :xl="6" style="padding: 12px 12px 24px;">
          <a-card title="购物返利" style="margin-top:20px">
            {{numSet.salerAmount/100 || 0}}
          </a-card>
        </a-col>
        <a-col :sm="24" :md="12" :xl="6" style="padding: 12px 12px 24px;">
          <a-card title="管理佣金" style="margin-top:20px">
            {{numSet.managerAmount/100 || 0}}
          </a-card>
        </a-col>
      </a-row>
      <div>
        <a-table :columns="columns" :dataSource="data2" :pagination="false" :locale="{emptyText: '暂无数据'}">
          <span slot="action" slot-scope="text, record">
            <a @click="xiangqingList(record)">查看详情</a>
          </span>
        </a-table>
        <div style="margin-top:20px;">
          <a-pagination style="float:right" @change="paginationChange" :current="pageNo" :pageSize="10" :total="countTotal" />
        </div>
      </div>
    </div>
    <div v-if="changeBoo">
      <div :class="advanced ? 'search' : null">
        <a-form layout="horizontal">
          <div :class="advanced ? null: 'fold'">
            <a-row>
              <a-col :md="8" :sm="24">
                <a-form-item label="选择日期" :labelCol="{span: 5}" :wrapperCol="{span: 18, offset: 1}">
                  <a-range-picker @change="onChange" />
                </a-form-item>
              </a-col>

              <a-col :md="8" :sm="24">
                <a-form-item label="核销码" :labelCol="{span: 5}" :wrapperCol="{span: 18, offset: 1}">
                  <a-input v-model="voucherCode" />
                </a-form-item>
              </a-col>
              <a-col :md="8" :sm="24">
                <a-form-item label="核销门店" :labelCol="{span: 5}" :wrapperCol="{span: 18, offset: 1}">
                  <a-select placeholder="请选择" @change="storeChange">
                    <a-select-option :key="'ALL'">全部门店</a-select-option>
                    <a-select-option v-for="(item) in cityStoreList" :key="item.id">{{item.name}}</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
            </a-row>
            <span style="float: right; margin-top: 3px;">
              <a-button type="primary" @click="back">返回</a-button>

              <a-button type="primary" @click="xiangqingFun">查询</a-button>
            </span>
          </div>
        </a-form>
      </div>
      <div>
        <a-table :columns="columns2" :dataSource="data3" :pagination="false" :locale="{emptyText: '暂无数据'}">
          <span slot="action" slot-scope="text, record">
            <a @click="orderList(record)">查看详情</a>
          </span>
        </a-table>
        <div style="margin-top:20px;">
          <a-pagination style="float:right" @change="paginationChange" :current="pageNo" :pageSize="10" :total="countTotal" />
        </div>
      </div>
    </div>
    <a-modal title="详情" :visible="visible" @ok="handleCancel" @cancel="handleCancel" width="1000px" :footer="null">
      <div class="orderpage_detail_list">
        <table>
          <tr class="ui-grid-row">
            <td class="">订单号</td>
            <td class="" style="width:350px;">{{orderInfoOrder.orderId}}</td>
            <!-- <td class="">退款单号</td>
            <td class="trans-status" style="width:350px;"></td> -->
          </tr>
          <tr>
            <td class="">下单时间</td>
            <td class="" style="width:220px;">{{orderInfoOrder.dateCreated}}</td>
            <!-- <td class="">退款时间</td>
            <td class="" style="width:220px;"></td> -->
          </tr>
          <tr>
            <td class="">订单状态</td>
            <td class="" style="width:220px;">{{orderInfoOrder.statusName}}</td>
          </tr>
        </table>
      </div>

      <h3 class="flex-1 text-lg borderLeft" style="margin-top:20px;">订单信息</h3>
      <div>
        <table nz-table class="existingGroups-table">
          <thead>
            <tr>
              <td>商品名称</td>
              <td>核销状态</td>
              <td>核销时间</td>
              <td>核销门店</td>
              <td>核销码</td>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item,index) in vouchersList" :key="index">
              <td>{{item.productName}}</td>
              <td>{{item.voucherStatusName}}</td>
              <td>{{item.useTime}}</td>
              <td>{{item.useStoreName}}</td>
              <td>{{item.voucherCode}}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="orderpage_detail_list">
        <table>
          <tr class="ui-grid-row">
            <td class="">订单金额</td>
            <td class="" style="width:350px;">{{orderInfoOrder.amount/100}}</td>
            <td class="">优惠金额</td>
            <td class="trans-status" style="width:350px;">{{orderInfoOrder.couponAmount/100}}</td>
          </tr>
          <tr class="ui-grid-row">
            <td class="">实付金额</td>
            <td class="" style="width:350px;">{{orderInfoOrder.paidAmount/100}}</td>
            <td class="">消耗桔子积分</td>
            <td class="trans-status" style="width:350px;">{{orderInfoOrder.paidPoint}}</td>
          </tr>
        </table>
      </div>
      <h3 class="flex-1 text-lg borderLeft">顾客信息</h3>
      <div class="orderpage_detail_list">
        <table>
          <tr class="ui-grid-row">
            <td class="">微信昵称</td>
            <td class="" style="width:350px;">{{orderUser.nickName}}</td>
            <td class="">手机号</td>
            <td class="trans-status" style="width:350px;">{{orderUser.phone}}</td>
          </tr>
        </table>
      </div>
      <!-- <h3 class="flex-1 text-lg borderLeft">分销信息</h3> -->
      <!-- <div class="orderpage_detail_list">
        <table>
          <tr class="ui-grid-row">
            <td class="">分销桔长</td>
            <td class="" style="width:350px;">1</td>
            <td class="">上级分销桔长</td>
            <td class="trans-status" style="width:350px;">1</td>
          </tr>
        </table>
      </div> -->
    </a-modal>
  </a-card>
</template>

<script>
import StandardTable from "../../components/table/StandardTable";
import axios from "axios";

const columns = [
  {
    title: "商品类型",

    dataIndex: "typeName"
  },
  {
    title: "商品名称",
    dataIndex: "productName"
  },
  {
    title: "商家名称",
    dataIndex: "merchantName"
  },
  {
    title: "核销金额",
    dataIndex: "orderPaidAmount"
  },
  {
    title: "商家分账",
    dataIndex: "merchantAmount"
  },
  {
    title: "运营商分账",
    dataIndex: "providerAmount"
  },
  {
    title: "购物返利",
    dataIndex: "salerAmount"
  },
  {
    title: "管理佣金",
    dataIndex: "managerAmount"
  },
  {
    title: "操作",
    key: "action",
    scopedSlots: { customRender: "action" }
  }
];
const columns2 = [
  {
    title: "结算时间",

    dataIndex: "useTime"
  },
  {
    title: "结算门店",
    dataIndex: "storeName"
  },
  {
    title: "商品名称",
    dataIndex: "productName"
  },
  {
    title: "数量",
    dataIndex: "totalNum"
  },
  {
    title: "结算金额",
    dataIndex: "merchantAmount"
  },
  {
    title: "操作",
    key: "action",
    scopedSlots: { customRender: "action" }
  }
];
const dataSource = [];

for (let i = 0; i < 100; i++) {
  dataSource.push({
    key: i,
    no: "NO " + i,
    description: "这是一段描述",
    callNo: Math.floor(Math.random() * 1000),
    status: Math.floor(Math.random() * 10) % 4,
    updatedAt: "2018-07-26"
  });
}
export default {
  name: "BaobiaoList",
  components: { StandardTable },
  data() {
    return {
      advanced: true,
      columns: columns,
      columns2: columns2,
      dataSource: dataSource,
      selectedRowKeys: [],
      selectedRows: [],
      data2: [],
      data3: [],
      dateStart: "",
      dateEnd: "",
      pageNo: 1,
      providerId: "",
      merchantList: [],
      merchantId: "ALL",
      detailMerchantId: "",
      countTotal: 1,
      voucherCode: "",
      changeBoo: false,
      storeId: "ALL",
      visible: false,
      cityStoreList: [],
      orderInfoOrder: {
        orderId: "",
        orderType: "",
        dateCreated: "",
        amount: "",
        couponAmount: "",
        paidAmount: "",
        paidPoint: ""
      },
      vouchersList: [],
      orderUser: { nickName: "", phone: "" },
      providerList: [],
      yestoday: this.timeForMat(1),
      today: this.timeForMat(0),
      numSet: {}
    };
  },
  created() {
    this.providerList = JSON.parse(
      sessionStorage.getItem("LoginDate")
    ).providerList;
    this.providerId = this.providerList[0].providerId;
    this.dateStart = this.yestoday[0];
    this.dateEnd = this.yestoday[1];

    this.merchantListFun(this.providerId);
  },
  methods: {
    excelFun() {
      let data = {
        pageNo: this.pageNo,
        pageSize: 10,
        providerId: this.providerId,
        merchantId: this.merchantId,
        dateStart: this.dateStart,
        dateEnd: this.dateEnd
      };
      let param = "";
      let apiUrl =
        axios.defaults.baseURL + "/endpoint/settle/reportListExcel.download";
      if (data.pageNo) param += "&pageNo=" + this.pageNo;
      if (data.providerId) param += "&providerId=" + this.providerId;
      if (data.merchantId) param += "&merchantId=" + this.merchantId;
      if (data.dateStart) param += "&dateStart=" + this.dateStart;
      if (data.dateEnd) param += "&dateEnd=" + this.dateEnd;

      window.location.href = apiUrl + "?pageSize=10" + param;
    },
    providerListFun(e) {
      this.providerId = e;
      this.merchantListFun(e);
    },
    toggleAdvanced() {
      this.advanced = !this.advanced;
    },
    paginationChange(e) {
      this.pageNo = e;
      this.productList();
    },
    handleCancel() {
      this.visible = false;
    },
    back() {
      this.changeBoo = false;
    },
    onChange(dates, dateStrings) {
      this.dateStart = dateStrings[0];
      this.dateEnd = dateStrings[1];
      this.productList();
    },
    merchantChange(e) {
      this.merchantId = e;
      this.productList();
    },
    remove() {
      this.dataSource = this.dataSource.filter(
        item => this.selectedRowKeys.indexOf(item.key) < 0
      );
      this.selectedRows = this.selectedRows.filter(
        item => this.selectedRowKeys.indexOf(item.key) < 0
      );
    },
    addNew() {
      this.$router.push("/product/addProduct");
    },
    handleMenuClick(e) {
      if (e.key === "delete") {
        this.remove();
      }
    },

    formatDateTime(date, type) {
      let year = date.getFullYear();
      let month = date.getMonth() + 1;
      let day = date.getDate();
      return (
        year +
        "-" +
        (month.toString().length > 1 ? month : "0" + month) +
        "-" +
        (day.toString().length > 1 ? day : "0" + day) +
        (type === "start" ? " 00:00:00" : " 23:59:59")
      );
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
          this.merchantId = "ALL";
          this.productList();
        } else {
          this.$error({
            title: "温馨提示",
            content: res.errorInfo
          });
        }
      });
    },
    productList() {
      let data = {
        pageNo: this.pageNo,
        pageSize: 10,
        providerId: this.providerId,
        merchantId: this.merchantId,
        dateStart: this.dateStart,
        dateEnd: this.dateEnd
      };
      let that = this;
      if (!data.dateStart) delete data.dateStart;
      if (!data.dateEnd) delete data.dateEnd;
      this.$axios({
        url: "/endpoint/settle/reportList.json",
        method: "get",
        processData: false,
        params: data
      }).then(res => {
        if (res.success) {
          this.data2 = res.data.list;
          this.numSet = res.data;
          this.data2.forEach(function(i) {
            i.typeName = i.type === "POINT" ? "积分商品" : "普通商品";
            i.orderPaidAmount = that.accurate_div(i.orderPaidAmount * 1, 100);
            i.merchantAmount = that.accurate_div(i.merchantAmount * 1, 100);
            i.providerAmount = that.accurate_div(i.providerAmount * 1, 100);
            i.salerAmount = that.accurate_div(i.salerAmount * 1, 100);
            i.managerAmount = that.accurate_div(i.managerAmount * 1, 100);
          });
          this.countTotal = res.data.countTotal;
        } else {
          this.$error({
            title: "温馨提示",
            content: res.errorInfo
          });
        }
      });
    },
    //描述:某个商品结算列表
    xiangqingList(e) {
      this.providerId = e.providerId;
      this.productId = e.productId;
      this.detailMerchantId = e.merchantId;
      this.xiangqingFun();
    },
    xiangqingFun() {
      let data = {
        pageNo: this.pageNo,
        pageSize: 10,
        providerId: this.providerId,
        merchantId: this.detailMerchantId,
        productId: this.productId,
        dateStart: this.dateStart,
        dateEnd: this.dateEnd,
        voucherCode: this.voucherCode,
        storeId: this.storeId
      };
      if (!data.dateStart) delete data.dateStart;
      if (!data.dateEnd) delete data.dateEnd;
      if (!data.productId) delete data.productId;
      let that = this;
      this.$axios({
        url: "/endpoint/settle/reportDetailList.json",
        method: "get",
        processData: false,
        params: data
      }).then(res => {
        if (res.success) {
          this.changeBoo = true;
          this.data3 = res.data.list;
          this.data3.forEach(function(i) {
            i.merchantAmount = that.accurate_div(i.merchantAmount, 100);
          });
          this.storeIdList(this.detailMerchantId);
        } else {
          this.$error({
            title: "温馨提示",
            content: res.errorInfo
          });
        }
      });
    },
    orderList(e) {
      this.orderFun(e.orderId);
    },
    storeChange(e) {
      this.storeId = e;
      this.xiangqingFun();
    },
    storeIdList(event) {
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
        } else {
          this.$error({
            title: "温馨提示",
            content: res.errorInfo
          });
        }
      });
    },
    orderFun(orderId) {
      let data = {
        orderId: orderId
      };
      this.$axios({
        url: "/endpoint/order/info.json",
        method: "get",
        processData: false,
        params: data
      }).then(res => {
        if (res.success) {
          this.orderInfoOrder = res.data.order;
          if (this.orderInfoOrder.orderType === "CREATED")
            this.orderInfoOrder.orderTypeName = "待付款";
          if (this.orderInfoOrder.orderType === "PAID")
            this.orderInfoOrder.orderTypeName = "待使用";
          if (this.orderInfoOrder.orderType === "CONSUME")
            this.orderInfoOrder.orderTypeName = "待评价";
          if (this.orderInfoOrder.orderType === "FINISH")
            this.orderInfoOrder.orderTypeName = "已完成";
          if (this.orderInfoOrder.orderType === "CLOSE")
            this.orderInfoOrder.orderTypeName = "已关闭";
          if (this.orderInfoOrder.orderType === "REFUND")
            this.orderInfoOrder.orderTypeName = "已退款";
          this.vouchersList = res.data.order.vouchers;
          this.vouchersList.forEach(function(i) {
            if (i.voucherStatus === "INIT") i.voucherStatusName = "初始状态";
            if (i.voucherStatus === "USED") i.voucherStatusName = "已使用";
            if (i.voucherStatus === "REFUND") i.voucherStatusName = "已退款";
            if (i.voucherStatus === "OVERDUE") i.voucherStatusName = "已过期";
          });
          this.orderUser = res.data.user;
          console.log(res);
          this.visible = true;
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

.orderpage_detail_list table {
  border-spacing: 0;
  border: solid #d9d9d9;
  border-width: 1px 0px 0px 1px;
  padding: 0;
}

.orderpage_detail_list tr td {
  line-height: 38px;
  height: 38px;
  border: solid #d9d9d9;
  border-width: 0px 1px 1px 0px;
  text-align: center;
  padding: 0;
}

.orderpage_detail_list tr td:nth-child(2n-1) {
  color: #999999;
  background-color: #f4f4f4;
  width: 150px;
}
.existingGroups-table {
  width: 100%;
  text-align: center;
}
.existingGroups-table tr {
  height: 40px;
  line-height: 40px;
}
.existingGroups-table thead tr {
  background: #f2f2f2;
}
</style>
