<style lang="scss" scoped>
    @function remfun($number) {
        @return ($number / 75)+rem;
    }
    * {
        -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
    }
    .line-left-chart {
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
          console.log(this.option, 'centigrade')
        }
      },
      beforeDestroy() {
        if (this.linechart) {
          this.linechart.dispose()
        }
      },
      mounted() {
        this.initLineEchart(this.option)
      },
      methods: {
        initLineEchart(option) {
          this.linechart = echarts.init(document.getElementById(this.id), 'macarons')
          const option1 = {
            title: {
              text: option.data + '%',
              x: 'center',
              y: 'center',
              textStyle: {
                fontWeight: 'normal',
                color: '#0580f2',
                fontSize: '30'
              },
              subtext: option.title,
              subtextStyle: {
                color: '#008acd'
              }
            },
            color: ['rgba(176, 212, 251, 1)'],

            series: [{
              name: 'Line 1',
              type: 'pie',
              clockWise: true,
              radius: ['67%', '88%'],
              itemStyle: {
                normal: {
                  label: {
                    show: true
                  },
                  labelLine: {
                    show: false
                  }
                }
              },
              hoverAnimation: false,
              data: [{
                value: option.data,
                itemStyle: {
                  normal: {
                    color: { // 完成的圆环的颜色
                      colorStops: [{
                        offset: 0,
                        color: '#00cefc' // 0% 处的颜色
                      }, {
                        offset: 1,
                        color: '#367bec' // 100% 处的颜色
                      }]
                    },
                    label: {
                      show: true
                    },
                    labelLine: {
                      show: false
                    }
                  }
                }
              }, {
                value: 100 - option.data
              }]
            }]
          }
          this.linechart.setOption(option1)
          window.addEventListener('resize', () => {
            if (this.linechart) {
              this.linechart.resize()
            }
          })
        }
      }
    }
</script>
