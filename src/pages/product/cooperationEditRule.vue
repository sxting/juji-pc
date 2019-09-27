<template>
  <a-card>
    <div class="sub-title">门店名称: {{storeName}}</div>
    <div class="sub-title mt20">赠送礼品商品:</div>
    <a-transfer class="mt20"
    :dataSource="mockData2"
    showSearch
    :targetKeys="targetKeys2"
    @change="handleChange2"
    :render="item=>item.title"
    :titles="titlesArr2"
    :listStyle="{
      width: 'auto',
      minWidth: '250px'
    }">
    </a-transfer>

    <div class="form-item">
      <span class="mr10">触发金额: </span>
      <span><a-input class="w200" placeholder="大于等于此金额触发营销支付" v-model="price1" /></span>
    </div>

    <div v-if="type=='MEMBER'">
      <div class="sub-title mt20">赠送会员商品:</div>
      <a-transfer class="mt20"
      :dataSource="mockData3"
      showSearch
      :targetKeys="targetKeys3"
      @change="handleChange3"
      :render="item=>item.title"
      :titles="titlesArr3"
      :listStyle="{
        width: 'auto',
        minWidth: '250px'
      }">
      </a-transfer>

      <div class="form-item">
        <span class="mr10">触发金额: </span>
        <span><a-input class="w200" placeholder="大于等于此金额触发营销支付" v-model="price2" /></span>
      </div>
    </div>

    <a-button class="mt20 ml10" type="primary" @click="submit">保存</a-button>

  </a-card>
</template>

<script>

export default {
  name: 'CooperationEditRule',
  components: {},
  data() {
    return {
      providerId: '',
      merchantId: '',
      storeId: '',
      storeName: '',
      crossId: '',
      type: '',
      titlesArr2: ['全部礼品商品', '已选礼品商品'],
      titlesArr3: ['全部赠送会员商品', '已选赠送会员商品'],
      mockData2: [],
      targetKeys2: [],
      mockData3: [],
      targetKeys3: [],
      price1: '',
      price2: '',
    }
  },
  created() {
    this.merchantId = this.$route.query.merchantId;
    this.providerId = this.$route.query.providerId;
    this.storeId = this.$route.query.storeId;
    this.crossId = this.$route.query.crossId;
    this.type = this.$route.query.type;
    this.getProduct(this.type);
    this.getDetail();
  },
  methods: {
    handleChange2(targetKeys, direction, moveKeys) {
      console.log(targetKeys, direction, moveKeys);
      this.targetKeys2 = targetKeys
    },
    handleChange3(targetKeys, direction, moveKeys) {
      this.targetKeys3 = targetKeys
    },

    submit(){
      let that = this;
      let products = [];
      this.targetKeys2.forEach(function(item) {
        products.push({
          type: 'GIFT',
          amount: that.accurate_mul(that.price1, 100),
          productId: item,
        })
      })
      this.targetKeys3.forEach(function(item) {
        products.push({
          type: 'MEMBER',
          amount: that.accurate_mul(that.price2, 100),
          productId: item,
        })
      })

      let data = {
        storeId: this.storeId,
        crossId: this.crossId,
        crossType: this.type,
        products: products,
      }
      this.$axios({
        url: "/endpoint/cross/modifyStore.json",
        method: "post",
        processData: false,
        data: data
      }).then(res => {
        if (res.success) {
          window.history.back();
        } else {
          this.$error({
            title: "温馨提示",
            content: res.errorInfo
          });
        }
      });
    },

    /* ===service data=== */
    getDetail() {
      let data = {
        crossId: this.crossId,
        storeId: this.storeId
      };
      this.$axios({
        url: "/endpoint/cross/storeDetail.json",
        method: "get",
        processData: false,
        params: data
      }).then(res => {
        if (res.success) {
          let that = this;
          this.storeName = res.data.storeName;
          let mockData2 = [], mockData3 = [];
          res.data.products.forEach(function(item1) {
            if(item1.type === 'GIFT') {
              let targetKeys2 = [];
              item1.products.forEach(function(item2) {
                targetKeys2.push(item2.productId);
              })
              that.targetKeys2 = targetKeys2;
              that.price1 = that.accurate_div(item1.products[0].triggerAmount, 100);
            } else if(item1.type === 'MEMBER') {
              let targetKeys3 = [];
              item1.products.forEach(function(item2) {
                targetKeys3.push(item2.productId);
              })
              that.targetKeys3 = targetKeys3;
              that.price2 = that.accurate_div(item1.products[0].triggerAmount, 100);
            }
          })
        } else {
          this.$error({
            title: "温馨提示",
            content: res.errorInfo
          });
        }
      });
    },

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
            let mockData2 = []
            res.data.GIFT.forEach(function(item) {
              mockData2.push({
                key: item.productId,
                title: item.productName
              })
            })
            this.mockData2 = mockData2;
          } else if(type === 'MEMBER') {
            let mockData2 = [], mockData3 = [];
            res.data.GIFT.forEach(function(item) {
              mockData2.push({
                key: item.productId,
                title: item.productName
              })
            })
            res.data.MEMBER.forEach(function(item) {
              mockData3.push({
                key: item.productId,
                title: item.productName
              })
            })
            this.mockData2 = mockData2;
            this.mockData3 = mockData3;
          }
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

<style scoped>
.sub-title {
  font-size: 14px;
  color: #000000;
}
.ml10 {
  margin-left: 10px;
}
.mt3 {
  margin-top: 3px;
}
.mt20 {
  margin-top: 20px;
}
.form-item {
  display: flex;
  line-height: 32px;
  margin-top: 20px;
}
.mr10 {
  margin-right: 10px;
}
.w200 {
  width: 250px;
}
</style>
