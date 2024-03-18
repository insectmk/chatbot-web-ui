<template>
  <div class="father-container">
    <h1 align="center"  style="color:LightSteelBlue ; font-size: 50px">智能聊天机器人</h1>
    <el-form class="form-container">
      <el-row style="width: 300px">
        <el-col :span="24" class="interval">
          <el-input placeholder="请输入邮箱" v-model="formData.email"/>
        </el-col>
        <el-col :span="24" class="interval">
          <el-input placeholder="请输入密码" v-model="formData.password" show-password/>
        </el-col>
        <el-col :span="17" class="interval">
          <el-input placeholder="请输入验证码" v-model="formData.captcha"/>
        </el-col>
        <el-col :span="7" style="padding: 10px 10px 0 0;">
          <el-image
              style="width: 100%;height: 100%;object-fit:cover;"
              @click="flushCaptcha"
              :src="captchaSrc"
              fit="fill"></el-image>
        </el-col>
        <el-col :span="24" class="interval">
          <el-button style="width: 100%" type="primary" @click="onSubmit">登录</el-button>
        </el-col>
        <el-col :span="24" class="interval">
          <el-link class="unselectable" type="primary" target="_blank" @click="registerClick">立即注册</el-link>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script>
import {login,getCaptcha,isTokenEffective} from '@/api'
import axios from "axios"

export default {
  data() {
    return {
      formData: {
        email: '',
        password: '',
        captcha: '',
      },
      captchaSrc: '',
    }
  },
  methods: {
    // 点击注册按钮
    registerClick() {
      // 跳转到注册页面
      this.$router.replace({
        path: '/register'
      })
    },
    // 刷新图片
    flushCaptcha() {
      getCaptcha().then((res) => {
        return (
            'data:image/png;base64,' +
            btoa(new Uint8Array(res.data).reduce((data, byte) => data + String.fromCharCode(byte), ''))
        )
      }).then((data) => {
        this.captchaSrc = data //data可以直接放到img标签的src中
      })
    },
    // 提交登录
    onSubmit() {
      login(this.formData).then((res) => {
        if (res.data.flag) {
          // 成功提示
          this.$notify.success({
            title: '成功',
            message: res.data.message,
          });
          // 将令牌转到localStorage中
          localStorage.setItem('token', res.data.data)
          // 设置全局请求头
          axios.defaults.headers.common['token'] = res.data.data;
          // 跳转到主页
          this.$router.push({path: '/'})
        } else {
          // 错误提示
          this.$notify.error({
            title: '错误',
            message: res.data.message
          })
          // 刷新验证码
          this.flushCaptcha()
        }
      })
    }
  },
  created() {
    // 如果已经登录，则跳转到主页面
    const token = localStorage.getItem("token");
    isTokenEffective({ token: token }).then((res) => {
      //根据token是否有效，判断是否需要调到登录⻚⾯
      if (res.data.flag) {
        this.$router.replace({
          path: '/'
        })
      }
    })
    // 获取验证码
    this.flushCaptcha()
  },
}
</script>

<style scoped lang="less">
// 表单样式
.form-container {
  position:absolute;
  top:25%;
  width: 300px;
  padding: 20px;
  background-color: #ffffff;
  border-radius: 5px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
// 无法被选中
.unselectable {
  -webkit-user-select: none; /* Safari */
  -moz-user-select: none;    /* Firefox */
  -ms-user-select: none;     /* IE10+/Edge */
  user-select: none;         /* Standard */
}

.interval {
  padding: 10px;
}

// 背景色
.father-container {
  font-family: Arial, sans-serif;
  margin: 0;
  padding: 0;
  background: linear-gradient(to right, #c7d1d9, #eaecf1); /* 这是一个从左到右的渐变 */
  height: 100vh;
  display: flex;
  justify-content: center;
}
</style>