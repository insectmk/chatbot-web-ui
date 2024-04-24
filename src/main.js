import Vue from 'vue'
import App from './App.vue'
import router from './router'
import { isWho } from '@/api'

// 引入复制内容到剪切板功能
import VueClipboard from 'vue-clipboard2'
Vue.use(VueClipboard)

// 引入Element-UI
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
Vue.use(ElementUI)

// Element-UI表格宽度自适应
import AFTableColumn from 'af-table-column'
Vue.use(AFTableColumn)

// 注册导航
import Navbar from "@/components/Navbar.vue";
Vue.component('Navbar', Navbar)

// 引入Font-Awesome
import 'font-awesome/css/font-awesome.min.css'

// 引入vuex
import store from './store/index'

Vue.config.productionTip = false

//路由拦截，拦截全部路由，每次操作路由都是被拦截进⾏判断
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem("token");
  isWho({ token: token }).then((res) => {
    //筛选需要传token的路由，匹配route⾥⾯需要登录的路径，如果匹配到就是true
    if (to.matched.some((record) => record.meta.requiresAuth)) {
      //根据token是否有效，判断是否需要调到登录⻚⾯
      if (res.data.flag) {
        if (res.data.data === 'root') {
          // root直接放
          next()
        } else if (to.path.indexOf('console') === -1 &&  res.data.data === 'user') {
          // 用户且非后台放行
          next()
        } else if (to.path.indexOf('console') !== -1 &&  res.data.data === 'user') {
          // 普通用户进后台页面
          ElementUI.Message({
            type: 'error',
            message: '您不是Root用户',
          });
          return next({ path: '/'})
        } else {
          // 其他一律不通过
          ElementUI.Message({
            type: 'error',
            message: '请重新登录',
          });
          return next({ path: '/login'})
        }
      } else {
        ElementUI.Message({
          type: 'error',
          message: res.data.message,
        });
        return next({ path: '/login'})
      }
    } else {
      next();
    }
  })
})


new Vue({
  router,
  render: h => h(App),
  store
}).$mount('#app')
