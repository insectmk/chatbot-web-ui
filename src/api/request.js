let host, port;
if (process.env.VUE_APP_ENV === 'dev') {
    host = 'http://127.0.0.1'
    port = '9001'
}
else if (process.env.VUE_APP_ENV === 'gitee') {
    host = 'http://150.158.46.188'
    port = '9001'
}
else if (process.env.VUE_APP_ENV === 'pro') {
    host = 'http://150.158.46.188'
    port = '9001'
} else {
    host = 'http://127.0.0.1'
    port = '9001'
}

// 后端接口
const apis = {
    getSessionAll: '/chatSession/all',                      // 获取用户所有的会话
    getUserInfo: '/user',                   // 获取用户信息
    captcha: '/login/captcha',             // 获取验证码
    isToken: '/login/isToken',             // 判断Token是否有效
    login: '/login',                       // 登录接口
}

// 为所有的API添加前缀
for(let api in apis) {
    apis[api] = `${host}:${port}${apis[api]}`
	//console.log(apis[api])
}

export { apis }