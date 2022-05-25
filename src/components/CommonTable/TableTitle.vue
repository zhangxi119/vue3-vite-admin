<template>
  <div class="layout-title" :class="{ 'small-size': props.smallSize }">
    <div :id="props.idAttr" class="title">{{ props.title }}</div>
    <div
      v-if="props.showRightText"
      class="right-text"
      :class="{ 'right-active': state.isUp }"
      @click="toggleBox"
      >{{ state.rightText }}
      <!-- <img :src="require('@/assets/tableicon/down-icon.svg')" alt="" /> -->
    </div>
  </div>
</template>

<script setup>
import { toRefs, defineProps, reactive, defineEmits } from 'vue'

const props = defineProps({
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
})

const state = reactive({
  rightText: '收起',
  isUp: false,
})

const emit = defineEmits()

function toggleBox() {
  state.rightText = state.rightText == '收起' ? '展开' : '收起';
  state.isUp = !state.isUp;
  if (this.isUp) {
    emit('close');
  } else {
    emit('open');
  }
}

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
