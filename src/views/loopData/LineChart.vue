<style lang="scss" scoped>
  @function remfun($number) {
    @return ($number / 75)+rem;
  }
  * {
    -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
  }
  .line-echart{
      width: 100%;
  }
    .line-left-chart{
        width: 100%;
        height: 300px;
    }
</style>
<template>
  <div class="line-echart">
      <div class="line-left-chart" :id='id'></div>

  </div>
</template>
<script>
import echarts from 'echarts'
import { debounce } from '@/utils'
require('echarts/theme/macarons')
export default {
  data() {
    return {
      linechart: ''
    }
  },
  props: {
    etitle: {
      type: String,
      default: ''
    },
    id: {
      type: String,
      default: function() {
        const temp = []
        for (let i = 0; i < 6; i++) {
          const randomChar = String.fromCharCode(65 + Math.floor(Math.random() * 19) + i)
          temp.push(randomChar)
        }
        return temp.reduce((pre, next) => pre + next)
      }
    },
    option: {
      type: Object
    }
  },
  watch: {
    option() {
      this.initLineEchart(this.option)
    }
  },
  beforeDestroy() {
      if (this.linechart) {
          this.linechart.dispose()
      }
      window.removeEventListener('resize', this.__resizeHanlder)
  },
  mounted() {
      this.__resizeHanlder = debounce(() => {
          if (this.linechart) {
              this.linechart.resize()
          }
      }, 100)
      window.addEventListener('resize', this.__resizeHanlder)
    // this.initLineEchart(this.option)
  },
  methods: {
    initLineEchart(option) {
        if(this.linechart)  this.linechart.dispose()
      this.linechart = echarts.init(document.getElementById(this.id), 'macarons')
      const local_option = {
        toolbox: {

          feature: {
            dataZoom: {
              yAxisIndex: 'none'
            },
            restore: {},
            saveAsImage: {}
          }
        },
        legend: {
          show: true,
          data: ['PV', 'SV']
        },

        xAxis: {
          type: 'category',
          nameLocation: 'start',

          data: option.xdata
        },
        dataZoom: [{
        //   start: 0,
        //   end: 10
        }, {
          type: 'inside'
        }],
        yAxis: {
          min: 'dataMin',
          minInterval: 1,
          // show: false,
          type: 'value'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross'
          },
          padding: [5, 10]
        },
        series: [{
          smooth: true,
          name: 'PV',
          data: option.expectedData, // this.option.Ydata,
          type: 'line',
          symbolSize: 6,
          itemStyle: {
            color: '#3888fa',
            normal: {
              color: '#3888fa',
              lineStyle: {
                color: '#3888fa',
                width: 2
              },
              areaStyle: {
                color: '#f3f9ff'
              }
            }
          },
          animationDuration: 2800,
          animationEasing: 'quadraticOut'
        }, {
          smooth: true,
          name: 'SV',
          itemStyle: {
            color: '#FF005A',
            normal: {
              color: '#FF005A',
              lineStyle: {
                color: '#FF005A',
                width: 2
              }

            }
          },
          data: option.actualData, // this.option.Ydata,
          type: 'line',
          symbolSize: 6
        }]
      }
      const option1 = {
        baseOption: local_option,
        media: [{
          query: {
            maxWidth: 500
          },
          option: {
            xAxis: {
              axisLabel: {
                fontSize: 8
              }
            }
          }
        }]
      }
      this.linechart.setOption(option1)
      // window.addEventListener('resize', () => {
      //   if (this.linechart) {
      //     this.linechart.resize()
      //   }
      // })
    }
  }
}
</script>
