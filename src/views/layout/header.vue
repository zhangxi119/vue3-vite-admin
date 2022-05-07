<template>
  <div class="main-header">
    <span>LOGO</span>
    <div class="user-box">
      <el-avatar :src="circleUrl" />
      <el-dropdown>
        <span class="el-dropdown-link">
          {{ userName }}
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
import { removeToken } from '@/utils/auth.js'
const router = useRouter() 
const store = useStore()
const userName = ref(store.getters.name)
const circleUrl = ref(store.getters.avatar)

const outLogin = () => {
  removeToken()
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
