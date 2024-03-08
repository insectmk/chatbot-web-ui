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
            placeholder="请输入内容">
        </el-input>
        <el-button type="primary" style="float: right;" @click="send">发送</el-button>
      </el-col>
    </el-row>
  </el-main>
</template>

<script>
import VueMarkdown from 'vue-markdown'
import {getHistoryMsg} from '@/api'

export default {
  data() {
    return {
      dialogs: [],
      messageToSend: '',
    }
  },
  components: {
    VueMarkdown
  },

  created() {
    const loading = this.$loading({
      lock: true,
      text: '加载中...',
      spinner: 'el-icon-loading',
      background: 'rgba(0, 0, 0, 0.7)'
    });

    getHistoryMsg({
      sessionId: this.$route.params.sessionId
    }).then(res => {
      this.dialogs = res.data.data
    })
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