

<template>
  <div>
      <button type="button" @click="count++">count is: {{ count }}</button>
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
