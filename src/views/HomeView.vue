<template>
  <el-container>
    <!-- 头部 -->
    <el-header style="display: flex; font-size: 12px">
      <span style="margin-right: auto; font-size: 18px;">智能聊天机器人</span>

      <el-dropdown style="margin-left: auto;" trigger="click">
          <span class="el-dropdown-link">
            <img :src="userInfo.head" class="user-avatar">
            {{ userInfo.username }}<i class="el-icon-arrow-down el-icon--right"></i>
          </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item @click.native="dialogVisibleEdit = true">修改密码</el-dropdown-item>

          <el-popover
              placement="top-start"
              width="160"
              v-model="logoutVisible">
            <p>确定退出登录吗？</p>
            <div style="text-align: right; margin: 0">
              <el-button size="mini" type="text" @click="logoutVisible = false">取消</el-button>
              <el-button type="primary" size="mini" @click="logout()">确定</el-button>
            </div>
            <span slot="reference">
                  <el-dropdown-item divided>
                  安全退出
                  </el-dropdown-item>
                </span>
          </el-popover>
        </el-dropdown-menu>
      </el-dropdown>
    </el-header>

    <el-container>
      <!-- 侧边栏 -->
      <el-aside style="width: auto; background-color: rgb(238, 241, 246)">
        <el-button plain style="width: 100%" size="small" @click="isCollapse = !isCollapse">展/收</el-button>
        <br/>
        <el-button plain type="primary" style="width: 100%" size="small" @click="addSessionAct">新建</el-button>
        <br/>
        <el-popover
            placement="top-start"
            width="160"
            v-model="delSessionVisible">
          <p>确定删除当前会话吗？</p>
          <div style="text-align: right; margin: 0">
            <el-button size="mini" type="text" @click="delSessionVisible = false">取消</el-button>
            <el-button type="primary" size="mini" @click="delSessionAct">确定</el-button>
          </div>
          <span slot="reference">
            <el-button plain type="danger"
                       style="width: 100%"
                       size="small">删除</el-button>
          </span>
        </el-popover>

        <!-- 对话列表 -->
        <el-menu
            :default-active="sessionId"
            :collapse="isCollapse"
            class="el-menu-vertical-demo">
            <el-menu-item
                v-for="(session) in sessions"
                @click="sessionId = session.id"
                :key="session.id"
                :index="session.id">
              <span slot="title">{{ session.remark }}</span>
              <i class="el-icon-service"></i>
            </el-menu-item>
        </el-menu>
      </el-aside>

      <!-- 主内容 -->
      <Dialog :sessionId="sessionId"></Dialog>
      <!--  密码编辑框  -->
      <el-dialog
          title="修改密码"
          :visible.sync="dialogVisibleEdit"
          width="30%">

        <el-form>
          <el-form-item>
            <el-input v-model="password" show-password placeholder="请输入新密码"/>
          </el-form-item>
          <el-form-item>
            <el-input v-model="passwordRepeat" show-password placeholder="请重复密码"/>
          </el-form-item>
        </el-form>

        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisibleEdit = false">取 消</el-button>
          <el-button type="primary" @click="editPassword">确 定</el-button>
        </span>
      </el-dialog>
    </el-container>
  </el-container>
</template>

<script>
import {getSessionAll, getUserInfo, editPassword, delSession} from "@/api"
import Dialog from "@/components/Dialog.vue"

export default {
  components: {
    Dialog
  },
  data() {
    return {
      isCollapse: true,
      password: '', // 密码
      passwordRepeat: '', // 重复密码
      dialogVisibleEdit: false, // 编辑框的显示
      // 登出按钮的显示控制
      logoutVisible: false,
      // 删除会话
      delSessionVisible: false,
      // 用户会话列表
      sessions: [],
      // 当前会话的ID
      sessionId: '',
      // 用户信息
      userInfo: {},
    };
  },
  methods: {
    // 添加会话
    addSessionAct() {
      console.log(this.sessionId)
    },
    // 删除会话
    delSessionAct() {
      // 关闭删除会话确认框
      this.delSessionVisible = false
      // 发送删除请求
      delSession({
        sessionId: this.sessionId
      }).then(res => {
          if (res.data.flag) {
            // 成功提示
            this.$notify.success({
              title: '成功',
              message: res.data.message,
            });
          } else {
            this.$notify.error({
              title: '错误',
              message: res.data.message,
            });
          }
          return res.data.flag
      }).then(flag => {
        if (flag) {
          // 清除会话数组中对应的数据
          this.sessions = this.sessions.filter(session => session.id !== this.sessionId)
          // 重新设置当前会话
          this.sessionId = this.sessions[0].id
        }
      })
    },
    // 修改密码
    editPassword() {
      // 判断密码是否一致
      if (this.password !== this.passwordRepeat) {
        this.$message.error('两次密码不一致')
      } else {
        // 发送修改请求
        editPassword({
          password: this.password
        }).then((res) => {
          if (res.data.flag) {
            this.$notify.success({
              title: '成功',
              message: res.data.message
            })
            this.dialogVisibleEdit = false
          } else {
            this.$notify.error({
              title: '错误',
              message: res.data.message
            })
          }
        })
      }
    },
    // 退出登录
    logout() {
      // 删除令牌
      localStorage.removeItem('token')
      this.logoutVisible = false
      this.$notify.success({
        title: '成功',
        message: '已安全退出',
      });
      this.$router.replace({path: '/login'})
    },
  },
  created() {
    // 获取登录用户信息
    getUserInfo().then((res) => {
      this.userInfo = res.data.data
    })
    // 获取用户对话列表
    getSessionAll().then((res) => {
      this.sessions = res.data.data
      return res.data.data
    }).then((sessions) => {
      this.sessionId = sessions[0].id
    })
  },
};
</script>

<style lang="less">
a {
  //去掉下换线
  text-decoration: none;
  //文字颜色更改
  color: black;
}

/**修改全局的滚动条*/
/**滚动条的宽度*/
::-webkit-scrollbar {
  width: 8px;

}

//滚动条的滑块
::-webkit-scrollbar-thumb {
  background-color: #eaecf1;
  border-radius: 3px;
}


// 解决无法占满高度的问题
body, html {
  padding: 0;
  margin: 0;
  height: 100%;
}

.el-container {
  padding: 0;
  margin: 0;
  height: 100vh;
}

// 用户头像
.user-avatar {
  width: 30px;
  height: 30px;
  border-radius: 15px;
  vertical-align: middle;
}

.el-dropdown-link {
  cursor: pointer;
  color: #fff;
}

.el-icon-arrow-down {
  font-size: 12px;
}

.el-header {
  background-color: #b3c0d1;
  color: #333;
  line-height: 60px;
}

.el-aside {
  color: #333;
}
</style>