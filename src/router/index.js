import Vue from 'vue'
import VueRouter from 'vue-router'
import HomeView from '@/views/HomeView'
import LoginView from "@/views/LoginView.vue"

Vue.use(VueRouter)

const routes = [
  {
    // 主页面
    path: '/',
    name: '主页面',
    component: HomeView,
    //redirect: '/studio', // 默认子页面
    meta: {
      requiresAuth: true
    },
  },{
    // 注册页面
    path: '/register',
    name: '注册页面',
    component: () => import('@/views/Register.vue')
  },{
    // 登录页面
    path: '/login',
    name: '登录页面',
    component: LoginView
  },{
    // 跳转到404页面
    path: '*',
    redirect: '/notFound'
  },{
    // 未找到页面
    path: '/notFound',
    name: '未找到',
    component: () => import('@/views/NotFound.vue')
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
