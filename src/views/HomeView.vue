<template>
  <el-container>
    <!-- 头部 -->
    <el-header style="text-align: right; font-size: 12px">
      <el-dropdown trigger="click">
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
      <!-- 菜单栏 -->
      <el-aside style="background-color: rgb(238, 241, 246)">

        <el-menu
            default-active="2"
            class="el-menu-vertical-demo"
            @open="handleOpen"
            @close="handleClose">
          <el-menu-item index="1">
            <i class="el-icon-setting"></i>
            <span slot="title">对话1</span>
          </el-menu-item>
          <el-menu-item index="2">
            <i class="el-icon-setting"></i>
            <span slot="title">对话2</span>
          </el-menu-item>
          <el-menu-item index="3">
            <i class="el-icon-setting"></i>
            <span slot="title">对话3</span>
          </el-menu-item>
          <el-menu-item index="4">
            <i class="el-icon-setting"></i>
            <span slot="title">对话4</span>
          </el-menu-item>
          <el-menu-item index="5">
            <i class="el-icon-setting"></i>
            <span slot="title">对话5</span>
          </el-menu-item>
          <el-menu-item index="6">
            <i class="el-icon-setting"></i>
            <span slot="title">对话6</span>
          </el-menu-item>
        </el-menu>


      </el-aside>

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

      <!-- 主内容 -->
      <router-view/>
    </el-container>
  </el-container>
</template>

<script>
import {getUserInfo, editPassword} from "@/api"

export default {
  data() {
    return {
      password: '', // 密码
      passwordRepeat: '', // 重复密码
      dialogVisibleEdit: false, // 编辑框的显示
      // 登出按钮的显示控制
      logoutVisible: false,
      // 用户信息
      userInfo: {},
      // 菜单数据
      menus: [],
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
    // 菜单展开
    handleOpen(key, keyPath) {
      console.log(key, keyPath);
    },
    // 菜单收起
    handleClose(key, keyPath) {
      console.log(key, keyPath);
    },
  },
  created() {
    // 获取登录用户信息
    getUserInfo().then((res) => {
      this.userInfo = res.data.data
    })
    // 获取用户菜单
    getUserMenus().then((res) => {
      this.menus = res.data.data;
    })
  },
};
</script>

<style lang="less">
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