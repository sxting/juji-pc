<template>
  <div>
    <a-card :body-style="{padding: '24px 32px'}" :bordered="false">
      <a-form>
        <a-form-item label="运营商" :labelCol="{span: 5}" :wrapperCol="{span: 10}">
          <a-select v-model="providerId" placeholder="请选择" @change="providerChange($event)">
            <a-select-option v-for="(item,index) in providerList" :key="index" :value="item.providerId">
              {{item.providerName}}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="商家名称" :labelCol="{span: 5}" :wrapperCol="{span: 10}">
          <a-select v-model="merchantId">
            <a-select-option v-for="(item,index) in merchantList" :key="index" :value="item.id">
              {{item.name}}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="选择版本" :labelCol="{span: 5}" :wrapperCol="{span: 10}">
          <a-select @change="editionChange($event)" placeholder="请选择异业合作版本">
            <a-select-option value="MEMBER">会员版</a-select-option>
            <a-select-option value="GIFT">礼品版</a-select-option>
          </a-select>
        </a-form-item>

        <div>
          <a-form-item label="赠送礼品商品" :labelCol="{span: 5}" :wrapperCol="{span: 18}">
            <a-transfer
            :dataSource="mockData1"
            showSearch
            :targetKeys="targetKeys1"
            @change="handleChange1"
            :render="item=>item.title"
            :titles="titlesArr1"
            :listStyle="{
              width: 'auto',
              minWidth: '220px'
            }">
            </a-transfer>
          </a-form-item>

          <a-form-item label="礼品商品触发金额" :labelCol="{span: 5}" :wrapperCol="{span: 10}">
            <a-input placeholder="大于等于此金额触发营销支付" v-model="price1" />
          </a-form-item>
        </div>

        <div v-if="edition=='MEMBER'">
          <a-form-item label="赠送会员商品" :labelCol="{span: 5}" :wrapperCol="{span: 18}">
            <a-transfer
            :dataSource="mockData2"
            showSearch
            :targetKeys="targetKeys2"
            @change="handleChange2"
            :render="item=>item.title"
            :titles="titlesArr2"
            :listStyle="{
              width: 'auto',
              minWidth: '220px'
            }">
            </a-transfer>
          </a-form-item>

          <a-form-item label="会员商品触发金额" :labelCol="{span: 5}" :wrapperCol="{span: 10}">
            <a-input placeholder="大于等于此金额触发营销支付" v-model="price2" />
          </a-form-item>
        </div>

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
      providerId: '',
      merchantId: '',
      mockData1: [],
      mockData2: [],
      targetKeys1: [],
      targetKeys2: [],
      titlesArr1: ['全部礼品商品', '已选礼品商品'],
      titlesArr2: ['全部购买送会员商品', '已选赠送会员商品'],
      price1: '',
      price2: '',
      edition: ''
    }
  },
  created() {
    this.providerList = JSON.parse(
      sessionStorage.getItem("LoginDate")
    ).providerList;

    this.providerId = this.$route.query.providerId || this.providerList[0].providerId;
    this.merchantListFun();
  },
  methods: {
    providerChange(e) {
      this.merchantListFun();
    },
    editionChange(e) {
      this.edition = e;
      this.getProduct(e);
    },
    handleChange1(targetKeys, direction, moveKeys) {
      console.log(targetKeys, direction, moveKeys);
      this.targetKeys1 = targetKeys
    },
    handleChange2(targetKeys, direction, moveKeys) {
      console.log(targetKeys, direction, moveKeys);
      this.targetKeys2 = targetKeys
    },

    submit() {
      if (!this.edition) {
        this.$error({
          title: "温馨提示",
          content: "请选择版本"
        }); return;
      }

      let that = this;
      let products = [];
      this.targetKeys1.forEach(function(item) {
        products.push({
          type: 'GIFT',
          amount: that.accurate_mul(that.price1, 100),
          productId: item,
        })
      })
      this.targetKeys2.forEach(function(item) {
        products.push({
          type: 'MEMBER',
          amount: that.accurate_mul(that.price2, 100),
          productId: item,
        })
      })

      let data = {
        providerId: this.providerId,
        merchantId: this.merchantId,
        type: this.edition,
        products: products
      }
      this.$axios({
        url: "/endpoint/cross/create.json",
        method: "post",
        processData: false,
        data: data
      }).then(res => {
        if (res.success) {
          this.$router.push({
            path: "/product/CooperationList"
          });
        } else {
          this.$error({
            title: "温馨提示",
            content: res.errorInfo
          });
        }
      });
    },


    /*== service data ==*/

    // /endpoint/cross/products.json
    getProduct(type) {
      let data = {
        type: type,
        providerId: this.providerId
      };
      this.$axios({
        url: "/endpoint/cross/products.json",
        method: "get",
        processData: false,
        params: data
      }).then(res => {
        if (res.success) {
          if(type === 'GIFT') {
            let mockData1 = []
            res.data.GIFT.forEach(function(item) {
              mockData1.push({
                key: item.productId,
                title: item.productName
              })
            })
            this.mockData1 = mockData1;
          } else if(type === 'MEMBER') {
            let mockData1 = [], mockData2 = [];
            res.data.GIFT.forEach(function(item) {
              mockData1.push({
                key: item.productId,
                title: item.productName
              })
            })
            res.data.MEMBER.forEach(function(item) {
              mockData2.push({
                key: item.productId,
                title: item.productName
              })
            })
            this.mockData1 = mockData1;
            this.mockData2 = mockData2;
          }
        } else {
          this.$error({
            title: "温馨提示",
            content: res.errorInfo
          });
        }
      });
    },

    merchantListFun() {
      let data = {
        providerId: this.providerId
      };
      this.$axios({
        url: "/endpoint/juji/provider/merchant/list.json",
        method: "get",
        processData: false,
        params: data
      }).then(res => {
        if (res.success) {
          this.merchantList = res.data;
          this.merchantId = this.merchantList[0].id;
        } else {
          this.$error({
            title: "温馨提示",
            content: res.errorInfo
          });
        }
      });
    },
  },
}

</script>

<style lang="less" scoped>

</style>
