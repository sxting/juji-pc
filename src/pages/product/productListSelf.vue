<template>
  <a-card>
    <div class="operator">
      <a-row>
        <!-- <a-col :md="16" :sm="24">
          <a-button @click="addNew" type="primary">新增商品</a-button>
        </a-col> -->
        <a-col :md="8" :sm="24">
          <a-tabs @change="tabFun">
            <a-tab-pane tab="售卖中" key="1"></a-tab-pane>
            <a-tab-pane tab="已下架" key="0"></a-tab-pane>
          </a-tabs>
        </a-col>
      </a-row>

    </div>
    <div :class="advanced ? 'search' : null">
      <a-form layout="horizontal" :autoFormCreate="(form) => this.form = form">
        <div :class="advanced ? null: 'fold'">
          <a-row>
            <a-col :md="8" :sm="24">
              <a-form-item label="商品类型" fieldDecoratorId="repository.productType" :labelCol="{span: 5}" :wrapperCol="{span: 18, offset: 1}">
                <a-select placeholder="请选择">
                  <a-select-option value="">全部类型</a-select-option>
                  <a-select-option value="PRODUCT">普通商品</a-select-option>
                  <a-select-option value="POINT">积分商品</a-select-option>
                </a-select>
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
              <a-form-item label="商品标签" fieldDecoratorId="repository.biaoqian" :labelCol="{span: 5}" :wrapperCol="{span: 18, offset: 1}">
                <a-select placeholder="请选择">
                  <a-select-option value="">全部标签</a-select-option>
                  <a-select-option value="要吃">要吃</a-select-option>
                  <a-select-option value="要玩">要玩</a-select-option>
                  <a-select-option value="要美">要美</a-select-option>
                  <a-select-option value="亲子">亲子</a-select-option>
                  <a-select-option value="度假">度假</a-select-option>
                  <a-select-option value="其他">其他</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-item label="商品名称" :labelCol="{span: 5}" fieldDecoratorId="repository.productName" :wrapperCol="{span: 18, offset: 1}">
                <a-input style="width: 100%" placeholder="请输入" />
              </a-form-item>
            </a-col>
          </a-row>
        </div>
        <span style="float: right; margin-top: 3px;">
          <a-button type="primary" @click="submit">查询</a-button>
          <a @click="toggleAdvanced" style="margin-left: 8px">
            {{advanced ? '收起' : '展开'}}
            <a-icon :type="advanced ? 'up' : 'down'" />
          </a>
        </span>
      </a-form>
    </div>
    <div>

      <a-table :columns="columns" :dataSource="data2" :pagination="false" :locale="{emptyText: '暂无数据'}">
        <span slot="action" slot-scope="text, record">
          <a-input v-model="record.baseSoldNum" @blur="ediltBaseSoldNum(record)" style="width: 100px" />
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
    title: "售价",
    dataIndex: "price"
  },
  {
    title: "所属商家",
    dataIndex: "merchantName"
  },
  {
    title: "热度",
    key: "action",
    scopedSlots: { customRender: "action" }
  }
];
const data2 = [];
const dataSource = [];

export default {
  name: "ProductListSelf",
  components: { StandardTable },
  data() {
    return {
      advanced: true,
      dataSource: dataSource,
      selectedRowKeys: [],
      selectedRows: [],
      data2: data2,
      pageNo: 1,
      columns: columns,
      pageSize: 10,
      providerId: "",
      countTotal: 0,
      merchantList: [],
      putAway: '1',
      providerList: [],
    };
  },
  created() {
    this.providerList = JSON.parse(
      sessionStorage.getItem("LoginDate")
    ).providerList;
    this.providerId = this.providerList[0].providerId;
    this.merchantListFun(this.providerId);
    this.$nextTick(() => {
      this.form.setFieldsValue({
        repository: {
          providerId: this.providerId,
          merchantId:''
        }
      });
    });
    sessionStorage.setItem("menuBoolean",true);
    this.productList();
  },
  mounted() {},
  methods: {
    providerListFun(e) {
      this.providerId = e;
      this.merchantListFun(e);
    },
    tabFun(e) {
      this.putAway = e;
      this.columns = columns;
      this.productList();
    },
    submit() {
      this.pageNo = 1;
      this.form.validateFields((err, values) => {
        console.log(values);
        this.productList(
          values.repository.merchantId,
          values.repository.productType,
          values.repository.productName,
          values.repository.biaoqian
        );
      });
    },

    ediltBaseSoldNum(e) {
      // console.log(e);
      let data = {
        productId: e.productId,
        num: Number(e.baseSoldNum)
      };

      let url = JSON.parse(JSON.stringify(window.location.host.indexOf('oauth2.jujipay.com') > -1 ? 'https://api.juniuo.com/juji/hotnum.php' : 'https://api.juniuo.com/juji/hotnum.php?env=dev'))

      this.$axios({
        url: url,
        method: "post",
        processData: false,
        data: data
      }).then(res => {
        console.log(res);
        if (res.error == '0') {
          this.form.validateFields((err, values) => {
            this.productList(
              values.repository.merchantId,
              values.repository.productType,
              values.repository.productName,
              values.repository.biaoqian
            );
          });
        } else {
          this.$error({
            title: "温馨提示",
            content: '修改失败'
          });
        }
      });
    },

    toggleAdvanced() {
      this.advanced = !this.advanced;
    },

    addNew() {
      this.$router.push({
        path: "/product/addProduct",
        query: { providerId: this.providerId }
      });
    },

    onChange(e) {
      this.pageNo = e;
      this.form.validateFields((err, values) => {
        this.productList(
          values.repository.merchantId,
          values.repository.productType,
          values.repository.productName,
          values.repository.biaoqian
        );
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
        } else {
          this.$error({
            title: "温馨提示",
            content: res.errorInfo
          });
        }
      });
    },

    productList(merchantId, type, name, tag) {
      let data = {
        pageNo: this.pageNo || 1,
        pageSize: 10,
        providerId: this.providerId,
        merchantId: merchantId || "",
        type: type || "",
        tag: tag || "",
        name: name || "",
        putAway: this.putAway
      };
      let that = this;
      this.$axios({
        url: "/endpoint/product/page.json",
        method: "get",
        processData: false,
        params: data
      }).then(res => {
        if (res.success) {
          this.data2 = res.data.list;
          this.countTotal = res.data.countTotal;
          this.data2.forEach(function(i) {
            if (i.auditStatusMap && i.auditStatusMap.auditStatus === "PASS")
              i.auditStatusMap.auditStatusName = "通过";
            if (i.auditStatusMap && i.auditStatusMap.auditStatus === "INIT")
              i.auditStatusMap.auditStatusName = "待审核";
            if (i.auditStatusMap && i.auditStatusMap.auditStatus === "REJECT")
              i.auditStatusMap.auditStatusName = "拒绝";

            i.price = that.accurate_div(i.price , 100);
            i.typeName = i.type === "PRODUCT" ? "普通商品" : "积分商品";
          });
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
