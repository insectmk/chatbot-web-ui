import Vue from 'vue'
import App from './App.vue'
import router from './router'
import { isTokenEffective } from '@/api'

// 引入Element-UI
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
Vue.use(ElementUI)

// 引入Font-Awesome
import 'font-awesome/css/font-awesome.min.css'

Vue.config.productionTip = false

//路由拦截，拦截全部路由，每次操作路由都是被拦截进⾏判断
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem("token");
  isTokenEffective({ token: token }).then((res) => {
    //筛选需要传token的路由，匹配route⾥⾯需要登录的路径，如果匹配到就是true
    if (to.matched.some((record) => record.meta.requiresAuth)) {
      //根据token是否有效，判断是否需要调到登录⻚⾯
      if (res.data.flag) {
        next()
      } else {
        return next({ path: '/login'})
      }
    } else {
      next();
    }
  })
})


new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
