<template>
  <div class="user-select-box">
    <el-avatar :src="circleUrl" />
    <el-dropdown>
      <span class="el-dropdown-link">
        {{ userName }}
        <!-- <el-icon class="el-icon--right">
          <arrow-down />
        </el-icon> -->
      </span>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item>Action 1</el-dropdown-item>
          <el-dropdown-item>Action 1</el-dropdown-item>
          <el-dropdown-item>Action 2</el-dropdown-item>
          <el-dropdown-item>Action 3</el-dropdown-item>
          <el-dropdown-item disabled>Action 4</el-dropdown-item>
          <el-dropdown-item divided @click="outLogin">{{$t("navbar.logOut")}}</el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </div>
</template>

<script setup>

import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
// import { ArrowDown } from '@element-plus/icons-vue'
const router = useRouter() 
const store = useStore()
const userName = ref(store.getters.name)
const circleUrl = ref(store.getters.avatar)

const outLogin = async() => {
  // removeToken()
  await store.dispatch('user/logout')
  router.push({name: 'login'})
}
</script>

<style lang="scss" scoped>
.user-select-box {
  display: flex;
  justify-content: center;
  align-items: center;
}
.el-dropdown-link {
  margin-left: 10px;
  font-size: 14px;
  cursor: pointer;
  color: #ffffff;
  display: flex;
  align-items: center;
}
</style>