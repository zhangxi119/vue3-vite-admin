<template>
  <div class="dashboard-container">
    <component :is="currentRole" />
  </div>
</template>

<script>
import { defineComponent, ref, computed } from 'vue'
import { useStore } from 'vuex'
import adminDashboard from './admin/index.vue'
import editorDashboard from './editor/index.vue'

export default defineComponent({
  name: 'Dashboard',
  components: {
    adminDashboard,
    editorDashboard
  },
  setup(props) {
    let currentRole = ref('adminDashboard')
    const store = useStore()
    const roles = store.getters.roles
    if (!roles.includes('admin')) {
      currentRole = 'editorDashboard'
    }
    return {
      currentRole,
    }
  }
})
// export default {
//   name: 'Dashboard',
//   components: { adminDashboard, editorDashboard },
//   data() {
//     return {
//       currentRole: 'adminDashboard'
//     }
//   },
//   computed: {
//     ...mapGetters([
//       'roles'
//     ])
//   },
//   created() {
//     if (!this.roles.includes('admin')) {
//       this.currentRole = 'editorDashboard'
//     }
//   }
// }
</script>
