<template>
  <el-main>
    <Navbar></Navbar>
    <div ref="chart" style="height:80vh"></div>
  </el-main>
</template>

<script>
import * as echarts from 'echarts'
import {getModelUsageStatistic} from '@/api'

export default {
  data() {
    return {
      modelUsageStatisticData: {
        modelNames: [],
        modelEChartsPieDates: [],
      }
    }
  },
  methods: {
    initChart() {
      // 通过 $ref 进行挂载
      let myChart = echarts.init(this.$refs.chart)
      let option = {
        title: {
          text: '模型使用量统计',
          subtext: '',
          left: 'left'
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        legend: {
          type: 'scroll',
          orient: 'vertical',
          right: 10,
          top: 20,
          bottom: 20,
          data: this.modelUsageStatisticData.modelNames
        },
        series: [
          {
            name: '模型名称',
            type: 'pie',
            radius: '55%',
            center: ['40%', '50%'],
            data: this.modelUsageStatisticData.modelEChartsPieDates,
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ]
      }
      myChart.setOption(option)
      // 自适应
      window.addEventListener("resize",function() {
        myChart.resize();
      });
    },
  },
  mounted() {
    // 加载框
    const loading = this.$loading({
      lock: true,
      text: '加载中……',
      spinner: 'el-icon-loading',
      background: 'rgba(0, 0, 0, 0.7)'
    });
    // 获取统计数据
    getModelUsageStatistic().then(res => {
      this.modelUsageStatisticData = res.data.data
    }).then(() => {
      // 初始化图表
      this.initChart()
    }).then(() => {
      // 关闭加载框
      loading.close();
    })
  }
}
</script>

<style lang="less">

</style>