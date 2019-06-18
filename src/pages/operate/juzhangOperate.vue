<template>
  <a-card>
    <div>
      <div>
        <a-form layout="horizontal">
          <div>
            <a-row>
              <a-col :md="8" :sm="24">
                <a-form-item label="选择日期" :labelCol="{span: 5}" :wrapperCol="{span: 18, offset: 1}">
                  <a-range-picker @change="onChange" />
                </a-form-item>
              </a-col>
              <a-col :md="8" :sm="24">
                <a-form-item label="排序方式" :labelCol="{span: 5}" :wrapperCol="{span: 18, offset: 1}">
                  <a-select placeholder="请选择" :defaultValue="'PASS'" @change="merchantChange">
                    <a-select-option :key="'PASS'">申请时间</a-select-option>
                    <a-select-option :key="'COMMISSION'">返佣金额</a-select-option>
                    <a-select-option :key="'SUBORDINATE'">下级桔长数</a-select-option>
                    <a-select-option :key="'SHARE'">分享次数</a-select-option>
                    <a-select-option :key="'INVITE'">拉新人数</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :md="8" :sm="24">
                <span style="float: right; margin-top: 3px;">
                  <a-button type="primary" @click="submit">查询</a-button>
                </span>
              </a-col>
            </a-row>
          </div>

        </a-form>
      </div>
      <div>
        <a-table :columns="columns" :dataSource="data" :pagination="false" :locale="{emptyText: '暂无数据'}">
          <span slot="action" slot-scope="text, record">
            <a @click="xiangqingList(record)">查看详情</a>
            <a-divider v-if="!record.allowDistribute" type="vertical" />
            <a v-if="!record.allowDistribute" @click="pass(record)">通过</a>
          </span>
        </a-table>
        <div style="margin-top:20px;">
          <a-pagination style="float:right" @change="paginationChange" :current="pageNo" :pageSize="10" :total="countTotal" />
        </div>
        <a-modal
        title="桔长详情"
        v-model="visible1">
          <template slot="footer">
            <a-button key="back" @click="handleCancel1" :disabled="item.allowDistribute ? true : false">拒绝</a-button>
            <a-button key="submit" type="primary" @click="handleOk1" :disabled="item.allowDistribute ? true : false">通过审核</a-button>
          </template>
          <div class="dis-flex">
            <img class="img-avatar" :src="itemDetail.avatar" alt="">
            <div class="c1 p-l20">
              <div>{{itemDetail.nickName}}</div>
              <div class="c2 f-s13">微信号: {{itemDetail.wechatId ? itemDetail.wechatId : '--'}}</div>
              <div class="c2 f-s13">{{itemDetail.phone}}</div>
              <div class="c2 f-s13">上级桔长：{{itemDetail.parentNickName ? itemDetail.parentNickName : '暂无'}}</div>
              <div class="pd-t20">
                <!-- &nbsp; &nbsp; 年龄: -- -->
                <p>性别: {{itemDetail.gender == 1 ? '男' : '女'}} </p>
                <p>所在城市: {{itemDetail.city ? itemDetail.city : '--'}}</p>
                <p>职业: {{itemDetail.profession ? itemDetail.profession : '--'}}</p>
                <p>相关经验: {{itemDetail.experience ? itemDetail.experience : '无相关经验'}}</p>
              </div>
            </div>
          </div>
        </a-modal>
      </div>
    </div>
  </a-card>
</template>

<script>
import StandardTable from "../../components/table/StandardTable";
const columns = [
  {
    title: "排名",
    dataIndex: "idx"
  },
  {
    title: "桔长微信昵称",
    dataIndex: "nickName"
  },
  {
    title: "申请时间",
    dataIndex: "applyTime"
  },
  {
    title: "手机号",
    dataIndex: "phone"
  },
  {
    title: "下级桔长数",
    dataIndex: "subordinateNum"
  },
  {
    title: "分享次数",
    dataIndex: "shareCount"
  },
  {
    title: "拉新人数",
    dataIndex: "inviteCount"
  },
  {
    title: "返佣金额",
    dataIndex: "commissionAmount"
  },
  {
    title: "操作",
    key: "action",
    scopedSlots: { customRender: "action" }
  }
];

export default {
  name: "juzhangOperate",
  components: { StandardTable },
  data() {
    return {
      advanced: true,
      columns: columns,
      data: [],
      pageNo: 1,
      countTotal: 10,
      sortType: "PASS",
      dateStart:'',
      dateEnd:'',
      visible1: false,
      item: {},
      itemDetail: {},
    };
  },
  created() {
    this.distributorSummaryList()
  },
  methods: {
    paginationChange(e) {
      this.pageNo = e;
      this.distributorSummaryList();
    },
    xiangqingList(e) {
      console.log(e);
      this.item = e;
      this.visible1 = true;
      this.$axios({
        url: "/endpoint/statistic/distributorInfo.json",
        method: "get",
        processData: false,
        params: {openId: e.openId}
      }).then(res => {
        if (res.success) {
          this.itemDetail = res.data;
        } else {
          this.$error({
            title: "温馨提示",
            content: res.errorInfo
          });
        }
      });
    },
    handleCancel1() {
      this.$axios({
        url: "/endpoint/statistic/reject.json",
        method: "get",
        processData: false,
        params: {openid: this.item.openId}
      }).then(res => {
        if (res.success) {
          this.$success({
            content: "操作成功"
          });
          this.visible1 = false;
          this.distributorSummaryList()
        } else {
          this.$error({
            title: "温馨提示",
            content: res.errorInfo
          });
        }
      });
    },
    handleOk1() {
      this.pass(this.item);
      this.visible1 = false;
    },
    pass(e) {
      console.log(e);
      this.$axios({
        url: "/endpoint/statistic/pass.json",
        method: "get",
        processData: false,
        params: {openid: e.openId}
      }).then(res => {
        if (res.success) {
          this.$success({
            content: "操作成功"
          });
          this.distributorSummaryList()
        } else {
          this.$error({
            title: "温馨提示",
            content: res.errorInfo
          });
        }
      });
    },
    merchantChange(e) {
      this.sortType = e;
    },
    onChange(dates, dateStrings) {
      this.dateStart = dateStrings[0];
      this.dateEnd = dateStrings[1];
    },
    submit(){
      this.distributorSummaryList();
    },
    distributorSummaryList(){
      let data = {
        pageNo: this.pageNo || 1,
        pageSize: 10,
        dateStart:this.dateStart,
        dateEnd:this.dateEnd,
        sortType:this.sortType
      };
      let that = this;
      this.$axios({
        url: "/endpoint/statistic/distributorSummary.json",
        method: "get",
        processData: false,
        params: data
      }).then(res => {
        if (res.success) {
          this.data =res.data.list;
          this.countTotal = res.data.countTotal;
          this.data.forEach(function(i){
            i.commissionAmount = that.accurate_div(i.commissionAmount * 1, 100);
          })
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

.orderpage_detail_list table {
  border-spacing: 0;
  border: solid #d9d9d9;
  border-width: 1px 0px 0px 1px;
  padding: 0;
}

.orderpage_detail_list tr td {
  line-height: 38px;
  height: 38px;
  border: solid #d9d9d9;
  border-width: 0px 1px 1px 0px;
  text-align: center;
  padding: 0;
}

.orderpage_detail_list tr td:nth-child(2n-1) {
  color: #999999;
  background-color: #f4f4f4;
  width: 150px;
}
.existingGroups-table {
  width: 100%;
  text-align: center;
}
.existingGroups-table tr {
  height: 40px;
  line-height: 40px;
}
.existingGroups-table thead tr {
  background: #f2f2f2;
}
.dis-flex {
  display: flex;
}
.img-avatar {
  width: 60px;
  height: 60px;
  border-radius: 50%;
}
.c1 {
  color: #222222;
}
.c2 {
  color: #777;
}
.p-l20 {
  padding-left: 20px;
}
.pd-t20 {
  padding-top: 20px;
}
.f-s13 {
  font-size: 13px;
}
</style>
