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
          <el-table-column type="expand">
            <template slot-scope="props">
              <el-form label-position="left" inline class="demo-table-expand">
                <el-form-item label="昵称">
                  <span>{{ props.row.username }}</span>
                </el-form-item>
                <el-form-item label="邮箱">
                  <span>{{ props.row.email }}</span>
                </el-form-item>
                <el-form-item label="头像">
                  <!-- 图片的显示 -->
                  <img class="headImg" :alt="`用户${props.row.username}的头像`" :src="props.row.head" width="70"/>
                </el-form-item>
                <el-form-item label="API密钥">
                  <span>{{ props.row.apiKey }}</span>
                </el-form-item>
                <el-form-item label="最大会话">
                  <span>{{ props.row.maxSession }}</span>
                </el-form-item>
                <el-form-item label="剩余Token">
                  <span>{{ props.row.tokens }}</span>
                </el-form-item>
                <el-form-item label="注册时间">
                  <span>{{ props.row.registrationTime }}</span>
                </el-form-item>
                <el-form-item label="最后登录">
                  <span>{{ props.row.lastLoginTime }}</span>
                </el-form-item>
              </el-form>
            </template>
          </el-table-column>
          <el-table-column
              label="序号"
              type="index">
          </el-table-column>
          <el-table-column
              prop="username"
              label="用户名"
              :show-overflow-tooltip='true'>
          </el-table-column>
          <el-table-column
              prop="email"
              label="邮箱"
              :show-overflow-tooltip='true'>
          </el-table-column>
          <el-table-column
              prop="maxSession"
              label="最大会话数"
              :show-overflow-tooltip='true'>
          </el-table-column>
          <el-table-column
              prop="tokens"
              label="剩余Token数"
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
    <el-dialog title="添加用户"
               :close-on-click-modal="false"
               :visible.sync="dialogFormVisible">
      <el-form :model="formData" :rules="formRules" ref="addFrom" label-position="top">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="用户名" prop="username">
              <el-input v-model="formData.username"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="密码" prop="password">
              <el-input show-password v-model="formData.password"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="邮箱" prop="email">
              <el-input v-model="formData.email"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="头像" prop="head">
              <el-upload
                  class="avatar-uploader"
                  :headers="header"
                  :action="userHeadUploadAddr"
                  :show-file-list="false"
                  :on-success="handleAvatarSuccess"
                  :before-upload="beforeAvatarUpload">
                <img :alt="`用户${formData.username}的头像`" v-if="formData.head" :src="formData.head" class="avatar">
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="最大会话数" prop="maxSession">
              <el-input type="number" v-model="formData.maxSession"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="剩余Token数" prop="tokens">
              <el-input type="number" v-model="formData.tokens"/>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleAdd('addFrom')">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 更新用户的页面 -->
    <el-dialog title="更新用户"
               :visible.sync="dialogFormVisibleEdit"
               :close-on-click-modal="false"
               @close="handleEditClose">
      <el-form :model="formData" :rules="formRules" ref="editForm" label-position="top">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="用户名" prop="username">
              <el-input v-model="formData.username"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="密码" prop="password">
              <el-input show-password v-model="formData.password"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="邮箱" prop="email">
              <el-input v-model="formData.email"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="头像">
              <el-upload
                  class="avatar-uploader"
                  :headers="header"
                  :action="userHeadUploadAddr"
                  :show-file-list="false"
                  :on-success="handleAvatarSuccess"
                  :before-upload="beforeAvatarUpload">
                <img v-if="formData.head" :src="formData.head" class="avatar">
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="最大会话数" prop="maxSession">
              <el-input type="number" v-model="formData.maxSession"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="剩余Token数" prop="tokens">
              <el-input type="number" v-model="formData.tokens"/>
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
import {findUser, addUser, editUser, deleteUser} from '@/api'
import {email, password, username} from "@/util/RegularUtil"
import axios  from "axios"
import {apis} from "@/api/request"

export default {
  data() {
    return {
      // 图片上传的头部信息
      header: {},
      // 图片上传地址
      userHeadUploadAddr: '',
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
          //{ required: true, message: '请输入密码', trigger: 'blur' },
          { pattern: password, message: '至少包含数字、字母和特殊字符，长度在6到24位之间', trigger: 'blur' }
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
      formData: {
        head: '',
      },
    }
  },
  methods: {
    // 上传图片的操作
    handleAvatarSuccess(res, file) {
      this.formData.head = URL.createObjectURL(file.raw);
      this.formData.isUploadHead = true
    },
    // 上传图片前验证文件
    beforeAvatarUpload(file) {
      const isIMG = file.type === 'image/jpeg';
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isIMG) {
        this.$message.error('上传头像图片只能是 JPG 格式!');
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!');
      }
      return isIMG && isLt2M;
    },
    // 编辑框关闭
    handleEditClose() {
      this.formData = {}
    },
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
    handleEdit(formName) {
      // 验证表单
      this.$refs[formName].validate((valid) => {
        if (valid) {
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
        } else {
          // 错误提示
          this.$notify.error({
            title: '错误',
            message: '请按要求填写内容'
          })
        }
      })

    },
    // 添加用户
    handleAdd(formName) {
      // 验证表单
      this.$refs[formName].validate((valid) => {
        if (valid) {
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
    // 获取用户
    findPage() {
      return findUser(this.queryPageBean).then(res => {
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
    // 获取图片上传地址
    this.userHeadUploadAddr = axios.defaults.baseURL + apis.uploadUserHead
    // 设置图片请求头部信息
    this.header = {
      token: localStorage.getItem("token")
    }

    // 加载框
    const loading = this.$loading({
      lock: true,
      text: '加载中……',
      spinner: 'el-icon-loading',
      background: 'rgba(0, 0, 0, 0.7)'
    });
    Promise.all([
      // 分页查询
      this.findPage(),
    ]).then(([args1,args2]) => {
      loading.close();
    }).catch(error => {
      // 如果任何一个操作失败，则在这里处理错误
      console.error(error);
      // 关闭加载框
      loading.close();
    })
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

// 头像显示框样式
.headImg {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409EFF;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
