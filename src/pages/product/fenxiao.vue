<template>
    <a-card>
        <div :class="advanced ? 'search' : null" v-if="true">
            <a-tabs>
                <a-tab-pane tab="待分销商品" key="1"></a-tab-pane>
                <a-tab-pane tab="待分销商品" key="2"></a-tab-pane>
            </a-tabs>
            <a-form layout="horizontal" @submit="submit" :autoFormCreate="(form) => this.form = form">
                <div :class="advanced ? null: 'fold'">
                    <a-row>
                        <a-col :md="8" :sm="24">
                            <a-form-item label="所属运营商" :labelCol="{span: 5}" fieldDecoratorId="repository.merchantId" :wrapperCol="{span: 18, offset: 1}">
                                <a-select placeholder="请选择">
                                    <a-select-option value="">全部商家</a-select-option>
                                    <a-select-option v-for="(item) in merchantList" :key="item.id">{{item.name}}</a-select-option>
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
            </a-form>
            <div>
                <a-table :columns="columns" :dataSource="data2" :pagination="false">
                    <span slot="action" slot-scope="text, record">
                        <a @click="bianji(record)">分销推广</a>
                    </span>
                </a-table>
                <div style="margin-top:20px;">
                    <a-pagination style="float:right" @change="onChange" :current="pageNo" :pageSize="10" :total="countTotal" />
                </div>
            </div>
        </div>

        <div v-if="false">
            <div :class="advanced ? null: 'fold'">
                <a-form layout="horizontal" @submit="submit" :autoFormCreate="(form) => this.form = form">
                    <a-card title="商品信息" style="margin-top:20px">
                        <a-form-item label="商品名称" :labelCol="{span: 7}" fieldDecoratorId="repository.merchantId" :wrapperCol="{span: 10}">
                            剪发总监设计
                        </a-form-item>
                        <a-form-item label="原价" :labelCol="{span: 7}" fieldDecoratorId="repository.productName" :wrapperCol="{span: 10}">
                            11
                        </a-form-item>
                        <a-form-item label="售价" :labelCol="{span: 7}" fieldDecoratorId="repository.productName2" :wrapperCol="{span: 10}">
                            22
                        </a-form-item>
                        <a-form-item label="底价" :labelCol="{span: 7}" fieldDecoratorId="repository.productName3" :wrapperCol="{span: 10}">
                            33
                        </a-form-item>
                    </a-card>
                    <a-card title="分佣设置" style="margin-top:20px">
                        <a-form-item label="购物返利分佣比例" :labelCol="{span: 7}" fieldDecoratorId="repository.merchantId" :wrapperCol="{span: 10}">
                            <a-input-number/>19.00元
                        </a-form-item>
                        <a-form-item label="管理佣金分佣比例" :labelCol="{span: 7}" fieldDecoratorId="repository.productName" :wrapperCol="{span: 10}">
                            <a-input-number/>19.00元
                        </a-form-item>
                    </a-card>
                    <a-card title="推广素材" style="margin-top:20px">
                        <a-form-item label="推广文案" :labelCol="{span: 7}" :wrapperCol="{span: 10}">
                            <a-textarea type="text" maxlength="100" class="desc_textarea" placeholder=""></a-textarea>
                        </a-form-item>
                        <a-form-item label="推广图片" :labelCol="{span: 7}" :wrapperCol="{span: 10}">
                            <a-upload listType="picture-card" :fileList="fileList" :showUploadList="{showPreviewIcon:false,showRemoveIcon:true}" :beforeUpload="beforeUpload" :customRequest="nzCustomRequestFun" @change="handleChange1($event)">
                                <div v-if="fileList.length < 1">
                                    <a-icon type="plus" />
                                    <div class="ant-upload-text">上传图片</div>
                                </div>
                            </a-upload>
                        </a-form-item>
                    </a-card>
                    <a-form-item :wrapperCol="{span: 10, offset: 7}">
                        <a-button htmlType="submit">提交</a-button>
                    </a-form-item>
                </a-form>

            </div>
        </div>
    </a-card>
</template>

<script>
import StandardTable from "../../components/table/StandardTable";
const columns = [
  {
    title: "上架时间",
    dataIndex: "typeName"
  },
  {
    title: "所属运营商",
    dataIndex: "productName"
  },
  {
    title: "商品名称",
    dataIndex: "point"
  },
  {
    title: "库存",
    dataIndex: "price"
  },
  {
    title: "售价",
    dataIndex: "stock"
  },
  {
    title: "购物返利",
    dataIndex: "merchantName"
  },
  {
    title: "管理佣金",
    dataIndex: "merchantName1"
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
  name: "Fenxiao",
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
      countTotal: 0,
      merchantList: [],
      fileList: []
    };
  },
  created() {
    this.providerId =
      sessionStorage.getItem("PROCIDERID") ||
      this.$route.query.providerId ||
      "1215431996629494";
    this.merchantListFun(
      sessionStorage.getItem("PROCIDERID") ||
        this.providerId ||
        "1215431996629494"
    );
    this.productList();
  },
  mounted() {},
  methods: {
    submit() {
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
        query: { providerId: "1215431996629494", productId: e.productId }
      });
    },
    xiajia(e) {
      this.$axios({
        url: "/endpoint/product/offline.json",
        method: "post",
        processData: false,
        data: { productId: e.productId }
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
    productList(merchantId, type, name, tag) {
      let data = {
        pageNo: this.pageNo,
        pageSize: 10,
        providerId: this.providerId,
        merchantId: merchantId || "",
        type: type || "",
        tag: tag || "",
        name: name || "",
        putAway: 1
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
