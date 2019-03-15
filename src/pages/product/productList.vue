<template>
  <a-card>
    <div  :class="advanced ? 'search' : null">
      <a-form layout="horizontal" @submit="submit" :autoFormCreate="(form) => this.form = form">
        <div :class="advanced ? null: 'fold'">
          <a-row>
            <a-col :md="8" :sm="24">
              <a-form-item label="商品类型" fieldDecoratorId="repository.productType" :labelCol="{span: 5}" :wrapperCol="{span: 18, offset: 1}">
                <a-select placeholder="请选择" >
                  <a-select-option value="">全部类型</a-select-option>
                  <a-select-option value="PRODUCT">普通商品</a-select-option>
                  <a-select-option value="POINT">积分商品</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-item label="所属商家" :labelCol="{span: 5}" fieldDecoratorId="repository.merchantId"  :wrapperCol="{span: 18, offset: 1}">
                <a-select placeholder="请选择" >
                  <a-select-option value="">全部商家</a-select-option>
                  <a-select-option v-for="(item) in merchantList" :key="item.id">{{item.name}}</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-item label="商品标签" fieldDecoratorId="repository.biaoqian" :labelCol="{span: 5}" :wrapperCol="{span: 18, offset: 1}">
                <a-select placeholder="请选择">
                  <a-select-option value="">全部标签</a-select-option>
                  <a-select-option value="美食饮品">美食饮品</a-select-option>
                  <a-select-option value="丽人美发">丽人美发</a-select-option>
                  <a-select-option value="休闲娱乐">休闲娱乐</a-select-option>
                  <a-select-option value="其他">其他</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
          </a-row>
          <a-row v-if="advanced">
            <a-col :md="8" :sm="24">
              <a-form-item label="商品名称" :labelCol="{span: 5}" fieldDecoratorId="repository.productName" :wrapperCol="{span: 18, offset: 1}">
                <a-input style="width: 100%" placeholder="请输入" />
              </a-form-item>
            </a-col>
          </a-row>
        </div>
        <span style="float: right; margin-top: 3px;">
          <a-button htmlType="submit">查询</a-button>
          <a-button style="margin-left: 8px">重置</a-button>
          <a @click="toggleAdvanced" style="margin-left: 8px">
            {{advanced ? '收起' : '展开'}}
            <a-icon :type="advanced ? 'up' : 'down'" />
          </a>
        </span>
      </a-form>
    </div>
    <div>
      <div class="operator">
        <a-button @click="addNew" type="primary">新增商品</a-button>
      </div>
      <a-table :columns="columns" :dataSource="data2" :pagination="false">
        <span slot="action" slot-scope="text, record">
          <a @click="bianji(record)">编辑</a>
          <a-divider type="vertical" />
          <a @click="xiajia(record)" class="ant-dropdown-link">
            下架
          </a>
        </span>
      </a-table>
      <div style="margin-top:20px;">
        <a-pagination style="float:right" @change="onChange" :current="pageNo" :pageSize="10" :total="countTotal" />
      </div>
    </div>
  </a-card>
</template>

<script>
import StandardTable from "../../components/table/StandardTable";
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
    title: "所需桔子",
    dataIndex: "point"
  },
  {
    title: "售价",
    dataIndex: "price"
  },
  {
    title: "当前库存",
    dataIndex: "stock"
  },
  {
    title: "所属商家",
    dataIndex: "merchantName"
  },
  {
    title: "操作",
    key: "action",
    scopedSlots: { customRender: "action" }
  }
];
const data2 = [

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
  name: "ProductList",
  components: { StandardTable },
  data() {
    return {
      advanced: true,
      columns: columns,
      dataSource: dataSource,
      selectedRowKeys: [],
      selectedRows: [],
      data2: data2,
      pageNo: 1,
      pageSize: 10,
      providerId: "1215431996629494",
      countTotal:0,
      merchantList:[]
    };
  },
  created() {
    this.providerId = sessionStorage.getItem('PROCIDERID')||this.$route.query.providerId || "1215431996629494";
    this.merchantListFun(sessionStorage.getItem('PROCIDERID')||this.providerId || "1215431996629494")
    this.productList();
  },
  mounted() {
    
  },
  methods: {
    submit(){
      this.form.validateFields((err, values) => {
        console.log(values)
        this.productList(values.repository.merchantId,values.repository.productType,values.repository.productName,values.repository.biaoqian);
        
      })
    },
    bianji(e){
      this.$router.push({
        path: "/product/addProduct",
        query: { providerId: "1215431996629494",productId:e.productId }
      });
    },
    xiajia(e){
      this.$axios({
        url: "/endpoint/product/offline.json",
        method: "post",
        processData: false,
        data: {productId:e.productId}
      }).then(res => {
        if (res.success) {
          this.$success({
            content: '下架成功'
          });
          this.productList()
        } else {
          this.$error({
            title: "温馨提示",
            content: res.errorInfo
          });
        }
      });
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
      this.$router.push({
        path: "/product/addProduct",
        query: { providerId: "1215431996629494" }
      });
    },
    handleMenuClick(e) {
      if (e.key === "delete") {
        this.remove();
      }
    },
    onChange(e) {
      this.pageNo = e;
      this.productList();
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
        } else {
          this.$error({
            title: "温馨提示",
            content: res.errorInfo
          });
        }
      });
    },
    productList(merchantId,type,name,tag) {
      let data = {
        pageNo: this.pageNo,
        pageSize: 10,
        providerId: this.providerId,
        merchantId:merchantId || '',
        type:type ||'',
        tag:tag || '',
        name	:name||'',
        putAway:1
      };
      this.$axios({
        url: "/endpoint/product/page.json",
        method: "get",
        processData: false,
        params: data
      }).then(res => {
        if (res.success) {
          this.data2 = res.data.list;
          this.countTotal = res.data.countTotal;
          this.data2.forEach(function(i){
            i.price = i.price/100;
            i.typeName = i.type === 'PRODUCT'?'普通商品':'积分商品';
          })
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
