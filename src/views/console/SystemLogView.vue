<template>
  <el-main>
    <!-- 导航  -->
    <Navbar/>
    <!--  条件栏  -->
    <el-row>
      <el-col :span="24">
        <el-input v-model="queryPageBean.queryString" placeholder="地址/邮箱/等级/信息"
                  style="width: 200px;"></el-input>
        <el-button @click="findPage()">查询</el-button>
        <el-button type="primary" @click="handleClearLog">清空日志</el-button>
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
                <el-form-item label="IP地址">
                  <span>{{ props.row.ipAddress }}</span>
                </el-form-item>
                <el-form-item label="邮箱">
                  <span>{{ props.row.opEmail }}</span>
                </el-form-item>
                <el-form-item label="日志等级">
                  <span>
                    <el-tag
                        size="medium"
                        :type="getLevelTagType(props.row.level)"
                        effect="dark">
                      {{ props.row.level }}
                    </el-tag>
                  </span>
                </el-form-item>
                <el-form-item label="信息">
                  <span>{{ props.row.message }}</span>
                </el-form-item>
                <el-form-item label="创建事件">
                  <span>{{ props.row.createTime }}</span>
                </el-form-item>
              </el-form>
            </template>
          </el-table-column>
          <el-table-column
              label="序号"
              type="index">
          </el-table-column>
          <el-table-column
              prop="ipAddress"
              label="IP地址"
              :show-overflow-tooltip='true'>
          </el-table-column>
          <el-table-column
              prop="opEmail"
              label="操作人邮箱"
              :show-overflow-tooltip='true'>
          </el-table-column>
          <el-table-column
              prop="level"
              label="操作等级"
              :show-overflow-tooltip='true'>
            <template slot-scope="scope">
              <el-tag
                  size="medium"
                  :type="getLevelTagType(scope.row.level)"
                  effect="dark">
                {{ scope.row.level }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column
              prop="message"
              label="操作信息"
              :show-overflow-tooltip='true'>
          </el-table-column>
          <el-table-column
              prop="createTime"
              label="创建时间"
              :show-overflow-tooltip='true'
          >
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
import {clearSystemLog, findSystemLog} from '@/api'

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
    // 清空日志
    handleClearLog() {
      this.$confirm('此操作将会清空所有的日志, 是否继续?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        clearSystemLog().then(res => {
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
    // 获取等级的Tag标签type值
    getLevelTagType(level) {
      if (level === '信息') {
        return 'success'
      } else if (level === '警告') {
        return 'warning'
      } else if (level === '错误') {
        return 'danger'
      }
    },
    // 当前页发生变化
    handleCurrentChange(val) {
      this.queryPageBean.currentPage = val
      this.findPage()
    },
    // 获取分页数据
    findPage() {
      return findSystemLog(this.queryPageBean).then(res => {
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
</style>