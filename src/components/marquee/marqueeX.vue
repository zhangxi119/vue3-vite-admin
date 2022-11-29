<!--
 * @Author: zhangxi 380313641@qq.com
 * @Date: 2022-11-28 17:21:43
 * @LastEditors: zhangxi
 * @LastEditTime: 2022-11-29 16:07:41
 * @FilePath: \vue3-vite-admin\src\components\marquee\marqueeX.vue
 * @Description: 文字跑马灯组件
-->
<template>
  <div class="my-outbox">
    <div class="my-inbox" v-if="!textType" ref="targetDom">
      <div class="my-list">{{props.text}}</div>
      <div class="my-list">{{props.text}}</div>
    </div>
    <div class="my-inbox" v-else ref="targetDom">
      <div class="my-list" v-for="(item, index) in props.text" :key="index">{{item}}</div>
      <div class="my-list" v-for="(item, index) in props.text" :key="index">{{item}}</div>
    </div>
  </div>
</template>
<script setup>
import {ref, onMounted, defineProps, nextTick, computed} from 'vue'
const props = defineProps({
  text: {
    type: String || Array,
    default: '测试文字', // ['测试数组列表文字1','测试数组列表文字2']
  },
  speed: {
    type: Number,
    default: 0.5, // 每帧移动的像素
  }
})
let initLeft = 0;
const targetDom = ref();
function animate() {
  initLeft = initLeft + props.speed;
  if (initLeft >= targetDom.value.offsetWidth / 2) {
    initLeft = 0;
  }
  targetDom.value.style = `transform: translateX(-${initLeft}px)`;
  requestAnimationFrame(animate)
}
const textType = computed(() => {
  return Array.isArray(props.text)
})
onMounted(() => {
  nextTick(() => {
    requestAnimationFrame(animate);
  })
})

</script>
<style lang="scss" scoped>
.my-outbox {
  width: 50px;
  height: 100%;
  position: relative;
  overflow: hidden;
  .my-inbox {
    position: absolute;
    display: flex;
    align-items: center;
    flex-direction: row;
    height: 100%;
    white-space: nowrap;
    .my-list {
      margin-right: 15px;
    }
  }
}
</style>
