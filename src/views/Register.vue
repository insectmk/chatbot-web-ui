<template>
  <div class="father-container">
    <h1 align="center"  style="color:LightSteelBlue ; font-size: 50px">智能聊天机器人</h1>
    <el-form class="form-container" :rules="formRules" :model="formData" ref="formData">
      <el-row style="width: 300px">
        <el-form-item prop="username">
          <el-input placeholder="请输入用户名" v-model="formData.username"/>
        </el-form-item>

        <el-form-item prop="email">
          <el-input placeholder="请输入邮箱" v-model="formData.email"/>
        </el-form-item>

        <el-form-item prop="password">
          <el-input placeholder="请输入密码" v-model="formData.password" show-password/>
        </el-form-item>

        <el-form-item prop="password">
          <el-input placeholder="请确认密码" v-model="formData.passwordRepeat" show-password/>
        </el-form-item>

        <el-form-item prop="captcha">
          <el-col :span="16">
            <el-form-item prop=""></el-form-item>
            <el-input placeholder="请输入验证码" v-model="formData.captcha" maxlength="4" />
          </el-col>
          <el-col :span="8">
            <el-image
                style="width: 100%;height: 100%;object-fit:cover;"
                @click="flushCaptcha"
                :src="captchaSrc"
                fit="fill"></el-image>
          </el-col>
        </el-form-item>
        <el-form-item>
          <el-button style="width: 100%" type="primary" @click="onSubmit('formData')">注册</el-button>
        </el-form-item>
        <el-link class="unselectable" type="primary" target="_blank" @click="loginClick">已有账号？点此登录</el-link>
      </el-row>
    </el-form>
  </div>
</template>

<script>
import {
  register,
  getCaptcha,
  isTokenEffective} from '@/api'
import {email, password, captcha, username} from '@/util/RegularUtil'

export default {
  data() {
    return {
      // 表单验证规则
      formRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { pattern: username, message: '2-20位', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { pattern: email, message: '邮箱格式不正确', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { pattern: password, message: '至少包含数字、字母和特殊字符，长度在6到24位之间', trigger: 'blur' }
        ],
        captcha: [
          { required: true, message: '请输入验证码', trigger: 'blur' },
          { pattern: captcha, message: '验证码格式不正确', trigger: 'blur' }
        ]
      },
      formData: {
        username:'',
        email: '',
        password: '',
        passwordRepeat: '',
        captcha: '',
      },
      captchaSrc: '',
    }
  },
  methods: {
    // 点击登录链接
    loginClick() {
      // 跳转到登录页面
      this.$router.replace({
        path: '/login'
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
    // 提交注册
    onSubmit(formName) {
      // 验证表单
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // 判断密码是否一致
          if (this.formData.password !== this.formData.passwordRepeat) {
            this.$notify.error({
              title: '错误',
              message: '两次密码不一致',
            })
          } else {
            // 弹出加载框
            const loading = this.$loading({
              lock: true,
              text: '正在发送注册链接...',
              spinner: 'el-icon-loading',
              background: 'rgba(0, 0, 0, 0.7)'
            });
            // 发送注册链接
            register(this.formData).then((res) => {
              if (res.data.flag) {
                // 成功提示
                this.$notify.success({
                  title: '成功',
                  message: res.data.message,
                });
                // 跳转到登录页
                this.$router.push({path: '/login'})
              } else {
                // 错误提示
                this.$notify.error({
                  title: '错误',
                  message: res.data.message
                })
                // 刷新验证码
                this.flushCaptcha()
              }
            }).then(() => {
              // 关闭加载框
              loading.close()
            })
          }
        } else {
          // 错误提示
          this.$notify.error({
            title: '错误',
            message: '请按要求填写内容'
          })
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