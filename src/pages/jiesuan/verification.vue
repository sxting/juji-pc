<template>
  <a-card>
    <div>
      <a-form layout="horizontal">
        <div>
          <a-form layout="horizontal" :autoFormCreate="(form) => this.form = form">
            <div>
              <a-row>
                <a-col :md="8" :sm="24">
                  <a-form-item label="选择日期" :labelCol="{span: 5}" fieldDecoratorId="repository.date" :wrapperCol="{span: 18, offset: 1}">
                    <a-range-picker @change="dateOnChange" :defaultValue="[moment(today[0], 'YYYY-MM-DD'), moment(today[1], 'YYYY-MM-DD')]"/>
                  </a-form-item>
                </a-col>
                <a-col :md="8" :sm="24">
                  <a-form-item label="运营商" :labelCol="{span: 5}" fieldDecoratorId="repository.providerId" :wrapperCol="{span: 18, offset: 1}">
                    <a-select placeholder="请选择" @change="providerListFun">
                      <a-select-option v-for="(item) in providerList" :key="item.providerId">{{item.providerName}}</a-select-option>
                    </a-select>
                  </a-form-item>
                </a-col>
                <a-col :md="8" :sm="24">
                  <a-form-item label="所属商家" :labelCol="{span: 5}" fieldDecoratorId="repository.merchantId" :wrapperCol="{span: 18, offset: 1}">
                    <a-select placeholder="请选择" @change="merchantIdFun">
                      <a-select-option value="">全部商家</a-select-option>
                      <a-select-option v-for="(item) in merchantList" :key="item.id">{{item.name}}</a-select-option>
                    </a-select>
                  </a-form-item>
                </a-col>
                <a-col :md="8" :sm="24">
                  <a-form-item label="核销门店" :labelCol="{span: 5}" fieldDecoratorId="repository.storeId" :wrapperCol="{span: 18, offset: 1}">
                    <a-select placeholder="请选择">
                      <a-select-option value="">全部门店</a-select-option>
                      <a-select-option v-for="(item) in cityStoreList" :key="item.id">{{item.name}}</a-select-option>
                    </a-select>
                  </a-form-item>
                </a-col>

                <a-col :md="8" :sm="24">
                  <a-form-item label="商品名称" :labelCol="{span: 5}" fieldDecoratorId="repository.productName" :wrapperCol="{span: 18, offset: 1}">
                    <a-input style="width: 100%" placeholder="请输入" />
                  </a-form-item>
                </a-col>
                <a-col :md="8" :sm="24">
                  <a-form-item label="核销码" :labelCol="{span: 5}" fieldDecoratorId="repository.code" :wrapperCol="{span: 18, offset: 1}">
                    <a-input style="width: 100%" placeholder="请输入" />
                  </a-form-item>
                </a-col>
                <span style="float: right; margin-top: 3px;">
                  <a-button @click="submit2">导出Excel</a-button>
                  <a-button  type="primary" @click="submit">查询</a-button>
                </span>
              </a-row>
            </div>

          </a-form>
        </div>
      </a-form>
    </div>
    <div style="margin-top: 20px;">

      <a-table :columns="columns" :dataSource="data2" :pagination="false" :locale="{emptyText: '暂无数据'}">
        <span slot="action" slot-scope="text, record">
          <a @click="orderListfun(record)">查看详情</a>
        </span>
      </a-table>
      <div style="margin-top:20px;">
        <a-pagination style="float:right" @change="paginationFun" :current="pageNo" :pageSize="10" :total="countTotal" />
      </div>
    </div>

    <a-modal title="详情" :visible="visible" @ok="handleCancel" @cancel="handleCancel" width="1000px">
      <div class="orderpage_detail_list">
        <table>
          <tr class="ui-grid-row">
            <td class="">订单号</td>
            <td class="" style="width:350px;">{{orderInfoOrder.orderId}}</td>
          </tr>
          <tr>
            <td class="">下单时间</td>
            <td class="" style="width:220px;">{{orderInfoOrder.dateCreated}}</td>
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
              <td>商品规格</td>
              <td>核销状态</td>
              <td>核销时间</td>
              <td>核销门店</td>
              <td>核销码</td>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item,index) in vouchersList" :key="index">
              <td>{{item.productName}}</td>
              <td>{{item.skuName}}</td>
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
    title: "核销时间",

    dataIndex: "useTime"
  },
  {
    title: "核销门店",
    dataIndex: "useStoreName"
  },
  {
    title: "商品名称",
    dataIndex: "productName"
  },
  {
    title: "核销数量",
    dataIndex: "useNum"
  },
  {
    title: "核销金额",
    dataIndex: "useAmount"
  },

  {
    title: "核销码",
    dataIndex: "voucherCodes"
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
  name: "Verification",
  components: { StandardTable },
  data() {
    return {
      columns: columns,
      dataSource: dataSource,
      selectedRowKeys: [],
      selectedRows: [],
      data2: [],
      merchantList: [],
      merchantId: "",
      visible: false,
      status: "ALL",
      orderInfoOrder: {
        orderId: "",
        orderType: "",
        dateCreated: "",
        amount: "",
        couponAmount: "",
        paidAmount: "",
        paidPoint: ""
      },
      productName: "",
      vouchersList: [],
      cityStoreList: [],
      orderUser: { nickName: "", phone: "" },
      storeId: "",
      code: "",
      pageNo: 1,
      countTotal: 10,
      today:this.timeForMat(0)
    };
  },
  created() {
    this.providerList = JSON.parse(
      sessionStorage.getItem("LoginDate")
    ).providerList;
     this.dateStart = this.today[0];
    this.dateEnd = this.today[1];
    this.providerId = this.providerList[0].providerId;

    this.voucherRecordsListFun();
  },
  methods: {
    providerListFun(e) {
      this.providerId = e;
      this.merchantListFun(e);
    },
    paginationFun(e) {
      this.pageNo = e;
      this.voucherRecordsListFun();
    },
    merchantIdFun(e) {
      this.merchantId = e;
      if (this.merchantId) this.storeListFun();
      else {
        this.cityStoreList = [];
        this.$nextTick(() => {
            this.form.setFieldsValue({
              repository: {
                storeId:""
              }
            });
          });
      }
    },
    submit() {
      let that = this;
      this.form.validateFields((err, values) => {
        that.providerId = values.repository.providerId;
        that.merchantId = values.repository.merchantId;
        that.storeId = values.repository.storeId;
        that.productName = values.repository.productName;
        that.code = values.repository.code;
        that.productName = values.repository.productName;
      });
      this.voucherRecordsListFun();
    },
    submit2() {
      let that = this;
      this.form.validateFields((err, values) => {
        that.providerId = values.repository.providerId;
        that.merchantId = values.repository.merchantId;
        that.storeId = values.repository.storeId;
        that.productName = values.repository.productName;
        that.code = values.repository.code;
      });

      let data = {
        providerId: this.providerId,
        merchantId: this.merchantId,
        dateStart: this.dateStart,
        dateEnd: this.dateEnd,
        pageNo: this.pageNo,
        pageSize: 10,
        storeId: this.storeId,
        productId: "",
        code: this.code,
        productName: this.productName
      };
      let param = "";
      let apiUrl = axios.defaults.baseURL + "/endpoint/settle/voucherRecords.download";
      if (data.pageNo) param += "&pageNo=" + this.pageNo;
      if (data.providerId) param += "&providerId=" + this.providerId;
      if (data.merchantId) param += "&merchantId=" + this.merchantId;
      if (data.dateStart) param += "&dateStart=" + this.dateStart;
      if (data.dateEnd) param += "&dateEnd=" + this.dateEnd;

      if (data.storeId) param += "&storeId=" + this.storeId;
      if (data.productId) param += "&productId=" + this.productId;
      if (data.code) param += "&code=" + this.code;
      if (data.productName) param += "&productName=" + this.productName;

      window.location.href = apiUrl + "?pageSize=10" + param;
    },
    merchantListFun(providerId) {
      let data = {
        providerId: providerId
      };
      let that = this;
      this.$axios({
        url: "/endpoint/juji/provider/merchant/list.json",
        method: "get",
        processData: false,
        params: data
      }).then(res => {
        if (res.success) {
          this.merchantList = res.data;
          this.merchantId = this.merchantList[0] ? this.merchantList[0].id : "";
          this.$nextTick(() => {
            this.form.setFieldsValue({
              repository: {
                merchantId: that.merchantList[0] ? that.merchantList[0].id : ""
              }
            });
          });
          if (this.merchantId) this.storeListFun();
        } else {
          this.$error({
            title: "温馨提示",
            content: res.errorInfo
          });
        }
      });
    },
    dateOnChange(dates, dateStrings) {
      this.dateStart = dateStrings[0];
      this.dateEnd = dateStrings[1];
    },
    storeListFun() {
      let data = {
        merchantId: this.merchantId
      };
      let that = this;
      this.$axios({
        url: "/endpoint/juji/merchant/store/list.json",
        method: "get",
        processData: false,
        params: data
      }).then(res => {
        if (res.success) {
          this.cityStoreList = res.data;
          this.storeId = this.cityStoreList[0] ? this.cityStoreList[0].id : "";
          this.$nextTick(() => {
            this.form.setFieldsValue({
              repository: {
                storeId: that.cityStoreList[0] ? that.cityStoreList[0].id : ""
              }
            });
          });
        } else {
          this.$error({
            title: "温馨提示",
            content: res.errorInfo
          });
        }
      });
    },
    handleCancel() {
      this.visible = false;
    },
    toggleAdvanced() {
      this.advanced = !this.advanced;
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
    voucherRecordsListFun() {
      let data = {
        providerId: this.providerId,
        merchantId: this.merchantId,
        dateStart: this.dateStart,
        dateEnd: this.dateEnd,
        pageNo: this.pageNo,
        pageSize: 10,
        storeId: this.storeId,
        productId: "",
        code: this.code,
        productName: this.productName
      };
      let that = this;
      this.$axios({
        url: "/endpoint/voucherRecords.json",
        method: "get",
        processData: false,
        params: data
      }).then(res => {
        if (res.success) {
          this.data2 = res.data.list;
          this.countTotal = res.data.countTotal;
          this.data2.forEach(function(i) {
            i.useAmount = that.accurate_div(i.useAmount * 1, 100);
          });
        } else {
          this.$error({
            title: "温馨提示",
            content: res.errorInfo
          });
        }
      });
    },
    orderListfun(e) {
      console.log(e);
      this.orderFun(e.orderId);
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
