<template>
  <div class="header-box">
    <div class="header-left">
      <div class="full-btn" @click="fullFlag =!fullFlag;fullScreenFun(fullFlag)">
        <el-icon class="full-screen" color="#458CC9"><full-screen /></el-icon>
      </div>
    </div>
    <div class="header-title"></div>
    <div class="header-time">
      <div class="nowTime">
        当前时间：
        <span>{{time}}</span>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { FullScreen } from '@element-plus/icons-vue'
import dayjs from 'dayjs'
// 全屏功能
import { fullScreenFun } from '@/components/screen/useFullScreen.js'
let fullFlag = ref(false)
// 当前时间
let time = ref(dayjs().format("YYYY年MM月DD日 HH:mm:ss"))
let timer = ref(null)
onMounted(() => {
  clearInterval(timer)
  timer = setInterval(() => {
    time.value = dayjs().format("YYYY年MM月DD日 HH:mm:ss")
  },1000)
})
onBeforeUnmount(() => {
  clearInterval(timer)
})

</script>

<style lang="scss" scoped>
  .header-box {
    width: 100%;
    height: 56px;
    display: flex;
    justify-content: space-between;
    .header-left {
      width: 342px;
      height: 100%;
      display: flex;
      align-items: center;
      box-sizing: border-box;
      padding-left: 20px;
      .full-btn {
        width: 28px;
        height: 28px;
        // background: #234784;
        border: 1px solid #458CC9;
        color: #458CC9;
        border-radius: 4px;
        display: flex;
        justify-content: center;
        align-items: center;
        cursor: pointer;
        // &::before {
        //   content: '';
        //   display: inline-block;
        //   width: 14px;
        //   height: 14px;
        //   background: #00114f;
        //   border: 1px solid #458CC9;
        // }
      }
    }
    .header-time {
      width: 392px;
      height: 100%;
      padding-right: 20px;
      box-sizing: border-box;
      .nowTime {
        height: 100%;
        text-align: right;
        font-size: 16px;
        display: flex;
        align-items: center;
        color: #62d2ff;
        span {
          font-weight: bold;
          color: #62d2ff;
        }
      }
    }
    .header-title {
      width: 1166px;
      height: 100%;
      background: url('@/assets/screen/Tittle.svg');
      background-size: contain;
    }
  }
</style>