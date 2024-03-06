<template>
  <div class="father-box">
    <el-row>
      <el-col :xs="20" :sm="20" :md="20" :lg="20" :xl="20">
        <el-form>
          <el-row>
            <el-col span="24">
              <el-input placeholder="请输入邮箱" v-model="formData.email"/>
            </el-col>
            <el-col span="24">
              <el-input placeholder="请输入密码" v-model="formData.password" show-password/>
            </el-col>
          </el-row>
          <el-button style="width: 100%" type="primary" @click="onSubmit">登录</el-button>
        </el-form>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import {login,getCaptcha} from '@/api'

export default {
  data() {
    return {
      formData: {
        email: '',
        password: '',
      },
    }
  },
  created() {
  },
  methods: {
    // 提交登录
    onSubmit() {
      login(this.formData).then((res) => {
        if (res.data.flag) {
          this.$message.success(res.data.message)
          // 将令牌转到localStorage中
          localStorage.setItem('token', res.data.data)
          // 跳转到主页
          this.$router.push({path: '/'})
        } else {
          this.$message.error(res.data.message)
        }
      })
    }
  }
}
</script>

<style lang="less">
.father-box {
  height: 80vh;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>