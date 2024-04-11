<template>
  <el-main class="main">
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
        <el-button type="primary" style="float: right;" @click="send">发送</el-button>
      </el-col>
    </el-row>
  </el-main>
</template>

<script>
import {getHistoryMsg, sendMsg} from '@/api'
import {marked} from 'marked'
import { markedHighlight } from "marked-highlight"
import hljs from 'highlight.js'
// 注意引入样式，你可以前往 node_module 下查看更多的样式主题
import 'highlight.js/styles/base16/darcula.css'

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
    send() {
      // 创建用户消息
      this.dialogs.push({
        role: 'user',
        content: this.messageToSend
      })

      // 弹出加载框
      const loading = this.$loading({
        lock: true,
        text: '正在生成对话...',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      });

      // 发送消息
      sendMsg({
        sessionId: this.sessionId,
        messageContent: this.messageToSend
      }).then((res) => {
        if (res.data.flag) {
          this.dialogs.push({
            role: 'assistant',
            content: res.data.data
          })
        } else {
          this.$notify.error({
            title: '错误',
            message: res.data.message,
          })
        }
      }).then(() => {
        // 用户清除输入的消息
        this.messageToSend = ''
        // 关闭加载框
        loading.close();
      })

      /*fetch('http://127.0.0.1:9001/chatMessage/stream', {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "token": localStorage.getItem("token")
        },
        body: JSON.stringify({
          sessionId: this.sessionId,
          content: this.messageToSend,
        }),
      }).then(response => {
        // 获取 reader
        const reader = response.body.getReader();

        // 读取数据
        return reader.read().then(function process({done, value}) {
          if (done) {
            console.log('Stream finished');
            return;
          }

          console.log('Received data chunk', value);

          // 读取下一段数据
          return reader.read().then(process);
        });
      })*/
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