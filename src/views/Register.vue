<template>
  <div class="father-box">
    <el-form>
      <el-row style="width: 300px">
        <el-col :span="24" class="interval">
          <el-input placeholder="请输入用户名" v-model="formData.username"/>
        </el-col>
        <el-col :span="24" class="interval">
          <el-input placeholder="请输入邮箱" v-model="formData.email"/>
        </el-col>
        <el-col :span="24" class="interval">
          <el-input placeholder="请输入密码" v-model="formData.password" show-password/>
        </el-col>
        <el-col :span="24" class="interval">
          <el-input placeholder="请确认密码" v-model="formData.passwordRepeat" show-password/>
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
          <el-button style="width: 100%" type="primary" @click="onSubmit">注册</el-button>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script>
import {
  register,
  getCaptcha,
  isTokenEffective} from '@/api'

export default {
  data() {
    return {
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
    onSubmit() {
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

<style lang="less">
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

.father-box {
  height: 80vh;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>