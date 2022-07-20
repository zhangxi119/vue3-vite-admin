<template>
  <div class="main-app">
    <router-view v-slot="{ Component }">
      <keep-alive>
        <component :is="Component" v-if="$route.meta.keepAlive"></component>
      </keep-alive>
      <component :is="Component" v-if="!$route.meta.keepAlive"></component>
    </router-view>
  </div>
</template>
<script>
import { defineComponent, onMounted, ref, nextTick  } from 'vue'
export default defineComponent({
  name: 'app',
  setup() {
    onMounted(() => {
    })
    return {
    }
  }
})
</script>

<style>
html,body,#app,.main-app {
  width: 100%;
  height: 100%;
}
</style>
