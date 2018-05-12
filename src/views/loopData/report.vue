<template>
    <div class="dashboard-editor-container">
        <sticky className="sub-navbar published">
            <el-date-picker value-format="yyyy-MM-dd" v-model="value_date" type="date" @change="valueDateChange" placeholder="选择日期">
            </el-date-picker>
            <el-select v-model="select_date" filterable placeholder="时间段">
                <el-option v-for="(index,item) in select_date_list" :key="index" :label="item" :value="index">
                </el-option>
            </el-select>
            <el-button v-loading="btn_loading" style="margin-left: 10px;" type="success" @click="getReportList">查看报告</el-button>
        </sticky>
        <section v-if="sec_loading">
            <panel-group :paneldata='panelgroup_data'></panel-group>
            <el-row style="background:#fff;padding:16px 16px 0;margin-bottom:32px;">
                <LineChart :option="lineChartData"></LineChart>
            </el-row>
            <el-row style="background:#fff;padding:16px 16px 0;margin-bottom:32px;">
                <LineChart1 :option="lineChartData1"></LineChart1>
            </el-row>
            <el-row :gutter="32">
                <el-col :xs="24" :sm="24" :lg="12">
                    <div class="chart-wrapper">
                        <barCahrt :option="barCahrt_data_1"></barCahrt>
                    </div>
                </el-col>
                <el-col :xs="24" :sm="24" :lg="12">
                    <div class="chart-wrapper">
                        <barCahrt1 :option="barCahrt_data_2"></barCahrt1>
                    </div>
                </el-col>
            </el-row>
            <el-row :gutter="32">
                <el-col :xs="24" :sm="24" :lg="12">
                    <el-row :gutter="8">
                        <el-col :xs="{span: 24}" :sm="{span: 24}" :md="{span: 12}" :lg="{span: 12}" :xl="{span: 12}" style="padding-right:8px;margin-bottom:30px;">
                            <div class="chart-wrapper">
                                <luo :option="option_one"></luo>
                            </div>
                        </el-col>
                        <el-col :xs="{span: 24}" :sm="{span: 24}" :md="{span: 12}" :lg="{span: 12}" :xl="{span: 12}" style="padding-right:8px;margin-bottom:30px;">
                            <div class="chart-wrapper">
                                <luo :option="option_two"></luo>
                            </div>
                        </el-col>
                    </el-row>
                </el-col>
                <el-col :xs="24" :sm="24" :lg="12">
                    <el-row :gutter="8">
                        <el-col :xs="{span: 24}" :sm="{span: 24}" :md="{span: 12}" :lg="{span: 12}" :xl="{span: 12}" style="padding-right:8px;margin-bottom:30px;">
                            <div class="chart-wrapper">
                                <centigrade :option="centigrade_data_1"></centigrade>
                            </div>
                        </el-col>
                        <el-col :xs="{span: 24}" :sm="{span: 24}" :md="{span: 12}" :lg="{span: 12}" :xl="{span: 12}" style="padding-right:8px;margin-bottom:30px;">
                            <div class="chart-wrapper">
                                <centigrade :option="centigrade_data_2"></centigrade>
                            </div>
                        </el-col>
                    </el-row>
                </el-col>
            </el-row>
            <el-row :gutter="32">
                <div class="suggest">
                    意见：{{suggest}}
                </div>
            </el-row>
        </section>
        <section v-else>
           <reportempty></reportempty>
        </section>
        <!-- <el-row :gutter="8">
                              <el-col :xs="{span: 24}" :sm="{span: 24}" :md="{span: 24}" :lg="{span: 12}" :xl="{span: 12}" style="padding-right:8px;margin-bottom:30px;">
                                <transaction-table></transaction-table>
                              </el-col>
                            </el-row> -->
    </div>
</template>

<script>
    import PanelGroup from './PanelGroup'
    import Sticky from '@/components/Sticky'
    import LineChart from './LineChart'
    import LineChart1 from './LineChart1'
    import barCahrt from './barCahrt'
    import barCahrt1 from './barCahrt1'
    import centigrade from './centigrade'
    import reportempty from './401.vue'
    var qs = require('qs')
    import luo from './luo.vue'
    import request from '@/utils/request'
    export default {
      name: 'dashboard-admin',
      components: {
        luo,
        LineChart,
        LineChart1,
        barCahrt,
        barCahrt1,
        centigrade,
        Sticky,
        PanelGroup,
        reportempty
      },
      data() {
        return {
          panelgroup_data: '',
          sec_loading: false,
          btn_loading: false,
          centigrade_data_1: {},
          centigrade_data_2: {},
          barCahrt_data_2: {},
          barCahrt_data_1: {},
          lineChartData1: {},
          lineChartData: {},
          myChart: null,
          value_date: new Date(),
          select_date: '',
          select_date_list: [],
          option_one: {},
          option_two: {}
        }
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
          this.btn_loading = true
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
            this.btn_loading = false
            this.sec_loading = true
            this.panelgroup_data = {
              result: res.data.data.result,
              set_time: res.data.data.set_time,
              loop_name: res.data.data.loop_name,
              switch: res.data.data.switch
            }
            this.suggest = res.data.data.suggest
            this.lineChartData = {
              expectedData: res.data.data.chart_data.y_data.pv,
              xdata: res.data.data.chart_data.x_data,
              actualData: res.data.data.chart_data.y_data.sv
            }
            this.lineChartData1 = {
              expectedData: res.data.data.chart_data.y_data.mv,
              xdata: res.data.data.chart_data.x_data
            }
            this.barCahrt_data_1 = {
              x_data: ['sv', 'pv', 'mv', '偏差'],
              y_data: [res.data.data.dev[0], res.data.data.dev[1], res.data.data.dev[2], res.data.data.dev[3]]
            }
            this.barCahrt_data_2 = {
              x_data: ['sv', 'pv', 'mv', '偏差'],
              y_data: [res.data.data.e[0], res.data.data.e[1], res.data.data.e[2], res.data.data.e[3]]
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
            this.centigrade_data_1 = {
              title: '投用率',
              data: res.data.data.sf
            }
            this.centigrade_data_2 = {
              title: '有效投用率',
              data: res.data.data.esf
            }
            // this.chart(res.data.data.chart_data)
          })
        }
      }
    }
</script>

<style rel="stylesheet/scss" lang="scss">
    .dashboard-editor-container {
        padding: 0 32px;
        background-color: rgb(240, 242, 245);
        .chart-wrapper {
            background: #fff;
            padding: 16px 16px 0;
            margin-bottom: 32px;
        }
    }
    .suggest {
        padding: 20px;
        background-color: white;
    }
</style>
