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
                        <a-col :md="8" :sm="24" v-if="merchantId">
                            <a-form-item label="所属商家" :labelCol="{span: 5}" :wrapperCol="{span: 18, offset: 1}">
                                <a-select placeholder="请选择" :defaultValue="merchantId" @change="merchantChange">
                                  <a-select-option v-for="(item) in merchantList" :key="item.id">{{item.name}}</a-select-option>
                                </a-select>
                            </a-form-item>
                        </a-col>
                    </a-row>
              
                </div>
            </a-form>
        </div>
     <div>

            <a-table :columns="columns" :dataSource="data2" :pagination="false">
                <span slot="action" slot-scope="text, record">
                    <a href="javascript:;">查看详情</a>
                </span>
            </a-table>
            <div style="margin-top:20px;">
              <a-pagination style="float:right" @change="paginationChange" :current="pageNo" :pageSize="10" :total="countTotal" />
            </div>
        </div>
    </a-card>
</template>

<script>
import StandardTable from "../../components/table/StandardTable";
const columns = [
  {
    title: "商品类型",

    dataIndex: "name"
  },
  {
    title: "商品名称",
    dataIndex: "age"
  },
  {
    title: "所需桔子",
    dataIndex: "address"
  },
  {
    title: "售价",
    dataIndex: "address1"
  },
  {
    title: "当前库存",
    dataIndex: "address2"
  },
  {
    title: "所属商家",
    dataIndex: "address3"
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
      dataSource: dataSource,
      selectedRowKeys: [],
      selectedRows: [],
      data2:[],
      dateStart:'',
      dateEnd:'',
      pageNo:1,
      providerId : "",
      merchantList : [],
      merchantId:'',
      countTotal :1
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
    paginationChange(e){
      this.pageNo = e;
      this.productList();
    },
    onChange(dates, dateStrings) {
      this.dateStart = dateStrings[0];
      this.dateEnd = dateStrings[1];
      this.productList()
    },
    merchantChange(e){
      this.merchantId = e;
      this.productList()
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
      this.$router.push('/product/addProduct')
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
        '-' +
        (month.toString().length > 1 ? month : '0' + month) +
        '-' +
        (day.toString().length > 1 ? day : '0' + day) +
        (type === 'start' ? ' 00:00:00' : ' 23:59:59')
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
          this.merchantId = this.merchantList[0].id;
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
        merchantId:this.merchantId ,
        dateStart:this.dateStart,
        dateEnd:this.dateEnd,
      };
      if(!data.dateStart) delete data.dateStart
      if(!data.dateEnd) delete data.dateEnd
      
      this.$axios({
        url: "/endpoint/settle/list.json",
        method: "get",
        processData: false,
        params: data
      }).then(res => {
        if (res.success) {
          this.data2 = res.data.list;
          this.countTotal = res.data.countTotal;
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
