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
          <el-table-column type="expand">
            <template slot-scope="props">
              <el-form label-position="left" inline class="demo-table-expand">
                <el-form-item label="模型名称">
                  <span>{{ props.row.name }}</span>
                </el-form-item>
                <el-form-item label="版本号">
                  <span>{{ props.row.versionNumber }}</span>
                </el-form-item>
                <el-form-item label="API地址">
                  <span>{{ props.row.apiHost }}</span>
                </el-form-item>
                <el-form-item label="API密钥">
                  <span>{{ props.row.apiKey }}</span>
                </el-form-item>
                <el-form-item label="Temperature">
                  <span>{{ props.row.temperature }}</span>
                </el-form-item>
                <el-form-item label="Top_P">
                  <span>{{ props.row.topP }}</span>
                </el-form-item>
                <el-form-item label="Presence">
                  <span>{{ props.row.presencePenalty }}</span>
                </el-form-item>
                <el-form-item label="Frequency">
                  <span>{{ props.row.frequencyPenalty }}</span>
                </el-form-item>
                <el-form-item label="最长上下文">
                  <span>{{ props.row.maxToken }}</span>
                </el-form-item>
                <el-form-item label="生成Token">
                  <span>{{ props.row.generateTokens }}</span>
                </el-form-item>
                <el-form-item label="发布时间">
                  <span>{{ props.row.deploymentTime }}</span>
                </el-form-item>
                <el-form-item label="备注">
                  <span>{{ props.row.remark }}</span>
                </el-form-item>
              </el-form>
            </template>
          </el-table-column>
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
              prop="isOnline"
              label="在线状态"
              :show-overflow-tooltip='true'>
            <template slot-scope="scope">
              <el-tag
                  v-if="isUrlOnline((scope.row.apiHost + '/status').replace(/([^:])(\/\/+)/g, '$1/'), 'GET')"
                  type="success"
                  size="small"
                  effect="dark">
                在线
              </el-tag>
              <el-tag
                  v-else
                  type="danger"
                  size="small"
                  effect="dark">
                离线
              </el-tag>
            </template>
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
      <el-form :model="formData" :rules="formRules" ref="addForm" label-position="top">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="模型名称" prop="name">
              <el-input v-model="formData.name"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="版本号（例：0.0.1）" prop="versionNumber">
              <el-input v-model="formData.versionNumber"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="API地址（例：http://127.0.0.1:8000/）" prop="apiHost">
              <el-input v-model="formData.apiHost"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="API密钥（无则留空）" prop="apiKey">
              <el-input v-model="formData.apiKey"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="Temperature（默认1）" prop="temperature">
              <el-input v-model="formData.temperature"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="Top_P（默认0.3）" prop="topP">
              <el-input v-model="formData.topP"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="Presence Penalty（默认0）" prop="presencePenalty">
              <el-input v-model="formData.presencePenalty"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="Frequency Penalty（默认1）" prop="frequencyPenalty">
              <el-input v-model="formData.frequencyPenalty"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="最大上下文（默认1024）" prop="maxToken">
              <el-input type="number" v-model="formData.maxToken"/>
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
        <el-button type="primary" @click="handleAdd('addForm')">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 更新页面 -->
    <el-dialog title="更新模型" :visible.sync="dialogFormVisibleEdit" @close='handleEditClose'>
      <el-form :model="formData" :rules="formRules" ref="editForm" label-position="top">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="模型名称" prop="name">
              <el-input v-model="formData.name"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="版本号（例：0.0.1）" prop="versionNumber">
              <el-input v-model="formData.versionNumber"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="API地址（例：http://127.0.0.1:8000/）" prop="apiHost">
              <el-input v-model="formData.apiHost"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="API密钥（无则留空）" prop="apiKey">
              <el-input v-model="formData.apiKey"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="Temperature（默认1）" prop="temperature">
              <el-input v-model="formData.temperature"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="Top_P（默认0.3）" prop="topP">
              <el-input v-model="formData.topP"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="Presence Penalty（默认0）" prop="presencePenalty">
              <el-input v-model="formData.presencePenalty"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="Frequency Penalty（默认1）" prop="frequencyPenalty">
              <el-input v-model="formData.frequencyPenalty"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="最大上下文（默认1024）" prop="maxToken">
              <el-input type="number" v-model="formData.maxToken"/>
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
        <el-button type="primary" @click="handleEdit('editForm')">确 定</el-button>
      </div>
    </el-dialog>
  </el-main>
</template>

<script>
import {findModel, addModel, editModel, deleteModel} from '@/api'
import {apiUrl} from "@/util/RegularUtil"
import {isUrlOnline} from "@/util/URLUtil"

export default {
  data() {
    return {
      // 表单验证规则
      formRules: {
        name: [
          { required: true, message: '请输入模型名称', trigger: 'blur' },
        ],
        versionNumber: [
          { required: true, message: '请输入模型版本号', trigger: 'blur' },
        ],
        apiHost: [
          { required: true, message: '请输入模型接口地址', trigger: 'blur' },
          { pattern: apiUrl, message: '请输入有效的接口地址', trigger: 'blur' }
        ],
        remark: [
          { required: true, message: '请输入备注', trigger: 'blur' },
        ],
      },
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
    isUrlOnline,
    // 编辑框关闭
    handleEditClose() {
      this.formData = {}
    },
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
    handleEdit(formName) {
      // 验证表单
      this.$refs[formName].validate((valid) => {
        if (valid) {
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
        } else {
          // 错误提示
          this.$notify.error({
            title: '错误',
            message: '请按要求填写内容'
          })
        }
      })
    },
    // 添加
    handleAdd(formName) {
      // 验证表单
      this.$refs[formName].validate((valid) => {
        if (valid) {
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
        } else {
          // 错误提示
          this.$notify.error({
            title: '错误',
            message: '请按要求填写内容'
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
// 表格展开行样式
.demo-table-expand {
  font-size: 0;
}
.demo-table-expand label {
  width: 90px;
  color: #99a9bf;
}
.demo-table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 50%;
}
</style>