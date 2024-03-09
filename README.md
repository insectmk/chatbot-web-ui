# czhealth-frontend

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).

### 遇到的问题

前端每次发送的请求的SessionID都不同

Vue2无法监听数组改变，导致页面无法渲染最新的机器人消息。

由于能力问题无法实现ChatGPT打字效果的数据生成（后端API实现成功，前端无法对接）。
