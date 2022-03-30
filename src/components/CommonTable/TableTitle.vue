<template>
  <div class="layout-title" :class="{ 'small-size': smallSize }">
    <div :id="idAttr" class="title">{{ title }}</div>
    <div
      v-if="showRightText"
      class="right-text"
      :class="{ 'right-active': isUp }"
      @click="toggleBox"
      >{{ rightText }}
      <!-- <img :src="require('@/assets/tableicon/down-icon.svg')" alt="" /> -->
    </div>
  </div>
</template>

<script>
export default {
  name: 'TableTitle',
  props: {
    title: {
      type: String,
      default: '数据接入申请',
    },
    idAttr: {
      type: String,
    },
    showRightText: {
      type: Boolean,
      default: false,
    },
    smallSize: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      rightText: '收起',
      isUp: false,
    };
  },
  methods: {
    toggleBox() {
      this.rightText = this.rightText == '收起' ? '展开' : '收起';
      this.isUp = !this.isUp;
      if (this.isUp) {
        this.$emit('close');
      } else {
        this.$emit('open');
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.layout-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  &.small-size {
    .title {
      border-left: 3px solid #0160c0;
      font-weight: 500;
    }
  }
  // width: 100%;
  .title {
    font-size: 16px;
    padding-left: 4px;
    border-left: 4px solid #0160c0;
    font-weight: bold;
  }
  .right-text {
    font-size: 14px;
    color: #606266;
    cursor: pointer;
    margin-right: 24px;
    &.right-active {
      img {
        transform: rotate(0);
      }
    }
    img {
      margin-left: 6px;
      transition: all 0.25s;
      transform: rotate(180deg);
    }
  }
}
</style>
