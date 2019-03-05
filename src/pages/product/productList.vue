<template>
    <a-card>
        <div :class="advanced ? 'search' : null">
            <a-form layout="horizontal">
                <div :class="advanced ? null: 'fold'">
                    <a-row>
                        <a-col :md="8" :sm="24">
                            <a-form-item label="商品类型" :labelCol="{span: 5}" :wrapperCol="{span: 18, offset: 1}">
                                <a-select placeholder="请选择">
                                    <a-select-option value="1">关闭</a-select-option>
                                    <a-select-option value="2">运行中</a-select-option>
                                </a-select>
                            </a-form-item>
                        </a-col>
                        <a-col :md="8" :sm="24">
                            <a-form-item label="所属商家" :labelCol="{span: 5}" :wrapperCol="{span: 18, offset: 1}">
                                <a-select placeholder="请选择">
                                    <a-select-option value="1">关闭</a-select-option>
                                    <a-select-option value="2">运行中</a-select-option>
                                </a-select>
                            </a-form-item>
                        </a-col>
                        <a-col :md="8" :sm="24">
                            <a-form-item label="商品标签" :labelCol="{span: 5}" :wrapperCol="{span: 18, offset: 1}">
                                <a-select placeholder="请选择">
                                    <a-select-option value="1">关闭</a-select-option>
                                    <a-select-option value="2">运行中</a-select-option>
                                </a-select>
                            </a-form-item>
                        </a-col>
                    </a-row>
                    <a-row v-if="advanced">
                        <a-col :md="8" :sm="24">
                            <a-form-item label="商品名称" :labelCol="{span: 5}" :wrapperCol="{span: 18, offset: 1}">
                                <a-input-number style="width: 100%" placeholder="请输入" />
                            </a-form-item>
                        </a-col>
                    </a-row>
                </div>
                <span style="float: right; margin-top: 3px;">
                    <a-button type="primary">查询</a-button>
                    <a-button style="margin-left: 8px">重置</a-button>
                    <a @click="toggleAdvanced" style="margin-left: 8px">
                        {{advanced ? '收起' : '展开'}}
                        <a-icon :type="advanced ? 'up' : 'down'" />
                    </a>
                </span>
            </a-form>
        </div>
        <div>
            <div class="operator">
                <a-button @click="addNew" type="primary">新增商品</a-button>
            </div>
            <a-table :columns="columns" :dataSource="data2">
                <span slot="action" slot-scope="text, record">
                    <a href="javascript:;">编辑</a>
                    <a-divider type="vertical" />
                    <a href="javascript:;" class="ant-dropdown-link">
                        下架
                    </a>
                </span>
            </a-table>
        </div>
    </a-card>
</template>

<script>
import StandardTable from "../../components/table/StandardTable";
const columns = [
  {
    title: "商品类型",

    dataIndex: "name"
  },
  {
    title: "商品名称",
    dataIndex: "age"
  },
  {
    title: "所需桔子",
    dataIndex: "address"
  },
  {
    title: "售价",
    dataIndex: "address1"
  },
  {
    title: "当前库存",
    dataIndex: "address2"
  },
  {
    title: "所属商家",
    dataIndex: "address3"
  },
  {
    title: "操作",
    key: "action",
    scopedSlots: { customRender: "action" }
  }
];
const data2 = [{
  key: '1',
  name: 'John Brown',
  age: 32,
  address: 'New York No',
  address1: 'New York No',
  address2: 'New York No',
  address3: 'New York No',
  
}];
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
      columns: columns,
      dataSource: dataSource,
      selectedRowKeys: [],
      selectedRows: [],
      data2:data2
    };
  },
  methods: {
    toggleAdvanced() {
      this.advanced = !this.advanced;
    },
    onchange(selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys;
      this.selectedRows = selectedRows;
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
      this.$router.push('/product/addProduct')
    },
    handleMenuClick(e) {
      if (e.key === "delete") {
        this.remove();
      }
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
