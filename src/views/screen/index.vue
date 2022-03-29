

<template>
  <div style="width: 100%;height: 100%;background: #324057;">
      
  </div>
</template>
<script>
  // import { ref } from 'vue'
  // defineProps<{ msg: string }>()
  // const count = ref(0)
  import { defineComponent, ref, toRef, onMounted } from 'vue'
  import { queryKnowledge } from '@/api/index.js'
  export default defineComponent({
    setup(props) {
      onMounted(() => {
        const res = queryKnowledge()
      })
    }
  })
</script>
<style lang="scss" scoped>
</style>
