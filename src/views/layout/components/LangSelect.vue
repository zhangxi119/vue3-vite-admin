<template>
  <div class="lang-box">
    <el-dropdown @command="changeLang">
      <el-icon :size="24" class="lang-icon">
        <set-up/>
      </el-icon>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item :disabled="localLang === 'zh'" command="zh">中文</el-dropdown-item>
          <el-dropdown-item :disabled="localLang === 'en'" command="en">English</el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </div>
</template>

<script setup>

import { ref, reactive, computed, getCurrentInstance } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { SetUp } from '@element-plus/icons-vue'
// import i18n from '@/i18n'
const router = useRouter() 
const store = useStore()
const { ctx } = getCurrentInstance()
const localLang = computed(() => store.getters.language)
const changeLang = async(type) => {
  console.log(ctx.$te);
  ctx.$i18n.locale = type
  store.dispatch('app/setLanguage', type)
  ElMessage({
    showClose: true,
    message: '语言切换成功',
    type: 'success',
  })
}
</script>

<style lang="scss" scoped>
.lang-icon {
  margin-right: 10px;
  color: #ffffff;
}
</style>