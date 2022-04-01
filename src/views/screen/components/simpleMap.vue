<template>
  <div class="verify-map">
    <div class="chart">
      <img class="chart-info" src="@/assets/screen/info.svg" alt="" />
      <Chart
        :autoresize="true"
        style="width: 100%;height: 100%;"
        :option="chartOption"
      />
    </div>
  </div>
</template>
<script setup>
import {onMounted, ref} from 'vue'
import mapJson from './510000.json'
// 若使用其它类型echarts组件提示报错时，需要到main.js查看是否引入该类型组件
import Chart from 'vue-echarts'
// 此处需要单独引用Echarts的api方法，新版的vue-echarts示例上好像是没有挂在
import { registerMap } from "echarts/core";
const chartOption = ref({})
const regionCode = '510000'
// 初始化Echarts并渲染
const initChartOption = (regionCode) => {
  chartOption.value = {
    legend: {
        show: false
    },
    tooltip: {
        show: true
    },
    grid:{
      x:50,
      y:50,
      x2:50,
      y2:60
    },
    series: [{
        type: 'map',
        map: regionCode,
        roam: false, // 是否缩略、拖动
        tooltip: {
            show: false
        },
        label: {
          show: true,
          color: '#fff',
          emphasis: {
              show: true,
              color:'#fff'
          }
        },
        itemStyle: {
            normal: {
                borderColor: '#1295FF',
                borderWidth: 1,
                areaColor: '#17389E',
            },
            emphasis: {
                show:false,
                areaColor: '#00B0FF'
            }
        },
        zoom: 1.2
    }]
  }
}
// 获取地图json并注册地图
const registerMapFn = (regionCode) => {
  return new Promise((resolve, reject) => {
    try {
      registerMap(regionCode, mapJson)
      resolve(true)
    } catch (err) {
      reject()
    }
  })
}
onMounted(() => {
  registerMapFn(regionCode).then(res => {
    if (res) {
      initChartOption(regionCode)
    }
  })
})
</script>
<style lang="scss" scoped>
.verify-map {
  width: 100%;
  height: 100%;
  padding-top: 20px;
  .chart {
    width: 100%;
    height: 100%;
    position: relative;
    .map {
      height: 100%;
      position: absolute;
      top: 0;
      left: 0;
    }
    .chart-info {
      width: 100px;
      position: absolute;
      bottom: 0;
      right: 5%;
    }
  }
}
.map {
  width: 100%;
  height: 100%;
}
</style>
