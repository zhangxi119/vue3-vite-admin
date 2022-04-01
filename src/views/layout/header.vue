<template>
  <div class="main-header">
    <span>LOGO</span>
    <div class="user-box">
      <el-avatar :src="circleUrl" />
      <el-dropdown>
        <span class="el-dropdown-link">
          {{ userInfo.userName }}
          <el-icon class="el-icon--right">
            <arrow-down />
          </el-icon>
        </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item @click="outLogin">退出登录</el-dropdown-item>
            <el-dropdown-item>Action 1</el-dropdown-item>
            <el-dropdown-item>Action 2</el-dropdown-item>
            <el-dropdown-item>Action 3</el-dropdown-item>
            <el-dropdown-item disabled>Action 4</el-dropdown-item>
            <el-dropdown-item divided>Action 5</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>
<script setup>

import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
const router = useRouter() 
const store = useStore()
const userInfo = store.getters.GET_USER_INFO
const circleUrl = ref('https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png')

const outLogin = () => {
  sessionStorage.removeItem('token')
  router.push({name: 'login'})
}
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
    span {
      margin-left: 10px;
      font-size: 16px;
      cursor: pointer;
    }
  }
}
</style>
