<template>
  <a-card>
    <div v-if="showTable">
      <div class="operator">
        <a-row>
          <a-col>
            <a-tabs @change="tabsFun">
              <a-tab-pane :tab="'待审核('+INITNUM+')'" key="INIT"></a-tab-pane>
              <a-tab-pane :tab="'已通过('+PASSNUM+')'" key="PASS"></a-tab-pane>
              <a-tab-pane :tab="'已拒绝('+REJECTNUM+')'" key="REJECT"></a-tab-pane>
            </a-tabs>
          </a-col>
        </a-row>

      </div>
      <div>
        <a-form layout="horizontal">
          <div>
            <a-row>
              <a-col :md="12" :sm="24">
                <a-form-item label="所属运营商" :labelCol="{span: 5}" :wrapperCol="{span: 18, offset: 1}">
                  <a-select placeholder="请选择" :value="providerId" @change="providerFun">
                    <a-select-option value="ALL">全部商家</a-select-option>
                    <a-select-option v-for="(item) in providerList" :key="item.providerId">{{item.providerName}}</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :md="12" :sm="24">
                <a-form-item label="商品类型" :labelCol="{span: 5}" :wrapperCol="{span: 18, offset: 1}">
                  <a-select placeholder="请选择" :value="productType" @change="productTypeFun">
                    <a-select-option value="ALL">全部类型</a-select-option>
                    <a-select-option value="PRODUCT">普通商品</a-select-option>
                    <a-select-option value="POINT">积分商品</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>

            </a-row>
            <a-row>
              <a-col :md="12" :sm="24">
                <a-form-item label="商品名称" :labelCol="{span: 5}" :wrapperCol="{span: 18, offset: 1}">
                  <a-input style="width: 100%" placeholder="请输入" :value="productName" @change="productNameFun" />
                </a-form-item>
              </a-col>
              <a-col :md="12" :sm="24">
                <span style="float: right; margin-top: 3px;">
                  <a-button htmlType="submit" @click="submit">查询</a-button>
                </span>
              </a-col>
            </a-row>
          </div>

        </a-form>
      </div>
      <div>

        <a-table :columns="columns" :dataSource="data" :pagination="false">
          <span slot="action" slot-scope="text, record">
            <a @click="chakan(record)">查看详情</a>
          </span>
        </a-table>
        <div style="margin-top:20px;">
          <a-pagination style="float:right" @change="onChange" :current="pageNo" :pageSize="10" :total="countTotal" />
        </div>
      </div>
    </div>
    <div v-else>
      <a-form-item label="商品类型" :labelCol="{span: 7}" :wrapperCol="{span: 10}">
        {{productInfo.type === "PRODUCT"?'普通商品':'积分商品'}}
      </a-form-item>
      <a-form-item label="商品标签" :labelCol="{span: 7}" :wrapperCol="{span: 10}">
        {{productInfo.tag}}
      </a-form-item>
      <a-form-item label="商品名称" :labelCol="{span: 7}" :wrapperCol="{span: 10}">
        {{productInfo.productName}}
      </a-form-item>
      <a-form-item label="结算价" :labelCol="{span: 7}" :wrapperCol="{span: 10}">
        {{productInfo.productName}}
      </a-form-item>
      <a-form-item label="原价" :labelCol="{span: 7}" :wrapperCol="{span: 10}">
        {{productInfo.productName}}
      </a-form-item>
      <a-form-item label="售价" :labelCol="{span: 7}" v-if="productInfo.type === 'PRODUCT'" :wrapperCol="{span: 10}">
        {{productInfo.price/100}}
      </a-form-item>
      <a-form-item label="售价" :labelCol="{span: 7}" v-if="productInfo.type === 'POINT'" :wrapperCol="{span: 10}">
        <div>
          桔子{{productInfo.point}}
          <span v-if="productInfo.price">+钱{{productInfo.price/100}}</span>
        </div>
      </a-form-item>
      <a-form-item label="商品首图" :labelCol="{span: 7}" :wrapperCol="{span: 10}">
        <div class="clearfix">
          <a-upload listType="picture-card" :showUploadList="{showPreviewIcon:false,showRemoveIcon:false}" :fileList="fileList1">
          </a-upload>
        </div>
      </a-form-item>
      <a-form-item label="商品图片" :labelCol="{span: 7}" :wrapperCol="{span: 10}" v-if="fileList2&&fileList2.length>0">
        <div class="clearfix">
          <a-upload listType="picture-card" :showUploadList="{showPreviewIcon:false,showRemoveIcon:false}" :fileList="fileList2">
          </a-upload>
        </div>
      </a-form-item>
      <a-form-item label="图文详情" :labelCol="{span: 7}" :wrapperCol="{span: 10}">
        <div v-for="(list, j) in picXQ" :key="j">
          <div class="clearfix" v-if="list.fileList&&list.fileList.length>0">
            <a-upload listType="picture-card" :showUploadList="{showPreviewIcon:false,showRemoveIcon:false}" :fileList="list.fileList">
            </a-upload>
          </div>
          <div v-else>未上传图片详情</div>
          <a-textarea rows="4" :disabled="true" :value="list.picIds" placeholder="未上传文字详情" />
        </div>

      </a-form-item>
      <a-form-item label="购买须知" :labelCol="{span: 7}" :wrapperCol="{span: 10}">
        <div class="marketing_means">
          <div class="edit_goods_infor clearfix">
            <div class="divUl clearfix">
              <div class="divLi clearfix">
                <div class="right-block fl descriptions">
                  <form class="descriptions_form" v-for="(list, j) in buyerNotes" :key="j">
                    <a-input type="text" maxlength="40" :disabled="true" class="juniu_input" :value="list.title" placeholder="未上传标题" />
                    <div class="details_list_box">
                      <div class="form_parent" style="position:relative;" v-for="(detail, noteIndex) in list.details" :key="noteIndex">
                        <a-textarea type="text" maxlength="1000" :disabled="true" class="desc_textarea" :value="detail.item" placeholder="未上传内容"></a-textarea>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </a-form-item>
      <a-form-item label="库存" :labelCol="{span: 7}" :wrapperCol="{span: 10}">
        {{productInfo.stock}}
      </a-form-item>
      <a-form-item label="使用有效期" :labelCol="{span: 7}" :wrapperCol="{span: 10}">
        {{productInfo.cutOffDays}}
      </a-form-item>
      <a-form-item label="购买限制" :labelCol="{span: 7}" :wrapperCol="{span: 10}" v-if="productInfo.limitPerOrderNum || productInfo.limitPerDayNum || productInfo.limitMaxNum">
        <div v-if="productInfo.limitPerOrderNum">
          每单最多购买{{productInfo.limitPerOrderNum}}个
        </div>
        <div v-if="productInfo.limitPerDayNum">
          每日最多购买{{productInfo.limitPerDayNum}}个
        </div>
        <div v-if="productInfo.limitMaxNum">
          每人最多购买{{productInfo.limitMaxNum}}个
        </div>
      </a-form-item>
      <a-form-item label="展示顺序" :labelCol="{span: 7}" :wrapperCol="{span: 10}" v-if="productInfo.idx">
        {{productInfo.idx}}
      </a-form-item>
      <a-form-item label="所属商家" :labelCol="{span: 7}" :wrapperCol="{span: 10}">
        {{productInfo.merchantName}}
      </a-form-item>
      <a-form-item label="审核结果" :labelCol="{span: 7}" :wrapperCol="{span: 10}">
        <a-radio-group v-model="tongguo">
          <a-radio value="0" v-if="status!=='REJECT'">通过</a-radio>
          <a-radio value="1">不通过</a-radio>
        </a-radio-group>
        <a-input v-if="tongguo==='1'" type="text" maxlength="40" v-model="butongguo" @change="butongguoFun" class="juniu_input" placeholder="请填写不通过原因" />
      </a-form-item>
      <a-form-item :wrapperCol="{span: 10, offset: 7}">
        <a-button htmlType="submit" style="margin-right:20px" @click="reviewedSubmit">提交</a-button>
        <a-button htmlType="submit" @click="quxiao">取消</a-button>

      </a-form-item>
    </div>
  </a-card>
</template>

<script>
import StandardTable from "../../components/table/StandardTable";
const columns = [
  {
    title: "提交时间",
    dataIndex: "dateCreated"
  },
  {
    title: "所属运营商",
    dataIndex: "providerName"
  },
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
    title: "操作",
    key: "action",
    scopedSlots: {
      customRender: "action"
    }
  }
];
const data = [];
const dataSource = [];

export default {
  name: "Reviewed",
  components: {
    StandardTable
  },
  data() {
    return {
      showTable: true,
      columns: columns,
      data: data,
      tongguo: "0",
      buyerNotes: [
        {
          title: "",
          details: [
            {
              item: ""
            }
          ]
        }
      ], //购买须知
      picXQ: [
        {
          fileList: [],
          picIds: ""
        }
      ], //图片详情
      fileList2: [],
      fileList1: [],
      pageNo: 1,
      butongguo: "",
      providerId: "ALL",
      countTotal: 1,
      productType: "ALL",
      status: "INIT",
      productName: "",
      productInfo: {},
      INITNUM: 0,
      PASSNUM: 0,
      REJECTNUM: 0,
      id: "",
      providerList: JSON.parse(sessionStorage.getItem("LoginDate")).providerList
    };
  },
  created() {
    this.reviewedList();
    
  },
  mounted() {},
  methods: {
    statuNum() {
      this.$axios({
        url: "/endpoint/product/audit/status.json",
        method: "get",
        processData: false
      }).then(res => {
        if (res.success) {
          this.INITNUM = res.data.INIT;
          this.PASSNUM = res.data.PASS;
          this.REJECTNUM = res.data.REJECT;
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
    quxiao() {
      this.showTable = true;
    },
    reviewedSubmit() {
      if (this.tongguo === "0") this.tongguoHttp();
      if (this.tongguo === "1") {
        if (!this.butongguo) {
          this.$error({
            title: "温馨提示",
            content: "请填写不通过原因"
          });
        } else {
          this.butongguoHttp();
        }
      }
    },
    tongguoHttp() {
      this.$axios({
        url: "/endpoint/product/audit/pass.json",
        method: "get",
        processData: false,
        params: {
          id: this.id
        }
      }).then(res => {
        if (res.success) {
          this.showTable = true;
          this.reviewedList();
        } else {
          this.$error({
            title: "温馨提示",
            content: res.errorInfo
          });
        }
      });
    },
    butongguoHttp() {
      this.$axios({
        url: "/endpoint/product/audit/reject.json",
        method: "get",
        processData: false,
        params: {
          id: this.id,
          reason: this.butongguo
        }
      }).then(res => {
        if (res.success) {
          this.showTable = true;
          this.reviewedList();
        } else {
          this.$error({
            title: "温馨提示",
            content: res.errorInfo
          });
        }
      });
    },
    chakan(e) {
      this.id = e.id;
      let that = this;
      this.$axios({
        url: "/endpoint/product/audit/record/info.json",
        method: "get",
        processData: false,
        params: {
          id: e.id
        }
      }).then(res => {
        if (res.success) {
          this.productInfo = res.data;
          this.showTable = false;
          this.fileList1 = [
            {
              uid: "-1",
              name: res.data.picId,
              status: "done",
              url: this.picUrl(res.data.picId)
            }
          ];
          this.buyerNotes = [];
          this.picXQ = [];
          let noteArr = JSON.parse(res.data.note);
          let picXQArr = JSON.parse(res.data.description);
          let fileList2 = res.data.picIds ? res.data.picIds.split(",") : [];
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
            this.fileList2 = fileList;
          } else {
            this.fileList2 = [];
          }
          if (noteArr && noteArr.length > 0) {
            noteArr.forEach(function(i) {
              let content = [];
              if (i.content) {
                i.content.forEach(function(n) {
                  content.push({
                    item: n
                  });
                });
                that.buyerNotes.push({
                  title: i.title,
                  details: content
                });
              }
            });
          } else {
            that.buyerNote = [
              {
                title: "",
                details: [
                  {
                    item: ""
                  }
                ]
              }
            ];
          }
          if (picXQArr && picXQArr.length > 0) {
            picXQArr.forEach(function(i) {
              let fileList = [];
              i.picIds.forEach(function(n, m) {
                fileList.push({
                  uid: m + "1",
                  name: n,
                  status: "done",
                  url: that.picUrl(n)
                });
              });
              that.picXQ.push({
                fileList: fileList,
                picIds: i.content[0]
              });
            });
          } else {
            that.picXQ = [
              {
                fileList: [],
                picIds: ""
              }
            ];
          }
        } else {
          this.$error({
            title: "温馨提示",
            content: res.errorInfo
          });
        }
      });
    },
    tabsFun(e) {
      this.status = e;
      this.reviewedList();
    },
    butongguoFun(e) {
      // console.log(e)
      // this.butongguo = e;
    },
    providerFun(e) {
      this.providerId = e;
    },
    productTypeFun(e) {
      this.productType = e;
    },
    productNameFun(e) {
      this.productName = e;
    },
    submit() {
      this.reviewedList();
    },
    onChange(e) {
      this.pageNo = e;
    },
    reviewedList() {
      let data = {
        pageNo: this.pageNo,
        pageSize: 10,
        providerId: this.providerId,
        productType: this.productType,
        status: this.status,
        body: this.productName
      };
      let that = this;
      if (!data.body) delete data.body;
      this.$axios({
        url: "/endpoint/product/audit/record/page.json",
        method: "get",
        processData: false,
        params: data
      }).then(res => {
        if (res.success) {
          this.data = res.data.list;
          this.countTotal = res.data.countTotal;
          this.statuNum();
          this.butongguo=''
          this.data.forEach(function(i) {
            i.price = that.accurate_div(i.price, 100);
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
