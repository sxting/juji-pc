<template>
  <a-card>
    <div v-if="showBoolean">
      <!-- <div><span>{{effective}}</span></div> -->
      <a-tabs @change="tabFun">
        <a-tab-pane tab="待分销商品" key="0"></a-tab-pane>
        <a-tab-pane tab="分销商品" key="1"></a-tab-pane>
      </a-tabs>
      <a-form layout="horizontal" :autoFormCreate="(form) => this.form = form">
        <div>
          <a-row>
            <a-col :md="10" :sm="24">
              <a-form-item label="所属运营商" :labelCol="{span: 7}" fieldDecoratorId="repository.providerId" :wrapperCol="{span: 16, offset: 1}">
                <a-select placeholder="请选择">
                  <a-select-option value="">全部运营商</a-select-option>
                  <a-select-option v-for="(item) in providerList" :key="item.providerId">{{item.providerName}}</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-item label="商品名称" :labelCol="{span: 5}" fieldDecoratorId="repository.productName" :wrapperCol="{span: 18, offset: 1}">
                <a-input style="width: 100%" placeholder="请输入" />
              </a-form-item>
            </a-col>
            <span style="float: right; margin-top: 3px;">
              <a-button type="primary" @click="chaxun">查询</a-button>
            </span>
          </a-row>

        </div>
      </a-form>
      <div>
        <a-table :columns="columns" :dataSource="data2" :pagination="false" :locale="{emptyText: '暂无数据'}">
          <span slot="action" slot-scope="text, record">
            <a @click="bianji(record)">{{effective === '1'?'查看详情':'分销推广'}}</a>
          </span>
        </a-table>
        <div style="margin-top:20px;">
          <a-pagination style="float:right" @change="onChange" :current="pageNo" :pageSize="10" :total="countTotal" />
        </div>
      </div>
    </div>

    <div v-if="!showBoolean">
      <!-- <div><span>{{effective}}</span></div> -->
      <a-button @click="back">返回</a-button>
      <div>
        <a-form layout="horizontal" @submit="submit" :autoFormCreate="(form) => this.form = form">
          <a-card title="商品信息" style="margin-top:20px">
            <a-form-item label="商品名称" :labelCol="{span: 7}" :wrapperCol="{span: 10}">
              {{detail.productName}}
            </a-form-item>
          </a-card>
          <a-card title="分佣设置" style="margin-top:20px">

            <a-table :dataSource="guigeDataSource" :columns="guigeColumns" :pagination="false">
              <template v-for="(col, i) in ['name', 'originp', 'currentp', 'costp', 'sharedp', 'salesRate', 'manageRate', 'platform', 'provider']" :slot="col" slot-scope="text, record, index">
                <div :key="col">
                  <div class="disflex" v-if="guigeColumns[i].editable">
                    <a-input
                    style="margin: -5px 0; width: 80px;"
                    :value="text"
                    @change="e => handleChange(e.target.value, record.key, col)"
                    @blur="e => handleBlur(e.target.value, record.key, col)"
                    />
                    <span v-if="guigeColumns[i].rate"> % </span>
                    <span class="w40" v-if="i == 5">{{record.salesp}}</span>
                    <span class="w40" v-if="i == 6">{{record.managep}}</span>
                  </div>
                  <template v-else>{{text}}</template>
                </div>
              </template>
            </a-table>

            <!--
            <a-form-item label="销售返利" :labelCol="{span: 7}" :wrapperCol="{span: 10}">
              <a-input-number v-model="salesRateStr" :min="5" style="margin-right:5px;" :max="100" @blur="salesRateStrFun($event)" />%
              <span style="margin-left:20px;">{{salesRateStrAmount/100}}元</span>
            </a-form-item>
            <a-form-item label="管理佣金" :labelCol="{span: 7}" :wrapperCol="{span: 10}">
              <a-input-number v-model="manageRateStr" :min="1" style="margin-right:5px;" :max="100" @blur="manageRateStrFun($event)" />%
              <span style="margin-left:20px;">{{manageRateStrAmount/100}}元</span>
            </a-form-item>
            <div v-for="(item) in detail.estimateSettlements" :key="item.settlementType"  >
                <a-form-item v-if="!item.boolean" :label="item.name" :labelCol="{span: 7}" :wrapperCol="{span: 10}">
                  <span><span style="margin-right:20px;">{{item.rate}}%</span> {{item.estimateAmount/100}}元</span>
                </a-form-item>
            </div> -->

          </a-card>
          <a-card title="推广素材" style="margin-top:20px">
            <a-form-item label="推广文案" :labelCol="{span: 7}" :wrapperCol="{span: 10}">
              <a-textarea type="text" maxlength="100" v-model="descriptions" @change="descriptionsFun($event.target.value)" class="desc_textarea" placeholder=""></a-textarea>
            </a-form-item>
            <a-form-item label="推广图片" :labelCol="{span: 7}" :wrapperCol="{span: 10}">
              <a-upload listType="picture-card" :fileList="fileList" :showUploadList="{showPreviewIcon:false,showRemoveIcon:true}" :beforeUpload="beforeUpload" :customRequest="nzCustomRequestFun" @change="handleChange1($event)">
                <div v-if="fileList.length < 6">
                  <a-icon type="plus" />
                  <div class="ant-upload-text">上传图片</div>
                </div>
              </a-upload>
            </a-form-item>
          </a-card>
          <a-form-item :wrapperCol="{span: 10, offset: 7}">
            <a-button @click="submit">提交</a-button>
            <a-button style="margin-left:20px" v-if="effective === '1'" @click="stopFX">停止分销</a-button>
          </a-form-item>
        </a-form>

      </div>
    </div>
  </a-card>
</template>

<script>
import StandardTable from "../../components/table/StandardTable";
const columns1 = [
  {
    title: "上架时间",
    dataIndex: "date"
  },
  {
    title: "所属运营商",
    dataIndex: "providerName"
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
    title: "操作",
    key: "action",
    scopedSlots: {
      customRender: "action"
    }
  }
];
const columns2 = [
  {
    title: "上架时间",
    dataIndex: "date"
  },
  {
    title: "所属运营商",
    dataIndex: "providerName"
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
    title: "购物返利(元)",
    dataIndex: "SALESAmount"
  },
  {
    title: "管理佣金(元)",
    dataIndex: "MANAGERAmount"
  },
  {
    title: "操作",
    key: "action",
    scopedSlots: {
      customRender: "action"
    }
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

const guigeColumns = [
  {
    title: '规格名称',
    dataIndex: 'name',
    scopedSlots: { customRender: 'name' },
  }, {
    title: '原价(元)',
    dataIndex: 'originp',
    scopedSlots: { customRender: 'originp' },
  }, {
    title: '售价(元)',
    dataIndex: 'currentp',
    scopedSlots: { customRender: 'currentp' },
  }, {
    title: '底价(元)',
    dataIndex: 'costp',
    scopedSlots: { customRender: 'costp' },
  }, {
    title: '分享价(元)',
    dataIndex: 'sharedp',
    scopedSlots: { customRender: 'sharedp' },
    editable: true
  }, {
    title: '销售返利(%/元)',
    dataIndex: 'salesRate',
    scopedSlots: { customRender: 'salesRate' },
    editable: true,
    rate: true
  }, {
    title: '管理佣金(%/元)',
    dataIndex: 'manageRate',
    scopedSlots: { customRender: 'manageRate' },
    editable: true,
    rate: true
  }
  // , {
  //   title: '平台抽佣',
  //   dataIndex: 'platform',
  //   scopedSlots: { customRender: 'platform' },
  // }, {
  //   title: '代理商分佣(元)',
  //   dataIndex: 'provider',
  //   scopedSlots: { customRender: 'provider' },
  // }
]
const guigeDataSource = []

export default {
  name: "Fenxiao",
  components: {
    StandardTable
  },
  data() {
    return {
      columns: columns1,
      dataSource: dataSource,
      guigeColumns: guigeColumns,
      guigeDataSource: guigeDataSource,
      selectedRowKeys: [],
      selectedRows: [],
      data2: data2,
      pageNo: 1,
      pageSize: 10,
      providerId: "",
      countTotal: 0,
      merchantList: [],
      fileList: [],
      productId: "",
      providerList: [],
      showBoolean: true,
      detail: {
        productName: ""
      },
      descriptions: "",
      salesRateStr: 5,
      manageRateStr: 1,
      effective: '0',
      salesRateStrAmount:0,
      manageRateStrAmount:0,
    };
  },
  created() {
    this.providerList = JSON.parse(
      sessionStorage.getItem("LoginDate")
    ).providerList;
    // this.providerId = this.providerList[0].providerId;
    this.$nextTick(() => {
      this.form.setFieldsValue({
        repository: {
          providerId: "",
          productName: ""
        }
      });
    });
    this.productList();
  },
  mounted() {},
  methods: {
    back() {
      this.providerId = '';
      this.effective = '0';
      this.columns = columns1;
      this.showBoolean = true;
      this.productList();
    },
    handleChange (value, key, column) {
      const newData = [...this.guigeDataSource]
      const target = newData.filter(item => key === item.key)[0];
      if (target) {
        target[column] = value
        this.guigeDataSource = newData
      }
    },
    handleBlur(value, key, column) {
      const newData = [...this.guigeDataSource]
      const target = newData.filter(item => key === item.key)[0];
      if(column == 'salesRate' || column == 'manageRate') {
        if(/^[0-9]*$/.test(value)) {
          this.fenyongFun(target)
        } else {
          console.log('数据格式错误');
        }
      }
    },
    stopFX() {
      let data = {
        productId: this.productId
      };
      this.$axios({
        url: "/endpoint/distributor/product/stopped.json",
        method: "get",
        processData: false,
        params: data
      }).then(res => {
        if (res.success) {
          this.showBoolean = true;
          this.effective = '0';
          this.productList();
        } else {
          this.$error({
            title: "温馨提示",
            content: res.errorInfo
          });
        }
      });
    },
    chaxun() {
      let that = this;
      this.form.validateFields((err, values) => {
        that.providerId = values.repository.providerId;
        that.productName = values.repository.productName;
      });
      this.productList();
    },
    descriptionsFun(e) {
      this.descriptions = e;
    },
    salesRateStrFun(e){
      this.salesRateStr =  e.target.value;
      this.fenyongFun()
    },
    manageRateStrFun(e){
      this.manageRateStr = e.target.value;
      this.fenyongFun()
    },
    fenyongFun(item) {
        let data = {
          productId: this.productId,
          manageRateStr: item.manageRate,
          salesRateStr: item.salesRate,
          skuId: item.skuId
        };
        let that = this;
        this.$axios({
          url: "/endpoint/distributor/product/calculateEstimateSettlement.json",
          method: "get",
          processData: false,
          params: data
        }).then(res => {
          if (res.success) {
            res.data.forEach(function(i) {
              if (i.settlementType === "MERCHANT") i.boolean = true;
              that.guigeDataSource.forEach(function(item2, index) {
                if(item.skuId == item2.skuId) {
                  if (i.settlementType === "DISTRIBUTOR_SALES_REBATE"){
                    // that.salesRateStr = i.rate;
                    i.name = "销售返利";
                    i.boolean = true;
                    item2.salesp = i.estimateAmount/100;
                  }
                  if (i.settlementType === "DISTRIBUTOR_MANAGER_REBATE"){
                    i.name = "管理佣金";
                    // that.manageRateStr = i.rate;
                    i.boolean = true;
                    item2.managep = i.estimateAmount/100;
                  }
                }
              })
              // if (i.settlementType === "JUJI_PLATFORM") i.name = "平台抽佣"; //平台抽佣
              // if (i.settlementType === "PROVIDER") i.name = "代理商分佣比例"; //代理商分佣比例
            });
          } else {
            this.$error({
              title: "温馨提示",
              content: res.errorInfo
            });
          }
        });
    },
    handleChange1({ fileList }) {
      this.fileList = fileList;
    },
    tabFun(e) {
      this.effective = e;
      if(e === '0') {
        this.columns = columns1
      } else {
        this.columns = columns2
      }
      this.pageNo = 1;
      this.productList();
    },
    submit() {
      let picIds = "";
      if (this.fileList && this.fileList.length > 0) {
        this.fileList.forEach(function(m) {
          picIds += (m.response ? m.response : m.name) + ",";
        });
        picIds = picIds.slice(0, picIds.length - 1);
      }
      let itemSkus = [];
      let that = this;
      this.guigeDataSource.forEach(function(item, index) {
        itemSkus[index] = {
          itemSkuId: item.skuId,
          manageRateStr: item.manageRate,
          saleRateStr: item.salesRate,
          sharePrice: that.accurate_mul(item.sharedp, 100)
        }
      });
      let data = {
        itemId: this.productId,
        descriptions: this.descriptions,
        picIds: picIds,
        providerId: this.providerId,
        itemType: 'PRODUCT',
        itemSkus: itemSkus
      };
      let url = "/endpoint/distributor/product/create.json";
      let url2 = "/endpoint/distributor/product/modify.json";
      console.log(data);
      this.$axios({
        url: this.effective === '0' ? url : url2,
        method: "post",
        processData: false,
        data: data
      }).then(res => {
        if (res.success) {
          this.showBoolean = true;
          this.effective = '0';
          this.productList();
        } else {
          this.$error({
            title: "温馨提示",
            content: res.errorInfo
          });
        }
      });
    },
    bianji(e) {
      console.log(e);
      this.showBoolean = false;
      this.productId = e.productId;
      this.providerId = e.providerId
      this.productDetail(e.productId);
    },
    beforeUpload(file) {
      const isLt2M = file.size / 1024 / 1024 < 10;
      if (!isLt2M) {
        this.$message.error("上传图片大小必须小于10MB!");
      }
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
        query: {
          providerId: "1215431996629494"
        }
      });
    },
    handleMenuClick(e) {
      if (e.key === "delete") {
        this.remove();
      }
    },
    nzCustomRequestFun(e) {
      const formData = new FormData();
      formData.append("multipartFile", e.file, e.file.name);
      this.$axios({
        url: "https://juji.juniuo.com//upload/image.json",
        method: "post",
        processData: false,
        data: formData,
        type: "formData"
      }).then(res => {
        if (res.errorCode === "0") {
          e.onProgress(res, e.file);
          e.onSuccess(res["data"], e.file, res);
        } else {
          this.$error({
            title: "温馨提示",
            content: res.errorInfo + "请稍后重新上传"
          });
          e.onError(res.errorInfo, e.file);
        }
      });
    },
    onChange(e) {
      this.pageNo = e;
      this.productList();
    },
    productDetail(productId) {
      let data = {
        productId: productId
      };
      let that = this;
      this.$axios({
        url: "/endpoint/distributor/product/detail.json",
        method: "get",
        processData: false,
        params: data
      }).then(res => {
        if (res.success) {
          this.detail = res.data;

          let guigeDataSource = [];
          this.detail.skuList.forEach(function(item1, index1) {
            item1.estimateSettlements.forEach(function(item2, index2) {
              if (item2.settlementType === "DISTRIBUTOR_SALES_REBATE"){
                item1.salesRateStr = item2.rate;
                item1.name = "销售返利";
                item1.boolean = true;
                item1.salesRateStrAmount = item2.estimateAmount/100;
              }
              if (item2.settlementType === "DISTRIBUTOR_MANAGER_REBATE"){
                item1.boolean = true;
                item1.name = "管理佣金";
                item1.manageRateStr = item2.rate;
                item1.manageRateStrAmount = item2.estimateAmount/100;
              }
              // if (item2.settlementType === "JUJI_PLATFORM") item1.name = "平台抽佣"; //平台抽佣
              // if (item2.settlementType === "PROVIDER") item1.name = "代理商分佣比例"; //代理商分佣比例
            })
            guigeDataSource[index1] = {
              key: index1,
              name: item1.skuName,
              originp: item1.originalPrice/100,
              currentp: item1.salePrice/100,
              costp: item1.costPrice/100,
              sharedp: item1.sharePrice ? item1.sharePrice/100 : 0,
              salesRate: item1.salesRateStr ? item1.salesRateStr : 0,
              manageRate: item1.manageRateStr ? item1.manageRateStr : 0,
              platform: '0',
              provider: '0',
              salesp: item1.salesRateStrAmount ? item1.salesRateStrAmount : 0,
              managep: item1.manageRateStrAmount ? item1.manageRateStrAmount : 0,
              skuId: item1.skuId
            };
          })
          this.guigeDataSource = guigeDataSource;

          // this.detail.estimateSettlements.forEach(function(i) {
          //   if (i.settlementType === "MERCHANT") i.boolean = true;
          //   if (i.settlementType === "DISTRIBUTOR_SALES_REBATE"){
          //         that.salesRateStr = i.rate;
          //         i.name = "销售返利";
          //         i.boolean = true;
          //       that.salesRateStrAmount = i.estimateAmount;
          //     }
          //     if (i.settlementType === "DISTRIBUTOR_MANAGER_REBATE"){
          //       i.boolean = true;
          //       i.name = "管理佣金";
          //       that.manageRateStr = i.rate;
          //       that.manageRateStrAmount = i.estimateAmount;
          //     }
          //   if (i.settlementType === "JUJI_PLATFORM") i.name = "平台抽佣"; //平台抽佣
          //   if (i.settlementType === "PROVIDER") i.name = "代理商分佣比例"; //代理商分佣比例
          // });

          this.descriptions = res.data.descriptions;
          let fileList2 = res.data.picIds;
          if (fileList2 && fileList2.length > 0) {
            let fileList = [];
            fileList2.forEach(function(n, m) {
              fileList.push({
                uid: m + "1",
                name: n,
                status: "done",
                url: that.picUrl(n)
              });
            });
            this.fileList = fileList;
          } else {
            this.fileList = [];
          }
        } else {
          this.$error({
            title: "温馨提示",
            content: res.errorInfo
          });
        }
      });
    },
    picUrl(id) {
      return (
        "https://upic.juniuo.com/file/picture/" + id + "/resize_85_85/mode_fill"
      );
    },
    productList() {
      let data = {
        pageNo: this.pageNo,
        pageSize: 10,
        effective: this.effective,
        providerId: this.providerId,
        productName: this.productName
      };
      if (!data.productName) delete data.productName;
      let that = this;
      this.$axios({
        url: "/endpoint/distributor/product/list.json",
        method: "get",
        processData: false,
        params: data
      }).then(res => {
        if (res.success) {
          this.data2 = res.data.list;
          this.countTotal = res.data.totalRows;
          this.data2.forEach(function(i) {
            that.providerList.forEach(function(n) {
              if (n.providerId === i.providerId)
                i.providerName = n.providerName;
            });
            if(that.effective === '1') {
              let SALESAmountArr = [], MANAGERAmountArr = [];
              i.skuList.forEach(function(s) {
                s.estimateSettlements.forEach(function(m) {
                  if (m.settlementType === "DISTRIBUTOR_MANAGER_REBATE")
                    MANAGERAmountArr.push(that.accurate_div(m.estimateAmount, 100))
                  if (m.settlementType === "DISTRIBUTOR_SALES_REBATE")
                    SALESAmountArr.push(that.accurate_div(m.estimateAmount, 100))
                })
              });
              let SALESAmountL= SALESAmountArr[0], SALESAmountS = SALESAmountArr[0], MANAGERAmountL = MANAGERAmountArr[0], MANAGERAmountS = MANAGERAmountArr[0];
              SALESAmountArr.forEach(function(item) {
                if(item > SALESAmountL) {
                  SALESAmountL = item;
                }
                if(item < SALESAmountS) {
                  SALESAmountS = item;
                }
              });
              MANAGERAmountArr.forEach(function(item) {
                if(item > MANAGERAmountL) {
                  MANAGERAmountL = item;
                }
                if(item < MANAGERAmountS) {
                  MANAGERAmountS = item;
                }
              });
              if(SALESAmountL == SALESAmountS) {
                i.SALESAmount = SALESAmountL;
              } else {
                i.SALESAmount = SALESAmountS + '-' + SALESAmountL;
              }
              if(MANAGERAmountL == MANAGERAmountS) {
                i.MANAGERAmount = MANAGERAmountL;
              } else {
                i.MANAGERAmount = MANAGERAmountS + '-' + MANAGERAmountL;
              }
            }
            // {
            //   title: "购物返利(元)",
            //   dataIndex: "SALESAmount"
            // },
            // {
            //   title: "管理佣金(元)",
            //   dataIndex: "MANAGERAmount"
            // },
            // i.estimateSettlements.forEach(function(m) {
            //   if (m.settlementType === "DISTRIBUTOR_MANAGER_REBATE")
            //     i.MANAGERAmount = that.accurate_div(m.estimateAmount, 100);
            //   if (m.settlementType === "DISTRIBUTOR_SALES_REBATE")
            //     i.SALESAmount = that.accurate_div(m.estimateAmount, 100);
            //   if (m.settlementType === "JUJI_PLATFORM")
            //     i.PLATFORMAmount = that.accurate_div(m.estimateAmount, 100);
            // });
            i.price = that.accurate_div(i.price, 100);
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

.disflex {
  display: flex;
}

.w40 {
  width: 40px;
  margin-left: 10px;
}

@media screen and (max-width: 900px) {
  .fold {
    width: 100%;
  }
}
</style>
