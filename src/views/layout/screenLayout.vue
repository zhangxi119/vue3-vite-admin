<template>
  <div class="screen-index">
    <div :style="state.emStyle">
      <router-view v-slot="{ Component }">
        <keep-alive>
          <component :is="Component" v-if="$route.meta.keepAlive"></component>
        </keep-alive>
        <component :is="Component" v-if="!$route.meta.keepAlive"></component>
      </router-view>
    </div>
  </div>
</template>
<script>
import { defineComponent, nextTick, onMounted, reactive, ref } from 'vue'
// import { _setFontSize } from '@/components/screen/useEm.js'
export default defineComponent({
  setup() {
    const fullWidth = ref(1920)
    const state = reactive({
      emStyle: {
        width: fullWidth.value + 'px',
        // height: '1080px'
      }
    })
    const setFontSize = () => {
      if (document.body.offsetWidth) {
        const res = document.body.offsetWidth / fullWidth.value
        let style = { ...state.emStyle }
        style['transform'] = `scale(${res})`
        style['transformOrigin'] = 'left top'
        state.emStyle = style
      }
    }
    onMounted(() => {
      setFontSize()
      addEventListener('resize', () => {
        nextTick(() => {
          setFontSize()
        })
      })
    })
    return {
      fullWidth,
      state,
    }
  }
})
</script>
<style lang="scss" scoped>
.screen-index {
  min-height: 100vh;
  background: #00114f;
  overflow-x: hidden;
  overflow-y: auto;
}
</style>
