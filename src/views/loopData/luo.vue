<style lang="scss" scoped>
  .radar-echart {
    display: inline-block;
    width: 100%;
  }
  .chart {
    width: 100%;
    height: 300px;
  }
</style>
<template>
  <div class="radar-echart">
    <div class="chart" :id="id"></div>
  </div>
</template>
<script>
  import echarts from 'echarts'
  require('echarts/theme/macarons')
  export default {
    data() {
      return {
        urlobj: {},
        linechart: null,
        radarlabel: {
          left: null,
          right: null
        }
      }
    },
    props: {
      id: {
        type: String,
        default: function() { // 生成一个随机字符串,纯英文的,当不传入ID的时候生成实例,加i确保不会随机到一样的
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
    beforeDestroy() {
      window.removeEventListener('resize', this.radarChart.resize)
      if (this.radarChart) {
        this.radarChart.dispose() // 销毁图表实例
      }
    },
    watch: {
      option() {
        this.initradarEchart()
      }
    },
    mounted() {
      this.initradarEchart()
    },
    methods: {
      initradarEchart() {
        this.radarChart = echarts.init(document.getElementById(this.id))
        const itemoption = {
          // backgroundColor: new echarts.graphic.RadialGradient(0.5, 0.3, 0.2, [{
          //   offset: 0,
          //   color: '#f7f8fa'
          // }, {
          //   offset: 1,
          //   color: '#cdd0d5'
          // }]),
          title: {
            text: this.option.title,
            left: 'center',
            top: '5%',
            textStyle: {
              color: '#008acd'
            }
          },
          tooltip: {
            show: true,
            trigger: 'item',
            formatter: '{a}:{b}'
          },
          series: [{
            type: 'gauge',
            // name: '烟雾感应',
            startAngle: 190,
            endAngle: -10,
            min: 0,
            max: this.option.max,
            radius: '80%',
            center: ['50%', '70%'],
            axisTick: {
              show: true,
              length: 4
            },
            axisLabel: {
              show: true,
              textStyle: {
                color: '#fff',
                fontSize: 10
              }
            },
            splitLine: {
              show: true,
              length: 10,
              textStyle: {
                color: '#fff',
                fontSize: 10
              }
            },
            axisLine: {
              show: true,
              lineStyle: {
                width: 40,
                shadowBlur: 10,
                color: [
                  [0, '#B5495B'],
                  [this.option.center, '#20604F'],
                  [1, '#D0104C']
                ]
              }
            },
            pointer: {
              width: '6%',
              length: '90%',
              color: 'black'
            },
            itemStyle: {
              normal: {
                color: 'rgba(255, 255, 255, 0.5)',
                shadowBlur: 20
              }
            },
            title: {
              show: true,
              offsetCenter: [0, '-120%'],
              // textStyle: {       // 其余属性默认使用全局文本样式，详见TEXTSTYLE
              fontSize: 10,
              fontWeight: 'bolder',
              // fontStyle: 'italic',
              color: this.option.data > this.option.fuc ? '#D0104C' : '#20604F'
              // }
            },
            detail: {
              show: true
            },
            data: [{
              value: this.option.data,
              name: this.option.data > this.option.fuc ? this.$t('data.bad') : this.$t('data.good')
            }]
          }]
        }
        this.radarChart.setOption(itemoption)
        window.addEventListener('resize', () => {
          if (this.radarChart) {
            this.radarChart.resize()
          }
        })
      }
    }
  }
</script>
