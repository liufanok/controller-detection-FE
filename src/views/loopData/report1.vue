

<style lang="scss" scoped>
  li {
    list-style: none;
  }
  #main {
    width: 100%;
    height: 500px;
  }
  .wrap {
    display: flex;
  }
  .luo {
    display: flex;
    width: 50%;
  }
  .bar-wrap {
    background-color: #111c4e;
  }
</style>

<template>
  <div id="report" class="app-container calendar-list-container">
    <ul>
      <li>
        <el-date-picker value-format="yyyy-MM-dd" v-model="value_date" type="date" @change="valueDateChange" placeholder="选择日期">
        </el-date-picker>
      </li>
      <li>
        <el-select v-model="select_date" filterable placeholder="请选择车间">
          <el-option v-for="(index,item) in select_date_list" :key="index" :label="item" :value="index">
          </el-option>
        </el-select>
      </li>
      <li>
        <button @click="getReportList">搜索</button>
      </li>
    </ul>
    <!-- <div id="main"></div> -->
    <LineChart :option="lineChartData"></LineChart>
    <LineChart1 :option="lineChartData1"></LineChart1>
    <!-- <div class="bar-wrap">
      <div class="chart-wrapper">
        <barCahrt :option="barCahrt1"></barCahrt>
      </div>
      <barCahrt :option="barCahrt2"></barCahrt>
    </div> -->
     <el-row :gutter="32">
      <el-col :xs="24" :sm="24" :lg="12">
        <div class="chart-wrapper">
           <barCahrt :option="barCahrt1"></barCahrt>
        </div>
      </el-col>
      <el-col :xs="24" :sm="24" :lg="12">
        <div class="chart-wrapper">
           <barCahrt :option="barCahrt2"></barCahrt>
        </div>
      </el-col>
      <!-- <el-col :xs="24" :sm="24" :lg="8">
        <div class="chart-wrapper">
          <bar-chart></bar-chart>
        </div> -->
      </el-col>
    </el-row>
    <section class="wrap">
      <div class="luo">
        <luo :option="option_one"></luo>
        <luo :option="option_two"></luo>
      </div>
      <barCahrt1 :option="sf_esf_option"></barCahrt1>
    </section>
  </div>
</template>
<script>
  import LineChart from './LineChart'
  import LineChart1 from './LineChart1'
  import barCahrt from './barCahrt'
  import barCahrt1 from './barCahrt1'
  var qs = require('qs')
  import luo from './luo.vue'
  import request from '@/utils/request'
  // import echarts from 'echarts'
  export default {
    data() {
      return {
        barCahrt2: {
          title: '',
          data: [{
            'name': 'sv',
            'value': ''
          }, {
            'name': 'pv',
            'value': ''
          }, {
            'name': 'mv',
            'value': ''
          }, {
            'name': '偏差',
            'value': ''
          }]
        },
        barCahrt1: {
          title: '',
          data: [{
            'name': 'sv',
            'value': ''
          }, {
            'name': 'pv',
            'value': ''
          }, {
            'name': 'mv',
            'value': ''
          }, {
            'name': '偏差',
            'value': ''
          }]
        },
        lineChartData1: {},
        lineChartData: {},
        myChart: null,
        value_date: new Date(),
        select_date: '',
        select_date_list: [],
        option_one: {},
        option_two: {},
        sf_esf_option: {}
      }
    },
    components: {
      luo,
      LineChart,
      LineChart1,
      barCahrt,
      barCahrt1
    },
    mounted() {
      // this.valueDateChange()
    },
    methods: {
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
          this.lineChartData = {
            expectedData: res.data.data.chart_data.y_data.pv,
            xdata: res.data.data.chart_data.x_data,
            actualData: res.data.data.chart_data.y_data.sv
          }
          this.lineChartData1 = {
            expectedData: res.data.data.chart_data.y_data.mv,
            xdata: res.data.data.chart_data.x_data
          }
          this.barCahrt1 = {
            title: '标准差',
            data: [{
              'name': 'sv',
              'value': res.data.data.dev[0]
            }, {
              'name': 'pv',
              'value': res.data.data.dev[1]
            }, {
              'name': 'mv',
              'value': res.data.data.dev[2]
            }, {
              'name': '偏差',
              'value': res.data.data.dev[3]
            }]
          }
          this.barCahrt2 = {
            title: '均值',
            data: [{
              'name': 'sv',
              'value': res.data.data.e[0]
            }, {
              'name': 'pv',
              'value': res.data.data.e[1]
            }, {
              'name': 'mv',
              'value': res.data.data.e[2]
            }, {
              'name': '偏差',
              'value': res.data.data.e[3]
            }]
          }
          this.option_one = {
            title: '震荡指数',
            center: 0.4,
            fuc: 0.4,
            data: res.data.data.osci,
            max: 1
          }
          this.option_two = {
            title: '相对性能指标',
            center: 0.5,
            fuc: 1,
            data: res.data.data.rpi,
            max: 2
          }
          this.sf_esf_option = {
            sf: res.data.data.sf,
            esf: res.data.data.esf
          }
          // this.chart(res.data.data.chart_data)
        })
      }
    }
  }
</script>


