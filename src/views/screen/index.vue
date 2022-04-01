

<template>
  <div class="screen-box">
    <div class="header">
      <dateHeader></dateHeader>
    </div>
    <div class="screen-container">
      <div class="chart-box">
        <simpleMap></simpleMap>
      </div>
    </div>
  </div>
</template>
<script setup>
  import { queryKnowledge } from '@/api/index.js'
  import dateHeader from './components/dateHeader.vue'
  import simpleMap from './components/simpleMap.vue'

</script>
<style lang="scss" scoped>
.screen-box {
  width: 100%;
  // height: 1080px;
  display: flex;
  flex-direction: column;
  .header {
    width: 100%;
    height: 56px;
  }
  .screen-container {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    flex: 0 0 650px;
    .chart-box {
      width: 600px;
      height: 621px;
    }
    // height: calc(100% - 56px);
  }
}
</style>
