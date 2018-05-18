<template>
  <el-row class="panel-group" :gutter="40">
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div class='card-panel' @click="handleSetLineChartData('newVisitis')">
        <div class="card-panel-icon-wrapper icon-people">
          <svg-icon icon-class="user" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">{{$t('home.username')}}</div>
          <div style="font-size:20px;">{{name}}</div>
          <!-- <count-to class="card-panel-num" :startVal="0" :endVal="102400" :duration="2600"></count-to> -->
        </div>
      </div>
    </el-col>
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div class="card-panel" @click="handleSetLineChartData('messages')">
        <div class="card-panel-icon-wrapper icon-message">
          <svg-icon icon-class="peoples" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">{{$t('home.role')}}</div>
          <div style="font-size:20px;">{{roles[0]=='admin'?this.$t('home.admin'):this.$t('home.normal')}}</div>
          <!-- <count-to class="card-panel-num" :startVal="0" :endVal="81212" :duration="3000"></count-to> -->
        </div>
      </div>
    </el-col>
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div class="card-panel" @click="handleSetLineChartData('purchases')">
        <div class="card-panel-icon-wrapper icon-money">
          <svg-icon icon-class="email" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">{{$t('home.email')}}</div>
          <div style="font-size:20px;word-wrap: break-word;word-break: break-all;"> {{email}}</div>
          <!-- <count-to class="card-panel-num" :startVal="0" :endVal="9280" :duration="3200"></count-to> -->
        </div>
      </div>
    </el-col>
    <el-col  :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div class="card-panel" @click="handleSetLineChartData('shoppings')">
        <div class="card-panel-icon-wrapper icon-shoppingCard">
          <svg-icon icon-class="time" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">{{$t('home.lastLogin')}}</div>
          <div style="font-size:20px;">{{last_time}}</div>
          <!-- <count-to class="card-panel-num" :startVal="0" :endVal="13600" :duration="3600"></count-to> -->
        </div>
      </div>
    </el-col>
    <el-col>
        <div id="clock">
          <p class="date">{{ date }}</p>
          <p class="time">{{ time }}</p>
          <!-- <p class="text">数字时钟</p> -->
      </div>
    </el-col>
     <el-col>
       <img style="width:100%;" :src="img" alt="">
        <!-- <iframe allowtransparency="true" frameborder="0" width="565" height="98" scrolling="no" src="//tianqi.2345.com/plugin/widget/index.htm?s=2&z=3&t=1&v=0&d=3&bd=0&k=&f=&ltf=009944&htf=cc0000&q=1&e=1&a=1&c=54511&w=565&h=98&align=center"></iframe> -->
     </el-col>
    
  </el-row>
</template>

<script>
var week = ['星期天', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六']
// var timerID = setInterval(updateTime, 1000);
// updateTime();
// function updateTime() {
//     var cd = new Date();
//     clock.time = zeroPadding(cd.getHours(), 2) + ':' + zeroPadding(cd.getMinutes(), 2) + ':' + zeroPadding(cd.getSeconds(), 2);
//     clock.date = zeroPadding(cd.getFullYear(), 4) + '-' + zeroPadding(cd.getMonth()+1, 2) + '-' + zeroPadding(cd.getDate(), 2) + ' ' + week[cd.getDay()];
// };

function zeroPadding(num, digit) {
  var zero = ''
  for (var i = 0; i < digit; i++) {
    zero += '0'
  }
  return (zero + num).slice(-digit)
}
import CountTo from 'vue-count-to'
import { mapGetters } from 'vuex'
export default {
  data() {
    return {
      time: '',
      date: '',
      img: '/static/pic/1.jpg'
    }
  },
  components: {
    CountTo
  },
  computed: {
    ...mapGetters([
      'name',
      'roles',
      'email',
      'last_time'
    ])
  },
  mounted() {
    this.img = `/static/pic/${parseInt(Math.random() * 12 + 1)}.jpg`
    setInterval(this.updateTime, 1000)
    this.updateTime()
  },
  methods: {
    updateTime() {
      var cd = new Date()
      this.time = zeroPadding(cd.getHours(), 2) + ':' + zeroPadding(cd.getMinutes(), 2) + ':' + zeroPadding(cd.getSeconds(), 2)
      this.date = zeroPadding(cd.getFullYear(), 4) + '-' + zeroPadding(cd.getMonth() + 1, 2) + '-' + zeroPadding(cd.getDate(), 2) + ' ' + week[cd.getDay()]
    },
    handleSetLineChartData(type) {
      this.$emit('handleSetLineChartData', type)
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
// html, body {
//   height: 100%;
// }

body {
  background: #0f3854;
  background: -webkit-radial-gradient(center ellipse, #0a2e38 0%, #000000 70%);
  background: radial-gradient(ellipse at center, #0a2e38 0%, #000000 70%);
  background-size: 100%;
}

p {
  margin: 0;
  padding: 0;
}

#clock {
  padding: 20px 0;
  // background: #daf6ff;
  font-family: 'Share Tech Mono', monospace;
  color: #ffffff;
  text-align: center;
  // position: absolute;
  // left: 50%;
  // top: 50%;
  // -webkit-transform: translate(-50%, -50%);
  //         transform: translate(-50%, -50%);
  color: #0f3854;
  text-shadow: 0 0 20px #0aafe6, 0 0 20px rgba(10, 175, 230, 0);
}
#clock .time {
  letter-spacing: 0.05em;
  font-size: 80px;
  padding: 5px 0;
}
#clock .date {
  letter-spacing: 0.1em;
  font-size: 24px;
}
#clock .text {
  letter-spacing: 0.1em;
  font-size: 12px;
  padding: 20px 0 0;
}

//=========
.panel-group {
  margin-top: 18px;
  .card-panel-col{
    margin-bottom: 32px;
  }
  .card-panel {
    display: flex;
    align-items: center;
    justify-content:space-between;
    height: 85px;
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
      // float: left;
      // margin: 14px 0 0 14px;
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
