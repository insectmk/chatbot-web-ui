<template>
  <el-main id="main" class="main">
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
            prop="messageContent"
            label="聊天消息"
            style="width: 100%">
          <template slot-scope="scope">
            <div :class="scope.row.senderType" v-html="marked(scope.row.messageContent)">
            </div>
            <div style="overflow: hidden;cursor: pointer;margin-top: 5px;" v-if="scope.row.senderType === 'assistant'">
              <div style="float: left;font-size: 11px;">
                {{ `字数：${scope.row.wordCount}，Tokens：${scope.row.tokens}，模型：${scope.row.modelVersionName}` }}
              </div>
              <div style="text-align: right;">
                <el-tooltip class="item" effect="dark" content="答得不错" placement="top">
                  <i v-if="scope.row.isLike === 1" class="fa fa-thumbs-up" style="margin-right: 20px;"
                     @click="messageIsLikeClick(scope.row,0,'取消点赞')" aria-hidden="true"></i>
                  <i v-else class="fa fa-thumbs-o-up" style="margin-right: 20px;"
                     @click="messageIsLikeClick(scope.row,1,'点赞')" aria-hidden="true"></i>
                </el-tooltip>
                <el-tooltip class="item" effect="dark" content="还不够好" placement="top">
                  <i v-if="scope.row.isLike === 2" class="fa fa-thumbs-down" style="margin-right: 20px;"
                     @click="messageIsLikeClick(scope.row,0,'取消点踩')" aria-hidden="true"></i>
                  <i v-else class="fa fa-thumbs-o-down" style="margin-right: 20px;"
                     @click="messageIsLikeClick(scope.row,2,'点踩')" aria-hidden="true"></i>
                </el-tooltip>
                <el-tooltip class="item" effect="dark" content="点击可复制" placement="top">
                  <i class="fa fa-clipboard" aria-hidden="true" @click="assistantMsgCopyClick(scope.row)"></i>
                </el-tooltip>
              </div>
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
            :autosize="{ minRows: 4, maxRows: 20}"
            @input="messageToSendCheck"
            v-model="messageToSend"
            placeholder="请输入内容"
            :maxlength="messageToSendMaxLength"
            style="font-size: 18px;">
        </el-input>
        <el-button :disabled="sendBtnDisabled" type="primary" style="float: right;" @click="send">发送</el-button>
      </el-col>
    </el-row>

    <!-- 回到顶部 -->
    <el-backtop target=".main" :right="0" :bottom="80"></el-backtop>

    <!-- 头部固定内容 -->
    <div id="fixed-head">
      <!-- 需要固定在顶部的div内容 -->
      <el-tag
          v-if="currentModel.isOnline"
          type="success"
          size="medium"
          effect="dark">
        在线
      </el-tag>
      <el-tag
          v-else
          type="danger"
          size="medium"
          effect="dark">
        离线
      </el-tag>
      <el-dropdown split-button size="mini" type="primary" @click="handleClickModel"
                   @command="handelClickModelDropdown">
        {{ currentModel.name }}
        <el-dropdown-menu slot="dropdown">
          <el-tooltip effect="dark" v-for="model in models" :key="model.id" :content="model.remark"
                      placement="right-start">
            <el-dropdown-item :command="model">{{ model.name }}</el-dropdown-item>
          </el-tooltip>
        </el-dropdown-menu>
      </el-dropdown>
      <el-button size="mini" style="margin-right: 0" @click="dialogsExportClick">导出</el-button>
    </div>

    <!-- 评分页面  -->
    <el-dialog
        title="评分与反馈"
        :visible.sync="dialogVisibleRate"
        :close-on-click-modal="false"
        width="30%">

      <el-form :model="formDataRate"
               :rules="formRules"
               ref="addModelRate">
        <el-form-item prop="rate">
          <el-rate
              v-model="formDataRate.rate"
              :texts="['太一般了','还算可以','有点儿意思','我很喜欢','超出预期']"
              show-text>
          </el-rate>
        </el-form-item>
        <el-form-item prop="comment">
          <el-input type="textarea"
                    :autosize="{ minRows: 4, maxRows: 8}"
                    v-model="formDataRate.comment"
                    maxlength="200"
                    show-word-limit
                    placeholder="您的反馈意见（最多200字）"/>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisibleRate = false">取 消</el-button>
        <el-button type="primary" @click="addModelRateClick('addModelRate')">确 定</el-button>
      </span>
    </el-dialog>
  </el-main>
</template>

<script>
import {
  getHistoryMsg,
  getSessionModel,
  editChatSession,
  addModelRate,
  getSessionNewestMsg,
  editChatMessage
} from '@/api'
import {apis} from '@/api/request'
import {marked} from 'marked'
import {markedHighlight} from "marked-highlight"
import hljs from 'highlight.js'
// 注意引入样式，你可以前往 node_module 下查看更多的样式主题
import 'highlight.js/styles/base16/darcula.css'
import axios from "axios";
import {fetchEventSource} from '@microsoft/fetch-event-source'
import {isUrlOnline} from '@/util/URLUtil'

// 高亮拓展
marked.use(markedHighlight({
  langPrefix: 'hljs language-',
  highlight(code, lang, info) {
    const language = hljs.getLanguage(lang) ? lang : 'plaintext';
    return hljs.highlight(code, { language }).value;
  }
}))

export default {
  computed: {
    models() {
      return this.$store.state.models;
    }
  },
  data() {
    return {
      // 反馈数据
      formDataRate: {},
      // 表单验证规则
      formRules: {
        rate: [
          {required: true, message: '还没有打分哦~', trigger: 'blur'},
          {
            validator: (rule, value, callback) => {
              if (value === 0) {
                callback(new Error('还没有打分哦~'));
              } else {
                callback();
              }
            },
            trigger: 'change'
          }
        ],
        comment: [
          {required: true, message: '还没有写评价哦~', trigger: 'blur'},
        ],
      },
      // 评分页面的显示
      dialogVisibleRate: false,
      // 当前模型
      currentModel: {},
      // 发送按钮禁用
      sendBtnDisabled: false,
      messageToSendMaxLength: 512,
      marked: marked,
      dialogs: [],
      messageToSend: '',
    }
  },
  props: {
    sessionId: ''
  },
  methods: {
    // 导出按钮被点击
    dialogsExportClick() {
      console.log('导出')
      function formatDialog(dialog) {
        return `${dialog.senderType}: ${dialog.messageContent.trim()}`
      }

      const content = this.dialogs.map(formatDialog).join('\n\n');

      // 创建Blob对象
      const blob = new Blob([content], { type: 'text/plain' });
      // 创建URL
      const url = URL.createObjectURL(blob);
      // 创建a标签并模拟点击
      const a = document.createElement('a');
      a.href = url;
      a.download = `${this.sessionId}.txt` // 设置下载的文件名
      document.body.appendChild(a);
      a.click();
      // 清理并释放URL对象
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    },
    // 点击点赞按钮
    messageIsLikeClick(message, code, msg) {
      message.isLike = code
      editChatMessage(message).then(res => {
        if (res.data.flag) {
          this.$notify.success({
            title: '成功',
            message: msg + '成功',
          })
        } else {
          this.$notify.error({
            title: '错误',
            message: msg + '失败',
          })
        }
      })
    },
    // 点击机器人回复框的复制图标
    assistantMsgCopyClick(message) {
      this.$copyText(message.messageContent).then(event => {
        this.$notify.success({
          title: '成功',
          message: '成功复制内容',
        })
      })
    },
    // 点击反馈添加按钮
    addModelRateClick(formName) {
      // 验证表单
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // 设置当前模型ID
          this.formDataRate.modelVersionId = this.currentModel.id
          addModelRate(this.formDataRate).then(res => {
            if (res.data.flag) {
              // 成功逻辑
              this.$notify.success({
                title: '成功',
                message: res.data.message
              })
              // 清空表单
              this.formDataRate = {}
              // 关闭新增窗口
              this.dialogVisibleRate = false
            } else {
              this.$notify.error({
                title: '错误',
                message: res.data.message,
              })
            }
          })
        } else {
          // 失败逻辑
          this.$notify.error({
            title: '错误',
            message: '请按要求填写表单',
          })
        }
      })
    },
    // 判断url是否在线并更新模型在线状态
    isUrlOnline(url) {
      isUrlOnline((url + '/status').replace(/([^:])(\/\/+)/g, '$1/'), 'GET')
          .then(flag => {
            this.$set(this.currentModel, 'isOnline', flag)
          })
    },
    // 点击顶部模型下拉菜单项
    handelClickModelDropdown(model) {
      // 更换会话的模型
      editChatSession({
        id: this.sessionId,
        modelVersionId: model.id
      }).then(res => {
        if (res.data.flag) {
          // 切换当前模型
          this.$set(this, 'currentModel', model)
          // 判断模型在线情况
          this.isUrlOnline(this.currentModel.apiHost)
        } else {
          this.$notify.error({
            title: '错误',
            message: res.data.message
          })
        }
      })
    },
    // 获取当前会话的模型信息
    getModel() {
      return getSessionModel({
        sessionId: this.sessionId
      }).then(res => {
        // 更新当前会话模型信息
        this.currentModel = res.data.data
        // 判断模型是否在线
        this.isUrlOnline(this.currentModel.apiHost)
      })
    },
    // 点击模型按钮
    handleClickModel() {
      this.dialogVisibleRate = true
    },
    // 点击消息单元格事件
    cellClick(row, column, cell, event) {
      /*this.$copyText(row.messageContent).then(event => {
        this.$notify.success({
          title: '成功',
          message: '成功复制内容',
        })
      })*/
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
    send() {
      // 判断模型是否在线
      if (!this.currentModel.isOnline) {
        this.$notify.error({
          title: '错误',
          message: '当前模型不在线，请切换模型！'
        })
        return
      }
      // 输入消息不能为空
      if (!this.messageToSend.trim()) {
        this.$notify.error({
          title: '错误',
          message: '输入内容不能为空'
        })
        return
      }
      // 用于消息拼接
      let response = ''
      // 禁用发送按钮
      this.sendBtnDisabled = true
      // 创建用户消息
      this.dialogs.push({
        senderType: 'user',
        messageContent: this.messageToSend
      })
      // 对话接口地址
      let url = axios.defaults.baseURL + apis.sendMsgStream;
      const ctrl = new AbortController();
      // 创建机器人消息
      this.dialogs.push({
        senderType: 'assistant',
        messageContent: ''
      })
      // 发送对话
      fetchEventSource(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "token": localStorage.getItem("token")
        },
        body: JSON.stringify({
          sessionId: this.sessionId,
          messageContent: this.messageToSend,
        }),
        signal: ctrl.signal,
        openWhenHidden: true,
        onmessage: (msg) => {
          // 找到机器人div并依次加入回复
          const assistantElements = document.querySelectorAll('.assistant');
          const lastAssistantElement = assistantElements[assistantElements.length - 1];
          // 处理数据
          let result = JSON.parse(msg.data)
          response += result.content
          this.dialogs[this.dialogs.length - 1].messageContent = response
          lastAssistantElement.innerHTML = marked(response)
        },
        onclose: () => {
          // 获取最新的机器人消息
          getSessionNewestMsg({
            sessionId: this.sessionId
          }).then(res => {
            this.$set(this.dialogs, this.dialogs.length - 1, res.data.data)
          })
          // 清空输入框消息
          this.messageToSend = ''
          // 解禁发送按钮
          this.sendBtnDisabled = false
          console.log("SSE接收信息 断开");
          // 监听后端断开，前端主动断开
          ctrl.abort();
        },
        onerror: (err) => {
          console.log("SSE接收信息 异常");
          console.log(err)
          throw err;
          //必须throw才能停止
        },
      })
    },
    // 获取历史消息
    getHistoryMessages() {
      // 获取历史消息
      return getHistoryMsg({
        sessionId: this.sessionId
      }).then(res => {
        this.dialogs = res.data.data
      }).then(() => {
        // 滚动到消息发送框
        let mainDiv = document.getElementById('main')
        mainDiv.scrollTop = mainDiv.scrollHeight
      })
    }
  },
  watch: {
    // 当前模型变化刷新模型在线状态
    'currentModel.apiHost': function (newVal, oldVal) {
      this.isUrlOnline(newVal)
    },
    // 会话变化刷新历史消息
    sessionId: function (newVal, oldVal) {
      // 加载框
      const loading = this.$loading({
        lock: true,
        text: '加载中……',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      });
      Promise.all([
        // 获取历史信息
        this.getHistoryMessages(),
        // 获取当前会话的模型
        this.getModel()
      ]).then(([args1, args2]) => {
        loading.close();
      }).catch(error => {
        // 如果任何一个操作失败，则在这里处理错误
        console.error(error);
        // 关闭加载框
        loading.close();
      })
    }
  },
  created() {
    // 获取模型信息
    this.$store.dispatch('getModelVersionAll')
  },
}
</script>

<style lang="less">
// 头部置顶
#fixed-head {
  position: fixed;
  top: 60px;
  left: 50%;
  transform: translateX(-50%);
  /* 设置fixed-div的宽度、高度和其他样式 */
}

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
