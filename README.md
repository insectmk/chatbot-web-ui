# 智能聊天机器人前端页面

## 运行项目

```bash
# 安装依赖
$ npm install
# 运行在本地服务器
$ npm run serve
# 打包为静态文件
$ npm run build
```

## 所用到的第三方库

- axios：用于发送HTTP请求
- element-ui：能够快速入门的Vue2前端组件
- font-awesome：丰富的图标库
- marked：用于动态解析Markdown文本字符串
- marked-highlight：用于高亮Markdown代码
- highlight.js：Markdown代码高亮样式
- vue-router：用于规范URL跳转规则

## 遇到的问题

- 前端每次发送的请求的SessionID都不同
- Vue2无法监听数组改变，导致页面无法渲染最新的机器人消息。
- 由于能力问题无法实现ChatGPT打字效果的数据生成（后端API实现成功，前端无法对接）。
