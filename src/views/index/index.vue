

<template>
  <div>
      <h1>各类功能测试</h1>
      <div>
        <router-link to="debounceTest">防抖 </router-link>
        <router-link to="throttleTest">节流 </router-link>
        <router-link to="deepClone">克隆 </router-link>
      </div>
  </div>
</template>
<script>
  // import { ref } from 'vue'
  // defineProps<{ msg: string }>()
  // const count = ref(0)
  import { defineComponent, ref, toRef } from 'vue'
  export default defineComponent({
    props: {
      msg: String
    },
    setup(props) {
      const count = ref(0)
      return {
        count,
      }
    }
  })
</script>
<style scoped>
a {
  color: #42b983;
}

label {
  margin: 0 0.5em;
  font-weight: bold;
}

code {
  background-color: #eee;
  padding: 2px 4px;
  border-radius: 4px;
  color: #304455;
}
</style>
