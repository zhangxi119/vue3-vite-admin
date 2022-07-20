<!--
 * @Author: zhangxi119 380313641@qq.com
 * @Date: 2022-07-14 17:12:57
 * @LastEditors: zhangxi
 * @LastEditTime: 2022-07-15 11:49:58
 * @FilePath: \vue3-vite-admin\src\views\warterMarker\index.vue
 * @Description: 
-->
<template>
  <div>
    <el-button class="guide-btn" type="primary" @click.prevent.stop="openWarterMarker()">打开水印</el-button>
    <el-button class="guide-btn" type="default" @click.prevent.stop="closeWarterMarker()">关闭水印</el-button>
  </div>
</template>

<script setup>
  import { ref, onMounted} from 'vue'
  import Watermark  from './warterMaker.js'
  import { debounce } from '@/utils/utils.js'

  const DOM_ID = 'waterDomId'
  let warterText = '水印测试啊'
  // 监听水印画布元素变化
  const observer = new MutationObserver(warterMarker)
  // 初始化水印
  function warterMarker(warterText = '水印测试') {
    Watermark.set(warterText, DOM_ID)
    observer.disconnect()
    observer.observe(document.getElementById(DOM_ID), { attributes: true})
  }
  // 窗口变化时防抖重置水印
  const resizeCallback = debounce(() => {
    warterMarker(warterText)
  }, 200)
  // 打开水印
  const openWarterMarker = () => {
    warterMarker(warterText)
    window.addEventListener('resize', resizeCallback)
  }
  // 关闭水印
  const closeWarterMarker = () => {
    observer.disconnect()
    window.removeEventListener('resize', resizeCallback)
    document.getElementById(DOM_ID) && document.body.removeChild(document.getElementById(DOM_ID))
  }

</script>
<style lang0="scss">
  .guide-btn {
    margin: 20px 0 0 20px;
  }
</style>