import { ref, getCurrentInstance } from 'vue'
import { useRoute, useRouter } from 'vue-router'
export function getMenuList(params) {
  const route = useRoute()
  const router = useRouter()
  console.log(router)
  console.log(route)
  const { ctx, proxy }  = getCurrentInstance()
  const routers = proxy.$router.getRoutes()
  const list = []
  return {
    list
  }
}