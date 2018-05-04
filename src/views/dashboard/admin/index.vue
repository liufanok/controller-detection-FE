<template>
  <div class="dashboard-editor-container">
      <panel-group></panel-group>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import PanelGroup from './components/PanelGroup'
export default {
  name: 'dashboard-admin',
  data() {
    return {
    }
  },
  components: {
    PanelGroup
  },
  computed: {
    ...mapGetters([
      'name'
    ])
  },
  mounted() {
    // this.InitEchart()
  },
  methods: {
    handleSetLineChartData(type) {

    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.dashboard-editor-container {
  padding: 32px;
  background-color: rgb(240, 242, 245);
  .chart-wrapper {
    background: #fff;
    padding: 16px 16px 0;
    margin-bottom: 32px;
  }
}
</style>
