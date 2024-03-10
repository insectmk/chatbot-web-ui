<template>
  <el-main class="main">
    <el-row class="container">
      <el-table
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
            v-model="messageToSend"
            placeholder="请输入内容"
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
      marked: marked,
      dialogs: [],
      messageToSend: '',
    }
  },
  props: {
    sessionId: ''
  },
  created() {
    // 获取历史消息
    this.getHistoryMessages()
  },
  watch: {
    // 会话变化刷新历史消息
    sessionId: function (newVal, oldVal) {
      // 获取历史消息
      this.getHistoryMessages()
    }
  },
  methods: {
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
        this.dialogs.push({
          role: 'assistant',
          content: res.data.data
        })
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
  }
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