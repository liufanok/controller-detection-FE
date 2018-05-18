<template>
  <div :class="className" :style="{height:height,width:width}"></div>
</template>

<script>
import echarts from 'echarts'
require('echarts/theme/macarons') // echarts theme
import { debounce } from '@/utils'

const animationDuration = 6000

export default {
  props: {
    className: {
      type: String,
      default: 'chart'
    },
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '300px'
    },
    option: {
      type: Object,
      default: {}
    }
  },
  data() {
    return {
      chart: null
    }
  },
  mounted() {
    this.initChart()
    this.__resizeHanlder = debounce(() => {
      if (this.chart) {
        this.chart.resize()
      }
    }, 100)
    window.addEventListener('resize', this.__resizeHanlder)
  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    window.removeEventListener('resize', this.__resizeHanlder)
    this.chart.dispose()
    this.chart = null
  },
  watch: {
    option() {
      this.initChart()
    }
  },
  methods: {
    initChart() {
      this.chart = echarts.init(this.$el, 'macarons')

      this.chart.setOption({
        title: {
          text: this.$t('data.dev'),
          subtext: this.$t('data.from'),
          x: 'center',
          align: 'right'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: { // 坐标轴指示器，坐标轴触发有效
            type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        grid: {
          // top: '10%',
          left: '2%',
          right: '2%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [{
          type: 'category',
          data: this.option.x_data,
          axisTick: {
            alignWithLabel: true
          }
        }],
        yAxis: [{
          type: 'value',
          axisTick: {
            show: false
          }
        }],
        series: [{
          name: '',
          type: 'bar',
          stack: 'vistors',
          barWidth: '30%',
          itemStyle: {
            normal: {
              // 好，这里就是重头戏了，定义一个list，然后根据所以取得不同的值，这样就实现了，
              color: function(params) {
                // build a color map as your need.
                var colorList = [
                  // '#C1232B', '#B5C334', '#FCCE10', '#E87C25', '#27727B',
                  '#4BA0EB', 'rgb(166,142,214)', '#2CBCBC', '#F3A43B', '#60C0DD'
                  // '#D7504B', '#C6E579', '#F4E001', '#F0805A', '#26C0C0'
                ]
                return colorList[params.dataIndex]
              },
              // 以下为是否显示，显示位置和显示格式的设置了
              label: {
                show: true,
                position: 'top',
                //                             formatter: '{c}'
                formatter: '{c}'
              }
            }
          },
          data: this.option.y_data,
          animationDuration
        }]
      })
    }
  }
}
</script>
