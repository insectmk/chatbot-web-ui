<template>
  <el-main class="main">
    <el-row class="container">
      <el-col v-if="dialogs === undefined || dialogs.length <= 0" :span="24" class="assistant">
        <h1>Hi 我是一个智能聊天机器人</h1>
        <p>极速有效地提升工作效率，聪明一点，每天少工作一小时！</p>
      </el-col>
      <el-col v-else :span="24"
              v-for="(dialog, index) in dialogs"
              :key="index"
              :class="dialog.role">
        <vue-markdown>
          {{ dialog.content }}
        </vue-markdown>
      </el-col>
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
import VueMarkdown from 'vue-markdown'
import {getHistoryMsg, sendMsgSteam} from '@/api'
import Vue from 'vue'

export default {
  data() {
    return {
      dialogs: [],
      sessionId: '',
      messageToSend: '',
    }
  },
  components: {
    VueMarkdown
  },

  created() {
    // 赋值会话ID
    this.sessionId = this.$route.params.sessionId
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
    })
    // 关闭加载框
    setTimeout(() => {
      loading.close();
    }, 1000);
  },
  watch: {
    $route: function (newVal, oldVal) {

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
      // 创建机器人消息
      this.dialogs.push({
        role: 'assistant',
        content: ''
      })

      fetch('http://127.0.0.1:9001/chatMessage/stream', {
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
        return reader.read().then(function process({ done, value }) {
          if (done) {
            console.log('Stream finished');
            return;
          }

          console.log('Received data chunk', value);

          // 读取下一段数据
          return reader.read().then(process);
        });
      })


      // 发送消息
      /*sendMsgSteam({
        sessionId: this.sessionId,
        messageContent: this.messageToSend
      }).then((res) => {
        const data = res.data.replaceAll('\n', '').replaceAll('data:', '')
        // 处理解析后的数据
        console.log(data)
        this.$set(this.dialogs[this.dialogs.length - 1], 'content', this.dialogs[this.dialogs.length - 1].content + data)
      }).then((res) => {
        console.log(this.dialogs)
      })*/
    }
  }
}
</script>

<style lang="less">
.main {
  height: calc(100vh - 60px);
}

.user {
  border-radius: 10px;
  padding: 10px;
}

.assistant {
  background-color: rgb(238, 241, 246);
  border-radius: 10px;
  padding: 10px;
}
</style>