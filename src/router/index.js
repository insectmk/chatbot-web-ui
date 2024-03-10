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
    /*children: [
      {
        // 对话页面
        path: '/dialog/:sessionId',
        name: '对话',
        component: () => import('@/views/session/Dialog.vue'),
        meta: {
          requiresAuth: true
        }
      },{
        // 登录页面
        path: '/404',
        name: '未找到',
        component: () => import('@/views/404.vue')
      },
    ],*/
  },{
    // 登录页面
    path: '/login',
    name: 'login',
    component: LoginView
  },{
    // 跳转到404页面
    path: '*',
    redirect: '/404'
  }

  // {
  //   path: '/about',
  //   name: 'about',
  //   // route level code-splitting
  //   // this generates a separate chunk (about.[hash].js) for this route
  //   // which is lazy-loaded when the route is visited.
  //   component: () => import(/* webpackChunkName: "about" */ '../views/MainView.vue')
  // }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
