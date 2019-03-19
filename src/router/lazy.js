import Vue from 'vue'
import Router from 'vue-router'
import PageView from '@/layouts/PageView'
import RouteView from '@/layouts/RouteView'
import MenuView from '@/layouts/MenuView'
import Login from '@/pages/login/Login'

Vue.use(Router)

export default new Router({
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
          icon: 'dashboard',
          children: [
            {
              path: '/product/productList',
              name: '商品列表',
              component: () => import('@/pages/product/productList'),
              icon: 'none'
            },
            {
              path: '/product/fenxiao',
              name: '商品分销',
              component: () => import('@/pages/product/fenxiao'),
              icon: 'none'
            },
            {
              path: '/product/addProduct',
              name: '新增商品',
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
          children: [
            {
              path: '/jiesuan/baobiao',
              name: '商家结算报表',
              component: () => import('@/pages/jiesuan/baobiao'),
              icon: 'none'
            },
            {
              path: '/jiesuan/order',
              name: '订单列表',
              component: () => import('@/pages/jiesuan/order'),
              icon: 'none'
            }
          ]
        }
      ]
    }
  ]
})
