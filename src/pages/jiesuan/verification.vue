<template>
  <a-card>
    <div>
      <a-form layout="horizontal">
        <div>
          <a-form layout="horizontal" :autoFormCreate="(form) => this.form = form">
            <div :class="advanced ? null: 'fold'">
              <a-row>
                <a-col :md="8" :sm="24">
                <a-form-item label="选择日期" :labelCol="{span: 5}" :wrapperCol="{span: 18, offset: 1}">
                  <a-range-picker @change="onChange" />
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
                    <a-select placeholder="请选择">
                      <a-select-option value="">全部商家</a-select-option>
                      <a-select-option v-for="(item) in merchantList" :key="item.id">{{item.name}}</a-select-option>
                    </a-select>
                  </a-form-item>
                </a-col>
                <a-col :md="8" :sm="24">
                  <a-form-item label="核销门店" :labelCol="{span: 5}" fieldDecoratorId="repository.merchantId" :wrapperCol="{span: 18, offset: 1}">
                    <a-select placeholder="请选择">
                      <a-select-option value="">全部门店</a-select-option>
                      <a-select-option v-for="(item) in merchantList" :key="item.id">{{item.name}}</a-select-option>
                    </a-select>
                  </a-form-item>
                </a-col>
   
                <a-col :md="8" :sm="24">
                  <a-form-item label="商品名称" :labelCol="{span: 5}" fieldDecoratorId="repository.productName" :wrapperCol="{span: 18, offset: 1}">
                    <a-input style="width: 100%" placeholder="请输入" />
                  </a-form-item>
                </a-col>
                <a-col :md="8" :sm="24">
                  <a-form-item label="核销码" :labelCol="{span: 5}" fieldDecoratorId="repository.productName" :wrapperCol="{span: 18, offset: 1}">
                    <a-input style="width: 100%" placeholder="请输入" />
                  </a-form-item>
                </a-col>
              </a-row>
            </div>
            <span style="float: right; margin-top: 3px;">
              <a-button htmlType="submit" @click="submit">查询</a-button>
            </span>
          </a-form>
        </div>
        <!-- <span style="float: right; margin-top: 3px;">
          <a-button type="primary">查询</a-button>
          <a-button style="margin-left: 8px">重置</a-button>
          <a @click="toggleAdvanced" style="margin-left: 8px">
            {{advanced ? '收起' : '展开'}}
            <a-icon :type="advanced ? 'up' : 'down'" />
          </a>
        </span> -->
      </a-form>
    </div>
    <div>

      <a-table :columns="columns" :dataSource="data2">
        <span slot="action" slot-scope="text, record">
          <a @click="orderListfun(record)">查看详情</a>
        </span>
      </a-table>
    </div>

    <a-modal title="详情" :visible="visible" @ok="handleCancel" @cancel="handleCancel" width="1000px">
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
            <td class="" style="width:220px;">{{orderInfoOrder.orderTypeName}}</td>
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
const columns = [
  {
    title: "核销时间",

    dataIndex: "orderId"
  },
  {
    title: "核销门店",
    dataIndex: "dateCreated"
  },
  {
    title: "商品名称",
    dataIndex: "orderTypeName"
  },
  {
    title: "核销数量",
    dataIndex: "body"
  },
  {
    title: "核销金额",
    dataIndex: "merchantName"
  },

  {
    title: "核销码",
    dataIndex: "amount"
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
      vouchersList: [],
      orderUser: { nickName: "", phone: "" }
    };
  },
  created() {
    this.providerList = JSON.parse(
      sessionStorage.getItem("LoginDate")
    ).providerList;
    this.providerId = this.providerList[0].providerId;
    // this.merchantListFun(this.providerId);
  },
  methods: {
    handleCancel() {
      this.visible = false;
    },
    toggleAdvanced() {
      this.advanced = !this.advanced;
    },
    statusChange(e) {
      this.status = e;
      this.orderList();
    },
    onChange(dates, dateStrings) {
      this.dateStart = dateStrings[0];
      this.dateEnd = dateStrings[1];
      this.orderList();
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
    merchantChange(e) {
      this.merchantId = e;
      this.orderList();
    },
    orderList() {
      let data = {
        pageNo: this.pageNo,
        pageSize: 10,
        providerId: this.providerId,
        merchantId: this.merchantId,
        dateStart: this.dateStart,
        dateEnd: this.dateEnd,
        status: this.status,
        productName: ""
      };
      if (!data.dateStart) delete data.dateStart;
      if (!data.dateEnd) delete data.dateEnd;
      if (!data.productName) delete data.productName;

      let that = this;
      this.$axios({
        url: "/endpoint/order/page.json",
        method: "get",
        processData: false,
        params: data
      }).then(res => {
        if (res.success) {
          this.data2 = res.data.list;
          this.data2.forEach(function(i) {
            // i.typeName = i.type === "POINT" ? "积分商品" : "普通商品";
            if (i.status === "CREATED") i.orderTypeName = "待付款";
            if (i.status === "PAID") i.orderTypeName = "待使用";
            if (i.status === "CONSUME") i.orderTypeName = "待评价";
            if (i.status === "FINISH") i.orderTypeName = "已完成";
            if (i.status === "CLOSE") i.orderTypeName = "已关闭";
            if (i.status === "REFUND") i.orderTypeName = "已退款";
            i.paidAmount = that.accurate_div(i.paidAmount, 100);
            i.amount = that.accurate_div(i.amount, 100);
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
          this.merchantId = this.merchantList[0].id;
          this.orderList();
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
