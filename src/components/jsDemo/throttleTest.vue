<template>
  <div style="height: 2000px;">
    <div>{{ msg }}: {{ readersNumber }} {{ book.title }}</div>
    <button type="button" @click="count++">count is: {{ count }}</button>
  </div>
</template>

<script>
  import { ref, reactive, defineComponent, onMounted } from 'vue'

  export default defineComponent( {
    props: {
      msg: String
    },
    setup(props) {
      const readersNumber = ref(0)
      const count = ref(0)
      const book = reactive({ title: 'Vue 3 Guide' })
      const throttle = (fn, delay) => {
        let last = 0
        return function(...args) {
          const now = Date.now()
          if (now - last > delay) {
            last = now
            fn.apply(this, args)
          }
        }
      }
      onMounted(() => {
        console.log('start-----------')
        const task = () => {
          console.log('run task')
        }
        const throttleTask = throttle(task, 1000)
        window.addEventListener('scroll', throttleTask)
      })
      // 暴露给 template
      return {
        readersNumber,
        book,
        count,
        throttle,
      }
    }
  })
</script>