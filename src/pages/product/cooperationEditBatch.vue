<template>
  <a-card>
    <div class="sub-title">修改门店:</div>
    <a-transfer class="mt20"
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
      minWidth: '220px'
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
  name: 'CooperationEditBatch',
  components: {},
  data() {
    return {
      providerId: '',
      merchantId: '',
      crossId: '',
      type: '',
      mockData3: [],
      targetKeys3: [],
      mockData1: [],
      targetKeys1: [],
      titlesArr1: ['全部可选门店', '已选门店'],
      titlesArr2: ['全部礼品商品', '已选礼品商品'],
      titlesArr3: ['全部赠送会员商品', '已选赠送会员商品'],
      mockData2: [],
      targetKeys2: [],
      price1: '',
      price2: '',
    }
  },
  created() {
    this.merchantId = this.$route.query.merchantId;
    this.providerId = this.$route.query.providerId;
    this.crossId = this.$route.query.crossId;
    this.type = this.$route.query.type;
    this.getStoreList();
    this.getProduct(this.type);
  },
  methods: {
    handleChange1(targetKeys, direction, moveKeys) {
      console.log(targetKeys, direction, moveKeys);
      this.targetKeys1 = targetKeys
    },
    handleChange2(targetKeys, direction, moveKeys) {
      console.log(targetKeys, direction, moveKeys);
      this.targetKeys2 = targetKeys
    },
    handleChange3(targetKeys, direction, moveKeys) {
      this.targetKeys3 = targetKeys;
    },

    submit(){
      let products = [];
      let that = this;
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

      let data = [];
      this.targetKeys1.forEach(function(item) {
        data.push({
          storeId: item,
          crossId: that.crossId,
          crossType: that.type,
          products: products,
        })
      })

      this.$axios({
        url: "/endpoint/cross/batchModify.json",
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

    getStoreList() {
      let data = {
        merchantId: this.merchantId
      };
      this.$axios({
        url: "/endpoint/juji/merchant/store/list.json",
        method: "get",
        processData: false,
        params: data
      }).then(res => {
        if (res.success) {
          let mockData1 = [];
          res.data.forEach(function(item, i) {
            let data = {
              key: item.id,
              title: item.name
            };
            mockData1.push(data);
          });
          this.mockData1 = mockData1;

        } else {
          this.$error({
            title: "温馨提示",
            content: res.errorInfo
          });
        }
      });
    }
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
