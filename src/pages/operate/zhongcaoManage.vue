<template>
  <a-card>
    <div class="operator">
      <a-row>
        <a-col :md="16" :sm="24">
          <a-button @click="addNew" type="primary">发布新内容</a-button>
        </a-col>
      </a-row>
    </div>
    <div :class="advanced ? 'search' : null">
      <a-form layout="horizontal" :autoFormCreate="(form) => this.form = form">
        <div :class="advanced ? null: 'fold'">
          <a-row>
            <a-col :md="8" :sm="24">
              <a-form-item label="运营商" :labelCol="{span: 4}" fieldDecoratorId="repository.providerId" :wrapperCol="{span: 18, offset: 0}">
                <a-select placeholder="请选择" @change="providerListFun">
                  <a-select-option v-for="(item) in providerList" :key="item.providerId">{{item.providerName}}</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col>
            <span style="float: left; margin-top: 3px;">
              <a-button type="primary" @click="productList">查询</a-button>
            </span>
            </a-col> 
          </a-row>
        </div>
      </a-form>
    </div>
    <div>
      <a-table :columns="columns" :dataSource="data2" :pagination="false" :locale="{emptyText: '暂无数据'}">
        <span slot="firstImage" slot-scope="text, record">
          <img :src="'https://upic.juniuo.com/file/picture/'+record.cover+'/resize_0_0/mode_filt/format_jpg/quality_0'" alt="" width="150" height="50" />
        </span>
        <span slot="action" slot-scope="text, record">
          <!-- <a @click="bianji(record)">编辑</a>
          <a-divider v-if="putAway === '1'" type="vertical" /> -->
          <a v-if="putAway === '1'" @click="xiajia(record)" class="ant-dropdown-link">下架</a>
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
const columns = [{
    title: "展示顺序",
    dataIndex: "idx"
  },{
    title: "上次修改时间",
    dataIndex: "lastUpdated"
  },{
    title: "标题",
    dataIndex: "title"
  },{
    title: "种草首图",
    scopedSlots: { customRender: "firstImage" }
  },{
    title: "累计访问数",
    dataIndex: "readCounter"
  },{
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
    bianji(e) {
      this.$router.push({
        path: "/operate/zhongcaoAdd",
        query: { providerId: this.providerId, tweetsId: e.tweetsId }
      });
    },
    providerListFun(e) {
      this.providerId = e;
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
        url: "/tweets//show.json",
        method: "get",
        params: {tweetsId:e.tweetsId,show:0}
      }).then(res => {
        if (res.success) {
          this.$success({content: "下架成功"});
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
        path: "/operate/zhongcaoAdd",
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
    productList() {
      let data = {
        pageNo: this.pageNo || 1,
        pageSize: 10,
        providerId: this.providerId
      };
      this.$axios({
        url: "/tweets/list.json",
        method: "get",
        processData: false,
        params: data
      }).then(res => {
        if (res.success) {
          this.data2 = res.data;
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
  margin-bottom: 5px;
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
