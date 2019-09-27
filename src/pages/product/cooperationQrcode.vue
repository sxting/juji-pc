<template>
  <a-card>
    <div class="search">
      <a-form layout="horizontal">
        <div>
          <a-row>
            <a-col :md="12" :sm="24">
              <a-form-item label="分账微信号" :labelCol="{span: 5}" :wrapperCol="{span: 18, offset: 1}">
                <a-select v-model="distributorId" showSearch>
                  <a-select-option value="">全部微信号</a-select-option>
                  <a-select-option v-for="(item) in wechatList" :key="item.belongTo">{{item.account}}</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :md="12" :sm="24">
              <a-form-item label="门店名称" :labelCol="{span: 5}" :wrapperCol="{span: 18, offset: 1}">
                <a-select v-model="storeId">
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
      <a-table :columns="columns" :dataSource="dataSource" :pagination="false">
        <div slot="action" slot-scope="text, record">
          <span v-if="record.account === '--'"><a @click="band(record)">绑定微信号</a></span>
          <span v-else>
            <a @click="unBand(record)" class="red">解绑</a>
          </span>
        </div>
      </a-table>

      <div style="margin-top:20px;">
        <a-pagination style="float:right" @change="onChange" :current="pageNo" :pageSize="10" :total="countTotal" />
      </div>
    </div>

    <a-modal
      title="绑定微信号"
      v-model="visible"
      @ok="handleOk">
      <a-form>
        <a-form-item label="门店名称" :labelCol="{span: 5}" :wrapperCol="{span: 10}">{{store.storeName}}</a-form-item>
        <a-form-item label="绑定微信号" :labelCol="{span: 5}" :wrapperCol="{span: 10}" :required="true">
          <a-input v-model="bandWechat" placeholder="请输入微信号" />
          <!-- <a-select
            v-model="bandWechat"
            placeholder="请选择"
            showSearch>
            <a-select-option value="lucy">Lucy</a-select-option>
            <a-select-option value="tom">Tom</a-select-option>
          </a-select> -->
        </a-form-item>
      </a-form>
    </a-modal>
  </a-card>
</template>

<script>
const columns = [
  {
    title: '门店名称',
    dataIndex: 'storeName'
  },
  {
    title: '绑定分账微信号',
    dataIndex: 'account'
  },
  {
    title: '操作',
    dataIndex: 'action',
    scopedSlots: { customRender: "action" }
  }
]
export default {
  name: 'CooperationQrcode',
  components: {},
  data() {
    return {
      providerId: '',
      merchantId: '',
      crossId: '',
      wechatList: [],
      cityStoreList: [],
      distributorId: '',
      storeId: '',
      dataSource: [],
      columns: columns,
      visible: false,
      bandWechat: '',
      pageNo: 1,
      pageSize: 10,
      countTotal: 1,
      store: '',
    }
  },
  created() {
    this.merchantId = this.$route.query.merchantId;
    this.providerId = this.$route.query.providerId;
    this.crossId = this.$route.query.crossId;
    this.getStoreList();
    this.getDistributors();
  },
  methods: {
    search() {
      this.getDistributors();
    },

    band(e) {
      this.visible = true;
      this.store = e;
      this.bandWechat = '';
    },

    handleOk() {
      this.$axios({
        url: "/endpoint/cross/getDistributor.json",
        method: "get",
        processData: false,
        params: {
          wechatId: this.bandWechat
        }
      }).then(res => {
        if (res.success) {
          if(res.data) {
            let data = {
              crossId: this.crossId,
              storeId: this.store.storeId,
              distributorId: res.data.belongTo,
            };
            this.$axios({
              url: "/endpoint/cross/bindDistributor.json",
              method: "get",
              processData: false,
              params: data
            }).then(res => {
              if (res.success) {
                this.visible = false;
                this.getDistributors();
              } else {
                this.$error({
                  title: "温馨提示",
                  content: res.errorInfo
                });
              }
            });
          } else {
            this.$error({
            title: "温馨提示",
            content: '请输入正确的微信号'
          });
          }
        } else {
          this.$error({
            title: "温馨提示",
            content: res.errorInfo
          });
        }
      });
    },

    unBand(e) {
      let that = this;
      this.$confirm({
        title: '确认解绑此微信号吗？',
        content: '解绑后，该微信号将无法收到返佣',
        onOk() {
          let data = {
            crossId: that.crossId,
            storeId: e.storeId,
          };
          that.$axios({
            url: "/endpoint/cross/unbindDistributor.json",
            method: "get",
            processData: false,
            params: data
          }).then(res => {
            if (res.success) {
              that.getDistributors();
            } else {
              that.$error({
                title: "温馨提示",
                content: res.errorInfo
              });
            }
          });
        },
        onCancel() {},
      });
    },

    onChange(e) {
      this.pageNo = e;
      this.getDistributors();
    },

    /* ===service data=== */

    getDistributors() {
      let data = {
        crossId: this.crossId,
        distributorId: this.distributorId,
        storeId: this.storeId,
        pageIndex: this.pageNo,
        pageSize: this.pageSize,
      };
      this.$axios({
        url: "/endpoint/cross/distributors.json",
        method: "get",
        processData: false,
        params: data
      }).then(res => {
        if (res.success) {
          this.wechatList = res.data.wechat;
          this.dataSource = res.data.page.list;
          this.countTotal = res.data.page.countTotal;

          this.dataSource.forEach(function(item1) {
            if(item1.distributorId) {
              res.data.wechat.forEach(function(item2) {
                if(item1.distributorId === item2.belongTo) {
                  item1.account = item2.account;
                }
              })
            } else {
              item1.account = '--';
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
.search {
  margin-bottom: 54px;
}
.red {
  color: red;
}
</style>
