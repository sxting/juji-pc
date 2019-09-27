<template>
  <a-card>
    <div>
      <a-form layout="horizontal">
        <!-- <a-row>
          <a-col :md="12" :sm="24">
            <a-form-item label="商家名称" :labelCol="{span: 6}" :wrapperCol="{span: 18}">商家名称</a-form-item>
          </a-col>
        </a-row> -->
        <a-row>
          <a-col :md="12" :sm="24">
            <a-form-item label="门店名称" :labelCol="{span: 6}" :wrapperCol="{span: 18}">
              <a-select v-model="storeId" placeholder="请选择" @change="getCrossStores">
                <a-select-option value="">全部门店</a-select-option>
                <a-select-option v-for="(item) in cityStoreList" :key="item.id">{{item.name}}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <span class="ml10">
            <a-button class="mt3 ml10" type="primary" @click="search">查询</a-button>
            <a-button class="mt3 ml10" type="primary" @click="fix">批量修改</a-button>
          </span>
        </a-row>
      </a-form>
    </div>

    <div>
      <a-table :columns="columns" :dataSource="dataSource" :pagination="false" :locale="{emptyText: '暂无数据'}">
        <span slot="action" slot-scope="text, record">
          <a @click="bianji(record)">编辑规则</a>
        </span>
      </a-table>
      <div style="margin-top:20px;">
        <a-pagination style="float:right" @change="onChange" :current="pageNo" :pageSize="10" :total="countTotal" />
      </div>
    </div>
  </a-card>
</template>

<script>
const columns = [
  {
    title: "门店名称",
    dataIndex: "storeName"
  },
  {
    title: "赠送礼品商品",
    dataIndex: "GIFT"
  },
  {
    title: "赠送会员商品",
    dataIndex: "MEMBER"
  },
  {
    title: "操作",
    key: "action",
    scopedSlots: { customRender: "action" }
  }
];
export default {
  name: 'CooperationEdit',
  components: {},
  data() {
    return {
      providerId: '',
      merchantId: '',
      crossId: '',
      type: '',
      cityStoreList: [],
      storeId: '',
      columns: columns,
      dataSource: [],
      pageNo: 1,
      countTotal: 0,
      pageSize: 10,
    }
  },
  created() {
    this.merchantId = this.$route.query.merchantId;
    this.providerId = this.$route.query.providerId;
    this.crossId = this.$route.query.crossId;
    this.type = this.$route.query.type;
    this.getStoreList();
    this.getCrossStores();
  },
  methods: {
    search() {
      this.getCrossStores();
    },

    fix() {
      this.$router.push({
        path: "/product/CooperationEditBatch",
        query: { providerId: this.providerId, merchantId: this.merchantId, crossId: this.crossId, type: this.type }
      });
    },

    bianji(e) {
      this.$router.push({
        path: "/product/CooperationEditRule",
        query: { providerId: this.providerId, merchantId: this.merchantId, storeId: e.storeId, crossId: this.crossId, type: this.type }
      });
    },

    onChange(e){
      this.pageNo = e;
      this.getCrossStores();
    },

    /* ===service data=== */

    getCrossStores() {
      let data = {
        storeId: this.storeId,
        crossId: this.crossId,
        pageIndex: this.pageNo,
        pageSize: this.pageSize
      };
      this.$axios({
        url: "/endpoint/cross/stores.json",
        method: "get",
        processData: false,
        params: data
      }).then(res => {
        if (res.success) {
          this.countTotal = res.data.countTotal;
          this.dataSource = res.data.list;
          this.dataSource.forEach(function(item) {
            if(!item.MEMBER) {
              item.MEMBER = '--';
            }
          })
        } else {
          this.$error({
            title: "温馨提示",
            content: res.errorInfo
          });
        }
      });
    },

    getStoreList() {
      let data = {
        merchantId: this.merchantId
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
    }
  },
}
</script>

<style scoped>
.ml10 {
  margin-left: 10px;
}
.mt3 {
  margin-top: 3px;
}
.mt20 {
  margin-top: 20px;
}
.form-item {
  display: flex;
  line-height: 32px;
  margin-top: 20px;
}
.mr10 {
  margin-right: 10px;
}
.w200 {
  width: 200px;
}
</style>
