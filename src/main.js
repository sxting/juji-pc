// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router/lazy'
import 'ant-design-vue/dist/antd.css'
import Antd from 'ant-design-vue'
import Viser from 'viser-vue'
import axios from './http'
import '@/mock'
import store from './store'
import PouchDB from 'pouchdb'
import G2 from '@antv/g2'
import moment from 'moment'

import '../static/ueditor/ueditor.config.js';
import '../static/ueditor/ueditor.all.min.js';
import '../static/ueditor/ueditor.parse.min.js';
import '../static/ueditor/lang/zh-cn/zh-cn.js';

// import formatNum from './utils/formatNum';

Vue.prototype.$axios = axios
Vue.prototype.moment = moment
Vue.config.productionTip = false
Vue.use(Viser)
Vue.use(Antd)
// 金额计算加/减/乘/除--优化浮点计算精度问题
Vue.prototype.accurate_add = function (a, b) { // 加法计算
  let c, d, e
  try {
    c = a.toString().split('.')[1].length
  } catch (f) {
    c = 0
  }
  try {
    d = b.toString().split('.')[1].length
  } catch (f) {
    d = 0
  }
  e = Math.pow(10, Math.max(c, d))
  return (Vue.prototype.accurate_mul(a, e) + Vue.prototype.accurate_mul(b, e)) / e
}

Vue.prototype.accurate_sub = function (a, b) { // 减法计算
  let c, d, e
  try {
    c = a.toString().split('.')[1].length
  } catch (f) {
    c = 0
  }
  try {
    d = b.toString().split('.')[1].length
  } catch (f) {
    d = 0
  }
  e = Math.pow(10, Math.max(c, d))
  return (Vue.prototype.accurate_mul(a, e) - Vue.prototype.accurate_mul(b, e)) / e
}

Vue.prototype.accurate_mul = function (a, b) { // 乘法计算
  let c = 0
  let d = a.toString()
  let e = b.toString()
  try {
    c += d.split('.')[1].length
  } catch (f) {
  }
  try {
    c += e.split('.')[1].length
  } catch (f) {
  }
  return Number(d.replace('.', '')) * Number(e.replace('.', '')) / Math.pow(10, c)
}
Vue.prototype.accurate_div = function (a, b) { // 除法计算
  let c
  let e = 0
  let f = 0
  let d = 0
  try {
    e = a.toString().split('.')[1].length
  } catch (g) {
  }
  try {
    f = b.toString().split('.')[1].length
  } catch (g) {
  }
  c = Number(a.toString().replace('.', ''))
  d = Number(b.toString().replace('.', ''))
  return Vue.prototype.accurate_mul(c / d, Math.pow(10, f - e))
}
Vue.prototype.G2 = G2

// 时间转换
Vue.prototype.timeForMat = function (count) {
  // 拼接时间
  const time1 = new Date()
  const time2 = new Date()
  if (count === 1) {
    time1.setTime(time1.getTime() - (24 * 60 * 60 * 1000))
  } else {
    if (count >= 0) {
      time1.setTime(time1.getTime())
    } else {
      if (count === -2) {
        time1.setTime(time1.getTime() + (24 * 60 * 60 * 1000) * 2)
      } else {
        time1.setTime(time1.getTime() + (24 * 60 * 60 * 1000))
      }
    }
  }

  const Y1 = time1.getFullYear()
  const M1 = ((time1.getMonth() + 1) > 9 ? (time1.getMonth() + 1) : '0' + (time1.getMonth() + 1))
  const D1 = (time1.getDate() > 9 ? time1.getDate() : '0' + time1.getDate())
  const timer1 = Y1 + '-' + M1 + '-' + D1 // 当前时间

  time2.setTime(time2.getTime() - (24 * 60 * 60 * 1000 * count))
  const Y2 = time2.getFullYear()
  const M2 = ((time2.getMonth() + 1) > 9 ? (time2.getMonth() + 1) : '0' + (time2.getMonth() + 1))
  const D2 = (time2.getDate() > 9 ? time2.getDate() : '0' + time2.getDate())
  const timer2 = Y2 + '-' + M2 + '-' + D2 // 之前的7天或者30天 + ' ' + '00:00:00'
  return [timer2, timer1]
}

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>',
  mounted () {
    var db = new PouchDB('admindb')
    db.get('currUser').then(doc => {
      this.$store.commit('account/setuser', doc.user)
    })
  }
})
