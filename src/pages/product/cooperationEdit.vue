<template>
  <a-card>
    <div>
      <a-form layout="horizontal">
        <a-row>
          <a-col :md="12" :sm="24">
            <a-form-item label="商家名称" :labelCol="{span: 6}" :wrapperCol="{span: 18}">商家名称</a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :md="12" :sm="24">
            <a-form-item label="门店名称" :labelCol="{span: 6}" :wrapperCol="{span: 18}">
              <a-select placeholder="请选择">
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
          <a @click="bianji(record)">编辑</a>
        </span>
      </a-table>
      <div style="margin-top:20px;">
        <a-pagination style="float:right" @change="onChange" :current="pageNo" :pageSize="10" :total="countTotal" />
      </div>
    </div>

    <a-modal title="批量修改赠送商品" :width="660" v-model="showModal1" @ok="handleOk1">
      <a-transfer
      :dataSource="mockData1"
      showSearch
      :targetKeys="targetKeys1"
      @change="handleChange1"
      :render="item=>item.title"
      :titles="titlesArr1"
      :listStyle="{
        width: 'auto',
        minWidth: '220px'
      }">
      </a-transfer>
      <a-transfer class="mt20"
      :dataSource="mockData2"
      showSearch
      :targetKeys="targetKeys2"
      @change="handleChange2"
      :render="item=>item.title"
      :titles="titlesArr2"
      :listStyle="{
        width: 'auto',
        minWidth: '220px'
      }">
      </a-transfer>
    </a-modal>

    <a-modal title="编辑赠送商品" :width="660" v-model="showModal2" @ok="handleOk2">
      <a-transfer
      :dataSource="mockData"
      showSearch
      :targetKeys="targetKeys"
      @change="handleChange"
      :render="item=>item.title"
      :titles="titlesArr2"
      :listStyle="{
        width: 'auto',
        minWidth: '250px'
      }">
      </a-transfer>
    </a-modal>
  </a-card>
</template>

<script>
const columns = [
  {
    title: "门店名称",
    dataIndex: "storeName"
  },
  {
    title: "赠送商品",
    dataIndex: "products"
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
      cityStoreList: [],
      columns: columns,
      dataSource: [
        {
          storeName: '门店名称',
          products: '8'
        }
      ],
      pageNo: 1,
      countTotal: 0,
      pageSize: 10,
      showModal1: false,
      showModal2: false,
      mockData: [],
      targetKeys: [],
      mockData1: [],
      targetKeys1: [],
      titlesArr1: ['全部可选门店', '已选门店'],
      titlesArr2: ['全部购买送会员商品', '赠送商品'],
      mockData2: [],
      targetKeys2: [],
    }
  },
  created() {
    this.merchantId = this.$route.query.merchantId;
    this.providerId = this.$route.query.providerId;
    this.getStoreList();
  },
  methods: {
    search() {

    },
    fix() {
      let mockData1 = [];
      this.cityStoreList.forEach(function(item, i) {
        let data = {
          key: item.id,
          title: item.name
        };
        mockData1.push(data);
      });
      this.mockData1 = mockData1;
      this.targetKeys1 = [];
      this.targetKeys2 = [];
      this.showModal1 = true;
    },
    bianji(e) {
      this.showModal2 = true;
    },
    onChange(){

    },
    handleOk1() {

    },
    handleOk2() {

    },
    handleChange(targetKeys, direction, moveKeys) {
      this.targetKeys = targetKeys
    },
    handleChange1(targetKeys, direction, moveKeys) {
      console.log(targetKeys, direction, moveKeys);
      this.targetKeys1 = targetKeys
    },
    handleChange2(targetKeys, direction, moveKeys) {
      console.log(targetKeys, direction, moveKeys);
      this.targetKeys2 = targetKeys
    },

    /* ===service data=== */
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
</style>
