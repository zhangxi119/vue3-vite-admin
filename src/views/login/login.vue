<template>
  <div class="login-main">
    <el-form
      label-position="right"
      label-width="100px"
      :model="form"
      :rules="rules"
      style="max-width: 800px"
      ref="ruleFormRef"
    >
      <el-form-item :label="$t('login.username')" prop="user">
        <el-input v-model="form.user" placeholder="请输入用户名" />
      </el-form-item>
      <el-form-item :label="$t('login.password')" prop="password">
        <el-input type="password" v-model="form.password" placeholder="请输入密码" />
      </el-form-item>
      <el-form-item>
        <el-button v-loading="loading" type="primary" @click="submitForm(ruleFormRef)">登录</el-button>
        <el-button @click="resetForm(ruleFormRef)">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { getUserInfo, getUserInfoTest } from '@/api/index.js'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex';
const router = useRouter()
const store = useStore()
const ruleFormRef = ref()
let loading = ref(false)
const form = reactive({
  user: '',
  password: '',
})
const rules = reactive({
  user: [
    {
      required: true,
      message: '请输入用户名',
      trigger: 'change',
    },
  ],
  password: [
    {
      required: true,
      message: '请输入密码',
      trigger: 'change',
    },
  ]
})
const submitForm = async (formEl) => {
  if (!formEl) return
  await formEl.validate(async (valid) => {
    if (valid) {
      loading = true
      const params = {
        user: form.user,
        password: form.password
      }
      const { data, code } = await getUserInfo(params)
      if (code === 0 && data.token) {
        loading = false
        ElMessage({
          showClose: true,
          message: '登录成功',
          type: 'success',
        })
        store.commit('SET_USER_INFO', {userName: form.user, token: data.token})
        sessionStorage.setItem('token', data.token)
        router.push({name: 'index'})
      } else {
        loading = false
        ElMessage({
          showClose: true,
          message: '登录失败',
          type: 'warning',
        })
        sessionStorage.removeItem('token')
      }
    } else {
      return false
    }
  })
}
const resetForm = (formEl) => {
  if (!formEl) return
  formEl.resetFields()
}
</script>
<style lang="scss" scoped>
.login-main {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>