<style lang="scss" scoped>
    .chart{
        width: 100%;
        height: 500px;
    }
</style>
<template>
    <div class="radar-echart">
        
        <div class="chart" :id="id"></div>
       
    </div>
</template>
<script>
import echarts from 'echarts'

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
  mounted() {
    this.initradarEchart()
  },
  methods: {

    initradarEchart() {
      console.log(this.option)
      this.radarChart = echarts.init(document.getElementById(this.id))
      const itemoption = {

        backgroundColor: new echarts.graphic.RadialGradient(0.5, 0.3, 0.2, [{
          offset: 0,
          color: '#f7f8fa'
        }, {
          offset: 1,
          color: '#cdd0d5'
        }]),
        title: {
          text: this.option.title,
          left: 'center'
        },
        tooltip: {
          show: true,
          trigger: 'item',
          formatter: '{a}:{b}'
        },
        series: [{
          type: 'gauge',
          name: '烟雾感应',
          startAngle: 190,
          endAngle: -10,
          min: 0,
          max: this.option.max,
          radius: '80%',
          center: ['50%', '65%'],
          axisLine: {

            show: true,
            lineStyle: {
              width: 100,
              shadowBlur: 10,
              color: [
                [0, '#B5495B'],
                [this.option.center, '#20604F'],
                [1, '#D0104C']
              ]
            }
          },
          axisTick: {
            show: false
          },
          axisLabel: {
            show: false
          },
          splitLine: {
            show: false
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
            fontSize: 30,
            fontWeight: 'bolder',
            fontStyle: 'italic',
            color: 'auto'

            // }

          },
          detail: {
            show: true
          },
          data: [{ value: this.option.data }]

        }] }
      this.radarChart.setOption(itemoption)
      window.addEventListener('resize', () => {
        this.radarChart.resize()
      })
    }
  }
}
</script>
