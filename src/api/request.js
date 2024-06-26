// 后端接口
const apis = {
    uploadDialogs: '/chatSession/upload', // 导入对话文件
    getModelRateStatistic: '/console/statistic/modelRate', // 获取模型评分数据
    isWho: '/login/isWho', // 判断用户是谁
    editChatMessage: '/chatMessage', // 更新聊天消息
    getSessionNewestMsg: '/chatSession/newest', // 获取会话最新的机器人消息
    addPartnerRate: '/partnerRate', // 添加搭档评价
    addModelRate: '/modelRate', // 添加模型评价
    editChatSession: '/chatSession', // 更新会话
    getSessionModel: '/modelVersion/session', // 获取会话的模型
    findPartner: '/console/partner', // 分页条件查询搭档
    editPartner: '/partner', // 编辑搭档
    deletePartner: '/partner', // 删除搭档
    addPartner: '/partner', // 新增搭档
    getPublicPartner: '/partner/public', // 查询所有公开的搭档
    getUserPartner: '/partner', // 查询用户的搭档
    isRoot: '/login/isRoot', // 是否为root用户
    uploadUserHead: '/console/user/head', // 用户头像上传
    getApiTips: '/api/tips', // 获取API说明
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