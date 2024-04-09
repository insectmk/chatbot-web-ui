// 后端接口
const apis = {
    getModelUsageStatistic: '/console/statistic/modelUsage', // 获取模型统计
    deleteModel: '/console/model', //删除模型
    editModel: '/console/model', // 编辑模型
    addModel: '/console/model', // 添加模型
    findModel: '/console/model', // 分页查询模型
    clearSystemLog: '/console/systemLog',    // 清空日志
    findSystemLog: '/console/systemLog', // 查询日志
    deleteUser: '/console/user', // 删除用户
    editUser: '/console/user',  // 更新用户
    addUser: '/console/user',    // 添加用户
    findUser: '/console/user', // 查询用户
    register: '/user/register', // 注册用户
    getApiKey: '/user/apiKey', // 获取API密钥
    addSession: '/chatSession', // 新增会话
    getModelVersionAll: '/modelVersion/all', // 获取所有的模型信息
    delSession: '/chatSession', // 删除会话
    sendMsg: '/chatMessage',    // 发送消息
    sendMsgStream: '/chatMessage/stream',    // 发送消息（流式接收）
    getHistoryMsg: '/chatSession',      // 查询会话的历史消息
    editPassword: '/user/password',               // 修改密码
    getSessionAll: '/chatSession/all',                      // 获取用户所有的会话
    getUserInfo: '/user',                   // 获取用户信息
    captcha: '/login/captcha',             // 获取验证码
    isToken: '/login/isToken',             // 判断Token是否有效
    login: '/login',                       // 登录接口
}

export { apis }