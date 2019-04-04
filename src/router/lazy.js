import Vue from 'vue'
import Router from 'vue-router'
import PageView from '@/layouts/PageView'
import RouteView from '@/layouts/RouteView'
import MenuView from '@/layouts/MenuView'
import Login from '@/pages/login/Login'

Vue.use(Router)
let routesObj = {
  routes: [
    {
      path: '/login',
      name: '登录页',
      component: Login,
      invisible: true
    },
    {
      path: '/',
      name: '首页',
      component: MenuView,
      redirect: '/login',
      icon: 'none',
      invisible: true,
      children: [
        {
          path: '/product',
          name: '商品管理',
          component: RouteView,
          invisible: false,
          menuId: '20000000',
          icon: 'dashboard',
          children: [
            {
              path: '/product/productList',
              name: '商品列表',
              component: () => import('@/pages/product/productList'),
              icon: 'none',
              menuId: '20100000',
              invisible: false
            },
            {
              path: '/product/fenxiao',
              name: '分销商品',
              menuId: '20300000',
              component: () => import('@/pages/product/fenxiao'),
              icon: 'none',
              invisible: false
            },
            {
              path: '/product/Reviewed',
              name: '商品审核',
              menuId: '20200000',
              component: () => import('@/pages/product/reviewed'),
              icon: 'none',
              invisible: false
            },
            {
              path: '/product/addProduct',
              name: '商品',
              component: () => import('@/pages/product/addProduct'),
              icon: 'none',
              invisible: true
            }
          ]
        },
        {
          path: '/jiesuan',
          name: '结算报表',
          component: PageView,
          icon: 'form',
          menuId: '30000000',
          invisible: false,
          children: [
            {
              path: '/jiesuan/baobiao',
              name: '结算报表',
              menuId: '30100000',
              component: () => import('@/pages/jiesuan/baobiao'),
              icon: 'none',
              invisible: false
            },
            {
              path: '/jiesuan/order',
              name: '订单列表',
              menuId: '30200000',
              component: () => import('@/pages/jiesuan/order'),
              icon: 'none',
              invisible: false
            },
            {
              path: '/jiesuan/verification',
              name: '核销记录',
              menuId: '30300000',
              component: () => import('@/pages/jiesuan/verification'),
              icon: 'none',
              invisible: false
            }
          ]
        },
        {
          path: '/operate',
          name: '平台运营',
          component: PageView,
          icon: 'form',
          menuId: '40000000',
          invisible: true,
          children: [
            {
              path: '/operate/juzhangOperate',
              name: '桔长运营',
              menuId: '40100000',
              component: () => import('@/pages/operate/juzhangOperate'),
              icon: 'none',
              invisible: true
            },
            {
              path: '/operate/juziOperate',
              name: '桔子运营',
              menuId: '40200000',
              component: () => import('@/pages/operate/juziOperate'),
              icon: 'none',
              invisible: true
            }
          ]
        }
      ]
    }
  ]
}
// var aaa = JSON.parse(sessionStorage.getItem('menu'))
// if (aaa && aaa.length > 0) {
//   routesObj.routes[1].children.forEach(i => {
//     console.log(aaa)
//     aaa.forEach(n => {
//       if (n.menuId === i.menuId) i.invisible = false
//       i.children.forEach(m => {
//         n.children.forEach(q => {
//           if (q.menuId === m.menuId) m.invisible = false
//         })
//       })
//     })
//   })
// }

console.log(routesObj)
export default new Router(routesObj)
