<template>
  <el-container>
    <!-- 头部 -->
    <el-header style="display: flex; font-size: 12px">
      <!-- 头部左侧系统名 -->
      <span style="margin-right: auto; font-size: 18px;">
        <el-image :src="require('@/assets/img/logo.png')" class="user-avatar" />
        智能聊天机器人
      </span>
      <!-- 头部右侧用户功能下拉菜单 -->
      <el-dropdown style="margin-left: auto;" trigger="click">
          <span class="el-dropdown-link">
            <el-image :src="userInfo.head" class="user-avatar" />
            {{ userInfo.username }}<i class="el-icon-arrow-down el-icon--right"></i>
          </span>
        <el-dropdown-menu slot="dropdown">
          <!-- 个人信息 -->
          <el-dropdown-item @click.native="dialogVisibleUserInfo = true">个人信息</el-dropdown-item>
          <!-- 修改密码 -->
          <el-dropdown-item divided @click.native="dialogVisibleEdit = true">修改密码</el-dropdown-item>
          <!-- 退出登录 -->
          <el-popover
              placement="top-start"
              width="160"
              v-model="logoutVisible">
            <p>确定退出登录吗？</p>
            <div style="text-align: right; margin: 0">
              <el-button size="mini" type="text" @click="logoutVisible = false">取消</el-button>
              <el-button type="primary" size="mini" @click="logout()">确定</el-button>
            </div>
            <span slot="reference">
                  <el-dropdown-item divided>
                  安全退出
                  </el-dropdown-item>
                </span>
          </el-popover>
        </el-dropdown-menu>
      </el-dropdown>
    </el-header>

    <el-container>
      <!-- 侧边栏 -->
      <el-aside style="width: auto; background-color: rgb(238, 241, 246)">
        <el-popover
            placement="right"
            width="130"
            trigger="hover"
            content="展开/收起侧边栏">
          <el-button plain slot="reference" style="width: 100%" size="small" @click="isCollapse = !isCollapse">展/收</el-button>
        </el-popover>
        <br/>
        <el-popover
            placement="right"
            width="130"
            trigger="hover"
            content="管理我的搭档">
          <el-button plain slot="reference" type="success" style="width: 100%" size="small" @click="managePartnerClick">搭档</el-button>
        </el-popover>
        <br/>
        <el-popover
            placement="right"
            width="130"
            trigger="hover"
            content="创建一个新的会话">
          <el-button plain slot="reference" type="primary" style="width: 100%" size="small" @click="addSessionClick">新建</el-button>
        </el-popover>
        <br/>
        <el-popover
            placement="top-start"
            width="160"
            v-model="delSessionVisible">
          <p>确定删除当前会话吗？</p>
          <div style="text-align: right; margin: 0">
            <el-button size="mini" type="text" @click="delSessionVisible = false">取消</el-button>
            <el-button type="primary" size="mini" @click="delSessionAct">确定</el-button>
          </div>
          <span slot="reference">
            <el-button plain type="danger"
                       style="width: 100%"
                       size="small">删除</el-button>
          </span>
        </el-popover>

        <!-- 对话列表 -->
        <el-menu
            :default-active="sessionId"
            :collapse="isCollapse"
            class="el-menu-vertical-demo">
            <el-menu-item
                v-for="(session) in sessions"
                @click="sessionId = session.id"
                :key="session.id"
                :index="session.id">
              <span slot="title">{{ session.remark }}</span>
              <i class="el-icon-chat-dot-round"></i>
            </el-menu-item>
        </el-menu>
      </el-aside>

      <!-- 主内容（会话消息） -->
      <Dialog :sessionId="sessionId"></Dialog>

      <!--  密码编辑框  -->
      <el-dialog
          title="修改密码"
          :visible.sync="dialogVisibleEdit"
          width="30%">

        <el-form :model="passwordEdit"
                 :rules="formRules"
                  ref="passwordEdit">
          <el-form-item prop="password">
            <el-input v-model="passwordEdit.password" show-password placeholder="请输入新密码"/>
          </el-form-item>
          <el-form-item prop="password">
            <el-input v-model="passwordEdit.passwordRepeat" show-password placeholder="请重复密码"/>
          </el-form-item>
        </el-form>

        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisibleEdit = false">取 消</el-button>
          <el-button type="primary" @click="editPassword('passwordEdit')">确 定</el-button>
        </span>
      </el-dialog>

      <!--  新建会话框  -->
      <el-dialog
          title="新建会话"
          :visible.sync="dialogVisibleAddSession"
          width="30%">

        <el-form :model="formDataSession" :rules="formRules" ref="sessionAdd">
          <el-form-item prop="modelVersionId">
            <el-select style="width: 100%" v-model="formDataSession.modelVersionId" placeholder="选择模型">
              <el-popover
                  v-for="modelVersion in modelVersions"
                  :key="modelVersion.id"
                  placement="right"
                  :title="modelVersion.name"
                  width="200"
                  trigger="hover"
                  :content="modelVersion.remark">
                <el-option :label="modelVersion.name"
                           :value="modelVersion.id"
                           slot="reference"></el-option>
              </el-popover>
            </el-select>
          </el-form-item>
          <el-form-item prop="partnerId">
            <el-select style="width: 100%" v-model="formDataSession.partnerId" placeholder="选择搭档">
              <el-popover
                  v-for="partner in [...new Set(partners, publicPartners)]"
                  :key="partner.id"
                  placement="right"
                  :title="partner.name"
                  width="200"
                  trigger="hover"
                  :content="partner.prompt">
                <el-option :label="partner.name"
                           :value="partner.id"
                           style="display: flex;align-items: center;"
                           slot="reference">
                  <el-avatar :src="partner.head" size="small" style="margin-right: 10px;"></el-avatar>
                  {{partner.name}}
                </el-option>
              </el-popover>
            </el-select>
          </el-form-item>
          <el-form-item prop="remark">
            <el-input v-model="formDataSession.remark" placeholder="对话备注"/>
          </el-form-item>
        </el-form>

        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisibleEdit = false">取 消</el-button>
          <el-button type="primary" @click="addSessionAct('sessionAdd')">确 定</el-button>
        </span>
      </el-dialog>

      <!--  个人信息框  -->
      <el-dialog
          title="个人信息"
          :visible.sync="dialogVisibleUserInfo"
          width="30%">

        <el-form label-width="auto"
                 label-position="left">
          <el-form-item label="用户名">
            <el-input v-model="userInfo.username" readonly placeholder="用户名"/>
          </el-form-item>
          <el-form-item label="邮箱">
            <el-input v-model="userInfo.email" readonly placeholder="邮箱"/>
          </el-form-item>
          <el-form-item label="头像">
            <el-input v-model="userInfo.head" readonly placeholder="头像"/>
          </el-form-item>
          <el-form-item label="API密钥">
            <template slot-scope="{}" slot="label">
              <span>API密钥</span>
              <el-tooltip class="item" effect="dark" placement="top">
                <!--  问号的图标   -->
                <i class="el-icon-question" @click="dialogVisibleAPI = true" style="font-size: 14px; vertical-align: middle;"></i>
                <!--  提示的内容 -->
                <div slot="content">
                  点击查看API使用说明
                </div>
              </el-tooltip>
            </template>

            <template>
              <el-input v-model="userInfo.apiKey" readonly placeholder="API密钥">
                <el-button slot="prepend" @click="copyApiKey">复制</el-button>
                <el-button slot="append" @click="getApiKeyClick">重新生成</el-button>
              </el-input>
            </template>
          </el-form-item>
          <el-form-item label="最大会话数">
            <el-input v-model="userInfo.maxSession" readonly placeholder="注册时间"/>
          </el-form-item>
          <el-form-item label="剩余Tokens">
            <el-input v-model="userInfo.tokens" readonly placeholder="注册时间"/>
          </el-form-item>
          <el-form-item label="注册时间">
            <el-input v-model="userInfo.registrationTime" readonly placeholder="注册时间"/>
          </el-form-item>
          <el-form-item label="最后登录时间">
            <el-input v-model="userInfo.lastLoginTime" readonly placeholder="最后登录时间"/>
          </el-form-item>
        </el-form>

        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisibleUserInfo = false">关 闭</el-button>
<!--          <el-button type="primary" @click="editPassword">确 定</el-button>-->
        </span>
      </el-dialog>

      <!-- API文档 -->
      <el-dialog
          title="API使用说明"
          :visible.sync="dialogVisibleAPI"
          width="50%">
        <div v-html="marked(apiTips)"></div>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="dialogVisibleAPI = false">确 定</el-button>
        </span>
      </el-dialog>

      <!-- 搭档管理页面 -->
      <el-dialog
          title="我的搭档"
          :visible.sync="dialogVisiblePartner"
          width="50%">
        <el-button type="primary" plain style="margin-bottom: 20px" @click="addPartnerClick">新增搭档</el-button>
        <el-tabs v-model="partnerActiveName" >
          <el-tab-pane label="我的搭档" name="myPartner">
            <el-row>
              <el-col
                  class="partner"
                  v-for="partner in partners"
                  :key="partner.id"
                  :xs="22"
                  :sm="10"
                  :md="10"
                  :lg="5"
                  :xl="5">
                <el-avatar :src="partner.head"></el-avatar>
                {{ partner.name }}
                <span style="margin-left: auto;cursor: pointer;">
                  <i class="el-icon-edit" title="编辑" @click="partnerEdit(partner)"></i>
                  <br />
                  <i class="el-icon-delete" title="删除" @click="partnerDel(partner.id, partner.name)"></i>
                </span>
              </el-col>
            </el-row>
          </el-tab-pane>
          <el-tab-pane label="公共搭档" name="publicPartner">
            <el-col
                class="partner"
                v-for="partner in publicPartners"
                :key="partner.id"
                :span="5">
              <el-avatar :src="partner.head"></el-avatar>
              {{ partner.name }}
            </el-col>
          </el-tab-pane>
        </el-tabs>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisiblePartner = false">关 闭</el-button>
        </span>
      </el-dialog>

      <!--  新增搭档框  -->
      <el-dialog
          title="新建搭档"
          :visible.sync="dialogVisiblePartnerAdd"
          width="30%">

        <el-form :model="formDataPartner" :rules="formRules" ref="partnerAdd">
          <el-form-item prop="name">
            <el-input v-model="formDataPartner.name" placeholder="搭档名称"/>
          </el-form-item>
          <el-form-item prop="prompt">
            <el-input
                type="textarea"
                :autosize="{ minRows: 2, maxRows: 8}"
                v-model="formDataPartner.prompt"
                placeholder="人物设定"/>
          </el-form-item>
          <el-form-item prop="head">
            <el-input v-model="formDataPartner.head" placeholder="头像地址"/>
          </el-form-item>
          <el-form-item prop="isPublic" label="是否公开">
            <el-switch v-model="formDataPartner.isPublic"></el-switch>
          </el-form-item>
        </el-form>

        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisiblePartnerAdd = false">取 消</el-button>
          <el-button type="primary" @click="addPartnerAct('partnerAdd')">确 定</el-button>
        </span>
      </el-dialog>

      <!--  编辑搭档框  -->
      <el-dialog
          :title="`编辑${formDataPartner.name}搭档`"
          :visible.sync="dialogVisiblePartnerEdit"
          width="30%">

        <el-form :model="formDataPartner" :rules="formRules" ref="partnerEdit">
          <el-form-item prop="name">
            <el-input v-model="formDataPartner.name" placeholder="搭档名称"/>
          </el-form-item>
          <el-form-item prop="prompt">
            <el-input
                type="textarea"
                :autosize="{ minRows: 2, maxRows: 8}"
                v-model="formDataPartner.prompt"
                placeholder="人物设定"/>
          </el-form-item>
          <el-form-item prop="head">
            <el-input v-model="formDataPartner.head" placeholder="头像地址"/>
          </el-form-item>
          <el-form-item prop="isPublic" label="是否公开">
            <el-switch v-model="formDataPartner.isPublic"></el-switch>
          </el-form-item>
        </el-form>

        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisiblePartnerEdit = false">取 消</el-button>
          <el-button type="primary" @click="editPartnerAct('partnerEdit')">确 定</el-button>
        </span>
      </el-dialog>

    </el-container>
  </el-container>
</template>

<script>
import {
  editPartner,
  deletePartner,
  addPartner,
  getPublicPartner,
  getUserPartner,
  getApiKey,
  getSessionAll,
  getUserInfo,
  editPassword,
  delSession,
  getModelVersionAll,
  getApiTips,
  addSession, deleteModel
} from "@/api"
import Dialog from "@/components/Dialog.vue"
import {apiUrl, password} from "@/util/RegularUtil"
import {marked} from 'marked'

export default {
  components: {
    Dialog
  },
  data() {
    return {
      // 编辑搭档页面的显示
      dialogVisiblePartnerEdit: false,
      // 搭档表单数据
      formDataPartner: {},
      // 公共搭档
      publicPartners: [],
      // 用户搭档
      partners: [],
      // 添加搭档页面
      dialogVisiblePartnerAdd: false,
      // 搭档管理页面显示哪个
      partnerActiveName: 'myPartner',
      // 搭档管理页面的显示
      dialogVisiblePartner: false,
      // API内容提示
      apiTips: '',
      // API文档的显示
      dialogVisibleAPI: false,
      // 表单验证规则
      formRules: {
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { pattern: password, message: '至少包含数字、字母和特殊字符，长度在6到24位之间', trigger: 'blur' }
        ],
        modelVersionId: [
          { required: true, message: '请选择模型', trigger: 'blur' },
        ],
        partnerId: [
          { required: true, message: '请选择搭档', trigger: 'blur' },
        ],
        remark: [
          { required: true, message: '请输入备注', trigger: 'blur' },
        ],
        name: [
          { required: true, message: '请输入搭档名称', trigger: 'blur' },
        ],
        prompt: [
          { required: true, message: '请输入人物设定', trigger: 'blur' },
        ],
        head: [
          { required: true, message: '请输入头像地址', trigger: 'blur' },
        ],
      },
      // 新建对话框显示控制
      dialogVisibleAddSession: false,
      // 新建对话的表单内容
      formDataSession: {
        // 模型ID
        modelVersionId: '',
        // 对话备注
        remark: '',
      },
      isCollapse: true,
      passwordEdit: {
        password: '', // 密码
        passwordRepeat: '', // 重复密码
      },
      dialogVisibleEdit: false, // 编辑框的显示
      // 登出按钮的显示控制
      logoutVisible: false,
      // 删除会话
      delSessionVisible: false,
      // 用户会话列表
      sessions: [],
      // 当前会话的ID
      sessionId: '',
      // 用户信息
      userInfo: {
        username: '',
        email: '',
        head: '',
        apiKey: '',
        password: '',
        registrationTime: '',
        lastLoginTime: ''
      },
      // 模型列表
      modelVersions: [],
      // 个人信息编辑框显示
      dialogVisibleUserInfo: false,
    };
  },
  methods: {
    // 更新搭档
    editPartnerAct(formName) {
      // 验证表单
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // 验证成功
          editPartner(this.formDataPartner).then(res => {
            if (res.data.flag) {
              // 成功逻辑
              this.$notify.success({
                title: '成功',
                message: res.data.message
              })
              this.getUserPartner()
              this.getPublicPartner()
              this.formDataPartner = {}
              this.dialogVisiblePartnerEdit = false
            } else {
              this.$notify.error({
                title: '错误',
                message: res.data.message,
              })
            }
          })
        } else {
          // 失败逻辑
          this.$notify.error({
            title: '错误',
            message: '请按要求填写表单',
          })
        }
      })
    },
    // 点击搭档编辑按钮
    partnerEdit(partner) {
      this.formDataPartner = partner
      this.dialogVisiblePartnerEdit = true
    },
    // 删除搭档
    partnerDel(id, name) {
      this.$confirm(`正在删除${name}搭档, 是否继续?`, '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deletePartner({
          id: id
        }).then(res => {
          if (res.data.flag) {
            this.$notify.success({
              title: '成功',
              message: res.data.message,
            })
            this.getUserPartner()
            this.getPublicPartner()
          } else {
            this.$notify.error({
              title: '错误',
              message: res.data.message,
            })
          }
        })
      })
    },
    // 添加搭档
    addPartnerAct(formName) {
      // 验证表单
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // 验证成功
          addPartner(this.formDataPartner).then(res => {
            if (res.data.flag) {
              // 成功逻辑
              this.$notify.success({
                title: '成功',
                message: res.data.message
              })
              this.getUserPartner()
              this.getPublicPartner()
              this.formDataPartner = {}
              this.dialogVisiblePartnerAdd = false
            } else {
              this.$notify.error({
                title: '错误',
                message: res.data.message,
              })
            }
          })
        } else {
          // 失败逻辑
          this.$notify.error({
            title: '错误',
            message: '请按要求填写表单',
          })
        }
      })
    },
    // 添加搭档页面
    addPartnerClick() {
      this.dialogVisiblePartnerAdd = true
    },
    // 点击管理搭档按钮
    managePartnerClick() {
      // 查询用户搭档
      this.getUserPartner()
      // 查询公共搭档
      this.getPublicPartner()
      // 打开搭档弹出框
      this.dialogVisiblePartner = true
    },
    // 查询公共搭档
    getPublicPartner() {
      getPublicPartner().then(res => {
        this.publicPartners = res.data.data
      })
    },
    // 查询用户搭档
    getUserPartner() {
      getUserPartner().then(res => {
        this.partners = res.data.data
      })
    },
    marked,
    // 复制APIKEY
    copyApiKey() {
      this.$copyText(this.userInfo.apiKey).then(event => {
        this.$notify.success({
          title: '成功',
          message: '成功复制API密钥',
        })
      })
    },
    // 获取API密钥
    getApiKeyClick() {
      this.$confirm('此操作将会清除之前的API, 是否继续?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        getApiKey().then(res => {
          this.userInfo.apiKey = res.data.data
        }).then(() => {
          this.getSessions()
          this.$notify.success({
            title: '成功',
            message: '已生成API密钥',
          });
        })
      })
    },
    // 添加会话
    addSessionAct(formName) {
      // 验证表单
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // 发送添加请求
          addSession(this.formDataSession).then(res => {
            if (res.data.flag) {
              // 成功提示
              this.$notify.success({
                title: '成功',
                message: res.data.message,
              });
              // 获取用户对话列表
              this.getSessions()
              // 清除历史信息
              this.formDataSession.modelVersionId = ''
              this.formDataSession.remark = ''
              // 关闭添加框
              this.dialogVisibleAddSession = false
            } else {
              // 成功提示
              this.$notify.error({
                title: '错误',
                message: res.data.message,
              });
            }
          })
        } else {
          // 失败逻辑
          this.$notify.error({
            title: '错误',
            message: '请按要求填写表单',
          })
        }
      })
    },
    // 点击新建会话按钮
    addSessionClick() {
      // 查询所有的搭档信息
      this.getUserPartner()
      this.getPublicPartner()
      // 查询所有的模型信息
      getModelVersionAll().then(res => {
        this.modelVersions = res.data.data
      }).then(() => {
        // 打开编辑框
        this.dialogVisibleAddSession = true
      })
    },
    // 删除会话
    delSessionAct() {
      // 关闭删除会话确认框
      this.delSessionVisible = false
      // 发送删除请求
      delSession({
        sessionId: this.sessionId
      }).then(res => {
          if (res.data.flag) {
            // 成功提示
            this.$notify.success({
              title: '成功',
              message: res.data.message,
            });
          } else {
            this.$notify.error({
              title: '错误',
              message: res.data.message,
            });
          }
          return res.data.flag
      }).then(flag => {
        if (flag) {
          // 清除会话数组中对应的数据
          this.sessions = this.sessions.filter(session => session.id !== this.sessionId)
          // 重新设置当前会话
          this.sessionId = this.sessions[0].id
        }
      })
    },
    // 修改密码
    editPassword(formName) {
      // 验证表单
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // 判断密码是否一致
          if (this.passwordEdit.password !== this.passwordEdit.passwordRepeat) {
            this.$notify.error({
              title: '错误',
              message: '两次密码不一致',
            })
          } else {
            // 发送修改请求
            editPassword({
              password: this.passwordEdit.password
            }).then((res) => {
              if (res.data.flag) {
                this.$notify.success({
                  title: '成功',
                  message: '密码修改成功,请重新登录！'
                })
                this.dialogVisibleEdit = false
                // 重新登录
                localStorage.removeItem('token')
                this.$router.replace({path: '/login'})
              } else {
                this.$notify.error({
                  title: '错误',
                  message: res.data.message
                })
              }
            })
          }
        } else {
          this.$notify.error({
            title: '错误',
            message: '请按要求填写内容',
          })
        }
      })
    },
    // 退出登录
    logout() {
      // 删除令牌
      localStorage.removeItem('token')
      this.logoutVisible = false
      this.$notify.success({
        title: '成功',
        message: '已安全退出',
      });
      this.$router.replace({path: '/login'})
    },
    // 获取用户信息
    getUser() {
      // 获取登录用户信息
      getUserInfo().then((res) => {
        if (res.data.flag) {
          this.userInfo = res.data.data
        } else {
          this.$notify.error({
            title: '错误',
            message: res.data.message,
          })
        }
      })
    },
    // 获取用户对话列表
    getSessions() {
      getSessionAll().then((res) => {
        this.sessions = res.data.data
        return res.data.data
      }).then((sessions) => {
        this.sessionId = sessions[0].id
      })
    }
  },
  created() {
    // 获取用户信息
    this.getUser()
    // 获取用户所有对话
    this.getSessions()
    // 获取API提示
    getApiTips().then(res => {
      this.apiTips = res.data.data
    })
  },
};
</script>

<style lang="less">
a {
  //去掉下换线
  text-decoration: none;
  //文字颜色更改
  color: black;
}

/**修改全局的滚动条*/
/**滚动条的宽度*/
::-webkit-scrollbar {
  width: 8px;

}

//滚动条的滑块
::-webkit-scrollbar-thumb {
  background-color: #eaecf1;
  border-radius: 3px;
}


// 解决无法占满高度的问题
body, html {
  padding: 0;
  margin: 0;
  height: 100%;
}

.el-container {
  padding: 0;
  margin: 0;
  height: 100vh;
}

// 用户头像
.user-avatar {
  width: 30px;
  height: 30px;
  border-radius: 15px;
  vertical-align: middle;
}

.el-dropdown-link {
  cursor: pointer;
  color: #fff;
}

.el-icon-arrow-down {
  font-size: 12px;
}

.el-header {
  background-color: #c7d1d9;
  color: #333;
  line-height: 60px;
}

.el-aside {
  color: #333;
}

// 搭档盒子样式
.partner {
  margin: 8px;
  padding: 10px;
  border: 1px solid black;
  display: flex;
  align-items: center; /* 垂直居中 */
}
</style>