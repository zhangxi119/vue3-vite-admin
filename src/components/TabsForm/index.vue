<template>
  <div class="tabs-form">
    <i
      v-show="!showForm && showIcon"
      class="el-icon-arrow-down"
      @click="toggleShowForm"
    ></i>
    <i
      v-show="showForm && showIcon"
      class="el-icon-arrow-up"
      @click="toggleShowForm"
    ></i>
    <ul class="tab-list">
      <li
        v-for="item in tabList"
        :key="item.id"
        class="tab-item"
        :class="{ active: currentTab == item.id }"
        @click="tabClick(item.id)"
        >{{ item.tabName }}</li
      >
    </ul>
    <div
      v-for="item in tabList"
      v-show="showForm"
      :key="item.id"
      class="slot-content"
    >
      <slot :name="item.slotName" :currentTab="currentTab"></slot>
    </div>
    <div v-show="showForm" class="slot-content">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TabsForm',
  props: {
    tabList: {
      type: Array,
      default() {
        return [];
      },
    },
  },
  data() {
    return {
      currentTab: '',
      showForm: true,
      showIcon: true,
    };
  },
  watch: {
    tabList: {
      deep: true,
      immediate: true,
      handler(val) {
        if (val.length) {
          this.currentTab = val[0].id;
        }
      },
    },
    currentTab: {
      immediate: true,
      handler(newVal) {
        const tabItem = this.tabList.find(el => el.id == newVal);
        this.showIcon = tabItem.showIcon;
      },
    },
  },
  methods: {
    tabClick(id) {
      if (id == this.currentTab) return;
      this.currentTab = id;
      this.showForm = true;
      this.$emit('tab-change', id);
      // 这里需要改变传的参数
    },
    toggleShowForm() {
      this.showForm = !this.showForm;
    },
  },
};
</script>

<style lang="scss" scoped>
.tabs-form {
  position: relative;
  width: 100%;
  background: #fff;
  border-radius: 4px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.06);
  i {
    position: absolute;
    right: 14px;
    top: 13px;
    font-size: 24px;
    color: #cfcfcf;
    cursor: pointer;
  }
  .tab-list {
    display: flex;
    align-items: center;
    width: 100%;
    box-sizing: border-box;
    padding: 0 16px;
    border-bottom: 1px solid rgba(0, 0, 0, 0.06);
    .tab-item {
      font-size: 14px;
      color: #303133;
      font-weight: 400;
      padding: 15px 15px 13px;
      border-bottom: 2px solid transparent;
      cursor: pointer;
      margin-right: 16px;
      position: relative;
      top: 1px;
      &.active {
        border-bottom-color: #0160c0;
        color: #0160c0;
        font-weight: 600;
      }
    }
  }
  .slot-content {
    width: 100%;
    :deep .el-form-item__label {
      font-size: 13px;
      color: #303133;
      letter-spacing: 0;
      text-align: right;
      // line-height: 13px;
      font-weight: 400;
    }
    :deep .el-input__inner {
      height: 32px;
      line-height: 32px;
    }
  }
}
</style>
