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
        <el-button :loading="loading" type="primary" @click="submitForm(ruleFormRef)">登录</el-button>
        <el-button @click="resetForm(ruleFormRef)">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script lang="ts" setup>
import { reactive, ref, watch } from 'vue'
import { login } from '@/api'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex';
import type { FormRules } from 'element-plus'
const { push, currentRoute } = useRouter()
const { dispatch } = useStore()
const ruleFormRef = ref<HTMLElement | null>(null)
const loading = ref<boolean>(false)
// 重定向地址
let redirect = ref(undefined)
// 重定向参数
let otherQuery = ref({})
const form = reactive({
  user: 'admin',
  password: '123',
})
const rules = reactive<FormRules>({
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

// 登录
const submitForm = async (formEl) => {
  if (!formEl) return
  await formEl.validate(async (valid) => {
    if (valid) {
      loading.value = true
      const params = {
        userName: form.user,
        password: form.password
      }
      dispatch('user/login', params).then(res => {
        push({path: redirect || '/', query: otherQuery})
        loading.value = false
      }).catch((err) => {
        ElMessage({
          showClose: true,
          message: err,
          type: 'warning',
        })
        loading.value = false
      })
    } else {
      console.log('error submit!!')
      return false
    }
  })
}
// 重置
const resetForm = (formEl) => {
  if (!formEl) return
  formEl.resetFields()
}
// 获取路由参数
const getOtherQuery = (query) => {
  return Object.keys(query).reduce((acc, cur) => {
    if (cur != 'redirect') {
      acc[cur] = query[cur]
    }
    return acc
  }, {})
}
// 监听路由，获取重定向地址
watch(() => currentRoute.value, (toPath) => {
  if (toPath.query) {
    redirect = toPath.query.redirect
    otherQuery = getOtherQuery(toPath.query)
  }
},{ immediate: true, deep: true })

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