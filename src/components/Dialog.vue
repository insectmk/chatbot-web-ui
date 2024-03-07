<template>
  <el-row class="container">
    <el-col v-if="dialogs === undefined || dialogs.length <= 0" :span="24" class="assistant">
      <h1>Hi 我是一个智能聊天机器人</h1>
      <p>极速有效地提升工作效率，聪明一点，每天少工作一小时！</p>
    </el-col>
    <el-col v-else :span="24"
            v-for="dialog in dialogs"
            :class="dialog.role">
      {{ dialog.content }}
    </el-col>
  </el-row>
</template>

<script>
export default {
  data() {
    return {

    }
  },
  props: {
    dialogs: []
  }
}
</script>

<style lang="less">
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