

<template>
  <div>
    <h1>深克隆</h1>
    <button type="button" @click="count++">count is: {{ count }}</button>
    <!-- <DatePicker></DatePicker> -->
    <elInput></elInput>
  </div>
</template>
<script>
  import { input } from 'element-plus'
  import { defineComponent, ref, toRef, onMounted } from 'vue'
  export default defineComponent({
    props: {
      msg: String
    },
    components: {
      // DatePicker
      elInput: input
    },
    setup(props) {
      const count = ref(0)
      const temp = {
        a: 1,
        b: 'str',
        c: {key: 'value'},
        d: () => {},
      }
      const b = {
        aa: '1',
        bb: temp
      }
      temp.e = b
      // 深拷贝函数
      const deepClone = (obj, cache = new WeakMap()) => {
        if (typeof obj !== 'object') return obj
        if (obj === null) return obj
        if (obj instanceof Date) return new Date(obj)
        if (obj instanceof RegExp) return new RegExp(obj)
        if (cache.get(obj)) return cache.get(obj)

        let cloneObj = new obj.constructor()
        cache.set(obj, cloneObj)
        console.log(cache)
        for (let key in obj) {
          if (obj.hasOwnProperty(key)) {
            cloneObj[key] = deepClone(obj[key], cache)
          }
        }
        return cloneObj
      }

      onMounted(() => {
        console.log(temp)
        let newObj = deepClone(temp)
        console.log(deepClone(newObj))
      })
      return {
        count,
      }
    }
  })
</script>
<style scoped>

</style>
