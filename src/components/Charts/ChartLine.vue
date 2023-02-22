<template>
  <div :id="id" :class="className" :style="{height:height,width:width}" />
</template>
<script>
import echarts from 'echarts'
import resize from './mixins/resize'

export default {
  mixins: [resize],
  props: {
    data: {
      type: Object,
      default: ''
    },
    className: {
      type: String,
      default: 'chart'
    },
    id: {
      type: String,
      default: 'chart'
    },
    width: {
      type: String,
      default: '200px'
    },
    height: {
      type: String,
      default: '200px'
    }
  },
  data() {
    return {
      chart: null
    }
  },
  mounted() {
    this.initChart()
  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    this.chart.dispose()
    this.chart = null
  },
  methods: {
    initChart() {
      // console.log("data---", this.data)
      this.chart = echarts.init(document.getElementById(this.id))
      // 绘制图表
      let series = [];
      //多个柱状图
      for (var i = 0; i < this.data.tab_y_axis.length; i++) {
        let obj = {
          name: this.data.tab_y_axis[i],
          type: 'line',
          barGap: 0,
          emphasis: {
            focus: 'series'
          },
          data: this.data.y_axis[i]
        }
        series.push(obj)
      }
      // 绘制图表
      this.chart.setOption({
        title: { text: this.data.name },
        toolbox: {
          show: true,
          orient: 'vertical',
          left: 'right',
          top: 'center',
          feature: {
            mark: { show: true },
            dataView: { show: true, readOnly: false },
            magicType: { show: true, type: ['line', 'bar', 'stack'] },
            restore: { show: true },
            saveAsImage: { show: true }
          }
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            lineStyle: {
              color: '#57617B'
            }
          }
        },
        xAxis: {
          data: this.data.tab_x_axis
        },
        yAxis: [{
          type: 'value'
        }],
        series: series
      });
    }
  }
}

</script>
