<template>
  <el-row>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="this.$route.path === '/console/user' ? undefined : { path: '/console' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>{{ navigate }}</el-breadcrumb-item>
    </el-breadcrumb>
    <br />
  </el-row>
</template>

<script>
export default {
  data() {
    return {
      navigate: this.$route.name
    }
  }
}
</script>

<style>

</style>