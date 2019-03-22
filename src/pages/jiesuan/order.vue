<template>
  <a-card>
    <div :class="advanced ? 'search' : null">
      <a-form layout="horizontal">
        <div :class="advanced ? null: 'fold'">
          <a-row>
            <a-col :md="8" :sm="24">
              <a-form-item label="选择日期" :labelCol="{span: 5}" :wrapperCol="{span: 18, offset: 1}">
                <a-range-picker  @change="onChange"/>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24"  v-if="merchantId">
              <a-form-item label="所属商家" :labelCol="{span: 5}" :wrapperCol="{span: 18, offset: 1}">
                <a-select placeholder="请选择" :defaultValue="merchantId" @change="merchantChange">
                  <a-select-option v-for="(item) in merchantList" :key="item.id">{{item.name}}</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-item label="商品名称" :labelCol="{span: 5}" :wrapperCol="{span: 18, offset: 1}">
                <a-select placeholder="请选择">
                  <a-select-option value="1">关闭</a-select-option>
                  <a-select-option value="2">运行中</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
          </a-row>
          <a-row v-if="advanced">
            <a-col :md="8" :sm="24">
              <a-form-item label="订单状态" :labelCol="{span: 5}" :wrapperCol="{span: 18, offset: 1}">
                <a-input-number style="width: 100%" placeholder="请输入" />
              </a-form-item>
            </a-col>
          </a-row>
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
        <a href="javascript:;">查看详情</a>
      </a-table>
    </div>
  </a-card>
</template>

<script>
import StandardTable from "../../components/table/StandardTable";
const columns = [
  {
    title: "订单编号",

    dataIndex: "orderId"
  },
  {
    title: "下单时间",
    dataIndex: "dateCreated"
  },
  {
    title: "订单状态",
    dataIndex: "status"
  },
  {
    title: "商品名称",
    dataIndex: "body"
  },
  {
    title: "商家名称",
    dataIndex: "merchantName"
  },
  {
    title: "订单金额",
    dataIndex: "paidAmount"
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
  name: "OrderList",
  components: { StandardTable },
  data() {
    return {
      advanced: true,
      columns: columns,
      dataSource: dataSource,
      selectedRowKeys: [],
      selectedRows: [],
      data2: [],
      merchantList:[],
      merchantId:''
    };
  },
  created() {
    this.providerId = sessionStorage.getItem('PROCIDERID')||this.$route.query.providerId || "1215431996629494";
    this.merchantListFun(this.providerId);
  },
  methods: {
    toggleAdvanced() {
      this.advanced = !this.advanced;
    },
    onChange(dates, dateStrings) {
      this.dateStart = dateStrings[0];
      this.dateEnd = dateStrings[1];
      this.orderList()
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
    merchantChange(e){
      this.merchantId = e;
      this.orderList()
    },
    orderList() {
      let data = {
        pageNo: this.pageNo,
        pageSize: 10,
        providerId: this.providerId,
        merchantId:this.merchantId ,
        dateStart:this.dateStart,
        dateEnd:this.dateEnd,
        status:'ALL',
        productName:''
      };
      if(!data.dateStart) delete data.dateStart
      if(!data.dateEnd) delete data.dateEnd
      if(!data.productName) delete data.productName
      
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
            i.paidAmount = that.accurate_div(i.paidAmount, 100);
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
