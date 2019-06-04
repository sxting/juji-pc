<template>
  <a-card>
    <div class="operator">
      <a-row>
        <a-col :md="16" :sm="24">
          <a-button @click="addNew" type="primary">新增商品</a-button>
        </a-col>
        <a-col :md="8" :sm="24">
          <a-tabs @change="tabFun">
            <a-tab-pane tab="售卖中" key="1"></a-tab-pane>
            <!-- <a-tab-pane tab="审核中" key="2"></a-tab-pane> -->
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
                  <a-select-option value="美食饮品">美食饮品</a-select-option>
                  <a-select-option value="丽人美发">丽人美发</a-select-option>
                  <a-select-option value="休闲娱乐">休闲娱乐</a-select-option>
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
          <a @click="bianji(record)">编辑</a>
          <a-divider v-if="putAway === '1'" type="vertical" />
          <a v-if="putAway === '1'" @click="xiajia(record)" class="ant-dropdown-link">
            下架
          </a>
          <a-divider v-if="putAway === '1'" type="vertical" />
          <a v-if="putAway === '1'" @click="showContro(record)" class="ant-dropdown-link">
            展示控制
          </a>

        </span>
      </a-table>
      <a-modal
        title="展示控制"
        v-model="visible1"
        @ok="handleOk1">
        <a-form>
          <a-form-item label="展示顺序" :labelCol="{span: 7}" help="第几位" :wrapperCol="{span: 10}" :required="false">
            <a-input-number :min="0" :step="1" :max="99999" v-model="showIdx" />
          </a-form-item>
          <a-form-item label="活动主题" :labelCol="{span: 7}" :wrapperCol="{span: 10}" :required="false">
            <a-checkbox-group v-model="subject" @change="onSubjectChange" :style="{ paddingTop: '8px' }">
              <a-row>
                <a-col :span="12"><a-checkbox value="新品抢鲜" defaultChecked>新品抢鲜</a-checkbox></a-col>
                <a-col :span="12"><a-checkbox value="好店礼券">好店礼券</a-checkbox></a-col>
              </a-row>
            </a-checkbox-group>
          </a-form-item>
          <a-form-item label="精选推荐" :labelCol="{span: 7}" :wrapperCol="{span: 10}" :required="true">
            <a-switch checkedChildren="开" unCheckedChildren="关" v-model="recommend" @change="onRecommendChange" />
          </a-form-item>
        </a-form>
      </a-modal>
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
const columns2 = [
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
    title: "所属商家",
    dataIndex: "merchantName"
  },
  {
    title: "审核状态",
    dataIndex: "auditStatusMap.auditStatusName"
  },
  {
    title: "未通过原因",
    dataIndex: "auditStatusMap.rejectReason"
  },
  {
    title: "操作",
    key: "action",
    scopedSlots: { customRender: "action" }
  }
];
const data2 = [];
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
      visible1: false,
      productItem: {},
      showIdx: '0',
      subject: [], // 活动主题； 字符串 逗号分隔
      recommend: true, //是否精选推荐； 0，1
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
      if (this.putAway === "2") this.columns = columns2;
      else this.columns = columns;
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
    bianji(e) {
      this.$router.push({
        path: "/product/addProduct",
        query: { providerId: this.providerId, productId: e.productId }
      });
    },
    showContro(e) {
      this.visible1 = true;
      this.productItem = e;
      this.sxj = true;
      this.showIdx = e.idx;
      this.subject = e.subject ? e.subject.split(',') : [];
      this.recommend = e.recommend ? true : false;
    },
    onRecommendChange(event) {
      this.recommend = event;
    },
    onSubjectChange(event) {
      this.subject = event;
    },
    handleOk1() {
      let data = {
        idx: this.showIdx, //展示顺序
        productId: this.productItem.productId,
        recommend: this.recommend ? 1 : 0, //精选推荐 1精选 0非精选
        subject: this.subject.join(',') //活动主题
      }
      this.$axios({
        url: '/endpoint/product/modifyWithoutAudit.json',
        method: 'post',
        processData: false,
        data: data
      }).then(res => {
        if (res.success) {
          this.$success({
            content: "修改成功"
          });
          this.visible1 = false;
          this.productList();
        } else {
          this.$error({
            title: "温馨提示",
            content: res.errorInfo
          });
        }
      })

    },
    xiajia(e) {
      this.$axios({
        url: "/endpoint/product/offline.json",
        method: "post",
        processData: false,
        params: { productId: e.productId }
        // data: {productId:e.productId}
      }).then(res => {
        if (res.success) {
          this.$success({
            content: "下架成功"
          });
          this.productList();
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
        query: { providerId: this.providerId }
      });
    },
    handleMenuClick(e) {
      if (e.key === "delete") {
        this.remove();
      }
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

            i.price = i.price / 100;
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
