import Vue from 'vue'
import Router from 'vue-router'
import RouteView from '@/layouts/RouteView'
import MenuView from '@/layouts/MenuView'
import Login from '@/pages/login/Login'
import ProductList from '@/pages/product/productList'
import AddProduct from '@/pages/product/addProduct'
import BaobiaoList from '@/pages/jiesuan/baobiao'
import OrderList from '@/pages/jiesuan/order'

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
              component: ProductList,
              icon: 'none'
            },
            {
              path: '/product/addProduct',
              name: '新增商品',
              component: AddProduct,
              icon: 'none'
            }
          ]
        },
        {
          path: '/jiesuan',
          name: '结算报表',
          component: RouteView,
          icon: 'dashboard',
          children: [
            {
              path: '/jiesuan/baobiao',
              name: '商家结算报表',
              component: BaobiaoList,
              icon: 'none'
            },
            {
              path: '/jiesuan/order',
              name: '订单列表',
              component: OrderList,
              icon: 'none'
            }
          ]
        }
      ]
    }
  ]
})
