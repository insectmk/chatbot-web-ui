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
    // 后台页面
    path: '/console',
    name: '后台页面',
    redirect: '/console/user',
    component: () => import('@/views/console/ConsoleView.vue'),
    meta: {
      requiresAuth: true
    },
    children: [
      {
        // 用户管理
        path: '/console/user',
        name: '用户管理',
        component: () => import('@/views/console/UserViewView.vue')
      },{
        // 系统日志
        path: '/console/log',
        name: '系统日志',
        component: () => import('@/views/console/SystemLogView.vue')
      },{
        // 系统设置
        path: '/console/setting',
        name: '系统设置',
        component: () => import('@/views/console/SystemSettingView.vue')
      },{
        // 会话设置
        path: '/console/token',
        name: '会话设置',
        component: () => import('@/views/console/TokenSettingView.vue')
      },{
        // 模型管理
        path: '/console/model',
        name: '模型管理',
        component: () => import('@/views/console/ModelVersionView.vue')
      },
    ]
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
