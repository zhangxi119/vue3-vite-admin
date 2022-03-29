<template>
  <div style="height: 200px;">
    <div>{{ msg }}: {{ readersNumber }} {{ book.title }}</div>
    <button type="button" @click="count++">count is: {{ count }}</button>
  </div>
</template>

<script>
  import { ref, reactive, defineComponent, onMounted } from 'vue'

  export default defineComponent( {
    props: {
      msg: {
        type: String,
        default: 'aaa',
      }
    },
    setup(props) {
      const readersNumber = ref(0)
      const count = ref(0)
      const book = reactive({ title: 'Vue 3 Guide' })
      const debounce = (fn, delay) => {
        let timer
        return function(...args) {
          if (timer) {
            clearTimeout(timer)
          }
          timer = setTimeout(() => {
            fn.apply(this, args)
          }, delay)
        }
      }
      onMounted(() => {
        console.log(props.msg)
        const task = () => {
          console.log('111')
        }
        const debounceTask = debounce(task, 1000)
        console.log(debounceTask)
        window.addEventListener('scroll', debounceTask)
      })
      // 暴露给 template
      return {
        readersNumber,
        book,
        count,
        debounce,
      }
    }
  })
</script>