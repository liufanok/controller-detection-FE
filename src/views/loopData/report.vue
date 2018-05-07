

<style lang="scss" scoped>
li{
    list-style: none;
}
#main{
    width: 100%;
    height: 500px;
}
</style>

<template>
    <div id="report" class="app-container calendar-list-container">
        <ul>
            <li>
                <el-date-picker  value-format="yyyy-MM-dd" v-model="value_date" type="date" @change="valueDateChange" placeholder="选择日期">
            </el-date-picker>
            </li>
            <li>
                 <el-select  v-model="select_date" filterable placeholder="请选择车间">
                        <el-option
                        v-for="(index,item) in select_date_list"
                        :key="index"
                        :label="item"
                        :value="index">
                        </el-option>
                    </el-select>
            </li>
            <li>
                <button @click="getReportList">搜索</button>
            </li>
        </ul>
        <div id="main"></div>
        <luo :option="option_one"></luo>
         <luo :option="option_two"></luo>
    </div>
</template>
<script>
    var qs = require('qs')
    import luo from './luo.vue'
import request from '@/utils/request'
    import echarts from 'echarts'
    export default {
      data() {
        return {
          myChart: null,
          value_date: new Date(),
          select_date: '',
          select_date_list: [],
          option_one: {
            title: '震荡指数',
            center: 0.4,
            data: 0.8,
            max: 1
          },
          option_two: {
            title: '相对',
            center: 0.5,
            data: 0.8,
            max: 2
          }
        }
      },
      components: {
        luo
      },
      mounted() {
        // this.valueDateChange()
      },
      methods: {
        chart(data) {
          const option = {
            title: {
              text: 'Beijing AQI'
            },
            tooltip: {
              trigger: 'axis'
            },
            xAxis: {
              data: data.x_data
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
            series: [{
              name: 'SV',
              type: 'line',
              data: data.y_data.sv

            }, {
              name: 'PV',
              type: 'line',
              data: data.y_data.pv
            },
            {
              name: 'MV',
              type: 'line',
              data: data.y_data.mv
            }]
          }
          this.myChart = echarts.init(document.getElementById('main'))
          this.myChart.setOption(option)
        },
        valueDateChange(val) {
          const data = {
            date: val,
            loop_id: JSON.parse(window.localStorage.getItem('report')).id
          }
          request({
            url: '/api/v1/result/time-list',
            method: 'post',
            data: qs.stringify(data)
          }).then(res => {
            this.select_date_list = res.data.data
          })
        },
        getReportList() {
          const data = {
            date: this.value_date,
            loop_id: JSON.parse(window.localStorage.getItem('report')).id,
            scope: this.select_date
          }
          request({
            url: '/api/v1/result/report',
            method: 'post',
            data: qs.stringify(data)
          }).then(res => {
            this.chart(res.data.data.chart_data)
          })
        }
      }
    
    }
</script>


