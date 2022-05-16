<template>
  <div class="main-header">
    <span>LOGO</span>
    <div class="user-box">
      <LangSelect id="lang-container" />
      <UserSelect id="user-container" />
    </div>
  </div>
</template>
<script setup>
import UserSelect from './components/UserSelect.vue'
import LangSelect from './components/LangSelect.vue'

</script>

<style lang="scss" scoped>
.main-header {
  width: 100%;
  height: 100%;
  padding: 0 40px 0 50px;
  box-sizing: border-box;
  background: #324057;
  display: flex;
  align-items: center;
  justify-content: space-between;
  span {
    color: #ffffff;
    font-size: 24px;
  }
  .user-box {
    height: 40px;
    display: flex;
    align-items: center;
  }
}
</style>
