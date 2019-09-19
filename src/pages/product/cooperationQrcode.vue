<template>
  <a-card>
    <div>
      <a-form layout="horizontal">
        <div>
          <a-row>
            <a-col :md="12" :sm="24">
              <a-form-item label="绑定微信号" :labelCol="{span: 5}" :wrapperCol="{span: 18, offset: 1}">
                <a-select
                  v-model="wechat"
                  showSearch
                  @change="handleChange">
                  <a-select-option value="">全部微信号</a-select-option>
                  <a-select-option value="lucy">Lucy</a-select-option>
                  <a-select-option value="tom">Tom</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :md="12" :sm="24">
              <a-form-item label="门店名称" :labelCol="{span: 5}" :wrapperCol="{span: 18, offset: 1}">
                <a-select v-model="store">
                  <a-select-option value="">全部门店</a-select-option>
                  <a-select-option v-for="(item) in cityStoreList" :key="item.id">{{item.name}}</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
          </a-row>
        </div>
        <span style="float: right; margin-top: 3px;">
          <a-button type="primary" @click="search">查询</a-button>
        </span>
      </a-form>
    </div>

    <div>
      <a-table :columns="columns" :dataSource="dataSource" :pagination="false"></a-table>
    </div>
  </a-card>
</template>

<script>
const columns = [
  {
    title: '门店名称',
    dataIndex: 'storeName'
  }
]
  export default {
    name: 'CooperationQrcode',
    components: {},
    data() {
      return {
        providerId: '',
        merchantId: '',
        cityStoreList: [],
        wechat: '',
        store: '',
        dataSource: [],
        columns: columns
      }
    },
    created() {
      this.merchantId = this.$route.query.merchantId;
      this.providerId = this.$route.query.providerId;
      this.getStoreList();
    },
    methods: {
      handleChange (value) {
        console.log(`selected ${value}`);
      },

      search() {

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
