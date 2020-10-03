import Vue from 'vue'
import VueRouter from 'vue-router'

// import Login from './components/Login.vue'
const Login = () => import(/* webpackChunkName: "login_home_welcome" */ '../components/Login.vue')
// import Home from './components/Home.vue'
const Home = () => import(/* webpackChunkName: "login_home_welcome" */ '../components/Home.vue')
// import Welcome from './components/Welcome.vue'
const Welcome = () => import(/* webpackChunkName: "login_home_welcome" */ '../components/Welcome.vue')
Vue.use(VueRouter)
// import Users from './components/user/Users.vue'
const Users = () => import(/* webpackChunkName: "Users_Rights_Roles" */ '../components/User/Users.vue')
// import Rights from './components/power/Rights.vue'
const Rights = () => import(/* webpackChunkName: "Users_Rights_Roles" */ '../components/Power/Rights.vue')
// import Roles from './components/power/Roles.vue'
const Roles = () => import(/* webpackChunkName: "Users_Rights_Roles" */ '../components/Power/Roles.vue')

// import Cate from './components/goods/Cate.vue'
const Cate = () => import(/* webpackChunkName: "Cate_Params" */ '../components/Goods/Cate.vue')
// import Params from './components/goods/Params.vue'
const Params = () => import(/* webpackChunkName: "Cate_Params" */ '../components/Goods/Params.vue')

// import GoodsList from './components/goods/List.vue'
const GoodsList = () => import(/* webpackChunkName: "GoodsList_Add" */ '../components/Goods/List.vue')
// import Add from './components/goods/Add.vue'
const Add = () => import(/* webpackChunkName: "GoodsList_Add" */ '../components/Goods/Add.vue')

// import Order from './components/order/Order.vue'
const Order = () => import(/* webpackChunkName: "Order_Report" */ '../components/Order/Order.vue')
// import Report from './components/report/Report.vue'
const Report = () => import(/* webpackChunkName: "Order_Report" */ '../components/Report/Report.vue')
const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: Login },
  {
    path: '/home',
    component: Home,
    redirect: '/welcome',
    children: [
      { path: '/welcome', component: Welcome },
      { path: '/users', component: Users },
      { path: '/rights', component: Rights },
      { path: '/roles', component: Roles },
      { path: '/categories', component: Cate },
      { path: '/params', component: Params },
      { path: '/goods', component: GoodsList },
      { path: '/goods/add', component: Add },
      { path: '/orders', component: Order },
      { path: '/reports', component: Report }
    ]
  }
]

const router = new VueRouter({ routes })

router.beforeEach((to, from, next) => {
  if (to.path === '/login') return next()
  const token = window.sessionStorage.getItem('token')
  if (!token) return next('/login')
  next()
})
export default router
