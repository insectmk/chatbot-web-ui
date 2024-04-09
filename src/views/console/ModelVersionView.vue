<template>
  <el-main>
    <!-- 导航  -->
    <Navbar/>
    <!--  条件栏  -->
    <el-row>
      <el-col :span="24">
        <el-input v-model="queryPageBean.queryString" placeholder="名称/备注" style="width: 200px;"></el-input>
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
              prop="name"
              label="模型名称"
              :show-overflow-tooltip='true'>
          </el-table-column>
          <el-table-column
              prop="versionNumber"
              label="版本号"
              :show-overflow-tooltip='true'
          >
          </el-table-column>
          <el-table-column
              prop="apiHost"
              label="API地址"
              :show-overflow-tooltip='true'>
          </el-table-column>
          <el-table-column
              prop="apiKey"
              label="API密钥"
              :show-overflow-tooltip='true'>
          </el-table-column>
          <el-table-column
              prop="maxToken"
              label="最长上下文"
              :show-overflow-tooltip='true'>
          </el-table-column>
          <el-table-column
              prop="deploymentTime"
              label="发布时间"
              :show-overflow-tooltip='true'>
          </el-table-column>
          <el-table-column
              prop="remark"
              label="备注"
              :show-overflow-tooltip='true'>
          </el-table-column>
          <el-table-column
              align="center"
              label="操作">
            <template slot-scope="scope">
              <el-button type="primary" size="mini" @click="openEdit(scope.row)">更新</el-button>
              <el-button type="danger" size="mini" @click="handleDelete(scope.row.id)">删除</el-button>
            </template>
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

    <!-- 新建用户的页面 -->
    <el-dialog title="添加用户" :visible.sync="dialogFormVisible">
      <el-form :model="formData" label-position="top">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="用户名" prop="username">
              <el-input v-model="formData.username"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="密码" prop="password">
              <el-input v-model="formData.password"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="邮箱" prop="email">
              <el-input v-model="formData.email"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="头像" prop="head">
              <el-input v-model="formData.head"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="最大会话数" prop="maxSession">
              <el-input v-model="formData.maxSession"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="剩余Token数" prop="tokens">
              <el-input v-model="formData.tokens"/>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleAdd">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 更新用户的页面 -->
    <el-dialog title="更新用户" :visible.sync="dialogFormVisibleEdit">
      <el-form :model="formData" label-position="top">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="用户名" prop="username">
              <el-input v-model="formData.username"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="密码" prop="password">
              <el-input v-model="formData.password"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="邮箱" prop="email">
              <el-input v-model="formData.email"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="头像" prop="head">
              <el-input v-model="formData.head"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="最大会话数" prop="maxSession">
              <el-input v-model="formData.maxSession"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="剩余Token数" prop="tokens">
              <el-input v-model="formData.tokens"/>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="formData = {};dialogFormVisibleEdit = false">取 消</el-button>
        <el-button type="primary" @click="handleEdit">确 定</el-button>
      </div>
    </el-dialog>
  </el-main>
</template>

<script>
import {findModel, addUser, editUser, deleteUser} from '@/api'

export default {
  data() {
    return {
      // 新增框的显示
      dialogFormVisible: false,
      // 编辑框的显示
      dialogFormVisibleEdit: false,
      // 查询条件
      queryPageBean: {
        currentPage: 1,
        pageSize: 10,
        queryString: ''
      },
      // MyBatis分页对象
      page: {},
      // 表单数据
      formData: {},
    }
  },
  methods: {
    // 删除用户
    handleDelete(id) {
      this.$confirm('此操作将会删除此用户与该用户的所有对话, 是否继续?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteUser({
          id: id
        }).then(res => {
          if (res.data.flag) {
            this.$notify.success({
              title: '成功',
              message: res.data.message,
            })
            this.findPage()
          } else {
            this.$notify.error({
              title: '错误',
              message: res.data.message,
            })
          }
        })
      })
    },
    // 打开编辑框
    openEdit(row) {
      this.formData = row
      this.dialogFormVisibleEdit = true
    },
    // 更新用户
    handleEdit() {
      editUser(this.formData).then(res => {
        if (res.data.flag) {
          this.$notify.success({
            title: '成功',
            message: res.data.message,
          })
          this.findPage()
          this.formData = {}
          this.dialogFormVisibleEdit = false
        } else {
          this.$notify.error({
            title: '错误',
            message: res.data.message,
          })
        }
      })
    },
    // 添加用户
    handleAdd() {
      addUser(this.formData).then(res => {
        if (res.data.flag) {
          this.$notify.success({
            title: '成功',
            message: res.data.message,
          })
          this.findPage()
          this.formData = {}
          this.dialogFormVisible = false
        } else {
          this.$notify.error({
            title: '错误',
            message: res.data.message,
          })
        }
      })
    },
    // 当前页发生变化
    handleCurrentChange(val) {
      this.queryPageBean.currentPage = val
      this.findPage()
    },
    // 获取用户
    findPage() {
      findModel(this.queryPageBean).then(res => {
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