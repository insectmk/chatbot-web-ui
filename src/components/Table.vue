<template>
  <el-row>
<!--  表格  -->
    <el-col :span="24">
      <el-table
          :data="tableData"
          stripe
          highlight-current-row
          style="width: 100%">
        <el-table-column
            label="序号"
            type="index"
            width="50">
        </el-table-column>
        <el-table-column
            v-for="(head) in tableHead"
            :key="head.prop"
            align="center"
            :label="head.name"
            :prop="head.prop"
            :show-overflow-tooltip="true"
            width="180">
          <template  slot-scope="scope">
            <span v-if="head.diy" v-html="head.diy(scope.row)">
            </span>
            <span v-else>
              {{ getNestedProperty(scope.row, head.prop) }}
            </span>
          </template>
        </el-table-column>

        <el-table-column
            align="center"
            label="操作">
          <template slot-scope="scope">
            <el-button v-for="op in operation" :disabled="op.isDisabled(scope.row)" :type="op.type" size="mini" @click="op.action(scope.row, scope.$index)">{{ op.name }}</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-col>
  </el-row>
</template>

<script>
import get from 'lodash/get';

export default {
  props: {
    tableHead: {}, // 表头
    tableData: {}, // 表数据
    operation: {}, // 操作
  },
  methods: {
    // 获取属性的值
    getNestedProperty(obj, propertyString) {
      return get(obj, propertyString);
    }
  },
  data() {
    return {

    }
  }
}
</script>

<style lang="less">
.el-tooltip__popper{
  max-width:20%;
}
.el-tooltip__popper,.el-tooltip__popper.is-dark {
  background: rgb(48, 65, 86) !important;
  color: #fff !important;
  line-height: 24px;
}
</style>