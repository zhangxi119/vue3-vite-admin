<template>
  <div class="test-main">
    <div class="text">admin权限测试页</div>
  </div>
</template>

<script setup>
import { reactive, ref, watch, onMounted } from 'vue'

onMounted(() => {
  function test1() {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        let temp = {name: 'await'}
        resolve(temp)
      }, 3000);
    })
  }
  const test = async () => {
    const { name } = await test1()
    console.log(name, '-------name');
  }
  test()
  console.log(1);
})

</script>
<style lang="scss" scoped>
.test-main {
  display: flex;
  align-items: center;
  justify-content: center;
  .text {
    width: 300px;
  }
}
</style>