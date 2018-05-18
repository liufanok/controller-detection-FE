<template>
  <div>
    <el-row class="panel-group" :gutter="40">
      <el-col :xs="24" :sm="8" :lg="8" class="card-panel-col">
        <div class='card-panel' @click="handleSetLineChartData('newVisitis')">
          <div class="card-panel-icon-wrapper icon-people">
            <svg-icon icon-class="report_1" class-name="card-panel-icon" />
          </div>
          <div class="card-panel-description">
            <div class="card-panel-text">{{$t('data.name')}}</div>
            <div class="card-panel-num">{{paneldata.loop_name}}</div>
          </div>
        </div>
      </el-col>
      <el-col :xs="12" :sm="8" :lg="8" class="card-panel-col">
        <div class="card-panel" @click="handleSetLineChartData('purchases')">
          <div class="card-panel-icon-wrapper icon-money">
            <svg-icon icon-class="report_3" class-name="card-panel-icon" />
          </div>
          <div class="card-panel-description">
            <div class="card-panel-text">{{$t('data.time')}}</div>
            <count-to class="card-panel-num" :startVal="0" :endVal="Number(paneldata.set_time)" :duration="3200"></count-to>s
          </div>
        </div>
      </el-col>
      <el-col :xs="12" :sm="8" :lg="8" class="card-panel-col">
        <div class="card-panel" @click="handleSetLineChartData('shoppings')">
          <div class="card-panel-icon-wrapper icon-shoppingCard">
            <svg-icon icon-class="report_4" class-name="card-panel-icon" />
          </div>
          <div class="card-panel-description">
            <div class="card-panel-text">{{$t('data.switch')}}</div>
            <count-to class="card-panel-num" :startVal="0" :endVal="Number(paneldata.switch)" :duration="3600"></count-to>
          </div>
        </div>
      </el-col>
    </el-row>
    <el-row class="panel-group" :gutter="40">
      <el-col :xs="24" :sm="24" :lg="24" class="card-panel-col">
        <div class="card-panel" @click="handleSetLineChartData('messages')">
          <div class="card-panel-icon-wrapper icon-message">
            <svg-icon icon-class="report_2" class-name="card-panel-icon" />
          </div>
          <div class="card-panel-description">
            <div class="card-panel-text" style="text-align:right;">{{$t('data.result')}}</div>
            <el-button type="success" :size="paneldata.result=='Excellent'?'medium':'mini'" :disabled="paneldata.result!=='Excellent'?Boolean(true):Boolean(false)" :plain="paneldata.result!=='Excellent'?Boolean(true):Boolean(false)">Excellent</el-button>
            <el-button type="primary" :size="paneldata.result=='Good'?'medium':'mini'" :disabled="paneldata.result!=='Good'?Boolean(true):Boolean(false)" :plain="paneldata.result!=='Good'?Boolean(true):Boolean(false)">Good</el-button>
            <el-button type="warning" :size="paneldata.result=='Fair'?'medium':'mini'" :disabled="paneldata.result!=='Fair'?Boolean(true):Boolean(false)" :plain="paneldata.result!=='Fair'?Boolean(true):Boolean(false)">Fair </el-button>
            <el-button type="danger" :size="paneldata.result=='Poor'?'medium':'mini'" :disabled="paneldata.result!=='Poor'?Boolean(true):Boolean(false)" :plain="paneldata.result!=='Poor'?Boolean(true):Boolean(false)">Poor</el-button>
            <!-- <count-to class="card-panel-num" :startVal="0" :endVal="81212" :duration="3000"></count-to> -->
          </div>
        </div>
      </el-col>
    </el-row>
 
  </div>
</template>

<script>
  import CountTo from 'vue-count-to'
  export default {
    components: {
      CountTo
    },
    methods: {
      handleSetLineChartData(type) {
        this.$emit('handleSetLineChartData', type)
      }
    },
    props: ['paneldata']
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .panel-group {
    margin-top: 18px;
    .card-panel-col {
      margin-bottom: 22px;
    }
    .card-panel {
  
      height: 108px;
      cursor: pointer;
      font-size: 12px;
      position: relative;
      overflow: hidden;
      color: #666;
      background: #fff;
      box-shadow: 4px 4px 40px rgba(0, 0, 0, .05);
      border-color: rgba(0, 0, 0, .05);
      &:hover {
        .card-panel-icon-wrapper {
          color: #fff;
        }
        .icon-people {
          background: #40c9c6;
        }
        .icon-message {
          background: #36a3f7;
        }
        .icon-money {
          background: #f4516c;
        }
        .icon-shoppingCard {
          background: #34bfa3
        }
      }
      .icon-people {
        color: #40c9c6;
      }
      .icon-message {
        color: #36a3f7;
      }
      .icon-money {
        color: #f4516c;
      }
      .icon-shoppingCard {
        color: #34bfa3
      }
      .card-panel-icon-wrapper {
        float: left;
        margin: 14px 0 0 14px;
        padding: 16px;
        transition: all 0.38s ease-out;
        border-radius: 6px;
      }
      .card-panel-icon {
        float: left;
        font-size: 48px;
      }
      .card-panel-description {
        float: right;
        font-weight: bold;
        margin: 26px;
        margin-left: 0px;
        .card-panel-text {
          line-height: 18px;
          color: rgba(0, 0, 0, 0.45);
          font-size: 16px;
          margin-bottom: 12px;
        }
        .card-panel-num {
          font-size: 20px;
        }
      }
    }
  }
</style>
