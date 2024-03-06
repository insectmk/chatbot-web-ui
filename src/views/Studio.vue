<template>
  <el-main>
    <Navbar></Navbar>
    <div class="box" style="height: 80vh">
      <table class="exceTable" cellspacing="0" cellpadding="0">
        <tr>
          <td colspan="4" class="headBody">会员数据统计</td>
        </tr>
        <tr>
          <td width='20%' class="tabletrBg">新增会员数</td>
          <td width='30%'>{{reportData.todayNewMember}}</td>
          <td width='20%' class="tabletrBg">总会员数</td>
          <td width='30%'>{{reportData.totalMember}}</td>
        </tr>
        <tr>
          <td class="tabletrBg">本周新增会员数</td>
          <td>{{reportData.thisWeekNewMember}}</td>
          <td class="tabletrBg">本月新增会员数</td>
          <td>{{reportData.thisMonthNewMember}}</td>
        </tr>
        <tr>
          <td colspan="4" class="headBody">预约到诊数据统计</td>
        </tr>
        <tr>
          <td class="tabletrBg">今日预约数</td>
          <td>{{reportData.todayOrderNumber}}</td>
          <td class="tabletrBg">今日到诊数</td>
          <td>{{reportData.todayVisitsNumber}}</td>
        </tr>
        <tr>
          <td class="tabletrBg">本周预约数</td>
          <td>{{reportData.thisWeekOrderNumber}}</td>
          <td class="tabletrBg">本周到诊数</td>
          <td>{{reportData.thisWeekVisitsNumber}}</td>
        </tr>
        <tr>
          <td class="tabletrBg">本月预约数</td>
          <td>{{reportData.thisMonthOrderNumber}}</td>
          <td class="tabletrBg">本月到诊数</td>
          <td>{{reportData.thisMonthVisitsNumber}}</td>
        </tr>
        <tr>
          <td colspan="4" class="headBody">热门套餐</td>
        </tr>
        <tr class="tabletrBg textCenter">
          <td>套餐名称</td>
          <td>预约数量</td>
          <td>占比</td>
          <td>备注</td>
        </tr>
        <tr v-for="setMeal in reportData.hotSetmeal">
          <td>{{setMeal.name}}</td>
          <td>{{setMeal.setMealCount}}</td>
          <td>{{setMeal.proportion}}%</td>
          <td>{{setMeal.remark}}</td>
        </tr>
      </table>
    </div>

  </el-main>
</template>

<script>
import { getReportBusiness } from '@/api'

export default {
  data() {
    return {
      reportData:{
        reportDate:null,
        todayNewMember :0,
        totalMember :0,
        thisWeekNewMember :0,
        thisMonthNewMember :0,
        todayOrderNumber :0,
        todayVisitsNumber :0,
        thisWeekOrderNumber :0,
        thisWeekVisitsNumber :0,
        thisMonthOrderNumber :0,
        thisMonthVisitsNumber :0,
        hotSetmeal : null
      }
    }
  },
  methods: {
  }
  ,
  created() {
    getReportBusiness().then((res) => {
      if(res.data.flag){
        this.reportData = res.data.data;
      }else{
        this.$message.error(res.data.message);
      }
    })
  }
}
</script>

<style lang="less">

</style>