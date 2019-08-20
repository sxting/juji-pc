<template>
  <a-card>
    <div class="operator">
      <a-row>
        <a-col :md="16" :sm="24">
          <a-button @click="addNew" type="primary">发布新内容</a-button>
        </a-col>
        <a-col :md="8" :sm="24">
          <a-tabs @change="tabFun">
            <a-tab-pane tab="展示中" key="1"></a-tab-pane>
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
          <img :src="'https://upic.juniuo.com/file/picture/'+record.cover+'/resize_0_0/mode_filt/format_jpg/quality_0'" width="110" height="auto" />
        </span>
        <span slot="action" slot-scope="text, record">
          <a @click="bianji(record)">编辑</a>
          <a-divider type="vertical" />
          <a v-if="show == 1" @click="xiajia(record,0)" class="ant-dropdown-link">下架</a>
          <a v-if="show == 0" @click="xiajia(record,1)" class="ant-dropdown-link">上架</a>
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
      show: 1,
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
  methods: {
    bianji(e) {
      this.$router.push({
        path: "/operate/zhongcaoAdd",
        query: { providerId: this.providerId, tweetsId: e.tweetsId,show:this.show}
      });
    },
    providerListFun(e) {
      this.providerId = e;
    },
    tabFun(e) {
      console.log(e)
      this.pageNo = 1;
      this.show = e;
      this.productList();
    },
    onRecommendChange(event) {
      this.recommend = event;
    },
    onSubjectChange(event) {
      this.subject = event;
    },
    xiajia(e,show) {
      this.$axios({
        url: "/tweets//show.json",
        method: "get",
        params: {tweetsId:e.tweetsId,show:show}
      }).then(res => {
        if (res.success) {
          this.$success({content: (show==1?'上':'下')+"架成功"});
          this.productList();
        } else {
          this.$error({
            title: "温馨提示",
            content: res.errorInfo
          });
        }
      });
    },
    addNew() {
      this.$router.push({
        path: "/operate/zhongcaoAdd",
        query: { providerId: this.providerId }
      });
    },
    onChange(e) {
      this.pageNo = e;
      this.productList();
    },
    productList() {
      let data = {
        show:this.show,
        pageNo: this.pageNo || 1,
        pageSize: 10,
        providerId: this.providerId
      };
      this.$axios({
        url: "endpoint/tweets/list.json",
        method: "get",
        processData: false,
        params: data
      }).then(res => {
        if (res.success) {
          this.data2 = res.data.list;
          this.countTotal = res.data.totalRows;
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
  margin-bottom: 5px;
}
@media screen and (max-width: 900px) {
  .fold {
    width: 100%;
  }
}
</style>
