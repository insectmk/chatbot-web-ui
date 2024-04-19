<template>
  <el-main id="main"  class="main">
    <el-row class="container">
      <div v-if="Array.isArray(dialogs) && dialogs.length === 0" class="assistant">
        <h2>你好 我是智能聊天机器人</h2>
        <p>极速有效地提升工作效率，聪明一点，每天少工作一小时！</p>
      </div>
      <el-table
          v-else
          empty-text="您还没有进行对话哦~"
          :data="dialogs"
          style="width: 100%"
          @cell-click="cellClick"
          :show-header="false">
        <el-table-column
            prop="content"
            label="聊天消息"
            style="width: 100%">
          <template slot-scope="scope">
            <div :class="scope.row.role" v-html="marked(scope.row.content)">
            </div>
          </template>
        </el-table-column>
      </el-table>
    </el-row>

    <!-- 输入框 -->
    <el-row style="padding: 10px;">
      <el-col :span="24">
        <el-input
            type="textarea"
            :rows="3"
            @input="messageToSendCheck"
            v-model="messageToSend"
            placeholder="请输入内容"
            :maxlength="messageToSendMaxLength"
            style="font-size: 18px;">
        </el-input>
        <el-button :disabled="sendBtnDisabled" type="primary" style="float: right;" @click="send">发送</el-button>
      </el-col>
    </el-row>
  </el-main>
</template>

<script>
import {getHistoryMsg, sendMsg} from '@/api'
import {apis} from '@/api/request'
import {marked} from 'marked'
import { markedHighlight } from "marked-highlight"
import hljs from 'highlight.js'
// 注意引入样式，你可以前往 node_module 下查看更多的样式主题
import 'highlight.js/styles/base16/darcula.css'
import axios from "axios";

// 高亮拓展
marked.use(markedHighlight({
  langPrefix: 'hljs language-',
  highlight(code, lang) {
    const language = hljs.getLanguage(lang) ? lang : 'shell'
    return hljs.highlight(code, { language }).value
  }
}))

export default {
  data() {
    return {
      // 发送按钮禁用
      sendBtnDisabled: false,
      messageToSendMaxLength: 255,
      marked: marked,
      dialogs: [],
      messageToSend: '',
    }
  },
  props: {
    sessionId: ''
  },
  methods: {
    // 点击消息按钮快速复制
    cellClick(row, column, cell, event) {
      this.$copyText(row.content).then(event => {
        this.$notify.success({
          title: '成功',
          message: '成功复制内容',
        })
      })
    },
    // 监测发送消息的长度
    messageToSendCheck() {
      if (this.messageToSend.length === this.messageToSendMaxLength) {
        this.$notify.warning({
          title: '警告',
          message: `语句不能超过${this.messageToSendMaxLength}个字符`
        })
      }
    },
    // 发送消息
    async send() {
      // 输入消息不能为空
      if (!this.messageToSend.trim()) {
        this.$notify.error({
          title: '错误',
          message: '输入内容不能为空'
        })
        return
      }
      // 创建用户消息
      this.dialogs.push({
        role: 'user',
        content: this.messageToSend
      })
      // 禁用发送按钮
      this.sendBtnDisabled = true
      // 发送流式对话
      const response = await fetch(axios.defaults.baseURL + apis.sendMsgStream, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "token": localStorage.getItem("token")
        },
        body: JSON.stringify({
          sessionId: this.sessionId,
          messageContent: this.messageToSend,
        }),
      });
      // 清空输入框消息
      this.messageToSend = ''
      console.log(response)
      // 如果没有响应则返回
      if (!response.body) {
        return
      }
      // 创建机器人消息
      this.dialogs.push({
        role: 'assistant',
        content: ''
      })
      // 开始读取数据
      const reader = response.body.pipeThrough(new TextDecoderStream()).getReader();
      while (true) {
        let { value, done } = await reader.read();
        if (done) break;
        // 找到机器人div并依次加入回复
        const assistantElements = document.querySelectorAll('.assistant');
        const lastAssistantElement = assistantElements[assistantElements.length - 1];
        // 处理数据
        this.dialogs[this.dialogs.length-1].content += (value.replace('data:', '').replace(/\s\n$/, ''))
        lastAssistantElement.innerHTML = marked(this.dialogs[this.dialogs.length-1].content)
      }
      // 解禁发送按钮
      this.sendBtnDisabled = false
    },
    // 获取历史消息
    getHistoryMessages() {
      // 弹出加载框
      const loading = this.$loading({
        lock: true,
        text: '加载中...',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      });
      // 获取历史消息
      getHistoryMsg({
        sessionId: this.sessionId
      }).then(res => {
        this.dialogs = res.data.data
      }).then(() => {
        // 关闭加载框
        loading.close()
      }).then(() => {
        // 滚动到消息发送框
        let mainDiv = document.getElementById('main')
        mainDiv.scrollTop = mainDiv.scrollHeight
      })
    }
  },
  watch: {
    // 会话变化刷新历史消息
    sessionId: function (newVal, oldVal) {
      // 获取历史消息
      this.getHistoryMessages()
      // 提示成功消息
      this.$notify.success({
        title: '成功',
        message: '已成功切换会话！'
      })
    }
  },
  created() {
    // 获取历史消息
    this.getHistoryMessages()
  },
}
</script>

<style lang="less">
// 设置内容框大小，防止页面出现两个滚动条
.main {
  height: calc(100vh - 60px);
}

// 设置用户消息样式
.user {
  border-radius: 10px;
  padding: 10px;
}

// 设置机器人消息样式
.assistant {
  background-color: rgb(238, 241, 246);
  border-radius: 10px;
  padding: 10px;
}
</style>