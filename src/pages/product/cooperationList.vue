<template>
  <a-card>
    <div class="operator">
      <a-row>
        <a-col :md="16" :sm="24">
          <a-button @click="addNew" type="primary">新增异业合作商家</a-button>
        </a-col>
      </a-row>

    </div>
    <div class="search">
      <a-form layout="horizontal" :autoFormCreate="(form) => this.form = form">
        <div>
          <a-row>
            <a-col :md="12" :sm="24">
              <a-form-item label="所属运营商" :labelCol="{span: 5}" fieldDecoratorId="repository.providerId" :wrapperCol="{span: 18, offset: 1}">
                <a-select placeholder="请选择" @change="providerListFun">
                  <a-select-option v-for="(item) in providerList" :key="item.providerId">{{item.providerName}}</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :md="12" :sm="24">
              <a-form-item label="商家名称" :labelCol="{span: 5}" fieldDecoratorId="repository.merchantId" :wrapperCol="{span: 18, offset: 1}">
                <a-select placeholder="请选择">
                  <a-select-option value="">全部商家</a-select-option>
                  <a-select-option v-for="(item) in merchantList" :key="item.id">{{item.name}}</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
          </a-row>
        </div>
        <span style="float: right; margin-top: 3px;">
          <a-button type="primary" @click="submit">查询</a-button>
        </span>
      </a-form>
    </div>

    <div>
      <a-table :columns="columns" :dataSource="data2" :pagination="false" :locale="{emptyText: '暂无数据'}">
        <span slot="action" slot-scope="text, record">
          <a @click="bianji(record)">编辑</a>
          <a-divider type="vertical" />
          <a @click="wechatManage(record)">分账账号管理</a>
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
    title: "上次修改时间",
    dataIndex: "lastUpdated"
  },
  {
    title: "所属运营商",
    dataIndex: "providerName"
  },
  {
    title: "商家名称",
    dataIndex: "merchantName"
  },
  {
    title: "异业合作类型",
    dataIndex: "typeName"
  },
  {
    title: "操作",
    key: "action",
    scopedSlots: { customRender: "action" }
  }
];
const data2 = [];

export default {
  name: "CooperationList",
  components: { StandardTable },
  data() {
    return {
      data2: data2,
      pageNo: 1,
      columns: columns,
      pageSize: 10,
      providerId: "",
      countTotal: 0,
      merchantList: [],
      providerList: [],
    };
  },
  created() {
    this.providerList = JSON.parse(sessionStorage.getItem("LoginDate")).providerList;
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
    this.crossList();
  },
  mounted() {},
  methods: {
    providerListFun(e) {
      this.providerId = e;
      this.merchantListFun(e);
    },
    submit() {
      this.pageNo = 1;
      this.form.validateFields((err, values) => {
        this.crossList(
          values.repository.merchantId,
        );
      });
    },
    bianji(e) {
      this.$router.push({
        path: "/product/CooperationEdit",
        query: { providerId: this.providerId, merchantId: e.merchantId, crossId: e.crossId, type: e.type }
      });
    },
    wechatManage(e) {
      this.$router.push({
        path: "/product/CooperationQrcode",
        query: { providerId: this.providerId, merchantId: e.merchantId, crossId: e.crossId }
      });
    },
    addNew() {
      this.$router.push({
        path: "/product/CooperationAdd",
        query: { providerId: this.providerId }
      });
    },

    onChange(e) {
      this.pageNo = e;
      this.form.validateFields((err, values) => {
        this.crossList(
          values.repository.merchantId,
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
    crossList(merchantId) {
      let data = {
        pageIndex: this.pageNo || 1,
        pageSize: 10,
        providerId: this.providerId,
        merchantId: merchantId || "",
      };
      let that = this;
      this.$axios({
        url: "/endpoint/cross/list.json",
        method: "get",
        processData: false,
        params: data
      }).then(res => {
        if (res.success) {
          this.data2 = res.data.list;
          this.countTotal = res.data.countTotal;
          this.data2.forEach(function(i) {
            if(i.type === 'MEMBER') {
              i.typeName = '会员版';
            } else if(i.type === 'GIFT') {
              i.typeName = '礼品版';
            }
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
