<template>
  <div>
    <a-card :body-style="{padding: '24px 32px'}" :bordered="false">
      <a-form>
        <a-form-item label="运营商" :labelCol="{span: 5}" :wrapperCol="{span: 10}">
          <a-select :value="selectedProvider" @change="providerChange($event)">
            <a-select-option v-for="(item,index) in providerList" :key="index" :value="item.id"></a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="商家名称" :labelCol="{span: 5}" :wrapperCol="{span: 10}">
          <a-select :value="selectedMerchant" @change="merchantChange($event)">
            <a-select-option v-for="(item,index) in merchantList" :key="index" :value="item.id"></a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="赠送商品" :labelCol="{span: 5}" :wrapperCol="{span: 18}">
            <a-transfer
            :dataSource="mockData"
            showSearch
            :targetKeys="targetKeys"
            @change="handleChange"
            :render="item=>item.title"
            :titles="titlesArr"
            :listStyle="{
              width: 'auto',
              minWidth: '200px'
            }">
          </a-transfer>
        </a-form-item>

        <a-form-item :wrapperCol="{span: 19, offset: 5}">
          <a-button type="primary" @click="submit">保存</a-button>
        </a-form-item>
      </a-form>
    </a-card>
  </div>
</template>

<script>
export default {
  name: 'CooperationAdd',
  components: {},
  data() {
    return {
      providerList: [],
      merchantList: [],
      selectedProvider: '',
      selectedMerchant: '',
      mockData: [],
      targetKeys: [],
      titlesArr: ['全部购买送会员商品', '赠送商品']
    }
  },
  created() {
    this.getMock()
  },
  methods: {
    providerChange(e) {

    },
    merchantChange(e) {

    },
    getMock() {
      const targetKeys = [];
      const mockData = [];
      for (let i = 0; i < 20; i++) {
        const data = {
          key: i.toString(),
          title: `contentcontentcontentcontent${i + 1}`,
          description: `description of content${i + 1}`,
          chosen: Math.random() * 2 > 1,
        };
        if (data.chosen) {
          targetKeys.push(data.key);
        }
        mockData.push(data);
      }
      this.mockData = mockData
      // this.targetKeys = targetKeys
    },
    handleChange(targetKeys, direction, moveKeys) {
      console.log(targetKeys, direction, moveKeys);
      this.targetKeys = targetKeys
    },

    submit() {

    }
  },
}

</script>

<style lang="less" scoped>

</style>
