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
        <el-button style="width: 100%" size="small" @click="isCollapse = !isCollapse">展/收</el-button>
        <!-- 对话列表 -->
        <el-menu
            default-active="2"
            :collapse="isCollapse"
            class="el-menu-vertical-demo">
          <router-link
              v-for="(session, index) in sessions"
              :key="session.id"
              :to="`/dialog/${session.id}`">
            <el-menu-item
                :index="String(index)">
              <i class="el-icon-setting"></i>
              <span slot="title">{{ session.remark }}</span>
            </el-menu-item>
          </router-link>
        </el-menu>
      </el-aside>

      <!-- 主内容 -->
      <router-view :key="$route.fullPath" />
      <!--  密码编辑框    -->
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
import {getSessionAll, getUserInfo, editPassword, getHistoryMsg} from "@/api"
import VueMarkdown from "vue-markdown";

export default {
  components: {
    VueMarkdown,
  },
  data() {
    return {
      isCollapse: true,
      password: '', // 密码
      passwordRepeat: '', // 重复密码
      dialogVisibleEdit: false, // 编辑框的显示
      // 登出按钮的显示控制
      logoutVisible: false,
      // 用户会话列表
      sessions: [],
      // 用户信息
      userInfo: {},
    };
  },
  methods: {
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
            this.$message.success(res.data.message)
            this.dialogVisibleEdit = false
          } else {
            this.$message.error(res.data.message)
          }
        })
      }
    },
    // 退出登录
    logout() {
      // 删除令牌
      localStorage.removeItem('token')
      this.logoutVisible = false
      this.$router.replace({path: '/login'})
    },
    // 发送消息
    send() {

    }
  },
  created() {
    // 获取登录用户信息
    getUserInfo().then((res) => {
      this.userInfo = res.data.data
    })
    // 获取用户对话列表
    getSessionAll().then((res) => {
      this.sessions = res.data.data
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