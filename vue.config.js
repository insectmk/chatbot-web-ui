const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  // 输出文件目录
  outputDir: process.env.outputDir,
  // 项目根路径
  publicPath: process.env.publicPath,
  // 解决websocket报错
  devServer: {
    webSocketServer:false,
    //  其他配置
  }
})
