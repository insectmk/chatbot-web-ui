<template>
  <el-main>
    <Navbar></Navbar>
    <el-tabs v-model="chartName" @tab-click="handleClickTabs">
      <el-tab-pane label="模型使用量统计" name="chart">
        <div ref="chart" style="height:75vh"></div>
      </el-tab-pane>
      <el-tab-pane label="模型评分情况" name="rateBumpChart">
        <div ref="rateBumpChart" style="height:75vh"></div>
      </el-tab-pane>
    </el-tabs>
  </el-main>
</template>

<script>
import * as echarts from 'echarts'
import {getModelUsageStatistic, getModelRateStatistic} from '@/api'

export default {
  data() {
    return {
      // 模型评分凹凸图数据
      modelRateStatisticData: {
        days: [],
        series: [],
      },
      // 当前Tabs
      chartName: 'chart',
      // 模型使用量饼图数据
      modelUsageStatisticData: {
        modelNames: [],
        modelEChartsPieDates: [],
      }
    }
  },
  methods: {
    // 初始化模型评分凹凸图
    initRateBumpChart() {
      // 通过 $ref 进行挂载
      let myChart = echarts.init(this.$refs.rateBumpChart)
      let option = {
        title: {
          text: ''
        },
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          data: this.modelRateStatisticData.series
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        toolbox: {
          feature: {
            saveAsImage: {}
          }
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: this.modelRateStatisticData.days
        },
        yAxis: {
          type: 'value'
        },
        series: this.modelRateStatisticData.series
      }
      // 装载数据
      myChart.setOption(option)
      // 自适应
      window.addEventListener("resize",function() {
        myChart.resize();
      });
    },
    // Tabs点击切换事件
    handleClickTabs(tab, event) {
      // 解决Tabs切换图表不出现的情况
      this.$nextTick(() => {
        echarts.getInstanceByDom(this.$refs.chart).resize()
        echarts.getInstanceByDom(this.$refs.rateBumpChart).resize()
      })
    },
    // 获取模型评价凹凸图数据
    getModelRateStatistic() {
      return getModelRateStatistic().then(res => {
        this.modelRateStatisticData = res.data.data
      }).then(() => {
        // 初始化图表
        this.initRateBumpChart()
      })
    },
    // 获取模型使用量图表数据
    getModelUsageStatistic() {
      return getModelUsageStatistic().then(res => {
        this.modelUsageStatisticData = res.data.data
      }).then(() => {
        // 初始化图表
        this.initChart()
      })
    },
    // 初始化模型使用量饼图
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

    Promise.all([
      // 初始化模型使用量图表
      this.getModelUsageStatistic(),
      // 初始化模型评分凹凸图
      this.getModelRateStatistic(),
    ]).then(([args1,args2]) => {
      loading.close();
    }).catch(error => {
      // 如果任何一个操作失败，则在这里处理错误
      console.error(error);
      // 关闭加载框
      loading.close();
    })
  }
}
</script>

<style lang="less">

</style>