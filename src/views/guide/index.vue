<template>
  <div>
    <el-button class="guide-btn" type="primary" @click.prevent.stop="openGuide()">{{$t('guide.button')}}</el-button>
  </div>
</template>

<script setup>
  import Driver from 'driver.js' // import driver.js
  import 'driver.js/dist/driver.min.css' // import driver.js css
  import steps from './step'

  const driver = new Driver({
      allowClose: false, //禁止点击外部关闭
      doneBtnText: '完成', // 完成按钮标题
      closeBtnText: '关闭', // 关闭按钮标题
      stageBackground: '#fff', // 引导对话的背景色
      nextBtnText: '下一步', // 下一步按钮标题
      prevBtnText: '上一步', // 上一步按钮标题
    })
  const openGuide = () => {
    driver.defineSteps(steps)
    driver.start()
  }
</script>
<style lang0="scss">
  .guide-btn {
    margin: 20px 0 0 20px;
  }
</style>