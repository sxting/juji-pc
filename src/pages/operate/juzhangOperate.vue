<template>
    <a-card>
        <div>
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
                                <a-form-item label="排序方式" :labelCol="{span: 5}" :wrapperCol="{span: 18, offset: 1}">
                                    <a-select placeholder="请选择" @change="merchantChange">
                                        <a-select-option :key="0">下级桔长数</a-select-option>
                                        <a-select-option :key="1">分享次数</a-select-option>
                                        <a-select-option :key="2">拉新人数</a-select-option>
                                    </a-select>
                                </a-form-item>
                            </a-col>
                        </a-row>

                    </div>
                </a-form>
            </div>
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
        <a-modal title="详情" :visible="visible" @ok="handleCancel" @cancel="handleCancel" width="1000px">
        </a-modal>
    </a-card>
</template>

<script>
import StandardTable from "../../components/table/StandardTable";
const columns = [
  {
    title: "排名",

    dataIndex: "typeName"
  },
  {
    title: "桔长微信昵称",
    dataIndex: "productName"
  },
  {
    title: "手机号",
    dataIndex: "num"
  },
  {
    title: "下级桔长数",
    dataIndex: "amount"
  },
  {
    title: "分享次数",
    dataIndex: "amount"
  },
  {
    title: "拉新人数",
    dataIndex: "amount"
  },
  {
    title: "返佣金额",
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
  name: "juzhangOperate",
  components: { StandardTable },
  data() {
    return {
      advanced: true,
      columns: columns,
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
      merchantId: "",
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
      orderUser: { nickName: "", phone: "" }
    };
  },
  created() {
    this.providerId =
      sessionStorage.getItem("PROCIDERID") ||
      this.$route.query.providerId ||
      "1215431996629494";
  },
  methods: {
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
    merchantChange(e) {},
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
        url: "/endpoint/settle/list.json",
        method: "get",
        processData: false,
        params: data
      }).then(res => {
        if (res.success) {
          this.data2 = res.data.list;
          this.data2.forEach(function(i) {
            i.typeName = i.type === "POINT" ? "积分商品" : "普通商品";
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
    //描述:某个商品结算列表
    xiangqingList(e) {
      this.providerId = e.providerId;
      this.productId = e.productId;
      this.xiangqingFun();
    },
    xiangqingFun() {
      let data = {
        pageNo: this.pageNo,
        pageSize: 10,
        providerId: this.providerId,
        merchantId: this.merchantId,
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
        url: "/endpoint/product/settle/list.json",
        method: "get",
        processData: false,
        params: data
      }).then(res => {
        if (res.success) {
          this.changeBoo = true;
          this.data3 = res.data.list;
          this.data3.forEach(function(i) {
            i.amount = that.accurate_div(i.amount, 100);
          });
          this.storeIdList(this.merchantId);
        } else {
          this.$error({
            title: "温馨提示",
            content: res.errorInfo
          });
        }
      });
    },
    orderList(e) {
      this.orderFun(e.order_id);
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
