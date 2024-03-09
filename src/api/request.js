let host, port;

host = 'http://localhost'
port = '9001'

// 后端接口
const apis = {
    sendMsgSteam: '/chatMessage/stream',    // 发送消息（流式接收）
    getHistoryMsg: '/chatSession',      // 查询会话的历史消息
    editPassword: '/user',               // 修改密码
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