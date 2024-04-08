<template>
  <el-main>
    <!-- 导航  -->
    <Navbar/>
    <!--  条件栏  -->
    <el-row>
      <el-col :span="24">
        <el-input v-model="queryPageBean.queryString" placeholder="用户名/邮箱" style="width: 200px;"></el-input>
        <el-button @click="findPage()">查询</el-button>
        <el-button type="primary" @click="dialogFormVisible = true">新建</el-button>
      </el-col>
    </el-row>
    <el-row>
      <!--  表格  -->
      <el-col :span="24">
        <el-table
            :data="this.page.records"
            stripe
            highlight-current-row
            style="width: 100%">
          <el-table-column
              label="序号"
              type="index">
          </el-table-column>
          <el-table-column
              prop="username"
              label="用户名"
              :show-overflow-tooltip='true'
              >
          </el-table-column>
          <el-table-column
              prop="email"
              label="邮箱"
              :show-overflow-tooltip='true'
              >
          </el-table-column>
          <el-table-column
              prop="head"
              label="头像"
              :show-overflow-tooltip='true'
              >
          </el-table-column>
          <el-table-column
              prop="apiKey"
              label="API密钥"
              :show-overflow-tooltip='true'
             >
          </el-table-column>
          <el-table-column
              prop="registrationTime"
              label="注册时间"
              :show-overflow-tooltip='true'
              >
          </el-table-column>
          <el-table-column
              prop="lastLoginTime"
              label="最后登录时间"
              :show-overflow-tooltip='true'
              >
          </el-table-column>
          <el-table-column
              align="center"
              label="操作">
            <el-button type="primary" size="mini">更新</el-button>
            <el-button type="danger" size="mini">删除</el-button>
          </el-table-column>
        </el-table>
      </el-col>

      <el-col :span="24">
        <!--    分页组件-->
        <el-pagination
            align="right"
            @current-change="handleCurrentChange"
            :current-page="queryPageBean.currentPage"
            :page-size="queryPageBean.pageSize"
            layout="total, prev, pager, next, jumper"
            :total="page.total">
        </el-pagination>
      </el-col>
    </el-row>
  </el-main>
</template>

<script>
import {findUser} from '@/api'

export default {
  data() {
    return {
      // 查询条件
      queryPageBean: {
        currentPage: 1,
        pageSize: 10,
        queryString: ''
      },
      // MyBatis分页对象
      page: {},
    }
  },
  methods: {
    // 当前页发生变化
    handleCurrentChange(val) {
      this.queryPageBean.currentPage = val
      this.findPage()
    },
    // 获取用户
    findPage() {
      findUser(this.queryPageBean).then(res => {
        if (res.data.flag) {
          this.page = res.data.data
        } else {
          this.$notify.error({
            title: '错误',
            message: res.data.message,
          })
        }
      })
    }
  },
  created() {
    // 获取用户
    this.findPage();
  },
}
</script>

<style lang="less">

</style>