<template>
  <div class='chart-container'>
    <div id="main" style="width:100%;height:500px;"></div>
  </div>
</template>

<script>
import echarts from 'echarts'
import echartsdata from '../../mock/echart.json'

export default {
  name: 'keyboardChart',
  mounted() {
    this.InitEchart()
  },
  methods: {
    InitEchart() {
      var myChart = echarts.init(document.getElementById('main'))
      console.log(myChart)
      myChart.setOption({
        title: {
          text: 'data test'
        },
        tooltip: {
          trigger: 'axis'
        },
        xAxis: {
          data: echartsdata.map(function(item) {
            return item[0]
          })
        },
        yAxis: {
          splitLine: {
            show: false
          }
        },
        toolbox: {
          left: 'center',
          feature: {
            dataZoom: {
              yAxisIndex: 'none'
            },
            restore: {},
            saveAsImage: {}
          }
        },
        dataZoom: [{
          startValue: '2014-06-01'
        }, {
          type: 'inside'
        }],
        visualMap: {
          top: 10,
          right: 10,
          pieces: [{
            gt: 0,
            lte: 50,
            color: '#096'
          }, {
            gt: 50,
            lte: 100,
            color: '#ffde33'
          }, {
            gt: 100,
            lte: 150,
            color: '#ff9933'
          }, {
            gt: 150,
            lte: 200,
            color: '#cc0033'
          }, {
            gt: 200,
            lte: 300,
            color: '#660099'
          }, {
            gt: 300,
            color: '#7e0023'
          }],
          outOfRange: {
            color: '#999'
          }
        },
        series: {
          name: 'Beijing AQI',
          type: 'line',
          data: echartsdata.map(function(item) {
            return item[1]
          }),
          markLine: {
            silent: true,
            data: [{
              yAxis: 50
            }, {
              yAxis: 100
            }, {
              yAxis: 150
            }, {
              yAxis: 200
            }, {
              yAxis: 300
            }]
          }
        }
      })
    }
  }
}
</script>

<style scoped>
.chart-container{
  position: relative;
  padding: 20px;
  width: 100%;
  height: 85vh;
}
</style>

