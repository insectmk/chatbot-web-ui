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
              prop="generateTokens"
              label="已生成的Token数量"
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

    <!-- 新建页面 -->
    <el-dialog title="添加模型" :visible.sync="dialogFormVisible">
      <el-form :model="formData" label-position="top">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="模型名称" prop="name">
              <el-input v-model="formData.name"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="版本号" prop="versionNumber">
              <el-input v-model="formData.versionNumber"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="API地址" prop="apiHost">
              <el-input v-model="formData.apiHost"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="API密钥" prop="apiKey">
              <el-input v-model="formData.apiKey"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="最大上下文" prop="maxToken">
              <el-input v-model="formData.maxToken"/>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="备注" prop="remark">
              <el-input type="textarea" v-model="formData.remark"/>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleAdd">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 更新页面 -->
    <el-dialog title="更新模型" :visible.sync="dialogFormVisibleEdit">
      <el-form :model="formData" label-position="top">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="模型名称" prop="name">
              <el-input v-model="formData.name"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="版本号" prop="versionNumber">
              <el-input v-model="formData.versionNumber"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="API地址" prop="apiHost">
              <el-input v-model="formData.apiHost"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="API密钥" prop="apiKey">
              <el-input v-model="formData.apiKey"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="最大上下文" prop="maxToken">
              <el-input v-model="formData.maxToken"/>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="备注" prop="remark">
              <el-input type="textarea" v-model="formData.remark"/>
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
import {findModel, addModel, editModel, deleteModel} from '@/api'

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
    // 删除
    handleDelete(id) {
      this.$confirm('此操作将会删除此模型并转移基于此模型的对话到默认模型, 是否继续?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteModel({
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
    // 更新
    handleEdit() {
      editModel(this.formData).then(res => {
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
    // 添加
    handleAdd() {
      addModel(this.formData).then(res => {
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
    // 分页查询
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
    // 分页查询
    this.findPage();
  },
}
</script>

<style lang="less">

</style>