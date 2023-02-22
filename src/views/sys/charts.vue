<template>
  <div class="app-container">
    <el-tabs v-model="activeName" @tab-click="handleClick">
    <el-tab-pane label="图形报表" name="first">
        <chartsReport/>
    </el-tab-pane>
    <el-tab-pane label="数据报表" name="second">
        <dataReport/>
    </el-tab-pane>
  </el-tabs>
  </div>
</template>
<script>
import dataReport from '@/views/sys/data_report'
import chartsReport from '@/views/sys/charts_report'


export default {
  name: '数据报表列表',
  components: { chartsReport,dataReport },
  data() {
    return {
      activeName: 'first'
    }
  },
  created() {
    let that = this;
    // that.getList()
  },
  methods: {
    handleClick(tab, event) {
        // console.log(tab, event);
      }
    }
}
</script>